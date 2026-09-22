const mbaIsLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

// Branch de teste: o frontend acessa a API diretamente na VPS, sem Railway no caminho HTTP da aplicação.
// O Railway permanece disponível apenas como infraestrutura de fallback fora desta configuração.
window.MBA_API_BASE_URL = 'https://api.portilhobackoffice.site';

window.MBA_LOCAL_PREVIEW = mbaIsLocal
  && new URLSearchParams(location.search).get('preview') === '1';

// Preview visual opcional: continua executando o mesmo dist, mas usa o mock API
// e uma identidade local apenas no hostname localhost/127.0.0.1 com ?preview=1.
if (window.MBA_LOCAL_PREVIEW) {
  window.addEventListener('DOMContentLoaded', () => {
    const permissions = {
      'dashboard.view': true,
      'automations.view': true,
      'automations.run': true,
      'automations.manage': true,
      'automations.override_daily_limit': true,
      'tutelas.view': true,
      'encerramentos.view': true,
      'pagamentos.view': true,
      'pagamentos.import': true,
      'agreements.view': true,
      'agreements.export': true,
      'tasks.view': true,
      'tasks.create': true,
      'tasks.assign': true,
      'tasks.execute': true,
      'tasks.manage': true,
      'users.view': true,
      'users.manage': true,
      'settings.view': true,
      'settings.manage': true,
    };
    const user = {
      id: 'local-preview-admin',
      name: 'Local Preview',
      email: 'local.preview@localhost.invalid',
      role: 'admin',
      is_master_admin: true,
      permissions,
    };

    queueMicrotask(() => {
      window.MBA_CURRENT_USER = user;
      document.body.classList.remove('auth-loading', 'auth-signed-out');
      document.body.classList.add('auth-signed-in');
      window.dispatchEvent(new CustomEvent('mba:authenticated', { detail: user }));
      window.restorePageRoute?.();
    });
  });
}
