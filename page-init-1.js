(() => {
      const normalize = (value) => (value || '').toString().trim().toLowerCase()
        .normalize('NFD').replace(/[\u0300-\u036f]/g, '');

      function initTutelasFilters() {
        const body = document.getElementById('tutelas-table-body');
        const search = document.getElementById('tutelas-search');
        const client = document.getElementById('tutelas-cliente-filter');
        const pedido = document.getElementById('tutelas-pedido-filter');
        const date = document.getElementById('tutelas-date-filter');
        const clear = document.getElementById('tutelas-clear-filters');
        const tabs = [...document.querySelectorAll('.tutelas-tab')];
        if (!body || !search || !client || !pedido || !date || !clear || !tabs.length) return;

        let resultFilter = '';

        const rows = () => [...body.querySelectorAll('tr[data-tutela-row]')];

        const refreshClients = () => {
          const current = client.value;
          const values = [...new Set(rows().map(row => row.dataset.cliente).filter(Boolean))]
            .sort((a, b) => a.localeCompare(b, 'pt-BR'));
          client.innerHTML = '<option value="">Todos</option>' + values.map(value => `<option value="${value.replace(/"/g, '&quot;')}">${value}</option>`).join('');
          if (values.includes(current)) client.value = current;
        };

        const apply = () => {
          const q = normalize(search.value);
          const c = normalize(client.value);
          const p = normalize(pedido.value);
          const d = date.value;
          let visible = 0;
          rows().forEach(row => {
            const matches = (!q || normalize(row.dataset.processo).includes(q))
              && (!c || normalize(row.dataset.cliente) === c)
              && (!p || normalize(row.dataset.pedido) === p)
              && (!d || row.dataset.consultaDate === d)
              && (!resultFilter || row.dataset.result === resultFilter);
            row.hidden = !matches;
            if (matches) visible += 1;
          });
          const label = document.getElementById('tutelas-pagination-label');
          if (label && rows().length) label.textContent = `${visible} de ${rows().length} registro${rows().length === 1 ? '' : 's'} exibido${visible === 1 ? '' : 's'}`;
        };

        [search, client, pedido, date].forEach(el => el.addEventListener(el === search ? 'input' : 'change', apply));
        clear.addEventListener('click', () => {
          search.value = ''; client.value = ''; pedido.value = ''; date.value = ''; resultFilter = '';
          tabs.forEach((tab, index) => { tab.classList.toggle('active', index === 0); tab.setAttribute('aria-selected', index === 0 ? 'true' : 'false'); });
          apply();
        });
        tabs.forEach(tab => tab.addEventListener('click', () => {
          resultFilter = tab.dataset.tutelaResult || '';
          tabs.forEach(item => { const active = item === tab; item.classList.toggle('active', active); item.setAttribute('aria-selected', active ? 'true' : 'false'); });
          apply();
        }));

        const observer = new MutationObserver(() => { refreshClients(); apply(); });
        observer.observe(body, { childList: true });
        refreshClients(); apply();
      }

      document.addEventListener('DOMContentLoaded', initTutelasFilters);
    })();

(() => {
  function installAnalyticsShell() {
    if (document.getElementById('relatorios')) return;

    const reportsNav = [...document.querySelectorAll('.main-nav .nav-item')]
      .find((item) => item.textContent.trim() === 'Relatórios');
    if (reportsNav) {
      reportsNav.classList.remove('nav-item-muted');
      reportsNav.disabled = false;
      reportsNav.removeAttribute('title');
      reportsNav.dataset.page = 'relatorios';
      reportsNav.dataset.permission = 'analytics.access';
      reportsNav.hidden = true;
      const label = reportsNav.querySelector('span');
      if (label) label.textContent = 'Banco de Dados';
      const icon = reportsNav.querySelector('i[data-lucide]');
      if (icon) icon.dataset.lucide = 'database';
    }

    const content = document.querySelector('main.content');
    if (!content) return;

    const section = document.createElement('section');
    section.className = 'page list-page analytics-embed-page';
    section.id = 'relatorios';
    section.dataset.permission = 'analytics.access';
    section.hidden = true;
    section.setAttribute('aria-label', 'Banco de Dados');
    section.innerHTML = `
      <div class="page-title analytics-embed-title">
        <div>
          <h1>Banco de Dados</h1>
          <p>Indicadores e análises operacionais.</p>
        </div>
      </div>
      <section class="analytics-embed-shell" aria-label="Dashboard do banco de dados">
        <div class="analytics-embed-state" id="analytics-embed-state" role="status">
          <i data-lucide="loader-circle"></i>
          <strong>Carregando banco de dados</strong>
          <span>Preparando o dashboard.</span>
        </div>
        <div id="analytics-embed-container" class="analytics-embed-container" hidden></div>
      </section>`;

    const dashboard = document.getElementById('dashboard');
    if (dashboard?.nextSibling) content.insertBefore(section, dashboard.nextSibling);
    else content.appendChild(section);

    if (!document.getElementById('analytics-embed-styles')) {
      const style = document.createElement('style');
      style.id = 'analytics-embed-styles';
      style.textContent = `
        .analytics-embed-page { min-height: calc(100vh - 92px); }
        .analytics-embed-title { margin-bottom: 18px; }
        .analytics-embed-shell { position: relative; min-height: 720px; width: 100%; overflow: hidden; border: 1px solid #dbe4ef; border-radius: 14px; background: #fff; }
        .analytics-embed-container { width: 100%; min-height: 780px; background: #fff; }
        .analytics-embed-container metabase-dashboard { display: block; width: 100%; min-height: 780px; }
        .analytics-embed-state { min-height: 720px; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; color: #475569; text-align: center; padding: 32px; }
        .analytics-embed-state strong { color: #0f172a; font-size: 15px; }
        .analytics-embed-state span { font-size: 13px; }
        .analytics-embed-state svg { width: 22px; height: 22px; }
        .analytics-embed-state.analytics-error svg { color: #b91c1c; }
        @media (max-width: 900px) {
          .analytics-embed-shell, .analytics-embed-state { min-height: 620px; }
          .analytics-embed-container, .analytics-embed-container metabase-dashboard { min-height: 680px; }
        }
      `;
      document.head.appendChild(style);
    }
  }

  installAnalyticsShell();
  document.addEventListener('DOMContentLoaded', installAnalyticsShell, { once: true });
})();
