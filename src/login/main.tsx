import { type FormEvent, type KeyboardEvent, type MouseEvent, StrictMode, useEffect, useLayoutEffect, useRef, useState } from 'react';
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

const VIDEO_SRC = '/assets/mascarenhas-login.mp4?v=20261027-3b74ad84';
const VIDEO_POSTER = '/assets/mascarenhas-login-poster.jpg?v=20261027-3b74ad84';

function transitionIsActive(): boolean {
  return document.body.classList.contains('auth-loading')
    || document.body.classList.contains('auth-validating')
    || document.body.classList.contains('mba-auth-transition-hold');
}

function prefersReducedMotion(): boolean {
  return window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false;
}

/* Silent looping institutional video: no playback controls or UI overlay. */
function InstitutionalVideo() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    // Respect the device's accessibility preference; all other visitors see autoplay.
    if (prefersReducedMotion()) {
      video.pause();
      return;
    }
    void video.play().catch(() => { /* The poster remains if the browser blocks autoplay. */ });
  }, []);

  return <figure className="lp-video">
    <video ref={videoRef} autoPlay={!prefersReducedMotion()} muted playsInline loop preload="auto"
      poster={VIDEO_POSTER} controls={false} disablePictureInPicture
      aria-label="Vídeo institucional da sede do escritório Mascarenhas Barbosa">
      <source src={VIDEO_SRC} type="video/mp4"/>
    </video>
  </figure>;
}

