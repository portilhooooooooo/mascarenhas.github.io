import { AlertTriangle, CheckCircle2, Download, FileCheck2, FileSpreadsheet, Files, LoaderCircle, Play, UploadCloud, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { MetabaseProtocolosEmbed } from './MetabaseProtocolosEmbed';
import {
  downloadProtocoloExceptions,
  importControladoria,
  importDocuments,
  startProtocoloRun,
  type DocumentImportResult,
} from './protocoloService';

const number = (value: number | undefined | null) => new Intl.NumberFormat('pt-BR').format(Number(value || 0));
const fileSize = (bytes: number) => bytes < 1024 * 1024
  ? `${Math.max(1, Math.round(bytes / 1024))} KB`
  : `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;

function userPermissions() {
  return (window as Window & { MBA_CURRENT_USER?: { permissions?: Record<string, boolean> } }).MBA_CURRENT_USER?.permissions || {};
}

function UploadField({ prompt, helper, files, onChange }: { prompt: string; helper: string; files: File[]; onChange: (files: File[]) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const selected = files[0];
  const acceptFiles = (next: FileList | File[]) => {
    const file = Array.from(next)[0];
    if (file) onChange([file]);
  };

  return <div className={`protocolos-upload-field ${selected ? 'has-file' : ''}`}>
    <input ref={inputRef} type="file" accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" onChange={event => acceptFiles(event.target.files || [])}/>
    <button type="button" className={`protocolos-modern-drop ${dragging ? 'is-dragging' : ''}`} onClick={() => inputRef.current?.click()}
      onDragEnter={event => { event.preventDefault(); setDragging(true); }} onDragOver={event => { event.preventDefault(); setDragging(true); }}
      onDragLeave={event => { event.preventDefault(); setDragging(false); }} onDrop={event => { event.preventDefault(); setDragging(false); acceptFiles(event.dataTransfer.files); }}>
      <span className="protocolos-drop-icon"><UploadCloud size={17}/></span>
      <span className="protocolos-drop-copy"><strong>{prompt}</strong><small>{helper}</small></span>
    </button>
    {selected && <div className="protocolos-selected-file">
      <span className="protocolos-file-icon"><FileSpreadsheet size={16}/></span>
      <span className="protocolos-file-copy"><strong>{selected.name}</strong><small>{fileSize(selected.size)}</small></span>
      <span className="protocolos-file-ready"><CheckCircle2 size={15}/>Pronto</span>
      <button type="button" aria-label="Remover arquivo" onClick={() => { onChange([]); if (inputRef.current) inputRef.current.value = ''; }}><X size={15}/></button>
    </div>}
  </div>;
}

function importResultText(result: DocumentImportResult) {
  const parts = [`${number(result.stored)} armazenado${result.stored === 1 ? '' : 's'}`, `${number(result.ignored)} ignorado${result.ignored === 1 ? '' : 's'}`];
  if (result.missing) parts.push(`${number(result.missing)} sem arquivo`);
  if (result.errors) parts.push(`${number(result.errors)} erro${result.errors === 1 ? '' : 's'}`);
  if (result.zipped) parts.push(`${number(result.zipped)} ZIP${result.zipped === 1 ? '' : 's'}`);
  return parts.join(' · ');
}

export function ProtocolosPage() {
  const [canView, setCanView] = useState(false);
  const [canRun, setCanRun] = useState(false);
  const [controlFile, setControlFile] = useState<File[]>([]);
  const [relationFile, setRelationFile] = useState<File[]>([]);
  const [controlBusy, setControlBusy] = useState(false);
  const [documentsBusy, setDocumentsBusy] = useState(false);
  const [startBusy, setStartBusy] = useState(false);
  const [downloadBusy, setDownloadBusy] = useState(false);
  const [controlFeedback, setControlFeedback] = useState('');
  const [documentsFeedback, setDocumentsFeedback] = useState('');
  const [runFeedback, setRunFeedback] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const syncPermissions = () => {
      const permissions = userPermissions();
      setCanView(permissions['automations.view'] === true);
      setCanRun(permissions['automations.run'] === true);
    };
    syncPermissions();
    window.addEventListener('mba:authenticated', syncPermissions);
    return () => window.removeEventListener('mba:authenticated', syncPermissions);
  }, []);

  const handleControladoria = async () => {
    if (!controlFile[0] || controlBusy) return;
    setControlBusy(true); setControlFeedback(''); setError('');
    try {
      const result = await importControladoria(controlFile[0]);
      setControlFeedback(`${number(result.protocol_tasks)} tarefa${result.protocol_tasks === 1 ? '' : 's'} encontrada${result.protocol_tasks === 1 ? '' : 's'}.`);
      setControlFile([]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível importar a base.'); }
    finally { setControlBusy(false); }
  };

  const handleDocuments = async () => {
    if (!relationFile[0] || documentsBusy) return;
    setDocumentsBusy(true); setDocumentsFeedback(''); setError('');
    try {
      const result = await importDocuments(relationFile[0]);
      setDocumentsFeedback(`Relação processada · ${importResultText(result)}.`);
      setRelationFile([]);
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível processar a relação de documentos.'); }
    finally { setDocumentsBusy(false); }
  };

  const handleStart = async () => {
    if (!canRun || startBusy) return;
    setStartBusy(true); setRunFeedback(''); setError('');
    try {
      const result = await startProtocoloRun();
      setRunFeedback(result.total ? `${number(result.total)} protocolo${result.total === 1 ? '' : 's'} encaminhado${result.total === 1 ? '' : 's'} para execução.` : 'Agente ativado. Não havia novos protocolos aptos neste momento.');
    } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível iniciar a execução dos protocolos.'); }
    finally { setStartBusy(false); }
  };

  const handleDownload = async () => {
    setDownloadBusy(true); setError('');
    try { await downloadProtocoloExceptions(); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível baixar as exceções.'); }
    finally { setDownloadBusy(false); }
  };

  return <div className="protocolos-page-react">
    <nav className="controladoria-subnav" aria-label="Módulos de Controladoria"><button type="button" className="active">Protocolos</button><button type="button" disabled>Liminar</button><button type="button" disabled>Contestação</button></nav>
    <header className="protocolos-header">
      <div><span className="protocolos-eyebrow">CONTROLADORIA</span><h1>Protocolos</h1><p>Importe os insumos, execute o agente e acompanhe os resultados no Metabase.</p></div>
      <div className="protocolos-header-actions">
        <button type="button" className="protocolos-button secondary" onClick={handleDownload} disabled={downloadBusy}>{downloadBusy ? <LoaderCircle className="spin" size={15}/> : <Download size={15}/>} Baixar exceções</button>
        <button type="button" className="protocolos-button primary" onClick={() => void handleStart()} disabled={!canRun || startBusy}>{startBusy ? <LoaderCircle className="spin" size={15}/> : <Play size={15}/>} Iniciar execução</button>
      </div>
    </header>
    {error && <div className="protocolos-alert error"><AlertTriangle size={16}/><span>{error}</span><button type="button" onClick={() => setError('')}><X size={14}/></button></div>}
    {runFeedback && <div className="protocolos-alert"><CheckCircle2 size={16}/><span>{runFeedback}</span></div>}

    <section className="protocolos-intake-section">
      <div className="protocolos-section-heading"><h2>Entrada de dados</h2><p>Essas ações escrevem na operação. A leitura da base fica fora do React.</p></div>
      <div className="protocolos-intake-grid-react">
        <article className="protocolos-card protocolos-upload-card">
          <header><span className="protocolos-card-icon"><FileSpreadsheet size={18}/></span><h3>Base da Controladoria</h3></header>
          <UploadField prompt="Arraste o XLSX aqui ou clique para selecionar" helper="Planilha de tarefas de protocolo" files={controlFile} onChange={setControlFile}/>
          <div className="protocolos-card-footer"><span className="protocolos-import-line">Importação sob demanda</span><button className="protocolos-button primary" type="button" onClick={handleControladoria} disabled={!canRun || !controlFile[0] || controlBusy}>{controlBusy ? <LoaderCircle className="spin" size={15}/> : <UploadCloud size={15}/>} Importar base</button></div>
          {controlFeedback && <p className="protocolos-feedback">{controlFeedback}</p>}
        </article>
        <article className="protocolos-card protocolos-upload-card">
          <header><span className="protocolos-card-icon"><Files size={18}/></span><h3>Documentos</h3></header>
          <UploadField prompt="Arraste o XLSX aqui ou clique para selecionar" helper="Planilha com CNJ, tipo e nome do arquivo" files={relationFile} onChange={setRelationFile}/>
          <div className="protocolos-card-footer"><span className="protocolos-import-line">Processamento sob demanda</span><button className="protocolos-button primary" type="button" onClick={handleDocuments} disabled={!canRun || !relationFile[0] || documentsBusy}>{documentsBusy ? <LoaderCircle className="spin" size={15}/> : <FileCheck2 size={15}/>} Processar relação</button></div>
          {documentsFeedback && <p className="protocolos-feedback">{documentsFeedback}</p>}
        </article>
      </div>
    </section>

    {canView ? <MetabaseProtocolosEmbed/> : <div className="protocolos-alert error"><AlertTriangle size={16}/><span>Sem permissão para visualizar Protocolos.</span></div>}
  </div>;
}
