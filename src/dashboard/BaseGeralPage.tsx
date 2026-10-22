import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowUpRight, CheckCircle2, CirclePause, Clock3, FileCheck2,
  FileX2, FolderOpen, Hourglass, Layers3, RefreshCw, Scale, ShieldAlert, X,
  type LucideIcon,
} from 'lucide-react';
import './baseGeral.css';

type Row = { label: string; value: number };
type Summary = {
  total: number; active: number; closed: number; unknown: number;
  // Os campos abaixo são opcionais até a publicação da agregação específica no backend.
  prescribed?: number | null;
  closing_in_progress?: number | null;
  suspended?: number | null;
  dismissed?: number | null;
  extinct?: number | null;
  upheld?: number | null;
  injunction_granted?: number | null;
};
type Dashboard = {
  summary: Summary;
  charts: { por_produto: Row[] };
  filters: { states: string[]; products: string[]; resolutions: string[] };
  updated_at?: string | null;
};
type ProcessRow = { id: number; cnj: string; state?: string; situation?: string; last_movement_at?: string | null };
type Paged = { rows: ProcessRow[]; total: number; page: number; page_size: number };
type Api = { request: <T>(path: string, options?: RequestInit) => Promise<T>; getPortfolioId?: () => string };
type Env = Window & { MBA_API?: Api; MBA_AUTOMATION_API?: Api; MBA_NAVIGATE?: (route: string) => boolean };
type Period = 'all' | 'month' | '90' | '365';
type Category = 'active' | 'prescribed' | 'closing' | 'suspended' | 'dismissed' | 'extinct' | 'upheld' | 'injunction';
type MovementCategory = 'dismissed' | 'extinct' | 'upheld' | 'injunction';

const movements: Record<MovementCategory, string> = {
  dismissed: 'sentence_improcedente',
  extinct: 'sentence_extincao',
  upheld: 'sentence_procedente',
  injunction: 'tutela_deferida',
};
const catalog: Array<{ key: Category; label: string; subtitle: string; icon: LucideIcon }> = [
  { key: 'active', label: 'Base ativa', subtitle: 'Em andamento no Benner', icon: FolderOpen },
  { key: 'prescribed', label: 'Base prescrita', subtitle: 'Prescrição identificada', icon: Clock3 },
  { key: 'closing', label: 'Em encerramento', subtitle: 'Fluxo de encerramento iniciado', icon: Hourglass },
  { key: 'suspended', label: 'Suspensos', subtitle: 'Situação de suspensão confirmada', icon: CirclePause },
  { key: 'dismissed', label: 'Improcedentes', subtitle: 'Sentença de improcedência', icon: FileX2 },
  { key: 'extinct', label: 'Extintos', subtitle: 'Sentença de extinção', icon: FileCheck2 },
  { key: 'upheld', label: 'Procedências', subtitle: 'Sentença procedente', icon: CheckCircle2 },
  { key: 'injunction', label: 'Com tutela deferida', subtitle: 'Tutela deferida identificada', icon: ShieldAlert },
];
const number = (value: number | null | undefined) => typeof value === 'number' && Number.isFinite(value)
  ? new Intl.NumberFormat('pt-BR').format(value) : '—';
const validNumber = (value: unknown): number | null => typeof value === 'number' && Number.isFinite(value) && value >= 0 ? value : null;
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
  if (uf) params.set('state', uf);
  if (product) params.set('product', product);
  if (situation) params.set('situation', situation);
  if (resolution) params.set('resolution', resolution);
  return params.toString();
};
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

