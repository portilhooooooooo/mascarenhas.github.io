import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowDownUp, CheckCircle2, Clock3, Download, RefreshCw, Users } from 'lucide-react';
import type { ApiRequest } from './renderers';
import { taskTypeLabel } from './model';
import { createDemoTaskResults, isDemoTaskResultsHost } from './demoTaskResults';
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
export type ResultPayload = {
  period: string;
  people: Person[];
  summary: {
    completed: number;
    today_completed: number;
    pending: number;
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
const formatInt = (value: number) => new Intl.NumberFormat('pt-BR').format(value);

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
  anchor.download = filename || 'producao-tarefas.xlsx';
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
  const demoMode = canViewOthers && isDemoTaskResultsHost();
  const [filters, setFilters] = useState<Filters>(DEFAULT_FILTERS);
  const [data, setData] = useState<ResultPayload | null>(null);
  const [options, setOptions] = useState<{ id: string; name: string }[]>([]);
  const [sortBy, setSortBy] = useState<'most' | 'least' | 'name'>('most');
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
    setPending(true);
    setError('');
    // A API ainda aceita 'duration'; não filtrar produção pela média individual
    // de cronometragem porque isso distorce o total de entregas.
    const params = new URLSearchParams({ ...filters, duration: 'all' });
    const request = demoMode ? Promise.resolve(createDemoTaskResults({ ...filters, duration: 'all' }))
      : api('/api/tasks/results?' + params);
    request.then((answer: ResultPayload) => {
      if (cancelled || serial !== requestId.current) return;
      if (!answer || !Array.isArray(answer.people) || !answer.summary) throw new Error('Resposta inválida da API de produção.');
      setData(answer);
      setLoadedKey(key);
      if (filters.person === 'all') {
        setOptions(current => {
          const merged = new Map(current.map(row => [row.id, row]));
          answer.people.forEach(row => merged.set(row.id, { id: row.id, name: row.name }));
          return [...merged.values()].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
        });
      }
    }).catch((cause: Error) => {
      if (!cancelled && serial === requestId.current) {
        setError(cause.message || 'Falha ao carregar produção.');
        setLoadedKey('');
      }
    }).finally(() => { if (!cancelled && serial === requestId.current) setPending(false); });
    return () => { cancelled = true; };
  }, [visible, key, api, userId, demoMode]);

  useEffect(() => {
    const reset = () => {
      requestId.current += 1;
      setFilters(DEFAULT_FILTERS); setData(null); setOptions([]);
      setLoadedKey(''); setRevision(value => value + 1);
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
    setExporting(true);
    setError('');
    try {
      const params = new URLSearchParams({ ...filters, duration: 'all' });
      const result = await api('/api/tasks/results/export?' + params);
      if (!result?.content_base64 || typeof result?.filename !== 'string') throw new Error('Arquivo XLSX indisponível.');
      downloadXlsx(result.content_base64, result.filename);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível exportar os dados.');
    } finally {
      setExporting(false);
    }
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
  const maxPerson = Math.max(1, ...people.map(row => row.completed));
  const total = shown?.summary.completed || 0;

  return <section className="task-results-page" aria-label="Produção das tarefas">
    <div className="task-results-heading">
      <div><h1>Produção das tarefas</h1><p>Entregas concluídas pela equipe e volume ainda em aberto. Não confunde velocidade de navegação com produtividade.</p></div>
      <div className="task-results-actions">
        <button type="button" className="secondary-button" onClick={() => void exportResults()} disabled={demoMode || exporting || pending || !shown?.people?.length} title={demoMode ? 'Exportação desativada para dados fictícios' : 'A planilha inclui colunas técnicas de telemetria além das entregas'}>
          <Download size={15}/> {exporting ? 'Exportando…' : 'Baixar XLSX'}
        </button>
        <button type="button" className="secondary-button" onClick={() => setRevision(value => value + 1)} disabled={pending}><RefreshCw size={15}/> Atualizar</button>
      </div>
    </div>
    {demoMode && <div className="task-results-notice" role="status"><strong>Dados de demonstração.</strong> Os números são fictícios e não representam a operação real.</div>}
    <div className="task-results-filters">
      <SelectFilter title="Período das conclusões" value={filters.period} onChange={value => setFilters(current => ({ ...current, period: value as Filters['period'] }))} options={[
        { value: 'today', label: 'Hoje' }, { value: '7', label: 'Últimos 7 dias' }, { value: '30', label: 'Últimos 30 dias' },
        { value: '90', label: 'Últimos 90 dias' }, { value: 'all', label: 'Últimos 180 dias' },
      ]}/>
      <SelectFilter title="Prazo vinculado à tarefa" value={filters.deadline} onChange={value => setFilters(current => ({ ...current, deadline: value as Filters['deadline'] }))} options={[
        { value: 'all', label: 'Todos os prazos' }, { value: 'overdue', label: 'Vencido' }, { value: 'today', label: 'Vence hoje' },
        { value: 'future', label: 'A vencer' }, { value: 'none', label: 'Sem prazo' },
      ]}/>
      <SelectFilter title="Responsável pelas análises" value={filters.person} onChange={value => setFilters(current => ({ ...current, person: value }))} options={[
        { value: 'all', label: canViewOthers ? 'Toda a equipe' : 'Minhas análises' },
        ...(canViewOthers ? options.map(person => ({ value: person.id, label: person.name })) : []),
      ]}/>
    </div>
    {error && <div role="alert" className="task-results-notice task-results-error">{error}<button type="button" onClick={() => setRevision(n => n + 1)}>Tentar novamente</button></div>}
    {pending && !shown && <div role="status" className="task-results-notice">Carregando entregas auditadas da carteira…</div>}
    {shown && <>
      {shown.truncated && <div role="alert" className="task-results-notice">A consulta atingiu o limite de registros. Reduza o período: os totais exibidos podem estar incompletos.</div>}
      <div className="task-results-section-heading"><h2>Produção no período</h2><p>Somente conclusões humanas registradas; importações automáticas não entram no total.</p></div>
      <div className="task-results-stats">
        {stat('Análises concluídas', formatInt(total), 'No período e filtros selecionados', CheckCircle2)}
        {stat('Concluídas hoje', formatInt(shown.summary.today_completed), 'Hoje, dentro dos filtros de conclusão', Clock3)}
        {stat('Colaboradores com entregas', formatInt(people.length), 'Pessoas que concluíram ao menos uma análise', Users)}
        {filters.period !== 'all' ? stat('Variação de entregas', shown.summary.growth_percent === null ? '—' :
          (shown.summary.growth_percent > 0 ? '+' : '') + shown.summary.growth_percent.toLocaleString('pt-BR') + '%',
          shown.summary.growth_percent === null ? 'Sem volume no período anterior' :
            formatInt(shown.summary.previous_completed) + ' conclusões na janela anterior', CheckCircle2) : null}
      </div>
      <div className="task-results-section-heading"><h2>Fila atual</h2><p>Fotografia das atribuições abertas agora; não corresponde ao período de conclusão acima.</p></div>
      <div className="task-results-stats task-results-current-stats">
        {stat('Análises pendentes', formatInt(shown.summary.pending), 'Ativas e atribuídas, com o mesmo filtro de prazo e colaborador', Clock3)}
      </div>
      <div className="task-results-grid">
        <article className="task-results-card">
          <header><div><h2>Entregas por tipo de tarefa</h2><p>Distribuição das conclusões no período selecionado.</p></div></header>
          {byType.length ? <div className="task-results-bars">{byType.map(([type, count]) => <div className="task-results-bar-row" key={type}>
            <div><span>{taskTypeLabel(type)}</span><strong>{formatInt(count)}</strong></div>
            <div className="task-results-bar-track"><span style={{ width: (count / maxType * 100) + '%' }}/></div>
          </div>)}</div> : <p className="task-results-empty">Nenhuma análise concluída neste recorte.</p>}
        </article>
        <article className="task-results-card">
          <header><div><h2>Participação da equipe</h2><p>Distribuição das entregas, sem ranquear pessoas por velocidade entre perguntas.</p></div></header>
          {sorted.length ? <div className="task-results-bars">{[...people].sort((a, b) => b.completed - a.completed).slice(0, 10).map(person => <div className="task-results-bar-row" key={person.id}>
            <div><span>{person.name}</span><strong>{formatInt(person.completed)}</strong></div>
            <div className="task-results-bar-track"><span style={{ width: (person.completed / maxPerson * 100) + '%' }}/></div>
          </div>)}</div> : <p className="task-results-empty">Sem entregas para distribuir.</p>}
        </article>
      </div>
      <article className="task-results-card">
        <header className="task-results-table-heading"><div><h2>Entregas por colaborador</h2><p>Quantidade de análises concluídas, sem inferir qualidade ou tempo efetivamente trabalhado.</p></div>
          <div className="task-results-sort"><ArrowDownUp size={14}/><select aria-label="Ordenar colaboradores" value={sortBy} onChange={event => setSortBy(event.target.value as typeof sortBy)}>
            <option value="most">Mais entregas</option><option value="least">Menos entregas</option><option value="name">Nome</option>
          </select></div>
        </header>
        <div className="task-results-table-scroll"><table className="task-results-table">
          <thead><tr><th>Colaborador</th><th>Concluídas no período</th><th>Participação</th><th>Tipos concluídos</th></tr></thead>
          <tbody>{sorted.map(person => <tr key={person.id}>
            <td><strong>{person.name}</strong></td><td>{formatInt(person.completed)}</td>
            <td>{total ? (person.completed / total * 100).toLocaleString('pt-BR', { maximumFractionDigits: 1 }) + '%' : '—'}</td>
            <td>{Object.entries(person.by_type || {}).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).map(([type, n]) => taskTypeLabel(type) + ' (' + formatInt(n) + ')').join(' · ') || '—'}</td>
          </tr>)}
          {!sorted.length && <tr><td colSpan={4}>Nenhuma conclusão humana registrada com os filtros selecionados.</td></tr>}</tbody>
        </table></div>
      </article>
      <p className="task-results-method"><CheckCircle2 size={14}/>Origem: eventos de conclusão da carteira ativa. Conclusões históricas e atribuições abertas são medidas diferentes. Tempos de navegação não representam horas trabalhadas; concordância, retrabalho e acurácia exigem indicadores auditáveis próprios. Atualizado em {new Date(shown.generated_at).toLocaleString('pt-BR')}.</p>
    </>}
  </section>;
}
