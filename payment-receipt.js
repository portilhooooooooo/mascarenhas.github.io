(() => {
  'use strict';

  const form = document.querySelector('#payment-receipt-form');
  if (!form) return;

  const LAST_TASK_TYPE_KEY = 'mba-last-task-type';
  const BACKGROUND_REFRESH_MS = 15000;
  const CACHE_WINDOW_SIZE = 5;

  const TASK_TYPE_LABELS = {
    comprovante_pagamento: 'Validação de Comprovante',
    liminar: 'Validação de Liminar',
    acordos: 'Saneamento de Acordos',
    encerramento: 'Validação de Encerramento',
    bloqueio: 'Validação de Bloqueio',
    citacao: 'Validação de Citação',
    protocolo: 'Protocolo',
    contestacao: 'Validação de Contestação',
    reagendamento: 'Validação de Reagendamento',
  };

  const INDICIO_LABELS = {
    incerto: 'Situação incerta',
    liquidado: 'Pagamento identificado',
    pagamento_recusado: 'Pagamento recusado',
    sem_comprovante: 'Sem comprovante',
    com_comprovante: 'Com comprovante',
  };

  const card = document.querySelector('#payment-receipt-card');
  const empty = document.querySelector('#payment-receipt-empty');

  let activeTask = null;
  let activeProcess = null;
  let processCache = [];
  let currentUser = null;
  let queuePage = 0;
  let selectedDeadlineStatus = 'all';
  let selectedTaskType = 'all';
  let backgroundRefreshTimer = null;

  const escapeHtml = (value) => {
    const el = document.createElement('span');
    el.textContent = value ?? '';
    return el.innerHTML;
  };

  const radioValue = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value || null;
  const clearRadio = (name) => form.querySelectorAll(`input[name="${name}"]`).forEach((input) => { input.checked = false; });

  function taskTypeLabel(type) {
    return TASK_TYPE_LABELS[String(type || '').toLowerCase()] || 'Tarefa operacional';
  }

  function parseTaskButton(button) {
    if (!button?.dataset.taskJson) return null;
    try {
      return JSON.parse(decodeURIComponent(button.dataset.taskJson));
    } catch (_error) {
      return null;
    }
  }

  function availableTasks() {
    return [...document.querySelectorAll('#tasks-table-body [data-task-json]')]
      .map(parseTaskButton)
      .filter(Boolean);
  }

  function taskHealth(task = activeTask) {
    if (!task || String(task.status || '').toLowerCase() === 'completed') {
      return { key: 'completed', label: 'Concluída' };
    }

    if (!task.deadline_at) return { key: 'pending', label: 'Pendente' };

    const deadline = new Date(task.deadline_at);
    if (Number.isNaN(deadline.getTime())) return { key: 'pending', label: 'Pendente' };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const deadlineDay = new Date(deadline);
    deadlineDay.setHours(0, 0, 0, 0);

    if (deadlineDay < today) return { key: 'overdue', label: 'Em atraso' };
    if (task.priority === 'high' || deadlineDay.getTime() === today.getTime()) {
      return { key: 'urgent', label: 'Urgente' };
    }
    return { key: 'on_time', label: 'Em dia' };
  }

  function processHint(process) {
    const raw = process?.indicio || process?.hint || process?.initial_status || '';
    return INDICIO_LABELS[String(raw).toLowerCase()] || raw || 'Não informado';
  }

  function installWorkspaceChrome() {
    document.querySelector('#payment-receipt-history')?.remove();
    document.querySelector('#payment-receipt-history-dialog')?.remove();
    document.querySelector('#comprovante-execucao .back-link')?.setAttribute('hidden', '');

    const heading = document.querySelector('#comprovante-execucao .payment-receipt-heading > div');
    if (heading) {
      heading.innerHTML = `
        <small class="task-execution-kicker">Tarefa atual</small>
        <h1 id="payment-task-type-title">Validação de Comprovante</h1>
      `;
    }

    const meta = document.querySelector('#comprovante-execucao .payment-task-meta');
    if (meta) {
      const blocks = [...meta.children];
      if (blocks[0]?.querySelector('small')) blocks[0].querySelector('small').textContent = 'Meta do dia';
      if (blocks[1]?.querySelector('small')) blocks[1].querySelector('small').textContent = 'Status';
      if (blocks[2]?.querySelector('small')) blocks[2].querySelector('small').textContent = 'Prazo';
      if (blocks[3]) blocks[3].remove();
    }

    const processList = document.querySelector('#comprovante-execucao .payment-process-list');
    if (processList) {
      processList.innerHTML = `
        <section class="workspace-filter-section">
          <small class="workspace-filter-kicker">Status do prazo</small>
          <div class="workspace-filter-options deadline-status-options" id="payment-deadline-status-filter"></div>
        </section>

        <section class="workspace-filter-section">
          <small class="workspace-filter-kicker">Tipo de tarefa</small>
          <div class="workspace-filter-options" id="payment-task-type-filter"></div>
        </section>

        <section class="workspace-process-section">
          <div class="workspace-process-heading">
            <h2>Processos</h2>
            <small>${CACHE_WINDOW_SIZE} em cache · atualização em segundo plano</small>
          </div>
          <label class="process-search"><i data-lucide="search"></i><input id="payment-process-search" placeholder="Buscar processo ou parte"></label>
          <div id="payment-process-items"></div>
          <div class="process-pagination" id="payment-process-pagination" hidden>
            <button type="button" id="payment-process-prev" aria-label="Processos anteriores"><i data-lucide="chevron-left"></i></button>
            <span id="payment-process-page-label">—</span>
            <button type="button" id="payment-process-next" aria-label="Próximos processos"><i data-lucide="chevron-right"></i></button>
          </div>
        </section>
      `;
    }

    const processHeader = document.querySelector('#payment-receipt-card > header');
    if (processHeader) {
      processHeader.innerHTML = `
        <small>Processo selecionado</small>
        <h2 id="payment-receipt-case-number">—</h2>
        <p class="payment-indicio-line">Indício: <strong id="payment-receipt-indicio">—</strong></p>
        <span class="payment-status" id="payment-receipt-initial-status">—</span>
      `;
    }
  }

  function installPaymentFlowMarkup() {
    form.innerHTML = `
      <fieldset class="payment-question">
        <legend>Foi pago?</legend>
        <p>Confirme se o pagamento foi efetivado.</p>
        <div class="payment-choice-grid payment-choice-grid-two">
          <label><input type="radio" name="payment_status" value="pago"><span><i data-lucide="badge-check"></i><b>Foi pago</b><small>Pagamento efetivado</small></span></label>
          <label><input type="radio" name="payment_status" value="nao_pago"><span><i data-lucide="circle-x"></i><b>Não foi pago</b><small>Pagamento ainda não efetivado</small></span></label>
        </div>
      </fieldset>

      <fieldset class="payment-question" id="payment-paid-field" hidden>
        <legend>Situação do comprovante</legend>
        <div class="payment-choice-grid payment-choice-grid-two">
          <label><input type="radio" name="paid_receipt" value="com_comprovante"><span><i data-lucide="file-check"></i><b>Com comprovante</b><small>Comprovante localizado</small></span></label>
          <label><input type="radio" name="paid_receipt" value="sem_comprovante"><span><i data-lucide="file-x"></i><b>Sem comprovante</b><small>Comprovante não localizado</small></span></label>
        </div>
      </fieldset>

      <fieldset class="payment-question" id="payment-manifested-field" hidden>
        <legend>Manifestado nos autos?</legend>
        <div class="payment-choice-grid payment-choice-grid-two payment-binary-grid">
          <label><input type="radio" name="manifested_in_court" value="true"><span><i data-lucide="check"></i><b>Sim</b><small>Já foi manifestado nos autos</small></span></label>
          <label><input type="radio" name="manifested_in_court" value="false"><span><i data-lucide="x"></i><b>Não</b><small>Ainda não foi manifestado</small></span></label>
        </div>
      </fieldset>

      <label class="payment-reason-field" id="payment-manifestation-reason-field" hidden>
        <span>Justificativa</span>
        <textarea name="manifestation_reason" maxlength="2000" rows="3" placeholder="Informe por que o comprovante ainda não foi manifestado nos autos..."></textarea>
        <small><span id="payment-reason-count">0</span>/2000</small>
      </label>

      <fieldset class="payment-question" id="payment-unpaid-field" hidden>
        <legend>Situação do pagamento</legend>
        <p>Selecione o motivo identificado.</p>
        <div class="payment-choice-grid payment-choice-grid-three">
          <label><input type="radio" name="unpaid_status" value="em_aprovacao"><span><i data-lucide="clock-3"></i><b>Em aprovação</b><small>Aguardando análise do banco</small></span></label>
          <label><input type="radio" name="unpaid_status" value="erro_emissao"><span><i data-lucide="triangle-alert"></i><b>Erro na emissão</b><small>Falha na geração do pagamento</small></span></label>
          <label><input type="radio" name="unpaid_status" value="negado_banco"><span><i data-lucide="landmark"></i><b>Negado pelo banco</b><small>Pagamento recusado pelo banco</small></span></label>
        </div>
      </fieldset>

      <fieldset class="payment-question" id="payment-requested-again-field" hidden>
        <legend>Solicitado novamente?</legend>
        <div class="payment-choice-grid payment-choice-grid-two payment-binary-grid">
          <label><input type="radio" name="requested_again" value="true"><span><i data-lucide="check"></i><b>Sim</b><small>Pagamento solicitado novamente</small></span></label>
          <label><input type="radio" name="requested_again" value="false"><span><i data-lucide="x"></i><b>Não</b><small>Não houve nova solicitação</small></span></label>
        </div>
      </fieldset>

      <fieldset class="payment-question payment-block-field">
        <legend>Houve bloqueio?</legend>
        <div class="payment-choice-grid payment-choice-grid-two payment-binary-grid">
          <label><input type="radio" name="had_block" value="true"><span><i data-lucide="check"></i><b>Sim</b><small>Foi identificado bloqueio relacionado</small></span></label>
          <label><input type="radio" name="had_block" value="false"><span><i data-lucide="x"></i><b>Não</b><small>Não foi identificado bloqueio</small></span></label>
        </div>
      </fieldset>

      <p class="payment-receipt-error" id="payment-receipt-error" hidden></p>
      <footer>
        <button class="secondary-button" id="payment-receipt-skip" type="button">Pular e voltar depois</button>
        <span class="workspace-background-status" id="payment-background-status">Próximo item pré-carregado</span>
        <button class="primary-button" type="submit" data-permission="tasks.execute">Salvar e próximo<i data-lucide="arrow-right"></i></button>
      </footer>
    `;
  }

  installWorkspaceChrome();
  installPaymentFlowMarkup();

  const errorBox = document.querySelector('#payment-receipt-error');
  const paidField = document.querySelector('#payment-paid-field');
  const manifestedField = document.querySelector('#payment-manifested-field');
  const manifestationReasonField = document.querySelector('#payment-manifestation-reason-field');
  const unpaidField = document.querySelector('#payment-unpaid-field');
  const requestedAgainField = document.querySelector('#payment-requested-again-field');

  function showError(message) {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.hidden = false;
  }

  function showSyncError(message) {
    let toast = document.querySelector('#payment-sync-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'payment-sync-toast';
      toast.className = 'task-sync-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 5000);
  }

  function hide(node) { if (node) node.hidden = true; }
  function show(node) { if (node) node.hidden = false; }

  function resetConditionalFlow() {
    [paidField, manifestedField, manifestationReasonField, unpaidField, requestedAgainField].forEach(hide);
    ['paid_receipt', 'manifested_in_court', 'unpaid_status', 'requested_again'].forEach(clearRadio);
    if (form.elements.manifestation_reason) form.elements.manifestation_reason.value = '';
    const count = document.querySelector('#payment-reason-count');
    if (count) count.textContent = '0';
  }

  function resetForm() {
    form.reset();
    resetConditionalFlow();
    if (errorBox) {
      errorBox.hidden = true;
      errorBox.textContent = '';
    }
  }

  function syncPaymentFlow() {
    const paymentStatus = radioValue('payment_status');
    const paidReceipt = radioValue('paid_receipt');
    const manifested = radioValue('manifested_in_court');
    const unpaidStatus = radioValue('unpaid_status');

    [paidField, manifestedField, manifestationReasonField, unpaidField, requestedAgainField].forEach(hide);

    if (paymentStatus === 'pago') {
      show(paidField);
      if (paidReceipt === 'com_comprovante') {
        show(manifestedField);
        if (manifested === 'false') show(manifestationReasonField);
      }
    }

    if (paymentStatus === 'nao_pago') {
      show(unpaidField);
      if (unpaidStatus === 'erro_emissao' || unpaidStatus === 'negado_banco') show(requestedAgainField);
    }

    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  form.querySelectorAll('input[name="payment_status"]').forEach((input) => input.addEventListener('change', () => {
    ['paid_receipt', 'manifested_in_court', 'unpaid_status', 'requested_again'].forEach(clearRadio);
    if (form.elements.manifestation_reason) form.elements.manifestation_reason.value = '';
    syncPaymentFlow();
  }));

  form.querySelectorAll('input[name="paid_receipt"]').forEach((input) => input.addEventListener('change', () => {
    clearRadio('manifested_in_court');
    if (form.elements.manifestation_reason) form.elements.manifestation_reason.value = '';
    syncPaymentFlow();
  }));

  form.querySelectorAll('input[name="manifested_in_court"]').forEach((input) => input.addEventListener('change', syncPaymentFlow));
  form.querySelectorAll('input[name="unpaid_status"]').forEach((input) => input.addEventListener('change', () => {
    clearRadio('requested_again');
    syncPaymentFlow();
  }));

  form.elements.manifestation_reason?.addEventListener('input', (event) => {
    const count = document.querySelector('#payment-reason-count');
    if (count) count.textContent = event.target.value.length;
  });

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

    const goalEl = document.querySelector('#payment-daily-goal');
    if (goalEl) goalEl.textContent = goal ? `${doneToday} de ${goal}` : `${doneToday} hoje`;
    const progressEl = document.querySelector('#payment-daily-progress');
    if (progressEl) progressEl.style.width = goal ? `${Math.min(100, Math.round((doneToday / goal) * 100))}%` : '100%';

    const health = taskHealth();
    const healthEl = document.querySelector('#payment-task-health');
    if (healthEl) {
      healthEl.className = `payment-task-health ${health.key}`;
      healthEl.innerHTML = `<i class="status-dot"></i><span>${health.label}</span>`;
    }

    const deadlineEl = document.querySelector('#payment-task-deadline');
    if (deadlineEl) {
      deadlineEl.textContent = activeTask?.deadline_at
        ? new Date(activeTask.deadline_at).toLocaleDateString('pt-BR')
        : 'Não informado';
    }

    const title = document.querySelector('#payment-task-type-title');
    if (title) title.textContent = taskTypeLabel(activeTask?.type || 'comprovante_pagamento');
  }

  function typeCounts() {
    const map = new Map();
    for (const task of availableTasks()) {
      const pending = Math.max(0, Number(task.total_processes || 0) - Number(task.completed_processes || 0));
      map.set(task.type, (map.get(task.type) || 0) + pending);
    }
    return map;
  }

  function renderTaskTypeFilter() {
    const container = document.querySelector('#payment-task-type-filter');
    if (!container) return;

    const tasks = availableTasks();
    const counts = typeCounts();
    const types = [...new Set(tasks.map((task) => task.type).filter(Boolean))];
    const total = [...counts.values()].reduce((sum, value) => sum + value, 0);

    container.innerHTML = `
      <button type="button" data-payment-task-type="all" class="${selectedTaskType === 'all' ? 'active' : ''}"><span>Todas</span><em>${total}</em></button>
      ${types.map((type) => `<button type="button" data-payment-task-type="${escapeHtml(type)}" class="${selectedTaskType === type ? 'active' : ''}"><span>${escapeHtml(taskTypeLabel(type))}</span><em>${counts.get(type) || 0}</em></button>`).join('')}
    `;
  }

  function renderDeadlineFilter() {
    const container = document.querySelector('#payment-deadline-status-filter');
    if (!container) return;

    const pending = processCache.filter((process) => process.status !== 'completed').length;
    const current = taskHealth();
    const counts = { urgent: 0, overdue: 0, pending: 0, on_time: 0 };
    if (current.key in counts) counts[current.key] = pending;

    const options = [
      ['urgent', 'Urgentes'],
      ['overdue', 'Em atraso'],
      ['pending', 'Pendentes'],
      ['on_time', 'Em dia'],
    ];

    container.innerHTML = options.map(([key, label]) => `
      <button type="button" data-payment-deadline-status="${key}" class="${selectedDeadlineStatus === key ? 'active' : ''}">
        <span><i class="deadline-dot ${key}"></i>${label}</span><em>${counts[key]}</em>
      </button>
    `).join('');
  }

  function filteredProcesses() {
    const search = document.querySelector('#payment-process-search')?.value.trim().toLowerCase() || '';
    const health = taskHealth();

    return processCache.filter((process) => {
      if (process.status === 'completed') return false;
      const searchMatch = !search || `${process.case_number || ''} ${process.party_name || ''} ${processHint(process)}`.toLowerCase().includes(search);
      const deadlineMatch = selectedDeadlineStatus === 'all' || selectedDeadlineStatus === health.key;
      return searchMatch && deadlineMatch;
    });
  }

  function renderQueue() {
    const list = document.querySelector('#payment-process-items');
    const pagination = document.querySelector('#payment-process-pagination');
    if (!list || !pagination) return;

    const processes = filteredProcesses();
    const pages = Math.max(1, Math.ceil(processes.length / CACHE_WINDOW_SIZE));
    queuePage = Math.min(Math.max(queuePage, 0), pages - 1);
    const start = queuePage * CACHE_WINDOW_SIZE;
    const visible = processes.slice(start, start + CACHE_WINDOW_SIZE);
    const health = taskHealth();

    list.innerHTML = visible.map((process) => `
      <button class="process-item workspace-process-item ${activeProcess?.id === process.id ? 'selected' : ''}" data-payment-process-id="${escapeHtml(process.id)}">
        <span><i data-lucide="file-text"></i></span>
        <div>
          <strong>${escapeHtml(process.case_number || '—')}</strong>
          <small>${escapeHtml(taskTypeLabel(activeTask?.type))}</small>
          <small class="process-indicio">Indício: ${escapeHtml(processHint(process))}</small>
        </div>
        <em class="deadline-chip ${health.key}">${escapeHtml(health.label)}</em>
      </button>
    `).join('') || '<div class="process-list-empty">Nenhum processo encontrado para este filtro.</div>';

    pagination.hidden = processes.length <= CACHE_WINDOW_SIZE;
    document.querySelector('#payment-process-prev').disabled = queuePage === 0;
    document.querySelector('#payment-process-next').disabled = queuePage >= pages - 1;
    document.querySelector('#payment-process-page-label').textContent = processes.length
      ? `${start + 1}–${Math.min(start + CACHE_WINDOW_SIZE, processes.length)} de ${processes.length}`
      : '0 de 0';

    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function setFormReadOnly(readOnly) {
    form.querySelectorAll('input, textarea, button[type="submit"]').forEach((control) => { control.disabled = readOnly; });
    form.classList.toggle('is-readonly', readOnly);
  }

  function renderProcess(process) {
    activeProcess = process || null;
    updateTaskMeta();
    renderDeadlineFilter();
    renderTaskTypeFilter();
    renderQueue();

    if (!activeProcess) {
      if (card) card.hidden = true;
      if (empty) empty.hidden = false;
      return;
    }

    if (card) card.hidden = false;
    if (empty) empty.hidden = true;
    resetForm();

    const caseEl = document.querySelector('#payment-receipt-case-number');
    const indicioEl = document.querySelector('#payment-receipt-indicio');
    const badge = document.querySelector('#payment-receipt-initial-status');
    const health = taskHealth();

    if (caseEl) caseEl.textContent = activeProcess.case_number || '—';
    if (indicioEl) indicioEl.textContent = processHint(activeProcess);
    if (badge) {
      badge.textContent = health.label;
      badge.className = `payment-status deadline-chip ${health.key}`;
    }

    setFormReadOnly(activeProcess.status === 'completed');
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  async function refreshTask(preferredProcessId = null, silent = false) {
    if (!activeTask?.id) return;
    const [freshTask, processes] = await Promise.all([
      window.MBA_API.request(`/api/tasks/${activeTask.id}`),
      window.MBA_API.request(`/api/tasks/${activeTask.id}/processes`),
    ]);

    activeTask = { ...activeTask, ...freshTask };
    processCache = Array.isArray(processes) ? processes : [];

    const preferred = preferredProcessId
      ? processCache.find((process) => String(process.id) === String(preferredProcessId) && process.status !== 'completed')
      : null;
    const next = preferred || processCache.find((process) => process.status !== 'completed') || null;

    if (!silent || !activeProcess || !processCache.some((process) => process.id === activeProcess.id && process.status !== 'completed')) {
      renderProcess(next);
    } else {
      updateTaskMeta();
      renderDeadlineFilter();
      renderTaskTypeFilter();
      renderQueue();
    }
  }

  function scheduleBackgroundRefresh() {
    clearTimeout(backgroundRefreshTimer);
    backgroundRefreshTimer = setTimeout(async () => {
      if (document.querySelector('#comprovante-execucao')?.classList.contains('active') && activeTask?.id) {
        try {
          await refreshTask(activeProcess?.id || null, true);
        } catch (_error) {
          // Atualização silenciosa: mantém o cache atual se a rede falhar.
        }
      }
      scheduleBackgroundRefresh();
    }, BACKGROUND_REFRESH_MS);
  }

  async function openPaymentReceiptTask(task) {
    activeTask = task;
    queuePage = 0;
    selectedTaskType = task?.type || 'comprovante_pagamento';
    selectedDeadlineStatus = taskHealth(task).key;
    sessionStorage.setItem(LAST_TASK_TYPE_KEY, task?.type || 'comprovante_pagamento');
    await refreshTask();
    window.showPage?.('comprovante-execucao');
    scheduleBackgroundRefresh();
  }

  window.openPaymentReceiptTask = openPaymentReceiptTask;

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
        payload.retry_decision = payload.requested_again ? 'solicitaremos_novamente' : 'nao_solicitaremos_novamente';
      }
    }

    return payload;
  }

  function optimisticNextCompleted(processId) {
    const current = processCache.find((process) => String(process.id) === String(processId));
    if (current) {
      current.status = 'completed';
      current.updated_at = new Date().toISOString();
    }
    const next = processCache.find((process) => process.status !== 'completed') || null;
    renderProcess(next);
    return next?.id || null;
  }

  function optimisticSkip(processId) {
    const index = processCache.findIndex((process) => String(process.id) === String(processId));
    if (index >= 0) {
      const [skipped] = processCache.splice(index, 1);
      processCache.push(skipped);
    }
    const next = processCache.find((process) => process.status !== 'completed' && String(process.id) !== String(processId))
      || processCache.find((process) => process.status !== 'completed')
      || null;
    renderProcess(next);
    return next?.id || null;
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    if (!activeProcess || activeProcess.status === 'completed') return;

    let payload;
    try {
      payload = buildPayload();
    } catch (error) {
      showError(error.message);
      return;
    }

    const submittedId = activeProcess.id;
    const nextId = optimisticNextCompleted(submittedId);
    const backgroundStatus = document.querySelector('#payment-background-status');
    if (backgroundStatus) backgroundStatus.textContent = 'Salvando em segundo plano…';

    window.MBA_API.request(`/api/task-processes/${submittedId}/comprovante_pagamento-analysis`, {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(async () => {
      if (backgroundStatus) backgroundStatus.textContent = 'Salvo · próximo item pré-carregado';
      await refreshTask(nextId, true);
      window.loadTasks?.();
    }).catch(async (error) => {
      showSyncError(`Falha ao sincronizar o processo anterior: ${error.message || 'tente novamente'}.`);
      if (backgroundStatus) backgroundStatus.textContent = 'Falha de sincronização';
      try { await refreshTask(activeProcess?.id || null, true); } catch (_error) { /* mantém cache local */ }
    });
  });

  document.querySelector('#payment-receipt-skip')?.addEventListener('click', () => {
    if (!activeProcess) return;
    const skippedId = activeProcess.id;
    const nextId = optimisticSkip(skippedId);
    const backgroundStatus = document.querySelector('#payment-background-status');
    if (backgroundStatus) backgroundStatus.textContent = 'Atualizando fila em segundo plano…';

    window.MBA_API.request(`/api/task-processes/${skippedId}/skip`, {
      method: 'POST',
      body: '{}',
    }).then(async () => {
      if (backgroundStatus) backgroundStatus.textContent = 'Fila atualizada · próximo item pré-carregado';
      await refreshTask(nextId, true);
    }).catch(async (error) => {
      showSyncError(`Falha ao registrar o pulo: ${error.message || 'tente novamente'}.`);
      if (backgroundStatus) backgroundStatus.textContent = 'Falha de sincronização';
      try { await refreshTask(activeProcess?.id || null, true); } catch (_error) { /* mantém cache local */ }
    });
  });

  document.querySelector('#payment-deadline-status-filter')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-payment-deadline-status]');
    if (!button) return;
    selectedDeadlineStatus = button.dataset.paymentDeadlineStatus;
    queuePage = 0;
    renderDeadlineFilter();
    const first = filteredProcesses()[0] || null;
    renderProcess(first);
  });

  document.querySelector('#payment-task-type-filter')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-payment-task-type]');
    if (!button) return;
    const type = button.dataset.paymentTaskType;
    selectedTaskType = type;
    renderTaskTypeFilter();

    if (type === 'all' || type === activeTask?.type) return;
    const task = availableTasks().find((candidate) => candidate.type === type);
    if (!task) return;
    sessionStorage.setItem(LAST_TASK_TYPE_KEY, type);

    const proxy = [...document.querySelectorAll('#tasks-table-body [data-task-json]')]
      .find((candidate) => parseTaskButton(candidate)?.id === task.id);
    proxy?.click();
  });

  document.querySelector('#payment-process-items')?.addEventListener('click', (event) => {
    const button = event.target.closest('[data-payment-process-id]');
    if (!button) return;
    const process = processCache.find((item) => String(item.id) === String(button.dataset.paymentProcessId));
    if (process) renderProcess(process);
  });

  document.querySelector('#payment-process-prev')?.addEventListener('click', () => { queuePage -= 1; renderQueue(); });
  document.querySelector('#payment-process-next')?.addEventListener('click', () => { queuePage += 1; renderQueue(); });
  document.querySelector('#payment-process-search')?.addEventListener('input', () => { queuePage = 0; renderQueue(); });

  function updateTaskDialogHelp() {
    const isPayment = document.querySelector('#task-type')?.value === 'comprovante_pagamento';
    const help = document.querySelector('#payment-receipt-file-help');
    if (help) help.hidden = !isPayment;
  }

  window.addEventListener('mba:authenticated', (event) => {
    currentUser = event.detail;
    updateTaskDialogHelp();
    renderTaskTypeFilter();
  });

  document.querySelector('#task-type')?.addEventListener('change', updateTaskDialogHelp);
  window.addEventListener('resize', () => {
    if (document.querySelector('#comprovante-execucao')?.classList.contains('active')) renderQueue();
  });

  updateTaskDialogHelp();
  renderTaskTypeFilter();
  renderDeadlineFilter();
  window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
})();