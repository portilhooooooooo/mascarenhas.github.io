import { Component, StrictMode, useEffect, type ErrorInfo, type ReactNode } from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { ProcessosPage } from './ProcessosPage';
import { GestaoProcessualPage } from './GestaoProcessualPage';
import { OperacaoPage } from './OperacaoPage';
import { ControladoriaPage } from './ControladoriaPage';
import { UsersPage } from './UsersPage';
import { PortfolioSwitcher } from './PortfolioSwitcher';
import { configureBaseTaskImport } from './taskBaseImport';
import { mountTasksPage } from '../tasks/mount';
import './shell.css';
import './protocolos.css';
import './controladoria.css';
import './defesas.css';
import './users.css';
import './ui-architecture.css';

type DashboardWindow = Window & typeof globalThis & {
  MBA_CURRENT_USER?: { permissions?: Record<string, boolean> };
  MBA_REACT_TASKS?: boolean;
  MBA_PORTFOLIO_POLICY?: { canAccess: (pageId: string) => boolean };
  showPage?: (page: string, updateRoute?: boolean) => void;
};

const TASK_PAGES = new Set(['tarefas', 'tarefa-analise', 'comprovante-execucao', 'acordo-execucao']);
const mayOpen = (pageId: string) => (window as DashboardWindow).MBA_PORTFOLIO_POLICY?.canAccess(pageId) === true;

function labelNavItem(button: Element, label: string) {
  button.setAttribute('aria-label', label);
  const span = button.querySelector('span');
  if (span) span.textContent = label;
}

function configureProfileControl() {
  const profile = document.querySelector<HTMLElement>('.profile');
  if (!profile || profile.dataset.mbaUsersToggle === 'true') return;

  profile.dataset.mbaUsersToggle = 'true';
  profile.setAttribute('role', 'button');
  profile.setAttribute('tabindex', '0');
  profile.setAttribute('aria-label', 'Abrir menu do usuário');
  profile.setAttribute('aria-haspopup', 'menu');
  profile.setAttribute('aria-expanded', 'false');

  const menu = document.createElement('div');
  menu.className = 'profile-menu';
  menu.id = 'profile-menu';
  menu.hidden = true;
  menu.setAttribute('role', 'menu');
  menu.setAttribute('aria-label', 'Opções do usuário');
  profile.setAttribute('aria-controls', menu.id);

  const usersItem = document.createElement('button');
  usersItem.type = 'button';
  usersItem.className = 'profile-menu-item';
  usersItem.textContent = 'Usuários';
  usersItem.setAttribute('role', 'menuitem');

  const logoutItem = document.createElement('button');
  logoutItem.type = 'button';
  logoutItem.className = 'profile-menu-item profile-menu-logout';
  logoutItem.textContent = 'Sair';
  logoutItem.setAttribute('role', 'menuitem');

  menu.append(usersItem, logoutItem);
  profile.appendChild(menu);

  const syncUsersVisibility = () => {
    const user = (window as DashboardWindow).MBA_CURRENT_USER;
    usersItem.hidden = user?.permissions?.['users.view'] !== true;
  };

  const setOpen = (open: boolean) => {
    syncUsersVisibility();
    menu.hidden = !open;
    profile.setAttribute('aria-expanded', String(open));
    profile.classList.toggle('profile-menu-open', open);
  };

  const toggleMenu = () => setOpen(menu.hidden);

  const openUsers = () => {
    const user = (window as DashboardWindow).MBA_CURRENT_USER;
    if (user?.permissions?.['users.view'] !== true) return;
    setOpen(false);
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    (window as DashboardWindow).showPage?.('usuarios');
  };

  profile.addEventListener('click', event => {
    if (event.target instanceof Element && event.target.closest('.profile-menu')) return;
    toggleMenu();
  });

  profile.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      toggleMenu();
      return;
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault();
      setOpen(true);
      const firstVisible = [...menu.querySelectorAll<HTMLButtonElement>('.profile-menu-item')]
        .find(item => !item.hidden);
      firstVisible?.focus();
      return;
    }
    if (event.key === 'Escape') {
      setOpen(false);
      profile.focus();
    }
  });

  usersItem.addEventListener('click', event => {
    event.stopPropagation();
    openUsers();
  });

  logoutItem.addEventListener('click', event => {
    event.stopPropagation();
    setOpen(false);
    document.getElementById('logout-button')?.click();
  });

  document.addEventListener('click', event => {
    if (!menu.hidden && event.target instanceof Node && !profile.contains(event.target)) {
      setOpen(false);
    }
  });

  document.addEventListener('keydown', event => {
    if (event.key === 'Escape' && !menu.hidden) {
      setOpen(false);
      profile.focus();
    }
  });

  window.addEventListener('mba:authenticated', syncUsersVisibility);
  syncUsersVisibility();
}

