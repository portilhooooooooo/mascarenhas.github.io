import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {Archive,ArrowUpRight,FileSpreadsheet,FolderInput,Landmark,Play,Receipt,ShieldCheck,Workflow} from 'lucide-react';
import {useModuleVisible} from './useModuleVisible';
import {AutomationKanban,type KanbanFlow} from './AutomationKanban';
import './automationWorkspace.css';

type Module='home'|'datajud'|'executar-encerramentos'|'executar-pagamentos'|'encerramentos'|'pagamentos'|'liminar'|'protocolos'|'defesas'|'andamentos';
type AutomationModule='datajud'|'encerramentos'|'pagamentos';
type Mode='import'|'manual'|'run'|null;
const route=(module:Module)=>module==='home'?'automacoes':'automacoes/'+module;
function fromUrl():Module{
  const current=(location.hash.startsWith('#/')?location.hash.slice(2):location.pathname).replace(/^\/+|\/+$/g,'');
  const name=current.startsWith('automacoes/')?current.slice('automacoes/'.length):'home';
  return ['home','datajud','executar-encerramentos','executar-pagamentos','encerramentos','pagamentos','liminar','protocolos','defesas','andamentos'].includes(name)?name as Module:'home';
}
function go(module:Module){
  (window as Window&{MBA_NAVIGATE?:(page:string)=>boolean}).MBA_NAVIGATE?.(route(module));
}
const descriptions:Record<AutomationModule,string>={
  datajud:'Classifica os andamentos coletados pelo DataJud.',
  encerramentos:'Faz a reclassificação dos processos de encerramentos encontrados pela automação, e distribuição automática.',
  pagamentos:'Faz a classificação de pagamentos judiciais no Benner.',
};
const schemas:Record<AutomationModule,string>={
  datajud:'CNJ | PASTA | FASE | DATA_ANDAMENTO | OBS_ANDAMENTO | MOTIVO_DERROTA | NOME_ANDAMENTO | DATA_DOCUMENTO | TIPO_DOCUMENTO | NOME_DOCUMENTO',
  encerramentos:'CNJ | Tipo_Encerramento | Assignee',
  pagamentos:'Input tradicional de pagamentos',
};
function authorized():Set<Module>{
  const user=(window as Window&{MBA_CURRENT_USER?:{permissions?:Record<string,boolean>};MBA_PORTFOLIO_POLICY?:{canAccess:(id:string)=>boolean}});
  const perms=user.MBA_CURRENT_USER?.permissions||{};
  const can=(page:string)=>user.MBA_PORTFOLIO_POLICY?.canAccess(page)===true;
  const access=new Set<Module>(['home']);
  const portfolio=(window as Window&{MBA_API?:{getPortfolioId?:()=>string}}).MBA_API?.getPortfolioId?.()||'';
  const ownAutomationScope=portfolio.endsWith('_enter')||portfolio==='agibank_mba';
  if(perms['automations.view']===true&&can('automacoes')&&ownAutomationScope){
    access.add('datajud');access.add('andamentos');
  }
  if(can('encerramentos')){access.add('encerramentos');access.add('executar-encerramentos');}
  if(can('pagamentos')){access.add('pagamentos');access.add('executar-pagamentos');}
  if(can('tutelas'))access.add('liminar');
  if(can('protocolo')){access.add('protocolos');access.add('defesas');}
  return access;
}
function AutomationForm({module}:{module:AutomationModule}){
  const [mode,setMode]=useState<Mode>(null);
  const [file,setFile]=useState<File|null>(null);
  const [text,setText]=useState('');
  useEffect(()=>{setMode(null);setFile(null);setText('');},[module]);
  return <section className="automation-config" aria-label={'Execução de '+module}>
    <div className="automation-config-head">
      <h1>{module==='datajud'?'CNJ / DataJud':module==='encerramentos'?'Encerramentos':'Pagamentos'}</h1>
      <p>{descriptions[module]}</p>
    </div>
    <div className="automation-action-row">
      <button type="button" className={'automation-action automation-action-batch'+(mode==='import'?' selected':'')} onClick={()=>setMode(mode==='import'?null:'import')} aria-expanded={mode==='import'}>
        <span className="automation-action-icon"><FileSpreadsheet size={19}/></span>
        <span>Importação em lote</span>
      </button>
      <button type="button" className={'automation-action automation-action-manual'+(mode==='manual'?' selected':'')} onClick={()=>setMode(mode==='manual'?null:'manual')} aria-expanded={mode==='manual'}>
        <span className="automation-action-icon"><FolderInput size={19}/></span>
        <span>Inserção</span><small>{schemas[module]}</small>
      </button>
      <button type="button" className={'automation-action automation-action-run'+(mode==='run'?' selected':'')} onClick={()=>setMode(mode==='run'?null:'run')} aria-expanded={mode==='run'}>
        <span className="automation-action-icon"><Play size={19}/></span>
        <span>Iniciar execução</span>
      </button>
    </div>
    {mode&&<div className="automation-action-detail" role="region" aria-label={mode==='import'?'Importação em lote':mode==='manual'?'Inserção manual':'Iniciar execução'}>
      {mode==='import'&&<>
        <label className="automation-file-field">Arquivo XLSX ou CSV
          <input type="file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={e=>setFile(e.target.files?.[0]||null)}/>
        </label>
        {file&&<span className="automation-file-name">{file.name}</span>}
      </>}
      {mode==='manual'&&<label className="automation-manual-field">{schemas[module]}
        <textarea spellCheck={false} rows={4} value={text} onChange={e=>setText(e.target.value)} placeholder={schemas[module]} />
      </label>}
      {mode==='run'&&<div className="automation-run-summary">{module==='datajud'?'Classificar andamentos DataJud':module==='encerramentos'?'Reclassificar os registros existentes':'Classificar pagamentos judiciais'}</div>}
      <div className="automation-submit"><span>Integração pendente de backend</span><button type="button" disabled>
        {mode==='import'?'Importar':mode==='manual'?'Inserir':'Iniciar execução'}
      </button></div>
    </div>}
  </section>;
}
const integrations=[
  {id:'datajud' as const,label:'CNJ / DataJud',icon:Landmark},
  {id:'encerramentos' as const,label:'Encerramentos',icon:Archive},
  {id:'pagamentos' as const,label:'Pagamentos',icon:Receipt},
  {id:'liminar' as const,label:'Liminar',icon:ShieldCheck},
  {id:'andamentos' as const,label:'Andamentos',icon:Workflow},
];
function Home({access}:{access:Set<Module>}){
  return <div className="automation-home-grid" aria-label="Integrações">
    {integrations.filter(entry=>access.has(entry.id)).map(({id,label,icon:Icon})=><button type="button" className="automation-home-card" key={id} onClick={()=>go(id==='encerramentos'?'executar-encerramentos':id==='pagamentos'?'executar-pagamentos':id)}>
      <span className="automation-home-heading"><Icon size={18} strokeWidth={1.65}/><strong>{label}</strong><ArrowUpRight size={16}/></span>
      {id in descriptions&&<span className="automation-home-detail">{descriptions[id as AutomationModule]}</span>}
      <span className="automation-home-open">Executar</span>
    </button>)}
  </div>;
}
export function AutomacoesWorkspace(){
  const visible=useModuleVisible('automacoes');
  const [module,setModule]=useState<Module>(fromUrl);
  const [access,setAccess]=useState<Set<Module>>(authorized);
  useEffect(()=>{
    const sync=()=>{setModule(fromUrl());setAccess(authorized());};
    const events=['mba:route-changed','mba:profile-ready','mba:authenticated','mba:portfolio-changed','mba:module-visibility-updated','popstate','hashchange'];
    events.forEach(e=>window.addEventListener(e,sync));
    return()=>events.forEach(e=>window.removeEventListener(e,sync));
  },[]);
  const active=access.has(module)?module:'home';
  const tabs:Module[]=['home','encerramentos','pagamentos','liminar','protocolos','defesas'];
  const visibleTabs=tabs.filter(id=>access.has(id));
  const homeFlow=active==='datajud'||active==='executar-encerramentos'||active==='executar-pagamentos'||active==='andamentos';
  if(!visible)return null;
  const tabsNav=<nav className="mba-operation-subnav automation-workspace-tabs" aria-label="Seções de Automações">
    {visibleTabs.map(id=><button type="button" key={id} className={(active===id||(id==='home'&&homeFlow))?'active':''} aria-current={(active===id||(id==='home'&&homeFlow))?'page':undefined} onClick={()=>go(id)}>
      {id==='home'?'Home':id==='liminar'?'Liminar':id==='protocolos'?'Protocolos':id==='defesas'?'Defesas':id==='encerramentos'?'Encerramentos':'Pagamentos'}
    </button>)}

  </nav>;
  const shellTabs=document.getElementById('mba-shell-tabs');
  return <div className="automation-workspace">
    {shellTabs?createPortal(tabsNav,shellTabs):tabsNav}
    {active==='home'&&<Home access={access}/>}
    {(active==='datajud'||active==='executar-encerramentos'||active==='executar-pagamentos')&&<><button type="button" className="automation-back" onClick={()=>go('home')}>Voltar à Home</button><AutomationForm module={active==='executar-encerramentos'?'encerramentos':active==='executar-pagamentos'?'pagamentos':'datajud'}/></>}
    {active==='andamentos'&&<div className="automation-config-head"><h1>Andamentos</h1><p>Lançamento de andamentos no Benner.</p></div>}
    {active==='liminar'&&<div className="automation-config-head"><h1>Liminar</h1></div>}
    {active==='protocolos'&&<div className="automation-config-head"><h1>Protocolos</h1></div>}
    {active==='defesas'&&<div className="automation-config-head"><h1>Defesas</h1></div>}
    {(['encerramentos','pagamentos','liminar','protocolos','defesas'] as KanbanFlow[]).includes(active as KanbanFlow)&&
      <AutomationKanban key={active} module={active as KanbanFlow} active={visible}/>}
  </div>;
}
