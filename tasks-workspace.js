(() => {
  'use strict';

  const STORAGE_KEY = 'mba-tasks-category';
  const TASK_CONTEXT_PAGES = new Set(['tarefas', 'tarefa-analise']);
  const CATEGORY_TYPES = {
    all: null,
    liminar: new Set(['liminar']),
    contestacao: new Set(['contestacao', 'reagendamento']),
    protocolo: new Set(['protocolo']),
  };
  const CATEGORY_LABELS = {
    all: 'Todas',
    liminar: 'Liminar',
    contestacao: 'Contestação',
    protocolo: 'Protocolo',
  };

  let selectedCategory = sessionStorage.getItem(STORAGE_KEY) || 'all';
  if (!Object.hasOwn(CATEGORY_TYPES, selectedCategory)) selectedCategory = 'all';
  let applyingFilter = false;

  function currentPage() {
    return document.querySelector('main .page.active')?.id || '';
  }

  function parseTaskFromRow(row) {
    const button = row?.querySelector('[data-task-json]');
    if (!button?.dataset.taskJson) return null;
    try {
      return JSON.parse(decodeURIComponent(button.dataset.taskJson));
    } catch (_error) {
      return null;
    }
  }

  function categoryForType(type) {
    const normalized = String(type || '').toLowerCase();
    if (CATEGORY_TYPES.liminar.has(normalized)) return 'liminar';
    if (CATEGORY_TYPES.contestacao.has(normalized)) return 'contestacao';
    if (CATEGORY_TYPES.protocolo.has(normalized)) return 'protocolo';
    return 'all';
  }

  function taskRows() {
    return [...document.querySelectorAll('#tasks-table-body tr[data-task-id]')];
  }

  function taskCounts() {
    const counts = { all: 0, liminar: 0, contestacao: 0, protocolo: 0 };
    for (const row of taskRows()) {
      const task = parseTaskFromRow(row);
      if (!task) continue;
      counts.all += 1;
      const category = categoryForType(task.type);
      if (category !== 'all') counts[category] += 1;
    }
    return counts;
  }

  function navMarkup() {
    return `<div class="tasks-workspace-tabs">
      ${Object.entries(CATEGORY_LABELS).map(([key, label]) => `
        <button type="button" class="tasks-workspace-tab" data-tasks-category="${key}" aria-pressed="false">
          <span>${label}</span><em data-task-count="${key}">0</em>
        </button>`).join('')}
    </div>`;
  }

  function ensureTaskChrome(pageId) {
    const page = document.getElementById(pageId);
    if (!page) return;

    if (!page.querySelector('.tasks-context-header')) {
      const header = document.createElement('header');
      header.className = 'tasks-context-header';
      header.innerHTML = '<div><h1>Tarefas</h1><p>Gestão e análise das tarefas atribuídas.</p></div>';
      page.prepend(header);
    }

    if (!page.querySelector('.tasks-workspace-nav')) {
      const nav = document.createElement('nav');
      nav.className = 'tasks-workspace-nav';
      nav.setAttribute('aria-label', 'Filtrar tarefas por tipo');
      nav.innerHTML = navMarkup();
      page.querySelector('.tasks-context-header')?.after(nav);
    }
  }

  function structureExecutionWorkspace() {
    const page = document.getElementById('tarefa-analise');
    const layout = page?.querySelector('.analysis-layout');
    const meta = page?.querySelector('.task-meta');
    const processList = layout?.querySelector('.process-list');
    const analysisCard = layout?.querySelector('.analysis-card');
    if (!layout || !meta || !processList || !analysisCard || layout.dataset.tasksStructured === 'true') return;

    layout.dataset.tasksStructured = 'true';
    layout.classList.add('tasks-execution-layout');
    layout.classList.remove('two-column');

    const main = document.createElement('div');
    main.className = 'tasks-execution-main';
    layout.appendChild(main);
    main.appendChild(meta);
    main.appendChild(analysisCard);
  }

  function updateNavCounts() {
    const counts = taskCounts();
    for (const [category, count] of Object.entries(counts)) {
      document.querySelectorAll(`[data-task-count="${category}"]`).forEach(node => {
        node.textContent = String(count);
      });
    }
  }

  function renderEmptyState(visibleCount) {
    const tbody = document.getElementById('tasks-table-body');
    if (!tbody) return;
    let empty = document.getElementById('tasks-category-empty');
    if (selectedCategory === 'all' || visibleCount > 0) {
      empty?.remove();
      return;
    }
    if (!empty) {
      empty = document.createElement('tr');
      empty.id = 'tasks-category-empty';
      empty.innerHTML = '<td colspan="6"><div class="tasks-category-empty"><i data-lucide="inbox"></i><strong>Nenhuma tarefa nesta fila</strong><span>Quando houver tarefas atribuídas deste tipo, elas aparecerão aqui.</span></div></td>';
      tbody.appendChild(empty);
      window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
    }
  }

  function applyTaskFilter() {
    if (applyingFilter) return;
    applyingFilter = true;
    try {
      const allowedTypes = CATEGORY_TYPES[selectedCategory];
      let visibleCount = 0;
      for (const row of taskRows()) {
        const task = parseTaskFromRow(row);
        const visible = !allowedTypes || (task && allowedTypes.has(String(task.type || '').toLowerCase()));
        row.hidden = !visible;
        if (visible) visibleCount += 1;
      }
      renderEmptyState(visibleCount);
      updateNavCounts();
    } finally {
      applyingFilter = false;
    }
  }

  function selectCategory(category) {
    if (!Object.hasOwn(CATEGORY_TYPES, category)) category = 'all';
    selectedCategory = category;
    sessionStorage.setItem(STORAGE_KEY, category);
    document.querySelectorAll('[data-tasks-category]').forEach(button => {
      const active = button.dataset.tasksCategory === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    applyTaskFilter();
  }

  function normalizeLobby() {
    const page = document.getElementById('tarefas');
    const titleBlock = page?.querySelector('.page-title > div:first-child');
    if (titleBlock) titleBlock.hidden = true;
  }

  function updateShell() {
    ensureTaskChrome('tarefas');
    ensureTaskChrome('tarefa-analise');
    structureExecutionWorkspace();
    normalizeLobby();

    const inTasks = TASK_CONTEXT_PAGES.has(currentPage());
    document.body.classList.toggle('tasks-workspace-active', inTasks);
    if (!inTasks) return;

    document.querySelectorAll('[data-tasks-category]').forEach(button => {
      const active = button.dataset.tasksCategory === selectedCategory;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    if (currentPage() === 'tarefas') applyTaskFilter();
    updateNavCounts();
  }

  function handleTaskNavigation(event) {
    const categoryButton = event.target.closest('[data-tasks-category]');
    if (categoryButton) {
      selectCategory(categoryButton.dataset.tasksCategory);
      window.showPage?.('tarefas');
      queueMicrotask(updateShell);
      return;
    }

    const tasksSidebarItem = event.target.closest('.nav-item[data-page="tarefas"]');
    if (tasksSidebarItem) {
      selectedCategory = 'all';
      sessionStorage.setItem(STORAGE_KEY, 'all');
      queueMicrotask(updateShell);
      return;
    }

    const taskButton = event.target.closest('[data-task-json]');
    if (!taskButton?.dataset.taskJson) return;

    let task;
    try {
      task = JSON.parse(decodeURIComponent(taskButton.dataset.taskJson));
    } catch (_error) {
      return;
    }

    selectedCategory = categoryForType(task.type);
    sessionStorage.setItem(STORAGE_KEY, selectedCategory);

    // A aba Protocolo é apenas filtro. A execução real continua no agente próprio.
    if (String(task.type || '').toLowerCase() === 'protocolo') {
      event.preventDefault();
      event.stopImmediatePropagation();
      window.showPage?.('protocolo');
      queueMicrotask(updateShell);
    }
  }

  function observeApplication() {
    const content = document.querySelector('main.content');
    if (content) {
      new MutationObserver(mutations => {
        if (mutations.some(mutation => mutation.type === 'attributes' && mutation.attributeName === 'class')) {
          queueMicrotask(updateShell);
        }
      }).observe(content, { subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    const tbody = document.getElementById('tasks-table-body');
    if (tbody) {
      new MutationObserver(() => {
        if (!applyingFilter) queueMicrotask(() => {
          applyTaskFilter();
          updateNavCounts();
        });
      }).observe(tbody, { childList: true, subtree: true });
    }
  }

  document.addEventListener('click', handleTaskNavigation, true);
  ensureTaskChrome('tarefas');
  ensureTaskChrome('tarefa-analise');
  structureExecutionWorkspace();
  normalizeLobby();
  observeApplication();
  selectCategory(selectedCategory);
  updateShell();
})();
