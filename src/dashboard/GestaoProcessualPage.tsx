import {BackofficeRead,readSource} from '../v3/backoffice';
import {runtimeScope} from '../tasks/runtimeQueries';
import {createPortal} from 'react-dom';
import { useModuleVisible } from './useModuleVisible';
import { useEffect, useState } from 'react';
import { EncerramentosPage } from './EncerramentosPage';
import { DefesasResultadosPage } from './DefesasResultadosPage';
import { ProtocolosResultadosPage } from './ProtocolosResultadosPage';
import { BaseGeralPage } from './BaseGeralPage';
import { AndamentosCardsPage } from './AndamentosCardsPage';
import { PagamentosResultadosPage } from './PagamentosResultadosPage';
import './gestaoMetabase.css';

type AnalyticsTab = 'cadastro' | 'andamentos' | 'faturamento' | 'encerramentos' | 'pagamentos' | 'defesas' | 'protocolos';

function currentAnalyticsTab(): AnalyticsTab {
  const path = (window.location.hash.startsWith('#/') ? window.location.hash.slice(2) : window.location.pathname).replace(/^\/+|\/+$/g, '');
  if (path === 'analytics/cadastro') return 'cadastro';
  if (path === 'analytics/andamentos') return 'andamentos';
  if (path === 'analytics/faturamento') return 'faturamento';
  if (path === 'analytics/pagamentos') return 'pagamentos';
  if (path === 'analytics/defesas') return 'defesas';
  if (path === 'analytics/protocolos') return 'protocolos';
  return path === 'analytics/encerramentos' ? 'encerramentos' : 'cadastro';
}
function navigateAnalytics(route: string) {
  (window as Window & { MBA_NAVIGATE?: (route: string) => boolean }).MBA_NAVIGATE?.(route);
}

function getPermissions() {
  const user = (window as Window & { MBA_CURRENT_USER?: { permissions?: Record<string, boolean> } }).MBA_CURRENT_USER;
  return user?.permissions || {};
}

