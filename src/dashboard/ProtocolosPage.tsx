import './operationalWorkspace.css';
import { useCallback, useEffect, useRef, useState } from 'react';
import { AlertTriangle, FileSpreadsheet, Files, LoaderCircle, Play, UploadCloud, X } from 'lucide-react';
import { getProtocoloSummary, importDocuments, startProtocoloRun, uploadProtocolDocuments, type ProtocoloSummary } from './protocoloService';

const number = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
const dateTime = (value?: string | null) => value && !Number.isNaN(new Date(value).getTime()) ? new Intl.DateTimeFormat('pt-BR',{dateStyle:'short',timeStyle:'short'}).format(new Date(value)) : 'Nenhuma importação';
const fileSize = (bytes: number) => `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
const AUTOMATION_LABELS: Record<string,string> = {idle:'Aguardando execução',starting:'Iniciando…',authenticating:'Fazendo login…',connected:'Pronto para executar',in_use:'Em produção',lost:'Erro de sessão',error:'Em erro',unknown:'Status indisponível'};

function UploadField({files,onChange,documents=false,disabled=false}: {files:File[];onChange:(files:File[])=>void;documents?:boolean;disabled?:boolean}) {
  const input = useRef<HTMLInputElement>(null);
  const [dragging,setDragging] = useState(false);
  const [error,setError] = useState('');
  const accept = (incoming:FileList|File[]) => {
    const next = Array.from(incoming);
    if (!next.length) return;
    if (next.some(file=>!new RegExp(documents?'\\.(pdf|docx)$':'\\.xlsx$','i').test(file.name))) {
      setError(documents?'Selecione apenas arquivos PDF ou DOCX.':'Selecione uma planilha XLSX.'); return;
    }
    if (!documents && next.length !== 1) { setError('Selecione uma única planilha.'); return; }
    setError('');
    const combined=documents?[...files,...next]:next;
    onChange(combined.filter((file,index)=>combined.findIndex(other=>other.name===file.name && other.size===file.size && other.lastModified===file.lastModified)===index));
    if(input.current) input.current.value='';
  };
  return <div className="protocolos-upload-field">
    <input ref={input} type="file" aria-label={documents?'Selecionar documentos':'Selecionar correspondências'} multiple={documents} accept={documents?'.pdf,.docx':'.xlsx'} disabled={disabled} onChange={event=>accept(event.target.files||[])}/>
    <button type="button" disabled={disabled} className={`protocolos-modern-drop ${dragging?'is-dragging':''}`} onClick={()=>input.current?.click()} onDragOver={event=>{event.preventDefault();if(!disabled)setDragging(true);}} onDragLeave={()=>setDragging(false)} onDrop={event=>{event.preventDefault();setDragging(false);if(!disabled)accept(event.dataTransfer.files);}}>
      <span className="protocolos-drop-icon"><UploadCloud size={17}/></span><span className="protocolos-drop-copy"><strong>{documents?'Selecione ou arraste os documentos':'Selecione ou arraste a planilha'}</strong><small>{documents?'PDF e DOCX · envio em lote para a VPS':'XLSX com CNJ, tipo e nome do arquivo'}</small></span>
    </button>
    {files.length>0?<div className="protocolos-upload-selection"><div className="protocolos-import-line"><strong>{number(files.length)} arquivo{files.length===1?'':'s'}</strong><span>{fileSize(files.reduce((sum,file)=>sum+file.size,0))}</span></div>{files.map((file,index)=><div className="protocolos-selected-file" key={`${file.name}-${index}`}><span className="protocolos-file-copy"><strong>{file.name}</strong><small>{fileSize(file.size)}</small></span><button type="button" disabled={disabled} aria-label={`Remover ${file.name}`} onClick={()=>onChange(files.filter((_,i)=>i!==index))}><X size={15}/></button></div>)}</div>:null}
    {error?<p className="protocolos-feedback danger" role="alert">{error}</p>:null}
  </div>;
}

export function ProtocolosPage() {
  const [summary,setSummary]=useState<ProtocoloSummary|null>(null);
  const [canView,setCanView]=useState(false),[canRun,setCanRun]=useState(false);
  const [loading,setLoading]=useState(true),[error,setError]=useState('');
  const [relation,setRelation]=useState<File[]>([]),[documents,setDocuments]=useState<File[]>([]);
  const [relationBusy,setRelationBusy]=useState(false),[uploadBusy,setUploadBusy]=useState(false),[startBusy,setStartBusy]=useState(false);
  const [relationFeedback,setRelationFeedback]=useState(''),[uploadFeedback,setUploadFeedback]=useState('');
  const [relationError,setRelationError]=useState(false),[uploadError,setUploadError]=useState(false);
  const inFlight=useRef(false);
  const refresh=useCallback(async()=>{
    if(inFlight.current) return;
    inFlight.current=true;
    try {setSummary(await getProtocoloSummary());setError('');}
    catch(cause){setSummary(current=>current?{...current,session:{state:'unknown'}}:null);setError(cause instanceof Error?cause.message:'Não foi possível consultar a automação.');}
    finally{inFlight.current=false;setLoading(false);}
  },[]);
  useEffect(()=>{
    const permissions=()=>{
      const current=(window as Window & {MBA_CURRENT_USER?:{permissions?:Record<string,boolean>}}).MBA_CURRENT_USER?.permissions||{};
      setCanView(current['automations.view']===true);setCanRun(current['automations.run']===true);
      if(current['automations.view'])void refresh();else setLoading(false);
    };
    permissions();window.addEventListener('mba:authenticated',permissions);return()=>window.removeEventListener('mba:authenticated',permissions);
  },[refresh]);
  useEffect(()=>{
    if(!canView)return;
    const timer=window.setInterval(()=>{if(!document.hidden)void refresh();},5000);
    return()=>window.clearInterval(timer);
  },[canView,refresh]);
  const importRelation=async()=>{
    if(!canRun||!relation[0]||relationBusy)return;
    setRelationBusy(true);setRelationFeedback('');setRelationError(false);
    try {const result=await importDocuments(relation[0]);setRelationFeedback(`${number(result.stored)} documentos relacionados · ${number(result.missing)} arquivos ausentes · ${number(result.errors)} erros.`);setRelation([]);await refresh();}
    catch(cause){setRelationError(true);setRelationFeedback(cause instanceof Error?cause.message:'Não foi possível importar as correspondências.');}
    finally{setRelationBusy(false);}
  };
  const upload=async()=>{
    if(!canRun||!documents.length||uploadBusy)return;
    setUploadBusy(true);setUploadFeedback('');setUploadError(false);
    let stored=0,duplicates=0;
    const pending=[...documents];
    try {
      // One file per request avoids exceeding the proxy's total-body limit.
      while(pending.length){const result=await uploadProtocolDocuments([pending[0]]);stored+=result.stored;duplicates+=result.duplicates;pending.shift();setDocuments([...pending]);}
      setUploadFeedback(`${number(stored)} arquivos enviados à VPS · ${number(duplicates)} já existentes. Importe as correspondências para associá-los.`);await refresh();
    }catch(cause){setUploadError(true);setUploadFeedback(`${number(stored)} enviados · ${number(pending.length)} pendentes. ${cause instanceof Error?cause.message:'Falha no envio.'}`);}
    finally{setUploadBusy(false);}
  };
  const start=async()=>{
    if(!canRun||startBusy)return;setStartBusy(true);setError('');
    try{await startProtocoloRun();await refresh();}catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível iniciar a automação.');}finally{setStartBusy(false);}
  };
  if(!canView&&!loading)return <div className="protocolos-empty"><strong>Sem acesso a Protocolos</strong></div>;
  const state=startBusy?'starting':summary?.session?.state||'unknown';
  const busy=['starting','authenticating','connected','in_use'].includes(state);
  return <div className="protocolos-page-react">
    <header className="protocolos-header"><div><span className="protocolos-eyebrow">CONTROLADORIA</span><h1>Protocolos</h1></div></header>
    {error?<div className="protocolos-alert error" role="alert"><AlertTriangle size={16}/><span>{error}</span></div>:null}
    <div className="protocolos-intake-grid-react">
      <article className="protocolos-card protocolos-upload-card"><header><span className="protocolos-card-icon"><FileSpreadsheet size={18}/></span><h3>Correspondências</h3></header>
        <UploadField files={relation} onChange={setRelation} disabled={!canRun||relationBusy}/>
        <div className="protocolos-card-footer"><div className="protocolos-import-line"><span>Última importação:</span><span>{dateTime(summary?.documents?.completed_at||summary?.documents?.created_at)}</span></div><button type="button" className="protocolos-button primary" disabled={!canRun||!relation.length||relationBusy} onClick={()=>void importRelation()}>{relationBusy?<LoaderCircle className="spin" size={15}/>:<FileSpreadsheet size={15}/>}Importar correspondências</button></div>
        {relationFeedback?<p className={`protocolos-feedback ${relationError?'danger':''}`} role={relationError?'alert':'status'}>{relationFeedback}</p>:null}
      </article>
      <article className="protocolos-card protocolos-upload-card"><header><span className="protocolos-card-icon"><Files size={18}/></span><h3>Documentos</h3></header>
        <UploadField files={documents} onChange={setDocuments} documents disabled={!canRun||uploadBusy}/>
        <div className="protocolos-card-footer"><span className="protocolos-import-line">Envio para o repositório da VPS</span><button type="button" className="protocolos-button primary" disabled={!canRun||!documents.length||uploadBusy} onClick={()=>void upload()}>{uploadBusy?<LoaderCircle className="spin" size={15}/>:<UploadCloud size={15}/>}Enviar documentos</button></div>
        {uploadFeedback?<p className={`protocolos-feedback ${uploadError?'danger':''}`} role={uploadError?'alert':'status'}>{uploadFeedback}</p>:null}
      </article>
    </div>
    <section className="protocolos-session-bar" aria-label="Status da automação"><div className="protocolos-session-copy"><span>Status da automação</span><strong className={`protocolos-session-state ${state}`} aria-live="polite"><i aria-hidden="true"/>{loading?'Consultando status…':AUTOMATION_LABELS[state]||AUTOMATION_LABELS.unknown}</strong></div><button type="button" className="protocolos-button primary protocolos-start-button" disabled={!canRun||startBusy||busy||loading} onClick={()=>void start()}>{startBusy?<LoaderCircle className="spin" size={15}/>:<Play size={15}/>}Iniciar</button></section>
  </div>;
}
