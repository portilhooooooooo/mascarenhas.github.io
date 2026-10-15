import { type FormEvent, useCallback, useEffect, useState } from 'react';
import type { Task, TaskProcess } from './model';
import { TaskActionBar, TaskForm, TaskQuestion, OptionGroup } from './TaskQuestion';
import { clearQaDraft, useQaField } from './qaDraft';

type ApiRequest = (path: string, options?: RequestInit) => Promise<any>;
type Answers = { requested: string | null; decided: string | null; result: string | null; judgment: string | null };
type Prefill = { decision: string | null; statement: string | null; answers: Answers | null };
const explanations: Record<string, string> = {
  nao_solicitada: 'não há pedido de tutela de urgência identificado. Não existe VDLIM referente ao pedido a acompanhar.',
  deferida: 'houve pedido de tutela deferido. O VDLIM deve acompanhar o cumprimento da determinação judicial.',
  indeferida: 'houve pedido de tutela indeferido. Não há obrigação liminar deferida a cumprir, ressalvadas decisões posteriores.',
  com_sentenca: 'o pedido de tutela sem decisão liminar autônoma foi sucedido por sentença de mérito. A tutela provisória pode ter sido superada; a existência de obrigação definitiva depende do dispositivo da sentença. É necessária revisão do VDLIM no CPJ.',
  sem_decisao: 'houve pedido de tutela de urgência, sem decisão liminar e sem sentença de mérito. O processo será guardado para acompanhamento e nova consulta automática.',
};
const phases = ['Classificação inicial', 'Pedido de tutela', 'Decisão judicial', 'Resultado da análise', 'Classificação final'] as const;

