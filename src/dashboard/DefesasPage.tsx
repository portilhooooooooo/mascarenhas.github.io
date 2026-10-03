import './operationalWorkspace.css';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatabaseZap, RefreshCw, Search, ShieldCheck } from 'lucide-react';

type BatchStatus = 'aguardando' | 'saneado' | 'tarefa';
type TaskRow = { id: string; type?: string | null; source?: string | null; title?: string | null };
type ProcessRow = {
  id: string;
  case_number?: string | null;
  status?: string | null;
  source?: string | null;
  assignee_id?: string | null;
  updated_at?: string | null;
  source_metadata?: Record<string, any> | null;
};
type BatchRow = {
  id: string;
  cnj: string;
  fatalDeadline?: string | null;
  operationalDeadline?: string | null;
  responsible?: string | null;
  status: BatchStatus;
  destination: string;
  situation?: string | null;
  updatedAt?: string | null;
};

type DashboardWindow = Window & typeof globalThis & {
  MBA_API?: { request: (path: string, options?: RequestInit) => Promise<any> };
};

const dashboardWindow = window as DashboardWindow;
const STATUS_META: Record<BatchStatus, { label: string; className: string }> = {
  aguardando: { label: 'Aguardando', className: 'neutral' },
  saneado: { label: 'Saneado', className: 'success' },
  tarefa: { label: 'Para tarefa', className: 'blue' },
};

const normalize = (value: unknown) => String(value || '').trim().toLowerCase();

function date(value?: string | null) {
  if (!value) return '—';
  const normalized = String(value).slice(0, 10);
  const [year, month, day] = normalized.split('-');
  return year && month && day ? `${day}/${month}/${year}` : String(value);
}

