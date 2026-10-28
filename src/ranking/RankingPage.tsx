import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AlertCircle, ArrowRight, CheckCircle2, ChevronDown, Clock3, RefreshCw, Target } from 'lucide-react';
import { AGING_BANDS, BASE_CRITERIA, BONUSES, PENALTIES } from './rules';
import './ranking.css';

type Portfolio = 'agibank_mba' | 'agibank_enter';
type Indicator = {
  key: string; label: string; max: number; points: number | null;
  actual: number | null; target: number | string; gap: number | null;
  action: string; reason: string;
};
type Stock = { faixa: string; estoque_referencia: number; meta_indicativa: number; taxa_meta: number;
  encerrados: number | null; faltam: number | null; nota: string };
type Projection = {
  edition: string; portfolio_id: Portfolio;
  snapshot: {source: string; imported_at: string | null; filename?: string | null; stale: boolean;
    eligible_closings: number; benner_history_closings: number; historical_count_is_partial: boolean};
  projection: { final: number | null; partial: number | null; partial_max: number; missing_max: number;
    reasons: string[]; note: string };
  indicators: Indicator[]; stock: Stock[]; confidence: string; updated_at: string;
  signals?: { total_identificados: number; desfechos_comparaveis: number; vitórias: number;
    acordos: number; derrotas: number; derrota_voluntaria_sem_equivalencia: number;
    percentual_vitorias_amostra: number | null; percentual_acordos_amostra: number | null;
    preliminar_pontos_dois_criterios: number | null; preliminar_maximo: number;
    gap_vitorias_pontos_percentuais: number | null; gap_acordos_pontos_percentuais: number | null;
    nota: string };
};
type RankingWindow = Window & typeof globalThis & {
  MBA_API?: { getPortfolioId?: () => string | null; request?: <T>(path: string, options?: RequestInit) => Promise<T> };
  MBA_AUTOMATION_API?: {request: <T>(path: string, options?: RequestInit) => Promise<T>};
};

const currentPortfolio = (): Portfolio | null => {
  const id = (window as RankingWindow).MBA_API?.getPortfolioId?.();
  return id === 'agibank_enter' || id === 'agibank_mba' ? id : null;
};
const pt = (number: number, fraction = 0) => number.toLocaleString('pt-BR', {minimumFractionDigits: fraction,maximumFractionDigits: fraction});
const point = (number: number | null | undefined) => number == null ? '—' : pt(number, 1);
const percentage = (number: number) => pt(number, 1) + '%';
const money = (number: number) => 'R$ ' + pt(number, 2);
const snapshotDate = (s?: string | null) => {
  if (!s) return 'não identificada';
  const d = new Date(s);
  return Number.isNaN(d.valueOf()) ? 'não identificada' : d.toLocaleDateString('pt-BR');
};
const showActual = (indicator: Indicator) => {
  if (indicator.actual == null) return '—';
  return indicator.key === 'custo' ? money(indicator.actual) : percentage(indicator.actual);
};
const showTarget = (indicator: Indicator) => {
  if (typeof indicator.target === 'string') return indicator.target;
  return indicator.key === 'custo' ? '≤ ' + money(indicator.target) : '≥ ' + percentage(indicator.target);
};
const showGap = (indicator: Indicator) => {
  if (indicator.gap == null) return 'Não calculável';
  if (indicator.key === 'custo') return indicator.gap > 0 ? money(indicator.gap) + ' acima do alvo' : 'Meta máxima atingida';
  if (indicator.key === 'vitorias' || indicator.key === 'acordos') {
    return indicator.gap > 0 ? pt(indicator.gap) + ' novos encerramentos favoráveis' : 'Meta máxima atingida';
  }
  return '—';
};

function Metric({ title, value, caption, emphasize = false, onOpen }: { title: string; value: string; caption: string; emphasize?: boolean; onOpen?: () => void }) {
  const content = <><span>{title}</span><strong>{value}</strong></>;
  const className = 'ranking-kpi mba-metric-card' + (emphasize ? ' ranking-kpi-main' : '');
  return onOpen
    ? <button type="button" className={className} title={caption} aria-label={title + ': ' + value + '. Ver detalhamento'} onClick={onOpen}>{content}</button>
    : <article className={className} title={caption} aria-label={title + ': ' + value}>{content}</article>;
}

