import { type FormEvent, StrictMode, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './login.css';

type LoginState = { busy: boolean; error: string | null; };
type AuthWindow = Window & typeof globalThis & {
  MBA_AUTH?: {
    startMicrosoftLogin?: () => Promise<void> | void;
    getLoginState?: () => LoginState;
  };
  // Mídia institucional é configurável: sem URL não é carregado recurso inexistente.
  MBA_BRAND_MEDIA?: { videoUrl?: string; posterUrl?: string };
};

function MicrosoftMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="#f25022" d="M2 2h9v9H2z"/>
    <path fill="#7fba00" d="M13 2h9v9h-9z"/>
    <path fill="#00a4ef" d="M2 13h9v9H2z"/>
    <path fill="#ffb900" d="M13 13h9v9h-9z"/>
  </svg>;
}

function GoogleMark() {
  return <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
    <path fill="#4285F4" d="M21.6 12.23c0-.71-.06-1.24-.2-1.8H12v3.47h5.52c-.11.86-.71 2.16-2.05 3.03l-.02.12 2.98 2.31.2.02c1.85-1.71 2.97-4.23 2.97-7.15Z"/>
    <path fill="#34A853" d="M12 22c2.69 0 4.95-.89 6.6-2.42l-3.15-2.45c-.84.57-1.97.97-3.45.97-2.59 0-4.78-1.72-5.57-4.1l-.12.01-3.1 2.4-.04.11C4.8 19.76 8.14 22 12 22Z"/>
    <path fill="#FBBC05" d="M6.43 14a6.1 6.1 0 0 1-.33-2c0-.7.12-1.38.32-2l-.01-.13-3.14-2.44-.1.05A10 10 0 0 0 2 12c0 1.62.39 3.15 1.17 4.52L6.43 14Z"/>
    <path fill="#EA4335" d="M12 5.9c1.87 0 3.13.81 3.85 1.47l2.82-2.75C16.94 3.02 14.69 2 12 2 8.14 2 4.8 4.24 3.17 7.48L6.42 10C7.22 7.62 9.41 5.9 12 5.9Z"/>
  </svg>;
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [authState, setAuthState] = useState<LoginState>({ busy: false, error: null });
  const media = (window as AuthWindow).MBA_BRAND_MEDIA;

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
    // O e-mail identifica o usuário visualmente; a autenticação continua via SSO Microsoft.
    void startMicrosoftLogin();
  };

  return <div className="react-login-view">
    <header className="react-login-header" aria-label="Mascarenhas Barbosa Backoffice">
      <div className="react-login-brand">
        <img src="/favicon.svg?v=20260917-exact-symbol" alt="" aria-hidden="true"/>
        <span>Mascarenhas Barbosa<small>BACKOFFICE</small></span>
      </div>
    </header>
    <main className="react-login-main">
      <section className="react-login-access" aria-labelledby="react-login-title">
        <h1 id="react-login-title">Explore como estamos trabalhando.</h1>
        <p className="react-login-subtitle">Tarefas, operação e automações em um único lugar.</p>
        <form className="react-login-form" onSubmit={submit}>
          <button className="react-login-corporate" type="button"
            disabled={authState.busy} aria-busy={authState.busy}
            onClick={() => void startMicrosoftLogin()}>
            <MicrosoftMark/><span>Entrar com Microsoft</span>
          </button>
          <button className="react-login-corporate react-login-unavailable" type="button"
            disabled title="O login Google ainda não está habilitado no servidor">
            <GoogleMark/><span>Entrar com Google</span><small>Em breve</small>
          </button>
          <div className="react-login-divider" aria-hidden="true"><span>ou</span></div>
          <label className="react-login-field" htmlFor="login-display-email">
            <span>E-mail corporativo</span>
            <input id="login-display-email" name="display-email" type="email" inputMode="email"
              autoComplete="email" placeholder="Digite seu e-mail" value={email}
              disabled={authState.busy} onChange={event => setEmail(event.target.value)}/>
          </label>
          <button className="react-login-primary" type="submit"
            aria-busy={authState.busy} disabled={authState.busy}>
            {authState.busy ? 'Redirecionando…' : 'Continuar via Microsoft'}
          </button>
        </form>
        {authState.error ? <div className="react-login-error" role="alert">{authState.error}</div> : null}
        <p className="react-login-security">Acesso exclusivo para usuários autorizados.</p>
      </section>
      <aside className="react-login-visual" aria-label="Identidade visual Mascarenhas Barbosa">
        {media?.videoUrl ? <video autoPlay muted playsInline loop preload="metadata"
          poster={media.posterUrl || undefined} aria-label="Fachada do escritório Mascarenhas Barbosa">
          <source src={media.videoUrl} type="video/mp4"/>
        </video> : <div className="react-login-visual-fallback" aria-hidden="true">
          <img src="/favicon.svg?v=20260917-exact-symbol" alt=""/>
        </div>}
        <div className="react-login-visual-caption"><span>MASCARENHAS BARBOSA</span><strong>Operação que transforma informação em decisão.</strong></div>
      </aside>
    </main>
  </div>;
}

const mount = document.getElementById('login-view');
if (mount) createRoot(mount).render(<StrictMode><LoginPage/></StrictMode>);
