import type { LucideIcon } from 'lucide-react';
import { AlertTriangle } from 'lucide-react';
import type { ReactNode } from 'react';
import type { Tone } from '../types';

interface SectionProps {
  title: string;
  actions?: ReactNode;
  children: ReactNode;
  className?: string;
}

export function DashboardSection({ title, actions, children, className = '' }: SectionProps) {
  return (
    <section className={`dash-section ${className}`} aria-labelledby={`section-${title.replace(/\W+/g, '-').toLowerCase()}`}>
      <div className="dash-section-heading">
        <h2 id={`section-${title.replace(/\W+/g, '-').toLowerCase()}`}>{title}</h2>
        {actions}
      </div>
      {children}
    </section>
  );
}

interface CardProps {
  title: string;
  value: string;
  subtitle?: string;
  trend?: string;
  icon: LucideIcon;
  tone?: Tone;
  onClick?: () => void;
}

export function MetricCard({ title, value, subtitle, trend, icon: Icon, tone = 'blue', onClick }: CardProps) {
  const content = (
    <>
      <div className={`metric-icon ${tone}`}><Icon aria-hidden="true" /></div>
      <div className="metric-copy"><span>{title}</span><strong>{value}</strong>{trend ? <small className="positive-trend">{trend}</small> : subtitle ? <small>{subtitle}</small> : null}</div>
    </>
  );
  return onClick ? <button className="metric-card clickable" type="button" onClick={onClick}>{content}</button> : <article className="metric-card">{content}</article>;
}

interface PaymentMetricCardProps extends CardProps {
  count?: number;
  countLabel?: string;
}

export function PaymentMetricCard({ count, countLabel, ...props }: PaymentMetricCardProps) {
  const Icon = props.icon;
  return (
    <article className="payment-metric-card">
      <div className="payment-card-top"><div className={`metric-icon ${props.tone ?? 'blue'}`}><Icon aria-hidden="true" /></div><span>{props.title}</span></div>
      {count !== undefined && <div className="payment-count"><strong>{count}</strong><small>{countLabel}</small></div>}
      <strong className="payment-amount">{props.value}</strong>
      {props.trend ? <small className="positive-trend">{props.trend}</small> : props.subtitle ? <small className="payment-subtitle">{props.subtitle}</small> : null}
    </article>
  );
}

export function ChartCard({ title, children, className = '' }: { title: string; children: ReactNode; className?: string }) {
  return <article className={`chart-card ${className}`}><h3>{title}</h3>{children}</article>;
}

export function EmptyState({ message = 'Não há dados para o período selecionado.' }: { message?: string }) {
  return <div className="chart-empty"><AlertTriangle aria-hidden="true" /><span>{message}</span></div>;
}

export function DashboardSkeleton() {
  return <div className="react-dashboard-skeleton" aria-label="Carregando dashboard"><div className="skeleton-block skeleton-welcome"/><div className="skeleton-grid">{Array.from({ length: 5 }, (_, index) => <div className="skeleton-block" key={index}/>)}</div></div>;
}

export function DashboardError({ onRetry }: { onRetry: () => void }) {
  return <div className="dashboard-error" role="alert"><AlertTriangle aria-hidden="true"/><div><strong>Não foi possível carregar o Dashboard.</strong><span>Tente novamente em instantes.</span></div><button type="button" onClick={onRetry}>Tentar novamente</button></div>;
}
