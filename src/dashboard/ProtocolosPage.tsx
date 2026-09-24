import { SESSION_LABELS } from './protocoloPresentation';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileCheck2,
  FileSpreadsheet,
  Files,
  LoaderCircle,
  Play,
  RefreshCw,
  UploadCloud,
  X,
} from 'lucide-react';
import { MetabaseProtocolosEmbed } from './MetabaseProtocolosEmbed';
import {
  downloadProtocoloExceptions,
  getProtocoloSummary,
  importControladoria,
  importDocuments,
  startProtocoloRun,
  type DocumentImportResult,
  type ProtocoloSummary,
} from './protocoloService';

const number = (value: number | undefined | null) => new Intl.NumberFormat('pt-BR').format(Number(value || 0));
const dateTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
};
const fileSize = (bytes: number) => {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / 1024 / 1024).toFixed(1).replace('.', ',')} MB`;
};

function userPermissions() {
  return (window as Window & {
    MBA_CURRENT_USER?: { permissions?: Record<string, boolean> };
  }).MBA_CURRENT_USER?.permissions || {};
}

function UploadField({
  prompt,
  helper,
  files,
  onChange,
}: {
  prompt: string;
  helper: string;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);
  const selected = files[0];

  const acceptFiles = (next: FileList | File[]) => {
    const file = Array.from(next)[0];
    if (file) onChange([file]);
  };

  return <div className={`protocolos-upload-field ${selected ? 'has-file' : ''}`}>
    <input
      ref={inputRef}
      type="file"
      accept=".xlsx,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      onChange={event => acceptFiles(event.target.files || [])}
    />
    <button
      type="button"
      className={`protocolos-modern-drop ${dragging ? 'is-dragging' : ''}`}
      onClick={() => inputRef.current?.click()}
      onDragEnter={event => { event.preventDefault(); setDragging(true); }}
      onDragOver={event => { event.preventDefault(); setDragging(true); }}
      onDragLeave={event => { event.preventDefault(); setDragging(false); }}
      onDrop={event => {
        event.preventDefault();
        setDragging(false);
        acceptFiles(event.dataTransfer.files);
      }}
    >
      <span className="protocolos-drop-icon"><UploadCloud size={17}/></span>
      <span className="protocolos-drop-copy">
        <strong>{prompt}</strong>
        <small>{helper}</small>
      </span>
    </button>

    {selected && <div className="protocolos-selected-file">
      <span className="protocolos-file-icon"><FileSpreadsheet size={16}/></span>
      <span className="protocolos-file-copy"><strong>{selected.name}</strong><small>{fileSize(selected.size)}</small></span>
      <span className="protocolos-file-ready"><CheckCircle2 size={15}/>Pronto</span>
      <button type="button" aria-label="Remover arquivo" onClick={() => {
        onChange([]);
        if (inputRef.current) inputRef.current.value = '';
      }}><X size={15}/></button>
    </div>}
  </div>;
}

function importResultText(result: DocumentImportResult) {
  const parts = [
    `${number(result.stored)} armazenado${result.stored === 1 ? '' : 's'}`,
    `${number(result.ignored)} ignorado${result.ignored === 1 ? '' : 's'}`,
  ];
  if (result.missing) parts.push(`${number(result.missing)} referência${result.missing === 1 ? '' : 's'} sem arquivo`);
  if (result.errors) parts.push(`${number(result.errors)} erro${result.errors === 1 ? '' : 's'}`);
  if (result.zipped) parts.push(`${number(result.zipped)} ZIP${result.zipped === 1 ? '' : 's'}`);
  if (result.unrelated_files?.length) parts.push(`${number(result.unrelated_files.length)} fora da relação`);
  return parts.join(' · ');
}

export function ProtocolosPage() {
  const [summary, setSummary] = useState<ProtocoloSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [canView, setCanView] = useState(false);
  const [canRun, setCanRun] = useState(false);
  const [startBusy, setStartBusy] = useState(false);
  const refreshInFlightRef = useRef(false);

  const [controlFile, setControlFile] = useState<File[]>([]);
  const [relationFile, setRelationFile] = useState<File[]>([]);
  const [controlBusy, setControlBusy] = useState(false);
  const [documentsBusy, setDocumentsBusy] = useState(false);
  const [controlFeedback, setControlFeedback] = useState('');
  const [documentsFeedback, setDocumentsFeedback] = useState('');
  const [downloadBusy, setDownloadBusy] = useState(false);

  const refresh = useCallback(async (silent = false) => {
    if (refreshInFlightRef.current) return;
    refreshInFlightRef.current = true;
    if (!silent) {
      setLoading(true);
      setError('');
    }
    try {
      setSummary(await getProtocoloSummary());
    } catch (cause) {
      setSummary(current => current ? { ...current, session: { state: 'unknown' } } : current);
      if (!silent) {
        setError(cause instanceof Error ? cause.message : 'Não foi possível carregar o módulo de Protocolos.');
      }
    } finally {
      refreshInFlightRef.current = false;
      if (!silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const syncPermissions = () => {
      if (!mounted) return;
      const permissions = userPermissions();
      const mayView = permissions['automations.view'] === true;
      setCanView(mayView);
      setCanRun(permissions['automations.run'] === true);
      if (mayView) void refresh();
      else setLoading(false);
    };
    syncPermissions();
    window.addEventListener('mba:authenticated', syncPermissions);
    return () => {
      mounted = false;
      window.removeEventListener('mba:authenticated', syncPermissions);
    };
  }, [refresh]);

  useEffect(() => {
    if (!canView || !summary) return;
    const active = Number(summary.statuses?.RUNNING || 0) > 0
      || Number(summary.statuses?.DOCUMENTOS_ENVIADOS || 0) > 0;
    const timer = window.setTimeout(() => void refresh(true), active ? 2500 : 15000);
    return () => window.clearTimeout(timer);
  }, [canView, refresh, summary]);

  const handleControladoria = async () => {
    if (!controlFile[0] || controlBusy) return;
    setControlBusy(true);
    setControlFeedback('');
    try {
      const result = await importControladoria(controlFile[0]);
      setControlFeedback(`${number(result.protocol_tasks)} tarefa${result.protocol_tasks === 1 ? '' : 's'} encontrada${result.protocol_tasks === 1 ? '' : 's'}.`);
      setControlFile([]);
      await refresh(true);
    } catch (cause) {
      setControlFeedback(cause instanceof Error ? cause.message : 'Não foi possível importar a base.');
    } finally {
      setControlBusy(false);
    }
  };

  const handleDocuments = async () => {
    if (!relationFile[0] || documentsBusy) return;
    setDocumentsBusy(true);
    setDocumentsFeedback('');
    try {
      const result = await importDocuments(relationFile[0]);
      setDocumentsFeedback(`Relação processada · ${importResultText(result)}.`);
      setRelationFile([]);
      await refresh(true);
    } catch (cause) {
      setDocumentsFeedback(cause instanceof Error ? cause.message : 'Não foi possível processar a relação de documentos.');
    } finally {
      setDocumentsBusy(false);
    }
  };

  const handleStart = async () => {
    if (!canRun || startBusy) return;
    setStartBusy(true);
    setError('');
    try {
      await startProtocoloRun();
      await refresh(true);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível iniciar a execução dos protocolos.');
    } finally {
      setStartBusy(false);
    }
  };

  const handleDownload = async () => {
    setDownloadBusy(true);
    try {
      await downloadProtocoloExceptions();
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível baixar as exceções.');
    } finally {
      setDownloadBusy(false);
    }
  };

  const latestControlDate = summary?.controladoria
    ? dateTime(summary.controladoria.completed_at || summary.controladoria.created_at)
    : '—';
  const latestDocumentsDate = summary?.documents
    ? dateTime(summary.documents.completed_at || summary.documents.created_at)
    : '—';
  const latestDocumentErrors = Number(summary?.documents?.failed_rows || 0);
  const sessionState = startBusy ? 'starting' : summary?.session?.state || 'unknown';
  const sessionLabel = SESSION_LABELS[sessionState] || SESSION_LABELS.unknown;
  const sessionBusy = ['starting', 'authenticating', 'connected', 'in_use'].includes(sessionState);

  return <div className="protocolos-page-react">
    <nav className="controladoria-subnav" aria-label="Módulos de Controladoria">
      <button type="button" className="active">Protocolos</button>
      <button type="button" disabled title="Módulo em preparação">Liminar</button>
      <button type="button" disabled title="Módulo em preparação">Contestação</button>
    </nav>

    <header className="protocolos-header">
      <div>
        <span className="protocolos-eyebrow">CONTROLADORIA</span>
        <h1>Protocolos</h1>
        <p>Importe a base e acompanhe a execução dos protocolos.</p>
      </div>
      <div className="protocolos-header-actions">
        <button type="button" className="protocolos-button secondary" onClick={handleDownload} disabled={downloadBusy}>
          {downloadBusy ? <LoaderCircle className="spin" size={15}/> : <Download size={15}/>} Baixar exceções
        </button>
        <button type="button" className="protocolos-button secondary" onClick={() => void refresh()} disabled={loading}>
          <RefreshCw className={loading ? 'spin' : ''} size={15}/> Atualizar
        </button>
      </div>
    </header>

    {error && <div className="protocolos-alert error"><AlertTriangle size={16}/><span>{error}</span><button type="button" onClick={() => setError('')}><X size={14}/></button></div>}

    <section className="protocolos-session-bar" aria-label="Sessão do agente de protocolo">
      <div className="protocolos-session-copy">
        <span>Sessão Enter</span>
        {summary?.automatic_active && <small>Execução automática ativa</small>}
        <strong className={`protocolos-session-state ${sessionState}`} aria-live="polite">
          <i aria-hidden="true"/>{sessionLabel}
        </strong>
      </div>
      <button
        type="button"
        className="protocolos-button primary protocolos-start-button"
        onClick={() => void handleStart()}
        disabled={!canRun || startBusy || sessionBusy}
      >
        {startBusy ? <LoaderCircle className="spin" size={15}/> : <Play size={15}/>} {sessionState === 'lost' ? 'Reconectar' : 'Iniciar'}
      </button>
    </section>

    <section className="protocolos-intake-section">
      <div className="protocolos-section-heading"><h2>Entrada de dados</h2></div>
      <div className="protocolos-intake-grid-react">
        <article className="protocolos-card protocolos-upload-card">
          <header>
            <span className="protocolos-card-icon"><FileSpreadsheet size={18}/></span>
            <h3>Arquivo do Metabase</h3>
          </header>
          <UploadField
            prompt="Arraste o XLSX aqui ou clique para selecionar"
            helper="Apenas arquivos .xlsx"
            files={controlFile}
            onChange={setControlFile}
          />
          <div className="protocolos-card-footer">
            <div className="protocolos-import-line">
              <span>Último:</span>
              <strong>{summary?.controladoria ? `${number(summary.controladoria.protocolo_rows)} tarefas` : 'Nenhuma importação'}</strong>
              {summary?.controladoria && <><i>·</i><span>{latestControlDate}</span></>}
            </div>
            <button className="protocolos-button primary" type="button" onClick={handleControladoria} disabled={!canRun || !controlFile[0] || controlBusy}>
              {controlBusy ? <LoaderCircle className="spin" size={15}/> : <UploadCloud size={15}/>} Importar base
            </button>
          </div>
          {controlFeedback && <p className="protocolos-feedback">{controlFeedback}</p>}
        </article>

        <article className="protocolos-card protocolos-upload-card">
          <header>
            <span className="protocolos-card-icon"><Files size={18}/></span>
            <h3>Documentos</h3>
          </header>
          <UploadField
            prompt="Arraste o XLSX aqui ou clique para selecionar"
            helper="Planilha com CNJ, tipo e nome do arquivo"
            files={relationFile}
            onChange={setRelationFile}
          />
          <div className="protocolos-card-footer">
            <div className="protocolos-import-line">
              <span>Último:</span>
              <span>{latestDocumentsDate}</span>
              {summary?.documents && latestDocumentErrors > 0 && <><i>·</i><strong className="danger">{number(latestDocumentErrors)} erro{latestDocumentErrors === 1 ? '' : 's'}</strong></>}
            </div>
            <button className="protocolos-button primary" type="button" onClick={handleDocuments} disabled={!canRun || !relationFile[0] || documentsBusy}>
              {documentsBusy ? <LoaderCircle className="spin" size={15}/> : <FileCheck2 size={15}/>} Processar relação
            </button>
          </div>
          {documentsFeedback && <p className="protocolos-feedback">{documentsFeedback}</p>}
        </article>
      </div>
    </section>

    <section className="protocolos-card protocolos-workspace">
      <header className="protocolos-workspace-head">
        <div>
          <h2>Acompanhamento</h2>
          <p>Acompanhe o andamento dos protocolos.</p>
        </div>
      </header>
      <div className="protocolos-table-wrap">
        <MetabaseProtocolosEmbed />
      </div>
    </section>
  </div>;
}
