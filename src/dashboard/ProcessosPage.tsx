import { type FormEvent, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Search } from 'lucide-react';
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
const date = (value?: string | null) => { if (!value) return 'Não disponível'; const d = new Date(value); return isNaN(d.getTime()) ? value : d.toLocaleString('pt-BR'); };
const statusLabel = (s: string) => ({pending:'Pendente',in_progress:'Em execução',waiting:'Aguardando',completed:'Concluída',error:'Erro',inactive:'Inativa',cancelled:'Cancelada'}[s] || s);
const eventTitle = (e: TimelineEvent) => ({task_created:'Tarefa criada',analysis_completed:'Análise concluída',analysis_deferred:'Análise reagendada',process_skipped:'Processo pulado',task_updated:'Tarefa atualizada'}[e.title] || e.title);


type FilterOption = {value:string; label:string; group?:string};
const situationOptions:FilterOption[]=[
  {value:'',label:'Todas'}, {value:'Em andamento',label:'Em andamento'},
  {value:'Encerrado',label:'Encerrado'}, {value:'Reativado',label:'Reativado'}
];
const movementOptions:FilterOption[]=[
  {value:'',label:'Todas as movimentações'},
  {value:'distribuicao',label:'Distribuição',group:'Formação'},
  {value:'emenda_inicial',label:'Emenda à inicial',group:'Formação'},
  {value:'citacao',label:'Citação',group:'Formação'},
  {value:'contestacao',label:'Contestação',group:'Formação'},
  {value:'decisao',label:'Decisão interlocutória',group:'Decisões e tutela'},
  {value:'tutela',label:'Todas as tutelas',group:'Decisões e tutela'},
  {value:'tutela_deferida',label:'Tutela deferida',group:'Decisões e tutela'},
  {value:'tutela_indeferida',label:'Tutela indeferida',group:'Decisões e tutela'},
  {value:'tutela_revogada',label:'Tutela revogada',group:'Decisões e tutela'},
  {value:'sentence',label:'Todas as sentenças',group:'Sentença'},
  {value:'sentence_procedente',label:'Procedente',group:'Sentença'},
  {value:'sentence_improcedente',label:'Improcedente',group:'Sentença'},
  {value:'sentence_parcial',label:'Parcialmente procedente',group:'Sentença'},
  {value:'sentence_extincao',label:'Extinção sem mérito',group:'Sentença'},
  {value:'sentence_merito',label:'Julgamento do mérito',group:'Sentença'},
  {value:'agravo',label:'Agravo',group:'Recursos e acórdãos'},
  {value:'recurso',label:'Recurso / apelação',group:'Recursos e acórdãos'},
  {value:'contrarrazoes',label:'Contrarrazões',group:'Recursos e acórdãos'},
  {value:'embargos_declaracao',label:'Embargos de declaração',group:'Recursos e acórdãos'},
  {value:'acordao',label:'Todos os acórdãos',group:'Recursos e acórdãos'},
  {value:'acordao_provido',label:'Acórdão — provido',group:'Recursos e acórdãos'},
  {value:'acordao_desprovido',label:'Acórdão — desprovido',group:'Recursos e acórdãos'},
  {value:'acordao_mantido',label:'Acórdão — decisão mantida',group:'Recursos e acórdãos'},
  {value:'acordao_reformado',label:'Acórdão — decisão reformada',group:'Recursos e acórdãos'},
  {value:'execucao_pedido',label:'Pedido de execução',group:'Execução e bloqueio'},
  {value:'execucao',label:'Execução / cumprimento',group:'Execução e bloqueio'},
  {value:'bloqueio',label:'Todos os bloqueios',group:'Execução e bloqueio'},
  {value:'bloqueio_pedido',label:'Pedido de bloqueio',group:'Execução e bloqueio'},
  {value:'bloqueio_efetivado',label:'Bloqueio efetivado',group:'Execução e bloqueio'},
  {value:'bloqueio_levantado',label:'Bloqueio levantado',group:'Execução e bloqueio'},
  {value:'penhora',label:'Penhora',group:'Execução e bloqueio'},
  {value:'audiencia',label:'Todas as audiências',group:'Audiências'},
  {value:'audiencia_agendada',label:'Audiência agendada',group:'Audiências'},
  {value:'audiencia_realizada',label:'Audiência realizada',group:'Audiências'},
  {value:'audiencia_cancelada',label:'Audiência cancelada',group:'Audiências'},
  {value:'suspensao',label:'Suspensão',group:'Suspensão e encerramento'},
  {value:'retomada',label:'Retomada do processo',group:'Suspensão e encerramento'},
  {value:'acordo_homologado',label:'Acordo homologado',group:'Suspensão e encerramento'},
  {value:'desistencia',label:'Desistência homologada',group:'Suspensão e encerramento'},
  {value:'transito',label:'Trânsito em julgado',group:'Suspensão e encerramento'},
  {value:'arquivamento',label:'Arquivamento',group:'Suspensão e encerramento'},
  {value:'baixa_definitiva',label:'Baixa definitiva',group:'Suspensão e encerramento'},
];

