(() => {
  'use strict';

  const TASK_CONTEXT_PAGES = new Set([
    'tarefas',
    'tarefa-analise',
    'comprovante-execucao',
    'acordo-execucao',
    'protocolo',
  ]);
  const EXECUTION_PAGES = new Set([
    'tarefa-analise',
    'comprovante-execucao',
    'acordo-execucao',
    'protocolo',
  ]);
  const LAST_TASK_TYPE_KEY = 'mba-last-task-type';

  let currentUser = window.MBA_CURRENT_USER || null;

  const canManage = () => Boolean(
    currentUser?.is_master_admin
    || currentUser?.permissions?.['tasks.manage'] === true
    || currentUser?.permissions?.['tasks.assign'] === true
    || currentUser?.permissions?.['tasks.create'] === true
  );

  function currentPageId() {
    return document.querySelector('main.content .page.active')?.id || '';
  }

  function parseTaskButton(button) {
    if (!button?.dataset.taskJson) return null;
    try {
      return JSON.parse(decodeURIComponent(button.dataset.taskJson));
    } catch (_error) {
      return null;
    }
  }

  function taskButtons() {
    return [...document.querySelectorAll('#tasks-table-body [data-task-json]')];
  }

  function openExecutionWorkspace() {
    const pageId = currentPageId();
    if (EXECUTION_PAGES.has(pageId)) return;

    const buttons = taskButtons();
    if (!buttons.length) return;

    const preferredType = sessionStorage.getItem(LAST_TASK_TYPE_KEY);
    const preferred = buttons.find((button) => parseTaskButton(button)?.type === preferredType);
    (preferred || buttons[0])?.click();
  }

  function ensureSubnav() {
    let nav = document.querySelector('#tasks-module-nav');
    if (!nav) {
      nav = document.createElement('nav');
      nav.id = 'tasks-module-nav';
      nav.className = 'tasks-module-nav';
      nav.setAttribute('aria-label', 'Navegação do módulo de tarefas');
    }

    const mainArea = document.querySelector('.main-area');
    const content = document.querySelector('main.content');
    if (mainArea && content && nav.parentElement !== mainArea) mainArea.insertBefore(nav, content);

    nav.innerHTML = `
      <div class="tasks-module-nav-inner">
        <button type="button" data-task-module-tab="management">Gestão</button>
        <button type="button" data-task-module-tab="execution">Tarefas</button>
      </div>
    `;

    if (!nav.dataset.handlerInstalled) {
      nav.dataset.handlerInstalled = '1';
      nav.addEventListener('click', (event) => {
        const button = event.target.closest('[data-task-module-tab]');
        if (!button) return;
        event.preventDefault();
        event.stopImmediatePropagation();

        if (button.dataset.taskModuleTab === 'management' && canManage()) {
          window.showPage?.('tarefas');
          queueMicrotask(syncSubnav);
          return;
        }
        openExecutionWorkspace();
      }, true);
    }

    return nav;
  }

  function normalizeManagementLobby() {
    const title = document.querySelector('#tarefas .page-title h1');
    const subtitle = document.querySelector('#tarefas .page-title p');
    if (title) title.textContent = 'Gestão de Tarefas';
    if (subtitle) subtitle.textContent = 'Crie, distribua e acompanhe os lotes operacionais.';

    document.querySelectorAll('#tasks-table-body .task-status').forEach((badge) => {
      const raw = badge.textContent.trim().toLowerCase();
      const labels = {
        pending: 'Pendente',
        in_progress: 'Em execução',
        completed: 'Concluído',
        inactive: 'Arquivado',
        cancelled: 'Cancelado',
      };
      const key = Object.keys(labels).find((item) => item === raw) || raw.replace(/\s+/g, '_');
      if (labels[key]) badge.textContent = labels[key];
      badge.classList.remove('status-pending', 'status-in-progress', 'status-completed', 'status-inactive', 'status-cancelled');
      if (key === 'in_progress') badge.classList.add('status-in-progress');
      else if (key === 'completed') badge.classList.add('status-completed');
      else if (key === 'inactive') badge.classList.add('status-inactive');
      else if (key === 'cancelled') badge.classList.add('status-cancelled');
      else badge.classList.add('status-pending');
    });
  }

  function syncSubnav() {
    const nav = ensureSubnav();
    const pageId = currentPageId();
    const inTasks = TASK_CONTEXT_PAGES.has(pageId);
    nav.hidden = !inTasks;
    document.body.classList.toggle('tasks-module-active', inTasks);
    if (!inTasks) return;

    const manager = canManage();
    const management = nav.querySelector('[data-task-module-tab="management"]');
    const execution = nav.querySelector('[data-task-module-tab="execution"]');

    management.hidden = !manager;
    management.classList.toggle('active', manager && pageId === 'tarefas');
    execution.classList.toggle('active', EXECUTION_PAGES.has(pageId));

    normalizeManagementLobby();

    if (!manager && pageId === 'tarefas') queueMicrotask(openExecutionWorkspace);
  }

  function installObservers() {
    document.querySelectorAll('main.content .page').forEach((page) => {
      new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.attributeName === 'class')) queueMicrotask(syncSubnav);
      }).observe(page, { attributes: true, attributeFilter: ['class'] });
    });

    const body = document.querySelector('#tasks-table-body');
    if (body) {
      new MutationObserver(() => {
        normalizeManagementLobby();
        if (!canManage() && currentPageId() === 'tarefas') queueMicrotask(openExecutionWorkspace);
      }).observe(body, { childList: true, subtree: true, characterData: true });
    }

    document.addEventListener('click', (event) => {
      const sidebar = event.target.closest('.nav-item[data-page="tarefas"]');
      if (!sidebar) return;
      queueMicrotask(() => {
        syncSubnav();
        if (!canManage()) openExecutionWorkspace();
      });
    });
  }

  window.addEventListener('mba:authenticated', (event) => {
    currentUser = event.detail || window.MBA_CURRENT_USER || currentUser;
    syncSubnav();
  });

  ensureSubnav();
  installObservers();
  normalizeManagementLobby();
  syncSubnav();
})();