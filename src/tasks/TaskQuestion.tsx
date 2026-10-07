import { Children, isValidElement, type FormHTMLAttributes, type ReactNode } from 'react';
export function TaskQuestion({ number, question, children }: { number: string; question: string; children: ReactNode }) {
  return <section className="task-question"><h3><span className="task-question-number">{number.padStart(2, '0')}</span><span>{question}</span></h3><div className="task-question-body">{children}</div></section>;
}
export function TaskActionBar({ busy, ready = true, onSkip, skipLabel = 'Pular esse prazo' }: { busy: boolean; ready?: boolean; onSkip: () => void; skipLabel?: string }) {
  return <footer className="task-renderer-footer"><button className="secondary-button" type="button" disabled={busy} onClick={onSkip}>{skipLabel}</button><button className="primary-button" type="submit" disabled={busy || !ready}>{busy ? 'Salvando…' : 'Salvar e próximo'}</button></footer>;
}

type Option = { value: string; label: string; description?: string };

type OptionGroupProps = {
  name: string;
  value: string | null;
  onChange: (value: string) => void;
  options: Option[];
  disabled?: boolean;
};

export function OptionGroup({ name, value, onChange, options, disabled = false }: OptionGroupProps) {
  const columns = options.length === 5 ? 3 : Math.min(Math.max(options.length, 2), 4);
  return (
    <div className={`task-option-grid task-option-grid-${columns}`} role="radiogroup" aria-label={name}>
      {options.map(option => (
        <label className="task-option-card" key={option.value}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            disabled={disabled}
            onChange={() => onChange(option.value)}
            onKeyDown={event => { if (event.key === 'Enter') { event.preventDefault(); onChange(option.value); } }}
          />
          <span>
            <strong>{option.label}</strong>
            {option.description ? <small>{option.description}</small> : null}
          </span>
        </label>
      ))}
    </div>
  );
}


export function TaskForm({ children, ...props }: FormHTMLAttributes<HTMLFormElement>) {
  const items = Children.toArray(children);
  const actions = items.filter(child => isValidElement(child) && child.type === TaskActionBar);
  const content = items.filter(child => !isValidElement(child) || child.type !== TaskActionBar);
  return <form {...props}><div className="task-form-content">{content}</div>{actions}</form>;
}
