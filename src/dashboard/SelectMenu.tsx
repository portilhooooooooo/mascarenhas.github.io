import { useEffect, useId, useRef, useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

export type SelectChoice = { value: string; label: string };
type Props = {
  label: string;
  value: string;
  options: SelectChoice[];
  onChange: (value: string) => void;
  disabled?: boolean;
  className?: string;
};

export function SelectMenu({ label, value, options, onChange, disabled = false, className = '' }: Props) {
  const [open, setOpen] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const listId = useId();
  const current = options.find(option => option.value === value);
  useEffect(() => {
    if (!open) return undefined;
    const close = (event: PointerEvent) => {
      if (!root.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', close);
    return () => document.removeEventListener('pointerdown', close);
  }, [open]);
  useEffect(() => { setOpen(false); }, [disabled, value]);
  return (
    <div ref={root} className={`mba-react-select ${className}`}>
      <span className="mba-react-select-label">{label}</span>
      <button
        type="button"
        className="mba-react-select-trigger"
        aria-label={label}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        disabled={disabled || options.length <= 1}
        onClick={() => setOpen(previous => !previous)}
        onKeyDown={event => {
          if (event.key === 'Escape') setOpen(false);
          if ((event.key === 'ArrowDown' || event.key === 'Enter') && !open) {
            event.preventDefault();
            setOpen(true);
          }
        }}
      >
        <span title={current?.label || 'Selecione'}>{current?.label || 'Selecione'}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>
      {open && (
        <div id={listId} className="mba-react-select-options" role="listbox" aria-label={label}
          onKeyDown={event => {
            if (event.key === 'Escape') setOpen(false);
            const buttons = [...event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="option"]')];
            const index = buttons.indexOf(document.activeElement as HTMLButtonElement);
            if (event.key === 'ArrowDown') { event.preventDefault(); buttons[(index + 1) % buttons.length]?.focus(); }
            if (event.key === 'ArrowUp') { event.preventDefault(); buttons[(index - 1 + buttons.length) % buttons.length]?.focus(); }
          }}>
          {options.map(option => (
            <button role="option" aria-selected={option.value === value} key={option.value} type="button"
              className={option.value === value ? 'selected' : ''}
              onClick={() => { onChange(option.value); setOpen(false); }}>
              <span>{option.label}</span>
              {option.value === value && <Check size={13} aria-hidden="true" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
