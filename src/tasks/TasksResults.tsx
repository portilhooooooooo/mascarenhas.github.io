import { useCallback, useEffect, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';

type Scope = 'mine' | 'all';
type Metrics = {
  scope: Scope;
  analyzed_today: number;
  analyzed_yesterday: number;
  pending: number;
  growth_percentage: number | null;
  as_of: string;
  metric_basis: string;
};
type Api = (path: string, options?: RequestInit) => Promise<any>;

const formatter = new Intl.NumberFormat('pt-BR');
const pct = (value: number | null) => value === null ? '—' : (value > 0 ? '+' : '') + value.toLocaleString('pt-BR', {maximumFractionDigits: 1}) + '%';

export function TasksResults({ api, canViewAll }: {api: Api; canViewAll: boolean}) {
  const [scope, setScope] = useState<Scope>(canViewAll ? 'all' : 'mine');
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  useEffect(() => { setScope(canViewAll ? 'all' : 'mine'); }, [canViewAll]);
  const refresh = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const result = await api('/api/tasks/results?scope=' + (canViewAll ? scope : 'mine'));
      setMetrics(result as Metrics);
    } catch (cause: any) {
      setError(cause?.message || 'Não foi possível carregar os resultados.');
    } finally { setLoading(false); }
  }, [api, canViewAll, scope]);
  useEffect(() => {
    void refresh();
    const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 60000);
    return () => window.clearInterval(timer);
  }, [refresh]);

  const exportXlsx = () => {
    if (!metrics) return;
    const xlsx = (window as Window & {
      XLSX?: {
        utils: {
          book_new: () => unknown;
          aoa_to_sheet: (data: unknown[][]) => unknown;
          book_append_sheet: (book: unknown, sheet: unknown, title: string) => void;
        };
        writeFile: (book: unknown, name: string) => void;
      };
    }).XLSX;
    if (!xlsx) { setError('A biblioteca XLSX não foi carregada. Atualize a página e tente novamente.'); return; }
    const table = [
      ['Indicador', 'Valor'],
      ['Escopo', metrics.scope === 'all' ? 'Todos os analistas da carteira' : 'Meu desempenho'],
      ['Analisados hoje', metrics.analyzed_today],
      ['Analisados ontem', metrics.analyzed_yesterday],
      ['Pendentes', metrics.pending],
      ['Crescimento (%)', metrics.growth_percentage ?? 'Sem base anterior'],
      ['Atualizado em', new Date(metrics.as_of).toLocaleString('pt-BR')],
      ['Critério de apuração', metrics.metric_basis],
    ];
    const book = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(book, xlsx.utils.aoa_to_sheet(table), 'Resultados');
    xlsx.writeFile(book, 'resultados_tarefas_' + new Date().toISOString().slice(0,10) + '.xlsx');
  };

  return <section className="tasks-results" aria-label="Indicadores de produtividade">
    <header className="tasks-results-head">
      <div><h1>Resultados</h1><p>Produtividade de tarefas na carteira selecionada.</p></div>
      <div className="tasks-results-actions">
        {canViewAll ? <label>Visualização <select aria-label="Escopo dos indicadores" value={scope} onChange={event => setScope(event.target.value as Scope)}><option value="all">Todos</option><option value="mine">Meus indicadores</option></select></label> : <span>Meus indicadores</span>}
        <button type="button" className="secondary-button" disabled={loading} onClick={() => void refresh()}><RefreshCw size={14}/>Atualizar</button>
        <button type="button" className="secondary-button" disabled={!metrics || loading} onClick={exportXlsx}><Download size={14}/>Baixar XLSX</button>
      </div>
    </header>
    {error ? <p className="task-renderer-error" role="alert">{error}</p> : null}
    <div className="tasks-results-grid">
      <article><small>Analisados hoje</small><strong>{loading && !metrics ? '—' : formatter.format(metrics?.analyzed_today || 0)}</strong><span>Processos concluídos no dia</span></article>
      <article><small>Pendentes</small><strong>{loading && !metrics ? '—' : formatter.format(metrics?.pending || 0)}</strong><span>Processos não concluídos</span></article>
      <article><small>Crescimento</small><strong className={metrics?.growth_percentage != null && metrics.growth_percentage < 0 ? 'negative' : 'positive'}>{metrics ? pct(metrics.growth_percentage) : '—'}</strong><span>{metrics?.growth_percentage === null ? 'Sem base para comparação ontem' : 'Em relação ao dia anterior'}</span></article>
    </div>
    <p className="tasks-results-note">{metrics?.metric_basis || 'Os indicadores consideram a carteira ativa e o escopo autorizado do usuário.'}</p>
  </section>;
}
