(() => {
  'use strict';
  const tokenKey = 'mba_session_token';
  const googleVerifierKey = 'mba_google_verifier';
  const googleHandoffKey = 'mba_google_handoff';
  const errorBox = document.getElementById('login-error');
  const showError = message => { errorBox.textContent = message; errorBox.style.display = 'block'; };
  const clearError = () => { errorBox.style.display = 'none'; };
  const setAuthState = signedIn => {
    document.body.classList.remove('auth-loading', 'auth-signed-in', 'auth-signed-out');
    document.body.classList.add(signedIn ? 'auth-signed-in' : 'auth-signed-out');
  };

  const favicon = document.querySelector('link[rel~="icon"]') || document.createElement('link');
  favicon.rel = 'icon';
  favicon.type = 'image/svg+xml';
  favicon.href = '/favicon.svg?v=20260908';
  if (!favicon.parentNode) document.head.appendChild(favicon);

  function applyUser(user) {
    if (!user?.id || !user?.email || typeof user.permissions !== 'object') throw new Error('O perfil autenticado retornado pela API é inválido.');
    window.MBA_CURRENT_USER = user;
    const name=user.name||user.nome||user.email.split('@')[0], firstName=name.trim().split(/\s+/)[0];
    const initials=name.trim().split(/\s+/).slice(0,2).map((part)=>part[0]?.toUpperCase()).join('')||'U';
    const roleLabels={admin:'Administrador',user:'Usuário'};
    document.getElementById('profile-name').textContent=name; document.getElementById('profile-role').textContent=user.access_kind === 'operational' ? 'Operacional' : roleLabels[user.role] || 'Usuário';
    document.getElementById('profile-avatar').textContent=initials; const welcomeName=document.getElementById('welcome-name'); if(welcomeName)welcomeName.textContent=firstName;
    document.querySelectorAll('[data-permission]').forEach((element)=>{element.hidden=user.permissions[element.dataset.permission]!==true;});
    document.querySelectorAll('.master-admin-only').forEach((element)=>{element.hidden=!user.is_master_admin;});
    const pages=[['dashboard','dashboard.view'],['automacoes','automations.view'],['tutelas','tutelas.view'],['encerramentos','encerramentos.view'],['usuarios','users.view'],['configuracoes','settings.view'],['tarefas','tasks.view'],['pagamentos','pagamentos.view'],['acordos','agreements.view']].filter(([,permission])=>user.permissions[permission]===true);
    const active=document.querySelector('.page.active');
    if(!pages.length) window.showPage?.('sem-acesso'); else if((user.access_kind === 'operational')) window.showPage?.('tarefas'); else if(active?.dataset.permission&&user.permissions[active.dataset.permission]!==true) window.showPage?.(pages[0][0]);
    window.dispatchEvent(new CustomEvent('mba:authenticated',{detail:user}));
    if(!(user.access_kind === 'operational')) window.restorePageRoute?.();
  }

  async function loadProfile() {
    const profile = await window.MBA_API.request('/api/me');
    applyUser(profile); setAuthState(true); clearError();
  }

  async function loadProfileWithRetry() {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try { return await loadProfile(); }
      catch (error) {
        lastError = error;
        if (error?.status === 401 || error?.status === 403) throw error;
        if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 350 * (attempt + 1)));
      }
    }
    throw lastError;
  }

  async function exchangeGoogleHandoff(code, verifier) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await window.MBA_API.request('/auth/session/exchange', {method: 'POST', body: JSON.stringify({handoff_code: code, handoff_verifier: verifier})});
      } catch (error) {
        lastError = error;
        if ([401, 403, 422].includes(error?.status)) throw error;
        if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }
    throw lastError;
  }

  const base64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  async function initializeAuth() {
    sessionStorage.removeItem('mba_task_worker_token');
    sessionStorage.removeItem('mba_task_only_user');
    localStorage.removeItem('mba_temp_access'); localStorage.removeItem('mba_temp_email');
    localStorage.removeItem('sb-dyxegxreoujdxfhblaye-auth-token');
    try {
      const fragment = new URLSearchParams(location.hash.slice(1));
      if (fragment.has('auth_handoff')) {
        const code = fragment.get('auth_handoff');
        if (code) sessionStorage.setItem(googleHandoffKey, code);
        history.replaceState(null, '', location.pathname + location.search);
      }
      const code = sessionStorage.getItem(googleHandoffKey);
      if (code) {
        const verifier = sessionStorage.getItem(googleVerifierKey);
        if (!verifier) {
          sessionStorage.removeItem(googleHandoffKey);
          throw new Error('Não foi possível realizar o acesso.');
        }
        try {
          const result = await exchangeGoogleHandoff(code, verifier);
          sessionStorage.setItem(tokenKey, result.access_token);
          sessionStorage.removeItem(googleHandoffKey);
          sessionStorage.removeItem(googleVerifierKey);
        } catch (error) {
          if ([401, 403, 422].includes(error?.status)) {
            sessionStorage.removeItem(googleHandoffKey);
            sessionStorage.removeItem(googleVerifierKey);
          }
          throw error;
        }
      }
      if (sessionStorage.getItem(tokenKey)) await loadProfileWithRetry(); else setAuthState(false);
    } catch (error) {
      const invalidSession = error?.status === 401 || error?.status === 403;
      if (invalidSession) {
        sessionStorage.removeItem(tokenKey);
        setAuthState(false);
        showError('Sua sessão terminou. Entre novamente.');
      } else if (sessionStorage.getItem(tokenKey)) {
        setAuthState(false);
        showError('Não foi possível validar sua sessão agora. Sua sessão foi preservada; atualize a página novamente.');
      } else if (sessionStorage.getItem(googleHandoffKey) && sessionStorage.getItem(googleVerifierKey)) {
        setAuthState(false);
        showError('Não foi possível concluir o acesso agora. Atualize a página para tentar novamente sem refazer o login do Google.');
      } else {
        setAuthState(false);
        showError(error.message);
      }
    }
  }
  document.getElementById('google-login')?.addEventListener('click', async () => {
    clearError();
    try {
      const verifier = base64url(crypto.getRandomValues(new Uint8Array(48)));
      const challenge = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
      sessionStorage.removeItem(googleHandoffKey);
      sessionStorage.setItem(googleVerifierKey, verifier);
      const result = await window.MBA_API.request('/auth/google/start', {method: 'POST', body: JSON.stringify({handoff_challenge: challenge})});
      const target = new URL(result.url);
      if (target.origin !== 'https://accounts.google.com') throw new Error('Não foi possível realizar o acesso.');
      location.assign(target.href);
    } catch (error) { showError(error.message); }
  });
  document.getElementById('task-only-login')?.addEventListener('submit', async event => {
    event.preventDefault(); clearError();
    const form = event.currentTarget, button = form.querySelector('[type="submit"]'); button.disabled = true;
    try {
      const result = await window.MBA_API.request('/api/operational/login', {method: 'POST', body: JSON.stringify({email: form.elements.email.value.trim(), totp: form.elements.totp.value})});
      sessionStorage.setItem(tokenKey, result.access_token); await loadProfile();
    } catch (error) { showError(error.message); }
    finally { form.elements.totp.value = ''; button.disabled = false; }
  });
  document.getElementById('logout-button')?.addEventListener('click', async () => {
    try { await window.MBA_API.request('/auth/session', {method: 'DELETE'}); }
    catch (_) { showError('Não foi possível confirmar a revogação no servidor.'); }
    finally { sessionStorage.removeItem(tokenKey); window.MBA_CURRENT_USER = null; setAuthState(false); }
  });
  window.addEventListener('mba:session-expired', () => { window.MBA_CURRENT_USER = null; setAuthState(false); showError('Sua sessão terminou. Entre novamente.'); });
  initializeAuth();
})();
