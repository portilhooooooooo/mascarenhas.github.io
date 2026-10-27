import {runtimeQueries,runtimeScope} from '../tasks/runtimeQueries';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight, CheckCircle2, CirclePause, Clock3, FileCheck2,
  Download, FileX2, FolderOpen, Hourglass, RefreshCw, Search, ShieldAlert, Wallet, X,
  type LucideIcon,
} from 'lucide-react';
import { getClosingCases } from './operacaoEncerramentosService';
import './baseGeral.css';

type Row = { label: string; value: number };
type Summary = {
  total: number; active: number; closed: number; unknown: number;
  // A agregação de carteira pode oferecer resultados judiciais como campos opcionais.
  dismissed?: number | null;
  extinct?: number | null;
  upheld?: number | null;
  injunction_granted?: number | null;
  injunction_denied?: number | null;
  prescribed?: number | null;
  suspended?: number | null;
  without_entry_date?: number | null;
};
type Dashboard = {
  summary: Summary;
  charts: { por_produto: Row[] };
  filters: { states: string[]; products: string[]; resolutions: string[] };
  updated_at?: string | null;
  _read_status?: 'live' | 'fresh-cache' | 'stale';
};
type ProcessRow = { id: number | string; cnj: string; state?: string; situation?: string; pasta?: string | null; tipo_validado?: string | null; entry_date?: string | null; product?: string | null; resolution?: string | null; last_movement_at?: string | null };
type Paged = { rows: ProcessRow[]; total: number; page: number; page_size: number };
type Api = { request: <T>(path: string, options?: RequestInit) => Promise<T>; getPortfolioId?: () => string };
type Env = Window & { MBA_API?: Api; MBA_AUTOMATION_API?: Api; MBA_NAVIGATE?: (route: string) => boolean };
type Period = 'all' | 'month' | '90' | '365';
type Category = 'active' | 'prescribed' | 'closing' | 'suspended' | 'dismissed' | 'extinct' | 'upheld' | 'injunction';
const catalog: Array<{ key: Category; label: string; subtitle: string; icon: LucideIcon }> = [
  { key: 'active', label: 'Base ativa', subtitle: 'Aging até 18 meses comprovado', icon: FolderOpen },
  { key: 'prescribed', label: 'Base prescrita', subtitle: 'Aging superior a 18 meses', icon: Clock3 },
  { key: 'closing', label: 'Em encerramento', subtitle: 'Aptos sem envio confirmado ao Benner', icon: Hourglass },
  { key: 'suspended', label: 'Suspensos', subtitle: 'Sinal de suspensão na base processual', icon: CirclePause },
  { key: 'dismissed', label: 'Improcedentes', subtitle: 'Sentença de improcedência', icon: FileX2 },
  { key: 'extinct', label: 'Extintos', subtitle: 'Sentença de extinção', icon: FileCheck2 },
  { key: 'upheld', label: 'Procedências', subtitle: 'Sentença procedente', icon: CheckCircle2 },
  { key: 'injunction', label: 'Com tutela deferida', subtitle: 'Tutela deferida identificada', icon: ShieldAlert },
];
const number = (value: number | null | undefined) => typeof value === 'number' && Number.isFinite(value)
  ? new Intl.NumberFormat('pt-BR').format(value) : '—';
const validNumber = (value: unknown): number | null => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
const REGULAR_CASE_FEE = 35;
const money = (value: number | null) => value === null ? '—' : new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0,
}).format(value);
export const regularEstimatedRevenue = (portfolio: string, total: unknown): number | null => {
  if (portfolio !== 'agibank_mba' || typeof total !== 'number' || !Number.isSafeInteger(total) || total < 0) return null;
  const amount = total * REGULAR_CASE_FEE;
  return Number.isSafeInteger(amount) ? amount : null;
};
const dateStart = (period: Period) => {
  if (period === 'all') return '';
  const d = new Date();
  if (period === 'month') d.setDate(1);
  else d.setDate(d.getDate() - (period === '90' ? 89 : 364));
  return [d.getFullYear(), String(d.getMonth() + 1).padStart(2, '0'), String(d.getDate()).padStart(2, '0')].join('-');
};
const queryFor = (period: Period, uf: string, product: string, situation: string, resolution: string) => {
  const params = new URLSearchParams();
  if (period !== 'all') params.set('entry_start', dateStart(period));
  if (uf) params.set('uf', uf);
  if (product) params.set('product', product);
  if (situation) params.set('situation', situation);
  if (resolution) params.set('resolution', resolution);
  return params.toString();
};