function timestamp(value?: string | null) {
  if (!value) return '—';
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? String(value) : parsed.toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

function routingStatus(process: ProcessRow): BatchStatus {
  const meta = process.source_metadata || {};
  const explicit = normalize(meta.saneamento_status || meta.routing_status || meta.status_saneamento);
  if (['saneado', 'resolved', 'resolvido'].includes(explicit)) return 'saneado';
  if (['tarefa', 'task', 'human', 'human_review'].includes(explicit) || meta.human_review_required === true) return 'tarefa';
  return 'aguardando';
}

function destination(status: BatchStatus) {
  if (status === 'saneado') return 'Resolvido em lote';
  if (status === 'tarefa') return 'Validar em Tarefas';
  return 'Aguardar análise do lote';
}

export function DefesasPage() {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | BatchStatus>('all');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!dashboardWindow.MBA_API) {
      setError('A API ainda não está disponível.');
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const taskPayload = await dashboardWindow.MBA_API.request('/api/tasks');
      const tasks = (Array.isArray(taskPayload) ? taskPayload : []) as TaskRow[];
      const talismanTasks = tasks.filter(task => normalize(task.type) === 'defesa' && normalize(task.source) === 'automation');
      const processGroups = await Promise.all(talismanTasks.map(async task => {
        const payload = await dashboardWindow.MBA_API!.request(`/api/tasks/${task.id}/processes`);
        return Array.isArray(payload) ? payload as ProcessRow[] : [];
      }));
      const active = processGroups.flat().filter(process => normalize(process.source) === 'talisman_contestacao' && normalize(process.status) !== 'completed');
      const nextRows = active.map(process => {
        const meta = process.source_metadata || {};
        const rowStatus = routingStatus(process);
        return {
          id: process.id,
          cnj: String(process.case_number || 'Processo sem número'),
          fatalDeadline: meta.fatal_deadline || meta.raw_data?.['Prazo fatal'] || null,
          operationalDeadline: meta.operational_deadline || meta.raw_data?.['Prazo operacional Enter'] || null,
          responsible: meta.responsible || meta.raw_data?.Responsável || null,
          status: rowStatus,
          destination: destination(rowStatus),
          situation: meta.situation || meta.situacao || null,
          updatedAt: process.updated_at || null,
        } satisfies BatchRow;
      });
      nextRows.sort((a, b) => String(a.operationalDeadline || a.fatalDeadline || '9999').localeCompare(String(b.operationalDeadline || b.fatalDeadline || '9999')) || a.cnj.localeCompare(b.cnj));
      setRows(nextRows);
      const syncTimes = nextRows.map(row => row.updatedAt).filter(Boolean).map(value => new Date(String(value)).getTime()).filter(Number.isFinite);
      setLastSyncAt(syncTimes.length ? new Date(Math.max(...syncTimes)).toISOString() : null);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível carregar o lote do Talisman.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    const timer = window.setInterval(() => { if (!document.hidden) void load(); }, 60000);
    return () => window.clearInterval(timer);
  }, [load]);

  const counts = useMemo(() => ({
    all: rows.length,
    aguardando: rows.filter(row => row.status === 'aguardando').length,
    saneado: rows.filter(row => row.status === 'saneado').length,
    tarefa: rows.filter(row => row.status === 'tarefa').length,
  }), [rows]);

  const visibleRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter(row => (status === 'all' || row.status === status) && (!term || `${row.cnj} ${row.responsible || ''} ${row.situation || ''} ${row.destination}`.toLowerCase().includes(term)));
  }, [rows, search, status]);

  useEffect(() => setPage(1), [search, status]);
  const pageCount = Math.max(1, Math.ceil(visibleRows.length / 25));
  const currentPage = Math.min(page, pageCount);
  const pagedRows = visibleRows.slice((currentPage - 1) * 25, currentPage * 25);

  return <section className="defesas-batch-page" aria-label="Defesas em lote">
    <header className="protocolos-header">
      <div><span className="protocolos-eyebrow">CONTROLADORIA</span><h1>Defesas</h1><p>Confira os prazos e o destino de cada defesa. Os casos que exigem validação individual seguem para Tarefas.</p></div>
      <div className="protocolos-header-actions"><button className="protocolos-button secondary" type="button" disabled={loading} onClick={() => void load()}><RefreshCw size={14}/>{loading ? 'Atualizando…' : 'Atualizar'}</button></div>
    </header>

    <section className="defesas-live-grid">
      <article className="protocolos-card defesas-source-card">
        <header><span className="protocolos-card-icon"><DatabaseZap size={17}/></span><div><h3>Origem do lote</h3><p>Talisman → “Fazer contestação”. Sem importação manual.</p></div></header>
        <div className="defesas-source-meta"><div><small>FONTE</small><strong>Talisman</strong></div><div><small>ÚLTIMA SINCRONIZAÇÃO</small><strong>{timestamp(lastSyncAt)}</strong></div><div><small>ATIVOS</small><strong>{counts.all}</strong></div></div>
      </article>

      <article className="protocolos-card defesas-saneamento-card">
        <header><span className="protocolos-card-icon"><ShieldCheck size={17}/></span><div><h3>Saneamento</h3><p>Roteamento do lote antes da execução individual.</p></div></header>
        <div className="defesas-saneamento-grid"><div><small>AGUARDANDO</small><strong>{counts.aguardando}</strong></div><div><small>SANEADOS</small><strong>{counts.saneado}</strong></div><div><small>PARA TAREFA</small><strong>{counts.tarefa}</strong></div></div>
        <div className="defesas-provider-line"><span><i className={error ? '' : 'success'}/>{error ? 'Fonte indisponível' : 'Fila carregada'}</span><em>{loading ? 'Sincronizando' : error ? 'Requer atenção' : 'Consulta concluída'}</em></div>
      </article>
    </section>

    <section className="protocolos-card protocolos-workspace defesas-batch-workspace">
      <header className="protocolos-workspace-head"><div><h2>Processos da Controladoria</h2><p>Fila ativa sincronizada pelo worker já existente.</p></div></header>
      <div className="protocolos-status-strip-react">
        <button type="button" className={status === 'all' ? 'active' : ''} onClick={() => setStatus('all')}>Todos <strong>{counts.all}</strong></button>
        <button type="button" className={`success ${status === 'saneado' ? 'active' : ''}`} onClick={() => setStatus('saneado')}>Saneados <strong>{counts.saneado}</strong></button>
        <button type="button" className={`blue ${status === 'tarefa' ? 'active' : ''}`} onClick={() => setStatus('tarefa')}>Para tarefa <strong>{counts.tarefa}</strong></button>
        <button type="button" className={status === 'aguardando' ? 'active' : ''} onClick={() => setStatus('aguardando')}>Aguardando <strong>{counts.aguardando}</strong></button>
      </div>
      <div className="protocolos-toolbar"><label className="protocolos-search"><Search size={14}/><input value={search} onChange={event => setSearch(event.target.value)} aria-label="Buscar defesas" placeholder="Buscar CNJ, responsável ou situação"/></label></div>
      {error ? <div className="defesas-live-error"><strong>Não foi possível atualizar a fila</strong><span>{error}</span><button type="button" className="secondary-button" onClick={() => void load()}>Tentar novamente</button></div> : null}
      {<div className="protocolos-table-wrap"><table className="protocolos-table-react defesas-batch-table"><thead><tr><th>Processo</th><th>Fatal Controladoria</th><th>Prazo operacional</th><th>Responsável</th><th>Status</th><th>Próximo passo</th><th>Atualizado</th></tr></thead><tbody>{pagedRows.map(row => <tr key={row.id}><td><span className="protocolos-cnj">{row.cnj}</span>{row.situation ? <small className="defesas-row-situation">{row.situation}</small> : null}</td><td><span className="protocolos-date">{date(row.fatalDeadline)}</span></td><td><span className="protocolos-date">{date(row.operationalDeadline)}</span></td><td><span className="protocolos-context">{row.responsible || 'Sem responsável'}</span></td><td><span className={`protocolos-badge ${STATUS_META[row.status].className}`}>{STATUS_META[row.status].label}</span></td><td><strong className={row.status === 'tarefa' ? 'defesas-destination-task' : 'defesas-destination'}>{row.destination}</strong></td><td><span className="protocolos-date">{timestamp(row.updatedAt)}</span></td></tr>)}</tbody></table>{!loading && !visibleRows.length ? <div className="protocolos-empty"><strong>Nenhum processo neste filtro</strong><span>{rows.length ? 'Ajuste a busca ou selecione outro status.' : 'Aguardando processos ativos do Talisman.'}</span></div> : null}{loading && !rows.length ? <div className="protocolos-empty"><strong>Carregando fila</strong><span>Consultando o lote sincronizado pelo Talisman.</span></div> : null}</div>}
      {visibleRows.length > 0 ? <footer className="protocolos-pagination"><span>{(currentPage - 1) * 25 + 1}–{Math.min(currentPage * 25, visibleRows.length)} de {visibleRows.length}</span><div className="protocolos-pagination-controls"><button type="button" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}>Anterior</button><span>Página {currentPage} de {pageCount}</span><button type="button" disabled={currentPage === pageCount} onClick={() => setPage(currentPage + 1)}>Próxima</button></div></footer> : null}
    </section>
  </section>;
}
