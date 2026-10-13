import { useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowDownUp, Clock3, Download, RefreshCw, Users, CheckCircle2 } from 'lucide-react';
import type { ApiRequest } from './renderers';
import { taskTypeLabel } from './model';
import './taskResults.css';

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
};
type ResultPayload = {
  period: string;
  people: Person[];
  summary: { completed: number; today_completed: number; pending: number; growth_percent: number | null; previous_completed: number; people: number; measured_analyses: number; measured_transitions: number; slowest: Person | null };
  methodology: string;
  generated_at: string;
  truncated: boolean;
};
type Filters = {
  period: 'today' | '7' | '30' | '90' | 'all';
  deadline: 'all' | 'overdue' | 'today' | 'future' | 'none';
  person: string;
  duration: 'all' | 'under2' | '2to5' | '5to10' | 'over10';
};

const DEFAULT_FILTERS: Filters = { period: '30', deadline: 'all', person: 'all', duration: 'all' };
const formatInt = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
const clock = (seconds: number | null) => {
  if (seconds === null || !Number.isFinite(seconds)) return 'Sem medição';
  if (seconds < 60) return `${Math.round(seconds)}s`;
  const rounded = Math.round(seconds / 60);
  return rounded < 60 ? `${rounded}min` : `${Math.floor(rounded / 60)}h ${String(rounded % 60).padStart(2, '0')}min`;
};

