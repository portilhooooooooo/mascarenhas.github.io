// Preencha com a origem HTTPS pública do backend Flask na VPS, sem barra final.
// Exemplo: window.MBA_API_BASE_URL = 'https://api.seudominio.com';
window.MBA_API_BASE_URL = 'https://mba-backoffice-proxy-production.up.railway.app';

// Configuração pública do Supabase. Em um frontend estático estes valores são
// equivalentes a VITE_SUPABASE_URL e VITE_SUPABASE_ANON_KEY.
// Nunca adicione a service_role neste arquivo.
window.MBA_SUPABASE_URL = 'https://dyxegxreoujdxfhblaye.supabase.co';
window.MBA_SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImR5eGVneHJlb3VqZHhmaGJsYXllIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODU5MjIwOTgsImV4cCI6MjEwMTQ5ODA5OH0.hfUBPZGWiulFZySUm9fTFykxnk7mTeQaiuZbPwqPPpo';

// Prévia visual: ativa somente quando este frontend é servido localmente.
// Em qualquer host publicado, autenticação e API reais continuam obrigatórias.
window.MBA_LOCAL_PREVIEW = (
  ['localhost', '127.0.0.1'].includes(window.location.hostname)
  || new URLSearchParams(window.location.search).get('preview') === '1'
);
