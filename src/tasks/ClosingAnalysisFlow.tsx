import { type FormEvent, useState } from 'react';
import { useQaField } from './qaDraft';
import './closingAnalysisFlow.css';
import { OptionGroup, TaskActionBar, TaskForm, TaskQuestion } from './TaskQuestion';

type YesNo = 'sim' | 'nao' | null;
type TrialResult = 'procedente' | 'parcialmente_procedente' | 'improcedente' | 'extincao';
type AppealResult = 'provido' | 'improvido' | 'mantida_improcedencia' | 'convertida_procedencia' | 'sentenca_desconstituida';
type Appellant = 'banco' | 'autora';
type FinalMerit = 'vitoria' | 'derrota' | 'indeterminado';

export type ClosingAnalysisDraft = {
  workflow_version: 3;
  first_instance_merit: TrialResult;
  had_appeal: boolean;
  appeal_decided: boolean | null;
  appeal_result: AppealResult | null;
  appellant: Appellant | null;
  appeal_deadline_open: boolean | null;
  appeal_deadline_date: string | null;
  transit_confirmed: boolean | null;
  transit_date: string | null;
  final_costs_paid: boolean | null;
  execution_requested: boolean | null;
  full_payment: boolean | null;
  classifier_classification: string | null;
};

type Props = {
  cnj: string;
  classifierClassification?: string | null;
  contextHint?: string;
  draftKey?: string;
  busy?: boolean;
  error?: string | null;
  onSubmit: (draft: ClosingAnalysisDraft) => Promise<void> | void;
  onSkip: () => Promise<void> | void;
};

const DAY_MS = 24 * 60 * 60 * 1000;
const OUTCOME_LABELS: Record<string, string> = {
  apto_vitoria: 'Apto ao encerramento — Vitória',
  apto_derrota_voluntaria: 'Apto ao encerramento — Derrota voluntária',
  apto_derrota: 'Apto ao encerramento — Derrota',
  apto_pending_custas: 'Apto, pendente de custas finais',
  inapto_recurso_pendente: 'Inapto — apelação pendente',
  inapto_prazo_recursal: 'Inapto — prazo recursal em aberto',
  inapto_sem_transito: 'Inapto — ainda sem trânsito em julgado',
  inapto_aguardando_transito_60d: 'Inapto temporariamente — aguardando 60 dias do trânsito',
  inapto_execucao_pendente: 'Inapto — execução sem pagamento integral',
  inapto_resultado_indeterminado: 'Inapto — resultado do recurso exige validação',
  inapto_sentenca_desconstituida: 'Inapto — sentença desconstituída; aguardando nova decisão',
};

const SENTENCES = [
  { value: 'procedente', label: 'Procedente' },
  { value: 'parcialmente_procedente', label: 'Parcialmente procedente' },
  { value: 'improcedente', label: 'Improcedente' },
  { value: 'extincao', label: 'Extinção' },
];

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
      onChange={event => onChange(event.target.value)} />
  </label>;
}

