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
  const version = '20260912-controladoria-tarefas';
  if (!document.querySelector('link[data-tasks-workspace]')) {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = `tasks-workspace.css?v=${version}`;
    link.dataset.tasksWorkspace = 'true';
    document.head.appendChild(link);
  }
  if (!document.querySelector('script[data-tasks-workspace]')) {
    const script = document.createElement('script');
    script.src = `tasks-workspace.js?v=${version}`;
    script.dataset.tasksWorkspace = 'true';
    document.body.appendChild(script);
  }
})();

(() => {
  try {
    if (typeof pageRoutes !== 'undefined') pageRoutes.relatorios = 'relatorios';
    if (typeof permissionSections !== 'undefined') permissionSections.analytics = 'Relatórios';
    if (typeof permissionSectionOrder !== 'undefined' && !permissionSectionOrder.includes('analytics')) {
      const settingsIndex = permissionSectionOrder.indexOf('settings');
      permissionSectionOrder.splice(settingsIndex >= 0 ? settingsIndex : permissionSectionOrder.length, 0, 'analytics');
    }
  } catch (_error) {
    // O shell continua funcional mesmo se a UI administrativa ainda não estiver disponível.
  }

  const permissionKey = 'analytics.access';
  const nav = document.querySelector('[data-page="relatorios"]');
  const page = document.getElementById('relatorios');
  const frame = document.getElementById('analytics-embed-frame');
  const state = document.getElementById('analytics-embed-state');
  let loading = false;
  let loaded = false;

  const hasAccess = () => window.MBA_CURRENT_USER?.permissions?.[permissionKey] === true;

  function renderState(icon, title, detail, isError = false) {
    if (!state) return;
    state.hidden = false;
    state.classList.toggle('analytics-error', isError);
    state.innerHTML = `<i data-lucide="${icon}"></i><strong>${title}</strong><span>${detail}</span>`;
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function clearEmbed() {
    loaded = false;
    loading = false;
    if (frame) {
      frame.hidden = true;
      frame.removeAttribute('src');
    }
    renderState('loader-circle', 'Carregando relatórios', 'Preparando o dashboard.');
  }

  async function loadEmbed() {
    if (!frame || !page || !hasAccess() || loaded || loading) return;
    loading = true;
    renderState('loader-circle', 'Carregando relatórios', 'Preparando o dashboard.');
    try {
      const result = await window.MBA_API.request('/api/analytics/metabase/embed');
      const target = new URL(result.embed_url);
      if (!['https:', 'http:'].includes(target.protocol)) throw new Error('O endereço do relatório retornado pelo servidor é inválido.');
      frame.src = target.href;
      frame.hidden = false;
      loaded = true;
    } catch (error) {
      frame.hidden = true;
      renderState('triangle-alert', 'Não foi possível abrir os relatórios', error.message || 'Tente novamente.', true);
    } finally {
      loading = false;
    }
  }

  frame?.addEventListener('load', () => {
    if (!loaded || !state) return;
    state.hidden = true;
  });

  nav?.addEventListener('click', () => { void loadEmbed(); });

  window.addEventListener('mba:authenticated', () => {
    if (!hasAccess()) {
      clearEmbed();
      return;
    }
    setTimeout(() => {
      const noAccess = document.getElementById('sem-acesso');
      if (noAccess?.classList.contains('active')) window.showPage?.('relatorios');
      if (page?.classList.contains('active')) void loadEmbed();
    }, 0);
  });

  window.addEventListener('mba:session-expired', clearEmbed);
  document.getElementById('logout-button')?.addEventListener('click', clearEmbed);
})();
