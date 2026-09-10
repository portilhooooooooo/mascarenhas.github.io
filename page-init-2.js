(() => {
  const dialog = document.getElementById('jobs-dialog');
  const title = document.getElementById('jobs-dialog-title');
  const state = document.getElementById('jobs-dialog-state');
  const tableWrap = document.getElementById('jobs-table-wrap');
  const tbody = document.getElementById('jobs-table-body');
  let activeIntegration = null;

  const integrationLabel = (key) => key === 'liminar' ? 'API de Liminar' : key === 'datajud' ? 'CNJ / DataJud' : 'Automação';
  const close = () => dialog?.close();
  document.getElementById('jobs-dialog-close')?.addEventListener('click', close);
  document.getElementById('jobs-dialog-footer-close')?.addEventListener('click', close);

  document.querySelectorAll('[data-integration-jobs]').forEach((button) => {
    button.addEventListener('click', () => {
      activeIntegration = button.dataset.integrationJobs;
      title.textContent = `Jobs · ${integrationLabel(activeIntegration)}`;
      tbody.innerHTML = '';
      tableWrap.hidden = true;
      state.hidden = false;
      state.innerHTML = '<i data-lucide="loader-circle" class="jobs-loading-icon"></i><strong>Consultando jobs</strong><span>Aguardando os dados da integração.</span>';
      if (window.lucide) window.lucide.createIcons();
      dialog.showModal();
      window.dispatchEvent(new CustomEvent('mba:jobs-request', { detail: { integration: activeIntegration } }));
    });
  });

  window.addEventListener('mba:jobs-loaded', (event) => {
    const detail = event.detail || {};
    if (!dialog?.open || detail.integration !== activeIntegration) return;
    const jobs = Array.isArray(detail.jobs) ? detail.jobs : [];
    tbody.innerHTML = '';
    if (!jobs.length) {
      tableWrap.hidden = true;
      state.hidden = false;
      state.innerHTML = '<i data-lucide="inbox"></i><strong>Nenhum job encontrado</strong><span>Não há execuções registradas para esta automação.</span>';
      if (window.lucide) window.lucide.createIcons();
      return;
    }
    state.hidden = true;
    tableWrap.hidden = false;
    for (const job of jobs) {
      const tr = document.createElement('tr');
      const id = String(job.id ?? job.job_id ?? '—');
      const status = String(job.status ?? '—');
      const statusKey = status.toUpperCase();
      const statusClass = statusKey.startsWith('CONCLU') || statusKey === 'DONE' ? 'done'
        : statusKey.startsWith('ERRO') || statusKey === 'ERROR' ? 'error'
        : statusKey ? 'running' : '';
      const done = job.done ?? job.processed ?? '—';
      const total = job.total ?? '—';
      const updated = String(job.updated_at ?? job.updatedAt ?? '—');
      const download = job.download_url ?? job.downloadUrl ?? '';
      const selectResult = activeIntegration === 'encerramentos' ? `<button class="jobs-download" type="button" data-select-encerramentos-job="${id}">Ver</button>` : '';
      tr.innerHTML = `<td>${id}</td><td><span class="job-status-chip ${statusClass}">${status}</span></td><td>${done} / ${total}</td><td>${updated}</td><td>${selectResult}${download ? `<a class="jobs-download" href="${download}" target="_blank" rel="noopener"><i data-lucide="download"></i>Baixar</a>` : !selectResult ? '<span class="jobs-no-download">—</span>' : ''}</td>`;
      tbody.appendChild(tr);
    }
    if (window.lucide) window.lucide.createIcons();
  });
  tbody.addEventListener('click', (event) => {
    const button = event.target.closest('[data-select-encerramentos-job]');
    if (!button) return;
    window.dispatchEvent(new CustomEvent('mba:encerramentos-job-selected', { detail: { jobId: button.dataset.selectEncerramentosJob } }));
    close();
  });
})();

