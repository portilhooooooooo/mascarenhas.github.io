import { useEffect, useState } from 'react';
import { CheckCircle2, Copy } from 'lucide-react';
import { formatDate, taskTypeLabel, type Task, type TaskProcess } from './model';
import './taskExecution.css';

export function TaskBrief({ task, process }: { task: Task; process: TaskProcess }) {
  const deadline = process.deadline_at || task.deadline_at;
  return process.folder || deadline ? <section className="execution-brief" aria-label="Dados do processo"><dl>
    {process.folder ? <div><dt>Pasta</dt><dd>{process.folder}</dd></div> : null}
    {deadline ? <div><dt>Prazo da tarefa</dt><dd>{formatDate(deadline)}</dd></div> : null}
  </dl></section> : null;
}

export function ProcessContext({ task, process }: { task: Task; process: TaskProcess }) {
  const indication = process.indicio || process.indication || process.indication_label;
  const metadata = process.source_metadata || {};
  const sourceLabels: Record<string, string> = { datajud: 'CNJ / DataJud', manual_upload: 'Planilha importada', automation: 'Automação', talisman_contestacao: 'Consulta Talisman' };
  const source = sourceLabels[String(process.source || task.source || '').toLowerCase()];
  const consultedAt = metadata.datajud_consultado_em || process.datajud_consultado_em;
  const updatedAt = process.updated_at;
  return <details className="execution-context" key={process.id}>
    <summary>Contexto do processo</summary>
    <dl>
      {process.party_name ? <div><dt>Parte</dt><dd>{process.party_name}</dd></div> : null}
      {task.title ? <div><dt>Lote</dt><dd>{task.title}</dd></div> : null}
      {source ? <div><dt>Origem</dt><dd>{source}</dd></div> : null}
      {indication ? <div><dt>Indício recebido</dt><dd>{String(indication)}<small>Informação de origem; não substitui a análise.</small></dd></div> : null}
      {consultedAt ? <div><dt>Consulta DataJud</dt><dd>{formatDate(consultedAt)}</dd></div> : null}
      {updatedAt ? <div><dt>Atualização do registro</dt><dd>{formatDate(updatedAt)}</dd></div> : null}
    </dl>
    {!process.party_name && !task.title && !source && !indication && !consultedAt && !updatedAt ? <p>Nenhum contexto adicional foi recebido para esta tarefa.</p> : null}
  </details>;
}

export function ProcessHeading({ task, process }: { task: Task; process: TaskProcess }) {
  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState(false);
  useEffect(() => { setCopied(false); setCopyError(false); }, [process.id]);
  return <header className="execution-process-heading"><div><small aria-label="Tipo de tarefa">{taskTypeLabel(task.type)}</small><h2>{process.case_number || 'Processo sem número'}</h2></div><button type="button" className="execution-copy" disabled={!process.case_number} onClick={async () => {
    try { await navigator.clipboard.writeText(process.case_number!); setCopied(true); setCopyError(false); } catch { setCopyError(true); }
  }}>{copied ? <CheckCircle2 size={14}/> : <Copy size={14}/>} {copied ? 'Copiado' : 'Copiar processo'}</button>{copyError ? <span role="status">Não foi possível copiar. Selecione o número acima.</span> : null}</header>;
}
