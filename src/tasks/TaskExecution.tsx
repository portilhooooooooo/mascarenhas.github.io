import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Copy } from 'lucide-react';
import { indicationLabel, taskTypeLabel, type Task, type TaskProcess } from './model';
import './taskExecution.css';

export function TaskBrief({ task, process }: { task: Task; process: TaskProcess }) {
  if (task.type === 'defesa') return null;
  const indication = indicationLabel(task, process);
  return <section className="execution-brief" aria-label="Dados do processo"><dl>{process.folder ? <div><dt>Pasta</dt><dd>{process.folder}</dd></div> : null}{indication !== 'Não informado' ? <div><dt>Indicação recebida</dt><dd title={indication}>{indication}</dd></div> : null}</dl></section>;
}

export function ProcessHeading({ task, process }: { task: Task; process: TaskProcess }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  useEffect(() => { setCopied(false); setCopyError(false); }, [process.id]);
  return <header className="execution-process-heading"><div><small>{taskTypeLabel(task.type)}</small><h2>{process.case_number || 'Processo sem número'}</h2></div><button type="button" className="execution-copy" disabled={!process.case_number} onClick={async () => {
    try { await navigator.clipboard.writeText(process.case_number!); setCopied(true); setCopyError(false); } catch { setCopyError(true); }
  }}>{copied ? <CheckCircle2 size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : 'Copiar processo'}</button>{copyError ? <span role="status">Não foi possível copiar. Selecione o número acima.</span> : null}</header>;
}

export function DecisionReview({ title = 'Confira o que será registrado', rows, pending }: { title?: string; rows: Array<[string, string | null | undefined]>; pending?: string | null }) {
  const [reviewTarget, setReviewTarget] = useState<HTMLElement | null>(null);
  useEffect(() => { setReviewTarget(document.getElementById('task-execution-review')); }, []);
  const completedRows = rows.filter((row): row is [string, string] => Boolean(row[1]));
  const review = <section className="execution-review" aria-label="Resumo da análise"><header><small>REVISÃO DA ANÁLISE</small><h3>{title}</h3></header>{completedRows.length ? <dl>{completedRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd title={value}>{value}</dd></div>)}</dl> : null}</section>;
  return reviewTarget ? createPortal(review, reviewTarget) : review;
}