function setTopModuleActive(page: string) {
  const nav = document.querySelector<HTMLElement>('.main-nav');
  if (!nav) return;
  nav.querySelectorAll('.nav-item').forEach(item => { item.classList.remove('active'); item.removeAttribute('aria-current'); });
  const candidate = nav.querySelector<HTMLElement>(`[data-page="${page}"]`);
  if (candidate && !candidate.hidden && candidate.dataset.mbaHidden !== 'true') { candidate.classList.add('active'); candidate.setAttribute('aria-current','page'); }
  const label = document.getElementById('mba-active-module');
  const titles: Record<string, string> = { processos: 'Processos', tarefas: 'Tarefas', acordos: 'Operação', automacoes: 'Automações', dashboard: 'Resultados' };
  if (label) label.textContent = titles[page] || 'Workspace';
}

function syncTopModuleFromActivePage() {
  const activePage = document.querySelector<HTMLElement>('main .page.active');
  if (!activePage?.id) return;

  if (activePage.id === 'processos') { setTopModuleActive('processos'); return; }
  if (activePage.id === 'acordos') {
    setTopModuleActive('acordos');
    return;
  }
  if (['protocolo', 'pagamentos', 'tutelas', 'encerramentos'].includes(activePage.id)) {
    setTopModuleActive('acordos');
    return;
  }
  if (activePage.id === 'automacoes') {
    setTopModuleActive('automacoes');
    return;
  }
  if (TASK_PAGES.has(activePage.id)) {
    setTopModuleActive('tarefas');
    return;
  }
  if (activePage.id === 'dashboard') setTopModuleActive('dashboard');
  if (activePage.id === 'usuarios') {
    document.querySelectorAll('.main-nav .nav-item').forEach(item => item.classList.remove('active'));
    const label = document.getElementById('mba-active-module');
    if (label) label.textContent = 'Usuários';
  }
}

