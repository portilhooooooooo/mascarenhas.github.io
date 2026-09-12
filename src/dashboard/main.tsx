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

const OPERATION_PAGES = new Set(['protocolo', 'pagamentos', 'acordos', 'acordo-execucao']);
const AUTOMATION_PAGES = new Set(['automacoes', 'tutelas']);
const CONTROLADORIA_PAGES = new Set(['encerramentos']);
const TASK_PAGES = new Set(['tarefas', 'tarefa-analise']);

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

function setNavLabel(item: HTMLElement | null, label: string) {
  const span = item?.querySelector('span');
  if (span) span.textContent = label;
}

function navItem(page: string) {
  return document.querySelector<HTMLElement>(`.main-nav .nav-item[data-page="${page}"]`);
}

function createGroup(id: string, label: string, icon: string, items: HTMLElement[]) {
  const group = document.createElement('div');
  group.className = 'mba-nav-group';
  group.dataset.navGroup = id;

  const parent = document.createElement('button');
  parent.type = 'button';
  parent.className = 'mba-nav-group-toggle';
  parent.setAttribute('aria-expanded', 'true');
  parent.innerHTML = `<i data-lucide="${icon}"></i><span>${label}</span><i class="mba-nav-group-chevron" data-lucide="chevron-down"></i>`;

  const children = document.createElement('div');
  children.className = 'mba-nav-group-items';
  items.forEach(item => children.appendChild(item));

  parent.addEventListener('click', () => {
    const collapsed = group.classList.toggle('is-collapsed');
    parent.setAttribute('aria-expanded', String(!collapsed));
    window.localStorage.setItem(`mba-nav-group-${id}`, collapsed ? '0' : '1');
  });

  const stored = window.localStorage.getItem(`mba-nav-group-${id}`);
  if (stored === '0') {
    group.classList.add('is-collapsed');
    parent.setAttribute('aria-expanded', 'false');
  }

  group.append(parent, children);
  return group;
}

function createGestaoItem() {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'nav-item';
  button.dataset.navGestao = 'true';
  button.dataset.permission = 'dashboard.view';
  button.innerHTML = '<i data-lucide="chart-no-axes-combined"></i><span>Gestão Processual</span>';
  button.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('mba:root-view', { detail: { view: 'gestao', tab: 'carteira' } }));
  });
  return button;
}

function syncSidebarActive() {
  const activePage = document.querySelector<HTMLElement>('main .page.active');
  const pageId = activePage?.id || '';
  const rootView = document.body.dataset.mbaRootView || 'lobby';

  document.querySelectorAll('.main-nav .nav-item').forEach(item => item.classList.remove('active'));
  document.querySelectorAll('.mba-nav-group').forEach(group => group.classList.remove('active'));

  if (pageId === 'dashboard' && rootView === 'gestao') {
    document.querySelector<HTMLElement>('[data-nav-gestao="true"]')?.classList.add('active');
    document.querySelector<HTMLElement>('[data-nav-group="controladoria"]')?.classList.add('active');
    return;
  }

  if (pageId === 'dashboard') {
    navItem('dashboard')?.classList.add('active');
    return;
  }

  if (OPERATION_PAGES.has(pageId)) {
    document.querySelector<HTMLElement>('[data-nav-group="operacao"]')?.classList.add('active');
    const target = pageId === 'acordo-execucao' ? 'acordos' : pageId;
    navItem(target)?.classList.add('active');
    return;
  }

  if (AUTOMATION_PAGES.has(pageId)) {
    document.querySelector<HTMLElement>('[data-nav-group="automacoes"]')?.classList.add('active');
    navItem(pageId)?.classList.add('active');
    return;
  }

  if (CONTROLADORIA_PAGES.has(pageId)) {
    document.querySelector<HTMLElement>('[data-nav-group="controladoria"]')?.classList.add('active');
    navItem(pageId)?.classList.add('active');
    return;
  }

  if (TASK_PAGES.has(pageId)) {
    navItem('tarefas')?.classList.add('active');
    return;
  }

  navItem(pageId)?.classList.add('active');
}

function configureApplicationShell() {
  const nav = document.querySelector<HTMLElement>('.main-nav');
  if (!nav) {
    configureProfileControl();
    return;
  }

  if (nav.dataset.mbaSidebarArchitecture === 'v2') {
    configureProfileControl();
    syncSidebarActive();
    return;
  }
  nav.dataset.mbaSidebarArchitecture = 'v2';

  const dashboard = navItem('dashboard');
  const protocolo = navItem('protocolo');
  const pagamentos = navItem('pagamentos');
  const acordos = navItem('acordos');
  const automacoes = navItem('automacoes');
  const liminar = navItem('tutelas');
  const encerramentos = navItem('encerramentos');
  const tarefas = navItem('tarefas');
  const usuarios = navItem('usuarios');
  const configuracoes = navItem('configuracoes');

  setNavLabel(dashboard, 'Início');
  setNavLabel(protocolo, 'Protocolo');
  setNavLabel(automacoes, 'Integrações');
  setNavLabel(liminar, 'Liminar');

  const keep = new Set([dashboard, protocolo, pagamentos, acordos, automacoes, liminar, encerramentos, tarefas, usuarios, configuracoes].filter(Boolean));
  [...nav.children].forEach(child => {
    if (child instanceof HTMLElement && child.classList.contains('nav-item') && !keep.has(child)) child.hidden = true;
  });

  const gestao = createGestaoItem();
  const operacao = createGroup('operacao', 'Operação', 'handshake', [protocolo, pagamentos, acordos].filter(Boolean) as HTMLElement[]);
  const automationGroup = createGroup('automacoes', 'Automações', 'bot', [automacoes, liminar].filter(Boolean) as HTMLElement[]);
  const controladoria = createGroup('controladoria', 'Controladoria', 'chart-no-axes-combined', [gestao, encerramentos].filter(Boolean) as HTMLElement[]);

  const admin = document.createElement('div');
  admin.className = 'mba-nav-admin';
  [usuarios, configuracoes].filter(Boolean).forEach(item => admin.appendChild(item as HTMLElement));

  if (dashboard) nav.appendChild(dashboard);
  nav.appendChild(operacao);
  nav.appendChild(automationGroup);
  nav.appendChild(controladoria);
  if (tarefas) nav.appendChild(tarefas);
  if (admin.children.length) nav.appendChild(admin);

  dashboard?.addEventListener('click', () => {
    window.dispatchEvent(new CustomEvent('mba:root-view', { detail: { view: 'lobby' } }));
  });

  const observer = new MutationObserver(syncSidebarActive);
  document.querySelectorAll<HTMLElement>('main .page').forEach(page => {
    observer.observe(page, { attributes: true, attributeFilter: ['class'] });
  });

  window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  configureProfileControl();
  syncSidebarActive();
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

  useEffect(() => {
    document.body.dataset.mbaRootView = view;
    syncSidebarActive();
  }, [view]);

  const openGestao = (nextTab: GestaoTab = 'carteira') => {
    setTab(nextTab);
    setView('gestao');
  };

  return view === 'gestao'
    ? <GestaoProcessualPage key={tab} initialTab={tab}/>
    : <LobbyPage onOpenGestao={openGestao}/>;
}

const root = document.getElementById('dashboard-root');
if (!root) throw new Error('O ponto de montagem #dashboard-root não foi encontrado.');
createRoot(root).render(<StrictMode><RootApp/></StrictMode>);
mountProtocolosPage();
