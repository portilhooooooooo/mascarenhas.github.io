import type { LucideIcon } from 'lucide-react';
import { AlertTriangle, Inbox, RotateCcw } from 'lucide-react';
import { formatNumberBR } from './formatters';

export function PageHeader({ title, subtitle, updatedAt }: { title: string; subtitle: string; updatedAt?: string | null }) {
  const date = updatedAt ? new Date(updatedAt) : null;
  const display = date && !Number.isNaN(date.getTime())
    ? new Intl.DateTimeFormat('pt-BR', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
    : 'Não informada';
  return <header className="analytics-page-header">
    <div><p className="analytics-eyebrow">GESTÃO PROCESSUAL</p><h1>{title}</h1><p>{subtitle}</p></div>
    <div className="analytics-freshness"><strong>Última atualização</strong><span>{display}</span><em>Dados atualizados</em></div>
  </header>;
}

export function Kpi({ label, value, note, icon: Icon, tone = 'blue' }: { label: string; value: string; note?: string; icon: LucideIcon; tone?: 'blue' | 'success' | 'danger' }) {
  return <article className={`analytics-kpi ${tone === 'blue' ? '' : tone}`}>
    <span className="analytics-kpi-icon"><Icon/></span>
    <div className="analytics-kpi-copy"><span>{label}</span><strong>{value}</strong>{note && <small>{note}</small>}</div>
  </article>;
}

export function Card({ title, subtitle, children, className = '' }: { title: string; subtitle?: string; children: React.ReactNode; className?: string }) {
  return <article className={`analytics-card ${className}`}>
    <header className="analytics-card-header"><div><h2>{title}</h2>{subtitle && <p>{subtitle}</p>}</div></header>
    {children}
  </article>;
}

export function EmptyState({ title = 'Sem dados para exibir', detail = 'Ajuste os filtros ou aguarde a próxima atualização.' }: { title?: string; detail?: string }) {
  return <div className="analytics-empty"><Inbox/><strong>{title}</strong><span>{detail}</span></div>;
}

export function ErrorState({ message, onRetry }: { message: string; onRetry: () => void }) {
  return <section className="analytics-error"><AlertTriangle/><strong>Não foi possível carregar esta visão</strong><span>{message}</span><button type="button" onClick={onRetry}><RotateCcw/> Tentar novamente</button></section>;
}

export function Ranking({ items, formatValue = (value) => formatNumberBR(value), onSelect }: { items: Array<{ label: string; value: number }>; formatValue?: (value: number) => string; onSelect?: (label: string) => void }) {
  const top = items.slice(0, 6);
  const max = Math.max(1, ...top.map(item => item.value));
  if (!top.length) return <EmptyState/>;
  return <div className="analytics-ranking">{top.map(item => <button key={item.label} type="button" className={`analytics-rank-row ${onSelect ? 'clickable' : ''}`} onClick={() => onSelect?.(item.label)} disabled={!onSelect}>
    <span className="analytics-rank-label" title={item.label}>{item.label}</span>
    <span className="analytics-rank-track"><span className="analytics-rank-fill" style={{ width: `${Math.max(3, (item.value / max) * 100)}%` }}/></span>
    <span className="analytics-rank-value">{formatValue(item.value)}</span>
  </button>)}</div>;
}
