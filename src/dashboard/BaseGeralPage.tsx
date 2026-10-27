import {runtimeQueries,runtimeScope} from '../tasks/runtimeQueries';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight, CheckCircle2, CirclePause, Clock3, FileCheck2,
  FileX2, FolderOpen, Hourglass, Search, ShieldAlert, Wallet, X,
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
type RegularBilling = {
  billing_month: string; source_send_month: string;
  fee_brl: number; installments_per_case: number;
  monthly_cases: number; monthly_amount: number;
  sent_cases: number; advanced_cases: number; advanced_installments: number;
  advance_amount: number; total_amount: number;
  missing_entry_date: number; not_under_35_years: number;
};
const validRegularBilling = (value: unknown): value is RegularBilling => {
  if (!value || typeof value !== 'object') return false;
  const v = value as Partial<RegularBilling>;
  const integers = [v.fee_brl, v.installments_per_case, v.monthly_cases,
    v.monthly_amount, v.sent_cases, v.advanced_cases, v.advanced_installments,
    v.advance_amount, v.total_amount, v.missing_entry_date, v.not_under_35_years];
  return /^20\d{2}-(0[1-9]|1[0-2])$/.test(v.billing_month || '') &&
    /^20\d{2}-(0[1-9]|1[0-2])$/.test(v.source_send_month || '') &&
    integers.every(x => typeof x === 'number' && Number.isSafeInteger(x) && x >= 0) &&
    v.fee_brl === 35 && v.installments_per_case === 18 &&
    v.total_amount === v.monthly_amount! + v.advance_amount!;
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
const money = (value: number | null) => value === null ? '—' : new Intl.NumberFormat('pt-BR', {
  style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0,
}).format(value);
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
  const [canViewBilling, setCanViewBilling] = useState(() => (window as Window & {MBA_CURRENT_USER?: {permissions?: Record<string,boolean>}}).MBA_CURRENT_USER?.permissions?.['faturamento.view'] === true);
  const [billing, setBilling] = useState<RegularBilling | null>(null);
  const [billingKey, setBillingKey] = useState('');
  const [billingPending, setBillingPending] = useState(false);
  const [billingError, setBillingError] = useState('');
  const billingSequence = useRef(0);
  const [tutelaOutcome, setTutelaOutcome] = useState<'deferidas' | 'indeferidas'>('deferidas');
  const [detailSearchInput, setDetailSearchInput] = useState('');
  const [detailSearch, setDetailSearch] = useState('');
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

  const refreshBilling = useCallback(async (force = false) => {
    if (!visibleRef.current || portfolio !== 'agibank_mba' || !canViewBilling) return;
    const serial = ++billingSequence.current;
    const api = getApi();
    const queryKey = ['runtime-v2',runtimeScope(),'base-geral','faturamento',filterQuery] as const;
    setBillingPending(true);
    try {
      if (!api) throw new Error('API indisponível.');
      if (force) await runtimeQueries.invalidateQueries({queryKey:[...queryKey],exact:true});
      const response = await runtimeQueries.fetchQuery({
        queryKey:[...queryKey],staleTime:75000,
        queryFn:()=>api.request<unknown>('/api/base-geral/faturamento' + (filterQuery ? '?' + filterQuery : '')),
      });
      if (serial !== billingSequence.current) return;
      if (!validRegularBilling(response)) throw new Error('Resultado de faturamento inválido.');
      setBilling(response); setBillingKey(filterKey); setBillingError('');
    } catch (cause) {
      if (serial === billingSequence.current) {
        setBilling(null); setBillingKey(''); setBillingError(cause instanceof Error ? cause.message : 'Faturamento indisponível.');
      }
    } finally {
      if (serial === billingSequence.current) setBillingPending(false);
    }
  }, [portfolio, filterKey, filterQuery, canViewBilling]);

  useEffect(() => { if(visible)void refresh(); }, [refresh,visible]);
  useEffect(() => { if(visible && portfolio === 'agibank_mba' && canViewBilling)void refreshBilling(); }, [refreshBilling,visible,portfolio,canViewBilling]);
  useEffect(() => {
    const sync = () => setCanViewBilling((window as Window & {MBA_CURRENT_USER?: {permissions?: Record<string,boolean>}}).MBA_CURRENT_USER?.permissions?.['faturamento.view'] === true);
    for (const event of ['mba:authenticated','mba:profile-ready','mba:logged-out','mba:session-expired']) window.addEventListener(event, sync);
    return () => { for (const event of ['mba:authenticated','mba:profile-ready','mba:logged-out','mba:session-expired']) window.removeEventListener(event, sync); };
  }, []);
  useEffect(() => {
    const changed = () => {
      ++requestSequence.current;
      ++billingSequence.current;
      setBilling(null); setBillingKey(''); setBillingPending(false); setBillingError('');
      setPortfolio((window as Env).MBA_API?.getPortfolioId?.() || '');
      setRevision(value => value + 1);
      setUf(''); setProduct(''); setSituation(''); setResolution('');
      setData(null); setDataKey(''); setClosingCount(null);
      setDetail(null); setRevenueOpen(false); setDetailData(null); setError('');
      setDetailSearch(''); setDetailSearchInput(''); setTutelaOutcome('deferidas');

    };
    window.addEventListener('mba:portfolio-changed', changed);
    return () => { window.removeEventListener('mba:portfolio-changed', changed); ++requestSequence.current; };
  }, []);
  useEffect(() => {
    const tick = () => {
      if (visibleRef.current && !document.hidden) {
        void refresh(true); void refreshBilling(true);
      }
    };
    const interval = window.setInterval(tick, 300000);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(interval); document.removeEventListener('visibilitychange', tick); };
  }, [refresh,refreshBilling]);

  const shown = dataKey === filterKey ? data : null;
  const summary = shown?.summary;
  const currentBilling = canViewBilling && billingKey === filterKey && portfolio === 'agibank_mba' ? billing : null;
  const estimatedRevenue = currentBilling?.total_amount ?? null;
  const products = shown?.charts.por_produto?.filter(row => Number.isFinite(Number(row.value)) && Number(row.value) > 0) || [];
  const productTotal = products.reduce((sum, row) => sum + Number(row.value), 0);
  // Only brand-neutral and native Backoffice tokens: no imported rainbow palette.
  const productColors = ['var(--mba-blue)', 'var(--mba-orange)', 'var(--mba-text-2)', 'var(--mba-border-strong)', 'var(--mba-muted)', 'var(--mba-text)', 'var(--mba-border)'];
  const productGradient = productTotal > 0 ? {
    background: 'conic-gradient(' + products.map((row, index) => {
      const start = products.slice(0,index).reduce((sum,item)=>sum+Number(item.value),0)/productTotal*100;
      const end = products.slice(0,index+1).reduce((sum,item)=>sum+Number(item.value),0)/productTotal*100;
      return productColors[index % productColors.length] + ' ' + start + '% ' + end + '%';
    }).join(',') + ')',
  } : undefined;

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
    ? { background: 'conic-gradient(var(--mba-orange) 0% ' + activeShare + '%, var(--mba-blue) ' + activeShare + '% 100%)' }
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
    setDetail(value); setDetailPage(1); setDetailData(null);
    setDetailSearch(''); setDetailSearchInput(''); setTutelaOutcome('deferidas');
    setDetailError('');
  };
  const closeDetail = () => setDetail(null);
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

  return <section className="base-geral-page" aria-label="Base Geral da carteira processual">
    <header className="base-geral-header">
      <div><h1>Base Geral</h1></div>
      <div className="base-geral-actions">
        <span>{portfolioName(portfolio)}</span>
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
    {shown?._read_status==='stale' && <div className="base-geral-warning" role="status">Exibindo último consolidado disponível. A consulta será revalidada automaticamente.</div>}
    <div className={'base-geral-kpis base-geral-kpis-primary' + (portfolio === 'agibank_mba' && canViewBilling ? ' base-geral-kpis-with-billing' : '')}>
      {catalog.slice(0,3).map(({key,label,subtitle,icon:Icon}) => <button key={key} type="button" className="base-geral-card mba-metric-card"
        onClick={() => openDetail(key)} title={subtitle} aria-label={'Abrir relação: ' + label + '. ' + subtitle}>
        <span className="base-geral-card-top"><span>{label}</span><Icon size={15} strokeWidth={1.7}/></span>
        <strong>{shown ? number(categories[key]) : <span className="base-geral-skeleton" aria-label="Carregando"/>}</strong>
      </button>)}
      {portfolio === 'agibank_mba' && canViewBilling && <button type="button"
        className="base-geral-card mba-metric-card base-geral-revenue-card"
        title="Faturamento projetado: 18 mensalidades de R$ 35 e antecipação pelos andamentos enviados no mês corrente"
        aria-label="Detalhar faturamento estimado da Regular"
        disabled={estimatedRevenue === null}
        onClick={() => setRevenueOpen(true)}>
        <span className="base-geral-card-top"><span>Faturamento</span><Wallet size={15} strokeWidth={1.7}/></span>
        <strong>{money(estimatedRevenue)}</strong>
        <span className="base-geral-revenue-note">{currentBilling
          ? 'Projetado · ' + currentBilling.billing_month.slice(5) + '/' + currentBilling.billing_month.slice(0,4)
          : billingPending ? 'Calculando…' : billingError ? 'Consulta indisponível' : '18 × R$ 35'}</span>
      </button>}
    </div>
    <div className="base-geral-kpis base-geral-kpis-status">
      {catalog.slice(3).map(({key,label,subtitle,icon:Icon}) => <button key={key} type="button" className="base-geral-card mba-metric-card"
        onClick={() => openDetail(key)} title={subtitle} aria-label={'Abrir relação: ' + label + '. ' + subtitle}>
        <span className="base-geral-card-top"><span>{label}</span><Icon size={15} strokeWidth={1.7}/></span>
        <strong>{shown ? number(categories[key]) : <span className="base-geral-skeleton" aria-label="Carregando"/>}</strong>
      </button>)}
    </div>
    <div className="base-geral-bottom">
      <section className="base-geral-panel base-geral-products-chart" id="base-geral-produtos">
        <header><div><h2>Produto</h2><span className="base-geral-context">Distribuição da carteira</span></div></header>
        <div className="base-geral-chart-area">
          <button type="button" className={'base-geral-donut ' + (!productTotal ? 'is-unavailable' : '')}
            disabled={!productTotal}
            style={productGradient} onClick={() => setProduct(products[0]?.label || '')}
            aria-label="Filtrar pelo produto de maior participação">
            <span><strong>{productTotal ? number(productTotal) : '—'}</strong><small>processos</small></span>
          </button>
          <div className="base-geral-product-legend">
            {products.length ? products.map((item,index) => <button type="button" key={item.label}
              onClick={() => setProduct(item.label)} aria-label={'Filtrar pelo produto ' + item.label}>
              <i style={{background:productColors[index % productColors.length]}}/>
              <span title={item.label}>{item.label}</span><strong>{number(item.value)}</strong>
              <small>{productTotal ? (Number(item.value)/productTotal*100).toFixed(1).replace('.', ',') : '0'}%</small>
            </button>) : <p className="base-geral-unavailable">Nenhum produto encontrado.</p>}
          </div>
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
    {revenueOpen && portfolio === 'agibank_mba' && canViewBilling && <div className="base-geral-overlay" role="presentation" onMouseDown={event => {
      if (event.target === event.currentTarget) setRevenueOpen(false);
    }}>
      <section className="base-geral-dialog base-geral-revenue-dialog" role="dialog" aria-modal="true" aria-label="Cálculo de faturamento estimado">
        <header className="base-geral-dialog-head">
          <div><h2>Faturamento</h2><p>Regular · billing {currentBilling?.billing_month.slice(5)}/{currentBilling?.billing_month.slice(0,4)}</p></div>
          <button type="button" className="base-geral-dismiss" onClick={() => setRevenueOpen(false)} aria-label="Fechar faturamento"><X size={19}/></button>
        </header>
        <div className="base-geral-revenue-breakdown">
          <div><span>Mensalidades ({number(currentBilling?.monthly_cases)})</span><strong>{money(currentBilling?.monthly_amount ?? null)}</strong></div>
          <div><span>Andamentos enviados em {currentBilling?.source_send_month.slice(5)}/{currentBilling?.source_send_month.slice(0,4)}</span><strong>{number(currentBilling?.sent_cases)}</strong></div>
          <div><span>Processos com antecipação</span><strong>{number(currentBilling?.advanced_cases)}</strong></div>
          <div><span>Parcelas vincendas antecipadas</span><strong>{number(currentBilling?.advanced_installments)}</strong></div>
          <div><span>Antecipações</span><strong>{money(currentBilling?.advance_amount ?? null)}</strong></div>
          <div className="base-geral-revenue-total"><span>Faturamento projetado</span><strong>{money(estimatedRevenue)}</strong></div>
        </div>
        <p className="base-geral-caption">Processos com menos de 35 anos desde a entrada, até 18 parcelas de R$ 35. Antecipação baseada exclusivamente no primeiro andamento de encerramento confirmado como enviado ao Benner no mês anterior ao billing. Estimativa sujeita à conciliação; não representa valores faturados ou recebidos.</p>
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
                setDetailError('');
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
        </div>}
        {listSupported && filtersSupported && <p className="base-geral-dialog-source">
          {detail === 'closing' ? 'Fonte: fila operacional de encerramentos · aptos sem envio confirmado'
            : 'Fonte: diretório processual · recorte ' + (detailCategory || '')}
          {detailSearch ? ' · busca: ' + detailSearch : ''}
        </p>}
        {!listSupported && <div className="base-geral-warning">A categoria não está disponível para consulta.</div>}
        {listSupported && !filtersSupported && <div className="base-geral-warning">
          Os filtros atuais não são suportados pela listagem desta categoria. Limpe-os para consultar uma relação consistente com os cards.
        </div>}
        {detailError && <p className="base-geral-error base-geral-dialog-error" role="alert">{detailError}</p>}
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
