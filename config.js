const mbaIsLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

// Produção chama o proxy público. Em localhost o browser usa a mesma origem
// do frontend e o Vite Preview encaminha /api e /auth para o Flask local.
// Assim o mesmo dist publicado na Cloudflare também é o artefato testado localmente.
window.MBA_API_BASE_URL = mbaIsLocal
  ? ''
  : 'https://mba-backoffice-proxy-production.up.railway.app';

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
      name: 'Gabriel Portilho',
      email: 'gabriel.portilho@mascarenhasbarbosa.com.br',
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
