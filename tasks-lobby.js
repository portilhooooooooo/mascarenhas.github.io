(() => {
  'use strict';

  const TASK_TYPE_LABELS = {
    comprovante_pagamento: 'Validar Pagamento',
    liminar: 'Validar Liminar',
    acordos: 'Saneamento de Acordos',
    encerramento: 'Validar Encerramento',
    bloqueio: 'Validar Bloqueio',
    citacao: 'Validar Citação',
    protocolo: 'Protocolar',
    contestacao: 'Validar Contestação',
    reagendamento: 'Validar Reagendamento',
  };
  const TASK_CONTEXT_PAGES = new Set(['tarefas', 'tarefa-analise', 'comprovante-execucao', 'acordo-execucao', 'protocolo']);
  const STORAGE_KEY = 'mba-tasks-submodule';

  let currentUser = window.MBA_CURRENT_USER || null;
  let tasks = [];
  let activeMode = sessionStorage.getItem(STORAGE_KEY) || 'management';
  let selectedType = 'all';
  let selectedStatus = 'pending';
  let searchTerm = '';
  let refreshToken = 0;

  const escapeHtml = (value) => {
    const el = document.createElement('span');
    el.textContent = value ?? '';
    return el.innerHTML;
  };

  const canManage = () => Boolean(
    currentUser?.is_master_admin
    || currentUser?.permissions?.['tasks.manage'] === true
    || currentUser?.permissions?.['tasks.assign'] === true
    || currentUser?.permissions?.['tasks.create'] === true
  );

  const taskTypeLabel = (type) => TASK_TYPE_LABELS[String(type || '').toLowerCase()] || 'Tarefa operacional';
  const pendingCount = (task) => Math.max(0, Number(task.total_processes || 0) - Number(task.completed_processes || 0));

  function taskState(task) {
    const pending = pendingCount(task);
    if (pending <= 0 || String(task.status || '').toLowerCase() === 'completed') return 'completed';
    if (task.deadline_at) {
      const deadline = new Date(task.deadline_at);
      if (!Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now()) return 'overdue';
    }
    return 'pending';
  }

  function assignedTasks() {
    if (canManage() || !currentUser?.id) return tasks;
    return tasks.filter((task) => {
      const participants = Array.isArray(task.participant_user_ids) ? task.participant_user_ids : [];
      const hasExplicitAssignment = Boolean(task.responsible_id) || participants.length > 0;
      if (!hasExplicitAssignment) return true;
      return task.responsible_id === currentUser.id || participants.includes(currentUser.id);
    });
  }

  function currentPageId() {
    return document.querySelector('main.content .page.active')?.id || '';
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

    if (!nav.dataset.unifiedHandler) {
      nav.dataset.unifiedHandler = '1';
      nav.addEventListener('click', (event) => {
        const button = event.target.closest('[data-task-module-tab]');
        if (!button) return;
        event.preventDefault();
        event.stopImmediatePropagation();
        setMode(button.dataset.taskModuleTab);
      }, true);
    }

    return nav;
  }

  function ensureViews() {
    const page = document.querySelector('#tarefas');
    if (!page) return null;

    let management = document.querySelector('#tasks-management-view');
    if (!management) {
      management = document.createElement('div');
      management.id = 'tasks-management-view';
      management.className = 'tasks-management-view';
      [...page.children].forEach((child) => management.appendChild(child));
      page.appendChild(management);
    }

    let execution = document.querySelector('#tasks-execution-view');
    if (!execution) {
      execution = document.createElement('section');
      execution.id = 'tasks-execution-view';
      execution.className = 'tasks-execution-view';
      execution.hidden = true;
      execution.innerHTML = `
        <div class="tasks-operational-heading">
          <div>
            <h1>Tarefas</h1>
            <p>Todas as tarefas atribuídas a você ficam concentradas neste workspace.</p>
          </div>
          <span class="tasks-operational-total" id="tasks-operational-total">—</span>
        </div>

        <div class="tasks-operational-layout">
          <aside class="panel tasks-operational-filters">
            <div class="tasks-filter-heading">
              <div><small>Fila pessoal</small><h2>Minhas tarefas</h2></div>
              <span id="tasks-filter-total">—</span>
            </div>

            <label class="tasks-operational-search">
              <i data-lucide="search"></i>
              <input id="tasks-operational-search" type="search" placeholder="Buscar tarefa">
            </label>

            <div class="tasks-type-filter" id="tasks-type-filter" aria-label="Filtrar por tipo de tarefa"></div>

            <div class="tasks-status-filter">
              <span>Status</span>
              <div class="tasks-status-options" role="group" aria-label="Status da fila">
                <button type="button" data-work-status="pending" class="active">Pendentes</button>
                <button type="button" data-work-status="completed">Concluídas</button>
                <button type="button" data-work-status="overdue">Em atraso</button>
              </div>
            </div>
          </aside>

          <section class="panel tasks-operational-queue">
            <header>
              <div><small>Fila de trabalho</small><h2 id="tasks-queue-title">Todas as tarefas</h2></div>
              <span id="tasks-queue-count">—</span>
            </header>
            <div class="tasks-queue-list" id="tasks-queue-list"></div>
          </section>
        </div>
      `;
      page.appendChild(execution);

      execution.querySelector('#tasks-operational-search')?.addEventListener('input', (event) => {
        searchTerm = event.target.value.trim().toLowerCase();
        renderOperationalWorkspace();
      });
      execution.querySelector('#tasks-type-filter')?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-work-type]');
        if (!button) return;
        selectedType = button.dataset.workType;
        renderOperationalWorkspace();
      });
      execution.querySelector('.tasks-status-options')?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-work-status]');
        if (!button) return;
        selectedStatus = button.dataset.workStatus;
        renderOperationalWorkspace();
      });
      execution.querySelector('#tasks-queue-list')?.addEventListener('click', (event) => {
        const item = event.target.closest('[data-open-operational-task]');
        if (!item) return;
        openOperationalTask(item.dataset.openOperationalTask);
      });
    }

    return { page, management, execution };
  }

  function normalizeManagementLobby() {
    const title = document.querySelector('#tasks-management-view .page-title h1');
    const subtitle = document.querySelector('#tasks-management-view .page-title p');
    if (title) title.textContent = 'Gestão de Tarefas';
    if (subtitle) subtitle.textContent = 'Crie, distribua e acompanhe os lotes operacionais.';

    document.querySelectorAll('#tasks-table-body .task-status').forEach((badge) => {
      const raw = badge.textContent.trim().toLowerCase();
      const labels = { pending: 'Pendente', in_progress: 'Em execução', completed: 'Concluído', inactive: 'Arquivado', cancelled: 'Cancelado' };
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

  function typeCounts(source) {
    const counts = new Map();
    source.forEach((task) => counts.set(task.type, (counts.get(task.type) || 0) + pendingCount(task)));
    return counts;
  }

  function filteredOperationalTasks() {
    return assignedTasks().filter((task) => {
      const typeMatch = selectedType === 'all' || task.type === selectedType;
      const statusMatch = taskState(task) === selectedStatus;
      const haystack = `${taskTypeLabel(task.type)} ${task.title || ''} ${task.description || ''}`.toLowerCase();
      const searchMatch = !searchTerm || haystack.includes(searchTerm);
      return typeMatch && statusMatch && searchMatch;
    });
  }

  function formatDeadline(value) {
    if (!value) return 'Sem prazo';
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return 'Sem prazo';
    return date.toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  function renderOperationalWorkspace() {
    const execution = document.querySelector('#tasks-execution-view');
    if (!execution) return;

    const source = assignedTasks();
    const counts = typeCounts(source);
    const types = [...new Set(source.map((task) => task.type).filter(Boolean))]
      .sort((a, b) => taskTypeLabel(a).localeCompare(taskTypeLabel(b), 'pt-BR'));

    if (selectedType !== 'all' && !types.includes(selectedType)) selectedType = 'all';

    const totalPending = source.reduce((sum, task) => sum + pendingCount(task), 0);
    const filter = execution.querySelector('#tasks-type-filter');
    filter.innerHTML = `
      <button type="button" data-work-type="all" class="${selectedType === 'all' ? 'active' : ''}">
        <span>Todas</span><em>${totalPending}</em>
      </button>
      ${types.map((type) => `
        <button type="button" data-work-type="${escapeHtml(type)}" class="${selectedType === type ? 'active' : ''}">
          <span>${escapeHtml(taskTypeLabel(type))}</span><em>${counts.get(type) || 0}</em>
        </button>
      `).join('')}
    `;

    execution.querySelectorAll('[data-work-status]').forEach((button) => {
      button.classList.toggle('active', button.dataset.workStatus === selectedStatus);
    });

    const visible = filteredOperationalTasks();
    const queue = execution.querySelector('#tasks-queue-list');
    queue.innerHTML = visible.length ? visible.map((task) => {
      const pending = pendingCount(task);
      const total = Math.max(0, Number(task.total_processes || 0));
      const completed = Math.max(0, Number(task.completed_processes || 0));
      const progress = total ? Math.min(100, Math.round((completed / total) * 100)) : 0;
      const state = taskState(task);
      const stateLabel = state === 'completed' ? 'Concluída' : state === 'overdue' ? 'Em atraso' : `${pending} pendente${pending === 1 ? '' : 's'}`;
      return `
        <button type="button" class="tasks-queue-item" data-open-operational-task="${escapeHtml(task.id)}">
          <span class="tasks-queue-icon"><i data-lucide="clipboard-check"></i></span>
          <span class="tasks-queue-copy">
            <small>${escapeHtml(taskTypeLabel(task.type))}</small>
            <strong>${escapeHtml(task.title || taskTypeLabel(task.type))}</strong>
            <span>${escapeHtml(task.description || 'Sem descrição')}</span>
          </span>
          <span class="tasks-queue-progress">
            <small>${completed} de ${total || completed}</small>
            <span><i style="width:${progress}%"></i></span>
          </span>
          <span class="tasks-queue-deadline">
            <small>Prazo</small>
            <strong>${escapeHtml(formatDeadline(task.deadline_at))}</strong>
          </span>
          <span class="tasks-queue-state ${state}">${escapeHtml(stateLabel)}</span>
          <i class="tasks-queue-chevron" data-lucide="chevron-right"></i>
        </button>
      `;
    }).join('') : `
      <div class="tasks-queue-empty">
        <i data-lucide="inbox"></i>
        <strong>Nenhuma tarefa neste filtro</strong>
        <span>Altere o tipo ou o status para consultar outra fila.</span>
      </div>
    `;

    const title = selectedType === 'all' ? 'Todas as tarefas' : taskTypeLabel(selectedType);
    execution.querySelector('#tasks-queue-title').textContent = title;
    execution.querySelector('#tasks-queue-count').textContent = `${visible.length} fila${visible.length === 1 ? '' : 's'}`;
    execution.querySelector('#tasks-operational-total').textContent = `${totalPending} pendentes`;
    execution.querySelector('#tasks-filter-total').textContent = String(source.length);
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  async function refreshOperationalTasks() {
    if (!window.MBA_API) return;
    const token = ++refreshToken;
    try {
      const response = await window.MBA_API.request('/api/tasks');
      if (token !== refreshToken) return;
      tasks = Array.isArray(response) ? response : [];
      renderOperationalWorkspace();
    } catch (_error) {
      const queue = document.querySelector('#tasks-queue-list');
      if (queue) queue.innerHTML = '<div class="tasks-queue-empty"><strong>Não foi possível carregar suas tarefas.</strong><span>Tente novamente em alguns instantes.</span></div>';
    }
  }

  function openOperationalTask(taskId) {
    const task = tasks.find((item) => String(item.id) === String(taskId));
    if (!task) return;

    if (String(task.type).toLowerCase() === 'protocolo') {
      window.showPage?.('protocolo');
      return;
    }

    const tbody = document.querySelector('#tasks-table-body');
    if (!tbody) return;
    const proxy = document.createElement('button');
    proxy.type = 'button';
    proxy.hidden = true;
    proxy.dataset.taskJson = encodeURIComponent(JSON.stringify(task));
    tbody.appendChild(proxy);
    proxy.click();
    proxy.remove();
  }

  function applyMode() {
    const views = ensureViews();
    const nav = ensureSubnav();
    if (!views || !nav) return;

    const manager = canManage();
    if (!manager) activeMode = 'execution';

    const managementTab = nav.querySelector('[data-task-module-tab="management"]');
    const executionTab = nav.querySelector('[data-task-module-tab="execution"]');
    managementTab.hidden = !manager;
    managementTab.classList.toggle('active', manager && activeMode === 'management');
    executionTab.classList.toggle('active', activeMode === 'execution');

    views.management.hidden = activeMode !== 'management';
    views.execution.hidden = activeMode !== 'execution';

    if (activeMode === 'execution') refreshOperationalTasks();
    normalizeManagementLobby();
  }

  function setMode(mode) {
    const target = mode === 'management' && canManage() ? 'management' : 'execution';
    activeMode = target;
    sessionStorage.setItem(STORAGE_KEY, target);

    if (currentPageId() !== 'tarefas') window.showPage?.('tarefas');
    queueMicrotask(applyMode);
  }

  function syncTaskContext() {
    const nav = ensureSubnav();
    const pageId = currentPageId();
    const inTasks = TASK_CONTEXT_PAGES.has(pageId);
    nav.hidden = !inTasks;
    if (!inTasks) return;

    if (pageId !== 'tarefas') {
      activeMode = 'execution';
      nav.querySelector('[data-task-module-tab="management"]')?.classList.remove('active');
      nav.querySelector('[data-task-module-tab="execution"]')?.classList.add('active');
      return;
    }

    applyMode();
  }

  function installObservers() {
    document.querySelectorAll('main.content .page').forEach((page) => {
      new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.attributeName === 'class')) queueMicrotask(syncTaskContext);
      }).observe(page, { attributes: true, attributeFilter: ['class'] });
    });

    const body = document.querySelector('#tasks-table-body');
    if (body) {
      new MutationObserver(() => {
        normalizeManagementLobby();
      }).observe(body, { childList: true, subtree: true, characterData: true });
    }

    document.addEventListener('click', (event) => {
      const sidebar = event.target.closest('.nav-item[data-page="tarefas"]');
      if (!sidebar) return;
      queueMicrotask(() => {
        if (!canManage()) activeMode = 'execution';
        syncTaskContext();
      });
    });
  }

  window.addEventListener('mba:authenticated', () => {
    currentUser = window.MBA_CURRENT_USER || currentUser;
    if (!canManage()) activeMode = 'execution';
    syncTaskContext();
    if (activeMode === 'execution') refreshOperationalTasks();
  });

  ensureViews();
  ensureSubnav();
  installObservers();
  normalizeManagementLobby();
  syncTaskContext();
})();
