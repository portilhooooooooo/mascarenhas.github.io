import { type FormEvent, useEffect, useMemo, useState } from 'react';
import './closingAnalysisFlow.css';
import { OptionGroup, TaskActionBar, TaskForm, TaskQuestion } from './TaskQuestion';

type YesNo = 'sim' | 'nao' | null;
export type ClosingMerit = 'vitoria' | 'derrota';

export type ClosingAnalysisDraft = {
  workflow_version: 1;
  first_instance_merit: ClosingMerit;
  had_appeal: boolean;
  appeal_decided: boolean | null;
  appeal_favorable_bank: boolean | null;
  transit_date: string | null;
  no_transit: boolean;
  final_costs_paid: boolean | null;
  execution_requested: boolean | null;
  full_payment: boolean | null;
  classifier_classification: string | null;
};

type Props = {
  cnj: string;
  classifierClassification?: string | null;
  busy?: boolean;
  error?: string | null;
  onSubmit: (draft: ClosingAnalysisDraft) => Promise<void> | void;
  onSkip: () => Promise<void> | void;
};

const DAY_MS = 24 * 60 * 60 * 1000;

function BinaryChoice({ value, onChange, disabled, name }: { value: YesNo; onChange: (value: Exclude<YesNo, null>) => void; disabled?: boolean; name: string }) {
  return <OptionGroup name={name} value={value} onChange={next => onChange(next as Exclude<YesNo, null>)} disabled={disabled} options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />;
}

function dateUtc(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  const time = Date.UTC(year, month - 1, day);
  const parsed = new Date(time);
  if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
  return time;
}

function localTodayUtc() {
  const now = new Date();
  return Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
}

function daysSince(value: string) {
  const time = dateUtc(value);
  return time === null ? null : Math.floor((localTodayUtc() - time) / DAY_MS);
}

function addDays(value: string, days: number) {
  const time = dateUtc(value);
  if (time === null) return null;
  return new Date(time + days * DAY_MS).toISOString().slice(0, 10);
}

function formatDate(value?: string | null) {
  if (!value) return '—';
  const [year, month, day] = value.split('-');
  return year && month && day ? `${day}/${month}/${year}` : value;
}

const OUTCOME_LABELS: Record<string, string> = {
  apto_vitoria: 'Apto ao encerramento — Vitória',
  apto_derrota_voluntaria: 'Apto ao encerramento — Derrota voluntária',
  apto_derrota: 'Apto ao encerramento — Derrota',
  apto_pending_custas: 'Apto, pendente de custas finais',
  inapto_recurso_pendente: 'Inapto — recurso pendente',
  inapto_prazo_recursal: 'Inapto — ainda sem trânsito em julgado',
  inapto_aguardando_transito_60d: 'Inapto temporariamente — aguardando 60 dias do trânsito',
  inapto_execucao_pendente: 'Inapto — execução sem pagamento integral',
};

