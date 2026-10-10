import { useState } from 'react';
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
import './preview.css';

// Isolated demonstration. This entry never imports config, auth, or the live API.
const defaultTasks = [
  {id:'demo-liminar',type:'liminar',title:'Validação de liminares',priority:'high',status:'pending',total_processes:8,completed_processes:1,responsible_name:'Equipe operacional'},
  {id:'demo-defesa',type:'defesa',title:'Análise de defesas',source:'automation',priority:'medium',status:'pending',total_processes:6,completed_processes:0,deadline_at:'2026-10-15T16:00:00-04:00'},
];
const shellFixture = new URLSearchParams(location.search).get('fixture') === 'shell';
const stateFixture = new URLSearchParams(location.search).get('fixture') === 'states';
const scenario = new URLSearchParams(location.search).get('scenario') || '';
const scenarioTasks = [
  {id:'demo-payment',type:'comprovante_pagamento',title:'Conferência de pagamentos',priority:'medium',status:'pending',total_processes:6,completed_processes:0},
  {id:'demo-collection',type:'protocolo',title:'Documentos para protocolo',priority:'medium',status:'pending',total_processes:6,completed_processes:0},
  {id:'demo-agreement',type:'acordos',title:'Saneamento de acordos',priority:'medium',status:'pending',total_processes:6,completed_processes:0},
];
const selectedScenario = [...defaultTasks,...scenarioTasks].find(task => task.type === scenario);
const tasks = selectedScenario ? [{...selectedScenario,total_processes:24,completed_processes:0}] : defaultTasks;
const processes = (id:string) => Array.from({length:selectedScenario?24:id==='demo-liminar'?7:6},(_,i)=>({id:`${id}-${i}`,task_id:id,case_number:`DEMO ${String(i+1).padStart(4,'0')} · ${id==='demo-liminar'?'SP':'RS'}`,party_name:'Parte demonstrativa',folder:'Pasta DEMO 1032',provision_amount:2500,status:stateFixture && i===1?'completed':stateFixture && i===2?'error':'pending',priority:stateFixture?(i===3?'altissima':'baixa'):undefined,position:i,indicio:id==='demo-liminar'?'Liminar deferida — conferir decisão':id==='demo-defesa'?'Divergência de prazo — conferir evidências':'Conferência operacional pendente',source:id==='demo-defesa'?'talisman_contestacao':'demo',source_metadata:{fatal_deadline:'2026-10-15',operational_deadline:'2026-10-10',responsible:'Equipe de Controladoria',routing_status:i%3===0?'human_review':i%3===1?'saneado':'aguardando'}}));
const items = [
  ['HUMAN_NECESSARY','RETRY_EXHAUSTED','Conferir o estado na Enter antes de repetir o envio',false],
  ['SEM_DOCUMENTOS','DOCUMENT_INTAKE','',false],
  ['RUNNING','DOCUMENT_ATTACH','',false],
  ['DOCUMENTOS_ENVIADOS','ERP_CONFIRMATION','',false],
  ['PENDING','DOCUMENTS_MATCHED','',false],
  ['DONE','RECONCILED','',false],
  ['HUMAN_NECESSARY','TASK_OPEN_FAILED','Não foi possível abrir a tarefa',true],
].map(([status,stage,human_reason,retry_allowed],i)=>({id:`demo-protocol-${i}`,cnj:`DEMO ${String(i+1).padStart(4,'0')} · Protocolo`,task_id:'demo-task',task_url:'',status,stage,human_reason,retry_allowed,updated_at:'2026-10-03T20:30:00Z'}));
const request = async (path:string,options?:RequestInit) => {
  if(path.endsWith('/next-agreement')) return {agreement:processes('demo-agreement')[0]};
  if(options?.method && options.method !== 'GET') throw new Error('Prévia visual: alterações de dados estão desativadas.');
  if(path === '/api/tasks' || path.startsWith('/api/tasks?')) return tasks;
  const task = path.match(/^\/api\/tasks\/([^/]+)\/processes$/);
  if(task) return processes(task[1]);
  if(path === '/api/protocolo/summary') return {session:{state:'idle'},automatic_active:false,controladoria:null,documents:null,statuses:{HUMAN_NECESSARY:2,SEM_DOCUMENTOS:1,RUNNING:1,DOCUMENTOS_ENVIADOS:1,PENDING:1,DONE:1}};
  if(path.startsWith('/api/protocolo/items')) return {rows:items};
  return [];
};
Object.assign(window,{MBA_NAVIGATE:(route:string)=>{window.history.replaceState(null,'',`#/${route}`);window.dispatchEvent(new CustomEvent('mba:route-changed',{detail:{route}}));return true;},MBA_CURRENT_USER:{id:'demo-user',is_master_admin:true,permissions:{'tasks.view':true,'tasks.manage':true,'automations.view':true,'automations.run':false}},MBA_API:{request},MBA_AUTOMATION_API:{request,fetch:async()=>{throw new Error('Exportação desativada nesta prévia.');}}});
function Preview(){
  const [page,setPage]=useState<'tasks'|'control'>('tasks');
  return <>{shellFixture?<aside className="sidebar"><div className="sidebar-head"><strong>MBA Backoffice</strong></div><nav aria-label="Menu lateral"><span className="nav-item">Início</span><span className="nav-item">Operação</span><span className="nav-item active">Tarefas</span></nav></aside>:null}<div className={shellFixture?"main-area":""}><div className="demo-notice">PROPOSTA EM TESTE · Dados fictícios · Nenhuma conexão com produção <label className="demo-scenario">Fluxo da prévia<select value={scenario} onChange={event => { location.search = event.target.value ? `?scenario=${event.target.value}` : ''; }}><option value="">Fila geral</option><option value="liminar">Liminar</option><option value="defesa">Defesa</option><option value="comprovante_pagamento">Comprovante de pagamento</option><option value="protocolo">Coleta de documentos</option><option value="acordos">Acordos</option></select></label></div><header className={`demo-navbar ${shellFixture?"topbar":""}`}><div className="demo-brand"><b>MBA</b> Backoffice</div><nav aria-label="Navegação principal"><span>Gestão Processual</span><span>Operação</span><button aria-current={page==='control'?'page':undefined} onClick={()=>setPage('control')}>Controladoria</button><span>Automações</span><button aria-current={page==='tasks'?'page':undefined} onClick={()=>setPage('tasks')}>Tarefas</button></nav><span className="demo-profile">GP</span></header><div id="tarefas" data-react-tasks="true" className={page==='tasks'?'active':''} hidden={page!=='tasks'}><TasksApp/></div>{page==='control'?<div className="demo-control"><ControladoriaPage/></div>:null}</div></>;
}
createRoot(document.getElementById('root')!).render(<Preview/>);
