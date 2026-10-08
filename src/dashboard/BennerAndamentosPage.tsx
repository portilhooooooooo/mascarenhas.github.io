import { useCallback, useEffect, useState, type FormEvent } from 'react';
import { Activity, ArrowDownToLine, CheckCircle2, CircleAlert, FileSpreadsheet, ListChecks, UploadCloud } from 'lucide-react';
import './bennerAndamentos.css';

type ResultRow = {
  line: number; cnj: string; andamento: string; motivo_derrota: string;
  data_andamento: string; status: string; message: string;
};
type MovementJob = {
  job_id: string; status: string; created_at: string; total: number;
  processed: number; done: number; skipped: number; errors: number;
  current_cnj?: string | null; rows: ResultRow[]; error?: string;
};
type BackofficeApi = {
  request: <T>(url: string, init?: RequestInit) => Promise<T>;
  fetch: (url: string, init?: RequestInit) => Promise<Response>;
};

function api(): BackofficeApi {
  const value = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!value) throw new Error('API operacional indisponível.');
  return value;
}
const BASE = '/api/automations/benner-andamentos';
const completed = (status: string) => ['done', 'done_with_errors', 'error', 'dispatch_error'].includes(status);
const statusLabel = (status: string) => ({
  queued: 'Na fila', running: 'Executando', done: 'Concluído',
  done_with_errors: 'Concluído com ressalvas', error: 'Falha',
  dispatch_error: 'Falha no envio', pending: 'Pendente',
  already_exists: 'Já existente', uncertain: 'Validação necessária',
}[status] || status);
function dateTime(value: string) {
  return new Date(value).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
}