export function GestaoProcessualPage() {
  const visible=useModuleVisible('dashboard');
  const [permissions, setPermissions] = useState(getPermissions);
  const [, forcePortfolioPolicySync] = useState(0);
  const [activeTab, setActiveTab] = useState<AnalyticsTab>(currentAnalyticsTab);
  const [visitedTabs, setVisitedTabs] = useState<AnalyticsTab[]>(() => /^\/?analytics(?:\/|$)/.test(location.pathname) ? [currentAnalyticsTab()] : []);
  const policy = (window as Window & { MBA_PORTFOLIO_POLICY?: { canAccess: (page: string) => boolean } }).MBA_PORTFOLIO_POLICY;
  const canViewAnalytics = permissions['dashboard.view'] === true && policy?.canAccess('dashboard') === true;
  const canViewClosing = permissions['encerramentos.view'] === true && policy?.canAccess('encerramentos') === true;
  const profile = (window as Window & {MBA_CURRENT_USER?:{id?:string;is_master_admin?:boolean}}).MBA_CURRENT_USER;
  const portfolio = (window as Window & {MBA_API?: {getPortfolioId?: () => string}}).MBA_API?.getPortfolioId?.();
  const canViewEnterDefenses = canViewAnalytics && permissions['tasks.view'] === true && portfolio === 'agibank_enter';
  const canViewEnterProtocols = canViewEnterDefenses;
  const canViewPayments = canViewAnalytics && ((profile?.is_master_admin === true && permissions['pagamentos.view'] === true) || (profile?.id === 'bbe93618-a630-4d2b-8c21-c3c2e6ec4b7e' && portfolio === 'agibank_mba'));
  // V3-only deep links, not extra tabs in the existing Results UI.
  const canViewV3Faturamento = canViewAnalytics && permissions['faturamento.view'] === true && readSource('faturamento') === 'V3';

  useEffect(() => {
    const sync = (event: Event) => {
      const next = getPermissions();
      setPermissions(previous => {
        const keys = Object.keys(previous);
        return keys.length === Object.keys(next).length &&
          keys.every(key => previous[key] === next[key]) ? previous : next;
      });
      // Synthetic module-activation events do not change the portfolio policy.
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
    const sync = () => { if (/^\/?analytics(?:\/|$)/.test(location.pathname)) setActiveTab(currentAnalyticsTab()); };
    window.addEventListener('mba:route-changed', sync);
    return () => window.removeEventListener('mba:route-changed', sync);
  }, []);
  // Mantém a intenção de navegação entre trocas de carteira.
  // Enquanto a permissão não existir, exibe apenas a visão autorizada.
  const displayedTab: AnalyticsTab = activeTab === 'cadastro' && canViewAnalytics ? 'cadastro'
    : activeTab === 'andamentos' && canViewAnalytics ? 'andamentos'
    : activeTab === 'faturamento' && canViewV3Faturamento ? 'faturamento'
    : activeTab === 'protocolos' && canViewEnterProtocols
    ? 'protocolos'
    : activeTab === 'defesas' && canViewEnterDefenses
    ? 'defesas'
    : activeTab === 'pagamentos' && canViewPayments
    ? 'pagamentos'
    : (activeTab === 'encerramentos' || !canViewAnalytics) && canViewClosing
      ? 'encerramentos'
      : 'cadastro';

  useEffect(() => {
    if(!visible)return;
    setVisitedTabs(previous => previous.includes(displayedTab) ? previous : [...previous, displayedTab]);
  }, [displayedTab,visible]);

  if (!canViewAnalytics && !canViewClosing) return <section className="gestao-metabase-page" aria-label="Analytics indisponível">Sem autorização para visualizar Analytics.</section>;

  const shellTabs = document.getElementById('mba-shell-tabs');
  const resultsTabs = <nav className="mba-operation-subnav gestao-processual-subnav" aria-label="Seções de Analytics">
      {canViewAnalytics && <button type="button" className={displayedTab === 'cadastro' ? 'active' : ''} aria-current={displayedTab === 'cadastro' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/cadastro')}>Cadastro</button>}
      {canViewAnalytics && <button type="button" className={displayedTab === 'andamentos' ? 'active' : ''} aria-current={displayedTab === 'andamentos' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/andamentos')}>Andamentos</button>}
      {canViewClosing && <button type="button" className={displayedTab === 'encerramentos' ? 'active' : ''} aria-current={displayedTab === 'encerramentos' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/encerramentos')}>Encerramentos</button>}
      {canViewPayments && <button type="button" className={displayedTab === 'pagamentos' ? 'active' : ''} aria-current={displayedTab === 'pagamentos' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/pagamentos')}>Pagamentos</button>}
      {canViewEnterDefenses && <button type="button" className={displayedTab === 'defesas' ? 'active' : ''} aria-current={displayedTab === 'defesas' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/defesas')}>Defesas</button>}
      {canViewEnterProtocols && <button type="button" className={displayedTab === 'protocolos' ? 'active' : ''} aria-current={displayedTab === 'protocolos' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/protocolos')}>Protocolos</button>}
    </nav>;

  (window as Window & {MBA_RESULT_TABS?: Record<string, boolean>}).MBA_RESULT_TABS = {pagamentos: canViewPayments, encerramentos: canViewClosing, defesas: canViewEnterDefenses, protocolos: canViewEnterProtocols};
  return <div className="gestao-metabase-page gestao-processual-react">
    {shellTabs ? (visible ? createPortal(resultsTabs, shellTabs) : null) : resultsTabs}
    {canViewAnalytics && visitedTabs.includes('cadastro') ? <div style={{display: displayedTab === 'cadastro' ? 'contents' : 'none'}}><BaseGeralPage key={runtimeScope()} visible={visible && displayedTab==='cadastro'} cardsOnly/></div> : null}
    {canViewAnalytics && visible && displayedTab==='andamentos' && <AndamentosCardsPage key={runtimeScope()}/>}
    {canViewV3Faturamento && visible && displayedTab==='faturamento' && <BackofficeRead key={runtimeScope()} module="faturamento"/>}
    {canViewClosing && (readSource('encerramentos') === 'V3' ? (visible && displayedTab === 'encerramentos' ? <BackofficeRead key={runtimeScope()} module="encerramentos"/> : null) : (visitedTabs.includes('encerramentos') ? <div style={{display: displayedTab === 'encerramentos' ? 'contents' : 'none'}}><EncerramentosPage key={runtimeScope()} visible={visible && displayedTab==='encerramentos'}/></div> : null))}
    {canViewPayments && (readSource('pagamentos') === 'V3' ? (visible && displayedTab === 'pagamentos' ? <BackofficeRead key={runtimeScope()} module="pagamentos"/> : null) : (visitedTabs.includes('pagamentos') ? <div style={{display: displayedTab === 'pagamentos' ? 'contents' : 'none'}}><PagamentosResultadosPage key={runtimeScope()} visible={visible && displayedTab==='pagamentos'}/></div> : null))}
    {canViewEnterDefenses && visitedTabs.includes('defesas') ? <div style={{display: displayedTab === 'defesas' ? 'contents' : 'none'}}><DefesasResultadosPage key={runtimeScope()} visible={visible && displayedTab==='defesas'}/></div> : null}
    {canViewEnterProtocols && visitedTabs.includes('protocolos') ? <div style={{display: displayedTab === 'protocolos' ? 'contents' : 'none'}}><ProtocolosResultadosPage key={runtimeScope()} visible={visible && displayedTab==='protocolos'}/></div> : null}
  </div>;
}