function ProcessFilter({label,value,options,onChange,className=''}:{
  label:string;value:string;options:FilterOption[];
  onChange:(next:string)=>void;className?:string
}) {
  const [open,setOpen]=useState(false);
  const [query,setQuery]=useState('');
  const parent=useRef<HTMLDivElement>(null);
  const opener=useRef<HTMLButtonElement>(null);
  const search=useRef<HTMLInputElement>(null);
  const selected=options.find(x=>x.value===value);
  const visible=options.filter(x=>(x.label+' '+(x.group||'')).toLocaleLowerCase('pt-BR').includes(query.toLocaleLowerCase('pt-BR')));
  useEffect(()=>{
    if(!open)return;
    const closeOutside=(ev:MouseEvent)=>{if(!parent.current?.contains(ev.target as Node)){setOpen(false);setQuery('');}};
    const escape=(ev:KeyboardEvent)=>{if(ev.key==='Escape'){setOpen(false);setQuery('');opener.current?.focus();}};
    document.addEventListener('pointerdown',closeOutside);
    document.addEventListener('keydown',escape);
    search.current?.focus();
    return ()=>{document.removeEventListener('pointerdown',closeOutside);document.removeEventListener('keydown',escape);};
  },[open]);
  return <div className={'processos-filter-field '+className} ref={parent}>
    <span className="processos-filter-label">{label}</span>
    <button type="button" ref={opener} className={'processos-filter-trigger'+(open?' is-open':'')}
      aria-label={label} aria-haspopup="listbox" aria-expanded={open}
      onClick={()=>setOpen(v=>!v)}><span>{selected?.label || options[0]?.label || 'Todas'}</span><ChevronDown size={15}/></button>
    {open ? <div className="processos-filter-popover">
      <div className="processos-filter-search"><Search size={14}/><input ref={search} type="search" aria-label={'Pesquisar '+label}
        value={query} placeholder="Filtrar opções…" onChange={e=>setQuery(e.target.value)}
        onKeyDown={e=>{if(e.key==='ArrowDown'){e.preventDefault();parent.current?.querySelector<HTMLButtonElement>('[role=option]')?.focus();}}}/></div>
      <div className="processos-filter-options" role="listbox" aria-label={label}>
        {visible.length ? visible.map((item,i)=><div key={item.value||'all'}>
          {item.group && (i===0||item.group!==visible[i-1]?.group) ? <div className="processos-filter-group">{item.group}</div> : null}
          <button type="button" role="option" aria-selected={value===item.value} className="processos-filter-option"
            onClick={()=>{onChange(item.value);setOpen(false);setQuery('');opener.current?.focus();}}
            onKeyDown={e=>{
              if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();const siblings=[...parent.current!.querySelectorAll<HTMLButtonElement>('[role=option]')];siblings[Math.min(siblings.length-1,Math.max(0,siblings.indexOf(e.currentTarget)+(e.key==='ArrowDown'?1:-1)))]?.focus();}
            }}><span>{item.label}</span>{value===item.value?<Check size={14}/>:null}</button>
        </div>) : <p className="processos-filter-empty">Nenhuma opção encontrada</p>}
      </div>
    </div> : null}
  </div>;
}

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
  const [eventPage, setEventPage] = useState(1);
  const [taskPage, setTaskPage] = useState(1);
  const [events, setEvents] = useState<Timeline | null>(null);
  const [tasks, setTasks] = useState<Paged<LinkedTask> | null>(null);
  const [eventError, setEventError] = useState('');
  const [taskError, setTaskError] = useState('');
  const [eventsLoading, setEventsLoading] = useState(true);
  const [tasksLoading, setTasksLoading] = useState(true);
  const [create, setCreate] = useState(false);
  const [revision, setRevision] = useState(0);
  const [notice, setNotice] = useState('');
  const createTrigger = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let active = true;
    setDetail(null); setError('');
    processRequest<ProcessDetail>(processPath(cnj))
      .then(data => { if(active) setDetail(data); })
      .catch(e => { if(active) setError(e.message); });
    return () => { active = false; };
  }, [cnj, revision]);

  useEffect(() => {
    // The judicial history and the case header are independent reads: load
    // concurrently instead of waiting for the header before requesting DataJud.
    let active = true;
    setEventsLoading(true); setEventError(''); setEvents(null);
    processRequest<Timeline>(processPath(cnj) + '/timeline?' +
      new URLSearchParams({page:String(eventPage),page_size:'25'}))
      .then(data => { if(active) setEvents(data); })
      .catch(e => { if(active) setEventError(e.message); })
      .finally(() => { if(active) setEventsLoading(false); });
    return () => { active = false; };
  }, [cnj, eventPage, revision]);

  useEffect(() => {
    if (!detail) return;
    let active = true;
    setTasks(null); setTaskError('');
    if (!detail.permissions.tasks) {setTasksLoading(false); return;}
    setTasksLoading(true);
    processRequest<Paged<LinkedTask>>(processPath(cnj) + '/tasks?' +
      new URLSearchParams({page:String(taskPage),page_size:'12'}))
      .then(data => { if(active) setTasks(data); })
      .catch(e => { if(active) setTaskError(e.message); })
      .finally(() => { if(active) setTasksLoading(false); });
    return () => { active = false; };
  }, [cnj, detail, taskPage]);

  const closeCreate = () => { setCreate(false); requestAnimationFrame(() => createTrigger.current?.focus()); };
  return <section className="processos-detail">
    <button type="button" className="processos-back" onClick={onBack}>← Processos</button>
    {error ? <div role="alert" className="processos-state">{error}<button type="button" onClick={() => setRevision(r => r + 1)}>Tentar novamente</button></div>
      : !detail ? <div role="status" className="processos-state">Carregando processo…</div>
      : <>
        <header className="processos-heading processos-detail-heading">
          <div><h1>{detail.cnj}</h1></div>
          {detail.permissions.create_task && detail.permissions.task_types.length
            ? <button ref={createTrigger} className="primary-button" type="button" onClick={() => setCreate(true)}>Criar tarefa</button> : null}
        </header>
        <dl className="processos-identification">
          <div><dt>Situação</dt><dd title={detail.process.situation_source==='presumido'?'Situação provisória: ainda não confirmada pelo Benner.':undefined}>{detail.process.situation || 'Não verificada'}</dd></div>
          <div><dt>Fase</dt><dd>{detail.process.fase || 'Não informada'}</dd></div>
          <div><dt>UF</dt><dd>{detail.process.state || '—'}</dd></div>
          <div><dt>Última movimentação</dt><dd>{date(detail.process.last_movement_at)}{detail.process.last_movement_title ? <span className="processos-last-movement-title">{detail.process.last_movement_title}</span> : null}</dd></div>
        </dl>
        {notice ? <p className="processos-notice" role="status">{notice}</p> : null}
        <div className={'processos-workspace' + (!detail.permissions.tasks ? ' processos-workspace-single' : '')}>
          <section className="processos-history" aria-label="Histórico processual">
            <div className="processos-workspace-header">
              <div><h2>Movimentações</h2><p>Andamentos relevantes do processo</p></div>

            </div>
            {eventError ? <div role="alert" className="processos-state">{eventError}<button type="button" onClick={() => setRevision(r=>r+1)}>Tentar novamente</button></div>
              : eventsLoading ? <div role="status" className="processos-state">Carregando movimentações…</div>
              : events ? <>
                {['unavailable','partial'].includes(events.sources.datajud.state) ? <p className="processos-source-status" role="status">{events.sources.datajud.message || 'Histórico DataJud parcial.'}</p> : null}
                {events.rows.length ? <ol className="processos-timeline">{events.rows.map(e =>
                  <li key={e.id} data-event-kind={e.kind}>
                    <div className="processos-event-date"><time dateTime={e.occurred_at}>{date(e.occurred_at)}</time>{e.degree ? <span>{e.degree}</span> : null}</div>
                    <h3>{eventTitle(e)}</h3>
                    <p className="processos-event-meta">{e.source}{e.degree ? ' · ' + e.degree : ''}</p>
                    <details><summary>Rastreabilidade</summary>
                      <dl><div><dt>Fonte</dt><dd>{e.source}</dd></div><div><dt>Capturado em</dt><dd>{date(e.captured_at)}</dd></div></dl>
                    </details>
                  </li>
                )}</ol> : <div className="processos-state">Nenhuma movimentação relevante identificada nas fontes disponíveis.</div>}
                <Pagination page={eventPage} more={events.has_more} busy={eventsLoading} onChange={setEventPage}/>
              </> : null}
          </section>
          {detail.permissions.tasks ? <aside className="processos-tasks" aria-label="Tarefas do processo">
            <div className="processos-workspace-header"><div><h2>Tarefas</h2><p>Atividades vinculadas a este CNJ</p></div></div>
            {taskError ? <div role="alert" className="processos-state">{taskError}<button type="button" onClick={()=>setRevision(r=>r+1)}>Tentar novamente</button></div>
              : tasksLoading ? <div role="status" className="processos-state">Carregando tarefas…</div>
              : tasks ? <>
                {tasks.rows.length ? <ul className="processos-task-list">{tasks.rows.map(t =>
                  <li key={t.process_id} className="processos-task-item">
                    <div className="processos-task-top"><span>{taskTypeLabel(t.type)}</span><span>{statusLabel(t.status)}</span></div>
                    <h3>{t.title || taskTypeLabel(t.type)}</h3>
                    <p>{t.responsible_name || 'Não atribuída'} · {t.deadline_at ? date(t.deadline_at) : 'Sem prazo'}</p>
                    <button type="button" onClick={() => win.MBA_NAVIGATE?.('tarefas/item/'+t.task_id+'/'+t.process_id)}>Abrir tarefa →</button>
                  </li>
                )}</ul> : <div className="processos-state">Nenhuma tarefa vinculada a este processo.</div>}
                {tasks.total > 12 ? <Pagination page={taskPage} more={taskPage*12<tasks.total} busy={tasksLoading} onChange={setTaskPage}/> : null}
              </> : null}
          </aside> : null}
        </div>
        {create ? <CreateProcessTask cnj={detail.cnj} types={detail.permissions.task_types} onClose={closeCreate} onCreated={() => {
          closeCreate(); setNotice('Tarefa criada e vinculada ao processo.'); setTaskPage(1); setRevision(r=>r+1);
        }}/> : null}
      </>}
  </section>;
}

