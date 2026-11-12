import {useEffect,useId,useRef,useState} from 'react';
import {createPortal} from 'react-dom';
import {Archive,FileSpreadsheet,FolderInput,History,Landmark,Play,Receipt,ShieldCheck,Workflow,X,Files} from 'lucide-react';
import {ProtocolosPage} from './ProtocolosPage';
import {ClosingExecutionPanel} from './ClosingExecutionPanel';
import {PaymentsACPExecutionPanel} from './PaymentsACPExecutionPanel';
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
  datajud:'Movimentações judiciais',
  encerramentos:'Importar lotes e reclassificar processos',
  pagamentos:'Analisar ACP, pagamentos e comprovantes',
};
const homeDescriptions:Record<'datajud'|'encerramentos'|'pagamentos'|'liminar'|'andamentos'|'protocolos',string>={
  ...descriptions,
  liminar:'Decisões judiciais',
  andamentos:'Publicação no Benner',
  protocolos:'Importação e execução',
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
  const [mode,setMode]=useState<Exclude<Mode,null>>('import');
  const [file,setFile]=useState<File|null>(null);
  const [text,setText]=useState('');
  useEffect(()=>{setMode('import');setFile(null);setText('');},[module]);
  return <section className="automation-config" aria-label={'Execução de '+module}>
    <nav className="automation-execute-tabs" aria-label="Forma de execução">
      <button type="button" className={mode==='import'?'active':''} aria-pressed={mode==='import'} onClick={()=>setMode('import')}><FileSpreadsheet size={15}/>Importação</button>
      <button type="button" className={mode==='manual'?'active':''} aria-pressed={mode==='manual'} onClick={()=>setMode('manual')}><FolderInput size={15}/>Inserção</button>
      <button type="button" className={mode==='run'?'active':''} aria-pressed={mode==='run'} onClick={()=>setMode('run')}><Play size={15}/>Iniciar</button>
    </nav>
    <div className="automation-action-detail" role="region">
      {mode==='import'&&<label className="automation-file-field">
        <strong>Arquivo de entrada</strong>
        <input type="file" accept=".xlsx,.csv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={e=>setFile(e.target.files?.[0]||null)}/>
        {file&&<span className="automation-file-name">{file.name}</span>}
      </label>}
      {mode==='manual'&&<label className="automation-manual-field">
        <strong>Registros</strong>
        <textarea spellCheck={false} rows={5} value={text} onChange={e=>setText(e.target.value)} placeholder={schemas[module]}/>
      </label>}
      {mode==='run'&&<div className="automation-run-summary">Execução na carteira selecionada.</div>}
    </div>
    <div className="automation-submit"><span>Integração ainda indisponível</span>
      <button type="button" disabled>{mode==='import'?'Importar':mode==='manual'?'Inserir':'Iniciar'}</button>
    </div>
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
    {integrations.filter(entry=>entry.id!=='datajud'&&access.has(entry.id)).map(({id,label,icon:Icon})=><article className="automation-home-card" key={id}>
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
  const dialogId=useId();
  const dialogRef=useRef<HTMLElement>(null);
  const originFocus=useRef<HTMLElement|null>(null);
  useEffect(()=>{
    const sync=()=>{setModule(fromUrl());setAccess(authorized());};
    const events=['mba:route-changed','mba:profile-ready','mba:authenticated','mba:portfolio-changed','mba:module-visibility-updated','popstate','hashchange'];
    events.forEach(e=>window.addEventListener(e,sync));
    return()=>events.forEach(e=>window.removeEventListener(e,sync));
  },[]);
  useEffect(()=>{
    if(!execute)return;
    originFocus.current=document.activeElement instanceof HTMLElement?document.activeElement:null;
    const dialog=dialogRef.current;
    dialog?.querySelector<HTMLElement>('.automation-dialog-header button')?.focus();
    const close=(e:KeyboardEvent)=>{
      if(e.key==='Escape'){e.preventDefault();setExecute(null);return}
      if(e.key!=='Tab'||!dialog)return;
      const items=[...dialog.querySelectorAll<HTMLElement>('button:not([disabled]),a[href],input:not([disabled]),textarea:not([disabled]),select:not([disabled]),[tabindex="0"]')]
        .filter(element=>element.getClientRects().length>0);
      if(!items.length)return;
      if(e.shiftKey&&document.activeElement===items[0]){e.preventDefault();items[items.length-1].focus();}
      else if(!e.shiftKey&&document.activeElement===items[items.length-1]){e.preventDefault();items[0].focus();}
    };
    const original=document.body.style.overflow;
    document.body.style.overflow='hidden';
    window.addEventListener('keydown',close);
    return()=>{document.body.style.overflow=original;window.removeEventListener('keydown',close);originFocus.current?.focus()};
  },[execute]);
  useEffect(()=>{
    if(execute&&!access.has(execute))setExecute(null);
  },[access,execute]);
  useEffect(()=>{
    const close=()=>setExecute(null);
    window.addEventListener('mba:portfolio-changed',close);
    return()=>window.removeEventListener('mba:portfolio-changed',close);
  },[]);
  const active=access.has(module)?module:'home';
  const tabs:Module[]=['home','encerramentos','pagamentos','liminar','protocolos','defesas'];
  const visibleTabs=tabs.filter(id=>access.has(id));
  const homeFlow=active==='datajud'||active==='executar-encerramentos'||active==='executar-pagamentos'||active==='andamentos';
  const tabsNav=<nav className="mba-operation-subnav automation-workspace-tabs" aria-label="Seções de Automações">
    {visibleTabs.map(id=><button type="button" key={id} className={(active===id||(id==='home'&&homeFlow))?'active':''} aria-current={(active===id||(id==='home'&&homeFlow))?'page':undefined} onClick={()=>go(id)}>
      {id==='home'?'Home':id==='liminar'?'Liminar':id==='protocolos'?'Protocolos':id==='defesas'?'Defesas':id==='encerramentos'?'Encerramentos':'Pagamentos'}
    </button>)}

  </nav>;
  const shellTabs=document.getElementById('mba-shell-tabs');
  return <div className="automation-workspace" hidden={!visible}>
    {visible ? (shellTabs?createPortal(tabsNav,shellTabs):tabsNav) : null}
    {active==='home'&&<Home access={access} onExecute={setExecute}/>}
    {visible&&execute&&access.has(execute)&&createPortal(<div className="automation-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setExecute(null)}}>
      <section ref={dialogRef} className="automation-dialog" data-module={execute} role="dialog" aria-modal="true" aria-labelledby={dialogId}>
        <header className="automation-dialog-header">
          <h2 id={dialogId}>{integrations.find(item=>item.id===execute)?.label}</h2>
          <button type="button" aria-label="Fechar" onClick={()=>setExecute(null)}><X size={18}/></button>
        </header>
        <div className="automation-dialog-body">{execute==='protocolos'?<ProtocolosPage embedded/>:
          execute==='encerramentos'?<ClosingExecutionPanel/>:
          execute==='pagamentos'?<PaymentsACPExecutionPanel/>:
          execute==='datajud'?<AutomationForm module="datajud"/>:
          <p className="automation-empty">Execução não configurada.</p>}</div>
        <footer className="automation-dialog-footer">
          <span>{execute==='protocolos'?'Agibank Enter · Protocolos':'Automação'}</span>
          <button type="button" onClick={()=>setExecute(null)}>Fechar</button>
        </footer>
      </section>
    </div>,document.body)}
    {(active==='datajud'||active==='executar-encerramentos'||active==='executar-pagamentos')&&<><button type="button" className="automation-back" onClick={()=>go('home')}>Voltar à Home</button><AutomationForm module={active==='executar-encerramentos'?'encerramentos':active==='executar-pagamentos'?'pagamentos':'datajud'}/></>}
    {active==='andamentos'&&<div className="automation-config-head"><h1>Andamentos</h1><p>Lançamento de andamentos no Benner.</p></div>}
    {active==='liminar'&&<div className="automation-config-head"><h1>Liminar</h1></div>}
    {active==='protocolos'&&<div className="automation-config-head"><h1>Protocolos</h1></div>}
    {active==='defesas'&&<div className="automation-config-head"><h1>Defesas</h1></div>}
    {(['encerramentos','pagamentos','liminar','protocolos','defesas'] as KanbanFlow[]).filter(flow=>access.has(flow)).map(flow=>
      <div key={flow} className="automation-keep-mounted" style={{display:active===flow?'block':'none'}} aria-hidden={active!==flow}>
        <AutomationKanban module={flow} active={visible&&active===flow}/>
      </div>)}
  </div>;
}
