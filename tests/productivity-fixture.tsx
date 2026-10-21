import React from 'react';
import { createRoot } from 'react-dom/client';
import { TaskResults } from '../src/tasks/TaskResults';
const today = new Intl.DateTimeFormat('sv-SE',{timeZone:'America/Campo_Grande',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
const uid='11111111-1111-4111-8111-111111111111';
const taskId='22222222-2222-4222-8222-222222222222';
const rows=[
{id:'a',process_id:'33333333-3333-4333-8333-333333333331',task_id:taskId,cnj:'5000001-00.2026.8.21.0001',user_id:uid,person:'Analista Teste',type:'encerramento',result:'apto',raw_decision:'apto',at:new Date().toISOString(),day:today,seconds:60,status:'completed'},
{id:'b',process_id:'33333333-3333-4333-8333-333333333332',task_id:taskId,cnj:'5000002-00.2026.8.21.0002',user_id:uid,person:'Analista Teste',type:'encerramento',result:'inapto',raw_decision:'nao_apto',at:new Date().toISOString(),day:today,seconds:180,status:'completed'},
{id:'c',process_id:'33333333-3333-4333-8333-333333333333',task_id:taskId,cnj:'5000003-00.2026.8.21.0003',user_id:uid,person:'Analista Teste',type:'liminar',result:'nao_classificado',raw_decision:'deferida',at:new Date().toISOString(),day:today,seconds:null,status:'completed'},
];
const pending=[{...rows[0],id:'d',process_id:'33333333-3333-4333-8333-333333333334',status:'pending',result:'pendente',seconds:null},
{...rows[1],id:'e',process_id:'33333333-3333-4333-8333-333333333335',status:'pending',result:'pendente',seconds:null}];
const byType=(arr:any[],module:string)=>module==='all'?arr:arr.filter(row=>row.type===module);
const api=async (path:string):Promise<any>=>{
const parsed=new URL(path,'http://localhost');const kind=parsed.searchParams.get('kind')||'analyses';
const module=parsed.searchParams.get('module')||'all';
const start=parsed.searchParams.get('start_day')||parsed.searchParams.get('end_day');
const end=parsed.searchParams.get('end_day')||parsed.searchParams.get('start_day');
const completed=byType(rows,module).filter(row=>(!start||row.day>=start)&&(!end||row.day<=end));
const pendings=byType(pending,module);
const apt=completed.filter(r=>r.result==='apto').length;
const inapt=completed.filter(r=>r.result==='inapto').length;
const timed=completed.filter(r=>r.seconds!==null);
if(parsed.pathname.endsWith('/overview')){
await new Promise(resolve=>setTimeout(resolve,300));
return {summary:{analyses:completed.length,apt,inapt,unclassified:completed.length-apt-inapt,pending:pendings.length,
 median_seconds:timed.length?120:null,measured:timed.length},
 people:[{id:uid,name:'Analista Teste',analyses:completed.length,apt,inapt,pending:pendings.length,median_seconds:120,measured:timed.length}],
 daily:completed.length?[{day:today,user_id:uid,person:'Analista Teste',analyses:completed.length,apt,inapt,measured:timed.length}]:[],
 pending_as_of:new Date().toISOString(),generated_at:new Date().toISOString(),truncated:false};
}
let selected=kind==='pending'?pendings:completed;
if(kind==='apt')selected=selected.filter(r=>r.result==='apto');
if(kind==='inapt')selected=selected.filter(r=>r.result==='inapto');
if(kind==='time')selected=selected.filter(r=>r.seconds!==null);
const day=parsed.searchParams.get('day');
if(day&&kind!=='pending')selected=selected.filter(r=>r.day===day);
if(parsed.pathname.endsWith('/details'))return {kind,rows:selected,total:selected.length,page:1,has_more:false,truncated:false,pending_as_of:new Date().toISOString()};
if(parsed.pathname.endsWith('/export'))return {filename:'produtividade.csv',content_base64:btoa('CNJ;Colaborador\n5000001;Analista Teste\n')};
throw Error('Unexpected route '+path);
};
(window as any).MBA_NAVIGATE=(route:string)=>{(window as any).__navigated=route;return true;};
createRoot(document.getElementById('root')!).render(<TaskResults api={api} visible canViewOthers userId={uid}/>);
