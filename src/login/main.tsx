import { FormEvent, StrictMode, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './login.css';

type LoginState = {
  busy: boolean;
  error: string | null;
};

type AuthWindow = Window & typeof globalThis & {
  MBA_AUTH?: {
    startMicrosoftLogin?: () => Promise<void> | void;
    getLoginState?: () => LoginState;
  };
};

function MicrosoftMark() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
      <path fill="#f25022" d="M2 2h9v9H2z" />
      <path fill="#7fba00" d="M13 2h9v9h-9z" />
      <path fill="#00a4ef" d="M2 13h9v9H2z" />
      <path fill="#ffb900" d="M13 13h9v9h-9z" />
    </svg>
  );
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [authState, setAuthState] = useState<LoginState>({ busy: false, error: null });

  useLayoutEffect(() => {
    document.body.dataset.reactLogin = 'true';
    document.getElementById('login-view')?.removeAttribute('hidden');

    const auth = (window as AuthWindow).MBA_AUTH;
    const current = auth?.getLoginState?.();
    if (current) setAuthState(current);

    const handleAuthState = (event: Event) => {
      const detail = (event as CustomEvent<LoginState>).detail;
      if (detail) setAuthState(detail);
    };

    window.addEventListener('mba:auth-state', handleAuthState);
    return () => window.removeEventListener('mba:auth-state', handleAuthState);
  }, []);

  const startMicrosoftLogin = async () => {
    const start = (window as AuthWindow).MBA_AUTH?.startMicrosoftLogin;
    if (!start || authState.busy) return;
    await start();
  };

  const submit = (event: FormEvent) => {
    event.preventDefault();
    void startMicrosoftLogin();
  };

  return (
    <div className="react-login-view">
      <header className="react-login-header" aria-label="Mascarenhas Backoffice">
        <div className="react-login-brand">
          <img src="/favicon.svg?v=20260917-exact-symbol" alt="" aria-hidden="true" />
          <span>Backoffice</span>
        </div>
      </header>

      <main className="react-login-main">
        <section className="react-login-access" aria-labelledby="react-login-title">
          <h1 id="react-login-title">Entrar</h1>
          <p className="react-login-subtitle">Use sua conta corporativa Microsoft para continuar.</p>

          <form className="react-login-form" onSubmit={submit} noValidate>
            <label className="react-login-field" htmlFor="login-display-email">
              <span>E-mail</span>
              <input
                id="login-display-email"
                name="display-email"
                type="email"
                inputMode="email"
                autoComplete="email"
                placeholder="nome@empresa.com"
                value={email}
                disabled={authState.busy}
                onChange={event => setEmail(event.target.value)}
              />
            </label>

            <button
              className="react-login-primary"
              type="submit"
              aria-busy={authState.busy}
              disabled={authState.busy}
            >
              {authState.busy ? 'Redirecionando…' : 'Acessar'}
            </button>

            <div className="react-login-divider" aria-hidden="true"><span>ou</span></div>

            <button
              className="react-login-corporate"
              type="button"
              aria-busy={authState.busy}
              disabled={authState.busy}
              onClick={() => void startMicrosoftLogin()}
            >
              <MicrosoftMark />
              <span>Acesso Corporativo</span>
            </button>
          </form>

          {authState.error ? (
            <div className="react-login-error" role="alert">{authState.error}</div>
          ) : null}

          <p className="react-login-security">Acesso restrito a usuários autorizados.</p>
        </section>
      </main>
    </div>
  );
}

const mount = document.getElementById('login-view');
if (mount) {
  createRoot(mount).render(
    <StrictMode>
      <LoginPage />
    </StrictMode>,
  );
}
