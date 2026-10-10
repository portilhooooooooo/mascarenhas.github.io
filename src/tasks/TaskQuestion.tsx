import {
  Children, Fragment, createContext, isValidElement, useContext, useEffect, useRef, useState,
  type FormHTMLAttributes, type ReactNode,
} from 'react';

type QaNavigationValue = { advance: () => void; canSubmit: boolean };
const QaNavigation = createContext<QaNavigationValue | null>(null);

export function TaskQuestion({ number, question, children }: { number: string; question: string; children: ReactNode }) {
  return <section className="task-question"><h3><span className="task-question-number">{number.padStart(2, '0')}</span><span>{question}</span></h3><div className="task-question-body">{children}</div></section>;
}

export function TaskActionBar({ busy, ready = true, onSkip, skipLabel = 'Pular esse prazo' }: { busy: boolean; ready?: boolean; onSkip: () => void; skipLabel?: string }) {
  const qa = useContext(QaNavigation);
  return <footer className="task-renderer-footer"><button className="secondary-button" type="button" disabled={busy} onClick={onSkip}>{skipLabel}</button><button className="primary-button" type="submit" disabled={busy || !ready || (qa !== null && !qa.canSubmit)}>{busy ? 'Salvando…' : 'Salvar e próximo'}</button></footer>;
}

type Option = { value: string; label: string; description?: string };
type OptionGroupProps = {
  name: string; value: string | null; onChange: (value: string) => void;
  options: Option[]; disabled?: boolean;
};

export function OptionGroup({ name, value, onChange, options, disabled = false }: OptionGroupProps) {
  const columns = options.length === 5 ? 3 : Math.min(Math.max(options.length, 2), 4);
  const advance = useContext(QaNavigation)?.advance;
  return (
    <div className={'task-option-grid task-option-grid-' + columns} role="radiogroup" aria-label={name}>
      {options.map((option, index) => (
        <label className="task-option-card" key={option.value}>
          <input
            type="radio" name={name} value={option.value} checked={value === option.value}
            disabled={disabled}
            onChange={() => { onChange(option.value); advance?.(); }}
          />
          <span>
            {advance && index < 9 ? <kbd className="qa-option-key" aria-hidden="true">{index + 1}</kbd> : null}
            <strong>{option.label}</strong>
            {option.description ? <small>{option.description}</small> : null}
          </span>
        </label>
      ))}
    </div>
  );
}

function flattenNodes(children: ReactNode): ReactNode[] {
  const output: ReactNode[] = [];
  Children.forEach(children, child => {
    if (isValidElement(child) && child.type === Fragment) {
      output.push(...flattenNodes((child.props as { children?: ReactNode }).children));
    } else if (child !== null && child !== false && child !== undefined) {
      output.push(child);
    }
  });
  return output;
}

function hasCurrentAnswer(step: HTMLElement | null): boolean {
  if (!step) return false;
  const radios = step.querySelectorAll<HTMLInputElement>('input[type="radio"]');
  if (radios.length) return [...radios].some(input => input.checked);
  const dateFields = [...step.querySelectorAll<HTMLInputElement>('input[type="date"]')];
  if (dateFields.length) {
    const mandatory = dateFields.filter(input => input.required);
    return mandatory.length ? mandatory.every(input => Boolean(input.value)) : dateFields.some(input => Boolean(input.value));
  }
  const criteria = step.querySelectorAll<HTMLButtonElement>('[aria-pressed="true"]');
  if (criteria.length) return [...criteria].some(button => button.getAttribute('aria-pressed') === 'true');
  const text = step.querySelector<HTMLInputElement | HTMLTextAreaElement>('input:not([type="hidden"]), textarea');
  return Boolean(text?.value);
}

function isEditing(element: EventTarget | null): boolean {
  if (!(element instanceof HTMLElement)) return false;
  if (element.isContentEditable || element.closest('[contenteditable="true"]')) return true;
  if (element.matches('textarea, select')) return true;
  if (element instanceof HTMLInputElement && element.type !== 'radio' && element.type !== 'checkbox') return true;
  return false;
}

type TaskFormProps = FormHTMLAttributes<HTMLFormElement> & {
  progressive?: boolean;
  draftKey?: string;
};

