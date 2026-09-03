import {
  AlertTriangle, Archive, CalendarDays, CheckCircle2, CircleDollarSign, CircleX,
  Clock3, Download, FileWarning, FolderKanban, Handshake, LockKeyhole, RefreshCw,
  Server, WalletCards,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { formatCurrencyBR, formatDateBR, formatNumberBR, formatPercentBR } from '../formatters';
import type { DashboardData } from '../types';
import { ChartCard, DashboardSection, MetricCard, PaymentMetricCard } from './common';
import { DailyMovementChart, DistributionBarChart, DonutChartCard, TkmEvolutionChart } from './charts';

interface AuthenticatedEvent extends CustomEvent<{ name?: string; nome?: string }> {}

function useAuthenticatedName() {
  const currentUser = window.MBA_CURRENT_USER;
  const [name, setName] = useState(currentUser?.name || currentUser?.nome || 'Usuário de Usuário');
  useEffect(() => {
    const handleAuthenticated = (event: Event) => {
      const user = (event as AuthenticatedEvent).detail;
      setName(user?.name || user?.nome || 'Usuário de Usuário');
    };
    window.addEventListener('mba:authenticated', handleAuthenticated);
    return () => window.removeEventListener('mba:authenticated', handleAuthenticated);
  }, []);
  return name;
}

function StatusCard({ title, status, icon: Icon, tone = 'green', detail }: { title: string; status: string; icon: typeof Server; tone?: 'green' | 'blue' | 'red'; detail?: string }) {
  return <article className={`operational-status ${tone}`}><div className="status-icon"><Icon aria-hidden="true"/></div><div><span>{title}</span><strong><i/>{status}</strong>{detail && <small>{detail}</small>}</div></article>;
}

export function WelcomePanel({ data, onPeriodChange }: { data: DashboardData; onPeriodChange: (start: string, end: string) => void }) {
  const name = useAuthenticatedName();
  const sessionLabel = data.status.enterSession === 'active' ? 'Ativa' : data.status.enterSession === 'expired' ? 'Expirada' : 'Indisponível';
  return (
    <section className="executive-welcome">
      <div className="executive-welcome-copy">
        <p className="dashboard-context">OPERAÇÃO ENTER · AGIBANK</p>
        <h1>Todos os seus serviços estão saudáveis.</h1>
        <p>Acompanhe os principais indicadores e os pontos que pedem decisão na operação.</p>
        <div className="operational-grid">
          <StatusCard title="API Backoffice" status={data.status.backendConnected ? 'Operacional' : 'Indisponível'} icon={Server} tone={data.status.backendConnected ? 'green' : 'red'} detail="Conexão segura com a operação"/>
          <StatusCard title="Integração Enter" status={sessionLabel} icon={LockKeyhole} tone={data.status.enterSession === 'active' ? 'green' : 'red'} detail="Última autenticação registrada"/>
          <StatusCard title="Erros no dia" status={formatNumberBR(data.status.errorsToday)} icon={AlertTriangle} tone={data.status.errorsToday === 0 ? 'blue' : 'red'} detail={`Atualizado às ${data.status.updatedAt}`}/>
        </div>
      </div>
      <fieldset className="period-filter"><legend>Período global</legend><div><CalendarDays aria-hidden="true"/><label><span>Início</span><input type="date" value={data.period.start} onChange={(event) => onPeriodChange(event.target.value, data.period.end)}/></label><b>—</b><label><span>Fim</span><input type="date" value={data.period.end} onChange={(event) => onPeriodChange(data.period.start, event.target.value)}/></label></div><small>{formatDateBR(data.period.start)} - {formatDateBR(data.period.end)}</small></fieldset>
    </section>
  );
}

export function PortfolioOverview({ data }: { data: DashboardData }) {
  const portfolio = data.portfolio;
  return <DashboardSection title="VISÃO GERAL DA CARTEIRA — AGIBANK"><div className="portfolio-kpi-grid">
    <MetricCard title="Base ativa" value={formatNumberBR(portfolio.activeBase)} subtitle="Total de processos" icon={FolderKanban}/>
    <MetricCard title="Entradas no mês" value={formatNumberBR(portfolio.monthlyEntries)} trend={`+${formatPercentBR(portfolio.entriesTrend)} vs mês anterior`} icon={Download}/>
    <MetricCard title="Encerramentos no mês" value={formatNumberBR(portfolio.monthlyClosures)} trend={`+${formatPercentBR(portfolio.closuresTrend)} vs mês anterior`} icon={CheckCircle2}/>
    <MetricCard title="Acordos no mês" value={formatNumberBR(portfolio.monthlyAgreements)} subtitle={`Pendentes: ${formatNumberBR(portfolio.pendingAgreements)}`} icon={Handshake} tone="amber"/>
    <MetricCard title="Aptos ao arquivamento" value={formatNumberBR(portfolio.archivableProcesses)} subtitle="Ver detalhes" icon={Archive}/>
  </div></DashboardSection>;
}

function MovementSummary({ entries, closures }: { entries: number; closures: number }) {
  return <ChartCard title="ENTRADAS X ENCERRAMENTOS" className="movement-summary-card"><div className="movement-summary"><div className="entries"><strong>{formatNumberBR(entries)}</strong><span>Entradas no mês</span></div><div className="closures"><strong>{formatNumberBR(closures)}</strong><span>Encerramentos no mês</span></div></div></ChartCard>;
}

export function PortfolioDistributionMovement({ data }: { data: DashboardData }) {
  return <DashboardSection title="CARTEIRA — DISTRIBUIÇÃO E MOVIMENTAÇÃO" className="distribution-section">
    <div className="distribution-grid">
      <DistributionBarChart title="BASE POR ESTADO" data={data.distribution.states}/>
      <DistributionBarChart title="BASE POR PRODUTO / OBJETO" data={data.distribution.products} labelWidth={116}/>
      <DonutChartCard title="VARA CÍVEL X JUIZADO" data={data.distribution.courtTypes} centerValue={formatNumberBR(data.portfolio.activeBase)}/>
      <DonutChartCard title="COMPARAÇÃO ÔNUS" data={data.distribution.burden} centerValue={formatNumberBR(data.portfolio.activeBase)}/>
    </div>
    <div className="movement-grid">
      <DailyMovementChart data={data.movement.daily}/>
      <MovementSummary entries={data.portfolio.monthlyEntries} closures={data.portfolio.monthlyClosures}/>
      <DonutChartCard title="MOTIVOS DE ENCERRAMENTO" data={data.movement.closureReasons} centerValue={formatNumberBR(data.portfolio.monthlyClosures)} colors={['#2563eb', '#0f9f8f', '#1e3a8a']}/>
    </div>
  </DashboardSection>;
}

function CredenciadoFilter({ options, selected, onChange }: { options: string[]; selected: string; onChange: (value: string) => void }) {
  return <label className="credenciado-filter"><span>Filtro de credenciado</span><select value={selected} onChange={(event) => onChange(event.target.value)}><option value="">Todos os credenciados</option>{options.map((option) => <option key={option} value={option}>{option}</option>)}</select></label>;
}

function TopCredenciados({ items }: { items: DashboardData['payments']['topCredenciados'] }) {
  return <ChartCard title="MAIORES CREDENCIADOS (VALOR)" className="top-creditors-card"><div className="top-creditors">{items.length ? items.map((item, index) => <div key={item.label}><span><i>{index + 1}</i>{item.label}</span><strong>{formatCurrencyBR(item.value)}</strong></div>) : <p>Nenhum pagamento encontrado para este credenciado no período.</p>}</div><button className="view-all-button" type="button">Ver todos</button></ChartCard>;
}

export function PaymentsSection({ data, selectedCredenciado, onCredenciadoChange }: { data: DashboardData; selectedCredenciado: string; onCredenciadoChange: (value: string) => void }) {
  const payments = data.payments;
  return <DashboardSection title="PAGAMENTOS" actions={<CredenciadoFilter options={payments.credenciados} selected={selectedCredenciado} onChange={onCredenciadoChange}/>}>
    <div className="payment-kpi-grid">
      <PaymentMetricCard title="Total de pagamentos" value={formatCurrencyBR(payments.totalAmount)} trend={`+${formatPercentBR(payments.totalTrend)} vs mês anterior`} icon={CircleDollarSign}/>
      <PaymentMetricCard title="TKM realizado (mês)" value={formatCurrencyBR(payments.tkm)} subtitle="Valor médio por processo pago" icon={WalletCards}/>
      <PaymentMetricCard title="Pagamentos aguardando aprovação" count={payments.pendingApproval.count} countLabel="Processos" value={formatCurrencyBR(payments.pendingApproval.amount)} subtitle="Valor total pendente" icon={Clock3} tone="amber"/>
      <PaymentMetricCard title="Pagamentos sem comprovante" count={payments.missingReceipt.count} countLabel="Processos" value={formatCurrencyBR(payments.missingReceipt.amount)} subtitle="Valor total" icon={FileWarning} tone="red"/>
      <PaymentMetricCard title="Pagamentos cancelados" count={payments.cancelled.count} countLabel="Processos" value={formatCurrencyBR(payments.cancelled.amount)} subtitle="Valor total" icon={CircleX} tone="navy"/>
      <PaymentMetricCard title="Pagamentos de acordo" count={payments.agreementPayments.count} countLabel="Processos" value={formatCurrencyBR(payments.agreementPayments.amount)} subtitle="Valor total" icon={Handshake} tone="green"/>
    </div>
    <div className="payment-charts-grid"><TkmEvolutionChart data={payments.tkmHistory}/><TopCredenciados items={payments.topCredenciados}/></div>
  </DashboardSection>;
}

export function DashboardFooter({ updatedAt, autoRefreshMinutes }: { updatedAt: string; autoRefreshMinutes: number }) {
  const formatted = new Date(updatedAt).toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  return <footer className="dashboard-footer"><span>Última atualização: {formatted}</span><i/><span><RefreshCw aria-hidden="true"/> Atualização automática a cada {autoRefreshMinutes} minutos</span></footer>;
}