export function ProcessosPage() {
  const [cnj, setCnj] = useState(selectedCnj);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({q:'',situation:'',uf:'',movement:''});
  const [page, setPage] = useState(1);
  const [data, setData] = useState<Paged<ProcessRecord> | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [revision, setRevision] = useState(0);
  const profile = win.MBA_CURRENT_USER;
  const authorized = profile?.capabilities?.processos === true && profile.permissions?.['processos.view'] === true;

  useEffect(() => {
    const sync=()=>setCnj(selectedCnj());
    window.addEventListener('mba:route-changed',sync); window.addEventListener('popstate',sync);
    return () => {window.removeEventListener('mba:route-changed',sync);window.removeEventListener('popstate',sync);};
  }, []);
  useEffect(() => {
    if(cnj || !authorized) return;
    let active=true; setLoading(true); setError(''); setData(null);
    const params=new URLSearchParams({page:String(page),page_size:'25'});
    Object.entries(filters).forEach(([key,value])=>{if(value)params.set(key,value);});
    processRequest<Paged<ProcessRecord>>('/api/processos?'+params)
      .then(rows=>{if(active)setData(rows);})
      .catch(e=>{if(active)setError(e.message);})
      .finally(()=>{if(active)setLoading(false);});
    return ()=>{active=false;};
  },[filters,page,cnj,authorized,revision]);
  if(!authorized) return <div className="processos-state" role="status">Processos indisponível para este acesso.</div>;
  if(cnj) return <ProcessView key={cnj} cnj={cnj} onBack={()=>win.MBA_NAVIGATE?.('processos')}/>;
  const filter=(key: keyof typeof filters,value:string)=>{setPage(1);setFilters(f=>({...f,[key]:value}));};
  return <section className="processos-page">
    <header className="processos-heading"><h1>Processos</h1></header>
    <form className="processos-filters" onSubmit={e=>{
      e.preventDefault();setPage(1);setFilters(f=>({...f,q:search.trim()}));
    }}>
      <label className="processos-search">Número CNJ<input type="search" inputMode="numeric" maxLength={25} value={search} placeholder="Buscar por número do processo" onChange={e=>setSearch(e.target.value)}/></label>
      <ProcessFilter label="Situação" className="processos-situation-filter" value={filters.situation} onChange={v=>filter('situation',v)} options={situationOptions}/>
      <ProcessFilter label="UF" className="processos-uf-filter" value={filters.uf} onChange={v=>filter('uf',v)} options={[{value:'',label:'Todas'},...BRAZIL_STATES.map(s=>({value:s.uf,label:s.uf}))]}/>
      <ProcessFilter label="Movimentações" className="processos-movement-filter" value={filters.movement} onChange={v=>filter('movement',v)} options={movementOptions}/>
      <button className="primary-button" type="submit">Buscar</button>
      <button type="button" className="processos-clear" onClick={()=>{setSearch('');setPage(1);setFilters({q:'',situation:'',uf:'',movement:''});}}>Limpar</button>
    </form>
    {error ? <div role="alert" className="processos-state">{error === 'Filtros inválidos.' && filters.movement ? 'O servidor ainda não reconhece o filtro de movimentações. É necessário publicar a versão atualizada da API.' : error}<button type="button" onClick={()=>setRevision(r=>r+1)}>Tentar novamente</button></div>
      : loading ? <div role="status" className="processos-state">Carregando processos…</div>
      : data?.rows.length ? <div className="processos-table-wrap"><table>
        <thead><tr><th>Processo</th><th>Situação</th><th>UF</th><th>Data da última movimentação</th></tr></thead>
        <tbody>{data.rows.map(p=><tr key={p.id}>
          <td><button type="button" onClick={()=>win.MBA_NAVIGATE?.('processos/'+encodeURIComponent(p.cnj))}>{p.cnj}</button></td>
          <td title={p.situation_source==='presumido'?'Situação provisória: ainda não confirmada pelo Benner.':undefined}>{p.situation || 'Não verificada'}</td>
          <td>{p.state || '—'}</td>
          <td>{p.last_movement_at ? date(p.last_movement_at) : '—'}</td>
        </tr>)}</tbody>
      </table></div> : <div className="processos-state">Nenhum processo encontrado para os filtros selecionados.</div>}
    {data ? <Pagination page={page} more={page*25<data.total} total={data.total} busy={loading} onChange={setPage}/> : null}
  </section>;
}
