import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  Clock3,
  Download,
  ExternalLink,
  FileCheck2,
  FileSpreadsheet,
  Files,
  LoaderCircle,
  RefreshCw,
  Search,
  Send,
  UploadCloud,
  UserRoundCog,
  X,
} from 'lucide-react';
import {
  downloadProtocoloExceptions,
  getProtocoloItems,
  getProtocoloSummary,
  importControladoria,
  importDocuments,
  type DocumentImportResult,
  type ProtocoloItem,
  type ProtocoloStatus,
  type ProtocoloSummary,
} from './protocoloService';

const STATUS_META: Record<ProtocoloStatus, { label: string; tone: string; icon: typeof Clock3 }> = {
  PENDING: { label: 'Pendente', tone: 'neutral', icon: Clock3 },
  RUNNING: { label: 'Em execução', tone: 'blue', icon: LoaderCircle },
  DOCUMENTOS_ENVIADOS: { label: 'Documentos enviados', tone: 'blue', icon: FileCheck2 },
  ENVIADO: { label: 'Enviado', tone: 'success', icon: Send },
  DONE: { label: 'Concluído', tone: 'success', icon: CheckCircle2 },
  HUMAN_NECESSARY: { label: 'Atuação humana', tone: 'danger', icon: UserRoundCog },
};

