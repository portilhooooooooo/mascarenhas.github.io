import { type FormEvent, useEffect, useState } from 'react';
import { CheckCircle2, Copy } from 'lucide-react';
import { taskTypeLabel, type Task, type TaskProcess } from './model';
import './taskExecution.css';

export function TaskBrief({ task, process }: { task: Task; process: TaskProcess }) {
  return task.type !== 'comprovante_pagamento' && process.folder ? <section className="execution-brief" aria-label="Dados do processo"><dl><div><dt>Pasta</dt><dd>{process.folder}</dd></div></dl></section> : null;
}

export function ProcessHeading({ task, process }: { task: Task; process: TaskProcess }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  const [helpOpen, setHelpOpen] = useState(false);
  const [helpMessage, setHelpMessage] = useState('');
  const [helpError, setHelpError] = useState('');
  const [helpSuccess, setHelpSuccess] = useState('');
  const [helpBusy, setHelpBusy] = useState(false);
  useEffect(() => {
    setCopied(false); setCopyError(false); setHelpOpen(false);
    setHelpMessage(''); setHelpError(''); setHelpSuccess('');
  }, [process.id]);
  const sendHelp = async (event: FormEvent) => {
    event.preventDefault();
    const client = (window as Window & { MBA_API?: { request: (url: string, options: RequestInit) => Promise<unknown> } }).MBA_API;
    if (!client) { setHelpError('API indisponível.'); return; }
    setHelpBusy(true); setHelpError('');
    try {
      await client.request(`/api/task-processes/${process.id}/help`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: helpMessage.trim() }),
      });
      setHelpSuccess('Pedido de ajuda registrado no histórico do processo.');
      setHelpOpen(false); setHelpMessage('');
    } catch (cause: any) {
      setHelpError(cause?.message || 'Não foi possível registrar o pedido.');
    } finally { setHelpBusy(false); }
  };
  return <>
    <header className="execution-process-heading">
      <div><small aria-label="Tipo de tarefa">{taskTypeLabel(task.type)}</small><h2>{process.case_number || 'Processo sem número'}</h2></div>
      <div className="execution-heading-actions">
        <button type="button" className="execution-copy" disabled={!process.case_number} onClick={async () => {
          try { await navigator.clipboard.writeText(process.case_number!); setCopied(true); setCopyError(false); } catch { setCopyError(true); }
        }}>{copied ? <CheckCircle2 size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : 'Copiar processo'}</button>
        <button type="button" className="execution-copy" onClick={() => { setHelpError(''); setHelpOpen(true); }}>Preciso de ajuda</button>
      </div>
      {copyError ? <span role="status">Não foi possível copiar. Selecione o número acima.</span> : null}
      {helpSuccess ? <span role="status">{helpSuccess}</span> : null}
    </header>
    {helpOpen ? <div className="execution-help-overlay" role="presentation">
      <form className="execution-help-dialog" role="dialog" aria-modal="true" aria-label="Preciso de ajuda" onSubmit={event => void sendHelp(event)}>
        <strong>Preciso de ajuda</strong>
        <p>Descreva a dificuldade no processo {process.case_number}. O pedido ficará registrado com a tarefa e seu usuário.</p>
        <textarea aria-label="Descreva sua dúvida" value={helpMessage} minLength={5} maxLength={1000} required rows={4} disabled={helpBusy} onChange={event => setHelpMessage(event.target.value)} />
        {helpError ? <p role="alert">{helpError}</p> : null}
        <div><button type="button" disabled={helpBusy} onClick={() => setHelpOpen(false)}>Cancelar</button><button type="submit" disabled={helpBusy || helpMessage.trim().length < 5}>{helpBusy ? 'Enviando…' : 'Registrar pedido'}</button></div>
      </form>
    </div> : null}
  </>;
}
