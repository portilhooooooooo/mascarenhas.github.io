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

  const TASK_PAGES = ['tarefas', 'tarefa-analise', 'comprovante-execucao', 'acordo-execucao'];

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
    if (!Array.isArray(tasks)) return [];
    if (canManage() || !currentUser?.id) return tasks;

    return tasks.filter((task) => {
      const participants = Array.isArray(task.participant_user_ids) ? task.participant_user_ids : [];
      const explicit = Boolean(task.responsible_id) || participants.length > 0;
      if (!explicit) return true;
      return String(task.responsible_id || '') === String(currentUser.id)
        || participants.some((id) => String(id) === String(currentUser.id));
    });
  }

  function localDay(value) {
    if (!value) return null;
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return null;
    date.setHours(0, 0, 0, 0);
    return date;
  }

  /*
   * Fase 1 — taxonomia do status do prazo:
   * - Urgente: prioridade ALTA definida explicitamente na atribuição.
   * - Em atraso: prazo anterior a hoje, desde que não seja Urgente.
   * - Pendente: sem prazo ou tarefa ainda em estado pending.
   * - Em dia: tarefa ativa com prazo hoje/futuro e sem prioridade alta.
   *
   * “Prazo hoje” NÃO transforma automaticamente uma tarefa em urgente.
   */
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
    const direct = process?.indicio
      || process?.indication
      || process?.indication_label
      || process?.reason
      || process?.reason_label;

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

  function removeLegacyGlobalSubnav() {
    document.querySelector('.main-area > #tasks-module-nav, .main-area > .tasks-module-nav')?.remove();
  }

  function ensureLocalNav(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return null;

    let nav = page.querySelector(':scope > .tasks-local-nav');
    if (nav) return nav;

    nav = document.createElement('nav');
    nav.className = 'tasks-local-nav';
    nav.setAttribute('aria-label', 'Navegação do módulo de tarefas');
    nav.innerHTML = `
      <button type="button" data-task-local-tab="management">Gestão</button>
      <button type="button" data-task-local-tab="execution">Tarefas</button>
    `;
    page.prepend(nav);

    nav.addEventListener('click', (event) => {
      const button = event.target.closest('[data-task-local-tab]');
      if (!button) return;

      if (button.dataset.taskLocalTab === 'management') {
        if (!canManage()) return;
        window.showPage?.('tarefas');
        queueMicrotask(syncTaskContext);
        return;
      }

      openDefaultWorkItem().catch(() => {});
    });

    return nav;
  }

  function syncLocalNav() {
    removeLegacyGlobalSubnav();

    TASK_PAGES.forEach((pageId) => {
      const nav = ensureLocalNav(pageId);
      if (!nav) return;

      const management = nav.querySelector('[data-task-local-tab="management"]');
      const execution = nav.querySelector('[data-task-local-tab="execution"]');
      const isManagement = pageId === 'tarefas';

      if (management) {
        management.hidden = !canManage();
        management.classList.toggle('active', canManage() && isManagement);
      }
      execution?.classList.toggle('active', !isManagement || !canManage());
    });
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
      field.innerHTML = `
        Prioridade da atribuição
        <select name="assignment_priority" required>
          <option value="high">Alta — Urgente</option>
          <option value="medium">Média</option>
          <option value="low">Baixa</option>
        </select>
        <small>“Urgente” é definido aqui; a data do prazo não eleva a tarefa automaticamente.</small>
      `;
      taskSelect.closest('label')?.insertAdjacentElement('afterend', field);
    }

    const prioritySelect = field.querySelector('select[name="assignment_priority"]');

    const syncPriority = () => {
      const task = tasks.find((item) => String(item.id) === String(taskSelect.value));
      if (prioritySelect) prioritySelect.value = ['low', 'medium', 'high'].includes(task?.priority) ? task.priority : 'medium';
    };

    taskSelect.addEventListener('change', syncPriority);
    syncPriority();

    if (form.dataset.phase1AssignmentHandler === '1') return;
    form.dataset.phase1AssignmentHandler = '1';

    form.addEventListener('submit', async (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();

      const submit = form.querySelector('[type="submit"]');
      const errorBox = document.querySelector('#task-assign-error');
      const participantUserIds = new FormData(form).getAll('participant_user_ids').filter(Boolean);
      const taskId = form.elements.task_id?.value;
      const priority = form.elements.assignment_priority?.value || 'medium';

      if (errorBox) {
        errorBox.hidden = true;
        errorBox.textContent = '';
      }

      if (!taskId) {
        if (errorBox) {
          errorBox.textContent = 'Selecione uma tarefa.';
          errorBox.hidden = false;
        }
        return;
      }

      if (!participantUserIds.length) {
        if (errorBox) {
          errorBox.textContent = 'Selecione ao menos um usuário ativo.';
          errorBox.hidden = false;
        }
        return;
      }

      if (submit) submit.disabled = true;
      try {
        await window.MBA_API.request(`/api/tasks/${taskId}`, {
          method: 'PATCH',
          body: JSON.stringify({ participant_user_ids: participantUserIds, priority }),
        });

        document.querySelector('#task-assign-dialog')?.close();
        await window.loadTasks?.();
        await refreshUnifiedData(true);
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

  function hideNonOperationalControls() {
    document.querySelector('#payment-receipt-history')?.remove();
    const historyDialog = document.querySelector('#payment-receipt-history-dialog');
    if (historyDialog) historyDialog.hidden = true;
  }

  function normalizeExecutionShell() {
    const pageId = currentPageId();
    if (!activeTask || !['tarefa-analise', 'comprovante-execucao'].includes(pageId)) return;

    document.querySelectorAll('#tarefa-analise .back-link, #comprovante-execucao .back-link')
      .forEach((node) => { node.hidden = true; });

    hideNonOperationalControls();

    if (pageId === 'tarefa-analise') {
      const heading = document.querySelector('#tarefa-analise .detail-heading');
      if (heading) heading.hidden = true;

      const cells = [...(document.querySelector('#tarefa-analise .task-meta')?.children || [])];
      const state = workState(activeTask);

      if (cells[1]) {
        const strong = cells[1].querySelector('strong');
        if (strong) strong.innerHTML = `<i class="status-dot"></i>${escapeHtml(STATUS_META[state].singular)}`;
        cells[1].dataset.deadlineState = state;
      }
      if (cells[2]) {
        const strong = cells[2].querySelector('strong');
        if (strong) strong.textContent = formatDate(activeTask.deadline_at);
      }
      if (cells[3]) cells[3].hidden = true;
    }

    if (pageId === 'comprovante-execucao') {
      const heading = document.querySelector('#comprovante-execucao .payment-receipt-heading');
      if (heading) heading.hidden = true;

      const state = workState(activeTask);
      const health = document.querySelector('#payment-task-health');
      if (health) {
        health.className = `payment-task-health ${state}`;
        health.innerHTML = `<i class="status-dot"></i><span>${escapeHtml(STATUS_META[state].singular)}</span>`;
      }

      const deadline = document.querySelector('#payment-task-deadline');
      if (deadline) deadline.textContent = formatDate(activeTask.deadline_at);

      document.querySelector('#payment-task-assignee')?.closest('div')?.setAttribute('hidden', '');
      document.querySelector('#payment-receipt-folder')?.closest('p')?.setAttribute('hidden', '');
    }

    updateExecutionContext();
  }

  function updateExecutionContext() {
    const item = workItems.find(({ task, process }) =>
      String(task.id) === String(activeTask?.id)
      && String(process.id) === String(activeProcessId));

    if (!item) return;

    let header = null;
    if (currentPageId() === 'tarefa-analise') header = document.querySelector('#tarefa-analise .analysis-card > header');
    if (currentPageId() === 'comprovante-execucao') header = document.querySelector('#comprovante-execucao .payment-receipt-card > header');
    if (!header) return;

    let type = header.querySelector('.workspace-task-type');
    if (!type) {
      type = document.createElement('small');
      type.className = 'workspace-task-type';
      header.prepend(type);
    }
    type.textContent = taskTypeLabel(item.task.type);

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
          <small>${CACHE_SIZE} pré-carregadas · atualização em segundo plano</small>
        </div>
        <label class="process-search">
          <i data-lucide="search"></i>
          <input class="tasks-workspace-search" type="search" placeholder="Buscar processo ou parte">
        </label>
        <div class="tasks-workspace-items"></div>
      </section>
    `;

    layout.insertBefore(sidebar, native);

    sidebar.querySelector('.tasks-deadline-filters')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-deadline-filter]');
      if (!button) return;
      selectedStatus = button.dataset.deadlineFilter;
      activeProcessId = null;
      renderWorkspaceSidebar();
      openFirstFilteredItem();
    });

    sidebar.querySelector('.tasks-type-filters')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-type-filter]');
      if (!button) return;
      selectedType = button.dataset.typeFilter;
      activeProcessId = null;
      renderWorkspaceSidebar();
      openFirstFilteredItem();
    });

    sidebar.querySelector('.tasks-workspace-search')?.addEventListener('input', (event) => {
      searchTerm = event.target.value.trim().toLowerCase();
      activeProcessId = null;
      renderWorkspaceSidebar();
    });

    sidebar.querySelector('.tasks-workspace-items')?.addEventListener('click', (event) => {
      const button = event.target.closest('[data-task-id][data-process-id]');
      if (!button) return;

      const item = workItems.find(({ task, process }) =>
        String(task.id) === String(button.dataset.taskId)
        && String(process.id) === String(button.dataset.processId));

      if (item) openWorkItem(item.task, item.process);
    });

    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
    return sidebar;
  }

  function processPosition(process) {
    const value = Number(process?.position);
    return Number.isFinite(value) && value >= 0 ? value : Number.MAX_SAFE_INTEGER;
  }

  /*
   * Ordem do buffer de 5 itens:
   * 1) Urgente > Em atraso > Pendente > Em dia;
   * 2) posição de atribuição (task_processes.position);
   * 3) prazo da tarefa, só como desempate;
   * 4) criação do processo;
   * 5) CNJ, último desempate determinístico.
   */
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
    const counts = Object.fromEntries(STATUS_ORDER.map((key) => [key, 0]));
    workItems.forEach(({ task, process }) => {
      if (normalize(process?.status) === 'completed') return;
      counts[workState(task)] += 1;
    });
    return counts;
  }

  function typeCounts() {
    const counts = new Map();
    workItems.forEach(({ task, process }) => {
      if (normalize(process?.status) === 'completed') return;
      if (workState(task) !== selectedStatus) return;
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

  function preloadedItems() {
    const filtered = filteredWorkItems();
    if (!filtered.length) return [];

    const activeIndex = filtered.findIndex(({ process }) => String(process.id) === String(activeProcessId));
    const start = activeIndex >= 0 ? activeIndex : 0;
    return filtered.slice(start, start + CACHE_SIZE);
  }

  function renderWorkspaceSidebar() {
    const sidebar = ensureWorkspaceSidebar();
    if (!sidebar) return;

    ensureNonEmptyStatus();

    const counts = statusCounts();
    sidebar.querySelector('.tasks-deadline-filters').innerHTML = STATUS_ORDER.map((key) => `
      <button type="button" data-deadline-filter="${key}" class="${selectedStatus === key ? 'active' : ''}">
        <span><i class="deadline-dot ${key}"></i>${STATUS_META[key].label}</span>
        <em>${counts[key]}</em>
      </button>
    `).join('');

    const countsByType = typeCounts();
    const types = [...new Set(workItems.map(({ task }) => normalize(task.type)).filter(Boolean))]
      .sort((a, b) => taskTypeLabel(a).localeCompare(taskTypeLabel(b), 'pt-BR'));
    const total = [...countsByType.values()].reduce((sum, value) => sum + value, 0);

    sidebar.querySelector('.tasks-type-filters').innerHTML = `
      <button type="button" data-type-filter="all" class="${selectedType === 'all' ? 'active' : ''}">
        <span>Todas</span><em>${total}</em>
      </button>
      ${types.map((type) => `
        <button type="button" data-type-filter="${escapeHtml(type)}" class="${selectedType === type ? 'active' : ''}">
          <span>${escapeHtml(taskTypeLabel(type))}</span>
          <em>${countsByType.get(type) || 0}</em>
        </button>
      `).join('')}
    `;

    const visible = preloadedItems();
    sidebar.querySelector('.tasks-workspace-items').innerHTML = visible.length
      ? visible.map(({ task, process }) => {
          const state = workState(task);
          return `
            <button
              type="button"
              class="process-item tasks-workspace-item ${String(process.id) === String(activeProcessId) ? 'selected' : ''}"
              data-task-id="${escapeHtml(task.id)}"
              data-process-id="${escapeHtml(process.id)}"
            >
              <div>
                <strong>${escapeHtml(process.case_number || 'Processo sem número')}</strong>
                <small>${escapeHtml(taskTypeLabel(task.type))}</small>
                <small>Indício: ${escapeHtml(indicationLabel(task, process))}</small>
              </div>
              <em class="deadline-badge ${state}">${escapeHtml(STATUS_META[state].singular)}</em>
            </button>
          `;
        }).join('')
      : '<div class="process-list-empty">Nenhuma tarefa encontrada para este filtro.</div>';

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
    if (button) {
      button.click();
      return;
    }

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
          normalizeExecutionShell();
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
          try {
            return String(JSON.parse(decodeURIComponent(candidate.dataset.processJson)).id) === processId;
          } catch (_error) {
            return false;
          }
        });

        if (button) {
          button.click();
          activeProcessId = process.id;
          normalizeExecutionShell();
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
      normalizeExecutionShell();
      renderWorkspaceSidebar();
      syncLocalNav();
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
    if (preferredType && workItems.some(({ task }) => normalize(task.type) === preferredType)) {
      selectedType = preferredType;
    }

    const first = filteredWorkItems()[0] || sortedWorkItems()[0];
    if (first) {
      openWorkItem(first.task, first.process);
      return;
    }

    if (canManage()) window.showPage?.('tarefas');
  }

  async function refreshUnifiedData(force = false) {
    if (!window.MBA_API) return;
    if (refreshPromise && !force) return refreshPromise;

    refreshPromise = (async () => {
      const response = await window.MBA_API.request('/api/tasks');
      tasks = Array.isArray(response) ? response : [];
      installAssignmentPriority();

      const processGroups = await Promise.all(assignedTasks().map(async (task) => {
        try {
          const rows = await window.MBA_API.request(`/api/tasks/${task.id}/processes`);
          return (Array.isArray(rows) ? rows : []).map((process) => ({ task, process }));
        } catch (_error) {
          return [];
        }
      }));

      workItems = processGroups.flat();
      ensureNonEmptyStatus();

      if (activeProcessId && !workItems.some(({ process }) =>
        String(process.id) === String(activeProcessId) && normalize(process.status) !== 'completed')) {
        activeProcessId = null;
      }

      renderWorkspaceSidebar();
      normalizeExecutionShell();
    })().finally(() => {
      refreshPromise = null;
    });

    return refreshPromise;
  }

  function syncTaskContext() {
    removeLegacyGlobalSubnav();
    normalizeManagementLobby();
    syncLocalNav();
    hideNonOperationalControls();

    const pageId = currentPageId();

    if (['tarefa-analise', 'comprovante-execucao'].includes(pageId)) {
      ensureWorkspaceSidebar();
      normalizeExecutionShell();
      renderWorkspaceSidebar();
    }

    if (pageId === 'tarefas' && !canManage()) {
      openDefaultWorkItem().catch(() => {});
    }
  }

  function installObservers() {
    document.querySelectorAll('main.content .page').forEach((page) => {
      new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.attributeName === 'class')) {
          queueMicrotask(syncTaskContext);
        }
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
      if (!TASK_PAGES.includes(currentPageId())) return;
      refreshUnifiedData(true).catch(() => {});
    }, REFRESH_MS);
  }

  async function initializeWorkspace(user) {
    currentUser = user || window.MBA_CURRENT_USER || currentUser;
    if (!currentUser || initialized) return;

    initialized = true;
    removeLegacyGlobalSubnav();
    normalizeManagementLobby();
    syncLocalNav();
    installAssignmentPriority();
    hideNonOperationalControls();
    installObservers();
    startBackgroundRefresh();

    await refreshUnifiedData(true).catch(() => {});
    syncTaskContext();
  }

  window.addEventListener('mba:authenticated', (event) => {
    initializeWorkspace(window.MBA_CURRENT_USER || event.detail).catch(() => {});
  });

  if (window.MBA_CURRENT_USER) initializeWorkspace(window.MBA_CURRENT_USER).catch(() => {});
})();
