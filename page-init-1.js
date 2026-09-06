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
  