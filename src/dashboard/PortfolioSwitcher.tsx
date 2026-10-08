import { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness } from 'lucide-react';
import { SelectMenu } from './SelectMenu';

type Portfolio = {
  id: string;
  client_name?: string;
  operator_name?: string;
  display_name?: string;
};
type Profile = {
  portfolios?: Portfolio[];
  default_portfolio_id?: string;
};
type ShellWindow = Window & typeof globalThis & {
  MBA_CURRENT_USER?: Profile | null;
  MBA_API?: {
    configurePortfolios?: (items: Portfolio[], fallback?: string) => string;
    getPortfolioId?: () => string;
    setPortfolioId?: (id: string) => string;
  };
};
const shellWindow = window as ShellWindow;
const clientName = (portfolio: Portfolio) => String(portfolio.client_name || portfolio.display_name || 'Cliente').trim();
const operatorName = (portfolio: Portfolio) => String(portfolio.operator_name || portfolio.display_name || 'Carteira').trim();

export function PortfolioSwitcher() {
  const [profile, setProfile] = useState<Profile | null>(() => shellWindow.MBA_CURRENT_USER || null);
  useEffect(() => {
    const sync = () => setProfile(shellWindow.MBA_CURRENT_USER || null);
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
  const portfolios = profile?.portfolios || [];
  const selectedId = shellWindow.MBA_API?.getPortfolioId?.() || profile?.default_portfolio_id || '';
  const active = portfolios.find(portfolio => portfolio.id === selectedId) || portfolios[0];
  const grouped = useMemo(() => {
    const map = new Map<string, Portfolio[]>();
    portfolios.forEach(portfolio => {
      const client = clientName(portfolio);
      map.set(client, [...(map.get(client) || []), portfolio]);
    });
    return map;
  }, [portfolios]);
  if (!active) return null;
  const currentClient = clientName(active);
  const clientOptions = [...grouped.keys()].map(name => ({ value: name, label: name }));
  const portfolioOptions = (grouped.get(currentClient) || []).map(portfolio => ({
    value: portfolio.id, label: operatorName(portfolio),
  }));
  const switchTo = (nextId: string) => {
    if (!nextId || nextId === selectedId) return;
    if (!portfolios.some(portfolio => portfolio.id === nextId)) return;
    shellWindow.MBA_API?.setPortfolioId?.(nextId);
    // The profile and every module are reconstructed from the newly selected portfolio.
    window.location.reload();
  };
  return (
    <div className="mba-portfolio-react" role="group" aria-label="Cliente e carteira ativos">
      <BriefcaseBusiness size={17} aria-hidden="true" />
      <SelectMenu label="Cliente" value={currentClient} options={clientOptions}
        onChange={next => switchTo(grouped.get(next)?.[0]?.id || '')} />
      <span className="mba-portfolio-divider" aria-hidden="true" />
      <SelectMenu label="Carteira" value={active.id} options={portfolioOptions} onChange={switchTo} />
    </div>
  );
}
