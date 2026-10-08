import { useEffect, useMemo, useState } from 'react';
import { Eye, Search, ShieldCheck } from 'lucide-react';
import { SelectMenu } from '../dashboard/SelectMenu';
import {
  normalize,
  pendingCount,
  taskTypeLabel,
  type Task,
  type TaskProcess,
} from './model';
import type { ApiRequest } from './renderers';
import './taskOversight.css';

type FilterOption = { value: string; label: string };

type Props = {
  tasks: Task[];
  api: ApiRequest;
  selectedTaskId: string | null;
  onSelectTask: (taskId: string) => void;
  loadingTasks: boolean;
};

const PAGE_SIZE = 30;

function statusLabel(value: unknown) {
  return ({
    pending: 'Pendente',
    waiting: 'Reagendado',
    in_progress: 'Em execução',
    completed: 'Concluído',
    inactive: 'Inativo',
    cancelled: 'Cancelado',
  } as Record<string, string>)[normalize(value)] || String(value || 'Pendente');
}

function displayDate(raw: unknown) {
  if (!raw) return '—';
  const date = new Date(String(raw));
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString('pt-BR');
}

export function TaskOversight({ tasks, api, selectedTaskId, onSelectTask, loadingTasks }: Props) {
  const [assignee, setAssignee] = useState('all');
  const [taskType, setTaskType] = useState('all');
  const [status, setStatus] = useState('all');
  const [query, setQuery] = useState('');
  const [processes, setProcesses] = useState<TaskProcess[]>([]);
  const [loadingProcesses, setLoadingProcesses] = useState(false);
  const [processError, setProcessError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);
  const [page, setPage] = useState(0);
  const [selectedProcessId, setSelectedProcessId] = useState<string | null>(null);

  const people = useMemo(() => {
    const entries = new Map<string, string>();
    for (const task of tasks) {
      if (task.responsible_id) {
        entries.set(String(task.responsible_id), task.responsible_name || String(task.responsible_id));
      }
      (task.participant_user_ids || []).forEach((id, index) => {
        entries.set(String(id), task.participant_names?.[index] || entries.get(String(id)) || String(id));
      });
    }
    return entries;
  }, [tasks]);

  const peopleOptions = useMemo<FilterOption[]>(
    () => [{ value: 'all', label: 'Todos os colaboradores' }, ...[...people.entries()]
      .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
      .map(([value, label]) => ({ value, label }))],
    [people],
  );

  const taskTypes = useMemo<FilterOption[]>(
    () => [{ value: 'all', label: 'Todos os tipos' }, ...[...new Set(tasks.map(task => normalize(task.type)))]
      .sort().map(type => ({ value: type, label: taskTypeLabel(type) }))],
    [tasks],
  );

  const filteredTasks = useMemo(
    () => tasks.filter(task => (
      (taskType === 'all' || normalize(task.type) === taskType)
      && (assignee === 'all' || task.responsible_id === assignee
        || (task.participant_user_ids || []).includes(assignee))
    )),
    [tasks, taskType, assignee],
  );

  const selectedTask = filteredTasks.find(task => task.id === selectedTaskId) || filteredTasks[0] || null;

  useEffect(() => {
    if (selectedTask && selectedTask.id !== selectedTaskId) onSelectTask(selectedTask.id);
  }, [selectedTask?.id, selectedTaskId, onSelectTask]);

  useEffect(() => {
    let cancelled = false;
    setProcesses([]);
    setProcessError(null);
    setSelectedProcessId(null);
    setPage(0);
    if (!selectedTask?.id) {
      setLoadingProcesses(false);
      return;
    }
    setLoadingProcesses(true);
    api(`/api/tasks/${encodeURIComponent(selectedTask.id)}/processes`)
      .then(rows => {
        if (!cancelled) setProcesses(Array.isArray(rows) ? rows : []);
      })
      .catch(error => {
        if (!cancelled) setProcessError(error?.message || 'Não foi possível consultar os processos.');
      })
      .finally(() => {
        if (!cancelled) setLoadingProcesses(false);
      });
    return () => { cancelled = true; };
  }, [api, selectedTask?.id, reloadKey]);

  const filteredProcesses = useMemo(() => {
    const needle = query.trim().toLowerCase();
    const digits = needle.replace(/\D/g, '');
    return processes.filter(process => {
      if (assignee !== 'all' && String(process.assignee_id || '') !== assignee) return false;
      if (status !== 'all' && normalize(process.status) !== status) return false;
      if (!needle) return true;
      const number = String(process.case_number || '').toLowerCase();
      return number.includes(needle) || (digits.length > 0 && number.replace(/\D/g, '').includes(digits))
        || String(process.party_name || '').toLowerCase().includes(needle);
    });
  }, [processes, assignee, status, query]);

  useEffect(() => { setPage(0); setSelectedProcessId(null); }, [assignee, status, query, selectedTask?.id]);

  const pageCount = Math.max(1, Math.ceil(filteredProcesses.length / PAGE_SIZE));
  const pageIndex = Math.min(page, pageCount - 1);
  const rowsOnPage = filteredProcesses.slice(pageIndex * PAGE_SIZE, (pageIndex + 1) * PAGE_SIZE);
  const selectedProcess = filteredProcesses.find(process => process.id === selectedProcessId) || null;

  return (
    <section className="tasks-oversight" aria-label="Todas as tarefas da carteira">
      <header className="tasks-oversight-header">
        <div>
          <div className="tasks-oversight-eyebrow"><Eye size={14} /> VISÃO DE SUPERVISÃO</div>
          <h1>Tarefas dos colaboradores</h1>
          <p>Consulte os lotes e processos da carteira selecionada, sem interferir na execução dos responsáveis.</p>
        </div>
        <span className="tasks-oversight-readonly"><ShieldCheck size={14} /> Somente leitura</span>
      </header>
      <div className="tasks-oversight-filters">
        <SelectMenu label="Colaborador" value={assignee} options={peopleOptions} onChange={setAssignee} />
        <SelectMenu label="Tipo de tarefa" value={taskType} options={taskTypes} onChange={setTaskType} />
        <SelectMenu label="Situação do processo" value={status} options={[
          { value: 'all', label: 'Todas as situações' },
          { value: 'pending', label: 'Pendente' },
          { value: 'in_progress', label: 'Em execução' },
          { value: 'waiting', label: 'Reagendado' },
          { value: 'completed', label: 'Concluído' },
        ]} onChange={setStatus} />
        <label className="tasks-oversight-search"><Search size={15} /><input value={query} onChange={event => setQuery(event.target.value)} placeholder="Buscar CNJ ou parte" aria-label="Buscar processo por CNJ ou parte" /></label>
      </div>

      <div className="tasks-oversight-content">
        <aside className="tasks-oversight-lots">
          <div className="tasks-oversight-section-title">Lotes <strong>{filteredTasks.length}</strong></div>
          <div className="tasks-oversight-lots-list">
            {filteredTasks.map(task => (
              <button key={task.id} type="button" className={`tasks-oversight-lot ${selectedTask?.id === task.id ? 'selected' : ''}`}
                onClick={() => onSelectTask(task.id)} aria-pressed={selectedTask?.id === task.id}>
                <strong>{task.title || taskTypeLabel(task.type)}</strong>
                <span>{taskTypeLabel(task.type)} · {statusLabel(task.status)}</span>
                <small>{pendingCount(task)} pendente(s) de {task.total_processes || 0}</small>
              </button>
            ))}
            {!filteredTasks.length && <p className="tasks-oversight-empty">{loadingTasks ? 'Carregando lotes…' : 'Nenhum lote encontrado para os filtros selecionados.'}</p>}
          </div>
        </aside>

        <main className="tasks-oversight-processes">
          {selectedTask ? <>
            <header className="tasks-oversight-task-heading">
              <div><small>LOTE SELECIONADO</small><h2>{selectedTask.title || taskTypeLabel(selectedTask.type)}</h2>
                <p>{selectedTask.description || taskTypeLabel(selectedTask.type)}</p>
              </div>
              <div className="tasks-oversight-count"><strong>{filteredProcesses.length}</strong><span>processos exibidos</span></div>
            </header>
            {processError && <div className="tasks-oversight-error" role="alert">{processError} <button type="button" onClick={() => setReloadKey(value => value + 1)}>Tentar novamente</button></div>}
            {loadingProcesses ? <p className="tasks-oversight-empty">Consultando processos do lote…</p> : (
              <div className="tasks-oversight-table-wrap">
                <table className="tasks-oversight-table">
                  <thead><tr><th>Processo</th><th>Colaborador</th><th>Situação</th><th>Classificação inicial</th><th>Atualizado em</th></tr></thead>
                  <tbody>
                    {rowsOnPage.map(process => (
                      <tr key={process.id} className={selectedProcessId === process.id ? 'selected' : ''}>
                        <td><button type="button" className="tasks-oversight-process-open" onClick={() => setSelectedProcessId(current => current === process.id ? null : process.id)} aria-label={`Consultar processo ${process.case_number || ''}`}>{process.case_number || 'Sem número'}</button></td>
                        <td>{people.get(String(process.assignee_id || '')) || (process.assignee_id ? 'Usuário atribuído' : 'Não atribuído')}</td>
                        <td><span className={`tasks-oversight-status ${normalize(process.status)}`}>{statusLabel(process.status)}</span></td>
                        <td>{String(process.source_metadata?.classifier_classification || '—')}</td>
                        <td>{displayDate(process.updated_at)}</td>
                      </tr>
                    ))}
                    {!rowsOnPage.length && <tr><td colSpan={5} className="tasks-oversight-no-results">{processError ? 'Falha na consulta.' : 'Nenhum processo corresponde aos filtros.'}</td></tr>}
                  </tbody>
                </table>
              </div>
            )}
            {selectedProcess && <div className="tasks-oversight-details" role="region" aria-label="Detalhes do processo em somente leitura">
              <div><strong>{selectedProcess.case_number}</strong><span>{selectedProcess.party_name || 'Parte não informada'}</span></div>
              <div><small>Responsável</small><strong>{people.get(String(selectedProcess.assignee_id || '')) || 'Não informado'}</strong></div>
              <div><small>Status</small><strong>{statusLabel(selectedProcess.status)}</strong></div>
              <div><small>Indício do classificador</small><strong>{selectedProcess.source_metadata?.classifier_classification || 'Não informado'}</strong></div>
              <button type="button" onClick={() => setSelectedProcessId(null)}>Fechar detalhes</button>
            </div>}
            <footer className="tasks-oversight-pagination">
              <span>{filteredProcesses.length ? (pageIndex * PAGE_SIZE + 1) : 0}–{Math.min((pageIndex + 1) * PAGE_SIZE, filteredProcesses.length)} de {filteredProcesses.length} processos</span>
              <div><button type="button" disabled={pageIndex === 0} onClick={() => setPage(pageIndex - 1)}>Anterior</button><span>Página {pageIndex + 1} de {pageCount}</span><button type="button" disabled={pageIndex + 1 >= pageCount} onClick={() => setPage(pageIndex + 1)}>Próxima</button></div>
            </footer>
          </> : <div className="tasks-oversight-empty">Selecione um lote para consultar os processos.</div>}
        </main>
      </div>
    </section>
  );
}
