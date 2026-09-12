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
  Files,
  LoaderCircle,
  RefreshCw,
  RotateCcw,
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
  retryProtocoloItems,
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
  if (result.missing) parts.push(`${number(result.missing)} referência${result.missing === 1 ? '' : 's'} sem arquivo no repositório local`);
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
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [selectedRetryIds, setSelectedRetryIds] = useState<Set<string>>(() => new Set());
  const [retryBusy, setRetryBusy] = useState(false);
  const retrySelectAllRef = useRef<HTMLInputElement>(null);

  const [controlFile, setControlFile] = useState<File[]>([]);
  const [relationFile, setRelationFile] = useState<File[]>([]);
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

  const pageCount = Math.max(1, Math.ceil(visibleItems.length / pageSize));
  const currentPage = Math.min(page, pageCount);
  const pageStart = visibleItems.length ? (currentPage - 1) * pageSize : 0;
  const pageEnd = Math.min(pageStart + pageSize, visibleItems.length);
  const pagedItems = useMemo(
    () => visibleItems.slice(pageStart, pageEnd),
    [pageEnd, pageStart, visibleItems],
  );
  const pageLinks = useMemo(() => paginationPages(pageCount, currentPage), [currentPage, pageCount]);
  const eligiblePageIds = useMemo(
    () => tab === 'exceptions' ? pagedItems.filter(item => item.retry_allowed).map(item => item.id) : [],
    [pagedItems, tab],
  );
  const allEligibleSelected = eligiblePageIds.length > 0 && eligiblePageIds.every(id => selectedRetryIds.has(id));
  const someEligibleSelected = eligiblePageIds.some(id => selectedRetryIds.has(id));

  useEffect(() => {
    setPage(1);
    setSelectedRetryIds(new Set());
  }, [pageSize, query, status, tab]);

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
    if (!relationFile[0] || documentsBusy) return;
    setDocumentsBusy(true);
    setDocumentsFeedback('');
    try {
      const result = await importDocuments(relationFile[0]);
      setDocumentsFeedback(`Relação processada · ${importResultText(result)}.`);
      setRelationFile([]);
      await refresh();
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
      await refresh();
      if (result.blocked.length) {
        setError(`${number(result.blocked.length)} item${result.blocked.length === 1 ? '' : 's'} permaneceu${result.blocked.length === 1 ? '' : 'ram'} em atuação humana.`);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível solicitar a nova tentativa.');
    } finally {
      setRetryBusy(false);
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
            <div><h3>Documentos</h3><p>Os PDFs são lidos diretamente do repositório local da VPS.</p></div>
          </header>
          <div className="protocolos-document-fields">
            <UploadField label="Planilha de relação" helper="XLSX com CNJ, tipo e nome do arquivo" accept=".xlsx" files={relationFile} onChange={setRelationFile}/>
            <p className="protocolos-feedback">Antes de processar a relação, os PDFs do lote devem estar disponíveis no inbox local do módulo de Protocolo.</p>
          </div>
          <div className="protocolos-card-footer">
            <div className="protocolos-import-history wide">
              <span>Último lote</span>
              <strong>{documentImportSummary(summary?.documents || null)}</strong>
              <small>{summary?.documents ? dateTime(summary.documents.completed_at || summary.documents.created_at) : '—'}</small>
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
        <div className="protocolos-toolbar-actions">
          {tab === 'exceptions' && <button
            type="button"
            className="protocolos-button protocolos-retry-bulk"
            disabled={!canRun || retryBusy || selectedRetryIds.size === 0}
            onClick={() => void handleRetry(Array.from(selectedRetryIds))}
          >
            {retryBusy ? <LoaderCircle className="spin" size={14}/> : <RotateCcw size={14}/>} Tentar novamente ({number(selectedRetryIds.size)})
          </button>}
          {loading && <span className="protocolos-updating">Atualizando…</span>}
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
            {tab === 'exceptions' && <th className="protocolos-select-cell">
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
            {tab === 'executions' && <th>Status</th>}
            <th>{tab === 'exceptions' ? 'Motivo' : 'Contexto'}</th>
            <th>Etapa</th>
            <th>Atualização</th>
            <th></th>
          </tr></thead>
          <tbody>
            {!loading && visibleItems.length === 0 && <tr><td colSpan={6}><div className="protocolos-empty"><FileCheck2 size={22}/><strong>Nenhum registro nesta visão</strong><span>Ajuste o filtro ou aguarde a próxima importação.</span></div></td></tr>}
            {loading && <tr><td colSpan={6}><div className="protocolos-empty"><LoaderCircle className="spin" size={22}/><strong>Carregando protocolos</strong><span>Consultando o estado atual do agente.</span></div></td></tr>}
            {!loading && pagedItems.map(item => <tr key={item.id}>
              {tab === 'exceptions' && <td className="protocolos-select-cell">
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
              {tab === 'executions' && <td><StatusBadge status={item.status}/></td>}
              <td><span className="protocolos-context">{item.human_reason || item.error_code || 'Fluxo automático'}</span></td>
              <td><span className="protocolos-stage">{item.stage || '—'}</span></td>
              <td><span className="protocolos-date">{dateTime(item.updated_at)}</span></td>
              <td>
                <div className="protocolos-row-actions">
                  {tab === 'exceptions' && (item.retry_allowed
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
