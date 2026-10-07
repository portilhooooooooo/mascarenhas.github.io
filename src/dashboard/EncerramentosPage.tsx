import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, AlertTriangle, CalendarDays, CheckCircle2, Clock3, MapPinned, RefreshCcw, SearchCheck, UsersRound, Wallet } from 'lucide-react';
import { BRAZIL_STATES } from './brazilStates';
import './encerramentos.css';

type Classificacao = 'TODOS' | 'VITORIA' | 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'EXTINCAO';
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
];
const AGING = [
  { faixa: '0 a 3 meses', tag: '0 A 3 MESES', tone: 'low' },
  { faixa: '3 a 10 meses', tag: '3 A 10 MESES', tone: 'medium' },
  { faixa: 'Mais de 10 meses', tag: 'MAIS DE 10 MESES', tone: 'high' },
  { faixa: 'Sem tag / não reconhecida', tag: 'SEM TAG / NÃO RECONHECIDA', tone: 'untagged' },
] as const;

// Dados de exemplo apenas para homologação visual; jamais são gravados no backend.
const DEMO_AGING: Dados['aging'] = [
  { faixa: '0 a 3 meses', quantidade: 128 },
  { faixa: '3 a 10 meses', quantidade: 342 },
  { faixa: 'Mais de 10 meses', quantidade: 517 },
  { faixa: 'Sem tag / não reconhecida', quantidade: 41 },
];
const DEMO_ANALYSTS: Analista[] = [
  { id: 'demo-gabriel', nome: 'Gabriel', analisados: 43 },
  { id: 'demo-elias', nome: 'Elias', analisados: 31 },
  { id: 'demo-gessica', nome: 'Géssica', analisados: 26 },
];
const ANALYST_OPTIONS = [
  { value: 'todos', label: 'Todos os analistas' },
  { value: 'gabriel', label: 'Gabriel' },
  { value: 'elias', label: 'Elias' },
  { value: 'gessica', label: 'Géssica' },
];

/**
 * Base de demonstração isolada do resultado da API.
 * Valores determinísticos e sintéticos: não representam produtividade nem
 * perdas de clientes e nunca são enviados ou gravados no banco.
 */
function createDemoData(carteira: string, tipo: Classificacao, periodo: string): Dados {
  const isEnter = carteira === 'Agibank Enter';
  const seed = isEnter
    ? [{ tipo: 'VITORIA', quantidade: 198 }, { tipo: 'DERROTA', quantidade: 255 },
       { tipo: 'DERROTA_VOLUNTARIA', quantidade: 140 }, { tipo: 'EXTINCAO', quantidade: 27 }]
    : [{ tipo: 'VITORIA', quantidade: 330 }, { tipo: 'DERROTA', quantidade: 476 },
       { tipo: 'DERROTA_VOLUNTARIA', quantidade: 190 }, { tipo: 'EXTINCAO', quantidade: 32 }];
  const factor = periodo === '30' ? 0.22 : periodo === '90' ? 0.56 : 1;
  const all = seed.map(row => ({ ...row, quantidade: Math.max(1, Math.round(row.quantidade * factor)) }));
  const classifications = tipo === 'TODOS' ? all : all.filter(row => row.tipo === tipo);
  const found = classifications.reduce((total, row) => total + row.quantidade, 0);
  const losses = classifications.filter(row => row.tipo === 'DERROTA' || row.tipo === 'DERROTA_VOLUNTARIA')
    .reduce((total, row) => total + row.quantidade, 0);

  const weights = BRAZIL_STATES.map((_, index) => 7 + (index * 11) % 23);
  const totalWeight = weights.reduce((total, weight) => total + weight, 0);
  let distributed = 0;
  const states: Estado[] = BRAZIL_STATES.map((state, index) => {
    const perdas = index === BRAZIL_STATES.length - 1
      ? losses - distributed
      : Math.floor(losses * weights[index] / totalWeight);
    distributed += perdas;
    const amostra = Math.min(perdas, Math.floor(perdas * (0.43 + (index % 4) * 0.08)));
    const ticket = amostra >= 3 ? 5400 + (index * 1327) % 9800 : null;
    return {
      uf: state.uf, perdas, amostra, ticket_medio: ticket,
      faixa: ticket === null ? 'sem_amostra' : ticket < 8500 ? 'baixo' : ticket < 11800 ? 'medio' : 'alto',
    };
  });
  const sample = states.reduce((total, state) => total + (state.ticket_medio === null ? 0 : state.amostra), 0);
  const ticketTotal = states.reduce((total, state) =>
    total + (state.ticket_medio === null ? 0 : state.ticket_medio * state.amostra), 0);
  const aging = DEMO_AGING.map(row => ({
    ...row, quantidade: Math.floor(row.quantidade * found / 1028),
  }));
  aging[aging.length - 1].quantidade += found - aging.reduce((total, row) => total + row.quantidade, 0);

  const dayFraction = Math.min(1, found / 180);
  const analysts = DEMO_ANALYSTS.map(row => ({
    ...row, analisados: Math.max(0, Math.round(row.analisados * dayFraction)),
  }));
  return {
    carteira, tipo: tipo === 'TODOS' ? null : tipo,
    indicadores: {
      consultados: Math.round(found * 1.43), encontrados: found,
      analisados: analysts.reduce((total, row) => total + row.analisados, 0),
      ticket_medio: sample ? Math.round((ticketTotal / sample) * 100) / 100 : null,
      ticket_amostra: sample, aging_medio: 276,
    },
    aging, estados: states, analistas: analysts, classificacoes: classifications,
  };
}