function LoginPage() {
  const [email, setEmail] = useState('');
  const [authState, setAuthState] = useState<LoginState>(() =>
    (window as AuthWindow).MBA_AUTH?.getLoginState?.() || { busy: false, error: null }
  );
  const [validating, setValidating] = useState(transitionIsActive);
  const [loginOpen, setLoginOpen] = useState(false);
  const [view, setView] = useState<'home' | 'about'>('home');
  const [aboutPanel, setAboutPanel] = useState(0);
  const inFlight = useRef(false);
  const landingRef = useRef<HTMLDivElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const loginTriggerRef = useRef<HTMLButtonElement>(null);
  const corporateRef = useRef<HTMLButtonElement>(null);

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

  // An authentication error must never be hidden behind the closed access panel.
  useEffect(() => { if (authState.error) setLoginOpen(true); }, [authState.error]);

  // Modal behaviour: background inert, focus moves into the panel and returns on close.
  useEffect(() => {
    const landing = landingRef.current;
    if (!loginOpen) return;
    landing?.setAttribute('inert', '');
    corporateRef.current?.focus();
    return () => {
      landing?.removeAttribute('inert');
      loginTriggerRef.current?.focus();
    };
  }, [loginOpen]);

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

  // Keep navigation in React state: auth.js uses hashchange, and no page scroll is needed.
  const navigate = (target: 'home' | 'about') => (event: MouseEvent<HTMLAnchorElement>) => {
    event.preventDefault();
    if (target === 'about') setAboutPanel(0);
    setView(target);
  };

  useEffect(() => {
    document.getElementById(view === 'home' ? 'lp-home' : 'sobre-nos')?.focus({preventScroll:true});
  }, [view]);

  const closeLogin = () => { if (!authState.busy) setLoginOpen(false); };
  const onDialogKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') { event.stopPropagation(); closeLogin(); return; }
    if (event.key !== 'Tab' || !dialogRef.current) return;
    const focusable = Array.from(dialogRef.current.querySelectorAll<HTMLElement>(
      'button:not(:disabled), input:not(:disabled), [href], [tabindex]:not([tabindex="-1"])'));
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };

  const overlayRoot = document.getElementById('login-transition-root');
  const preparing = authState.busy || validating;

  return <>
    <div className="react-login-view lp" ref={landingRef}>
      <header className="lp-header">
        <a className="lp-brand" href="/" onClick={navigate('home')} aria-label="Mascarenhas Barbosa — Central de Produtos, voltar ao início">
          <span className="lp-symbol" aria-hidden="true"/>
          <span className="lp-brand-rule" aria-hidden="true"/>
          <span className="lp-brand-text">
            <strong>Mascarenhas Barbosa</strong>
            <small>Central de Produtos</small>
          </span>
        </a>
        <nav className="lp-nav" aria-label="Principal">
          <a href="#sobre-nos" onClick={navigate('about')} aria-current={view === 'about' ? 'page' : undefined}>Sobre nós</a>
          <button ref={loginTriggerRef} type="button" className="lp-login-trigger"
            aria-haspopup="dialog" aria-expanded={loginOpen} onClick={() => setLoginOpen(true)}>Login</button>
        </nav>
      </header>

      <main className="lp-main">
        {view === 'home' ? <section id="lp-home" className="lp-hero" tabIndex={-1} aria-labelledby="lp-hero-title">
          <div className="lp-copy">
            <p className="lp-eyebrow">Desde 1968</p>
            <h1 id="lp-hero-title">Tradição que <em>evolui<span className="lp-period">.</span></em></h1>
            <p className="lp-subtitle">Transformando 58 anos de experiência em produtos tecnológicos.</p>
          </div>
          <InstitutionalVideo/>
        </section> : <div className="lp-sections">
          <section id="sobre-nos" data-panel={aboutPanel} className="lp-section lp-about" tabIndex={-1} aria-labelledby="lp-sobre-title">
            <div className="lp-about-head">
              <h2 id="lp-sobre-title" className="lp-about-eyebrow">Sobre nós</h2>
              <h3 className="lp-about-title">A experiência de quem vive a operação, transformada em tecnologia.</h3>
            </div>
            <div className="lp-about-body">
              <p>Somos a <strong className="lp-about-brand">Central de Produtos do Mascarenhas Barbosa Advogados</strong>, uma iniciativa que aproxima a experiência dos nossos profissionais do desenvolvimento de novas soluções tecnológicas.</p>
              <p>Acreditamos que as melhores ideias surgem de quem está próximo dos desafios. Por isso, reunimos o conhecimento de advogados, estagiários e lideranças que vivenciam diariamente a realidade das carteiras jurídicas.</p>
              <p>É a partir dessa experiência que identificamos oportunidades, criamos soluções e avaliamos como a tecnologia pode tornar nosso trabalho mais simples, eficiente e inteligente.</p>
              <p>As iniciativas são desenvolvidas e testadas pela Central de Produtos. Depois de validadas, são encaminhadas à equipe de Tecnologia para implementação nos sistemas do escritório.</p>
              <p>Assim, transformamos a experiência de quem faz em soluções que beneficiam toda a operação.</p>
            </div>
            <ol className="lp-about-flow" aria-label="Como as soluções chegam à operação">
              <li><span className="lp-about-step" aria-hidden="true">01</span><strong>Quem vive</strong><span>Conhece os desafios da operação.</span></li>
              <li><span className="lp-about-step" aria-hidden="true">02</span><strong>Quem transforma</strong><span>Cria e testa novas soluções.</span></li>
              <li><span className="lp-about-step" aria-hidden="true">03</span><strong>Quem implementa</strong><span>Leva as soluções aos sistemas do escritório.</span></li>
            </ol>
            <div className="lp-about-pages" role="group" aria-label="Navegação do Sobre nós">
              {['Origem', 'Atuação', 'Processo'].map((label, index) =>
                <button key={label} type="button" onClick={() => setAboutPanel(index)}
                  aria-current={aboutPanel === index ? 'step' : undefined}
                  aria-label={`Parte ${index + 1} de 3: ${label}`}>
                  <span aria-hidden="true">0{index + 1}</span> {label}
                </button>)}
            </div>
          </section>
        </div>}
      </main>
    </div>

    {loginOpen ? <div className="lp-dialog-backdrop" onMouseDown={event => { if (event.target === event.currentTarget) closeLogin(); }}>
      <div ref={dialogRef} className="lp-dialog" role="dialog" aria-modal="true"
        aria-labelledby="react-login-title" onKeyDown={onDialogKeyDown}>
        <button type="button" className="lp-dialog-close" onClick={closeLogin}
          disabled={authState.busy} aria-label="Fechar acesso">
          <span aria-hidden="true">×</span>
        </button>
        <section className="react-login-access">
          <h2 id="react-login-title">Explore como estamos trabalhando</h2>
          <div className="react-login-form">
            <button ref={corporateRef} className="react-login-corporate" type="button"
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
      </div>
    </div> : null}
    {overlayRoot ? createPortal(<InstitutionalLoading visible={preparing}/>, overlayRoot) : null}
  </>;
}

const mount = document.getElementById('login-view');
if (mount) createRoot(mount).render(<StrictMode><LoginPage/></StrictMode>);
