import { type FormEvent, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Plus, Search, Trash2, UserPlus } from 'lucide-react';
import {
  TASK_STATE_META,
  priorityLevel, processStatus,
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
  ClosingRenderer,
  DefenseRenderer,
  LiminarRenderer,
  PaymentRenderer,
  UnsupportedRenderer,
  type ApiRequest,
} from './renderers';
import { ProtocolCollectionRenderer } from './ProtocolCollectionRenderer';
import { TeamTasksView } from './TeamTasksView';
import { ProcessHeading, TaskBrief } from './TaskExecution';
import { SelectMenu } from '../dashboard/SelectMenu';
import { getProcessUf } from './processUf';
import './tasks.css';
import '../dashboard/operationalWorkspace.css';
import './taskStation.css';

const REFRESH_MS = 20000;
const LAST_TASK_TYPE_KEY = 'mba-last-task-type';
const HYDRATION_CONCURRENCY = 3;
type TaskStatusFilter = string;

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

function taskPendingRows(tasks: Task[], status?: TaskStatusFilter, type?: string) {
  return tasks.filter(task => (!status || status === 'all' || taskState(task) === status) && (!type || type === 'all' || normalize(task.type) === type));
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
          <option value="liminar">Liminar</option><option value="defesa">Defesa / Contestação</option><option value="comprovante_pagamento">Comprovante de Pagamento</option><option value="acordos">Acordos</option><option value="encerramento">Encerramento</option><option value="bloqueio">Bloqueio</option><option value="citacao">Citação</option><option value="base_benner">Upload - Base do Benner</option><option value="base_cpj">Upload - Base do CPJ</option>
        </select></label>
        {!baseMode ? <><label className="task-text-field"><span>Título</span><input value={title} maxLength={160} disabled={busy} onChange={event => setTitle(event.target.value)} /></label><label className="task-text-field"><span>Descrição</span><textarea value={description} rows={3} disabled={busy} onChange={event => setDescription(event.target.value)} /></label><div className="task-modal-grid"><label className="task-select-field"><span>Prioridade</span><select value={priority} disabled={busy} onChange={event => setPriority(event.target.value)}><option value="low">Baixa</option><option value="medium">Média</option><option value="high">Alta</option></select></label><label className="task-text-field"><span>Prazo</span><input type="datetime-local" value={deadline} disabled={busy} onChange={event => setDeadline(event.target.value)} /></label></div></> : null}
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

  return <div className="task-modal-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !busy) onClose(); }}><form className="task-react-modal" role="dialog" aria-modal="true" aria-label="Atribuir tarefa" onSubmit={submit}><header><div><h2>Atribuir tarefa</h2><p>{taskTypeLabel(task.type)}</p></div><button type="button" className="task-modal-close" disabled={busy} onClick={onClose}>×</button></header><label className="task-select-field"><span>Prioridade da atribuição</span><select value={priority} disabled={busy} onChange={event => setPriority(event.target.value)}><option value="high">Alta</option><option value="medium">Média</option><option value="low">Baixa</option></select><small>Urgente é definido explicitamente aqui; prazo de hoje não eleva a tarefa automaticamente.</small></label><fieldset className="task-participants"><legend>Usuários ativos</legend><p>Os processos atribuídos pelo backend ficam visíveis somente ao respectivo usuário.</p>{users.length ? users.map(userOption => <label key={userOption.id}><input type="checkbox" checked={selected.includes(userOption.id)} disabled={busy} onChange={event => setSelected(current => event.target.checked ? [...current, userOption.id] : current.filter(id => id !== userOption.id))} /><span>{userOption.name || userOption.email || userOption.id}</span></label>) : <small>Nenhum usuário ativo disponível.</small>}</fieldset>{error ? <p className="task-renderer-error" role="alert">{error}</p> : null}<footer><button className="secondary-button" type="button" disabled={busy} onClick={onClose}>Cancelar</button><button className="primary-button" type="submit" disabled={busy}>{busy ? 'Salvando…' : 'Salvar atribuição'}</button></footer></form></div>;
}