function ProgressiveTaskForm({ children, draftKey = '', ...props }: TaskFormProps) {
  const nodes = flattenNodes(children);
  const questions = nodes.filter(child => isValidElement(child) && child.type === TaskQuestion);
  const actions = nodes.filter(child => isValidElement(child) && child.type === TaskActionBar);
  const content = nodes.filter(child => !isValidElement(child) || child.type !== TaskActionBar);
  const [activeIndex, setActiveIndex] = useState(0);
  const [advanceTicket, setAdvanceTicket] = useState(0);
  const handledTicket = useRef(0);
  const formRef = useRef<HTMLFormElement>(null);
  const total = questions.length;
  const current = Math.min(activeIndex, Math.max(0, total - 1));

  // O React já atualizou as perguntas condicionais quando este efeito avança.
  useEffect(() => {
    if (handledTicket.current === advanceTicket) return;
    handledTicket.current = advanceTicket;
    setActiveIndex(index => Math.min(index + 1, Math.max(0, total - 1)));
  }, [advanceTicket, total]);

  useEffect(() => {
    setActiveIndex(index => Math.min(index, Math.max(0, total - 1)));
  }, [total]);

  // Retoma a primeira pergunta ainda sem resposta, quando existe cache da aba.
  useEffect(() => {
    if (!draftKey) return;
    try { if (!sessionStorage.getItem(draftKey)) return; } catch { return; }
    const steps = [...(formRef.current?.querySelectorAll<HTMLElement>('.qa-step') || [])];
    const firstOpen = steps.findIndex(step => !hasCurrentAnswer(step));
    if (steps.length) setActiveIndex(firstOpen < 0 ? steps.length - 1 : firstOpen);
  }, [draftKey]);

  const previous = () => setActiveIndex(index => Math.max(0, index - 1));
  const next = () => {
    const step = formRef.current?.querySelector<HTMLElement>('.qa-step:not([hidden])') || null;
    if (!hasCurrentAnswer(step)) return;
    if (current < total - 1) setActiveIndex(current + 1);
    else formRef.current?.querySelector<HTMLButtonElement>('button[type="submit"]:not(:disabled)')?.focus();
  };

  useEffect(() => {
    const handle = (event: KeyboardEvent) => {
      const form = formRef.current;
      if (!form || !form.getClientRects().length || !form.closest('.page.active')) return;
      if (event.altKey || event.metaKey || event.isComposing) return;
      const target = event.target;
      if (isEditing(target)) {
        // Impede o submit implícito do navegador em campos de data/texto.
        // Enter avança; em textarea, Enter mantém sua função de nova linha.
        if (event.key === 'Enter' && target instanceof HTMLInputElement) {
          event.preventDefault();
          if (event.ctrlKey || !hasCurrentAnswer(form.querySelector<HTMLElement>('.qa-step:not([hidden])'))) return;
          if (current < total - 1) setActiveIndex(current + 1);
          else form.querySelector<HTMLButtonElement>('button[type="submit"]:not(:disabled)')?.focus();
        }
        return;
      }
      if (event.ctrlKey) return;
      if (target instanceof HTMLElement && target.closest('[role="dialog"]')) return;
      // Após escolher um processo na fila, o foco continua no botão da fila;
      // atalhos numéricos devem funcionar ali sem exigir novo clique no formulário.
      const workspace = form.closest('.task-station');
      if (target instanceof HTMLElement && target !== document.body && target !== document.documentElement && !workspace?.contains(target)) return;
      // Preserve a ativação por Enter de botões focados (salvar, pular, fila, navegação).
      if (event.key === 'Enter' && target instanceof HTMLElement && target.closest('button')) return;
      if (event.key === 'Backspace') {
        event.preventDefault();
        setActiveIndex(index => Math.max(0, index - 1));
        return;
      }
      if (event.key === 'Enter') {
        event.preventDefault(); // Nunca envia o formulário implicitamente.
        const step = form.querySelector<HTMLElement>('.qa-step:not([hidden])');
        if (!hasCurrentAnswer(step)) return;
        if (current < total - 1) setActiveIndex(current + 1);
        else form.querySelector<HTMLButtonElement>('button[type="submit"]:not(:disabled)')?.focus();
        return;
      }
      if (/^[1-9]$/.test(event.key)) {
        const options = form.querySelectorAll<HTMLInputElement>('.qa-step:not([hidden]) .task-option-card input[type="radio"]');
        const selected = options[Number(event.key) - 1];
        if (selected && !selected.disabled) {
          event.preventDefault();
          selected.click(); // Dispara exatamente o mesmo onChange do clique do analista.
        }
      }
    };
    window.addEventListener('keydown', handle);
    return () => window.removeEventListener('keydown', handle);
  }, [current, total]);

  let questionIndex = -1;
  const navigation: QaNavigationValue = {
    advance: () => setAdvanceTicket(ticket => ticket + 1),
    canSubmit: total > 0 && current === total - 1,
  };
  return <form {...props} ref={formRef} data-qa-progressive="true" data-qa-last={navigation.canSubmit ? 'true' : 'false'}>
    <div className="qa-progress-header">
      <strong>Pergunta {String(current + 1).padStart(2, '0')}</strong>
      <span className="qa-unsaved-state">Rascunho não enviado</span>
    </div>
    <QaNavigation.Provider value={navigation}>
      <div className="task-form-content qa-form-content">
        {content.map((child, index) => {
          if (isValidElement(child) && child.type === TaskQuestion) {
            questionIndex += 1;
            const stepIndex = questionIndex;
            return <div className="qa-step" key={'qa-step-' + stepIndex} hidden={stepIndex !== current} aria-hidden={stepIndex !== current}>{child}</div>;
          }
          return <Fragment key={'qa-aux-' + index}>{child}</Fragment>;
        })}
      </div>
    </QaNavigation.Provider>
    <div className="qa-footer">
      <nav className="qa-keyboard-nav" aria-label="Navegação da análise">
        <button type="button" onClick={previous} disabled={current === 0}>← Anterior <kbd>Backspace</kbd></button>
        <span><kbd>1–9</kbd> Responder · <kbd>Enter</kbd> Avançar</span>
        <button type="button" onClick={next} disabled={total < 2 || current === total - 1}>Próxima <kbd>Enter</kbd> →</button>
      </nav>
      <QaNavigation.Provider value={navigation}>{actions}</QaNavigation.Provider>
    </div>
  </form>;
}

export function TaskForm({ children, progressive = false, draftKey, ...props }: TaskFormProps) {
  if (progressive) return <ProgressiveTaskForm {...props} draftKey={draftKey}>{children}</ProgressiveTaskForm>;
  const items = Children.toArray(children);
  const actions = items.filter(child => isValidElement(child) && child.type === TaskActionBar);
  const content = items.filter(child => !isValidElement(child) || child.type !== TaskActionBar);
  return <form {...props}><div className="task-form-content">{content}</div>{actions}</form>;
}
