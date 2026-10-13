import { useEffect, useState } from 'react';
import { EncerramentosPage } from './EncerramentosPage';
import { VisaoGeralPage } from './VisaoGeralPage';
import './gestaoMetabase.css';

function currentAnalyticsTab(): 'geral' | 'encerramentos' {
  const path = (window.location.hash.startsWith('#/') ? window.location.hash.slice(2) : window.location.pathname).replace(/^\/+|\/+$/g, '');
  return path === 'analytics/encerramentos' ? 'encerramentos' : 'geral';
}
function navigateAnalytics(route: string) {
  (window as Window & { MBA_NAVIGATE?: (route: string) => boolean }).MBA_NAVIGATE?.(route);
}

function getPermissions() {
  const user = (window as Window & { MBA_CURRENT_USER?: { permissions?: Record<string, boolean> } }).MBA_CURRENT_USER;
  return user?.permissions || {};
}

export function GestaoProcessualPage() {
  const [permissions, setPermissions] = useState(getPermissions);
  const [, forcePortfolioPolicySync] = useState(0);
  const [activeTab, setActiveTab] = useState<'geral' | 'encerramentos'>(currentAnalyticsTab);
  const policy = (window as Window & { MBA_PORTFOLIO_POLICY?: { canAccess: (page: string) => boolean } }).MBA_PORTFOLIO_POLICY;
  const canViewAnalytics = permissions['dashboard.view'] === true && policy?.canAccess('dashboard') === true;
  const canViewClosing = permissions['encerramentos.view'] === true && policy?.canAccess('encerramentos') === true;

  useEffect(() => {
    const sync = () => {
      setPermissions(getPermissions());
      // canAccess depende da carteira ativa; grants podem manter a mesma referência.
      forcePortfolioPolicySync(value => value + 1);
    };
    window.addEventListener('mba:authenticated', sync);
    window.addEventListener('mba:profile-ready', sync);
    window.addEventListener('mba:portfolio-changed', sync);
    window.addEventListener('mba:logged-out', sync);
    window.addEventListener('mba:session-expired', sync);
    return () => {
      window.removeEventListener('mba:authenticated', sync);
      window.removeEventListener('mba:profile-ready', sync);
      window.removeEventListener('mba:portfolio-changed', sync);
      window.removeEventListener('mba:logged-out', sync);
      window.removeEventListener('mba:session-expired', sync);
    };
  }, []);
  useEffect(() => {
    const sync = () => setActiveTab(currentAnalyticsTab());
    window.addEventListener('mba:route-changed', sync);
    return () => window.removeEventListener('mba:route-changed', sync);
  }, []);
  // Mantém a intenção de navegação entre trocas de carteira.
  // Enquanto a permissão não existir, exibe apenas a visão autorizada.
  const displayedTab = (activeTab === 'encerramentos' || !canViewAnalytics) && canViewClosing ? 'encerramentos' : 'geral';

  if (!canViewAnalytics && !canViewClosing) return <section className="gestao-metabase-page" aria-label="Analytics indisponível">Sem autorização para visualizar Analytics.</section>;

  return <div className="gestao-metabase-page gestao-processual-react">
    <nav className="mba-operation-subnav gestao-processual-subnav" aria-label="Seções de Analytics">
      {canViewAnalytics && <button type="button" className={displayedTab === 'geral' ? 'active' : ''} aria-current={displayedTab === 'geral' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics')}>Entradas</button>}
      {canViewClosing && <button type="button" className={displayedTab === 'encerramentos' ? 'active' : ''} aria-current={displayedTab === 'encerramentos' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/encerramentos')}>Encerramentos</button>}
    </nav>
    {displayedTab === 'encerramentos' ? <EncerramentosPage/> : <VisaoGeralPage/>}
  </div>;
}
