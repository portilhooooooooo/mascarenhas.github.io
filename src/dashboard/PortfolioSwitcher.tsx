import { useEffect, useState } from 'react';

type Portfolio = { id: string };
type Profile = {
  portfolios?: Portfolio[];
  default_portfolio_id?: string;
};
type ShellWindow = Window & typeof globalThis & {
  MBA_CURRENT_USER?: Profile | null;
  MBA_API?: {
    getPortfolioId?: () => string;
    setPortfolioId?: (id: string) => string;
  };
};
const shellWindow = window as ShellWindow;

// These IDs are backend portfolio identifiers, never client-provided display names.
const CLIENT_PORTFOLIOS = [
  { id: 'agibank_enter', label: 'Agibank <> Enter', mark: 'AE' },
  { id: 'agibank_mba', label: 'Agibank <> MBA', mark: 'AM' },
  { id: 'nubank_mba', label: 'Nubank <> MBA', mark: 'NM' },
  { id: 'banco_pan_mba', label: 'Pan <> MBA', mark: 'PM' },
  { id: 'energisa_enter', label: 'Energisa <> Enter', mark: 'EE' },
] as const;

export function PortfolioSwitcher() {
  const [profile, setProfile] = useState<Profile | null>(() => shellWindow.MBA_CURRENT_USER || null);
  const [, setRevision] = useState(0);

  useEffect(() => {
    const sync = () => {
      setProfile(shellWindow.MBA_CURRENT_USER || null);
      setRevision(value => value + 1);
    };
    window.addEventListener('mba:profile-ready', sync);
    window.addEventListener('mba:session-expired', sync);
    window.addEventListener('mba:logged-out', sync);
    window.addEventListener('mba:portfolio-changed', sync);
    return () => {
      window.removeEventListener('mba:profile-ready', sync);
      window.removeEventListener('mba:session-expired', sync);
      window.removeEventListener('mba:logged-out', sync);
      window.removeEventListener('mba:portfolio-changed', sync);
    };
  }, []);

  const authorized = new Set((profile?.portfolios || []).map(portfolio => portfolio.id));
  const options = CLIENT_PORTFOLIOS.filter(option => authorized.has(option.id));
  if (options.length === 0) return null;

  const activeId = shellWindow.MBA_API?.getPortfolioId?.() || profile?.default_portfolio_id || '';
  const switchTo = (nextId: string) => {
    if (nextId === activeId || !authorized.has(nextId)) return;
    shellWindow.MBA_API?.setPortfolioId?.(nextId);
    // Rebuild profile, module permissions, caches and API requests for the selected scope.
    window.location.reload();
  };

  return (
    <section className="sidebar-client-section" aria-label="Clientes">
      <h2 className="sidebar-client-title">Clientes</h2>
      <div className="sidebar-client-list" role="group" aria-label="Carteiras autorizadas">
        {options.map(option => (
          <button
            key={option.id}
            className={'sidebar-portfolio-option' + (option.id === activeId ? ' active' : '')}
            type="button"
            aria-pressed={option.id === activeId}
            aria-label={option.label}
            title={option.label}
            onClick={() => switchTo(option.id)}
          >
            <span className="sidebar-portfolio-mark" aria-hidden="true">{option.mark}</span>
            <span className="sidebar-portfolio-label">{option.label}</span>
          </button>
        ))}
      </div>
    </section>
  );
}