function Status({ indicator }: {indicator: Indicator}) {
  return indicator.points == null
    ? <span className="ranking-state pending"><Clock3 size={13}/> Dados pendentes</span>
    : indicator.points >= indicator.max
      ? <span className="ranking-state success"><CheckCircle2 size={13}/> Meta máxima</span>
      : <span className="ranking-state warning"><AlertCircle size={13}/> Abaixo da meta</span>;
}

function Indicators({ data }: {data: Projection}) {
  return <section id="ranking-indicators" className="ranking-section" aria-label="Pontuação e gaps por indicador">
    <header><div><h2>Indicadores e gaps</h2></div></header>
    <div className="ranking-table-scroll">
      <table className="ranking-score-table">
        <thead><tr><th>Indicador</th><th>Atual</th><th>Meta</th><th>Gap para a meta</th><th>Pontos</th><th>Situação</th></tr></thead>
        <tbody>{data.indicators.map(indicator =>
          <tr key={indicator.key}>
            <td><strong>{indicator.label}</strong><span className="ranking-action">{indicator.points === null ? indicator.reason : indicator.action}</span></td>
            <td>{showActual(indicator)}</td>
            <td>{showTarget(indicator)}</td>
            <td className="ranking-gap">{showGap(indicator)}</td>
            <td className="ranking-num">{point(indicator.points)} <small>/ {pt(indicator.max, 1)}</small></td>
            <td><Status indicator={indicator}/></td>
          </tr>
        )}</tbody>
      </table>
    </div>
  </section>;
}

function StockSection({ data, portfolio }: {data: Projection; portfolio: Portfolio}) {
  return <section className="ranking-section">
    <header><div><h2>Encerramentos por faixa</h2></div><span className="ranking-pill">2,4 pontos possíveis</span></header>
    <div className="ranking-table-scroll">
      <table className="ranking-score-table">
        <thead><tr><th>Faixa</th><th>Estoque conhecido</th><th>Meta mensal</th><th>Encerrados elegíveis</th><th>Faltam</th></tr></thead>
        <tbody>{data.stock.map(row =>
          <tr key={row.faixa}><td><strong>{row.faixa}</strong></td>
          <td>{pt(row.estoque_referencia)}</td><td>{pt(row.meta_indicativa)} <small>({pt(row.taxa_meta)}%)</small></td>
          <td>—</td><td>Sem conciliação</td></tr>
        )}</tbody>
      </table>
    </div>
    <details className="mba-help-disclosure ranking-footnote"><summary>Critério de pontuação</summary><p>O edital pontua 0,2 por faixa em cada mês de agosto a novembro, sem compensação. Para atribuir os pontos, é preciso conciliar os encerramentos com a fotografia do estoque no último dia de cada mês. {AGING_BANDS[portfolio === 'agibank_enter' ? 'enter' : 'mba'].length} faixas por mês.</p></details>
  </section>;
}

function OperationalSignals({ data }: {data: Projection}) {
  const sample = data.signals;
  if (!sample || !sample.desfechos_comparaveis) return null;
  return <section className="ranking-signals" aria-label="Sinais operacionais parciais">
    <div className="ranking-signals-copy"><strong>Leitura operacional preliminar</strong>
      <p>Na amostra de {pt(sample.desfechos_comparaveis)} encerramentos com desfechos comparáveis, os indicadores são:</p></div>
    <div><strong>{sample.percentual_vitorias_amostra == null ? '—' : percentage(sample.percentual_vitorias_amostra)}</strong><span>{sample.gap_vitorias_pontos_percentuais != null && sample.gap_vitorias_pontos_percentuais > 0 ? pt(sample.gap_vitorias_pontos_percentuais, 1) + ' p.p. abaixo da meta de 76%' : 'Vitórias · meta 76%'}</span></div>
    <div><strong>{sample.percentual_acordos_amostra == null ? '—' : percentage(sample.percentual_acordos_amostra)}</strong><span>{sample.gap_acordos_pontos_percentuais != null && sample.gap_acordos_pontos_percentuais > 0 ? pt(sample.gap_acordos_pontos_percentuais, 1) + ' p.p. abaixo da meta de 14%' : 'Acordos · meta 14%'}</span></div>
    <div><strong>{sample.preliminar_pontos_dois_criterios == null ? '—' : point(sample.preliminar_pontos_dois_criterios)} <small>/ 3,4</small></strong><span>Prévia da amostra · NÃO oficial</span></div>
    <p className="ranking-signals-warning">{pt(sample.derrota_voluntaria_sem_equivalencia)} derrotas voluntárias segregadas. Amostra NÃO homologada: não gera pontuação e não substitui o universo do edital.</p>
  </section>;
}

