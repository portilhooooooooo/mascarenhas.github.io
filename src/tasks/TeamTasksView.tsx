import { useEffect, useMemo, useState } from 'react';
import type { Task, TaskProcess } from './model';
import { normalize, PROCESS_STATUS_LABELS, taskTypeLabel } from './model';
import type { ApiRequest } from './renderers';
import './teamTasksView.css';

type Props = {
  tasks: Task[];
  api: ApiRequest;
  visible: boolean;
};

const PAGE_SIZE = 30;

function assigneeName(task: Task, process: TaskProcess): string {
  if (!process.assignee_id) return 'Não atribuído';
  const index = (task.participant_user_ids || []).findIndex(id => String(id) === String(process.assignee_id));
  if (index >= 0) return task.participant_names?.[index] || 'Analista';
  if (String(task.responsible_id || '') === String(process.assignee_id)) return task.responsible_name || 'Responsável';
  return process.assignee_name || 'Outro analista';
}

function classification(process: TaskProcess): string {
  const metadata = process.source_metadata || {};
  return String(
    metadata.closing_classification_label
    || metadata.closing_final_classification
    || metadata.classifier_classification
    || metadata.classification
    || process.indication_label
    || process.indication
    || '—'
  );
}

export function TeamTasksView({ tasks, api, visible }: Props) {
  const [chosenTaskId, setChosenTaskId] = useState('');
  const [rows, setRows] = useState<TaskProcess[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState('');
  const [selectedAnalyst, setSelectedAnalyst] = useState('all');
  const [status, setStatus] = useState('all');
  const [page, setPage] = useState(0);
  const [refresh, setRefresh] = useState(0);

  const task = useMemo(() => tasks.find(row => row.id === chosenTaskId) || tasks[0] || null, [tasks, chosenTaskId]);

  useEffect(() => {
    if (!visible || !task) return;
    let live = true;
    setBusy(true);
    setError(null);
    setRows([]);
    api(`/api/tasks/${task.id}/processes`)
      .then(result => {
        if (live) setRows(Array.isArray(result) ? result as TaskProcess[] : []);
      })
      .catch((cause: any) => {
        if (live) setError(cause?.message || 'Não foi possível carregar os processos da equipe.');
      })
      .finally(() => { if (live) setBusy(false); });
    return () => { live = false; };
  }, [api, task?.id, visible, refresh]);

  const analysts = useMemo(() => {
    if (!task) return [];
    const people = new Map<string, string>();
    for (const process of rows) {
      const id = String(process.assignee_id || '');
      if (id) people.set(id, assigneeName(task, process));
    }
    return Array.from(people, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [rows, task]);

  const filtered = useMemo(() => {
    if (!task) return [];
    const needle = normalize(search);
    return rows.filter(process => {
      if (selectedAnalyst !== 'all' && String(process.assignee_id || '') !== selectedAnalyst) return false;
      if (status !== 'all' && normalize(process.status) !== status) return false;
      return !needle || normalize(process.case_number).includes(needle)
        || normalize(assigneeName(task, process)).includes(needle);
    });
  }, [rows, task, search, selectedAnalyst, status]);

  useEffect(() => { setPage(0); }, [task?.id, search, selectedAnalyst, status]);

  const pages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const safePage = Math.min(page, pages - 1);

  return <section className="tasks-team-view" aria-label="Tarefas da equipe">
    <header className="tasks-team-header">
      <div>
        <h2>Visão da equipe</h2>
        <p>Consulte processos atribuídos a outros analistas desta carteira. A consulta é somente leitura; ela não altera atribuições nem libera a conclusão de processos de terceiros.</p>
      </div>
      <button type="button" className="secondary-button" disabled={busy || !task} onClick={() => setRefresh(value => value + 1)}>Atualizar</button>
    </header>
    <div className="tasks-team-filters">
      <label> Tarefa
        <select aria-label="Tarefa da equipe" value={task?.id || ''} onChange={event => {
          setChosenTaskId(event.target.value);
          setSearch('');
          setSelectedAnalyst('all');
          setStatus('all');
        }}>
          {tasks.map(row => <option key={row.id} value={row.id}>{row.title || taskTypeLabel(row.type)}</option>)}
        </select>
      </label>
      <label> Analista
        <select aria-label="Analista" value={selectedAnalyst} onChange={event => setSelectedAnalyst(event.target.value)}>
          <option value="all">Todos</option>
          {analysts.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}
        </select>
      </label>
      <label> Situação
        <select aria-label="Situação do processo" value={status} onChange={event => setStatus(event.target.value)}>
          <option value="all">Todas</option>
          {Array.from(new Set(rows.map(row => normalize(row.status)))).sort().map(key => <option key={key} value={key}>{PROCESS_STATUS_LABELS[key] || key}</option>)}
        </select>
      </label>
      <label> Buscar
        <input aria-label="Buscar processo ou analista" type="search" placeholder="Processo ou analista" value={search} onChange={event => setSearch(event.target.value)} />
      </label>
    </div>
    {error ? <div role="alert" className="workbench-notice">{error} <button type="button" onClick={() => setRefresh(value => value + 1)}>Tentar novamente</button></div> : null}
    <div className="tasks-team-summary">{busy ? 'Carregando processos da equipe…' : `${filtered.length} processo(s) ${filtered.length !== rows.length ? `de ${rows.length}` : ''}`}</div>
    <div className="tasks-team-table-wrap">
      <table className="tasks-team-table">
        <thead><tr><th>Processo</th><th>Analista responsável</th><th>Situação</th><th>Classificação / indício</th><th>Atualizado</th></tr></thead>
        <tbody>
          {!busy && task && filtered.slice(safePage * PAGE_SIZE, (safePage + 1) * PAGE_SIZE).map(process =>
            <tr key={process.id}>
              <td><strong>{process.case_number || 'Sem número'}</strong></td>
              <td>{assigneeName(task, process)}</td>
              <td>{PROCESS_STATUS_LABELS[normalize(process.status)] || process.status || 'Pendente'}</td>
              <td>{classification(process)}</td>
              <td>{process.updated_at ? new Date(process.updated_at).toLocaleString('pt-BR') : '—'}</td>
            </tr>
          )}
          {!busy && !filtered.length ? <tr><td colSpan={5}>Nenhum processo encontrado neste filtro.</td></tr> : null}
        </tbody>
      </table>
    </div>
    <footer className="tasks-team-pagination">
      <span>Página {safePage + 1} de {pages}</span>
      <div>
        <button type="button" disabled={safePage <= 0 || busy} onClick={() => setPage(value => Math.max(0, value - 1))}>Anterior</button>
        <button type="button" disabled={safePage >= pages - 1 || busy} onClick={() => setPage(value => Math.min(pages - 1, value + 1))}>Próximos</button>
      </div>
    </footer>
  </section>;
}
