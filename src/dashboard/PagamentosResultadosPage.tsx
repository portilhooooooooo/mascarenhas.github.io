import {useEffect, useMemo, useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {ArrowUpRight, CheckCircle2, Clock3, FileX2, ListFilter, ReceiptText, Wallet, X} from 'lucide-react';
import {runtimeQueries, runtimeScope} from '../tasks/runtimeQueries';
import {PagamentosKanban} from './PagamentosKanban';
import './pagamentosResultados.css';

type Payment = {
  id: string; pasta: string; credenciado?: string|null; solicitante?: string|null;
  situacao?: string|null; tipo_pagamento?: string|null; valor?: number|null;
  data_pagamento?: string|null; data_aprovacao?: string|null;
};
type Listing = {rows: Payment[]; total:number; page:number; total_pages:number};
type Overview = {
  cards?: {quantidade_pagamentos?:number; ticket_medio?:number|null; total_pago?:number|null};
  filters?: {credenciados?:string[]; situacoes?:string[]};
  paid_statuses_configurados?:string[];
};
type Api = {request:<T>(route:string,opts?:RequestInit)=>Promise<T>;getPortfolioId?:()=>string};
type Environment = Window & {MBA_API?:Api;MBA_AUTOMATION_API?:Api;MBA_CURRENT_USER?:{is_master_admin?:boolean;permissions?:Record<string,boolean>}};
type Detail = 'total'|'paid'|'approval'|null;
const currency = (v?:number|null) => v == null || !Number.isFinite(Number(v)) ? '—' : new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL',maximumFractionDigits:2}).format(Number(v));
const number = (v?:number|null) => v == null || !Number.isFinite(Number(v)) ? '—' : new Intl.NumberFormat('pt-BR').format(Number(v));
const monthRange=()=>{
  const now=new Date(), y=now.getFullYear(), m=now.getMonth();
  const fmt=(d:Date)=>[d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');
  return {start:fmt(new Date(y,m,1)),end:fmt(new Date(y,m+1,0)),label:new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(now)};
};
function api():Api {
  const client=(window as Environment).MBA_API || (window as Environment).MBA_AUTOMATION_API;
  if(!client)throw new Error('API de pagamentos indisponível.');
  return client;
}
function queryParams(office:string,situation:string,extra:Record<string,string>={}){
  const p=new URLSearchParams(extra);
  if(office)p.set('credenciado',office);
  if(situation)p.set('situacao',situation);
  return p;
}
async function list(office:string,situation:string,page=1,pageSize=25,extra:Record<string,string>={},signal?:AbortSignal):Promise<Listing> {
  const p=queryParams(office,situation,{...extra,page:String(page),page_size:String(pageSize)});
  const payload=await api().request<Listing>('/api/pagamentos?'+p.toString(),{signal});
  if(!payload||!Array.isArray(payload.rows)||!Number.isInteger(payload.total))throw Error('Relação de pagamentos inválida.');
  return payload;
}
async function monthlyLiquidated(office:string,situation:string,signal?:AbortSignal){
  if(situation && situation!=='Liquidado')return [] as {office:string;count:number}[];
  const range=monthRange(), perPage=200;
  const extra={data_inicio:range.start,data_fim:range.end};
  const initial=await list(office,'Liquidado',1,perPage,extra,signal);
  // Do not expose an incomplete ranking if the data volume exceeds safe browser pagination.
  if(initial.total>5000)throw Error('Volume mensal elevado: agregação no servidor necessária.');
  const all=[...initial.rows];
  for(let page=2;all.length<initial.total;page++){
    if(signal?.aborted)throw new DOMException('Interrompido','AbortError');
    const next=await list(office,'Liquidado',page,perPage,extra,signal);
    if(next.total!==initial.total||!next.rows.length)throw Error('Os pagamentos mudaram durante a consulta mensal.');
    all.push(...next.rows);
  }
  if(all.length!==initial.total)throw Error('A contagem mensal está incompleta.');
  const firms=new Map<string,number>();
  for(const row of all) {
    const name=row.credenciado?.trim()||'Não identificado';
    firms.set(name,(firms.get(name)||0)+1);
  }
  return [...firms].map(([name,count])=>({office:name,count})).sort((a,b)=>b.count-a.count||a.office.localeCompare(b.office,'pt-BR'));
}
const approvalSituations=['Em aprovação (Valores)','Em aprovação (Técnica)'];
const detailTitle:Record<Exclude<Detail,null>,string>={total:'Quantidade de pagamentos',paid:'Pagamentos liquidados',approval:'Necessário aprovação'};

export function PagamentosResultadosPage({visible}:{visible:boolean}) {
  const scope=runtimeScope();
  const user=(window as Environment).MBA_CURRENT_USER;
  // Cross-office imported financial records must not be unlocked by a portfolio selector alone.
  const allowed=Boolean(user?.is_master_admin&&user?.permissions?.['dashboard.view']&&user?.permissions?.['pagamentos.view']);
  const [office,setOffice]=useState('');
  const [situation,setSituation]=useState('');
  const [kind,setKind]=useState<'todos'|'acordo'|'condenacao'>('todos');
  const [detail,setDetail]=useState<Detail>(null);
  const [approvalTab,setApprovalTab]=useState(approvalSituations[0]);
  const [page,setPage]=useState(1);
  const period=useMemo(monthRange,[]);
  const active=visible&&allowed&&kind==='todos';
  const baseKey=['runtime-v2',scope,'payments-results',office,situation,kind];
  const overview=useQuery({
    queryKey:[...baseKey,'overview'],enabled:active,
    queryFn:async({signal})=>{
      const response=await api().request<Overview>('/api/pagamentos/resumo?'+queryParams(office,situation).toString(),{signal});
      if(!response || !response.cards)throw Error('Resumo de pagamentos inválido.');
      return response;
    }},runtimeQueries);
  const options=useQuery({
    queryKey:['runtime-v2',scope,'payments-results-options'],enabled:visible&&allowed,
    queryFn:async({signal})=>{
      const [offices,statuses]=await Promise.all([
        api().request<{rows:string[]}>('/api/pagamentos/credenciados',{signal}),
        api().request<{rows:string[]}>('/api/pagamentos/situacoes',{signal}),
      ]);
      return {offices:Array.isArray(offices.rows)?offices.rows:[],statuses:Array.isArray(statuses.rows)?statuses.rows:[]};
    }},runtimeQueries);
  const total=useQuery({
    queryKey:[...baseKey,'total'],enabled:active,
    queryFn:async({signal})=>(await list(office,situation,1,1,{},signal)).total
  },runtimeQueries);
  const approval=useQuery({
    queryKey:[...baseKey,'approvals'],enabled:active,
    queryFn:async({signal})=>{
      const statuses=situation?(approvalSituations.includes(situation)?[situation]:[]):approvalSituations;
      return (await Promise.all(statuses.map(s=>list(office,s,1,1,{},signal)))).reduce((sum,part)=>sum+part.total,0);
    }},runtimeQueries);
  const month=useQuery({
    queryKey:[...baseKey,'month',period.start],enabled:active,
    queryFn:({signal})=>monthlyLiquidated(office,situation,signal)
  },runtimeQueries);
  const detailRows=useQuery({
    queryKey:[...baseKey,'detail',detail,page,approvalTab],enabled:active&&detail!==null,
    queryFn:({signal})=>{
      const status=detail==='paid'?'Liquidado':detail==='approval'?(approvalSituations.includes(situation)?situation:approvalTab):situation;
      return list(office,status,page,25,{},signal);
    }},runtimeQueries);
  useEffect(()=>setPage(1),[office,situation,detail]);
  useEffect(()=>{
    if(!detail)return;
    const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setDetail(null)};
    window.addEventListener('keydown',close);
    return ()=>window.removeEventListener('keydown',close);
  },[detail]);
  if(!allowed)return <section className="payments-results"><p className="payments-results-muted">Esta visão financeira consolidada exige acesso administrativo a Pagamentos e Resultados.</p></section>;
  const typed=kind!=='todos';
  const busy=active&&(overview.isPending||total.isPending||approval.isPending);
  const cards=[
    {key:'total' as Detail,title:'Quantidade de pagamentos',value:number(typed?null:total.data),hint:'Registros da base',icon:ReceiptText,click:true},
    {key:'paid' as Detail,title:'Pagos',value:number(typed?null:overview.data?.cards?.quantidade_pagamentos),hint:'Situação liquidada',icon:CheckCircle2,click:true},
    {key:null,title:'Sem comprovante',value:'—',hint:'Conciliação Benner pendente',icon:FileX2,click:false},
    {key:'approval' as Detail,title:'Necessário aprovação',value:number(typed?null:approval.data),hint:'Valores e técnica',icon:Clock3,click:true},
    {key:'paid' as Detail,title:'Ticket médio',value:currency(typed?null:overview.data?.cards?.ticket_medio),hint:'Mediana dos liquidados',icon:Wallet,click:true},
  ];
  return <section className="payments-results" aria-label="Resultados de pagamentos">
    <header className="payments-results-top">
      <div><span className="payments-results-eyebrow">RESULTADOS · PAGAMENTOS</span><h1>Pagamentos</h1></div>
      <span className="payments-results-period">{period.label}</span>
    </header>
    <div className="payments-results-filters">
      <label>Escritório<select value={office} onChange={e=>{setOffice(e.target.value);setDetail(null)}} aria-label="Filtrar escritório">
        <option value="">Todos os escritórios</option>
        {(options.data?.offices||[]).map(name=><option key={name} value={name}>{name}</option>)}
      </select></label>
      <label>Situação<select value={situation} onChange={e=>{setSituation(e.target.value);setDetail(null)}} aria-label="Filtrar situação">
        <option value="">Todas as situações</option>
        {(options.data?.statuses||[]).map(status=><option key={status} value={status}>{status}</option>)}
      </select></label>
      <label>Tipo<select value={kind} onChange={e=>{setKind(e.target.value as typeof kind);setDetail(null)}} aria-label="Filtrar tipo">
        <option value="todos">Todos</option><option value="acordo">Acordo</option><option value="condenacao">Condenação</option>
      </select></label>
      <span className="payments-results-filter-icon"><ListFilter size={17}/></span>
    </div>
    {typed?<p role="status" className="payments-results-note">A fonte atual distingue Pagamento e Depósito, mas não classifica Acordo e Condenação. Não há números confiáveis para o tipo selecionado.</p>:null}
    {active && (overview.error||total.error||approval.error)&&<p className="payments-results-error" role="alert">Não foi possível consultar os indicadores. <button onClick={()=>{void overview.refetch();void total.refetch();void approval.refetch()}}>Tentar novamente</button></p>}
    <div className="payments-results-kpis">
      {cards.map(({key,title,value,hint,icon:Icon,click})=><button type="button" key={title} className="payments-results-kpi mba-metric-card" disabled={!click||typed||busy||(key==='paid'&&!!situation&&situation!=='Liquidado')||(key==='approval'&&!!situation&&!approvalSituations.includes(situation))} onClick={()=>{if(key){setDetail(key);setPage(1)}}} aria-label={title+': '+value}>
        <span className="payments-results-kpi-title">{title}<Icon size={15}/></span>
        <strong>{busy?'…':value}</strong><small>{hint}</small>
      </button>)}
    </div>
    <PagamentosKanban visible={active} office={office} situation={situation} disabled={typed}/>
    <div className="payments-results-lower">
      <section className="payments-results-panel">
        <div className="payments-results-panel-heading"><div><h2>Credenciados</h2><span>Pagamentos liquidados · {period.label}</span></div><strong>{typed?'—':number(month.data?.reduce((acc,row)=>acc+row.count,0))}</strong></div>
        {month.error&&!typed?<p className="payments-results-error" role="alert">{(month.error as Error).message}</p>:null}
        <div className="payments-results-firms">
          {!typed&&month.isPending?<p className="payments-results-muted">Consultando pagamentos do mês…</p>:null}
          {!typed&&!month.isPending&&!month.data?.length?<p className="payments-results-muted">Nenhum liquidado para os filtros selecionados.</p>:null}
          {!typed&&month.data?.map(({office:name,count},index)=><button key={name} className="payments-results-firm" type="button" disabled={name==='Não identificado'} onClick={()=>{setOffice(name);setDetail(null)}}>
            <span className="payments-results-rank">{String(index+1).padStart(2,'0')}</span><span className="payments-results-firm-name">{name}</span><strong>{number(count)}</strong><ArrowUpRight size={13}/>
          </button>)}
        </div>
      </section>
      <section className="payments-results-panel">
        <div className="payments-results-panel-heading"><div><h2>Acordos vs. Condenação</h2><span>Distribuição por natureza</span></div></div>
        <div className="payments-results-comparison">
          <div><span>Acordos</span><strong>—</strong></div>
          <div><span>Condenação</span><strong>—</strong></div>
        </div>
        <p className="payments-results-muted">Classificação indisponível na fonte de pagamentos. Não estimamos essa divisão.</p>
      </section>
    </div>
    {detail&&active?<div className="payments-results-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setDetail(null)}}>
      <section className="payments-results-dialog" role="dialog" aria-modal="true" aria-label={detailTitle[detail]}>
        <header><div><h2>{detailTitle[detail]}</h2><span>{office||'Todos os escritórios'} · {situation||'Todas as situações'}</span></div><button type="button" aria-label="Fechar" onClick={()=>setDetail(null)}><X size={18}/></button></header>
        {detail==='approval'&&!situation?<div className="payments-results-approval-tabs">{approvalSituations.map(item=><button type="button" key={item} aria-pressed={approvalTab===item} onClick={()=>{setApprovalTab(item);setPage(1)}}>{item}</button>)}</div>:null}
        <div className="payments-results-tablewrap"><table><thead><tr><th>Pasta</th><th>Escritório</th><th>Situação</th><th>Valor</th><th>Pagamento</th></tr></thead><tbody>
          {detailRows.data?.rows.map(row=><tr key={row.id}><td>{row.pasta}</td><td>{row.credenciado||'—'}</td><td>{row.situacao||'—'}</td><td>{currency(row.valor)}</td><td>{row.data_pagamento?row.data_pagamento.split('-').reverse().join('/'):'—'}</td></tr>)}
        </tbody></table>{detailRows.isPending?<p className="payments-results-muted">Carregando registros…</p>:null}{detailRows.error?<p className="payments-results-error">{(detailRows.error as Error).message}</p>:null}{!detailRows.isPending&&!detailRows.data?.rows.length?<p className="payments-results-muted">Nenhum registro encontrado.</p>:null}</div>
        <footer><span>{number(detailRows.data?.total)} registros</span><div><button disabled={page===1||detailRows.isFetching} onClick={()=>setPage(p=>Math.max(1,p-1))}>Anterior</button><span>{page} / {Math.max(1,detailRows.data?.total_pages||1)}</span><button disabled={page>=(detailRows.data?.total_pages||1)||detailRows.isFetching} onClick={()=>setPage(p=>p+1)}>Próxima</button></div></footer>
      </section>
    </div>:null}
  </section>;
}
