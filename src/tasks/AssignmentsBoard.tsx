import { Fragment, useEffect, useMemo, useState } from 'react';
import { isTaskActive, normalize, PROCESS_STATUS_LABELS, taskTypeLabel, type Task, type TaskProcess } from './model';
import type { ApiRequest } from './renderers';
import './assignmentsBoard.css';

type Row = { task: Task; process: TaskProcess };
type Assignee = { id: string; name?: string; email?: string };
type View = 'people' | 'task' | 'deadline';

export function AssignmentsBoard({ tasks, api, canAssign }: {
  tasks: Task[]; api: ApiRequest; canAssign: boolean;
}) {
  const [rows, setRows] = useState<Row[]>([]);
  const [assignees, setAssignees] = useState<Record<string, Assignee[]>>({});
  const [loading, setLoading] = useState(false);
  const [loadErrors, setLoadErrors] = useState<string[]>([]);
  const [view, setView] = useState<View>('people');
  const [type, setType] = useState('all');
  const [analyst, setAnalyst] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [recipient, setRecipient] = useState('');
  const [working, setWorking] = useState(false);
  const [notice, setNotice] = useState('');
  const [refresh, setRefresh] = useState(0);
  const activeTasks = useMemo(() => tasks.filter(isTaskActive), [tasks]);
  const types = useMemo(() => Array.from(new Set(activeTasks.map(item => normalize(item.type)))).filter(Boolean).sort(), [activeTasks]);
  const visibleTasks = useMemo(() => type === 'all' ? activeTasks : activeTasks.filter(item => normalize(item.type) === type), [activeTasks, type]);
  const visibleTaskKey = visibleTasks.map(task => task.id).join(',');
  const typeKey = types.join(',');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadErrors([]);
    setRows([]);
    setSelected([]);
    const load = async () => {
      const next: Row[] = [];
      const errors: string[] = [];
      // Backend does not yet provide a paginated assignment index. Cap concurrent
      // requests so this page cannot overwhelm the API for a large portfolio.
      for (let index = 0; index < visibleTasks.length; index += 3) {
        if (cancelled) return;
        const chunk = visibleTasks.slice(index, index + 3);
        const results = await Promise.allSettled(chunk.map(task => api('/api/tasks/' + task.id + '/processes')));
        if (cancelled) return;
        results.forEach((result, i) => {
          if (result.status === 'fulfilled' && Array.isArray(result.value)) {
            next.push(...(result.value as TaskProcess[]).map(process => ({ task: chunk[i], process })));
          } else {
            errors.push(chunk[i].title || taskTypeLabel(chunk[i].type));
          }
        });
      }
      if (!cancelled) {
        setRows(next);
        setLoadErrors(errors);
        setLoading(false);
      }
    };
    void load().catch(() => {
      if (!cancelled) {
        setLoading(false);
        setLoadErrors(['Falha ao consultar atribuições']);
      }
    });
    return () => { cancelled = true; };
  }, [api, visibleTaskKey, refresh]);

  useEffect(() => {
    if (!canAssign || !types.length) return;
    let cancelled = false;
    const request = async () => {
      const next: Record<string, Assignee[]> = {};
      const settled = await Promise.allSettled(types.map(item => api('/api/task-assignees?module=' + encodeURIComponent(item))));
      settled.forEach((result, i) => {
        next[types[i]] = result.status === 'fulfilled' && Array.isArray(result.value) ? result.value : [];
      });
      if (!cancelled) setAssignees(next);
    };
    void request();
    return () => { cancelled = true; };
  }, [api, typeKey, canAssign]);

  const nameOf = (row: Row): string => {
    const id = String(row.process.assignee_id || '');
    if (!id) return 'Não atribuída';
    const candidate = (assignees[normalize(row.task.type)] || []).find(person => String(person.id) === id);
    if (candidate) return candidate.name || candidate.email || 'Analista';
    const index = (row.task.participant_user_ids || []).findIndex(userId => String(userId) === id);
    if (index >= 0) return row.task.participant_names?.[index] || 'Analista';
    return row.process.assignee_name || (row.task.responsible_id === id ? row.task.responsible_name : null) || 'Responsável';
  };
  const late = (row: Row): boolean => {
    if (!row.task.deadline_at || normalize(row.process.status) === 'completed') return false;
    const deadline = new Date(row.task.deadline_at);
    return !Number.isNaN(deadline.getTime()) && deadline.getTime() < Date.now();
  };
  const keyOf = (row: Row) => row.task.id + ':' + row.process.id;
  const filtered = useMemo(() => rows.filter(row => {
    if (analyst !== 'all' && String(row.process.assignee_id || '__none__') !== analyst) return false;
    const needle = normalize(search);
    return !needle || normalize(row.process.case_number).includes(needle)
      || normalize(taskTypeLabel(row.task.type)).includes(needle)
      || normalize(nameOf(row)).includes(needle);
  }), [rows, view, search, analyst, assignees]);
  const people = useMemo(() => {
    const byId = new Map<string, string>();
    rows.forEach(row => { if (row.process.assignee_id) byId.set(String(row.process.assignee_id), nameOf(row)); });
    return Array.from(byId, ([id, name]) => ({ id, name })).sort((a,b) => a.name.localeCompare(b.name, 'pt-BR'));
  }, [rows, assignees]);
  const selectedRows = rows.filter(row => selected.includes(keyOf(row)) && !['completed', 'inactive', 'cancelled'].includes(normalize(row.process.status)));
  const eligible = selectedRows.length && selectedRows.every(row =>
    (assignees[normalize(row.task.type)] || []).some(person => String(person.id) === recipient));

  const deadlineGroup = (row: Row): { key: string; label: string; rank: number } => {
    const raw = row.task.deadline_at;
    if (!raw) return { key: 'none', label: 'Sem vencimento', rank: 4 };
    const day = new Date(raw);
    if (Number.isNaN(day.getTime())) return { key: 'none', label: 'Sem vencimento', rank: 4 };
    const start = new Date(); start.setHours(0, 0, 0, 0);
    const offset = new Date(day.getFullYear(), day.getMonth(), day.getDate()).getTime() - start.getTime();
    if (offset < 0) return { key: 'overdue', label: 'Vencidas', rank: 0 };
    if (offset === 0) return { key: 'today', label: 'Vencem hoje', rank: 1 };
    if (offset <= 7 * 86400000) return { key: 'soon', label: 'Próximos 7 dias', rank: 2 };
    return { key: 'future', label: 'Vencimentos futuros', rank: 3 };
  };
  const groupKey = (row: Row) => view === 'people'
    ? 'person:' + String(row.process.assignee_id || '__none__')
    : view === 'task' ? 'task:' + row.task.id : 'due:' + deadlineGroup(row).key;
  const groupLabel = (row: Row) => view === 'people'
    ? nameOf(row)
    : view === 'task' ? (row.task.title || taskTypeLabel(row.task.type))
    : deadlineGroup(row).label;
  const ordered = [...filtered].sort((a, b) => {
    const label = (row: Row) => view === 'deadline'
      ? String(deadlineGroup(row).rank).padStart(2, '0')
      : view === 'people' ? normalize(nameOf(row)) : normalize(row.task.title || taskTypeLabel(row.task.type));
    const groupCompare = label(a).localeCompare(label(b), 'pt-BR');
    if (groupCompare) return groupCompare;
    const aDate = a.task.deadline_at ? new Date(a.task.deadline_at).getTime() : Number.POSITIVE_INFINITY;
    const bDate = b.task.deadline_at ? new Date(b.task.deadline_at).getTime() : Number.POSITIVE_INFINITY;
    if (aDate !== bDate && Number.isFinite(aDate) && Number.isFinite(bDate)) return aDate - bDate;
    return String(a.process.case_number || a.process.id).localeCompare(String(b.process.case_number || b.process.id), 'pt-BR');
  });
  const groupTotals = new Map<string, number>();
  ordered.forEach(row => groupTotals.set(groupKey(row), (groupTotals.get(groupKey(row)) || 0) + 1));
  const pageSize = 40;
  const [page, setPage] = useState(0);
  useEffect(() => { setPage(0); setSelected([]); }, [type, view, analyst, search]);
  const pages = Math.max(1, Math.ceil(ordered.length / pageSize));
  const safePage = Math.min(page, pages - 1);
  const shown = ordered.slice(safePage * pageSize, (safePage + 1) * pageSize);
  const selectable = shown.filter(row => !['completed', 'cancelled', 'inactive'].includes(normalize(row.process.status)));
  const allPageSelected = selectable.length > 0 && selectable.every(row => selected.includes(keyOf(row)));

  async function assign() {
    if (!canAssign || !recipient || !eligible || working) return;
    setWorking(true); setNotice('');
    let done = 0;
    const failed: string[] = [];
    // Existing route validates portfolio membership and authorization per case.
    // Partial errors are surfaced; no optimistic "all assigned" confirmation.
    for (const row of selectedRows) {
      try {
        await api('/api/task-processes/' + row.process.id, {
          method: 'PATCH',
          body: JSON.stringify({ assignee_id: recipient }),
        });
        done += 1;
      } catch {
        failed.push(row.process.case_number || row.process.id);
      }
    }
    setNotice(done + ' atribuição(ões) confirmada(s).' +
      (failed.length ? ' Não concluídas: ' + failed.slice(0, 6).join(', ') + (failed.length > 6 ? '…' : '') : ''));
    setWorking(false);
    setSelected([]);
    setRecipient('');
    setRefresh(value => value + 1);
  }

  return <section className="assignments-board" aria-label="Gestão de atribuições individuais">
    <header className="assignments-header">
      <div><h1>Atribuições</h1><p>Distribua tarefas individuais por processo. Lotes de importação não são unidades de atribuição.</p></div>
      <button type="button" className="secondary-button" disabled={loading || working} onClick={() => setRefresh(value => value + 1)}>Atualizar</button>
    </header>
    <nav className="assignments-views" aria-label="Visões das atribuições">
      <button type="button" className={view === 'people' ? 'active' : ''} aria-pressed={view === 'people'} onClick={() => setView('people')}>Por pessoa</button>
      <button type="button" className={view === 'task' ? 'active' : ''} aria-pressed={view === 'task'} onClick={() => setView('task')}>Por tarefa</button>
      <button type="button" className={view === 'deadline' ? 'active' : ''} aria-pressed={view === 'deadline'} onClick={() => setView('deadline')}>Por vencimento</button>
    </nav>
    <div className="assignments-filters">
      <label>Tipo de tarefa<select value={type} onChange={event => setType(event.target.value)}>
        <option value="all">Todos os tipos</option>{types.map(t => <option key={t} value={t}>{taskTypeLabel(t)}</option>)}
      </select></label>
      <label>Analista<select value={analyst} onChange={event => setAnalyst(event.target.value)}>
        <option value="all">Todos</option><option value="__none__">Não atribuído</option>
        {people.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
      </select></label>
      <label>Buscar processo ou tipo<input type="search" value={search} placeholder="Número do processo" onChange={event => setSearch(event.target.value)}/></label>
    </div>
    {loadErrors.length > 0 && <div role="alert" className="assignments-warning">Consulta parcial ou indisponível: {loadErrors.join(', ')}. Não utilize contagens parciais como totais da carteira.</div>}
    {notice && <div role="status" className="assignments-notice">{notice}</div>}
    <div className="assignments-summary" aria-live="polite">{loading ? 'Carregando atribuições…' :
      loadErrors.length ? rows.length + ' registros carregados (dados parciais)' : rows.length + ' tarefas individuais consultadas'} · {filtered.length} nesta visão</div>
    {canAssign && selectedRows.length > 0 &&
      <div className="assignments-bulk">
        <strong>{selectedRows.length} selecionada(s)</strong>
        <label>Responsável
          <select value={recipient} onChange={event => setRecipient(event.target.value)}>
            <option value="">Selecionar analista</option>
            {Object.values(assignees).flat().filter((person, index, array) =>
              array.findIndex(p => p.id === person.id) === index
            ).map(person => <option key={person.id} value={person.id}>{person.name || person.email || person.id}</option>)}
          </select>
        </label>
        <button type="button" className="primary-button" disabled={!eligible || working} onClick={() => void assign()}>
          {working ? 'Salvando…' : 'Atribuir selecionadas'}
        </button>
        {recipient && !eligible && <small>Este analista não está habilitado para todos os tipos selecionados.</small>}
      </div>}
    <div className="assignments-table-wrap"><table className="assignments-table">
      <thead><tr>
        {canAssign && <th><input type="checkbox" aria-label="Selecionar página" disabled={loading || working || !selectable.length} checked={allPageSelected}
          onChange={event => setSelected(old => event.target.checked ? Array.from(new Set([...old, ...selectable.map(keyOf)])) : old.filter(id => !selectable.some(row => keyOf(row) === id)))}/></th>}
        <th>Processo</th><th>Tipo</th><th>Responsável</th><th>Situação</th><th>Prazo</th>
      </tr></thead>
      <tbody>{!loading && shown.map((row, index) => <Fragment key={keyOf(row)}>
        {(index === 0 || groupKey(shown[index - 1]) !== groupKey(row)) && <tr className="assignments-group-row"><th scope="rowgroup" colSpan={canAssign ? 6 : 5}>{groupLabel(row)} <small>{groupTotals.get(groupKey(row))} tarefa(s)</small></th></tr>}
        <tr>
        {canAssign && <td><input type="checkbox" aria-label={'Selecionar ' + (row.process.case_number || row.process.id)}
          disabled={working || ['completed','inactive','cancelled'].includes(normalize(row.process.status))}
          checked={selected.includes(keyOf(row))} onChange={event => setSelected(old => event.target.checked ? [...old, keyOf(row)] : old.filter(id => id !== keyOf(row)))}/></td>}
        <td><strong>{row.process.case_number || 'Sem número'}</strong></td>
        <td>{taskTypeLabel(row.task.type)}</td><td>{nameOf(row)}</td>
        <td>{PROCESS_STATUS_LABELS[normalize(row.process.status)] || row.process.status || 'Pendente'}</td>
        <td>{row.task.deadline_at ? new Date(row.task.deadline_at).toLocaleDateString('pt-BR') : '—'}{late(row) ? ' · Vencida' : ''}</td>
        </tr></Fragment>)}
      {!loading && shown.length === 0 && <tr><td colSpan={canAssign ? 6 : 5}>Nenhuma tarefa individual encontrada.</td></tr>}
      {loading && <tr><td colSpan={canAssign ? 6 : 5}>Consultando processos atribuídos…</td></tr>}
      </tbody>
    </table></div>
    <footer className="assignments-pagination"><span>Página {safePage + 1} de {pages}</span><div>
      <button type="button" disabled={safePage === 0 || loading} onClick={() => setPage(p => Math.max(0,p-1))}>Anterior</button>
      <button type="button" disabled={safePage >= pages - 1 || loading} onClick={() => setPage(p => Math.min(pages-1,p+1))}>Próxima</button>
    </div></footer>
  </section>;
}
