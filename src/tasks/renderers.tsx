import { type FormEvent, useCallback, useEffect, useRef, useState } from 'react';
import { SelectMenu } from '../dashboard/SelectMenu';
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
type MotivoQueueJob = {
  id: string; status: MotivoQueueStatus; motivo_codigo?: number | null;
  natureza?: string | null; ja_existente?: boolean; erro?: string | null;
  benner_referencia?: string | null;
};
type MotivoCatalog = {
  motivos: { codigo: number; rotulo: string }[];
  naturezas: { codigo: 'P' | 'V'; rotulo: string }[];
};

export function MotivoDerrotaRenderer({ api, process, onCompleted }: BaseRendererProps) {
  const [codigo, setCodigo] = useState('');
  const [natureza, setNatureza] = useState<'P' | 'V'>('P');
  const [catalog, setCatalog] = useState<MotivoCatalog | null>(null);
  const [busy, setBusy] = useState(false);
  const [checking, setChecking] = useState(true);
  const [job, setJob] = useState<MotivoQueueJob | null>(null);
  const [error, setError] = useState('');
  const completedRef = useRef('');
  const requestPath = '/api/task-processes/' + process.id;
  const waiting = job?.status === 'NA_FILA' || job?.status === 'PROCESSANDO';
  const initialNatureza = process.source_metadata?.closing_type === 'DERROTA_VOLUNTARIA' ? 'V' : 'P';

  useEffect(() => {
    let active = true;
    completedRef.current = '';
    setCodigo(''); setNatureza(initialNatureza);
    setJob(null); setCatalog(null); setError(''); setChecking(true);
    const catalogRequest = api('/api/motivo-derrota/catalog').then((result: MotivoCatalog) => {
      if (!active) return;
      if (!result || !Array.isArray(result.motivos) || !Array.isArray(result.naturezas))
        throw new Error('Catálogo do Benner indisponível.');
      setCatalog(result);
    });
    const refresh = async () => {
      try {
        const result = await api(requestPath + '/motivo-derrota-status');
        if (!active) return;
        const nextJob: MotivoQueueJob | null = result?.job || null;
        setJob(nextJob);
        if (nextJob?.motivo_codigo) setCodigo(String(nextJob.motivo_codigo));
        if (nextJob?.natureza === 'P' || nextJob?.natureza === 'V') setNatureza(nextJob.natureza);
        if (nextJob?.status === 'ENVIADO' && completedRef.current !== process.id) {
          completedRef.current = process.id;
          window.dispatchEvent(new CustomEvent('mba:realtime-invalidate', { detail: { module: 'encerramentos' } }));
          onCompleted(process);
        }
      } catch (cause: any) {
        if (active) setError(cause?.message || 'Não foi possível consultar a fila do Benner.');
      }
    };
    void Promise.all([catalogRequest, refresh()])
      .catch((cause: Error) => { if (active) setError(cause.message || 'Erro ao consultar catálogo Benner.'); })
      .finally(() => { if (active) setChecking(false); });
    const interval = window.setInterval(() => { void refresh(); }, 7000);
    return () => { active = false; window.clearInterval(interval); };
  }, [api, process.id, initialNatureza]);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const id = Number(codigo);
    if (busy || checking || job || !catalog?.motivos.some(item => item.codigo === id)) return;
    setBusy(true); setError('');
    try {
      const saved = await api(requestPath + '/motivo-derrota-submit', {
        method: 'POST', body: JSON.stringify({ motivo_codigo: id, natureza }),
      });
      if (!saved?.job_id) throw new Error('A fila Benner não retornou o identificador do envio.');
      setJob({ id: String(saved.job_id), status: (saved.status || 'NA_FILA') as MotivoQueueStatus,
        motivo_codigo: id, natureza });
    } catch (cause: any) {
      setError(cause?.message || 'Falha ao registrar o motivo para envio ao Benner.');
    } finally {
      setBusy(false);
    }
  }

  const currentStatus = job?.status === 'NA_FILA' ? 'Aguardando worker Benner'
    : job?.status === 'PROCESSANDO' ? 'Cadastrando no Benner'
    : job?.status === 'ERRO' ? 'Envio requer revisão'
    : job?.status === 'ENVIADO' ? (job.ja_existente ? 'Andamento já existente no Benner' : 'Cadastro confirmado no Benner')
    : '';
  const motivoSelecionado = catalog?.motivos.find(item => item.codigo === Number(codigo))?.rotulo;
  return <form className="task-form-content motivo-derrota-form" onSubmit={submit}>
    <h3>Cadastro de Motivo Derrota</h3>
    <p>Selecione o motivo e a natureza conforme os campos oficiais do Benner. O worker registrará o andamento <strong>Motivo derrota</strong> e confirmará o resultado antes de concluir a tarefa.</p>
    <SelectMenu label="Motivo da derrota" searchable value={codigo}
      searchPlaceholder="Buscar motivo da derrota..."
      disabled={busy || checking || Boolean(job)}
      options={[{ value: '', label: 'Selecione um motivo' },
        ...(catalog?.motivos || []).map(item => ({ value: String(item.codigo), label: item.rotulo }))]}
      onChange={setCodigo}/>
    <fieldset className="motivo-derrota-choice" disabled={busy || checking || Boolean(job)}>
      <legend>Natureza da derrota</legend>
      <label><input type="radio" name={'natureza-' + process.id}
        checked={natureza === 'P'} onChange={() => setNatureza('P')}/> Processual</label>
      <label><input type="radio" name={'natureza-' + process.id}
        checked={natureza === 'V'} onChange={() => setNatureza('V')}/> Voluntário</label>
    </fieldset>
    {motivoSelecionado && !job ? <p className="motivo-derrota-helper">Motivo Benner #{codigo}: {motivoSelecionado}</p> : null}
    {job ? <div className="motivo-derrota-queue" role="status">
      <strong>{currentStatus}</strong>
      <span>{waiting ? 'O envio está na fila. Não reenvie enquanto a automação processa.'
        : job.status === 'ERRO' ? 'Nenhum novo envio será feito automaticamente; o histórico exige conferência antes de qualquer tentativa.'
        : job.ja_existente ? 'O worker identificou um andamento anterior e não criou outro.'
        : 'O andamento foi confirmado. A tarefa será retirada da fila.'}</span>
      {job.status === 'ERRO' && job.erro ? <span>{job.erro}</span> : null}
    </div> : null}
    {error ? <p className="task-renderer-error" role="alert">{error}</p> : null}
    {!job && !checking ? <button type="submit" className="primary-button"
      disabled={busy || !catalog?.motivos.some(item => item.codigo === Number(codigo))}>
      {busy ? 'Enviando à fila…' : 'Cadastrar no Benner'}
    </button> : null}
    {checking ? <p role="status">Consultando catálogo e solicitações existentes…</p> : null}
  </form>;
}
