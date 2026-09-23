import { StrictMode, useLayoutEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './login.css';

type AuthWindow = Window & typeof globalThis & {
  MBA_AUTH?: {
    startMicrosoftLogin?: () => Promise<void> | void;
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
  const [busy, setBusy] = useState(false);

  useLayoutEffect(() => {
    document.getElementById('login-view')?.removeAttribute('hidden');
    document.body.dataset.reactLogin = 'true';
  }, []);

  const startMicrosoftLogin = async () => {
    const start = (window as AuthWindow).MBA_AUTH?.startMicrosoftLogin;
    if (!start || busy) return;
    setBusy(true);
    try {
      await start();
    } finally {
      // Em sucesso haverá navegação para a Microsoft; em falha o auth.js libera o fluxo.
      setBusy(false);
    }
  };

  return (
    <div className="react-login-view">
      <h1>Entrar</h1>
      <p>Acesse o Backoffice com sua conta corporativa Microsoft.</p>
      <button
        className="microsoft-login"
        id="microsoft-login"
        type="button"
        aria-label="Acesso Corporativo"
        aria-busy={busy}
        disabled={busy}
        onClick={startMicrosoftLogin}
      >
        <MicrosoftMark />
        <span>{busy ? 'Entrando…' : 'Acesso Corporativo'}</span>
      </button>
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
