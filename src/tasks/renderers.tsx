import { type FormEvent, useCallback, useEffect, useState } from 'react';
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
 * Dependência pós-encerramento: somente Derrota confirmada no Benner, nunca DV.
 * Responder "não" mantém o prazo aberto. Não presume ausência com base em dado nulo.
 */
export function MotivoDerrotaRenderer({ api, process, onCompleted }: BaseRendererProps) {
  const [cadastrado, setCadastrado] = useState<boolean | null>(null);
  const [observacao, setObservacao] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  useEffect(() => {
    setCadastrado(null); setObservacao(''); setError(''); setNotice('');
  }, [process.id]);
  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (cadastrado === null || busy) return;
    setBusy(true);
    setError(''); setNotice('');
    try {
      const saved = await api('/api/task-processes/' + process.id + '/motivo-derrota-answer', {
        method: 'POST', body: JSON.stringify({ cadastrado, observacao }),
      });
      if (saved?.completed) {
        window.dispatchEvent(new CustomEvent('mba:realtime-invalidate', { detail: { module: 'encerramentos' } }));
        onCompleted(process);
      } else {
        setNotice('Motivo ainda não cadastrado. A tarefa permanece pendente.');
      }
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar a verificação.');
    } finally {
      setBusy(false);
    }
  }
  return <form className="task-form-content motivo-derrota-form" onSubmit={submit}>
    <h3>Cadastro de Motivo Derrota</h3>
    <p>O envio do encerramento foi confirmado no Benner, e a consulta posterior identificou ausência do motivo. Regularize o cadastro e confirme abaixo.</p>
    <fieldset className="motivo-derrota-choice">
      <legend>O motivo da derrota foi cadastrado no Benner?</legend>
      <label><input type="radio" name={'motivo-derrota-' + process.id} checked={cadastrado === true} onChange={() => setCadastrado(true)}/> Sim, cadastrado</label>
      <label><input type="radio" name={'motivo-derrota-' + process.id} checked={cadastrado === false} onChange={() => setCadastrado(false)}/> Não, ainda pendente</label>
    </fieldset>
    <label>Observação (opcional)<textarea value={observacao} maxLength={2000} rows={2} onChange={event => setObservacao(event.target.value)} placeholder="Registro ou justificativa no Benner" /></label>
    {error && <p className="task-renderer-error" role="alert">{error}</p>}
    {notice && <p role="status">{notice}</p>}
    <button type="submit" className="primary-button" disabled={busy || cadastrado === null}>{busy ? 'Salvando…' : 'Salvar e próximo'}</button>
  </form>;
}
