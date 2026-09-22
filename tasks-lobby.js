(() => {
  'use strict';

  const CACHE_SIZE = 5;
  const REFRESH_MS = 20000;
  const LAST_TASK_TYPE_KEY = 'mba-last-task-type';

  const TASK_TYPE_LABELS = Object.freeze({
    comprovante_pagamento: 'Validação de Comprovante',
    liminar: 'Validação de Liminar',
    acordos: 'Saneamento de Acordos',
    encerramento: 'Validação de Encerramento',
    bloqueio: 'Validação de Bloqueio',
    citacao: 'Validação de Citação',
    protocolo: 'Protocolo',
    contestacao: 'Validação de Contestação',
    reagendamento: 'Validação de Reagendamento',
  });

  const STATUS_ORDER = ['urgent', 'overdue', 'pending', 'on_time'];
  const STATUS_META = Object.freeze({
    urgent: { label: 'Urgentes', singular: 'Urgente' },
    overdue: { label: 'Em atraso', singular: 'Em atraso' },
    pending: { label: 'Pendentes', singular: 'Pendente' },
    on_time: { label: 'Em dia', singular: 'Em dia' },
  });

  const TASK_CONTEXT_PAGES = new Set(['tarefas', 'tarefa-analise', 'comprovante-execucao', 'acordo-execucao', 'protocolo']);

  let currentUser = window.MBA_CURRENT_USER || null;
  let tasks = [];
  let workItems = [];
  let activeTask = null;
  let activeProcessId = null;
  let selectedStatus = 'urgent';
  let selectedType = 'all';
  let searchTerm = '';
  let refreshPromise = null;
  let refreshTimer = null;
  let initialized = false;

  window.MBA_TASK_TYPE_LABELS = TASK_TYPE_LABELS;

  const normalize = (value) => String(value || '').trim().toLowerCase();
  const taskTypeLabel = (type) => TASK_TYPE_LABELS[normalize(type)] || 'Tarefa operacional';
  const escapeHtml = (value) => {
    const node = document.createElement('span');
    node.textContent = value ?? '';
    return node.innerHTML;
  };

  function currentPageId() {
    return document.querySelector('main.content .page.active')?.id || '';
  }

  function canManage() {
    return Boolean(
      currentUser?.is_master_admin
      || currentUser?.permissions?.['tasks.manage'] === true
      || currentUser?.permissions?.['tasks.assign'] === true
      || currentUser?.permissions?.['tasks.create'] === true
    );
  }

  function assignedTasks() {
    if (canManage() || !currentUser?.id) return tasks;
    return tasks.filter((task) => {
      const participants = Array.isArray(task.participant_user_ids) ? task.participant_user_ids : [];
      const explicitlyAssigned = Boolean(task.responsible_id) || participants.length > 0;
      if (!explicitlyAssigned) return true;
      return task.responsible_id === currentUser.id || participants.includes(currentUser.id);
    });
  }

  function localDay(value) {
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // O backend ainda não expõe um campo canônico único para estes quatro estados.
  // Esta é a regra de apresentação da branch até a taxonomia ser persistida:
  // prioridade alta ou prazo hoje = Urgente; prazo vencido = Em atraso;
  // tarefa aguardando/sem prazo = Pendente; demais tarefas ativas = Em dia.
  function deadlineState(task) {
    const priority = normalize(task?.priority);
    const status = normalize(task?.status);
    const deadline = localDay(task?.deadline_at);
    const today = localDay(new Date());

    if (['high', 'urgent', 'critical'].includes(priority)) return 'urgent';
    if (deadline && deadline.getTime() < today.getTime()) return 'overdue';
    if (deadline && deadline.getTime() === today.getTime()) return 'urgent';
    if (!deadline || ['pending', 'waiting', 'queued', 'created'].includes(status)) return 'pending';
    return 'on_time';
  }

  function stateRank(task) {
    return STATUS_ORDER.indexOf(deadlineState(task));
  }

  function formatDate(value) {
    if (!value) return 'Não informado';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Não informado' : date.toLocaleDateString('pt-BR');
  }

  function indicationLabel(task, process) {
    const direct = process?.indicio || process?.indication || process?.indication_label || process?.reason || process?.reason_label;
    if (direct) return String(direct);

    const initial = normalize(process?.initial_status);
    const paymentInitial = {
      incerto: 'Pagamento com situação incerta',
      liquidado: 'Pagamento identificado como liquidado',
      pagamento_recusado: 'Pagamento recusado',
    };
    if (paymentInitial[initial]) return paymentInitial[initial];
    if (normalize(task?.type) === 'liminar') return 'Pedido de tutela/liminar';
    return 'Não informado';
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

  function taskButton(taskId) {
    return taskButtons().find((button) => String(parseTaskButton(button)?.id) === String(taskId)) || null;
  }

  function normalizeManagementLobby() {
    const title = document.querySelector('#tarefas .page-title h1');
    const subtitle = document.querySelector('#tarefas .page-title p');
    if (title) title.textContent = 'Gestão de Tarefas';
    if (subtitle) subtitle.textContent = 'Crie, distribua e acompanhe as tarefas operacionais.';
  }

  function rebuildSubnav() {
    // payment-receipt.js antigo também cria uma subnav. Após autenticar, removemos
    // esse nó e tornamos este módulo o único dono da navegação Gestão/Tarefas.
    document.querySelector('#tasks-module-nav')?.remove();

    const mainArea = document.querySelector('.main-area');
    const content = document.querySelector('main.content');
    if (!mainArea || !content) return null;

    const nav = document.createElement('nav');
    nav.id = 'tasks-module-nav';
    nav.className = 'tasks-module-nav';
    nav.hidden = true;
    nav.setAttribute('aria-label', 'Navegação do módulo de tarefas');
    nav.innerHTML = `
      <div class="tasks-module-nav-inner">
        <button type="button" data-task-module-tab="management">Gestão</button>
        <button type="button" data-task-module-tab="execution">Tarefas</button>
      </div>
    `;
    mainArea.insertBefore(nav, content);

    nav.addEventListener('click', (event) => {
      const button = event.target.closest('[data-task-module-tab]');
      if (!button) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      if (button.dataset.taskModuleTab === 'management') {
        if (!canManage()) return;
        window.showPage?.('tarefas');
        queueMicrotask(syncTaskContext);
        return;
      }
      openDefaultWorkItem().catch(() => {});
    }, true);

    return nav;
  }

  function ensureSubnav() {
    return document.querySelector('#tasks-module-nav') || rebuildSubnav();
  }

  function syncSubnav() {
    const nav = ensureSubnav();
    if (!nav) return;
    const pageId = currentPageId();
    const inTaskContext = TASK_CONTEXT_PAGES.has(pageId);
    nav.hidden = !inTaskContext;
    if (!inTaskContext) return;

    const management = nav.querySelector('[data-task-module-tab="management"]');
    const execution = nav.querySelector('[data-task-module-tab="execution"]');
    management.hidden = !canManage();
    management.classList.toggle('active', canManage() && pageId === 'tarefas');
    execution.classList.toggle('active', pageId !== 'tarefas' || !canManage());
  }

  function normalizeExecutionHeader() {
    const pageId = currentPageId();
    if (!activeTask || !['tarefa-analise', 'comprovante-execucao'].includes(pageId)) return;

    const label = taskTypeLabel(activeTask.type);
    const state = deadlineState(activeTask);
    const stateLabel = STATUS_META[state].singular;

    document.querySelectorAll('#tarefa-analise .back-link, #comprovante-execucao .back-link')
      .forEach((node) => { node.hidden = true; });

    if (pageId === 'tarefa-analise') {
      const title = document.querySelector('#tarefa-analise .detail-heading h1');
      const subtitle = document.querySelector('#tarefa-analise .detail-heading p');
      if (title) title.textContent = label;
      if (subtitle) subtitle.textContent = 'Analise o processo selecionado e registre o resultado.';

      const cells = [...(document.querySelector('#tarefa-analise .task-meta')?.children || [])];
      if (cells[1]) {
        const strong = cells[1].querySelector('strong');
        if (strong) strong.innerHTML = `<i class="status-dot"></i>${escapeHtml(stateLabel)}`;
        cells[1].dataset.deadlineState = state;
      }
      if (cells[2]) cells[2].querySelector('strong').textContent = formatDate(activeTask.deadline_at);
      if (cells[3]) cells[3].hidden = true;
    }

    if (pageId === 'comprovante-execucao') {
      const title = document.querySelector('#payment-task-type-title') || document.querySelector('#comprovante-execucao .payment-receipt-heading h1');
      if (title) title.textContent = label;
      const context = document.querySelector('#payment-task-context');
      if (context) context.hidden = true;

      const health = document.querySelector('#payment-task-health');
      if (health) {
        health.className = `payment-task-health ${state}`;
        health.innerHTML = `<i class="status-dot"></i><span>${escapeHtml(stateLabel)}</span>`;
      }
      const deadline = document.querySelector('#payment-task-deadline');
      if (deadline) deadline.textContent = formatDate(activeTask.deadline_at);
      document.querySelector('#payment-task-assignee')?.closest('div')?.setAttribute('hidden', '');
      document.querySelector('#payment-receipt-folder')?.closest('p')?.setAttribute('hidden', '');
    }

    updateIndicationInExecution();
  }

  function updateIndicationInExecution() {
    const item = workItems.find(({ task, process }) =>
      String(task.id) === String(activeTask?.id) && String(process.id) === String(activeProcessId));
    if (!item) return;

    let header = null;
    if (currentPageId() === 'tarefa-analise') header = document.querySelector('#tarefa-analise .analysis-card > header');
    if (currentPageId() === 'comprovante-execucao') header = document.querySelector('#comprovante-execucao .payment-receipt-card > header');
    if (!header) return;

    let indication = header.querySelector('.workspace-indication');
    if (!indication) {
      indication = document.createElement('p');
      indication.className = 'workspace-indication';
      header.appendChild(indication);
    }
    indication.textContent = `Indício: ${indicationLabel(item.task, item.process)}`;
  }

  function ensureWorkspaceSidebar() {
    const pageId = currentPageId();
    if (!['tarefa-analise', 'comprovante-execucao'].includes(pageId)) return null;

    const page = document.getElementById(pageId);
    const layout = page?.querySelector('.analysis-layout');
    const native = layout?.querySelector(':scope > .process-list:not(.tasks-workspace-sidebar)');
    if (!layout || !native) return null;

    native.classList.add('tasks-native-process-list');
    let sidebar = layout.querySelector(':scope > .tasks-workspace-sidebar');
    if (sidebar) return sidebar;

    sidebar = document.createElement('aside');
    sidebar.className = 'panel process-list tasks-workspace-sidebar';
    sidebar.innerHTML = `
      <section class="tasks-filter-block">
        <small>STATUS DO PRAZO</small>
        <div class="tasks-deadline-filters"></div>
      </section>
      <section class="tasks-filter-block">
        <small>TIPO DE TAREFA</small>
        <div class="tasks-type-filters"></div>
      </section>
      <section class="tasks-process-block">
        <div class="tasks-process-block-head">
          <strong>PROCESSOS</strong>
          <small>${CACHE_SIZE} em cache · atualização em segundo plano</small>
        </div>
        <label class="process-search"><i data-lucide="search"></i><input class="tasks-workspace-search" type="search" placeholder="Buscar processo ou parte"></label>
        <div class="tasks-workspace-items"></div>
      </section>
    `;
    layout.insertBefore(sidebar, native);

    sidebar.querySelector('.tasks-deadline-filters')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-deadline-filter]');
      if (!button) return;
      selectedStatus = button.dataset.deadlineFilter;
      renderWorkspaceSidebar();
      openFirstFilteredItem();
    });
    sidebar.querySelector('.tasks-type-filters')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-type-filter]');
      if (!button) return;
      selectedType = button.dataset.typeFilter;
      renderWorkspaceSidebar();
      openFirstFilteredItem();
    });
    sidebar.querySelector('.tasks-workspace-search')?.addEventListener('input', (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      renderWorkspaceSidebar();
    });
    sidebar.querySelector('.tasks-workspace-items')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-task-id][data-process-id]');
      if (!button) return;
      const item = workItems.find(({ task, process }) =>
        String(task.id) === button.dataset.taskId && String(process.id) === button.dataset.processId);
      if (item) openWorkItem(item.task, item.process);
    });

    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
    return sidebar;
  }

  function sortedWorkItems() {
    return [...workItems]
      .filter(({ process }) => normalize(process?.status) !== 'completed')
      .sort((a, b) => {
        const rank = stateRank(a.task) - stateRank(b.task);
        if (rank !== 0) return rank;
        const ad = new Date(a.task?.deadline_at || '9999-12-31').getTime();
        const bd = new Date(b.task?.deadline_at || '9999-12-31').getTime();
        if (ad !== bd) return ad - bd;
        return String(a.process?.case_number || '').localeCompare(String(b.process?.case_number || ''));
      });
  }

  function filteredWorkItems() {
    return sortedWorkItems().filter(({ task, process }) => {
      if (deadlineState(task) !== selectedStatus) return false;
      if (selectedType !== 'all' && normalize(task.type) !== selectedType) return false;
      if (!searchTerm) return true;
      const haystack = `${process.case_number || ''} ${process.party_name || ''} ${process.folder || ''} ${taskTypeLabel(task.type)} ${indicationLabel(task, process)}`.toLowerCase();
      return haystack.includes(searchTerm);
    });
  }

  function statusCounts() {
    const counts = Object.fromEntries(STATUS_ORDER.map((key) => [key, 0]));
    workItems.forEach(({ task, process }) => {
      if (normalize(process?.status) === 'completed') return;
      counts[deadlineState(task)] += 1;
    });
    return counts;
  }

  function typeCounts() {
    const counts = new Map();
    workItems.forEach(({ task, process }) => {
      if (normalize(process?.status) === 'completed') return;
      if (deadlineState(task) !== selectedStatus) return;
      const type = normalize(task.type);
      counts.set(type, (counts.get(type) || 0) + 1);
    });
    return counts;
  }

  function ensureNonEmptyStatus() {
    const counts = statusCounts();
    if (counts[selectedStatus] > 0) return;
    const fallback = STATUS_ORDER.find((key) => counts[key] > 0);
    if (fallback) selectedStatus = fallback;
  }

  function renderWorkspaceSidebar() {
    const sidebar = ensureWorkspaceSidebar();
    if (!sidebar) return;
    ensureNonEmptyStatus();

    const counts = statusCounts();
    sidebar.querySelector('.tasks-deadline-filters').innerHTML = STATUS_ORDER.map((key) => `
      <button type="button" data-deadline-filter="${key}" class="${selectedStatus === key ? 'active' : ''}">
        <span><i class="deadline-dot ${key}"></i>${STATUS_META[key].label}</span><em>${counts[key]}</em>
      </button>
    `).join('');

    const countsByType = typeCounts();
    const types = [...new Set(workItems.map(({ task }) => normalize(task.type)).filter(Boolean))]
      .sort((a, b) => taskTypeLabel(a).localeCompare(taskTypeLabel(b), 'pt-BR'));
    const total = [...countsByType.values()].reduce((sum, value) => sum + value, 0);
    sidebar.querySelector('.tasks-type-filters').innerHTML = `
      <button type="button" data-type-filter="all" class="${selectedType === 'all' ? 'active' : ''}"><span>Todas</span><em>${total}</em></button>
      ${types.map((type) => `<button type="button" data-type-filter="${escapeHtml(type)}" class="${selectedType === type ? 'active' : ''}"><span>${escapeHtml(taskTypeLabel(type))}</span><em>${countsByType.get(type) || 0}</em></button>`).join('')}
    `;

    const visible = filteredWorkItems().slice(0, CACHE_SIZE);
    sidebar.querySelector('.tasks-workspace-items').innerHTML = visible.length ? visible.map(({ task, process }) => {
      const state = deadlineState(task);
      return `
        <button type="button" class="process-item tasks-workspace-item ${String(process.id) === String(activeProcessId) ? 'selected' : ''}" data-task-id="${escapeHtml(task.id)}" data-process-id="${escapeHtml(process.id)}">
          <span><i data-lucide="clipboard-check"></i></span>
          <div><strong>${escapeHtml(process.case_number || 'Processo sem número')}</strong><small>${escapeHtml(taskTypeLabel(task.type))}</small><small>Indício: ${escapeHtml(indicationLabel(task, process))}</small></div>
          <em class="deadline-badge ${state}">${escapeHtml(STATUS_META[state].singular)}</em>
        </button>
      `;
    }).join('') : '<div class="process-list-empty">Nenhuma tarefa encontrada para este filtro.</div>';

    const search = sidebar.querySelector('.tasks-workspace-search');
    if (search && search.value !== searchTerm) search.value = searchTerm;
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function openTaskProxy(task) {
    if (normalize(task?.type) === 'protocolo') {
      window.showPage?.('protocolo');
      return;
    }
    const button = taskButton(task.id);
    if (button) return button.click();
    const body = document.querySelector('#tasks-table-body');
    if (!body) return;
    const proxy = document.createElement('button');
    proxy.type = 'button';
    proxy.hidden = true;
    proxy.dataset.taskJson = encodeURIComponent(JSON.stringify(task));
    body.appendChild(proxy);
    proxy.click();
    proxy.remove();
  }

  function selectNativeProcess(task, process) {
    const processId = String(process?.id || '');
    const caseNumber = String(process?.case_number || '');
    let attempts = 0;

    const trySelect = () => {
      attempts += 1;
      const pageId = currentPageId();
      if (normalize(task.type) === 'comprovante_pagamento' && pageId === 'comprovante-execucao') {
        const search = document.querySelector('#payment-process-search');
        if (search && search.value !== caseNumber) {
          search.value = caseNumber;
          search.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const button = document.querySelector(`#payment-process-items [data-payment-process-id="${CSS.escape(processId)}"]`);
        if (button) {
          button.click();
          activeProcessId = process.id;
          normalizeExecutionHeader();
          renderWorkspaceSidebar();
          return;
        }
      }

      if (pageId === 'tarefa-analise') {
        const search = document.querySelector('#task-process-search');
        if (search && search.value !== caseNumber) {
          search.value = caseNumber;
          search.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const button = [...document.querySelectorAll('#process-items [data-process-json]')].find((candidate) => {
          try { return String(JSON.parse(decodeURIComponent(candidate.dataset.processJson)).id) === processId; }
          catch (_error) { return false; }
        });
        if (button) {
          button.click();
          activeProcessId = process.id;
          normalizeExecutionHeader();
          renderWorkspaceSidebar();
          return;
        }
      }
      if (attempts < 30) setTimeout(trySelect, 70);
    };
    setTimeout(trySelect, 40);
  }

  function openWorkItem(task, process) {
    if (!task || !process) return;
    activeTask = task;
    activeProcessId = process.id;
    sessionStorage.setItem(LAST_TASK_TYPE_KEY, normalize(task.type));
    openTaskProxy(task);
    selectNativeProcess(task, process);
    setTimeout(() => {
      ensureWorkspaceSidebar();
      normalizeExecutionHeader();
      renderWorkspaceSidebar();
      syncSubnav();
    }, 100);
  }

  function openFirstFilteredItem() {
    const first = filteredWorkItems()[0];
    if (first) openWorkItem(first.task, first.process);
  }

  async function openDefaultWorkItem() {
    await refreshUnifiedData();
    ensureNonEmptyStatus();
    const preferredType = normalize(sessionStorage.getItem(LAST_TASK_TYPE_KEY));
    if (preferredType && workItems.some(({ task }) => normalize(task.type) === preferredType)) selectedType = preferredType;
    const first = filteredWorkItems()[0] || sortedWorkItems()[0];
    if (first) openWorkItem(first.task, first.process);
    else if (canManage()) window.showPage?.('tarefas');
  }

  function advanceToNextCachedItem() {
    const filtered = filteredWorkItems();
    const index = filtered.findIndex(({ task, process }) =>
      String(task.id) === String(activeTask?.id) && String(process.id) === String(activeProcessId));
    const next = filtered[index >= 0 ? index + 1 : 0] || filtered[0];
    if (next && String(next.process.id) !== String(activeProcessId)) openWorkItem(next.task, next.process);
  }

  async function refreshUnifiedData(force = false) {
    if (!window.MBA_API) return;
    if (refreshPromise && !force) return refreshPromise;

    refreshPromise = (async () => {
      const response = await window.MBA_API.request('/api/tasks');
      tasks = Array.isArray(response) ? response : [];
      const processGroups = await Promise.all(assignedTasks().map(async (task) => {
        try {
          const rows = await window.MBA_API.request(`/api/tasks/${task.id}/processes`);
          return (Array.isArray(rows) ? rows : []).map((process) => ({ task, process }));
        } catch (_error) { return []; }
      }));
      workItems = processGroups.flat();
      ensureNonEmptyStatus();
      renderWorkspaceSidebar();
      normalizeExecutionHeader();
    })().finally(() => { refreshPromise = null; });

    return refreshPromise;
  }

  function installInstantActions() {
    document.addEventListener('submit', (event) => {
      if (event.target?.id !== 'payment-receipt-form') return;
      queueMicrotask(() => {
        const error = document.querySelector('#payment-receipt-error');
        if (error && !error.hidden) return;
        advanceToNextCachedItem();
        setTimeout(() => refreshUnifiedData(true).catch(() => {}), 700);
      });
    });

    document.addEventListener('click', (event) => {
      if (event.target.closest('#payment-receipt-skip')) {
        queueMicrotask(() => {
          advanceToNextCachedItem();
          setTimeout(() => refreshUnifiedData(true).catch(() => {}), 700);
        });
        return;
      }

      const save = event.target.closest('#save-next');
      if (save && currentPageId() === 'tarefa-analise') {
        const selected = document.querySelector('input[name="decision"]:checked');
        const isError = document.querySelector('.analysis-error-button')?.dataset.selected === 'true';
        const notes = document.querySelector('#task-notes')?.value.trim() || '';
        if (!selected && !isError) return;
        if (isError && !notes) return;
        queueMicrotask(() => {
          advanceToNextCachedItem();
          setTimeout(() => refreshUnifiedData(true).catch(() => {}), 700);
        });
        return;
      }

      const skip = event.target.closest('#tarefa-analise .analysis-card footer .secondary-button');
      if (skip && activeProcessId) {
        event.preventDefault();
        event.stopImmediatePropagation();
        const processId = activeProcessId;
        advanceToNextCachedItem();
        window.MBA_API.request(`/api/task-processes/${processId}/skip`, { method: 'POST', body: '{}' })
          .then(() => refreshUnifiedData(true))
          .catch(() => {});
      }
    });
  }

  function syncTaskContext() {
    normalizeManagementLobby();
    syncSubnav();
    const pageId = currentPageId();
    if (['tarefa-analise', 'comprovante-execucao'].includes(pageId)) {
      ensureWorkspaceSidebar();
      normalizeExecutionHeader();
      renderWorkspaceSidebar();
    }
    if (pageId === 'tarefas' && !canManage()) openDefaultWorkItem().catch(() => {});
  }

  function installObservers() {
    document.querySelectorAll('main.content .page').forEach((page) => {
      new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.attributeName === 'class')) queueMicrotask(syncTaskContext);
      }).observe(page, { attributes: true, attributeFilter: ['class'] });
    });

    document.addEventListener('click', (event) => {
      const moduleButton = event.target.closest('.nav-item[data-page="tarefas"]');
      if (!moduleButton || canManage()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openDefaultWorkItem().catch(() => {});
    }, true);
  }

  function startBackgroundRefresh() {
    clearInterval(refreshTimer);
    refreshTimer = setInterval(() => {
      if (!TASK_CONTEXT_PAGES.has(currentPageId())) return;
      refreshUnifiedData(true).catch(() => {});
    }, REFRESH_MS);
  }

  async function initializeWorkspace(user) {
    currentUser = user || window.MBA_CURRENT_USER || currentUser;
    if (!currentUser || initialized) return;
    initialized = true;
    rebuildSubnav();
    normalizeManagementLobby();
    installObservers();
    installInstantActions();
    startBackgroundRefresh();
    await refreshUnifiedData(true).catch(() => {});
    syncTaskContext();
  }

  window.addEventListener('mba:authenticated', (event) => {
    initializeWorkspace(window.MBA_CURRENT_USER || event.detail).catch(() => {});
  });

  if (window.MBA_CURRENT_USER) initializeWorkspace(window.MBA_CURRENT_USER).catch(() => {});
})();