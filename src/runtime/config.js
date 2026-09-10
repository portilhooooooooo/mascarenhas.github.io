// Preencha com a origem HTTPS pública do backend Flask na VPS, sem barra final.
// Exemplo: window.MBA_API_BASE_URL = 'https://api.seudominio.com';
window.MBA_API_BASE_URL = 'https://mba-backoffice-proxy-production.up.railway.app';


window.MBA_LOCAL_PREVIEW = ['localhost', '127.0.0.1'].includes(location.hostname) && new URLSearchParams(location.search).get('preview') === '1';
