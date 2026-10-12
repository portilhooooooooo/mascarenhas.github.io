import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, ArrowUpRight, CheckCircle2, Clock3, FileCheck2, FolderOpen, Layers3, RefreshCw, Scale, SearchCheck, ShieldAlert, TrendingUp } from 'lucide-react';
import './visaoGeral.css';

type Summary = {
  total: number; active: number; closed: number; unknown: number;
  aging_mean: number | null; eligible: number; critical: number; divergent: number; archive: number;
};
type Datum = { label: string; value: number };
type Month = { date: string; entries: number; closures: number };
type Dashboard = {
  summary: Summary;
  movement: { entries: number; closures: number; balance: number };
  charts: { timeline: Month[]; por_uf: Datum[]; por_produto: Datum[]; aging: Datum[] };
  filters: { states: string[]; products: string[]; resolutions: string[] };
  updated_at: string | null;
};
type Api = { request: <T = unknown>(path: string, options?: RequestInit) => Promise<T>; getPortfolioId?: () => string };
type Environment = Window & { MBA_AUTOMATION_API?: Api; MBA_API?: Api; MBA_NAVIGATE?: (route: string) => boolean };
type Period = 'all' | 'month' | '90' | '365';

const integer = (value: number | null | undefined) => new Intl.NumberFormat('pt-BR').format(Number(value || 0));
const safeNumber = (n: unknown) => typeof n === 'number' && Number.isFinite(n) ? n : 0;
const shortDate = (value: string) => new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(new Date(value.slice(0,10) + 'T12:00:00Z'));
const fullDate = (value: string) => new Intl.DateTimeFormat('pt-BR', { day:'2-digit', month:'short', year:'numeric' }).format(new Date(value));
const isoDaysBack = (days: number) => {
  const d = new Date(); d.setDate(d.getDate() - days);
  return [d.getFullYear(), String(d.getMonth()+1).padStart(2,'0'), String(d.getDate()).padStart(2,'0')].join('-');
};
const portfolioLabel = (id: string) => ({
  agibank_enter: 'Agibank · Enter',
  agibank_mba: 'Agibank · MBA',
  energisa_enter: 'Energisa · Enter',
  banco_pan_mba: 'Banco Pan · MBA',
  nubank_mba: 'Nubank · MBA',
  nubank: 'Nubank',
}[id] || id.replaceAll('_',' '));

function Filter({ title, value, onChange, choices }: { title: string; value: string; onChange: (value: string) => void; choices: Array<{value: string; text: string}> }) {
  return <label className="overview-filter"><span>{title}</span>
    <select value={value} onChange={event => onChange(event.target.value)}>
      {choices.map(option => <option key={option.value} value={option.value}>{option.text}</option>)}
    </select>
  </label>;
}
function Metric({ label, value, sub, icon: Icon }: {label: string; value: string; sub: string; icon: typeof Layers3}) {
  return <article className="overview-metric">
    <div className="overview-metric-top"><span>{label}</span><Icon size={15} strokeWidth={1.6} aria-hidden="true"/></div>
    <strong>{value}</strong><span className="overview-metric-sub">{sub}</span>
  </article>;
}

function Timeline({ rows }: {rows: Month[]}) {
  const recent = rows.slice(-18);
  if (!recent.length) return <p className="overview-empty">Sem movimentações para o período selecionado.</p>;
  const max = Math.max(1, ...recent.map(row => Math.max(safeNumber(row.entries),safeNumber(row.closures))));
  const width = Math.max(700, recent.length * 46), height = 222;
  const col = width / recent.length, drawHeight = 160, baseline = 177;
  return <div className="overview-timeline-scroll"><svg className="overview-timeline" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Evolução mensal das entradas e encerramentos">
    {[0,1,2,3].map(i => <line key={i} x1="0" x2={width} y1={baseline-i*drawHeight/3} y2={baseline-i*drawHeight/3} className="overview-gridline"/>)}
    {recent.map((r,i) => {
      const x = i*col + col/2;
      const entryHeight = safeNumber(r.entries)/max*drawHeight, closeHeight = safeNumber(r.closures)/max*drawHeight;
      return <g key={r.date}>
        <title>{shortDate(r.date)}: {integer(r.entries)} entradas, {integer(r.closures)} encerramentos</title>
        <rect className="overview-bar-entry" x={x-13} y={baseline-entryHeight} width="11" height={entryHeight} rx="2"/>
        <rect className="overview-bar-close" x={x+2} y={baseline-closeHeight} width="11" height={closeHeight} rx="2"/>
        {(recent.length<=9 || i%2===0 || i===recent.length-1) && <text x={x} y={204} textAnchor="middle" className="overview-timeline-label">{shortDate(r.date)}</text>}
      </g>;
    })}
  </svg></div>;
}

