import { type FormEvent, useEffect, useRef, useState } from 'react';
import { processRequest, processPath, type ProcessRecord, type ProcessDetail, type Paged, type LinkedTask, type Timeline, type TimelineEvent } from './processosService';
import { taskTypeLabel } from '../tasks/model';
import { BRAZIL_STATES } from './brazilStates';
import './processos.css';

type Profile = {permissions?: Record<string, boolean>; capabilities?: {processos?: boolean}; portfolios?: {id: string; display_name?: string}[]};
type ProcessWindow = Window & typeof globalThis & {MBA_CURRENT_USER?: Profile; MBA_API?: {getPortfolioId: () => string}; MBA_NAVIGATE?: (route: string) => boolean};
const win = window as ProcessWindow;
const route = () => (location.hash.startsWith('#/') ? location.hash.slice(2) : location.pathname).replace(/^\/+|\/+$/g, '');
const selectedCnj = () => {
  const path = route(); if (!path.startsWith('processos/')) return '';
  try { return decodeURIComponent(path.slice(10)); } catch { return path.slice(10); }
};
const date = (value?: string) => { if (!value) return 'Não disponível'; const d = new Date(value); return isNaN(d.getTime()) ? value : d.toLocaleString('pt-BR'); };
const statusLabel = (s: string) => ({pending:'Pendente',in_progress:'Em execução',waiting:'Aguardando',completed:'Concluída',error:'Erro',inactive:'Inativa',cancelled:'Cancelada'}[s] || s);
const KIND_LABELS = {judicial:'Evento judicial',system:'Atualização de sistema',human_analysis:'Análise humana',automation:'Execução de automação',task:'Evento de tarefa'};
const eventTitle = (e: TimelineEvent) => ({task_created:'Tarefa criada',analysis_completed:'Análise concluída',analysis_deferred:'Análise reagendada',process_skipped:'Processo pulado',task_updated:'Tarefa atualizada'}[e.title] || e.title);

function Pagination({page, more, busy, total, onChange}: {page: number; more: boolean; busy: boolean; total?: number; onChange: (page: number) => void}) {
  return <nav className="processos-pagination" aria-label="Paginação"><span>{total !== undefined ? `${total} processo(s) · ` : ''}Página {page}</span><button type="button" disabled={busy || page === 1} onClick={() => onChange(page - 1)}>Anterior</button><button type="button" disabled={busy || !more || page >= 200} onClick={() => onChange(page + 1)}>Próxima</button></nav>;
}

function CreateProcessTask({cnj, types, onCreated, onClose}: {cnj: string; types: string[]; onCreated: () => void; onClose: () => void}) {
  const [type, setType] = useState(types[0] || '');
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState('medium');
  const [deadline, setDeadline] = useState('');
  const [assignee, setAssignee] = useState('');
  const [users, setUsers] = useState<{id: string; name?: string}[]>([]);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const close = useRef<HTMLButtonElement>(null);
  useEffect(() => { close.current?.focus(); }, []);
  useEffect(() => {
    let active = true;
    setUsers([]); setAssignee(''); setError('');
    processRequest<{id: string; name?: string}[]>('/api/task-assignees?module=' + encodeURIComponent(type))
      .then(rows => { if (active) setUsers(rows); }).catch(e => { if (active) setError(e.message); });
    return () => { active = false; };
  }, [type]);
  const submit = async (event: FormEvent) => {
    event.preventDefault(); if (busy) return; setBusy(true); setError('');
    try {
      await processRequest('/api/tasks', {method:'POST',body:JSON.stringify({type, title: title.trim() || taskTypeLabel(type), priority, deadline_at:deadline || null, responsible_id:assignee, source:'api', process_cnj:cnj})});
      onCreated();
    } catch (e: any) {setError(e.message || 'Não foi possível criar a tarefa.');} finally {setBusy(false);}
  };
  return <div className="task-modal-backdrop"><form className="task-react-modal processos-create" role="dialog" aria-modal="true" aria-label="Criar tarefa vinculada" onSubmit={submit}
    onKeyDown={event => {
      if (event.key === 'Escape' && !busy) onClose();
      if (event.key === 'Tab') {
        const controls = [...event.currentTarget.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled)')];
        const first=controls[0], last=controls[controls.length-1];
        if(event.shiftKey && document.activeElement===first) {event.preventDefault();last?.focus();}
        else if(!event.shiftKey && document.activeElement===last) {event.preventDefault();first?.focus();}
      }
    }}>
    <header><div><h2>Criar tarefa</h2><p>{cnj}</p></div><button ref={close} type="button" disabled={busy} onClick={onClose} aria-label="Fechar">×</button></header>
    <label>Tipo<select value={type} disabled={busy} onChange={e => setType(e.target.value)}>{types.map(t => <option key={t} value={t}>{taskTypeLabel(t)}</option>)}</select></label>
    <label>Título<input value={title} disabled={busy} maxLength={200} placeholder={taskTypeLabel(type)} onChange={e => setTitle(e.target.value)}/></label>
    <label>Responsável<select required value={assignee} disabled={busy} onChange={e => setAssignee(e.target.value)}><option value="">Selecione</option>{users.map(u => <option key={u.id} value={u.id}>{u.name || u.id}</option>)}</select></label>
    <div className="processos-fields"><label>Prioridade<select value={priority} disabled={busy} onChange={e => setPriority(e.target.value)}><option value="high">Alta</option><option value="medium">Média</option><option value="low">Baixa</option></select></label><label>Prazo<input type="date" value={deadline} disabled={busy} onChange={e => setDeadline(e.target.value)}/></label></div>
    {error ? <p role="alert">{error}</p> : null}<footer><button className="primary-button" type="submit" disabled={busy || !assignee}>{busy ? 'Criando…' : 'Criar tarefa'}</button></footer>
  </form></div>;
}

