import { type FormEvent, useEffect, useRef, useState } from 'react';
import { useQaField } from './qaDraft';
import './closingAnalysisFlow.css';
import { OptionGroup, TaskActionBar, TaskForm, TaskQuestion } from './TaskQuestion';

type YesNo = 'sim' | 'nao' | null;
type CostsAnswer = 'sim' | 'nao' | 'sem_pendencia' | null;
type TrialResult = 'procedente' | 'parcialmente_procedente' | 'improcedente' | 'extincao';
type AppealResult = 'sentenca_desconstituida' | 'condenacao_mantida'
  | 'condenacao_afastada' | 'sem_condenacao_mantida' | 'condenacao_imposta' | 'outro';
type Appellant = 'banco' | 'autora';
type FinalMerit = 'vitoria' | 'derrota' | 'indeterminado';

export type ClosingAnalysisDraft = {
  workflow_version: 5;
  first_instance_merit: TrialResult;
  had_appeal: boolean;
  appeal_decided: boolean | null;
  appeal_result: AppealResult | null;
  appeal_other_description: string | null;
  appellant: Appellant | null;
  appeal_deadline_open: boolean | null;
  appeal_deadline_date: string | null;
  transit_confirmed: boolean | null;
  transit_date: string | null;
  final_costs_paid: boolean | 'sem_pendencia' | null;
  execution_requested: boolean | null;
  full_payment: boolean | null;
  classifier_classification: string | null;
  classification_agreed: boolean;
  classification_disagreement_reason: string | null;
};

export type ClosingPrefill = Partial<Pick<ClosingAnalysisDraft,
  'first_instance_merit' | 'had_appeal' | 'appeal_decided' | 'appeal_result'
  | 'appeal_other_description' | 'appellant' | 'appeal_deadline_open'
  | 'appeal_deadline_date' | 'transit_confirmed' | 'transit_date'
  | 'final_costs_paid' | 'execution_requested' | 'full_payment'
>>;

type Props = {
  cnj: string;
  prefill?: ClosingPrefill;
  classifierClassification?: string | null;
  contextHint?: string;
  draftKey?: string;
  busy?: boolean;
  error?: string | null;
  onSubmit: (draft: ClosingAnalysisDraft) => Promise<void> | void;
  onSkip: () => Promise<void> | void;
  onPhaseEntered?: (index: number, stage: string) => void;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const OUTCOME_LABELS: Record<string, string> = {
  apto_vitoria: 'Apto ao encerramento — Vitória',
  apto_derrota_voluntaria: 'Apto ao encerramento — Derrota voluntária',
  apto_derrota: 'Apto ao encerramento — Derrota',
  inapto_recurso_pendente: 'Inapto — apelação pendente',
  inapto_prazo_recursal: 'Inapto — prazo recursal em aberto',
  inapto_sem_transito: 'Inapto — ainda sem trânsito em julgado',
  inapto_aguardando_transito_60d: 'Inapto temporariamente — aguardando 60 dias do trânsito',
  inapto_execucao_pendente: 'Inapto — execução sem pagamento integral',
  inapto_resultado_indeterminado: 'Inapto — resultado do recurso exige validação',
  inapto_acordao_outro: 'Revisão — resultado do acórdão ainda não mapeado',
  inapto_sentenca_desconstituida: 'Inapto — sentença desconstituída; aguardando nova decisão',
};

const CLOSING_STAGES = [
  'Cadastro de Sentença', 'Cadastro de Acórdão', 'Cadastro de Execução',
  'Cadastro de Trânsito em Julgado', 'Cadastro de Encerramento',
] as const;

const SENTENCES = [
  { value: 'procedente', label: 'Procedente' },
  { value: 'parcialmente_procedente', label: 'Parcialmente procedente' },
  { value: 'improcedente', label: 'Improcedente' },
  { value: 'extincao', label: 'Extinção' },
];

const APPEAL_OPTIONS: Record<TrialResult, { value: AppealResult; label: string }[]> = {
  procedente: [
    { value: 'sentenca_desconstituida', label: 'Sentença anulada' },
    { value: 'condenacao_mantida', label: 'Manutenção da condenação' },
    { value: 'condenacao_afastada', label: 'Convertida para improcedência' },
    { value: 'outro', label: 'Outro' },
  ],
  parcialmente_procedente: [
    { value: 'sentenca_desconstituida', label: 'Sentença anulada' },
    { value: 'condenacao_mantida', label: 'Manutenção da condenação' },
    { value: 'condenacao_afastada', label: 'Convertida para improcedência' },
    { value: 'outro', label: 'Outro' },
  ],
  improcedente: [
    { value: 'sentenca_desconstituida', label: 'Sentença anulada' },
    { value: 'sem_condenacao_mantida', label: 'Manutenção da improcedência' },
    { value: 'condenacao_imposta', label: 'Convertida para procedência' },
    { value: 'outro', label: 'Outro' },
  ],
  extincao: [
    { value: 'sentenca_desconstituida', label: 'Sentença anulada' },
    { value: 'sem_condenacao_mantida', label: 'Manutenção da extinção' },
    { value: 'condenacao_imposta', label: 'Convertida para procedência' },
    { value: 'outro', label: 'Outro' },
  ],
};

function BinaryChoice({ name, value, disabled, onChange }: {
  name: string; value: YesNo; disabled: boolean;
  onChange: (value: Exclude<YesNo, null>) => void;
}) {
  return <OptionGroup name={name} value={value} disabled={disabled}
    onChange={next => onChange(next as Exclude<YesNo, null>)}
    options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />;
}

function dateAsUtc(value: string): number | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = +match[1], month = +match[2], day = +match[3];
  const millis = Date.UTC(year, month - 1, day);
  const date = new Date(millis);
  if (date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) return null;
  return millis;
}