function Breakdown({ title, subtitle, rows, maxRows=8 }: {title: string; subtitle: string; rows: Datum[]; maxRows?: number}) {
  const [showAll,setShowAll] = useState(false);
  const clean = rows.filter(item => Number.isFinite(Number(item.value)) && Number(item.value) > 0);
  const displayed = showAll ? clean : clean.slice(0,maxRows);
  const largest = Math.max(1,...clean.map(item=>item.value));
  return <section className="overview-panel overview-breakdown">
    <header><div><h2>{title}</h2><p>{subtitle}</p></div></header>
    {!clean.length ? <p className="overview-empty">Sem registros para os filtros selecionados.</p> : <>
      <div className="overview-bar-list">{displayed.map(({label,value}) => <div className="overview-bar-row" key={label}>
        <div className="overview-row-head"><span title={label}>{label}</span><strong>{integer(value)}</strong></div>
        <div className="overview-bar-track"><span style={{width: `${Math.max(1,value/largest*100)}%`}}/></div>
      </div>)}</div>
      {clean.length>maxRows && <button type="button" className="overview-more" onClick={() => setShowAll(old => !old)}>{showAll?'Mostrar menos':`Mostrar todas (${clean.length})`}</button>}
    </>}
  </section>;
}

const choices = (rows: string[]) => [{value:'', text:'Todos'},...rows.map(value=>({value,text:value}))];
function isDashboard(value: unknown): value is Dashboard {
  if (!value || typeof value !== 'object') return false;
  const data = value as Partial<Dashboard>;
  return Boolean(data.summary && data.charts && data.movement && data.filters &&
    Array.isArray(data.charts.timeline) && Array.isArray(data.charts.por_uf) &&
    Array.isArray(data.charts.por_produto) && Array.isArray(data.charts.aging));
}

