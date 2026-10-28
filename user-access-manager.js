/* Master-only multi-portfolio identity manager. */
(() => {
  'use strict';
  const modules = [
    ['Tarefas','tasks.view',['tasks.execute','tasks.view_others','tasks.create','tasks.assign','tasks.manage']],
    ['Pagamentos','pagamentos.view',['pagamentos.import']],
    ['Tutelas','tutelas.view',['tutelas.import']],
    ['Encerramentos','encerramentos.view',[]],
    ['Acordos','agreements.view',['agreements.export']],
    ['Automações','automations.view',['automations.run','automations.manage','automations.override_daily_limit']],
    ['Analytics','analytics.access',[]],
    ['Dashboard','dashboard.view',[]],
    ['Configurações','settings.view',['settings.manage']],
  ];
  const descriptions = {
    'tasks.execute':'Executar processos atribuídos',
    'tasks.view_others':'Visualizar tarefas de outros analistas',
    'tasks.create':'Criar tarefas', 'tasks.assign':'Atribuir tarefas',
    'tasks.manage':'Gerenciar tarefas', 'pagamentos.import':'Importar pagamentos',
    'tutelas.import':'Importar processos', 'agreements.export':'Exportar acordos',
    'automations.run':'Executar automações',
    'automations.manage':'Gerenciar automações',
    'automations.override_daily_limit':'Superar limite diário',
    'settings.manage':'Gerenciar configurações',
  };
  const escape = value => {
    const node = document.createElement('span');
    node.textContent = String(value ?? '');
    return node.innerHTML;
  };
  let selectedAccess = null;

  function render(access, permissions, portfolios) {
    selectedAccess = access;
    const allowedKeys = new Set(permissions.map(row => row.key));
    const root = document.querySelector('#portfolio-access-grid');
    if (!root) return;
    const active = new Set((access.memberships || []).filter(row => row.active).map(row => row.portfolio_id));
    root.innerHTML = portfolios.map(portfolio => {
      const id = escape(portfolio.id);
      const enabled = active.has(portfolio.id);
      const current = access.effective_permissions?.[portfolio.id] || {};
      const tiles = modules.filter(module => allowedKeys.has(module[1])).map(module => {
        const label = module[0], view = module[1];
        const on = current[view] === true;
        const details = module[2].filter(key => allowedKeys.has(key));
        return '<section class="access-module">' +
          '<label class="access-module-master"><input type="checkbox" data-module-view="' + escape(view) +
          '" data-access-permission="' + escape(view) + '" ' + (on ? 'checked ' : '') +
          (enabled ? '' : 'disabled ') + '><strong>' + escape(label) + '</strong></label>' +
          (details.length ? '<div class="access-module-actions">' + details.map(key =>
            '<label><input type="checkbox" data-action-of="' + escape(view) +
            '" data-access-permission="' + escape(key) + '" ' +
            (on && current[key] === true ? 'checked ' : '') +
            (enabled && on ? '' : 'disabled ') + '><span>' +
            escape(descriptions[key] || key) + '</span></label>'
          ).join('') + '</div>' : '') +
          '</section>';
      }).join('');
      return '<section class="access-portfolio-card ' + (enabled ? 'is-enabled' : 'is-disabled') +
        '" data-access-portfolio="' + id + '">' +
        '<header><label><input type="checkbox" data-portfolio-enabled ' + (enabled ? 'checked' : '') +
        '><span><strong>' + escape(portfolio.display_name || portfolio.id) +
        '</strong><small>' + (enabled ? 'Acesso autorizado' : 'Sem acesso') +
        '</small></span></label></header>' +
        '<div class="access-module-grid">' + tiles + '</div></section>';
    }).join('');
    root.querySelectorAll('[data-access-portfolio]').forEach(card => refreshCard(card));
  }

  function refreshCard(card) {
    const enabled = card.querySelector('[data-portfolio-enabled]').checked;
    card.classList.toggle('is-enabled', enabled);
    card.classList.toggle('is-disabled', !enabled);
    card.querySelector('header small').textContent = enabled ? 'Acesso autorizado' : 'Sem acesso';
    card.querySelectorAll('[data-module-view]').forEach(input => { input.disabled = !enabled; });
    card.querySelectorAll('[data-action-of]').forEach(input => {
      const master = [...card.querySelectorAll('[data-module-view]')].find(row => row.dataset.moduleView === input.dataset.actionOf);
      input.disabled = !enabled || !master?.checked;
      if (!master?.checked) input.checked = false;
    });
  }

  document.querySelector('#portfolio-access-grid')?.addEventListener('change', event => {
    const target = event.target;
    if (!(target instanceof HTMLInputElement)) return;
    const card = target.closest('[data-access-portfolio]');
    if (card) refreshCard(card);
  });

  async function save(userId) {
    if (!selectedAccess || String(selectedAccess.user?.id) !== String(userId)) {
      throw new Error('Selecione novamente o usuário.');
    }
    const portfolios = [...document.querySelectorAll('[data-access-portfolio]')]
      .filter(card => card.querySelector('[data-portfolio-enabled]').checked)
      .map(card => ({
        id: card.dataset.accessPortfolio,
        permissions: Object.fromEntries(
          [...card.querySelectorAll('[data-access-permission]')]
            .map(input => [input.dataset.accessPermission, !!(input.checked && !input.disabled)])
        ),
      }));
    return window.MBA_API.request('/api/users/' + encodeURIComponent(userId) + '/access', {
      method: 'PUT', body: JSON.stringify({portfolios}),
    });
  }

  window.MBA_USER_ACCESS = {render, save};
})();
