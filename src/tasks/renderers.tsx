import { useState } from 'react';
import type { Task, TaskProcess } from './model';
import { DefenseAnalysisFlow, type DefenseAnalysisDraft } from './DefenseAnalysisFlow';
import { ClosingAnalysisFlow, type ClosingAnalysisDraft } from './ClosingAnalysisFlow';
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
  />;
}

function closingClassifierClassification(task: Task, process: TaskProcess) {
  const metadata = process.source_metadata && typeof process.source_metadata === 'object' ? process.source_metadata : {};
  const raw = process.indicio
    || process.indication
    || process.indication_label
    || metadata.classifier_classification
    || metadata.classification
    || metadata.classificacao
    || metadata.resultado
    || task.title;
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
  const classifierClassification = closingClassifierClassification(task, process);

  const submit = async (draft: ClosingAnalysisDraft) => {
    setBusy(true);
    setError(null);
    try {
      const saved = await api(`/api/task-processes/${process.id}/encerramento-analysis`, {
        method: 'POST',
        body: JSON.stringify(draft),
      });
      clearQaDraft(draftKey);
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
    contextHint={closingSentenceHint(process)}
    busy={busy}
    error={error}
    onSubmit={submit}
    onSkip={skip}
  />;
}