export function BaseGeralPage() {
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
  const [movementsCount, setMovementsCount] = useState<Partial<Record<MovementCategory, number>>>({});
  const [detail, setDetail] = useState<Category | null>(null);
  const [detailPage, setDetailPage] = useState(1);
  const [detailData, setDetailData] = useState<Paged | null>(null);
  const [detailPending, setDetailPending] = useState(false);
  const [detailError, setDetailError] = useState('');
  const requestSequence = useRef(0);

  const filterKey = [portfolio, revision, period, uf, product, situation, resolution].join('|');
  const filterQuery = useMemo(() => queryFor(period, uf, product, situation, resolution), [period, uf, product, situation, resolution]);
  // A API de Processos suporta apenas UF, situação e movimentação.
  const comparable = period === 'all' && !product && !situation && !resolution;

  const refresh = useCallback(async () => {
    const sequence = ++requestSequence.current;
    const api = getApi();
    setPending(true);
    try {
      if (!api) throw new Error('API indisponível.');
      const result = await api.request<unknown>('/api/carteira-processual' + (filterQuery ? '?' + filterQuery : ''));
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

  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    const changed = () => {
      ++requestSequence.current;
      setPortfolio((window as Env).MBA_API?.getPortfolioId?.() || '');
      setRevision(value => value + 1);
      setUf(''); setProduct(''); setSituation(''); setResolution('');
      setData(null); setDataKey(''); setMovementsCount({});
      setDetail(null); setDetailData(null); setError('');
    };
    window.addEventListener('mba:portfolio-changed', changed);
    return () => { window.removeEventListener('mba:portfolio-changed', changed); ++requestSequence.current; };
  }, []);
  useEffect(() => {
    const tick = () => { if (!document.hidden) void refresh(); };
    const interval = window.setInterval(tick, 300000);
    document.addEventListener('visibilitychange', tick);
    return () => { window.clearInterval(interval); document.removeEventListener('visibilitychange', tick); };
  }, [refresh]);

  const shown = dataKey === filterKey ? data : null;
  const summary = shown?.summary;
  const products = shown?.charts.por_produto?.filter(row => Number.isFinite(Number(row.value)) && Number(row.value) > 0) || [];

  // Counts are available from the existing Processos API without loading the full directory.
  // When cross-filtering by period/product/resolution, do not mix incompatible totals.
  useEffect(() => {
    let cancelled = false;
    setMovementsCount({});
    if (!shown || !comparable) return () => { cancelled = true; };
    const api = getApi();
    if (!api) return () => { cancelled = true; };
    const keys = Object.keys(movements) as MovementCategory[];
    void Promise.allSettled(keys.map(async key => {
      const params = new URLSearchParams({ movement: movements[key], page: '1', page_size: '10' });
      if (uf) params.set('uf', uf);
      const result = await api.request<Paged>('/api/processos?' + params.toString());
      return { key, total: validNumber(result.total) };
    })).then(results => {
      if (cancelled) return;
      const counts: Partial<Record<MovementCategory, number>> = {};
      for (const result of results) {
        if (result.status === 'fulfilled' && result.value.total != null) counts[result.value.key] = result.value.total;
      }
      setMovementsCount(counts);
    });
    return () => { cancelled = true; };
  }, [shown, comparable, uf, portfolio]);

  const categories: Partial<Record<Category, number | null>> = {
    active: validNumber(summary?.active),
    prescribed: validNumber(summary?.prescribed),
    closing: validNumber(summary?.closing_in_progress),
    suspended: validNumber(summary?.suspended),
    dismissed: validNumber(summary?.dismissed) ?? movementsCount.dismissed,
    extinct: validNumber(summary?.extinct) ?? movementsCount.extinct,
    upheld: validNumber(summary?.upheld) ?? movementsCount.upheld,
    injunction: validNumber(summary?.injunction_granted) ?? movementsCount.injunction,
  };
  const prescribed = categories.prescribed;
  const active = categories.active;
  const donutReady = active != null && prescribed != null && active + prescribed > 0;
  const activeShare = donutReady ? active! / (active! + prescribed!) * 100 : 0;
  const chartStyle = donutReady
    ? { background: 'conic-gradient(var(--mba-orange, #e87828) 0% ' + activeShare + '%, var(--mba-blue, #4577ba) ' + activeShare + '% 100%)' }
    : undefined;

  const detailMovement = detail && detail in movements ? movements[detail as MovementCategory] : null;
  const listSupported = detail === 'active' || Boolean(detailMovement);
  const filtersSupported = comparable && (detail !== 'active' || !situation);
  useEffect(() => {
    let cancelled = false;
    setDetailData(null);
    setDetailError('');
    if (!detail || !listSupported || !filtersSupported) return () => { cancelled = true; };
    const api = getApi();
    if (!api) { setDetailError('API indisponível.'); return () => { cancelled = true; }; }
    const params = new URLSearchParams({ page: String(detailPage), page_size: '25' });
    if (uf) params.set('uf', uf);
    if (detail === 'active') params.set('situation', 'Em andamento');
    if (detailMovement) params.set('movement', detailMovement);
    setDetailPending(true);
    void api.request<Paged>('/api/processos?' + params.toString()).then(result => {
      if (!cancelled) setDetailData(result);
    }).catch(cause => {
      if (!cancelled) setDetailError(cause instanceof Error ? cause.message : 'Falha ao carregar processos.');
    }).finally(() => { if (!cancelled) setDetailPending(false); });
    return () => { cancelled = true; };
  }, [detail, detailPage, detailMovement, listSupported, filtersSupported, uf, portfolio, revision]);

  const openDetail = (value: Category) => {
    setDetail(value); setDetailPage(1); setDetailData(null);
  };
  const detailLabel = detail ? catalog.find(item => item.key === detail)?.label : '';
  return <section className="base-geral-page" aria-label="Base Geral da carteira processual">
    <header className="base-geral-header">
      <div><h1>Base Geral</h1><p>Indicadores consolidados da carteira processual</p></div>
      <div className="base-geral-actions">
        <span>{portfolioName(portfolio)}</span>
        <button type="button" onClick={() => void refresh()} disabled={pending}><RefreshCw size={15} className={pending ? 'base-geral-spin' : ''}/> Atualizar</button>
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
    {error && <div className="base-geral-error" role="alert">{error} <button type="button" onClick={() => void refresh()}>Tentar novamente</button></div>}
    {pending && !shown && <p role="status" className="base-geral-muted">Carregando indicadores...</p>}
    <div className="base-geral-kpis">
      {catalog.map(({key,label,subtitle,icon:Icon}) => <button key={key} type="button" className="base-geral-card"
        onClick={() => openDetail(key)} aria-label={'Abrir relação: ' + label}>
        <span className="base-geral-card-top"><span>{label}</span><Icon size={17} strokeWidth={1.7}/></span>
        <strong>{shown ? number(categories[key]) : '—'}</strong>
        <span className="base-geral-card-bottom">{subtitle}<ArrowUpRight size={14}/></span>
      </button>)}
    </div>
    <div className="base-geral-bottom">
      <section className="base-geral-panel" id="base-geral-produtos">
        <header><div><h2>Produto</h2><p>Card 9 · Distribuição da carteira por produto</p></div>
          <span className="base-geral-tally">{number(products.reduce((sum, item) => sum + Number(item.value), 0))} registros</span>
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
        <header><div><h2>Prejuízo X Lucro</h2><p>Card 10 · Base prescrita versus base ativa (quantidade de processos)</p></div></header>
        <div className="base-geral-chart-area">
          <button type="button" className={'base-geral-donut ' + (!donutReady ? 'is-unavailable' : '')}
            style={chartStyle} onClick={() => openDetail('active')} aria-label="Detalhar comparação entre base prescrita e base ativa">
            <span><strong>{donutReady ? activeShare.toFixed(1).replace('.', ',') + '%' : '—'}</strong><small>Base ativa</small></span>
          </button>
          <div className="base-geral-donut-labels">
            <button type="button" onClick={() => openDetail('active')}><i className="is-active"/> Base ativa <strong>{number(active)}</strong></button>
            <button type="button" onClick={() => openDetail('prescribed')}><i className="is-prescribed"/> Base prescrita <strong>{number(prescribed)}</strong></button>
            {!donutReady && <p className="base-geral-unavailable">Comparativo aguardando indicador de prescrição da API.</p>}
          </div>
        </div>
        <p className="base-geral-caption">O comparativo representa volumes processuais; não valores monetários de lucro ou prejuízo.</p>
      </section>
    </div>
    {detail && <div className="base-geral-overlay" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setDetail(null); }}>
      <section className="base-geral-drawer" role="dialog" aria-modal="true" aria-label={'Relação de processos: ' + detailLabel}>
        <header><div><h2>{detailLabel}</h2><p>Relação de processos da carteira selecionada</p></div>
          <button type="button" className="base-geral-dismiss" onClick={() => setDetail(null)} aria-label="Fechar relação"><X size={19}/></button>
        </header>
        {!listSupported && <div className="base-geral-warning">A API atual ainda não oferece um filtro verificável para esta classificação. O indicador permanecerá sem valor até a disponibilização da agregação específica; não exibiremos processos de outra categoria.</div>}
        {listSupported && !filtersSupported && <div className="base-geral-warning">A API de Processos ainda não suporta todos os filtros ativos (período, situação, produto ou encerramento). Limpe-os para consultar uma relação consistente com este card.</div>}
        {listSupported && filtersSupported && <>
          {detailPending && <p className="base-geral-muted" role="status">Carregando relação...</p>}
          {detailError && <p className="base-geral-error" role="alert">{detailError}</p>}
          {detailData && <><p className="base-geral-drawer-total">{number(detailData.total)} processos encontrados</p>
            <div className="base-geral-table-scroll">
              <table className="base-geral-detail-table"><thead><tr><th>CNJ</th><th>Situação</th><th>UF</th></tr></thead>
              <tbody>{detailData.rows?.map(row => <tr key={row.id}><td><button type="button" onClick={() => (window as Env).MBA_NAVIGATE?.('processos/' + encodeURIComponent(row.cnj))}>{row.cnj} <ArrowUpRight size={12}/></button></td><td>{row.situation || '—'}</td><td>{row.state || '—'}</td></tr>)}</tbody></table>
            </div>
            {!detailData.rows?.length && <p className="base-geral-muted">Nenhum processo localizado.</p>}
            <div className="base-geral-pagination">
              <button type="button" disabled={detailPage <= 1 || detailPending} onClick={() => setDetailPage(value => value - 1)}>Anterior</button>
              <span>Página {detailPage}</span>
              <button type="button" disabled={detailPending || detailPage * 25 >= detailData.total} onClick={() => setDetailPage(value => value + 1)}>Próxima</button>
            </div>
          </>}
        </>}
        <button type="button" className="base-geral-open-processos" onClick={() => { setDetail(null); (window as Env).MBA_NAVIGATE?.('processos'); }}>Abrir módulo Processos <ArrowUpRight size={14}/></button>
      </section>
    </div>}
  </section>;
}
