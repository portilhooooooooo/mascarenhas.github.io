import { useCallback, useEffect, useMemo, useState } from 'react';
import { DatabaseZap, RefreshCw, Search, ShieldCheck } from 'lucide-react';

type BatchStatus = 'aguardando' | 'saneado' | 'tarefa';
type BatchRow = {
  task_id?: string | null;
  cnj: string;
  fatal_deadline?: string | null;
  operational_deadline?: string | null;
  responsible?: string | null;
  status?: BatchStatus | null;
  destination?: string | null;
  situation?: string | null;
  last_seen_at?: string | null;
};

type BatchPayload = {
  source?: string;
  last_sync_at?: string | null;
  rows?: BatchRow[];
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

function normalizeStatus(row: BatchRow): BatchStatus {
  return row.status === 'saneado' || row.status === 'tarefa' ? row.status : 'aguardando';
}

export function DefesasPage() {
  const [rows, setRows] = useState<BatchRow[]>([]);
  const [source, setSource] = useState('Talisman');
  const [lastSyncAt, setLastSyncAt] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState<'all' | BatchStatus>('all');
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
      const payload = await dashboardWindow.MBA_API.request('/api/controladoria/defesas');
      const normalized: BatchPayload = Array.isArray(payload) ? { rows: payload } : (payload || {});
      setRows(Array.isArray(normalized.rows) ? normalized.rows : []);
      setSource(normalized.source || 'Talisman');
      setLastSyncAt(normalized.last_sync_at || null);
    } catch (cause: any) {
      setRows([]);
      setError(cause?.message || 'Não foi possível carregar o lote de Defesas.');
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
    aguardando: rows.filter(row => normalizeStatus(row) === 'aguardando').length,
    saneado: rows.filter(row => normalizeStatus(row) === 'saneado').length,
    tarefa: rows.filter(row => normalizeStatus(row) === 'tarefa').length,
  }), [rows]);

  const visibleRows = useMemo(() => {
    const term = search.trim().toLowerCase();
    return rows.filter(row => {
      const rowStatus = normalizeStatus(row);
      if (status !== 'all' && rowStatus !== status) return false;
      if (!term) return true;
      return `${row.cnj} ${row.responsible || ''} ${row.situation || ''} ${row.destination || ''}`.toLowerCase().includes(term);
    });
  }, [rows, search, status]);

  return <section className="defesas-batch-page" aria-label="Defesas em lote">
    <header className="protocolos-header">
      <div><span className="protocolos-eyebrow">CONTROLADORIA</span><h1>Defesas</h1><p>Fila recebida automaticamente da Controladoria Enter pelo Talisman. O saneamento em lote resolve os casos objetivos e envia para Tarefas apenas o resíduo que exige validação humana.</p></div>
      <div className="protocolos-header-actions"><button className="protocolos-button secondary" type="button" disabled={loading} onClick={() => void load()}><RefreshCw size={14}/>{loading ? 'Atualizando…' : 'Atualizar'}</button></div>
    </header>

    <section className="defesas-live-grid">
      <article className="protocolos-card defesas-source-card">
        <header><span className="protocolos-card-icon"><DatabaseZap size={17}/></span><div><h3>Origem do lote</h3><p>Sincronização automática. Não há importação manual nesta esteira.</p></div></header>
        <div className="defesas-source-meta"><div><small>FONTE</small><strong>{source}</strong></div><div><small>ÚLTIMA SINCRONIZAÇÃO</small><strong>{timestamp(lastSyncAt)}</strong></div><div><small>ATIVOS</small><strong>{counts.all}</strong></div></div>
      </article>

      <article className="protocolos-card defesas-saneamento-card">
        <header><span className="protocolos-card-icon"><ShieldCheck size={17}/></span><div><h3>Saneamento</h3><p>Acompanhe o roteamento do lote antes da execução individual.</p></div></header>
        <div className="defesas-saneamento-grid"><div><small>AGUARDANDO</small><strong>{counts.aguardando}</strong></div><div><small>SANEADOS</small><strong>{counts.saneado}</strong></div><div><small>PARA TAREFA</small><strong>{counts.tarefa}</strong></div></div>
        <div className="defesas-provider-line"><span><i className={error ? '' : 'success'}/>{error ? 'Fonte indisponível' : 'Talisman ativo'}</span><em>{loading ? 'Sincronizando' : error ? 'Requer atenção' : 'Fluxo online'}</em></div>
      </article>
    </section>

    <section className="protocolos-card protocolos-workspace defesas-batch-workspace">
      <header className="protocolos-workspace-head"><div><h2>Processos da Controladoria</h2><p>Espelho operacional da fila de “Fazer contestação” recebida pelo Talisman.</p></div></header>
      <div className="protocolos-status-strip-react">
        <button type="button" className={status === 'all' ? 'active' : ''} onClick={() => setStatus('all')}>Todos <strong>{counts.all}</strong></button>
        <button type="button" className={`success ${status === 'saneado' ? 'active' : ''}`} onClick={() => setStatus('saneado')}>Saneados <strong>{counts.saneado}</strong></button>
        <button type="button" className={`blue ${status === 'tarefa' ? 'active' : ''}`} onClick={() => setStatus('tarefa')}>Para tarefa <strong>{counts.tarefa}</strong></button>
        <button type="button" className={status === 'aguardando' ? 'active' : ''} onClick={() => setStatus('aguardando')}>Aguardando <strong>{counts.aguardando}</strong></button>
      </div>
      <div className="protocolos-toolbar"><label className="protocolos-search"><Search size={14}/><input value={search} onChange={event => setSearch(event.target.value)} placeholder="Buscar CNJ, responsável ou situação"/></label></div>
      {error ? <div className="defesas-live-error"><strong>Não foi possível atualizar a fila</strong><span>{error}</span><button type="button" className="secondary-button" onClick={() => void load()}>Tentar novamente</button></div> : null}
      {!error ? <div className="protocolos-table-wrap"><table className="protocolos-table-react defesas-batch-table"><thead><tr><th>Processo</th><th>Fatal Controladoria</th><th>Prazo operacional</th><th>Responsável</th><th>Status</th><th>Destino</th><th>Atualizado</th></tr></thead><tbody>{visibleRows.map(row => { const rowStatus = normalizeStatus(row); return <tr key={row.task_id || row.cnj}><td><span className="protocolos-cnj">{row.cnj}</span>{row.situation ? <small className="defesas-row-situation">{row.situation}</small> : null}</td><td><span className="protocolos-date">{date(row.fatal_deadline)}</span></td><td><span className="protocolos-date">{date(row.operational_deadline)}</span></td><td><span className="protocolos-context">{row.responsible || 'Sem responsável'}</span></td><td><span className={`protocolos-badge ${STATUS_META[rowStatus].className}`}>{STATUS_META[rowStatus].label}</span></td><td><strong className={rowStatus === 'tarefa' ? 'defesas-destination-task' : 'defesas-destination'}>{row.destination || (rowStatus === 'tarefa' ? 'Tarefa de Defesa' : rowStatus === 'saneado' ? 'Resolvido em lote' : 'Aguardando saneamento')}</strong></td><td><span className="protocolos-date">{timestamp(row.last_seen_at)}</span></td></tr>; })}</tbody></table>{!loading && !visibleRows.length ? <div className="protocolos-empty"><strong>Nenhum processo neste filtro</strong><span>{rows.length ? 'Ajuste a busca ou selecione outro status.' : 'Aguardando processos ativos do Talisman.'}</span></div> : null}{loading && !rows.length ? <div className="protocolos-empty"><strong>Carregando fila</strong><span>Consultando o lote sincronizado pelo Talisman.</span></div> : null}</div> : null}
    </section>
  </section>;
}
