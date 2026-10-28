import {runtimeQueries,runtimeScope} from './runtimeQueries';
import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeftRight, CalendarClock, Check, ChevronDown, ChevronRight, Download, RefreshCw, Search, Scale, Users, X } from 'lucide-react';
import { isTaskActive, normalize, PROCESS_STATUS_LABELS, taskTypeLabel, type Task, type TaskProcess } from './model';
import type { ApiRequest } from './renderers';
import './assignmentsBoard.css';

type Row = { task: Task; process: TaskProcess };
type Assignee = { id: string; name?: string; email?: string };
type View = 'people' | 'task' | 'deadline';
type Assignment = { row: Row; assigneeId: string };
type DeadlineBucket = 'overdue' | 'today' | 'tomorrow' | 'week' | 'future' | 'none' | 'closed';

const INACTIVE = new Set(['completed', 'cancelled', 'inactive']);
const DAY_MS = 86400000;
const bucketMeta: Record<DeadlineBucket, { label: string; rank: number }> = {
  overdue: { label: 'Vencidas', rank: 0 },
  today: { label: 'Vencem hoje', rank: 1 },
  tomorrow: { label: 'Vencem amanhã', rank: 2 },
  week: { label: 'Próximos 7 dias', rank: 3 },
  future: { label: 'Vencimentos futuros', rank: 4 },
  none: { label: 'Sem prazo cadastrado', rank: 5 },
  closed: { label: 'Concluídas / inativas', rank: 6 },
};
const keyOf = (row: Row) => String(row.task.id) + ':' + String(row.process.id);
const open = (row: Row) => !INACTIVE.has(normalize(row.process.status));
const inProgress = (row: Row) => normalize(row.process.status) === 'in_progress';
const deadlineOf = (row: Row) => row.process.deadline_at || row.task.deadline_at;
const dayStart = (input: string | Date): number | null => {
  // PostgreSQL returns date-only values; do not shift them to yesterday via UTC parsing.
  const date = typeof input === 'string' && /^\\d{4}-\\d{2}-\\d{2}$/.test(input)
    ? new Date(input + 'T12:00:00') : new Date(input);
  if (Number.isNaN(date.getTime())) return null;
  date.setHours(0, 0, 0, 0);
  return date.getTime();
};
const bucketOf = (row: Row, today: number): DeadlineBucket => {
  if (!open(row)) return 'closed';
  const date = deadlineOf(row);
  const start = date ? dayStart(date) : null;
  if (start === null) return 'none';
  const difference = Math.round((start - today) / DAY_MS);
  if (difference < 0) return 'overdue';
  if (difference === 0) return 'today';
  if (difference === 1) return 'tomorrow';
  if (difference <= 7) return 'week';
  return 'future';
};
const dateLabel = (row: Row) => {
  const raw = deadlineOf(row);
  const date = raw ? new Date(raw) : null;
  if (/^\\d{4}-\\d{2}-\\d{2}$/.test(String(raw || ''))) {
    const iso = String(raw);
    return iso.slice(8,10) + '/' + iso.slice(5,7) + '/' + iso.slice(0,4);
  }
  return date && !Number.isNaN(date.getTime()) ? date.toLocaleDateString('pt-BR') : '—';
};
const sortByDeadline = (a: Row, b: Row) => {
  const first = deadlineOf(a) ? new Date(deadlineOf(a)).getTime() : Number.MAX_SAFE_INTEGER;
  const second = deadlineOf(b) ? new Date(deadlineOf(b)).getTime() : Number.MAX_SAFE_INTEGER;
  return (Number.isFinite(first) ? first : Number.MAX_SAFE_INTEGER) -
    (Number.isFinite(second) ? second : Number.MAX_SAFE_INTEGER) ||
    String(a.process.case_number || a.process.id).localeCompare(String(b.process.case_number || b.process.id), 'pt-BR');
};
const csvCell = (value: unknown) => {
  let safe = String(value ?? '');
  if (/^[\s]*[=+\-@]/.test(safe)) safe = "'" + safe;
  return '"' + safe.replace(/"/g, '""') + '"';
};

export function AssignmentsBoard({ tasks, api, canAssign, visible = true }: {
  tasks: Task[]; api: ApiRequest; canAssign: boolean; visible?: boolean;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [assignees, setAssignees] = useState<Record<string, Assignee[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadedCount, setLoadedCount] = useState(0);
  const [progressTotal, setProgressTotal] = useState(0);
  const [serverSummary, setServerSummary] = useState<{unassigned:number;today:number;overdue:number;working:number}|null>(null);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [view, setView] = useState<View>('people');
  const [type, setType] = useState('all');
  const [analyst, setAnalyst] = useState('all');
  const [status, setStatus] = useState('open');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [recipient, setRecipient] = useState('');
  const [mode, setMode] = useState<'direct' | 'balance'>('direct');
  const [expanded, setExpanded] = useState<string | null>(null);
  const [detail, setDetail] = useState<Row | null>(null);
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);

  const activeTasks = useMemo(() => tasks.filter(isTaskActive), [tasks]);
  const taskKey = activeTasks.map(task => task.id).join(',');
  const types = useMemo(() => Array.from(new Set(activeTasks.map(task => normalize(task.type)))).filter(Boolean).sort(), [activeTasks]);
  const typeKey = types.join(',');

  const lastLoad=useRef<{key:string;revision:number;at:number}|null>(null);
  // Exact, portfolio-scoped totals and case pages are served by PostgreSQL.
  // Keep the previous guarded loader as a fallback while older API images drain.
  useEffect(() => {
    if (!visible) return;
    const identity=taskKey+'|'+type;
    const previous=lastLoad.current;
    if(previous?.key===identity && previous.revision===refresh && Date.now()-previous.at<45000)return;
    let cancelled = false;
    if(previous?.key!==identity){setRows([]);setSelected([]);}
    setLoadedCount(0);
    setLoadErrors([]);
    setServerSummary(null);
    setProgressTotal(0);
    setLoading(true);
    const load = async () => {
      const errors: string[] = [];
      const found: Row[] = [];
      const indexedPath = (page: number) => {
        const params = new URLSearchParams({
          view: 'task', status: 'all', page: String(page), page_size: '100',
        });
        if (type !== 'all') params.set('type', type);
        return '/api/tasks/assignments?' + params.toString();
      };
      let indexed = false;
      try {
        const first = await api(indexedPath(1));
        if (cancelled) return;
        if (!first || !Array.isArray(first.rows) || !first.summary ||
            typeof first.total !== 'number' || first.total < 0 || first.total > 50000) {
          throw new Error('Índice paginado não disponível.');
        }
        indexed = true;
        setServerSummary(first.summary);
        const pages = Math.ceil(first.total / 100);
        setProgressTotal(first.total);
        found.push(...first.rows as Row[]);
        setRows([...found]);
        setLoadedCount(found.length);
        for (let page = 2; page <= pages; page += 4) {
          if (cancelled) return;
          const numbers = Array.from({ length: Math.min(4, pages - page + 1) }, (_, offset) => page + offset);
          const results = await Promise.allSettled(numbers.map(number => api(indexedPath(number))));
          if (cancelled) return;
          results.forEach((result, index) => {
            if (result.status === 'fulfilled' && Array.isArray(result.value?.rows)) {
              found.push(...result.value.rows as Row[]);
            } else {
              errors.push('Página ' + numbers[index]);
            }
          });
          setRows([...found]);
          setLoadedCount(found.length);
        }
        if (found.length !== first.total) errors.push('Quantidade de processos divergente do total do servidor.');
      } catch {
        if (cancelled) return;
        if (indexed) {
          errors.push('Falha ao carregar a consulta paginada.');
        } else {
          // Compatibility only: the existing endpoint still enforces portfolio/assignment visibility.
          setServerSummary(null);
          setProgressTotal(0);
          found.length = 0;
          const tasksToLoad = type === 'all' ? activeTasks : activeTasks.filter(item => normalize(item.type) === type);
          for (let index = 0; index < tasksToLoad.length; index += 3) {
            if (cancelled) return;
            const chunk = tasksToLoad.slice(index, index + 3);
            const results = await Promise.allSettled(chunk.map(task => api('/api/tasks/' + task.id + '/processes')));
            if (cancelled) return;
            results.forEach((result, j) => {
              if (result.status === 'fulfilled' && Array.isArray(result.value)) {
                found.push(...(result.value as TaskProcess[]).map(process => ({ task: chunk[j], process })));
              } else errors.push(chunk[j].title || taskTypeLabel(chunk[j].type));
            });
            setRows([...found]);
            setLoadedCount(index + chunk.length);
          }
        }
      }
      if (!cancelled) { setRows([...found]); setLoadErrors(errors); setLoading(false); if(!errors.length)lastLoad.current={key:identity,revision:refresh,at:Date.now()}; }
    };
    void load().catch(() => {
      if (!cancelled) { setLoading(false); setLoadErrors(['Falha ao consultar atribuições']); }
    });
    return () => { cancelled = true; };
  }, [api, taskKey, type, refresh, visible]);

  useEffect(() => {
    if (!visible || !canAssign || !types.length) return;
    let cancelled = false;
    void Promise.allSettled(types.map(item => runtimeQueries.fetchQuery({queryKey:['runtime-v2',runtimeScope(),'task-assignees',item],staleTime:45000,queryFn:()=>api('/api/task-assignees?module=' + encodeURIComponent(item))})))
      .then(result => {
        if (cancelled) return;
        const found: Record<string, Assignee[]> = {};
        result.forEach((value, index) => {
          found[types[index]] = value.status === 'fulfilled' && Array.isArray(value.value) ? value.value as Assignee[] : [];
        });
        setAssignees(found);
      });
    return () => { cancelled = true; };
  }, [api, typeKey, canAssign, visible]);

  function nameOf(row: Row): string {
    const id = String(row.process.assignee_id || '');
    if (!id) return 'Não atribuído';
    const person = (assignees[normalize(row.task.type)] || []).find(value => String(value.id) === id);
    if (person) return person.name || person.email || 'Analista';
    const at = (row.task.participant_user_ids || []).findIndex(value => String(value) === id);
    if (at >= 0) return row.task.participant_names?.[at] || 'Analista';
    return row.process.assignee_name || (row.task.responsible_id === id ? row.task.responsible_name : null) || 'Responsável';
  }

  const today = dayStart(new Date()) || 0;
  const scoped = useMemo(() => rows.filter(row => type === 'all' || normalize(row.task.type) === type), [rows, type]);
  const people = useMemo(() => {
    const map = new Map<string, string>();
    scoped.forEach(row => {
      if (row.process.assignee_id) map.set(String(row.process.assignee_id), nameOf(row));
    });
    return Array.from(map, ([id, name]) => ({ id, name })).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [scoped, assignees]);
  const filtered = useMemo(() => scoped.filter(row => {
    const owner = String(row.process.assignee_id || '__none__');
    if (analyst !== 'all' && owner !== analyst) return false;
    if (status === 'open' && !open(row)) return false;
    if (status === 'completed' && normalize(row.process.status) !== 'completed') return false;
    if (status === 'in_progress' && !inProgress(row)) return false;
    if (status === 'pending' && (!open(row) || inProgress(row))) return false;
    if (status === 'unassigned' && (!open(row) || row.process.assignee_id)) return false;
    if (status === 'overdue' && bucketOf(row, today) !== 'overdue') return false;
    if (status === 'today' && bucketOf(row, today) !== 'today') return false;
    const needle = normalize(search);
    return !needle || normalize(row.process.case_number).includes(needle)
      || normalize(taskTypeLabel(row.task.type)).includes(needle)
      || normalize(row.task.title).includes(needle)
      || normalize(nameOf(row)).includes(needle);
  }), [scoped, analyst, status, search, assignees, today]);

  useEffect(() => {
    setPage(0);
    setSelected([]);
    setExpanded(null);
    setMode('direct');
  }, [view, type, analyst, status, search, pageSize]);

  const counts = useMemo(() => serverSummary || ({
    unassigned: scoped.filter(row => open(row) && !row.process.assignee_id).length,
    today: scoped.filter(row => bucketOf(row, today) === 'today').length,
    overdue: scoped.filter(row => bucketOf(row, today) === 'overdue').length,
    working: scoped.filter(row => open(row) && inProgress(row)).length,
  }), [scoped, today, serverSummary]);

  const groupedPeople = useMemo(() => {
    const groups = new Map<string, { id: string; name: string; rows: Row[]; pending: number; working: number; overdue: number; today: number }>();
    filtered.forEach(row => {
      const id = String(row.process.assignee_id || '__none__');
      if (!groups.has(id)) groups.set(id, { id, name: nameOf(row), rows: [], pending: 0, working: 0, overdue: 0, today: 0 });
      const item = groups.get(id)!;
      item.rows.push(row);
      if (open(row)) item.pending++;
      if (open(row) && inProgress(row)) item.working++;
      if (bucketOf(row, today) === 'overdue') item.overdue++;
      if (bucketOf(row, today) === 'today') item.today++;
    });
    return [...groups.values()].sort((a, b) => a.id === '__none__' ? -1 : b.id === '__none__' ? 1 : a.name.localeCompare(b.name, 'pt-BR'));
  }, [filtered, assignees, today]);
  const maxPending = Math.max(1, ...groupedPeople.map(group => group.pending));
  const sorted = useMemo(() => [...filtered].sort((a, b) => {
    const first = view === 'deadline' ? bucketMeta[bucketOf(a, today)].rank : 0;
    const second = view === 'deadline' ? bucketMeta[bucketOf(b, today)].rank : 0;
    if (first !== second) return first - second;
    if (view === 'task') {
      const typeCompare = taskTypeLabel(a.task.type).localeCompare(taskTypeLabel(b.task.type), 'pt-BR');
      if (typeCompare) return typeCompare;
    }
    return sortByDeadline(a, b);
  }), [filtered, view, today]);
  const total = view === 'people' ? groupedPeople.length : sorted.length;
  const pages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, pages - 1);
  const shownRows = sorted.slice(safePage * pageSize, (safePage + 1) * pageSize);
  const shownPeople = groupedPeople.slice(safePage * pageSize, (safePage + 1) * pageSize);
  const selectable = (view === 'people' ? shownPeople.flatMap(group => group.rows) : shownRows).filter(open);
  const selectedRows = rows.filter(row => selected.includes(keyOf(row)) && open(row));
  const candidates = Array.from(new Map(Object.values(assignees).flat().map(person => [String(person.id), person])).values())
    .sort((a, b) => String(a.name || a.email || '').localeCompare(String(b.name || b.email || ''), 'pt-BR'));
  const eligible = selectedRows.length > 0 && selectedRows.every(row =>
    (assignees[normalize(row.task.type)] || []).some(person => String(person.id) === recipient));

  const balancePlan = useMemo((): Assignment[] => {
    if (!selectedRows.length) return [];
    const loads = new Map<string, number>();
    rows.filter(open).forEach(row => {
      const id = String(row.process.assignee_id || '');
      if (id) loads.set(id, (loads.get(id) || 0) + 1);
    });
    selectedRows.forEach(row => {
      const id = String(row.process.assignee_id || '');
      if (id) loads.set(id, Math.max(0, (loads.get(id) || 0) - 1));
    });
    const plan: Assignment[] = [];
    for (const row of [...selectedRows].sort(sortByDeadline)) {
      const candidatesForType = assignees[normalize(row.task.type)] || [];
      if (!candidatesForType.length) return [];
      const target = [...candidatesForType].sort((a, b) =>
        (loads.get(String(a.id)) || 0) - (loads.get(String(b.id)) || 0)
        || String(a.name || a.id).localeCompare(String(b.name || b.id), 'pt-BR'))[0];
      plan.push({ row, assigneeId: String(target.id) });
      loads.set(String(target.id), (loads.get(String(target.id)) || 0) + 1);
    }
    return plan;
  }, [rows, selected, assignees]);

  async function saveAssignments(plan: Assignment[]) {
    if (!canAssign || working || !plan.length) return;
    setWorking(true);
    setNotice('');
    let success = 0;
    const failed: string[] = [];
    const changes = new Map<string, string>();
    for (const entry of plan) {
      try {
        await api('/api/task-processes/' + entry.row.process.id, {
          method: 'PATCH', body: JSON.stringify({ assignee_id: entry.assigneeId }),
        });
        success++;
        changes.set(keyOf(entry.row), entry.assigneeId);
      } catch {
        failed.push(entry.row.process.case_number || entry.row.process.id);
      }
    }
    setRows(current => current.map(row => changes.has(keyOf(row))
      ? { ...row, process: { ...row.process, assignee_id: changes.get(keyOf(row))! } }
      : row));
    setNotice(success + ' atribuição(ões) confirmada(s) pelo servidor.' +
      (failed.length ? ' Falhas (' + failed.length + '): ' + failed.slice(0, 8).join(', ') + (failed.length > 8 ? '…' : '') : ''));
    setSelected(current => current.filter(key => !changes.has(key)));
    setWorking(false);
    setMode('direct');
  }

  function toggleSelection(group: Row[], checked: boolean) {
    const keys = new Set(group.filter(open).map(keyOf));
    setSelected(old => checked ? Array.from(new Set([...old, ...keys])) : old.filter(key => !keys.has(key)));
  }

  function exportCsv() {
    if (!filtered.length) return;
    if (loading || loadErrors.length) {
      if (!window.confirm('A consulta está incompleta. Exportar apenas os registros já carregados?')) return;
    }
    const columns = ['CNJ', 'Tipo', 'Responsável', 'Situação', 'Prazo'];
    const data = filtered.map(row => [
      row.process.case_number || '', taskTypeLabel(row.task.type), nameOf(row),
      PROCESS_STATUS_LABELS[normalize(row.process.status)] || row.process.status || 'Pendente', dateLabel(row),
    ]);
    const csv = '\uFEFF' + [columns, ...data].map(line => line.map(csvCell).join(';')).join('\r\n');
    const href = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }));
    const anchor = document.createElement('a');
    anchor.href = href;
    anchor.download = 'atribuicoes-' + new Date().toISOString().slice(0, 10) + '.csv';
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(href);
  }

  function processTable(list: Row[], showGrouping = false) {
    const totals = new Map<string, number>();
    const groupId = (row: Row) => view === 'deadline' ? bucketOf(row, today) : normalize(row.task.type);
    list.forEach(row => totals.set(groupId(row), (totals.get(groupId(row)) || 0) + 1));
    return <div className="assignments-table-wrap"><table className="assignments-table">
      <thead><tr>
        {canAssign && <th className="assignments-check"><input type="checkbox" aria-label="Selecionar página" disabled={loading || working || !list.some(open)} checked={list.some(open) && list.filter(open).every(row => selected.includes(keyOf(row)))} onChange={event => toggleSelection(list, event.target.checked)} /></th>}
        <th>Processo</th><th>Tipo</th><th>Responsável</th><th>Situação</th><th>Prazo</th>
      </tr></thead>
      <tbody>{list.map((row, index) => {
        const bucket = bucketOf(row, today);
        const group = groupId(row);
        const isGroupStart = showGrouping && (index === 0 || groupId(list[index - 1]) !== group);
        const groupLabel = view === 'deadline' ? bucketMeta[group as DeadlineBucket].label : taskTypeLabel(row.task.type);
        return <Fragment key={keyOf(row)}>
          {isGroupStart && <tr className="assignments-group-row"><th scope="rowgroup" colSpan={canAssign ? 6 : 5}>{groupLabel} <small>{totals.get(group)} nesta página</small></th></tr>}
          <tr className={bucket === 'overdue' ? 'assignments-overdue' : ''}>
            {canAssign && <td className="assignments-check"><input type="checkbox" disabled={working || !open(row)} checked={selected.includes(keyOf(row))} aria-label={'Selecionar ' + (row.process.case_number || row.process.id)} onChange={event => toggleSelection([row], event.target.checked)} /></td>}
            <td><button className="assignments-process-link" type="button" onClick={() => setDetail(row)}>{row.process.case_number || 'Sem número'}</button></td>
            <td>{taskTypeLabel(row.task.type)}</td>
            <td>{nameOf(row)}</td>
            <td><span className={'assignments-status ' + (open(row) ? 'is-open' : 'is-closed')}>{PROCESS_STATUS_LABELS[normalize(row.process.status)] || row.process.status || 'Pendente'}</span></td>
            <td><span className={bucket === 'overdue' ? 'assignments-late-label' : ''}>{dateLabel(row)}{bucket === 'overdue' ? ' · Vencida' : ''}</span></td>
          </tr>
        </Fragment>;
      })}
      {!list.length && <tr><td colSpan={canAssign ? 6 : 5} className="assignments-empty-row">{loading ? 'Carregando processos…' : loadErrors.length ? 'Nenhum registro carregado neste filtro. Verifique as falhas da consulta.' : activeTasks.length === 0 ? 'Não há tarefas ativas disponíveis nesta carteira ou para suas permissões.' : 'Nenhuma tarefa corresponde aos filtros selecionados.'}</td></tr>}
      </tbody>
    </table></div>;
  }

  const filteredSummary = loading
    ? (progressTotal ? 'Carregando ' + loadedCount + ' de ' + progressTotal + ' processos reais' : 'Consultando atribuições…')
    : loadErrors.length
      ? rows.length + ' processos carregados (consulta parcial)'
      : rows.length + ' processos consultados';
  const selectionPlan = mode === 'balance' ? balancePlan : selectedRows.map(row => ({ row, assigneeId: recipient }));
  const canSave = mode === 'balance' ? balancePlan.length === selectedRows.length && balancePlan.length > 0 : Boolean(recipient && eligible);

  return <section className="assignments-board" aria-label="Gestão de atribuições individuais">
    <header className="assignments-header">
      <div><h1>Atribuições</h1></div>
      <button className="secondary-button assignments-refresh" type="button" title="Atualizar atribuições" aria-label="Atualizar atribuições" disabled={loading || working} onClick={() => setRefresh(value => value + 1)}><RefreshCw size={15} /><span className="mba-visually-hidden">Atualizar</span></button>
    </header>
    <div className="assignments-kpis" aria-label="Indicadores das atribuições">
      <button type="button" className="assignments-kpi mba-metric-card" onClick={() => { setStatus('unassigned'); setView('task'); }}><span>Sem responsável</span><strong>{loading && !rows.length ? '—' : counts.unassigned.toLocaleString('pt-BR')}</strong></button>
      <button type="button" className="assignments-kpi mba-metric-card" onClick={() => { setStatus('today'); setView('deadline'); }}><span>Vencem hoje</span><strong>{loading && !rows.length ? '—' : counts.today.toLocaleString('pt-BR')}</strong></button>
      <button type="button" className="assignments-kpi mba-metric-card" onClick={() => { setStatus('overdue'); setView('deadline'); }}><span>Vencidas</span><strong className={counts.overdue ? 'assignments-risk-number' : ''}>{loading && !rows.length ? '—' : counts.overdue.toLocaleString('pt-BR')}</strong></button>
      <button type="button" className="assignments-kpi mba-metric-card" onClick={() => { setStatus('in_progress'); setView('people'); }}><span>Em andamento</span><strong>{loading && !rows.length ? '—' : counts.working.toLocaleString('pt-BR')}</strong></button>
    </div>
    {(loading || loadErrors.length > 0) && <div className="assignments-data-note">{loading ? 'Indicadores parciais até o fim da consulta.' : 'Indicadores parciais: alguns lotes não foram consultados.'}</div>}
    <div className="assignments-toolbar">
      <nav className="assignments-views" aria-label="Visões das atribuições">
        <button type="button" className={view === 'people' ? 'active' : ''} aria-pressed={view === 'people'} onClick={() => setView('people')}><Users size={15} /> Por pessoa</button>
        <button type="button" className={view === 'task' ? 'active' : ''} aria-pressed={view === 'task'} onClick={() => setView('task')}><ArrowLeftRight size={15} /> Por tarefa</button>
        <button type="button" className={view === 'deadline' ? 'active' : ''} aria-pressed={view === 'deadline'} onClick={() => setView('deadline')}><CalendarClock size={15} /> Por vencimento</button>
      </nav>
      <button type="button" className="assignments-export" disabled={!filtered.length || working} onClick={exportCsv}><Download size={15} /> Exportar CSV</button>
    </div>
    <div className="assignments-filters">
      <label>Tipo de tarefa<select value={type} onChange={event => setType(event.target.value)}><option value="all">Todos os tipos</option>{types.map(value => <option key={value} value={value}>{taskTypeLabel(value)}</option>)}</select></label>
      <label>Responsável<select value={analyst} onChange={event => setAnalyst(event.target.value)}><option value="all">Todos</option><option value="__none__">Sem responsável</option>{people.map(person => <option key={person.id} value={person.id}>{person.name}</option>)}</select></label>
      <label>Situação<select value={status} onChange={event => setStatus(event.target.value)}>
        <option value="open">Em aberto</option><option value="all">Todas</option><option value="pending">Pendentes</option><option value="in_progress">Em andamento</option><option value="unassigned">Sem responsável</option><option value="today">Vencem hoje</option><option value="overdue">Vencidas</option><option value="completed">Concluídas</option>
      </select></label>
      <label>Busca<div className="assignments-search"><Search size={15} /><input type="search" value={search} placeholder="Processo, tipo ou analista" onChange={event => setSearch(event.target.value)} /></div></label>
    </div>
    {loadErrors.length > 0 && <div role="alert" className="assignments-warning">Falha na consulta de {loadErrors.length} grupo(s) de tarefas: {loadErrors.slice(0, 5).join(', ')}{loadErrors.length > 5 ? '…' : ''}. Os totais não representam toda a carteira. <button type="button" disabled={loading} onClick={() => setRefresh(value => value + 1)}>Tentar novamente</button></div>}
    {notice && <div role="status" className="assignments-notice"><Check size={15} /><span>{notice}</span><button aria-label="Fechar aviso" type="button" onClick={() => setNotice('')}><X size={14} /></button></div>}
    <div className="assignments-summary" aria-live="polite"><span>{filtered.length} registros · {filteredSummary}</span></div>
    {canAssign && selectedRows.length > 0 && <div className="assignments-bulk" aria-label="Ações para tarefas selecionadas">
      <div className="assignments-bulk-head"><strong>{selectedRows.length} tarefa(s) selecionada(s)</strong><button type="button" disabled={working} onClick={() => setSelected([])}>Limpar seleção</button></div>
      <div className="assignments-bulk-controls">
        <div className="assignments-mode">
          <button type="button" disabled={working} aria-pressed={mode === 'direct'} className={mode === 'direct' ? 'active' : ''} onClick={() => setMode('direct')}><ArrowLeftRight size={14} /> Atribuir / redistribuir</button>
          <button type="button" disabled={working} aria-pressed={mode === 'balance'} className={mode === 'balance' ? 'active' : ''} onClick={() => setMode('balance')}><Scale size={14} /> Simular balanceamento</button>
        </div>
        {mode === 'direct' && <label>Destino<select disabled={working} value={recipient} onChange={event => setRecipient(event.target.value)}><option value="">Selecionar analista</option>{candidates.map(person => <option value={person.id} key={person.id}>{person.name || person.email || person.id}</option>)}</select></label>}
        <button type="button" className="primary-button" disabled={working || !canSave} onClick={() => void saveAssignments(selectionPlan)}>{working ? 'Salvando…' : mode === 'balance' ? 'Confirmar distribuição' : 'Confirmar atribuição'}</button>
      </div>
      {mode === 'direct' && recipient && !eligible && <small className="assignments-bulk-hint">Este destinatário não consta nas opções de todos os tipos selecionados.</small>}
      {mode === 'balance' && <div className="assignments-balance-preview">
        <p>Sugestão por menor volume de tarefas abertas carregadas, considerando os usuários retornados pela API. Não verifica capacidade individual nem habilitação definitiva; revise antes de confirmar.</p>
        {!balancePlan.length ? <strong>Não há destinatários disponíveis para todos os tipos selecionados.</strong> : <div>{balancePlan.slice(0, 6).map(entry => <span key={keyOf(entry.row)}>{entry.row.process.case_number || entry.row.process.id} → {candidates.find(item => String(item.id) === entry.assigneeId)?.name || 'Analista'}</span>)}{balancePlan.length > 6 && <span>+ {balancePlan.length - 6} sugestões</span>}</div>}
      </div>}
    </div>}
    {view === 'people' ? <div className="assignments-people">
      <div className="assignments-people-heading"><span>Colaborador</span><span>Em aberto</span><span>Em execução</span><span>Vencidas</span><span>Vencem hoje</span><span>Carga relativa</span></div>
      {shownPeople.map(person => <div className="assignments-person" key={person.id}>
        <button type="button" className="assignments-person-toggle" aria-expanded={expanded === person.id} onClick={() => setExpanded(old => old === person.id ? null : person.id)}>
          <span className="assignments-person-name">{expanded === person.id ? <ChevronDown size={15} /> : <ChevronRight size={15} />}<strong>{person.name}</strong></span>
          <b>{person.pending}</b><span>{person.working}</span><span className={person.overdue ? 'assignments-risk-number' : ''}>{person.overdue}</span><span>{person.today}</span>
          <span className="assignments-load"><span style={{ width: String(Math.round(person.pending / maxPending * 100)) + '%' }} /></span>
        </button>
        {expanded === person.id && <div className="assignments-person-details">
          <div className="assignments-person-details-head"><span>{person.rows.length} tarefa(s) no filtro</span>{canAssign && <button type="button" disabled={working || !person.rows.some(open)} onClick={() => toggleSelection(person.rows, true)}>Selecionar pendentes</button>}</div>
          {processTable([...person.rows].sort(sortByDeadline))}
        </div>}
      </div>)}
      {!shownPeople.length && <div className="assignments-empty-row">{loading ? 'Consultando tarefas e responsáveis…' : loadErrors.length ? 'Nenhum responsável carregado. Confira as falhas acima.' : activeTasks.length === 0 ? 'Não há tarefas ativas disponíveis nesta carteira ou para suas permissões.' : 'Nenhum responsável ou tarefa corresponde aos filtros.'}</div>}
    </div> : processTable(shownRows, true)}
    <footer className="assignments-pagination"><span>{total ? (safePage * pageSize + 1) + '–' + Math.min((safePage + 1) * pageSize, total) + ' de ' + total : '0 registros'} · Página {safePage + 1} de {pages}</span>
      <div><label>Exibir <select aria-label="Itens por página" value={pageSize} onChange={event => setPageSize(Number(event.target.value))}><option value={25}>25</option><option value={50}>50</option><option value={100}>100</option></select></label>
      <button type="button" disabled={safePage === 0 || loading} onClick={() => setPage(value => Math.max(0, value - 1))}>Anterior</button>
      <button type="button" disabled={safePage >= pages - 1 || loading} onClick={() => setPage(value => Math.min(pages - 1, value + 1))}>Próxima</button></div>
    </footer>
    {detail && <div className="assignments-dialog-backdrop" role="presentation" onMouseDown={event => { if (event.target === event.currentTarget) setDetail(null); }}>
      <section role="dialog" aria-modal="true" aria-label="Detalhes da atribuição" className="assignments-dialog">
        <header><div><small>Detalhes do processo</small><h2>{detail.process.case_number || 'Processo sem CNJ'}</h2></div><button type="button" onClick={() => setDetail(null)} aria-label="Fechar detalhes"><X size={17}/></button></header>
        <dl><dt>Tipo</dt><dd>{taskTypeLabel(detail.task.type)}</dd><dt>Responsável</dt><dd>{nameOf(detail)}</dd><dt>Situação</dt><dd>{PROCESS_STATUS_LABELS[normalize(detail.process.status)] || detail.process.status || 'Pendente'}</dd><dt>Prazo</dt><dd>{dateLabel(detail)}</dd><dt>Lote de origem</dt><dd>{detail.task.title || 'Não informado'}</dd></dl>
        <footer><button type="button" className="secondary-button" onClick={() => setDetail(null)}>Fechar</button>{canAssign && open(detail) && <button type="button" className="primary-button" onClick={() => { setSelected([keyOf(detail)]); setDetail(null); setMode('direct'); }}>Redistribuir processo</button>}</footer>
      </section>
    </div>}
  </section>;
}
