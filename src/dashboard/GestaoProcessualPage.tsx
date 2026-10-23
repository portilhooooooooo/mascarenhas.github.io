import { useEffect, useState } from 'react';
import { EncerramentosPage } from './EncerramentosPage';
import { VisaoGeralPage } from './VisaoGeralPage';
import { RankingPage } from '../ranking/RankingPage';
import './gestaoMetabase.css';

type AnalyticsTab = 'geral' | 'encerramentos' | 'ranking';

function currentAnalyticsTab(): AnalyticsTab {
  const path = (window.location.hash.startsWith('#/') ? window.location.hash.slice(2) : window.location.pathname).replace(/^\/+|\/+$/g, '');
  if (path === 'analytics/ranking') return 'ranking';
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
  const [activeTab, setActiveTab] = useState<AnalyticsTab>(currentAnalyticsTab);
  const [visitedTabs, setVisitedTabs] = useState<AnalyticsTab[]>(() => [currentAnalyticsTab()]);
  const policy = (window as Window & { MBA_PORTFOLIO_POLICY?: { canAccess: (page: string) => boolean } }).MBA_PORTFOLIO_POLICY;
  const canViewAnalytics = permissions['dashboard.view'] === true && policy?.canAccess('dashboard') === true;
  const canViewClosing = permissions['encerramentos.view'] === true && policy?.canAccess('encerramentos') === true;
  const canViewRanking = canViewAnalytics && policy?.canAccess('ranking') === true;

  useEffect(() => {
    const sync = (event: Event) => {
      const next = getPermissions();
      // Revalidar grants reais; um evento de ativação de módulo não altera a policy.
      setPermissions(previous => {
        const previousKeys = Object.keys(previous);
        return previousKeys.length === Object.keys(next).length &&
          previousKeys.every(key => previous[key] === next[key]) ? previous : next;
      });
      // mba:authenticated também é emitido periodicamente ao navegar.
      // Não repintar todos os painéis React por causa desse evento sintético.
      if (event.type !== 'mba:authenticated') forcePortfolioPolicySync(value => value + 1);
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
  const displayedTab: AnalyticsTab = activeTab === 'ranking' && canViewRanking
    ? 'ranking'
    : (activeTab === 'encerramentos' || !canViewAnalytics) && canViewClosing
      ? 'encerramentos'
      : 'geral';

  useEffect(() => {
    setVisitedTabs(previous => previous.includes(displayedTab) ? previous : [...previous, displayedTab]);
  }, [displayedTab]);

  if (!canViewAnalytics && !canViewClosing) return <section className="gestao-metabase-page" aria-label="Analytics indisponível">Sem autorização para visualizar Analytics.</section>;

  return <div className="gestao-metabase-page gestao-processual-react">
    <nav className="mba-operation-subnav gestao-processual-subnav" aria-label="Seções de Analytics">
      {canViewAnalytics && <button type="button" className={displayedTab === 'geral' ? 'active' : ''} aria-current={displayedTab === 'geral' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics')}>Entradas</button>}
      {canViewClosing && <button type="button" className={displayedTab === 'encerramentos' ? 'active' : ''} aria-current={displayedTab === 'encerramentos' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/encerramentos')}>Encerramentos</button>}
      {canViewRanking && <button type="button" className={displayedTab === 'ranking' ? 'active' : ''} aria-current={displayedTab === 'ranking' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/ranking')}>Ranking</button>}
    </nav>
    {canViewAnalytics && visitedTabs.includes('geral') ? <div style={{display: displayedTab === 'geral' ? 'contents' : 'none'}}><VisaoGeralPage/></div> : null}
    {canViewClosing && visitedTabs.includes('encerramentos') ? <div style={{display: displayedTab === 'encerramentos' ? 'contents' : 'none'}}><EncerramentosPage/></div> : null}
    {canViewRanking && visitedTabs.includes('ranking') ? <div style={{display: displayedTab === 'ranking' ? 'contents' : 'none'}}><RankingPage/></div> : null}
  </div>;
}
