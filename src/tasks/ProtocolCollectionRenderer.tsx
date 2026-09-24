import { type FormEvent, useEffect, useRef, useState } from 'react';
import { AlertCircle, CheckCircle2, FileText, Upload } from 'lucide-react';
import type { Task, TaskProcess } from './model';
import { OptionGroup, type ApiRequest } from './renderers';
import './protocolCollection.css';

type Props = {
  api: ApiRequest;
  task: Task;
  process: TaskProcess;
  onCompleted: (process: TaskProcess) => void;
  onSkipped: (process: TaskProcess) => void;
};

type DocumentKind = 'defesa' | 'protocolo';
type StageState = 'idle' | 'uploading' | 'ready' | 'error';

type Draft = {
  defesa: File | null;
  protocolo: File | null;
  defesaStage: StageState;
  protocoloStage: StageState;
  mode: 'documents' | 'error';
  reason: string | null;
  notes: string;
};

const ERROR_REASONS = [
  { value: 'DEFESA_AUSENTE', label: 'Defesa não localizada' },
  { value: 'PROTOCOLO_AUSENTE', label: 'Protocolo não localizado' },
  { value: 'TAREFA_INDEVIDA', label: 'Tarefa aberta indevidamente' },
  { value: 'ARQUIVO_INVALIDO', label: 'Arquivo inválido' },
  { value: 'OUTRO', label: 'Outro motivo' },
];

const draftCache = new Map<string, Draft>();
const LAST_ACTION_KEY = 'mba-protocol-last-action-at';
const METRICS_KEY = 'mba-protocol-action-metrics-v1';

function emptyDraft(): Draft {
  return {
    defesa: null,
    protocolo: null,
    defesaStage: 'idle',
    protocoloStage: 'idle',
    mode: 'documents',
    reason: null,
    notes: '',
  };
}

function recordActionMetric(action: 'save' | 'error' | 'skip', processId: string) {
  const now = Date.now();
  const previous = Number(sessionStorage.getItem(LAST_ACTION_KEY) || 0);
  const metric = {
    action,
    process_id: processId,
    client_action_at: new Date(now).toISOString(),
    interval_since_previous_ms: previous > 0 ? now - previous : null,
  };
  sessionStorage.setItem(LAST_ACTION_KEY, String(now));
  try {
    const current = JSON.parse(localStorage.getItem(METRICS_KEY) || '[]');
    const rows = Array.isArray(current) ? current : [];
    rows.push(metric);
    localStorage.setItem(METRICS_KEY, JSON.stringify(rows.slice(-500)));
  } catch (_error) {
    // Métrica não bloqueia o fluxo operacional.
  }
  window.dispatchEvent(new CustomEvent('mba:protocol-action-metric', { detail: metric }));
  return metric.client_action_at;
}

function UploadField({
  label,
  kind,
  file,
  stage,
  busy,
  onSelect,
}: {
  label: string;
  kind: DocumentKind;
  file: File | null;
  stage: StageState;
  busy: boolean;
  onSelect: (kind: DocumentKind, file: File | null) => void;
}) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const status = stage === 'uploading'
    ? 'Enviando para a VPS…'
    : stage === 'ready'
      ? 'Pronto para concluir'
      : stage === 'error'
        ? 'Falha ao preparar o arquivo'
        : 'Nenhum arquivo selecionado';

  return (
    <div className="protocol-upload-field">
      <div className="protocol-upload-heading">
        <strong>{label}</strong>
        <span>obrigatório</span>
      </div>
      <div className={`protocol-upload-control ${stage}`}>
        <div className="protocol-upload-file">
          {stage === 'ready' ? <CheckCircle2 size={17} /> : <FileText size={17} />}
          <div>
            <strong>{file?.name || status}</strong>
            <small>{file ? status : `Selecione o PDF de ${kind === 'defesa' ? 'defesa' : 'protocolo'}.`}</small>
          </div>
        </div>
        <input
          ref={inputRef}
          className="protocol-native-file"
          type="file"
          accept="application/pdf,.pdf"
          disabled={busy || stage === 'uploading'}
          onChange={event => onSelect(kind, event.target.files?.[0] || null)}
        />
        <button
          className="secondary-button protocol-upload-button"
          type="button"
          disabled={busy || stage === 'uploading'}
          onClick={() => inputRef.current?.click()}
        >
          <Upload size={14} />
          {file ? 'Trocar arquivo' : 'Selecionar arquivo'}
        </button>
      </div>
    </div>
  );
}

