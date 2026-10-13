import { useEffect, useState } from 'react';
import { CheckCircle2, Copy } from 'lucide-react';
import { taskTypeLabel, type Task, type TaskProcess } from './model';
import './taskExecution.css';

export function TaskBrief({ task, process }: { task: Task; process: TaskProcess }) {
  return task.type !== 'comprovante_pagamento' && process.folder ? <section className="execution-brief" aria-label="Dados do processo"><dl><div><dt>Pasta</dt><dd>{process.folder}</dd></div></dl></section> : null;
}

function formatCnj(number: string) {
  const digits = number.replace(/\D/g, '');
  return digits.length === 20
    ? digits.replace(/^(\d{7})(\d{2})(\d{4})(\d)(\d{2})(\d{4})$/, '$1-$2.$3.$4.$5.$6')
    : number;
}

export function ProcessHeading({ task, process }: { task: Task; process: TaskProcess }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  useEffect(() => { setCopied(false); setCopyError(false); }, [process.id]);
  return <header className="execution-process-heading"><div><small aria-label="Tipo de tarefa">{taskTypeLabel(task.type)}</small><h2>{process.case_number ? formatCnj(process.case_number) : 'Processo sem número'}</h2></div><button type="button" className="execution-copy" disabled={!process.case_number} onClick={async () => {
    try { await navigator.clipboard.writeText(process.case_number!); setCopied(true); setCopyError(false); } catch { setCopyError(true); }
  }}>{copied ? <CheckCircle2 size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : 'Copiar processo'}</button>{copyError ? <span role="status">Não foi possível copiar. Selecione o número acima.</span> : null}</header>;
}
