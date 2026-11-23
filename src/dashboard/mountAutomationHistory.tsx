import {createRoot, type Root} from 'react-dom/client';
import {AutomationHistory} from './AutomationHistory';
import './automationHistory.css';

const historyRoute = 'automacoes/historico';

type AutomationWindow = Window & {
  MBA_CURRENT_USER?: {permissions?: Record<string, boolean>};
  MBA_PORTFOLIO_POLICY?: {canAccess: (page: string) => boolean};
  MBA_NAVIGATE?: (route: string) => boolean;
};

export function mountAutomationHistory() {
  const host = document.getElementById('automation-history-root');
  const existing = document.getElementById('automation-existing-content');
  const toggle = document.getElementById('automation-history-toggle');
  const page = document.getElementById('automacoes');
  if (!host || !existing || !toggle || !page) return;

  const app: AutomationWindow = window;
  let root: Root | null = null;
  let showingHistory = false;

  function clear() {
    root?.unmount();
    root = null;
  }

  const sync = () => {
    const path = location.hash.startsWith('#/') ? location.hash.slice(2) : location.pathname;
    const permitted = app.MBA_CURRENT_USER?.permissions?.['automations.view'] === true
      && app.MBA_PORTFOLIO_POLICY?.canAccess('automacoes') === true;
    showingHistory = permitted && page.classList.contains('active')
      && path.replace(/^\/+|\/+$/g, '') === historyRoute;
    toggle.hidden = !permitted;
    toggle.textContent = showingHistory ? 'Voltar às integrações' : 'Histórico de execuções';
    existing.hidden = showingHistory;
    host.hidden = !showingHistory;
    if (!showingHistory) clear();
    else if (!root) {
      root = createRoot(host);
      root.render(<AutomationHistory initialService="" enabled/>);
    }
  };

  toggle.addEventListener('click', () => app.MBA_NAVIGATE?.(showingHistory ? 'automacoes' : historyRoute));
  window.addEventListener('mba:route-changed', sync);
  for (const event of ['mba:authenticated', 'mba:profile-ready', 'mba:module-visibility-updated', 'mba:portfolio-changed']) {
    window.addEventListener(event, () => { clear(); sync(); });
  }
  for (const event of ['mba:session-expired', 'mba:logged-out', 'mba:authorization-invalidated']) {
    window.addEventListener(event, () => {
      clear();
      showingHistory = false;
      host.hidden = true;
      toggle.hidden = true;
      existing.hidden = false;
    });
  }
  sync();
}
