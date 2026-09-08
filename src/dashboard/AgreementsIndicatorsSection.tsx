import { useCallback, useEffect, useMemo, useState } from 'react';
import { Ban, CheckCircle2, ChevronLeft, ChevronRight, Contact, FileCheck2, FileClock, MessageCircle, MessageSquareMore, PenLine, Phone, RefreshCw, RotateCcw, type LucideIcon } from 'lucide-react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { getAgreementsIndicators, type AgreementIndicator, type AgreementsIndicatorsData } from './agreementsIndicatorsService';
import { formatCurrencyBR, formatNumberBR } from './formatters';

const situationItems: Array<{ label: string; icon: LucideIcon; tone: string }> = [
  { label: 'Acordo recusado', icon: Ban, tone: 'red' },
  { label: 'Em negociação', icon: MessageCircle, tone: 'amber' },
  { label: 'Caso devolvido', icon: RotateCcw, tone: 'gray' },
  { label: 'Pendente Contato', icon: Contact, tone: 'blue' },
  { label: 'Acordo Fechado', icon: CheckCircle2, tone: 'green' },
];
const taskItems: Array<{ label: string; icon: LucideIcon }> = [
  { label: 'Tratar Whatsapp', icon: MessageSquareMore }, { label: 'Cobrar Minuta', icon: FileClock },
  { label: 'Validar Minuta', icon: FileCheck2 }, { label: 'Tratar Contraproposta', icon: RefreshCw },
  { label: 'Assinar Minuta', icon: PenLine }, { label: 'Ligar', icon: Phone },
];
const tooltipStyle = { border: '1px solid #dce5ed', borderRadius: 8, boxShadow: '0 5px 14px rgba(17,42,66,.08)', fontSize: 11 };

function count(items: AgreementIndicator[], label: string) { return items.find(item => item.label.localeCompare(label, 'pt-BR', { sensitivity: 'base' }) === 0)?.value ?? 0; }
function MiniKpi({ label, value, icon: Icon, tone = 'blue' }: { label: string; value: number; icon: LucideIcon; tone?: string }) { return <article className={`agreements-mini ${tone}`}><span className="agreements-mini-icon"><Icon/></span><div><span>{label}</span><strong>{formatNumberBR(value)}</strong></div></article>; }
function badgeTone(value: string | null) { const normalized = value?.toLocaleLowerCase('pt-BR') ?? ''; if (normalized === 'acordo fechado') return 'green'; if (normalized === 'em negociação') return 'amber'; if (normalized === 'acordo recusado') return 'red'; if (normalized === 'pendente contato') return 'blue'; return 'gray'; }