function ActionPlan({ data }: { data: Projection }) {
  const pending = data.indicators.filter(i => i.points === null);
  const atRisk = data.indicators.filter(i => i.points !== null && i.points < i.max);
  const actions = [...atRisk, ...pending];
  return <section id="ranking-action-plan" className="ranking-section ranking-plan">
    <header><div><h2>Plano de ação</h2></div></header>
    <div className="ranking-plan-rows">
      {actions.map((item, index) =>
        <div key={item.key} className="ranking-plan-item">
          <span className="ranking-plan-position">{String(index + 1).padStart(2,'0')}</span>
          <div><strong>{item.label}</strong>
            <p>{item.points === null ? item.reason + ' ' : ''}{item.action}</p>
          </div><span className="ranking-plan-impact">{item.points === null ? 'Até ' + pt(item.max, 1) + ' pt a confirmar' : pt(item.max - (item.points || 0), 1) + ' pt em disputa'}</span>
        </div>)}
      {actions.length === 0 && <p className="ranking-empty">Todos os critérios apuráveis estão na faixa máxima. Confirmar pontos externos e encerramentos mensais.</p>}
    </div>
  </section>;
}

function Methodology({ portfolio }: {portfolio: Portfolio}) {
  return <details className="ranking-method">
    <summary><span>Consultar réguas e regras oficiais</span><ChevronDown size={15}/></summary>
    <div className="ranking-method-body">
      <p>Régua do Ranking Agibank 2026: duração 2,4 · custo médio 3,2 · vitórias 2,0 · acordos 1,4 · qualitativos 1,0. A nota final pondera julho (20%) e agosto–novembro (80%).</p>
      <p>O custo máximo para receber os 3,2 pontos é {money(portfolio === 'agibank_enter' ? 700 : 1000)}. Para receber 2,0 pontos em vitórias, a taxa deve alcançar 76%; para 1,4 ponto em acordos, 14%.</p>
      <p>Há até +3,0 pontos em bônus e até −3,0 em detratores. Sem a apuração do cliente e dados dos demais escritórios, esses valores permanecem indeterminados.</p>
      <ul>{BONUSES.map(b => <li key={b.label}>Bônus {b.points}: {b.label}</li>)}
        {PENALTIES.map(p => <li key={p.label}>Detrator {p.points}: {p.label}</li>)}</ul>
      <p>{BASE_CRITERIA.length} critérios na nota-base. Não se confundem indícios de encerramento com encerramentos registrados e elegíveis no Benner.</p>
    </div>
  </details>;
}

