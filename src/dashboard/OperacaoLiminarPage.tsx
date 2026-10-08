import {useCallback,useEffect,useRef,useState} from 'react';
import {AlertTriangle, CheckCircle2, ChevronLeft, ChevronRight, Clock3, Download, FileSpreadsheet, FileText, LoaderCircle, RefreshCcw, Search, UploadCloud, X} from 'lucide-react';
import {
  exportarLiminar, getLiminarLista, getLiminarResumo, importarLiminar,
  type LiminarClassificacao, type LiminarItem, type LiminarLista, type LiminarResumo,
} from './operacaoLiminarService';

type Status = LiminarClassificacao|'ALL';
const STATUSES:{key:Status;label:string;tone:string;icon:typeof Clock3}[]=[
  {key:'ALL',label:'Total',tone:'',icon:FileSpreadsheet},
  {key:'sem_decisao',label:'Sem decisão',tone:'',icon:Clock3},
  {key:'deferido',label:'Deferido',tone:'',icon:CheckCircle2},
  {key:'indeferido',label:'Indeferido',tone:'',icon:AlertTriangle},
  {key:'com_sentenca',label:'Com sentença',tone:'',icon:FileText},
];
const number=(v:number|undefined)=>new Intl.NumberFormat('pt-BR').format(Number(v||0));
const dateTime=(v?:string|null)=>v?new Date(v).toLocaleString('pt-BR'):'—';
const statusLabel=(value:LiminarClassificacao)=>STATUSES.find(s=>s.key===value)?.label||value;
const sourceLabel=(row:LiminarItem)=>row.historico_encontrado?(row.fonte||'Histórico identificado'):'Sem histórico';
const readPermission=(key:string)=>Boolean(
  (window as Window&{MBA_CURRENT_USER?:{permissions?:Record<string,boolean>}}).MBA_CURRENT_USER?.permissions?.[key]
);

