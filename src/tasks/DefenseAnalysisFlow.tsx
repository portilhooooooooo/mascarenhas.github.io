import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Check } from 'lucide-react';
import './defenseAnalysisFlow.css';
import { DecisionReview } from './TaskExecution';

type YesNo = 'sim' | 'nao' | null;
export type DefensePriority = 'altissima' | 'alta' | 'baixa';
export type DefenseReason = 'suspenso_irdr' | 'suspenso_1414' | 'turma_recursal' | 'retorno_turma_recursal' | 'sentenca' | 'transito_julgado' | 'sem_citacao' | 'defesa_apresentada';
export type DefenseCriterionKey = 'expedicao_dje' | 'dje_negativo' | 'expedicao_ar' | 'retorno_ar' | 'audiencia' | 'habilitacao';

export type DefenseAnalysisDraft = {
  reason: DefenseReason | null;
  fatal_deadline: string | null;
  deadline_correct: boolean;
  has_active_defense_deadline: boolean | null;
  criteria: Array<{ type: DefenseCriterionKey; date: string }>;
};

type Props = {
  cnj: string;
  controlDeadline?: string | null;
  busy?: boolean;
  error?: string | null;
  onSubmit: (draft: DefenseAnalysisDraft) => Promise<void> | void;
  onSkip: () => Promise<void> | void;
};

const CRITERIA: Array<{ key: DefenseCriterionKey; label: string; dateLabel: string }> = [
  { key: 'expedicao_dje', label: 'Expedição de DJE', dateLabel: 'Expedido em' },
  { key: 'dje_negativo', label: 'DJE Negativo', dateLabel: 'DJE negativo em' },
  { key: 'expedicao_ar', label: 'Expedição de Carta AR', dateLabel: 'Carta AR expedida em' },
  { key: 'retorno_ar', label: 'Retorno de Carta AR', dateLabel: 'Retorno da AR em' },
  { key: 'audiencia', label: 'Audiência', dateLabel: 'Audiência agendada para' },
  { key: 'habilitacao', label: 'Juntada de Habilitação', dateLabel: 'Habilitação realizada em' },
];

const REASONS: Array<{ value: DefenseReason; label: string }> = [
  { value: 'turma_recursal', label: 'Processo está na Turma Recursal' },
  { value: 'retorno_turma_recursal', label: 'Aguardando retorno da Turma Recursal aos autos' },
  { value: 'sentenca', label: 'Processo tem sentença' },
  { value: 'transito_julgado', label: 'Processo está com trânsito em julgado' },
  { value: 'sem_citacao', label: 'Sem citação para defesa expedida' },
  { value: 'defesa_apresentada', label: 'Já existe defesa apresentada' },
];

const EMPTY_CRITERIA: Record<DefenseCriterionKey, string> = {
  expedicao_dje: '', dje_negativo: '', expedicao_ar: '', retorno_ar: '', audiencia: '', habilitacao: '',
};

function dateOnly(value?: string | null) {
  return String(value || '').slice(0, 10);
}

function formatDate(value?: string | null) {
  const normalized = dateOnly(value);
  if (!normalized) return '—';
  const [year, month, day] = normalized.split('-');
  return `${day}/${month}/${year}`;
}

function BinaryChoice({ value, onChange, disabled }: { value: YesNo; onChange: (value: Exclude<YesNo, null>) => void; disabled?: boolean }) {
  return <div className="defesa-flow-binary">{(['sim', 'nao'] as const).map(option => <button type="button" key={option} disabled={disabled} aria-pressed={value === option} className={value === option ? 'active' : ''} onClick={() => onChange(option)}>{option === 'sim' ? 'Sim' : 'Não'}</button>)}</div>;
}

