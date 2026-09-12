import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { GestaoProcessualPage, type GestaoTab } from './GestaoProcessualPage';
import { LobbyPage } from './LobbyPage';
import { ProtocolosPage } from './ProtocolosPage';
import { configureBaseTaskImport } from './taskBaseImport';
import './shell.css';
import './analytics.css';
import './protocolos.css';

type RootView = 'lobby' | 'gestao';

type DashboardWindow = Window & typeof globalThis & {
  MBA_CURRENT_USER?: { permissions?: Record<string, boolean> };
  showPage?: (page: string, updateRoute?: boolean) => void;
};

const OPERATION_PAGES = new Set(['acordos', 'pagamentos', 'encerramentos']);

function labelNavItem(button: Element, label: string) {
  const span = button.querySelector('span');
  if (span) span.textContent = label;
}

function configureProfileControl() {
  const profile = document.querySelector<HTMLElement>('.profile');
  if (!profile || profile.dataset.mbaUsersToggle === 'true') return;

  const openUsers = () => {
    const user = (window as DashboardWindow).MBA_CURRENT_USER;
    if (user?.permissions?.['users.view'] !== true) return;
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    (window as DashboardWindow).showPage?.('usuarios');
  };

  profile.dataset.mbaUsersToggle = 'true';
  profile.setAttribute('role', 'button');
  profile.setAttribute('tabindex', '0');
  profile.setAttribute('aria-label', 'Abrir usuários');
  profile.addEventListener('click', openUsers);
  profile.addEventListener('keydown', event => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openUsers();
    }
  });
}

function setTopModuleActive(page: string) {
  const nav = document.querySelector<HTMLElement>('.main-nav');
  if (!nav) return;
  nav.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
  nav.querySelector<HTMLElement>(`[data-page="${page}"]`)?.classList.add('active');
}

function syncTopModuleFromActivePage() {
  const activePage = document.querySelector<HTMLElement>('main .page.active');
  if (!activePage?.id) return;

  if (OPERATION_PAGES.has(activePage.id)) {
    setTopModuleActive('acordos');
    return;
  }
  if (activePage.id === 'protocolo') {
    setTopModuleActive('protocolo');
    return;
  }
  if (activePage.id === 'automacoes') {
    setTopModuleActive('automacoes');
    return;
  }
  if (activePage.id === 'tarefas') {
    setTopModuleActive('tarefas');
    return;
  }
  if (activePage.id === 'dashboard') {
    setTopModuleActive('dashboard');
  }
}

function ensureOperationSubnav(pageId: string) {
  const section = document.getElementById(pageId);
  if (!section || section.querySelector('[data-mba-operation-subnav]')) return;

  const nav = document.createElement('nav');
  nav.className = 'analytics-subnav mba-operation-subnav';
  nav.dataset.mbaOperationSubnav = 'true';
  nav.setAttribute('aria-label', 'Operação');

  const modules = [
    { page: 'acordos', label: 'Acordos' },
    { page: 'pagamentos', label: 'Pagamentos' },
    { page: 'encerramentos', label: 'Encerramentos' },
  ];

  modules.forEach(module => {
    if (!document.getElementById(module.page)) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = module.label;
    button.classList.toggle('active', module.page === pageId);
    button.addEventListener('click', () => {
      (window as DashboardWindow).showPage?.(module.page);
      setTopModuleActive('acordos');
    });
    nav.appendChild(button);
  });

  section.prepend(nav);
}

function configureOperationSubnav() {
  OPERATION_PAGES.forEach(ensureOperationSubnav);
}

function configureApplicationShell() {
  const nav = document.querySelector<HTMLElement>('.main-nav');
  if (!nav) {
    configureProfileControl();
    return;
  }

  if (nav.dataset.mbaModuleNav === 'true') {
    configureOperationSubnav();
    configureProfileControl();
    syncTopModuleFromActivePage();
    return;
  }
  nav.dataset.mbaModuleNav = 'true';

  const visiblePages = new Set(['dashboard', 'acordos', 'automacoes', 'protocolo', 'tarefas']);
  const labels: Record<string, string> = {
    dashboard: 'Início',
    acordos: 'Operação',
    automacoes: 'Automações',
    protocolo: 'Controladoria',
    tarefas: 'Tarefas',
  };

  const buttons = [...nav.querySelectorAll<HTMLElement>('.nav-item')];
  buttons.forEach(button => {
    const page = button.dataset.page ?? '';
    if (page && visiblePages.has(page)) {
      button.dataset.mbaHidden = 'false';
      labelNavItem(button, labels[page]);
      return;
    }
    button.dataset.mbaHidden = 'true';
  });

  const orderedPages = ['dashboard', 'acordos', 'automacoes', 'protocolo', 'tarefas'];
  orderedPages.forEach(page => {
    const item = nav.querySelector<HTMLElement>(`[data-page="${page}"]`);
    if (item) nav.appendChild(item);
  });

  const home = nav.querySelector<HTMLElement>('[data-page="dashboard"]');
  home?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('mba:root-view', { detail: { view: 'lobby' } }));
  });

  configureOperationSubnav();

  const observer = new MutationObserver(syncTopModuleFromActivePage);
  document.querySelectorAll<HTMLElement>('main .page').forEach(page => {
    observer.observe(page, { attributes: true, attributeFilter: ['class'] });
  });
  syncTopModuleFromActivePage();
  configureProfileControl();
}

function mountProtocolosPage() {
  const section = document.getElementById('protocolo');
  if (!section || section.dataset.reactMounted === 'true') return;
  section.dataset.reactMounted = 'true';
  section.classList.add('protocolo-react-shell');
  section.replaceChildren();
  const mount = document.createElement('div');
  mount.className = 'protocolos-react-root';
  section.appendChild(mount);
  createRoot(mount).render(<StrictMode><ProtocolosPage/></StrictMode>);
}

function RootApp() {
  const [view, setView] = useState<RootView>('lobby');
  const [tab, setTab] = useState<GestaoTab>('carteira');

  useEffect(() => {
    configureApplicationShell();
    const cleanupBaseTaskImport = configureBaseTaskImport();
    const handler = (event: Event) => {
      const detail = (event as CustomEvent<{ view?: RootView; tab?: GestaoTab }>).detail;
      if (detail?.tab) setTab(detail.tab);
      if (detail?.view) setView(detail.view);
    };
    window.addEventListener('mba:root-view', handler);
    return () => {
      window.removeEventListener('mba:root-view', handler);
      cleanupBaseTaskImport();
    };
  }, []);

  const openGestao = (nextTab: GestaoTab = 'carteira') => {
    setTab(nextTab);
    setView('gestao');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector<HTMLElement>('[data-page="dashboard"]')?.classList.add('active');
  };

  return view === 'gestao'
    ? <GestaoProcessualPage key={tab} initialTab={tab}/>
    : <LobbyPage onOpenGestao={openGestao}/>;
}

const root = document.getElementById('dashboard-root');
if (!root) throw new Error('O ponto de montagem #dashboard-root não foi encontrado.');
createRoot(root).render(<StrictMode><RootApp/></StrictMode>);
mountProtocolosPage();
