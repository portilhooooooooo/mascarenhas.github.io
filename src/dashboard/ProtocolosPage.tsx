import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  AlertTriangle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Download,
  ExternalLink,
  FileCheck2,
  FileSpreadsheet,
  FileX2,
  Files,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
  Search,
  UploadCloud,
  X,
} from 'lucide-react';
import {
  downloadProtocoloExceptions,
  getProtocoloItems,
  getProtocoloSummary,
  importControladoria,
  importDocuments,
  retryProtocoloItems,
  type DocumentImportResult,
  type ProtocoloItem,
  type ProtocoloStatus,
  type ProtocoloSummary,
} from './protocoloService';

type ProtocolView =
  | 'ALL'
  | 'NO_DOCUMENTS'
  | 'RUNNING'
  | 'DOCUMENTOS_ENVIADOS'
  | 'COMPLETED'
  | 'ERRORS';

const STATUS_META: Record<ProtocoloStatus, { label: string; tone: string; icon: typeof Clock3 }> = {
  PENDING: { label: 'Sem documentos', tone: 'neutral', icon: FileX2 },
  RUNNING: { label: 'Em execução', tone: 'blue', icon: LoaderCircle },
  DOCUMENTOS_ENVIADOS: { label: 'Documentos enviados', tone: 'blue', icon: FileCheck2 },
  ENVIADO: { label: 'Concluído', tone: 'success', icon: CheckCircle2 },
  DONE: { label: 'Concluído', tone: 'success', icon: CheckCircle2 },
  HUMAN_NECESSARY: { label: 'Erro', tone: 'danger', icon: AlertTriangle },
};

const PAGE_SIZES = [10, 50, 100] as const;
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

function paginationPages(total: number, current: number): Array<number | 'ellipsis'> {
  if (total <= 7) return Array.from({ length: total }, (_, index) => index + 1);
  const pages: Array<number | 'ellipsis'> = [1];
  if (current > 4) pages.push('ellipsis');
  const start = Math.max(2, current - 1);
  const end = Math.min(total - 1, current + 1);
  for (let value = start; value <= end; value += 1) pages.push(value);
  if (current < total - 3) pages.push('ellipsis');
  pages.push(total);
  return pages;
}

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

