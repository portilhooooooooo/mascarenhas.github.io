import {useEffect,useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {CalendarDays,CheckCircle2,Clock3,FileX2,ReceiptText,Wallet,X} from 'lucide-react';
import {runtimeQueries,runtimeScope} from '../tasks/runtimeQueries';
import {paymentList,paymentSnapshot,type Snapshot} from './pagamentosSnapshot';
import {PagamentosTypePie} from './PagamentosTypePie';
import './pagamentosResultados.css';

type Environment=Window&{MBA_CURRENT_USER?:{id?:string;is_master_admin?:boolean;permissions?:Record<string,boolean>};MBA_API?:{getPortfolioId?:()=>string}};
type Detail='total'|'paid'|'approval'|'retification'|null;
const amount=(n?:number|null)=>n===null||n===undefined?'—':new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(Number(n));
const count=(n?:number|null)=>n===null||n===undefined?'—':new Intl.NumberFormat('pt-BR').format(n);
const formatDate=(s?:string|null)=>s?s.slice(0,10).split('-').reverse().join('/'):'—';
const month=(period?:string)=>{
 if(!period)return 'Mês atual';
 if(period.includes(' até '))return period.split(' até ').map(value=>value?value.split('-').reverse().join('/'):'…').join(' a ');
 const [y,m]=period.split('-').map(Number);
 if(!y||!m)return 'Mês atual';
 return new Intl.DateTimeFormat('pt-BR',{month:'long',year:'numeric'}).format(new Date(y,m-1,1));
};
const approvalStates=['Em aprovação (Valores)','Em aprovação (Técnica)'];
export function PagamentosResultadosPage({visible}:{visible:boolean}){
 const user=(window as Environment).MBA_CURRENT_USER;
 const byancaRegular=user?.id==='bbe93618-a630-4d2b-8c21-c3c2e6ec4b7e'&&(window as Environment).MBA_API?.getPortfolioId?.()==='agibank_mba';
 const allowed=Boolean(user?.permissions?.['dashboard.view']&&(user?.is_master_admin&&user?.permissions?.['pagamentos.view']||byancaRegular));
 const scope=runtimeScope();
 const [office,setOffice]=useState('');
 const [situation,setSituation]=useState('');
 const [dateStart,setDateStart]=useState('');
 const [dateEnd,setDateEnd]=useState('');
 const dates=dateStart||dateEnd?{...(dateStart?{data_inicio:dateStart}:{}),...(dateEnd?{data_fim:dateEnd}:{})}:{};
 const invalidDates=Boolean(dateStart&&dateEnd&&dateStart>dateEnd);
 const [detail,setDetail]=useState<Detail>(null);
 const [approvalState,setApprovalState]=useState(approvalStates[0]);
 const [page,setPage]=useState(1);
 const [firmPage,setFirmPage]=useState(1);
 const [periodOpen,setPeriodOpen]=useState(false);
 const [draftStart,setDraftStart]=useState('');
 const [draftEnd,setDraftEnd]=useState('');
 const enabled=visible&&allowed;
 const snapshot=useQuery({
   queryKey:['runtime-v2',scope,'pagamentos-results-v2',office,situation,dateStart,dateEnd],
   enabled:enabled&&!invalidDates,staleTime:45000,gcTime:300000,refetchOnWindowFocus:false,retry:false,
   queryFn:({signal})=>paymentSnapshot(office,situation,signal,dates),
 },runtimeQueries);
 const data=snapshot.data;
 const listing=useQuery({
   queryKey:['runtime-v2',scope,'pagamentos-results-detail',office,situation,dateStart,dateEnd,detail,approvalState,page],
   enabled:enabled&&!invalidDates&&!!detail,
   staleTime:45000,retry:false,refetchOnWindowFocus:false,
   queryFn:({signal})=>paymentList(office,detail==='paid'?'Liquidado':detail==='approval'?(approvalStates.includes(situation)?situation:approvalState):detail==='retification'?'Em retificação':situation,page,25,signal,dates),
 },runtimeQueries);
 useEffect(()=>{setDetail(null);setPage(1);setFirmPage(1)},[office,situation,dateStart,dateEnd]);
 useEffect(()=>{
   if(!detail)return;
   const handle=(event:KeyboardEvent)=>{if(event.key==='Escape')setDetail(null)};
   window.addEventListener('keydown',handle);
   return()=>window.removeEventListener('keydown',handle);
 },[detail]);
 const cards=[
   {title:'Pagamentos',value:count(data?.cards.total),kind:'total' as Detail,icon:ReceiptText,subtitle:'Registros no período'},
   {title:'Liquidados',value:count(data?.cards.paid),kind:'paid' as Detail,icon:CheckCircle2,subtitle:'Pagamentos concluídos'},
   {title:'Em retificação',value:count(data?.cards.retification),kind:'retification' as Detail,icon:FileX2,subtitle:'Aguardando correção'},
   {title:'Em aprovação',value:count(data?.cards.approval),kind:'approval' as Detail,icon:Clock3,subtitle:'Aguardando aprovação'},
   {title:'Ticket médio',value:amount(data?.cards.ticket_median),kind:'paid' as Detail,icon:Wallet,subtitle:'Mediana dos liquidados'},
 ];
 if(!allowed)return <div className="payments-results"><p role="alert" className="payments-results-error">Acesso financeiro restrito.</p></div>;
 return <section className="payments-results" aria-label="Resultados de pagamentos">
   <div className="base-geral-filters payments-results-filters-standard" aria-label="Filtros de pagamentos">
     <label className="base-geral-filter"><span>Escritório</span>
       <select aria-label="Escritório" value={office} onChange={e=>setOffice(e.target.value)}>
         <option value="">Todos</option>
         {(data?.filters.offices||[]).map(item=><option key={item} value={item}>{item}</option>)}
       </select>
     </label>
     <label className="base-geral-filter"><span>Situação</span>
       <select aria-label="Situação" value={situation} onChange={e=>setSituation(e.target.value)}>
         <option value="">Todas</option>
         {(data?.filters.situations||[]).map(item=><option key={item} value={item}>{item}</option>)}
       </select>
     </label>
     <label className="base-geral-filter"><span>Tipo</span>
       <select aria-label="Tipo de pagamento" value="todos" onChange={()=>{}}>
         <option value="todos">Todos</option>
         <option value="acordo" disabled>Acordo (indisponível)</option>
         <option value="condenacao" disabled>Condenação (indisponível)</option>
       </select>
     </label>
     <div className="base-geral-filter payments-period-field"><span>Período</span><button type="button" className="payments-period-trigger" aria-expanded={periodOpen} onClick={()=>{setDraftStart(dateStart);setDraftEnd(dateEnd);setPeriodOpen(v=>!v)}}><CalendarDays size={14}/>{dateStart||dateEnd ? `${dateStart?formatDate(dateStart):'Início'} — ${dateEnd?formatDate(dateEnd):'Fim'}` : 'Selecionar intervalo'}</button>
       {periodOpen?<div className="payments-period-popover" role="group" aria-label="Selecionar intervalo de datas"><div className="payments-period-fields"><label>De<input type="date" value={draftStart} onChange={e=>setDraftStart(e.target.value)}/></label><label>Até<input type="date" min={draftStart||undefined} value={draftEnd} onChange={e=>setDraftEnd(e.target.value)}/></label></div><footer><button type="button" onClick={()=>{setDateStart('');setDateEnd('');setPeriodOpen(false)}}>Limpar</button><button type="button" disabled={!!(draftStart&&draftEnd&&draftStart>draftEnd)} onClick={()=>{setDateStart(draftStart);setDateEnd(draftEnd);setPeriodOpen(false)}}>Aplicar</button></footer></div>:null}
     </div>
   </div>
   {invalidDates?<p role="alert" className="payments-results-error">A data final deve ser igual ou posterior à inicial.</p>:null}
   {snapshot.error?<div role="alert" className="payments-results-error">Falha ao consultar pagamentos. <button type="button" onClick={()=>void snapshot.refetch()}>Tentar novamente</button></div>:null}
   <div className="payments-results-kpis">
     {cards.map(({title,value,kind,icon:Icon,subtitle})=>{
       const disabled=snapshot.isPending||(kind==='paid'&&!!situation&&situation!=='Liquidado')||(kind==='approval'&&!!situation&&!approvalStates.includes(situation));
       return <button type="button" key={title} className="payments-results-kpi mba-metric-card" disabled={disabled} onClick={()=>{if(kind){setDetail(kind);setPage(1)}}} aria-label={title+': '+value} title={title==='Em retificação'?'Itens ativos em retificação na operação de pagamentos':''}>
         <span className="payments-results-kpi-title">{title}<Icon size={15} strokeWidth={1.6}/></span>
         <strong>{snapshot.isPending?'…':value}</strong><small>{subtitle}</small>
       </button>;
     })}
   </div>
   <div className="payments-results-lower payments-results-lower--compact">
     <section className="payments-results-panel">
       <header className="payments-results-panel-heading"><h2>Liquidados por escritório <span className="payments-results-month-inline">· {month(data?.monthly.period)}</span></h2><strong>{amount(data?.monthly.total)}</strong></header>
       <div className="payments-results-firms">
         {(data?.monthly.firms||[]).slice((firmPage-1)*5,firmPage*5).map(item=>{
           const max=data?.monthly.firms[0]?.valor||1;
           return <button key={item.credenciado} className="payments-results-firm payments-results-firm--bar" type="button" disabled={item.credenciado==='Não identificado'} onClick={()=>setOffice(item.credenciado)}>
             <span className="payments-results-firm-name">{item.credenciado}</span>
             <span className="payments-results-firm-bar"><span style={{width:Math.round(item.valor/max*100)+'%'}}/></span>
             <strong>{amount(item.valor)}</strong>
           </button>;
         })}
         {!snapshot.isPending&&!data?.monthly.firms.length?<span className="payments-results-minor">Sem liquidações</span>:null}
       </div>
       <footer className="payments-firms-pagination"><button type="button" disabled={firmPage===1} onClick={()=>setFirmPage(p=>p-1)}>Anterior</button><span>{firmPage} / {Math.max(1,Math.ceil((data?.monthly.firms.length||0)/5))}</span><button type="button" disabled={firmPage>=Math.ceil((data?.monthly.firms.length||0)/5)} onClick={()=>setFirmPage(p=>p+1)}>Próxima</button></footer>
     </section>
     <section className="payments-results-panel">
       <header className="payments-results-panel-heading"><h2>Acordo × Condenação</h2></header>
       <PagamentosTypePie types={data?.types}/>
     </section>
   </div>
   {detail&&enabled?<div className="payments-results-backdrop" role="presentation" onMouseDown={e=>{if(e.target===e.currentTarget)setDetail(null)}}>
     <section className="payments-results-dialog" role="dialog" aria-modal="true" aria-label="Detalhamento de pagamentos">
       <header><div><h2>{detail==='total'?'Pagamentos':detail==='paid'?'Liquidados':detail==='retification'?'Em retificação':'Em aprovação'}</h2><span>{office||'Todos os escritórios'}</span></div><button type="button" aria-label="Fechar" onClick={()=>setDetail(null)}><X size={17}/></button></header>
       {detail==='approval'&&!situation?<div className="payments-results-approval-tabs">{approvalStates.map(value=><button type="button" key={value} aria-pressed={approvalState===value} onClick={()=>{setApprovalState(value);setPage(1)}}>{value}</button>)}</div>:null}
       <div className="payments-results-tablewrap"><table><thead><tr><th>Pasta</th><th>Escritório</th><th>Situação</th><th>Valor</th><th>Pagamento</th></tr></thead><tbody>
         {listing.data?.rows.map(row=><tr key={row.id}><td>{row.pasta}</td><td>{row.credenciado||'—'}</td><td>{row.situacao||'—'}</td><td>{amount(row.valor)}</td><td>{formatDate(row.data_pagamento)}</td></tr>)}
       </tbody></table>
       {listing.isPending?<div className="payments-results-minor">Carregando…</div>:null}
       {!listing.isPending&&!listing.data?.rows.length?<div className="payments-results-minor">Sem registros</div>:null}
       {listing.error?<div role="alert" className="payments-results-error">Consulta indisponível.</div>:null}</div>
       <footer><span>{count(listing.data?.total)} registros</span><div><button type="button" disabled={page===1||listing.isFetching} onClick={()=>setPage(v=>v-1)}>Anterior</button><span>{page} / {Math.max(1,listing.data?.total_pages||1)}</span><button type="button" disabled={page>=(listing.data?.total_pages||1)||listing.isFetching} onClick={()=>setPage(v=>v+1)}>Próxima</button></div></footer>
     </section>
   </div>:null}
 </section>;
}