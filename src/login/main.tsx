import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './login.css';

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

function LoginPage({ legacyButton }: { legacyButton: HTMLButtonElement | null }) {
  const startMicrosoftLogin = () => {
    legacyButton?.click();
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
        onClick={startMicrosoftLogin}
      >
        <MicrosoftMark />
        <span>Acesso Corporativo</span>
      </button>
    </div>
  );
}

const mount = document.getElementById('login-view');
if (mount) {
  const legacyButton = document.getElementById('microsoft-login') as HTMLButtonElement | null;
  createRoot(mount).render(
    <StrictMode>
      <LoginPage legacyButton={legacyButton} />
    </StrictMode>,
  );
  document.body.dataset.reactLogin = 'true';
}
