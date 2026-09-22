import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, Trash2, UserPlus } from 'lucide-react';
import {
  TASK_STATE_META,
  TASK_STATE_ORDER,
  canManageTasks,
  compareTasks,
  compareWorkItems,
  formatDate,
  indicationLabel,
  isTaskActive,
  normalize,
  pendingCount,
  processAssignedToUser,
  taskAssignedToUser,
  taskState,
  taskTypeLabel,
  workItemKey,
  type MbaUser,
  type Task,
  type TaskProcess,
  type TaskStateKey,
  type WorkItem,
} from './model';
import {
  AgreementRenderer,
  LiminarRenderer,
  PaymentRenderer,
  UnsupportedRenderer,
  type ApiRequest,
} from './renderers';
import './tasks.css';

const CACHE_SIZE = 5;
const REFRESH_MS = 20000;
const LAST_TASK_TYPE_KEY = 'mba-last-task-type';
const HYDRATION_CONCURRENCY = 3;

type MbaWindow = Window & typeof globalThis & {
  MBA_CURRENT_USER?: MbaUser | null;
  MBA_API?: { request: ApiRequest };
  MBA_TASK_IMPORT?: {
    createTaskWithImportedProcesses: (payload: Record<string, any>, file: File) => Promise<{ rowsImported?: number; rowsSkipped?: number }>;
  };
};

const mbaWindow = window as MbaWindow;

const apiRequest: ApiRequest = (path, options) => {
  if (!mbaWindow.MBA_API) return Promise.reject(new Error('A API ainda não está disponível.'));
  return mbaWindow.MBA_API.request(path, options);
};

function useTasksPageVisible() {
  const [visible, setVisible] = useState(() => document.getElementById('tarefas')?.classList.contains('active') === true);
  useEffect(() => {
    const page = document.getElementById('tarefas');
    if (!page) return undefined;
    const sync = () => setVisible(page.classList.contains('active') && !document.hidden);
    const observer = new MutationObserver(sync);
    observer.observe(page, { attributes: true, attributeFilter: ['class'] });
    document.addEventListener('visibilitychange', sync);
    sync();
    return () => {
      observer.disconnect();
      document.removeEventListener('visibilitychange', sync);
    };
  }, []);
  return visible;
}

function taskStatusLabel(status: unknown) {
  const key = normalize(status);
  return ({ pending: 'Pendente', in_progress: 'Em execução', completed: 'Concluída', cancelled: 'Cancelada', inactive: 'Inativa' } as Record<string, string>)[key] || String(status || 'Pendente');
}

function taskPendingRows(tasks: Task[], status?: TaskStateKey, type?: string) {
  return tasks.filter(task => (!status || taskState(task) === status) && (!type || type === 'all' || normalize(task.type) === type));
}

