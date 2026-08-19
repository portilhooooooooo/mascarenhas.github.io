(() => {
  'use strict';

  const rootLabels = { alega_nao_fez: 'Alega que não fez', revisao_juros: 'Revisão de Juros', exibitoria: 'Exibitória', alteracao_domicilio_bancario: 'Alteração de Domicílio Bancário', orgaos_protecao_credito: 'Órgãos de Proteção ao Crédito', venda_enganosa: 'Venda Enganosa' };
  const obfLabels = { nulidade: 'Nulidade', exibicao: 'Exibição', alteracao_domicilio_bancario: 'Alteração de domicílio bancário', retirar_restricao_orgaos_protecao_credito: 'Retirar restrição dos órgãos de proteção ao crédito', revisao_juros: 'Revisão de Juros' };
  // Somente pré-visualização. O texto persistido e exportado sempre vem do backend.
  const obligationPreview = { nulidade: 'Liquidaremos o contrato objeto da lide.', exibicao: 'Exibiremos os documentos ativos discutidos na lide.', alteracao_domicilio_bancario: 'Colocaremos uma trava nos nossos sistemas que impedem o benefício de voltar ao Banco Agibank.', retirar_restricao_orgaos_protecao_credito: 'Procederemos com a retirada do nome da autora dos órgãos de proteção ao crédito.', revisao_juros: 'Liquidaremos o contrato.' };
  const statusLabels = { pending: 'Pendente', in_progress: 'Em execução', completed: 'Concluído' };
  const phaseLabels = { pre_agreement: 'Acordo prévio', post_agreement: 'Acordo pós' };
  let agreementPage = 1;
  let activeTask = null;
  let activeProcess = null;
  let filterTimer = null;

  const escapeHtml = (value) => { const span = document.createElement('span'); span.textContent = value ?? ''; return span.innerHTML; };
  const currency = (value) => value == null || value === '' ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(value));
  const date = (value, withTime = false) => value ? new Intl.DateTimeFormat('pt-BR', withTime ? { dateStyle: 'short', timeStyle: 'short' } : { timeZone: 'UTC' }).format(new Date(value.length === 10 ? `${value}T12:00:00Z` : value)) : '—';
  const boolFromForm = (form, name) => { const value = new FormData(form).get(name); return value === null ? null : value === 'true'; };
  const moneyToApi = (value) => String(value || '').trim().replace(/R\$\s*/i, '').replace(/\./g, '').replace(',', '.');

  function filters() {
    const params = new URLSearchParams({ page: agreementPage, page_size: 20 });
    const fields = {
      processo: '#agreements-search', status: '#agreements-status', resultado: '#agreements-result', retorno: '#agreements-return', responsavel: '#agreements-responsible',
      causa_raiz: '#agreements-root-cause', obf: '#agreements-obf', data_inicio: '#agreements-start-date', data_fim: '#agreements-end-date', task_id: '#agreements-task-id', job_id: '#agreements-job-id',
    };
    Object.entries(fields).forEach(([key, selector]) => { const value = document.querySelector(selector)?.value.trim(); if (value) params.set(key, value); });
    return params;
  }

  function renderRows(rows) {
    return rows.map((row) => `<tr>
      <td><strong>${escapeHtml(row.case_number)}</strong></td><td>${currency(row.provision_amount)}</td><td><span class="agreement-status">${escapeHtml(statusLabels[row.status] || row.status || '—')}</span></td>
      <td>${row.result ? `<span class="agreement-result-badge ${row.result}">${row.result === 'eligible' ? 'Apto' : 'Inapto'}</span>` : '—'}</td><td>${escapeHtml(row.return_reason || '—')}</td>
      <td>${escapeHtml(rootLabels[row.root_cause] || row.root_cause || '—')}</td><td>${escapeHtml(obfLabels[row.obf_type] || row.obf_type || (row.has_obf === false ? 'Não há' : '—'))}</td>
      <td>${currency(row.suggested_amount)}</td><td>${currency(row.outstanding_balance)}</td><td>${date(row.payment_deadline_date)}</td><td>${row.payment_term_business_days == null ? '—' : `${row.payment_term_business_days} dias corridos`}</td>
      <td>${row.obligation_term_business_days == null ? '—' : `${row.obligation_term_business_days} dias úteis`}</td><td>${escapeHtml(phaseLabels[row.phase] || row.phase || '—')}</td><td>${date(row.completed_at, true)}</td><td>${escapeHtml(row.responsible_user?.name || '—')}</td>
    </tr>`).join('');
  }

  async function loadAgreements(resetPage = false) {
    if (!window.MBA_API) return;
    if (resetPage) agreementPage = 1;
    const state = document.querySelector('#agreements-state'); const wrap = document.querySelector('#agreements-table-wrap');
    state.hidden = false; state.textContent = 'Carregando acordos...'; wrap.hidden = true;
    try {
      const query = filters();
      const [summary, list] = await Promise.all([
        window.MBA_API.request(`/api/agreements/summary?${query}`),
        window.MBA_API.request(`/api/agreements?${query}`),
      ]);
      document.querySelector('#agreements-total').textContent = summary.total ?? 0;
      document.querySelector('#agreements-pending').textContent = summary.pending ?? 0;
      document.querySelector('#agreements-completed').textContent = summary.eligible ?? summary.completed ?? 0;
      document.querySelector('#agreements-ineligible').textContent = summary.ineligible ?? 0;
      document.querySelector('#agreements-average').textContent = currency(summary.average_suggested_amount);
      if (!list.rows?.length) {
        state.textContent = query.toString().includes('=') ? 'Nenhum acordo encontrado para os filtros informados.' : 'Nenhum acordo disponível.';
      } else {
        document.querySelector('#agreements-table-body').innerHTML = renderRows(list.rows);
        state.hidden = true; wrap.hidden = false;
      }
      const first = list.total ? (list.page - 1) * list.page_size + 1 : 0; const last = Math.min(list.total, list.page * list.page_size);
      document.querySelector('#agreements-pagination-label').textContent = list.total ? `Mostrando ${first} a ${last} de ${list.total} acordos` : 'Nenhum acordo';
      document.querySelector('#agreements-pagination').innerHTML = list.total_pages > 1 ? `<button type="button" data-agreement-page="${Math.max(1, list.page - 1)}" ${list.page === 1 ? 'disabled' : ''}>Anterior</button><button type="button" data-agreement-page="${Math.min(list.total_pages, list.page + 1)}" ${list.page === list.total_pages ? 'disabled' : ''}>Próxima</button>` : '';
    } catch (error) {
      state.hidden = false; state.textContent = error.status === 403 ? 'Você não possui acesso ao módulo Acordos.' : 'Não foi possível carregar os acordos.';
    }
  }
  window.loadAgreements = loadAgreements;

  async function exportAgreements() {
    const button = document.querySelector('#agreements-export'); const original = button.innerHTML; button.disabled = true; button.textContent = 'Exportando...';
    try {
      if (window.MBA_LOCAL_PREVIEW) {
        await new Promise((resolve) => setTimeout(resolve, 500));
        window.alert('Prévia local: no ambiente integrado, o XLSX filtrado é gerado pelo backend e baixado aqui.');
        return;
      }
      const response = await window.MBA_AUTOMATION_API.fetch(`/api/agreements/export?${filters()}`);
      if (!response.ok) throw new Error('Não foi possível exportar os acordos.');
      const url = URL.createObjectURL(await response.blob()); const link = document.createElement('a'); link.href = url; link.download = 'acordos.xlsx'; link.click(); URL.revokeObjectURL(url);
    } catch (error) { window.alert(error.message); } finally { button.disabled = false; button.innerHTML = original; window.lucide?.createIcons(); }
  }

  async function loadParticipants() {
    const container = document.querySelector('#agreement-participant-options');
    try {
      const users = await window.MBA_API.request('/api/users');
      const eligible = users.filter((user) => user.active && (user.role !== 'task_worker' || user.task_access_enabled));
      container.innerHTML = eligible.length ? eligible.map((user) => `<label><input type="checkbox" name="participant_user_ids" value="${escapeHtml(user.id)}"><span>${escapeHtml(user.name || user.email)}</span></label>`).join('') : '<span>Nenhum usuário apto disponível.</span>';
    } catch (_error) { container.innerHTML = '<span>Não foi possível carregar os participantes.</span>'; }
  }
  window.loadAgreementParticipants = loadParticipants;

  function updateTaskFields() {
    const isAgreement = document.querySelector('#task-type')?.value === 'acordos';
    document.querySelector('#agreement-participants').hidden = !isAgreement;
    document.querySelector('#task-responsible-field').hidden = isAgreement;
    document.querySelector('#agreement-file-help').hidden = !isAgreement;
    document.querySelector('#task-file').accept = isAgreement ? '.xlsx' : '.xlsx,.csv';
    if (isAgreement) loadParticipants();
  }

  function resetAgreementForm() {
    const form = document.querySelector('#agreement-analysis-form'); form.reset();
    document.querySelector('#agreement-impediment-field').hidden = true;
    document.querySelector('#agreement-defense-field').hidden = true;
    document.querySelector('#agreement-eligible-fields').hidden = true;
    document.querySelector('#agreement-ineligible').hidden = true;
    document.querySelector('#agreement-obf-type-field').hidden = true;
    document.querySelector('#agreement-obligation').hidden = true;
    document.querySelector('#agreement-result-summary').hidden = true;
    document.querySelector('#agreement-analysis-error').hidden = true;
    document.querySelector('#agreement-provision-alert').hidden = true;
    document.querySelector('#agreement-balance-alert').hidden = true;
    setLiveEligibility(null);
  }

  async function requestNextProcess() {
    resetAgreementForm();
    const next = await window.MBA_API.request(`/api/tasks/${activeTask.id}/next`, { method: 'POST', body: '{}' });
    if (!next || next.process === null) {
      document.querySelector('#agreement-process-card').hidden = true;
      document.querySelector('#agreement-task-finished').hidden = false;
      return;
    }
    activeProcess = await window.MBA_API.request(`/api/task-processes/${next.id}/agreement`);
    document.querySelector('#agreement-process-card').hidden = false;
    document.querySelector('#agreement-task-finished').hidden = true;
    document.querySelector('#agreement-case-number').textContent = activeProcess.case_number;
    document.querySelector('#agreement-provision').textContent = currency(activeProcess.provision_amount);
    const ownCompleted = activeTask.completed_processes || 0;
    document.querySelector('#agreement-task-progress').textContent = `${ownCompleted} de ${activeTask.total_processes || 0} concluídos`;
    updateAnalysisFlow();
  }

  async function openAgreementTask(task) {
    activeTask = task; activeProcess = null;
    document.querySelector('#agreement-task-progress').textContent = `${task.completed_processes || 0} de ${task.total_processes || 0} concluídos`;
    window.showPage('acordo-execucao');
    try { await requestNextProcess(); } catch (error) { window.alert(error.message); }
  }
  window.openAgreementTask = openAgreementTask;

  function setLiveEligibility(state, reason = '') {
    const result = document.querySelector('#agreement-live-result');
    result.className = `agreement-live-result ${state || 'pending'}`;
    if (state === 'eligible') { result.querySelector('strong').textContent = 'Apto para acordo'; result.querySelector('span').textContent = 'Sem impeditivos identificados.'; }
    else if (state === 'ineligible') { result.querySelector('strong').textContent = 'Inapto para acordo'; result.querySelector('span').textContent = reason; }
    else { result.querySelector('strong').textContent = 'Aguardando respostas'; result.querySelector('span').textContent = 'Responda às perguntas impeditivas.'; }
  }

  function updateAnalysisFlow() {
    const form = document.querySelector('#agreement-analysis-form');
    const judgment = boolFromForm(form, 'has_judgment'); const impediment = boolFromForm(form, 'has_impediment_12'); const defense = boolFromForm(form, 'has_defense_presented');
    const impedimentField = document.querySelector('#agreement-impediment-field'); const defenseField = document.querySelector('#agreement-defense-field'); const eligible = document.querySelector('#agreement-eligible-fields'); const ineligible = document.querySelector('#agreement-ineligible');
    impedimentField.hidden = judgment !== false;
    defenseField.hidden = !(judgment === false && impediment === false);
    const balance = Number(moneyToApi(form.elements.outstanding_balance.value));
    const balanceExceeded = Number.isFinite(balance) && balance > 15000;
    const blocked = judgment === true || impediment === true || defense === false || balanceExceeded;
    ineligible.hidden = !blocked;
    const reason = judgment === true ? 'Possui sentença.' : impediment === true ? 'Possui Termo de Impedimento 12. Abrir MAN no CPJ para manifestarmos o documento.' : defense === false ? 'Não possui defesa apresentada nos autos.' : 'Saldo devedor superior a R$ 15.000,00.';
    if (blocked) { ineligible.querySelector('span').textContent = `Inapto para acordo — ${reason}`; setLiveEligibility('ineligible', reason); }
    else if (judgment === false && impediment === false && defense === true) setLiveEligibility('eligible');
    else setLiveEligibility(null);
    eligible.hidden = !(judgment === false && impediment === false && defense === true);
    const hasObf = boolFromForm(form, 'has_obf'); const typeField = document.querySelector('#agreement-obf-type-field'); const obligation = document.querySelector('#agreement-obligation');
    typeField.hidden = hasObf !== true; obligation.hidden = hasObf === null;
    if (hasObf === false) obligation.querySelector('p').textContent = 'Não há';
    if (hasObf === true) obligation.querySelector('p').textContent = obligationPreview[form.elements.obf_type.value] || 'Selecione o tipo de OBF.';
    const suggested = Number(moneyToApi(form.elements.suggested_amount.value)); const provision = Number(activeProcess?.provision_amount);
    const alert = document.querySelector('#agreement-provision-alert');
    const exceeds = Number.isFinite(suggested) && Number.isFinite(provision) && suggested > provision;
    alert.hidden = !exceeds;
    if (exceeds) alert.textContent = 'Oferecemos o valor da provisão. Caso seja um caso sensível, alertar a gestão.';
    const offerAmount = Number.isFinite(suggested) && Number.isFinite(provision) ? Math.min(suggested, provision) : null;
    document.querySelector('#agreement-offer-amount').textContent = offerAmount === null ? '—' : currency(offerAmount);
    document.querySelector('#agreement-balance-alert').hidden = !(Number.isFinite(balance) && balance > 15000);
  }

  async function submitAnalysis(event) {
    event.preventDefault(); const form = event.currentTarget; const error = document.querySelector('#agreement-analysis-error'); const submit = form.querySelector('[type="submit"]');
    const hasJudgment = boolFromForm(form, 'has_judgment'); const hasImpediment = boolFromForm(form, 'has_impediment_12'); const hasDefense = boolFromForm(form, 'has_defense_presented');
    if (hasJudgment === null || (hasJudgment === false && hasImpediment === null) || (hasJudgment === false && hasImpediment === false && hasDefense === null)) return;
    const payload = { has_judgment: hasJudgment, has_impediment_12: hasJudgment ? false : hasImpediment, has_defense_presented: hasJudgment || hasImpediment ? false : hasDefense };
    if (!payload.has_judgment && !payload.has_impediment_12 && payload.has_defense_presented) {
      payload.root_cause = form.elements.root_cause.value; payload.has_obf = boolFromForm(form, 'has_obf'); payload.obf_type = payload.has_obf ? form.elements.obf_type.value : null;
      const typedAmount = Number(moneyToApi(form.elements.suggested_amount.value)); const provision = Number(activeProcess.provision_amount);
      payload.suggested_amount = Number.isFinite(typedAmount) && Number.isFinite(provision) ? String(Math.min(typedAmount, provision)) : moneyToApi(form.elements.suggested_amount.value);
      payload.outstanding_balance = moneyToApi(form.elements.outstanding_balance.value);
      if (!payload.root_cause || payload.has_obf === null || (payload.has_obf && !payload.obf_type) || !payload.suggested_amount || !payload.outstanding_balance) { error.textContent = 'Preencha os campos obrigatórios antes de continuar.'; error.hidden = false; return; }
    }
    error.hidden = true; submit.disabled = true;
    try {
      const result = await window.MBA_AUTOMATION_API.request(`/api/task-processes/${activeProcess.id}/agreement-analysis`, { method: 'POST', body: JSON.stringify(payload) });
      if (result.result === 'eligible') {
        const summary = document.querySelector('#agreement-result-summary'); summary.hidden = false;
        summary.querySelector('[data-summary="offer"]').textContent = currency(result.offer_amount || result.suggested_amount);
        summary.querySelector('[data-summary="balance"]').textContent = currency(result.outstanding_balance);
        summary.querySelector('[data-summary="deadline"]').textContent = date(result.payment_deadline_date);
        summary.querySelector('[data-summary="payment-term"]').textContent = `${result.payment_term_business_days} dias corridos`;
        summary.querySelector('[data-summary="obligation"]').textContent = result.obligation_to_do || obligationPreview[payload.obf_type] || 'Não há';
        summary.querySelector('[data-summary="obligation-term"]').textContent = `${result.obligation_term_business_days} dias úteis`;
        summary.querySelector('[data-summary="phase"]').textContent = phaseLabels[result.phase] || result.phase;
        await new Promise((resolve) => setTimeout(resolve, 650));
      }
      activeTask.completed_processes = (activeTask.completed_processes || 0) + 1;
      await requestNextProcess();
    } catch (caught) { error.textContent = caught.message; error.hidden = false; } finally { submit.disabled = false; }
  }

  document.querySelector('#task-type')?.addEventListener('change', updateTaskFields);
  document.querySelector('#agreements-more-button')?.addEventListener('click', () => { const panel = document.querySelector('#agreements-more-filters'); panel.hidden = !panel.hidden; });
  document.querySelector('#agreements-export')?.addEventListener('click', exportAgreements);
  document.querySelector('#agreements-pagination')?.addEventListener('click', (event) => { const button = event.target.closest('[data-agreement-page]'); if (!button) return; agreementPage = Number(button.dataset.agreementPage); loadAgreements(); });
  ['#agreements-status','#agreements-result','#agreements-root-cause','#agreements-obf','#agreements-start-date','#agreements-end-date'].forEach((selector) => document.querySelector(selector)?.addEventListener('change', () => loadAgreements(true)));
  ['#agreements-search','#agreements-return','#agreements-responsible','#agreements-task-id','#agreements-job-id'].forEach((selector) => document.querySelector(selector)?.addEventListener('input', () => { clearTimeout(filterTimer); filterTimer = setTimeout(() => loadAgreements(true), 350); }));
  document.querySelector('#agreement-analysis-form')?.addEventListener('change', updateAnalysisFlow);
  document.querySelector('#agreement-analysis-form input[name="suggested_amount"]')?.addEventListener('input', updateAnalysisFlow);
  document.querySelector('#agreement-analysis-form input[name="outstanding_balance"]')?.addEventListener('input', updateAnalysisFlow);
  document.querySelector('#agreement-analysis-form')?.addEventListener('submit', submitAnalysis);
  document.querySelector('#agreement-skip')?.addEventListener('click', async () => { if (!activeProcess) return; try { await window.MBA_API.request(`/api/task-processes/${activeProcess.id}/skip`, { method: 'POST', body: '{}' }); await requestNextProcess(); } catch (error) { window.alert(error.message); } });
  document.querySelector('#agreement-analysis-form select[name="obf_type"]')?.addEventListener('change', updateAnalysisFlow);

  window.addEventListener('mba:authenticated', (event) => {
    if (event.detail.permissions?.['agreements.view']) loadAgreements(true);
    updateTaskFields();
  });
})();
