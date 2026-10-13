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

function greetingFor(date: Date): string {
  const hour = date.getHours();
  return hour < 12 ? 'Bom dia.' : hour < 18 ? 'Boa tarde.' : 'Boa noite.';
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [authState, setAuthState] = useState<LoginState>({ busy: false, error: null });
  const [greeting, setGreeting] = useState(() => greetingFor(new Date()));

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
    const refreshGreeting = () => setGreeting(greetingFor(new Date()));
    window.addEventListener('focus', refreshGreeting);
    window.addEventListener('mba:auth-state', handleAuthState);
    return () => {
      window.removeEventListener('focus', refreshGreeting);
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
        <h1 id="react-login-title">{greeting}</h1>
        <p className="react-login-subtitle">Faça login abaixo e explore como estamos trabalhando</p>
        <form className="react-login-form" noValidate onSubmit={submit}>
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
          poster="/assets/mascarenhas-login-poster.jpg"
          aria-label="Vídeo institucional do escritório Mascarenhas Barbosa">
          <source src="/assets/mascarenhas-login.mp4" type="video/mp4"/>
        </video>
        <div className="react-login-visual-caption"><span>MASCARENHAS BARBOSA</span><strong>Operação que transforma informação em decisão.</strong></div>
      </aside>
    </main>
  </div>;
}

const mount = document.getElementById('login-view');
if (mount) createRoot(mount).render(<StrictMode><LoginPage/></StrictMode>);
