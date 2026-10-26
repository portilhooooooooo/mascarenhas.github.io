import { useQuery } from '@tanstack/react-query';
import { runtimeQueries, runtimeScope, readSummary, saveSummary } from './runtimeQueries';
import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownUp, CheckCircle2, Clock3, Download, RefreshCw, Users, Gauge } from 'lucide-react';
import type { ApiRequest } from './renderers';
import { taskTypeLabel } from './model';
import { normalizeProductivityFilters, productivityParams } from './productivityFilters';
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
const DEFAULT_FILTERS: Filters = { period: '30', deadline: 'all', person: 'all' };
const MIN_SAMPLES = 5;
const MIN_COVERAGE = 0.5;
const formatInt = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
const percent = (part: number, total: number) => total > 0 ? (part / total * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' : '—';
const time = (seconds: number | null | undefined) => {
  if (seconds == null || !Number.isFinite(seconds)) return 'Sem medição';
  if (seconds < 60) return Math.round(seconds) + 's';
  if (seconds < 3600) return (seconds / 60).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + 'min';
  const minutes = Math.round(seconds / 60);
  return Math.floor(minutes / 60) + 'h ' + String(minutes % 60).padStart(2, '0') + 'min';
};
const comparable = (row: TaskTiming) => row.samples >= MIN_SAMPLES && row.completed > 0 && row.samples / row.completed >= MIN_COVERAGE && row.median_seconds != null;

// Durante a transição, a API em execução pode não reconhecer os filtros novos.
// Repetir sem eles apenas quando o backend rejeita parâmetros é compatível
// com o contrato antigo, sem ocultar indisponibilidade ou falhas de autorização.
const unsupportedFilters = (error: unknown) => /filtros? (de resultados )?inválid|campos inválidos ou não permitidos|\b(?:400|422)\b/i.test(String((error as Error)?.message || error));
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

function stat(title: string, value: string, description: string, Icon: typeof Clock3) {
  return <div className="task-results-stat" key={title}>
    <div className="task-results-stat-top"><span>{title}</span><Icon size={16} strokeWidth={1.7}/></div>
    <strong>{value}</strong><small>{description}</small>
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
  const [filters, setFilters] = useState<Filters>(()=>{try { return normalizeProductivityFilters(JSON.parse(sessionStorage.getItem('mba_runtime_filters:'+runtimeScope())||'null')?.filters); } catch {return DEFAULT_FILTERS;} });
  const scope=runtimeScope();
  const preferenceKey='mba_runtime_filters:'+scope;
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [sortBy, setSortBy] = useState<'most' | 'least' | 'name'>(()=>{try{const v=JSON.parse(sessionStorage.getItem(preferenceKey)||'null')?.sortBy;return ['most','least','name'].includes(v)?v:'most';}catch{return 'most';}});
  const [selectedType, setSelectedType] = useState('');
  const [exporting, setExporting] = useState(false);
  const [exportError, setExportError] = useState('');
  const query = useQuery({queryKey:['runtime-v2',scope,'tasks-results',filters],enabled:visible && !!userId && !!scope,
    queryFn:async ({signal})=>{
      const params=productivityParams(filters,canViewOthers,false);
      const answer:ResultPayload=demoMode ? createDemoTaskResults({...filters,duration:'all'}) : await api('/api/tasks/results?'+params,{signal});
      if(scope!==runtimeScope()) throw new Error('Resposta de escopo anterior descartada.');
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
    try { sessionStorage.setItem(preferenceKey,JSON.stringify({filters,sortBy})); } catch { /* Quota only disables preferences. */ }
  },[preferenceKey,filters,sortBy]);

  const exportResults = async () => {
    if (demoMode || exporting || !data || loadedKey !== key) return;
    setExporting(true); setError('');
    try {
      const params = productivityParams(filters,canViewOthers,false);
      const legacyParams = productivityParams(filters,canViewOthers,true);
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
  const hasTimingByType = people.some(p => p.timing_by_type !== undefined);
  const activeType = byType.some(([type]) => type === selectedType) ? selectedType : (byType[0]?.[0] || '');
  const timingRows = useMemo(() => {
    if (!activeType) return [];
    return people.map(person => ({
      person, measure: person.timing_by_type?.[activeType],
    })).filter(row => row.measure && row.measure.completed > 0).map(row => ({
      person: row.person, measure: row.measure!,
    })).sort((a, b) => {
      const eligibleA = comparable(a.measure), eligibleB = comparable(b.measure);
      if (eligibleA !== eligibleB) return eligibleA ? -1 : 1;
      if (eligibleA && eligibleB) return (a.measure.median_seconds || 0) - (b.measure.median_seconds || 0);
      return b.measure.samples - a.measure.samples || b.measure.completed - a.measure.completed;
    });
  }, [people, activeType]);
  const eligibleCount = timingRows.filter(row => comparable(row.measure)).length;
  const fastest = !shown?.truncated && eligibleCount >= 2 ? timingRows.find(row => comparable(row.measure)) : undefined;

  return <section ref={pageRef} className="task-results-page" aria-label="Produtividade das tarefas">
    <div className="task-results-heading">
      <div><h1>Produtividade</h1><p>{canViewOthers ? 'Entregas da equipe, tempo observado de conclusão e comparações por tipo de tarefa.' : 'Suas análises concluídas e o tempo observado por tipo de tarefa.'}</p></div>
      <div className="task-results-actions">
        <button type="button" className="secondary-button" onClick={() => void exportResults()} disabled={demoMode || exporting || pending || !shown?.people?.length} title={demoMode ? 'Exportação desativada na demonstração' : canViewOthers ? 'Exportar dados da equipe' : 'Exportar minha produtividade'}>
          <Download size={15}/> {exporting ? 'Exportando…' : 'Baixar XLSX'}
        </button>
        <button type="button" className="secondary-button" onClick={() => refresh()} disabled={pending}><RefreshCw size={15}/> Atualizar</button>
      </div>
    </div>
    {demoMode && <div className="task-results-notice" role="status"><strong>Dados de demonstração.</strong> Todos os números e nomes de analistas exibidos neste ambiente são fictícios.</div>}
    <div className="task-results-filters">
      <SelectFilter title="Período das conclusões" value={filters.period} onChange={value => setFilters(current => ({ ...current, period: value as Filters['period'] }))} options={[
        { value: 'today', label: 'Hoje' }, { value: '7', label: 'Últimos 7 dias' }, { value: '30', label: 'Últimos 30 dias' },
        { value: '90', label: 'Últimos 90 dias' }, { value: 'all', label: 'Últimos 180 dias' },
      ]}/>
      <SelectFilter title="Prazo vinculado à tarefa" value={filters.deadline} onChange={value => setFilters(current => ({ ...current, deadline: value as Filters['deadline'] }))} options={[
        { value: 'all', label: 'Todos os prazos' }, { value: 'overdue', label: 'Vencido' }, { value: 'today', label: 'Vence hoje' },
        { value: 'future', label: 'A vencer' }, { value: 'none', label: 'Sem prazo' },
      ]}/>
      {canViewOthers && <SelectFilter title="Colaborador" value={filters.person} onChange={value => setFilters(current => ({ ...current, person: value }))} options={[
        { value: 'all', label: 'Toda a equipe' },
        ...options.map(person => ({ value: person.id, label: person.name })),
      ]}/>}
    </div>
    {error && <div role="alert" className="task-results-notice task-results-error">{error}<button type="button" onClick={() => refresh()}>Tentar novamente</button></div>}
    <span role="status" className="runtime-query-status">{pending ? (snapshot && !shown ? 'Último resumo autorizado · atualizando…' : 'Atualizando…') : error ? 'Dados desatualizados' : ''}</span>
    <>
      {shown?.truncated && <div role="alert" className="task-results-notice">A consulta atingiu seu limite de registros. Reduza o período: as contagens e medianas podem estar incompletas, e o destaque de velocidade está desativado.</div>}
      <div className="task-results-stats">
        {stat('Concluídas no período', (cardSummary ? formatInt(cardSummary.completed) : '—'), 'Análises humanas concluídas', CheckCircle2)}
        {stat('Concluídas hoje', (cardSummary ? formatInt(cardSummary.today_completed) : '—'), 'Hoje, dentro do filtro escolhido', Clock3)}
        {canViewOthers ? stat('Colaboradores ativos', (cardSummary ? formatInt(cardSummary.people) : '—'), 'Com pelo menos uma conclusão', Users) : stat('Minha mediana por análise', shown ? time(people[0]?.median_analysis_seconds) : '—', 'Tempo central das análises medidas', Clock3)}
        {stat('Cobertura de tempo', (cardSummary ? percent(cardSummary.recorded,cardSummary.completed) : '—'), shown ? formatInt(recorded) + ' de ' + formatInt(total) + ' com início e término válidos' : 'Aguardando dados do filtro', Gauge)}
      </div>
      <div className="task-results-grid task-results-grid-compact">
        <article className="task-results-card">
          <header><div><h2>Produção por tipo</h2><p>Quantidade de conclusões, independente de cronometragem.</p></div></header>
          {byType.length ? <div className="task-results-bars">{byType.map(([type, count]) => <div className="task-results-bar-row" key={type}>
            <div><span>{taskTypeLabel(type)}</span><strong>{formatInt(count)}</strong></div>
            <div className="task-results-bar-track"><span style={{ width: count / maxType * 100 + '%' }}/></div>
          </div>)}</div> : <p className="task-results-empty">{shown ? 'Sem análises no período.' : 'Aguardando dados do filtro.'}</p>}
        </article>
        <article className="task-results-card">
          <header><div><h2>Sobre as medições</h2><p>As comparações usam eventos registrados, não tempo ativo de tela.</p></div></header>
          <p className="task-results-explainer">A mediana representa o tempo central entre a primeira etapa registrada e a conclusão. Análises sem início identificado ou com intervalo superior a 30 minutos ficam fora da amostra. Por isso, exibimos também a cobertura e evitamos classificar quem tem poucos registros.</p>
          <p className="task-results-explainer">Comparar a velocidade só faz sentido dentro de um mesmo tipo de tarefa. A complexidade de uma defesa e de um protocolo não é equivalente.</p>
        </article>
      </div>
      {canViewOthers && <article className="task-results-card">
        <header className="task-results-table-heading"><div><h2>Produtividade por colaborador</h2><p>Entrega total e distribuição dos tempos observados. Mediana não equivale a qualidade.</p></div>
          <div className="task-results-sort"><ArrowDownUp size={14}/><select aria-label="Ordenar colaboradores" value={sortBy} onChange={event => setSortBy(event.target.value as typeof sortBy)}>
            <option value="most">Mais entregas</option><option value="least">Menos entregas</option><option value="name">Nome</option>
          </select></div>
        </header>
        <div className="task-results-table-scroll"><table className="task-results-table">
          <thead><tr><th>Colaborador</th><th>Concluídas</th><th>Participação</th><th>Mediana por análise</th><th>Média por análise</th><th>Medições válidas</th></tr></thead>
          <tbody>{sorted.map(person => <tr key={person.id}>
            <td><strong>{person.name}</strong></td>
            <td><strong>{formatInt(person.completed)}</strong></td>
            <td>{percent(person.completed, total)}</td>
            <td>{time(person.median_analysis_seconds)}</td>
            <td>{time(person.mean_analysis_seconds)}</td>
            <td>{formatInt(person.analysis_samples)} / {formatInt(person.completed)}<small>{percent(person.analysis_samples, person.completed)} de cobertura</small></td>
          </tr>)}
          {!sorted.length && <tr><td colSpan={6}>{shown ? 'Nenhuma conclusão registrada no período.' : 'Aguardando dados do filtro.'}</td></tr>}</tbody>
        </table></div>
      </article>}
      <article className="task-results-card">
        <header className="task-results-table-heading"><div><h2>Tempo de conclusão por tipo de tarefa</h2><p>{canViewOthers ? 'Compare colaboradores realizando o mesmo tipo de análise, ordenados pela menor mediana válida.' : 'Confira suas medianas e a cobertura de medições por modalidade de tarefa.'}</p></div>
          <div className="task-results-sort">
            <SelectFilter title="Tipo de tarefa" value={activeType} onChange={setSelectedType} options={byType.map(([type]) => ({ value: type, label: taskTypeLabel(type) }))}/>
          </div>
        </header>
        {!hasTimingByType && people.length > 0 ? <p className="task-results-empty" role="status">O servidor ainda não disponibiliza tempos segregados por tipo de tarefa. As medianas gerais acima permanecem disponíveis.</p> : null}
        {hasTimingByType && activeType ? <>
          {canViewOthers && <div className="task-results-timing-summary">
            <div><small>Menor mediana comparável — {taskTypeLabel(activeType)}</small>
              <strong>{fastest ? fastest.person.name : 'Sem amostra suficiente'}</strong>
              <span>{fastest ? time(fastest.measure.median_seconds) + ' · ' + formatInt(fastest.measure.samples) + ' medições' : 'Para comparar: 2 colaboradores, cada um com 5 medições e 50% de cobertura.'}</span>
            </div>
            <div><small>Colaboradores comparáveis</small><strong>{formatInt(eligibleCount)}</strong><span>Mesma modalidade e critério de amostra</span></div>
          </div>}
          <div className="task-results-table-scroll"><table className="task-results-table">
            <thead><tr>{canViewOthers && <th>Colaborador</th>}<th>Concluídas</th><th>Mediana</th><th>Média</th><th>Amostra</th>{canViewOthers && <th>Comparação</th>}</tr></thead>
            <tbody>{timingRows.map(({ person, measure }) => <tr key={person.id}>
              {canViewOthers && <td><strong>{person.name}</strong></td>}<td>{formatInt(measure.completed)}</td>
              <td>{time(measure.median_seconds)}</td><td>{time(measure.mean_seconds)}</td>
              <td>{formatInt(measure.samples)} / {formatInt(measure.completed)}<small>{percent(measure.samples, measure.completed)} de cobertura</small></td>
              {canViewOthers && <td>{shown?.truncated ? 'Consulta incompleta' : comparable(measure) ? (fastest?.person.id === person.id ? 'Menor mediana' : eligibleCount >= 2 ? 'Comparável' : 'Sem outro comparável') : 'Amostra insuficiente'}</td>}
            </tr>)}
            {!timingRows.length && <tr><td colSpan={canViewOthers ? 6 : 4}>Sem conclusões deste tipo na seleção atual.</td></tr>}</tbody>
          </table></div>
        </> : null}
      </article>
      <p className="task-results-method"><Clock3 size={14}/>Origem: eventos auditáveis de conclusão e início de etapas na carteira ativa. A mediana geral mistura tipos de tarefa; utilize a comparação por tipo para avaliar velocidade. Tempos superiores a 30 minutos são excluídos da telemetria atual, o que pode subrepresentar tarefas longas. Atualizado em {shown ? new Date(shown.generated_at).toLocaleString('pt-BR') : '—'}.</p>
    </>
  </section>;
}
