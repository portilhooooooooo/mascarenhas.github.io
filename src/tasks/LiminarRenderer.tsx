import { type FormEvent, useEffect, useState } from 'react';
import type { Task, TaskProcess } from './model';
import { TaskActionBar, TaskForm, TaskQuestion, OptionGroup } from './TaskQuestion';

type ApiRequest = (path: string, options?: RequestInit) => Promise<any>;
type Answers = { requested: string | null; decided: string | null; result: string | null; judgment: string | null };
type Prefill = { decision: string | null; statement: string | null; answers: Answers | null };
const blank: Answers = { requested: null, decided: null, result: null, judgment: null };
const conclusions: Record<string, string> = {
  nao_solicitada: 'não há pedido de tutela de urgência identificado. Não existe VDLIM referente ao pedido a acompanhar.',
  deferida: 'houve pedido de tutela deferido. O VDLIM deve acompanhar o cumprimento da determinação judicial.',
  indeferida: 'houve pedido de tutela indeferido. Não há obrigação liminar deferida a cumprir, ressalvadas decisões posteriores.',
  com_sentenca: 'o pedido de tutela sem decisão liminar autônoma foi sucedido por sentença de mérito. A tutela provisória pode ter sido superada; a existência de obrigação definitiva depende do dispositivo da sentença. É necessária revisão do VDLIM no CPJ.',
  sem_decisao: 'houve pedido de tutela de urgência, sem decisão liminar e sem sentença de mérito. O processo será guardado para acompanhamento e nova consulta automática.',
};
function classify(a: Answers) {
  if (a.requested === 'nao') return 'nao_solicitada';
  if (a.requested !== 'sim') return null;
  if (a.decided === 'sim') return a.result === 'deferida' || a.result === 'indeferida' ? a.result : null;
  if (a.decided !== 'nao') return null;
  return a.judgment === 'sim' ? 'com_sentenca' : a.judgment === 'nao' ? 'sem_decisao' : null;
}

export function LiminarRenderer({ api, task, process, onCompleted, onSkipped }: {
  api: ApiRequest; task: Task; process: TaskProcess; draftKey?: string;
  onCompleted: (p: TaskProcess) => void; onSkipped: (p: TaskProcess) => void;
}) {
  const [initial, setInitial] = useState<Prefill | null>(null);
  const [agree, setAgree] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answers>(blank);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    setInitial(null); setAgree(null); setAnswers(blank); setError(null); setBusy(false); setLoading(true);
    api(`/api/task-processes/${process.id}/liminar-prefill`)
      .then((data: Prefill) => { if (active) {
        setInitial(data);
        if (!data?.decision) setAgree('nao');
      } })
      .catch((e: any) => { if (active) {
        setError(e?.message || 'Não foi possível consultar a classificação inicial.');
        setAgree('nao');
      } })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [api, process.id]);

  const isConfirming = Boolean(initial?.decision) && agree === 'sim';
  const decision = isConfirming ? initial?.decision : agree === 'nao' ? classify(answers) : null;
  const showQuestions = agree === 'nao';
  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!decision || agree === null) { setError('Conclua as respostas antes de salvar.'); return; }
    setBusy(true); setError(null);
    try {
      await api(`/api/task-processes/${process.id}/liminar-validation`, {
        method: 'POST',
        body: JSON.stringify({ agree: agree === 'sim', answers: agree === 'nao' ? answers : undefined }),
      });
      onCompleted(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível validar a liminar.');
    } finally { setBusy(false); }
  };
  const skip = async () => {
    setBusy(true); setError(null);
    try {
      await api(`/api/task-processes/${process.id}/skip`, { method: 'POST', body: '{}' });
      onSkipped(process);
    } catch (cause: any) { setError(cause?.message || 'Não foi possível pular.'); }
    finally { setBusy(false); }
  };

  return <TaskForm className="task-renderer-form" onSubmit={submit}>
    {loading ? <p>Consultando indícios de tutela e sentença…</p> : null}
    {!loading && initial?.statement ? <>
      <TaskQuestion number="01" question="Classificação inicial">
        <p>{initial.statement}</p>
        <p><strong>Você concorda com essa afirmação?</strong></p>
        <OptionGroup name="liminar-confirmacao" value={agree} disabled={busy}
          onChange={v => { setAgree(v); setAnswers(blank); setError(null); }}
          options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
      </TaskQuestion>
    </> : !loading ? <p>Não há evidências suficientes para uma classificação inicial segura. Responda às perguntas para validar.</p> : null}
    {!loading && showQuestions ? <>
      <TaskQuestion number="02" question="Há pedido de tutela antecipada na inicial desse processo?">
        <OptionGroup name="liminar-requested" value={answers.requested} disabled={busy}
          onChange={v => setAnswers({ requested: v, decided: null, result: null, judgment: null })}
          options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
      </TaskQuestion>
      {answers.requested === 'sim' ? <TaskQuestion number="03" question="A tutela de urgência já foi decidida pelo juiz?">
        <OptionGroup name="liminar-decided" value={answers.decided} disabled={busy}
          onChange={v => setAnswers(a => ({ ...a, decided: v, result: null, judgment: null }))}
          options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
      </TaskQuestion> : null}
      {answers.requested === 'sim' && answers.decided === 'sim' ? <TaskQuestion number="04" question="Qual foi a decisão do juiz sobre a tutela de urgência?">
        <OptionGroup name="liminar-result" value={answers.result} disabled={busy}
          onChange={v => setAnswers(a => ({ ...a, result: v }))}
          options={[{ value: 'deferida', label: 'Deferida' }, { value: 'indeferida', label: 'Indeferida' }]} />
      </TaskQuestion> : null}
      {answers.requested === 'sim' && answers.decided === 'nao' ? <TaskQuestion number="04" question="Esse processo teve sentença?">
        <OptionGroup name="liminar-judgment" value={answers.judgment} disabled={busy}
          onChange={v => setAnswers(a => ({ ...a, judgment: v }))}
          options={[{ value: 'sim', label: 'Sim' }, { value: 'nao', label: 'Não' }]} />
      </TaskQuestion> : null}
    </> : null}

    {decision ? <section className="task-question">
      <h3><span className="task-question-number">05</span><span>Classificação final</span></h3>
      <div className="task-question-body">
        <p><strong>Com base nas suas respostas, entendemos que</strong> {conclusions[decision]}</p>
        {decision === 'sem_decisao' ? <p>Este processo ficará em acompanhamento e será enviado à automação de tutela.</p> : null}
      </div>
    </section> : null}
    {error ? <p className="task-renderer-error" role="alert">{error}</p> : null}
    <TaskActionBar busy={busy} ready={!loading && Boolean(decision)} onSkip={skip}
      skipLabel="Pular esse prazo" />
  </TaskForm>;
}