function CreateTaskModal({ onClose, onCreated }: { onClose: () => void; onCreated: () => Promise<void> }) {
  const [type, setType] = useState('liminar');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [participants, setParticipants] = useState<string[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Array<{ id: string; name?: string; email?: string }>>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const baseMode = type === 'base_benner' || type === 'base_cpj';

  useEffect(() => {
    if (type !== 'acordos') {
      setParticipants([]);
      setAvailableUsers([]);
      return;
    }
    let cancelled = false;
    apiRequest('/api/task-assignees?module=acordos')
      .then(rows => { if (!cancelled) setAvailableUsers(Array.isArray(rows) ? rows : []); })
      .catch(cause => { if (!cancelled) setError(cause?.message || 'Não foi possível carregar os participantes.'); });
    return () => { cancelled = true; };
  }, [type]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!file) {
      setError('Selecione a planilha de importação.');
      return;
    }
    if (baseMode && !/\.xlsx$/i.test(file.name)) {
      setError('A importação da base exige uma planilha XLSX.');
      return;
    }
    if (!baseMode && !/\.(xlsx|csv)$/i.test(file.name)) {
      setError('Selecione uma planilha XLSX ou CSV.');
      return;
    }
    if (!baseMode && !title.trim()) {
      setError('Informe o título da tarefa.');
      return;
    }
    if (type === 'acordos' && !participants.length) {
      setError('Selecione ao menos um participante para Acordos.');
      return;
    }

    setBusy(true);
    setError(null);
    try {
      if (baseMode) {
        const body = new FormData();
        body.append('file', file);
        const endpoint = type === 'base_benner' ? '/api/base-processual/benner/importar' : '/api/base-processual/cpj/importar';
        const result = await apiRequest(endpoint, { method: 'POST', body });
        const imported = result?.importacao?.valid_rows;
        window.alert(Number.isFinite(Number(imported)) ? `Base importada: ${imported} linha(s) válida(s).` : 'Base importada com sucesso.');
      } else {
        if (!mbaWindow.MBA_TASK_IMPORT) throw new Error('O módulo de importação de tarefas ainda não está disponível.');
        const result = await mbaWindow.MBA_TASK_IMPORT.createTaskWithImportedProcesses({
          type,
          title: title.trim(),
          description: description.trim() || null,
          priority,
          deadline_at: deadline || null,
          responsible_id: null,
          participant_user_ids: type === 'acordos' ? participants : [],
          source: 'manual_upload',
        }, file);
        window.alert(`Tarefa criada: ${result.rowsImported || 0} processo(s) importado(s)${result.rowsSkipped ? `; ${result.rowsSkipped} ignorado(s)` : ''}.`);
        await onCreated();
      }
      onClose();
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível concluir a importação.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="task-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose(); }}>
      <form className="task-react-modal" role="dialog" aria-modal="true" aria-label="Nova tarefa" onSubmit={submit}>
        <header><div><h2>{baseMode ? 'Importar base processual' : 'Nova tarefa'}</h2><p>{baseMode ? 'Atualize a base processual a partir da planilha bruta.' : 'Crie o lote e importe os processos.'}</p></div><button type="button" className="task-modal-close" disabled={busy} onClick={onClose}>×</button></header>
        <label className="task-select-field"><span>Tipo</span><select value={type} disabled={busy} onChange={event => setType(event.target.value)}>
          <option value="liminar">Liminar</option><option value="comprovante_pagamento">Comprovante de Pagamento</option><option value="acordos">Acordos</option><option value="encerramento">Encerramento</option><option value="bloqueio">Bloqueio</option><option value="citacao">Citação</option><option value="protocolo">Protocolo</option><option value="base_benner">Upload - Base do Benner</option><option value="base_cpj">Upload - Base do CPJ</option>
        </select></label>
        {!baseMode ? <><label className="task-text-field"><span>Título</span><input value={title} maxLength={160} disabled={busy} onChange={event => setTitle(event.target.value)} /></label><label className="task-text-field"><span>Descrição</span><textarea value={description} rows={3} disabled={busy} onChange={event => setDescription(event.target.value)} /></label><div className="task-modal-grid"><label className="task-select-field"><span>Prioridade</span><select value={priority} disabled={busy} onChange={event => setPriority(event.target.value)}><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta — Urgente</option></select></label><label className="task-text-field"><span>Prazo</span><input type="datetime-local" value={deadline} disabled={busy} onChange={event => setDeadline(event.target.value)} /></label></div></> : null}
        {type === 'acordos' ? <fieldset className="task-participants"><legend>Participantes</legend><p>Selecione quem participará da força-tarefa.</p>{availableUsers.length ? availableUsers.map(userOption => <label key={userOption.id}><input type="checkbox" checked={participants.includes(userOption.id)} disabled={busy} onChange={event => setParticipants(current => event.target.checked ? [...current, userOption.id] : current.filter(id => id !== userOption.id))} /><span>{userOption.name || userOption.email || userOption.id}</span></label>) : <small>Nenhum usuário apto disponível.</small>}</fieldset> : null}
        <label className="task-text-field"><span>Planilha</span><input type="file" accept={baseMode || type === 'acordos' ? '.xlsx' : '.xlsx,.csv'} disabled={busy} onChange={event => setFile(event.target.files?.[0] || null)} /><small>{baseMode ? 'Envie a planilha XLSX bruta da execução mais recente.' : type === 'acordos' ? 'O XLSX deve conter Processo e Provisão.' : type === 'comprovante_pagamento' ? 'O arquivo deve conter Processo, Pasta e Situação.' : 'Importe XLSX ou CSV conforme o padrão da tarefa.'}</small></label>
        {error ? <p className="task-renderer-error" role="alert">{error}</p> : null}
        <footer><button className="secondary-button" type="button" disabled={busy} onClick={onClose}>Cancelar</button><button className="primary-button" type="submit" disabled={busy}>{busy ? 'Processando…' : baseMode ? 'Importar base' : 'Criar e importar'}</button></footer>
      </form>
    </div>
  );
}

function AssignTaskModal({ task, onClose, onAssigned }: { task: Task; onClose: () => void; onAssigned: () => Promise<void> }) {
  const [users, setUsers] = useState<Array<{ id: string; name?: string; email?: string }>>([]);
  const [selected, setSelected] = useState<string[]>(() => task.participant_user_ids || (task.responsible_id ? [task.responsible_id] : []));
  const [priority, setPriority] = useState(['low', 'medium', 'high'].includes(String(task.priority)) ? String(task.priority) : 'medium');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    apiRequest(`/api/task-assignees?module=${encodeURIComponent(task.type)}`)
      .then(rows => { if (!cancelled) setUsers(Array.isArray(rows) ? rows : []); })
      .catch(cause => { if (!cancelled) setError(cause?.message || 'Não foi possível carregar os usuários.'); });
    return () => { cancelled = true; };
  }, [task.id, task.type]);

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!selected.length) {
      setError('Selecione ao menos um usuário ativo.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await apiRequest(`/api/tasks/${task.id}`, { method: 'PATCH', body: JSON.stringify({ participant_user_ids: selected, priority }) });
      await onAssigned();
      onClose();
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível salvar a atribuição.');
    } finally {
      setBusy(false);
    }
  };

  return <div className="task-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose(); }}><form className="task-react-modal" role="dialog" aria-modal="true" aria-label="Atribuir tarefa" onSubmit={submit}><header><div><h2>Atribuir tarefa</h2><p>{taskTypeLabel(task.type)}</p></div><button type="button" className="task-modal-close" disabled={busy} onClick={onClose}>×</button></header><label className="task-select-field"><span>Prioridade da atribuição</span><select value={priority} disabled={busy} onChange={event => setPriority(event.target.value)}><option value="high">Alta — Urgente</option><option value="medium">Média</option><option value="low">Baixa</option></select><small>Urgente é definido explicitamente aqui; prazo de hoje não eleva a tarefa automaticamente.</small></label><fieldset className="task-participants"><legend>Usuários ativos</legend><p>Os processos atribuídos pelo backend ficam visíveis somente ao respectivo usuário.</p>{users.length ? users.map(userOption => <label key={userOption.id}><input type="checkbox" checked={selected.includes(userOption.id)} disabled={busy} onChange={event => setSelected(current => event.target.checked ? [...current, userOption.id] : current.filter(id => id !== userOption.id))} /><span>{userOption.name || userOption.email || userOption.id}</span></label>) : <small>Nenhum usuário ativo disponível.</small>}</fieldset>{error ? <p className="task-renderer-error" role="alert">{error}</p> : null}<footer><button className="secondary-button" type="button" disabled={busy} onClick={onClose}>Cancelar</button><button className="primary-button" type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar atribuição'}</button></footer></form></div>;
}

