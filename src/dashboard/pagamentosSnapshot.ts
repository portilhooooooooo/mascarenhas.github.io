/** Contrato único de Resultados > Pagamentos.
 * API v2 compacta no backend. Fallback temporário para a API atual até o deploy.
 */
export type PaymentRow = {
 id:string; pasta:string; credenciado?:string|null; situacao?:string|null;
 valor?:number|null; data_pagamento?:string|null; data_aprovacao?:string|null;
};
export type StageId = 'aprovacao'|'aberto'|'liquidado'|'interrompido';
export const STAGES: Array<{id:StageId; title:string; statuses:string[]}> = [
 {id:'aprovacao',title:'Aprovação',statuses:['Em aprovação (Valores)','Em aprovação (Técnica)']},
 {id:'aberto',title:'Aguardando',statuses:['Em aberto','Aguardando pagamento','Aprovado (Valores)']},
 {id:'liquidado',title:'Liquidados',statuses:['Liquidado']},
 {id:'interrompido',title:'Cancelados',statuses:['Pagamento cancelado','Cancelado (Valores)','Recusado (Valores)','Recusado (Técnica)']},
];
export type Snapshot = {
 version:number;source:{import_id:string;updated_at?:string|null}|null;
 cards:{total:number;paid:number;approval:number;no_receipt:number|null;ticket_median:number|null};
 stages:Record<StageId,{total:number;rows:PaymentRow[]}>;
 monthly:{period:string;total:number;firms:Array<{credenciado:string;quantidade:number}>};
 filters:{offices:string[];situations:string[]};
 types:null;
};
type Api = {request:<T>(path:string,options?:RequestInit)=>Promise<T>};
type Environment = Window & {MBA_API?:Api;MBA_AUTOMATION_API?:Api};
type Listing = {rows:PaymentRow[];total:number;total_pages:number;page:number};
type Overview = {cards?:{quantidade_pagamentos?:number;ticket_medio?:number|null};filters?:{credenciados?:string[];situacoes?:string[]};importacao?:{id:string;completed_at?:string|null}};
const api=()=>{
 const value=(window as Environment).MBA_API||(window as Environment).MBA_AUTOMATION_API;
 if(!value)throw Error('API indisponível.');
 return value;
};
export const paymentParams=(office:string,situation:string,more:Record<string,string>={})=>{
 const p=new URLSearchParams(more);
 if(office)p.set('credenciado',office);
 if(situation)p.set('situacao',situation);
 return p;
};
export async function paymentList(office:string,situation:string,page=1,limit=25,signal?:AbortSignal,extra:Record<string,string>={}):Promise<Listing>{
 const params=paymentParams(office,situation,{page:String(page),page_size:String(limit),...extra});
 const result=await api().request<Listing>('/api/pagamentos?'+params,{signal});
 if(!result||!Array.isArray(result.rows)||!Number.isInteger(result.total)||result.total<0)throw Error('Lista de pagamentos inválida.');
 return result;
}
function monthPeriod(){
 const now=new Date();
 const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'America/Campo_Grande',year:'numeric',month:'2-digit'}).formatToParts(now);
 const year=Number(parts.find(p=>p.type==='year')?.value||now.getFullYear());
 const month=Number(parts.find(p=>p.type==='month')?.value||now.getMonth()+1);
 const pad=(v:number)=>String(v).padStart(2,'0');
 const start=year+'-'+pad(month)+'-01';
 const end=month===12?(year+1)+'-01-01':year+'-'+pad(month+1)+'-01';
 return {start,end,period:start.slice(0,7)};
}
const statusInStage=(stage:typeof STAGES[number],selected:string)=>stage.statuses.filter(s=>!selected||selected===s);
async function fallback(office:string,situation:string,signal?:AbortSignal):Promise<Snapshot>{
 const period=monthPeriod();
 const [overview, options]=await Promise.all([
   api().request<Overview>('/api/pagamentos/resumo?'+paymentParams(office,situation),{signal}),
   api().request<Overview>('/api/pagamentos/resumo',{signal}),
 ]);
 if(!overview?.cards)throw Error('Resumo de pagamentos inválido.');
 const [all, ...stages]=await Promise.all([
   paymentList(office,situation,1,1,signal),
   ...STAGES.map(async stage=>{
     const statuses=statusInStage(stage,situation);
     const pages=await Promise.all(statuses.map(s=>paymentList(office,s,1,4,signal)));
     return {total:pages.reduce((n,r)=>n+r.total,0),rows:pages.flatMap(r=>r.rows).slice(0,4)};
   }),
 ]);
 const stageMap={} as Snapshot['stages'];
 STAGES.forEach((stage,index)=>stageMap[stage.id]=stages[index]);
 let monthly:Snapshot['monthly']={period:period.period,total:0,firms:[]};
 if(!situation||situation==='Liquidado'){
   const extra={data_inicio:period.start,data_fim:new Date(Date.UTC(Number(period.end.slice(0,4)),Number(period.end.slice(5,7))-1,0)).toISOString().slice(0,10)};
   const initial=await paymentList(office,'Liquidado',1,200,signal,extra);
   if(initial.total>5000)throw Error('A consulta mensal exige agregação no servidor.');
   const rows=[...initial.rows];
   for(let page=2;rows.length<initial.total;page++){
     const next=await paymentList(office,'Liquidado',page,200,signal,extra);
     if(next.total!==initial.total||!next.rows.length)throw Error('Importação alterada durante a consulta.');
     rows.push(...next.rows);
   }
   const counts=new Map<string,number>();
   for(const row of rows){
     const name=row.credenciado?.trim()||'Não identificado';
     counts.set(name,(counts.get(name)||0)+1);
   }
   monthly={period:period.period,total:rows.length,firms:[...counts].map(([credenciado,quantidade])=>({credenciado,quantidade})).sort((a,b)=>b.quantidade-a.quantidade||a.credenciado.localeCompare(b.credenciado,'pt-BR'))};
 }
 return {
   version:1,source:overview.importacao?{import_id:overview.importacao.id,updated_at:overview.importacao.completed_at}:null,
   cards:{total:all.total,paid:Number(overview.cards.quantidade_pagamentos||0),approval:stageMap.aprovacao.total,no_receipt:null,ticket_median:overview.cards.ticket_medio??null},
   stages:stageMap,monthly,
   filters:{offices:options.filters?.credenciados||[],situations:options.filters?.situacoes||[]},
   types:null,
 };
}
export async function paymentSnapshot(office:string,situation:string,signal?:AbortSignal):Promise<Snapshot>{
 try{
   const data=await api().request<Snapshot>('/api/resultados/pagamentos?'+paymentParams(office,situation),{signal});
   if(data?.version!==2||!data.cards||!data.stages||!data.monthly||!data.filters)throw Error('Snapshot inválido.');
   return data;
 }catch(error){
   // Compatibilidade apenas durante o rollout do backend. Outros erros são exibidos.
   const typed=error as Error & {status?:number};
   if(typed?.status!==404)return Promise.reject(error);
   return fallback(office,situation,signal);
 }
}
