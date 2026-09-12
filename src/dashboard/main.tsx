import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { GestaoProcessualPage } from './GestaoProcessualPage';
import { ProtocolosPage } from './ProtocolosPage';
import { configureBaseTaskImport } from './taskBaseImport';
import './shell.css';
import './analytics.css';
import './protocolos.css';

type DashboardWindow = Window & typeof globalThis & {
  MBA_CURRENT_USER?: { permissions?: Record<string, boolean> };
  showPage?: (page: string, updateRoute?: boolean) => void;
};

const OPERATION_PAGES = new Set(['pagamentos', 'acordos', 'tutelas', 'encerramentos']);

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
  if (activePage.id === 'tarefas' || activePage.id === 'tarefa-analise') {
    setTopModuleActive('tarefas');
    return;
  }
  if (activePage.id === 'dashboard') setTopModuleActive('dashboard');
}

function ensureOperationSubnav(pageId: string) {
  const section = document.getElementById(pageId);
  if (!section || section.querySelector('[data-mba-operation-subnav]')) return;

  const nav = document.createElement('nav');
  nav.className = 'analytics-subnav mba-operation-subnav';
  nav.dataset.mbaOperationSubnav = 'true';
  nav.setAttribute('aria-label', 'Operação');

  const modules = [
    { page: 'pagamentos', label: 'Pagamentos' },
    { page: 'acordos', label: 'Acordos' },
    { page: 'tutelas', label: 'Liminar' },
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

  const visiblePages = new Set(['dashboard', 'acordos', 'protocolo', 'automacoes', 'tarefas']);
  const labels: Record<string, string> = {
    dashboard: 'Gestão Processual',
    acordos: 'Operação',
    protocolo: 'Controladoria',
    automacoes: 'Automações',
    tarefas: 'Tarefas',
  };

  const buttons = [...nav.querySelectorAll<HTMLElement>('.nav-item')];
  const baseDados = buttons.find(button => button.textContent?.trim() === 'Documentos') ?? null;

  buttons.forEach(button => {
    const page = button.dataset.page ?? '';
    if (page && visiblePages.has(page)) {
      button.dataset.mbaHidden = 'false';
      labelNavItem(button, labels[page]);
      return;
    }
    if (button === baseDados) {
      button.dataset.mbaHidden = 'false';
      labelNavItem(button, 'Base de dados');
      button.title = 'Módulo reservado para o Metabase';
      return;
    }
    button.dataset.mbaHidden = 'true';
  });

  const orderedItems: Array<HTMLElement | null> = [
    nav.querySelector<HTMLElement>('[data-page="dashboard"]'),
    nav.querySelector<HTMLElement>('[data-page="acordos"]'),
    nav.querySelector<HTMLElement>('[data-page="protocolo"]'),
    baseDados,
    nav.querySelector<HTMLElement>('[data-page="automacoes"]'),
    nav.querySelector<HTMLElement>('[data-page="tarefas"]'),
  ];
  orderedItems.forEach(item => { if (item) nav.appendChild(item); });

  const gestao = nav.querySelector<HTMLElement>('[data-page="dashboard"]');
  gestao?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('mba:gestao-tab', { detail: { tab: 'carteira' } }));
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
  useEffect(() => {
    configureApplicationShell();
    const cleanupBaseTaskImport = configureBaseTaskImport();
    return () => cleanupBaseTaskImport();
  }, []);

  return <GestaoProcessualPage initialTab="carteira"/>;
}

const root = document.getElementById('dashboard-root');
if (!root) throw new Error('O ponto de montagem #dashboard-root não foi encontrado.');
createRoot(root).render(<StrictMode><RootApp/></StrictMode>);
mountProtocolosPage();
