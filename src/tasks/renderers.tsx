import { useState } from 'react';
import type { Task, TaskProcess } from './model';
import { DefenseAnalysisFlow, type DefenseAnalysisDraft } from './DefenseAnalysisFlow';
import type { ApiRequest } from './renderersLegacy';

export { AgreementRenderer, LiminarRenderer, OptionGroup, PaymentRenderer, UnsupportedRenderer } from './renderersLegacy';
export type { ApiRequest } from './renderersLegacy';

type BaseRendererProps = {
  api: ApiRequest;
  task: Task;
  process: TaskProcess;
  onCompleted: (process: TaskProcess) => void;
  onSkipped: (process: TaskProcess) => void;
};

function defenseControlDeadline(task: Task, process: TaskProcess) {
  const metadata = process.source_metadata || {};
  return String(metadata.fatal_deadline || task.deadline_at || '').slice(0, 10) || null;
}

export function DefenseRenderer({ api, task, process, onCompleted, onSkipped }: BaseRendererProps) {
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
          workflow_version: 3,
          reason: draft.reason,
          cpj_fatal_deadline: draft.deadline_correct ? null : draft.fatal_deadline,
          criteria: draft.criteria,
          controladoria_deadline_correct: draft.deadline_correct,
          has_active_defense_deadline: draft.has_active_defense_deadline,
          analysis_origin: 'TASK',
        }),
      });
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
      onSkipped(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível pular o processo.');
    } finally {
      setBusy(false);
    }
  };

  return <DefenseAnalysisFlow
    cnj={process.case_number || 'Processo sem número'}
    controlDeadline={controlDeadline}
    busy={busy}
    error={error}
    onSubmit={submit}
    onSkip={skip}
  />;
}