function configureApplicationShell() {
  const nav = document.querySelector<HTMLElement>('.main-nav');
  if (!nav) {
    configureProfileControl();
    return;
  }

  if (nav.dataset.mbaModuleNav === 'true') {
    configureProfileControl();
    syncTopModuleFromActivePage();
    return;
  }
  nav.dataset.mbaModuleNav = 'true';

  // Um único nível principal. Protocolos e Defesas passam a ser abas de Operação.
  // A página /controladoria permanece montável para preservar links legados.
  const visiblePages = new Set(['processos', 'tarefas', 'acordos', 'automacoes', 'dashboard']);
  const labels: Record<string, string> = {
    processos: 'Processos',
    tarefas: 'Tarefas',
    acordos: 'Operação',
    automacoes: 'Automações',
    dashboard: 'Resultados',
  };

  const buttons = [...nav.querySelectorAll<HTMLElement>('.nav-item')];
  const syncVisibility = () => {
    buttons.forEach(button => {
      const page = button.dataset.page || '';
      const recognized = visiblePages.has(page);
      const eligible = recognized && Boolean(page) && mayOpen(page);
      button.dataset.mbaHidden = String(!eligible);
      button.hidden = !eligible;
      if (!eligible) button.classList.remove('active');
    });
    const current = document.querySelector<HTMLElement>('main .page.active');
    if ((window as DashboardWindow).MBA_CURRENT_USER && current?.id && current.id !== 'sem-acesso' && !mayOpen(current.id)) {
      const fallback = [...visiblePages].find(page => mayOpen(page));
      // Keep the current URL during permission/profile refresh; navigation
      // remains gated by canAccess and can recover after reauthentication.
      (window as DashboardWindow).showPage?.(fallback || 'sem-acesso', false);
    }
    syncTopModuleFromActivePage();
  };
  buttons.forEach(button => {
    const page = button.dataset.page || '';
    if (visiblePages.has(page)) labelNavItem(button, labels[page]);
    else button.dataset.mbaHidden = 'true';
  });

  const orderedItems: Array<HTMLElement | null> = [
    nav.querySelector<HTMLElement>('[data-page="processos"]'),
    nav.querySelector<HTMLElement>('[data-page="tarefas"]'),
    nav.querySelector<HTMLElement>('[data-page="acordos"]'),
    nav.querySelector<HTMLElement>('[data-page="automacoes"]'),
    nav.querySelector<HTMLElement>('[data-page="dashboard"]'),
  ];
  orderedItems.forEach(item => { if (item) nav.appendChild(item); });

  const observer = new MutationObserver(syncTopModuleFromActivePage);
  document.querySelectorAll<HTMLElement>('main .page').forEach(page => {
    observer.observe(page, { attributes: true, attributeFilter: ['class'] });
  });
  window.addEventListener('mba:authenticated', syncVisibility);
  window.addEventListener('mba:profile-ready', syncVisibility);
  window.addEventListener('mba:module-visibility-updated', syncVisibility);
  window.addEventListener('mba:portfolio-changed', syncVisibility);
  window.addEventListener('mba:session-expired', syncVisibility);
  window.addEventListener('mba:logged-out', syncVisibility);
  syncVisibility();
  configureProfileControl();
}

let operacaoRoot: Root | null = null;

function mountOperacaoPage() {
  const section = document.getElementById('acordos');
  if (!section || operacaoRoot) return;
  section.dataset.reactMounted = 'true';
  section.classList.add('operacao-react-host');
  section.replaceChildren();
  const mount = document.createElement('div');
  mount.className = 'operacao-react-root';
  section.appendChild(mount);
  operacaoRoot = createRoot(mount);
  operacaoRoot.render(<StrictMode><OperacaoPage/></StrictMode>);
}

function unmountOperacaoPage() {
  if (!operacaoRoot) return;
  operacaoRoot.unmount();
  operacaoRoot = null;
  const section = document.getElementById('acordos');
  if (section) {
    delete section.dataset.reactMounted;
    section.replaceChildren();
  }
}

function syncOperacaoLifecycle() {
  const section = document.getElementById('acordos');
  const user = (window as DashboardWindow).MBA_CURRENT_USER;
  const active = section?.classList.contains('active') === true;
  const allowed = mayOpen('acordos');
  // Keep previously visited modules mounted across navigation and tab visibility.
  // Drop their state only when authorization/session/portfolio actually changes.
  if (!allowed) unmountOperacaoPage();
  else if (active) mountOperacaoPage();
}

