import { type FormEvent, useEffect, useState } from 'react';
import type { Task, TaskProcess } from './model';
import type { ApiRequest } from './renderers';

type Props = {
  api: ApiRequest;
  task: Task;
  process: TaskProcess;
  onCompleted: (process: TaskProcess) => void;
};

const ERROR_REASONS = [
  ['DEFESA_AUSENTE', 'Defesa não localizada'],
  ['PROTOCOLO_AUSENTE', 'Protocolo não localizado'],
  ['TAREFA_INDEVIDA', 'Tarefa aberta indevidamente'],
  ['FALHA_UPLOAD', 'Falha no upload'],
  ['ARQUIVO_INVALIDO', 'Arquivo inválido'],
  ['OUTRO', 'Outro erro'],
] as const;

export function ProtocolCollectionRenderer({ api, process, onCompleted }: Props) {
  const [defesa, setDefesa] = useState<File | null>(null);
  const [protocolo, setProtocolo] = useState<File | null>(null);
  const [mode, setMode] = useState<'documents' | 'error'>('documents');
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setDefesa(null);
    setProtocolo(null);
    setMode('documents');
    setReason('');
    setNotes('');
    setBusy(false);
    setError(null);
  }, [process.id]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);

    if (mode === 'error') {
      if (!reason) return setError('Selecione o motivo do erro.');
      if (reason === 'OUTRO' && !notes.trim()) return setError('Descreva o erro encontrado.');
      setBusy(true);
      try {
        await api(`/api/task-processes/${process.id}/protocol-collection-error`, {
          method: 'POST',
          body: JSON.stringify({ reason, notes: notes.trim() || null }),
        });
        onCompleted(process);
      } catch (cause: any) {
        setError(cause?.message || 'Não foi possível registrar o erro.');
      } finally {
        setBusy(false);
      }
      return;
    }

    if (!defesa || !protocolo) return setError('DEFESA e PROTOCOLO são obrigatórios. Sem os dois documentos, registre Erro.');
    if (!/\.pdf$/i.test(defesa.name) || !/\.pdf$/i.test(protocolo.name)) return setError('Os dois documentos devem estar em PDF.');

    const body = new FormData();
    body.append('defesa', defesa);
    body.append('protocolo', protocolo);
    setBusy(true);
    try {
      await api(`/api/task-processes/${process.id}/protocol-collection`, { method: 'POST', body });
      onCompleted(process);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar o pacote documental.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <form className="task-renderer-form" onSubmit={submit}>
      <section className="task-question">
        <h3>Coleta de documentos</h3>
        <p>A tarefa só é concluída quando DEFESA e PROTOCOLO forem salvos e validados. Caso contrário, registre o erro.</p>
        <div className="task-option-grid task-option-grid-2" role="radiogroup" aria-label="Resultado da coleta">
          <label className="task-option-card"><input type="radio" checked={mode === 'documents'} disabled={busy} onChange={() => setMode('documents')} /><span><strong>Documentos disponíveis</strong><small>Enviar os dois PDFs</small></span></label>
          <label className="task-option-card"><input type="radio" checked={mode === 'error'} disabled={busy} onChange={() => setMode('error')} /><span><strong>Erro</strong><small>Não foi possível obter os dois documentos</small></span></label>
        </div>
      </section>

      {mode === 'documents' ? <section className="protocol-document-grid">
        <label className="task-text-field"><span>DEFESA <b>(obrigatório)</b></span><input type="file" accept="application/pdf,.pdf" disabled={busy} onChange={event => setDefesa(event.target.files?.[0] || null)} /><small>{defesa?.name || 'Selecione o PDF da defesa.'}</small></label>
        <label className="task-text-field"><span>PROTOCOLO <b>(obrigatório)</b></span><input type="file" accept="application/pdf,.pdf" disabled={busy} onChange={event => setProtocolo(event.target.files?.[0] || null)} /><small>{protocolo?.name || 'Selecione o PDF do protocolo.'}</small></label>
      </section> : <section className="task-question task-question-nested">
        <label className="task-select-field"><span>Motivo do erro</span><select value={reason} disabled={busy} onChange={event => setReason(event.target.value)}><option value="">Selecione</option>{ERROR_REASONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}</select></label>
        <label className="task-text-field"><span>Observações {reason === 'OUTRO' ? <b>(obrigatório)</b> : <small>(opcional)</small>}</span><textarea value={notes} rows={4} maxLength={500} disabled={busy} onChange={event => setNotes(event.target.value)} placeholder="Registre o contexto necessário para rastreabilidade." /><em>{notes.length}/500</em></label>
      </section>}

      {error ? <p className="task-renderer-error" role="alert">{error}</p> : null}
      <footer className="task-renderer-footer">
        <span className="protocol-collection-rule">{mode === 'documents' ? 'Conclusão condicionada aos 2 documentos.' : 'Erro não publica pacote para o worker.'}</span>
        <button className="primary-button" type="submit" disabled={busy}>{busy ? 'Salvando…' : mode === 'documents' ? 'Salvar documentos e próximo' : 'Registrar erro e próximo'}</button>
      </footer>
    </form>
  );
}
