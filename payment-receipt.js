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
    incerto: 'Incerto',
    liquidado: 'Liquidado',
    pagamento_recusado: 'Pagamento recusado',
  };

  let activeTask = null;
  let activeProcess = null;
  let processCache = [];

  const radioValue = (name) => form.querySelector(`input[name="${name}"]:checked`)?.value || null;
  const clearRadio = (name) => form.querySelectorAll(`input[name="${name}"]`).forEach((input) => { input.checked = false; });

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

  function renderProcess(process) {
    activeProcess = process || null;
    const completed = Number(activeTask?.completed_processes || 0);
    const total = Number(activeTask?.total_processes || 0);
    document.querySelector('#payment-receipt-progress').textContent = `${completed} de ${total} concluídos`;

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

  async function refreshTask() {
    const freshTask = await window.MBA_API.request(`/api/tasks/${activeTask.id}`);
    activeTask = { ...activeTask, ...freshTask };
    processCache = await window.MBA_API.request(`/api/tasks/${activeTask.id}/processes`);
    const next = processCache.find((process) => process.status !== 'completed') || null;
    renderProcess(next);
  }

  async function openPaymentReceiptTask(task) {
    activeTask = task;
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

    const payload = {
      resolved_status: resolved,
      liquidated_result: null,
      retry_decision: null,
      wrong_deadline_reason: null,
      had_block: hadBlockRaw === 'true',
    };

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
      if (!payload.wrong_deadline_reason) throw new Error('A justificativa do prazo aberto equivocadamente é obrigatória.');
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
      const payload = buildPayload();
      await window.MBA_API.request(`/api/task-processes/${activeProcess.id}/comprovante_pagamento-analysis`, {
        method: 'POST',
        body: JSON.stringify(payload),
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

  function renderHistory() {
    const body = document.querySelector('#payment-history-body');
    const completed = processCache.filter((process) => process.status === 'completed');
    body.innerHTML = completed.length ? completed.map((process) => `
      <div class="payment-history-row">
        <strong>${String(process.case_number || '—')}</strong>
        <span>${String(process.folder || '—')}</span>
        <span>${statusLabels[process.initial_status] || process.initial_status || '—'}</span>
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
  document.querySelector('#task-type')?.addEventListener('change', updateTaskDialogHelp);
  window.addEventListener('mba:authenticated', updateTaskDialogHelp);
  updateTaskDialogHelp();
})();
