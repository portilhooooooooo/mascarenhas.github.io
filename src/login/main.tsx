import { type FormEvent, StrictMode, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import './login.css';
import './institutional-loading.css';
import { InstitutionalLoading } from './institutional-loading';

type LoginState = { busy: boolean; error: string | null; status?: string };
type AuthWindow = Window & typeof globalThis & {
  MBA_AUTH?: {
    startMicrosoftLogin?: () => Promise<void> | void;
    getLoginState?: () => LoginState;
  };
};

function transitionIsActive(): boolean {
  return document.body.classList.contains('auth-loading')
    || document.body.classList.contains('auth-validating')
    || document.body.classList.contains('mba-auth-transition-hold');
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [authState, setAuthState] = useState<LoginState>(() =>
    (window as AuthWindow).MBA_AUTH?.getLoginState?.() || { busy: false, error: null }
  );
  const [validating, setValidating] = useState(transitionIsActive);
  const inFlight = useRef(false);

  useLayoutEffect(() => {
    document.body.dataset.reactLogin = 'true';
    document.getElementById('login-view')?.removeAttribute('hidden');
    const sync = () => setValidating(transitionIsActive());
    const observer = new MutationObserver(sync);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });
    const current = (window as AuthWindow).MBA_AUTH?.getLoginState?.();
    if (current) setAuthState(current);
    sync();
    const handleAuth = (event: Event) => {
      const detail = (event as CustomEvent<LoginState>).detail;
      if (detail) {
        setAuthState(detail);
        if (!detail.busy) inFlight.current = false;
      }
    };
    window.addEventListener('mba:auth-state', handleAuth);
    return () => {
      observer.disconnect();
      window.removeEventListener('mba:auth-state', handleAuth);
      delete document.body.dataset.reactLogin;
    };
  }, []);

  const startMicrosoftLogin = async () => {
    if (authState.busy || inFlight.current) return;
    const start = (window as AuthWindow).MBA_AUTH?.startMicrosoftLogin;
    if (!start) {
      setAuthState({ busy: false, error: 'Não foi possível iniciar o acesso. Atualize a página e tente novamente.' });
      return;
    }
    inFlight.current = true;
    try { await start(); }
    catch {
      inFlight.current = false;
      setAuthState({ busy: false, error: 'Não foi possível iniciar o acesso com Microsoft.' });
    }
  };
  const submitEmail = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    // This option preserves the existing corporate Microsoft SSO; it is not a new identity provider.
    void startMicrosoftLogin();
  };

  const overlayRoot = document.getElementById('login-transition-root');
  const preparing = authState.busy || validating;

  return <>
    <div className="react-login-view">
      <header className="react-login-header" aria-label="Mascarenhas Barbosa Backoffice">
        <div className="react-login-brand">
          <img src="/favicon-white.svg?v=20261013-original-mark" alt="" aria-hidden="true"/>
          <span>Mascarenhas Barbosa<small>BACKOFFICE</small></span>
        </div>
      </header>
      <main className="react-login-main">
        <section className="react-login-access" aria-labelledby="react-login-title">
          <h1 id="react-login-title">Explore como estamos trabalhando</h1>
          <div className="react-login-form">
            <button className="react-login-corporate" type="button"
              onClick={() => void startMicrosoftLogin()} disabled={authState.busy} aria-busy={authState.busy}>
              <svg className="react-login-microsoft-symbol" aria-hidden="true" viewBox="0 0 24 24">
                <path fill="#F35325" d="M1 1h10v10H1z"/>
                <path fill="#81BC06" d="M13 1h10v10H13z"/>
                <path fill="#05A6F0" d="M1 13h10v10H1z"/>
                <path fill="#FFBA08" d="M13 13h10v10H13z"/>
              </svg>
              Continuar com a Microsoft
            </button>
            <div className="react-login-divider" aria-hidden="true">OU</div>
            <form className="react-login-email-form" onSubmit={submitEmail}>
              <label className="react-login-field" htmlFor="login-display-email">
                <span>E-mail corporativo</span>
                <input id="login-display-email" name="display-email" type="email" inputMode="email" required
                  autoComplete="email" placeholder="Digite seu e-mail corporativo" value={email}
                  disabled={authState.busy} onChange={event => setEmail(event.target.value)}/>
              </label>
              <button className="react-login-primary" type="submit"
                aria-busy={authState.busy} disabled={authState.busy}>Continuar</button>
            </form>
          </div>
          {authState.error ? <div className="react-login-error" role="alert">{authState.error}</div> : null}
        </section>
        <aside className="react-login-visual" aria-label="Identidade visual Mascarenhas Barbosa">
          <video autoPlay muted playsInline loop preload="auto"
            poster="/assets/mascarenhas-login-poster.jpg?v=20261027-3b74ad84"
            aria-label="Vídeo institucional do escritório Mascarenhas Barbosa">
            <source src="/assets/mascarenhas-login.mp4?v=20261027-3b74ad84" type="video/mp4"/>
          </video>
        </aside>
      </main>
    </div>
    {overlayRoot ? createPortal(<InstitutionalLoading visible={preparing}/>, overlayRoot) : null}
  </>;
}

const mount = document.getElementById('login-view');
if (mount) createRoot(mount).render(<StrictMode><LoginPage/></StrictMode>);
