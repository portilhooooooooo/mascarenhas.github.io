(() => {
  'use strict';

  const STORAGE_KEY = 'mba-tasks-category';
  const CONTROLADORIA_OPEN_KEY = 'mba-controladoria-open';
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

  function navItem(page) {
    return document.querySelector(`.main-nav .nav-item[data-page="${page}"]`);
  }

  function setNavLabel(item, label) {
    const span = item?.querySelector('span');
    if (span) span.textContent = label;
  }

  function createPlaceholder(label, icon) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'nav-item nav-item-muted controladoria-placeholder';
    button.disabled = true;
    button.title = 'Módulo em preparação';
    button.innerHTML = `<i data-lucide="${icon}"></i><span>${label}</span>`;
    return button;
  }

  function configureSidebar() {
    const nav = document.querySelector('.main-nav');
    if (!nav || nav.dataset.controladoriaStructured === 'true') return;

    const dashboard = navItem('dashboard');
    const liminar = navItem('tutelas');
    const tarefas = navItem('tarefas');
    const acordos = navItem('acordos');
    const pagamentos = navItem('pagamentos');
    const protocolo = navItem('protocolo');
    const encerramentos = navItem('encerramentos');
    const automacoes = navItem('automacoes');
    const usuarios = navItem('usuarios');
    const configuracoes = navItem('configuracoes');

    if (!dashboard || !tarefas) return;

    nav.dataset.controladoriaStructured = 'true';

    if (liminar) setNavLabel(liminar, 'Liminar');
    if (protocolo) setNavLabel(protocolo, 'Protocolo');
    if (automacoes) setNavLabel(automacoes, 'Automações');

    // Os placeholders antigos não pertencem à arquitetura aprovada. Mantemos os
    // elementos no DOM para não alterar contratos legados, mas não os exibimos.
    [...nav.querySelectorAll('.nav-item-muted')].forEach((item) => {
      const label = item.textContent.trim();
      if (label !== 'Relatórios') item.hidden = true;
    });

    let group = nav.querySelector('[data-controladoria-group]');
    if (!group) {
      group = document.createElement('div');
      group.className = 'controladoria-nav-group';
      group.dataset.controladoriaGroup = 'true';
      group.innerHTML = `
        <button type="button" class="controladoria-nav-parent" aria-expanded="true">
          <span class="controladoria-parent-icon"><i data-lucide="circle-dot"></i></span>
          <span>Controladoria</span>
          <i class="controladoria-chevron" data-lucide="chevron-down"></i>
        </button>
        <div class="controladoria-nav-children"></div>`;
    }

    const children = group.querySelector('.controladoria-nav-children');
    if (tarefas) children.appendChild(tarefas);
    if (acordos) children.appendChild(acordos);

    const relatorios = [...nav.querySelectorAll('.nav-item-muted')]
      .find((item) => item.textContent.trim() === 'Relatórios');
    if (relatorios) relatorios.hidden = false;

    const subsidios = createPlaceholder('Subsídios', 'files');
    const baseDados = createPlaceholder('Base de dados', 'database');
    const tail = document.createElement('div');
    tail.className = 'sidebar-admin-tail';

    // Reordena apenas elementos existentes; os listeners do app.js continuam
    // conectados aos mesmos nós.
    nav.appendChild(dashboard);
    if (liminar) nav.appendChild(liminar);
    nav.appendChild(group);
    if (pagamentos) nav.appendChild(pagamentos);
    if (protocolo) nav.appendChild(protocolo);
    if (encerramentos) nav.appendChild(encerramentos);
    nav.appendChild(subsidios);
    nav.appendChild(baseDados);
    if (relatorios) nav.appendChild(relatorios);

    if (automacoes) tail.appendChild(automacoes);
    if (usuarios) tail.appendChild(usuarios);
    if (configuracoes) tail.appendChild(configuracoes);
    if (tail.children.length) nav.appendChild(tail);

    const parent = group.querySelector('.controladoria-nav-parent');
    const storedOpen = sessionStorage.getItem(CONTROLADORIA_OPEN_KEY);
    const expanded = storedOpen !== '0';
    group.classList.toggle('collapsed', !expanded);
    parent.setAttribute('aria-expanded', String(expanded));
    parent.addEventListener('click', () => {
      const nextExpanded = group.classList.contains('collapsed');
      group.classList.toggle('collapsed', !nextExpanded);
      parent.setAttribute('aria-expanded', String(nextExpanded));
      sessionStorage.setItem(CONTROLADORIA_OPEN_KEY, nextExpanded ? '1' : '0');
    });

    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
    syncSidebarActive();
  }

  function syncSidebarActive() {
    const pageId = currentPage();
    const group = document.querySelector('[data-controladoria-group]');
    const tarefas = navItem('tarefas');
    const acordos = navItem('acordos');
    if (!group || !tarefas) return;

    const inTasks = pageId === 'tarefas' || pageId === 'tarefa-analise';
    const inAgreements = pageId === 'acordos' || pageId === 'acordo-execucao';
    group.classList.toggle('active', inTasks || inAgreements);

    if (pageId === 'tarefa-analise') tarefas.classList.add('active');
    if (pageId === 'acordo-execucao' && acordos) acordos.classList.add('active');

    if (inTasks || inAgreements) {
      group.classList.remove('collapsed');
      group.querySelector('.controladoria-nav-parent')?.setAttribute('aria-expanded', 'true');
    }
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

    if (!page.querySelector('.controladoria-context-header')) {
      const header = document.createElement('header');
      header.className = 'controladoria-context-header';
      header.innerHTML = `
        <div>
          <h1>Controladoria <span>› Tarefas</span></h1>
          <p>Gestão e análise das tarefas operacionais da carteira.</p>
        </div>`;
      page.prepend(header);
    }

    if (!page.querySelector('.tasks-workspace-nav')) {
      const nav = document.createElement('nav');
      nav.className = 'tasks-workspace-nav';
      nav.setAttribute('aria-label', 'Filtrar tarefas por módulo');
      nav.innerHTML = navMarkup();
      page.querySelector('.controladoria-context-header')?.after(nav);
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
      document.querySelectorAll(`[data-task-count="${category}"]`).forEach((node) => {
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

  function normalizeLobby() {
    const page = document.getElementById('tarefas');
    const titleBlock = page?.querySelector('.page-title > div:first-child');
    if (titleBlock) titleBlock.hidden = true;
    const backLabel = document.querySelector('#tarefa-analise .back-link');
    if (backLabel) backLabel.setAttribute('aria-label', 'Voltar para Tarefas');
  }

  function updateShell() {
    configureSidebar();
    syncSidebarActive();
    ensureTaskChrome('tarefas');
    ensureTaskChrome('tarefa-analise');
    structureExecutionWorkspace();
    normalizeLobby();

    const pageId = currentPage();
    const inTasks = TASK_CONTEXT_PAGES.has(pageId);
    document.body.classList.toggle('tasks-workspace-active', inTasks);

    if (pageId === 'tarefas') applyTaskFilter();
    document.querySelectorAll('[data-tasks-category]').forEach((button) => {
      const active = button.dataset.tasksCategory === selectedCategory;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    updateNavCounts();
  }

  function handleTaskNavigation(event) {
    const categoryButton = event.target.closest('[data-tasks-category]');
    if (categoryButton) {
      selectedCategory = categoryButton.dataset.tasksCategory;
      sessionStorage.setItem(STORAGE_KEY, selectedCategory);
      window.showPage?.('tarefas');
      queueMicrotask(() => {
        selectCategory(selectedCategory);
        updateShell();
      });
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

    // O agente de Protocolo tem uma execução própria. Mantemos o redirecionamento
    // apenas ao executar a tarefa; selecionar a aba Protocolo continua dentro de
    // Controladoria > Tarefas e funciona somente como filtro.
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
  configureSidebar();
  ensureTaskChrome('tarefas');
  ensureTaskChrome('tarefa-analise');
  structureExecutionWorkspace();
  normalizeLobby();
  observeApplication();
  selectCategory(selectedCategory);
  updateShell();
})();