export function ProtocolCollectionRenderer({ api, process, onCompleted, onSkipped }: Props) {
  const [draft, setDraft] = useState<Draft>(() => draftCache.get(process.id) || emptyDraft());
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generations = useRef<Record<DocumentKind, number>>({ defesa: 0, protocolo: 0 });

  useEffect(() => {
    const cached = draftCache.get(process.id) || emptyDraft();
    setDraft(cached);
    setBusy(false);
    setError(null);
  }, [process.id]);

  const patchDraft = (patch: Partial<Draft>) => {
    setDraft(current => {
      const next = { ...current, ...patch };
      draftCache.set(process.id, next);
      return next;
    });
  };

  const stageDocument = async (kind: DocumentKind, file: File | null) => {
    setError(null);
    if (!file) {
      patchDraft({
        [kind]: null,
        [`${kind}Stage`]: 'idle',
      } as Partial<Draft>);
      return;
    }
    if (!/\.pdf$/i.test(file.name)) {
      patchDraft({
        [kind]: file,
        [`${kind}Stage`]: 'error',
      } as Partial<Draft>);
      setError('Os documentos devem estar em PDF.');
      return;
    }

    const generation = ++generations.current[kind];
    patchDraft({
      [kind]: file,
      [`${kind}Stage`]: 'uploading',
    } as Partial<Draft>);

    const body = new FormData();
    body.append('document', file);
    body.append('document_type', kind.toUpperCase());
    try {
      await api(`/api/task-processes/${process.id}/protocol-collection/stage`, { method: 'POST', body });
      if (generations.current[kind] !== generation) return;
      patchDraft({ [`${kind}Stage`]: 'ready' } as Partial<Draft>);
    } catch (cause: any) {
      if (generations.current[kind] !== generation) return;
      patchDraft({ [`${kind}Stage`]: 'error' } as Partial<Draft>);
      setError(cause?.message || 'Não foi possível preparar o documento na VPS.');
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (draft.mode === 'error') {
      if (!draft.reason) {
        setError('Selecione o motivo do erro.');
        return;
      }
      if (!draft.notes.trim()) {
        setError('Justifique o erro antes de continuar.');
        return;
      }
      setBusy(true);
      try {
        const clientActionAt = recordActionMetric('error', process.id);
        await api(`/api/task-processes/${process.id}/protocol-collection-error`, {
          method: 'POST',
          body: JSON.stringify({
            reason: draft.reason,
            notes: draft.notes.trim(),
            client_action_at: clientActionAt,
          }),
        });
        draftCache.delete(process.id);
        onCompleted(process);
      } catch (cause: any) {
        setError(cause?.message || 'Não foi possível registrar o erro.');
      } finally {
        setBusy(false);
      }
      return;
    }

    if (draft.defesaStage !== 'ready' || draft.protocoloStage !== 'ready') {
      setError('Aguarde o envio da DEFESA e do PROTOCOLO para a VPS.');
      return;
    }

    setBusy(true);
    try {
      const clientActionAt = recordActionMetric('save', process.id);
      await api(`/api/task-processes/${process.id}/protocol-collection/commit`, {
        method: 'POST',
        body: JSON.stringify({ client_action_at: clientActionAt }),
      });
      draftCache.delete(process.id);
      onCompleted(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível concluir a coleta.');
    } finally {
      setBusy(false);
    }
  };

  const skip = async () => {
    setBusy(true);
    setError(null);
    try {
      recordActionMetric('skip', process.id);
      await api(`/api/task-processes/${process.id}/skip`, { method: 'POST', body: '{}' });
      onSkipped(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível pular o processo.');
    } finally {
      setBusy(false);
    }
  };

  const documentsReady = draft.defesaStage === 'ready' && draft.protocoloStage === 'ready';

  return (
    <form className="task-renderer-form protocol-collection-form" onSubmit={submit}>
      <div className="protocol-collection-content">
        {draft.mode === 'documents' ? (
          <>
            <section className="task-question protocol-title-block">
              <h3>Coleta de documentos</h3>
              <p>Anexe a defesa e o comprovante de protocolo.</p>
            </section>
            <div className="protocol-upload-stack">
              <UploadField
                label="DEFESA"
                kind="defesa"
                file={draft.defesa}
                stage={draft.defesaStage}
                busy={busy}
                onSelect={stageDocument}
              />
              <UploadField
                label="PROTOCOLO"
                kind="protocolo"
                file={draft.protocolo}
                stage={draft.protocoloStage}
                busy={busy}
                onSelect={stageDocument}
              />
            </div>
            <button
              className="protocol-error-trigger"
              type="button"
              disabled={busy}
              onClick={() => patchDraft({ mode: 'error' })}
            >
              <AlertCircle size={14} />
              Não foi possível concluir a coleta
            </button>
          </>
        ) : (
          <section className="protocol-error-panel">
            <div className="task-question">
              <h3>Por que a coleta não pôde ser concluída?</h3>
              <p>Selecione o motivo e registre a justificativa.</p>
              <OptionGroup
                name="protocol-error-reason"
                value={draft.reason}
                onChange={reason => patchDraft({ reason })}
                options={ERROR_REASONS}
                disabled={busy}
              />
            </div>
            <label className="task-text-field">
              <span>Justificativa <b>(obrigatório)</b></span>
              <textarea
                value={draft.notes}
                rows={4}
                maxLength={500}
                disabled={busy}
                onChange={event => patchDraft({ notes: event.target.value })}
                placeholder="Explique objetivamente por que a coleta não pôde ser concluída..."
              />
              <em>{draft.notes.length}/500</em>
            </label>
            <button
              className="protocol-back-link"
              type="button"
              disabled={busy}
              onClick={() => patchDraft({ mode: 'documents' })}
            >
              Voltar para os documentos
            </button>
          </section>
        )}
        {error ? <p className="task-renderer-error" role="alert">{error}</p> : null}
      </div>

      <footer className="task-renderer-footer protocol-workspace-footer">
        <button className="secondary-button" type="button" disabled={busy} onClick={skip}>Pular e voltar depois</button>
        <button
          className="primary-button"
          type="submit"
          disabled={busy || (draft.mode === 'documents' && !documentsReady)}
        >
          {busy ? 'Salvando…' : 'Salvar e próximo'}
        </button>
      </footer>
    </form>
  );
}
