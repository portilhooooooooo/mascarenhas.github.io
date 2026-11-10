import {useEffect,useState} from 'react';
import {createPortal} from 'react-dom';
import {Archive,FileSpreadsheet,FolderInput,History,Landmark,Play,Receipt,ShieldCheck,Workflow,X,Files} from 'lucide-react';
import {ProtocolosPage} from './ProtocolosPage';
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
const homeDescriptions:Record<'datajud'|'encerramentos'|'pagamentos'|'liminar'|'andamentos'|'protocolos',string>={
  ...descriptions,
  liminar:'Consulta e acompanha decisões de liminar.',
  andamentos:'Acompanha lançamentos de andamentos no Benner.',
  protocolos:'Importa planilhas e documentos para execução de protocolos.',
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
  if(portfolio==='agibank_enter' && can('protocolo')){access.add('protocolos');access.add('defesas');}
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
  {id:'protocolos' as const,label:'Protocolos',icon:Files},
];
type HomeIntegration=typeof integrations[number]['id'];
const historyEnabled=new Set<HomeIntegration>(['encerramentos','pagamentos','liminar','protocolos']);
function Home({access,onExecute}:{access:Set<Module>;onExecute:(module:HomeIntegration)=>void}){
  return <div className="automation-home-grid" aria-label="Integrações">
    {integrations.filter(entry=>access.has(entry.id)).map(({id,label,icon:Icon})=><article className="automation-home-card" key={id}>
      <div className={'automation-home-icon automation-home-icon-'+id}><Icon size={19} strokeWidth={1.8} aria-hidden="true"/></div>
      <div className="automation-home-copy"><h2>{label}</h2><p>{homeDescriptions[id]}</p></div>
      <div className="automation-home-actions">
        <button type="button" className="automation-execute" onClick={()=>onExecute(id)}><Play size={14} aria-hidden="true"/>Executar</button>
        <button type="button" className="automation-history" disabled={!historyEnabled.has(id)}
          title={!historyEnabled.has(id)?'Histórico ainda não integrado':undefined}
          onClick={()=>go(id)}><History size={14} aria-hidden="true"/>Histórico</button>
      </div>
    </article>)}
  </div>;
}
export function AutomacoesWorkspace(){
  const visible=useModuleVisible('automacoes');
  const [module,setModule]=useState<Module>(fromUrl);
  const [access,setAccess]=useState<Set<Module>>(authorized);
  const [execute,setExecute]=useState<HomeIntegration|null>(null);
  useEffect(()=>{
    const sync=()=>{setModule(fromUrl());setAccess(authorized());};
    const events=['mba:route-changed','mba:profile-ready','mba:authenticated','mba:portfolio-changed','mba:module-visibility-updated','popstate','hashchange'];
    events.forEach(e=>window.addEventListener(e,sync));
    return()=>events.forEach(e=>window.removeEventListener(e,sync));
  },[]);
  useEffect(()=>{
    if(!execute)return;
    const close=(e:KeyboardEvent)=>{if(e.key==='Escape')setExecute(null)};
    const original=document.body.style.overflow;
    document.body.style.overflow='hidden';
    window.addEventListener('keydown',close);
    return()=>{document.body.style.overflow=original;window.removeEventListener('keydown',close)};
  },[execute]);
  useEffect(()=>{
    if(execute&&!access.has(execute))setExecute(null);
  },[access,execute]);
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
    {active==='home'&&<Home access={access} onExecute={setExecute}/>}
    {execute&&access.has(execute)&&createPortal(<div className="automation-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setExecute(null)}}>
      <section className="automation-dialog" role="dialog" aria-modal="true" aria-label={'Executar '+execute}>
        <header className="automation-dialog-header"><h2>Executar · {integrations.find(item=>item.id===execute)?.label}</h2><button type="button" aria-label="Fechar" onClick={()=>setExecute(null)}><X size={18}/></button></header>
        <div className="automation-dialog-body">{execute==='protocolos'?<ProtocolosPage/>:
          (execute==='datajud'||execute==='encerramentos'||execute==='pagamentos')?<AutomationForm module={execute}/>:
          <p className="automation-empty">Execução ainda não integrada a esta tela. Consulte o histórico para acompanhar os registros.</p>}</div>
      </section>
    </div>,document.body)}
    {(active==='datajud'||active==='executar-encerramentos'||active==='executar-pagamentos')&&<><button type="button" className="automation-back" onClick={()=>go('home')}>Voltar à Home</button><AutomationForm module={active==='executar-encerramentos'?'encerramentos':active==='executar-pagamentos'?'pagamentos':'datajud'}/></>}
    {active==='andamentos'&&<div className="automation-config-head"><h1>Andamentos</h1><p>Lançamento de andamentos no Benner.</p></div>}
    {active==='liminar'&&<div className="automation-config-head"><h1>Liminar</h1></div>}
    {active==='protocolos'&&<div className="automation-config-head"><h1>Protocolos</h1></div>}
    {active==='defesas'&&<div className="automation-config-head"><h1>Defesas</h1></div>}
    {(['encerramentos','pagamentos','liminar','protocolos','defesas'] as KanbanFlow[]).includes(active as KanbanFlow)&&
      <AutomationKanban key={active} module={active as KanbanFlow} active={visible}/>}
  </div>;
}
