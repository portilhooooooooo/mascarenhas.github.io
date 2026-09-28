import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { CalendarDays, Check } from 'lucide-react';
import './defenseAnalysisFlow.css';

type YesNo = 'sim' | 'nao' | null;
export type DefensePriority = 'altissima' | 'alta' | 'baixa';
export type DefenseReason = 'suspenso_irdr' | 'suspenso_1414' | 'turma_recursal' | 'retorno_turma_recursal' | 'sentenca' | 'transito_julgado' | 'sem_citacao' | 'defesa_apresentada';
export type DefenseCriterionKey = 'expedicao_dje' | 'dje_negativo' | 'expedicao_ar' | 'retorno_ar' | 'audiencia' | 'habilitacao';

export type DefenseAnalysisDraft = {
  decision: 'apto' | 'inapto';
  reason: DefenseReason | null;
  fatal_deadline: string | null;
  priority: DefensePriority | null;
  deadline_correct: boolean;
  has_active_defense_deadline: boolean | null;
  criteria: Array<{ type: DefenseCriterionKey; date: string }>;
  situation: string;
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

const PRIORITIES: Array<{ value: DefensePriority; label: string; helper: string }> = [
  { value: 'altissima', label: 'Altíssima', helper: 'Hoje' },
  { value: 'alta', label: 'Alta', helper: 'Amanhã' },
  { value: 'baixa', label: 'Baixa', helper: 'D+2 ou posterior' },
];

const SITUATIONS: Record<DefenseReason, string> = {
  suspenso_irdr: 'Processo suspenso em razão do IRDR.',
  suspenso_1414: 'Processo suspenso em razão do Tema 1414.',
  turma_recursal: 'Processo está na Turma Recursal.',
  retorno_turma_recursal: 'Processo estava na Turma Recursal, aguardando retorno aos autos.',
  sentenca: 'Processo possui sentença.',
  transito_julgado: 'Processo possui trânsito em julgado.',
  sem_citacao: 'Processo sem citação para defesa expedida.',
  defesa_apresentada: 'Já existe defesa apresentada nos autos.',
};

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

function naturalList(values: string[]) {
  if (!values.length) return '';
  if (values.length === 1) return values[0];
  if (values.length === 2) return `${values[0]} e ${values[1]}`;
  return `${values.slice(0, -1).join(', ')} e ${values[values.length - 1]}`;
}

function criterionPhrase(key: DefenseCriterionKey, value: string) {
  const date = formatDate(value);
  const phrases: Record<DefenseCriterionKey, string> = {
    expedicao_dje: `expedição do DJE em ${date}`,
    dje_negativo: `DJE negativo em ${date}`,
    expedicao_ar: `Carta AR expedida em ${date}`,
    retorno_ar: `retorno da Carta AR em ${date}`,
    audiencia: `audiência agendada para ${date}`,
    habilitacao: `habilitação realizada em ${date}`,
  };
  return phrases[key];
}

function BinaryChoice({ value, onChange, disabled }: { value: YesNo; onChange: (value: Exclude<YesNo, null>) => void; disabled?: boolean }) {
  return <div className="defesa-flow-binary">{(['sim', 'nao'] as const).map(option => <button type="button" key={option} disabled={disabled} className={value === option ? 'active' : ''} onClick={() => onChange(option)}>{option === 'sim' ? 'Sim' : 'Não'}</button>)}</div>;
}

export function DefenseAnalysisFlow({ cnj, controlDeadline, busy = false, error = null, onSubmit, onSkip }: Props) {
  const deadline = dateOnly(controlDeadline);
  const [deadlineCorrect, setDeadlineCorrect] = useState<YesNo>(null);
  const [priority, setPriority] = useState<DefensePriority | null>(null);
  const [activeDefense, setActiveDefense] = useState<YesNo>(null);
  const [correctFatal, setCorrectFatal] = useState('');
  const [criteria, setCriteria] = useState<Record<DefenseCriterionKey, string>>(EMPTY_CRITERIA);
  const [criterionKeys, setCriterionKeys] = useState<DefenseCriterionKey[]>([]);
  const [reason, setReason] = useState<DefenseReason | null>(null);
  const [suspensionOpen, setSuspensionOpen] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  useEffect(() => {
    setDeadlineCorrect(null);
    setPriority(null);
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

  const result = useMemo(() => {
    if (deadlineCorrect === 'sim') return { status: priority ? 'Apto' : '—', priority, situation: priority ? 'Prazo determinado pela Controladoria confirmado.' : 'Aguardando definição da prioridade.', fatal: deadline };
    if (deadlineCorrect === 'nao' && activeDefense === 'sim') {
      const phrases = completedCriteria.map(item => criterionPhrase(item.key, criteria[item.key]));
      return {
        status: correctFatal && priority && criteriaComplete ? 'Apto' : '—',
        priority,
        situation: !criterionKeys.length ? 'Aguardando os critérios utilizados para definição do prazo.' : !criteriaComplete ? 'Preencha as datas dos critérios selecionados.' : `Prazo de defesa identificado com base em ${naturalList(phrases)}.`,
        fatal: correctFatal,
      };
    }
    if (deadlineCorrect === 'nao' && activeDefense === 'nao') return { status: reason ? 'Inapto' : '—', priority: null, situation: reason ? SITUATIONS[reason] : 'Aguardando a situação processual.', fatal: '' };
    return { status: '—', priority: null, situation: 'Aguardando análise.', fatal: '' };
  }, [activeDefense, completedCriteria, correctFatal, criteria, criteriaComplete, criterionKeys.length, deadline, deadlineCorrect, priority, reason]);

  const resetAfterDeadline = () => {
    setPriority(null); setActiveDefense(null); setCorrectFatal(''); setCriteria({ ...EMPTY_CRITERIA }); setCriterionKeys([]); setReason(null); setSuspensionOpen(false); setLocalError(null);
  };

  const chooseDeadline = (value: Exclude<YesNo, null>) => { setDeadlineCorrect(value); resetAfterDeadline(); };
  const chooseActiveDefense = (value: Exclude<YesNo, null>) => { setActiveDefense(value); setPriority(null); setCorrectFatal(''); setCriteria({ ...EMPTY_CRITERIA }); setCriterionKeys([]); setReason(null); setSuspensionOpen(false); setLocalError(null); };
  const toggleCriterion = (key: DefenseCriterionKey) => {
    setCriterionKeys(current => current.includes(key) ? current.filter(item => item !== key) : [...current, key]);
    if (criterionKeys.includes(key)) setCriteria(current => ({ ...current, [key]: '' }));
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (deadlineCorrect === null) return setLocalError('Informe se o prazo da Controladoria está correto.');
    if (deadlineCorrect === 'sim' && !priority) return setLocalError('Defina a prioridade da defesa.');
    if (deadlineCorrect === 'sim' && !deadline) return setLocalError('O prazo informado pela Controladoria não está disponível.');
    if (deadlineCorrect === 'nao' && activeDefense === null) return setLocalError('Informe se há citação para defesa correndo.');
    if (deadlineCorrect === 'nao' && activeDefense === 'sim' && !criteriaComplete) return setLocalError('Selecione os critérios e informe as respectivas datas.');
    if (deadlineCorrect === 'nao' && activeDefense === 'sim' && !correctFatal) return setLocalError('Informe o fatal correto.');
    if (deadlineCorrect === 'nao' && activeDefense === 'sim' && !priority) return setLocalError('Defina a prioridade da defesa.');
    if (deadlineCorrect === 'nao' && activeDefense === 'nao' && !reason) return setLocalError('Informe a situação processual.');

    setLocalError(null);
    const apt = deadlineCorrect === 'sim' || activeDefense === 'sim';
    await onSubmit({
      decision: apt ? 'apto' : 'inapto',
      reason: apt ? null : reason,
      fatal_deadline: apt ? result.fatal || null : null,
      priority: apt ? priority : null,
      deadline_correct: deadlineCorrect === 'sim',
      has_active_defense_deadline: deadlineCorrect === 'sim' ? true : activeDefense === 'sim',
      criteria: completedCriteria.map(item => ({ type: item.key, date: criteria[item.key] })),
      situation: result.situation,
    });
  };

  const priorityLabel = PRIORITIES.find(item => item.value === result.priority)?.label || '—';

  return <form className="defesa-flow" onSubmit={submit}>
    <div className="defesa-flow-context">
      <div><small>FATAL CONTROLADORIA</small><strong><CalendarDays size={13}/>{formatDate(deadline)}</strong></div>
      <div><small>ORIGEM</small><strong>Controladoria Enter</strong></div>
    </div>

    <section className="defesa-flow-question">
      <div className="defesa-flow-step">01</div>
      <div className="defesa-flow-question-body"><h3>O prazo determinado pela Controladoria está correto?</h3><BinaryChoice value={deadlineCorrect} onChange={chooseDeadline} disabled={busy}/></div>
    </section>

    {deadlineCorrect === 'sim' ? <section className="defesa-flow-question nested"><div className="defesa-flow-step">02</div><div className="defesa-flow-question-body"><h3>Qual a prioridade da defesa?</h3><div className="defesa-flow-priority">{PRIORITIES.map(item => <button type="button" disabled={busy} key={item.value} className={priority === item.value ? 'active' : ''} onClick={() => { setPriority(item.value); setLocalError(null); }}><strong>{item.label}</strong><span>{item.helper}</span></button>)}</div></div></section> : null}

    {deadlineCorrect === 'nao' ? <section className="defesa-flow-question nested"><div className="defesa-flow-step">02</div><div className="defesa-flow-question-body"><h3>Esse processo tem citação para defesa correndo?</h3><BinaryChoice value={activeDefense} onChange={chooseActiveDefense} disabled={busy}/></div></section> : null}

    {deadlineCorrect === 'nao' && activeDefense === 'sim' ? <>
      <section className="defesa-flow-question nested"><div className="defesa-flow-step">03</div><div className="defesa-flow-question-body"><h3>Com qual critério você está se baseando?</h3><p>Selecione um ou mais critérios. Cada seleção abre sua respectiva data.</p><div className="defesa-flow-criteria">{CRITERIA.map(item => { const selected = criterionKeys.includes(item.key); return <div className={`defesa-flow-criterion ${selected ? 'selected' : ''}`} key={item.key}><button type="button" disabled={busy} onClick={() => toggleCriterion(item.key)}><span className="defesa-flow-checkbox">{selected ? <Check size={12}/> : null}</span><strong>{item.label}</strong></button>{selected ? <label><span>{item.dateLabel}</span><input type="date" disabled={busy} value={criteria[item.key]} onChange={event => setCriteria(current => ({ ...current, [item.key]: event.target.value }))}/></label> : null}</div>; })}</div></div></section>
      <section className="defesa-flow-question nested"><div className="defesa-flow-step">04</div><div className="defesa-flow-question-body"><h3>Defina a conclusão do prazo</h3><div className="defesa-flow-conclusion"><label><span>Fatal correto</span><input type="date" disabled={busy} value={correctFatal} onChange={event => setCorrectFatal(event.target.value)}/></label><div><span>Prioridade</span><div className="defesa-flow-priority compact">{PRIORITIES.map(item => <button type="button" disabled={busy} key={item.value} className={priority === item.value ? 'active' : ''} onClick={() => setPriority(item.value)}><strong>{item.label}</strong><small>{item.helper}</small></button>)}</div></div></div></div></section>
    </> : null}

    {deadlineCorrect === 'nao' && activeDefense === 'nao' ? <section className="defesa-flow-question nested"><div className="defesa-flow-step">03</div><div className="defesa-flow-question-body"><h3>Qual é a situação do processo?</h3><div className="defesa-flow-reasons"><button type="button" disabled={busy} className={reason === 'suspenso_irdr' || reason === 'suspenso_1414' ? 'active' : ''} onClick={() => { setSuspensionOpen(true); setReason(null); }}>Suspenso</button>{REASONS.map(item => <button type="button" disabled={busy} key={item.value} className={reason === item.value ? 'active' : ''} onClick={() => { setReason(item.value); setSuspensionOpen(false); setLocalError(null); }}>{item.label}</button>)}</div>{suspensionOpen ? <div className="defesa-flow-suspension"><span>Qual suspensão foi identificada?</span><div className="defesa-flow-binary"><button type="button" disabled={busy} className={reason === 'suspenso_irdr' ? 'active' : ''} onClick={() => setReason('suspenso_irdr')}>IRDR</button><button type="button" disabled={busy} className={reason === 'suspenso_1414' ? 'active' : ''} onClick={() => setReason('suspenso_1414')}>Tema 1414</button></div></div> : null}</div></section> : null}

    <div className="defesa-flow-result">
      <div><small>RESULTADO</small><strong className={result.status === 'Apto' ? 'apto' : result.status === 'Inapto' ? 'inapto' : ''}>{result.status}</strong></div>
      <div><small>PRIORIDADE</small><strong>{priorityLabel}</strong></div>
      <div><small>FATAL</small><strong>{formatDate(result.fatal)}</strong></div>
      <div className="wide"><small>SITUAÇÃO</small><span>{result.situation}</span></div>
    </div>

    {localError || error ? <p className="task-renderer-error" role="alert">{localError || error}</p> : null}
    <footer className="task-renderer-footer defesa-flow-footer"><button className="secondary-button" type="button" disabled={busy} onClick={() => void onSkip()}>Pular e voltar depois</button><button className="primary-button" type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar e próximo'}</button></footer>
  </form>;
}
