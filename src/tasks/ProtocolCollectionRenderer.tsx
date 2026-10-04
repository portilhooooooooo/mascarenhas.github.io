import { type FormEvent, useEffect, useRef, useState } from 'react';
import { CheckCircle2, FileText, Upload } from 'lucide-react';
import type { Task, TaskProcess } from './model';
import { OptionGroup, type ApiRequest } from './renderers';
import './protocolCollection.css';
import { TaskQuestion, TaskActionBar, TaskForm } from './TaskQuestion';

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
  mode: 'documents' | 'error' | null;
  reason: string | null;
  notes: string;
};

const ERROR_REASONS = [
  { value: 'DEFESA_CONCLUIDA_EXTERNAMENTE', label: 'A defesa foi concluída externamente' },
  { value: 'AINDA_NAO_PROTOCOLADO', label: 'Ainda não foi protocolado nos autos' },
];

const draftCache = new Map<string, Draft>();
const LAST_ACTION_KEY = 'mba-protocol-last-action-at';

function emptyDraft(): Draft {
  return {
    defesa: null,
    protocolo: null,
    defesaStage: 'idle',
    protocoloStage: 'idle',
    mode: null,
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
    ? 'Enviando documento…'
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
  const [draft, setDraft] = useState<Draft>(() => ({ ...(draftCache.get(process.id) || emptyDraft()), mode: null, reason: null, notes: '' }));
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const generations = useRef<Record<DocumentKind, number>>({ defesa: 0, protocolo: 0 });

  useEffect(() => {
    const cached: Draft = { ...(draftCache.get(process.id) || emptyDraft()), mode: null, reason: null, notes: '' };
    setDraft(cached);
    setBusy(false);
    setError(null);
  }, [process.id]);

  const patchDraft = (patch: Partial<Draft>) => {
    setError(null);
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
      setError(cause?.message || 'Não foi possível enviar o documento. Tente selecionar o arquivo novamente.');
    }
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (draft.mode === null) { setError('Informe se consegue anexar os documentos.'); return; }
    if (draft.mode === 'error') {
      if (!draft.reason) {
        setError('Selecione o motivo do erro.');
        return;
      }
      setBusy(true);
      try {
        const clientActionAt = recordActionMetric('error', process.id);
        await api(`/api/task-processes/${process.id}/protocol-collection-error`, {
          method: 'POST',
          body: JSON.stringify({
            reason: draft.reason,
            notes: null,
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
      setError('Aguarde a confirmação de envio dos dois documentos antes de concluir.');
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
      const clientActionAt = recordActionMetric('skip', process.id);
      await api(`/api/task-processes/${process.id}/skip`, {
        method: 'POST',
        body: JSON.stringify({ client_action_at: clientActionAt }),
      });
      onSkipped(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível pular o processo.');
    } finally {
      setBusy(false);
    }
  };

  const documentsReady = draft.defesaStage === 'ready' && draft.protocoloStage === 'ready';

  return (
    <TaskForm className="task-renderer-form protocol-collection-form" onSubmit={submit}>
      <div className="protocol-collection-content">
        <TaskQuestion number="01" question="Você consegue anexar a defesa e o protocolo na tarefa abaixo?"><OptionGroup name="protocol-can-attach" value={draft.mode === null ? null : draft.mode === 'documents' ? 'sim' : 'nao'} onChange={value => patchDraft({mode: value === 'sim' ? 'documents' : 'error', reason: null, notes: ''})} options={[{value:'sim',label:'Sim'},{value:'nao',label:'Não'}]} disabled={busy}/></TaskQuestion>
        {draft.mode === 'documents' ? (
        <div className="protocol-upload-stack">
          <UploadField
            label="Defesa"
            kind="defesa"
            file={draft.defesa}
            stage={draft.defesaStage}
            busy={busy}
            onSelect={stageDocument}
          />
          <UploadField
            label="Comprovante de protocolo"
            kind="protocolo"
            file={draft.protocolo}
            stage={draft.protocoloStage}
            busy={busy}
            onSelect={stageDocument}
          />
        </div>

        ) : null}
        {draft.mode === 'error' ? (
          <section className="protocol-error-panel">
            <TaskQuestion number="02" question="Por que a coleta não pôde ser concluída?">
              <OptionGroup
                name="protocol-error-reason"
                value={draft.reason}
                onChange={reason => patchDraft({ reason, notes: '' })}
                options={ERROR_REASONS}
                disabled={busy}
              />
            </TaskQuestion>
          </section>
        ) : null}


        {error ? <p className="task-renderer-error" role="alert">{error}</p> : null}
      </div>

      <TaskActionBar busy={busy} onSkip={() => void skip()} ready={draft.mode === 'documents' ? documentsReady : draft.mode === 'error' && Boolean(draft.reason)}/>
    </TaskForm>
  );
}
