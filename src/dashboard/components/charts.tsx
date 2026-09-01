import {
  Bar, BarChart, CartesianGrid, Cell, Legend, Line, LineChart, Pie, PieChart,
  ResponsiveContainer, Tooltip, XAxis, YAxis,
} from 'recharts';
import { formatCurrencyBR, formatNumberBR, formatPercentBR } from '../formatters';
import type { DailyMovement, LabeledValue } from '../types';
import { ChartCard, EmptyState } from './common';

const COLORS = ['#2563eb', '#16a34a', '#1e3a8a'];
const tooltipStyle = { border: '1px solid #e2e8f0', borderRadius: 8, boxShadow: '0 4px 14px rgba(15, 23, 42, .08)', fontSize: 11 };

export function DistributionBarChart({ title, data, labelWidth = 54 }: { title: string; data: LabeledValue[]; labelWidth?: number }) {
  const sorted = [...data].sort((a, b) => b.value - a.value);
  return (
    <ChartCard title={title}>
      {!sorted.length ? <EmptyState /> : <div className="bar-chart-box"><ResponsiveContainer width="100%" height="100%">
        <BarChart data={sorted} layout="vertical" margin={{ top: 2, right: 36, bottom: 2, left: 0 }}>
          <XAxis type="number" hide />
          <YAxis type="category" dataKey="label" width={labelWidth} axisLine={false} tickLine={false} tick={{ fill: '#475569', fontSize: 10 }} />
          <Tooltip formatter={(value) => [`${formatNumberBR(Number(value ?? 0))} processos`, 'Base']} contentStyle={tooltipStyle} cursor={{ fill: '#f8fafc' }} />
          <Bar dataKey="value" fill="#2563eb" radius={[0, 4, 4, 0]} barSize={11} label={{ position: 'right', fill: '#475569', fontSize: 10, formatter: (value) => formatNumberBR(Number(value ?? 0)) }} />
        </BarChart>
      </ResponsiveContainer></div>}
    </ChartCard>
  );
}

export function DonutChartCard({ title, data, centerValue, centerLabel = 'Total', colors = COLORS }: { title: string; data: LabeledValue[]; centerValue: string; centerLabel?: string; colors?: string[] }) {
  const total = data.reduce((sum, item) => sum + item.value, 0);
  return (
    <ChartCard title={title}>
      {!data.length ? <EmptyState /> : <div className="donut-layout"><div className="donut-box"><ResponsiveContainer width="100%" height="100%">
        <PieChart><Pie data={data} dataKey="value" nameKey="label" innerRadius="64%" outerRadius="86%" stroke="none" paddingAngle={1.5}>{data.map((item, index) => <Cell key={item.label} fill={colors[index % colors.length]} />)}</Pie><Tooltip formatter={(value) => [formatNumberBR(Number(value ?? 0)), 'Processos']} contentStyle={tooltipStyle}/></PieChart>
      </ResponsiveContainer><div className="donut-center"><strong>{centerValue}</strong><span>{centerLabel}</span></div></div>
      <div className="donut-legend">{data.map((item, index) => <div key={item.label}><i style={{ background: colors[index % colors.length] }}/><span><strong>{item.label}</strong><small>{formatNumberBR(item.value)} ({formatPercentBR((item.value / total) * 100)})</small></span></div>)}</div></div>}
    </ChartCard>
  );
}

export function DailyMovementChart({ data }: { data: DailyMovement[] }) {
  return (
    <ChartCard title="ENTRADAS X ENCERRAMENTOS POR DIA" className="daily-movement-card">
      {!data.length ? <EmptyState /> : <div className="daily-chart-box"><ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: -28, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3" />
          <XAxis dataKey="day" tick={{ fill: '#64748b', fontSize: 9 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false} interval={2}/>
          <YAxis tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false}/>
          <Tooltip labelFormatter={(_, payload) => payload?.[0]?.payload?.fullDate ?? ''} formatter={(value, name) => [formatNumberBR(Number(value ?? 0)), String(name) === 'entries' ? 'Entradas' : 'Encerramentos']} contentStyle={tooltipStyle}/>
          <Legend align="right" verticalAlign="top" content={() => <div className="daily-chart-legend"><span><i className="entries"/>Entradas</span><span><i className="closures"/>Encerramentos</span></div>} wrapperStyle={{ fontSize: 10, paddingBottom: 8 }}/>
          <Bar dataKey="entries" fill="#2563eb" radius={[3, 3, 0, 0]} maxBarSize={9}/>
          <Bar dataKey="closures" fill="#16a34a" radius={[3, 3, 0, 0]} maxBarSize={9}/>
        </BarChart>
      </ResponsiveContainer></div>}
    </ChartCard>
  );
}

export function TkmEvolutionChart({ data }: { data: LabeledValue[] }) {
  return (
    <ChartCard title="EVOLUÇÃO DO TKM — ÚLTIMOS 6 MESES" className="tkm-chart-card">
      {!data.length ? <EmptyState /> : <div className="tkm-chart-box"><ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 12, right: 18, left: 8, bottom: 0 }}>
          <CartesianGrid vertical={false} stroke="#e2e8f0" strokeDasharray="3 3"/>
          <XAxis dataKey="label" tick={{ fill: '#64748b', fontSize: 10 }} axisLine={{ stroke: '#e2e8f0' }} tickLine={false}/>
          <YAxis domain={['dataMin - 30', 'dataMax + 30']} tickFormatter={(value) => `R$ ${value}`} tick={{ fill: '#64748b', fontSize: 9 }} axisLine={false} tickLine={false} width={58}/>
          <Tooltip formatter={(value) => [formatCurrencyBR(Number(value ?? 0)), 'TKM']} contentStyle={tooltipStyle}/>
          <Line type="monotone" dataKey="value" stroke="#2563eb" strokeWidth={2} dot={{ r: 3, fill: '#2563eb', strokeWidth: 0 }} activeDot={{ r: 5 }} />
        </LineChart>
      </ResponsiveContainer></div>}
    </ChartCard>
  );
}