export function TasksApp() {
  const pageVisible = useTasksPageVisible();
  const [user, setUser] = useState<MbaUser | null>(() => mbaWindow.MBA_CURRENT_USER || null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [processVersion, setProcessVersion] = useState(0);
  const processCache = useRef(new Map<string, TaskProcess[]>());
  const inFlight = useRef(new Map<string, Promise<TaskProcess[]>>());
  const refreshGeneration = useRef(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<'management' | 'execution'>('execution');
  const [selectedStatus, setSelectedStatus] = useState<TaskStateKey>('urgent');
  const [selectedType, setSelectedType] = useState('all');
  const [search, setSearch] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignTask, setAssignTask] = useState<Task | null>(null);

  const manager = canManageTasks(user);
  const allAssignedTasks = useMemo(
    () => tasks.filter(task => taskAssignedToUser(task, user, manager)).sort(compareTasks),
    [tasks, user, manager],
  );
  const relevantTasks = useMemo(() => allAssignedTasks.filter(isTaskActive), [allAssignedTasks]);

  useEffect(() => {
    const onAuth = () => setUser(mbaWindow.MBA_CURRENT_USER || null);
    const onExpired = () => {
      setUser(null);
      setTasks([]);
      processCache.current.clear();
      setProcessVersion(value => value + 1);
      setActiveKey(null);
    };
    window.addEventListener('mba:authenticated', onAuth);
    window.addEventListener('mba:session-expired', onExpired);
    return () => {
      window.removeEventListener('mba:authenticated', onAuth);
      window.removeEventListener('mba:session-expired', onExpired);
    };
  }, []);

  useEffect(() => {
    if (pageVisible && mbaWindow.MBA_CURRENT_USER) setUser(mbaWindow.MBA_CURRENT_USER);
  }, [pageVisible]);

  const hydrateTask = useCallback(async (task: Task, force = false) => {
    if (!force && processCache.current.has(task.id)) return processCache.current.get(task.id) || [];
    if (inFlight.current.has(task.id)) return inFlight.current.get(task.id)!;

    const promise = apiRequest(`/api/tasks/${task.id}/processes`)
      .then(rows => {
        const list = (Array.isArray(rows) ? rows : []).filter(process => processAssignedToUser(task, process, user, manager));
        processCache.current.set(task.id, list);
        setProcessVersion(value => value + 1);
        return list;
      })
      .finally(() => inFlight.current.delete(task.id));
    inFlight.current.set(task.id, promise);
    return promise;
  }, [user, manager]);

  const hydrateInBackground = useCallback(async (taskList: Task[], generation: number) => {
    const missing = taskList.filter(task => !processCache.current.has(task.id));
    for (let index = 0; index < missing.length; index += HYDRATION_CONCURRENCY) {
      if (refreshGeneration.current !== generation) return;
      const chunk = missing.slice(index, index + HYDRATION_CONCURRENCY);
      await Promise.allSettled(chunk.map(task => hydrateTask(task)));
    }
  }, [hydrateTask]);

  const loadTaskList = useCallback(async (resetCache = false) => {
    if (!user?.permissions?.['tasks.view']) return;
    const generation = ++refreshGeneration.current;
    setLoading(true);
    setLoadError(null);
    try {
      const rows = await apiRequest('/api/tasks');
      const nextTasks = Array.isArray(rows) ? rows as Task[] : [];
      if (resetCache) {
        processCache.current.clear();
        setProcessVersion(value => value + 1);
        setActiveKey(null);
      }
      setTasks(nextTasks);

      const available = nextTasks.filter(task => isTaskActive(task) && taskAssignedToUser(task, user, manager)).sort(compareTasks);
      if (!available.length) {
        setActiveKey(null);
        return;
      }

      const preferredType = normalize(sessionStorage.getItem(LAST_TASK_TYPE_KEY));
      const preferred = available.find(task => normalize(task.type) === preferredType) || available[0];
      const initialRows = await hydrateTask(preferred, resetCache);
      if (refreshGeneration.current !== generation) return;
      const first = initialRows.filter(process => normalize(process.status) !== 'completed').sort((a, b) => Number(a.position ?? Number.MAX_SAFE_INTEGER) - Number(b.position ?? Number.MAX_SAFE_INTEGER))[0];
      if (first && (resetCache || !activeKey)) {
        setSelectedStatus(taskState(preferred));
        setSelectedType('all');
        setActiveKey(`${preferred.id}:${first.id}`);
      }
      void hydrateInBackground(available.filter(task => task.id !== preferred.id), generation);
    } catch (cause: any) {
      setLoadError(cause?.message || 'Não foi possível carregar as tarefas.');
    } finally {
      if (refreshGeneration.current === generation) setLoading(false);
    }
  }, [user, manager, hydrateTask, hydrateInBackground, activeKey]);

  useEffect(() => {
    if (!pageVisible || !user?.permissions?.['tasks.view']) return;
    void loadTaskList(false);
  }, [pageVisible, user?.id, user?.permissions?.['tasks.view']]);

  useEffect(() => {
    if (!pageVisible || !user?.permissions?.['tasks.view']) return undefined;
    const timer = window.setInterval(async () => {
      try {
        const rows = await apiRequest('/api/tasks');
        const freshTasks = Array.isArray(rows) ? rows as Task[] : [];
        setTasks(freshTasks);
        const activeTaskId = activeKey?.split(':')[0];
        const task = freshTasks.find(item => String(item.id) === String(activeTaskId));
        if (task) await hydrateTask(task, true);
      } catch (_error) {
        // Atualização silenciosa: preserva a fila atual em caso de falha transitória.
      }
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [pageVisible, user?.id, activeKey, hydrateTask]);

  const workItems = useMemo(() => {
    void processVersion;
    const result: WorkItem[] = [];
    for (const task of relevantTasks) {
      const rows = processCache.current.get(task.id) || [];
      for (const process of rows) {
        if (normalize(process.status) === 'completed') continue;
        result.push({ task, process });
      }
    }
    return result.sort(compareWorkItems);
  }, [relevantTasks, processVersion]);

  const pendingForTask = useCallback((task: Task) => {
    void processVersion;
    const rows = processCache.current.get(task.id);
    if (rows) return rows.filter(process => normalize(process.status) !== 'completed').length;
    return pendingCount(task);
  }, [processVersion]);

  const statusCounts = useMemo(() => {
    const counts = Object.fromEntries(TASK_STATE_ORDER.map(key => [key, 0])) as Record<TaskStateKey, number>;
    relevantTasks.forEach(task => { counts[taskState(task)] += pendingForTask(task); });
    return counts;
  }, [relevantTasks, pendingForTask]);

  useEffect(() => {
    if (statusCounts[selectedStatus] > 0) return;
    const fallback = TASK_STATE_ORDER.find(key => statusCounts[key] > 0);
    if (fallback) setSelectedStatus(fallback);
  }, [statusCounts, selectedStatus]);

  const typeCounts = useMemo(() => {
    const counts = new Map<string, number>();
    taskPendingRows(relevantTasks, selectedStatus).forEach(task => counts.set(normalize(task.type), (counts.get(normalize(task.type)) || 0) + pendingForTask(task)));
    return counts;
  }, [relevantTasks, selectedStatus, pendingForTask]);

  const types = useMemo(() => [...new Set(relevantTasks.map(task => normalize(task.type)).filter(Boolean))].sort((a, b) => taskTypeLabel(a).localeCompare(taskTypeLabel(b), 'pt-BR')), [relevantTasks]);

  const filteredItems = useMemo(() => workItems.filter(item => {
    if (taskState(item.task) !== selectedStatus) return false;
    if (selectedType !== 'all' && normalize(item.task.type) !== selectedType) return false;
    if (!search.trim()) return true;
    const haystack = `${item.process.case_number || ''} ${item.process.party_name || ''} ${taskTypeLabel(item.task.type)} ${indicationLabel(item.task, item.process)}`.toLowerCase();
    return haystack.includes(search.trim().toLowerCase());
  }), [workItems, selectedStatus, selectedType, search]);

  useEffect(() => {
    if (!pageVisible) return;
    const candidates = taskPendingRows(relevantTasks, selectedStatus, selectedType).filter(task => !processCache.current.has(task.id));
    if (!candidates.length) return;
    const generation = refreshGeneration.current;
    void hydrateInBackground(candidates, generation);
  }, [pageVisible, selectedStatus, selectedType, relevantTasks, hydrateInBackground]);

  useEffect(() => {
    if (!filteredItems.length) {
      setActiveKey(null);
      return;
    }
    if (!activeKey || !filteredItems.some(item => workItemKey(item) === activeKey)) setActiveKey(workItemKey(filteredItems[0]));
  }, [filteredItems, activeKey]);

  const activeItem = useMemo(() => workItems.find(item => workItemKey(item) === activeKey) || null, [workItems, activeKey]);
  const activeIndex = filteredItems.findIndex(item => workItemKey(item) === activeKey);
  const windowStart = activeIndex >= 0 ? Math.floor(activeIndex / CACHE_SIZE) * CACHE_SIZE : 0;
  const visibleItems = filteredItems.slice(windowStart, windowStart + CACHE_SIZE);

  const chooseNext = useCallback((completedKey: string) => {
    const index = filteredItems.findIndex(item => workItemKey(item) === completedKey);
    const next = filteredItems[index + 1] || filteredItems.find(item => workItemKey(item) !== completedKey) || null;
    setActiveKey(next ? workItemKey(next) : null);
  }, [filteredItems]);

  const markCompleted = useCallback((task: Task, process: TaskProcess) => {
    const key = `${task.id}:${process.id}`;
    chooseNext(key);
    const rows = processCache.current.get(task.id) || [];
    processCache.current.set(task.id, rows.map(row => String(row.id) === String(process.id) ? { ...row, status: 'completed', updated_at: new Date().toISOString() } : row));
    setTasks(current => current.map(row => String(row.id) === String(task.id) ? { ...row, completed_processes: Number(row.completed_processes || 0) + 1 } : row));
    setProcessVersion(value => value + 1);
    window.setTimeout(() => { void hydrateTask(task, true); }, 250);
  }, [chooseNext, hydrateTask]);

  const markSkipped = useCallback((task: Task, process: TaskProcess) => {
    const rows = [...(processCache.current.get(task.id) || [])];
    const index = rows.findIndex(row => String(row.id) === String(process.id));
    if (index >= 0) {
      const [skipped] = rows.splice(index, 1);
      rows.push(skipped);
      processCache.current.set(task.id, rows);
      setProcessVersion(value => value + 1);
    }
    const key = `${task.id}:${process.id}`;
    const currentIndex = filteredItems.findIndex(item => workItemKey(item) === key);
    const next = filteredItems[currentIndex + 1] || filteredItems.find(item => workItemKey(item) !== key) || null;
    setActiveKey(next ? workItemKey(next) : key);
    window.setTimeout(() => { void hydrateTask(task, true); }, 250);
  }, [filteredItems, hydrateTask]);

  const alignAgreement = useCallback((task: Task, agreement: TaskProcess | null) => {
    if (!agreement) return;
    const rows = processCache.current.get(task.id) || [];
    const match = rows.find(row => String(row.id) === String(agreement.id)) || rows.find(row => String(row.case_number || '') === String(agreement.case_number || ''));
    if (match) setActiveKey(`${task.id}:${match.id}`);
  }, []);

  const completeAgreement = useCallback((task: Task, previous: TaskProcess, next: TaskProcess | null) => {
    const rows = processCache.current.get(task.id) || [];
    const match = rows.find(row => String(row.id) === String(previous.id)) || rows.find(row => String(row.case_number || '') === String(previous.case_number || ''));
    if (match) {
      processCache.current.set(task.id, rows.map(row => String(row.id) === String(match.id) ? { ...row, status: 'completed', updated_at: new Date().toISOString() } : row));
      setTasks(current => current.map(row => String(row.id) === String(task.id) ? { ...row, completed_processes: Number(row.completed_processes || 0) + 1 } : row));
      setProcessVersion(value => value + 1);
    }
    if (next) alignAgreement(task, next);
    else setActiveKey(null);
    window.setTimeout(() => { void hydrateTask(task, true); }, 250);
  }, [alignAgreement, hydrateTask]);

  const skipAgreement = useCallback((task: Task, previous: TaskProcess, next: TaskProcess | null) => {
    const rows = [...(processCache.current.get(task.id) || [])];
    const index = rows.findIndex(row => String(row.id) === String(previous.id) || String(row.case_number || '') === String(previous.case_number || ''));
    if (index >= 0) {
      const [skipped] = rows.splice(index, 1);
      rows.push(skipped);
      processCache.current.set(task.id, rows);
      setProcessVersion(value => value + 1);
    }
    if (next) alignAgreement(task, next);
    window.setTimeout(() => { void hydrateTask(task, true); }, 250);
  }, [alignAgreement, hydrateTask]);

  const selectItem = (item: WorkItem) => {
    if (normalize(item.task.type) === 'acordos' && activeItem?.task.id === item.task.id) return;
    sessionStorage.setItem(LAST_TASK_TYPE_KEY, normalize(item.task.type));
    setActiveKey(workItemKey(item));
  };

  const executeTask = async (task: Task) => {
    if (!isTaskActive(task) || pendingCount(task) <= 0) return;
    setTab('execution');
    setSelectedStatus(taskState(task));
    setSelectedType(normalize(task.type));
    sessionStorage.setItem(LAST_TASK_TYPE_KEY, normalize(task.type));
    const rows = await hydrateTask(task);
    const first = rows.filter(process => normalize(process.status) !== 'completed').sort((a, b) => Number(a.position ?? Number.MAX_SAFE_INTEGER) - Number(b.position ?? Number.MAX_SAFE_INTEGER))[0];
    setActiveKey(first ? `${task.id}:${first.id}` : null);
  };

  const deleteTask = async (task: Task) => {
    const pending = pendingCount(task);
    if (!window.confirm(`Excluir o lote "${task.title || taskTypeLabel(task.type)}"?\n\n${pending} pendência(s) deixarão de aparecer. O histórico será preservado.`)) return;
    try {
      await apiRequest(`/api/tasks/${task.id}`, { method: 'DELETE' });
      processCache.current.delete(task.id);
      await loadTaskList(true);
    } catch (cause: any) {
      window.alert(cause?.message || 'Não foi possível excluir a tarefa.');
    }
  };

  if (!user?.permissions?.['tasks.view']) return <div className="tasks-react-state"><strong>Sem acesso ao módulo de tarefas</strong><span>Solicite a autorização tasks.view.</span></div>;

  const activeState = activeItem ? taskState(activeItem.task) : null;

  return <div className="tasks-react-root">
    <nav className="analytics-subnav tasks-react-subnav" aria-label="Tarefas">
      {manager ? <button type="button" className={tab === 'management' ? 'active' : ''} onClick={() => setTab('management')}>Gestão</button> : null}
      <button type="button" className={tab === 'execution' ? 'active' : ''} onClick={() => setTab('execution')}>Tarefas</button>
    </nav>

    {tab === 'management' && manager ? <section className="tasks-management-view"><div className="tasks-management-header"><div><h1>Gestão de Tarefas</h1><p>Crie, distribua e acompanhe os lotes operacionais.</p></div><button className="primary-button" type="button" onClick={() => setCreateOpen(true)}><Plus size={15} />Nova tarefa</button></div><div className="tasks-management-table-wrap"><table className="tasks-management-table"><thead><tr><th>Tarefa</th><th>Tipo</th><th>Pendências</th><th>Status</th><th>Atualização</th><th></th></tr></thead><tbody>{allAssignedTasks.length ? allAssignedTasks.map(task => <tr key={task.id}><td><strong>{task.title || taskTypeLabel(task.type)}</strong><small>{task.description || 'Sem descrição'}</small></td><td>{taskTypeLabel(task.type)}</td><td>{pendingCount(task)}</td><td><span className={`tasks-state-pill ${taskState(task)}`}>{TASK_STATE_META[taskState(task)].singular}</span><small>{taskStatusLabel(task.status)}</small></td><td>{task.updated_at ? new Date(task.updated_at).toLocaleString('pt-BR') : 'Sem atualização'}</td><td><div className="tasks-row-actions"><button type="button" className="secondary-button" disabled={!isTaskActive(task)} onClick={() => setAssignTask(task)}><UserPlus size={14} />Atribuir</button><button type="button" className="secondary-button" disabled={!isTaskActive(task) || pendingCount(task) <= 0} onClick={() => void executeTask(task)}>Executar</button>{user?.permissions?.['tasks.manage'] || user?.is_master_admin ? <button type="button" className="tasks-delete-button" title="Excluir lote" onClick={() => void deleteTask(task)}><Trash2 size={14} /></button> : null}</div></td></tr>) : <tr><td colSpan={6}>Nenhuma tarefa disponível.</td></tr>}</tbody></table></div></section> : null}

    {tab === 'execution' ? <section className="tasks-workspace"><aside className="tasks-workspace-sidebar"><section className="tasks-filter-section"><small>STATUS DO PRAZO</small><div className="tasks-filter-list">{TASK_STATE_ORDER.map(key => <button type="button" key={key} className={selectedStatus === key ? 'active' : ''} onClick={() => { setSelectedStatus(key); setActiveKey(null); }}><span><i className={`tasks-deadline-dot ${key}`} />{TASK_STATE_META[key].label}</span><em>{statusCounts[key]}</em></button>)}</div></section><section className="tasks-filter-section"><small>TIPO DE TAREFA</small><div className="tasks-filter-list"><button type="button" className={selectedType === 'all' ? 'active' : ''} onClick={() => { setSelectedType('all'); setActiveKey(null); }}><span>Todas</span><em>{[...typeCounts.values()].reduce((sum, value) => sum + value, 0)}</em></button>{types.map(type => <button type="button" key={type} className={selectedType === type ? 'active' : ''} onClick={() => { setSelectedType(type); setActiveKey(null); }}><span>{taskTypeLabel(type)}</span><em>{typeCounts.get(type) || 0}</em></button>)}</div></section><section className="tasks-process-section"><div className="tasks-process-title"><strong>PROCESSOS</strong></div><label className="tasks-process-search"><Search size={14} /><input value={search} type="search" placeholder="Buscar processo ou parte" onChange={event => setSearch(event.target.value)} /></label><div className="tasks-process-list">{visibleItems.length ? visibleItems.map(item => { const state = taskState(item.task); return <button type="button" key={workItemKey(item)} className={`tasks-process-item ${workItemKey(item) === activeKey ? 'selected' : ''}`} onClick={() => selectItem(item)}><div><strong>{item.process.case_number || 'Processo sem número'}</strong><small>{taskTypeLabel(item.task.type)}</small><small>Indício: {indicationLabel(item.task, item.process)}</small></div><span className={`tasks-state-pill ${state}`}>{TASK_STATE_META[state].singular}</span></button>; }) : <div className="tasks-sidebar-empty">{loading ? 'Carregando fila…' : 'Nenhum processo neste filtro.'}</div>}</div></section></aside><main className="tasks-execution-panel">{activeItem ? <><section className="tasks-execution-summary"><div><small>PROGRESSO</small><strong>{Number(activeItem.task.completed_processes || 0)} de {Number(activeItem.task.total_processes || 0)}</strong></div><div><small>STATUS</small><strong className={activeState || ''}>{activeState ? TASK_STATE_META[activeState].singular : '—'}</strong></div><div><small>PRAZO</small><strong>{formatDate(activeItem.task.deadline_at)}</strong></div></section><article className="tasks-renderer-card"><header><small>{taskTypeLabel(activeItem.task.type)}</small><h2>{activeItem.process.case_number || 'Processo sem número'}</h2><p>Indício: <strong>{indicationLabel(activeItem.task, activeItem.process)}</strong></p>{activeState ? <span className={`tasks-state-pill ${activeState}`}>{TASK_STATE_META[activeState].singular}</span> : null}</header><div className="tasks-renderer-body">{normalize(activeItem.task.type) === 'liminar' ? <LiminarRenderer api={apiRequest} task={activeItem.task} process={activeItem.process} onCompleted={process => markCompleted(activeItem.task, process)} onSkipped={process => markSkipped(activeItem.task, process)} /> : normalize(activeItem.task.type) === 'comprovante_pagamento' ? <PaymentRenderer api={apiRequest} task={activeItem.task} process={activeItem.process} onCompleted={process => markCompleted(activeItem.task, process)} onSkipped={process => markSkipped(activeItem.task, process)} /> : normalize(activeItem.task.type) === 'acordos' ? <AgreementRenderer api={apiRequest} task={activeItem.task} onServerProcess={agreement => alignAgreement(activeItem.task, agreement)} onAgreementCompleted={(previous, next) => completeAgreement(activeItem.task, previous, next)} onAgreementSkipped={(previous, next) => skipAgreement(activeItem.task, previous, next)} /> : <UnsupportedRenderer task={activeItem.task} />}</div></article></> : <div className="tasks-react-state"><strong>{loading ? 'Carregando tarefas' : 'Nenhum processo selecionado'}</strong><span>{loadError || (relevantTasks.length ? 'Selecione um filtro com processos pendentes.' : 'Não há tarefas atribuídas a este usuário.')}</span>{loadError ? <button className="secondary-button" type="button" onClick={() => void loadTaskList(true)}>Tentar novamente</button> : null}</div>}</main></section> : null}

    {createOpen ? <CreateTaskModal onClose={() => setCreateOpen(false)} onCreated={() => loadTaskList(true)} /> : null}
    {assignTask ? <AssignTaskModal task={assignTask} onClose={() => setAssignTask(null)} onAssigned={() => loadTaskList(true)} /> : null}
  </div>;
}
