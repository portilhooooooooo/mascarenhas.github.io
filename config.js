const mbaIsLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

// Em produção o browser acessa o proxy público. Em localhost usamos caminhos
// relativos para que o Vite faça proxy para o backend local e o browser não
// dependa de CORS entre localhost e Railway.
window.MBA_API_BASE_URL = mbaIsLocal
  ? ''
  : 'https://mba-backoffice-proxy-production.up.railway.app';

window.MBA_LOCAL_PREVIEW = mbaIsLocal
  && new URLSearchParams(location.search).get('preview') === '1';
