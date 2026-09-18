const mbaIsLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

// Em produção o browser acessa o proxy público. Em localhost usamos a própria
// origem do Vite; /api e /auth são encaminhados pelo dev server ao Flask local.
// Isso mantém a navegação same-origin e elimina CORS do fluxo local.
window.MBA_API_BASE_URL = mbaIsLocal
  ? location.origin
  : 'https://mba-backoffice-proxy-production.up.railway.app';

window.MBA_LOCAL_PREVIEW = mbaIsLocal
  && new URLSearchParams(location.search).get('preview') === '1';