const n = (value: number | null | undefined) => new Intl.NumberFormat('pt-BR').format(Number(value ?? 0));
const brl = (value: number | null | undefined) =>
  value === null || value === undefined ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(value);
function localDate(daysAgo: number) {
  const date = new Date();
  date.setDate(date.getDate() - daysAgo);
  return [date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0')].join('-');
}
async function getDashboard(carteira: string, tipo: Classificacao, periodo: string, analista: string): Promise<Dados> {
  const api = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!api) throw new Error('A API do Backoffice não está disponível.');
  const params = new URLSearchParams({ carteira, tipo });
  if (analista !== 'todos') params.set('analista', analista);
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
function BrazilMap({ estados, demo }: { estados: Estado[]; demo: boolean }) {
  const [selectedUf, setSelectedUf] = useState<string | null>(null);
  const byUf = useMemo(() => new Map(estados.map(estado => [estado.uf, estado])), [estados]);
  const chosen = BRAZIL_STATES.find(estado => estado.uf === selectedUf);
  const selected = chosen ? byUf.get(chosen.uf) : null;
  return <article className="closing-panel closing-map-panel">
    <div className="closing-panel-heading">
      <div><h2><MapPinned size={16}/> Mapa de perdas por UF {demo ? <span className="closing-demo-inline">Exemplo</span> : null}</h2><p>Ticket médio pago nas derrotas com pagamento liquidado identificado.</p></div>
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
function AgingPanel({ rows, demo }: { rows: Dados['aging']; demo: boolean }) {
  const counts = new Map(rows.map(item => [item.faixa, Number(item.quantidade)]));
  const max = Math.max(1, ...Array.from(counts.values()));
  return <article className="closing-panel">
    <div className="closing-panel-heading">
      <div><h2><Clock3 size={16}/> Aging das oportunidades {demo ? <span className="closing-demo-inline">Exemplo</span> : null}</h2>
        <p>Faixas de idade pela entrada da pasta no Benner.</p>
      </div>
    </div>
    <div className="closing-bars closing-aging-bars">
      {AGING.map(({ faixa, tag, tone }) => {
        const value = counts.get(faixa) || 0;
        return <div className="closing-bar-row" key={faixa}>
          <span className={'closing-aging-tag ' + tone}>{tag}</span>
          <div className="closing-bar-track"><div className={'closing-aging-fill ' + tone} style={{ width: (value / max * 100) + '%' }}/></div>
          <strong>{n(value)}</strong>
        </div>;
      })}
    </div>
  </article>;
}
function AnalystsPanel({ analysts, demo, selected }: { analysts: Analista[]; demo: boolean; selected: string }) {
  const max = Math.max(1, ...analysts.map(a => a.analisados));
  return <article className="closing-panel">
    <div className="closing-panel-heading"><div><h2><UsersRound size={16}/> Produtividade dos analistas {demo ? <span className="closing-demo-inline">Exemplo</span> : null}</h2><p>Processos únicos analisados hoje · horário de Campo Grande.</p></div></div>
    {analysts.length ? <div className="closing-analysts">
      {analysts.map((a, index) => <div className="closing-analyst" key={a.id}>
        <span className="closing-rank">{index + 1}</span>
        <div><strong>{a.nome}</strong><div className="closing-analyst-bar"><span style={{width: (a.analisados / max * 100) + '%'}}/></div></div>
        <b>{n(a.analisados)}</b>
      </div>)}
    </div> : <div className="closing-empty"><UsersRound size={22}/><strong>Sem análises registradas hoje</strong>
      <p>{selected !== 'todos' ? 'O analista selecionado ainda não tem análises reais registradas hoje.' : 'A produtividade aparecerá após as primeiras conclusões da tarefa de Encerramentos.'}</p>
    </div>}
  </article>;
}
export function EncerramentosPage() {
  const [carteira, setCarteira] = useState('Agibank Regular');
  const [tipo, setTipo] = useState<Classificacao>('TODOS');
  const [periodo, setPeriodo] = useState('all');
  const [analista, setAnalista] = useState('todos');
  const [demonstracao, setDemonstracao] = useState(true);
  const [data, setData] = useState<Dados | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getDashboard(carteira, tipo, periodo, analista);
      setData(result);
      setError('');
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível consultar Encerramentos.');
    } finally { setLoading(false); }
  }, [carteira, tipo, periodo, analista]);
  useEffect(() => { void refresh(); }, [refresh]);
  useEffect(() => {
    const timer = window.setInterval(() => { if (!document.hidden) void refresh(); }, 60000);
    return () => window.clearInterval(timer);
  }, [refresh]);
  const demoData = useMemo(() => createDemoData(carteira, tipo, periodo), [carteira, tipo, periodo]);
  const displayedData = demonstracao ? demoData : data;
  const metrics = displayedData?.indicadores;
  const mainMetric = metrics ? n(metrics.encontrados) : '—';
  const analysts = demonstracao
    ? demoData.analistas.filter(item => analista === 'todos' || item.id === 'demo-' + analista)
    : (data?.analistas || []);
  const analysedCount = demonstracao
    ? analysts.reduce((total, item) => total + item.analisados, 0)
    : metrics?.analisados;
  const analyzedDetail = demonstracao
    ? 'Volume fictício para pré-visualização'
    : analista !== 'todos'
      ? 'Conclusões do analista selecionado hoje'
      : 'Análises humanas registradas';
  return <div className="protocolos-page-react closing-page">
    <header className="protocolos-header closing-header">
      <div><span className="protocolos-eyebrow">GESTÃO PROCESSUAL · ENCERRAMENTOS</span><h1>Painel de encerramentos</h1></div>
      <div className="closing-header-actions">
        <label className="closing-preview-toggle">
          <input type="checkbox" checked={demonstracao} onChange={event => setDemonstracao(event.target.checked)}/>
          <span>Exibir demonstração</span>
        </label>
        <button type="button" className="protocolos-button secondary" onClick={() => void refresh()} disabled={loading}>
          <RefreshCcw size={14} className={loading ? 'spin' : ''}/>Atualizar
        </button>
      </div>
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
      <label>Analista<select value={analista} onChange={event => setAnalista(event.target.value)}>
        {ANALYST_OPTIONS.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select></label>
      <small><CalendarDays size={13}/> O filtro por analista se aplica à produtividade humana, não aos indícios automáticos.</small>
    </section>
    {demonstracao ? <div className="closing-demo-notice" role="status">
      <strong>Demonstração — dados 100% fictícios.</strong> Todos os indicadores, o mapa, o ticket médio, o aging e a produtividade são exemplos para avaliação visual. Desative esta opção para consultar os resultados reais.
    </div> : null}
    {!demonstracao && error ? <div className="protocolos-alert error" role="alert"><AlertTriangle size={17}/>{error}{data ? ' · Exibindo última consulta válida.' : ''}</div> : null}
    <div className="closing-metrics" aria-busy={!demonstracao && loading}>
      <Metric icon={SearchCheck} label="Encontrados pela automação" value={mainMetric} detail={metrics ? n(metrics.consultados) + ' processos consultados' : 'Aguardando API'}/>
      <Metric icon={CheckCircle2} label="Processos analisados" value={analysedCount === undefined ? '—' : n(analysedCount)} detail={analyzedDetail}/>
      <Metric icon={Wallet} label="Ticket médio de perdas" value={brl(metrics?.ticket_medio)} detail={metrics ? n(metrics.ticket_amostra) + (demonstracao ? ' casos fictícios com pagamento' : ' casos com pagamento liquidado') : 'Sem apuração'}/>
      <Metric icon={Activity} label="Aging médio" value={demonstracao ? '276 dias' : metrics?.aging_medio == null ? '—' : n(Math.round(metrics.aging_medio)) + ' dias'} detail={demonstracao ? 'Média fictícia da demonstração' : 'Oportunidades aptas com entrada conhecida'}/>
    </div>
    <div className="closing-content-grid">
      <BrazilMap estados={displayedData?.estados || []} demo={demonstracao}/>
      <div className="closing-right-column">
        <AgingPanel rows={displayedData?.aging || []} demo={demonstracao}/>
        <AnalystsPanel analysts={analysts} demo={demonstracao} selected={analista}/>
      </div>
    </div>
    <div className="closing-footer-row">
      <div><strong>Composição das oportunidades</strong><span>{(displayedData?.classificacoes || []).length ? displayedData!.classificacoes.map(c => classLabel(c.tipo) + ': ' + n(c.quantidade)).join(' · ') : 'Nenhuma oportunidade com os filtros selecionados.'}</span></div>
      <small>TKM = média de pagamentos liquidados por processo de derrota. Não inclui provisões nem pagamentos pendentes. Acordos e indeterminados estão fora das oportunidades aptas.</small>
    </div>
  </div>;
}