const STATUS_ORDER = Object.keys(STATUS_META) as ProtocoloStatus[];
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
  label,
  helper,
  accept,
  multiple = false,
  files,
  onChange,
}: {
  label: string;
  helper: string;
  accept: string;
  multiple?: boolean;
  files: File[];
  onChange: (files: File[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  return <div className={`protocolos-upload-field ${files.length ? 'has-file' : ''}`}>
    <input
      ref={inputRef}
      type="file"
      accept={accept}
      multiple={multiple}
      onChange={event => onChange(Array.from(event.target.files || []))}
    />
    <button type="button" className="protocolos-upload-drop" onClick={() => inputRef.current?.click()}>
      <span className="protocolos-upload-icon"><UploadCloud size={18}/></span>
      <span className="protocolos-upload-copy">
        <strong>{label}</strong>
        {files.length ? <span>{multiple ? `${number(files.length)} arquivos selecionados` : files[0].name}</span> : <span>{helper}</span>}
      </span>
      {files.length ? <span className="protocolos-upload-meta">{fileSize(totalSize)}</span> : <span className="protocolos-upload-action">Selecionar</span>}
    </button>
    {files.length > 0 && <button className="protocolos-upload-clear" type="button" aria-label={`Limpar ${label}`} onClick={() => {
      onChange([]);
      if (inputRef.current) inputRef.current.value = '';
    }}><X size={14}/></button>}
  </div>;
}

function StatusBadge({ status }: { status: ProtocoloStatus }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING;
  const Icon = meta.icon;
  return <span className={`protocolos-badge ${meta.tone}`}><Icon size={12}/>{meta.label}</span>;
}

function documentImportSummary(summary: ProtocoloSummary['documents']) {
  if (!summary) return 'Nenhum lote importado ainda.';
  const stored = Number(summary.stored_documents || 0);
  const ignored = Number(summary.ignored_documents || 0);
  const failed = Number(summary.failed_rows || 0);
  const total = Number(summary.total_rows || 0);
  const base = `${number(stored)} documento${stored === 1 ? '' : 's'} armazenado${stored === 1 ? '' : 's'} · ${number(ignored)} ignorado${ignored === 1 ? '' : 's'}`;
  if (!failed) return base;
  const scope = total ? `${number(failed)} de ${number(total)} linhas da relação não processadas` : `${number(failed)} linhas da relação não processadas`;
  return `${base} · ${scope}`;
}

function importResultText(result: DocumentImportResult) {
  const parts = [
    `${number(result.stored)} armazenado${result.stored === 1 ? '' : 's'}`,
    `${number(result.ignored)} ignorado${result.ignored === 1 ? '' : 's'}`,
  ];
  if (result.missing) parts.push(`${number(result.missing)} referência${result.missing === 1 ? '' : 's'} sem arquivo neste lote`);
  if (result.errors) parts.push(`${number(result.errors)} linha${result.errors === 1 ? '' : 's'} com erro`);
  if (result.zipped) parts.push(`${number(result.zipped)} ZIP${result.zipped === 1 ? '' : 's'} gerado${result.zipped === 1 ? '' : 's'}`);
  if (result.unrelated_files?.length) parts.push(`${number(result.unrelated_files.length)} arquivo${result.unrelated_files.length === 1 ? '' : 's'} fora da relação`);
  return parts.join(' · ');
}

export function ProtocolosPage() {
  const [summary, setSummary] = useState<ProtocoloSummary | null>(null);
  const [items, setItems] = useState<ProtocoloItem[]>([]);
  const [exceptions, setExceptions] = useState<ProtocoloItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [status, setStatus] = useState<ProtocoloStatus | 'ALL'>('ALL');
  const [tab, setTab] = useState<'executions' | 'exceptions'>('executions');
  const [canRun, setCanRun] = useState(false);

  const [controlFile, setControlFile] = useState<File[]>([]);
  const [relationFile, setRelationFile] = useState<File[]>([]);
  const [documentFiles, setDocumentFiles] = useState<File[]>([]);
  const [controlBusy, setControlBusy] = useState(false);
  const [documentsBusy, setDocumentsBusy] = useState(false);
  const [controlFeedback, setControlFeedback] = useState('');
  const [documentsFeedback, setDocumentsFeedback] = useState('');
  const [downloadBusy, setDownloadBusy] = useState(false);

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [nextSummary, nextItems, nextExceptions] = await Promise.all([
        getProtocoloSummary(),
        getProtocoloItems(),
        getProtocoloItems('HUMAN_NECESSARY'),
      ]);
      setSummary(nextSummary);
      setItems(nextItems);
      setExceptions(nextExceptions);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar o módulo de Protocolos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let mounted = true;
    const syncPermissions = () => {
      if (!mounted) return;
      const permissions = userPermissions();
      setCanRun(permissions['automations.run'] === true);
      if (permissions['automations.view'] === true) void refresh();
      else setLoading(false);
    };
    syncPermissions();
    window.addEventListener('mba:authenticated', syncPermissions);
    return () => {
      mounted = false;
      window.removeEventListener('mba:authenticated', syncPermissions);
    };
  }, [refresh]);

  const visibleItems = useMemo(() => {
    const source = tab === 'exceptions' ? exceptions : items;
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return source.filter(item => {
      if (tab === 'executions' && status !== 'ALL' && item.status !== status) return false;
      if (!normalized) return true;
      return [item.cnj, item.status, item.stage, item.human_reason, item.error_code]
        .some(value => String(value || '').toLocaleLowerCase('pt-BR').includes(normalized));
    });
  }, [exceptions, items, query, status, tab]);

  const handleControladoria = async () => {
    if (!controlFile[0] || controlBusy) return;
    setControlBusy(true);
    setControlFeedback('');
    try {
      const result = await importControladoria(controlFile[0]);
      setControlFeedback(`${number(result.protocol_tasks)} tarefa${result.protocol_tasks === 1 ? '' : 's'} de protocolo encontrada${result.protocol_tasks === 1 ? '' : 's'} · ${number(result.reconciliation?.done)} concluída${result.reconciliation?.done === 1 ? '' : 's'} por reconciliação.`);
      setControlFile([]);
      await refresh();
    } catch (cause) {
      setControlFeedback(cause instanceof Error ? cause.message : 'Não foi possível importar a base.');
    } finally {
      setControlBusy(false);
    }
  };

  const handleDocuments = async () => {
    if (!relationFile[0] || !documentFiles.length || documentsBusy) return;
    setDocumentsBusy(true);
    setDocumentsFeedback('');
    try {
      const result = await importDocuments(relationFile[0], documentFiles);
      setDocumentsFeedback(`Importação concluída · ${importResultText(result)}.`);
      setRelationFile([]);
      setDocumentFiles([]);
      await refresh();
    } catch (cause) {
      setDocumentsFeedback(cause instanceof Error ? cause.message : 'Não foi possível importar os documentos.');
    } finally {
      setDocumentsBusy(false);
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

  return <div className="protocolos-page-react">
    <header className="protocolos-header">
      <div>
        <span className="protocolos-eyebrow">OPERAÇÃO</span>
        <h1>Protocolos</h1>
        <p>Importe os insumos, acompanhe o matching e trate somente o que sair do fluxo automático.</p>
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

    <section className="protocolos-intake-section">
      <div className="protocolos-section-heading">
        <div><h2>Entrada de dados</h2><p>Os dois insumos podem chegar em qualquer ordem. O envio começa quando tarefa e documentos correspondem.</p></div>
      </div>
      <div className="protocolos-intake-grid-react">
        <article className="protocolos-card protocolos-upload-card">
          <header>
            <span className="protocolos-card-icon"><FileSpreadsheet size={18}/></span>
            <div><h3>Base de Controladoria</h3><p>XLSX RAW exportado do Metabase da Enter.</p></div>
          </header>
          <UploadField label="Base XLSX" helper="Selecione o arquivo da Controladoria" accept=".xlsx" files={controlFile} onChange={setControlFile}/>
          <div className="protocolos-card-footer">
            <div className="protocolos-import-history">
              <span>Última base</span>
              <strong>{summary?.controladoria ? `${number(summary.controladoria.protocolo_rows)} tarefas de protocolo` : 'Nenhuma importação'}</strong>
              <small>{summary?.controladoria ? dateTime(summary.controladoria.completed_at || summary.controladoria.created_at) : '—'}</small>
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
            <div><h3>Documentos</h3><p>Planilha de relação e PDFs do lote atual.</p></div>
          </header>
          <div className="protocolos-document-fields">
            <UploadField label="Planilha de relação" helper="XLSX com CNJ, tipo e nome do arquivo" accept=".xlsx" files={relationFile} onChange={setRelationFile}/>
            <UploadField label="PDFs do lote" helper="Selecione um ou vários documentos" accept=".pdf,application/pdf" multiple files={documentFiles} onChange={setDocumentFiles}/>
          </div>
          <div className="protocolos-card-footer">
            <div className="protocolos-import-history wide">
              <span>Último lote</span>
              <strong>{documentImportSummary(summary?.documents || null)}</strong>
              <small>{summary?.documents ? dateTime(summary.documents.completed_at || summary.documents.created_at) : '—'}</small>
            </div>
            <button className="protocolos-button primary" type="button" onClick={handleDocuments} disabled={!canRun || !relationFile[0] || !documentFiles.length || documentsBusy}>
              {documentsBusy ? <LoaderCircle className="spin" size={15}/> : <UploadCloud size={15}/>} Importar documentos
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
          <p>Estado operacional dos processos já reconhecidos pelo agente.</p>
        </div>
        <div className="protocolos-tabs" role="tablist" aria-label="Visão de protocolos">
          <button type="button" className={tab === 'executions' ? 'active' : ''} onClick={() => setTab('executions')}>Execuções <span>{number(items.length)}</span></button>
          <button type="button" className={tab === 'exceptions' ? 'active danger' : ''} onClick={() => setTab('exceptions')}>Atuação humana <span>{number(summary?.statuses?.HUMAN_NECESSARY)}</span></button>
        </div>
      </header>

      {tab === 'executions' && <div className="protocolos-status-strip-react">
        <button type="button" className={status === 'ALL' ? 'active' : ''} onClick={() => setStatus('ALL')}><span>Todos</span><strong>{number(Object.values(summary?.statuses || {}).reduce((sum, value) => sum + Number(value || 0), 0))}</strong></button>
        {STATUS_ORDER.map(key => {
          const meta = STATUS_META[key];
          const Icon = meta.icon;
          return <button key={key} type="button" className={`${status === key ? 'active ' : ''}${meta.tone}`} onClick={() => setStatus(key)}>
            <Icon size={13}/><span>{meta.label}</span><strong>{number(summary?.statuses?.[key])}</strong>
          </button>;
        })}
      </div>}

      <div className="protocolos-toolbar">
        <label className="protocolos-search"><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por CNJ, etapa ou motivo..."/></label>
        <span>{loading ? 'Atualizando…' : `${number(visibleItems.length)} registro${visibleItems.length === 1 ? '' : 's'} exibido${visibleItems.length === 1 ? '' : 's'}`}</span>
      </div>

      <div className="protocolos-table-wrap">
        <table className="protocolos-table-react">
          <thead><tr>
            <th>Processo</th>
            {tab === 'executions' && <th>Status</th>}
            <th>{tab === 'exceptions' ? 'Motivo' : 'Contexto'}</th>
            <th>Etapa</th>
            <th>Atualização</th>
            <th></th>
          </tr></thead>
          <tbody>
            {!loading && visibleItems.length === 0 && <tr><td colSpan={tab === 'executions' ? 6 : 5}><div className="protocolos-empty"><FileCheck2 size={22}/><strong>Nenhum registro nesta visão</strong><span>Ajuste o filtro ou aguarde a próxima importação.</span></div></td></tr>}
            {loading && <tr><td colSpan={tab === 'executions' ? 6 : 5}><div className="protocolos-empty"><LoaderCircle className="spin" size={22}/><strong>Carregando protocolos</strong><span>Consultando o estado atual do agente.</span></div></td></tr>}
            {!loading && visibleItems.map(item => <tr key={item.id}>
              <td><strong className="protocolos-cnj">{item.cnj}</strong><small>{item.task_id ? `Task ${item.task_id.slice(0, 8)}…` : 'Task não informada'}</small></td>
              {tab === 'executions' && <td><StatusBadge status={item.status}/></td>}
              <td><span className="protocolos-context">{item.human_reason || item.error_code || 'Fluxo automático'}</span></td>
              <td><span className="protocolos-stage">{item.stage || '—'}</span></td>
              <td><span className="protocolos-date">{dateTime(item.updated_at)}</span></td>
              <td>{item.task_url && <a className="protocolos-open-task" href={item.task_url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir tarefa do processo ${item.cnj}`}><ExternalLink size={14}/></a>}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </section>
  </div>;
}