function todayUtc(): number {
  const values = new Intl.DateTimeFormat('en-US', {
    timeZone: 'America/Campo_Grande', day: '2-digit', month: '2-digit', year: 'numeric',
  }).formatToParts(new Date());
  const part = (type: string) => Number(values.find(item => item.type === type)?.value);
  return Date.UTC(part('year'), part('month') - 1, part('day'));
}

function daysElapsed(value: string) {
  const time = dateAsUtc(value);
  return time === null ? null : Math.floor((todayUtc() - time) / DAY_MS);
}

function afterDays(value: string, days: number) {
  const time = dateAsUtc(value);
  return time === null ? null : new Date(time + DAY_MS * days).toISOString().slice(0, 10);
}

function formatDate(value: string | null) {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return day && month && year ? day + '/' + month + '/' + year : value;
}

function asFinalResult(sentence: TrialResult): FinalMerit {
  if (sentence === 'improcedente' || sentence === 'extincao') return 'vitoria';
  return 'derrota';
}

function DateAnswer({ name, label, value, onChange, disabled }: {
  name: string; label: string; value: string; onChange: (value: string) => void; disabled: boolean;
}) {
  return <label className="closing-date-answer" htmlFor={name}>
    <span>{label}</span>
    <input id={name} name={name} type="date" value={value} disabled={disabled}
      required onChange={event => onChange(event.target.value)} />
  </label>;
}

function hasStoredClosingDraft(key: string): boolean {
  if (!key) return false;
  try { return sessionStorage.getItem(key) !== null; } catch { return false; }
}
function yesNo(value: boolean | null | undefined): YesNo {
  return value === true ? 'sim' : value === false ? 'nao' : null;
}
function costsAnswer(value: boolean | 'sem_pendencia' | null | undefined): CostsAnswer {
  return value === 'sem_pendencia' ? 'sem_pendencia' : yesNo(value);
}

