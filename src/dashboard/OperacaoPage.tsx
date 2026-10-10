import './operacao.css';
import {OperacaoEncerramentosPage} from './OperacaoEncerramentosPage';
import {OperacaoLiminarPage} from './OperacaoLiminarPage';
import {ProtocolosPage} from './ProtocolosPage';
import {DefesasPage} from './DefesasPage';
import {useCallback,useEffect,useMemo,useRef,useState} from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  CircleDollarSign,
  Download,
  FileSpreadsheet,
  Hourglass,
  LoaderCircle,
  Play,
  ReceiptText,
  Search,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  getPagamentoOperacaoItems,
  getPagamentoOperacaoSummary,
  importPagamentoOperacao,
  startPagamentoOperacao,
  type PagamentoOperacaoItem,
  type PagamentoOperacaoStatus,
  type PagamentoOperacaoSummary,
} from './operacaoPagamentosService';

const PAGE_SIZES = [10,50,100] as const;
const STATUS_ORDER: PagamentoOperacaoStatus[] = [
  'IMPORTADO',
  'NA_FILA',
  'EM_APROVACAO',
  'EM_RETIFICACAO',
  'PAGO_SEM_COMPROVANTE',
  'PAGO_COM_COMPROVANTE',
  'ACAO_NECESSARIA',
];

const STATUS_META: Record<PagamentoOperacaoStatus,{label:string;tone:string;icon:typeof Hourglass}> = {
  IMPORTADO:{label:'Importados',tone:'neutral',icon:FileSpreadsheet},
  NA_FILA:{label:'Na fila',tone:'blue',icon:Hourglass},
  EM_APROVACAO:{label:'Em aprovação',tone:'blue',icon:LoaderCircle},
  EM_RETIFICACAO:{label:'Em retificação',tone:'amber',icon:AlertTriangle},
  PAGO_SEM_COMPROVANTE:{label:'Pago sem comprovante',tone:'amber',icon:ReceiptText},
  PAGO_COM_COMPROVANTE:{label:'Pago com comprovante',tone:'success',icon:CheckCircle2},
  ACAO_NECESSARIA:{label:'Ação necessária',tone:'danger',icon:AlertTriangle},
};

const AUTOMATION_LABELS: Record<string,string> = {
  idle:'Aguardando fila',
  starting:'Iniciando…',
  authenticating:'Conectando ao Benner…',
  connected:'Benner disponível',
  in_use:'Processando pagamentos',
  error:'Erro na automação',
  unknown:'Status indisponível',
};

const number = (value:number|undefined|null) => new Intl.NumberFormat('pt-BR').format(Number(value||0));
const money = (value:number|string|undefined|null) => {
  if (value===null || value===undefined || value==='') return '—';
  const parsed=Number(value);
  return Number.isFinite(parsed)?new Intl.NumberFormat('pt-BR',{style:'currency',currency:'BRL'}).format(parsed):'—';
};
const dateTime = (value?:string|null) => {
  if(!value) return '—';
  const date=new Date(value);
  return Number.isNaN(date.getTime())?'—':new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(date);
};
const fileSize=(bytes:number)=>(bytes/1024/1024).toFixed(1).replace('.',',')+' MB';

function paginationPages(total:number,current:number):Array<number|'ellipsis'> {
  if(total<=7)return Array.from({length:total},(_,index)=>index+1);
  const pages:Array<number|'ellipsis'>=[1];
  if(current>4)pages.push('ellipsis');
  const start=Math.max(2,current-1),end=Math.min(total-1,current+1);
  for(let value=start;value<=end;value+=1)pages.push(value);
  if(current<total-3)pages.push('ellipsis');
  pages.push(total);
  return pages;
}

function StatusBadge({status}:{status:PagamentoOperacaoStatus}) {
  const meta=STATUS_META[status]||STATUS_META.IMPORTADO;
  const Icon=meta.icon;
  return <span className={'protocolos-badge '+meta.tone}><Icon size={12}/>{meta.label}</span>;
}

