import './dashboardFeedback.css';

/** Three-point metric placeholder, shared by all dashboard KPI cards. */
export function MetricDots({label='Carregando indicador'}:{label?:string}) {
  return <span className="mba-metric-dots" role="status" aria-label={label}>
    <i aria-hidden="true"/><i aria-hidden="true"/><i aria-hidden="true"/>
  </span>;
}

/** Preserve data for the *same* authorized portfolio and filters, never fabricate zeros. */
export function DashboardRecovery({
  hasSnapshot, onRetry, retrying=false, className='',
}:{
  hasSnapshot:boolean;
  onRetry:()=>void;
  retrying?:boolean;
  className?:string;
}) {
  return <div className={['mba-dashboard-recovery',className].filter(Boolean).join(' ')}
    role={hasSnapshot?'status':'alert'}>
    <span>{hasSnapshot
      ? 'Atualização indisponível. Últimos dados preservados.'
      : 'Dados temporariamente indisponíveis.'}</span>
    <button type="button" onClick={onRetry} disabled={retrying}>
      {retrying?<MetricDots label="Tentando novamente"/>:'Tentar novamente'}
    </button>
  </div>;
}
