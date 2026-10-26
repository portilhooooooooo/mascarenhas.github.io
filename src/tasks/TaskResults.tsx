import { useQuery } from '@tanstack/react-query';
import { runtimeQueries, runtimeScope, readSummary, saveSummary } from './runtimeQueries';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownUp, CheckCircle2, Clock3, Download, ListTodo } from 'lucide-react';
import type { ApiRequest } from './renderers';
import { taskTypeLabel } from './model';
import { createDemoTaskResults, isDemoTaskResultsHost } from './demoTaskResults';
import './taskResults.css';

type TaskTiming = {
  completed: number;
  samples: number;
  median_seconds: number | null;
  mean_seconds: number | null;
};
type Person = {
  id: string;
  name: string;
  completed: number;
  analysis_samples: number;
  mean_analysis_seconds: number | null;
  median_analysis_seconds: number | null;
  step_samples: number;
  mean_step_seconds: number | null;
  by_type: Record<string, number>;
  timing_by_type?: Record<string, TaskTiming>;
};
export type ResultPayload = {
  period: string;
  people: Person[];
  summary: {
    completed: number;
    today_completed: number;
    pending: number | null;
    growth_percent: number | null;
    previous_completed: number;
    people: number;
    measured_analyses: number;
    measured_transitions: number;
    slowest: Person | null;
  };
  methodology: string;
  generated_at: string;
  truncated: boolean;
};
type Filters = {
  period: 'today' | '7' | '30' | '90' | 'all';
  deadline: 'all' | 'overdue' | 'today' | 'future' | 'none';
  person: string;
};
const DEFAULT_FILTERS: Filters = { period: 'today', deadline: 'all', person: 'all' };
const formatInt = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
const percent = (part: number, total: number) => total > 0 ? (part / total * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' : '—';
const time = (seconds: number | null | undefined) => {
  if (seconds == null || !Number.isFinite(seconds)) return 'Sem medição';
  if (seconds < 60) return Math.round(seconds) + 's';
  if (seconds < 3600) return (seconds / 60).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'min';
  const minutes = Math.round(seconds / 60);
  return Math.floor(minutes / 60) + 'h ' + String(minutes % 60).padStart(2, '0') + 'min';
};

// Durante a transição, a API em execução pode não reconhecer os filtros novos.
// Repetir sem eles apenas quando o backend rejeita parâmetros é compatível
// com o contrato antigo, sem ocultar indisponibilidade ou falhas de autorização.
const unsupportedFilters = (error: unknown) => /filtros? (de resultados )?inválid|\b400\b/i.test(String((error as Error)?.message || error));
const withOldApiFallback = (api: ApiRequest, path: string, legacyPath: string) =>
  api(path).catch((error: unknown) => {
    if (!unsupportedFilters(error)) throw error;
    return api(legacyPath);
  });

function SelectFilter({ title, value, options, onChange }: {
  title: string; value: string; options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return <label className="task-results-filter"><span>{title}</span>
    <select value={value} onChange={event => onChange(event.target.value)}>{options.map(option =>
      <option key={option.value} value={option.value}>{option.label}</option>
    )}</select>
  </label>;
}

function stat(title: string, value: string, Icon: typeof Clock3) {
  return <div className="task-results-stat" key={title}>
    <div className="task-results-stat-top"><span>{title}</span><Icon size={16} strokeWidth={1.7}/></div>
    <strong>{value}</strong>
  </div>;
}

function downloadXlsx(encoded: string, filename: string) {
  const binary = atob(encoded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) bytes[i] = binary.charCodeAt(i);
  const blob = new Blob([bytes], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url; anchor.download = filename || 'produtividade-tarefas.xlsx';
  document.body.appendChild(anchor); anchor.click(); anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function TaskResults({ api, visible, canViewOthers, userId }: {
  api: ApiRequest; visible: boolean; canViewOthers: boolean; userId?: string;
}) {
  const pageRef=useRef<HTMLElement>(null);
  const blockHeights=useRef(new Map<number,number>());
  const demoMode = canViewOthers && isDemoTaskResultsHost();
  const [filters, setFilters] = useState<Filters>(()=>{try {
    const saved=JSON.parse(sessionStorage.getItem('mba_runtime_filters:'+runtimeScope())||'null');
    const v=saved?.filters;
    return saved?.layoutVersion===2 && v && ['today','7','30','90','all'].includes(v.period)
      && ['all','overdue','today','future','none'].includes(v.deadline) && typeof v.person==='string'
      ? v : DEFAULT_FILTERS;
  } catch {return DEFAULT_FILTERS;} });
  const scope=runtimeScope();
  const preferenceKey='mba_runtime_filters:'+scope;
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [sortBy, setSortBy] = useState<'most' | 'least' | 'name'>(()=>{try{const v=JSON.parse(sessionStorage.getItem(preferenceKey)||'null')?.sortBy;return ['most','least','name'].includes(v)?v:'most';}catch{return 'most';}});
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const query = useQuery({queryKey:['runtime-v2',scope,'tasks-results',filters],enabled:visible && !!userId && !!scope,
    queryFn:async ({signal})=>{
      const params=new URLSearchParams({...filters,person:canViewOthers?filters.person:'all',duration:'all',include_pending:'1',include_growth:'0'});
      const answer:ResultPayload=demoMode ? createDemoTaskResults({...filters,duration:'all'}) : await api('/api/tasks/results?'+params,{signal});
      if(scope!==runtimeScope()) throw new Error('Resposta de escopo anterior descartada.');
      // Defesa adicional: um analista nunca recebe dados de terceiros, mesmo em API legada.
      if(!canViewOthers && answer.people?.some(person=>person.id!==userId))
        throw new Error('Escopo de produtividade inválido.');
      if(!answer || !Array.isArray(answer.people) || !answer.summary || ![answer.summary.completed,answer.summary.today_completed].every(v=>Number.isFinite(v)&&v>=0)) throw new Error('Resposta inválida da API de produtividade.');
      return answer;
    }},runtimeQueries);
  const data=query.data || null;
  const pending=query.isFetching;
  const error=exportError || (query.error ? 'Não foi possível atualizar. '+query.error.message : '');
  const key=JSON.stringify([scope,filters]);
  const loadedKey=data ? key : '';
  const setError=setExportError;
  const refresh=()=>{void query.refetch();};
  useEffect(()=>{
    if(filters.person==='all' && data) setOptions(previous=>{const values=new Map(previous.map(row=>[row.id,row]));data.people.forEach(row=>values.set(row.id,{id:row.id,name:row.name}));return [...values.values()].sort((a,b)=>a.name.localeCompare(b.name,'pt-BR'));});
  },[data,filters.person]);
  useEffect(()=>{
    try { sessionStorage.setItem(preferenceKey,JSON.stringify({layoutVersion:2,filters,sortBy})); } catch { /* Quota only disables preferences. */ }
  },[preferenceKey,filters,sortBy]);

  const exportResults = async () => {
    if (demoMode || exporting || !data || loadedKey !== key) return;
    setExporting(true); setError('');
    try {
      const params = new URLSearchParams({ ...filters, person: canViewOthers ? filters.person : 'all', duration: 'all', include_pending: '0', include_growth: '0' });
      const legacyParams = new URLSearchParams({ ...filters, person: canViewOthers ? filters.person : 'all', duration: 'all' });
      const result = await withOldApiFallback(api, '/api/tasks/results/export?' + params,
        '/api/tasks/results/export?' + legacyParams);
      if (!result?.content_base64 || typeof result?.filename !== 'string') throw new Error('Arquivo XLSX indisponível.');
      if(scope!==runtimeScope())return;
      downloadXlsx(result.content_base64, result.filename);
    } catch (cause: any) { setError(cause?.message || 'Não foi possível exportar os dados.'); }
    finally { setExporting(false); }
  };

  const shown = loadedKey === key ? data : null;
  useLayoutEffect(()=>{pageRef.current?.querySelectorAll<HTMLElement>('.task-results-card,.task-results-stats').forEach((block,index)=>{if(shown){block.style.minHeight='';blockHeights.current.set(index,block.getBoundingClientRect().height);}else{const height=blockHeights.current.get(index);if(height)block.style.minHeight=height+'px';}});},[shown]);
  const people = useMemo(() => (shown?.people || []).filter(row => row.completed > 0 && (canViewOthers || row.id === userId)), [shown, canViewOthers, userId]);
  const sorted = useMemo(() => [...people].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name, 'pt-BR');
    if (sortBy === 'least') return a.completed - b.completed || a.name.localeCompare(b.name, 'pt-BR');
    return b.completed - a.completed || a.name.localeCompare(b.name, 'pt-BR');
  }), [people, sortBy]);
  const byType = useMemo(() => {
    const totals = new Map<string, number>();
    people.forEach(person => Object.entries(person.by_type || {}).forEach(([type, count]) =>
      totals.set(type, (totals.get(type) || 0) + count)));
    return [...totals].sort((a, b) => b[1] - a[1]);
  }, [people]);
  const maxType = Math.max(1, ...byType.map(([, count]) => count));
  const snapshotKey=JSON.stringify([scope,filters]);
  const snapshot=useMemo(()=>readSummary(snapshotKey),[snapshotKey]);
  const total = shown?.summary.completed || 0;
  const recorded = people.reduce((sum, p) => sum + p.analysis_samples, 0);
  const cardSummary=shown ? {completed:total,today_completed:shown.summary.today_completed,people:people.length,recorded} : snapshot;
  useEffect(()=>{if(shown)saveSummary(snapshotKey,{completed:total,today_completed:shown.summary.today_completed,people:people.length,recorded});},[shown,snapshotKey,total,people.length,recorded]);
  const timingSamples = people.reduce((sum,person)=>sum+(
    person.mean_analysis_seconds == null ? 0 : person.analysis_samples
  ),0);
  const meanSeconds = timingSamples
    ? people.reduce((sum,person)=>sum+(person.mean_analysis_seconds ?? 0)*person.analysis_samples,0)/timingSamples
    : null;
  const pendingCount = shown?.summary.pending;

  return <section ref={pageRef} className="task-results-page" aria-label="Produtividade das tarefas">
    <div className="task-results-heading">
      <h1>Produtividade</h1>
      <div className="task-results-actions">
        <button type="button" className="secondary-button" onClick={() => void exportResults()}
          disabled={demoMode || exporting || pending || !shown?.people?.length}
          title={demoMode ? 'Exportação indisponível na demonstração' : 'Exportar produtividade'}>
          <Download size={15}/> {exporting ? 'Exportando…' : 'Baixar XLSX'}
        </button>
      </div>
    </div>
    {demoMode && <div className="task-results-notice" role="status">Dados de demonstração</div>}
    <div className="task-results-filters">
      <SelectFilter title="Período" value={filters.period}
        onChange={value=>setFilters(current=>({...current,period:value as Filters['period']}))}
        options={[
          {value:'today',label:'Hoje'}, {value:'7',label:'Últimos 7 dias'},
          {value:'30',label:'Últimos 30 dias'}, {value:'90',label:'Últimos 90 dias'},
          {value:'all',label:'Últimos 180 dias'},
        ]}/>
      <SelectFilter title="Prazo" value={filters.deadline}
        onChange={value=>setFilters(current=>({...current,deadline:value as Filters['deadline']}))}
        options={[
          {value:'all',label:'Todos'}, {value:'overdue',label:'Vencido'},
          {value:'today',label:'Vence hoje'}, {value:'future',label:'A vencer'},
          {value:'none',label:'Sem prazo'},
        ]}/>
      {canViewOthers && <SelectFilter title="Colaborador" value={filters.person}
        onChange={value=>setFilters(current=>({...current,person:value}))}
        options={[{value:'all',label:'Todos'},...options.map(person=>({value:person.id,label:person.name}))]}/>}
    </div>
    {error && <div role="alert" className="task-results-notice task-results-error">
      {error}<button type="button" onClick={refresh}>Tentar novamente</button>
    </div>}
    <span role="status" className="runtime-query-status">
      {pending ? 'Atualizando…' : error ? 'Dados indisponíveis' : ''}
    </span>
    {shown?.truncated && <div role="alert" className="task-results-notice">
      Consulta incompleta. Reduza o período.
    </div>}
    <div className="task-results-stats">
      {stat('Pendentes', typeof pendingCount === 'number' ? formatInt(pendingCount) : '—', ListTodo)}
      {stat('Concluídos', cardSummary ? formatInt(cardSummary.completed) : '—', CheckCircle2)}
      {stat('Tempo médio', shown ? time(meanSeconds) : '—', Clock3)}
    </div>
    <article className="task-results-card">
      <header><h2>Tarefas concluídas</h2></header>
      {byType.length ? <div className="task-results-bars">
        {byType.map(([type,count])=><div className="task-results-bar-row" key={type}>
          <div><span>{taskTypeLabel(type)}</span><strong>{formatInt(count)}</strong></div>
          <div className="task-results-bar-track"><span style={{width:count/maxType*100+'%'}}/></div>
        </div>)}
      </div> : <p className="task-results-empty">
        {shown ? 'Nenhuma tarefa concluída no período.' : 'Aguardando dados.'}
      </p>}
    </article>
    <article className="task-results-card">
      <header className="task-results-table-heading">
        <h2>Produtividade por colaborador</h2>
        {canViewOthers && <div className="task-results-sort">
          <ArrowDownUp size={14}/>
          <select aria-label="Ordenar colaboradores" value={sortBy}
            onChange={event=>setSortBy(event.target.value as typeof sortBy)}>
            <option value="most">Mais entregas</option>
            <option value="least">Menos entregas</option>
            <option value="name">Nome</option>
          </select>
        </div>}
      </header>
      <div className="task-results-table-scroll"><table className="task-results-table">
        <thead><tr><th>Colaborador</th><th>Concluídos</th><th>Tempo médio</th></tr></thead>
        <tbody>{sorted.map(person=><tr key={person.id}>
          <td><strong>{person.name}</strong></td>
          <td>{formatInt(person.completed)}</td>
          <td>{time(person.mean_analysis_seconds)}</td>
        </tr>)}
        {!sorted.length && <tr><td colSpan={3}>
          {shown ? 'Sem conclusões no período.' : 'Aguardando dados.'}
        </td></tr>}</tbody>
      </table></div>
    </article>
  </section>;
}
