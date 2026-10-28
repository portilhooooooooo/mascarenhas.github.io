import {useEffect, useState} from 'react';
import {useQueries, useQuery} from '@tanstack/react-query';
import {ArrowUpRight, CheckCircle2, ChevronLeft, ChevronRight, Clock3, FileWarning, ReceiptText, X} from 'lucide-react';
import {runtimeQueries, runtimeScope} from '../tasks/runtimeQueries';

type Payment = {
  id:string; pasta:string; credenciado?:string|null; situacao?:string|null;
  valor?:number|null; data_pagamento?:string|null; data_aprovacao?:string|null;
};
type Listing = {rows:Payment[];total:number;page:number;total_pages:number};
type Api = {request:<T>(path:string,options?:RequestInit)=>Promise<T>};
type WindowApi = Window & {MBA_API?:Api;MBA_AUTOMATION_API?:Api};
type Stage = {id:string;title:string;statuses:readonly string[];tone:string;icon:typeof Clock3};
type Preview = {total:number;rows:Payment[]};
const STAGES:readonly Stage[] = [
  {id:'aprovacao',title:'Aprovação pendente',statuses:['Em aprovação (Valores)','Em aprovação (Técnica)'],tone:'amber',icon:Clock3},
  {id:'aberto',title:'Em aberto / Aguardando',statuses:['Em aberto','Aguardando pagamento','Aprovado (Valores)'],tone:'blue',icon:ReceiptText},
  {id:'liquidado',title:'Liquidados',statuses:['Liquidado'],tone:'green',icon:CheckCircle2},
  {id:'interrompido',title:'Cancelados / Recusados',statuses:['Pagamento cancelado','Cancelado (Valores)','Recusado (Valores)','Recusado (Técnica)'],tone:'slate',icon:FileWarning},
];
const number=(v?:number|null)=>v===undefined||v===null?'—':new Intl.NumberFormat('pt-BR').format(v);
const money=(v?:number|null)=>v===undefined||v===null?'—':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(v));
const date=(v?:string|null)=>v?v.slice(0,10).split('-').reverse().join('/'):null;
function api(){
  const client=(window as WindowApi).MBA_API||(window as WindowApi).MBA_AUTOMATION_API;
  if(!client)throw Error('API de pagamentos indisponível.');
  return client;
}
async function readPayments(office:string,status:string,page:number,limit:number,signal?:AbortSignal):Promise<Listing>{
  const params=new URLSearchParams({situacao:status,page:String(page),page_size:String(limit)});
  if(office)params.set('credenciado',office);
  const data=await api().request<Listing>('/api/pagamentos?'+params,{signal});
  if(!data||!Array.isArray(data.rows)||!Number.isInteger(data.total))throw Error('Dados de pagamentos inválidos.');
  return data;
}
async function readStage(stage:Stage,office:string,situation:string,signal?:AbortSignal):Promise<Preview>{
  const statuses=stage.statuses.filter(value=>!situation||situation===value);
  if(!statuses.length)return {total:0,rows:[]};
  // O conjunto é paginado no backend. Nunca carregar toda a base para montar o quadro.
  const result=await Promise.all(statuses.map(status=>readPayments(office,status,1,3,signal)));
  const rows=result.flatMap(chunk=>chunk.rows);
  return {total:result.reduce((sum,chunk)=>sum+chunk.total,0),rows:rows.slice(0,4)};
}
export function PagamentosKanban({visible,office,situation,disabled}:{visible:boolean;office:string;situation:string;disabled:boolean}){
  const scope=runtimeScope();
  const [opened,setOpened]=useState<string|null>(null);
  const [status,setStatus]=useState('');
  const [page,setPage]=useState(1);
  const active=visible&&!disabled;
  const queries=useQueries({queries:STAGES.map(stage=>({
    queryKey:['runtime-v2',scope,'pagamentos-kanban',office,situation,stage.id],
    enabled:active,staleTime:45000,gcTime:300000,refetchOnWindowFocus:false,retry:false,
    queryFn:({signal}:{signal:AbortSignal})=>readStage(stage,office,situation,signal),
  }))},runtimeQueries);
  const stage=STAGES.find(item=>item.id===opened);
  const displayedStatuses=stage?.statuses.filter(value=>!situation||situation===value)||[];
  const detail=useQuery({
    queryKey:['runtime-v2',scope,'pagamentos-kanban-list',office,situation,opened,status,page],
    enabled:active&&!!stage&&!!status,
    queryFn:({signal})=>readPayments(office,status,page,25,signal),
  },runtimeQueries);
  useEffect(()=>{setOpened(null);setPage(1);setStatus('')},[office,situation]);
  useEffect(()=>{
    if(!opened)return;
    const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setOpened(null)};
    window.addEventListener('keydown',close);
    return()=>window.removeEventListener('keydown',close);
  },[opened]);
  function openStage(id:string,preference?:string|null){
    const found=STAGES.find(item=>item.id===id);
    if(!found)return;
    const available=found.statuses.filter(value=>!situation||situation===value);
    setStatus(preference&&available.includes(preference)?preference:available[0]||'');
    setPage(1);setOpened(id);
  }
  const unsupported=!!situation&&!STAGES.some(item=>item.statuses.includes(situation));
  return <section className="payments-results-board" aria-label="Kanban de pagamentos por situação">
    <header className="payments-results-board-head">
      <div><h2>Fluxo de pagamentos</h2><span>Visão por situação · registros da base vigente</span></div>
      <span className="payments-results-board-mode">Quadro de consulta</span>
    </header>
    {disabled?<p className="payments-results-muted">A natureza Acordo/Condenação ainda não está disponível na fonte.</p>
      :unsupported?<p className="payments-results-muted">Esta situação não integra as quatro etapas do quadro. Utilize os filtros e a quantidade total para consultar os registros.</p>
      :<div className="payments-results-board-grid">
      {STAGES.map((item,index)=>{
        const result=queries[index];
        const Icon=item.icon;
        return <article className="payments-results-stage" key={item.id}>
          <header className="payments-results-stage-head">
            <div className="payments-results-stage-name"><span className={'payments-results-stage-icon '+item.tone}><Icon size={14}/></span><h3>{item.title}</h3></div>
            <span className="payments-results-stage-total">{number(result.data?.total)}</span>
          </header>
          <div className="payments-results-stage-items">
            {result.isPending&&active?<p className="payments-results-stage-state">Carregando registros…</p>:null}
            {result.error?<p role="alert" className="payments-results-stage-state payments-results-error">Falha na consulta.<button type="button" onClick={()=>void result.refetch()}>Tentar novamente</button></p>:null}
            {!result.isPending&&!result.error&&!result.data?.rows.length?<p className="payments-results-stage-state">Nenhum pagamento nesta etapa.</p>:null}
            {result.data?.rows.map(row=><button className="payments-results-payment" key={row.id} type="button" onClick={()=>openStage(item.id,row.situacao)}>
              <span className="payments-results-payment-top"><span className="payments-results-payment-ref">{row.pasta||'Pasta não informada'}</span><ArrowUpRight size={13}/></span>
              <strong>{money(row.valor)}</strong>
              <span className="payments-results-payment-office" title={row.credenciado||''}>{row.credenciado||'Escritório não informado'}</span>
              <span className="payments-results-payment-bottom"><span className={'payments-results-payment-status '+item.tone}>{row.situacao||'Sem situação'}</span><small>{row.data_pagamento?'Pago '+date(row.data_pagamento):row.data_aprovacao?'Aprov. '+date(row.data_aprovacao):'—'}</small></span>
            </button>)}
          </div>
          <footer><button type="button" disabled={disabled||!active||!result.data?.total} onClick={()=>openStage(item.id)}>
            Ver registros <ChevronRight size={13}/>
          </button></footer>
        </article>;
      })}
    </div>}
    {!disabled&&!unsupported?<p className="payments-results-board-caption">As colunas exibem uma prévia dos registros; os totais consideram todos os pagamentos das respectivas situações. Outros estados podem ser consultados pelo filtro Situação.</p>:null}
    {opened&&stage&&active?<div className="payments-results-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setOpened(null)}}>
      <section className="payments-results-dialog" role="dialog" aria-modal="true" aria-label={'Pagamentos: '+stage.title}>
        <header><div><h2>{stage.title}</h2><span>{office||'Todos os escritórios'}</span></div><button type="button" aria-label="Fechar" onClick={()=>setOpened(null)}><X size={18}/></button></header>
        <div className="payments-results-board-dialogbar"><label>Situação <select value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}>
          {displayedStatuses.map(value=><option value={value} key={value}>{value}</option>)}
        </select></label></div>
        <div className="payments-results-tablewrap"><table><thead><tr><th>Pasta</th><th>Escritório</th><th>Situação</th><th>Valor</th><th>Data do pagamento</th></tr></thead><tbody>
          {detail.data?.rows.map(row=><tr key={row.id}><td>{row.pasta||'—'}</td><td>{row.credenciado||'—'}</td><td>{row.situacao||'—'}</td><td>{money(row.valor)}</td><td>{date(row.data_pagamento)||'—'}</td></tr>)}
        </tbody></table>
          {detail.isPending?<p className="payments-results-muted">Carregando registros…</p>:null}
          {detail.error?<p role="alert" className="payments-results-error">Não foi possível consultar os pagamentos.</p>:null}
          {!detail.isPending&&!detail.error&&detail.data?.rows.length===0?<p className="payments-results-muted">Nenhum pagamento encontrado.</p>:null}
        </div>
        <footer><span>{number(detail.data?.total)} registros</span><div>
          <button type="button" disabled={page<=1||detail.isFetching} onClick={()=>setPage(v=>Math.max(1,v-1))}><ChevronLeft size={14}/> Anterior</button>
          <span>{page} / {Math.max(1,detail.data?.total_pages||1)}</span>
          <button type="button" disabled={page>=(detail.data?.total_pages||1)||detail.isFetching} onClick={()=>setPage(v=>v+1)}>Próxima <ChevronRight size={14}/></button>
        </div></footer>
      </section>
    </div>:null}
  </section>;
}
