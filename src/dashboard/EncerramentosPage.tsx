import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, CalendarDays, CheckCircle2, Clock3, MapPinned, RefreshCcw, SearchCheck, UsersRound, Wallet } from 'lucide-react';
import { BRAZIL_STATES } from './brazilStates';
import './encerramentos.css';

type Classificacao = 'TODOS' | 'VITORIA' | 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'EXTINCAO' | 'INDETERMINADO';
type Faixa = 'alto' | 'medio' | 'baixo' | 'sem_amostra';
type Indicadores = {
  consultados: number;
  encontrados: number;
  analisados: number;
  ticket_medio: number | null;
  ticket_amostra: number;
  aging_medio: number | null;
};
type Estado = { uf: string; perdas: number; amostra: number; ticket_medio: number | null; faixa: Faixa };
type Analista = { id: string; nome: string; analisados: number };
type Dados = {
  carteira: string;
  tipo: string | null;
  indicadores: Indicadores;
  aging: Array<{ faixa: string; quantidade: number }>;
  estados: Estado[];
  analistas: Analista[];
  classificacoes: Array<{ tipo: string; quantidade: number }>;
};
type BackofficeApi = { request: <T = unknown>(path: string, options?: RequestInit) => Promise<T> };
const TIPOS: Array<{ value: Classificacao; label: string }> = [
  { value: 'TODOS', label: 'Todos os tipos' },
  { value: 'DERROTA_VOLUNTARIA', label: 'Derrota voluntária' },
  { value: 'DERROTA', label: 'Derrota' },
  { value: 'VITORIA', label: 'Vitória' },
  { value: 'EXTINCAO', label: 'Extinção' },
  { value: 'INDETERMINADO', label: 'Indeterminado' },
];
const AGING = ['0–30d', '31–60d', '61–90d', '91–180d', '181+d'];
const n = (value: number | null | undefined) => new Intl.NumberFormat('pt-BR').format(Number(value ?? 0));
const brl = (value: number | null | undefined) =>
  value === null || value === undefined ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(value);
function localDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}
async function getDashboard(carteira: string, tipo: Classificacao, periodo: string): Promise<Dados> {
  const api = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!api) throw new Error('A API do Backoffice não está disponível.');
  const params = new URLSearchParams({ carteira, tipo });
  if (periodo === '30') params.set('inicio', localDate(29));
  if (periodo === '90') params.set('inicio', localDate(89));
  return api.request<Dados>('/api/operacao/encerramentos/dashboard?' + params.toString());
}
function classLabel(tipo: string) { return TIPOS.find(item => item.value === tipo)?.label || tipo || '—'; }
function Metric({ label, value, detail, icon: Icon }: { label: string; value: string; detail: string; icon: typeof SearchCheck }) {
  return <article className="closing-metric">
    <span className="closing-metric-icon"><Icon size={18} strokeWidth={1.8}/></span>
    <span className="closing-metric-label">{label}</span>
    <strong>{value}</strong>
    <small>{detail}</small>
  </article>;
}
function BrazilMap({ estados }: { estados: Estado[] }) {
  const [selectedUf, setSelectedUf] = useState<string | null>(null);
  const byUf = useMemo(() => new Map(estados.map(estado => [estado.uf, estado])), [estados]);
  const chosen = BRAZIL_STATES.find(estado => estado.uf === selectedUf);
  const selected = chosen ? byUf.get(chosen.uf) : null;
  return <article className="closing-panel closing-map-panel">
    <div className="closing-panel-heading">
      <div><h2><MapPinned size={16}/> Mapa de perdas por UF</h2><p>Ticket médio pago nas derrotas com pagamento liquidado identificado.</p></div>
    </div>
    <div className="closing-map-layout">
      <svg className="closing-brazil-map" viewBox="0 0 690 690" role="img" aria-label="Mapa do Brasil por ticket médio de perdas">
        {BRAZIL_STATES.map(state => {
          const dado = byUf.get(state.uf);
          const tone = dado?.faixa || 'sem_amostra';
          return <path
            key={state.uf} d={state.path}
            className={'closing-uf ' + tone + (selectedUf === state.uf ? ' is-selected' : '')}
            role="button" tabIndex={0}
            aria-label={state.name + ': ' + (dado?.ticket_medio == null ? 'sem amostra suficiente' : brl(dado.ticket_medio))}
            onClick={() => setSelectedUf(state.uf)}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); setSelectedUf(state.uf); } }}>
            <title>{state.name}: {dado?.ticket_medio == null ? 'sem ticket disponível' : brl(dado.ticket_medio)} ({n(dado?.amostra)} casos com pagamento)</title>
          </path>;
        })}
      </svg>
      <div className="closing-map-info">
        <div className="closing-map-legend"><span><i className="alto"/>Maior TKM</span><span><i className="medio"/>TKM intermediário</span><span><i className="baixo"/>Menor TKM</span><span><i className="sem_amostra"/>Amostra insuficiente</span></div>
        <div className="closing-map-highlight" aria-live="polite">
          {chosen ? <>
            <span>{chosen.name} · {chosen.uf}</span>
            <strong>{brl(selected?.ticket_medio)}</strong>
            <small>{n(selected?.perdas)} derrotas identificadas · {n(selected?.amostra)} com pagamento</small>
          </> : <>
            <span>Distribuição por estado</span>
            <strong>{n(estados.filter(estado => estado.faixa !== 'sem_amostra').length)} UFs</strong>
            <small>Selecione uma UF no mapa para ver o ticket médio e a amostra.</small>
          </>}
        </div>
        <p className="closing-map-method">Cores por tercis do ticket médio entre estados com pelo menos 3 processos pagos. Estados sem amostra suficiente permanecem cinza. O mapa não representa taxa de derrota.</p>
      </div>
    </div>
  </article>;
}
function AgingPanel({ rows }: { rows: Dados['aging'] }) {
  const counts = new Map(rows.map(item => [item.faixa, Number(item.quantidade)]));
  const max = Math.max(1, ...Array.from(counts.values()));
  return <article className="closing-panel">
    <div className="closing-panel-heading"><div><h2><Clock3 size={16}/> Aging das oportunidades</h2><p>Dias desde a entrada da pasta Benner.</p></div></div>
    <div className="closing-bars">
      {AGING.map(faixa => {
        const value = counts.get(faixa) || 0;
        return <div className="closing-bar-row" key={faixa}><span>{faixa}</span><div className="closing-bar-track"><div style={{ width: (value / max * 100) + '%' }}/></div><strong>{n(value)}</strong></div>;
      })}
    </div>
  </article>;
}
function AnalystsPanel({ analysts }: { analysts: Analista[] }) {
  const max = Math.max(1, ...analysts.map(a => a.analisados));
  return <article className="closing-panel">
    <div className="closing-panel-heading"><div><h2><UsersRound size={16}/> Produtividade dos analistas</h2><p>Processos únicos analisados hoje · horário de Campo Grande.</p></div></div>
    {analysts.length ? <div className="closing-analysts">
      {analysts.map((a, index) => <div className="closing-analyst" key={a.id}>
        <span className="closing-rank">{index + 1}</span>
        <div><strong>{a.nome}</strong><div className="closing-analyst-bar"><span style={{width: (a.analisados / max * 100) + '%'}}/></div></div>
        <b>{n(a.analisados)}</b>
      </div>)}
    </div> : <div className="closing-empty"><UsersRound size={22}/><strong>Sem análises registradas hoje</strong><p>A produtividade aparecerá após as primeiras conclusões da tarefa de Encerramentos.</p></div>}
  </article>;
}
export function EncerramentosPage() {
  const [carteira, setCarteira] = useState('Agibank Regular');
  const [tipo, setTipo] = useState<Classificacao>('TODOS');
  const [periodo, setPeriodo] = useState('all');
  const [data, setData] = useState<Dados | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDashboard(carteira, tipo, periodo);
      setData(result);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível consultar Encerramentos.');
    } finally { setLoading(false); }
  }, [carteira, tipo, periodo]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 60000);
    return () => window.clearInterval(timer);
  }, [refresh]);
  const metrics = data?.indicadores;
  const mainMetric = metrics ? n(metrics.encontrados) : '—';
  return <div className="protocolos-page-react closing-page">
    <header className="protocolos-header closing-header">
      <div><span className="protocolos-eyebrow">OPERAÇÃO · ENCERRAMENTOS</span><h1>Painel de encerramentos</h1></div>
      <button type="button" className="protocolos-button secondary" onClick={() => void refresh()} disabled={loading}><RefreshCcw size={14} className={loading ? 'spin' : ''}/>Atualizar</button>
    </header>
    <section className="closing-filters" aria-label="Filtros de Encerramentos">
      <label>Carteira<select value={carteira} onChange={event => setCarteira(event.target.value)}>
        <option value="Agibank Regular">Agibank &lt;&gt; MBA (Regular)</option>
        <option value="Agibank Enter">Agibank &lt;&gt; Enter</option>
      </select></label>
      <label>Tipo de encerramento<select value={tipo} onChange={event => setTipo(event.target.value as Classificacao)}>
        {TIPOS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select></label>
      <label>Período da automação<select value={periodo} onChange={event => setPeriodo(event.target.value)}>
        <option value="all">Todo o histórico</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option>
      </select></label>
      <small><CalendarDays size={13}/> Classificação mais recente por CNJ</small>
    </section>
    {error ? <div className="protocolos-alert error" role="alert"><AlertTriangle size={17}/>{error}{data ? ' · Exibindo última consulta válida.' : ''}</div> : null}
    <div className="closing-metrics" aria-busy={loading}>
      <Metric icon={SearchCheck} label="Encontrados pela automação" value={mainMetric} detail={metrics ? n(metrics.consultados) + ' processos consultados' : 'Aguardando API'}/>
      <Metric icon={CheckCircle2} label="Processos analisados" value={metrics ? n(metrics.analisados) : '—'} detail="Análises humanas registradas"/>
      <Metric icon={Wallet} label="Ticket médio de perdas" value={brl(metrics?.ticket_medio)} detail={metrics ? n(metrics.ticket_amostra) + ' casos com pagamento liquidado' : 'Sem apuração'}/>
      <Metric icon={Activity} label="Aging médio" value={metrics?.aging_medio == null ? '—' : n(Math.round(metrics.aging_medio)) + ' dias'} detail="Oportunidades aptas com entrada conhecida"/>
    </div>
    <div className="closing-content-grid">
      <BrazilMap estados={data?.estados || []}/>
      <div className="closing-right-column">
        <AgingPanel rows={data?.aging || []}/>
        <AnalystsPanel analysts={data?.analistas || []}/>
      </div>
    </div>
    <div className="closing-footer-row">
      <div><strong>Composição das oportunidades</strong><span>{(data?.classificacoes || []).length ? data!.classificacoes.map(c => classLabel(c.tipo) + ': ' + n(c.quantidade)).join(' · ') : 'Nenhuma oportunidade com os filtros selecionados.'}</span></div>
      <small>TKM = média de pagamentos liquidados por processo de derrota. Não inclui provisões, pagamentos pendentes nem classificações sem correspondência.</small>
    </div>
  </div>;
}
