import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import type { Task, TaskProcess } from './model';
import { DefenseAnalysisFlow, type DefenseAnalysisDraft } from './DefenseAnalysisFlow';
import { ClosingAnalysisFlow, type ClosingAnalysisDraft, type ClosingPrefill } from './ClosingAnalysisFlow';
import type { ApiRequest } from './renderersLegacy';
import { clearQaDraft } from './qaDraft';

export { AgreementRenderer, LiminarRenderer, OptionGroup, PaymentRenderer, UnsupportedRenderer } from './renderersLegacy';
export type { ApiRequest } from './renderersLegacy';

type BaseRendererProps = {
  api: ApiRequest;
  task: Task;
  process: TaskProcess;
  draftKey?: string;
  onCompleted: (process: TaskProcess) => void;
  onSkipped: (process: TaskProcess) => void;
};

function defenseControlDeadline(task: Task, process: TaskProcess) {
  const metadata = process.source_metadata || {};
  return String(metadata.fatal_deadline || task.deadline_at || '').slice(0, 10) || null;
}

export function DefenseRenderer({ api, task, process, draftKey = '', onCompleted, onSkipped }: BaseRendererProps) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const controlDeadline = defenseControlDeadline(task, process);
  const onPhaseEntered = useCallback((index: number, stage: string) => {
    if (document.hidden || !document.getElementById('tarefas')?.classList.contains('active')) return;
    void api(`/api/task-processes/${process.id}/analysis-activity`, {
      method: 'POST', body: JSON.stringify({ index, stage }),
    }).catch(() => { /* A telemetria não pode bloquear a execução humana. */ });
  }, [api, process.id]);

  const submit = async (draft: DefenseAnalysisDraft) => {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/task-processes/${process.id}/defesa-analysis`, {
        method: 'POST',
        body: JSON.stringify({
          workflow_version: 5,
          reason: draft.reason,
          court_fatal_deadline: draft.deadline_correct ? null : draft.fatal_deadline,
          criteria: draft.criteria,
          controladoria_deadline_correct: draft.deadline_correct,
          has_defense_order: draft.has_defense_order,
          has_valid_court_deadline: draft.has_valid_court_deadline,
          analysis_origin: 'TASK',
        }),
      });
      clearQaDraft(draftKey);
      onCompleted(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar a análise de defesa.');
    } finally {
      setBusy(false);
    }
  };

  const skip = async () => {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/task-processes/${process.id}/skip`, { method: 'POST', body: '{}' });
      clearQaDraft(draftKey);
      onSkipped(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível pular o processo.');
    } finally {
      setBusy(false);
    }
  };

  return <DefenseAnalysisFlow
    cnj={process.case_number || 'Processo sem número'}
    draftKey={draftKey}
    controlDeadline={controlDeadline}
    busy={busy}
    error={error}
    onSubmit={submit}
    onSkip={skip}
    onPhaseEntered={onPhaseEntered}
  />;
}

