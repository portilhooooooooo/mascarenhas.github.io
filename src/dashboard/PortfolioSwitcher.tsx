import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Building2, Check, ChevronDown } from 'lucide-react';

type Portfolio = { id: string };
type Profile = { portfolios?: Portfolio[]; default_portfolio_id?: string };
type ShellWindow = Window & typeof globalThis & {
  MBA_CURRENT_USER?: Profile | null;
  MBA_API?: {
    getPortfolioId?: () => string;
    setPortfolioId?: (id: string) => string;
  };
};
const shellWindow = window as ShellWindow;

const OPTIONS = [
  { id: 'agibank_enter', label: 'Agibank <> Enter' },
  { id: 'agibank_mba', label: 'Agibank <> MBA' },
  { id: 'nubank_mba', label: 'Nubank <> MBA' },
  { id: 'banco_pan_mba', label: 'Pan <> MBA' },
  { id: 'energisa_enter', label: 'Energisa <> Enter' },
] as const;

type MenuPosition = { top: number; left: number; width: number };

export function PortfolioSwitcher() {
  const [profile, setProfile] = useState<Profile | null>(() => shellWindow.MBA_CURRENT_USER || null);
  const [revision, setRevision] = useState(0);
  const [open, setOpen] = useState(false);
  const [position, setPosition] = useState<MenuPosition | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const sync = () => {
      setProfile(shellWindow.MBA_CURRENT_USER || null);
      setRevision(value => value + 1);
      setOpen(false);
    };
    for (const type of ['mba:profile-ready', 'mba:session-expired', 'mba:logged-out', 'mba:portfolio-changed'])
      window.addEventListener(type, sync);
    return () => {
      for (const type of ['mba:profile-ready', 'mba:session-expired', 'mba:logged-out', 'mba:portfolio-changed'])
        window.removeEventListener(type, sync);
    };
  }, []);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node;
      if (!triggerRef.current?.contains(target) && !menuRef.current?.contains(target)) setOpen(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };
    const closeOnViewportChange = () => setOpen(false);
    document.addEventListener('pointerdown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    window.addEventListener('resize', closeOnViewportChange);
    window.addEventListener('scroll', closeOnViewportChange, true);
    return () => {
      document.removeEventListener('pointerdown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
      window.removeEventListener('resize', closeOnViewportChange);
      window.removeEventListener('scroll', closeOnViewportChange, true);
    };
  }, [open]);

  const authorized = new Set((profile?.portfolios || []).map(portfolio => portfolio.id));
  const options = OPTIONS.filter(option => authorized.has(option.id));
  if (!options.length) return null;

  // Do not render or switch to any portfolio outside the server-returned membership set.
  const selectedId = shellWindow.MBA_API?.getPortfolioId?.() || profile?.default_portfolio_id || '';
  const active = options.find(option => option.id === selectedId)
    || options.find(option => option.id === profile?.default_portfolio_id)
    || options[0];
  void revision;

  const toggle = () => {
    if (options.length < 2) return;
    if (open) { setOpen(false); return; }
    const rect = triggerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const width = Math.min(215, window.innerWidth - 16);
    const menuHeight = options.length * 36 + 12;
    const collapsed = rect.width < 72;
    const preferredLeft = collapsed ? rect.right + 8 : rect.left;
    const left = Math.max(8, Math.min(preferredLeft, window.innerWidth - width - 8));
    const below = rect.bottom + menuHeight + 7 <= window.innerHeight;
    const top = below ? rect.bottom + 6 : Math.max(8, rect.top - menuHeight - 6);
    setPosition({ top, left, width });
    setOpen(true);
  };

  const switchTo = (nextId: string) => {
    if (!authorized.has(nextId) || !options.some(option => option.id === nextId)) return;
    if (nextId === active.id) return;
    if (window.MBA_CONFIRM_TASK_LEAVE?.() === false) return;
    setOpen(false);
    shellWindow.MBA_API?.setPortfolioId?.(nextId);
    // Reloads all modules, permissions and API caches in the new portfolio context.
    window.location.reload();
  };

  return (
    <div className="sidebar-portfolio-compact" aria-label="Clientes">
      <span className="sidebar-portfolio-heading">Clientes</span>
      <button
        ref={triggerRef}
        type="button"
        className="sidebar-portfolio-trigger"
        aria-label={`Selecionar carteira. Atual: ${active.label}`}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? 'sidebar-portfolio-menu' : undefined}
        title={active.label}
        disabled={options.length < 2}
        onClick={toggle}
      >
        <Building2 className="sidebar-portfolio-trigger-icon" aria-hidden="true" />
        <span className="sidebar-portfolio-active-name">{active.label}</span>
        {options.length > 1 && <ChevronDown className="sidebar-portfolio-chevron" aria-hidden="true" />}
      </button>
      {open && position && createPortal(
        <div
          ref={menuRef}
          id="sidebar-portfolio-menu"
          className="sidebar-portfolio-menu"
          role="menu"
          aria-label="Selecionar carteira"
          style={position}
        >
          {options.map(option => (
            <button
              key={option.id}
              type="button"
              className="sidebar-portfolio-menu-option"
              role="menuitemradio"
              aria-checked={option.id === active.id}
              onClick={() => switchTo(option.id)}
            >
              <span>{option.label}</span>
              {option.id === active.id && <Check size={14} aria-hidden="true" />}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
