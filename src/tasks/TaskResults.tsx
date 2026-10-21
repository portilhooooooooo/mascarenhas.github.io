import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, CheckCircle2, Clock3, Download, RefreshCw, XCircle, ClipboardList, ListTodo, Copy, Timer, ChevronRight } from 'lucide-react';
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
  id: string; process_id: string; cnj: string; person: string; user_id: string;
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
type Filters = { period: 'today'|'7'|'30'|'90'|'all'; module: string; person: string; deadline: string };
type Selection = { kind: Kind; day?: string; person?: string };
const DEFAULT: Filters = { period: '30', module: 'all', person: 'all', deadline: 'all' };
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
  const [error,setError]=useState('');
  const [day,setDay]=useState(localDay);
  const [selection,setSelection]=useState<Selection|null>(null);
  const [detail,setDetail]=useState<Detail|null>(null);
  const [detailPage,setDetailPage]=useState(1);
  const [detailLoading,setDetailLoading]=useState(false);
  const [detailError,setDetailError]=useState('');
  const [exporting,setExporting]=useState(false);
  const key=JSON.stringify([filters,revision,userId]);
  const detailKey=JSON.stringify([filters,selection,detailPage,revision,userId]);
  const requestId=useRef(0);
  const detailRequestId=useRef(0);

  useEffect(()=>{
    if (!visible || !userId) return;
    let active=true;
    const serial=++requestId.current;
    setOverview(null);setLoading(true);setError('');
    const params=new URLSearchParams(filters);
    api('/api/tasks/results/overview?'+params.toString())
      .then((response:Overview)=>{
        if(!active||serial!==requestId.current)return;
        if(!response?.summary||!Array.isArray(response.daily))throw new Error('Resposta inválida da API de produtividade.');
        setOverview(response);
      }).catch((e:Error)=>{if(active&&serial===requestId.current)setError(e.message||'Falha na consulta.');})
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
    const reset=()=>{requestId.current++;detailRequestId.current++;setFilters(DEFAULT);setOverview(null);setSelection(null);setDetail(null);setDay(localDay());setRevision(n=>n+1);};
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
    setFilters(current=>({...current,[field]:value} as Filters));
    setSelection(null);setDetailPage(1);
  };
  const open=(kind:Kind, options:Partial<Selection>={})=>{
    setDetailPage(1);setSelection({kind,...options});
  };
  const todayPeople=useMemo(()=>{
    if(!overview)return [];
    return overview.daily.filter(entry=>entry.day===day).sort((a,b)=>b.analyses-a.analyses||a.person.localeCompare(b.person,'pt-BR'));
  },[overview,day]);
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
  const status=overview?.summary;

  return <section className="task-results-page task-results-v2" aria-label="Produtividade das tarefas">
    <div className="task-results-heading">
      <div><h1>Produtividade</h1><p>Resultados auditáveis da equipe, com relação diária de CNJs por colaborador.</p></div>
      <button className="secondary-button" type="button" onClick={()=>setRevision(n=>n+1)} disabled={loading}>
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
    {loading&&<p className="task-results-notice" role="status">Consultando eventos e pendências reais…</p>}
    {error&&<p className="task-results-notice task-results-error" role="alert">{error}</p>}
    {overview?.truncated&&<p className="task-results-notice" role="alert">Consulta atingiu limite de registros. Reduza o período; os totais podem estar incompletos.</p>}
    {status&&!loading&&<div className="task-results-stats task-results-five">
      {([
        {kind:'analyses' as Kind,value:format(status.analyses),foot:status.unclassified
          ? format(status.unclassified)+' sem classificação de aptidão' : 'Conclusões humanas no período',icon:ClipboardList},
        {kind:'apt' as Kind,value:format(status.apt),foot:'Decisões explicitamente aptas',icon:CheckCircle2},
        {kind:'inapt' as Kind,value:format(status.inapt),foot:'Decisões explicitamente inaptas',icon:XCircle},
        {kind:'pending' as Kind,value:format(status.pending),foot:'Fila atual, não histórica',icon:ListTodo},
        {kind:'time' as Kind,value:duration(status.median_seconds),foot:format(status.measured)+' análises cronometradas',icon:Timer},
      ]).map(card=><button type="button" className={'task-results-stat task-results-stat-clickable'+(selection?.kind===card.kind?' is-active':'')}
          key={card.kind} onClick={()=>open(card.kind)} aria-label={labels[card.kind]+': '+card.value+'. Ver processos.'}>
          <div className="task-results-stat-top"><span>{labels[card.kind]}</span><card.icon size={17}/></div>
          <strong>{card.value}</strong><small>{card.foot}</small>
          <span className="task-results-stat-action">Ver processos <ChevronRight size={13}/></span>
        </button>)}
    </div>}
    <p className="task-results-method"><Clock3 size={14}/>Análises, aptidões e inaptidões referem-se às conclusões do período selecionado.
      Pendências são a fila aberta no momento da consulta ({localDateTime(overview?.pending_as_of||null)}).
      Tempo é mediana observada, não tempo ativo; apenas registros com início e fim válidos (até 30 minutos) entram na amostra.
      Decisões de outros módulos não são convertidas artificialmente em aptidão/inaptidão.</p>

    {selection&&<article className="task-results-card task-results-drilldown" aria-live="polite">
      <header className="task-results-table-heading">
        <div><h2>{labels[selection.kind]} — relação de processos</h2>
          <p>{selection.day?'Dia '+selection.day+' · ':''}{selection.person?'Colaborador selecionado · ':''}
            {selection.kind==='pending'?'Fotografia da fila atual':'Análises individuais auditadas'}</p></div>
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
            <td><strong>{row.cnj||'CNJ indisponível'}</strong></td><td>{row.person}</td>
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

    {overview&&!loading&&<>
      <article className="task-results-card">
        <header className="task-results-table-heading"><div>
          <h2>Relação diária por colaborador</h2>
          <p>Selecione uma data e clique no colaborador para consultar todos os CNJs analisados naquele dia.</p></div>
          <label className="task-results-filter task-results-day-picker"><span>Data da análise</span>
            <input type="date" value={day} max={localDay()} onChange={e=>setDay(e.target.value)}/></label>
        </header>
        <div className="task-results-table-scroll"><table className="task-results-table">
          <thead><tr><th>Colaborador</th><th>Dia</th><th>Análises</th><th>Aptidões</th><th>Inaptidões</th><th>Com tempo</th><th>Abrir</th></tr></thead>
          <tbody>{todayPeople.map(person=><tr key={person.day+'-'+person.user_id}>
            <td><strong>{person.person}</strong></td><td>{person.day.split('-').reverse().join('/')}</td>
            <td>{format(person.analyses)}</td><td>{format(person.apt)}</td><td>{format(person.inapt)}</td>
            <td>{format(person.measured)}</td>
            <td><button type="button" className="task-results-link" onClick={()=>open('analyses',{person:person.user_id,day:person.day})}>
              Ver {format(person.analyses)} CNJs <ChevronRight size={13}/></button></td>
          </tr>)}
          {!todayPeople.length&&<tr><td colSpan={7}>Nenhuma análise concluída nesta data dentro do período selecionado.</td></tr>}
          </tbody></table></div>
      </article>
      <article className="task-results-card">
        <header><div><h2>Produtividade por colaborador — período selecionado</h2>
          <p>Totais do período. Pendências são a fila atual. Cada linha abre as análises e seus respectivos CNJs.</p></div></header>
        <div className="task-results-table-scroll"><table className="task-results-table">
          <thead><tr><th>Colaborador</th><th>Análises</th><th>Aptidões</th><th>Inaptidões</th><th>Pendências atuais</th><th>Tempo mediano</th><th>Relação</th></tr></thead>
          <tbody>{overview.people.map(person=><tr key={person.id||'unassigned'}>
            <td><strong>{person.name}</strong></td><td>{format(person.analyses)}</td>
            <td>{format(person.apt)}</td><td>{format(person.inapt)}</td><td>{format(person.pending)}</td>
            <td>{duration(person.median_seconds)}<small>{format(person.measured)} medições</small></td>
            <td>{person.analyses>0&&<button type="button" className="task-results-link" onClick={()=>open('analyses',{person:person.id})}>
              Ver CNJs <ChevronRight size={13}/></button>}</td>
          </tr>)}
          {!overview.people.length&&<tr><td colSpan={7}>Sem registros no recorte.</td></tr>}
          </tbody></table></div>
      </article>
    </>}
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
