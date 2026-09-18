const mbaIsLocal = ['localhost', '127.0.0.1'].includes(location.hostname);

// Em produção o browser acessa o proxy público. Em localhost apontamos direto
// para o Flask local. O backend libera apenas FRONTEND_URL=http://localhost:5173,
// então o teste funciona com o servidor HTTP nativo do Python e não exige Node/Vite.
window.MBA_API_BASE_URL = mbaIsLocal
  ? 'http://localhost:5000'
  : 'https://mba-backoffice-proxy-production.up.railway.app';

window.MBA_LOCAL_PREVIEW = mbaIsLocal
  && new URLSearchParams(location.search).get('preview') === '1';