export function AgreementsIndicatorsSection() {
  const [data, setData] = useState<AgreementsIndicatorsData | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const load = useCallback(async () => { setLoading(true); setError(''); try { setData(await getAgreementsIndicators(page)); } catch (cause) { setError(cause instanceof Error ? cause.message : 'Não foi possível consultar os acordos.'); } finally { setLoading(false); } }, [page]);
  useEffect(() => { void load(); }, [load]);
  const typeTotal = useMemo(() => data?.por_tipo.reduce((sum, item) => sum + item.value, 0) ?? 0, [data]);
  if (error) return <section className="agreements-section agreements-section-error"><div><strong>ACORDOS — RESUMO POR SITUAÇÃO E TAREFA</strong><span>{error}</span></div><button type="button" onClick={() => void load()}>Tentar novamente</button></section>;
  if (!data) return <section className="agreements-section agreements-section-loading" aria-label="Carregando indicadores de acordos"><span>Carregando indicadores de acordos…</span></section>;
  return <section className="agreements-section" aria-labelledby="agreements-indicators-title">
    <header className="agreements-heading"><div><h2 id="agreements-indicators-title">ACORDOS — RESUMO POR SITUAÇÃO E TAREFA</h2><p>Indicadores calculados diretamente da carteira de acordos.</p></div><div className="agreements-totals"><span><small>REGISTROS</small><strong>{formatNumberBR(data.summary.total)}</strong></span>{data.summary.proposta_total !== null && <span><small>TOTAL PROPOSTAS</small><strong>{formatCurrencyBR(data.summary.proposta_total)}</strong></span>}</div></header>
    <div className="agreements-kpi-block"><h3>Por situação</h3><div className="agreements-situation-grid">{situationItems.map(item => <MiniKpi key={item.label} {...item} value={count(data.por_situacao, item.label)}/>)}</div></div>
    <div className="agreements-kpi-block"><h3>Por tarefa <small>{formatNumberBR(data.quality.tarefas_validas)} registros com tarefa</small></h3><div className="agreements-task-grid">{taskItems.map(item => <MiniKpi key={item.label} {...item} value={count(data.por_tarefa, item.label)}/>)}</div></div>
    <div className="agreements-charts">
      <article><h3>Acordos por Situação</h3><div className="agreements-chart-body"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.por_situacao} layout="vertical" margin={{ top: 2, right: 28, bottom: 2, left: 10 }}><XAxis type="number" hide/><YAxis type="category" dataKey="label" width={105} tick={{ fill: '#5c7084', fontSize: 9 }} axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle} formatter={value => [formatNumberBR(Number(value)), 'Acordos']}/><Bar dataKey="value" fill="#0a5fa8" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#52677a', fontSize: 9 }}/></BarChart></ResponsiveContainer></div></article>
      <article><h3>Acordos por Tarefa</h3><div className="agreements-chart-body"><ResponsiveContainer width="100%" height="100%"><BarChart data={data.por_tarefa} layout="vertical" margin={{ top: 2, right: 28, bottom: 2, left: 10 }}><XAxis type="number" hide/><YAxis type="category" dataKey="label" width={112} tick={{ fill: '#5c7084', fontSize: 9 }} axisLine={false} tickLine={false}/><Tooltip contentStyle={tooltipStyle} formatter={value => [formatNumberBR(Number(value)), 'Acordos']}/><Bar dataKey="value" fill="#2c81c7" radius={[0, 4, 4, 0]} label={{ position: 'right', fill: '#52677a', fontSize: 9 }}/></BarChart></ResponsiveContainer></div></article>
      <article><h3>Acordos por Tipo</h3><div className="agreements-donut"><div className="agreements-donut-chart"><ResponsiveContainer width="100%" height="100%"><PieChart><Pie data={data.por_tipo} dataKey="value" nameKey="label" innerRadius="62%" outerRadius="84%" paddingAngle={2} stroke="none">{data.por_tipo.map((item, index) => <Cell key={item.label} fill={index === 0 ? '#0a5fa8' : index === 1 ? '#79acd3' : '#8ba0b3'}/>)}</Pie><Tooltip contentStyle={tooltipStyle} formatter={value => [formatNumberBR(Number(value)), 'Acordos']}/></PieChart></ResponsiveContainer><div className="agreements-donut-center"><strong>{formatNumberBR(typeTotal)}</strong><span>Total</span></div></div><div className="agreements-donut-legend">{data.por_tipo.map((item, index) => <span key={item.label}><i className={`type-${Math.min(index, 2)}`}/><b>{item.label}</b><small>{formatNumberBR(item.value)}</small></span>)}</div></div></article>
    </div>
    <div className="agreements-table-card"><div className="agreements-table-title"><div><h3>Registros de acordos</h3><span>{formatNumberBR(data.table.total)} registros na base</span></div></div><div className="agreements-table-scroll"><table><thead><tr><th>CNJ</th><th>Situação</th><th>Tipo</th><th>Tarefa</th><th>Proposta</th></tr></thead><tbody>{loading ? <tr><td colSpan={5} className="agreements-table-state">Carregando…</td></tr> : data.table.rows.map(row => <tr key={row.id}><td>{row.cnj ?? '—'}</td><td><span className={`agreements-badge ${badgeTone(row.situacao)}`}>{row.situacao ?? 'Não informado'}</span></td><td>{row.tipo ?? '—'}</td><td>{row.tarefa ?? '—'}</td><td className="agreements-money">{row.proposta === null ? '—' : formatCurrencyBR(row.proposta)}</td></tr>)}</tbody></table></div><footer><span>Página {data.table.page} de {Math.max(1, data.table.total_pages)}</span><div><button disabled={page <= 1 || loading} onClick={() => setPage(value => value - 1)}><ChevronLeft/></button><button disabled={page >= data.table.total_pages || loading} onClick={() => setPage(value => value + 1)}><ChevronRight/></button></div></footer></div>
  </section>;
}
