import {useEffect,useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {CheckCircle2,ChevronRight,Clock3,FileWarning,ReceiptText,X} from 'lucide-react';
import {runtimeQueries,runtimeScope} from '../tasks/runtimeQueries';
import {paymentList,STAGES,type PaymentRow,type Snapshot,type StageId} from './pagamentosSnapshot';

const icons={aprovacao:Clock3,aberto:ReceiptText,liquidado:CheckCircle2,interrompido:FileWarning};
const tones={aprovacao:'amber',aberto:'blue',liquidado:'green',interrompido:'slate'};
const number=(n?:number|null)=>n===undefined||n===null?'—':new Intl.NumberFormat('pt-BR').format(n);
const money=(n?:number|null)=>n===undefined||n===null?'—':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n));
const date=(s?:string|null)=>s?s.slice(0,10).split('-').reverse().join('/'):'—';

export function PagamentosKanban({enabled,loading,office,situation,stages}:{
 enabled:boolean;loading:boolean;office:string;situation:string;stages?:Snapshot['stages'];
}){
 const scope=runtimeScope();
 const [selected,setSelected]=useState<StageId|null>(null);
 const [status,setStatus]=useState('');
 const [page,setPage]=useState(1);
 const selectedStage=STAGES.find(stage=>stage.id===selected);
 const availableStatuses=selectedStage?.statuses.filter(value=>!situation||situation===value)||[];
 const detail=useQuery({
   queryKey:['runtime-v2',scope,'pagamentos-stage-detail',office,situation,selected,status,page],
   enabled:enabled&&!!selected&&!!status,
   staleTime:45000,refetchOnWindowFocus:false,retry:false,
   queryFn:({signal})=>paymentList(office,status,page,25,signal),
 },runtimeQueries);
 useEffect(()=>{setSelected(null);setStatus('');setPage(1)},[office,situation]);
 useEffect(()=>{
   if(!selected)return;
   const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setSelected(null)};
   window.addEventListener('keydown',close);
   return()=>window.removeEventListener('keydown',close);
 },[selected]);
 const open=(id:StageId,pref?:string|null)=>{
   const stage=STAGES.find(value=>value.id===id);
   const statuses=stage?.statuses.filter(value=>!situation||situation===value)||[];
   if(!statuses.length)return;
   setSelected(id);
   setStatus(pref&&statuses.includes(pref)?pref:statuses[0]);
   setPage(1);
 };
 return <section className="payments-results-board" aria-label="Pagamentos por situação">
   <div className="payments-results-board-grid">
     {STAGES.map(stage=>{
       const Icon=icons[stage.id],rows=stages?.[stage.id]?.rows||[];
       const total=stages?.[stage.id]?.total;
       return <article className="payments-results-stage" key={stage.id}>
         <header className="payments-results-stage-head">
           <div className="payments-results-stage-name"><span className={'payments-results-stage-icon '+tones[stage.id]}><Icon size={14}/></span><h3>{stage.title}</h3></div>
           <span className="payments-results-stage-total">{loading?'…':number(total)}</span>
         </header>
         <div className="payments-results-stage-items">
           {loading?<div className="payments-results-stage-state">Carregando…</div>:null}
           {!loading&&rows.length===0?<div className="payments-results-stage-state">Sem registros</div>:null}
           {rows.map((row:PaymentRow)=><button key={row.id} className="payments-results-payment" type="button" onClick={()=>open(stage.id,row.situacao)}>
             <span className="payments-results-payment-top"><span className="payments-results-payment-ref" title={row.pasta}>{row.pasta||'—'}</span><ChevronRight size={12}/></span>
             <strong>{money(row.valor)}</strong>
             <span className="payments-results-payment-office">{row.credenciado||'—'}</span>
             <span className="payments-results-payment-bottom"><span className={'payments-results-payment-status '+tones[stage.id]}>{row.situacao||'—'}</span><small>{date(row.data_pagamento)||'—'}</small></span>
           </button>)}
         </div>
         <footer><button type="button" disabled={!enabled||loading||!total||!stage.statuses.some(value=>!situation||value===situation)} onClick={()=>open(stage.id)}>
           Ver todos <ChevronRight size={13}/>
         </button></footer>
       </article>;
     })}
   </div>
   {selected&&selectedStage&&enabled?<div className="payments-results-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setSelected(null)}}>
     <section className="payments-results-dialog" role="dialog" aria-modal="true" aria-label={selectedStage.title}>
       <header><div><h2>{selectedStage.title}</h2><span>{office||'Todos os escritórios'}</span></div><button type="button" aria-label="Fechar" onClick={()=>setSelected(null)}><X size={17}/></button></header>
       <div className="payments-results-board-dialogbar">
         <select aria-label="Situação" value={status} onChange={e=>{setStatus(e.target.value);setPage(1)}}>{availableStatuses.map(item=><option key={item} value={item}>{item}</option>)}</select>
       </div>
       <div className="payments-results-tablewrap"><table><thead><tr><th>Pasta</th><th>Escritório</th><th>Situação</th><th>Valor</th><th>Pagamento</th></tr></thead><tbody>
         {detail.data?.rows.map(row=><tr key={row.id}><td>{row.pasta||'—'}</td><td>{row.credenciado||'—'}</td><td>{row.situacao||'—'}</td><td>{money(row.valor)}</td><td>{date(row.data_pagamento)}</td></tr>)}
       </tbody></table>
       {detail.isPending?<div className="payments-results-minor">Carregando…</div>:null}
       {!detail.isPending&&!detail.data?.rows.length?<div className="payments-results-minor">Sem registros</div>:null}
       {detail.error?<div role="alert" className="payments-results-error">Consulta indisponível.</div>:null}
       </div>
       <footer><span>{number(detail.data?.total)} registros</span><div><button disabled={page<=1||detail.isFetching} onClick={()=>setPage(v=>v-1)}>Anterior</button><span>{page} / {Math.max(1,detail.data?.total_pages||1)}</span><button disabled={page>=(detail.data?.total_pages||1)||detail.isFetching} onClick={()=>setPage(v=>v+1)}>Próxima</button></div></footer>
     </section>
   </div>:null}
 </section>;
}
