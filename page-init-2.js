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

  const definitions = {
    benner: {
      title: 'Upload da base do Benner',
      description: 'Importa o snapshot integral do Benner e atualiza a base processual consolidada.',
      icon: 'database',
    },
    cpj: {
      title: 'Upload da base do CPJ',
      description: 'Importa a relação integral do CPJ e atualiza a auditoria da base processual.',
      icon: 'file-spreadsheet',
    },
  };
  const currentImports = new Map();
  let activeSource = null;
  let observer = null;

  const canUploadBases = () => window.MBA_CURRENT_USER?.permissions?.['bases.import'] === true;
  const tasksBody = () => document.getElementById('tasks-table-body');

  function formatDate(value) {
    if (!value) return 'Sem atualização';
    const date = new Date(value);
    return Number.isNaN(date.getTime()) ? 'Sem atualização' : date.toLocaleString('pt-BR');
  }

  function createDialog() {
    let dialog = document.getElementById('base-upload-dialog');
    if (dialog) return dialog;
    dialog = document.createElement('dialog');
    dialog.id = 'base-upload-dialog';
    dialog.className = 'task-dialog integration-dialog';
    dialog.innerHTML = `
      <form id="base-upload-form">
        <header>
          <div><h2 id="base-upload-title">Importar base</h2><p id="base-upload-description">Envie a planilha XLSX da execução mais recente.</p></div>
          <button type="button" class="icon-button" data-close-base-upload aria-label="Fechar"><i data-lucide="x"></i></button>
        </header>
        <label>Arquivo XLSX<input name="file" id="base-upload-file" type="file" accept=".xlsx" required></label>
        <p class="dialog-error" id="base-upload-error" hidden></p>
        <div class="integration-job-result" id="base-upload-result" hidden>
          <strong id="base-upload-result-title"></strong>
          <span id="base-upload-result-detail"></span>
        </div>
        <footer>
          <button type="button" class="secondary-button" data-close-base-upload>Cancelar</button>
          <button type="submit" class="primary-button" id="base-upload-submit">Importar base</button>
        </footer>
      </form>`;
    document.body.appendChild(dialog);

    dialog.querySelectorAll('[data-close-base-upload]').forEach((button) => button.addEventListener('click', () => dialog.close()));
    dialog.addEventListener('close', () => {
      activeSource = null;
      dialog.querySelector('#base-upload-form')?.reset();
      const error = dialog.querySelector('#base-upload-error');
      const result = dialog.querySelector('#base-upload-result');
      if (error) error.hidden = true;
      if (result) result.hidden = true;
    });
    dialog.querySelector('#base-upload-form')?.addEventListener('submit', submitUpload);
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
    return dialog;
  }

  function updateRow(source) {
    const row = document.querySelector(`[data-base-upload-task="${source}"]`);
    if (!row) return;
    const latest = currentImports.get(source);
    const status = row.querySelector('[data-base-upload-status]');
    const updated = row.querySelector('[data-base-upload-updated]');
    const pending = row.querySelector('[data-base-upload-pending]');
    if (latest) {
      status.textContent = 'Atualizada';
      status.className = 'task-status done';
      updated.textContent = formatDate(latest.imported_at);
      pending.textContent = '0';
    } else {
      status.textContent = 'Aguardando upload';
      status.className = 'task-status waiting';
      updated.textContent = 'Sem atualização';
      pending.textContent = '1';
    }
  }

  function ensureRows() {
    const tbody = tasksBody();
    if (!tbody) return;
    if (!canUploadBases()) {
      tbody.querySelectorAll('[data-base-upload-task]').forEach((row) => row.remove());
      return;
    }

    let added = false;
    Object.entries(definitions).forEach(([source, definition]) => {
      if (tbody.querySelector(`[data-base-upload-task="${source}"]`)) {
        updateRow(source);
        return;
      }
      const row = document.createElement('tr');
      row.dataset.baseUploadTask = source;
      row.innerHTML = `
        <td><span class="row-icon blue"><i data-lucide="${definition.icon}"></i></span><strong>${definition.title}</strong></td>
        <td>${definition.description}</td>
        <td><span class="empty-pill" data-base-upload-pending>1</span></td>
        <td><span class="task-status waiting" data-base-upload-status>Aguardando upload</span></td>
        <td data-base-upload-updated>Sem atualização</td>
        <td><button class="execute-button" type="button" data-base-upload-source="${source}"><i data-lucide="upload"></i>Executar</button></td>`;
      tbody.appendChild(row);
      updateRow(source);
      added = true;
    });
    if (added) window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  async function loadCurrentImports() {
    if (!canUploadBases() || !window.MBA_API) return;
    try {
      const result = await window.MBA_API.request('/api/base-processual/importacoes');
      currentImports.clear();
      for (const item of result?.rows || []) {
        if (item?.tipo) currentImports.set(item.tipo, item);
      }
      ensureRows();
    } catch (_) {
      ensureRows();
    }
  }

  function openUpload(source) {
    const definition = definitions[source];
    if (!definition || !canUploadBases()) return;
    activeSource = source;
    const dialog = createDialog();
    dialog.querySelector('#base-upload-title').textContent = definition.title;
    dialog.querySelector('#base-upload-description').textContent = source === 'benner'
      ? 'Envie o XLSX bruto do Benner. O arquivo inteiro será armazenado; o recorte Enter + MBA Advogados ocorre somente na base processual.'
      : 'Envie o XLSX bruto do CPJ. O arquivo inteiro será armazenado e comparado com a última execução do Benner.';
    dialog.querySelector('#base-upload-error').hidden = true;
    dialog.querySelector('#base-upload-result').hidden = true;
    dialog.querySelector('#base-upload-form').reset();
    dialog.showModal();
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  async function submitUpload(event) {
    event.preventDefault();
    if (!activeSource || !window.MBA_API) return;
    const form = event.currentTarget;
    const file = form.elements.file?.files?.[0];
    const errorBox = form.querySelector('#base-upload-error');
    const resultBox = form.querySelector('#base-upload-result');
    const submit = form.querySelector('#base-upload-submit');

    errorBox.hidden = true;
    resultBox.hidden = true;
    if (!(file instanceof File) || !/\.xlsx$/i.test(file.name)) {
      errorBox.textContent = 'Selecione uma planilha XLSX.';
      errorBox.hidden = false;
      return;
    }

    const source = activeSource;
    const body = new FormData();
    body.append('file', file);
    submit.disabled = true;
    submit.textContent = 'Importando...';
    try {
      const response = await window.MBA_API.request(`/api/base-processual/${source}/importar`, { method: 'POST', body });
      if (response?.importacao) currentImports.set(source, response.importacao);
      updateRow(source);
      const imported = response?.importacao?.valid_rows ?? '—';
      const total = response?.importacao?.total_rows ?? '—';
      const consolidated = response?.consolidacao?.total_processos;
      form.querySelector('#base-upload-result-title').textContent = 'Importação concluída';
      form.querySelector('#base-upload-result-detail').textContent = consolidated == null
        ? `${imported} de ${total} linhas processadas.`
        : `${imported} de ${total} linhas processadas. Base processual: ${consolidated} processos.`;
      resultBox.hidden = false;
      form.elements.file.value = '';
      await loadCurrentImports();
    } catch (error) {
      errorBox.textContent = error.message || 'Não foi possível importar a base.';
      errorBox.hidden = false;
    } finally {
      submit.disabled = false;
      submit.textContent = 'Importar base';
    }
  }

  function bind() {
    const tbody = tasksBody();
    if (!tbody) return;
    if (!tbody.dataset.baseUploadBound) {
      tbody.dataset.baseUploadBound = '1';
      tbody.addEventListener('click', (event) => {
        const button = event.target.closest('[data-base-upload-source]');
        if (!button) return;
        event.preventDefault();
        event.stopPropagation();
        openUpload(button.dataset.baseUploadSource);
      });
      observer = new MutationObserver(() => ensureRows());
      observer.observe(tbody, { childList: true });
    }
    ensureRows();
    loadCurrentImports();
  }

  window.addEventListener('mba:authenticated', bind);
  window.addEventListener('mba:session-expired', () => {
    observer?.disconnect();
    document.querySelectorAll('[data-base-upload-task]').forEach((row) => row.remove());
  });
  if (window.MBA_CURRENT_USER) bind();
})();
