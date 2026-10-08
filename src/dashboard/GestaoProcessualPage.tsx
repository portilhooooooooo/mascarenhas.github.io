import { useEffect, useState } from 'react';
import { EncerramentosPage } from './EncerramentosPage';
import { MetabaseGestaoEmbed } from './MetabaseGestaoEmbed';
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
  const [activeTab, setActiveTab] = useState<'geral' | 'encerramentos'>(currentAnalyticsTab);
  const policy = (window as Window & { MBA_PORTFOLIO_POLICY?: { canAccess: (page: string) => boolean } }).MBA_PORTFOLIO_POLICY;
  const canViewAnalytics = permissions['dashboard.view'] === true && policy?.canAccess('dashboard') === true;
  const canViewClosing = permissions['encerramentos.view'] === true && policy?.canAccess('encerramentos') === true;

  useEffect(() => {
    const sync = () => setPermissions(getPermissions());
    window.addEventListener('mba:authenticated', sync);
    window.addEventListener('mba:profile-ready', sync);
    window.addEventListener('mba:logged-out', sync);
    window.addEventListener('mba:session-expired', sync);
    return () => {
      window.removeEventListener('mba:authenticated', sync);
      window.removeEventListener('mba:profile-ready', sync);
      window.removeEventListener('mba:logged-out', sync);
      window.removeEventListener('mba:session-expired', sync);
    };
  }, []);
  useEffect(() => {
    const sync = () => setActiveTab(currentAnalyticsTab());
    window.addEventListener('mba:route-changed', sync);
    return () => window.removeEventListener('mba:route-changed', sync);
  }, []);
  useEffect(() => {
    if (!canViewClosing && activeTab === 'encerramentos') setActiveTab('geral');
  }, [activeTab, canViewClosing]);

  if (!canViewAnalytics) return <section className="gestao-metabase-page" aria-label="Analytics indisponível">Sem autorização para visualizar Analytics.</section>;

  return <div className="gestao-metabase-page gestao-processual-react">
    <nav className="mba-operation-subnav gestao-processual-subnav" aria-label="Seções de Analytics">
      <button type="button" className={activeTab === 'geral' ? 'active' : ''} aria-current={activeTab === 'geral' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics')}>Visão geral</button>
      {canViewClosing && <button type="button" className={activeTab === 'encerramentos' ? 'active' : ''} aria-current={activeTab === 'encerramentos' ? 'page' : undefined} onClick={() => navigateAnalytics('analytics/encerramentos')}>Encerramentos</button>}
    </nav>
    {activeTab === 'encerramentos' && canViewClosing ? <EncerramentosPage/> : <MetabaseGestaoEmbed/>}
  </div>;
}
