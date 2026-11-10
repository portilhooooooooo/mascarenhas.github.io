import {RefreshCw} from 'lucide-react';
import './dashboardFeedback.css';

/** Three-point metric placeholder, shared by all dashboard KPI cards. */
export function MetricDots({label='Carregando indicador'}:{label?:string}) {
  return <span className="mba-metric-dots" role="status" aria-label={label}>
    <i aria-hidden="true"/><i aria-hidden="true"/><i aria-hidden="true"/>
  </span>;
}

/**
 * Keep empty and stale data states quiet in the UI.
 * An actual fetch failure without a snapshot offers one non-intrusive retry.
 * Never replace unavailable metrics with invented zeroes.
 */
export function DashboardRecovery({
  hasSnapshot,onRetry,retrying=false,className='',
}:{
  hasSnapshot:boolean;
  onRetry:()=>void;
  retrying?:boolean;
  className?:string;
}) {
  if(hasSnapshot)return null;
  return <div className={['mba-dashboard-recovery','mba-dashboard-recovery--compact',className].filter(Boolean).join(' ')}>
    <button type="button" onClick={onRetry} disabled={retrying} title="Repetir consulta" aria-label="Tentar carregar os indicadores">
      <RefreshCw size={13} className={retrying?'mba-retry-spinning':''}/> Recarregar
    </button>
  </div>;
}