// Calendar cutoff, rather than 540/548 fixed days: only entries strictly older
// than 18 calendar months are placed in the operational "prescribed" bucket.
export function operationalAgingCutoff(now = new Date()): string {
  const parts = new Intl.DateTimeFormat('en-GB', { timeZone: 'America/Campo_Grande',
    year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(now);
  const val = (kind: string) => Number(parts.find(part => part.type === kind)?.value || 0);
  const year = val('year'), month = val('month'), day = val('day');
  const targetFirst = new Date(Date.UTC(year, month - 1 - 18, 1));
  const targetMonthLast = new Date(Date.UTC(targetFirst.getUTCFullYear(), targetFirst.getUTCMonth() + 1, 0)).getUTCDate();
  const anniversary = new Date(Date.UTC(targetFirst.getUTCFullYear(), targetFirst.getUTCMonth(), Math.min(day, targetMonthLast)));
  anniversary.setUTCDate(anniversary.getUTCDate() - 1);
  return anniversary.toISOString().slice(0, 10);
}
const portfolioName = (id: string) => ({
  agibank_enter: 'Agibank · Enter', agibank_mba: 'Agibank · MBA',
  energisa_enter: 'Energisa · Enter', banco_pan_mba: 'Banco Pan · MBA',
  nubank_mba: 'Nubank · MBA',
}[id] || id.replace(/_/g, ' '));
const validDashboard = (value: unknown): value is Dashboard => {
  if (!value || typeof value !== 'object') return false;
  const d = value as Partial<Dashboard>;
  return Boolean(d.summary && d.charts && d.filters && Array.isArray(d.charts.por_produto));
};
const getApi = () => (window as Env).MBA_AUTOMATION_API || (window as Env).MBA_API;


// XLS/Excel-safe semicolon CSV with BOM; no formula from imported data is evaluated.
export function serializeBaseGeralCsv(header: string[], rows: Array<Array<unknown>>) {
  const safe = (value: unknown) => {
    let text = String(value ?? '');
    if (/^[\s]*[=+@\t\r]/.test(text) || /^-[^0-9]/.test(text)) text = "'" + text;
    return '"' + text.replace(/"/g, '""') + '"';
  };
  return '\ufeff' + [header, ...rows].map(row => row.map(safe).join(';')).join('\r\n');
}
function saveCsv(filename: string, content: string) {
  const uri = URL.createObjectURL(new Blob([content], { type: 'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = uri;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.setTimeout(() => URL.revokeObjectURL(uri), 1000);
}


function Select({ label, value, options, onChange }: {
  label: string; value: string; options: Array<{ value: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return <label className="base-geral-filter"><span>{label}</span>
    <select value={value} onChange={event => onChange(event.target.value)}>
      {options.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
    </select>
  </label>;
}
const fromValues = (values: string[]) => [
  { value: '', label: 'Todos' }, ...values.map(value => ({ value, label: value })),
];

export function BaseGeralPage({visible=true}:{visible?:boolean}) {
  const [portfolio, setPortfolio] = useState(() => (window as Env).MBA_API?.getPortfolioId?.() || '');
  const [revision, setRevision] = useState(0);
  const [period, setPeriod] = useState<Period>('all');
  const [uf, setUf] = useState('');
  const [product, setProduct] = useState('');
  const [situation, setSituation] = useState('');
  const [resolution, setResolution] = useState('');
  const [data, setData] = useState<Dashboard | null>(null);
  const [dataKey, setDataKey] = useState('');
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  const [closingCount, setClosingCount] = useState<{ key: string; value: number } | null>(null);
  const [detail, setDetail] = useState<Category | null>(null);
  const [revenueOpen, setRevenueOpen] = useState(false);
  const [tutelaOutcome, setTutelaOutcome] = useState<'deferidas' | 'indeferidas'>('deferidas');
  const [detailSearchInput, setDetailSearchInput] = useState('');
  const [detailSearch, setDetailSearch] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const exportSequence = useRef(0);
  const [detailPage, setDetailPage] = useState(1);
  const [detailData, setDetailData] = useState<Paged | null>(null);
  const [detailPending, setDetailPending] = useState(false);
  const [detailError, setDetailError] = useState('');
  const requestSequence = useRef(0);

  const filterKey = [portfolio, revision, period, uf, product, situation, resolution].join('|');
  const filterQuery = useMemo(() => queryFor(period, uf, product, situation, resolution), [period, uf, product, situation, resolution]);
  // A API de Processos suporta apenas UF, situação e movimentação.
  const comparable = period === 'all' && !product && !situation && !resolution;
  const canSeeClosings = ['agibank_enter','agibank_mba','nubank_mba'].includes(portfolio)
    && (window as Window & { MBA_CURRENT_USER?: { permissions?: Record<string, boolean> } }).MBA_CURRENT_USER?.permissions?.['encerramentos.view'] === true;
  const closingComparable = comparable && !uf && canSeeClosings;

  const visibleRef=useRef(visible); visibleRef.current=visible;
  const refresh = useCallback(async (force = false) => {
    if(!visibleRef.current)return;
    const sequence = ++requestSequence.current;
    const api = getApi();
    const queryKey=['runtime-v2',runtimeScope(),'base-geral',filterQuery] as const;
    setPending(true);
    try {
      if (!api) throw new Error('API indisponível.');
      if (force) await runtimeQueries.invalidateQueries({queryKey:[...queryKey],exact:true});
      const result = await runtimeQueries.fetchQuery({queryKey:[...queryKey],staleTime:75000,queryFn:()=>api.request<unknown>('/api/base-geral/summary' + (filterQuery ? '?' + filterQuery : ''))});
      if (sequence !== requestSequence.current) return;
      if (!validDashboard(result)) throw new Error('Estrutura de indicadores inválida.');
      setData(result);
      setDataKey(filterKey);
      setError('');
    } catch (cause) {
      if (sequence === requestSequence.current) setError(cause instanceof Error ? cause.message : 'Falha ao consultar a base.');
    } finally {
      if (sequence === requestSequence.current) setPending(false);
    }
  }, [filterKey, filterQuery]);

  useEffect(() => { if(visible)void refresh(); }, [refresh,visible]);
  useEffect(() => {
    const changed = () => {
      ++requestSequence.current;
      setPortfolio((window as Env).MBA_API?.getPortfolioId?.() || '');
      setRevision(value => value + 1);
      setUf(''); setProduct(''); setSituation(''); setResolution('');
      setData(null); setDataKey(''); setClosingCount(null);
      setDetail(null); setRevenueOpen(false); setDetailData(null); setError('');
      setDetailSearch(''); setDetailSearchInput(''); setTutelaOutcome('deferidas');
      exportSequence.current += 1; setExporting(false); setExportProgress('');
    };
    window.addEventListener('mba:portfolio-changed', changed);
    return () => { window.removeEventListener('mba:portfolio-changed', changed); ++requestSequence.current; };
  }, []);
  useEffect(() => {
    const tick = () => { if (visibleRef.current && !document.hidden) void refresh(true); };
    const interval = window.setInterval(tick, 300000);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(interval); document.removeEventListener('visibilitychange', tick); };
  }, [refresh]);

  const shown = dataKey === filterKey ? data : null;
  const summary = shown?.summary;
  const estimatedRevenue = regularEstimatedRevenue(portfolio, summary?.total);
  const products = shown?.charts.por_produto?.filter(row => Number.isFinite(Number(row.value)) && Number(row.value) > 0) || [];

  useEffect(() => {
    let cancelled = false;
    setClosingCount(null);
    if (!shown || !closingComparable) return () => { cancelled = true; };
    void getClosingCases('APTOS', 10, 0, '', 'todos', 'todos', 'nao', 'todos')
      .then(result => { if (!cancelled && validNumber(result.total) != null) setClosingCount({ key: filterKey, value: result.total }); })
      .catch(() => { /* Ausência de acesso ou indisponibilidade não é igual a zero. */ });
    return () => { cancelled = true; };
  }, [shown, closingComparable, filterKey]);

  const categories: Partial<Record<Category, number | null>> = {
    active: validNumber(summary?.active),
    prescribed: validNumber(summary?.prescribed),
    closing: closingCount?.key === filterKey ? closingCount.value : null,
    suspended: validNumber(summary?.suspended),
    dismissed: validNumber(summary?.dismissed),
    extinct: validNumber(summary?.extinct),
    upheld: validNumber(summary?.upheld),
    injunction: validNumber(summary?.injunction_granted),
  };
  const tutelaCounts = {
    deferidas: validNumber(summary?.injunction_granted),
    indeferidas: validNumber(summary?.injunction_denied),
  };
  const prescribed = categories.prescribed;
  const active = categories.active;
  const donutReady = active != null && prescribed != null && active + prescribed > 0;
  const activeShare = donutReady ? active! / (active! + prescribed!) * 100 : 0;
  const chartStyle = donutReady
    ? { background: 'conic-gradient(var(--mba-orange, #e87828) 0% ' + activeShare + '%, var(--mba-blue, #4577ba) ' + activeShare + '% 100%)' }
    : undefined;

  const detailCategory = detail === 'injunction'
    ? (tutelaOutcome === 'deferidas' ? 'injunction_deferida' : 'injunction_indeferida')
    : detail;
  const listSupported = Boolean(detail);
  const filtersSupported = detail === 'closing' ? closingComparable : true;
  useEffect(() => {
    let cancelled = false;
    setDetailData(null);
    setDetailError('');
    if (!detail || !listSupported || !filtersSupported) return () => { cancelled = true; };
    const api = getApi();
    if (!api) { setDetailError('API indisponível.'); return () => { cancelled = true; }; }
    const params = new URLSearchParams(filterQuery);
    params.set('page', String(detailPage));
    params.set('page_size', '25');
    if (detailCategory && detailCategory !== 'closing') params.set('category', detailCategory);
    if (detailSearch.trim()) params.set('q', detailSearch.replace(/\D/g, '').slice(0, 20));
    setDetailPending(true);
    const request: Promise<Paged> = detail === 'closing'
      ? getClosingCases('APTOS', 25, (detailPage - 1) * 25, detailSearch.trim(), 'todos', 'todos', 'nao', 'todos')
          .then(result => ({ rows: (result.rows || []).map(row => ({
            id: row.cnj, cnj: row.cnj, state: row.uf || '—', pasta: row.pasta, tipo_validado: row.tipo_validado,
            situation: 'Apto, sem envio ao Benner',
          })), total: result.total, page: detailPage, page_size: 25 }))
      : api.request<Paged>('/api/base-geral/processos?' + params.toString());
    void request.then(result => {
      if (!cancelled) setDetailData(result);
    }).catch(cause => {
      if (!cancelled) setDetailError(cause instanceof Error ? cause.message : 'Falha ao carregar processos.');
    }).finally(() => { if (!cancelled) setDetailPending(false); });
    return () => { cancelled = true; };
  }, [detail, detailPage, detailCategory, detailSearch, listSupported, filtersSupported, filterQuery, portfolio, revision]);

  const openDetail = (value: Category) => {
    exportSequence.current += 1;
    setDetail(value); setDetailPage(1); setDetailData(null);
    setDetailSearch(''); setDetailSearchInput(''); setTutelaOutcome('deferidas');
    setDetailError(''); setExportProgress(''); setExporting(false);
  };
  const closeDetail = () => { exportSequence.current += 1; setExporting(false); setDetail(null); };
  useEffect(() => {
    if (!detail && !revenueOpen) return;
    const keydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (revenueOpen) setRevenueOpen(false);
        else closeDetail();
      }
    };
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', keydown);
    return () => { document.body.style.overflow = previous; window.removeEventListener('keydown', keydown); };
  }, [detail, revenueOpen]);
  const detailLabel = detail === 'injunction' ? 'Tutelas' : detail ? catalog.find(item => item.key === detail)?.label : '';

  const exportDetails = async () => {
    if (!detail || !listSupported || !filtersSupported || exporting || detailPending || !detailData) return;
    const serial = ++exportSequence.current;
    if (detail !== 'closing') {
      const api = getApi();
      if (!api) { setDetailError('API indisponível.'); return; }
      const params = new URLSearchParams(filterQuery);
      params.set('category', detailCategory || 'active');
      if (detailSearch.trim()) params.set('q', detailSearch.replace(/\D/g, '').slice(0, 20));
      setExporting(true); setDetailError(''); setExportProgress('Gerando CSV completo na API...');
      try {
        const file = await api.request<{filename: string; csv: string; total: number}>(
          '/api/base-geral/export?' + params.toString());
        if (serial !== exportSequence.current) return;
        if (typeof file.csv !== 'string' || !file.filename || !Number.isSafeInteger(file.total)) {
          throw new Error('Resposta inválida da exportação.');
        }
        saveCsv(file.filename, file.csv);
        setExportProgress(number(file.total) + ' registros exportados.');
      } catch (cause) {
        if (serial === exportSequence.current) setDetailError(
          cause instanceof Error ? cause.message : 'Falha ao exportar CSV.');
      } finally {
        if (serial === exportSequence.current) setExporting(false);
      }
      return;
    }
    const total = detailData.total;
    if (!Number.isSafeInteger(total) || total < 0 || total > 10000) {
      setDetailError('A relação excede o limite de 10.000 registros da consulta paginada. É necessário exportar pelo backend.');
      return;
    }
    const pageSize = 100;
    const pages = Math.ceil(total / pageSize);
    const api = getApi();
    if (!api) { setDetailError('API indisponível.'); return; }
    setExporting(true); setDetailError(''); setExportProgress('Preparando CSV...');
    const all: ProcessRow[] = [];
    try {
      for (let first = 0; first < pages; first += 4) {
        if (serial !== exportSequence.current) return;
        const indexes = Array.from({ length: Math.min(4, pages - first) }, (_, i) => first + i);
        const batches = await Promise.all(indexes.map(async index => {
          if (detail === 'closing') {
            const r = await getClosingCases('APTOS', pageSize, index * pageSize, detailSearch.trim(), 'todos', 'todos', 'nao', 'todos');
            return (r.rows || []).map(row => ({
              id: row.cnj, cnj: row.cnj, state: row.uf || '—', pasta: row.pasta,
              tipo_validado: row.tipo_validado, situation: 'Apto, sem envio ao Benner',
            } satisfies ProcessRow));
          }
          const params = new URLSearchParams(filterQuery);
          params.set('category', detailCategory || 'active');
          params.set('page', String(index + 1));
          params.set('page_size', String(pageSize));
          if (detailSearch.trim()) params.set('q', detailSearch.replace(/\D/g, '').slice(0, 20));
          const r = await api.request<Paged>('/api/base-geral/processos?' + params.toString());
          return r.rows || [];
        }));
        if (serial !== exportSequence.current) return;
        batches.forEach(rows => all.push(...rows));
        setExportProgress('Consultados ' + number(all.length) + ' de ' + number(total));
      }
      if (serial !== exportSequence.current) return;
      if (all.length !== total) throw new Error('A relação mudou durante a exportação. Atualize a consulta antes de tentar novamente.');
      const name = 'closing';
      const csv = serializeBaseGeralCsv(
        ['CNJ', 'Situação', 'UF', 'Pasta', 'Classificação', 'Data entrada', 'Produto', 'Encerramento'],
        all.map(row => [row.cnj, row.situation || '', row.state || '', row.pasta || '', row.tipo_validado || '', row.entry_date || '', row.product || '', row.resolution || '']),
      );
      saveCsv('base_geral_' + name + '_' + portfolio + '.csv', csv);
      setExportProgress(number(total) + ' registros exportados.');
    } catch (cause) {
      if (serial === exportSequence.current) setDetailError(cause instanceof Error ? cause.message : 'Falha ao exportar CSV.');
    } finally {
      if (serial === exportSequence.current) setExporting(false);
    }
  };
  return <section className="base-geral-page" aria-label="Base Geral da carteira processual">
    <header className="base-geral-header">
      <div><h1>Base Geral</h1></div>
      <div className="base-geral-actions">
        <span>{portfolioName(portfolio)}</span>
        <button type="button" onClick={() => void refresh(true)} disabled={pending} aria-label="Atualizar Base Geral" title="Atualizar Base Geral"><RefreshCw size={15} className={pending ? 'base-geral-spin' : ''}/><span className="mba-visually-hidden">Atualizar</span></button>
      </div>
    </header>
    <div className="base-geral-filters">
      <Select label="Período da entrada" value={period} onChange={value => setPeriod(value as Period)} options={[
        {value:'all',label:'Todo o histórico'}, {value:'month',label:'Mês atual'},
        {value:'90',label:'Últimos 90 dias'}, {value:'365',label:'Últimos 12 meses'},
      ]}/>
      <Select label="Situação" value={situation} onChange={setSituation} options={[
        {value:'',label:'Todas'}, {value:'active',label:'Em andamento'},
        {value:'closed',label:'Encerrados'}, {value:'unknown',label:'Não informada'},
      ]}/>
      <Select label="UF" value={uf} onChange={setUf} options={fromValues(data?.filters.states || [])}/>
      <Select label="Produto" value={product} onChange={setProduct} options={fromValues(data?.filters.products || [])}/>
      <Select label="Encerramento" value={resolution} onChange={setResolution} options={fromValues(data?.filters.resolutions || [])}/>
    </div>
    {error && <div className="base-geral-error" role="alert">{shown?'Atualização indisponível. Últimos dados preservados.':error} <button type="button" onClick={() => void refresh(true)}>Tentar novamente</button></div>}
    {shown?._read_status==='stale' && <div className="base-geral-warning" role="status">Exibindo último consolidado disponível. A consulta ao banco será revalidada na próxima atualização.</div>}
    {pending && !shown && <p role="status" className="base-geral-muted">Carregando indicadores...</p>}
    <div className={'base-geral-kpis' + (portfolio === 'agibank_mba' ? ' base-geral-kpis-regular' : '')}>
      {catalog.map(({key,label,subtitle,icon:Icon}) => <button key={key} type="button" className="base-geral-card mba-metric-card"
        onClick={() => openDetail(key)} title={subtitle} aria-label={'Abrir relação: ' + label + '. ' + subtitle}>
        <span className="base-geral-card-top"><span>{label}</span><Icon size={15} strokeWidth={1.7}/></span>
        <strong>{shown ? number(categories[key]) : '—'}</strong>
      </button>)}
      {portfolio === 'agibank_mba' && <button type="button"
        className="base-geral-card mba-metric-card base-geral-revenue-card"
        title="Faturamento estimado: R$ 35 por processo da Regular"
        aria-label="Detalhar faturamento estimado da Regular"
        disabled={estimatedRevenue === null}
        onClick={() => setRevenueOpen(true)}>
        <span className="base-geral-card-top"><span>Faturamento</span><Wallet size={15} strokeWidth={1.7}/></span>
        <strong>{money(estimatedRevenue)}</strong>
        <span className="base-geral-revenue-note">Estimado · R$ 35/processo</span>
      </button>}
    </div>
    <div className="base-geral-bottom">
      <section className="base-geral-panel" id="base-geral-produtos">
        <header><div><h2>Produto</h2></div>
          <div className="base-geral-panel-actions"><span className="base-geral-tally">{number(products.reduce((sum, item) => sum + Number(item.value), 0))} registros</span>
            <button type="button" className="base-geral-csv-action" disabled={!products.length} onClick={() =>
              saveCsv('base_geral_produtos_' + portfolio + '.csv', serializeBaseGeralCsv(
                ['Produto', 'Processos', 'Participação (%)'],
                products.map(item => [item.label, item.value,
                  products.reduce((acc, p) => acc + Number(p.value), 0)
                    ? (Number(item.value) / products.reduce((acc, p) => acc + Number(p.value), 0) * 100).toFixed(1).replace('.', ',')
                    : '0'])
              ))}><Download size={14}/> CSV</button>
          </div>
        </header>
        <div className="base-geral-table-scroll">
          <table className="base-geral-products"><thead><tr><th>Produto</th><th>Processos</th><th>Participação</th><th>Detalhar</th></tr></thead>
            <tbody>{products.length ? products.map(item => {
              const total = products.reduce((sum, row) => sum + Number(row.value), 0);
              const share = total ? (Number(item.value) / total * 100).toFixed(1).replace('.', ',') : '0';
              return <tr key={item.label}><td>{item.label}</td><td>{number(item.value)}</td><td>{share}%</td>
                <td><button type="button" onClick={() => { setProduct(item.label); window.scrollTo({top: 0, behavior: 'smooth'}); }} aria-label={'Filtrar pelo produto ' + item.label}>Filtrar <ArrowUpRight size={13}/></button></td>
              </tr>;
            }) : <tr><td colSpan={4} className="base-geral-empty">Sem produtos para os filtros selecionados.</td></tr>}</tbody>
          </table>
        </div>
      </section>
      <section className="base-geral-panel base-geral-comparison">
        <header><div><h2>Prejuízo X Lucro</h2><span className="base-geral-context">Quantidade de processos</span></div></header>
        <div className="base-geral-chart-area">
          <button type="button" className={'base-geral-donut ' + (!donutReady ? 'is-unavailable' : '')}
            style={chartStyle} onClick={() => openDetail('active')} aria-label="Detalhar comparação entre base prescrita e base ativa">
            <span><strong>{donutReady ? activeShare.toFixed(1).replace('.', ',') + '%' : '—'}</strong><small>Base ativa</small></span>
          </button>
          <div className="base-geral-donut-labels">
            <button type="button" onClick={() => openDetail('active')}><i className="is-active"/> Base ativa <strong>{number(active)}</strong></button>
            <button type="button" onClick={() => openDetail('prescribed')}><i className="is-prescribed"/> Base prescrita <strong>{number(prescribed)}</strong></button>
            {!donutReady && <p className="base-geral-unavailable">Aguardando as contagens filtradas de aging e base ativa.</p>}
          </div>
        </div>
        <details className="mba-help-disclosure"><summary>Critérios do indicador</summary><p>Corte de aging: 18 meses calendários desde a entrada. Base prescrita é um indicador operacional, não confirmação de prescrição jurídica. Processos sem data de entrada ficam fora do comparativo; os dois grupos do donut são exclusivos. Valores em quantidade de processos, não monetários.</p></details>
      </section>
    </div>
    {revenueOpen && portfolio === 'agibank_mba' && <div className="base-geral-overlay" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) setRevenueOpen(false);
    }}>
      <section className="base-geral-dialog base-geral-revenue-dialog" role="dialog" aria-modal="true" aria-label="Cálculo de faturamento estimado">
        <header className="base-geral-dialog-head">
          <div><h2>Faturamento</h2><p>Regular · estimativa</p></div>
          <button type="button" className="base-geral-dismiss" onClick={() => setRevenueOpen(false)} aria-label="Fechar faturamento"><X size={19}/></button>
        </header>
        <div className="base-geral-revenue-breakdown">
          <div><span>Processos considerados</span><strong>{number(summary?.total)}</strong></div>
          <div><span>Valor unitário</span><strong>R$ 35,00</strong></div>
          <div className="base-geral-revenue-total"><span>Faturamento estimado</span><strong>{money(estimatedRevenue)}</strong></div>
        </div>
        <p className="base-geral-caption">Calculado sobre os processos do período e filtros selecionados. Não representa valores faturados ou recebidos.</p>
      </section>
    </div>}
    {detail && <div className="base-geral-overlay" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) closeDetail();
    }}>
      <section className="base-geral-dialog" role="dialog" aria-modal="true" aria-label={'Relação de processos: ' + detailLabel}>
        <header className="base-geral-dialog-head">
          <div><h2>{detailLabel}</h2><p>Relação de CNJs da carteira selecionada</p></div>
          <button type="button" className="base-geral-dismiss" onClick={closeDetail} aria-label="Fechar relação"><X size={19}/></button>
        </header>
        {detail === 'injunction' && <div className="base-geral-outcome-tabs" role="group" aria-label="Situação das tutelas">
          {(['deferidas', 'indeferidas'] as const).map(outcome =>
            <button key={outcome} type="button" className={tutelaOutcome === outcome ? 'active' : ''}
              aria-pressed={tutelaOutcome === outcome} onClick={() => {
                if (outcome === tutelaOutcome) return;
                exportSequence.current += 1;
                setExporting(false); setExportProgress(''); setDetailError('');
                setTutelaOutcome(outcome); setDetailPage(1); setDetailData(null);
              }}>
              {outcome === 'deferidas' ? 'Deferidas' : 'Indeferidas'}
              <span>{number(tutelaCounts[outcome])}</span>
            </button>)}
        </div>}
        {listSupported && filtersSupported && <div className="base-geral-dialog-toolbar">
          <form onSubmit={event => { event.preventDefault(); setDetailPage(1); setDetailSearch(detailSearchInput.trim()); }}>
            <Search size={15}/><input value={detailSearchInput} onChange={event => setDetailSearchInput(event.target.value)}
              placeholder={detail === 'closing' ? 'Buscar CNJ ou pasta' : 'Buscar CNJ'} aria-label="Buscar processo"/>
            <button type="submit" disabled={detailPending}>Buscar</button>
          </form>
          <button type="button" onClick={() => void exportDetails()}
            disabled={!detailData || detailPending || exporting || (detail === 'closing' && detailData.total > 10000)}
            title="Exporta a relação completa dos processos filtrados">
            <Download size={15}/> {exporting ? 'Exportando...' : 'CSV completo'}
          </button>
        </div>}
        {listSupported && filtersSupported && <p className="base-geral-dialog-source">
          {detail === 'closing' ? 'Fonte: fila operacional de encerramentos · aptos sem envio confirmado'
            : 'Fonte: diretório processual · recorte ' + (detailCategory || '')}
          {detailSearch ? ' · busca: ' + detailSearch : ''}
        </p>}
        {!listSupported && <div className="base-geral-warning">A categoria não está disponível para consulta.</div>}
        {listSupported && !filtersSupported && <div className="base-geral-warning">
          Os filtros atuais não são suportados pela listagem desta categoria. Limpe-os para consultar ou exportar uma relação consistente com os cards.
        </div>}
        {detailError && <p className="base-geral-error base-geral-dialog-error" role="alert">{detailError}</p>}
        {exportProgress && <p className="base-geral-export-status" role="status">{exportProgress}</p>}
        {listSupported && filtersSupported && <div className="base-geral-dialog-table-wrap">
          <table className="base-geral-detail-table">
            <thead><tr><th>CNJ</th><th>Situação</th><th>UF</th><th>Data entrada</th><th>Produto</th>{detail === 'closing' && <><th>Pasta</th><th>Classificação</th></>}</tr></thead>
            <tbody>{detailData?.rows?.map(row => <tr key={row.id}>
              <td><button type="button" onClick={() => (window as Env).MBA_NAVIGATE?.('processos/' + encodeURIComponent(row.cnj))}>{row.cnj} <ArrowUpRight size={12}/></button></td>
              <td>{row.situation || '—'}</td><td>{row.state || '—'}</td><td>{row.entry_date || '—'}</td><td>{row.product || '—'}</td>
              {detail === 'closing' && <><td>{row.pasta || '—'}</td><td>{row.tipo_validado || '—'}</td></>}
            </tr>)}</tbody>
          </table>
          {detailPending && <p className="base-geral-dialog-empty" role="status">Consultando registros...</p>}
          {!detailPending && detailData && !detailData.rows?.length && <p className="base-geral-dialog-empty">Nenhum processo localizado.</p>}
        </div>}
        <footer className="base-geral-dialog-footer">
          <span>{listSupported && filtersSupported ? (detailData ? number(detailData.total) + ' registros' : '—') : 'Relação indisponível'}</span>
          {listSupported && filtersSupported && <nav aria-label="Páginas da consulta">
            <button type="button" disabled={detailPage <= 1 || detailPending} onClick={() => setDetailPage(value => value - 1)} aria-label="Página anterior">Anterior</button>
            <span>Página {detailPage}{detailData ? ' de ' + Math.max(1, Math.ceil(detailData.total / 25)) : ''}</span>
            <button type="button" disabled={detailPending || !detailData || detailPage * 25 >= detailData.total} onClick={() => setDetailPage(value => value + 1)} aria-label="Próxima página">Próxima</button>
          </nav>}
        </footer>
      </section>
    </div>}
  </section>;
}
