(() => {
  'use strict';

  const NAV_ID = 'tasks-workspace-nav';
  const STORAGE_KEY = 'mba-tasks-category';
  const TASK_CONTEXT_PAGES = new Set(['tarefas', 'tarefa-analise', 'acordo-execucao', 'protocolo']);
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

  function buildNav() {
    let nav = document.getElementById(NAV_ID);
    if (nav) return nav;

    nav = document.createElement('nav');
    nav.id = NAV_ID;
    nav.className = 'tasks-workspace-nav';
    nav.setAttribute('aria-label', 'Filtrar tarefas por módulo');
    nav.innerHTML = `<div class="tasks-workspace-tabs">
      ${Object.entries(CATEGORY_LABELS).map(([key, label]) => `
        <button type="button" class="tasks-workspace-tab" data-tasks-category="${key}" aria-pressed="false">
          <span>${label}</span><em data-task-count="${key}">0</em>
        </button>`).join('')}
    </div>`;

    const content = document.querySelector('main.content');
    content?.prepend(nav);

    nav.addEventListener('click', (event) => {
      const button = event.target.closest('[data-tasks-category]');
      if (!button) return;
      const category = button.dataset.tasksCategory;
      selectCategory(category);
      if (category === 'protocolo') {
        window.showPage?.('protocolo');
      } else {
        window.showPage?.('tarefas');
      }
      updateShell();
    });

    return nav;
  }

  function updateNavCounts() {
    const counts = taskCounts();
    for (const [category, count] of Object.entries(counts)) {
      const node = document.querySelector(`[data-task-count="${category}"]`);
      if (node) node.textContent = String(count);
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
      empty.innerHTML = '<td colspan="6"><div class="tasks-category-empty"><i data-lucide="inbox"></i><strong>Nenhuma tarefa nesta fila</strong><span>Quando houver tarefas atribuídas deste módulo, elas aparecerão aqui.</span></div></td>';
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
    document.querySelectorAll('[data-tasks-category]').forEach((button) => {
      const active = button.dataset.tasksCategory === category;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    applyTaskFilter();
  }

  function currentPage() {
    return document.querySelector('.page.active')?.id || '';
  }

  function normalizePageHeading() {
    const title = document.querySelector('#tarefas .page-title h1');
    const subtitle = document.querySelector('#tarefas .page-title p');
    if (title && title.textContent.trim() === 'Lobby de Tarefas') title.textContent = 'Tarefas';
    if (subtitle) subtitle.textContent = 'Acesse as filas disponíveis e continue a execução dos processos atribuídos.';
  }

  function inferAutoOpenedTaskCategory() {
    if (selectedCategory !== 'all') return;
    const firstTask = parseTaskFromRow(taskRows()[0]);
    if (!firstTask) return;
    const inferred = categoryForType(firstTask.type);
    if (inferred !== 'all') {
      selectedCategory = inferred;
      sessionStorage.setItem(STORAGE_KEY, inferred);
    }
  }

  function updateShell() {
    const pageId = currentPage();
    const inTasks = TASK_CONTEXT_PAGES.has(pageId);
    const nav = buildNav();
    if (nav) nav.hidden = !inTasks;
    document.body.classList.toggle('tasks-workspace-active', inTasks);

    if (!inTasks) return;

    if (pageId === 'protocolo') {
      selectedCategory = 'protocolo';
    } else if (pageId === 'tarefa-analise') {
      inferAutoOpenedTaskCategory();
    } else if (pageId === 'tarefas') {
      normalizePageHeading();
    }

    selectCategory(selectedCategory);
  }

  function interceptTaskOpen(event) {
    const tasksNavItem = event.target.closest('.nav-item[data-page="tarefas"]');
    if (tasksNavItem) {
      selectedCategory = 'all';
      sessionStorage.setItem(STORAGE_KEY, 'all');
      queueMicrotask(updateShell);
      return;
    }

    const button = event.target.closest('[data-task-json]');
    if (!button?.dataset.taskJson) return;
    let task;
    try {
      task = JSON.parse(decodeURIComponent(button.dataset.taskJson));
    } catch (_error) {
      return;
    }

    const category = categoryForType(task.type);
    selectedCategory = category;
    sessionStorage.setItem(STORAGE_KEY, category);

    // Protocolo já possui um módulo funcional próprio. O analisador genérico
    // tentaria chamar /protocolo-analysis, endpoint que não existe. Roteamos
    // explicitamente para o módulo existente para não deixar uma ação quebrada.
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
      new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.type === 'attributes' && mutation.attributeName === 'class')) {
          updateShell();
        }
      }).observe(content, { subtree: true, attributes: true, attributeFilter: ['class'] });
    }

    const tbody = document.getElementById('tasks-table-body');
    if (tbody) {
      new MutationObserver(() => {
        if (!applyingFilter) queueMicrotask(applyTaskFilter);
      }).observe(tbody, { childList: true, subtree: true });
    }
  }

  document.addEventListener('click', interceptTaskOpen, true);
  buildNav();
  observeApplication();
  normalizePageHeading();
  updateShell();
})();
