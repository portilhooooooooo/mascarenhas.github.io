import { type FormEvent, useMemo, useState } from 'react';
import { useQaField } from './qaDraft';
import { Check } from 'lucide-react';
import './defenseAnalysisFlow.css';
import { TaskQuestion, TaskActionBar, TaskForm, OptionGroup } from './TaskQuestion';

type YesNo = 'sim' | 'nao' | null;
export type DefensePriority = 'altissima' | 'alta' | 'baixa';
export type DefenseReason = 'suspenso_irdr' | 'suspenso_1414' | 'turma_recursal' | 'retorno_turma_recursal' | 'sentenca' | 'transito_julgado' | 'sem_citacao' | 'defesa_apresentada';
export type DefenseCriterionKey = 'expedicao_dje' | 'dje_negativo' | 'expedicao_ar' | 'retorno_ar' | 'audiencia' | 'habilitacao';

export type DefenseAnalysisDraft = {
  reason: DefenseReason | null;
  fatal_deadline: string | null;
  deadline_correct: boolean;
  has_defense_order: boolean | null;
  has_valid_court_deadline: boolean | null;
  criteria: Array<{ type: DefenseCriterionKey; date: string }>;
};

type Props = {
  cnj: string;
  draftKey?: string;
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

function BinaryChoice({ value, onChange, disabled, name }: { value: YesNo; onChange: (value: Exclude<YesNo, null>) => void; disabled?: boolean; name: string }) {
  return <OptionGroup name={name} value={value} onChange={next => onChange(next as Exclude<YesNo, null>)} disabled={disabled} options={[{value:'sim',label:'Sim'},{value:'nao',label:'Não'}]}/>;
}

export function DefenseAnalysisFlow({ cnj, draftKey = '', controlDeadline, busy = false, error = null, onSubmit, onSkip }: Props) {
  const deadline = dateOnly(controlDeadline);
  const [deadlineCorrect, setDeadlineCorrect] = useQaField<YesNo>(draftKey, 'defense.deadlineCorrect', null);
  const [activeDefense, setActiveDefense] = useQaField<YesNo>(draftKey, 'defense.activeDefense', null);
  const [courtDeadlineValid, setCourtDeadlineValid] = useQaField<YesNo>(draftKey, 'defense.courtDeadlineValid', null);
  const [correctFatal, setCorrectFatal] = useQaField(draftKey, 'defense.correctFatal', '');
  const [criteria, setCriteria] = useQaField<Record<DefenseCriterionKey, string>>(draftKey, 'defense.criteria', EMPTY_CRITERIA);
  const [criterionKeys, setCriterionKeys] = useQaField<DefenseCriterionKey[]>(draftKey, 'defense.criterionKeys', []);
  const [reason, setReason] = useQaField<DefenseReason | null>(draftKey, 'defense.reason', null);
  const [suspensionOpen, setSuspensionOpen] = useQaField(draftKey, 'defense.suspensionOpen', false);
  const [localError, setLocalError] = useState<string | null>(null);

  // Restauração local automática por processo; persistência definitiva apenas no submit.

  const completedCriteria = useMemo(() => CRITERIA.filter(item => criterionKeys.includes(item.key) && Boolean(criteria[item.key])), [criteria, criterionKeys]);
  const criteriaComplete = criterionKeys.length > 0 && completedCriteria.length === criterionKeys.length;

  const ready = deadlineCorrect === 'sim' ? Boolean(deadline)
    : deadlineCorrect === 'nao' && (activeDefense === 'sim' ? (courtDeadlineValid === 'sim' ? Boolean(correctFatal) : courtDeadlineValid === 'nao' && criteriaComplete) : activeDefense === 'nao' && Boolean(reason));

  const resetAfterDeadline = () => {
    setActiveDefense(null); setCourtDeadlineValid(null); setCorrectFatal(''); setCriteria({ ...EMPTY_CRITERIA }); setCriterionKeys([]); setReason(null); setSuspensionOpen(false); setLocalError(null);
  };

  const chooseDeadline = (value: Exclude<YesNo, null>) => { setDeadlineCorrect(value); resetAfterDeadline(); };
  const chooseActiveDefense = (value: Exclude<YesNo, null>) => { setActiveDefense(value); setCourtDeadlineValid(null); setCorrectFatal(''); setCriteria({ ...EMPTY_CRITERIA }); setCriterionKeys([]); setReason(null); setSuspensionOpen(false); setLocalError(null); };
  const toggleCriterion = (key: DefenseCriterionKey) => {
    setCriterionKeys(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key]);
    if (criterionKeys.includes(key)) setCriteria(current => ({ ...current, [key]: '' }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (deadlineCorrect === null) return setLocalError('Informe se o fatal da Enter está correto.');
    if (deadlineCorrect === 'sim' && !deadline) return setLocalError('O prazo informado pela Enter não está disponível.');
    if (deadlineCorrect === 'nao' && activeDefense === null) return setLocalError('Informe se existe determinação para apresentação da defesa.');
    if (deadlineCorrect === 'nao' && activeDefense === 'sim' && courtDeadlineValid === null) return setLocalError('Informe se há data fatal válida no tribunal.');
    if (deadlineCorrect === 'nao' && activeDefense === 'sim' && courtDeadlineValid === 'nao' && !criteriaComplete) return setLocalError('Selecione os andamentos e informe as respectivas datas.');
    if (deadlineCorrect === 'nao' && activeDefense === 'sim' && courtDeadlineValid === 'sim' && !correctFatal) return setLocalError('Informe o fatal determinado no expediente.');
    if (deadlineCorrect === 'nao' && activeDefense === 'nao' && !reason) return setLocalError('Informe a situação processual.');

    setLocalError(null);
    const apt = deadlineCorrect === 'sim' || activeDefense === 'sim';
    await onSubmit({
      reason: apt ? null : reason,
      fatal_deadline: apt ? deadlineCorrect === 'sim' ? deadline : courtDeadlineValid === 'sim' ? correctFatal : null : null,
      deadline_correct: deadlineCorrect === 'sim',
      has_defense_order: deadlineCorrect === 'sim' ? null : activeDefense === 'sim',
      has_valid_court_deadline: deadlineCorrect === 'nao' && activeDefense === 'sim' ? courtDeadlineValid === 'sim' : null,
      criteria: completedCriteria.map(item => ({ type: item.key, date: criteria[item.key] })),
    });
  };

  return <TaskForm className="defesa-flow" progressive draftKey={draftKey} onSubmit={submit}>
    <div className="defesa-enter-deadline qa-context-note"><p>{deadline ? <>A Enter determinou que essa defesa deve ser apresentada em <strong>{formatDate(deadline)}</strong>.</> : 'A Enter não informou a data para apresentação desta defesa.'}</p></div>
    <TaskQuestion number="01" question="Você concorda que o fatal determinado está correto?"><BinaryChoice name="defense-deadline" value={deadlineCorrect} onChange={chooseDeadline} disabled={busy}/></TaskQuestion>

    {deadlineCorrect === 'nao' ? <TaskQuestion number="02" question="Existe determinação para apresentação da defesa?"><BinaryChoice name="defense-active" value={activeDefense} onChange={chooseActiveDefense} disabled={busy}/></TaskQuestion> : null}

    {deadlineCorrect === 'nao' && activeDefense === 'sim' ? <TaskQuestion number="03" question="Há data fatal válida no tribunal?"><BinaryChoice name="defense-court-valid" value={courtDeadlineValid} onChange={value => { setCourtDeadlineValid(value); setCorrectFatal(''); setCriteria({...EMPTY_CRITERIA}); setCriterionKeys([]); }} disabled={busy}/></TaskQuestion> : null}
    {deadlineCorrect === 'nao' && activeDefense === 'sim' && courtDeadlineValid === 'sim' ? <TaskQuestion number="04" question="Qual o fatal determinado no expediente?"><div className="defesa-flow-deadline-fields"><label className="task-text-field defense-court-deadline"><span>Data fatal do expediente</span><input type="date" disabled={busy} value={correctFatal} onChange={event => setCorrectFatal(event.target.value)}/></label><label className="task-text-field defense-court-deadline"><span>Data da audiência, se houver</span><input type="date" disabled={busy} value={criteria.audiencia} onChange={event => { const value = event.target.value; setCriteria(current => ({ ...current, audiencia: value })); setCriterionKeys(current => value ? (current.includes('audiencia') ? current : [...current, 'audiencia']) : current.filter(item => item !== 'audiencia')); }}/></label></div></TaskQuestion> : null}
    {deadlineCorrect === 'nao' && activeDefense === 'sim' && courtDeadlineValid === 'nao' ? <>
      <TaskQuestion number="04" question="Selecione abaixo quais foram os andamentos da citação"><div className="defesa-flow-criteria">{CRITERIA.map(item => { const selected = criterionKeys.includes(item.key); return <div className={`defesa-flow-criterion ${selected ? 'selected' : ''}`} key={item.key}><button type="button" disabled={busy} aria-pressed={selected} onClick={() => toggleCriterion(item.key)}><span className="defesa-flow-checkbox">{selected ? <Check size={12}/> : null}</span><strong>{item.label}</strong></button>{selected ? <label><span>{item.dateLabel}</span><input type="date" disabled={busy} value={criteria[item.key]} onChange={event => setCriteria(current => ({ ...current, [item.key]: event.target.value }))}/></label> : null}</div>; })}</div></TaskQuestion>
    </> : null}

    {deadlineCorrect === 'nao' && activeDefense === 'nao' ? <>
      <TaskQuestion number="03" question="Por quê?"><OptionGroup name="defense-reason" value={suspensionOpen ? 'suspenso' : reason} onChange={value => { setSuspensionOpen(value === 'suspenso'); setReason(value === 'suspenso' ? null : value as DefenseReason); setLocalError(null); }} disabled={busy} options={[{value:'suspenso',label:'Suspenso'},...REASONS]}/></TaskQuestion>
      {suspensionOpen ? <TaskQuestion number="04" question="Qual o tema da suspensão?"><OptionGroup name="defense-suspension" value={reason} onChange={value => setReason(value as DefenseReason)} disabled={busy} options={[{value:'suspenso_irdr',label:'IRDR'},{value:'suspenso_1414',label:'Tema 1414'}]}/></TaskQuestion> : null}
    </> : null}

    {localError || error ? <p className="task-renderer-error" role="alert">{localError || error}</p> : null}
    <TaskActionBar busy={busy} ready={Boolean(ready)} onSkip={() => void onSkip()}/>
  </TaskForm>;
}