export function OperacaoLiminarPage() {
  const [summary,setSummary]=useState<LiminarResumo|null>(null);
  const [list,setList]=useState<LiminarLista>({rows:[],total:0,page:1,page_size:10,importacao:null});
  const [status,setStatus]=useState<Status>('ALL');
  const [page,setPage]=useState(1);
  const [pageSize,setPageSize]=useState(10);
  const [query,setQuery]=useState('');
  const [appliedQuery,setAppliedQuery]=useState('');
  const [file,setFile]=useState<File|null>(null);
  const [loading,setLoading]=useState(true);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState('');
  const [feedback,setFeedback]=useState('');
  const [portfolioRevision,setPortfolioRevision]=useState(0);
  const [canView,setCanView]=useState(false);
  const [canImport,setCanImport]=useState(false);
  const fileInput=useRef<HTMLInputElement|null>(null);
  const requestId=useRef(0);

  const refresh=useCallback(async()=>{
    if(!readPermission('tutelas.view')){setLoading(false);return;}
    const sequence=++requestId.current;
    setLoading(true);
    try {
      const [s,l]=await Promise.all([getLiminarResumo(),getLiminarLista(status,page,pageSize,appliedQuery)]);
      if(sequence!==requestId.current)return;
      setSummary(s);setList(l);setError('');
    }catch(cause){
      if(sequence!==requestId.current)return;
      setError(cause instanceof Error?cause.message:'Não foi possível carregar a base de Liminar.');
    }finally{if(sequence===requestId.current)setLoading(false);}
  },[status,page,pageSize,appliedQuery,portfolioRevision]);

  useEffect(()=>{
    const sync=()=>{
      setCanView(readPermission('tutelas.view'));
      setPortfolioRevision(previous=>previous+1);
      setCanImport(readPermission('tutelas.import'));
      setPage(1);setStatus('ALL');setQuery('');setAppliedQuery('');setFile(null);
      setSummary(null);setList({rows:[],total:0,page:1,page_size:10,importacao:null});
      requestId.current++;
    };
    sync();
    window.addEventListener('mba:authenticated',sync);
    window.addEventListener('mba:portfolio-changed',sync);
    return()=>{window.removeEventListener('mba:authenticated',sync);window.removeEventListener('mba:portfolio-changed',sync);};
  },[]);
  useEffect(()=>{if(canView)void refresh();},[canView,refresh]);

  const submit=async()=>{
    if(!file||!canImport||busy)return;
    if(!/\.(xlsx|csv)$/i.test(file.name)){setError('Envie um XLSX ou CSV.');return;}
    if(file.size>8*1024*1024){setError('O arquivo não pode exceder 8 MB.');return;}
    setBusy(true);setError('');setFeedback('');
    try{
      const result=await importarLiminar(file);
      setFeedback(number(result.total)+' processos importados e cruzados com o histórico. '+number(result.invalidos)+' inválidos · '+number(result.duplicados)+' duplicados. Nenhum scraping foi iniciado.');
      setFile(null);setPage(1);setStatus('ALL');setAppliedQuery('');setQuery('');
      await refresh();
    }catch(cause){setError(cause instanceof Error?cause.message:'Erro ao importar a base.');}
    finally{setBusy(false);}
  };

  const pages=Math.max(1,Math.ceil(list.total/pageSize));
  if(!canView&&!loading)return <div className="protocolos-empty"><strong>Sem acesso a Operação / Liminar</strong></div>;

  return <div className="protocolos-page-react operacao-pagamentos-page operacao-liminar-page">
    <header className="protocolos-header"><div><span className="protocolos-eyebrow">OPERAÇÃO</span><h1>Liminar</h1></div></header>
    {error?<div className="protocolos-alert error" role="alert"><AlertTriangle size={16}/><span>{error}</span></div>:null}
    <section className="protocolos-session-bar" aria-label="Status do backend">
      <div className="protocolos-session-copy">
        <span>Status do backend</span>
        <strong className={'protocolos-session-state '+(error?'error':'connected')}><i aria-hidden="true"/>{loading?'Consultando histórico…':'Cruzamento histórico disponível'}</strong>
        <small>Reutiliza correspondências já registradas no DataJud{(window as Window&{MBA_API?:{getPortfolioId?:()=>string}}).MBA_API?.getPortfolioId?.().endsWith('_enter')?' e na Enter':''}. Não executa worker nem consulta externa.</small>
      </div>
      <button type="button" className="protocolos-button secondary" disabled={busy||loading} onClick={()=>void refresh()}><RefreshCcw size={14}/>Atualizar</button>
    </section>

    <section className="protocolos-intake-grid-react operacao-single-intake">
      <article className="protocolos-card protocolos-upload-card">
        <header><span className="protocolos-card-icon"><FileSpreadsheet size={18}/></span><div><h3>Input de processos</h3><small className="operacao-card-subtitle">CSV ou XLSX com coluna CNJ ou Número do processo · somente cruzamento com histórico existente.</small></div></header>
        <input ref={fileInput} type="file" accept=".xlsx,.csv" hidden onChange={event=>setFile(event.target.files?.[0]||null)} aria-label="Selecionar processos"/>
        <button type="button" className="protocolos-modern-drop" disabled={!canImport||busy} onClick={()=>fileInput.current?.click()}>
          <UploadCloud size={21}/><span>Selecionar planilha de processos</span><small>CSV ou XLSX · até 8 MB</small>
        </button>
        {file?<div className="protocolos-selected-file"><span className="protocolos-file-copy"><strong>{file.name}</strong><small>{number(file.size)} bytes</small></span><button type="button" disabled={busy} aria-label="Remover arquivo" onClick={()=>{setFile(null);if(fileInput.current)fileInput.current.value='';}}><X size={15}/></button></div>:null}
        <div className="protocolos-card-footer">
          <div className="protocolos-import-line"><span>Última importação:</span><span>{dateTime(summary?.importacao?.completed_at)}</span>{summary?.importacao?<><i>·</i><strong>{number(summary.importacao.total)} processos</strong></>:null}</div>
          <button type="button" className="protocolos-button primary" disabled={!canImport||!file||busy} onClick={()=>void submit()}>{busy?<LoaderCircle className="spin" size={15}/>:<UploadCloud size={15}/>}Importar base</button>
        </div>
        {feedback?<p className="protocolos-feedback" role="status">{feedback}</p>:null}
      </article>
    </section>

    <section className="protocolos-card protocolos-workspace operacao-workspace">
      <header className="protocolos-workspace-head"><div><h2>Base operacional</h2><p>Resultados preliminares obtidos dos históricos; a confirmação jurídica permanece com os analistas.</p></div></header>
      <div className="protocolos-status-strip-react operacao-liminar-status" role="tablist" aria-label="Classificações de liminar">
        {STATUSES.map(item=>{
          const Icon=item.icon;
          return <button type="button" role="tab" aria-selected={status===item.key} key={item.key} className={status===item.key?'active':''} onClick={()=>{setStatus(item.key);setPage(1);}}>
            <Icon size={13}/><span>{item.label}</span><strong>{number(item.key==='ALL'?summary?.cards.total:summary?.cards[item.key])}</strong>
          </button>;
        })}
      </div>
      <div className="protocolos-toolbar">
        <form className="protocolos-search" onSubmit={event=>{event.preventDefault();setAppliedQuery(query);setPage(1);}}>
          <Search size={15}/><input value={query} onChange={event=>setQuery(event.target.value)} placeholder="Buscar pelo CNJ…" aria-label="Buscar liminares"/>
          <button type="submit" aria-label="Pesquisar">Buscar</button>
        </form>
        <div className="protocolos-toolbar-actions">
          <button type="button" className="protocolos-button secondary operacao-download-button" disabled={!summary?.importacao||busy||loading} onClick={()=>void exportarLiminar(status).catch(e=>setError(e instanceof Error?e.message:'Erro ao exportar.'))}><Download size={14}/>Baixar</button>
          <label className="protocolos-page-size"><span>Exibir</span><select value={pageSize} onChange={event=>{setPageSize(Number(event.target.value));setPage(1);}}>{[10,50,100].map(n=><option key={n} value={n}>{n}</option>)}</select></label>
        </div>
      </div>
      <div className="protocolos-table-wrap">
        <table className="protocolos-table-react operacao-liminar-table">
          <thead><tr><th>Processo</th><th>Classificação</th><th>Histórico</th><th>Fonte</th><th>Evidência encontrada</th></tr></thead>
          <tbody>
            {loading?<tr><td colSpan={5}><div className="protocolos-empty"><LoaderCircle className="spin" size={20}/><strong>Consultando base</strong></div></td></tr>:null}
            {!loading&&!list.rows.length?<tr><td colSpan={5}><div className="protocolos-empty"><Clock3 size={20}/><strong>Nenhum resultado</strong><span>Importe uma planilha ou altere os filtros.</span></div></td></tr>:null}
            {!loading&&list.rows.map(row=><tr key={row.id}>
              <td><strong className="protocolos-cnj">{row.cnj}</strong></td>
              <td><span className="operacao-cell-main">{statusLabel(row.classificacao)}</span></td>
              <td><span className="operacao-cell-main">{row.historico_encontrado?'Identificado':'Não localizado'}</span><small>{row.historico_encontrado?'Correspondência anterior':'Nenhum registro reutilizável'}</small></td>
              <td><span className="operacao-cell-main">{sourceLabel(row)}</span></td>
              <td><span className="operacao-cell-main operacao-liminar-evidencia" title={row.evidencia?.texto||''}>{row.evidencia?.texto||'—'}</span><small>{row.evidencia?.data||''}</small></td>
            </tr>)}
          </tbody>
        </table>
      </div>
      {!loading&&list.total>0?<footer className="protocolos-pagination">
        <span>{number((page-1)*pageSize+1)}–{number(Math.min(page*pageSize,list.total))} de {number(list.total)}</span>
        <div className="protocolos-pagination-controls">
          <button type="button" disabled={page===1} onClick={()=>setPage(p=>Math.max(1,p-1))} aria-label="Página anterior"><ChevronLeft size={14}/></button>
          <span>Página {page} de {pages}</span>
          <button type="button" disabled={page>=pages} onClick={()=>setPage(p=>Math.min(pages,p+1))} aria-label="Próxima página"><ChevronRight size={14}/></button>
        </div>
      </footer>:null}
    </section>
  </div>;
}