export function ClosingAnalysisFlow({
  cnj, classifierClassification, prefill, draftKey = '', busy = false, error = null,
  onSubmit, onSkip, onPhaseEntered,
}: Props) {
  const [sentence, setSentence] = useQaField<TrialResult | null>(draftKey, 'closing.sentence', null);
  const [hadAppeal, setHadAppeal] = useQaField<YesNo>(draftKey, 'closing.hadAppeal', null);
  const [appealDecided, setAppealDecided] = useQaField<YesNo>(draftKey, 'closing.appealDecided', null);
  const [appealResult, setAppealResult] = useQaField<AppealResult | null>(draftKey, 'closing.appealResult', null);
  const [appealOtherDescription, setAppealOtherDescription] = useQaField(draftKey, 'closing.appealOtherDescription', '');
  const [appellant, setAppellant] = useQaField<Appellant | null>(draftKey, 'closing.appellant', null);
  const [deadlineOpen, setDeadlineOpen] = useQaField<YesNo>(draftKey, 'closing.deadlineOpen', null);
  const [deadlineDate, setDeadlineDate] = useQaField(draftKey, 'closing.deadlineDate', '');
  const [transitConfirmed, setTransitConfirmed] = useQaField<YesNo>(draftKey, 'closing.transitConfirmed', null);
  const [transitDate, setTransitDate] = useQaField(draftKey, 'closing.transitDate', '');
  const [costsPaid, setCostsPaid] = useQaField<CostsAnswer>(draftKey, 'closing.costsPaid', null);
  const [executionRequested, setExecutionRequested] = useQaField<YesNo>(draftKey, 'closing.executionRequested', null);
  const [fullPayment, setFullPayment] = useQaField<YesNo>(draftKey, 'closing.fullPayment', null);
  const [classificationAgreed, setClassificationAgreed] = useQaField<YesNo>(draftKey, 'closing.classificationAgreed', null);
  const [disagreementReason, setDisagreementReason] = useQaField(draftKey, 'closing.disagreementReason', '');
  const [localError, setLocalError] = useState<string | null>(null);

  // Prefill is an initial radio selection, never an automatic confirmation.
  // Restore existing analyst drafts first; never overwrite an edit made while
  // the read-only evidence request was running.
  const hadDraftAtMount = useRef<boolean | null>(null);
  if (hadDraftAtMount.current === null) hadDraftAtMount.current = hasStoredClosingDraft(draftKey);
  const interactedBeforePrefill = useRef(false);
  const prefillApplied = useRef(false);
  useEffect(() => {
    if (!prefill || prefillApplied.current) return;
    prefillApplied.current = true;
    if (hadDraftAtMount.current || interactedBeforePrefill.current) return;
    if (prefill.first_instance_merit) setSentence(current => current ?? prefill.first_instance_merit!);
    if (prefill.had_appeal != null) setHadAppeal(current => current ?? yesNo(prefill.had_appeal));
    if (prefill.appeal_decided != null) setAppealDecided(current => current ?? yesNo(prefill.appeal_decided));
    if (prefill.appellant) setAppellant(current => current ?? prefill.appellant!);
    if (prefill.appeal_result) setAppealResult(current => current ?? prefill.appeal_result!);
    if (prefill.appeal_other_description) setAppealOtherDescription(current => current || prefill.appeal_other_description!);
    if (prefill.appeal_deadline_open != null) setDeadlineOpen(current => current ?? yesNo(prefill.appeal_deadline_open));
    if (prefill.appeal_deadline_date) setDeadlineDate(current => current || prefill.appeal_deadline_date!);
    if (prefill.transit_confirmed != null) setTransitConfirmed(current => current ?? yesNo(prefill.transit_confirmed));
    if (prefill.transit_date) setTransitDate(current => current || prefill.transit_date!);
    if (prefill.final_costs_paid != null) setCostsPaid(current => current ?? costsAnswer(prefill.final_costs_paid));
    if (prefill.execution_requested != null) setExecutionRequested(current => current ?? yesNo(prefill.execution_requested));
    if (prefill.full_payment != null) setFullPayment(current => current ?? yesNo(prefill.full_payment));
    // classificationAgreed deliberately stays null; the analyst must confirm.
  }, [prefill, setSentence, setHadAppeal, setAppealDecided, setAppellant, setAppealResult,
    setAppealOtherDescription, setDeadlineOpen, setDeadlineDate, setTransitConfirmed,
    setTransitDate, setCostsPaid, setExecutionRequested, setFullPayment]);

  const clearAfterTransit = () => {
    setCostsPaid(null); setExecutionRequested(null); setFullPayment(null);
    setLocalError(null);
  };
  const clearTransit = () => {
    setTransitConfirmed(null); setTransitDate(''); clearAfterTransit();
  };
  const clearAppeal = () => {
    setAppealDecided(null); setAppealResult(null); setAppealOtherDescription(''); setAppellant(null);
    setDeadlineOpen(null); setDeadlineDate(''); clearTransit();
  };
  // O workspace remonta o fluxo por processo; o rascunho é restaurado em useQaField.

  const appealPending = hadAppeal === 'sim' && appealDecided === 'nao';
  // Rascunhos com opções antigas devem exigir nova escolha.
  const appealResultValid = Boolean(sentence && appealResult
    && APPEAL_OPTIONS[sentence].some(option => option.value === appealResult));
  const otherDescriptionValid = appealOtherDescription.trim().length >= 6
    && appealOtherDescription.trim().length <= 500;
  const appealJudged = hadAppeal === 'sim'
    && appellant !== null && appealDecided === 'sim' && appealResultValid
    && (appealResult !== 'outro' || otherDescriptionValid);
  const appealOther = appealJudged && appealResult === 'outro';
  const noAppealReady = hadAppeal === 'nao' && deadlineOpen === 'nao';
  const deadlineAge = deadlineDate ? daysElapsed(deadlineDate) : null;
  const transitAge = transitDate ? daysElapsed(transitDate) : null;
  const hasValidTransitDate = transitAge !== null && transitAge >= 0;
  const transitTooRecent = hasValidTransitDate && transitAge < 60;

  let finalMerit: FinalMerit | null = null;
  if (sentence && noAppealReady) {
    finalMerit = asFinalResult(sentence);
  } else if (sentence && appealJudged) {
    if (appealResult === 'sentenca_desconstituida') {
      finalMerit = null;
    } else if (appealResult === 'outro') {
      finalMerit = 'indeterminado'; // Resultado ainda não mapeado: revisão humana.
    } else if (appealResult === 'condenacao_afastada' || appealResult === 'sem_condenacao_mantida') {
      finalMerit = 'vitoria';
    } else {
      finalMerit = 'derrota';
    }
  }

  let outcome: string | null = null;
  if (appealPending) {
    outcome = 'inapto_recurso_pendente';
  } else if (appealJudged && appealResult === 'sentenca_desconstituida') {
    outcome = 'inapto_sentenca_desconstituida';
  } else if (hadAppeal === 'nao' && deadlineOpen === 'sim') {
    if (deadlineAge !== null && deadlineAge <= 0) outcome = 'inapto_prazo_recursal';
  } else if (appealOther) {
    outcome = 'inapto_acordao_outro';
  } else if (finalMerit === 'indeterminado') {
    outcome = 'inapto_resultado_indeterminado';
  } else if (finalMerit) {
    if (transitConfirmed === 'nao') outcome = 'inapto_sem_transito';
    else if (transitConfirmed === 'sim') {
      if (finalMerit === 'vitoria') outcome = 'apto_vitoria';
      else if (costsPaid !== null && executionRequested !== null) {
        // Custas finais pendentes não alteram aptidão nem classificação.
        // Sem execução, manter o requisito de 60 dias para Derrota Voluntária.
        if (executionRequested === 'nao' && hasValidTransitDate) {
          outcome = transitTooRecent
            ? 'inapto_aguardando_transito_60d'
            : 'apto_derrota_voluntaria';
        } else if (executionRequested === 'sim' && fullPayment !== null) {
          outcome = fullPayment === 'sim' ? 'apto_derrota' : 'inapto_execucao_pendente';
        }
      }
    }
  }

  const reopenAt = outcome === 'inapto_aguardando_transito_60d'
    ? afterDays(transitDate, 60)
    : outcome === 'inapto_prazo_recursal' ? afterDays(deadlineDate, 1) : null;

  const canAnswerTransit = finalMerit !== null && finalMerit !== 'indeterminado';
  const closingClassification = outcome === 'apto_derrota_voluntaria' || outcome === 'inapto_aguardando_transito_60d'
    ? 'Derrota Voluntária'
    : finalMerit === 'vitoria' ? 'Vitória'
    : finalMerit === 'derrota' ? 'Derrota'
    : null;
  const costsNote = costsPaid === 'nao'
    ? ' As custas finais ainda não foram pagas, mas isso não impede a aptidão.'
    : '';
  const confirmationText = appealOther
    ? 'Identificamos que o resultado do acórdão exige revisão. A classificação ainda não está definida. Confirma o registro?'
    : outcome?.startsWith('apto_') && closingClassification
      ? 'Identificamos que esse processo está apto para encerramento como ' +
        closingClassification + '.' + costsNote + ' Você concorda com essa informação?'
      : outcome
        ? 'Identificamos que esse processo ' +
          (closingClassification
            ? 'tem classificação sugerida de ' + closingClassification + ', mas'
            : 'ainda não tem classificação definida e') +
          ' não está apto para encerramento: ' +
          OUTCOME_LABELS[outcome].replace(/^(?:Inapto(?: temporariamente)?|Revisão)\s*[—–]\s*/i, '') +
          '. Você concorda com essa informação?'
        : null;
  // Qualquer alteração nas respostas anteriores exige uma nova concordância.
  const reviewSignature = JSON.stringify([sentence, hadAppeal, appellant, appealDecided, appealResult, appealOtherDescription,
    deadlineOpen, deadlineDate, transitConfirmed, transitDate, costsPaid, executionRequested, fullPayment]);
  const lastReviewSignature = useRef(reviewSignature);
  useEffect(() => {
    if (lastReviewSignature.current !== reviewSignature) {
      lastReviewSignature.current = reviewSignature;
      setClassificationAgreed(null);
      setDisagreementReason('');
    }
  }, [reviewSignature, setClassificationAgreed, setDisagreementReason]);
  const sentenceDescription: Record<TrialResult, string> = {
    procedente: 'SENTENÇA PROCEDENTE', parcialmente_procedente: 'SENTENÇA PARCIALMENTE PROCEDENTE',
    improcedente: 'SENTENÇA IMPROCEDENTE', extincao: 'SENTENÇA DE EXTINÇÃO',
  };
  const appealDescription: Record<AppealResult, string> = {
    sentenca_desconstituida: 'SENTENÇA ANULADA',
    condenacao_mantida: 'ACÓRDÃO MANTEVE A CONDENAÇÃO',
    condenacao_afastada: 'ACÓRDÃO CONVERTEU A SENTENÇA EM IMPROCEDÊNCIA',
    sem_condenacao_mantida: 'ACÓRDÃO MANTEVE A AUSÊNCIA DE CONDENAÇÃO',
    condenacao_imposta: 'ACÓRDÃO CONVERTEU A SENTENÇA EM PROCEDÊNCIA',
    outro: 'ACÓRDÃO COM RESULTADO AINDA NÃO MAPEADO',
  };
  // A descrição utiliza somente respostas humanas. Indícios não entram no texto.
  const proposedDescription = [
    sentence ? sentenceDescription[sentence] : '',
    hadAppeal === 'sim' && appealDecided === 'sim' && appealResultValid && appealResult
      ? appealDescription[appealResult] + (appealResult === 'outro' ? ': ' + appealOtherDescription.trim() : '') : '',
    transitConfirmed === 'sim' ? 'TRÂNSITO EM JULGADO' + (transitDate ? ' EM ' + formatDate(transitDate) : ' CONFIRMADO') : '',
    costsPaid === 'sim' ? 'CUSTAS FINAIS PAGAS' : costsPaid === 'nao' ? 'CUSTAS FINAIS NÃO PAGAS' : costsPaid === 'sem_pendencia' ? 'NÃO HÁ CUSTAS FINAIS PENDENTES' : '',
    executionRequested === 'nao' ? 'SEM PEDIDO DE EXECUÇÃO' : executionRequested === 'sim' ? 'COM PEDIDO DE EXECUÇÃO' : '',
    closingClassification
      ? (outcome?.startsWith('apto_') ? 'PROCESSO APTO AO ENCERRAMENTO — ' : 'CLASSIFICAÇÃO SUGERIDA — ') +
        closingClassification.toLocaleUpperCase('pt-BR')
      : 'CLASSIFICAÇÃO AINDA NÃO DEFINIDA',
  ].filter(Boolean).join(', ') + '.';
  const validReason = disagreementReason.trim().length >= 6 && disagreementReason.trim().length <= 2000;
  let questionNumber = 0;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!outcome || !sentence || hadAppeal === null || classificationAgreed === null
      || (appealOther && (classificationAgreed !== 'sim' || !otherDescriptionValid))) {
      setLocalError('Conclua todas as perguntas apresentadas antes de salvar.');
      return;
    }
    if (!appealOther && classificationAgreed === 'nao' && !validReason) {
      setLocalError('Explique a divergência (entre 6 e 2.000 caracteres) antes de enviar para revisão.');
      return;
    }
    setLocalError(null);
    await onSubmit({
      workflow_version: 5,
      first_instance_merit: sentence,
      had_appeal: hadAppeal === 'sim',
      appeal_decided: hadAppeal === 'sim' ? appealDecided === 'sim' : null,
      appeal_result: hadAppeal === 'sim' && appealDecided === 'sim' ? appealResult : null,
      appeal_other_description: appealOther ? appealOtherDescription.trim() : null,
      appellant: hadAppeal === 'sim' ? appellant : null,
      appeal_deadline_open: hadAppeal === 'nao' ? deadlineOpen === 'sim' : null,
      appeal_deadline_date: hadAppeal === 'nao' && deadlineOpen === 'sim' ? deadlineDate : null,
      transit_confirmed: canAnswerTransit ? transitConfirmed === 'sim' : null,
      transit_date: finalMerit === 'derrota' && transitConfirmed === 'sim'
        && costsPaid !== null && executionRequested === 'nao' ? transitDate || null : null,
      final_costs_paid: finalMerit === 'derrota' && transitConfirmed === 'sim'
        ? costsPaid === 'sem_pendencia' ? 'sem_pendencia' : costsPaid === 'sim' : null,
      execution_requested: finalMerit === 'derrota' && transitConfirmed === 'sim' && costsPaid !== null
        ? executionRequested === 'sim' : null,
      full_payment: finalMerit === 'derrota' && transitConfirmed === 'sim'
        && costsPaid !== null && executionRequested === 'sim' ? fullPayment === 'sim' : null,
      classifier_classification: classifierClassification || null,
      classification_agreed: appealOther ? false : classificationAgreed === 'sim',
      classification_disagreement_reason: appealOther ? 'Acórdão — Outro: ' + appealOtherDescription.trim()
        : classificationAgreed === 'nao' ? disagreementReason.trim() : null,
    });
  };

  return <TaskForm className="closing-flow" progressive stages={CLOSING_STAGES} stageStates={{
    'Cadastro de Sentença': sentence ? 'completed' : 'pending',
    'Cadastro de Acórdão': appealPending || appealJudged || (hadAppeal === 'nao' && (deadlineOpen === 'nao' || Boolean(outcome))) ? 'completed' : 'pending',
    'Cadastro de Execução': finalMerit === 'vitoria' || (outcome && (finalMerit !== 'derrota' || transitConfirmed !== 'sim')) ? 'not_applicable' : outcome ? 'completed' : 'pending',
    'Cadastro de Trânsito em Julgado': outcome && !canAnswerTransit ? 'not_applicable' : transitConfirmed !== null && !(finalMerit === 'derrota' && costsPaid !== null && executionRequested === 'nao' && !hasValidTransitDate) ? 'completed' : 'pending',
    'Cadastro de Encerramento': classificationAgreed === 'sim' || (!appealOther && classificationAgreed === 'nao' && validReason) ? 'completed' : 'pending',
  }} draftKey={draftKey} onSubmit={submit} onPhaseEntered={onPhaseEntered}
    onChangeCapture={() => { interactedBeforePrefill.current = true; }}
    onKeyDownCapture={() => { interactedBeforePrefill.current = true; }}>

    <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Sentença" question="Qual foi o resultado da sentença?">
      <OptionGroup name="closing-sentence" value={sentence} disabled={busy}
        options={SENTENCES} onChange={value => {
          setSentence(value as TrialResult); setHadAppeal(null); clearAppeal();
        }} />
    </TaskQuestion>

    {sentence ? <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Acórdão" question="Houve interposição de apelação?">
      <BinaryChoice name="closing-appeal" value={hadAppeal} disabled={busy} onChange={value => {
        setHadAppeal(value); clearAppeal();
      }} />
    </TaskQuestion> : null}

    {hadAppeal === 'sim' ? <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Acórdão" question="Quem interpôs a apelação?">
      <OptionGroup name="closing-appellant" value={appellant} disabled={busy}
        options={[{ value: 'banco', label: 'Banco' }, { value: 'autora', label: 'Parte autora' }]}
        onChange={value => {
          setAppellant(value as Appellant); setAppealDecided(null); setAppealResult(null);
          setAppealOtherDescription(''); clearTransit();
        }} />
    </TaskQuestion> : null}

    {hadAppeal === 'sim' && appellant !== null ? <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Acórdão" question="O colegiado já julgou a apelação?">
      <BinaryChoice name="closing-appeal-decided" value={appealDecided} disabled={busy} onChange={value => {
        setAppealDecided(value); setAppealResult(null); clearTransit();
      }} />
    </TaskQuestion> : null}

    {hadAppeal === 'sim' && appellant !== null && appealDecided === 'sim' && sentence
      ? <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Acórdão"
          question="Qual foi o resultado do acórdão?">
        <OptionGroup name="closing-appeal-result" value={appealResultValid ? appealResult : null} disabled={busy}
          options={APPEAL_OPTIONS[sentence]}
          onChange={value => { setAppealResult(value as AppealResult);
            if (value !== appealResult) setAppealOtherDescription('');
            clearTransit(); }} />
        {appealResult === 'outro' ? <label className="closing-disagreement-field">
          <span>Descreva o resultado do acórdão</span>
          <textarea value={appealOtherDescription} required minLength={6} maxLength={500}
            disabled={busy} placeholder="Ex.: recurso parcialmente provido, com redução dos danos morais."
            onChange={event => { setAppealOtherDescription(event.target.value); setLocalError(null); }} />
        </label> : null}
      </TaskQuestion> : null}

    {hadAppeal === 'nao' ? <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Acórdão" question="Há prazo para recorrer?">
      <BinaryChoice name="closing-deadline-open" value={deadlineOpen} disabled={busy}
        onChange={value => {
          setDeadlineOpen(value); setDeadlineDate(''); clearTransit();
        }} />
    </TaskQuestion> : null}

    {hadAppeal === 'nao' && deadlineOpen === 'sim' ? <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Acórdão" question="Qual é a data final do prazo recursal?">
      <DateAnswer name="closing-deadline-date" label="Data final do prazo" value={deadlineDate}
        disabled={busy} onChange={value => { setDeadlineDate(value); setLocalError(null); }} />
      {deadlineAge !== null && deadlineAge > 0 ? <p className="closing-inline-note">
        A data informada já passou. Confira se o prazo recursal continua aberto.
      </p> : null}
    </TaskQuestion> : null}

    {canAnswerTransit ? <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Trânsito em Julgado" question="Esse processo já transitou em julgado?">
      <BinaryChoice name="closing-transit-confirmed" value={transitConfirmed} disabled={busy}
        onChange={value => { setTransitConfirmed(value); setTransitDate(''); clearAfterTransit(); }} />
    </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitConfirmed === 'sim' ?
      <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Execução" question="Custas foram pagas?">
        <OptionGroup name="closing-costs" value={costsPaid} disabled={busy} options={[
          { value: 'sim', label: 'Sim' },
          { value: 'nao', label: 'Não' },
          { value: 'sem_pendencia', label: 'Não há custas pendentes' },
        ]} onChange={value => {
          setCostsPaid(value as Exclude<CostsAnswer, null>); setExecutionRequested(null); setFullPayment(null);
          setTransitDate(''); setLocalError(null);
        }} />
      </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitConfirmed === 'sim' && costsPaid !== null ?
      <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Execução" question="Houve pedido de execução?">
        <BinaryChoice name="closing-execution" value={executionRequested} disabled={busy} onChange={value => {
          setExecutionRequested(value); setFullPayment(null); setTransitDate(''); setLocalError(null);
        }} />
      </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitConfirmed === 'sim' &&
      costsPaid !== null && executionRequested === 'nao' ?
      <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Trânsito em Julgado" question="Qual foi a data do trânsito em julgado?">
        <DateAnswer name="closing-transit-date" label="Data do trânsito em julgado"
          value={transitDate} disabled={busy} onChange={value => {
            setTransitDate(value); setLocalError(null);
          }} />
        {outcome === 'inapto_aguardando_transito_60d' ? <p className="closing-inline-note">
          Derrota Voluntária exige 60 dias após o trânsito.
          Reanálise em {formatDate(reopenAt)}.
        </p> : null}
      </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitConfirmed === 'sim' && costsPaid !== null && executionRequested === 'sim' ?
      <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Execução" question="Houve pagamento do valor integral solicitado pela autora?">
        <BinaryChoice name="closing-payment" value={fullPayment} disabled={busy} onChange={value => {
          setFullPayment(value); setLocalError(null);
        }} />
      </TaskQuestion> : null}

    {outcome && confirmationText ? <TaskQuestion number={String(++questionNumber)} stage="Cadastro de Encerramento" question={confirmationText}>
      <div className="closing-review-observation">
        <strong>Descrição proposta do andamento</strong>
        <p>{proposedDescription}</p>
      </div>
      <BinaryChoice name="closing-classification-agreement" value={classificationAgreed} disabled={busy}
        onChange={value => { setClassificationAgreed(value); setLocalError(null); if (value === 'sim') setDisagreementReason(''); }} />
      {classificationAgreed === 'nao' && !appealOther ? <label className="closing-disagreement-field">
        <span>Por que você discorda da classificação ou da descrição?</span>
        <textarea value={disagreementReason} required disabled={busy} maxLength={2000}
          placeholder="Descreva a divergência encontrada no processo."
          onChange={event => { setDisagreementReason(event.target.value); setLocalError(null); }}/>
      </label> : null}
      {classificationAgreed === 'sim' && reopenAt ? <p className="closing-inline-note">
        Reanálise prevista em {formatDate(reopenAt)}.
      </p> : null}
    </TaskQuestion> : null}
    {localError || error ? <p className="task-renderer-error" role="alert">{localError || error}</p> : null}
    <TaskActionBar busy={busy} ready={Boolean(outcome && (classificationAgreed === 'sim'
      || (!appealOther && classificationAgreed === 'nao' && validReason)))} onSkip={() => void onSkip()}
      skipLabel="Pular esse processo" />
  </TaskForm>;
}
