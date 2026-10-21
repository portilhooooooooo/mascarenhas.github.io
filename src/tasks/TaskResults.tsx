import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownUp, CheckCircle2, Clock3, Download, RefreshCw, Users, Gauge } from 'lucide-react';
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
  const demoMode = canViewOthers && isDemoTaskResultsHost();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [data, setData] = useState<ResultPayload | null>(null);
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [sortBy, setSortBy] = useState<'most' | 'least' | 'name'>('most');
  const [selectedType, setSelectedType] = useState('');
  const [pending, setPending] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const requestId = useRef(0);
  const key = [filters.period, filters.deadline, filters.person, revision, userId].join('|');
  const [loadedKey, setLoadedKey] = useState('');

  useEffect(() => {
    if (!visible || !userId) return;
    let cancelled = false;
    const serial = ++requestId.current;
    setPending(true); setError('');
    // Não solicitar o snapshot de pendências: essa visão mede apenas conclusões.
    const params = new URLSearchParams({ ...filters, duration: 'all', include_pending: '0', include_growth: '0' });
    const legacyParams = new URLSearchParams({ ...filters, duration: 'all' });
    const request = demoMode ? Promise.resolve(createDemoTaskResults({ ...filters, duration: 'all' }))
      : withOldApiFallback(api, '/api/tasks/results?' + params, '/api/tasks/results?' + legacyParams);
    request.then((answer: ResultPayload) => {
      if (cancelled || serial !== requestId.current) return;
      if (!answer || !Array.isArray(answer.people) || !answer.summary) throw new Error('Resposta inválida da API de produtividade.');
      setData(answer);
      setLoadedKey(key);
      if (filters.person === 'all') setOptions(current => {
        const merged = new Map(current.map(row => [row.id, row]));
        answer.people.forEach(row => merged.set(row.id, { id: row.id, name: row.name }));
        return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
      });
    }).catch((cause: Error) => {
      if (!cancelled && serial === requestId.current) {
        setError(cause.message || 'Falha ao carregar produtividade.'); setLoadedKey('');
      }
    }).finally(() => { if (!cancelled && serial === requestId.current) setPending(false); });
    return () => { cancelled = true; };
  }, [visible, key, api, userId, demoMode]);

  useEffect(() => {
    const reset = () => {
      requestId.current += 1;
      setFilters(DEFAULT_FILTERS); setData(null); setOptions([]);
      setLoadedKey(''); setSelectedType(''); setRevision(value => value + 1);
    };
    window.addEventListener('mba:portfolio-changed', reset);
    window.addEventListener('mba:logged-out', reset);
    window.addEventListener('mba:session-expired', reset);
    return () => {
      window.removeEventListener('mba:portfolio-changed', reset);
      window.removeEventListener('mba:logged-out', reset);
      window.removeEventListener('mba:session-expired', reset);
    };
  }, []);

  const exportResults = async () => {
    if (demoMode || exporting || !data || loadedKey !== key) return;
    setExporting(true); setError('');
    try {
      const params = new URLSearchParams({ ...filters, duration: 'all', include_pending: '0', include_growth: '0' });
      const legacyParams = new URLSearchParams({ ...filters, duration: 'all' });
      const result = await withOldApiFallback(api, '/api/tasks/results/export?' + params,
        '/api/tasks/results/export?' + legacyParams);
      if (!result?.content_base64 || typeof result?.filename !== 'string') throw new Error('Arquivo XLSX indisponível.');
      downloadXlsx(result.content_base64, result.filename);
    } catch (cause: any) { setError(cause?.message || 'Não foi possível exportar os dados.'); }
    finally { setExporting(false); }
  };

  const shown = loadedKey === key ? data : null;
  const people = useMemo(() => (shown?.people || []).filter(row => row.completed > 0), [shown]);
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
  const total = shown?.summary.completed || 0;
  const recorded = people.reduce((sum, p) => sum + p.analysis_samples, 0);
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

  return <section className="task-results-page" aria-label="Produtividade das tarefas">
    <div className="task-results-heading">
      <div><h1>Produtividade</h1><p>Entregas da equipe, tempo observado de conclusão e comparações por tipo de tarefa.</p></div>
      <div className="task-results-actions">
        <button type="button" className="secondary-button" onClick={() => void exportResults()} disabled={demoMode || exporting || pending || !shown?.people?.length} title={demoMode ? 'Exportação desativada na demonstração' : 'Exportar produção e medições por colaborador'}>
          <Download size={15}/> {exporting ? 'Exportando…' : 'Baixar XLSX'}
        </button>
        <button type="button" className="secondary-button" onClick={() => setRevision(value => value + 1)} disabled={pending}><RefreshCw size={15}/> Atualizar</button>
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
      <SelectFilter title="Colaborador" value={filters.person} onChange={value => setFilters(current => ({ ...current, person: value }))} options={[
        { value: 'all', label: canViewOthers ? 'Toda a equipe' : 'Minhas análises' },
        ...(canViewOthers ? options.map(person => ({ value: person.id, label: person.name })) : []),
      ]}/>
    </div>
    {error && <div role="alert" className="task-results-notice task-results-error">{error}<button type="button" onClick={() => setRevision(n => n + 1)}>Tentar novamente</button></div>}
    {pending && !shown && <div role="status" className="task-results-notice">Carregando conclusões auditadas…</div>}
    {shown && <>
      {shown.truncated && <div role="alert" className="task-results-notice">A consulta atingiu seu limite de registros. Reduza o período: as contagens e medianas podem estar incompletas, e o destaque de velocidade está desativado.</div>}
      <div className="task-results-stats">
        {stat('Concluídas no período', formatInt(total), 'Análises humanas concluídas', CheckCircle2)}
        {stat('Concluídas hoje', formatInt(shown.summary.today_completed), 'Hoje, dentro do filtro escolhido', Clock3)}
        {stat('Colaboradores ativos', formatInt(people.length), 'Com pelo menos uma conclusão', Users)}
        {stat('Cobertura de tempo', percent(recorded, total), formatInt(recorded) + ' de ' + formatInt(total) + ' com início e término válidos', Gauge)}
      </div>
      <div className="task-results-grid task-results-grid-compact">
        <article className="task-results-card">
          <header><div><h2>Produção por tipo</h2><p>Quantidade de conclusões, independente de cronometragem.</p></div></header>
          {byType.length ? <div className="task-results-bars">{byType.map(([type, count]) => <div className="task-results-bar-row" key={type}>
            <div><span>{taskTypeLabel(type)}</span><strong>{formatInt(count)}</strong></div>
            <div className="task-results-bar-track"><span style={{ width: count / maxType * 100 + '%' }}/></div>
          </div>)}</div> : <p className="task-results-empty">Sem análises no período.</p>}
        </article>
        <article className="task-results-card">
          <header><div><h2>Sobre as medições</h2><p>As comparações usam eventos registrados, não tempo ativo de tela.</p></div></header>
          <p className="task-results-explainer">A mediana representa o tempo central entre a primeira etapa registrada e a conclusão. Análises sem início identificado ou com intervalo superior a 30 minutos ficam fora da amostra. Por isso, exibimos também a cobertura e evitamos classificar quem tem poucos registros.</p>
          <p className="task-results-explainer">Comparar a velocidade só faz sentido dentro de um mesmo tipo de tarefa. A complexidade de uma defesa e de um protocolo não é equivalente.</p>
        </article>
      </div>
      <article className="task-results-card">
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
          {!sorted.length && <tr><td colSpan={6}>Nenhuma conclusão registrada no período.</td></tr>}</tbody>
        </table></div>
      </article>
      <article className="task-results-card">
        <header className="task-results-table-heading"><div><h2>Tempo de conclusão por tipo de tarefa</h2><p>Compare colaboradores realizando o mesmo tipo de análise, ordenados pela menor mediana válida.</p></div>
          <div className="task-results-sort">
            <SelectFilter title="Tipo de tarefa" value={activeType} onChange={setSelectedType} options={byType.map(([type]) => ({ value: type, label: taskTypeLabel(type) }))}/>
          </div>
        </header>
        {!hasTimingByType && people.length > 0 ? <p className="task-results-empty" role="status">O servidor ainda não disponibiliza tempos segregados por tipo de tarefa. As medianas gerais acima permanecem disponíveis.</p> : null}
        {hasTimingByType && activeType ? <>
          <div className="task-results-timing-summary">
            <div><small>Menor mediana comparável — {taskTypeLabel(activeType)}</small>
              <strong>{fastest ? fastest.person.name : 'Sem amostra suficiente'}</strong>
              <span>{fastest ? time(fastest.measure.median_seconds) + ' · ' + formatInt(fastest.measure.samples) + ' medições' : 'Para comparar: 2 colaboradores, cada um com 5 medições e 50% de cobertura.'}</span>
            </div>
            <div><small>Colaboradores comparáveis</small><strong>{formatInt(eligibleCount)}</strong><span>Mesma modalidade e critério de amostra</span></div>
          </div>
          <div className="task-results-table-scroll"><table className="task-results-table">
            <thead><tr><th>Colaborador</th><th>Concluídas</th><th>Mediana</th><th>Média</th><th>Amostra</th><th>Comparação</th></tr></thead>
            <tbody>{timingRows.map(({ person, measure }) => <tr key={person.id}>
              <td><strong>{person.name}</strong></td><td>{formatInt(measure.completed)}</td>
              <td>{time(measure.median_seconds)}</td><td>{time(measure.mean_seconds)}</td>
              <td>{formatInt(measure.samples)} / {formatInt(measure.completed)}<small>{percent(measure.samples, measure.completed)} de cobertura</small></td>
              <td>{shown.truncated ? 'Consulta incompleta' : comparable(measure) ? (fastest?.person.id === person.id ? 'Menor mediana' : eligibleCount >= 2 ? 'Comparável' : 'Sem outro comparável') : 'Amostra insuficiente'}</td>
            </tr>)}
            {!timingRows.length && <tr><td colSpan={6}>Sem conclusões deste tipo na seleção atual.</td></tr>}</tbody>
          </table></div>
        </> : null}
      </article>
      <p className="task-results-method"><Clock3 size={14}/>Origem: eventos auditáveis de conclusão e início de etapas na carteira ativa. A mediana geral mistura tipos de tarefa; utilize a comparação por tipo para avaliar velocidade. Tempos superiores a 30 minutos são excluídos da telemetria atual, o que pode subrepresentar tarefas longas. Atualizado em {new Date(shown.generated_at).toLocaleString('pt-BR')}.</p>
    </>}
  </section>;
}
