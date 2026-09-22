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
  try {
    if (typeof pageRoutes !== 'undefined') pageRoutes.relatorios = 'relatorios';
    if (typeof permissionSections !== 'undefined') permissionSections.analytics = 'Banco de Dados';
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
  const container = document.getElementById('analytics-embed-container');
  const state = document.getElementById('analytics-embed-state');
  let loading = false;
  let loaded = false;
  let refreshTimer = null;
  let metabaseScriptPromise = null;
  let loadedInstanceUrl = '';

  const hasAccess = () => window.MBA_CURRENT_USER?.permissions?.[permissionKey] === true;

  function renderState(icon, title, detail, isError = false) {
    if (!state) return;
    state.hidden = false;
    state.classList.toggle('analytics-error', isError);
    state.replaceChildren();
    const iconElement = document.createElement('i');
    iconElement.dataset.lucide = icon;
    const strong = document.createElement('strong');
    strong.textContent = title;
    const span = document.createElement('span');
    span.textContent = detail;
    state.append(iconElement, strong, span);
    window.lucide?.createIcons({ attrs: { 'aria-hidden': 'true' } });
  }

  function normalizeInstanceUrl(value) {
    const target = new URL(value);
    if (target.protocol !== 'https:' && !(target.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(target.hostname))) {
      throw new Error('O endereço do Metabase retornado pelo servidor é inválido.');
    }
    target.pathname = target.pathname.replace(/\/$/, '');
    target.search = '';
    target.hash = '';
    return target.href.replace(/\/$/, '');
  }

  function ensureMetabaseScript(instanceUrl) {
    if (customElements.get('metabase-dashboard')) return Promise.resolve();
    if (metabaseScriptPromise && loadedInstanceUrl === instanceUrl) return metabaseScriptPromise;

    window.metabaseConfig = {
      isGuest: true,
      instanceUrl,
    };
    loadedInstanceUrl = instanceUrl;

    metabaseScriptPromise = new Promise((resolve, reject) => {
      const existing = document.querySelector('script[data-metabase-embed]');
      if (existing) existing.remove();
      const script = document.createElement('script');
      script.defer = true;
      script.src = `${instanceUrl}/app/embed.js`;
      script.dataset.metabaseEmbed = 'true';
      script.addEventListener('load', async () => {
        try {
          await customElements.whenDefined('metabase-dashboard');
          resolve();
        } catch (error) {
          reject(error);
        }
      }, { once: true });
      script.addEventListener('error', () => reject(new Error('Não foi possível carregar o componente do Metabase.')), { once: true });
      document.head.appendChild(script);
    });

    return metabaseScriptPromise;
  }

  function scheduleRefresh(expiresIn) {
    if (refreshTimer) window.clearTimeout(refreshTimer);
    const seconds = Number(expiresIn) || 600;
    const refreshIn = Math.max(60, seconds - 60);
    refreshTimer = window.setTimeout(() => { void loadEmbed(true); }, refreshIn * 1000);
  }

  function clearEmbed() {
    loaded = false;
    loading = false;
    if (refreshTimer) window.clearTimeout(refreshTimer);
    refreshTimer = null;
    if (container) {
      container.hidden = true;
      container.replaceChildren();
    }
    renderState('loader-circle', 'Carregando banco de dados', 'Preparando o dashboard.');
  }

  async function loadEmbed(forceRefresh = false) {
    if (!container || !page || !hasAccess() || loading || (loaded && !forceRefresh)) return;
    loading = true;
    if (!loaded) renderState('loader-circle', 'Carregando banco de dados', 'Preparando o dashboard.');

    try {
      const result = await window.MBA_API.request('/api/analytics/metabase/embed');
      if (!result?.jwt || !result?.instance_url) throw new Error('O servidor retornou uma configuração de relatório inválida.');
      const instanceUrl = normalizeInstanceUrl(result.instance_url);
      await ensureMetabaseScript(instanceUrl);

      let dashboard = container.querySelector('metabase-dashboard');
      if (!dashboard) {
        dashboard = document.createElement('metabase-dashboard');
        dashboard.setAttribute('with-title', 'false');
        dashboard.setAttribute('with-downloads', 'false');
        container.appendChild(dashboard);
      }
      dashboard.setAttribute('token', result.jwt);
      container.hidden = false;
      if (state) state.hidden = true;
      loaded = true;
      scheduleRefresh(result.expires_in);
    } catch (error) {
      clearEmbed();
      renderState('triangle-alert', 'Não foi possível abrir o banco de dados', error.message || 'Tente novamente.', true);
    } finally {
      loading = false;
    }
  }

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