function configureOperacaoLifecycle() {
  const section = document.getElementById('acordos');
  if (!section) return;
  const observer = new MutationObserver(syncOperacaoLifecycle);
  observer.observe(section, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('mba:authenticated', syncOperacaoLifecycle);
  window.addEventListener('mba:profile-ready', syncOperacaoLifecycle);
  window.addEventListener('mba:module-visibility-updated', syncOperacaoLifecycle);
  window.addEventListener('mba:portfolio-changed', () => { unmountOperacaoPage(); syncOperacaoLifecycle(); });
  window.addEventListener('mba:session-expired', unmountOperacaoPage);
  window.addEventListener('mba:logged-out', unmountOperacaoPage);
  document.addEventListener('visibilitychange', syncOperacaoLifecycle);
  syncOperacaoLifecycle();
}

let protocolosRoot: Root | null = null;

function mountProtocolosPage() {
  const section = document.getElementById('protocolo');
  if (!section || protocolosRoot) return;
  section.dataset.reactMounted = 'true';
  section.classList.add('protocolo-react-shell');
  section.replaceChildren();
  const mount = document.createElement('div');
  mount.className = 'protocolos-react-root';
  section.appendChild(mount);
  protocolosRoot = createRoot(mount);
  protocolosRoot.render(<StrictMode><ControladoriaPage/></StrictMode>);
}

function unmountProtocolosPage() {
  if (!protocolosRoot) return;
  protocolosRoot.unmount();
  protocolosRoot = null;
  const section = document.getElementById('protocolo');
  if (section) {
    delete section.dataset.reactMounted;
    section.replaceChildren();
  }
}

function syncProtocolosLifecycle() {
  const section = document.getElementById('protocolo');
  const user = (window as DashboardWindow).MBA_CURRENT_USER;
  const active = section?.classList.contains('active') === true;
  const allowed = mayOpen('protocolo');
  if (!allowed) unmountProtocolosPage();
  else if (active) mountProtocolosPage();
}

function configureProtocolosLifecycle() {
  const section = document.getElementById('protocolo');
  if (!section) return;

  const observer = new MutationObserver(syncProtocolosLifecycle);
  observer.observe(section, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('mba:authenticated', syncProtocolosLifecycle);
  window.addEventListener('mba:profile-ready', syncProtocolosLifecycle);
  window.addEventListener('mba:module-visibility-updated', syncProtocolosLifecycle);
  window.addEventListener('mba:portfolio-changed', () => { unmountProtocolosPage(); syncProtocolosLifecycle(); });
  window.addEventListener('mba:session-expired', unmountProtocolosPage);
  window.addEventListener('mba:logged-out', unmountProtocolosPage);
  document.addEventListener('visibilitychange', syncProtocolosLifecycle);
  syncProtocolosLifecycle();
}

let bancoDadosRoot: Root | null = null;
function unmountBancoDados() {
  if (!bancoDadosRoot) return;
  bancoDadosRoot.unmount();
  bancoDadosRoot = null;
  document.getElementById('banco-dados')?.replaceChildren();
}
function syncBancoDadosLifecycle() {
  const section = document.getElementById('banco-dados');
  if (!section) return;
  // Hiding a tab or the browser must not destroy a visited React root.
  if (!mayOpen('banco-dados')) {
    unmountBancoDados();
    return;
  }
  if (section.classList.contains('active') && !bancoDadosRoot) {
    bancoDadosRoot = createRoot(section);
    bancoDadosRoot.render(<StrictMode><BancoDadosPage /></StrictMode>);
  }
}
function configureBancoDadosLifecycle() {
  const section = document.getElementById('banco-dados');
  if (!section) return;
  new MutationObserver(syncBancoDadosLifecycle).observe(section, { attributes: true, attributeFilter: ['class'] });
  for (const event of ['mba:authenticated', 'mba:profile-ready', 'mba:module-visibility-updated']) {
    window.addEventListener(event, syncBancoDadosLifecycle);
  }
  window.addEventListener('mba:portfolio-changed', () => { unmountBancoDados(); syncBancoDadosLifecycle(); });
  window.addEventListener('mba:session-expired', unmountBancoDados);
  window.addEventListener('mba:logged-out', unmountBancoDados);
  syncBancoDadosLifecycle();
}

let usersRoot: Root | null = null;

function mountUsersPage() {
  const section = document.getElementById('usuarios');
  if (!section || usersRoot) return;
  section.dataset.reactMounted = 'true';
  section.classList.add('users-react-host');
  section.replaceChildren();
  const mount = document.createElement('div');
  mount.className = 'users-react-root';
  section.appendChild(mount);
  usersRoot = createRoot(mount);
  usersRoot.render(<StrictMode><UsersPage /></StrictMode>);
}

function unmountUsersPage() {
  if (!usersRoot) return;
  usersRoot.unmount();
  usersRoot = null;
  const section = document.getElementById('usuarios');
  if (section) {
    delete section.dataset.reactMounted;
    section.classList.remove('users-react-host');
    section.replaceChildren();
  }
}

function syncUsersLifecycle() {
  const section = document.getElementById('usuarios');
  const user = (window as DashboardWindow).MBA_CURRENT_USER;
  const active = section?.classList.contains('active') === true;
  const allowed = mayOpen('usuarios');
  if (!allowed) unmountUsersPage();
  else if (active) mountUsersPage();
}

function configureUsersLifecycle() {
  const section = document.getElementById('usuarios');
  if (!section) return;
  const observer = new MutationObserver(syncUsersLifecycle);
  observer.observe(section, { attributes: true, attributeFilter: ['class'] });
  window.addEventListener('mba:authenticated', syncUsersLifecycle);
  window.addEventListener('mba:profile-ready', syncUsersLifecycle);
  window.addEventListener('mba:module-visibility-updated', syncUsersLifecycle);
  window.addEventListener('mba:portfolio-changed', () => { unmountUsersPage(); syncUsersLifecycle(); });
  window.addEventListener('mba:session-expired', unmountUsersPage);
  window.addEventListener('mba:logged-out', unmountUsersPage);
  document.addEventListener('visibilitychange', syncUsersLifecycle);
  syncUsersLifecycle();
}

let portfolioRoot: Root | null = null;
function mountPortfolioSwitcher() {
  const host = document.getElementById('portfolio-switcher');
  if (!host || portfolioRoot) return;
  portfolioRoot = createRoot(host);
  portfolioRoot.render(<PortfolioSwitcher />);
}

class ResultsErrorBoundary extends Component<{children: ReactNode}, {failed: boolean}> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error('results_react_render_failed', error, info.componentStack);
  }
  render() {
    if (this.state.failed) return <div role="alert" className="mba-results-load-error">
      <strong>Não foi possível carregar Resultados.</strong>
      <p>A navegação permanece disponível. Recarregue a página para tentar novamente.</p>
      <button type="button" onClick={() => window.location.reload()}>Recarregar</button>
    </div>;
    return this.props.children;
  }
}

