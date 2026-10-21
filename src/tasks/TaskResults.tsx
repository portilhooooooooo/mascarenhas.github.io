import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Download, RefreshCw, XCircle, ClipboardList, ListTodo, Copy, Timer, ChevronRight } from 'lucide-react';
import type { ApiRequest } from './renderers';
import { taskTypeLabel } from './model';
import './taskResults.css';

type Kind = 'analyses' | 'apt' | 'inapt' | 'pending' | 'time';
type Person = {
  id: string; name: string; analyses: number; apt: number; inapt: number;
  pending: number; median_seconds: number | null; measured: number;
};
type DailyRow = { day: string; user_id: string; person: string; analyses: number; apt: number; inapt: number; measured: number };
type ProcessRow = {
  id: string; process_id: string; task_id: string; cnj: string; person: string; user_id: string;
  type: string; result: string; raw_decision: string; at: string | null;
  day: string | null; seconds: number | null; status: string;
};
type Overview = {
  summary: { analyses: number; apt: number; inapt: number; unclassified: number;
    pending: number; median_seconds: number | null; measured: number };
  people: Person[]; daily: DailyRow[]; pending_as_of: string;
  generated_at: string; truncated: boolean;
};
type Detail = { kind: Kind; rows: ProcessRow[]; total: number; page: number;
  has_more: boolean; truncated: boolean; pending_as_of: string };
type Filters = { period: 'today'|'7'|'30'|'90'|'all'; module: string; person: string; deadline: string; start_day: string; end_day: string };
type Selection = { kind: Kind; day?: string; person?: string };
const DEFAULT: Filters = { period: '30', module: 'all', person: 'all', deadline: 'all', start_day: '', end_day: '' };
const modules = ['encerramento','defesa','liminar','comprovante_pagamento','acordos','protocolo','motivo_derrota'];
const format = (n: number) => n.toLocaleString('pt-BR');
const duration = (v: number | null) => v == null ? 'Sem medição' : v < 60
  ? Math.round(v) + 's' : (v / 60).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'min';
const localDay = () => new Intl.DateTimeFormat('sv-SE', { timeZone: 'America/Campo_Grande', year:'numeric',month:'2-digit',day:'2-digit' }).format(new Date());
const localDateTime = (v: string | null) => v ? new Date(v).toLocaleString('pt-BR', { timeZone:'America/Campo_Grande' }) : '—';
const labels: Record<Kind,string> = {
  analyses:'Análises realizadas', apt:'Aptidões', inapt:'Inaptidões',
  pending:'Pendências', time:'Tempo de execução',
};
const resultLabel = (row: ProcessRow) =>
  row.result === 'apto' ? 'Apto' : row.result === 'inapto' ? 'Inapto'
    : row.result === 'pendente' ? 'Pendente' : row.raw_decision || 'Sem classificação de aptidão';

function Filter({ title, value, options, onChange }: {
  title: string; value: string; options: {label:string;value:string}[];
  onChange: (value:string)=>void;
}) {
  return <label className="task-results-filter"><span>{title}</span>
    <select value={value} onChange={event=>onChange(event.target.value)}>
      {options.map(option=><option key={option.value} value={option.value}>{option.label}</option>)}
    </select></label>;
}

function csvDownload(encoded: string, filename: string) {
  const raw = atob(encoded);
  const bytes = Uint8Array.from(raw, ch => ch.charCodeAt(0));
  const href = URL.createObjectURL(new Blob([bytes], { type:'text/csv;charset=utf-8' }));
  const a = document.createElement('a');
  a.href = href; a.download = filename; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(()=>URL.revokeObjectURL(href),1000);
}

