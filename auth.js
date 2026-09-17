(() => {
  'use strict';

  const tokenKey = 'mba_session_token';
  const oauthVerifierKey = 'mba_oauth_verifier';
  const oauthHandoffKey = 'mba_oauth_handoff';
  const errorBox = document.getElementById('login-error');

  const getStoredToken = () => {
    const persistent = localStorage.getItem(tokenKey);
    if (persistent) return persistent;

    // Migrate sessions created by the previous frontend so an update/F5 does not
    // force users who are already authenticated through Microsoft to sign in again.
    const legacy = sessionStorage.getItem(tokenKey);
    if (legacy) {
      localStorage.setItem(tokenKey, legacy);
      sessionStorage.removeItem(tokenKey);
    }
    return legacy;
  };

  const setStoredToken = token => {
    localStorage.setItem(tokenKey, token);
    sessionStorage.removeItem(tokenKey);
  };

  const clearStoredToken = () => {
    localStorage.removeItem(tokenKey);
    sessionStorage.removeItem(tokenKey);
  };

  const showError = message => {
    if (!errorBox) return;
    errorBox.textContent = message;
    errorBox.style.display = 'block';
  };
  const clearError = () => {
    if (!errorBox) return;
    errorBox.style.display = 'none';
  };
  const setAuthState = signedIn => {
    document.body.classList.remove('auth-loading', 'auth-signed-in', 'auth-signed-out');
    document.body.classList.add(signedIn ? 'auth-signed-in' : 'auth-signed-out');
  };

  function applyBranding() {
    document.title = 'Mascarenhas Backoffice';

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', 'Mascarenhas Backoffice');

    const favicon = document.querySelector('link[rel~="icon"]') || document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = '/favicon.svg?v=20260916-mascarenhas';
    if (!favicon.parentNode) document.head.appendChild(favicon);

    const brandMarkup = `
      <img class="brand-symbol" src="/favicon.svg?v=20260916-mascarenhas" alt="" aria-hidden="true">
      <span class="brand-word">Backoffice</span>
    `;

    const loginBrand = document.querySelector('.login-brand');
    if (loginBrand) {
      loginBrand.innerHTML = brandMarkup;
      loginBrand.setAttribute('aria-label', 'Mascarenhas Backoffice');
    }

    const appBrand = document.querySelector('.brand');
    if (appBrand) {
      appBrand.innerHTML = brandMarkup;
      appBrand.setAttribute('aria-label', 'Mascarenhas Backoffice');
    }
  }

  function renderMicrosoftOnlyLogin() {
    const view = document.getElementById('login-view');
    if (!view) return;
    view.innerHTML = `
      <h1>Entrar</h1>
      <p class="login-subtitle">Acesse com sua conta Microsoft.</p>
      <button class="microsoft-login" id="microsoft-login" type="button" data-auth-provider="microsoft" aria-label="Entrar com Microsoft">
        <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
          <path fill="#f25022" d="M2 2h9v9H2z"/>
          <path fill="#7fba00" d="M13 2h9v9h-9z"/>
          <path fill="#00a4ef" d="M2 13h9v9H2z"/>
          <path fill="#ffb900" d="M13 13h9v9h-9z"/>
        </svg>
        <span>Entrar com Microsoft</span>
      </button>
    `;
  }

  applyBranding();
  renderMicrosoftOnlyLogin();

  function applyUser(user) {
    if (!user?.id || !user?.email || typeof user.permissions !== 'object') {
      throw new Error('O perfil autenticado retornado pela API é inválido.');
    }

    window.MBA_CURRENT_USER = user;
    const name = user.name || user.nome || user.email.split('@')[0];
    const firstName = name.trim().split(/\s+/)[0];
    const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'U';
    const roleLabels = { admin: 'Administrador', user: 'Usuário' };

    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-role').textContent = roleLabels[user.role] || 'Usuário';
    document.getElementById('profile-avatar').textContent = initials;
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) welcomeName.textContent = firstName;

    document.querySelectorAll('[data-permission]').forEach(element => {
      element.hidden = user.permissions[element.dataset.permission] !== true;
    });
    document.querySelectorAll('.master-admin-only').forEach(element => {
      element.hidden = !user.is_master_admin;
    });

    const pages = [
      ['dashboard', 'dashboard.view'],
      ['automacoes', 'automations.view'],
      ['protocolo', 'automations.view'],
      ['tutelas', 'tutelas.view'],
      ['encerramentos', 'encerramentos.view'],
      ['usuarios', 'users.view'],
      ['configuracoes', 'settings.view'],
      ['tarefas', 'tasks.view'],
      ['pagamentos', 'pagamentos.view'],
      ['acordos', 'agreements.view'],
    ].filter(([, permission]) => user.permissions[permission] === true);

    const active = document.querySelector('.page.active');
    if (!pages.length) {
      window.showPage?.('sem-acesso');
    } else if (active?.dataset.permission && user.permissions[active.dataset.permission] !== true) {
      window.showPage?.(pages[0][0]);
    }

    window.dispatchEvent(new CustomEvent('mba:authenticated', { detail: user }));
    window.restorePageRoute?.();
  }

  async function loadProfile() {
    const profile = await window.MBA_API.request('/api/me');
    applyUser(profile);
    setAuthState(true);
    clearError();
  }

  async function loadProfileWithRetry() {
    let lastError;
    for (let attempt = 0; attempt < 4; attempt += 1) {
      try {
        return await loadProfile();
      } catch (error) {
        lastError = error;
        if (error?.status === 401 || error?.status === 403) throw error;
        if (attempt < 3) await new Promise(resolve => setTimeout(resolve, 350 * (attempt + 1)));
      }
    }
    throw lastError;
  }

  async function exchangeOAuthHandoff(code, verifier) {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await window.MBA_API.request('/auth/session/exchange', {
          method: 'POST',
          body: JSON.stringify({ handoff_code: code, handoff_verifier: verifier }),
        });
      } catch (error) {
        lastError = error;
        if ([401, 403, 422].includes(error?.status)) throw error;
        if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 400 * (attempt + 1)));
      }
    }
    throw lastError;
  }

  const base64url = bytes => btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  async function initializeAuth() {
    sessionStorage.removeItem('mba_task_worker_token');
    sessionStorage.removeItem('mba_task_only_user');
    sessionStorage.removeItem('mba_google_verifier');
    sessionStorage.removeItem('mba_google_handoff');
    localStorage.removeItem('mba_temp_access');
    localStorage.removeItem('mba_temp_email');
    localStorage.removeItem('sb-dyxegxreoujdxfhblaye-auth-token');

    try {
      const fragment = new URLSearchParams(location.hash.slice(1));
      if (fragment.has('auth_handoff')) {
        const code = fragment.get('auth_handoff');
        if (code) sessionStorage.setItem(oauthHandoffKey, code);
        history.replaceState(null, '', location.pathname + location.search);
      }

      const code = sessionStorage.getItem(oauthHandoffKey);
      if (code) {
        const verifier = sessionStorage.getItem(oauthVerifierKey);
        if (!verifier) {
          sessionStorage.removeItem(oauthHandoffKey);
          throw new Error('Não foi possível realizar o acesso.');
        }
        try {
          const result = await exchangeOAuthHandoff(code, verifier);
          setStoredToken(result.access_token);
          sessionStorage.removeItem(oauthHandoffKey);
          sessionStorage.removeItem(oauthVerifierKey);
        } catch (error) {
          if ([401, 403, 422].includes(error?.status)) {
            sessionStorage.removeItem(oauthHandoffKey);
            sessionStorage.removeItem(oauthVerifierKey);
          }
          throw error;
        }
      }

      if (getStoredToken()) {
        await loadProfileWithRetry();
      } else {
        setAuthState(false);
      }
    } catch (error) {
      const invalidSession = error?.status === 401 || error?.status === 403;
      if (invalidSession) {
        clearStoredToken();
        setAuthState(false);
        showError('Sua sessão terminou. Entre novamente.');
      } else if (getStoredToken()) {
        setAuthState(false);
        showError('Não foi possível validar sua sessão agora. A sessão foi preservada; atualize a página novamente.');
      } else if (sessionStorage.getItem(oauthHandoffKey) && sessionStorage.getItem(oauthVerifierKey)) {
        setAuthState(false);
        showError('Não foi possível concluir o acesso agora. Atualize a página para tentar novamente sem refazer o login da Microsoft.');
      } else {
        setAuthState(false);
        showError(error.message);
      }
    }
  }

  document.getElementById('microsoft-login')?.addEventListener('click', async () => {
    clearError();
    try {
      const verifier = base64url(crypto.getRandomValues(new Uint8Array(48)));
      const challenge = base64url(new Uint8Array(await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(verifier),
      )));

      sessionStorage.removeItem(oauthHandoffKey);
      sessionStorage.setItem(oauthVerifierKey, verifier);

      const result = await window.MBA_API.request('/auth/microsoft/start', {
        method: 'POST',
        body: JSON.stringify({ handoff_challenge: challenge }),
      });
      const target = new URL(result.url);
      if (target.origin !== 'https://login.microsoftonline.com') {
        throw new Error('Não foi possível realizar o acesso.');
      }
      location.assign(target.href);
    } catch (error) {
      showError(error.message);
    }
  });

  document.getElementById('logout-button')?.addEventListener('click', async () => {
    try {
      await window.MBA_API.request('/auth/session', { method: 'DELETE' });
    } catch (_) {
      showError('Não foi possível confirmar a revogação no servidor.');
    } finally {
      clearStoredToken();
      window.MBA_CURRENT_USER = null;
      setAuthState(false);
    }
  });

  window.addEventListener('mba:session-expired', () => {
    clearStoredToken();
    window.MBA_CURRENT_USER = null;
    setAuthState(false);
    showError('Sua sessão terminou. Entre novamente.');
  });

  initializeAuth();
})();
