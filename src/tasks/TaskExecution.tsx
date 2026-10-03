import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CheckCircle2, Copy } from 'lucide-react';
import { indicationLabel, taskTypeLabel, type Task, type TaskProcess } from './model';
import './taskExecution.css';

const GUIDANCE: Record<string, { title: string; instruction: string; check: string }> = {
  liminar: { title: 'Confira o pedido de tutela', instruction: 'Localize o pedido e a decisão nos autos. Depois, registre o resultado encontrado.', check: 'A indicação recebida é um ponto de partida. Confirme o resultado na decisão antes de concluir.' },
  defesa: { title: 'Valide a possibilidade de defesa', instruction: 'Compare o prazo recebido com o fatal registrado no CPJ e confira a situação dos autos.', check: 'DJE, AR e audiência servem como evidência. Use o Fatal Real do CPJ como referência; esta tela não recalcula o prazo.' },
  comprovante_pagamento: { title: 'Confira o pagamento e o comprovante', instruction: 'Verifique se o pagamento ocorreu, se há comprovante e se ele já foi apresentado nos autos.', check: 'Responda com base no que foi localizado. A existência de comprovante e a manifestação nos autos são conferências diferentes.' },
  protocolo: { title: 'Reúna os documentos do protocolo', instruction: 'Localize a defesa e o comprovante de protocolo deste processo. Anexe os dois arquivos em PDF.', check: 'Confira o processo nos dois documentos. Se algum arquivo não puder ser localizado, registre o impedimento.' },
  acordos: { title: 'Verifique se o caso pode seguir para acordo', instruction: 'Confira os impedimentos. Se o caso puder seguir, preencha os dados da proposta e o encaminhamento.', check: 'Os campos seguintes aparecem conforme as respostas. Revise a provisão e os valores antes de registrar a análise.' },
};

export function TaskBrief({ task, process }: { task: Task; process: TaskProcess }) {
  const guide = GUIDANCE[task.type];
  const indication = indicationLabel(task, process);
  if (!guide) return null;
  return <section className="execution-brief" aria-label="Orientação para esta tarefa">
    <details className="execution-brief-objective"><summary>{guide.title}</summary><p>{guide.instruction}</p><p>{guide.check}</p></details>
    <div className="execution-brief-evidence"><small>CONTEXTO DISPONÍVEL</small><dl>{process.party_name ? <div><dt>Parte</dt><dd>{process.party_name}</dd></div> : null}{process.folder ? <div><dt>Pasta</dt><dd>{process.folder}</dd></div> : null}{indication !== 'Não informado' ? <div><dt>Indicação recebida</dt><dd>{indication}</dd></div> : <div><dt>Indicação recebida</dt><dd>Sem indicação adicional nesta tarefa.</dd></div>}</dl></div>
  </section>;
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
  const review = <section className="execution-review" aria-label="Resumo da análise"><header><small>REVISÃO DA ANÁLISE</small><h3>{title}</h3></header>{completedRows.length ? <dl>{completedRows.map(([label, value]) => <div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl> : null}{pending ? <p className="execution-review-pending">{pending}</p> : <p>Ao salvar, a análise deste processo será registrada.</p>}</section>;
  return reviewTarget ? createPortal(review, reviewTarget) : review;
}
