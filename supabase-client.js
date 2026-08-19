(() => {
  'use strict';
  const url = String(window.MBA_SUPABASE_URL || '').trim();
  const anonKey = String(window.MBA_SUPABASE_ANON_KEY || '').trim();
  if (!url || !anonKey || !window.supabase?.createClient) {
    window.MBA_SUPABASE_ERROR = 'O Supabase público não foi configurado neste ambiente.';
    return;
  }
  window.MBA_SUPABASE = window.supabase.createClient(url, anonKey, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
  });
})();