function StatusBadge({ status }: { status: ProtocoloStatus }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING;
  const Icon = meta.icon;
  return <span className={`protocolos-badge ${meta.tone}`}><Icon size={12}/>{meta.label}</span>;
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

function viewMatches(item: ProtocoloItem, view: ProtocolView) {
  if (view === 'ALL') return true;
  if (view === 'NO_DOCUMENTS') return item.status === 'PENDING';
  if (view === 'RUNNING') return item.status === 'RUNNING';
  if (view === 'DOCUMENTOS_ENVIADOS') return item.status === 'DOCUMENTOS_ENVIADOS';
  if (view === 'COMPLETED') return item.status === 'ENVIADO' || item.status === 'DONE';
  return item.status === 'HUMAN_NECESSARY';
}

function viewCount(summary: ProtocoloSummary | null, view: ProtocolView) {
  const statuses = summary?.statuses || {};
  if (view === 'ALL') return Object.values(statuses).reduce((sum, value) => sum + Number(value || 0), 0);
  if (view === 'NO_DOCUMENTS') return Number(statuses.PENDING || 0);
  if (view === 'RUNNING') return Number(statuses.RUNNING || 0);
  if (view === 'DOCUMENTOS_ENVIADOS') return Number(statuses.DOCUMENTOS_ENVIADOS || 0);
  if (view === 'COMPLETED') return Number(statuses.ENVIADO || 0) + Number(statuses.DONE || 0);
  return Number(statuses.HUMAN_NECESSARY || 0);
}

export function ProtocolosPage() {
  const [summary, setSummary] = useState<ProtocoloSummary | null>(null);
  const [items, setItems] = useState<ProtocoloItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ProtocolView>('ALL');
  const [canView, setCanView] = useState(false);
  const [canRun, setCanRun] = useState(false);
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [selectedRetryIds, setSelectedRetryIds] = useState<Set<string>>(() => new Set());
  const [retryBusy, setRetryBusy] = useState(false);
  const retrySelectAllRef = useRef<HTMLInputElement>(null);
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
      const [nextSummary, nextItems] = await Promise.all([
        getProtocoloSummary(),
        getProtocoloItems(),
      ]);
      setSummary(nextSummary);
      setItems(nextItems);
    } catch (cause) {
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

  const visibleItems = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase('pt-BR');
    return items.filter(item => {
      if (!viewMatches(item, view)) return false;
      if (!normalized) return true;
      return [item.cnj, item.status, item.stage, item.human_reason, item.error_code]
        .some(value => String(value || '').toLocaleLowerCase('pt-BR').includes(normalized));
    });
  }, [items, query, view]);

  const pageCount = Math.max(1, Math.ceil(visibleItems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = visibleItems.length ? (currentPage - 1) * pageSize : 0;
  const pageEnd = Math.min(pageStart + pageSize, visibleItems.length);
  const pagedItems = useMemo(
    () => visibleItems.slice(pageStart, pageEnd),
    [pageEnd, pageStart, visibleItems],
  );
  const pageLinks = useMemo(() => paginationPages(pageCount, currentPage), [currentPage, pageCount]);
  const isErrors = view === 'ERRORS';
  const eligiblePageIds = useMemo(
    () => isErrors ? pagedItems.filter(item => item.retry_allowed).map(item => item.id) : [],
    [isErrors, pagedItems],
  );
  const allEligibleSelected = eligiblePageIds.length > 0 && eligiblePageIds.every(id => selectedRetryIds.has(id));
  const someEligibleSelected = eligiblePageIds.some(id => selectedRetryIds.has(id));

  useEffect(() => {
    setPage(1);
    setSelectedRetryIds(new Set());
  }, [pageSize, query, view]);

  useEffect(() => {
    if (page > pageCount) setPage(pageCount);
  }, [page, pageCount]);

  useEffect(() => {
    setSelectedRetryIds(new Set());
  }, [page]);

  useEffect(() => {
    if (retrySelectAllRef.current) {
      retrySelectAllRef.current.indeterminate = someEligibleSelected && !allEligibleSelected;
    }
  }, [allEligibleSelected, someEligibleSelected]);

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

  const toggleRetryItem = (itemId: string, checked: boolean) => {
    setSelectedRetryIds(current => {
      const next = new Set(current);
      if (checked) next.add(itemId);
      else next.delete(itemId);
      return next;
    });
  };

  const toggleRetryPage = (checked: boolean) => {
    setSelectedRetryIds(current => {
      const next = new Set(current);
      eligiblePageIds.forEach(id => checked ? next.add(id) : next.delete(id));
      return next;
    });
  };

  const handleRetry = async (itemIds: string[]) => {
    const uniqueIds = Array.from(new Set(itemIds));
    if (!canRun || retryBusy || uniqueIds.length === 0) return;
    setRetryBusy(true);
    setError('');
    try {
      const result = await retryProtocoloItems(uniqueIds);
      setSelectedRetryIds(new Set());
      await refresh(true);
      if (result.blocked.length) {
        setError(`${number(result.blocked.length)} item${result.blocked.length === 1 ? '' : 's'} permaneceu${result.blocked.length === 1 ? '' : 'ram'} em erros.`);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível solicitar a nova tentativa.');
    } finally {
      setRetryBusy(false);
    }
  };

  const filters: Array<{ key: ProtocolView; label: string; tone?: string; icon?: typeof Clock3 }> = [
    { key: 'ALL', label: 'Todos' },
    { key: 'NO_DOCUMENTS', label: 'Sem documentos', icon: FileX2 },
    { key: 'RUNNING', label: 'Em execução', tone: 'blue', icon: LoaderCircle },
    { key: 'DOCUMENTOS_ENVIADOS', label: 'Documentos enviados', tone: 'blue', icon: FileCheck2 },
    { key: 'COMPLETED', label: 'Concluído', tone: 'success', icon: CheckCircle2 },
    { key: 'ERRORS', label: 'Erros', tone: 'danger', icon: AlertTriangle },
  ];

  const latestControlDate = summary?.controladoria
    ? dateTime(summary.controladoria.completed_at || summary.controladoria.created_at)
    : '—';
  const latestDocumentsDate = summary?.documents
    ? dateTime(summary.documents.completed_at || summary.documents.created_at)
    : '—';
  const latestDocumentErrors = Number(summary?.documents?.failed_rows || 0);

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

      <div className="protocolos-status-strip-react" role="tablist" aria-label="Status dos protocolos">
        {filters.map(filter => {
          const Icon = filter.icon;
          return <button
            key={filter.key}
            type="button"
            className={`${view === filter.key ? 'active ' : ''}${filter.tone || ''}`}
            onClick={() => setView(filter.key)}
            aria-selected={view === filter.key}
            role="tab"
          >
            {Icon && <Icon size={13}/>}<span>{filter.label}</span><strong>{number(viewCount(summary, filter.key))}</strong>
          </button>;
        })}
      </div>

      <div className="protocolos-toolbar">
        <label className="protocolos-search"><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar por CNJ, etapa ou motivo..."/></label>
        <div className="protocolos-toolbar-actions">
          {isErrors && selectedRetryIds.size > 0 && <button
            type="button"
            className="protocolos-button protocolos-retry-bulk"
            disabled={!canRun || retryBusy}
            onClick={() => void handleRetry(Array.from(selectedRetryIds))}
          >
            {retryBusy ? <LoaderCircle className="spin" size={14}/> : <RotateCcw size={14}/>} Tentar novamente ({number(selectedRetryIds.size)})
          </button>}
          <label className="protocolos-page-size">
            <span>Exibir</span>
            <select value={pageSize} onChange={event => setPageSize(Number(event.target.value))}>
              {PAGE_SIZES.map(size => <option key={size} value={size}>{size}</option>)}
            </select>
          </label>
        </div>
      </div>

      <div className="protocolos-table-wrap">
        <table className="protocolos-table-react">
          <thead><tr>
            {isErrors && <th className="protocolos-select-cell">
              <input
                ref={retrySelectAllRef}
                type="checkbox"
                checked={allEligibleSelected}
                disabled={!canRun || retryBusy || eligiblePageIds.length === 0}
                onChange={event => toggleRetryPage(event.target.checked)}
                aria-label="Selecionar todos os casos aptos desta página"
                title="Selecionar todos os casos aptos desta página"
              />
            </th>}
            <th>Processo</th>
            {!isErrors && <th>Status</th>}
            <th>{isErrors ? 'Motivo' : 'Contexto'}</th>
            <th>Etapa</th>
            <th>Atualização</th>
            <th></th>
          </tr></thead>
          <tbody>
            {!loading && visibleItems.length === 0 && <tr><td colSpan={6}><div className="protocolos-empty"><FileCheck2 size={22}/><strong>Nenhum registro nesta visão</strong><span>Ajuste o filtro ou aguarde a próxima atualização.</span></div></td></tr>}
            {loading && <tr><td colSpan={6}><div className="protocolos-empty"><LoaderCircle className="spin" size={22}/><strong>Carregando protocolos</strong><span>Consultando o estado atual do agente.</span></div></td></tr>}
            {!loading && pagedItems.map(item => <tr key={item.id}>
              {isErrors && <td className="protocolos-select-cell">
                <input
                  type="checkbox"
                  checked={selectedRetryIds.has(item.id)}
                  disabled={!canRun || retryBusy || !item.retry_allowed}
                  onChange={event => toggleRetryItem(item.id, event.target.checked)}
                  aria-label={`Selecionar ${item.cnj} para nova tentativa`}
                  title={item.retry_allowed ? 'Selecionar para nova tentativa' : (item.retry_block_reason || 'Revisão manual necessária')}
                />
              </td>}
              <td><strong className="protocolos-cnj">{item.cnj}</strong><small>{item.task_id ? `Task ${item.task_id.slice(0, 8)}…` : 'Task não informada'}</small></td>
              {!isErrors && <td><StatusBadge status={item.status}/></td>}
              <td><span className="protocolos-context">{item.human_reason || item.error_code || 'Fluxo automático'}</span></td>
              <td><span className="protocolos-stage">{item.stage || '—'}</span></td>
              <td><span className="protocolos-date">{dateTime(item.updated_at)}</span></td>
              <td>
                <div className="protocolos-row-actions">
                  {isErrors && (item.retry_allowed
                    ? <button type="button" className="protocolos-retry-action" disabled={!canRun || retryBusy} onClick={() => void handleRetry([item.id])}><RotateCcw size={13}/> Tentar novamente</button>
                    : <span className="protocolos-manual-only" title={item.retry_block_reason || 'Revisão manual necessária'}>Revisar manualmente</span>)}
                  {item.task_url && <a className="protocolos-open-task" href={item.task_url} target="_blank" rel="noopener noreferrer" aria-label={`Abrir tarefa do processo ${item.cnj}`}><ExternalLink size={14}/></a>}
                </div>
              </td>
            </tr>)}
          </tbody>
        </table>
      </div>

      {!loading && visibleItems.length > 0 && <footer className="protocolos-pagination">
        <span>{number(pageStart + 1)}–{number(pageEnd)} de {number(visibleItems.length)}</span>
        <div className="protocolos-pagination-controls">
          <button type="button" onClick={() => setPage(value => Math.max(1, value - 1))} disabled={currentPage <= 1} aria-label="Página anterior"><ChevronLeft size={14}/></button>
          {pageLinks.map((value, index) => value === 'ellipsis'
            ? <span key={`ellipsis-${index}`}>…</span>
            : <button key={value} type="button" className={currentPage === value ? 'active' : ''} onClick={() => setPage(value)} aria-current={currentPage === value ? 'page' : undefined}>{value}</button>)}
          <button type="button" onClick={() => setPage(value => Math.min(pageCount, value + 1))} disabled={currentPage >= pageCount} aria-label="Próxima página"><ChevronRight size={14}/></button>
        </div>
      </footer>}
    </section>
  </div>;
}