function RootApp() {
  useEffect(() => {
    configureApplicationShell();
    mountPortfolioSwitcher();
    const cleanupBaseTaskImport = (window as DashboardWindow).MBA_REACT_TASKS
      ? () => undefined
      : configureBaseTaskImport();
    return () => cleanupBaseTaskImport();
  }, []);

  return <ResultsErrorBoundary><GestaoProcessualPage/></ResultsErrorBoundary>;
}

const root = document.getElementById('dashboard-root');
if (!root) throw new Error('O ponto de montagem #dashboard-root não foi encontrado.');
createRoot(root).render(<StrictMode><RootApp/></StrictMode>);
mountTasksPage();
configureOperacaoLifecycle();
configureProtocolosLifecycle();
configureUsersLifecycle();

// Drop the previous root on every portfolio transition; no stale client data persists.
let processosRoot: Root | null = null;
function unmountProcessos() {
  processosRoot?.unmount(); processosRoot = null;
  document.getElementById('processos')?.replaceChildren();
}
function syncProcessos() {
  const section = document.getElementById('processos');
  if (!section || !mayOpen('processos')) { unmountProcessos(); return; }
  if (section.classList.contains('active') && !processosRoot) {
    processosRoot = createRoot(section);
    processosRoot.render(<StrictMode><ProcessosPage/></StrictMode>);
  }
}
const processosHost = document.getElementById('processos');
if (processosHost) {
  new MutationObserver(syncProcessos).observe(processosHost, {attributes:true,attributeFilter:['class']});
  for (const event of ['mba:authenticated','mba:profile-ready','mba:module-visibility-updated']) window.addEventListener(event,syncProcessos);
  window.addEventListener('mba:portfolio-changed', () => { unmountProcessos(); syncProcessos(); });
  for (const event of ['mba:session-expired','mba:logged-out']) window.addEventListener(event,unmountProcessos);
  syncProcessos();
}
