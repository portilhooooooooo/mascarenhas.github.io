import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, CalendarDays, CheckCircle2, Clock3, Database, Layers3, RotateCcw } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, EmptyState, ErrorState, Kpi, PageHeader, Ranking } from './analyticsComponents';
import { getCarteiraData, type CarteiraData, type CarteiraFilters } from './carteiraService';
import { formatNumberBR } from './formatters';

function monthBounds() {
  const now = new Date();
  const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const iso = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  return { start: iso(first), end: iso(now) };
}

const month = monthBounds();
const initialFilters: CarteiraFilters = {
  periodStart: month.start,
  periodEnd: month.end,
  dateType: 'entry',
  state: '',
  product: '',
  situation: '',
  resolution: '',
  groupBy: 'month',
};
const chartColors = ['#0b6ffb', '#7eb4f8', '#c2daf8'];
const tooltipStyle = { border: '1px solid #e3eaf2', borderRadius: 7, boxShadow: 'none', fontSize: 11 };

export function CarteiraProcessualPage() {
  const [draft, setDraft] = useState<CarteiraFilters>(initialFilters);
  const [applied, setApplied] = useState<CarteiraFilters>(initialFilters);
  const [data, setData] = useState<CarteiraData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (filters: CarteiraFilters) => {
    setLoading(true); setError('');
    try { setData(await getCarteiraData(filters)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a carteira.'); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(applied); }, [applied, load]);

  const situation = useMemo(() => data ? [
    { label: 'Ativos', value: data.summary.active },
    { label: 'Encerrados', value: data.summary.closed },
    ...(data.summary.unknown ? [{ label: 'Outros', value: data.summary.unknown }] : []),
  ] : [], [data]);
  const totalSituation = situation.reduce((sum, item) => sum + item.value, 0);

  const apply = () => setApplied({ ...draft, groupBy: draft.groupBy });
  const clear = () => { setDraft(initialFilters); setApplied(initialFilters); };
  const update = <K extends keyof CarteiraFilters>(key: K, value: CarteiraFilters[K]) => setDraft(current => ({ ...current, [key]: value }));

  if (error && !data) return <ErrorState message={error} onRetry={() => void load(applied)}/>;

  return <>
    <PageHeader title="Carteira Processual" subtitle="Visão consolidada da base operacional, do recebimento ao encerramento." updatedAt={data?.updated_at}/>

    <section className="analytics-filterbar" aria-label="Filtros da carteira">
      <div className="filter-fields" style={{ '--filter-cols': 6 } as React.CSSProperties}>
        <label>Período<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}><input aria-label="Início do período" type="date" value={draft.periodStart} onChange={e => update('periodStart', e.target.value)}/><input aria-label="Fim do período" type="date" value={draft.periodEnd} onChange={e => update('periodEnd', e.target.value)}/></div></label>
        <label>Tipo de data<select value={draft.dateType} onChange={e => update('dateType', e.target.value as CarteiraFilters['dateType'])}><option value="entry">Entrada</option><option value="resolution">Encerramento</option></select></label>
        <label>UF<select value={draft.state} onChange={e => update('state', e.target.value)}><option value="">Todas</option>{(data?.filters.states ?? []).map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Produto<select value={draft.product} onChange={e => update('product', e.target.value)}><option value="">Todos</option>{(data?.filters.products ?? []).map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Situação<select value={draft.situation} onChange={e => update('situation', e.target.value as CarteiraFilters['situation'])}><option value="">Todas</option><option value="active">Ativos</option><option value="closed">Encerrados</option><option value="unknown">Outros</option></select></label>
        <label>Tipo de encerramento<select value={draft.resolution} onChange={e => update('resolution', e.target.value)}><option value="">Todos</option>{(data?.filters.resolutions ?? []).map(value => <option key={value}>{value}</option>)}</select></label>
      </div>
      <div className="filter-actions"><button className="analytics-button secondary" type="button" onClick={clear}><RotateCcw/>Limpar filtros</button><button className="analytics-button primary" type="button" onClick={apply}>Aplicar filtros</button></div>
    </section>

    {error && <div className="analytics-footer"><span>Uma atualização falhou; os últimos dados válidos continuam visíveis.</span><button className="analytics-button secondary" onClick={() => void load(applied)}>Tentar novamente</button></div>}

    <section className="analytics-kpis" style={{ '--kpi-cols': 4 } as React.CSSProperties} aria-busy={loading}>
      <Kpi label="Entradas (mês)" value={loading && !data ? '—' : formatNumberBR(data?.movement.entries ?? 0)} note="No período selecionado" icon={CalendarDays}/>
      <Kpi label="Processos ativos" value={loading && !data ? '—' : formatNumberBR(data?.summary.active ?? 0)} note="Carteira filtrada" icon={Database}/>
      <Kpi label="Encerrados (mês)" value={loading && !data ? '—' : formatNumberBR(data?.movement.closures ?? 0)} note="No período selecionado" icon={CheckCircle2} tone="success"/>
      <Kpi label="Aging médio (ativos)" value={loading && !data ? '—' : data?.summary.aging_mean == null ? '—' : `${Math.round(data.summary.aging_mean)} dias`} note="Carteira ativa filtrada" icon={Clock3}/>
    </section>

    <section className="analytics-grid two">
      <Card title="Evolução da carteira" subtitle="Entradas e encerramentos ao longo do tempo.">
        {data?.charts.timeline.length ? <div className="chart-body"><ResponsiveContainer width="100%" height="100%"><AreaChart data={data.charts.timeline} margin={{ top: 8, right: 12, left: -18, bottom: 0 }}><defs><linearGradient id="entriesFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#0b6ffb" stopOpacity={.14}/><stop offset="100%" stopColor="#0b6ffb" stopOpacity={0}/></linearGradient></defs><CartesianGrid vertical={false} stroke="#edf2f7"/><XAxis dataKey="date" tick={{ fontSize: 10, fill: '#8190a5' }} tickLine={false} axisLine={false}/><YAxis tick={{ fontSize: 10, fill: '#8190a5' }} tickLine={false} axisLine={false}/><Tooltip contentStyle={tooltipStyle} formatter={(value, name) => [formatNumberBR(Number(value)), name === 'entries' ? 'Entradas' : 'Encerramentos']}/><Area type="monotone" dataKey="entries" stroke="#0b6ffb" fill="url(#entriesFill)" strokeWidth={2}/><Area type="monotone" dataKey="closures" stroke="#10a66a" fill="transparent" strokeWidth={2}/></AreaChart></ResponsiveContainer></div> : <EmptyState/>}
      </Card>
      <Card title="Processos por situação" subtitle="Composição da carteira filtrada.">
        {situation.length ? <div className="analytics-donut"><div className="analytics-donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={situation} dataKey="value" nameKey="label" innerRadius="60%" outerRadius="82%" stroke="none">{situation.map((item, index) => <Cell key={item.label} fill={chartColors[index % chartColors.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/></PieChart></ResponsiveContainer><div className="analytics-donut-center"><strong>{formatNumberBR(totalSituation)}</strong><span>Total</span></div></div><div className="analytics-legend">{situation.map((item, index) => <span key={item.label}><i style={{ background: chartColors[index % chartColors.length] }}/><b>{item.label}</b><strong>{formatNumberBR(item.value)}</strong></span>)}</div></div> : <EmptyState/>}
      </Card>
    </section>

    <section className="analytics-grid three">
      <Card title="Processos por produto" className="compact">{data?.charts.por_produto.length ? <Ranking items={data.charts.por_produto}/> : <EmptyState/>}</Card>
      <Card title="Processos por UF" className="compact">{data?.charts.por_uf.length ? <Ranking items={data.charts.por_uf}/> : <EmptyState/>}</Card>
      <Card title="Aging da carteira (ativos)" className="compact">{data?.charts.aging.length ? <Ranking items={data.charts.aging}/> : <EmptyState/>}</Card>
    </section>

    <footer className="analytics-footer"><span>Os indicadores são calculados pela API do Backoffice considerando os filtros selecionados.</span><span>{loading ? 'Atualizando…' : `${formatNumberBR(data?.summary.total ?? 0)} processos no recorte`}</span></footer>
  </>;
}
