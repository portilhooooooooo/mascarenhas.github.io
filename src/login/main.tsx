import { type FormEvent, StrictMode, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './login.css';

type LoginState = { busy: boolean; error: string | null; };
type AuthWindow = Window & typeof globalThis & {
  MBA_AUTH?: {
    startMicrosoftLogin?: () => Promise<void> | void;
    getLoginState?: () => LoginState;
  };
};

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
    return () => {
      window.removeEventListener('mba:auth-state', handleAuthState);
    };
  }, []);

  const startMicrosoftLogin = async () => {
    const start = (window as AuthWindow).MBA_AUTH?.startMicrosoftLogin;
    if (authState.busy) return;
    if (!start) { setAuthState({busy:false,error:'Não foi possível iniciar o acesso. Atualize a página e tente novamente.'}); return; }
    try { await start(); } catch { setAuthState({busy:false,error:'Não foi possível iniciar o acesso com Microsoft.'}); }
  };
  const submit = (event: FormEvent) => {
    event.preventDefault();
    // O e-mail identifica o usuário visualmente; a autenticação continua via SSO Microsoft.
    void startMicrosoftLogin();
  };

  return <div className="react-login-view">
    <header className="react-login-header" aria-label="Mascarenhas Barbosa Backoffice">
      <div className="react-login-brand">
        <img src="/favicon-white.svg?v=20261013-original-mark" alt="" aria-hidden="true"/>
        <span>Mascarenhas Barbosa<small>BACKOFFICE</small></span>
      </div>
    </header>
    <main className="react-login-main">
      <section className="react-login-access" aria-labelledby="react-login-title">
        <h1 id="react-login-title">Explore como estamos trabalhando</h1>
        <form className="react-login-form" noValidate onSubmit={submit}>
          <button className="react-login-corporate" type="button"
            onClick={() => void startMicrosoftLogin()} aria-busy={authState.busy}
            disabled={authState.busy}>
            <svg aria-hidden="true" viewBox="0 0 24 24" focusable="false">
              <path fill="#F35325" d="M1 1h10v10H1z"/>
              <path fill="#81BC06" d="M13 1h10v10H13z"/>
              <path fill="#05A6F0" d="M1 13h10v10H1z"/>
              <path fill="#FFBA08" d="M13 13h10v10H13z"/>
            </svg>
            Continuar via Microsoft
          </button>
          <div className="react-login-divider" aria-hidden="true">ou</div>
          <label className="react-login-field" htmlFor="login-display-email">
            <span>E-mail corporativo</span>
            <input id="login-display-email" name="display-email" type="email" inputMode="email"
              autoComplete="email" placeholder="apenas@mascarenhasbarbosa.com.br" value={email}
              disabled={authState.busy} onChange={event => setEmail(event.target.value)}/>
          </label>
          <button className="react-login-primary" type="submit"
            aria-busy={authState.busy} disabled={authState.busy}>
            {authState.busy ? 'Redirecionando…' : 'Entrar'}
          </button>
        </form>
        {authState.error ? <div className="react-login-error" role="alert">{authState.error}</div> : null}
      </section>
      <aside className="react-login-visual" aria-label="Identidade visual Mascarenhas Barbosa">
        <video autoPlay muted playsInline loop preload="auto"
          poster="/assets/mascarenhas-login-poster.jpg?v=20261027-3b74ad84"
          aria-label="Vídeo institucional do escritório Mascarenhas Barbosa">
          <source src="/assets/mascarenhas-login.mp4?v=20261027-3b74ad84" type="video/mp4"/>
        </video>
        <div className="react-login-visual-caption"><span>MASCARENHAS BARBOSA · DESDE 1968</span><strong>Transformando ideias em produção.</strong></div>
      </aside>
    </main>
  </div>;
}

const mount = document.getElementById('login-view');
if (mount) createRoot(mount).render(<StrictMode><LoginPage/></StrictMode>);
