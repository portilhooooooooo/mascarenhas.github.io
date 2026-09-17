(() => {
  'use strict';

  const form = document.querySelector('#payment-receipt-form');
  if (!form) return;

  const card = document.querySelector('#payment-receipt-card');
  const empty = document.querySelector('#payment-receipt-empty');
  const errorBox = document.querySelector('#payment-receipt-error');
  const uncertainField = document.querySelector('#payment-uncertain-field');
  const liquidatedField = document.querySelector('#payment-liquidated-field');
  const refusedField = document.querySelector('#payment-refused-field');
  const wrongDeadlineField = document.querySelector('#payment-wrong-deadline-field');
  const historyDialog = document.querySelector('#payment-receipt-history-dialog');

  const statusLabels = {
    incerto: 'Incerto', liquidado: 'Liquidado', pagamento_recusado: 'Pagamento recusado',
  };
  let activeTask = null;
  let activeProcess = null;
  let processCache = [];
  let currentUser = null;
  let queuePage = 0;

  const radioValue = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value || null;
  const clearRadio = (name) => form.querySelectorAll(`input[name="${name}"]`).forEach((input) => { input.checked = false; });
  const canManage = () => Boolean(currentUser?.permissions?.['tasks.manage']);
  const escapeHtml = (value) => { const el = document.createElement('span'); el.textContent = value ?? ''; return el.innerHTML; };
  function showError(message) {
    errorBox.textContent = message;
    errorBox.hidden = false;
    errorBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }

  function hideConditionalFields() {
    liquidatedField.hidden = true;
    refusedField.hidden = true;
    wrongDeadlineField.hidden = true;
  }

  function resetForm() {
    form.reset();
    uncertainField.hidden = true;
    hideConditionalFields();
    errorBox.hidden = true;
    errorBox.textContent = '';
    document.querySelector('#payment-reason-count').textContent = '0';
  }

  function showResolvedFlow(resolved) {
    hideConditionalFields();
    if (resolved === 'liquidado') liquidatedField.hidden = false;
    if (resolved === 'pagamento_recusado') refusedField.hidden = false;
    if (resolved === 'prazo_aberto_equivocadamente') wrongDeadlineField.hidden = false;
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function taskHealth(task = activeTask) {
    if (!task?.deadline_at) return { key: 'on_time', label: 'Em dia' };
    const deadline = new Date(task.deadline_at);
    if (Number.isNaN(deadline.getTime())) return { key: 'on_time', label: 'Em dia' };
    const lateMs = Date.now() - deadline.getTime();
    if (lateMs <= 0) return { key: 'on_time', label: 'Em dia' };
    if (lateMs >= 48 * 60 * 60 * 1000 || task.priority === 'high') return { key: 'critical', label: 'Crítico' };
    return { key: 'overdue', label: 'Atraso' };
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
    document.querySelector('#payment-task-deadline').textContent = activeTask?.deadline_at ? new Date(activeTask.deadline_at).toLocaleString('pt-BR') : 'Não informado';
    const participantNames = activeTask?.participant_names || [];
    document.querySelector('#payment-task-assignee').textContent = activeTask?.responsible_name || (participantNames.length ? participantNames.join(', ') : 'Não atribuído');
  }

  function queuePageSize() {
    const available = Math.max(190, window.innerHeight - 480);
    return Math.max(3, Math.min(7, Math.floor(available / 68)));
  }
  function taskUrgent() {
    if (!activeTask) return false;
    if (activeTask.priority === 'high') return true;
    if (!activeTask.deadline_at) return false;
    const deadline = new Date(activeTask.deadline_at);
    if (Number.isNaN(deadline.getTime())) return false;
    return deadline.getTime() - Date.now() <= 24 * 60 * 60 * 1000;
  }

  function filteredProcesses() {
    const search = document.querySelector('#payment-process-search')?.value.trim().toLowerCase() || '';
    const assignment = document.querySelector('#payment-assignment-filter')?.value || 'mine';
    const urgency = document.querySelector('#payment-urgency-filter')?.value || 'pending';
    const health = taskHealth();

    return processCache.filter((process) => {
      const matchesSearch = !search || `${process.case_number || ''} ${process.folder || ''}`.toLowerCase().includes(search);
      const mine = !canManage() || activeTask?.responsible_id === currentUser?.id || process.assignee_id === currentUser?.id;
      const matchesAssignment = assignment === 'all' ? true : mine;
      const pending = process.status !== 'completed';
      const matchesUrgency = urgency === 'pending' ? pending
        : urgency === 'overdue' ? pending && ['overdue', 'critical'].includes(health.key)
          : pending && taskUrgent();
      return matchesSearch && matchesAssignment && matchesUrgency;
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

    list.innerHTML = visible.map((process) => `
      <button class="process-item ${activeProcess?.id === process.id ? 'selected' : ''}" data-payment-process-id="${process.id}">
        <span><i data-lucide="receipt-text"></i></span>
        <div><strong>${escapeHtml(process.case_number || '—')}</strong><small>${escapeHtml(process.folder || 'Pasta não informada')}</small></div>
        <em>${process.status === 'completed' ? 'Concluído' : 'Pendente'}</em>
      </button>`).join('') || '<div class="process-list-empty">Nenhuma tarefa encontrada.</div>';

    pagination.hidden = processes.length <= size;
    document.querySelector('#payment-process-prev').disabled = queuePage === 0;
    document.querySelector('#payment-process-next').disabled = queuePage >= pages - 1;
    document.querySelector('#payment-process-page-label').textContent = processes.length ? `${start + 1}–${Math.min(start + size, processes.length)} de ${processes.length}` : '0 de 0';
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
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
    badge.textContent = statusLabels[initial] || initial || '—';
    badge.className = `payment-status ${initial}`;

    if (initial === 'incerto') uncertainField.hidden = false;
    else showResolvedFlow(initial);
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  async function refreshTask(preferredProcessId = null) {
    const freshTask = await window.MBA_API.request(`/api/tasks/${activeTask.id}`);
    activeTask = { ...activeTask, ...freshTask };
    processCache = await window.MBA_API.request(`/api/tasks/${activeTask.id}/processes`);
    const preferred = preferredProcessId ? processCache.find((process) => process.id === preferredProcessId && process.status !== 'completed') : null;
    const next = preferred || processCache.find((process) => process.status !== 'completed') || null;
    renderProcess(next);
  }

  async function openPaymentReceiptTask(task) {
    activeTask = task;
    queuePage = 0;
    const assignment = document.querySelector('#payment-assignment-filter');
    const allOption = assignment?.querySelector('option[value="all"]');
    if (allOption) allOption.hidden = !canManage();
    if (assignment) assignment.value = canManage() ? 'all' : 'mine';
    await refreshTask();
    window.showPage('comprovante-execucao');
  }

  window.openPaymentReceiptTask = openPaymentReceiptTask;
  form.querySelectorAll('input[name="resolved_status"]').forEach((input) => {
    input.addEventListener('change', () => {
      clearRadio('liquidated_result');
      clearRadio('retry_decision');
      form.elements.wrong_deadline_reason.value = '';
      document.querySelector('#payment-reason-count').textContent = '0';
      showResolvedFlow(input.value);
    });
  });

  form.elements.wrong_deadline_reason.addEventListener('input', (event) => {
    document.querySelector('#payment-reason-count').textContent = event.target.value.length;
  });

  function buildPayload() {
    const initial = activeProcess?.initial_status;
    const resolved = initial === 'incerto' ? radioValue('resolved_status') : initial;
    const hadBlockRaw = radioValue('had_block');
    if (!resolved) throw new Error('Informe a situação identificada.');
    if (hadBlockRaw === null) throw new Error('Informe se houve bloqueio.');

    const payload = { resolved_status: resolved, liquidated_result: null, retry_decision: null, wrong_deadline_reason: null, had_block: hadBlockRaw === 'true' };
    if (resolved === 'liquidado') {
      payload.liquidated_result = radioValue('liquidated_result');
      if (!payload.liquidated_result) throw new Error('Selecione a devolutiva do pagamento liquidado.');
    }
    if (resolved === 'pagamento_recusado') {
      payload.retry_decision = radioValue('retry_decision');
      if (!payload.retry_decision) throw new Error('Informe se solicitaremos novamente o pagamento.');
    }
    if (resolved === 'prazo_aberto_equivocadamente') {
      payload.wrong_deadline_reason = form.elements.wrong_deadline_reason.value.trim();
      if (!payload.wrong_deadline_reason) throw new Error('A justificativa é obrigatória.');
    }
    return payload;
  }
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!activeProcess) return;
    const submit = form.querySelector('[type="submit"]');
    errorBox.hidden = true;
    submit.disabled = true;
    try {
      await window.MBA_API.request(`/api/task-processes/${activeProcess.id}/comprovante_pagamento-analysis`, {
        method: 'POST', body: JSON.stringify(buildPayload()),
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
      await window.MBA_API.request(`/api/task-processes/${activeProcess.id}/skip`, { method: 'POST', body: '{}' });
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

  document.querySelector('#payment-process-prev')?.addEventListener('click', () => { queuePage -= 1; renderQueue(); });
  document.querySelector('#payment-process-next')?.addEventListener('click', () => { queuePage += 1; renderQueue(); });
  document.querySelector('#payment-process-search')?.addEventListener('input', () => { queuePage = 0; renderQueue(); });
  document.querySelector('#payment-assignment-filter')?.addEventListener('change', () => { queuePage = 0; renderQueue(); });
  document.querySelector('#payment-urgency-filter')?.addEventListener('change', () => { queuePage = 0; renderQueue(); });
  function renderHistory() {
    const body = document.querySelector('#payment-history-body');
    const completed = processCache.filter((process) => process.status === 'completed');
    body.innerHTML = completed.length ? completed.map((process) => `
      <div class="payment-history-row">
        <strong>${escapeHtml(process.case_number || '—')}</strong>
        <span>${escapeHtml(process.folder || '—')}</span>
        <span>${escapeHtml(statusLabels[process.initial_status] || process.initial_status || '—')}</span>
      </div>`).join('') : '<div class="payment-receipt-empty"><p>Nenhum caso analisado nesta tarefa.</p></div>';
  }

  document.querySelector('#payment-receipt-history')?.addEventListener('click', () => {
    renderHistory();
    historyDialog?.showModal();
  });
  document.querySelector('#payment-history-close')?.addEventListener('click', () => historyDialog?.close());
  document.querySelector('#payment-history-footer-close')?.addEventListener('click', () => historyDialog?.close());

  function updateTaskDialogHelp() {
    const isPayment = document.querySelector('#task-type')?.value === 'comprovante_pagamento';
    const help = document.querySelector('#payment-receipt-file-help');
    if (help) help.hidden = !isPayment;
  }

  window.addEventListener('mba:authenticated', (event) => {
    currentUser = event.detail;
    updateTaskDialogHelp();
  });
  document.querySelector('#task-type')?.addEventListener('change', updateTaskDialogHelp);
  window.addEventListener('resize', () => {
    if (document.querySelector('#comprovante-execucao')?.classList.contains('active')) renderQueue();
  });
  updateTaskDialogHelp();
})();
