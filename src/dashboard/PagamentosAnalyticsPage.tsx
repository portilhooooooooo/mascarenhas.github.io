import { useCallback, useEffect, useMemo, useState } from 'react';
import { Ban, CheckCircle2, CircleDollarSign, Clock3, Hourglass, RotateCcw } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { Card, EmptyState, ErrorState, Kpi, PageHeader, Ranking } from './analyticsComponents';
import { formatCurrencyBR, formatNumberBR } from './formatters';
import { getPaymentAnalytics, type PaymentAnalyticsData, type PaymentAnalyticsFilters } from './pagamentosAnalyticsService';

function monthBounds() {
  const now = new Date(); const first = new Date(now.getFullYear(), now.getMonth(), 1);
  const iso = (value: Date) => `${value.getFullYear()}-${String(value.getMonth() + 1).padStart(2, '0')}-${String(value.getDate()).padStart(2, '0')}`;
  return { start: iso(first), end: iso(now) };
}
const month = monthBounds();
const initialFilters: PaymentAnalyticsFilters = { startDate: month.start, endDate: month.end, firm: '', situation: '', type: '', requester: '' };
const colors = ['#0b6ffb', '#8abcf8', '#ef4444', '#10a66a', '#b8c9dd', '#8190a5'];
const tooltipStyle = { border: '1px solid #e3eaf2', borderRadius: 7, boxShadow: 'none', fontSize: 11 };

