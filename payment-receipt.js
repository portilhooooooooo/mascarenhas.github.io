(() => {
  'use strict';

  const form = document.querySelector('#payment-receipt-form');
  if (!form) return;

  const TASK_TYPE_LABELS = {
    comprovante_pagamento: 'Validar Pagamento',
    liminar: 'Validar Liminar',
    acordos: 'Saneamento de Acordos',
    encerramento: 'Validar Encerramento',
    bloqueio: 'Validar Bloqueio',
    citacao: 'Validar Citação',
    protocolo: 'Protocolar',
  };
  const TASK_CONTEXT_PAGES = new Set(['tarefas', 'tarefa-analise', 'comprovante-execucao', 'acordo-execucao']);
  const EXECUTION_PAGES = new Set(['tarefa-analise', 'comprovante-execucao', 'acordo-execucao']);
  const LAST_TASK_TYPE_KEY = 'mba-last-task-type';

  const card = document.querySelector('#payment-receipt-card');
  const empty = document.querySelector('#payment-receipt-empty');
  const statusLabels = {
    incerto: 'Incerto',
    liquidado: 'Liquidado',
    pagamento_recusado: 'Pagamento recusado',
  };

  let activeTask = null;
  let activeProcess = null;
  let processCache = [];
  let currentUser = null;
  let queuePage = 0;

  const escapeHtml = (value) => {
    const el = document.createElement('span');
    el.textContent = value ?? '';
    return el.innerHTML;
  };
  const radioValue = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value || null;
  const clearRadio = (name) => form.querySelectorAll(`input[name="${name}"]`).forEach((input) => { input.checked = false; });

  function taskTypeLabel(type) {
    return TASK_TYPE_LABELS[String(type || '').toLowerCase()] || 'Executar tarefa';
  }

  function parseTaskButton(button) {
    if (!button?.dataset.taskJson) return null;
    try {
      return JSON.parse(decodeURIComponent(button.dataset.taskJson));
    } catch (_error) {
      return null;
    }
  }

  function currentPageId() {
    return document.querySelector('.page.active')?.id || '';
  }

  function ensureTaskModuleNav() {
    let nav = document.querySelector('#tasks-module-nav');
    if (nav) return nav;

    nav = document.createElement('nav');
    nav.id = 'tasks-module-nav';
    nav.className = 'tasks-module-nav';
    nav.hidden = true;
    nav.setAttribute('aria-label', 'Navegação do módulo de tarefas');
    nav.innerHTML = `
      <button type="button" data-task-module-tab="management">Gestão</button>
      <button type="button" data-task-module-tab="execution">Tarefas</button>
    `;

    document.querySelector('main.content')?.prepend(nav);

    nav.addEventListener('click', (event) => {
      const button = event.target.closest('[data-task-module-tab]');
      if (!button) return;

      if (button.dataset.taskModuleTab === 'management') {
        window.showPage?.('tarefas');
        updateTaskModuleNav();
        return;
      }

      const pageId = currentPageId();
      if (EXECUTION_PAGES.has(pageId)) return;

      const preferredType = sessionStorage.getItem(LAST_TASK_TYPE_KEY);
      const buttons = [...document.querySelectorAll('#tasks-table-body [data-task-json]')];
      const preferred = buttons.find((candidate) => parseTaskButton(candidate)?.type === preferredType);
      const first = preferred || buttons[0];
      first?.click();
    });

    return nav;
  }

  function normalizeManagementHeading() {
    const title = document.querySelector('#tarefas .page-title h1');
    const subtitle = document.querySelector('#tarefas .page-title p');
    if (title) title.textContent = 'Gestão de Tarefas';
    if (subtitle) subtitle.textContent = 'Crie, distribua e acompanhe os lotes operacionais.';
  }

  function updateTaskModuleNav() {
    const nav = ensureTaskModuleNav();
    const pageId = currentPageId();
    const inTasks = TASK_CONTEXT_PAGES.has(pageId);

    nav.hidden = !inTasks;
    document.body.classList.toggle('tasks-module-active', inTasks);

    if (!inTasks) return;

    const management = pageId === 'tarefas';
    nav.querySelector('[data-task-module-tab="management"]')?.classList.toggle('active', management);
    nav.querySelector('[data-task-module-tab="execution"]')?.classList.toggle('active', !management);

    normalizeManagementHeading();
  }

  function observeTaskPages() {
    document.querySelectorAll('.page').forEach((page) => {
      new MutationObserver((mutations) => {
        if (mutations.some((mutation) => mutation.attributeName === 'class')) {
          queueMicrotask(updateTaskModuleNav);
        }
      }).observe(page, { attributes: true, attributeFilter: ['class'] });
    });

    const tbody = document.querySelector('#tasks-table-body');
    if (tbody) {
      new MutationObserver(() => queueMicrotask(populateTaskTypeFilter))
        .observe(tbody, { childList: true, subtree: true });
    }
  }

  function installPaymentWorkspaceChrome() {
    document.querySelector('#payment-receipt-history')?.remove();
    document.querySelector('#payment-receipt-history-dialog')?.remove();

    const heading = document.querySelector('#comprovante-execucao .payment-receipt-heading > div');
    if (heading) {
      heading.innerHTML = `
        <small class="task-execution-kicker">Tarefa atual</small>
        <h1 id="payment-task-type-title">Validar Pagamento</h1>
        <p id="payment-task-context">Comprovante de Pagamento</p>
      `;
    }

    const listTitle = document.querySelector('#comprovante-execucao .payment-process-list h2');
    if (listTitle) listTitle.textContent = 'Minhas tarefas';

    const typeFilter = document.querySelector('#payment-assignment-filter');
    if (typeFilter) {
      typeFilter.setAttribute('aria-label', 'Tipo de tarefa');
      typeFilter.title = 'Tipo de tarefa';
    }

    const statusFilter = document.querySelector('#payment-urgency-filter');
    if (statusFilter) {
      statusFilter.setAttribute('aria-label', 'Status dos processos');
      statusFilter.title = 'Status';
      statusFilter.innerHTML = `
        <option value="pending">Pendentes</option>
        <option value="completed">Concluídas</option>
        <option value="overdue">Em atraso</option>
      `;
    }

    document.querySelectorAll('#tarefa-analise .back-link, #comprovante-execucao .back-link, #acordo-execucao .back-link')
      .forEach((node) => { node.hidden = true; });
  }

  function installPaymentFlowMarkup() {
    form.innerHTML = `
      <fieldset class="payment-question payment-primary-question">
        <legend>Foi pago?</legend>
        <p>Confirme primeiro se o pagamento foi efetivado.</p>
        <div class="payment-choice-grid payment-choice-grid-two">
          <label>
            <input type="radio" name="payment_status" value="pago">
            <span><i data-lucide="badge-check"></i><b>Foi pago</b><small>Pagamento efetivado</small></span>
          </label>
          <label>
            <input type="radio" name="payment_status" value="nao_pago">
            <span><i data-lucide="circle-x"></i><b>Não foi pago</b><small>Pagamento ainda não efetivado</small></span>
          </label>
        </div>
      </fieldset>

      <fieldset class="payment-question" id="payment-paid-field" hidden>
        <legend>Comprovante</legend>
        <div class="payment-choice-grid payment-choice-grid-two">
          <label>
            <input type="radio" name="paid_receipt" value="com_comprovante">
            <span><i data-lucide="file-check"></i><b>Com comprovante</b></span>
          </label>
          <label>
            <input type="radio" name="paid_receipt" value="sem_comprovante">
            <span><i data-lucide="file-x"></i><b>Sem comprovante</b></span>
          </label>
        </div>
      </fieldset>

      <fieldset class="payment-question" id="payment-manifested-field" hidden>
        <legend>Manifestado nos autos?</legend>
        <div class="binary-choice payment-binary-choice">
          <label><input type="radio" name="manifested_in_court" value="true"><span>Sim</span></label>
          <label><input type="radio" name="manifested_in_court" value="false"><span>Não</span></label>
        </div>
      </fieldset>

      <label class="payment-reason-field" id="payment-manifestation-reason-field" hidden>
        <span>Justificativa</span>
        <textarea name="manifestation_reason" maxlength="2000" rows="3" placeholder="Informe por que o comprovante ainda não foi manifestado nos autos..."></textarea>
        <small><span id="payment-reason-count">0</span>/2000</small>
      </label>

      <fieldset class="payment-question" id="payment-unpaid-field" hidden>
        <legend>Situação do pagamento</legend>
        <div class="payment-choice-grid">
          <label>
            <input type="radio" name="unpaid_status" value="em_aprovacao">
            <span><i data-lucide="clock-3"></i><b>Em aprovação</b></span>
          </label>
          <label>
            <input type="radio" name="unpaid_status" value="erro_emissao">
            <span><i data-lucide="triangle-alert"></i><b>Erro na Emissão</b></span>
          </label>
          <label>
            <input type="radio" name="unpaid_status" value="negado_banco">
            <span><i data-lucide="landmark"></i><b>Negado pelo Banco</b></span>
          </label>
        </div>
      </fieldset>

      <fieldset class="payment-question" id="payment-requested-again-field" hidden>
        <legend>Solicitado novamente?</legend>
        <div class="binary-choice payment-binary-choice">
          <label><input type="radio" name="requested_again" value="true"><span>Sim</span></label>
          <label><input type="radio" name="requested_again" value="false"><span>Não</span></label>
        </div>
      </fieldset>

      <fieldset class="payment-question payment-block-field">
        <legend>Houve bloqueio?</legend>
        <div class="binary-choice payment-binary-choice">
          <label><input type="radio" name="had_block" value="true"><span>Sim</span></label>
          <label><input type="radio" name="had_block" value="false"><span>Não</span></label>
        </div>
      </fieldset>

      <p class="payment-receipt-error" id="payment-receipt-error" hidden></p>

      <footer>
        <button class="secondary-button" id="payment-receipt-skip" type="button">Pular e voltar depois</button>
        <button class="primary-button" type="submit" data-permission="tasks.execute">Salvar e próximo<i data-lucide="arrow-right"></i></button>
      </footer>
    `;
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  installPaymentWorkspaceChrome();
  installPaymentFlowMarkup();
  ensureTaskModuleNav();
  normalizeManagementHeading();
  observeTaskPages();
  updateTaskModuleNav();

  const errorBox = document.querySelector('#payment-receipt-error');
  const paidField = document.querySelector('#payment-paid-field');
  const manifestedField = document.querySelector('#payment-manifested-field');
  const manifestationReasonField = document.querySelector('#payment-manifestation-reason-field');
  const unpaidField = document.querySelector('#payment-unpaid-field');
  const requestedAgainField = document.querySelector('#payment-requested-again-field');

  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hide(node) {
    if (node) node.hidden = true;
  }

  function show(node) {
    if (node) node.hidden = false;
  }

  function resetConditionalFlow() {
    hide(paidField);
    hide(manifestedField);
    hide(manifestationReasonField);
    hide(unpaidField);
    hide(requestedAgainField);
    clearRadio('paid_receipt');
    clearRadio('manifested_in_court');
    clearRadio('unpaid_status');
    clearRadio('requested_again');
    if (form.elements.manifestation_reason) form.elements.manifestation_reason.value = '';
    const count = document.querySelector('#payment-reason-count');
    if (count) count.textContent = '0';
  }

  function resetForm() {
    form.reset();
    resetConditionalFlow();
    errorBox.hidden = true;
    errorBox.textContent = '';
  }

  function syncPaymentFlow() {
    const paymentStatus = radioValue('payment_status');
    const paidReceipt = radioValue('paid_receipt');
    const manifested = radioValue('manifested_in_court');
    const unpaidStatus = radioValue('unpaid_status');

    hide(paidField);
    hide(manifestedField);
    hide(manifestationReasonField);
    hide(unpaidField);
    hide(requestedAgainField);

    if (paymentStatus === 'pago') {
      show(paidField);
      if (paidReceipt === 'com_comprovante') {
        show(manifestedField);
        if (manifested === 'false') show(manifestationReasonField);
      }
    }

    if (paymentStatus === 'nao_pago') {
      show(unpaidField);
      if (unpaidStatus === 'erro_emissao' || unpaidStatus === 'negado_banco') {
        show(requestedAgainField);
      }
    }

    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  form.querySelectorAll('input[name="payment_status"]').forEach((input) => {
    input.addEventListener('change', () => {
      clearRadio('paid_receipt');
      clearRadio('manifested_in_court');
      clearRadio('unpaid_status');
      clearRadio('requested_again');
      if (form.elements.manifestation_reason) form.elements.manifestation_reason.value = '';
      const count = document.querySelector('#payment-reason-count');
      if (count) count.textContent = '0';
      syncPaymentFlow();
    });
  });
  form.querySelectorAll('input[name="paid_receipt"]').forEach((input) => {
    input.addEventListener('change', () => {
      clearRadio('manifested_in_court');
      if (form.elements.manifestation_reason) form.elements.manifestation_reason.value = '';
      syncPaymentFlow();
    });
  });
  form.querySelectorAll('input[name="manifested_in_court"]').forEach((input) => input.addEventListener('change', syncPaymentFlow));
  form.querySelectorAll('input[name="unpaid_status"]').forEach((input) => {
    input.addEventListener('change', () => {
      clearRadio('requested_again');
      syncPaymentFlow();
    });
  });

  form.elements.manifestation_reason?.addEventListener('input', (event) => {
    document.querySelector('#payment-reason-count').textContent = event.target.value.length;
  });

  function taskHealth(task = activeTask) {
    if (!task?.deadline_at) return { key: 'on_time', label: 'Em dia' };
    const deadline = new Date(task.deadline_at);
    if (Number.isNaN(deadline.getTime())) return { key: 'on_time', label: 'Em dia' };
    const lateMs = Date.now() - deadline.getTime();
    if (lateMs <= 0) return { key: 'on_time', label: 'Em dia' };
    if (lateMs >= 48 * 60 * 60 * 1000 || task.priority === 'high') return { key: 'critical', label: 'Crítico' };
    return { key: 'overdue', label: 'Em atraso' };
  }

  function businessDaysUntil(value) {
    if (!value) return 1;
    const end = new Date(value);
    if (Number.isNaN(end.getTime())) return 1;
    const cursor = new Date();
    cursor.setHours(0, 0, 0, 0);
    end.setHours(0, 0, 0, 0);
    if (end < cursor) return 1;
    let count = 0;
    while (cursor <= end) {
      const day = cursor.getDay();
      if (day !== 0 && day !== 6) count += 1;
      cursor.setDate(cursor.getDate() + 1);
    }
    return Math.max(1, count);
  }

  function sameLocalDay(value, reference = new Date()) {
    if (!value) return false;
    const date = new Date(value);
    return date.getFullYear() === reference.getFullYear()
      && date.getMonth() === reference.getMonth()
      && date.getDate() === reference.getDate();
  }

  function updateTaskMeta() {
    const pending = processCache.filter((process) => process.status !== 'completed').length;
    const doneToday = processCache.filter((process) => process.status === 'completed' && sameLocalDay(process.updated_at)).length;
    const goal = pending ? Math.max(1, Math.ceil(pending / businessDaysUntil(activeTask?.deadline_at))) : 0;

    document.querySelector('#payment-daily-goal').textContent = goal ? `${doneToday} de ${goal}` : `${doneToday} hoje`;
    document.querySelector('#payment-daily-progress').style.width = goal ? `${Math.min(100, Math.round((doneToday / goal) * 100))}%` : '100%';

    const health = taskHealth();
    const healthEl = document.querySelector('#payment-task-health');
    healthEl.className = `payment-task-health ${health.key}`;
    healthEl.innerHTML = `<i class="status-dot"></i><span>${health.label}</span>`;
    document.querySelector('#payment-task-deadline').textContent = activeTask?.deadline_at
      ? new Date(activeTask.deadline_at).toLocaleString('pt-BR')
      : 'Não informado';

    const participantNames = activeTask?.participant_names || [];
    document.querySelector('#payment-task-assignee').textContent =
      activeTask?.responsible_name || (participantNames.length ? participantNames.join(', ') : 'Não atribuído');

    const taskTitle = document.querySelector('#payment-task-type-title');
    const taskContext = document.querySelector('#payment-task-context');
    if (taskTitle) taskTitle.textContent = taskTypeLabel(activeTask?.type || 'comprovante_pagamento');
    if (taskContext) taskContext.textContent = activeTask?.title || 'Comprovante de Pagamento';
  }

  function queuePageSize() {
    const available = Math.max(190, window.innerHeight - 470);
    return Math.max(3, Math.min(7, Math.floor(available / 68)));
  }

  function filteredProcesses() {
    const search = document.querySelector('#payment-process-search')?.value.trim().toLowerCase() || '';
    const status = document.querySelector('#payment-urgency-filter')?.value || 'pending';
    const health = taskHealth();

    return processCache.filter((process) => {
      const matchesSearch = !search || `${process.case_number || ''} ${process.folder || ''}`.toLowerCase().includes(search);
      const completed = process.status === 'completed';
      const matchesStatus = status === 'completed'
        ? completed
        : status === 'overdue'
          ? !completed && ['overdue', 'critical'].includes(health.key)
          : !completed;
      return matchesSearch && matchesStatus;
    });
  }

  function renderQueue() {
    const list = document.querySelector('#payment-process-items');
    const pagination = document.querySelector('#payment-process-pagination');
    if (!list || !pagination) return;

    const processes = filteredProcesses();
    const size = queuePageSize();
    const pages = Math.max(1, Math.ceil(processes.length / size));
    queuePage = Math.min(Math.max(queuePage, 0), pages - 1);
    const start = queuePage * size;
    const visible = processes.slice(start, start + size);

    list.innerHTML = visible.map((process) => {
      const completed = process.status === 'completed';
      return `
        <button class="process-item ${activeProcess?.id === process.id ? 'selected' : ''}" data-payment-process-id="${process.id}">
          <span><i data-lucide="${completed ? 'circle-check' : 'receipt-text'}"></i></span>
          <div><strong>${escapeHtml(process.case_number || '—')}</strong><small>${escapeHtml(process.folder || 'Pasta não informada')}</small></div>
          <em>${completed ? 'Concluída' : 'Pendente'}</em>
        </button>`;
    }).join('') || '<div class="process-list-empty">Nenhum processo encontrado para este filtro.</div>';

    pagination.hidden = processes.length <= size;
    document.querySelector('#payment-process-prev').disabled = queuePage === 0;
    document.querySelector('#payment-process-next').disabled = queuePage >= pages - 1;
    document.querySelector('#payment-process-page-label').textContent = processes.length
      ? `${start + 1}–${Math.min(start + size, processes.length)} de ${processes.length}`
      : '0 de 0';

    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function setFormReadOnly(readOnly) {
    form.querySelectorAll('input, textarea, button[type="submit"]').forEach((control) => {
      control.disabled = readOnly;
    });
    form.classList.toggle('is-readonly', readOnly);
  }

  function renderProcess(process) {
    activeProcess = process || null;
    updateTaskMeta();
    renderQueue();

    if (!activeProcess) {
      card.hidden = true;
      empty.hidden = false;
      window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
      return;
    }

    card.hidden = false;
    empty.hidden = true;
    resetForm();

    document.querySelector('#payment-receipt-case-number').textContent = activeProcess.case_number || '—';
    document.querySelector('#payment-receipt-folder').textContent = activeProcess.folder || '—';

    const initial = activeProcess.initial_status || '';
    const badge = document.querySelector('#payment-receipt-initial-status');
    badge.textContent = activeProcess.status === 'completed'
      ? 'Concluída'
      : (statusLabels[initial] || initial || 'Pendente');
    badge.className = `payment-status ${activeProcess.status === 'completed' ? 'completed' : initial}`;

    setFormReadOnly(activeProcess.status === 'completed');
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function availableTaskTypes() {
    const buttons = [...document.querySelectorAll('#tasks-table-body [data-task-json]')];
    const seen = new Set();
    const types = [];

    for (const button of buttons) {
      const task = parseTaskButton(button);
      if (!task?.type || seen.has(task.type)) continue;
      seen.add(task.type);
      types.push(task.type);
    }

    if (activeTask?.type && !seen.has(activeTask.type)) types.unshift(activeTask.type);
    return types;
  }

  function populateTaskTypeFilter() {
    const select = document.querySelector('#payment-assignment-filter');
    if (!select) return;

    const types = availableTaskTypes();
    if (!types.length) {
      select.innerHTML = '<option value="comprovante_pagamento">Validar Pagamento</option>';
      select.value = activeTask?.type || 'comprovante_pagamento';
      return;
    }

    select.innerHTML = types
      .map((type) => `<option value="${escapeHtml(type)}">${escapeHtml(taskTypeLabel(type))}</option>`)
      .join('');

    if (activeTask?.type && types.includes(activeTask.type)) select.value = activeTask.type;
  }

  async function refreshTask(preferredProcessId = null) {
    const freshTask = await window.MBA_API.request(`/api/tasks/${activeTask.id}`);
    activeTask = { ...activeTask, ...freshTask };
    processCache = await window.MBA_API.request(`/api/tasks/${activeTask.id}/processes`);

    const preferred = preferredProcessId
      ? processCache.find((process) => process.id === preferredProcessId && process.status !== 'completed')
      : null;
    const next = preferred || processCache.find((process) => process.status !== 'completed') || processCache[0] || null;

    populateTaskTypeFilter();
    renderProcess(next);
  }

  async function openPaymentReceiptTask(task) {
    activeTask = task;
    queuePage = 0;
    sessionStorage.setItem(LAST_TASK_TYPE_KEY, task.type || 'comprovante_pagamento');
    await refreshTask();
    window.showPage('comprovante-execucao');
    queueMicrotask(updateTaskModuleNav);
  }

  window.openPaymentReceiptTask = openPaymentReceiptTask;

  document.querySelector('#payment-assignment-filter')?.addEventListener('change', (event) => {
    const type = event.target.value;
    if (!type || type === activeTask?.type) return;

    sessionStorage.setItem(LAST_TASK_TYPE_KEY, type);
    const button = [...document.querySelectorAll('#tasks-table-body [data-task-json]')]
      .find((candidate) => parseTaskButton(candidate)?.type === type);
    button?.click();
  });

  document.querySelector('#payment-urgency-filter')?.addEventListener('change', () => {
    queuePage = 0;
    const visible = filteredProcesses();
    const preferred = visible.find((process) => process.id === activeProcess?.id) || visible[0] || null;
    renderProcess(preferred);
  });

  function buildPayload() {
    const paymentStatus = radioValue('payment_status');
    const hadBlockRaw = radioValue('had_block');

    if (!paymentStatus) throw new Error('Informe se o pagamento foi efetuado.');
    if (hadBlockRaw === null) throw new Error('Informe se houve bloqueio.');

    const payload = {
      workflow_version: 2,
      payment_status: paymentStatus,
      paid_receipt: null,
      manifested_in_court: null,
      manifestation_reason: null,
      unpaid_status: null,
      requested_again: null,
      had_block: hadBlockRaw === 'true',

      resolved_status: paymentStatus === 'pago' ? 'liquidado' : 'pagamento_recusado',
      liquidated_result: null,
      retry_decision: null,
      wrong_deadline_reason: null,
    };

    if (paymentStatus === 'pago') {
      payload.paid_receipt = radioValue('paid_receipt');
      if (!payload.paid_receipt) throw new Error('Informe se há comprovante.');

      payload.liquidated_result = payload.paid_receipt;

      if (payload.paid_receipt === 'com_comprovante') {
        const manifestedRaw = radioValue('manifested_in_court');
        if (manifestedRaw === null) throw new Error('Informe se o comprovante foi manifestado nos autos.');

        payload.manifested_in_court = manifestedRaw === 'true';

        if (!payload.manifested_in_court) {
          payload.manifestation_reason = form.elements.manifestation_reason.value.trim();
          if (!payload.manifestation_reason) throw new Error('A justificativa é obrigatória quando ainda não houve manifestação.');
        }
      }
    }

    if (paymentStatus === 'nao_pago') {
      payload.unpaid_status = radioValue('unpaid_status');
      if (!payload.unpaid_status) throw new Error('Informe a situação do pagamento não efetuado.');

      if (payload.unpaid_status === 'erro_emissao' || payload.unpaid_status === 'negado_banco') {
        const requestedAgainRaw = radioValue('requested_again');
        if (requestedAgainRaw === null) throw new Error('Informe se o pagamento foi solicitado novamente.');

        payload.requested_again = requestedAgainRaw === 'true';
        payload.retry_decision = payload.requested_again
          ? 'solicitaremos_novamente'
          : 'nao_solicitaremos_novamente';
      }
    }

    return payload;
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!activeProcess || activeProcess.status === 'completed') return;

    const submit = form.querySelector('[type="submit"]');
    errorBox.hidden = true;
    submit.disabled = true;

    try {
      await window.MBA_API.request(`/api/task-processes/${activeProcess.id}/comprovante_pagamento-analysis`, {
        method: 'POST',
        body: JSON.stringify(buildPayload()),
      });
      await refreshTask();
      window.loadTasks?.();
    } catch (error) {
      showError(error.message || 'Não foi possível salvar a análise.');
    } finally {
      submit.disabled = false;
    }
  });

  document.querySelector('#payment-receipt-skip')?.addEventListener('click', async () => {
    if (!activeProcess) return;

    const button = document.querySelector('#payment-receipt-skip');
    button.disabled = true;
    errorBox.hidden = true;

    try {
      await window.MBA_API.request(`/api/task-processes/${activeProcess.id}/skip`, {
        method: 'POST',
        body: '{}',
      });
      await refreshTask();
    } catch (error) {
      showError(error.message || 'Não foi possível pular o processo.');
    } finally {
      button.disabled = false;
    }
  });

  document.querySelector('#payment-process-items')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-payment-process-id]');
    if (!button) return;
    const process = processCache.find((item) => item.id === button.dataset.paymentProcessId);
    if (process) renderProcess(process);
  });

  document.querySelector('#payment-process-prev')?.addEventListener('click', () => {
    queuePage -= 1;
    renderQueue();
  });
  document.querySelector('#payment-process-next')?.addEventListener('click', () => {
    queuePage += 1;
    renderQueue();
  });
  document.querySelector('#payment-process-search')?.addEventListener('input', () => {
    queuePage = 0;
    renderQueue();
  });

  function updateTaskDialogHelp() {
    const isPayment = document.querySelector('#task-type')?.value === 'comprovante_pagamento';
    const help = document.querySelector('#payment-receipt-file-help');
    if (help) help.hidden = !isPayment;
  }

  window.addEventListener('mba:authenticated', (event) => {
    currentUser = event.detail;
    updateTaskDialogHelp();
    populateTaskTypeFilter();
  });
  document.querySelector('#task-type')?.addEventListener('change', updateTaskDialogHelp);

  window.addEventListener('resize', () => {
    if (document.querySelector('#comprovante-execucao')?.classList.contains('active')) renderQueue();
  });

  updateTaskDialogHelp();
  populateTaskTypeFilter();
})();