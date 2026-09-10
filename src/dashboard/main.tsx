import { StrictMode, useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { BarChart3 } from 'lucide-react';
import { GestaoProcessualPage, type GestaoTab } from './GestaoProcessualPage';
import { LobbyPage } from './LobbyPage';
import { configureBaseTaskImport } from './taskBaseImport';
import './shell.css';
import './analytics.css';

type RootView = 'lobby' | 'gestao';

type DashboardWindow = Window & typeof globalThis & {
  MBA_CURRENT_USER?: { permissions?: Record<string, boolean> };
  showPage?: (page: string, updateRoute?: boolean) => void;
};

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

function configureApplicationShell() {
  const nav = document.querySelector('.main-nav');
  if (!nav || nav.querySelector('[data-mba-gestao]')) {
    configureProfileControl();
    return;
  }

  const visiblePages = new Set(['dashboard', 'acordos', 'pagamentos', 'automacoes', 'protocolo', 'tarefas']);
  const labels: Record<string, string> = {
    dashboard: 'Início',
    acordos: 'Acordos',
    pagamentos: 'Pagamentos',
    automacoes: 'Automações',
    protocolo: 'Protocolos',
    tarefas: 'Tarefas',
  };

  const buttons = [...nav.querySelectorAll<HTMLElement>('.nav-item')];
  let reports: HTMLElement | null = null;
  buttons.forEach(button => {
    const page = button.dataset.page ?? '';
    const currentLabel = button.textContent?.trim() ?? '';
    if (page && visiblePages.has(page)) {
      button.dataset.mbaHidden = 'false';
      labelNavItem(button, labels[page]);
      return;
    }
    if (/relat[oó]rios/i.test(currentLabel)) {
      reports = button;
      button.dataset.mbaHidden = 'false';
      labelNavItem(button, 'Relatórios');
      return;
    }
    button.dataset.mbaHidden = 'true';
  });

  const home = nav.querySelector<HTMLElement>('[data-page="dashboard"]');
  if (!home) {
    configureProfileControl();
    return;
  }

  const gestao = document.createElement('button');
  gestao.type = 'button';
  gestao.className = 'nav-item mba-custom-nav';
  gestao.dataset.mbaGestao = 'true';
  gestao.innerHTML = '<span data-mba-gestao-icon></span><span>Gestão Processual</span>';
  const iconMount = gestao.querySelector('[data-mba-gestao-icon]');
  if (iconMount) createRoot(iconMount).render(<BarChart3 size={14} strokeWidth={1.7}/>);

  // Preserve the approved information architecture even though the legacy DOM
  // originally listed these modules in a completely different order.
  const ordered = [
    home,
    gestao,
    nav.querySelector<HTMLElement>('[data-page="acordos"]'),
    nav.querySelector<HTMLElement>('[data-page="pagamentos"]'),
    nav.querySelector<HTMLElement>('[data-page="automacoes"]'),
    nav.querySelector<HTMLElement>('[data-page="protocolo"]'),
    nav.querySelector<HTMLElement>('[data-page="tarefas"]'),
    reports,
  ].filter((item): item is HTMLElement => Boolean(item));
  ordered.forEach(item => nav.appendChild(item));

  home.addEventListener('click', () => {
    gestao.classList.remove('active');
    window.dispatchEvent(new CustomEvent('mba:root-view', { detail: { view: 'lobby' } }));
  });

  gestao.addEventListener('click', () => {
    (window as DashboardWindow).showPage?.('dashboard', false);
    buttons.forEach(button => button.classList.remove('active'));
    gestao.classList.add('active');
    window.dispatchEvent(new CustomEvent('mba:root-view', { detail: { view: 'gestao' } }));
  });

  buttons.filter(button => button !== home).forEach(button => button.addEventListener('click', () => gestao.classList.remove('active')));
  configureProfileControl();
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
    const nav = document.querySelector<HTMLElement>('[data-mba-gestao]');
    document.querySelectorAll('.nav-item').forEach(item => item.classList.remove('active'));
    nav?.classList.add('active');
  };

  return view === 'gestao'
    ? <GestaoProcessualPage key={tab} initialTab={tab}/>
    : <LobbyPage onOpenGestao={openGestao}/>;
}

const root = document.getElementById('dashboard-root');
if (!root) throw new Error('O ponto de montagem #dashboard-root não foi encontrado.');
createRoot(root).render(<StrictMode><RootApp/></StrictMode>);