export function BennerAndamentosPage() {
  const [file, setFile] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [job, setJob] = useState<MovementJob | null>(null);
  const [jobs, setJobs] = useState<MovementJob[]>([]);
  const [reasons, setReasons] = useState<string[]>([]);
  const [showReasons, setShowReasons] = useState(false);
  const [showRows, setShowRows] = useState(false);
  const allowed = (window as Window & { MBA_CURRENT_USER?: { permissions?: Record<string, boolean> } })
    .MBA_CURRENT_USER?.permissions?.['automations.run'] === true;

  const refreshJobs = useCallback(async () => {
    try {
      const recent = await api().request<MovementJob[]>(BASE + '/jobs');
      setJobs(recent);
      setJob(current => {
        if (!current) return recent[0] || null;
        return recent.find(item => item.job_id === current.job_id) || current;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao consultar os lotes.');
    }
  }, []);

  useEffect(() => {
    let active = true;
    api().request<{ reasons: string[] }>(BASE + '/reasons')
      .then(value => { if (active) setReasons(value.reasons); })
      .catch(() => {});
    void refreshJobs();
    const timer = window.setInterval(() => {
      if (!document.hidden) void refreshJobs();
    }, 4000);
    return () => { active = false; clearInterval(timer); };
  }, [refreshJobs]);

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!file || busy) return;
    setError('');
    setBusy(true);
    try {
      const payload = new FormData();
      payload.set('file', file);
      const created = await api().request<MovementJob>(BASE + '/import', {
        method: 'POST', body: payload,
      });
      setJob(created);
      setShowRows(true);
      setFile(null);
      const input = document.getElementById('benner-andamentos-file') as HTMLInputElement | null;
      if (input) input.value = '';
      await refreshJobs();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Falha ao importar arquivo.');
    } finally {
      setBusy(false);
    }
  }

  async function downloadTemplate() {
    try {
      setError('');
      const res = await api().fetch(BASE + '/template');
      if (!res.ok) throw new Error('Não foi possível baixar o modelo.');
      const url = URL.createObjectURL(await res.blob());
      const a = document.createElement('a');
      a.href = url; a.download = 'modelo_andamentos_benner.csv'; a.click();
      window.setTimeout(() => URL.revokeObjectURL(url), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao baixar modelo.');
    }
  }

  return (
    <section className="benner-movements" aria-label="Andamentos no Benner">
      <div className="benner-movements-header">
        <div>
          <span className="benner-movements-eyebrow"><Activity size={14}/> AUTOMAÇÃO BENNER</span>
          <h2>Andamentos no Benner</h2>
          <p>Importe um lote, lance os andamentos e confira o resultado de cada processo.</p>
        </div>
        <button type="button" className="secondary-button" onClick={() => void downloadTemplate()}>
          <ArrowDownToLine size={16}/> Baixar modelo CSV
        </button>
      </div>

      <div className="benner-movements-columns">
        <form className="benner-movements-upload" onSubmit={event => void onSubmit(event)}>
          <label htmlFor="benner-andamentos-file" className="benner-upload-label">
            <FileSpreadsheet size={23}/>
            <strong>{file?.name || 'Selecione um arquivo CSV ou XLSX'}</strong>
            <span>Até 5 MB e 1.000 processos por lote</span>
          </label>
          <input id="benner-andamentos-file" type="file" accept=".csv,.xlsx" required
            onChange={event => setFile(event.target.files?.[0] || null)} />
          <div className="benner-movements-fields">
            <strong>Colunas esperadas</strong>
            <span>CNJ · RECEBIMENTO_DOCUMENTO · DATA_ANDAMENTO · ANDAMENTO · OBSERVAÇÕES · MOTIVO DERROTA</span>
            <small>Datas vazias assumem a data do envio. Observações são opcionais. Motivo Derrota só é obrigatório para o andamento “Motivo derrota”.</small>
          </div>
          <button type="button" className="benner-reasons-toggle" onClick={() => setShowReasons(!showReasons)}
            aria-expanded={showReasons}>{showReasons ? 'Ocultar' : 'Consultar'} motivos de derrota ({reasons.length})</button>
          {showReasons && <div className="benner-reasons"><ol>{reasons.map(reason => <li key={reason}>{reason}</li>)}</ol></div>}
          <button className="primary-button benner-submit" type="submit" disabled={!file || busy || !allowed}>
            <UploadCloud size={16}/> {busy ? 'Enviando…' : 'Importar e executar'}
          </button>
          {!allowed && <p className="benner-message">Você não possui a permissão de executar automações.</p>}
          {error && <p className="benner-message benner-error" role="alert"><CircleAlert size={15}/>{error}</p>}
        </form>

        <div className="benner-movements-progress">
          <div className="benner-section-heading"><h3>Última execução</h3><ListChecks size={18}/></div>
          {!job ? (
            <p className="benner-empty">Nenhum lote enviado recentemente nesta conta.</p>
          ) : (
            <>
              <div className="benner-job-label"><strong>{statusLabel(job.status)}</strong><small>{dateTime(job.created_at)}</small></div>
              <progress max={Math.max(job.total, 1)} value={job.processed} aria-label="Progresso do lote"/>
              <div className="benner-progress-stats">
                <span><strong>{job.done}</strong>Confirmados</span>
                <span><strong>{job.skipped}</strong>Já existentes</span>
                <span><strong>{job.errors}</strong>Ressalvas/erros</span>
                <span><strong>{job.processed}/{job.total}</strong>Processados</span>
              </div>
              {job.current_cnj && <small>Em análise: {job.current_cnj}</small>}
              {job.error && <p className="benner-message benner-error">{job.error}</p>}
              <button type="button" className="benner-reasons-toggle" onClick={() => setShowRows(!showRows)}>
                {showRows ? 'Recolher' : 'Ver'} resultados por processo
              </button>
              {showRows && (
                <div className="benner-results-scroll">
                  <table>
                    <thead><tr><th>CNJ</th><th>Andamento</th><th>Situação</th></tr></thead>
                    <tbody>{job.rows.map(row => (
                      <tr key={row.line}>
                        <td>{row.cnj}<small>Linha {row.line}</small></td>
                        <td>{row.andamento}{row.motivo_derrota && <small>{row.motivo_derrota}</small>}</td>
                        <td><span>{row.status === 'done' ? <CheckCircle2 size={13}/> : null}{statusLabel(row.status)}</span>
                          {row.message && <small title={row.message}>{row.message}</small>}</td>
                      </tr>
                    ))}</tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {!!jobs.length && <div className="benner-history">
        <h3>Histórico de lotes</h3>
        <div>{jobs.slice(0, 8).map(item => (
          <button type="button" key={item.job_id} onClick={() => { setJob(item); setShowRows(true); }}
            className={job?.job_id === item.job_id ? 'selected' : ''}>
            <span>{dateTime(item.created_at)}</span><strong>{statusLabel(item.status)}</strong>
            <span>{item.processed}/{item.total}</span>
          </button>
        ))}</div>
      </div>}
    </section>
  );
}
