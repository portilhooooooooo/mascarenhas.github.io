(() => {
  'use strict';

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
  const TASK_EXECUTION_PAGES = new Set(['tarefa-analise', 'comprovante-execucao', 'acordo-execucao', 'protocolo']);
  const LAST_TASK_TYPE_KEY = 'mba-last-task-type';

  let currentUser = window.MBA_CURRENT_USER || null;
  let tasks = [];
  let workItems = [];
  let selectedType = 'all';
  let selectedStatus = 'pending';
  let searchTerm = '';
  let queuePage = 0;
  let activeTask = null;
  let activeProcessId = null;
  let refreshToken = 0;
  let refreshPromise = null;

  const escapeHtml = (value) => {
    const el = document.createElement('span');
    el.textContent = value ?? '';
    return el.innerHTML;
  };

  const taskTypeLabel = (type) => TASK_TYPE_LABELS[String(type || '').toLowerCase()] || 'Tarefa operacional';
  window.MBA_TASK_TYPE_LABELS = TASK_TYPE_LABELS;

  const canManage = () => Boolean(
    currentUser?.is_master_admin
    || currentUser?.permissions?.['tasks.manage'] === true
    || currentUser?.permissions?.['tasks.assign'] === true
    || currentUser?.permissions?.['tasks.create'] === true
  );

  function assignedTasks() {
    if (canManage() || !currentUser?.id) return tasks;
    return tasks.filter((task) => {
      const participants = Array.isArray(task.participant_user_ids) ? task.participant_user_ids : [];
      const hasExplicitAssignment = Boolean(task.responsible_id) || participants.length > 0;
      if (!hasExplicitAssignment) return true;
      return task.responsible_id === currentUser.id || participants.includes(currentUser.id);
    });
  }

  function taskContextLabel(task) {
    if (!task) return '';
    let value = String(task.title || '').trim();
    const patterns = {
      comprovante_pagamento: /^Comprovante de Pagamento\s*[-–—:]\s*/i,
      liminar: /^An[aá]lise de Liminar\s*[-–—:]\s*/i,
      acordos: /^Acordos\s*[-–—:]\s*/i,
      encerramento: /^An[aá]lise de (?:Ind[ií]cio de )?Encerramento\s*[-–—:]\s*/i,
      bloqueio: /^An[aá]lise de (?:Ind[ií]cio de )?Bloqueio\s*[-–—:]\s*/i,
      citacao: /^An[aá]lise de (?:Ind[ií]cio de )?Cita[cç][aã]o\s*[-–—:]\s*/i,
    };
    const pattern = patterns[String(task.type || '').toLowerCase()];
    if (pattern) value = value.replace(pattern, '').trim();
    return value || task.description || '';
  }

  function taskState(task, process) {
    if (String(process?.status || '').toLowerCase() === 'completed') return 'completed';
    if (task?.deadline_at) {
      const deadline = new Date(task.deadline_at);
      if (!Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now()) return 'overdue';
    }
    return 'pending';
  }

  function currentPageId() {
    return document.querySelector('main.content .page.active')?.id || '';
  }

  function ensureManagementView() {
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
    document.querySelector('#tasks-execution-view')?.remove();
    return management;
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

    if (!nav.dataset.directWorkspaceHandler) {
      nav.dataset.directWorkspaceHandler = '1';
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
        openDefaultTask().catch(() => {});
      }, true);
    }

    return nav;
  }

  function normalizeManagementLobby() {
    const management = ensureManagementView();
    if (!management) return;
    const title = management.querySelector('.page-title h1');
    const subtitle = management.querySelector('.page-title p');
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

  function updateSubnav() {
    const nav = ensureSubnav();
    const pageId = currentPageId();
    const inTaskContext = pageId === 'tarefas' || TASK_EXECUTION_PAGES.has(pageId);
    nav.hidden = !inTaskContext;
    if (!inTaskContext) return;

    const management = nav.querySelector('[data-task-module-tab="management"]');
    const execution = nav.querySelector('[data-task-module-tab="execution"]');
    management.hidden = !canManage();
    management.classList.toggle('active', pageId === 'tarefas' && canManage());
    execution.classList.toggle('active', TASK_EXECUTION_PAGES.has(pageId) || !canManage());
  }

  async function refreshUnifiedData(force = false) {
    if (!window.MBA_API) return;
    if (refreshPromise && !force) return refreshPromise;
    const token = ++refreshToken;
    refreshPromise = (async () => {
      const response = await window.MBA_API.request('/api/tasks');
      if (token !== refreshToken) return;
      tasks = Array.isArray(response) ? response : [];
      const assigned = assignedTasks();
      const processGroups = await Promise.all(assigned.map(async (task) => {
        try {
          const rows = await window.MBA_API.request(`/api/tasks/${task.id}/processes`);
          return (Array.isArray(rows) ? rows : []).map((process) => ({ task, process }));
        } catch (_error) {
          return [];
        }
      }));
      if (token !== refreshToken) return;
      workItems = processGroups.flat();
      renderUnifiedSidebar();
      normalizeExecutionIdentity();
    })().finally(() => { refreshPromise = null; });
    return refreshPromise;
  }

  function defaultWorkItem(preferredType = sessionStorage.getItem(LAST_TASK_TYPE_KEY)) {
    const pending = workItems.filter(({ task, process }) => taskState(task, process) !== 'completed');
    const source = pending.length ? pending : workItems;
    const preferred = preferredType
      ? source.find(({ task }) => String(task.type) === String(preferredType))
      : null;
    return preferred || source[0] || null;
  }

  async function openDefaultTask() {
    await refreshUnifiedData();
    const item = defaultWorkItem();
    if (!item) {
      window.showPage?.('tarefas');
      normalizeManagementLobby();
      updateSubnav();
      return;
    }
    openWorkItem(item.task, item.process);
  }

  function openTaskProxy(task) {
    if (String(task.type || '').toLowerCase() === 'protocolo') {
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

  function selectNativeProcess(task, process) {
    const caseNumber = String(process?.case_number || '');
    const processId = String(process?.id || '');
    let attempts = 0;
    const trySelect = () => {
      attempts += 1;
      const pageId = currentPageId();
      if (String(task.type) === 'comprovante_pagamento' && pageId === 'comprovante-execucao') {
        const search = document.querySelector('#payment-process-search');
        if (search && search.value !== caseNumber) {
          search.value = caseNumber;
          search.dispatchEvent(new Event('input', { bubbles: true }));
        }
        const button = document.querySelector(`#payment-process-items [data-payment-process-id="${CSS.escape(processId)}"]`);
        if (button) { button.click(); return; }
      } else if (pageId === 'tarefa-analise') {
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
        if (button) { button.click(); return; }
      }
      if (attempts < 25) setTimeout(trySelect, 80);
    };
    setTimeout(trySelect, 50);
  }

  function openWorkItem(task, process) {
    if (!task) return;
    activeTask = task;
    activeProcessId = process?.id || null;
    sessionStorage.setItem(LAST_TASK_TYPE_KEY, task.type || '');
    openTaskProxy(task);
    if (process) selectNativeProcess(task, process);
    setTimeout(() => {
      normalizeExecutionIdentity();
      ensureUnifiedSidebar();
      renderUnifiedSidebar();
      updateSubnav();
    }, 80);
  }

  function executionContextTask() {
    if (activeTask) return activeTask;
    const context = document.querySelector('#payment-task-context')?.textContent?.trim()
      || document.querySelector('#tarefa-analise .detail-heading h1')?.textContent?.trim()
      || '';
    return assignedTasks().find((task) => task.title === context) || null;
  }

  function normalizeExecutionIdentity() {
    const task = executionContextTask();
    if (!task) return;
    const label = taskTypeLabel(task.type);
    const context = taskContextLabel(task);

    if (currentPageId() === 'comprovante-execucao') {
      const title = document.querySelector('#payment-task-type-title');
      const subtitle = document.querySelector('#payment-task-context');
      if (title && title.textContent !== label) title.textContent = label;
      if (subtitle && context && subtitle.textContent !== context) subtitle.textContent = context;
    }

    if (currentPageId() === 'tarefa-analise') {
      const title = document.querySelector('#tarefa-analise .detail-heading h1');
      const subtitle = document.querySelector('#tarefa-analise .detail-heading p');
      if (title && title.textContent !== label) title.textContent = label;
      if (subtitle) subtitle.textContent = context || task.description || 'Analise o processo selecionado e registre o resultado.';
    }

    document.querySelectorAll('#payment-assignment-filter option').forEach((option) => {
      if (TASK_TYPE_LABELS[option.value]) option.textContent = TASK_TYPE_LABELS[option.value];
    });
  }

  function queuePageSize() {
    const available = Math.max(220, window.innerHeight - 370);
    return Math.max(5, Math.min(9, Math.floor(available / 58)));
  }

  function filteredWorkItems() {
    return workItems.filter(({ task, process }) => {
      const typeMatch = selectedType === 'all' || String(task.type) === selectedType;
      const stateMatch = taskState(task, process) === selectedStatus;
      const haystack = `${process.case_number || ''} ${process.folder || ''} ${process.party_name || ''} ${taskTypeLabel(task.type)} ${task.title || ''}`.toLowerCase();
      const searchMatch = !searchTerm || haystack.includes(searchTerm);
      return typeMatch && stateMatch && searchMatch;
    });
  }

  function typeCounts() {
    const counts = new Map();
    workItems.forEach(({ task, process }) => {
      if (taskState(task, process) !== selectedStatus) return;
      counts.set(task.type, (counts.get(task.type) || 0) + 1);
    });
    return counts;
  }

  function ensureUnifiedSidebar() {
    const pageId = currentPageId();
    if (!['tarefa-analise', 'comprovante-execucao'].includes(pageId)) return null;
    const page = document.getElementById(pageId);
    const layout = page?.querySelector('.analysis-layout');
    const native = layout?.querySelector(':scope > .process-list:not(.tasks-unified-sidebar)');
    if (!layout || !native) return null;

    native.classList.add('tasks-native-process-list');
    let sidebar = layout.querySelector(':scope > .tasks-unified-sidebar');
    if (!sidebar) {
      sidebar = document.createElement('aside');
      sidebar.className = 'panel process-list tasks-unified-sidebar';
      sidebar.innerHTML = `
        <h2>Minhas tarefas</h2>
        <label class="process-search"><i data-lucide="search"></i><input class="tasks-unified-search" type="search" placeholder="Buscar processo ou pasta"></label>
        <div class="process-filters tasks-unified-filters">
          <select class="tasks-unified-type" aria-label="Tipo de tarefa"></select>
          <select class="tasks-unified-status" aria-label="Status da tarefa">
            <option value="pending">Pendentes</option>
            <option value="completed">Concluídas</option>
            <option value="overdue">Em atraso</option>
          </select>
        </div>
        <div class="tasks-unified-items"></div>
        <div class="process-pagination tasks-unified-pagination" hidden>
          <button type="button" data-unified-prev aria-label="Tarefas anteriores"><i data-lucide="chevron-left"></i></button>
          <span class="tasks-unified-page-label">—</span>
          <button type="button" data-unified-next aria-label="Próximas tarefas"><i data-lucide="chevron-right"></i></button>
        </div>
      `;
      layout.insertBefore(sidebar, native);

      sidebar.querySelector('.tasks-unified-search')?.addEventListener('input', (event) => {
        searchTerm = event.target.value.trim().toLowerCase();
        queuePage = 0;
        renderUnifiedSidebar();
      });
      sidebar.querySelector('.tasks-unified-type')?.addEventListener('change', (event) => {
        selectedType = event.target.value || 'all';
        queuePage = 0;
        renderUnifiedSidebar();
      });
      sidebar.querySelector('.tasks-unified-status')?.addEventListener('change', (event) => {
        selectedStatus = event.target.value || 'pending';
        queuePage = 0;
        renderUnifiedSidebar();
      });
      sidebar.querySelector('[data-unified-prev]')?.addEventListener('click', () => {
        queuePage -= 1;
        renderUnifiedSidebar();
      });
      sidebar.querySelector('[data-unified-next]')?.addEventListener('click', () => {
        queuePage += 1;
        renderUnifiedSidebar();
      });
      sidebar.querySelector('.tasks-unified-items')?.addEventListener('click', (event) => {
        const button = event.target.closest('[data-unified-task-id][data-unified-process-id]');
        if (!button) return;
        const item = workItems.find(({ task, process }) => String(task.id) === button.dataset.unifiedTaskId && String(process.id) === button.dataset.unifiedProcessId);
        if (item) openWorkItem(item.task, item.process);
      });
    }
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
    return sidebar;
  }

  function renderUnifiedSidebar() {
    const sidebar = ensureUnifiedSidebar();
    if (!sidebar) return;

    const counts = typeCounts();
    const types = [...new Set(workItems.map(({ task }) => task.type).filter(Boolean))]
      .sort((a, b) => taskTypeLabel(a).localeCompare(taskTypeLabel(b), 'pt-BR'));
    if (selectedType !== 'all' && !types.includes(selectedType)) selectedType = 'all';

    const typeSelect = sidebar.querySelector('.tasks-unified-type');
    const currentType = selectedType;
    const totalForStatus = workItems.filter(({ task, process }) => taskState(task, process) === selectedStatus).length;
    typeSelect.innerHTML = `<option value="all">Todas as tarefas (${totalForStatus})</option>${types.map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(taskTypeLabel(type))} (${counts.get(type) || 0})</option>`).join('')}`;
    typeSelect.value = currentType;
    sidebar.querySelector('.tasks-unified-status').value = selectedStatus;
    sidebar.querySelector('.tasks-unified-search').value = searchTerm;

    const filtered = filteredWorkItems();
    const size = queuePageSize();
    const pages = Math.max(1, Math.ceil(filtered.length / size));
    queuePage = Math.min(Math.max(queuePage, 0), pages - 1);
    const start = queuePage * size;
    const visible = filtered.slice(start, start + size);

    sidebar.querySelector('.tasks-unified-items').innerHTML = visible.length ? visible.map(({ task, process }) => {
      const state = taskState(task, process);
      const stateLabel = state === 'completed' ? 'Concluída' : state === 'overdue' ? 'Em atraso' : 'Pendente';
      const secondary = process.folder || process.party_name || taskContextLabel(task) || 'Sem informação adicional';
      return `
        <button class="process-item ${String(process.id) === String(activeProcessId) ? 'selected' : ''}" type="button" data-unified-task-id="${escapeHtml(task.id)}" data-unified-process-id="${escapeHtml(process.id)}">
          <span><i data-lucide="${state === 'completed' ? 'circle-check' : 'clipboard-check'}"></i></span>
          <div>
            <strong>${escapeHtml(process.case_number || 'Processo sem número')}</strong>
            <small><b>${escapeHtml(taskTypeLabel(task.type))}</b> · ${escapeHtml(secondary)}</small>
          </div>
          <em class="${state}">${escapeHtml(stateLabel)}</em>
        </button>
      `;
    }).join('') : '<div class="process-list-empty">Nenhuma tarefa encontrada para este filtro.</div>';

    const pagination = sidebar.querySelector('.tasks-unified-pagination');
    pagination.hidden = filtered.length <= size;
    sidebar.querySelector('[data-unified-prev]').disabled = queuePage === 0;
    sidebar.querySelector('[data-unified-next]').disabled = queuePage >= pages - 1;
    sidebar.querySelector('.tasks-unified-page-label').textContent = filtered.length ? `${start + 1}–${Math.min(start + size, filtered.length)} de ${filtered.length}` : '0 de 0';
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function syncSelectedFromNative() {
    const pageId = currentPageId();
    if (pageId === 'comprovante-execucao') {
      const selected = document.querySelector('#payment-process-items .process-item.selected[data-payment-process-id]');
      if (selected) activeProcessId = selected.dataset.paymentProcessId;
    } else if (pageId === 'tarefa-analise') {
      const selected = document.querySelector('#process-items .process-item.selected[data-process-json]');
      if (selected) {
        try { activeProcessId = JSON.parse(decodeURIComponent(selected.dataset.processJson)).id; } catch (_error) {}
      }
    }
    renderUnifiedSidebar();
  }

  function syncTaskContext() {
    normalizeManagementLobby();
    updateSubnav();
    const pageId = currentPageId();
    if (TASK_EXECUTION_PAGES.has(pageId)) {
      ensureUnifiedSidebar();
      normalizeExecutionIdentity();
      renderUnifiedSidebar();
    } else if (pageId === 'tarefas' && !canManage()) {
      openDefaultTask().catch(() => {});
    }
  }

  function installObservers() {
    document.querySelectorAll('main.content .page').forEach((page) => {
      new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.attributeName === 'class')) queueMicrotask(syncTaskContext);
      }).observe(page, { attributes: true, attributeFilter: ['class'] });
    });

    const body = document.querySelector('#tasks-table-body');
    if (body) new MutationObserver(normalizeManagementLobby).observe(body, { childList: true, subtree: true, characterData: true });

    ['#process-items', '#payment-process-items'].forEach((selector) => {
      const node = document.querySelector(selector);
      if (node) new MutationObserver(() => queueMicrotask(syncSelectedFromNative)).observe(node, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    });

    document.addEventListener('click', (event) => {
      const sidebar = event.target.closest('.nav-item[data-page="tarefas"]');
      if (!sidebar) return;
      event.preventDefault();
      event.stopImmediatePropagation();
      openDefaultTask().catch(() => {});
    }, true);

    document.addEventListener('click', (event) => {
      if (!event.target.closest('#save-next, #payment-receipt-skip')) return;
      setTimeout(() => refreshUnifiedData(true).catch(() => {}), 700);
    }, true);
    document.addEventListener('submit', (event) => {
      if (event.target?.id !== 'payment-receipt-form') return;
      setTimeout(() => refreshUnifiedData(true).catch(() => {}), 700);
    }, true);
  }

  window.addEventListener('mba:authenticated', (event) => {
    currentUser = window.MBA_CURRENT_USER || event.detail || currentUser;
    refreshUnifiedData(true).then(() => {
      syncTaskContext();
      if (currentPageId() === 'tarefas' && !canManage()) openDefaultTask().catch(() => {});
    }).catch(() => {});
  });

  window.addEventListener('resize', () => {
    if (TASK_EXECUTION_PAGES.has(currentPageId())) renderUnifiedSidebar();
  });

  ensureManagementView();
  ensureSubnav();
  installObservers();
  normalizeManagementLobby();
  updateSubnav();
})();