import { useEffect, useState } from 'react';
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

type DefenseIndication = {
  provider?: string | null;
  category?: string | null;
  detected?: boolean | null;
  matched_terms?: string[] | null;
  evidence?: Record<string, any> | null;
  job_id?: string | null;
  detected_at?: string | null;
};

type DefenseContext = {
  process?: TaskProcess;
  indicios?: DefenseIndication[];
  analysis?: {
    decision?: string | null;
    reason?: string | null;
    fatal_deadline?: string | null;
    notes?: string | null;
  } | null;
};

function defenseProviderLabel(value: unknown) {
  return String(value || '').toLowerCase() === 'datajud' ? 'DataJud' : 'Enter';
}

function defenseCategoryLabel(value: unknown) {
  return String(value || '').toLowerCase() === 'merito' ? 'Mérito' : 'Suspensão';
}

function indicationError(indication: DefenseIndication) {
  const evidence = indication.evidence || {};
  return String(evidence.erro || evidence.error || '').trim() || null;
}

function DefenseIndications({ context, loading, error }: { context: DefenseContext | null; loading: boolean; error: string | null }) {
  const indications = Array.isArray(context?.indicios) ? context!.indicios! : [];
  const relevant = indications.filter(indication => indication.detected || indicationError(indication));

  return <aside className="defesa-indicios-panel" aria-label="Indícios processuais">
    <header><div><small>APOIO À ANÁLISE</small><h3>Indícios processuais</h3></div><span>Enter + DataJud</span></header>
    <p className="defesa-indicios-help">Os providers apenas sinalizam ocorrências. A classificação final continua sendo da Controladoria.</p>
    {loading ? <div className="defesa-indicios-state">Consultando indícios…</div> : null}
    {!loading && error ? <div className="defesa-indicios-state error">{error}</div> : null}
    {!loading && !error && !relevant.length ? <div className="defesa-indicios-state clear">Nenhum indício localizado para este processo.</div> : null}
    {!loading && !error && relevant.length ? <div className="defesa-indicios-list">{relevant.map((indication, index) => {
      const provider = defenseProviderLabel(indication.provider);
      const category = defenseCategoryLabel(indication.category);
      const terms = Array.isArray(indication.matched_terms) ? [...new Set(indication.matched_terms.filter(Boolean))] : [];
      const evidence = indication.evidence || {};
      const techError = indicationError(indication);
      const resumed = evidence.retomada_posterior === true;
      const movement = String(evidence.movimento || '').trim();
      return <article className={`defesa-indicio-card ${techError ? 'technical-error' : indication.detected ? 'detected' : ''}`} key={`${indication.provider}-${indication.category}-${index}`}>
        <div className="defesa-indicio-heading"><span>{provider}</span><strong>{category}</strong></div>
        {techError ? <p>Consulta técnica sem conclusão: {techError}</p> : null}
        {!techError && terms.length ? <div className="defesa-indicio-terms">{terms.map(term => <span key={term}>{term}</span>)}</div> : null}
        {!techError && movement ? <p><b>Movimento:</b> {movement}</p> : null}
        {!techError && resumed ? <p className="defesa-indicio-resumed">Há indício de retomada posterior. Validar antes de classificar como suspenso.</p> : null}
      </article>;
    })}</div> : null}
  </aside>;
}

export function DefenseRenderer({ api, task, process, onCompleted, onSkipped }: BaseRendererProps) {
  const [context, setContext] = useState<DefenseContext | null>(null);
  const [contextLoading, setContextLoading] = useState(true);
  const [contextError, setContextError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setContext(null);
    setContextLoading(true);
    setContextError(null);
    setBusy(false);
    setError(null);
    api(`/api/task-processes/${process.id}/defesa-context`)
      .then((payload: DefenseContext) => { if (!cancelled) setContext(payload || null); })
      .catch((cause: any) => { if (!cancelled) setContextError(cause?.message || 'Não foi possível carregar os indícios.'); })
      .finally(() => { if (!cancelled) setContextLoading(false); });
    return () => { cancelled = true; };
  }, [api, process.id]);

  const submit = async (draft: DefenseAnalysisDraft) => {
    setBusy(true);
    setError(null);
    try {
      const priorityLabel = draft.priority === 'altissima' ? 'Altíssima' : draft.priority === 'alta' ? 'Alta' : draft.priority === 'baixa' ? 'Baixa' : '—';
      const criteriaText = draft.criteria.length ? ` Critérios: ${draft.criteria.map(item => `${item.type}=${item.date}`).join(', ')}.` : '';
      const notes = `Workflow Defesa V2. Prioridade: ${priorityLabel}. ${draft.situation}${criteriaText}`;
      await api(`/api/task-processes/${process.id}/defesa-analysis`, {
        method: 'POST',
        body: JSON.stringify({
          decision: draft.decision,
          reason: draft.decision === 'inapto' ? draft.reason : null,
          fatal_deadline: draft.decision === 'apto' ? draft.fatal_deadline : null,
          notes,
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

  const controlDeadline = String(task.deadline_at || '').slice(0, 10);

  return <div className="defesa-renderer-layout">
    <DefenseAnalysisFlow
      cnj={process.case_number || 'Processo sem número'}
      controlDeadline={controlDeadline}
      busy={busy}
      error={error}
      onSubmit={submit}
      onSkip={skip}
    />
    <DefenseIndications context={context} loading={contextLoading} error={contextError}/>
  </div>;
}
