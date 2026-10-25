(() => {
  'use strict';

  const tokenKey = 'mba_session_token';
  const oauthVerifierKey = 'mba_oauth_verifier';
  const oauthHandoffKey = 'mba_oauth_handoff';
  const oauthStartedAtKey = 'mba_oauth_started_at';
  const moduleActivationAt = new Map();
  const MODULE_REVALIDATE_MS = 30000;
  let microsoftLoginInFlight = false;
  let loginState = { busy: false, error: null, status: 'initializing' };
  let bootstrapGeneration = 0;
  const sessionEndMessage = reason => reason === 'session_replaced'
    ? 'Sua sessão foi substituída por um novo login em outro navegador ou dispositivo. Entre novamente se desejar continuar aqui.'
    : reason === 'session_revoked' ? 'Sua sessão foi revogada. Entre novamente.'
    : 'Sua sessão terminou. Entre novamente.';
  const immutableCopy = value => {
    const copy = JSON.parse(JSON.stringify(value));
    const freeze = item => { if (item && typeof item === 'object') { Object.values(item).forEach(freeze); Object.freeze(item); } return item; };
    return freeze(copy);
  };
  const generationKey = 'mba_runtime_generation';
  const setGeneration = value => { window.MBA_SESSION_GENERATION=value; try{sessionStorage.setItem(generationKey,value);}catch{} };
  try{setGeneration(sessionStorage.getItem(generationKey)||crypto.randomUUID());}catch{setGeneration(crypto.randomUUID());}

  const pagePermissionScopes = Object.freeze({
    dashboard: ['dashboard.view'],
    processos: ['processos.view'],
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
    const changed=token!==getStoredToken();
    localStorage.setItem(tokenKey, token);
    sessionStorage.removeItem(tokenKey);
    if(changed){
      setGeneration(crypto.randomUUID());
      window.MBA_CURRENT_USER=null;
      window.dispatchEvent(new Event('mba:logged-out'));
    }
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
    document.body.classList.remove('auth-loading', 'auth-signed-in', 'auth-signed-out', 'auth-unavailable', 'auth-validating');
    document.getElementById('runtime-auth-unavailable')?.remove();
    document.querySelector('.app-shell')?.removeAttribute('inert');
    document.body.classList.add(signedIn ? 'auth-signed-in' : 'auth-signed-out');
  };

  function applyBranding() {
    document.title = 'Mascarenhas Barbosa';

    const description = document.querySelector('meta[name="description"]');
    if (description) description.setAttribute('content', 'Mascarenhas Backoffice');

    const favicon = document.querySelector('link[rel~="icon"]') || document.createElement('link');
    favicon.rel = 'icon';
    favicon.type = 'image/svg+xml';
    favicon.href = '/favicon-white.svg?v=20261011';
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

  // O seletor de carteira altera capacidades sem executar applyUser novamente.
  // Sincronizar a visibilidade do container real, não apenas os botões da nav.
  function syncAuthorizedPages() {
    const user = window.MBA_CURRENT_USER;
    if (!user?.permissions) return;
    const canAccess = pageId => window.MBA_PORTFOLIO_POLICY?.canAccess(pageId, user) === true;
    document.querySelectorAll('[data-permission]').forEach(element => {
      const pageId = element.dataset.page || (element.classList.contains('page') ? element.id : '');
      element.hidden = pageId
        ? (!canAccess(pageId) || (element.closest('.main-nav') && !['processos', 'tarefas', 'acordos', 'automacoes', 'dashboard', 'banco-dados'].includes(pageId)))
        : user.permissions[element.dataset.permission] !== true;
    });
    // The static HTML contains legacy pages required by old deep links. They are
    // not navigation items; never unhide those buttons while the React shell boots.
    const primaryNav = new Set(['processos', 'tarefas', 'acordos', 'automacoes', 'dashboard', 'banco-dados']);
    document.querySelectorAll('.main-nav .nav-item').forEach(button => {
      const page = button.dataset.page || '';
      if (!primaryNav.has(page) || !canAccess(page)) {
        button.hidden = true;
        button.dataset.mbaHidden = 'true';
      }
    });
    document.querySelectorAll('main .page[id]').forEach(page => {
      if (page.id !== 'sem-acesso') page.hidden = !canAccess(page.id);
    });
    window.dispatchEvent(new CustomEvent('mba:module-visibility-updated'));
  }

  function applyUser(user) {
    if (!user?.id || !user?.email || typeof user.permissions !== 'object') {
      throw new Error('O perfil autenticado retornado pela API é inválido.');
    }

    window.MBA_CURRENT_USER = immutableCopy(user);
    const name = user.name || user.nome || user.email.split('@')[0];
    const firstName = name.trim().split(/\s+/)[0];
    const initials = name.trim().split(/\s+/).slice(0, 2).map(part => part[0]?.toUpperCase()).join('') || 'U';
    const roleLabels = { admin: 'Administrador', user: 'Usuário' };

    document.getElementById('profile-name').textContent = name;
    document.getElementById('profile-role').textContent = roleLabels[user.role] || 'Usuário';
    document.getElementById('profile-avatar').textContent = initials;
    const welcomeName = document.getElementById('welcome-name');
    if (welcomeName) welcomeName.textContent = firstName;

    syncAuthorizedPages();
    const canAccess = pageId => window.MBA_PORTFOLIO_POLICY?.canAccess(pageId, user) === true;
    document.querySelectorAll('.master-admin-only').forEach(element => {
      element.hidden = !user.is_master_admin;
    });

    // Prefer actual shell modules as the post-login landing page.
    const pages = [
      ['dashboard', 'dashboard.view'],
      ['processos', 'processos.view'],
      ['acordos', 'pagamentos.view'],
      ['tarefas', 'tasks.view'],
      ['protocolo', 'automations.view'],
      ['automacoes', 'automations.view'],
      ['usuarios', 'users.view'],
      ['configuracoes', 'settings.view'],
      ['tutelas', 'tutelas.view'],
      ['encerramentos', 'encerramentos.view'],
      ['pagamentos', 'pagamentos.view'],
    ].filter(([pageId]) => canAccess(pageId));

    // Deep links must be restored before choosing the initial module.
    const routeRestored = window.restorePageRoute?.() === true;
    if (!pages.length) {
      window.showPage?.('sem-acesso');
    } else if (!routeRestored) {
      window.showPage?.(pages[0][0]);
    }
  }

  window.addEventListener('mba:portfolio-changed', syncAuthorizedPages);

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

    window.dispatchEvent(new CustomEvent('mba:module-activated', {
      detail: immutableCopy({ pageId, user }),
    }));
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

  async function loadProfile(options, generation) {
    const token = getStoredToken();
    let profile;
    try { profile = await window.MBA_API.request('/api/me', options); }
    catch (error) {
      if (token !== getStoredToken() || generation !== bootstrapGeneration)
        throw Object.assign(new Error('Identidade alterada durante validação.'), {code:'STALE_IDENTITY',revalidate:generation===bootstrapGeneration && token!==getStoredToken()});
      throw error;
    }
    if (token !== getStoredToken() || generation !== bootstrapGeneration) throw Object.assign(new Error('Identidade alterada durante validação.'), {code:'STALE_IDENTITY',revalidate:generation===bootstrapGeneration && token!==getStoredToken()});
    const accessKey = user => user && JSON.stringify([user.id,user.role,user.active_portfolio_id||user.default_portfolio_id,
      Object.entries(user.permissions||{}).sort(([a],[b])=>a.localeCompare(b)),user.authorization_version]);
    const accessChanged = accessKey(window.MBA_CURRENT_USER) !== accessKey(profile);
    window.MBA_API.configurePortfolios?.(
      profile.portfolios,
      profile.default_portfolio_id
    );
    applyUser(profile);
    if (accessChanged) {
      window.dispatchEvent(new CustomEvent('mba:profile-ready', { detail: immutableCopy(profile) }));
      window.restorePageRoute?.();
      window.dispatchEvent(new CustomEvent('mba:authenticated', { detail: immutableCopy(profile) }));
      dispatchModuleAuthentication(activePageId(), true);
    }
    setAuthState(true);
    publishLoginState({ busy: false, error: null, status: 'authenticated' });
  }

  async function loadProfileWithRetry(deadline = performance.now() + 10000, maxAttempts = 2) {
    const generation = ++bootstrapGeneration;
    let lastError;
    for (let attempt = 0; attempt < maxAttempts; attempt += 1) {
      const controller = new AbortController();
      const remaining = deadline - performance.now();
      if (remaining <= 0) break;
      const timer = setTimeout(() => controller.abort(), attempt === 0 ? Math.min(4750, remaining) : remaining);
      try { return await loadProfile({signal:controller.signal}, generation); }
      catch (error) {
        lastError = error;
        if (generation !== bootstrapGeneration || error?.code === 'STALE_IDENTITY' || (error?.status && ![502,503,504].includes(error.status))) throw error;
        if (attempt + 1 < maxAttempts) await new Promise(resolve => setTimeout(resolve, 200));
      } finally { clearTimeout(timer); }
    }
    throw lastError || new Error('Orçamento de validação esgotado.');
  }

  async function exchangeOAuthHandoff(code, verifier, deadline) {
    let lastError;
    for (let attempt = 0; attempt < 2; attempt += 1) {
      const remaining = deadline - performance.now();
      if (remaining <= 0) break;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), attempt === 0 ? Math.min(4750, remaining) : remaining);
      try {
        return await window.MBA_API.request('/auth/session/exchange', {
          method: 'POST',
          signal: controller.signal,
          body: JSON.stringify({ handoff_code: code, handoff_verifier: verifier }),
        });
      } catch (error) {
        lastError = error;
        if (error?.status && ![409,502,503,504].includes(error.status)) throw error;
        if (attempt === 0) await new Promise(resolve => setTimeout(resolve, 200));
      } finally { clearTimeout(timer); }
    }
    throw lastError || new Error('Orçamento de acesso esgotado.');
  }

  const base64url = bytes => btoa(String.fromCharCode(...bytes))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');

  async function initializeAuth(deadline = performance.now() + 10000, maxAttempts = 2) {
    if(getStoredToken()){
      document.body.classList.add('auth-validating');
      document.querySelector('.app-shell')?.setAttribute('inert','');
      const route=(location.hash.startsWith('#/')?location.hash.slice(2):location.pathname).replace(/^\//,'');
      if(/^tarefas(?:\/|$)/.test(route) && !window.MBA_CURRENT_USER){
        document.querySelectorAll('main .page').forEach(page=>page.classList.toggle('active',page.id==='tarefas'));
      }
    }
    sessionStorage.removeItem('mba_task_worker_token');
    sessionStorage.removeItem('mba_task_only_user');
    sessionStorage.removeItem('mba_google_verifier');
    sessionStorage.removeItem('mba_google_handoff');
    localStorage.removeItem('mba_temp_access');
    localStorage.removeItem('mba_temp_email');

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
          const result = await exchangeOAuthHandoff(code, verifier, deadline);
          if (!result?.access_token) throw new Error('O servidor não retornou uma sessão válida.');
          setStoredToken(result.access_token);
          localStorage.removeItem('mba_oauth_lease');
          clearOAuthFlow();
        } catch (error) {
          if ([401, 403, 422].includes(error?.status)) clearOAuthFlow();
          throw error;
        }
      }

      if (getStoredToken()) {
        await loadProfileWithRetry(deadline, maxAttempts);
      } else {
        setAuthState(false);
        publishLoginState({ busy: false, error: null });
      }
    } catch (error) {
      if (error?.code === 'STALE_IDENTITY') {
        if(error.revalidate && getStoredToken())await initializeAuth(deadline,1);
        return;
      }
      const hasToken = Boolean(getStoredToken());
      const invalidSession = error?.status === 401
        && ['SESSION_INVALID', 'AUTH_REQUIRED'].includes(error?.code);
      const unauthorizedProfile = error?.status === 403 && error?.code === 'PROFILE_NOT_AUTHORIZED';

      if (invalidSession || unauthorizedProfile) {
        publishLoginState({status:unauthorizedProfile ? 'forbidden' : 'expired_or_revoked'});
        window.dispatchEvent(new Event('mba:logged-out'));
        clearStoredToken();
        window.MBA_CURRENT_USER = null;
        setAuthState(false);
        publishLoginState({
          busy: false,
          error: unauthorizedProfile
            ? 'Seu usuário não possui acesso ativo ao Backoffice.'
            : sessionEndMessage(error?.reason),
        });
      } else if (hasToken) {
        document.body.classList.remove('auth-loading', 'auth-signed-out', 'auth-signed-in', 'auth-validating');
        document.body.classList.add('auth-unavailable');
        document.querySelector('.app-shell')?.setAttribute('inert', '');
        let notice = document.getElementById('runtime-auth-unavailable');
        if (!notice) {
          notice = document.createElement('div'); notice.id = 'runtime-auth-unavailable'; notice.setAttribute('role','alert');
          const message = document.createElement('p'); message.textContent = 'Não foi possível validar seu acesso agora. Sua sessão foi preservada.';
          const retry = document.createElement('button'); retry.textContent = 'Tentar novamente'; retry.onclick = () => { retry.disabled = true; void initializeAuth(); };
          notice.append(message,retry); document.body.appendChild(notice);
        } else notice.querySelector('button').disabled = false;
        publishLoginState({status:'temporarily_unavailable'});
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
    if (getStoredToken()) { await initializeAuth(); return; }
    const leaseKey = 'mba_oauth_lease';
    const start = async () => {
      const lease = Number(localStorage.getItem(leaseKey) || 0);
      if (Date.now() - lease < 60000) { publishLoginState({busy:false,error:'Outro acesso Microsoft está em andamento neste navegador.'}); return; }
      localStorage.setItem(leaseKey,String(Date.now()));
      return beginMicrosoftLogin();
    };
    if (navigator.locks) return navigator.locks.request('mba-oauth-start', start);
    return start();
  }

  async function beginMicrosoftLogin() {
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
      localStorage.removeItem('mba_oauth_lease');
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
      window.dispatchEvent(new Event('mba:logged-out'));
    }
  });

  window.addEventListener('mba:session-expired', event => {
    clearStoredToken();
    clearOAuthFlow();
    moduleActivationAt.clear();
    window.MBA_CURRENT_USER = null;
    microsoftLoginInFlight = false;
    setAuthState(false);
    publishLoginState({ busy: false, status:'expired_or_revoked', error: sessionEndMessage(event.detail?.reason) });
  });

  window.addEventListener('mba:authorization-invalidated',()=>{
    bootstrapGeneration+=1;
    document.querySelector('.app-shell')?.setAttribute('inert','');
    publishLoginState({status:'initializing'});
    void initializeAuth();
  });
  window.addEventListener('storage', event => {
    if (event.key !== tokenKey && event.key !== 'mba_portfolio_id') return;
    bootstrapGeneration += 1;
    window.MBA_CURRENT_USER = null;
    window.dispatchEvent(new Event('mba:logged-out'));
    setGeneration(crypto.randomUUID());
    void initializeAuth();
  });
  // One lightweight global authorization guard; hidden modules do not own polls.
  // Only enabled when the API supplies a policy version. No token enters its key.
  let guardTimer;
  let guardRunning = false;
  const scheduleGuard = () => {
    clearTimeout(guardTimer);
    if (window.MBA_CURRENT_USER?.policy_epoch) guardTimer = setTimeout(checkAuthorization, 15000);
  };
  async function checkAuthorization() {
    if (guardRunning) return;
    const profile = window.MBA_CURRENT_USER;
    if (document.hidden || loginState.status !== 'authenticated' || !profile?.policy_epoch) { scheduleGuard(); return; }
    guardRunning = true;
    const deadline = performance.now() + 10000;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 4000);
    try {
      const state = await window.MBA_API.request('/api/me/state', {signal:controller.signal});
      if (profile !== window.MBA_CURRENT_USER) return;
      if (state?.id !== profile.id || typeof state?.policy_epoch !== 'string') throw new Error('Estado de autorização inválido.');
      if (state.policy_epoch !== profile.policy_epoch) await initializeAuth(deadline, 1);
    } catch (error) {
      if (error?.code !== 'STALE_IDENTITY' && getStoredToken() && profile === window.MBA_CURRENT_USER) {
        document.querySelector('.app-shell')?.setAttribute('inert','');
        publishLoginState({status:'initializing'});
        await initializeAuth(deadline, 1);
      }
    } finally {
      clearTimeout(timer); guardRunning = false; scheduleGuard();
    }
  }
  window.addEventListener('mba:authenticated', scheduleGuard);
  window.addEventListener('mba:logged-out', () => clearTimeout(guardTimer));
  document.addEventListener('visibilitychange', () => { if (!document.hidden) void checkAuthorization(); });
  initializeAuth();
})();