function currentTaskTab(): 'management' | 'execution' | 'results' {
  const path = (window.location.hash.startsWith('#/') ? window.location.hash.slice(2) : window.location.pathname).replace(/^\/+|\/+$/g, '');
  if (path === 'tarefas/atribuicoes') return 'management';
  if (path === 'tarefas/resultados') return 'results';
  return 'execution';
}
function navigateTaskTab(route: string) {
  (window as Window & { MBA_NAVIGATE?: (route: string) => boolean }).MBA_NAVIGATE?.(route);
}

export function TasksApp() {
  const pageVisible = useTasksPageVisible();
  const [user, setUser] = useState<MbaUser | null>(() => mbaWindow.MBA_CURRENT_USER || null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [visibleTasks, setVisibleTasks] = useState<Task[]>([]);
  const [processVersion, setProcessVersion] = useState(0);
  const processCache = useRef(new Map<string, TaskProcess[]>());
  const inFlight = useRef(new Map<string, Promise<TaskProcess[]>>());
  const refreshGeneration = useRef(0);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [tab, setTab] = useState<'management' | 'execution' | 'results'>(currentTaskTab);
  const [teamMode, setTeamMode] = useState(false);
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedDeadline, setSelectedDeadline] = useState('all');
  const [selectedUf, setSelectedUf] = useState('all');
  const [search, setSearch] = useState('');
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [queueSize, setQueueSize] = useState(10);
  const [deferredKeys, setDeferredKeys] = useState<string[]>([]);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [createOpen, setCreateOpen] = useState(false);
  const [assignTask, setAssignTask] = useState<Task | null>(null);

  useEffect(() => {
    const sync = () => setTab(currentTaskTab());
    window.addEventListener('mba:route-changed', sync);
    return () => window.removeEventListener('mba:route-changed', sync);
  }, []);

  const stationRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!pageVisible || tab !== 'execution') return;
    const root = stationRef.current;
    if (!root) return;
    const fit = () => {
      const padding = root.closest('.content');
      const bottom = padding ? parseFloat(getComputedStyle(padding).paddingBottom) : 12;
      root.style.setProperty('--task-station-height', `${Math.max(280, (window.innerHeight - root.getBoundingClientRect().top - bottom) / 0.9)}px`);
    };
    fit();
    const observer = new ResizeObserver(fit);
    observer.observe(root);
    const navbar = document.querySelector('.topbar, .demo-navbar');
    if (navbar) observer.observe(navbar);
    window.addEventListener('resize', fit);
    return () => { observer.disconnect(); window.removeEventListener('resize', fit); };
  }, [pageVisible, tab, user?.permissions?.['tasks.view']]);

  const manager = canManageTasks(user);
  const isMaster = Boolean(user?.is_master_admin);
  const canCreate = isMaster || user?.permissions?.['tasks.create'] === true;
  const canExecute = isMaster || user?.permissions?.['tasks.execute'] === true;
  const canManage = isMaster || user?.permissions?.['tasks.manage'] === true;
  const canViewOtherTasks = isMaster || user?.permissions?.['tasks.view_others'] === true;
  const ownTaskIds = useMemo(() => new Set(tasks.map(task => task.id)), [tasks]);
  const allVisibleTasks = useMemo(
    () => visibleTasks.filter(task => taskAssignedToUser(task, user, manager)).sort(compareTasks),
    [visibleTasks, user, manager],
  );
  const allAssignedTasks = useMemo(
    () => tasks.filter(task => taskAssignedToUser(task, user, manager)).sort(compareTasks),
    [tasks, user, manager],
  );
  const relevantTasks = useMemo(() => allAssignedTasks.filter(isTaskActive), [allAssignedTasks]);

  useEffect(() => {
    const resetSession = () => {
      refreshGeneration.current += 1;
      processCache.current.clear();
      inFlight.current.clear();
      setTasks([]);
      setVisibleTasks([]);
      setActiveKey(null);
      setDeferredKeys([]);
      setTeamMode(false);
      setProcessVersion(value => value + 1);
    };
    const onAuth = () => {
      resetSession();
      setUser(mbaWindow.MBA_CURRENT_USER || null);
    };
    const onExpired = () => {
      resetSession();
      setUser(null);
      setTasks([]);
      setVisibleTasks([]);
      processCache.current.clear();
      setProcessVersion(value => value + 1);
      setActiveKey(null);
    };
    window.addEventListener('mba:authenticated', onAuth);
    window.addEventListener('mba:session-expired', onExpired);
    window.addEventListener('mba:logged-out', onExpired);
    return () => {
      window.removeEventListener('mba:authenticated', onAuth);
      window.removeEventListener('mba:session-expired', onExpired);
      window.removeEventListener('mba:logged-out', onExpired);
    };
  }, []);

  useEffect(() => {
    if (pageVisible && mbaWindow.MBA_CURRENT_USER) setUser(mbaWindow.MBA_CURRENT_USER);
  }, [pageVisible]);

  const hydrateTask = useCallback(async (task: Task, force = false) => {
    if (!force && processCache.current.has(task.id)) return processCache.current.get(task.id) || [];
    if (inFlight.current.has(task.id)) return inFlight.current.get(task.id)!;

    const sessionUserId = user?.id;
    const promise = apiRequest(`/api/tasks/${task.id}/processes`)
      .then(rows => {
        if (mbaWindow.MBA_CURRENT_USER?.id !== sessionUserId) return [];
        const list = (Array.isArray(rows) ? rows : []).filter(process => processAssignedToUser(task, process, user, manager));
        processCache.current.set(task.id, list);
        setProcessVersion(value => value + 1);
        return list;
      })
      .finally(() => { if (inFlight.current.get(task.id) === promise) inFlight.current.delete(task.id); });
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
      const [rows, otherRows] = await Promise.all([
        apiRequest(isMaster ? '/api/tasks?scope=all' : '/api/tasks?scope=mine'),
        canViewOtherTasks ? apiRequest('/api/tasks?scope=all') : Promise.resolve(null),
      ]);
      if (refreshGeneration.current !== generation) return;
      const nextTasks = Array.isArray(rows) ? rows as Task[] : [];
      const nextVisibleTasks = Array.isArray(otherRows) ? otherRows as Task[] : nextTasks;
      if (resetCache) {
        processCache.current.clear();
        setProcessVersion(value => value + 1);
        setActiveKey(null);
      }
      setTasks(nextTasks);
      setVisibleTasks(nextVisibleTasks);

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
        setActiveKey(`${preferred.id}:${first.id}`);
      }
      void hydrateInBackground(available.filter(task => task.id !== preferred.id), generation);
    } catch (cause: any) {
      setLoadError(cause?.message || 'Não foi possível carregar as tarefas.');
    } finally {
      if (refreshGeneration.current === generation) setLoading(false);
    }
  }, [user, manager, hydrateTask, hydrateInBackground, activeKey, canViewOtherTasks, isMaster]);

  useEffect(() => {
    if (!pageVisible || !user?.permissions?.['tasks.view']) return;
    void loadTaskList(false);
  }, [pageVisible, user]);

  useEffect(() => {
    if (!pageVisible || !user?.permissions?.['tasks.view']) return undefined;
    const timer = window.setInterval(async () => {
      try {
        const [rows, otherRows] = await Promise.all([
          apiRequest(isMaster ? '/api/tasks?scope=all' : '/api/tasks?scope=mine'),
          canViewOtherTasks ? apiRequest('/api/tasks?scope=all') : Promise.resolve(null),
        ]);
        if (mbaWindow.MBA_CURRENT_USER?.id !== user?.id) return;
        const freshTasks = Array.isArray(rows) ? rows as Task[] : [];
        setTasks(freshTasks);
        setVisibleTasks(Array.isArray(otherRows) ? otherRows as Task[] : freshTasks);
        const activeTaskId = activeKey?.split(':')[0];
        const task = freshTasks.find(item => String(item.id) === String(activeTaskId));
        if (task) await hydrateTask(task, true);
      } catch (_error) {
        // Atualização silenciosa: preserva a fila atual em caso de falha transitória.
      }
    }, REFRESH_MS);
    return () => window.clearInterval(timer);
  }, [pageVisible, user?.id, activeKey, hydrateTask, canViewOtherTasks, isMaster]);

  const workItems = useMemo(() => {
    void processVersion;
    const result: WorkItem[] = [];
    for (const task of allAssignedTasks) {
      const rows = processCache.current.get(task.id) || [];
      for (const process of rows) {
        result.push({ task, process });
      }
    }
    return result.sort((a, b) => {
      const ai = deferredKeys.indexOf(workItemKey(a)), bi = deferredKeys.indexOf(workItemKey(b));
      if (ai >= 0 || bi >= 0) return ai < 0 ? -1 : bi < 0 ? 1 : ai - bi;
      return compareWorkItems(a, b);
    });
  }, [allAssignedTasks, processVersion, deferredKeys]);

  const pendingForTask = useCallback((task: Task) => {
    void processVersion;
    const rows = processCache.current.get(task.id);
    if (rows) return rows.filter(process => normalize(process.status) !== 'completed').length;
    return pendingCount(task);
  }, [processVersion]);

  const deadlineOptions = [
    { value: 'all', label: 'Todos' },
    { value: 'overdue', label: 'Vencidos' },
    { value: 'today', label: 'Hoje' },
    { value: 'next3', label: 'Próximos 3 dias' },
    { value: 'none', label: 'Sem prazo' },
  ];
  const navPendingCount = relevantTasks.reduce((sum, task) => sum + pendingForTask(task), 0);
  useEffect(() => {
    window.dispatchEvent(new CustomEvent('mba:task-pending-count', { detail: { count: navPendingCount } }));
  }, [navPendingCount, user?.id]);
  const situation = (item: WorkItem) => priorityLevel(item);
  const ufOptions = useMemo(() => {
    const ufs = new Set<string>();
    let unknown = false;
    for (const { process } of workItems) {
      const uf = getProcessUf(process);
      if (uf) ufs.add(uf); else unknown = true;
    }
    return [{ value: 'all', label: 'Todas' },
      ...Array.from(ufs).sort((a, b) => a.localeCompare(b, 'pt-BR')).map(uf => ({ value: uf, label: uf })),
      ...(unknown ? [{ value: '__unknown__', label: 'Não informada' }] : [])];
  }, [workItems]);

  const filteredItems = useMemo(() => workItems.filter(item => {
    const status = processStatus(item, deferredKeys.includes(workItemKey(item)));
    if (!isTaskActive(item.task) || ['completed','cancelled','inactive','waiting'].includes(status)) return false;
    if (selectedPriority !== 'all' && situation(item) !== selectedPriority) return false;
    if (selectedUf !== 'all' && (getProcessUf(item.process) || '__unknown__') !== selectedUf) return false;
    if (selectedDeadline !== 'all') {
      const due = item.process.deadline_at || item.task.deadline_at;
      if (selectedDeadline === 'none') {
        if (due) return false;
      } else {
        if (!due) return false;
        const date = new Date(due);
        if (Number.isNaN(date.getTime())) return false;
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        date.setHours(0, 0, 0, 0);
        const days = Math.round((date.getTime() - now.getTime()) / 86400000);
        if (selectedDeadline === 'overdue' && days >= 0) return false;
        if (selectedDeadline === 'today' && days !== 0) return false;
        if (selectedDeadline === 'next3' && (days < 0 || days > 3)) return false;
      }
    }
    if (selectedType !== 'all' && normalize(item.task.type) !== selectedType) return false;
    if (!search.trim()) return true;
    const number = String(item.process.case_number || '').toLowerCase();
    const needle = search.trim().toLowerCase();
    return number.includes(needle) || (/^[\d.\-\s]+$/.test(needle) && number.replace(/\D/g,'').includes(needle.replace(/\D/g,'')));
  }), [workItems, selectedPriority, selectedDeadline, selectedUf, selectedType, search, deferredKeys]);

  useEffect(() => {
    if (!pageVisible) return;
    const candidates = taskPendingRows(allAssignedTasks, 'all', selectedType).filter(task => !processCache.current.has(task.id));
    if (!candidates.length) return;
    const generation = refreshGeneration.current;
    void hydrateInBackground(candidates, generation);
  }, [pageVisible, selectedType, allAssignedTasks, hydrateInBackground]);

  useEffect(() => {
    if (!filteredItems.length) {
      setActiveKey(null);
      return;
    }
    if (!activeKey || !filteredItems.some(item => workItemKey(item) === activeKey)) setActiveKey(workItemKey(filteredItems[0]));
  }, [filteredItems, activeKey]);

  const activeItem = useMemo(() => filteredItems.find(item => workItemKey(item) === activeKey) || null, [filteredItems, activeKey]);
  const activeIndex = filteredItems.findIndex(item => workItemKey(item) === activeKey);
  const windowStart = activeIndex >= 0 ? Math.floor(activeIndex / queueSize) * queueSize : 0;
  const visibleItems = filteredItems.slice(windowStart, windowStart + queueSize);

  useEffect(() => {
    const sidebar = document.querySelector('.tasks-process-list');
    if (!sidebar) return;
    const observer = new ResizeObserver(([entry]) => {
      setQueueSize(Math.max(1, Math.floor(entry.contentRect.height / 70)));
    });
    observer.observe(sidebar);
    return () => observer.disconnect();
  }, [tab, pageVisible, Boolean(activeItem)]);

  const chooseNext = useCallback((completedKey: string) => {
    const index = filteredItems.findIndex(item => workItemKey(item) === completedKey);
    const remaining = filteredItems.filter(item => workItemKey(item) !== completedKey && normalize(item.process.status) !== 'completed');
    const next = filteredItems.slice(index + 1).find(item => normalize(item.process.status) !== 'completed') || remaining[0] || null;
    setActiveKey(next ? workItemKey(next) : null);
  }, [filteredItems]);

  const markCompleted = useCallback((task: Task, process: TaskProcess) => {
    setActionNotice(`Análise de ${process.case_number || 'processo'} registrada.`);
    const key = `${task.id}:${process.id}`;
    chooseNext(key);
    const rows = processCache.current.get(task.id) || [];
    processCache.current.set(task.id, rows.map(row => String(row.id) === String(process.id) ? { ...row, status: 'completed', updated_at: new Date().toISOString() } : row));
    setTasks(current => current.map(row => String(row.id) === String(task.id) ? { ...row, completed_processes: Number(row.completed_processes || 0) + 1 } : row));
    setProcessVersion(value => value + 1);
    window.setTimeout(() => { void hydrateTask(task, true); }, 250);
  }, [chooseNext, hydrateTask]);

  const markClosingDeferred = useCallback((task: Task, process: TaskProcess, reopenAt: string) => {
    const key = workItemKey({ task, process });
    setActionNotice(`Processo ${process.case_number || ''} reagendado para ${new Date(reopenAt + 'T12:00:00').toLocaleDateString('pt-BR')}.`);
    chooseNext(key);
    const rows = processCache.current.get(task.id) || [];
    processCache.current.set(task.id, rows.map(item => String(item.id) === String(process.id)
      ? { ...item, status: 'waiting', source_metadata: {
        ...(item.source_metadata || {}), closing_reopen_at: reopenAt,
      } } : item));
    setProcessVersion(value => value + 1);
    window.setTimeout(() => { void hydrateTask(task, true); }, 250);
  }, [chooseNext, hydrateTask]);

  const markSkipped = useCallback((task: Task, process: TaskProcess) => {
    setDeferredKeys(current => [...current.filter(key => key !== `${task.id}:${process.id}`), `${task.id}:${process.id}`]);
    setActionNotice(`${process.case_number || 'Processo'} enviado para o final da fila.`);
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
    setActionNotice(`Análise de ${previous.case_number || 'acordo'} registrada.`);
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
    setActionNotice(`${previous.case_number || 'Acordo'} deixado para depois.`);
    setDeferredKeys(current => [...current.filter(key => key !== `${task.id}:${previous.id}`), `${task.id}:${previous.id}`]);
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

  return <div ref={stationRef} className={`tasks-react-root ${tab === 'execution' ? 'task-station' : ''}`}>
    <nav className="analytics-subnav tasks-react-subnav" aria-label="Tarefas">
      <button type="button" className={tab === 'execution' && !teamMode ? 'active' : ''} onClick={() => { setTeamMode(false); setSelectedType('all'); navigateTaskTab('tarefas'); }}>Minhas tarefas</button>
      {canViewOtherTasks ? <button type="button" className={tab === 'execution' && teamMode ? 'active' : ''} onClick={() => { setTeamMode(true); navigateTaskTab('tarefas'); }}>Equipe</button> : null}
      <button type="button" disabled={!manager} className={tab === 'management' ? 'active' : ''} onClick={() => navigateTaskTab('tarefas/atribuicoes')}>Atribuições</button>
      <button type="button" className={tab === 'results' ? 'active' : ''} onClick={() => navigateTaskTab('tarefas/resultados')}>Resultados</button>
    </nav>
    {tab === 'results' ? <section className="tasks-results" aria-label="Resultados das tarefas"><h1>Resultados</h1><p>O painel do Metabase será disponibilizado aqui.</p></section> : null}

    {tab === 'management' && manager ? <section className="tasks-management-view"><div className="tasks-management-header"><div><h1>Atribuições</h1><p>Crie, distribua e acompanhe os lotes operacionais.</p></div>{canCreate ? <button className="primary-button" type="button" onClick={() => setCreateOpen(true)}><Plus size={15} />Nova tarefa</button> : null}</div><div className="tasks-management-table-wrap"><table className="tasks-management-table"><thead><tr><th>Tarefa</th><th>Tipo</th><th>Pendências</th><th>Status</th><th>Atualização</th><th></th></tr></thead><tbody>{allVisibleTasks.length ? allVisibleTasks.map(task => <tr key={task.id}><td><strong>{task.title || taskTypeLabel(task.type)}</strong><small>{task.description || 'Sem descrição'}</small></td><td>{taskTypeLabel(task.type)}</td><td>{pendingCount(task)}</td><td><span className={`tasks-state-pill ${taskState(task)}`}>{TASK_STATE_META[taskState(task)].singular}</span><small>{taskStatusLabel(task.status)}</small></td><td>{task.updated_at ? new Date(task.updated_at).toLocaleString('pt-BR') : 'Sem atualização'}</td><td><div className="tasks-row-actions">{canManage ? <button type="button" className="secondary-button" disabled={!isTaskActive(task)} onClick={() => setAssignTask(task)}><UserPlus size={14} />Atribuir</button> : null}{canExecute && ownTaskIds.has(task.id) ? <button type="button" className="secondary-button" disabled={!isTaskActive(task) || pendingCount(task) <= 0} onClick={() => void executeTask(task)}>Executar</button> : null}{canManage ? <button type="button" className="tasks-delete-button" title="Excluir lote" onClick={() => void deleteTask(task)}><Trash2 size={14} /></button> : null}</div></td></tr>) : <tr><td colSpan={6}>Nenhuma tarefa disponível.</td></tr>}</tbody></table></div></section> : null}

    {tab === 'execution' && teamMode && canViewOtherTasks ? <TeamTasksView tasks={allVisibleTasks} api={apiRequest} visible={pageVisible} /> : null}
    {tab === 'execution' && (!teamMode || !canViewOtherTasks) ? <>

      {loadError ? <div className="workbench-notice" role="alert"><span>Não foi possível atualizar a fila. {loadError}</span><button type="button" onClick={() => void loadTaskList(true)}>Tentar novamente</button></div> : null}
      {actionNotice ? <div className="execution-notification" role="status"><span>{actionNotice}</span><button type="button" aria-label="Fechar confirmação" onClick={() => setActionNotice(null)}>×</button></div> : null}
      <section className="tasks-workspace"><aside className="tasks-workspace-sidebar"><section className="tasks-process-section"><div className="tasks-process-title"><strong>Processos da fila</strong><span>{filteredItems.length} carregados</span></div><div className="queue-station-filters">
        <SelectMenu label="Prazo" value={selectedDeadline} options={deadlineOptions} onChange={value => { setSelectedDeadline(value); setActiveKey(null); }} />
        <SelectMenu label="Prioridade" value={selectedPriority} options={[{ value: 'all', label: 'Todas' }, { value: 'high', label: 'Alta' }, { value: 'medium', label: 'Média' }, { value: 'low', label: 'Baixa' }]} onChange={value => { setSelectedPriority(value); setActiveKey(null); }} />
        <SelectMenu label="UF" value={selectedUf} options={ufOptions} onChange={value => { setSelectedUf(value); setActiveKey(null); }} />
      </div><label className="tasks-process-search"><Search size={14} /><input value={search} type="search" aria-label="Buscar processo" placeholder="Buscar processo" onChange={event => setSearch(event.target.value)} /></label><div className="tasks-process-list">{visibleItems.length ? visibleItems.map(item => { const priority = situation(item); return <button type="button" key={workItemKey(item)} className={`tasks-process-item ${workItemKey(item) === activeKey ? 'selected' : ''}`} onClick={() => selectItem(item)}><div><strong>{item.process.case_number || 'Processo sem número'}</strong><small>{taskTypeLabel(item.task.type)}</small></div><div className="queue-item-badges"><span className={`tasks-state-pill ${priority}`}>{priority === 'high' ? 'Alta' : priority === 'medium' ? 'Média' : 'Baixa'}</span></div></button>; }) : <div className="tasks-sidebar-empty">{loading ? 'Carregando fila…' : 'Nenhum processo neste filtro.'}</div>}</div><div className="workbench-queue-pagination"><button type="button" disabled={windowStart === 0} onClick={() => selectItem(filteredItems[Math.max(0, windowStart - queueSize)])}>Anterior</button><span>{filteredItems.length ? windowStart + 1 : 0}–{Math.min(windowStart + queueSize, filteredItems.length)}</span><button type="button" disabled={windowStart + queueSize >= filteredItems.length} onClick={() => selectItem(filteredItems[windowStart + queueSize])}>Próximos</button></div></section></aside><main className="tasks-execution-panel">{activeItem ? <><article className="tasks-renderer-card execution-card"><ProcessHeading task={activeItem.task} process={activeItem.process}/><TaskBrief task={activeItem.task} process={activeItem.process}/><div className="tasks-renderer-body" key={normalize(activeItem.task.type) === 'acordos' ? `agreement:${activeItem.task.id}` : workItemKey(activeItem)}>{normalize(activeItem.process.status) === 'completed' ? <div className="tasks-renderer-state"><strong>Processo concluído</strong></div> : normalize(activeItem.task.type) === 'liminar' ? <LiminarRenderer api={apiRequest} task={activeItem.task} process={activeItem.process} onCompleted={process => markCompleted(activeItem.task, process)} onSkipped={process => markSkipped(activeItem.task, process)} /> : normalize(activeItem.task.type) === 'defesa' ? <DefenseRenderer api={apiRequest} task={activeItem.task} process={activeItem.process} onCompleted={process => markCompleted(activeItem.task, process)} onSkipped={process => markSkipped(activeItem.task, process)} /> : normalize(activeItem.task.type) === 'encerramento' ? <ClosingRenderer api={apiRequest} task={activeItem.task} process={activeItem.process} onCompleted={process => markCompleted(activeItem.task, process)} onDeferred={(process, reopenAt) => markClosingDeferred(activeItem.task, process, reopenAt)} onSkipped={process => markSkipped(activeItem.task, process)} /> : normalize(activeItem.task.type) === 'comprovante_pagamento' ? <PaymentRenderer api={apiRequest} task={activeItem.task} process={activeItem.process} onCompleted={process => markCompleted(activeItem.task, process)} onSkipped={process => markSkipped(activeItem.task, process)} /> : normalize(activeItem.task.type) === 'acordos' ? <AgreementRenderer api={apiRequest} task={activeItem.task} onServerProcess={agreement => alignAgreement(activeItem.task, agreement)} onAgreementCompleted={(previous, next) => completeAgreement(activeItem.task, previous, next)} onAgreementSkipped={(previous, next) => skipAgreement(activeItem.task, previous, next)} /> : normalize(activeItem.task.type) === 'protocolo' ? <ProtocolCollectionRenderer api={apiRequest} task={activeItem.task} process={activeItem.process} onCompleted={process => markCompleted(activeItem.task, process)} onSkipped={process => markSkipped(activeItem.task, process)} /> : <UnsupportedRenderer task={activeItem.task} />}</div></article></> : <div className="tasks-react-state"><strong>{loading ? 'Carregando tarefas' : 'Nenhum processo selecionado'}</strong><span>{loadError || (relevantTasks.length ? 'Selecione um filtro com processos pendentes.' : 'Não há tarefas atribuídas a este usuário.')}</span>{loadError ? <button className="secondary-button" type="button" onClick={() => void loadTaskList(true)}>Tentar novamente</button> : null}</div>}</main></section></> : null}

    {createOpen && canCreate ? <CreateTaskModal onClose={() => setCreateOpen(false)} onCreated={() => loadTaskList(true)} /> : null}
    {assignTask && canManage ? <AssignTaskModal task={assignTask} onClose={() => setAssignTask(null)} onAssigned={() => loadTaskList(true)} /> : null}
  </div>;
}