function downloadVisibleRows(items:PagamentoOperacaoItem[]) {
  if (!items.length) return;
  const escape=(value:unknown)=>{
    const text=String(value ?? '').replace(/"/g,'""');
    return '"' + text + '"';
  };
  const headers=[
    'PROCESSO','PASTA','STATUS','BASE PAGAMENTOS','CORRESPONDÊNCIA',
    'IDENTIFICADOR INPUT','IDENTIFICADOR BENNER','STATUS PROVISÃO',
    'VALOR INPUT','VALOR PROVISÃO','STATUS COMPROVANTE','ARQUIVO COMPROVANTE',
    'MENSAGEM','ATUALIZAÇÃO',
  ];
  const rows=items.map(item=>[
    item.processo,
    item.pasta,
    STATUS_META[item.status_operacional]?.label || item.status_operacional,
    item.pagamentos_situacao,
    item.pagamentos_match,
    item.identificador_input,
    item.benner_identifier,
    item.provision_status,
    item.valor_input,
    item.provision_amount,
    receiptLabel(item),
    item.receipt_filename,
    item.automation_message,
    item.automation_updated_at || item.updated_at,
  ]);
  const csv='\ufeff'+[headers,...rows].map(row=>row.map(escape).join(';')).join('\r\n');
  const blob=new Blob([csv],{type:'text/csv;charset=utf-8;'});
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');
  anchor.href=url;
  anchor.download='pagamentos_'+new Date().toISOString().slice(0,10)+'.csv';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

function receiptLabel(item:PagamentoOperacaoItem) {
  const status=String(item.receipt_analysis_status||'');
  if(status==='validated') return 'Comprovante validado';
  if(status==='no_receipt') return 'Não localizado';
  if(status==='amount_mismatch') return 'Valor divergente';
  if(status==='needs_ocr') return 'Leitura necessária';
  if(status==='running') return 'Validando…';
  if(status==='pending') return 'Na fila';
  if(status==='not_required') return 'Não aplicável';
  return 'Aguardando provisão';
}

function UploadField({file,onChange,disabled}:{file:File|null;onChange:(file:File|null)=>void;disabled:boolean}) {
  const input=useRef<HTMLInputElement>(null);
  const [dragging,setDragging]=useState(false);
  const [error,setError]=useState('');
  const accept=(incoming:FileList|File[])=>{
    const next=Array.from(incoming);
    if(!next.length)return;
    if(next.length!==1 || !/\.xlsx$/i.test(next[0].name)){
      setError('Selecione uma única planilha XLSX.');
      return;
    }
    setError('');
    onChange(next[0]);
    if(input.current)input.current.value='';
  };
  return <div className="protocolos-upload-field">
    <input ref={input} type="file" accept=".xlsx" aria-label="Selecionar base de pagamentos" disabled={disabled} onChange={event=>accept(event.target.files||[])}/>
    <button type="button" className={'protocolos-modern-drop '+(dragging?'is-dragging':'')} disabled={disabled}
      onClick={()=>input.current?.click()}
      onDragOver={event=>{event.preventDefault();if(!disabled)setDragging(true);}}
      onDragLeave={()=>setDragging(false)}
      onDrop={event=>{event.preventDefault();setDragging(false);if(!disabled)accept(event.dataTransfer.files);}}>
      <span className="protocolos-drop-icon"><UploadCloud size={17}/></span>
      <span className="protocolos-drop-copy"><strong>Selecione ou arraste a planilha</strong><small>PROCESSO · PASTA · IDENTIFICADOR · VALOR</small></span>
    </button>
    {file?<div className="protocolos-selected-file"><span className="protocolos-file-copy"><strong>{file.name}</strong><small>{fileSize(file.size)}</small></span><button type="button" disabled={disabled} aria-label={'Remover '+file.name} onClick={()=>onChange(null)}><X size={15}/></button></div>:null}
    {error?<p className="protocolos-feedback danger" role="alert">{error}</p>:null}
  </div>;
}

function PagamentosQueue({summary,items,loading}:{summary:PagamentoOperacaoSummary|null;items:PagamentoOperacaoItem[];loading:boolean}) {
  const [view,setView]=useState<PagamentoOperacaoStatus|'ALL'>('ALL');
  const [query,setQuery]=useState('');
  const [pageSize,setPageSize]=useState<number>(10);
  const [page,setPage]=useState(1);

  const visible=useMemo(()=>{
    const normalized=query.trim().toLocaleLowerCase('pt-BR');
    return items.filter(item=>{
      if(view!=='ALL' && item.status_operacional!==view)return false;
      if(!normalized)return true;
      const available=(item.available_identifiers||[]).map(candidate=>candidate.identifier).join(' ');
      return [
        item.processo,item.pasta,item.identificador_input,item.benner_identifier,
        item.pagamentos_situacao,item.provision_status,item.automation_message,available,
      ].some(value=>String(value||'').toLocaleLowerCase('pt-BR').includes(normalized));
    });
  },[items,query,view]);

  useEffect(()=>setPage(1),[view,query,pageSize]);
  const pageCount=Math.max(1,Math.ceil(visible.length/pageSize));
  const currentPage=Math.min(page,pageCount);
  const start=visible.length?(currentPage-1)*pageSize:0;
  const end=Math.min(start+pageSize,visible.length);
  const pageRows=visible.slice(start,end);
  const links=paginationPages(pageCount,currentPage);
  const statusCount=(status:PagamentoOperacaoStatus)=>Number(summary?.statuses?.[status]||0);

  return <section className="protocolos-card protocolos-workspace operacao-workspace">
    <header className="protocolos-workspace-head"><div><h2>Base operacional</h2><p>Acompanhe a situação do pagamento, a provisão no Benner e a validação do comprovante.</p></div></header>
    <div className="protocolos-status-strip-react" role="tablist" aria-label="Status dos pagamentos">
      <button type="button" className={view==='ALL'?'active':''} onClick={()=>setView('ALL')} role="tab" aria-selected={view==='ALL'}><span>Todos</span><strong>{number(summary?.active_total)}</strong></button>
      {STATUS_ORDER.map(status=>{
        const meta=STATUS_META[status],Icon=meta.icon;
        return <button key={status} type="button" className={(view===status?'active ':'')+meta.tone} onClick={()=>setView(status)} role="tab" aria-selected={view===status}><Icon size={13}/><span>{meta.label}</span><strong>{number(statusCount(status))}</strong></button>;
      })}
    </div>
    <div className="protocolos-toolbar">
      <label className="protocolos-search"><Search size={15}/><input value={query} onChange={event=>setQuery(event.target.value)} aria-label="Buscar pagamentos" placeholder="Buscar por processo, pasta, identificador ou motivo..."/></label>
      <div className="protocolos-toolbar-actions">
        <button type="button" className="protocolos-button secondary operacao-download-button" disabled={loading||visible.length===0} onClick={()=>downloadVisibleRows(visible)}><Download size={14}/>Baixar</button>
        <label className="protocolos-page-size"><span>Exibir</span><select value={pageSize} onChange={event=>setPageSize(Number(event.target.value))}>{PAGE_SIZES.map(size=><option key={size} value={size}>{size}</option>)}</select></label>
      </div>
    </div>
    <div className="protocolos-table-wrap">
      <table className="protocolos-table-react operacao-pagamentos-table">
        <thead><tr><th>Processo / Pasta</th><th>Status</th><th>Base pagamentos</th><th>Provisão Benner</th><th>Comprovante</th><th>Atualização</th></tr></thead>
        <tbody>
          {loading?<tr><td colSpan={6}><div className="protocolos-empty"><LoaderCircle className="spin" size={22}/><strong>Carregando pagamentos</strong><span>Consultando o snapshot operacional.</span></div></td></tr>:null}
          {!loading && visible.length===0?<tr><td colSpan={6}><div className="protocolos-empty"><CircleDollarSign size={22}/><strong>Nenhum registro nesta visão</strong><span>Importe uma base ou ajuste os filtros.</span></div></td></tr>:null}
          {!loading && pageRows.map(item=><tr key={item.id}>
            <td><strong className="protocolos-cnj">{item.processo||item.pasta||'—'}</strong><small>{item.processo&&item.pasta?'Pasta '+item.pasta:item.processo?'Sem pasta informada':'Sem processo informado'}</small>{item.automation_message?<small className={item.status_operacional==='ACAO_NECESSARIA'?'operacao-danger-copy':''} title={item.automation_message}>{item.automation_message}</small>:null}</td>
            <td><StatusBadge status={item.status_operacional}/></td>
            <td><span className="operacao-cell-main">{item.pagamentos_match==='NAO_ENCONTRADO'?'Não encontrado':item.pagamentos_situacao||'Situação nula'}</span><small>{item.pagamentos_match==='VALOR'?'Correspondência por valor':item.pagamentos_match==='PASTA'?'Correspondência por pasta':item.pagamentos_match==='PROCESSO'?'Pasta resolvida pelo processo':'Sem correspondência'}</small></td>
            <td><span className="operacao-cell-main">{item.provision_status||'Aguardando'}</span><small>{item.benner_identifier||item.identificador_input||'Identificador automático'} · {money(item.provision_amount??item.valor_input)}</small></td>
            <td><span className="operacao-cell-main">{receiptLabel(item)}</span><small>{item.receipt_filename||'—'}</small></td>
            <td><span className="protocolos-date">{dateTime(item.automation_updated_at||item.updated_at)}</span></td>
          </tr>)}
        </tbody>
      </table>
    </div>
    {!loading && visible.length>0?<footer className="protocolos-pagination"><span>{number(start+1)}–{number(end)} de {number(visible.length)}</span><div className="protocolos-pagination-controls"><button type="button" onClick={()=>setPage(value=>Math.max(1,value-1))} disabled={currentPage<=1} aria-label="Página anterior"><ChevronLeft size={14}/></button>{links.map((value,index)=>value==='ellipsis'?<span key={'ellipsis-'+index}>…</span>:<button key={value} type="button" className={currentPage===value?'active':''} onClick={()=>setPage(value)} aria-current={currentPage===value?'page':undefined}>{value}</button>)}<button type="button" onClick={()=>setPage(value=>Math.min(pageCount,value+1))} disabled={currentPage>=pageCount} aria-label="Próxima página"><ChevronRight size={14}/></button></div></footer>:null}
  </section>;
}

function PagamentosPage() {
  const [summary,setSummary]=useState<PagamentoOperacaoSummary|null>(null);
  const [items,setItems]=useState<PagamentoOperacaoItem[]>([]);
  const [file,setFile]=useState<File|null>(null);
  const [loading,setLoading]=useState(true);
  const [importBusy,setImportBusy]=useState(false);
  const [startBusy,setStartBusy]=useState(false);
  const [error,setError]=useState('');
  const [feedback,setFeedback]=useState('');
  const [canView,setCanView]=useState(false);
  const [canImport,setCanImport]=useState(false);
  const [canRun,setCanRun]=useState(false);
  const inFlight=useRef(false);

  const refresh=useCallback(async()=>{
    if(inFlight.current)return;
    inFlight.current=true;
    try{
      const [nextSummary,nextItems]=await Promise.all([getPagamentoOperacaoSummary(),getPagamentoOperacaoItems()]);
      setSummary(nextSummary);setItems(nextItems);setError('');
    }catch(cause){
      setError(cause instanceof Error?cause.message:'Não foi possível consultar Pagamentos.');
      setSummary(current=>current?{...current,session:{state:'unknown'}}:null);
    }finally{inFlight.current=false;setLoading(false);}
  },[]);

  useEffect(()=>{
    const permissions=()=>{
      const current=(window as Window & {MBA_CURRENT_USER?:{permissions?:Record<string,boolean>}}).MBA_CURRENT_USER?.permissions||{};
      const view=current['pagamentos.view']===true;
      setCanView(view);setCanImport(current['pagamentos.import']===true);setCanRun(current['automations.run']===true);
      if(view)void refresh();else setLoading(false);
    };
    permissions();window.addEventListener('mba:authenticated',permissions);return()=>window.removeEventListener('mba:authenticated',permissions);
  },[refresh]);

  useEffect(()=>{
    if(!canView)return;
    const timer=window.setInterval(()=>{if(!document.hidden)void refresh();},5000);
    return()=>window.clearInterval(timer);
  },[canView,refresh]);

  const importFile=async()=>{
    if(!file||!canImport||importBusy)return;
    setImportBusy(true);setFeedback('');setError('');
    try{
      const result=await importPagamentoOperacao(file);
      const queue=result.automation_dispatched?'Automação enviada para a fila.':'Base importada; a automação ainda não entrou na fila.';
      setFeedback(number(result.rows_imported)+' importados · '+number(result.concluded)+' concluídos por ausência no novo input · '+number(result.reactivated)+' reativados. '+queue);
      setFile(null);await refresh();
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível importar a base.');}
    finally{setImportBusy(false);}
  };

  const start=async()=>{
    if(!canRun||startBusy)return;
    setStartBusy(true);setError('');
    try{
      const result=await startPagamentoOperacao();
      setFeedback(result.started?number(result.total)+' casos enviados para a fila.':'Não há casos pendentes para iniciar.');
      await refresh();
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível iniciar a fila.');}
    finally{setStartBusy(false);}
  };

  if(!canView&&!loading)return <div className="protocolos-empty"><strong>Sem acesso a Operação / Pagamentos</strong></div>;

  const state=startBusy?'starting':summary?.session?.state||'idle';
  const busy=['starting','authenticating','in_use'].includes(state);
  const queueTotal=Number(summary?.queues?.provision||0)+Number(summary?.queues?.receipt||0);

  return <div className="protocolos-page-react operacao-pagamentos-page">
    <header className="protocolos-header"><div><span className="protocolos-eyebrow">OPERAÇÃO</span><h1>Pagamentos</h1></div></header>
    {error?<div className="protocolos-alert error" role="alert"><AlertTriangle size={16}/><span>{error}</span></div>:null}

    <section className="protocolos-session-bar" aria-label="Status do backend">
      <div className="protocolos-session-copy"><span>Status do backend</span><strong className={'protocolos-session-state '+state} aria-live="polite"><i aria-hidden="true"/>{loading?'Consultando status…':AUTOMATION_LABELS[state]||AUTOMATION_LABELS.unknown}</strong><small>{queueTotal?number(queueTotal)+' item(ns) nas filas Benner':summary?.session?.updated_at?'Última atividade: '+dateTime(summary.session.updated_at):'Nenhuma execução recente'}</small></div>
      <button type="button" className="protocolos-button primary protocolos-start-button" disabled={!canRun||startBusy||busy||loading||!summary?.importacao} onClick={()=>void start()}>{startBusy?<LoaderCircle className="spin" size={15}/>:<Play size={15}/>}Processar fila</button>
    </section>

    <div className="protocolos-intake-grid-react operacao-single-intake">
      <article className="protocolos-card protocolos-upload-card">
        <header><span className="protocolos-card-icon"><FileSpreadsheet size={18}/></span><div><h3>Input de pagamentos</h3><small className="operacao-card-subtitle">PROCESSO e PASTA podem ser alternativos; IDENTIFICADOR e VALOR são opcionais.</small></div></header>
        <UploadField file={file} onChange={setFile} disabled={!canImport||importBusy||busy}/>
        <div className="protocolos-card-footer">
          <div className="protocolos-import-line"><span>Última importação:</span><span>{dateTime(summary?.importacao?.completed_at||summary?.importacao?.created_at)}</span>{summary?.importacao?<><i>·</i><strong>{number(summary.importacao.valid_rows)} no arquivo</strong></>:null}</div>
          <button type="button" className="protocolos-button primary" disabled={!canImport||!file||importBusy||busy} onClick={()=>void importFile()}>{importBusy?<LoaderCircle className="spin" size={15}/>:<UploadCloud size={15}/>}Importar base</button>
        </div>
        {feedback?<p className="protocolos-feedback" role="status">{feedback}</p>:null}
      </article>
    </div>

    <PagamentosQueue summary={summary} items={items} loading={loading}/>
  </div>;
}



type OperationModule = 'pagamentos' | 'liminar' | 'encerramentos' | 'protocolos' | 'defesas';
type OperationVisibility = Record<OperationModule, boolean>;

export function OperacaoPage() {
  const [module, setModule] = useState<OperationModule>('pagamentos');
  const [allowed, setAllowed] = useState<OperationVisibility>({
    pagamentos: false, liminar: false, encerramentos: false, protocolos: false, defesas: false,
  });

  useEffect(() => {
    const sync = () => {
      const shell = window as Window & {
        MBA_CURRENT_USER?: { permissions?: Record<string, boolean> };
        MBA_PORTFOLIO_POLICY?: { canAccess: (pageId: string) => boolean };
      };
      const permissions = shell.MBA_CURRENT_USER?.permissions || {};
      // O filtro por carteira vem da policy existente. Uma permissão isolada
      // nunca deve abrir Protocolos ou Defesas em carteiras sem esse módulo.
      const canAccessProtocols = shell.MBA_PORTFOLIO_POLICY?.canAccess('protocolo') === true;
      const next: OperationVisibility = {
        pagamentos: permissions['pagamentos.view'] === true,
        liminar: permissions['tutelas.view'] === true,
        encerramentos: permissions['encerramentos.view'] === true,
        protocolos: canAccessProtocols,
        defesas: canAccessProtocols,
      };
      setAllowed(next);
      setModule(previous => next[previous] ? previous :
        (['pagamentos', 'liminar', 'encerramentos', 'protocolos', 'defesas'] as OperationModule[])
          .find(key => next[key]) || 'pagamentos');
    };
    sync();
    window.addEventListener('mba:authenticated', sync);
    window.addEventListener('mba:profile-ready', sync);
    window.addEventListener('mba:portfolio-changed', sync);
    return () => {
      window.removeEventListener('mba:authenticated', sync);
      window.removeEventListener('mba:profile-ready', sync);
      window.removeEventListener('mba:portfolio-changed', sync);
    };
  }, []);

  return <div className="operacao-module-shell">
    <nav className="mba-operation-subnav operacao-module-subnav" aria-label="Fluxos de Operação">
      {allowed.pagamentos ? <button type="button" className={module === 'pagamentos' ? 'active' : ''} aria-current={module === 'pagamentos' ? 'page' : undefined} onClick={() => setModule('pagamentos')}>Pagamentos</button> : null}
      {allowed.liminar ? <button type="button" className={module === 'liminar' ? 'active' : ''} aria-current={module === 'liminar' ? 'page' : undefined} onClick={() => setModule('liminar')}>Liminar</button> : null}
      {allowed.encerramentos ? <button type="button" className={module === 'encerramentos' ? 'active' : ''} aria-current={module === 'encerramentos' ? 'page' : undefined} onClick={() => setModule('encerramentos')}>Encerramentos</button> : null}
      {allowed.protocolos ? <button type="button" className={module === 'protocolos' ? 'active' : ''} aria-current={module === 'protocolos' ? 'page' : undefined} onClick={() => setModule('protocolos')}>Protocolos</button> : null}
      {allowed.defesas ? <button type="button" className={module === 'defesas' ? 'active' : ''} aria-current={module === 'defesas' ? 'page' : undefined} onClick={() => setModule('defesas')}>Defesas</button> : null}
    </nav>
    {module === 'pagamentos' && allowed.pagamentos ? <PagamentosPage/> :
      module === 'liminar' && allowed.liminar ? <OperacaoLiminarPage/> :
      module === 'encerramentos' && allowed.encerramentos ? <OperacaoEncerramentosPage/> :
      module === 'protocolos' && allowed.protocolos ? <ProtocolosPage/> :
      module === 'defesas' && allowed.defesas ? <DefesasPage/> :
      <div className="protocolos-empty">Nenhum fluxo autorizado nesta carteira.</div>}
  </div>;
}
