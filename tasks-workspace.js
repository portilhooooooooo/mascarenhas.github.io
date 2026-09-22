(() => {
  'use strict';

  const CACHE_SIZE = 5;
  const REFRESH_MS = 20000;
  const TASK_PAGES = ['tarefas', 'tarefa-analise', 'comprovante-execucao', 'acordo-execucao'];
  const EXECUTION_PAGES = ['tarefa-analise', 'comprovante-execucao', 'acordo-execucao'];
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

  const normalize = value => String(value || '').trim().toLowerCase();
  const taskTypeLabel = type => TASK_TYPE_LABELS[normalize(type)] || 'Tarefa operacional';
  const escapeHtml = value => {
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
    const active = tasks.filter(task => !['completed', 'cancelled', 'inactive'].includes(normalize(task.status)));
    if (canManage() || !currentUser?.id) return active;
    return active.filter(task => {
      const participants = Array.isArray(task.participant_user_ids) ? task.participant_user_ids : [];
      const explicit = Boolean(task.responsible_id) || participants.length > 0;
      if (!explicit) return true;
      return String(task.responsible_id || '') === String(currentUser.id)
        || participants.some(id => String(id) === String(currentUser.id));
    });
  }

  function localDay(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(0, 0, 0, 0);
    return date;
  }

  // Urgência é uma decisão explícita da atribuição (priority=high), nunca inferida pela hora.
  function workState(task) {
    const priority = normalize(task?.priority);
    const status = normalize(task?.status);
    const deadline = localDay(task?.deadline_at);
    const today = localDay(new Date());

    if (priority === 'high') return 'urgent';
    if (deadline && today && deadline.getTime() < today.getTime()) return 'overdue';
    if (!deadline || ['pending', 'waiting', 'queued', 'created'].includes(status)) return 'pending';
    return 'on_time';
  }

  function stateRank(task) {
    const index = STATUS_ORDER.indexOf(workState(task));
    return index >= 0 ? index : STATUS_ORDER.length;
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
    if (normalize(task?.type) === 'acordos') return 'Saneamento para acordo';
    return 'Não informado';
  }

  function processPosition(process) {
    const value = Number(process?.position);
    return Number.isFinite(value) && value >= 0 ? value : Number.MAX_SAFE_INTEGER;
  }

  function sortedWorkItems() {
    return [...workItems]
      .filter(({ process }) => normalize(process?.status) !== 'completed')
      .sort((a, b) => {
        const rank = stateRank(a.task) - stateRank(b.task);
        if (rank !== 0) return rank;

        const position = processPosition(a.process) - processPosition(b.process);
        if (position !== 0) return position;

        const ad = new Date(a.task?.deadline_at || '9999-12-31').getTime();
        const bd = new Date(b.task?.deadline_at || '9999-12-31').getTime();
        if (ad !== bd) return ad - bd;

        const ac = new Date(a.process?.created_at || '9999-12-31').getTime();
        const bc = new Date(b.process?.created_at || '9999-12-31').getTime();
        if (ac !== bc) return ac - bc;

        return String(a.process?.case_number || '').localeCompare(String(b.process?.case_number || ''));
      });
  }

  function filteredWorkItems() {
    return sortedWorkItems().filter(({ task, process }) => {
      if (workState(task) !== selectedStatus) return false;
      if (selectedType !== 'all' && normalize(task.type) !== selectedType) return false;
      if (!searchTerm) return true;

      const haystack = [
        process.case_number,
        process.party_name,
        taskTypeLabel(task.type),
        indicationLabel(task, process),
      ].filter(Boolean).join(' ').toLowerCase();
      return haystack.includes(searchTerm);
    });
  }

  function statusCounts() {
    const counts = Object.fromEntries(STATUS_ORDER.map(key => [key, 0]));
    workItems.forEach(({ task, process }) => {
      if (normalize(process?.status) !== 'completed') counts[workState(task)] += 1;
    });
    return counts;
  }

  function ensureNonEmptyStatus() {
    const counts = statusCounts();
    if (counts[selectedStatus] > 0) return;
    const fallback = STATUS_ORDER.find(key => counts[key] > 0);
    if (fallback) selectedStatus = fallback;
  }

  function typeCounts() {
    const counts = new Map();
    workItems.forEach(({ task, process }) => {
      if (normalize(process?.status) === 'completed' || workState(task) !== selectedStatus) return;
      const type = normalize(task.type);
      counts.set(type, (counts.get(type) || 0) + 1);
    });
    return counts;
  }

  function normalizeManagementLobby() {
    const title = document.querySelector('#tarefas .page-title h1');
    const subtitle = document.querySelector('#tarefas .page-title p');
    if (title) title.textContent = 'Gestão de Tarefas';
    if (subtitle) subtitle.textContent = 'Crie, distribua e acompanhe as tarefas operacionais.';
  }

  function syncGlobalNav() {
    if (!TASK_PAGES.includes(currentPageId())) return;
    document.querySelectorAll('.main-nav .nav-item').forEach(item => item.classList.remove('active'));
    document.querySelector('.main-nav .nav-item[data-page="tarefas"]')?.classList.add('active');
  }

  function ensureTaskSubnav(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return null;

    let nav = page.querySelector(':scope > .tasks-module-subnav');
    if (!nav) {
      page.querySelector(':scope > .tasks-local-nav')?.remove();
      nav = document.createElement('nav');
      nav.className = 'analytics-subnav tasks-module-subnav';
      nav.setAttribute('aria-label', 'Navegação do módulo de tarefas');
      nav.innerHTML = '<button type="button" data-task-tab="management">Gestão</button><button type="button" data-task-tab="execution">Tarefas</button>';
      page.prepend(nav);

      nav.addEventListener('click', event => {
        const button = event.target.closest('[data-task-tab]');
        if (!button) return;
        if (button.dataset.taskTab === 'management') {
          if (!canManage()) return;
          window.showPage?.('tarefas');
          queueMicrotask(syncTaskContext);
          return;
        }
        openDefaultWorkItem().catch(() => {});
      });
    }

    const management = nav.querySelector('[data-task-tab="management"]');
    const execution = nav.querySelector('[data-task-tab="execution"]');
    const managementPage = pageId === 'tarefas';
    if (management) {
      management.hidden = !canManage();
      management.classList.toggle('active', canManage() && managementPage);
    }
    execution?.classList.toggle('active', !managementPage || !canManage());
    return nav;
  }

  function syncTaskSubnav() {
    document.querySelector('.main-area > #tasks-module-nav, .main-area > .tasks-module-nav')?.remove();
    TASK_PAGES.forEach(ensureTaskSubnav);
  }

  function installAssignmentPriority() {
    if (!canManage()) return;
    const form = document.querySelector('#task-assign-form');
    const taskSelect = document.querySelector('#task-assign-task');
    if (!form || !taskSelect) return;

    let field = form.querySelector('.task-assignment-priority');
    if (!field) {
      field = document.createElement('label');
      field.className = 'task-assignment-priority';
      field.innerHTML = `Prioridade da atribuição<select name="assignment_priority" required><option value="high">Alta — Urgente</option><option value="medium">Média</option><option value="low">Baixa</option></select><small>Urgente é definido pela atribuição; o prazo não eleva a tarefa automaticamente.</small>`;
      taskSelect.closest('label')?.insertAdjacentElement('afterend', field);
    }

    const prioritySelect = field.querySelector('select[name="assignment_priority"]');
    const syncPriority = () => {
      const task = tasks.find(item => String(item.id) === String(taskSelect.value));
      if (prioritySelect) prioritySelect.value = ['low', 'medium', 'high'].includes(task?.priority) ? task.priority : 'medium';
    };
    taskSelect.addEventListener('change', syncPriority);
    syncPriority();

    if (form.dataset.workspacePriorityHandler === '1') return;
    form.dataset.workspacePriorityHandler = '1';
    form.addEventListener('submit', async event => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const submit = form.querySelector('[type="submit"]');
      const errorBox = document.querySelector('#task-assign-error');
      const participantUserIds = new FormData(form).getAll('participant_user_ids').filter(Boolean);
      const taskId = form.elements.task_id?.value;
      const priority = form.elements.assignment_priority?.value || 'medium';

      if (!taskId || !participantUserIds.length) {
        if (errorBox) {
          errorBox.textContent = !taskId ? 'Selecione uma tarefa.' : 'Selecione ao menos um usuário ativo.';
          errorBox.hidden = false;
        }
        return;
      }

      if (submit) submit.disabled = true;
      if (errorBox) errorBox.hidden = true;
      try {
        await window.MBA_API.request(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          body: JSON.stringify({ participant_user_ids: participantUserIds, priority }),
        });
        document.querySelector('#task-assign-dialog')?.close();
        await window.loadTasks?.();
        await refreshData(true);
      } catch (error) {
        if (errorBox) {
          errorBox.textContent = error.message || 'Não foi possível salvar a atribuição.';
          errorBox.hidden = false;
        }
      } finally {
        if (submit) submit.disabled = false;
      }
    }, true);
  }

  function ensureAgreementLayout() {
    const page = document.getElementById('acordo-execucao');
    if (!page) return null;
    let layout = page.querySelector(':scope > .tasks-agreement-workspace');
    if (layout) return layout;

    const card = page.querySelector('#agreement-process-card');
    const finished = page.querySelector('#agreement-task-finished');
    if (!card) return null;

    layout = document.createElement('div');
    layout.className = 'tasks-agreement-workspace';
    const renderer = document.createElement('div');
    renderer.className = 'tasks-workspace-renderer';
    card.before(layout);
    layout.appendChild(renderer);
    renderer.appendChild(card);
    if (finished) renderer.appendChild(finished);
    return layout;
  }

  function executionLayout(pageId) {
    if (pageId === 'tarefa-analise') return document.querySelector('#tarefa-analise .analysis-layout');
    if (pageId === 'comprovante-execucao') return document.querySelector('#comprovante-execucao .payment-analysis-layout');
    if (pageId === 'acordo-execucao') return ensureAgreementLayout();
    return null;
  }

  function ensureWorkspaceSummary(pageId) {
    const page = document.getElementById(pageId);
    const layout = executionLayout(pageId);
    if (!page || !layout) return null;

    let summary = page.querySelector(':scope > .tasks-workspace-summary');
    if (!summary) {
      summary = document.createElement('section');
      summary.className = 'panel tasks-workspace-summary';
      summary.innerHTML = `
        <div><small>Progresso</small><strong data-workspace-progress>—</strong></div>
        <div><small>Status</small><strong data-workspace-status>—</strong></div>
        <div><small>Prazo</small><strong data-workspace-deadline>—</strong></div>
      `;
      layout.before(summary);
    }
    return summary;
  }

  function buildSidebar() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'panel process-list tasks-workspace-sidebar';
    sidebar.innerHTML = `
      <section class="tasks-filter-block"><small>STATUS DO PRAZO</small><div class="tasks-deadline-filters"></div></section>
      <section class="tasks-filter-block"><small>TIPO DE TAREFA</small><div class="tasks-type-filters"></div></section>
      <section class="tasks-process-block">
        <div class="tasks-process-block-head"><strong>PROCESSOS</strong><small>${CACHE_SIZE} pré-carregados</small></div>
        <label class="process-search"><i data-lucide="search"></i><input class="tasks-workspace-search" type="search" placeholder="Buscar processo ou parte"></label>
        <div class="tasks-workspace-items"></div>
      </section>
    `;

    sidebar.querySelector('.tasks-deadline-filters')?.addEventListener('click', event => {
      const button = event.target.closest('[data-deadline-filter]');
      if (!button) return;
      selectedStatus = button.dataset.deadlineFilter;
      activeProcessId = null;
      renderSidebar();
      openFirstFilteredItem();
    });
    sidebar.querySelector('.tasks-type-filters')?.addEventListener('click', event => {
      const button = event.target.closest('[data-type-filter]');
      if (!button) return;
      selectedType = button.dataset.typeFilter;
      activeProcessId = null;
      renderSidebar();
      openFirstFilteredItem();
    });
    sidebar.querySelector('.tasks-workspace-search')?.addEventListener('input', event => {
      searchTerm = event.target.value.trim().toLowerCase();
      renderSidebar();
    });
    sidebar.querySelector('.tasks-workspace-items')?.addEventListener('click', event => {
      const button = event.target.closest('[data-task-id][data-process-id]');
      if (!button) return;
      const item = workItems.find(({ task, process }) => String(task.id) === button.dataset.taskId && String(process.id) === button.dataset.processId);
      if (!item) return;
      if (normalize(item.task.type) === 'acordos' && currentPageId() === 'acordo-execucao') return;
      openWorkItem(item.task, item.process);
    });
    return sidebar;
  }

  function ensureWorkspaceSidebar(pageId = currentPageId()) {
    if (!EXECUTION_PAGES.includes(pageId)) return null;
    const layout = executionLayout(pageId);
    if (!layout) return null;

    if (pageId === 'tarefa-analise') layout.querySelector(':scope > .process-list:not(.tasks-workspace-sidebar)')?.classList.add('tasks-native-process-list');
    if (pageId === 'comprovante-execucao') layout.querySelector(':scope > .payment-process-list')?.classList.add('tasks-native-process-list');

    let sidebar = layout.querySelector(':scope > .tasks-workspace-sidebar');
    if (!sidebar) {
      sidebar = buildSidebar();
      layout.prepend(sidebar);
    }
    return sidebar;
  }

  function preloadedItems() {
    const filtered = filteredWorkItems();
    if (!filtered.length) return [];
    const activeIndex = filtered.findIndex(({ process }) => String(process.id) === String(activeProcessId));
    const start = activeIndex >= 0 ? activeIndex : 0;
    return filtered.slice(start, start + CACHE_SIZE);
  }

  function renderSidebar() {
    const sidebar = ensureWorkspaceSidebar();
    if (!sidebar) return;
    ensureNonEmptyStatus();

    const counts = statusCounts();
    sidebar.querySelector('.tasks-deadline-filters').innerHTML = STATUS_ORDER.map(key => `
      <button type="button" data-deadline-filter="${key}" class="${selectedStatus === key ? 'active' : ''}">
        <span><i class="deadline-dot ${key}"></i>${STATUS_META[key].label}</span><em>${counts[key]}</em>
      </button>`).join('');

    const countsByType = typeCounts();
    const types = [...new Set(workItems.map(({ task }) => normalize(task.type)).filter(Boolean))]
      .sort((a, b) => taskTypeLabel(a).localeCompare(taskTypeLabel(b), 'pt-BR'));
    const total = [...countsByType.values()].reduce((sum, value) => sum + value, 0);
    sidebar.querySelector('.tasks-type-filters').innerHTML = `
      <button type="button" data-type-filter="all" class="${selectedType === 'all' ? 'active' : ''}"><span>Todas</span><em>${total}</em></button>
      ${types.map(type => `<button type="button" data-type-filter="${escapeHtml(type)}" class="${selectedType === type ? 'active' : ''}"><span>${escapeHtml(taskTypeLabel(type))}</span><em>${countsByType.get(type) || 0}</em></button>`).join('')}`;

    const visible = preloadedItems();
    sidebar.querySelector('.tasks-workspace-items').innerHTML = visible.length ? visible.map(({ task, process }) => {
      const state = workState(task);
      const agreement = normalize(task.type) === 'acordos';
      return `<button type="button" class="process-item tasks-workspace-item ${String(process.id) === String(activeProcessId) ? 'selected' : ''}" data-task-id="${escapeHtml(task.id)}" data-process-id="${escapeHtml(process.id)}" ${agreement && currentPageId() === 'acordo-execucao' ? 'aria-disabled="true"' : ''}>
        <div><strong>${escapeHtml(process.case_number || 'Processo sem número')}</strong><small>${escapeHtml(taskTypeLabel(task.type))}</small><small>Indício: ${escapeHtml(indicationLabel(task, process))}</small></div>
        <em class="deadline-badge ${state}">${escapeHtml(STATUS_META[state].singular)}</em>
      </button>`;
    }).join('') : '<div class="process-list-empty">Nenhuma tarefa encontrada para este filtro.</div>';

    const search = sidebar.querySelector('.tasks-workspace-search');
    if (search && search.value !== searchTerm) search.value = searchTerm;
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function renderSummary() {
    if (!activeTask || !EXECUTION_PAGES.includes(currentPageId())) return;
    const summary = ensureWorkspaceSummary(currentPageId());
    if (!summary) return;
    const state = workState(activeTask);
    const completed = Number(activeTask.completed_processes || 0);
    const total = Number(activeTask.total_processes || 0);
    summary.querySelector('[data-workspace-progress]').textContent = total ? `${completed} de ${total}` : '—';
    const status = summary.querySelector('[data-workspace-status]');
    status.textContent = STATUS_META[state].singular;
    status.dataset.state = state;
    summary.querySelector('[data-workspace-deadline]').textContent = formatDate(activeTask.deadline_at);
  }

  function hideLegacyExecutionChrome() {
    document.querySelectorAll('#tarefa-analise .back-link, #comprovante-execucao .back-link, #acordo-execucao .back-link').forEach(node => { node.hidden = true; });
    document.querySelector('#tarefa-analise .detail-heading')?.setAttribute('hidden', '');
    document.querySelector('#comprovante-execucao .payment-receipt-heading')?.setAttribute('hidden', '');
    document.querySelector('#acordo-execucao .agreement-execution-heading')?.setAttribute('hidden', '');
    document.querySelector('#tarefa-analise .task-meta')?.setAttribute('hidden', '');
    document.querySelector('#comprovante-execucao .payment-task-meta')?.setAttribute('hidden', '');
    document.querySelector('#payment-receipt-history')?.setAttribute('hidden', '');
    document.querySelector('#payment-receipt-history-dialog')?.setAttribute('hidden', '');
  }

  function updateRendererContext() {
    const item = workItems.find(({ task, process }) => String(task.id) === String(activeTask?.id) && String(process.id) === String(activeProcessId));
    if (!item) return;

    let host = null;
    if (currentPageId() === 'tarefa-analise') host = document.querySelector('#tarefa-analise .analysis-card > header');
    if (currentPageId() === 'comprovante-execucao') host = document.querySelector('#comprovante-execucao .payment-receipt-card > header');
    if (currentPageId() === 'acordo-execucao') host = document.querySelector('#acordo-execucao .tasks-workspace-renderer');
    if (!host) return;

    let context = host.querySelector(':scope > .tasks-renderer-context');
    if (!context) {
      context = document.createElement('div');
      context.className = 'tasks-renderer-context';
      if (currentPageId() === 'acordo-execucao') host.prepend(context);
      else host.appendChild(context);
    }
    context.innerHTML = `<small>${escapeHtml(taskTypeLabel(item.task.type))}</small><span>Indício: ${escapeHtml(indicationLabel(item.task, item.process))}</span>`;
  }

  function parseTaskButton(button) {
    if (!button?.dataset.taskJson) return null;
    try { return JSON.parse(decodeURIComponent(button.dataset.taskJson)); }
    catch (_error) { return null; }
  }

  function taskButton(taskId) {
    return [...document.querySelectorAll('#tasks-table-body [data-task-json]')]
      .find(button => String(parseTaskButton(button)?.id) === String(taskId)) || null;
  }

  function openTaskProxy(task) {
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
    if (normalize(task.type) === 'acordos') return;
    const processId = String(process?.id || '');
    const caseNumber = String(process?.case_number || '');
    let attempts = 0;

    const trySelect = () => {
      attempts += 1;
      if (currentPageId() === 'comprovante-execucao') {
        const search = document.querySelector('#payment-process-search');
        if (search && search.value !== caseNumber) {
          search.value = caseNumber;
          search.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const button = document.querySelector(`#payment-process-items [data-payment-process-id="${CSS.escape(processId)}"]`);
        if (button) {
          button.click();
          activeProcessId = process.id;
          syncExecutionShell();
          return;
        }
      }

      if (currentPageId() === 'tarefa-analise') {
        const search = document.querySelector('#task-process-search');
        if (search && search.value !== caseNumber) {
          search.value = caseNumber;
          search.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const button = [...document.querySelectorAll('#process-items [data-process-json]')].find(candidate => {
          try { return String(JSON.parse(decodeURIComponent(candidate.dataset.processJson)).id) === processId; }
          catch (_error) { return false; }
        });
        if (button) {
          button.click();
          activeProcessId = process.id;
          syncExecutionShell();
          return;
        }
      }
      if (attempts < 25) setTimeout(trySelect, 60);
    };
    setTimeout(trySelect, 30);
  }

  function syncAgreementProcess() {
    if (currentPageId() !== 'acordo-execucao' || !activeTask) return;
    const caseNumber = document.querySelector('#agreement-case-number')?.textContent?.trim();
    if (!caseNumber || caseNumber === '—') return;
    const item = workItems.find(({ task, process }) => String(task.id) === String(activeTask.id) && String(process.case_number || '') === caseNumber);
    if (item) activeProcessId = item.process.id;
  }

  function openWorkItem(task, process) {
    if (!task || !process) return;
    activeTask = task;
    activeProcessId = normalize(task.type) === 'acordos' ? null : process.id;
    sessionStorage.setItem(LAST_TASK_TYPE_KEY, normalize(task.type));
    openTaskProxy(task);
    selectNativeProcess(task, process);
    setTimeout(syncExecutionShell, 90);
  }

  function openFirstFilteredItem() {
    const first = filteredWorkItems()[0];
    if (first) openWorkItem(first.task, first.process);
  }

  async function openDefaultWorkItem() {
    await refreshData();
    ensureNonEmptyStatus();
    const preferredType = normalize(sessionStorage.getItem(LAST_TASK_TYPE_KEY));
    if (preferredType && workItems.some(({ task }) => normalize(task.type) === preferredType)) selectedType = preferredType;
    const first = filteredWorkItems()[0] || sortedWorkItems()[0];
    if (first) openWorkItem(first.task, first.process);
    else if (canManage()) window.showPage?.('tarefas');
  }

  async function refreshData(force = false) {
    if (!window.MBA_API) return;
    if (refreshPromise && !force) return refreshPromise;

    refreshPromise = (async () => {
      const response = await window.MBA_API.request('/api/tasks');
      tasks = Array.isArray(response) ? response : [];
      installAssignmentPriority();

      const groups = await Promise.all(assignedTasks().map(async task => {
        try {
          const rows = await window.MBA_API.request(`/api/tasks/${task.id}/processes`);
          return (Array.isArray(rows) ? rows : []).map(process => ({ task, process }));
        } catch (_error) { return []; }
      }));
      workItems = groups.flat();
      ensureNonEmptyStatus();
      syncAgreementProcess();
      renderSidebar();
      renderSummary();
      updateRendererContext();
    })().finally(() => { refreshPromise = null; });
    return refreshPromise;
  }

  function syncExecutionShell() {
    const pageId = currentPageId();
    if (!EXECUTION_PAGES.includes(pageId)) return;
    hideLegacyExecutionChrome();
    ensureWorkspaceSidebar(pageId);
    ensureWorkspaceSummary(pageId);
    syncAgreementProcess();
    renderSidebar();
    renderSummary();
    updateRendererContext();
  }

  function syncTaskContext() {
    normalizeManagementLobby();
    syncGlobalNav();
    syncTaskSubnav();
    if (EXECUTION_PAGES.includes(currentPageId())) syncExecutionShell();
    if (currentPageId() === 'tarefas' && !canManage()) openDefaultWorkItem().catch(() => {});
  }

  function installObservers() {
    document.querySelectorAll('main.content .page').forEach(page => {
      new MutationObserver(mutations => {
        if (mutations.some(mutation => mutation.attributeName === 'class')) queueMicrotask(syncTaskContext);
      }).observe(page, { attributes: true, attributeFilter: ['class'] });
    });

    const agreementNumber = document.querySelector('#agreement-case-number');
    if (agreementNumber) {
      new MutationObserver(() => {
        if (currentPageId() !== 'acordo-execucao') return;
        syncAgreementProcess();
        renderSidebar();
        updateRendererContext();
      }).observe(agreementNumber, { childList: true, characterData: true, subtree: true });
    }

    document.addEventListener('click', event => {
      const moduleButton = event.target.closest('.nav-item[data-page="tarefas"]');
      if (!moduleButton || canManage()) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openDefaultWorkItem().catch(() => {});
    }, true);
  }

  function startRefresh() {
    clearInterval(refreshTimer);
    refreshTimer = setInterval(() => {
      if (TASK_PAGES.includes(currentPageId())) refreshData(true).catch(() => {});
    }, REFRESH_MS);
  }

  async function initialize(user) {
    currentUser = user || window.MBA_CURRENT_USER || currentUser;
    if (!currentUser || initialized) return;
    initialized = true;
    normalizeManagementLobby();
    syncTaskSubnav();
    installAssignmentPriority();
    installObservers();
    startRefresh();
    await refreshData(true).catch(() => {});
    syncTaskContext();
  }

  window.addEventListener('mba:authenticated', event => {
    initialize(window.MBA_CURRENT_USER || event.detail).catch(() => {});
  });

  if (window.MBA_CURRENT_USER) initialize(window.MBA_CURRENT_USER).catch(() => {});
})();