function ProcessView({cnj, onBack}: {cnj: string; onBack: () => void}) {
  const [detail, setDetail] = useState<ProcessDetail | null>(null);
  const [error, setError] = useState('');
  const [tab, setTab] = useState<'timeline' | 'tasks'>('timeline');
  const [page, setPage] = useState(1);
  const [events, setEvents] = useState<Timeline | null>(null);
  const [tasks, setTasks] = useState<Paged<LinkedTask> | null>(null);
  const [panelError, setPanelError] = useState('');
  const [loading, setLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState('');
  const createTrigger = useRef<HTMLButtonElement>(null);
  useEffect(() => {
    let active = true;
    setDetail(null); setError('');
    processRequest<ProcessDetail>(processPath(cnj)).then(data => {if(active) setDetail(data);}).catch(e => {if(active) setError(e.message);});
    return () => {active=false;};
  }, [cnj, revision]);
  useEffect(() => {
    if (!detail) return;
    let active = true;
    setLoading(true); setPanelError(''); setEvents(null); setTasks(null);
    if (tab === 'tasks' && !detail.permissions.tasks) {setLoading(false); return;}
    const endpoint = processPath(cnj) + '/' + (tab === 'tasks' ? 'tasks' : 'timeline') + '?page=' + page + '&page_size=25';
    processRequest<Timeline | Paged<LinkedTask>>(endpoint).then(data => {if(active) tab === 'timeline' ? setEvents(data as Timeline) : setTasks(data as Paged<LinkedTask>);})
      .catch(e => {if(active) setPanelError(e.message);}).finally(() => {if(active) setLoading(false);});
    return () => {active=false;};
  }, [detail, tab, cnj, page]);
  const closeCreate = () => {setCreate(false);requestAnimationFrame(() => createTrigger.current?.focus());};
  return <section className="processos-detail">
    <button type="button" className="processos-back" onClick={onBack}>← Processos</button>
    {error ? <div role="alert" className="processos-state">{error}<button type="button" onClick={() => setRevision(r => r + 1)}>Tentar novamente</button></div> : !detail ? <div className="processos-state" role="status">Carregando processo…</div> : <>
      <header className="processos-heading"><div><h1>{detail.cnj}</h1><p>{detail.process.carteira || detail.process.cliente || detail.process.portfolio_id}</p></div>{detail.permissions.create_task && detail.permissions.task_types.length ? <button ref={createTrigger} className="primary-button" type="button" onClick={() => setCreate(true)}>Criar tarefa</button> : null}</header>
      <dl className="processos-identification"><div><dt>Situação Benner</dt><dd>{detail.process.situation_benner || 'Não disponível'}</dd></div><div><dt>Situação CPJ</dt><dd>{detail.process.situation_cpj || 'Não disponível'}</dd></div><div><dt>UF</dt><dd>{detail.process.state || 'Não disponível'}</dd></div><div><dt>Fase</dt><dd>{detail.process.fase || 'Não disponível'}</dd></div><div><dt>Fonte da base</dt><dd>{detail.process.integration || 'Não disponível'}</dd></div><div><dt>Atualização da base</dt><dd>{date(detail.process.updated_at)}</dd></div></dl>
      {notice ? <p role="status">{notice}</p> : null}
      <nav className="processos-tabs" aria-label="Visões do processo"><button type="button" aria-current={tab==='timeline'?'page':undefined} onClick={() => {setTab('timeline');setPage(1);}}>Histórico</button>{detail.permissions.tasks ? <button type="button" aria-current={tab==='tasks'?'page':undefined} onClick={() => {setTab('tasks');setPage(1);}}>Tarefas</button> : null}</nav>
      {panelError ? <div className="processos-state" role="alert">{panelError}<button type="button" onClick={() => setRevision(r=>r+1)}>Tentar novamente</button></div> : loading ? <div className="processos-state" role="status">Carregando {tab==='timeline'?'histórico':'tarefas'}…</div> : tab === 'timeline' && events ? <>
        {events.sources.datajud.state !== 'available' ? <p className="processos-source-status" role="status">{events.sources.datajud.message}</p> : null}
        {events.rows.length ? <ol className="processos-timeline">{events.rows.map(e => <li key={e.id} data-event-kind={e.kind}><div><span className="processos-kind">{KIND_LABELS[e.kind]}</span><time>{date(e.occurred_at)}</time></div><h3>{eventTitle(e)}</h3><p>{e.source}{e.degree ? ' · '+e.degree : ''}{e.code ? ' · Código '+e.code : ''}</p><details><summary>Rastreabilidade</summary><dl><div><dt>Data do fato</dt><dd>{date(e.occurred_at)}</dd></div><div><dt>Captura</dt><dd>{date(e.captured_at)}</dd></div><div><dt>Identificador</dt><dd>{e.source_id || e.id}</dd></div></dl>{e.references?.map((r,i) => <p key={i}>Captura {date(r.captured_at)} · Job {r.job_id || 'Não disponível'} · Origem {r.source_id || 'Não disponível'}</p>)}</details></li>)}</ol> : <div className="processos-state">Nenhum evento disponível nas fontes consultadas.</div>}
        <Pagination page={page} more={events.has_more} busy={loading} onChange={setPage}/>
      </> : tasks ? <><div className="processos-table-wrap"><table><thead><tr><th>Tarefa</th><th>Responsável</th><th>Prioridade</th><th>Status</th><th>Prazo</th><th><span className="sr-only">Ação</span></th></tr></thead><tbody>{tasks.rows.map(t => <tr key={t.process_id}><td>{taskTypeLabel(t.type)}<small>{t.title}</small></td><td>{t.responsible_name || 'Não atribuída'}</td><td>{{high:'Alta',medium:'Média',low:'Baixa'}[t.priority] || t.priority}</td><td>{statusLabel(t.status)}</td><td>{t.deadline_at ? date(t.deadline_at) : 'Sem prazo'}</td><td>{<button type="button" onClick={() => win.MBA_NAVIGATE?.('tarefas/item/'+t.task_id+'/'+t.process_id)}>Abrir tarefa</button>}</td></tr>)}</tbody></table></div>{!tasks.rows.length ? <div className="processos-state">Nenhuma tarefa visível vinculada a este processo.</div> : null}<Pagination page={page} more={page*25<tasks.total} busy={loading} onChange={setPage}/></> : null}
      {create ? <CreateProcessTask cnj={detail.cnj} types={detail.permissions.task_types} onClose={closeCreate} onCreated={() => {closeCreate();setNotice('Tarefa criada e vinculada ao processo.');setPage(1);setTab('tasks');setRevision(r=>r+1);}}/> : null}
    </>}
  </section>;
}

export function ProcessosPage() {
  const [cnj, setCnj] = useState(selectedCnj);
  const [search, setSearch] = useState('');
  const [situationSearch, setSituationSearch] = useState('');
  const [filters, setFilters] = useState({q:'',situation:'',uf:'',pending_tasks:''});
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<ProcessRecord> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const profile = win.MBA_CURRENT_USER;
  const portfolio = profile?.portfolios?.find(p => p.id === win.MBA_API?.getPortfolioId());
  const authorized = profile?.capabilities?.processos === true && profile.permissions?.['processos.view'] === true;
  useEffect(() => {
    const sync=()=>setCnj(selectedCnj());window.addEventListener('mba:route-changed',sync);window.addEventListener('popstate',sync);
    return () => {window.removeEventListener('mba:route-changed',sync);window.removeEventListener('popstate',sync);};
  }, []);
  useEffect(() => {
    if(cnj || !authorized) return;
    let active=true;setLoading(true);setError('');setData(null);
    const params=new URLSearchParams({page:String(page),page_size:'25'});
    Object.entries(filters).forEach(([key,value])=>{if(value)params.set(key,value);});
    processRequest<Paged<ProcessRecord>>('/api/processos?'+params).then(rows=>{if(active)setData(rows);}).catch(e=>{if(active)setError(e.message);}).finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[filters,page,cnj,authorized,revision]);
  if(!authorized) return <div className="processos-state" role="status">Processos indisponível para este acesso.</div>;
  if(cnj) return <ProcessView key={cnj} cnj={cnj} onBack={()=>win.MBA_NAVIGATE?.('processos')}/>;
  const filter=(key: keyof typeof filters,value:string)=>{setPage(1);setFilters(f=>({...f,[key]:value}));};
  return <section className="processos-page"><header className="processos-heading"><div><h1>Processos</h1><p>{portfolio?.display_name || portfolio?.id || 'Carteira ativa'}</p></div></header>
    <form className="processos-filters" onSubmit={e=>{e.preventDefault();setPage(1);setFilters(f=>({...f,q:search.trim(),situation:situationSearch.trim()}));}}><label className="processos-search">Número CNJ<input type="search" inputMode="numeric" maxLength={25} value={search} placeholder="Buscar processo" onChange={e=>setSearch(e.target.value)}/></label><button className="primary-button" type="submit">Buscar</button><label>Situação<input value={situationSearch} maxLength={100} placeholder="Situação da base" list="processos-situacoes" onChange={e=>setSituationSearch(e.target.value)}/><datalist id="processos-situacoes">{[...new Set(data?.rows.flatMap(p=>[p.situation_benner,p.situation_cpj]).filter(Boolean))].map(s=><option key={s} value={s}/>)}</datalist></label><label>UF<select value={filters.uf} onChange={e=>filter('uf',e.target.value)}><option value="">Todas</option>{BRAZIL_STATES.map(s=><option key={s.uf} value={s.uf}>{s.uf}</option>)}</select></label>{profile?.permissions?.['tasks.view'] ? <label>Tarefas pendentes<select value={filters.pending_tasks} onChange={e=>filter('pending_tasks',e.target.value)}><option value="">Todas</option><option value="true">Com pendências</option><option value="false">Sem pendências</option></select></label> : null}<button type="button" className="processos-clear" onClick={()=>{setSearch('');setSituationSearch('');setPage(1);setFilters({q:'',situation:'',uf:'',pending_tasks:''});}}>Limpar</button></form>
    {error ? <div className="processos-state" role="alert">{error}<button type="button" onClick={()=>setRevision(r=>r+1)}>Tentar novamente</button></div> : loading ? <div className="processos-state" role="status">Carregando processos…</div> : data?.rows.length ? <div className="processos-table-wrap"><table><thead><tr><th>Processo</th><th>Situação Benner / CPJ</th><th>UF</th><th>Tarefas pendentes</th><th>Atualização</th></tr></thead><tbody>{data.rows.map(p=><tr key={p.id}><td><button type="button" onClick={()=>win.MBA_NAVIGATE?.('processos/'+encodeURIComponent(p.cnj))}>{p.cnj}</button><small>{p.carteira || p.cliente || p.portfolio_id}</small></td><td>{p.situation_benner || p.situation_cpj || 'Não informada'}</td><td>{p.state || '—'}</td><td>{p.has_pending_tasks===null?'Sem acesso':p.has_pending_tasks?'Sim':'Não'}</td><td>{date(p.updated_at)}</td></tr>)}</tbody></table></div> : <div className="processos-state">Nenhum processo encontrado para os filtros selecionados.</div>}
    {data ? <Pagination page={page} more={page*25<data.total} total={data.total} busy={loading} onChange={setPage}/> : null}
  </section>;
}
