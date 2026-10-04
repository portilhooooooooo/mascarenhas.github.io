import {useEffect,useMemo,useRef,useState} from 'react';
import {AlertTriangle,CheckCircle2,ChevronLeft,ChevronRight,Clock3,ExternalLink,FileCheck2,Files,LoaderCircle,RotateCcw,Search} from 'lucide-react';
import {protocolDetail,protocolStage} from './protocoloPresentation';
import {retryProtocoloItems,type ProtocoloItem,type ProtocoloStatus,type ProtocoloSummary} from './protocoloService';
type ProtocolView =
  | 'ALL'
  | 'PENDING'
  | 'RUNNING'
  | 'DOCUMENTOS_ENVIADOS'
  | 'COMPLETED'
  | 'MISSING_DOCUMENTS'
  | 'ERRORS';

const STATUS_META: Record<ProtocoloStatus, { label: string; tone: string; icon: typeof Clock3 }> = {
  SEM_DOCUMENTOS: { label: 'Sem documentos', tone: 'neutral', icon: Files },
  PENDING: { label: 'Aguardando execução', tone: 'neutral', icon: Clock3 },
  RUNNING: { label: 'Em execução', tone: 'blue', icon: LoaderCircle },
  DOCUMENTOS_ENVIADOS: { label: 'Documentos enviados', tone: 'blue', icon: FileCheck2 },
  ENVIADO: { label: 'Protocolo enviado', tone: 'success', icon: CheckCircle2 },
  DONE: { label: 'Concluído', tone: 'success', icon: CheckCircle2 },
  HUMAN_NECESSARY: { label: 'Ação necessária', tone: 'danger', icon: AlertTriangle },
};

const DOCUMENT_ISSUE_CODES = new Set([
  'DOCUMENT_MISSING',
  'INVALID_DOCUMENT_TYPE',
  'INVALID_FILENAME',
  'DEFENSE_DOCUMENT_MISSING',
  'PROTOCOL_DOCUMENT_MISSING',
  'DUPLICATE_DEFENSE',
]);
const DOCUMENT_ISSUE_STAGES = new Set(['DOCUMENT_INTAKE', 'DOCUMENT_MATCHING']);

const PAGE_SIZES = [10, 50, 100] as const;
const number = (value: number | undefined | null) => new Intl.NumberFormat('pt-BR').format(Number(value || 0));
const dateTime = (value?: string | null) => {
  if (!value) return '—';
  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? '—'
    : new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short', timeStyle: 'short' }).format(date);
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

function StatusBadge({ status }: { status: ProtocoloStatus }) {
  const meta = STATUS_META[status] || STATUS_META.PENDING;
  const Icon = meta.icon;
  return <span className={`protocolos-badge ${meta.tone}`}><Icon size={12}/>{meta.label}</span>;
}

function isLegacyDocumentIssue(item: ProtocoloItem) {
  return item.status === 'HUMAN_NECESSARY'
    && DOCUMENT_ISSUE_STAGES.has(String(item.stage || ''))
    && DOCUMENT_ISSUE_CODES.has(String(item.error_code || ''));
}

function isMissingDocuments(item: ProtocoloItem) {
  return item.status === 'SEM_DOCUMENTOS' || isLegacyDocumentIssue(item);
}

function viewMatches(item: ProtocoloItem, view: ProtocolView) {
  if (view === 'ALL') return true;
  if (view === 'PENDING') return item.status === 'PENDING';
  if (view === 'RUNNING') return item.status === 'RUNNING';
  if (view === 'DOCUMENTOS_ENVIADOS') return item.status === 'DOCUMENTOS_ENVIADOS';
  if (view === 'COMPLETED') return item.status === 'ENVIADO' || item.status === 'DONE';
  if (view === 'MISSING_DOCUMENTS') return isMissingDocuments(item);
  return item.status === 'HUMAN_NECESSARY' && !isMissingDocuments(item);
}

function viewCount(summary: ProtocoloSummary | null, items: ProtocoloItem[], view: ProtocolView) {
  const statuses = summary?.statuses || {};
  const legacyMissingDocuments = items.filter(isLegacyDocumentIssue).length;
  const missingDocuments = Number(statuses.SEM_DOCUMENTOS || 0) + legacyMissingDocuments;
  if (view === 'ALL') return Object.values(statuses).reduce((sum, value) => sum + Number(value || 0), 0);
  if (view === 'PENDING') return Number(statuses.PENDING || 0);
  if (view === 'RUNNING') return Number(statuses.RUNNING || 0);
  if (view === 'DOCUMENTOS_ENVIADOS') return Number(statuses.DOCUMENTOS_ENVIADOS || 0);
  if (view === 'COMPLETED') return Number(statuses.ENVIADO || 0) + Number(statuses.DONE || 0);
  if (view === 'MISSING_DOCUMENTS') return missingDocuments;
  return Math.max(0, Number(statuses.HUMAN_NECESSARY || 0) - legacyMissingDocuments);
}

export function ProtocolQueue({summary,items,loading,canRun,refresh,setError}:{summary:ProtocoloSummary|null;items:ProtocoloItem[];loading:boolean;canRun:boolean;refresh:()=>Promise<void>;setError:(message:string)=>void}) {
  const [query, setQuery] = useState('');
  const [view, setView] = useState<ProtocolView>('ALL');
  const [pageSize, setPageSize] = useState<number>(10);
  const [page, setPage] = useState(1);
  const [selectedRetryIds, setSelectedRetryIds] = useState<Set<string>>(() => new Set());
  const [retryBusy, setRetryBusy] = useState(false);
  const retrySelectAllRef = useRef<HTMLInputElement>(null);

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
    { key: 'PENDING', label: 'Aguardando', icon: Clock3 },
    { key: 'RUNNING', label: 'Em execução', tone: 'blue', icon: LoaderCircle },
    { key: 'DOCUMENTOS_ENVIADOS', label: 'Documentos enviados', tone: 'blue', icon: FileCheck2 },
    { key: 'COMPLETED', label: 'Enviados / concluídos', tone: 'success', icon: CheckCircle2 },
    { key: 'MISSING_DOCUMENTS', label: 'Sem documentos', icon: Files },
    { key: 'ERRORS', label: 'Ação necessária', tone: 'danger', icon: AlertTriangle },
  ];

return (
    <section className="protocolos-card protocolos-workspace">
      <header className="protocolos-workspace-head">
        <div>
          <h2>Fila de protocolos</h2>
          <p>Filtre pelo estado e confira o motivo antes de agir.</p>
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
            {Icon && <Icon size={13}/>}<span>{filter.label}</span><strong>{number(viewCount(summary, items, filter.key))}</strong>
          </button>;
        })}
      </div>

      <div className="protocolos-toolbar">
        <label className="protocolos-search"><Search size={15}/><input value={query} onChange={event => setQuery(event.target.value)} aria-label="Buscar protocolos" placeholder="Buscar por CNJ, etapa ou motivo..."/></label>
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
              <td><span className="protocolos-context">{protocolDetail(item)}</span></td>
              <td><span className="protocolos-stage">{protocolStage(item)}</span></td>
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
);
}
