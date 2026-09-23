(() => {
  'use strict';

  const tokenKey = 'mba_session_token';
  const oauthVerifierKey = 'mba_oauth_verifier';
  const oauthHandoffKey = 'mba_oauth_handoff';
  const oauthStartedAtKey = 'mba_oauth_started_at';
  const moduleActivationAt = new Map();
  const MODULE_REVALIDATE_MS = 30000;
  let microsoftLoginInFlight = false;
  let loginState = { busy: false, error: null };

  const pagePermissionScopes = Object.freeze({
    dashboard: ['dashboard.view'],
    automacoes: ['automations.view'],
    protocolo: [],
    tutelas: ['tutelas.view'],
    encerramentos: ['encerramentos.view'],
    usuarios: ['users.view'],
    configuracoes: ['settings.view'],
    tarefas: ['tasks.view'],
    'tarefa-analise': [],
    pagamentos: ['pagamentos.view'],
    acordos: ['agreements.view'],
    'acordo-execucao': [],
    'comprovante-execucao': [],
  });

  const getStoredToken = () => {
    const persistent = localStorage.getItem(tokenKey);
    if (persistent) return persistent;

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

  const clearOAuthFlow = () => {
    sessionStorage.removeItem(oauthHandoffKey);
    sessionStorage.removeItem(oauthVerifierKey);
    sessionStorage.removeItem(oauthStartedAtKey);
  };

  const publishLoginState = patch => {
    loginState = { ...loginState, ...patch };
    window.dispatchEvent(new CustomEvent('mba:auth-state', { detail: { ...loginState } }));
  };

  const getLoginState = () => ({ ...loginState });

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
    favicon.href = '/favicon.svg?v=20260917-exact-symbol';
    if (!favicon.parentNode) document.head.appendChild(favicon);

    const appBrand = document.querySelector('.brand');
    if (appBrand) {
      appBrand.innerHTML = `
        <img class="brand-symbol" src="/favicon.svg?v=20260917-exact-symbol" alt="" aria-hidden="true">
        <span class="brand-word">Backoffice</span>
      `;
      appBrand.setAttribute('aria-label', 'Mascarenhas Backoffice');
    }
  }

  function enforceMicrosoftOnlyUserUI() {
    const role = document.getElementById('user-create-role');
    if (role) {
      role.innerHTML = '<option value="administrative">Usuário Microsoft</option>';
      role.value = 'administrative';
      role.disabled = true;
    }
    const modules = document.getElementById('user-create-modules');
    if (modules) modules.hidden = true;
    const taskAccess = document.getElementById('user-create-task-access');
    if (taskAccess) taskAccess.hidden = true;
    const resetOtp = document.getElementById('reset-task-otp');
    if (resetOtp) resetOtp.hidden = true;
  }

  applyBranding();
  enforceMicrosoftOnlyUserUI();

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
  }

  function activePageId() {
    return document.querySelector('main .page.active')?.id || 'dashboard';
  }

  function dispatchModuleAuthentication(pageId = activePageId(), force = false) {
    const user = window.MBA_CURRENT_USER;
    if (!user?.permissions) return;

    const now = Date.now();
    const last = moduleActivationAt.get(pageId) || 0;
    if (!force && now - last < MODULE_REVALIDATE_MS) return;
    moduleActivationAt.set(pageId, now);

    const allowedDuringDispatch = new Set(pagePermissionScopes[pageId] || []);
    const gate = { active: true };
    const permissions = new Proxy(user.permissions, {
      get(target, property, receiver) {
        if (!gate.active || typeof property !== 'string') {
          return Reflect.get(target, property, receiver);
        }
        if (Object.prototype.hasOwnProperty.call(target, property)) {
          return allowedDuringDispatch.has(property) ? Reflect.get(target, property, receiver) : false;
        }
        return Reflect.get(target, property, receiver);
      },
    });
    const detail = { ...user, permissions };
    window.dispatchEvent(new CustomEvent('mba:authenticated', { detail }));
    gate.active = false;
  }

  function installModuleActivationHooks() {
    const originalShowPage = window.showPage;
    if (typeof originalShowPage === 'function' && !originalShowPage.__mbaLazyWrapped) {
      const wrapped = function(pageId, updateRoute = true) {
        const result = originalShowPage(pageId, updateRoute);
        queueMicrotask(() => dispatchModuleAuthentication(pageId));
        return result;
      };
      wrapped.__mbaLazyWrapped = true;
      window.showPage = wrapped;
    }

    document.addEventListener('click', event => {
      if (!window.MBA_CURRENT_USER) return;
      const target = event.target instanceof Element
        ? event.target.closest('[data-page], [data-go]')
        : null;
      if (!target) return;
      queueMicrotask(() => dispatchModuleAuthentication(activePageId()));
    });

    const activateFromHistory = () => {
      if (!window.MBA_CURRENT_USER) return;
      queueMicrotask(() => dispatchModuleAuthentication(activePageId()));
    };
    window.addEventListener('popstate', activateFromHistory);
    window.addEventListener('hashchange', activateFromHistory);
  }

  installModuleActivationHooks();

  async function loadProfile() {
    const profile = await window.MBA_API.request('/api/me');
    applyUser(profile);
    window.restorePageRoute?.();
    dispatchModuleAuthentication(activePageId(), true);
    setAuthState(true);
    publishLoginState({ busy: false, error: null });
  }

  async function loadProfileWithRetry() {
    let lastError;
    for (let attempt = 0; attempt < 3; attempt += 1) {
      try {
        return await loadProfile();
      } catch (error) {
        lastError = error;
        if (error?.status === 401 || error?.status === 403) throw error;
        if (attempt < 2) await new Promise(resolve => setTimeout(resolve, 350 * (attempt + 1)));
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
    localStorage.removeItem('sb-REDACTED_SUPABASE_PROJECT-auth-token');

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
          clearOAuthFlow();
          throw new Error('Não foi possível concluir o acesso. Inicie o login novamente.');
        }
        try {
          const result = await exchangeOAuthHandoff(code, verifier);
          if (!result?.access_token) throw new Error('O servidor não retornou uma sessão válida.');
          setStoredToken(result.access_token);
          clearOAuthFlow();
        } catch (error) {
          if ([401, 403, 422].includes(error?.status)) clearOAuthFlow();
          throw error;
        }
      }

      if (getStoredToken()) {
        await loadProfileWithRetry();
      } else {
        setAuthState(false);
        publishLoginState({ busy: false, error: null });
      }
    } catch (error) {
      const hasToken = Boolean(getStoredToken());
      const invalidSession = error?.status === 401
        && ['SESSION_INVALID', 'AUTH_REQUIRED'].includes(error?.code);
      const unauthorizedProfile = error?.status === 403 && error?.code === 'PROFILE_NOT_AUTHORIZED';

      if (invalidSession || unauthorizedProfile) {
        clearStoredToken();
        window.MBA_CURRENT_USER = null;
        setAuthState(false);
        publishLoginState({
          busy: false,
          error: unauthorizedProfile
            ? 'Seu usuário não possui acesso ativo ao Backoffice.'
            : 'Sua sessão terminou. Entre novamente.',
        });
      } else if (hasToken) {
        setAuthState(false);
        publishLoginState({
          busy: false,
          error: 'Não foi possível validar sua sessão agora. A sessão foi preservada; atualize a página para tentar novamente.',
        });
      } else if (sessionStorage.getItem(oauthHandoffKey) && sessionStorage.getItem(oauthVerifierKey)) {
        setAuthState(false);
        publishLoginState({
          busy: false,
          error: 'Não foi possível concluir o acesso agora. Atualize a página para tentar novamente sem refazer o login da Microsoft.',
        });
      } else {
        setAuthState(false);
        publishLoginState({ busy: false, error: error?.message || 'Não foi possível realizar o acesso.' });
      }
    }
  }

  async function startMicrosoftLogin() {
    if (microsoftLoginInFlight) return;
    microsoftLoginInFlight = true;
    publishLoginState({ busy: true, error: null });

    try {
      const verifier = base64url(crypto.getRandomValues(new Uint8Array(48)));
      const challenge = base64url(new Uint8Array(await crypto.subtle.digest(
        'SHA-256',
        new TextEncoder().encode(verifier),
      )));

      sessionStorage.removeItem(oauthHandoffKey);
      sessionStorage.setItem(oauthVerifierKey, verifier);
      sessionStorage.setItem(oauthStartedAtKey, String(Date.now()));

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
      clearOAuthFlow();
      microsoftLoginInFlight = false;
      publishLoginState({ busy: false, error: error?.message || 'Não foi possível iniciar o acesso com Microsoft.' });
    }
  }

  window.MBA_AUTH = {
    ...(window.MBA_AUTH || {}),
    startMicrosoftLogin,
    getLoginState,
  };

  document.getElementById('logout-button')?.addEventListener('click', async () => {
    try {
      await window.MBA_API.request('/auth/session', { method: 'DELETE' });
    } catch (_) {
      publishLoginState({ error: 'Não foi possível confirmar a revogação no servidor.' });
    } finally {
      clearStoredToken();
      clearOAuthFlow();
      moduleActivationAt.clear();
      window.MBA_CURRENT_USER = null;
      setAuthState(false);
    }
  });

  window.addEventListener('mba:session-expired', () => {
    clearStoredToken();
    clearOAuthFlow();
    moduleActivationAt.clear();
    window.MBA_CURRENT_USER = null;
    microsoftLoginInFlight = false;
    setAuthState(false);
    publishLoginState({ busy: false, error: 'Sua sessão terminou. Entre novamente.' });
  });

  initializeAuth();
})();
