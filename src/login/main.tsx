import { type FormEvent, StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { createRoot } from 'react-dom/client';
import './login.css';

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

function DataField({ active }: { active: boolean }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    if (!active) return;
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d', { alpha: false });
    if (!canvas || !ctx) return;

    const motion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let frame = 0;
    let last = 0;
    let width = 0;
    let height = 0;
    let cancelled = false;

    const paint = (ms: number) => {
      ctx.fillStyle = '#141414';
      ctx.fillRect(0, 0, width, height);
      const columns = Math.max(16, Math.min(42, Math.floor(width / 14)));
      const rows = Math.max(10, Math.min(20, Math.floor(height / 14)));
      const dx = width / (columns + 1);
      const dy = height / (rows + 1);
      const time = motion.matches ? 0 : ms / 1000;
      for (let y = 0; y < rows; y++) for (let x = 0; x < columns; x++) {
        const seed = (x * 17 + y * 31) % 97;
        const wave = (Math.sin(x * .36 + time * .75 - y * .28) + 1) / 2;
        const pulse = (Math.sin(time * (.65 + seed / 90) + seed * .65) + 1) / 2;
        ctx.globalAlpha = .13 + wave * .32 + pulse * .24;
        ctx.fillStyle = (x * 7 + y * 11) % 13 < 3 ? '#C38B6B' : '#929898';
        ctx.beginPath();
        ctx.arc(dx * (x + 1), dy * (y + 1) + (motion.matches ? 0 : Math.sin(time * .6 + x * .24) * 1.2),
          seed % 9 === 0 ? 1.5 : 1.05, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'center';
      ['01', '08', '16', '24', '32'].forEach((value, i) => {
        ctx.globalAlpha = .17 + (motion.matches ? 0 : (Math.sin(time * .35 + i) + 1) * .09);
        ctx.fillStyle = '#C38B6B';
        ctx.fillText(value, dx * (((i * 7 + 5) % columns) + 1), dy * (((i * 4 + 2) % rows) + 1) - 8);
      });
      ctx.globalAlpha = 1;
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      width = Math.max(1, rect.width);
      height = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paint(performance.now());
    };
    const tick = (ms: number) => {
      if (cancelled || document.hidden || motion.matches) return;
      if (ms - last >= 1000 / 30) { last = ms; paint(ms); }
      frame = requestAnimationFrame(tick);
    };
    const start = () => {
      cancelAnimationFrame(frame);
      if (document.hidden || motion.matches) paint(performance.now());
      else frame = requestAnimationFrame(tick);
    };
    const watchVisibility = () => start();
    const watchMotion = () => start();
    window.addEventListener('resize', resize);
    document.addEventListener('visibilitychange', watchVisibility);
    motion.addEventListener('change', watchMotion);
    resize();
    start();
    return () => {
      cancelled = true;
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      document.removeEventListener('visibilitychange', watchVisibility);
      motion.removeEventListener('change', watchMotion);
    };
  }, [active]);
  return <canvas className="mba-auth-data-canvas" ref={canvasRef} aria-hidden="true"/>;
}

function AuthTransition({ visible }: { visible: boolean }) {
  return <div className={'mba-auth-transition' + (visible ? ' is-visible' : '')}
    role="status" aria-live="polite" aria-hidden={!visible} data-testid="auth-transition">
    <div className="mba-auth-transition-content">
      <DataField active={visible}/>
      <p>Preparando seu espaço.</p>
    </div>
  </div>;
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
          <h1 id="react-login-title">Acesse o Backoffice.</h1>
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
                aria-busy={authState.busy} disabled={authState.busy}>Continuar com e-mail</button>
            </form>
          </div>
          {authState.error ? <div className="react-login-error" role="alert">{authState.error}</div> : null}
        </section>
        <aside className="react-login-visual" aria-label="Identidade visual Mascarenhas Barbosa">
          <video autoPlay muted playsInline loop preload="auto"
            poster="/assets/mascarenhas-login-poster.jpg?v=20261027-a2690cd3"
            aria-label="Vídeo institucional do escritório Mascarenhas Barbosa">
            <source src="/assets/mascarenhas-login.mp4?v=20261027-a2690cd3" type="video/mp4"/>
          </video>
          <div className="react-login-visual-caption">
            <span>MASCARENHAS BARBOSA · DESDE 1968</span>
            <strong>Transformando ideias em produção.</strong>
          </div>
        </aside>
      </main>
    </div>
    {overlayRoot ? createPortal(<AuthTransition visible={preparing}/>, overlayRoot) : null}
  </>;
}

const mount = document.getElementById('login-view');
if (mount) createRoot(mount).render(<StrictMode><LoginPage/></StrictMode>);