export function DefenseAnalysisFlow({ cnj, controlDeadline, busy = false, error = null, onSubmit, onSkip }: Props) {
  const deadline = dateOnly(controlDeadline);
  const [deadlineCorrect, setDeadlineCorrect] = useState<YesNo>(null);
  const [activeDefense, setActiveDefense] = useState<YesNo>(null);
  const [correctFatal, setCorrectFatal] = useState('');
  const [criteria, setCriteria] = useState<Record<DefenseCriterionKey, string>>(EMPTY_CRITERIA);
  const [criterionKeys, setCriterionKeys] = useState<DefenseCriterionKey[]>([]);
  const [reason, setReason] = useState<DefenseReason | null>(null);
  const [suspensionOpen, setSuspensionOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setDeadlineCorrect(null);
    setActiveDefense(null);
    setCorrectFatal('');
    setCriteria({ ...EMPTY_CRITERIA });
    setCriterionKeys([]);
    setReason(null);
    setSuspensionOpen(false);
    setLocalError(null);
  }, [cnj]);

  const completedCriteria = useMemo(() => CRITERIA.filter(item => criterionKeys.includes(item.key) && Boolean(criteria[item.key])), [criteria, criterionKeys]);
  const criteriaComplete = criterionKeys.length > 0 && completedCriteria.length === criterionKeys.length;

  const ready = deadlineCorrect === 'sim' ? Boolean(deadline)
    : deadlineCorrect === 'nao' && (activeDefense === 'sim' ? Boolean(criteriaComplete && correctFatal) : activeDefense === 'nao' && Boolean(reason));

  const resetAfterDeadline = () => {
    setActiveDefense(null); setCorrectFatal(''); setCriteria({ ...EMPTY_CRITERIA }); setCriterionKeys([]); setReason(null); setSuspensionOpen(false); setLocalError(null);
  };

  const chooseDeadline = (value: Exclude<YesNo, null>) => { setDeadlineCorrect(value); resetAfterDeadline(); };
  const chooseActiveDefense = (value: Exclude<YesNo, null>) => { setActiveDefense(value); setCorrectFatal(''); setCriteria({ ...EMPTY_CRITERIA }); setCriterionKeys([]); setReason(null); setSuspensionOpen(false); setLocalError(null); };
  const toggleCriterion = (key: DefenseCriterionKey) => {
    setCriterionKeys(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key]);
    if (criterionKeys.includes(key)) setCriteria(current => ({ ...current, [key]: '' }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (deadlineCorrect === null) return setLocalError('Informe se o fatal da Enter está correto.');
    if (deadlineCorrect === 'sim' && !deadline) return setLocalError('O prazo informado pela Enter não está disponível.');
    if (deadlineCorrect === 'nao' && activeDefense === null) return setLocalError('Informe se existe prazo para apresentação de defesa em curso.');
    if (deadlineCorrect === 'nao' && activeDefense === 'sim' && !criteriaComplete) return setLocalError('Selecione os critérios e informe as respectivas datas.');
    if (deadlineCorrect === 'nao' && activeDefense === 'sim' && !correctFatal) return setLocalError('Informe o fatal correto.');
    if (deadlineCorrect === 'nao' && activeDefense === 'nao' && !reason) return setLocalError('Informe a situação processual.');

    setLocalError(null);
    const apt = deadlineCorrect === 'sim' || activeDefense === 'sim';
    await onSubmit({
      reason: apt ? null : reason,
      fatal_deadline: apt ? deadlineCorrect === 'sim' ? deadline : correctFatal : null,
      deadline_correct: deadlineCorrect === 'sim',
      has_active_defense_deadline: deadlineCorrect === 'sim' ? true : activeDefense === 'sim',
      criteria: completedCriteria.map(item => ({ type: item.key, date: criteria[item.key] })),
    });
  };

  return <form className="defesa-flow" onSubmit={submit}>
    <div className="defesa-enter-deadline">{deadline ? <>A Enter determinou que essa defesa deve ser apresentada em <strong>{formatDate(deadline)}</strong>.</> : 'A Enter não informou a data para apresentação desta defesa.'}</div>

    <section className="defesa-flow-question">
      <div className="defesa-flow-step">01</div>
      <div className="defesa-flow-question-body"><h3>O fatal da Enter está correto?</h3><BinaryChoice value={deadlineCorrect} onChange={chooseDeadline} disabled={busy}/></div>
    </section>

    {deadlineCorrect === 'nao' ? <section className="defesa-flow-question nested"><div className="defesa-flow-step">02</div><div className="defesa-flow-question-body"><h3>Existe prazo para apresentação de defesa em curso?</h3><BinaryChoice value={activeDefense} onChange={chooseActiveDefense} disabled={busy}/></div></section> : null}

    {deadlineCorrect === 'nao' && activeDefense === 'sim' ? <>
      <section className="defesa-flow-question nested"><div className="defesa-flow-step">03</div><div className="defesa-flow-question-body"><h3>Selecione abaixo as evidências para o prazo de defesa.</h3><div className="defesa-flow-criteria">{CRITERIA.map(item => { const selected = criterionKeys.includes(item.key); return <div className={`defesa-flow-criterion ${selected ? 'selected' : ''}`} key={item.key}><button type="button" disabled={busy} onClick={() => toggleCriterion(item.key)}><span className="defesa-flow-checkbox">{selected ? <Check size={12}/> : null}</span><strong>{item.label}</strong></button>{selected ? <label><span>{item.dateLabel}</span><input type="date" disabled={busy} value={criteria[item.key]} onChange={event => setCriteria(current => ({ ...current, [item.key]: event.target.value }))}/></label> : null}</div>; })}</div></div></section>
      <label className="task-text-field defense-cpj-evidence"><span>Fatal Real registrado no CPJ</span><input type="date" disabled={busy} value={correctFatal} onChange={event => setCorrectFatal(event.target.value)}/></label>
    </> : null}

    {deadlineCorrect === 'nao' && activeDefense === 'nao' ? <section className="defesa-flow-question nested"><div className="defesa-flow-step">03</div><div className="defesa-flow-question-body"><h3>Por quê?</h3><div className="defesa-flow-reasons"><button type="button" disabled={busy} className={reason === 'suspenso_irdr' || reason === 'suspenso_1414' ? 'active' : ''} onClick={() => { setSuspensionOpen(true); setReason(null); }}>Suspenso</button>{REASONS.map(item => <button type="button" disabled={busy} key={item.value} className={reason === item.value ? 'active' : ''} onClick={() => { setReason(item.value); setSuspensionOpen(false); setLocalError(null); }}>{item.label}</button>)}</div>{suspensionOpen ? <div className="defesa-flow-suspension"><h3>4. Qual o tema da suspensão?</h3><div className="defesa-flow-binary"><button type="button" disabled={busy} className={reason === 'suspenso_irdr' ? 'active' : ''} onClick={() => setReason('suspenso_irdr')}>IRDR</button><button type="button" disabled={busy} className={reason === 'suspenso_1414' ? 'active' : ''} onClick={() => setReason('suspenso_1414')}>Tema 1414</button></div></div> : null}</div></section> : null}

    <DecisionReview rows={[
      ['Fatal da Enter correto', deadlineCorrect === null ? null : deadlineCorrect === 'sim' ? 'Sim' : 'Não'],
      ['Prazo em curso', deadlineCorrect === 'nao' && activeDefense !== null ? activeDefense === 'sim' ? 'Sim' : 'Não' : null],
      ['Motivo', reason === 'suspenso_irdr' ? 'Suspenso — IRDR' : reason === 'suspenso_1414' ? 'Suspenso — Tema 1414' : REASONS.find(item => item.value === reason)?.label],
    ]}/>
    {localError || error ? <p className="task-renderer-error" role="alert">{localError || error}</p> : null}
    <footer className="task-renderer-footer defesa-flow-footer"><button className="secondary-button" type="button" disabled={busy} onClick={() => void onSkip()}>Pular esse prazo</button><button className="primary-button" type="submit" disabled={busy || !ready}>{busy ? 'Salvando…' : 'Salvar e próximo'}</button></footer>
  </form>;
}