function closingClassifierClassification(process: TaskProcess) {
  const metadata = process.source_metadata && typeof process.source_metadata === 'object' ? process.source_metadata : {};
  const raw = process.indicio
    || process.indication
    || process.indication_label
    || metadata.classifier_classification
    || metadata.classification
    || metadata.classificacao
    || metadata.resultado;
  const normalized = String(raw || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
  if (normalized.includes('derrota voluntaria')) return 'Derrota voluntária';
  if (normalized.includes('vitoria')) return 'Vitória';
  if (normalized.includes('derrota')) return 'Derrota';
  return null;
}


function closingSentenceHint(process: TaskProcess): string | undefined {
  const metadata = process.source_metadata && typeof process.source_metadata === 'object' ? process.source_metadata : {};
  const raw = String(metadata.first_instance_merit || metadata.resultado_sentenca || metadata.sentenca_resultado || '').trim().toLowerCase();
  const recognized: Record<string, string> = {
    procedente: 'procedente',
    parcialmente_procedente: 'parcialmente procedente',
    improcedente: 'improcedente',
    extincao: 'extinta',
  };
  const label = recognized[raw];
  return label ? 'Identificamos que esse processo tem sentença ' + label + '.' : undefined;
}

export function ClosingRenderer({ api, task, process, draftKey = '', onCompleted, onSkipped, onDeferred }: BaseRendererProps & { onDeferred: (process: TaskProcess, reopenAt: string) => void }) {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const classifierClassification = closingClassifierClassification(process);
  const [closingPrefill, setClosingPrefill] = useState<{ processId: string; values: ClosingPrefill } | null>(null);
  useEffect(() => {
    let active = true;
    void api('/api/task-processes/' + process.id + '/encerramento-prefill')
      .then((values: ClosingPrefill) => {
        if (active && values && typeof values === 'object') {
          setClosingPrefill({ processId: process.id, values });
        }
      })
      .catch(() => { /* Sem evidência, o formulário permanece normal. */ });
    return () => { active = false; };
  }, [api, process.id]);
  const onPhaseEntered = useCallback((index: number, stage: string) => {
    if (document.hidden || !document.getElementById('tarefas')?.classList.contains('active')) return;
    void api(`/api/task-processes/${process.id}/analysis-activity`, {
      method: 'POST', body: JSON.stringify({ index, stage }),
    }).catch(() => { /* A telemetria não pode bloquear a execução humana. */ });
  }, [api, process.id]);

  const submit = async (draft: ClosingAnalysisDraft) => {
    setBusy(true);
    setError(null);
    try {
      const saved = await api(`/api/task-processes/${process.id}/encerramento-analysis`, {
        method: 'POST',
        body: JSON.stringify(draft),
      });
      clearQaDraft(draftKey);
      window.dispatchEvent(new CustomEvent('mba:closing-analysis-saved'));
      if (saved?.reopen_at) onDeferred(process, String(saved.reopen_at));
      else onCompleted(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar a análise de encerramento.');
    } finally {
      setBusy(false);
    }
  };

  const skip = async () => {
    setBusy(true);
    setError(null);
    try {
      await api(`/api/task-processes/${process.id}/skip`, { method: 'POST', body: '{}' });
      clearQaDraft(draftKey);
      onSkipped(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível pular o processo.');
    } finally {
      setBusy(false);
    }
  };

  return <ClosingAnalysisFlow
    cnj={process.case_number || 'Processo sem número'}
    draftKey={draftKey}
    classifierClassification={classifierClassification}
    prefill={closingPrefill?.processId === process.id ? closingPrefill.values : undefined}
    contextHint={closingSentenceHint(process)}
    busy={busy}
    error={error}
    onSubmit={submit}
    onSkip={skip}
    onPhaseEntered={onPhaseEntered}
  />;
}


/**
 * O analista redige o motivo e solicita o lançamento no Benner.
 * A tarefa só é concluída quando o worker confirmar o andamento gravado.
 */
type MotivoQueueStatus = 'NA_FILA' | 'PROCESSANDO' | 'ERRO' | 'ENVIADO';
type MotivoQueueJob = { id: string; status: MotivoQueueStatus; motivo?: string | null; erro?: string | null; benner_referencia?: string | null; };

export function MotivoDerrotaRenderer({ api, process, onCompleted }: BaseRendererProps) {
  const [motivo, setMotivo] = useState('');
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [job, setJob] = useState<MotivoQueueJob | null>(null);
  const [error, setError] = useState('');
  const completedRef = useRef('');
  const requestPath = '/api/task-processes/' + process.id;
  const waiting = job?.status === 'NA_FILA' || job?.status === 'PROCESSANDO';
  useEffect(() => {
    let active = true;
    completedRef.current = '';
    setMotivo(''); setJob(null); setError(''); setChecking(true);
    const refresh = async () => {
      try {
        const result = await api('/api/task-processes/' + process.id + '/motivo-derrota-status');
        if (!active) return;
        const nextJob: MotivoQueueJob | null = result?.job || null;
        setJob(nextJob);
        if (nextJob?.motivo) setMotivo(nextJob.motivo);
        if (nextJob?.status === 'ENVIADO' && completedRef.current !== process.id) {
          completedRef.current = process.id;
          window.dispatchEvent(new CustomEvent('mba:realtime-invalidate', { detail: { module: 'encerramentos' } }));
          onCompleted(process);
        }
      } catch (cause: any) {
        if (active) setError(cause?.message || 'Não foi possível consultar a fila do Benner.');
      } finally {
        if (active) setChecking(false);
      }
    };
    void refresh();
    const interval = window.setInterval(() => { void refresh(); }, 7000);
    return () => { active = false; window.clearInterval(interval); };
  }, [api, process.id]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = motivo.trim();
    if (busy || checking || job || value.length < 10 || value.length > 2000) return;
    setBusy(true); setError('');
    try {
      const saved = await api(requestPath + '/motivo-derrota-submit', {
        method: 'POST', body: JSON.stringify({ motivo: value }),
      });
      if (!saved?.job_id) throw new Error('A fila Benner não retornou o identificador do envio.');
      setJob({ id: String(saved.job_id), status: (saved.status || 'NA_FILA') as MotivoQueueStatus });
    } catch (cause: any) {
      setError(cause?.message || 'Falha ao registrar o motivo para envio ao Benner.');
    } finally {
      setBusy(false);
    }
  }

  const currentStatus = job?.status === 'NA_FILA' ? 'Aguardando worker Benner'
    : job?.status === 'PROCESSANDO' ? 'Cadastrando no Benner'
    : job?.status === 'ERRO' ? 'Envio requer revisão'
    : job?.status === 'ENVIADO' ? 'Confirmado no Benner' : '';
  return <form className="task-form-content motivo-derrota-form" onSubmit={submit}>
    <div className="motivo-derrota-heading">
      <span className="motivo-derrota-eyebrow">Cadastro no Benner</span>
      <h3>Motivo da derrota</h3>
      <p>Registre o motivo conforme a análise processual. A tarefa só será concluída após confirmação do andamento pelo worker.</p>
    </div>
    <section className="motivo-derrota-card" aria-label="Dados do andamento">
      <div className="motivo-derrota-card-heading">
        <span className="motivo-derrota-step" aria-hidden="true">01</span>
        <div><strong>Dados do andamento</strong><p>O envio será feito ao Benner para conferência e registro.</p></div>
      </div>
      <label htmlFor={'motivo-derrota-texto-' + process.id}>Motivo da derrota
        <textarea id={'motivo-derrota-texto-' + process.id} required minLength={10} maxLength={2000}
          rows={4} value={motivo} disabled={busy || checking || Boolean(job)}
          placeholder="Descreva objetivamente o motivo da derrota conforme a análise do processo."
          onChange={event => setMotivo(event.target.value)} />
      </label>
      {!job ? <p className="motivo-derrota-helper">{motivo.trim().length}/2000 caracteres · Registro sujeito à conferência no Benner.</p> : null}
    </section>
    {job ? <div className="motivo-derrota-queue" role="status">
      <strong>{currentStatus}</strong>
      <span>{waiting ? 'O envio está na fila. Você pode continuar acompanhando sem reenviar.'
        : job.status === 'ERRO' ? 'O andamento não foi confirmado. Não reenvie sem verificar o histórico do Benner.'
        : 'O andamento foi confirmado; esta tarefa será retirada da fila.'}</span>
      {job.status === 'ERRO' && job.erro ? <span>{job.erro}</span> : null}
    </div> : null}
    {error ? <p className="task-renderer-error" role="alert">{error}</p> : null}
    <footer className="motivo-derrota-actions">
      <span className="motivo-derrota-action-note">O cadastro é confirmado no Benner antes de concluir a tarefa.</span>
      {!job && !checking ? <button type="submit" className="primary-button"
        disabled={busy || motivo.trim().length < 10 || motivo.trim().length > 2000}>
        {busy ? 'Enviando à fila…' : 'Cadastrar no Benner'}
      </button> : null}
      {checking ? <p role="status">Consultando solicitações existentes…</p> : null}
    </footer>
  </form>;
}