export function TaskResults({api,visible,canViewOthers,userId}:{
  api:ApiRequest; visible:boolean; canViewOthers:boolean; userId?:string;
}) {
  const [filters,setFilters]=useState<Filters>(DEFAULT);
  const [revision,setRevision]=useState(0);
  const [overview,setOverview]=useState<Overview|null>(null);
  const [loading,setLoading]=useState(false);
  const [loadedKey,setLoadedKey]=useState('');
  const [error,setError]=useState('');
  const [selection,setSelection]=useState<Selection|null>(null);
  const [detail,setDetail]=useState<Detail|null>(null);
  const [detailPage,setDetailPage]=useState(1);
  const [detailLoading,setDetailLoading]=useState(false);
  const [detailError,setDetailError]=useState('');
  const [exporting,setExporting]=useState(false);
  const key=JSON.stringify([filters,revision,userId]);
  const detailKey=JSON.stringify([filters,selection,detailPage,revision,userId]);
  const refreshNext=useRef(false);
  const requestId=useRef(0);
  const detailRequestId=useRef(0);

  useEffect(()=>{
    if (!visible || !userId) return;
    let active=true;
    const serial=++requestId.current;
    setLoading(true);setError('');
    const fresh=refreshNext.current;
    refreshNext.current=false;
    const params=new URLSearchParams({...filters,refresh:fresh?'1':'0'});
    api('/api/tasks/results/overview?'+params.toString())
      .then((response:Overview)=>{
        if(!active||serial!==requestId.current)return;
        if(!response?.summary||!Array.isArray(response.daily))throw new Error('Resposta inválida da API de produtividade.');
        setOverview(response);setLoadedKey(key);
      }).catch((e:Error)=>{if(active&&serial===requestId.current)setError(/campos inválidos ou não permitidos|\b404\b|\b422\b|not found/i.test(e.message||'')
          ? 'API de Produtividade v2 indisponível neste ambiente. O backend da branch de testes precisa ser publicado junto com o frontend.'
          : e.message||'Falha na consulta.');})
      .finally(()=>{if(active&&serial===requestId.current)setLoading(false);});
    return()=>{active=false;};
  },[visible,userId,key,api]);

  useEffect(()=>{
    if (!visible || !userId || !selection) {setDetail(null);return;}
    let active=true;
    const serial=++detailRequestId.current;
    setDetail(null);setDetailError('');setDetailLoading(true);
    const params=new URLSearchParams({...filters,kind:selection.kind,page:String(detailPage),limit:'100'});
    if(selection.day)params.set('day',selection.day);
    if(selection.person)params.set('person',selection.person);
    api('/api/tasks/results/overview/details?'+params.toString())
      .then((response:Detail)=>{
        if(!active||serial!==detailRequestId.current)return;
        if(!response||!Array.isArray(response.rows))throw new Error('Detalhamento inválido.');
        setDetail(response);
      }).catch((e:Error)=>{if(active&&serial===detailRequestId.current)setDetailError(e.message||'Falha no detalhamento.');})
      .finally(()=>{if(active&&serial===detailRequestId.current)setDetailLoading(false);});
    return()=>{active=false;};
  },[visible,userId,detailKey,api]);

  useEffect(()=>{
    const reset=()=>{refreshNext.current=false;requestId.current++;detailRequestId.current++;setFilters(DEFAULT);setOverview(null);setLoadedKey('');setSelection(null);setDetail(null);setRevision(n=>n+1);};
    window.addEventListener('mba:portfolio-changed',reset);
    window.addEventListener('mba:logged-out',reset);
    window.addEventListener('mba:session-expired',reset);
    return()=>{
      window.removeEventListener('mba:portfolio-changed',reset);
      window.removeEventListener('mba:logged-out',reset);
      window.removeEventListener('mba:session-expired',reset);
    };
  },[]);

  const update=(field:keyof Filters,value:string)=>{
    setFilters(current=>{
      const next={...current,[field]:value};
      if(field==='start_day'&&value&&current.end_day&&value>current.end_day)next.end_day='';
      if(field==='end_day'&&value&&current.start_day&&value<current.start_day)next.start_day='';
      return next;
    });
    setSelection(null);setDetailPage(1);
  };
  const open=(kind:Kind, options:Partial<Selection>={})=>{
    setDetailPage(1);setSelection({kind,...options});
  };
  const rangePeople=useMemo(()=>{
    if(!overview||loadedKey!==key)return [];
    // One filled date field is a single-day query, not an open interval.
    const from=filters.start_day||filters.end_day||localDay();
    const to=filters.end_day||filters.start_day||localDay();
    const byUser=new Map<string,DailyRow>();
    for (const entry of overview.daily) {
      if(entry.day<from||entry.day>to)continue;
      const item=byUser.get(entry.user_id);
      if(!item)byUser.set(entry.user_id,{...entry});
      else {item.analyses+=entry.analyses;item.apt+=entry.apt;item.inapt+=entry.inapt;item.measured+=entry.measured;}
    }
    return [...byUser.values()].sort((a,b)=>b.analyses-a.analyses||a.person.localeCompare(b.person,'pt-BR'));
  },[overview,loadedKey,key,filters.start_day,filters.end_day]);
  const exportDetails=async()=>{
    if(!selection||exporting)return;
    setExporting(true);setDetailError('');
    try {
      const params=new URLSearchParams({...filters,kind:selection.kind});
      if(selection.day)params.set('day',selection.day);
      if(selection.person)params.set('person',selection.person);
      const response=await api('/api/tasks/results/overview/export?'+params);
      if(!response?.content_base64)throw new Error('Exportação indisponível.');
      csvDownload(response.content_base64,response.filename||'produtividade.csv');
    }catch(e:any){setDetailError(e?.message||'Erro ao exportar CSV.');}
    finally{setExporting(false);}
  };
  const openProcess=(row:ProcessRow)=>{
    if(!row.task_id||!row.process_id)return;
    const route='tarefas/item/'+row.task_id+'/'+row.process_id;
    const navigated=(window as Window & {MBA_NAVIGATE?:(route:string)=>boolean}).MBA_NAVIGATE?.(route);
    if(!navigated)window.location.hash='#/'+route;
  };
  const status=loadedKey===key?overview?.summary:undefined;

  return <section className="task-results-page task-results-v2" aria-label="Produtividade das tarefas">
    <div className="task-results-heading">
      <div><h1>Produtividade</h1></div>
      <button className="secondary-button" type="button" onClick={()=>{refreshNext.current=true;setRevision(n=>n+1);}} disabled={loading}>
        <RefreshCw size={15}/> Atualizar
      </button>
    </div>
    <div className="task-results-filters" aria-label="Filtros padrão de produtividade">
      <Filter title="Período das conclusões" value={filters.period} onChange={v=>update('period',v)}
        options={[{label:'Hoje',value:'today'},{label:'Últimos 7 dias',value:'7'},{label:'Últimos 30 dias',value:'30'},
          {label:'Últimos 90 dias',value:'90'},{label:'Últimos 180 dias',value:'all'}]}/>
      <Filter title="Módulo" value={filters.module} onChange={v=>update('module',v)}
        options={[{label:'Todos os módulos',value:'all'},...modules.map(value=>({value,label:taskTypeLabel(value)}))]}/>
      <Filter title="Colaborador" value={filters.person} onChange={v=>update('person',v)}
        options={[{label:canViewOthers?'Toda a equipe':'Minhas análises',value:'all'},
          ...(canViewOthers?(overview?.people||[]).filter(p=>p.id).map(p=>({label:p.name,value:p.id})):[]),
          ...(filters.person!=='all' && !(overview?.people||[]).some(p=>p.id===filters.person)
            ? [{label:'Colaborador selecionado',value:filters.person}]:[])]}/>
      <Filter title="Prazo da tarefa" value={filters.deadline} onChange={v=>update('deadline',v)}
        options={[{label:'Todos os prazos',value:'all'},{label:'Vencido',value:'overdue'},
          {label:'Vence hoje',value:'today'},{label:'A vencer',value:'future'},{label:'Sem prazo',value:'none'}]}/>
    </div>

    {error&&<p className="task-results-notice task-results-error" role="alert">{error}</p>}
    {overview?.truncated&&<p className="task-results-notice" role="alert">Consulta atingiu limite de registros. Reduza o período; os totais podem estar incompletos.</p>}
    <div className="task-results-stats task-results-five" aria-busy={loading||!status}>
      {([
        {kind:'analyses' as Kind,value:status?format(status.analyses):'—',icon:ClipboardList},
        {kind:'apt' as Kind,value:status?format(status.apt):'—',icon:CheckCircle2},
        {kind:'inapt' as Kind,value:status?format(status.inapt):'—',icon:XCircle},
        {kind:'pending' as Kind,value:status?format(status.pending):'—',icon:ListTodo},
        {kind:'time' as Kind,value:status?duration(status.median_seconds):'—',icon:Timer},
      ]).map(card=><button type="button"
          className={'task-results-stat task-results-stat-clickable'+(selection?.kind===card.kind?' is-active':'')}
          key={card.kind} onClick={()=>open(card.kind)}
          aria-label={labels[card.kind]+': '+card.value}>
          <div className="task-results-stat-top"><span>{labels[card.kind]}</span><card.icon size={17}/></div>
          <strong className={!status?'task-results-placeholder':undefined}>{card.value}</strong>
        </button>)}
    </div>

    {selection&&<article className="task-results-card task-results-drilldown" aria-live="polite">
      <header className="task-results-table-heading">
        <div><h2>{labels[selection.kind]}</h2></div>
        <div className="task-results-actions">
          <button className="secondary-button" type="button" disabled={detailLoading||exporting||!detail||detail.truncated}
            onClick={()=>void exportDetails()}><Download size={14}/> {exporting?'Exportando…':'CSV'}</button>
          <button className="secondary-button" type="button" onClick={()=>setSelection(null)}><ArrowLeft size={14}/> Voltar</button>
        </div>
      </header>
      {detailLoading&&<p className="task-results-empty" role="status">Carregando os processos deste card…</p>}
      {detailError&&<p className="task-results-notice task-results-error" role="alert">{detailError}</p>}
      {detail&&!detailLoading&&<>
        <p className="task-results-counter">{format(detail.total)} registros no detalhamento. Página {detail.page}.
          {detail.truncated?' Consulta parcial.':''}</p>
        <div className="task-results-table-scroll"><table className="task-results-table">
          <thead><tr><th>CNJ</th><th>Colaborador</th><th>Módulo</th><th>Resultado</th><th>Conclusão</th><th>Execução</th><th></th></tr></thead>
          <tbody>{detail.rows.map(row=><tr key={row.id}>
            <td><button type="button" className="task-results-link task-results-cnj" onClick={()=>openProcess(row)}
              title="Abrir processo e histórico" disabled={!row.task_id||!row.process_id}>
              {row.cnj||'CNJ indisponível'} <ChevronRight size={13}/>
            </button></td><td>{row.person}</td>
            <td>{taskTypeLabel(row.type)}</td><td>{resultLabel(row)}</td>
            <td>{selection.kind==='pending'?'Em aberto':localDateTime(row.at)}</td>
            <td>{duration(row.seconds)}</td>
            <td><button type="button" className="task-results-copy" title="Copiar CNJ" onClick={()=>void navigator.clipboard.writeText(row.cnj)} disabled={!row.cnj}>
              <Copy size={14}/><span className="sr-only">Copiar CNJ</span></button></td>
          </tr>)}
          {!detail.rows.length&&<tr><td colSpan={7}>Nenhum processo encontrado para os filtros selecionados.</td></tr>}
          </tbody></table></div>
        <div className="task-results-pagination">
          <button className="secondary-button" type="button" disabled={detail.page<=1} onClick={()=>setDetailPage(n=>Math.max(1,n-1))}>Anterior</button>
          <span>Exibindo {detail.rows.length} de {format(detail.total)} registros nesta consulta</span>
          <button className="secondary-button" type="button" disabled={!detail.has_more} onClick={()=>setDetailPage(n=>n+1)}>Próxima página</button>
        </div>
      </>}
    </article>}

    <article className="task-results-card">
      <header className="task-results-table-heading">
        <h2>Relação diária por colaborador</h2>
        <div className="task-results-date-range">
          <label className="task-results-filter task-results-day-picker"><span>Data inicial</span>
            <input type="date" aria-label="Data inicial" value={filters.start_day}
              max={localDay()} onChange={e=>update('start_day',e.target.value)}/></label>
          <label className="task-results-filter task-results-day-picker"><span>Data final</span>
            <input type="date" aria-label="Data final" value={filters.end_day}
              max={localDay()} onChange={e=>update('end_day',e.target.value)}/></label>
        </div>
      </header>
      <div className="task-results-table-scroll"><table className="task-results-table">
        <thead><tr><th>Colaborador</th><th>Análises</th><th>Aptidões</th>
          <th>Inaptidões</th><th>Com tempo</th><th>Abrir</th></tr></thead>
        <tbody>
          {rangePeople.map(person=><tr key={person.user_id}>
            <td><strong>{person.person}</strong></td>
            <td>{format(person.analyses)}</td><td>{format(person.apt)}</td>
            <td>{format(person.inapt)}</td><td>{format(person.measured)}</td>
            <td><button type="button" className="task-results-link"
              onClick={()=>open('analyses',{person:person.user_id,
                day:filters.start_day||filters.end_day?undefined:localDay()})}>
              Ver {format(person.analyses)} CNJs <ChevronRight size={13}/></button></td>
          </tr>)}
          {!rangePeople.length&&<tr><td colSpan={6}>
            {loading||!status?'Carregando análises…':'Nenhuma análise encontrada no intervalo selecionado.'}
          </td></tr>}
        </tbody>
      </table></div>
    </article>
  </section>;
}

/** Backwards-compatible type for the pre-existing opt-in demo fixture. */
export type ResultPayload = {
  period: string;
  people: Array<{
    id:string; name:string; completed:number; analysis_samples:number;
    mean_analysis_seconds:number|null; median_analysis_seconds:number|null;
    step_samples:number; mean_step_seconds:number|null; by_type:Record<string,number>;
    timing_by_type?:Record<string,{completed:number;samples:number;median_seconds:number|null;mean_seconds:number|null}>;
  }>;
  summary: {
    completed:number;today_completed:number;pending:number|null;
    growth_percent:number|null;previous_completed:number;people:number;
    measured_analyses:number;measured_transitions:number;
    slowest:ResultPayload['people'][number]|null;
  };
  methodology:string;generated_at:string;truncated:boolean;
};