function SelectFilter({ title, value, options, onChange }: {
  title: string;
  value: string;
  options: { value: string; label: string }[];
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
  anchor.href = url;
  anchor.download = filename || 'resultados-equipe.xlsx';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function TaskResults({ api, visible, canViewOthers, userId }: {
  api: ApiRequest;
  visible: boolean;
  canViewOthers: boolean;
  userId?: string;
}) {
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [data, setData] = useState<ResultPayload | null>(null);
  const [options, setOptions] = useState<{id: string; name: string}[]>([]);
  const [sortBy, setSortBy] = useState<'completed' | 'step' | 'analysis'>('completed');
  const [pending, setPending] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [error, setError] = useState('');
  const [revision, setRevision] = useState(0);
  const requestId = useRef(0);
  const key = [filters.period, filters.deadline, filters.person, filters.duration, revision, userId].join('|');
  const [loadedKey, setLoadedKey] = useState('');

  useEffect(() => {
    if (!visible || !userId) return;
    let cancelled = false;
    const serial = ++requestId.current;
    setPending(true);
    setError('');
    const params = new URLSearchParams({ period: filters.period, deadline: filters.deadline, person: filters.person, duration: filters.duration });
    api('/api/tasks/results?' + params)
      .then((answer: ResultPayload) => {
        if (cancelled || serial !== requestId.current) return;
        if (!answer || !Array.isArray(answer.people) || !answer.summary) throw new Error('Resposta inválida da API de Resultados.');
        setData(answer);
        setLoadedKey(key);
        if (filters.person === 'all') {
          setOptions(current => {
            const merged = new Map(current.map(row => [row.id, row]));
            answer.people.forEach(row => merged.set(row.id, { id: row.id, name: row.name }));
            return Array.from(merged.values()).sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
          });
        }
      })
      .catch((cause: Error) => {
        if (!cancelled && serial === requestId.current) { setError(cause.message || 'Falha ao carregar indicadores.'); setLoadedKey(''); }
      })
      .finally(() => { if (!cancelled && serial === requestId.current) setPending(false); });
    return () => { cancelled = true; };
  }, [visible, key, api, userId]);

  useEffect(() => {
    const reset = () => { setFilters(DEFAULT_FILTERS); setData(null); setOptions([]); setLoadedKey(''); setRevision(value => value + 1); };
    window.addEventListener('mba:portfolio-changed', reset);
    window.addEventListener('mba:logged-out', reset);
    window.addEventListener('mba:session-expired', reset);
    return () => {
      window.removeEventListener('mba:portfolio-changed', reset);
      window.removeEventListener('mba:logged-out', reset);
      window.removeEventListener('mba:session-expired', reset);
    };
  }, []);

  const updateFilter = (field: keyof Filters, value: string) => {
    setFilters(current => ({ ...current, [field]: value }));
  };
  const exportResults = async () => {
    if (exporting || !data || loadedKey !== key) return;
    setExporting(true);
    setError('');
    try {
      const params = new URLSearchParams({ period: filters.period, deadline: filters.deadline, person: filters.person, duration: filters.duration });
      const result = await api('/api/tasks/results/export?' + params);
      if (!result?.content_base64 || typeof result?.filename !== 'string') throw new Error('Arquivo XLSX indisponível.');
      downloadXlsx(result.content_base64, result.filename);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível exportar os resultados.');
    } finally {
      setExporting(false);
    }
  };
  const shown = loadedKey === key ? data : null;
  const sorted = useMemo(() => [...(shown?.people || [])].sort((a, b) => {
    if (sortBy === 'step') return (b.mean_step_seconds ?? -1) - (a.mean_step_seconds ?? -1) || b.step_samples - a.step_samples;
    if (sortBy === 'analysis') return (b.mean_analysis_seconds ?? -1) - (a.mean_analysis_seconds ?? -1) || b.analysis_samples - a.analysis_samples;
    return b.completed - a.completed || a.name.localeCompare(b.name, 'pt-BR');
  }), [shown, sortBy]);

  const byType = useMemo(() => {
    const totals = new Map<string, number>();
    shown?.people.forEach(person => Object.entries(person.by_type || {}).forEach(([type, count]) => totals.set(type, (totals.get(type) || 0) + count)));
    return [...totals].sort((a, b) => b[1] - a[1]).slice(0, 8);
  }, [shown]);
  const maxType = Math.max(1, ...byType.map(([, count]) => count));
  const winner = shown?.summary?.slowest;

  return <section className="task-results-page" aria-label="Resultados das tarefas">
    <div className="task-results-heading">
      <div><h1>Resultados</h1><p>Produtividade, tempos de análise e progressão no fluxo por colaborador.</p></div>
      <div className="task-results-actions">
        <button type="button" className="secondary-button" onClick={() => void exportResults()} disabled={exporting || pending || !shown?.people?.length}><Download size={15}/> {exporting ? 'Exportando…' : 'Baixar XLSX'}</button>
        <button type="button" className="secondary-button" onClick={() => setRevision(value => value + 1)} disabled={pending}><RefreshCw size={15}/> Atualizar</button>
      </div>
    </div>
    <div className="task-results-filters">
      <SelectFilter title="Período de conclusão" value={filters.period} onChange={value => updateFilter('period', value)} options={[
        { value: 'today', label: 'Hoje' }, { value: '7', label: 'Últimos 7 dias' }, { value: '30', label: 'Últimos 30 dias' },
        { value: '90', label: 'Últimos 90 dias' }, { value: 'all', label: 'Histórico (180 dias)' },
      ]}/>
      <SelectFilter title="Prazo da tarefa" value={filters.deadline} onChange={value => updateFilter('deadline', value)} options={[
        { value: 'all', label: 'Todos' }, { value: 'overdue', label: 'Vencido' }, { value: 'today', label: 'Hoje' },
        { value: 'future', label: 'A vencer' }, { value: 'none', label: 'Sem prazo' },
      ]}/>
      <SelectFilter title="Colaborador" value={filters.person} onChange={value => updateFilter('person', value)} options={[
        { value: 'all', label: canViewOthers ? 'Toda a equipe' : 'Minhas análises' },
        ...(canViewOthers ? options.map(person => ({ value: person.id, label: person.name })) : []),
      ]}/>
      <SelectFilter title="Tempo médio de análise" value={filters.duration} onChange={value => updateFilter('duration', value)} options={[
        { value: 'all', label: 'Todos os tempos' }, { value: 'under2', label: 'Menos de 2 minutos' },
        { value: '2to5', label: '2 a 5 minutos' }, { value: '5to10', label: '5 a 10 minutos' },
        { value: 'over10', label: '10 minutos ou mais' },
      ]}/>
    </div>
    {error && <div role="alert" className="task-results-notice task-results-error">{error}<button type="button" onClick={() => setRevision(n => n + 1)}>Tentar novamente</button></div>}
    {pending && !shown && <div role="status" className="task-results-notice">Carregando dados auditados da carteira…</div>}
    {shown && <>
      {shown.truncated && <div role="alert" className="task-results-notice">Volume superior ao limite de consulta. Reduza o período para obter indicadores completos.</div>}
      <div className="task-results-stats">
        {stat('Analisados hoje', formatInt(shown.summary.today_completed), 'Concluídos hoje, no recorte selecionado', CheckCircle2)}
        {stat('Pendentes', formatInt(shown.summary.pending), 'Fila atribuída ainda em aberto', Clock3)}
        {stat('Crescimento', shown.summary.growth_percent === null ? '—' : `${shown.summary.growth_percent > 0 ? '+' : ''}${shown.summary.growth_percent.toLocaleString('pt-BR')}%`, shown.summary.growth_percent === null ? 'Sem período comparável' : 'Ante o período anterior equivalente', Activity)}
        {stat('Análises no período', formatInt(shown.summary.completed), 'Concluídas por pessoas no recorte', CheckCircle2)}
        {stat('Análises com tempo', formatInt(shown.summary.measured_analyses), 'Medições após ativação da telemetria', Clock3)}
        {stat('Avanços mensurados', formatInt(shown.summary.measured_transitions), 'Transições registradas pelo novo fluxo', Users)}
      </div>
      <div className="task-results-grid">
        <article className="task-results-card task-results-ranking">
          <header><h2>Tempo para avançar de etapa</h2><p>Média do tempo para passar de uma fase do fluxo à seguinte, em ordem decrescente.</p></header>
          {winner ? <div className="task-results-leader">
            <div><small>Maior tempo médio mensurado</small><strong>{winner.name}</strong><span>{winner.step_samples} avanços registrados</span></div>
            <strong>{clock(winner.mean_step_seconds)}</strong>
          </div> : <p className="task-results-empty">As conclusões históricas já estão contabilizadas. Para comparar a velocidade entre fases, precisamos de cinco transições cronometradas por colaborador após a ativação da telemetria.</p>}
          <div className="task-results-bars">
            {shown.people.filter(row => row.step_samples >= 5).sort((a,b)=>(b.mean_step_seconds || 0)-(a.mean_step_seconds || 0)).slice(0,8).map(row => (
              <div className="task-results-bar-row" key={row.id}>
                <div><span>{row.name}</span><strong>{clock(row.mean_step_seconds)}</strong></div>
                <div className="task-results-bar-track"><span style={{ width: `${winner?.mean_step_seconds ? (Number(row.mean_step_seconds || 0) / winner.mean_step_seconds * 100) : 0}%` }} /></div>
                <small>{row.step_samples} transições</small>
              </div>
            ))}
          </div>
        </article>
        <article className="task-results-card">
          <header><h2>Produção por tipo</h2><p>Análises humanas concluídas no período selecionado.</p></header>
          {byType.length ? <div className="task-results-bars">{byType.map(([type, count]) => <div className="task-results-bar-row" key={type}>
            <div><span>{taskTypeLabel(type)}</span><strong>{formatInt(count)}</strong></div>
            <div className="task-results-bar-track"><span style={{ width: `${count / maxType * 100}%` }}/></div>
          </div>)}</div> : <p className="task-results-empty">Sem análises no período selecionado.</p>}
        </article>
      </div>
      <article className="task-results-card">
        <header className="task-results-table-heading"><div><h2>Desempenho por colaborador</h2><p>Concluídos históricos separados dos tempos efetivamente cronometrados.</p></div>
          <div className="task-results-sort">
            <ArrowDownUp size={14}/>
            <select aria-label="Ordenar colaboradores" value={sortBy} onChange={event => setSortBy(event.target.value as typeof sortBy)}>
              <option value="completed">Mais análises</option><option value="analysis">Maior tempo de análise</option><option value="step">Maior tempo por etapa</option>
            </select>
          </div>
        </header>
        <div className="task-results-table-scroll"><table className="task-results-table">
          <thead><tr><th>Colaborador</th><th>Análises</th><th>Tempo médio de análise</th><th>Mediana</th><th>Tempo médio por etapa</th><th>Amostra de etapas</th></tr></thead>
          <tbody>{sorted.map(person => <tr key={person.id}>
            <td><strong>{person.name}</strong></td><td>{formatInt(person.completed)}</td>
            <td>{clock(person.mean_analysis_seconds)}<small>{person.analysis_samples} análise(s) cronometrada(s)</small></td>
            <td>{clock(person.median_analysis_seconds)}</td>
            <td>{clock(person.mean_step_seconds)}</td><td>{formatInt(person.step_samples)}</td>
          </tr>)}
          {!sorted.length && <tr><td colSpan={6}>Nenhum registro com os filtros selecionados.</td></tr>}</tbody>
        </table></div>
      </article>
      <p className="task-results-method"><Clock3 size={14}/>{shown.methodology} Eventos históricos sem início registrado não são utilizados para comparar velocidade. Registros externos importados são excluídos da produtividade humana. Atualizado em {new Date(shown.generated_at).toLocaleString('pt-BR')}.</p>
    </>}
  </section>;
}
