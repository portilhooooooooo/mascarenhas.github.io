(() => {
  'use strict';

  const version = '20260922-login-workspace-v4';
  const screen = document.getElementById('login-screen');
  const errorBox = document.getElementById('login-error');
  if (!screen || screen.dataset.workspaceLogin === 'true') return;

  const verifierKey = 'mba_oauth_verifier';
  const handoffKey = 'mba_oauth_handoff';
  const startedAtKey = 'mba_oauth_started_at';
  const base64url = bytes => btoa(String.fromCharCode(...bytes)).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
  const showError = message => { if (errorBox) { errorBox.textContent = message; errorBox.style.display = 'block'; } };
  const clearError = () => { if (errorBox) { errorBox.textContent = ''; errorBox.style.display = 'none'; } };

  const render = () => {
    if (screen.dataset.workspaceLogin === 'true') return;
    const header = document.createElement('header');
    header.className = 'login-workspace-header';
    const brand = document.createElement('div');
    brand.className = 'brand';
    brand.innerHTML = '<img class="brand-symbol" src="/favicon.svg?v=20260917-exact-symbol" alt="" aria-hidden="true"><span class="brand-word">Backoffice</span>';
    header.appendChild(brand);

    const main = document.createElement('main');
    main.className = 'login-workspace-main';
    const access = document.createElement('section');
    access.className = 'login-access';
    access.innerHTML = '<h1 id="login-access-title">Entrar</h1><p class="login-access-subtitle">Use sua conta Microsoft para continuar.</p>';
    const form = document.createElement('form');
    form.className = 'login-access-form';
    form.noValidate = true;
    const field = document.createElement('div');
    field.className = 'login-access-field';
    field.innerHTML = '<label for="login-display-email">E-mail</label><input id="login-display-email" name="display-email" type="text" inputmode="email" autocomplete="email" placeholder="nome@empresa.com">';
    const primary = document.createElement('button');
    primary.className = 'login-access-primary'; primary.type = 'submit'; primary.textContent = 'Acessar';
    const divider = document.createElement('div');
    divider.className = 'login-access-divider'; divider.textContent = 'ou';
    const corporate = document.createElement('button');
    corporate.className = 'login-access-secondary'; corporate.type = 'button'; corporate.textContent = 'Acesso Corporativo';
    const oauthButton = document.createElement('button');
    oauthButton.className = 'login-oauth-proxy'; oauthButton.id = 'microsoft-login'; oauthButton.type = 'button'; oauthButton.tabIndex = -1; oauthButton.setAttribute('aria-hidden', 'true'); oauthButton.innerHTML = '<span>Entrar com Microsoft</span>';
    form.append(field, primary, divider, corporate, oauthButton); if (errorBox) form.appendChild(errorBox);
    access.appendChild(form); main.appendChild(access); screen.replaceChildren(header, main);
    screen.classList.add('login-workspace'); screen.dataset.workspaceLogin = 'true'; screen.style.visibility = 'visible';

    let redirecting = false;
    const setBusy = busy => { redirecting = busy; primary.disabled = busy; corporate.disabled = busy; oauthButton.disabled = busy; primary.textContent = busy ? 'Redirecionando…' : 'Acessar'; };
    const startMicrosoft = async () => {
      if (redirecting) return;
      setBusy(true); clearError();
      try {
        const verifier = base64url(crypto.getRandomValues(new Uint8Array(48)));
        const challenge = base64url(new Uint8Array(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(verifier))));
        sessionStorage.removeItem(handoffKey); sessionStorage.setItem(verifierKey, verifier); sessionStorage.setItem(startedAtKey, String(Date.now()));
        const result = await window.MBA_API.request('/auth/microsoft/start', { method: 'POST', body: JSON.stringify({ handoff_challenge: challenge }) });
        const target = new URL(result.url);
        if (target.origin !== 'https://login.microsoftonline.com') throw new Error('Não foi possível iniciar o acesso corporativo.');
        window.location.assign(target.href);
      } catch (error) {
        sessionStorage.removeItem(handoffKey); sessionStorage.removeItem(verifierKey); sessionStorage.removeItem(startedAtKey); setBusy(false);
        showError(error?.message || 'Não foi possível iniciar o acesso com Microsoft.');
      }
    };
    form.addEventListener('submit', event => { event.preventDefault(); startMicrosoft(); });
    corporate.addEventListener('click', startMicrosoft);
  };

  screen.style.visibility = 'hidden';
  const existingStylesheet = document.querySelector('link[data-login-workspace="true"]');
  if (existingStylesheet) {
    render();
    return;
  }
  const stylesheet = document.createElement('link');
  stylesheet.rel = 'stylesheet'; stylesheet.href = `/login-ui.css?v=${version}`; stylesheet.dataset.loginWorkspace = 'true';
  stylesheet.addEventListener('load', render, { once: true });
  stylesheet.addEventListener('error', () => { screen.style.visibility = 'visible'; }, { once: true });
  document.head.appendChild(stylesheet);
})();