export function ClosingAnalysisFlow({ cnj, classifierClassification, busy = false, error = null, onSubmit, onSkip }: Props) {
  const [firstMerit, setFirstMerit] = useState<ClosingMerit | null>(null);
  const [hadAppeal, setHadAppeal] = useState<YesNo>(null);
  const [appealDecided, setAppealDecided] = useState<YesNo>(null);
  const [appealFavorable, setAppealFavorable] = useState<YesNo>(null);
  const [transitDate, setTransitDate] = useState('');
  const [noTransit, setNoTransit] = useState(false);
  const [costsPaid, setCostsPaid] = useState<YesNo>(null);
  const [executionRequested, setExecutionRequested] = useState<YesNo>(null);
  const [fullPayment, setFullPayment] = useState<YesNo>(null);
  const [localError, setLocalError] = useState<string | null>(null);

  const resetAfterAppeal = () => {
    setAppealDecided(null); setAppealFavorable(null); setTransitDate(''); setNoTransit(false);
    setCostsPaid(null); setExecutionRequested(null); setFullPayment(null); setLocalError(null);
  };
  const resetAfterFinalMerit = () => {
    setTransitDate(''); setNoTransit(false); setCostsPaid(null); setExecutionRequested(null); setFullPayment(null); setLocalError(null);
  };
  const resetAfterTransit = () => {
    setCostsPaid(null); setExecutionRequested(null); setFullPayment(null); setLocalError(null);
  };

  useEffect(() => {
    setFirstMerit(null); setHadAppeal(null); setAppealDecided(null); setAppealFavorable(null);
    setTransitDate(''); setNoTransit(false); setCostsPaid(null); setExecutionRequested(null);
    setFullPayment(null); setLocalError(null);
  }, [cnj]);

  const finalMerit = useMemo<ClosingMerit | null>(() => {
    if (!firstMerit || hadAppeal === null) return null;
    if (hadAppeal === 'nao') return firstMerit;
    if (appealDecided !== 'sim' || appealFavorable === null) return null;
    return appealFavorable === 'sim' ? 'vitoria' : 'derrota';
  }, [firstMerit, hadAppeal, appealDecided, appealFavorable]);

  const transitAge = transitDate ? daysSince(transitDate) : null;
  const transitTooRecent = transitAge !== null && transitAge >= 0 && transitAge < 60;
  const transitMature = transitAge !== null && transitAge >= 60;
  const reopenAt = transitTooRecent ? addDays(transitDate, 60) : null;

  const outcome = useMemo(() => {
    if (hadAppeal === 'sim' && appealDecided === 'nao') return 'inapto_recurso_pendente';
    if (!finalMerit) return null;
    if (noTransit) return 'inapto_prazo_recursal';
    if (!transitDate || transitAge === null || transitAge < 0) return null;
    if (transitAge < 60) return 'inapto_aguardando_transito_60d';
    if (costsPaid === null) return null;
    if (costsPaid === 'nao') return 'apto_pending_custas';
    if (finalMerit === 'vitoria') return 'apto_vitoria';
    if (executionRequested === null) return null;
    if (executionRequested === 'nao') return 'apto_derrota_voluntaria';
    if (fullPayment === null) return null;
    return fullPayment === 'sim' ? 'apto_derrota' : 'inapto_execucao_pendente';
  }, [hadAppeal, appealDecided, finalMerit, noTransit, transitDate, transitAge, costsPaid, executionRequested, fullPayment]);

  const guidance = classifierClassification
    ? `Identificamos que esse processo está apto ao encerramento por ${classifierClassification}.`
    : 'Identificamos este processo para validação de encerramento.';

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!firstMerit) return setLocalError('Informe o mérito do processo em 1ª instância.');
    if (hadAppeal === null) return setLocalError('Informe se houve pedido de apelação.');
    if (hadAppeal === 'sim' && appealDecided === null) return setLocalError('Informe se o colegiado já decidiu a apelação.');
    if (hadAppeal === 'sim' && appealDecided === 'sim' && appealFavorable === null) return setLocalError('Informe se a decisão colegiada foi favorável ao banco.');

    if (!(hadAppeal === 'sim' && appealDecided === 'nao')) {
      if (!finalMerit) return setLocalError('Não foi possível determinar o mérito final.');
      if (!transitDate && !noTransit) return setLocalError('Informe a data do trânsito em julgado ou marque que ele ainda não ocorreu.');
      if (transitDate && (transitAge === null || transitAge < 0)) return setLocalError('A data do trânsito em julgado é inválida ou está no futuro.');
      if (transitMature && costsPaid === null) return setLocalError('Informe se houve pagamento das custas finais.');
      if (transitMature && costsPaid === 'sim' && finalMerit === 'derrota' && executionRequested === null) return setLocalError('Informe se houve pedido de execução.');
      if (transitMature && costsPaid === 'sim' && finalMerit === 'derrota' && executionRequested === 'sim' && fullPayment === null) return setLocalError('Informe se houve pagamento integral do valor solicitado pela autora.');
    }

    setLocalError(null);
    await onSubmit({
      workflow_version: 1,
      first_instance_merit: firstMerit,
      had_appeal: hadAppeal === 'sim',
      appeal_decided: hadAppeal === 'sim' ? appealDecided === 'sim' : null,
      appeal_favorable_bank: hadAppeal === 'sim' && appealDecided === 'sim' ? appealFavorable === 'sim' : null,
      transit_date: transitDate || null,
      no_transit: noTransit,
      final_costs_paid: transitMature ? costsPaid === 'sim' : null,
      execution_requested: transitMature && costsPaid === 'sim' && finalMerit === 'derrota' ? executionRequested === 'sim' : null,
      full_payment: transitMature && costsPaid === 'sim' && finalMerit === 'derrota' && executionRequested === 'sim' ? fullPayment === 'sim' : null,
      classifier_classification: classifierClassification || null,
    });
  };

  return <TaskForm className="closing-flow" onSubmit={submit}>
    <div className="closing-guidance"><span>Orientação do classificador</span><strong>{guidance}</strong><small>A resposta final será determinada pelas validações abaixo.</small></div>

    <TaskQuestion number="01" question="Qual foi o mérito desse processo em 1ª instância?">
      <OptionGroup name="closing-first-merit" value={firstMerit} disabled={busy} onChange={value => {
        setFirstMerit(value as ClosingMerit); setHadAppeal(null); resetAfterAppeal();
      }} options={[{ value: 'derrota', label: 'Derrota' }, { value: 'vitoria', label: 'Vitória' }]} />
    </TaskQuestion>

    {firstMerit ? <TaskQuestion number="02" question="Esse processo teve pedido de apelação?">
      <BinaryChoice name="closing-had-appeal" value={hadAppeal} disabled={busy} onChange={value => {
        setHadAppeal(value); resetAfterAppeal();
      }} />
    </TaskQuestion> : null}

    {hadAppeal === 'sim' ? <TaskQuestion number="03" question="O colegiado já decidiu sobre a apelação?">
      <BinaryChoice name="closing-appeal-decided" value={appealDecided} disabled={busy} onChange={value => {
        setAppealDecided(value); setAppealFavorable(null); resetAfterFinalMerit();
      }} />
    </TaskQuestion> : null}

    {hadAppeal === 'sim' && appealDecided === 'sim' ? <TaskQuestion number="03A" question="A decisão do colegiado foi favorável ao banco?">
      <BinaryChoice name="closing-appeal-favorable" value={appealFavorable} disabled={busy} onChange={value => {
        setAppealFavorable(value); resetAfterFinalMerit();
      }} />
    </TaskQuestion> : null}

    {finalMerit ? <TaskQuestion number="04" question="Quando foi expedida a certidão de trânsito em julgado?">
      <div className="closing-transit-grid">
        <label className="task-text-field"><span>Data da certidão</span><input type="date" value={transitDate} disabled={busy || noTransit} onChange={event => {
          setTransitDate(event.target.value); setNoTransit(false); resetAfterTransit();
        }} /></label>
        <button type="button" className={`closing-no-transit ${noTransit ? 'active' : ''}`} disabled={busy} aria-pressed={noTransit} onClick={() => {
          setNoTransit(current => !current); setTransitDate(''); resetAfterTransit();
        }}><strong>Ainda não houve trânsito em julgado</strong><small>Use quando o processo ainda estiver em prazo recursal.</small></button>
      </div>
      {transitTooRecent ? <p className="closing-inline-note">O trânsito possui {transitAge} dia(s). O processo será devolvido para análise em <strong>{formatDate(reopenAt)}</strong>, quando completar 60 dias.</p> : null}
    </TaskQuestion> : null}

    {finalMerit && transitMature ? <TaskQuestion number="05" question="Houve o pagamento das custas finais?">
      <BinaryChoice name="closing-costs-paid" value={costsPaid} disabled={busy} onChange={value => {
        setCostsPaid(value); setExecutionRequested(null); setFullPayment(null); setLocalError(null);
      }} />
    </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitMature && costsPaid === 'sim' ? <TaskQuestion number="06" question="Houve pedido de execução?">
      <BinaryChoice name="closing-execution-requested" value={executionRequested} disabled={busy} onChange={value => {
        setExecutionRequested(value); setFullPayment(null); setLocalError(null);
      }} />
    </TaskQuestion> : null}

    {finalMerit === 'derrota' && transitMature && costsPaid === 'sim' && executionRequested === 'sim' ? <TaskQuestion number="07" question="Houve pagamento do valor integral solicitado pela autora?">
      <BinaryChoice name="closing-full-payment" value={fullPayment} disabled={busy} onChange={value => { setFullPayment(value); setLocalError(null); }} />
    </TaskQuestion> : null}

    {outcome ? <section className={`closing-outcome ${outcome.startsWith('apto_') ? 'positive' : 'negative'}`} aria-live="polite"><span>Classificação final prevista</span><strong>{OUTCOME_LABELS[outcome]}</strong>{outcome === 'inapto_aguardando_transito_60d' && reopenAt ? <small>Reanálise automática em {formatDate(reopenAt)}.</small> : null}</section> : null}

    {localError || error ? <p className="task-renderer-error" role="alert">{localError || error}</p> : null}
    <TaskActionBar busy={busy} ready={Boolean(outcome)} onSkip={() => void onSkip()} skipLabel="Pular esse processo" />
  </TaskForm>;
}
