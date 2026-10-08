import { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { TasksApp } from '../src/tasks/TasksApp';
import { ControladoriaPage } from '../src/dashboard/ControladoriaPage';
import '../src/dashboard/protocolos.css';
import '../src/dashboard/controladoria.css';
import '../src/dashboard/defesas.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-500.css';
import '@fontsource/inter/latin-600.css';
import '@fontsource/inter/latin-700.css';
import '../src/dashboard/shell.css';
import '../src/dashboard/ui-architecture.css';
import './preview.css';
import '../src/dashboard/refined.css';
import { Layers3, ClipboardList, PanelsTopLeft, RotateCcw } from 'lucide-react';
import { SelectMenu } from '../src/dashboard/SelectMenu';

// Isolated demonstration. This entry never imports config, auth, or the live API.
const defaultTasks = [
  {id:'demo-closing',type:'encerramento',title:'Análise de encerramentos',description:'Conferência dos indícios de encerramento',priority:'high',status:'pending',total_processes:10,completed_processes:0,updated_at:'2026-10-08T15:00:00Z'},
  {id:'demo-liminar',type:'liminar',title:'Validação de liminares',priority:'high',status:'pending',total_processes:8,completed_processes:1,responsible_name:'Equipe operacional'},
  {id:'demo-defesa',type:'defesa',title:'Análise de defesas',source:'automation',priority:'medium',status:'pending',total_processes:6,completed_processes:0,deadline_at:'2026-10-15T16:00:00-04:00'},
];
const stateFixture = new URLSearchParams(location.search).get('fixture') === 'states';
const scenario = new URLSearchParams(location.search).get('scenario') || '';
const scenarioTasks = [
  {id:'demo-payment',type:'comprovante_pagamento',title:'Conferência de pagamentos',priority:'medium',status:'pending',total_processes:6,completed_processes:0},
  {id:'demo-collection',type:'protocolo',title:'Documentos para protocolo',priority:'medium',status:'pending',total_processes:6,completed_processes:0},
  {id:'demo-agreement',type:'acordos',title:'Saneamento de acordos',priority:'medium',status:'pending',total_processes:6,completed_processes:0},
];
const selectedScenario = [...defaultTasks,...scenarioTasks].find(task => task.type === scenario);
const tasks = selectedScenario ? [{...selectedScenario,total_processes:24,completed_processes:0}] : defaultTasks;
const processes = (id:string) => Array.from({length:selectedScenario?24:id==='demo-closing'?10:id==='demo-liminar'?7:6},(_,i)=>({id:`${id}-${i}`,task_id:id,case_number:`${String(i+1).padStart(7,'0')}-00.2026.8.${id==='demo-liminar'?'26':'21'}.0000`,party_name:'Parte demonstrativa',folder:`DEMO / ${1032+i}`,provision_amount:2500,status:stateFixture && i===1?'completed':stateFixture && i===2?'error':'pending',priority:stateFixture?(i===3?'altissima':'baixa'):undefined,position:i,indicio:id==='demo-closing'?'Derrota voluntária':id==='demo-liminar'?'Liminar deferida — conferir decisão':id==='demo-defesa'?'Divergência de prazo — conferir evidências':'Conferência operacional pendente',source:id==='demo-defesa'?'talisman_contestacao':'demo',source_metadata:{fatal_deadline:'2026-10-15',operational_deadline:'2026-10-10',responsible:'Equipe de Controladoria',routing_status:i%3===0?'human_review':i%3===1?'saneado':'aguardando'}}));
const items = [
  ['HUMAN_NECESSARY','RETRY_EXHAUSTED','Conferir o estado na Enter antes de repetir o envio',false],
  ['SEM_DOCUMENTOS','DOCUMENT_INTAKE','',false],
  ['RUNNING','DOCUMENT_ATTACH','',false],
  ['DOCUMENTOS_ENVIADOS','ERP_CONFIRMATION','',false],
  ['PENDING','DOCUMENTS_MATCHED','',false],
  ['DONE','RECONCILED','',false],
  ['HUMAN_NECESSARY','TASK_OPEN_FAILED','Não foi possível abrir a tarefa',true],
].map(([status,stage,human_reason,retry_allowed],i)=>({id:`demo-protocol-${i}`,cnj:`DEMO ${String(i+1).padStart(4,'0')} · Protocolo`,task_id:'demo-task',task_url:'',status,stage,human_reason,retry_allowed,updated_at:'2026-10-03T20:30:00Z'}));
const records = new Map(tasks.map(task => [task.id, processes(task.id)]));
const request = async (path:string,options?:RequestInit) => {
  if(path.endsWith('/next-agreement')) return {agreement:records.get('demo-agreement')?.find(row=>row.status!=='completed') || null};
  if(options?.method && options.method !== 'GET') {
    const match = path.match(/^\/api\/task-processes\/([^/]+)\/(.+)$/);
    if(match) {
      const record = [...records.values()].flat().find(row => row.id === match[1]);
      if(!record) throw new Error('Processo demonstrativo não encontrado.');
      if(match[2] !== 'skip') record.status = 'completed';
      return {...record};
    }
    throw new Error('Esta prévia permite analisar processos demonstrativos. Importações e alterações de atribuições ficam disponíveis no ambiente conectado.');
  }
  if(path.split('?')[0] === '/api/tasks') return tasks;
  if(path.startsWith('/api/task-assignees')) return [{id:'demo-user',name:'Analista demonstrativo'}];
  const task = path.match(/^\/api\/tasks\/([^/]+)\/processes$/);
  if(task) return records.get(task[1]) || [];
  if(path === '/api/protocolo/summary') return {session:{state:'idle'},automatic_active:false,controladoria:null,documents:null,statuses:{HUMAN_NECESSARY:2,SEM_DOCUMENTOS:1,RUNNING:1,DOCUMENTOS_ENVIADOS:1,PENDING:1,DONE:1}};
  if(path.startsWith('/api/protocolo/items')) return {rows:items};
  return [];
};
Object.assign(window,{MBA_NAVIGATE:(route:string)=>{ location.hash='/'+route; window.dispatchEvent(new Event('mba:route-changed')); return true; },MBA_CURRENT_USER:{id:'demo-user',is_master_admin:true,permissions:{'tasks.view':true,'tasks.manage':true,'automations.view':true,'automations.run':false}},MBA_API:{request},MBA_AUTOMATION_API:{request,fetch:async()=>{throw new Error('Exportação desativada nesta prévia.');}}});
function Preview(){
  const [page,setPage]=useState<'tasks'|'control'>('tasks');
  useEffect(()=> {
    const sync=()=>window.dispatchEvent(new Event('mba:route-changed'));
    window.addEventListener('hashchange',sync);
    return ()=>window.removeEventListener('hashchange',sync);
  },[]);
  useEffect(()=> {
    const context=(document as Document & {modelContext?:{registerTool:(tool:unknown,options:unknown)=>unknown}}).modelContext;
    if(!context?.registerTool) return;
    const lifecycle=new AbortController();
    Promise.resolve(context.registerTool({name:'open_workspace_view',description:'Abre Tarefas ou Controladoria na prévia demonstrativa do MBA Backoffice.',inputSchema:{type:'object',properties:{view:{type:'string',enum:['tasks','control']}},required:['view'],additionalProperties:false},annotations:{readOnlyHint:false},execute:async(input:unknown)=>{const view=(input as {view?:string})?.view;if(view!=='tasks'&&view!=='control') throw new Error('Visão inválida');setPage(view);await new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve)));return {view};}},{signal:lifecycle.signal})).catch(()=>{});
    return ()=>lifecycle.abort();
  },[]);
  return <>
    <header className="demo-navbar">
      <a href="#/tarefas" className="demo-brand" onClick={()=>setPage('tasks')}><b>MBA</b><span>Backoffice</span></a>
      <nav aria-label="Navegação principal">
        <button aria-current={page==='tasks'?'page':undefined} onClick={()=>setPage('tasks')}><ClipboardList size={17}/>Tarefas</button>
        <button aria-current={page==='control'?'page':undefined} onClick={()=>setPage('control')}><PanelsTopLeft size={17}/>Controladoria</button>
      </nav>
      <div className="demo-identity"><span className="demo-profile">GP</span><span>Gabriel Portilho<small>Workspace de demonstração</small></span></div>
    </header>
    <div className="demo-context"><div className="demo-portfolio"><Layers3 size={18}/><span>Agibank <span className="context-divider">/</span> Enter</span></div><div className="demo-context-right"><span className="demo-preview-label">Prévia interativa · dados fictícios</span><button aria-label="Reiniciar demonstração" title="Reiniciar demonstração" onClick={()=>location.reload()}><RotateCcw size={15}/></button></div></div>
    <div className="demo-scenario-bar"><SelectMenu label="Fluxo da prévia" value={scenario} onChange={value=>{location.search=value?'?scenario='+value:'';}} options={[{value:'',label:'Fila geral'},{value:'encerramento',label:'Encerramentos'},{value:'liminar',label:'Liminar'},{value:'defesa',label:'Defesa'},{value:'comprovante_pagamento',label:'Comprovante de pagamento'},{value:'protocolo',label:'Coleta de documentos'},{value:'acordos',label:'Acordos'}]}/><span>As respostas ficam somente nesta sessão.</span></div>
    <div id="tarefas" data-react-tasks="true" className={page==='tasks'?'active':''} hidden={page!=='tasks'}><TasksApp/></div>
    {page==='control'?<div className="demo-control"><ControladoriaPage/></div>:null}
  </>;
}
createRoot(document.getElementById('root')!).render(<Preview/>);
