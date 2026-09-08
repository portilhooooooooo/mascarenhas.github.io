import { useCallback, useEffect, useMemo, useState } from 'react';
import { Ban, CheckCircle2, CircleDollarSign, Handshake, MessageCircle, RotateCcw } from 'lucide-react';
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { Card, EmptyState, ErrorState, Kpi, PageHeader, Ranking } from './analyticsComponents';
import { getAgreementsIndicators, type AgreementsIndicatorsData } from './agreementsIndicatorsService';
import { formatCurrencyBR, formatNumberBR } from './formatters';

const colors = ['#0b6ffb', '#6daaf8', '#10a66a', '#ef4444', '#b8c9dd', '#8190a5'];
const tooltipStyle = { border: '1px solid #e3eaf2', borderRadius: 7, boxShadow: 'none', fontSize: 11 };

export function AcordosAnalyticsPage() {
  const [draftOrigin, setDraftOrigin] = useState('');
  const [origin, setOrigin] = useState('');
  const [data, setData] = useState<AgreementsIndicatorsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async (value: string) => {
    setLoading(true); setError('');
    try { setData(await getAgreementsIndicators(value)); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os acordos.'); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(origin); }, [origin, load]);

  const situationTotal = useMemo(() => data?.por_situacao.reduce((sum, item) => sum + item.value, 0) ?? 0, [data]);

  if (error && !data) return <ErrorState message={error} onRetry={() => void load(origin)}/>;

  return <>
    <PageHeader title="Acordos" subtitle="Visão consolidada da carteira de acordos, por situação e tarefa."/>

    <section className="analytics-filterbar" aria-label="Filtros de acordos">
      <div className="filter-fields" style={{ '--filter-cols': 1 } as React.CSSProperties}>
        <label>Origem<select value={draftOrigin} onChange={event => setDraftOrigin(event.target.value)}><option value="">Todas</option><option value="interno">Interno</option><option value="terceirizado">Terceirizado</option></select></label>
      </div>
      <div className="filter-actions"><button className="analytics-button secondary" type="button" onClick={() => { setDraftOrigin(''); setOrigin(''); }}><RotateCcw/>Limpar filtros</button><button className="analytics-button primary" type="button" onClick={() => setOrigin(draftOrigin)}>Aplicar filtros</button></div>
    </section>

    <section className="analytics-kpis" style={{ '--kpi-cols': 5 } as React.CSSProperties} aria-busy={loading}>
      <Kpi label="Total de acordos" value={loading && !data ? '—' : formatNumberBR(data?.summary.total ?? 0)} icon={Handshake}/>
      <Kpi label="Acordos fechados" value={loading && !data ? '—' : formatNumberBR(data?.summary.fechados ?? 0)} icon={CheckCircle2} tone="success"/>
      <Kpi label="Em negociação" value={loading && !data ? '—' : formatNumberBR(data?.summary.em_negociacao ?? 0)} icon={MessageCircle}/>
      <Kpi label="Acordos recusados" value={loading && !data ? '—' : formatNumberBR(data?.summary.recusados ?? 0)} icon={Ban} tone="danger"/>
      <Kpi label="Ticket médio" value={loading && !data ? '—' : data?.summary.ticket_medio == null ? '—' : formatCurrencyBR(data.summary.ticket_medio)} icon={CircleDollarSign}/>
    </section>

    <section className="analytics-grid two">
      <Card title="Acordos por situação" subtitle="Distribuição da carteira no recorte selecionado.">
        {data?.por_situacao.length ? <div className="analytics-donut"><div className="analytics-donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.por_situacao} dataKey="value" nameKey="label" innerRadius="60%" outerRadius="82%" stroke="none">{data.por_situacao.map((item, index) => <Cell key={item.label} fill={colors[index % colors.length]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/></PieChart></ResponsiveContainer><div className="analytics-donut-center"><strong>{formatNumberBR(situationTotal)}</strong><span>Total</span></div></div><div className="analytics-legend">{data.por_situacao.slice(0, 6).map((item, index) => <span key={item.label}><i style={{ background: colors[index % colors.length] }}/><b>{item.label}</b><strong>{formatNumberBR(item.value)}</strong></span>)}</div></div> : <EmptyState/>}
      </Card>
      <Card title="Acordos por tipo" subtitle="Composição por modalidade.">
        {data?.por_tipo.length ? <div className="analytics-donut"><div className="analytics-donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.por_tipo} dataKey="value" nameKey="label" innerRadius="60%" outerRadius="82%" stroke="none">{data.por_tipo.map((item, index) => <Cell key={item.label} fill={colors[index % 2]}/>)}</Pie><Tooltip contentStyle={tooltipStyle}/></PieChart></ResponsiveContainer><div className="analytics-donut-center"><strong>{formatNumberBR(data.summary.total)}</strong><span>Total</span></div></div><div className="analytics-legend">{data.por_tipo.map((item, index) => <span key={item.label}><i style={{ background: colors[index % 2] }}/><b>{item.label}</b><strong>{formatNumberBR(item.value)}</strong></span>)}</div></div> : <EmptyState/>}
      </Card>
    </section>

    <section className="analytics-grid three">
      <Card title="Acordos por tarefa" className="compact">{data?.por_tarefa.length ? <Ranking items={data.por_tarefa}/> : <EmptyState/>}</Card>
      <Card title="Situações mais frequentes" className="compact">{data?.por_situacao.length ? <Ranking items={data.por_situacao}/> : <EmptyState/>}</Card>
      <Card title="Cobertura das propostas" className="compact"><div className="analytics-empty"><CircleDollarSign/><strong>{formatNumberBR(data?.summary.propostas_validas ?? 0)} propostas com valor</strong><span>O backend atual ainda não expõe data, UF, produto ou causa-raiz para esta visão. Esses recortes não são simulados no frontend.</span></div></Card>
    </section>

    <footer className="analytics-footer"><span>Indicadores calculados diretamente da carteira de acordos.</span><span>{origin ? `Origem: ${origin}` : 'Todas as origens'}</span></footer>
  </>;
}