export function RankingPage() {
  const [portfolio, setPortfolio] = useState<Portfolio | null>(currentPortfolio);
  const [data, setData] = useState<Projection | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const sequence = useRef(0);

  const refresh = useCallback(async () => {
    if (!portfolio) return;
    const serial = ++sequence.current;
    setLoading(true);
    try {
      const api = (window as RankingWindow).MBA_AUTOMATION_API || (window as RankingWindow).MBA_API;
      if (!api?.request) throw new Error('API indisponível.');
      const result = await api.request<Projection>('/api/ranking/projecao?portfolio_id=' + encodeURIComponent(portfolio));
      if (serial !== sequence.current) return;
      if (!result || result.portfolio_id !== portfolio || !Array.isArray(result.indicators) || !result.projection) throw new Error('Resposta inválida da projeção.');
      setData(result); setError('');
    } catch (cause) {
      if (serial === sequence.current) {
        setData(null);
        setError(cause instanceof Error ? cause.message : 'Falha na consulta ao Benner.');
      }
    } finally {
      if (serial === sequence.current) setLoading(false);
    }
  }, [portfolio]);

  useEffect(() => { void refresh(); return () => { sequence.current++; }; }, [refresh]);
  useEffect(() => {
    const sync = () => { sequence.current++; setPortfolio(currentPortfolio()); setData(null); setError(''); };
    for (const name of ['mba:portfolio-changed', 'mba:profile-ready']) window.addEventListener(name, sync);
    return () => { for (const name of ['mba:portfolio-changed', 'mba:profile-ready']) window.removeEventListener(name, sync); };
  }, []);
  const openSection=(id:string)=>document.getElementById(id)?.scrollIntoView({behavior:'smooth',block:'start'});
  const gaps = useMemo(() => data?.indicators.filter(row => row.points != null && row.points < row.max).length || 0, [data]);
  if (!portfolio) return <section className="ranking-screen" role="status">O Ranking é restrito às carteiras Agibank.</section>;
  return <section className="ranking-screen" aria-label="Projeção gerencial do Ranking Agibank">
    <div className="ranking-topline">
      <div><span className="ranking-context">Projeção não homologada · Agibank {portfolio === 'agibank_enter' ? 'Enter' : 'MBA'}</span></div>
      <button className="ranking-refresh" type="button" title="Atualizar Ranking" aria-label="Atualizar Ranking" disabled={loading} onClick={() => void refresh()}><RefreshCw size={14} className={loading ? 'ranking-spin' : ''}/><span className="mba-visually-hidden">Atualizar</span></button>
    </div>
    {error && <div className="ranking-error" role="alert"><AlertCircle size={16}/><span>Não foi possível carregar a projeção: {error}. O backend de testes precisa disponibilizar a API do Ranking.</span><button type="button" onClick={() => void refresh()}>Tentar novamente</button></div>}
    {loading && !data && <p className="ranking-pending" role="status">Conciliando indicadores do Benner…</p>}
    <div className="ranking-kpis">
      <Metric emphasize title="Nota final projetada" value={data?.projection.final == null ? '— / 10' : point(data.projection.final) + ' / 10'} caption={data?.projection.final == null ? 'Não apurável com as fontes disponíveis' : 'Projeção sujeita à homologação do Agibank'} onOpen={data ? ()=>openSection('ranking-indicators') : undefined}/>
      <Metric title="Pontos apuráveis" value={data?.projection.partial == null ? '—' : point(data.projection.partial)} caption={data ? 'Em critérios com dados completos (teto ' + point(data.projection.partial_max) + ')' : 'Aguardando Benner'} onOpen={data ? ()=>openSection('ranking-indicators') : undefined}/>
      <Metric title="Pontos sem evidência" value={data ? point(data.projection.missing_max) : '—'} caption="Da nota-base (10 pontos), ainda sem apuração segura" onOpen={data ? ()=>openSection('ranking-indicators') : undefined}/>
      <Metric title="Gaps confirmados" value={data ? String(gaps) : '—'} caption="Indicadores comprovadamente abaixo da faixa máxima" onOpen={data ? ()=>openSection('ranking-action-plan') : undefined}/>
      <Metric title="Histórico Benner" value={data ? pt(data.snapshot.benner_history_closings) : '—'} caption="Encerramentos identificados · não equivalem ao universo do ranking" onOpen={data ? ()=>openSection('ranking-source-info') : undefined}/>
    </div>
    {data && <>
      <div className="ranking-notice" role="status">
        <AlertCircle size={17}/>
        <div><strong>{data.projection.final == null ? 'Nota não apurável.' : 'Projeção não homologada.'}</strong>
          <details className="mba-help-disclosure"><summary>Motivos</summary><p>{data.projection.reasons.join(' ')} A ausência de registros não foi tratada como pontuação zero.</p></details>
        </div>
      </div>
      <OperationalSignals data={data}/>
      <Indicators data={data}/>
      <div className="ranking-bottom-grid">
        <StockSection data={data} portfolio={portfolio}/>
        <ActionPlan data={data}/>
      </div>
      <div id="ranking-source-info" className="ranking-source-line"><Target size={14}/><span>Fonte: {data.snapshot.source} · importação {snapshotDate(data.snapshot.imported_at)}{data.snapshot.stale ? ' · DESATUALIZADA' : ''} · {pt(data.snapshot.eligible_closings)} encerramentos com data elegível no snapshot · nota de julho e NPS pendentes</span><ArrowRight size={14}/></div>
      <Methodology portfolio={portfolio}/>
    </>}
    {!loading&&!data&&!error && <p className="ranking-pending">Aguardando apuração da carteira selecionada.</p>}
  </section>;
}