export function VisaoGeralPage() {
  const [portfolio,setPortfolio] = useState(() => (window as Environment).MBA_API?.getPortfolioId?.() || '');
  const [revision,setRevision] = useState(0);
  const [period,setPeriod] = useState<Period>('all');
  const [uf,setUf] = useState('');
  const [product,setProduct] = useState('');
  const [situation,setSituation] = useState('');
  const [attention,setAttention] = useState('');
  const [resolution,setResolution] = useState('');
  const [data,setData] = useState<Dashboard|null>(null);
  const [dataKey,setDataKey] = useState('');
  const [error,setError] = useState('');
  const [pending,setPending] = useState(false);
  const sequence = useRef(0);

  const filterKey = [portfolio,revision,period,uf,product,situation,attention,resolution].join('|');
  const query = useMemo(() => {
    const params = new URLSearchParams();
    if (period === 'month') params.set('entry_start',isoDaysBack(new Date().getDate()-1));
    else if (period==='90') params.set('entry_start',isoDaysBack(89));
    else if (period==='365') params.set('entry_start',isoDaysBack(364));
    if (uf) params.set('state',uf);
    if (product) params.set('product',product);
    if (situation) params.set('situation',situation);
    if (attention) params.set('attention',attention);
    if (resolution) params.set('resolution',resolution);
    return params.toString();
  },[period,uf,product,situation,attention,resolution]);

  const refresh = useCallback(async () => {
    const serial = ++sequence.current;
    const api = (window as Environment).MBA_AUTOMATION_API || (window as Environment).MBA_API;
    setPending(true);
    try {
      if (!api) throw new Error('Conexão com a API indisponível.');
      const answer = await api.request<unknown>('/api/carteira-processual' + (query ? '?'+query : ''));
      if (serial !== sequence.current) return;
      if (!isDashboard(answer)) throw new Error('A API retornou uma estrutura de indicadores inválida.');
      setData(answer);
      setDataKey(filterKey);
      setError('');
    } catch(cause) {
      if (serial === sequence.current) setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a carteira.');
    } finally {
      if(serial === sequence.current) setPending(false);
    }
  },[filterKey,query]);

  useEffect(()=>{void refresh();},[refresh]);
  useEffect(()=>{
    const onChange = () => {
      sequence.current += 1;
      setPortfolio((window as Environment).MBA_API?.getPortfolioId?.() || '');
      setRevision(n => n+1);
      setUf('');setProduct('');setSituation('');setAttention('');setResolution('');
      setData(null);setDataKey('');setError('');
    };
    window.addEventListener('mba:portfolio-changed',onChange);
    return ()=>{window.removeEventListener('mba:portfolio-changed',onChange);sequence.current += 1;};
  },[]);
  useEffect(()=>{
    const visible = () => {if (!document.hidden) void refresh();};
    const timer=window.setInterval(()=>{if(!document.hidden) void refresh();},300000);
    document.addEventListener('visibilitychange',visible);
    return ()=>{window.clearInterval(timer);document.removeEventListener('visibilitychange',visible);};
  },[refresh]);

  const shown = dataKey===filterKey ? data : null;
  const summary = shown?.summary;
  const source = shown?.updated_at ? new Date(shown.updated_at) : null;
  const outdated = source ? Date.now()-source.getTime()>30*86400000 : false;
  const hasData = Boolean(summary?.total);
  const allFilters = data?.filters;
  const entries = shown?.movement?.entries ?? 0;
  const closures = shown?.movement?.closures ?? 0;
  const periodLabel = period==='all'?'Todo o histórico':period==='month'?'Entradas do mês':period==='90'?'Entradas dos últimos 90 dias':'Entradas dos últimos 12 meses';

  return <section className="overview-page" aria-label="Visão geral da carteira processual">
    <div className="overview-heading">
      <div><h1>Visão geral</h1><p>Indicadores e evolução da carteira processual</p></div>
      <div className="overview-heading-actions">
        <span className="overview-portfolio">{portfolioLabel(portfolio)}</span>
        <button type="button" className="overview-refresh" onClick={()=>void refresh()} disabled={pending}><RefreshCw size={15} className={pending?'overview-spin':''}/> Atualizar</button>
      </div>
    </div>
    <div className="overview-filters">
      <Filter title="Período da entrada" value={period} onChange={value=>setPeriod(value as Period)} choices={[{value:'all',text:'Todo o histórico'},{value:'month',text:'Mês atual'},{value:'90',text:'Últimos 90 dias'},{value:'365',text:'Últimos 12 meses'}]}/>
      <Filter title="Situação" value={situation} onChange={setSituation} choices={[{value:'',text:'Todas'},{value:'active',text:'Em andamento'},{value:'closed',text:'Encerrados'},{value:'unknown',text:'Não informada'}]}/>
      <Filter title="UF" value={uf} onChange={setUf} choices={choices(allFilters?.states || [])}/>
      <Filter title="Produto" value={product} onChange={setProduct} choices={choices(allFilters?.products || [])}/>
      <Filter title="Atenção" value={attention} onChange={setAttention} choices={[{value:'',text:'Todos'},{value:'aging',text:'Aging crítico (+180 dias)'},{value:'divergent',text:'Divergência CPJ × Benner'},{value:'archive',text:'Aptos a arquivamento'}]}/>
      <Filter title="Encerramento" value={resolution} onChange={setResolution} choices={choices(allFilters?.resolutions || [])}/>
    </div>
    {source && <div className={'overview-source'+(outdated?' stale':'')} role="status">
      <Clock3 size={14}/><span>Fonte: processos_carteira · Atualizada em {fullDate(source.toISOString())}{outdated?' · Base desatualizada, não representa a carteira em tempo real':''}</span>
      <span className="overview-context">{periodLabel}</span>
    </div>}
    {error && <div className="overview-error" role="alert">{shown?'Falha ao atualizar. Mantidos os últimos dados carregados. ':''}{error}<button type="button" onClick={()=>void refresh()}>Tentar novamente</button></div>}
    {pending&&!shown && <p className="overview-loading" role="status">Carregando os indicadores da carteira...</p>}
    {!pending&&!shown&&!error && <p className="overview-empty">Aguardando indicadores da carteira.</p>}
    {shown && !hasData && <div className="overview-notice" role="status">Nenhum processo encontrado nesta carteira e combinação de filtros. A Visão geral não utiliza dados de outras carteiras para completar os resultados.</div>}
    <div className="overview-kpis">
      <Metric label="Processos" value={summary?integer(summary.total):'—'} sub="Total no recorte" icon={Layers3}/>
      <Metric label="Ativos" value={summary?integer(summary.active):'—'} sub="Em andamento no Benner" icon={FolderOpen}/>
      <Metric label="Encerrados" value={summary?integer(summary.closed):'—'} sub="Situação Benner encerrado" icon={CheckCircle2}/>
      <Metric label="Aging médio" value={summary?.aging_mean!=null?summary.aging_mean.toFixed(1).replace('.',',')+' dias':'—'} sub="Apenas processos ativos" icon={Clock3}/>
      <Metric label="Aptos ao encerramento" value={summary?integer(summary.eligible):'—'} sub="Com resolução preenchida" icon={FileCheck2}/>
      <Metric label="Divergências" value={summary?integer(summary.divergent):'—'} sub="Situações CPJ × Benner" icon={Scale}/>
      <Metric label="Aptos a arquivamento" value={summary?integer(summary.archive):'—'} sub="Encerrado no Benner, ativo no CPJ" icon={SearchCheck}/>
      <Metric label="Aging crítico" value={summary?integer(summary.critical):'—'} sub="Ativos há mais de 180 dias" icon={ShieldAlert}/>
    </div>
    <div className="overview-main">
      <section className="overview-panel overview-evolution">
        <header><div><h2>Entradas e encerramentos</h2><p>Evolução por mês de movimentação</p></div>
          <div className="overview-legend"><span><i className="entry"/> Entradas</span><span><i className="close"/> Encerramentos</span></div>
        </header>
        <div className="overview-movement">
          <div><span>Entradas</span><strong>{integer(entries)}</strong></div>
          <div><span>Encerramentos</span><strong>{integer(closures)}</strong></div>
          <div><span>Saldo</span><strong>{integer(entries-closures)}</strong></div>
        </div>
        <Timeline rows={shown?.charts.timeline || []}/>
      </section>
      <section className="overview-panel overview-situation">
        <header><div><h2>Situação da carteira</h2><p>Distribuição por situação no Benner</p></div></header>
        <div className="overview-situation-total">{integer(summary?.total)}<span>processos</span></div>
        <div className="overview-situation-track" role="img" aria-label={`${integer(summary?.active)} ativos, ${integer(summary?.closed)} encerrados`}>
          <span style={{width:`${summary?.total ? summary.active/summary.total*100 : 0}%`}}/>
          <span style={{width:`${summary?.total ? summary.closed/summary.total*100 : 0}%`}}/>
        </div>
        <div className="overview-status-rows">
          <div><span><i className="entry"/> Ativos</span><strong>{integer(summary?.active)}</strong></div>
          <div><span><i className="close"/> Encerrados</span><strong>{integer(summary?.closed)}</strong></div>
          <div><span><i className="other"/> Não informados</span><strong>{integer(summary?.unknown)}</strong></div>
        </div>
        <button type="button" className="overview-link" onClick={()=>{(window as Environment).MBA_NAVIGATE?.('processos');}}>Abrir módulo Processos <ArrowUpRight size={14}/></button>
      </section>
    </div>
    <div className="overview-distributions">
      <Breakdown title="Por produto" subtitle="Distribuição dos processos" rows={shown?.charts.por_produto || []}/>
      <Breakdown title="Por UF" subtitle="Unidades federativas" rows={shown?.charts.por_uf || []}/>
      <Breakdown title="Aging dos ativos" subtitle="Faixas em dias" rows={shown?.charts.aging || []}/>
    </div>
    <p className="overview-footnote"><Activity size={13}/> Dados da base processual consolidada, segregados pela carteira selecionada. Período filtra o coorte por data de entrada; encerramentos no gráfico utilizam a data de resolução. Os critérios de aptidão são os registros existentes na fonte, não uma decisão automática do DataJud.</p>
  </section>;
}