export function LiminarRenderer({ api, task, process, draftKey = '', onCompleted, onSkipped }: {
  api: ApiRequest; task: Task; process: TaskProcess; draftKey?: string;
  onCompleted: (p: TaskProcess) => void; onSkipped: (p: TaskProcess) => void;
}) {
  const [requested, setRequested] = useQaField<string | null>(draftKey, 'liminar.requested', null);
  const [decided, setDecided] = useQaField<string | null>(draftKey, 'liminar.decided', null);
  const [result, setResult] = useQaField<string | null>(draftKey, 'liminar.result', null);
  const [judgment, setJudgment] = useQaField<string | null>(draftKey, 'liminar.judgment', null);
  const [agreement, setAgreement] = useQaField<string | null>(draftKey, 'liminar.initialAgreement', null);
  const [prefill, setPrefill] = useState<Prefill | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const onPhaseEntered = useCallback((index: number, stage: string) => {
    if (document.hidden || !document.getElementById('tarefas')?.classList.contains('active')) return;
    void api(`/api/task-processes/${process.id}/analysis-activity`, {
      method: 'POST', body: JSON.stringify({ index, stage }),
    }).catch(() => { /* Telemetria não deve bloquear a análise. */ });
  }, [api, process.id]);

  const loadPrefill = useCallback(async (active: () => boolean) => {
    setLoading(true);
    setLoadError(false);
    try {
      const data = await api(`/api/task-processes/${process.id}/liminar-prefill`);
      if (!active()) return;
      setPrefill(data && typeof data === 'object' ? data as Prefill : null);
    } catch {
      if (active()) {
        setPrefill(null);
        setLoadError(true);
      }
    } finally {
      if (active()) setLoading(false);
    }
  }, [api, process.id]);
  useEffect(() => {
    let active = true;
    void loadPrefill(() => active);
    return () => { active = false; };
  }, [loadPrefill]);

  const hasInitial = Boolean(prefill?.decision && prefill?.statement);
  const confirmation = hasInitial && agreement === 'sim';
  const manual = !hasInitial || agreement === 'nao';
  const decision = confirmation ? prefill?.decision : manual
    ? (requested === 'nao' ? 'nao_solicitada'
      : requested === 'sim' && decided === 'sim' ? result
      : requested === 'sim' && decided === 'nao' && judgment
        ? judgment === 'sim' ? 'com_sentenca' : 'sem_decisao' : null)
    : null;
  const finalDecision = decision && Object.prototype.hasOwnProperty.call(explanations, decision) ? decision : null;

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!finalDecision || loading) { setError('Conclua as respostas antes de salvar.'); return; }
    setBusy(true); setError(null);
    try {
      const answers: Answers | undefined = confirmation ? undefined : {
        requested, decided, result, judgment,
      };
      const response = await api(`/api/task-processes/${process.id}/liminar-validation`, {
        method: 'POST',
        body: JSON.stringify({ agree: confirmation, answers }),
      });
      if (response?.monitoring === 'dispatch_failed') {
        throw new Error('A consulta automática não iniciou. Mantenha este prazo pendente.');
      }
      clearQaDraft(draftKey);
      onCompleted(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar a análise.');
    } finally { setBusy(false); }
  };
  const skip = async () => {
    setBusy(true); setError(null);
    try {
      await api(`/api/task-processes/${process.id}/skip`, { method: 'POST', body: '{}' });
      clearQaDraft(draftKey);
      onSkipped(process);
    } catch (cause: any) { setError(cause?.message || 'Não foi possível pular o processo.'); }
    finally { setBusy(false); }
  };

  if (loading) {
    return <section className="task-renderer-form"><p className="tasks-renderer-state">Consultando classificação inicial…</p></section>;
  }
  return <TaskForm className="task-renderer-form" progressive stages={phases} dynamicStages draftKey={draftKey}
    onPhaseEntered={onPhaseEntered} onSubmit={submit}>
    {hasInitial ? <TaskQuestion number="01" stage="Classificação inicial" question="Você concorda com esta afirmação?">
      <p>{prefill?.statement}</p>
      <OptionGroup name="liminar-confirmacao" value={agreement} disabled={busy}
        onChange={value => setAgreement(value)}
        options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
    </TaskQuestion> : null}
    {manual ? <TaskQuestion number="01" stage="Pedido de tutela" question="Há pedido de tutela antecipada na inicial desse processo?">
      <OptionGroup name="liminar-requested" value={requested} disabled={busy}
        onChange={value => { setRequested(value); setDecided(null); setResult(null); setJudgment(null); }}
        options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
    </TaskQuestion> : null}
    {manual && requested === 'sim' ? <TaskQuestion number="02" stage="Decisão judicial" question="A tutela de urgência já foi decidida pelo juiz?">
      <OptionGroup name="liminar-decided" value={decided} disabled={busy}
        onChange={value => { setDecided(value); setResult(null); setJudgment(null); }}
        options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
    </TaskQuestion> : null}
    {manual && requested === 'sim' && decided === 'sim' ? <TaskQuestion number="03" stage="Resultado da análise" question="Qual foi a decisão do juiz sobre a tutela de urgência?">
      <OptionGroup name="liminar-result" value={result} disabled={busy} onChange={setResult}
        options={[{ value: 'deferida', label: 'Deferida' }, { value: 'indeferida', label: 'Indeferida' }]} />
    </TaskQuestion> : null}
    {manual && requested === 'sim' && decided === 'nao' ? <TaskQuestion number="03" stage="Resultado da análise" question="Esse processo teve sentença?">
      <OptionGroup name="liminar-judgment" value={judgment} disabled={busy} onChange={setJudgment}
        options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
    </TaskQuestion> : null}
    {finalDecision ? <TaskQuestion number="04" stage="Classificação final" question="Classificação final">
      <div data-qa-answered="true">
        <p><strong>Com base nas suas respostas, entendemos que</strong> {explanations[finalDecision]}</p>
        {finalDecision === 'sem_decisao' ? <p>O prazo será mantido em acompanhamento, sem encerrar o VDLIM.</p> : null}
      </div>
    </TaskQuestion> : null}
    {loadError ? <p className="task-renderer-error" role="alert">
      Não foi possível consultar a classificação automática. As respostas manuais continuam disponíveis.
      <button className="secondary-button" type="button" disabled={busy} onClick={() => void loadPrefill(() => true)}>Tentar consulta novamente</button>
    </p> : null}
    {error ? <p className="task-renderer-error" role="alert">{error}</p> : null}
    <TaskActionBar busy={busy} onSkip={skip} ready={Boolean(finalDecision)} />
  </TaskForm>;
}
