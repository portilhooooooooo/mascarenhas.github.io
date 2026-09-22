const mbaIsLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

// Produção chama o proxy público. Em localhost o browser usa a mesma origem
// do frontend e o Vite Preview encaminha /api e /auth para o Flask local.
// Assim o mesmo dist publicado na Cloudflare também é o artefato testado localmente.
window.MBA_API_BASE_URL = mbaIsLocal
  ? ''
  : 'https://mba-backoffice-proxy-production.up.railway.app';

window.MBA_LOCAL_PREVIEW = mbaIsLocal
  && new URLSearchParams(location.search).get('preview') === '1';