export function PagamentosAnalyticsPage() {
  const [draft, setDraft] = useState<PaymentAnalyticsFilters>(initialFilters);
  const [applied, setApplied] = useState<PaymentAnalyticsFilters>(initialFilters);
  const [data, setData] = useState<PaymentAnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (filters: PaymentAnalyticsFilters) => {
    setLoading(true); setError('');
    try { setData(await getPaymentAnalytics(filters)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os pagamentos.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(applied); }, [applied, load]);

  const update = <K extends keyof PaymentAnalyticsFilters>(key: K, value: PaymentAnalyticsFilters[K]) => setDraft(current => ({ ...current, [key]: value }));
  const clear = () => { setDraft(initialFilters); setApplied(initialFilters); };
  const paidTimeline = data?.overview.evolucao_pagamentos ?? [];
  const statusTotal = useMemo(() => data?.statusCounts.reduce((sum, item) => sum + item.value, 0) ?? 0, [data]);
  const natureTotal = useMemo(() => data?.nature.reduce((sum, item) => sum + item.value, 0) ?? 0, [data]);

  if (error && !data) return <ErrorState message={error} onRetry={() => void load(applied)}/>;

  return <>
    <PageHeader title="Pagamentos" subtitle="Visão consolidada dos pagamentos, liquidações e eficiência por escritório." updatedAt={data?.updatedAt}/>

    <section className="analytics-filterbar" aria-label="Filtros de pagamentos">
      <div className="filter-fields" style={{ '--filter-cols': 5 } as React.CSSProperties}>
        <label>Período<div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}><input aria-label="Início do período" type="date" value={draft.startDate} onChange={e => update('startDate', e.target.value)}/><input aria-label="Fim do período" type="date" value={draft.endDate} onChange={e => update('endDate', e.target.value)}/></div></label>
        <label>Escritório<select value={draft.firm} onChange={e => update('firm', e.target.value)}><option value="">Todos</option>{(data?.firms ?? []).map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Situação<select value={draft.situation} onChange={e => update('situation', e.target.value)}><option value="">Todas</option>{(data?.situations ?? []).map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Tipo de pagamento<select value={draft.type} onChange={e => update('type', e.target.value)}><option value="">Todos</option>{(data?.types ?? []).map(value => <option key={value}>{value}</option>)}</select></label>
        <label>Solicitante<input value={draft.requester} onChange={e => update('requester', e.target.value)} placeholder="Nome do solicitante"/></label>
      </div>
      <div className="filter-actions"><button className="analytics-button secondary" type="button" onClick={clear}><RotateCcw/>Limpar filtros</button><button className="analytics-button primary" type="button" onClick={() => setApplied({ ...draft })}>Aplicar filtros</button></div>
    </section>

    <section className="analytics-kpis" style={{ '--kpi-cols': 4 } as React.CSSProperties} aria-busy={loading}>
      <Kpi label="Em aprovação" value={loading && !data ? '—' : formatNumberBR(data?.pendingApproval ?? 0)} icon={Hourglass}/>
      <Kpi label="Liquidados" value={loading && !data ? '—' : formatNumberBR(data?.liquidated ?? 0)} icon={CheckCircle2} tone="success"/>
      <Kpi label="Cancelados" value={loading && !data ? '—' : formatNumberBR(data?.cancelled ?? 0)} icon={Ban} tone="danger"/>
      <Kpi label="Ticket médio" value={loading && !data ? '—' : formatCurrencyBR(data?.overview.cards.ticket_medio ?? 0)} icon={CircleDollarSign}/>
    </section>

    <section className="analytics-grid payment-main">
      <Card title="Pagamentos ao longo do tempo" subtitle="Valor liquidado no período, por mês.">
        {paidTimeline.length ? <div className="chart-body"><ResponsiveContainer width="100%" height="100%"><BarChart data={paidTimeline} margin={{ top: 8, right: 8, left: 4, bottom: 0 }}><CartesianGrid vertical={false} stroke="#edf2f7"/><XAxis dataKey="periodo" tick={{ fontSize: 10, fill: '#8190a5' }} tickLine={false} axisLine={false}/><YAxis tick={{ fontSize: 10, fill: '#8190a5' }} tickLine={false} axisLine={false} tickFormatter={value => `R$ ${Math.round(Number(value) / 1000)}k`}/><Tooltip contentStyle={tooltipStyle} formatter={value => [formatCurrencyBR(Number(value)), 'Valor liquidado']}/><Bar dataKey="valor_total_pago" fill="#7fb5f8" radius={[4, 4, 0, 0]}/></BarChart></ResponsiveContainer></div> : <EmptyState/>}
      </Card>

      <Card title="Pagamentos por situação" subtitle="Distribuição dos registros no recorte.">
        {data?.statusCounts.length ? <div className="analytics-donut"><div className="analytics-donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.statusCounts} dataKey="value" nameKey="label" innerRadius="60%" outerRadius="82%" stroke="none">{data.statusCounts.map((item, index) => <Cell key={item.label} fill={colors[index % colors.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/></PieChart></ResponsiveContainer><div className="analytics-donut-center"><strong>{formatNumberBR(statusTotal)}</strong><span>Total</span></div></div><div className="analytics-legend">{data.statusCounts.slice(0, 5).map((item, index) => <button key={item.label} type="button" onClick={() => { setDraft(current => ({ ...current, situation: item.label })); setApplied(current => ({ ...current, situation: item.label })); }}><i style={{ background: colors[index % colors.length] }}/><b>{item.label}</b><strong>{formatNumberBR(item.value)}</strong></button>)}</div></div> : <EmptyState/>}
      </Card>

      <Card title="Condenação vs. Acordos" subtitle="Composição entre pagamentos liquidados.">
        {data?.nature.length ? <div className="analytics-donut"><div className="analytics-donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.nature} dataKey="value" nameKey="label" innerRadius="60%" outerRadius="82%" stroke="none">{data.nature.map((item, index) => <Cell key={item.label} fill={colors[index]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/></PieChart></ResponsiveContainer><div className="analytics-donut-center"><strong>{formatNumberBR(natureTotal)}</strong><span>Liquidados</span></div></div><div className="analytics-legend">{data.nature.map((item, index) => <span key={item.label}><i style={{ background: colors[index] }}/><b>{item.label}</b><strong>{formatNumberBR(item.value)}</strong></span>)}</div></div> : <EmptyState title="Natureza não disponível" detail="A base atual não expõe Condenação/Acordos como tipo de pagamento. O frontend não inventa essa classificação."/>}
      </Card>
    </section>

    <section className="analytics-grid three">
      <Card title="Ticket médio por escritório" subtitle="Média dos pagamentos liquidados no período." className="compact">{data?.ticketByFirm.length ? <Ranking items={data.ticketByFirm} formatValue={formatCurrencyBR} onSelect={label => { setDraft(current => ({ ...current, firm: label })); setApplied(current => ({ ...current, firm: label })); }}/> : <EmptyState/>}</Card>
      <Card title="Solicitações por escritório" subtitle="Valor total solicitado no período." className="compact"><EmptyState title="Aguardando dado de origem" detail="A API atual expõe valor liquidado por escritório, mas não o valor total solicitado. O indicador fica reservado sem trocar o significado do dado."/></Card>
      <Card title="Tempo por escritório" subtitle="Prazo médio para pagamento (dias)." className="compact">{data?.timeByFirm.length ? <Ranking items={data.timeByFirm} formatValue={value => `${new Intl.NumberFormat('pt-BR', { maximumFractionDigits: 1 }).format(value)} dias`} onSelect={label => { setDraft(current => ({ ...current, firm: label })); setApplied(current => ({ ...current, firm: label })); }}/> : <EmptyState title="Tempo ainda não disponível" detail="O indicador usa o tempo atual da base; a regra de cálculo definitiva ainda deve ser validada."/>}</Card>
    </section>

    <footer className="analytics-footer"><span>O período disponível hoje usa a data de pagamento, conforme o endpoint atual.</span><span>{loading ? 'Atualizando…' : `${formatNumberBR(data?.overview.cards.quantidade_pagamentos ?? 0)} liquidados`}</span></footer>
  </>;
}