export function ClosingAnalysisFlow({
  cnj, classifierClassification, contextHint, draftKey = '', busy = false, error = null, onSubmit, onSkip,
}: Props) {
  const [sentence, setSentence] = useQaField<TrialResult | null>(draftKey, 'closing.sentence', null);
  const [hadAppeal, setHadAppeal] = useQaField<YesNo>(draftKey, 'closing.hadAppeal', null);
  const [appealDecided, setAppealDecided] = useQaField<YesNo>(draftKey, 'closing.appealDecided', null);
  const [appealResult, setAppealResult] = useQaField<AppealResult | null>(draftKey, 'closing.appealResult', null);
  const [appellant, setAppellant] = useQaField<Appellant | null>(draftKey, 'closing.appellant', null);
  const [deadlineOpen, setDeadlineOpen] = useQaField<YesNo>(draftKey, 'closing.deadlineOpen', null);
  const [deadlineDate, setDeadlineDate] = useQaField(draftKey, 'closing.deadlineDate', '');
  const [transitConfirmed, setTransitConfirmed] = useQaField<YesNo>(draftKey, 'closing.transitConfirmed', null);
  const [transitDate, setTransitDate] = useQaField(draftKey, 'closing.transitDate', '');
  const [costsPaid, setCostsPaid] = useQaField<YesNo>(draftKey, 'closing.costsPaid', null);
  const [executionRequested, setExecutionRequested] = useQaField<YesNo>(draftKey, 'closing.executionRequested', null);
  const [fullPayment, setFullPayment] = useQaField<YesNo>(draftKey, 'closing.fullPayment', null);
  const [localError, setLocalError] = useState<string | null>(null);

  const clearAfterTransit = () => {
    setCostsPaid(null); setExecutionRequested(null); setFullPayment(null);
    setLocalError(null);
  };
  const clearTransit = () => {
    setTransitConfirmed(null); setTransitDate(''); clearAfterTransit();
  };
  const clearAppeal = () => {
    setAppealDecided(null); setAppealResult(null); setAppellant(null);
    setDeadlineOpen(null); setDeadlineDate(''); clearTransit();
  };
  // O workspace remonta o fluxo por processo; o rascunho é restaurado em useQaField.

  const appealPending = hadAppeal === 'sim' && appealDecided === 'nao';
  const appealJudged = hadAppeal === 'sim'
    && appellant !== null && appealDecided === 'sim' && appealResult !== null;
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
    } else if (sentence === 'improcedente' || sentence === 'extincao') {
      finalMerit = appealResult === 'mantida_improcedencia' ? 'vitoria'
        : appealResult === 'convertida_procedencia' ? 'derrota' : 'indeterminado';
    } else if (appealResult === 'improvido') {
      finalMerit = asFinalResult(sentence);
    } else if (sentence === 'parcialmente_procedente' && appellant === 'banco') {
      finalMerit = 'indeterminado';
    } else {
      finalMerit = appellant === 'banco' ? 'vitoria' : 'derrota';
    }
  }

  let outcome: string | null = null;
  if (appealPending) {
    outcome = 'inapto_recurso_pendente';
  } else if (appealJudged && appealResult === 'sentenca_desconstituida') {
    outcome = 'inapto_sentenca_desconstituida';
  } else if (hadAppeal === 'nao' && deadlineOpen === 'sim') {
    if (deadlineAge !== null && deadlineAge <= 0) outcome = 'inapto_prazo_recursal';
  } else if (finalMerit === 'indeterminado') {
    outcome = 'inapto_resultado_indeterminado';
  } else if (finalMerit) {
    if (transitConfirmed === 'nao') outcome = 'inapto_sem_transito';
    else if (transitConfirmed === 'sim') {
      if (finalMerit === 'vitoria') outcome = 'apto_vitoria';
      else if (costsPaid === 'nao') outcome = 'apto_pending_custas';
      else if (costsPaid === 'sim') {
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
  let questionNumber = 0;
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!outcome || !sentence || hadAppeal === null) {
      setLocalError('Conclua todas as perguntas apresentadas antes de salvar.');
      return;
    }
    setLocalError(null);
    await onSubmit({
      workflow_version: 3,
      first_instance_merit: sentence,
      had_appeal: hadAppeal === 'sim',
      appeal_decided: hadAppeal === 'sim' ? appealDecided === 'sim' : null,
      appeal_result: hadAppeal === 'sim' && appealDecided === 'sim' ? appealResult : null,
      appellant: hadAppeal === 'sim' ? appellant : null,
      appeal_deadline_open: hadAppeal === 'nao' ? deadlineOpen === 'sim' : null,
      appeal_deadline_date: hadAppeal === 'nao' && deadlineOpen === 'sim' ? deadlineDate : null,
      transit_confirmed: canAnswerTransit ? transitConfirmed === 'sim' : null,
      transit_date: finalMerit === 'derrota' && transitConfirmed === 'sim'
        && costsPaid === 'sim' && executionRequested === 'nao' ? transitDate || null : null,
      final_costs_paid: finalMerit === 'derrota' && transitConfirmed === 'sim'
        ? costsPaid === 'sim' : null,
      execution_requested: finalMerit === 'derrota' && transitConfirmed === 'sim' && costsPaid === 'sim'
        ? executionRequested === 'sim' : null,
      full_payment: finalMerit === 'derrota' && transitConfirmed === 'sim'
        && costsPaid === 'sim' && executionRequested === 'sim' ? fullPayment === 'sim' : null,
      classifier_classification: classifierClassification || null,
    });
  };

  return <TaskForm className="closing-flow" progressive draftKey={draftKey} onSubmit={submit}>
    <section className="qa-context-note" role="note">
      <strong>{contextHint || (classifierClassification ? 'Identificamos um indício de ' + classifierClassification.toLowerCase() + '.' : 'Ainda não identificamos o tipo da sentença.')}</strong>
      <small>Confira o processo antes de responder. O indício não substitui a validação do analista.</small>
    </section>
    {outcome ? <section className={'closing-outcome closing-summary ' +
      (outcome.startsWith('apto_') ? 'positive' : 'negative')} aria-live="polite">
      <span>Classificação final prevista</span>
      <strong>{OUTCOME_LABELS[outcome]}</strong>
      {reopenAt ? <small>Reanálise em {formatDate(reopenAt)}.</small> : null}
    </section> : null}

    <TaskQuestion number={String(++questionNumber)} question="Qual foi o resultado da sentença?">
      <OptionGroup name="closing-sentence" value={sentence} disabled={busy}
        options={SENTENCES} onChange={value => {
          setSentence(value as TrialResult); setHadAppeal(null); clearAppeal();
        }} />
    </TaskQuestion>

    {sentence ? <TaskQuestion number={String(++questionNumber)} question="Houve interposição de apelação?">
      <BinaryChoice name="closing-appeal" value={hadAppeal} disabled={busy} onChange={value => {
        setHadAppeal(value); clearAppeal();
      }} />
    </TaskQuestion> : null}

    {hadAppeal === 'sim' ? <TaskQuestion number={String(++questionNumber)} question="Quem interpôs a apelação?">
      <OptionGroup name="closing-appellant" value={appellant} disabled={busy}
        options={[{ value: 'banco', label: 'Banco' }, { value: 'autora', label: 'Parte autora' }]}
        onChange={value => {
          setAppellant(value as Appellant); setAppealDecided(null); setAppealResult(null); clearTransit();
        }} />
    </TaskQuestion> : null}

    {hadAppeal === 'sim' && appellant !== null ? <TaskQuestion number={String(++questionNumber)} question="O colegiado já julgou a apelação?">
      <BinaryChoice name="closing-appeal-decided" value={appealDecided} disabled={busy} onChange={value => {
        setAppealDecided(value); setAppealResult(null); clearTransit();
      }} />
    </TaskQuestion> : null}

    {hadAppeal === 'sim' && appellant !== null && appealDecided === 'sim' ? <TaskQuestion number={String(++questionNumber)} question="Qual foi o resultado da apelação?">
      <OptionGroup name="closing-appeal-result" value={appealResult} disabled={busy}
        options={sentence === 'improcedente' || sentence === 'extincao'
          ? [{ value: 'mantida_improcedencia', label: 'Mantida a improcedência' },
             { value: 'convertida_procedencia', label: 'Convertido em procedência' },
             { value: 'sentenca_desconstituida', label: 'Sentença desconstituída' }]
          : [{ value: 'provido', label: 'Provido' }, { value: 'improvido', label: 'Improvido' },
             { value: 'sentenca_desconstituida', label: 'Sentença desconstituída' }]}
        onChange={value => { setAppealResult(value as AppealResult); clearTransit(); }} />
    </TaskQuestion> : null}

    {hadAppeal === 'nao' ? <TaskQuestion number={String(++questionNumber)} question="Há prazo para recorrer?">
      <BinaryChoice name="closing-deadline-open" value={deadlineOpen} disabled={busy}
        onChange={value => {
          setDeadlineOpen(value); setDeadlineDate(''); clearTransit();
        }} />
    </TaskQuestion> : null}

    {hadAppeal === 'nao' && deadlineOpen === 'sim' ? <TaskQuestion number={String(++questionNumber)} question="Qual é a data final do prazo recursal?">
      <DateAnswer name="closing-deadline-date" label="Data final do prazo" value={deadlineDate}
        disabled={busy} onChange={value => { setDeadlineDate(value); setLocalError(null); }} />
      {deadlineAge !== null && deadlineAge > 0 ? <p className="closing-inline-note">
        A data informada já passou. Confira se o prazo recursal continua aberto.
      </p> : null}
    </TaskQuestion> : null}

    {canAnswerTransit ? <TaskQuestion number={String(++questionNumber)} question="Esse processo já transitou em julgado?">
      <BinaryChoice name="closing-transit-confirmed" value={transitConfirmed} disabled={busy}
        onChange={value => { setTransitConfirmed(value); setTransitDate(''); clearAfterTransit(); }} />
    </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitConfirmed === 'sim' ?
      <TaskQuestion number={String(++questionNumber)} question="Houve o pagamento das custas finais?">
        <BinaryChoice name="closing-costs" value={costsPaid} disabled={busy} onChange={value => {
          setCostsPaid(value); setExecutionRequested(null); setFullPayment(null);
          setTransitDate(''); setLocalError(null);
        }} />
      </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitConfirmed === 'sim' && costsPaid === 'sim' ?
      <TaskQuestion number={String(++questionNumber)} question="Houve pedido de execução?">
        <BinaryChoice name="closing-execution" value={executionRequested} disabled={busy} onChange={value => {
          setExecutionRequested(value); setFullPayment(null); setTransitDate(''); setLocalError(null);
        }} />
      </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitConfirmed === 'sim' &&
      costsPaid === 'sim' && executionRequested === 'nao' ?
      <TaskQuestion number={String(++questionNumber)} question="Qual foi a data do trânsito em julgado?">
        <DateAnswer name="closing-transit-date" label="Data do trânsito em julgado"
          value={transitDate} disabled={busy} onChange={value => {
            setTransitDate(value); setLocalError(null);
          }} />
        {outcome === 'inapto_aguardando_transito_60d' ? <p className="closing-inline-note">
          Derrota Voluntária exige 60 dias após o trânsito.
          Reanálise em {formatDate(reopenAt)}.
        </p> : null}
      </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitConfirmed === 'sim' && costsPaid === 'sim' && executionRequested === 'sim' ?
      <TaskQuestion number={String(++questionNumber)} question="Houve pagamento do valor integral solicitado pela autora?">
        <BinaryChoice name="closing-payment" value={fullPayment} disabled={busy} onChange={value => {
          setFullPayment(value); setLocalError(null);
        }} />
      </TaskQuestion> : null}

    {localError || error ? <p className="task-renderer-error" role="alert">{localError || error}</p> : null}
    <TaskActionBar busy={busy} ready={Boolean(outcome)} onSkip={() => void onSkip()}
      skipLabel="Pular esse processo" />
  </TaskForm>;
}