(() => {
  'use strict';

  const taskDialog = document.getElementById('task-dialog');
  const form = document.getElementById('task-create-form');
  const typeSelect = document.getElementById('task-type');
  const fileInput = document.getElementById('task-file');
  const errorBox = document.getElementById('task-dialog-error');
  const agreementHelp = document.getElementById('agreement-file-help');
  const participants = document.getElementById('agreement-participants');
  const responsibleField = document.getElementById('task-responsible-field');
  if (!taskDialog || !form || !typeSelect || !fileInput) return;

  const baseTypes = {
    base_benner: {
      label: 'Upload - Base do Benner',
      endpoint: '/api/base-processual/benner/importar',
      successName: 'Base do Benner',
    },
    base_cpj: {
      label: 'Upload - Base do CPJ',
      endpoint: '/api/base-processual/cpj/importar',
      successName: 'Base do CPJ',
    },
  };

  const titleInput = form.elements.title;
  const descriptionInput = form.elements.description;
  const titleField = titleInput?.closest('label');
  const descriptionField = descriptionInput?.closest('label');
  const taskGrid = form.querySelector('.dialog-grid');
  const headerCopy = form.querySelector('header p');
  const submit = form.querySelector('footer [type="submit"]');
  const defaultHeaderCopy = headerCopy?.textContent || 'Crie o lote e importe os processos por XLSX ou CSV.';
  const defaultAgreementHelp = agreementHelp?.textContent || 'O XLSX deve conter as colunas Processo e Provisão.';

  const currentType = () => String(typeSelect.value || '');
  const isBaseType = (type = currentType()) => Boolean(baseTypes[type]);
  const canImportBases = () => window.MBA_CURRENT_USER?.permissions?.['bases.import'] === true;

  function removeLegacyRows() {
    document.querySelectorAll('[data-base-upload-task]').forEach((row) => row.remove());
  }

  function syncOptions() {
    const allowed = canImportBases();
    Object.entries(baseTypes).forEach(([value, config]) => {
      let option = typeSelect.querySelector(`option[value="${value}"]`);
      if (allowed && !option) {
        option = document.createElement('option');
        option.value = value;
        option.textContent = config.label;
        typeSelect.appendChild(option);
      } else if (!allowed && option) {
        if (typeSelect.value === value) typeSelect.value = 'liminar';
        option.remove();
      }
    });
  }

  function syncMode() {
    const type = currentType();
    const baseMode = isBaseType(type);

    if (titleField) titleField.hidden = baseMode;
    if (descriptionField) descriptionField.hidden = baseMode;
    if (taskGrid) taskGrid.hidden = baseMode;
    if (responsibleField) responsibleField.hidden = baseMode || type === 'acordos';
    if (participants) participants.hidden = baseMode || type !== 'acordos';

    if (titleInput) titleInput.required = !baseMode;
    fileInput.accept = baseMode ? '.xlsx' : '.xlsx,.csv';

    if (agreementHelp) {
      agreementHelp.hidden = type !== 'acordos' && !baseMode;
      agreementHelp.textContent = baseMode
        ? 'Envie a planilha XLSX bruta da execução mais recente.'
        : defaultAgreementHelp;
    }

    if (headerCopy) {
      headerCopy.textContent = baseMode
        ? `Importe a ${baseTypes[type].successName.toLowerCase()} para atualizar a base processual.`
        : defaultHeaderCopy;
    }
    if (submit) submit.textContent = baseMode ? 'Importar base' : 'Criar e importar';
    if (errorBox) errorBox.hidden = true;
  }

  async function submitBase(event) {
    const type = currentType();
    if (!isBaseType(type)) return;

    event.preventDefault();
    event.stopImmediatePropagation();

    const config = baseTypes[type];
    const file = fileInput.files?.[0];
    if (!canImportBases()) {
      errorBox.textContent = 'Você não possui permissão para importar bases.';
      errorBox.hidden = false;
      return;
    }
    if (!(file instanceof File) || !/\.xlsx$/i.test(file.name)) {
      errorBox.textContent = 'Selecione uma planilha XLSX.';
      errorBox.hidden = false;
      return;
    }

    const originalLabel = submit.textContent;
    submit.disabled = true;
    submit.textContent = 'Importando…';
    errorBox.hidden = true;

    const body = new FormData();
    body.append('file', file);
    try {
      const result = await window.MBA_API.request(config.endpoint, { method: 'POST', body });
      const imported = result?.importacao?.valid_rows;
      const total = result?.importacao?.total_rows;
      const rejected = result?.importacao?.rejected_rows;
      form.reset();
      syncMode();
      taskDialog.close();
      const summary = Number.isFinite(Number(imported))
        ? `${imported} linha(s) válida(s)${Number.isFinite(Number(total)) ? ` de ${total}` : ''}${Number(rejected) ? `; ${rejected} rejeitada(s)` : ''}.`
        : 'Importação concluída.';
      window.alert(`${config.successName} importada com sucesso. ${summary}`);
    } catch (error) {
      const messages = {
        401: 'Sua sessão expirou. Entre novamente.',
        403: 'Você não possui permissão para importar bases.',
        409: 'Este arquivo já foi importado.',
        413: 'O arquivo excede o limite permitido.',
      };
      errorBox.textContent = messages[error.status] || error.message || 'Não foi possível importar a base.';
      errorBox.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = originalLabel;
    }
  }

  typeSelect.addEventListener('change', syncMode);
  form.addEventListener('submit', submitBase, true);
  document.getElementById('new-task-button')?.addEventListener('click', () => {
    syncOptions();
    syncMode();
  });
  taskDialog.addEventListener('close', () => {
    if (!isBaseType()) syncMode();
  });

  window.addEventListener('mba:authenticated', () => {
    removeLegacyRows();
    syncOptions();
    syncMode();
  });
  window.addEventListener('mba:session-expired', () => {
    removeLegacyRows();
    syncOptions();
  });

  removeLegacyRows();
  syncOptions();
  syncMode();
})();
