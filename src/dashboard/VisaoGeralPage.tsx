import { useMemo, useState } from 'react';
import {useQuery} from '@tanstack/react-query';
import {runtimeQueries,runtimeScope} from '../tasks/runtimeQueries';
import { ArrowUpRight, CheckCircle2, Clock3, FileCheck2, FolderOpen, Layers3, RefreshCw, Scale, SearchCheck, ShieldAlert } from 'lucide-react';
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
  aging_calculation?: { basis?: string; as_of?: string; sample?: number; source?: string };
};
type Api = { request: <T = unknown>(path: string, options?: RequestInit) => Promise<T>; getPortfolioId?: () => string };
type Environment = Window & { MBA_AUTOMATION_API?: Api; MBA_API?: Api; MBA_NAVIGATE?: (route: string) => boolean };
type Period = 'all' | 'month' | '90' | '365';

const integer = (value: number | null | undefined) => new Intl.NumberFormat('pt-BR').format(Number(value || 0));
const safeNumber = (n: unknown) => typeof n === 'number' && Number.isFinite(n) ? n : 0;
const shortDate = (value: string) => new Intl.DateTimeFormat('pt-BR', { month: 'short', year: '2-digit', timeZone: 'UTC' }).format(new Date(value.slice(0,10) + 'T12:00:00Z'));
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
}[id] || id.replace(/_/g,' '));

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

export function VisaoGeralPage({visible=true}:{visible?:boolean}) {
  const portfolio=(window as Environment).MBA_API?.getPortfolioId?.() || '';
  const scope=runtimeScope();
  const [period,setPeriod] = useState<Period>('all');
  const [uf,setUf] = useState('');
  const [product,setProduct] = useState('');
  const [situation,setSituation] = useState('');
  const [attention,setAttention] = useState('');
  const [resolution,setResolution] = useState('');
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

  const result=useQuery({queryKey:['runtime-v2',scope,'base-geral','entradas',query],
    enabled:visible && !!scope,staleTime:60000,
    refetchInterval:visible?300000:false,
    queryFn:async({signal})=>{
      const api=(window as Environment).MBA_AUTOMATION_API || (window as Environment).MBA_API;
      if(!api)throw new Error('Conexão com a API indisponível.');
      const answer=await api.request<unknown>('/api/carteira-processual'+(query?'?'+query:''),{signal});
      if(scope!==runtimeScope())throw new Error('Resposta de escopo anterior descartada.');
      if(!isDashboard(answer))throw new Error('A API retornou uma estrutura de indicadores inválida.');
      return answer;
    }},runtimeQueries);
  const shown=result.data || null;
  const data=shown;
  const pending=result.isFetching;
  const error=result.error instanceof Error?result.error.message:'';
  const refresh=()=>result.refetch();
  const summary = shown?.summary;
  const source = shown?.updated_at ? new Date(shown.updated_at) : null;
  const outdated = !source || Date.now()-source.getTime()>30*86400000;
  const ageComputed = shown?.aging_calculation?.basis === 'entry_date';
  const ageCaption = ageComputed ? (outdated ? 'Dias desde a entrada · base histórica' : 'Dias desde a entrada') : 'Aguardando cálculo pela data de entrada';
  const hasData = Boolean(summary?.total);
  const allFilters = data?.filters;
  const entries = shown?.movement?.entries;
  const closures = shown?.movement?.closures;
  const content=(value:number|null|undefined)=>shown?integer(value):'—';

  return <section className="overview-page" aria-label="Entradas da carteira processual">
    <div className="overview-heading">
      <div><h1>Entradas</h1><p>{outdated?'Indicadores históricos da carteira processual':'Indicadores e evolução da carteira processual'}</p></div>
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
      <Filter title="Atenção" value={attention} onChange={setAttention} choices={[{value:'',text:'Todos'},...(!outdated ? [{value:'aging',text:'Aging crítico (+180 dias)'}] : []),{value:'divergent',text:'Divergência CPJ × Benner'},{value:'archive',text:'Aptos a arquivamento'}]}/>
      <Filter title="Encerramento" value={resolution} onChange={setResolution} choices={choices(allFilters?.resolutions || [])}/>
    </div>
    {error && <div className="overview-error" role="alert">{shown?'Falha ao atualizar. Mantidos os últimos dados carregados. ':''}{error}<button type="button" onClick={()=>void refresh()}>Tentar novamente</button></div>}
    {pending&&!shown && <p className="overview-loading" role="status">Carregando os indicadores da carteira...</p>}
    {!pending&&!shown&&!error && <p className="overview-empty">Aguardando indicadores da carteira.</p>}
    {shown && !hasData && <div className="overview-notice" role="status">Nenhum processo encontrado nesta carteira e combinação de filtros. A Visão geral não utiliza dados de outras carteiras para completar os resultados.</div>}
    <div className="overview-kpis">
      <Metric label="Processos" value={summary?integer(summary.total):'—'} sub="Total no recorte" icon={Layers3}/>
      <Metric label="Ativos" value={summary?integer(summary.active):'—'} sub="Em andamento no Benner" icon={FolderOpen}/>
      <Metric label="Encerrados" value={summary?integer(summary.closed):'—'} sub="Situação Benner encerrado" icon={CheckCircle2}/>
      <Metric label="Aging médio" value={ageComputed && summary?.aging_mean!=null?summary.aging_mean.toFixed(1).replace('.',',')+' dias':'—'} sub={ageCaption} icon={Clock3}/>
      <Metric label="Aptos ao encerramento" value={summary?integer(summary.eligible):'—'} sub="Com resolução preenchida" icon={FileCheck2}/>
      <Metric label="Divergências" value={summary?integer(summary.divergent):'—'} sub="Situações CPJ × Benner" icon={Scale}/>
      <Metric label="Aptos a arquivamento" value={summary?integer(summary.archive):'—'} sub="Encerrado no Benner, ativo no CPJ" icon={SearchCheck}/>
      <Metric label="Aging crítico" value={ageComputed && summary?integer(summary.critical):'—'} sub={ageComputed?'Ativos com mais de 180 dias desde a entrada':'Aguardando cálculo pela data de entrada'} icon={ShieldAlert}/>
    </div>
    <div className="overview-main">
      <section className="overview-panel overview-evolution">
        <header><div><h2>Entradas e encerramentos</h2><p>Evolução por mês de movimentação</p></div>
          <div className="overview-legend"><span><i className="entry"/> Entradas</span><span><i className="close"/> Encerramentos</span></div>
        </header>
        <div className="overview-movement">
          <div><span>Entradas</span><strong>{content(entries)}</strong></div>
          <div><span>Encerramentos</span><strong>{content(closures)}</strong></div>
          <div><span>Saldo</span><strong>{shown?integer((entries??0)-(closures??0)):'—'}</strong></div>
        </div>
        <Timeline rows={shown?.charts.timeline || []}/>
      </section>
      <section className="overview-panel overview-situation">
        <header><div><h2>Situação da carteira</h2><p>Distribuição por situação no Benner</p></div></header>
        <div className="overview-situation-total">{content(summary?.total)}<span>processos</span></div>
        <div className="overview-situation-track" role="img" aria-label={`${content(summary?.active)} ativos, ${content(summary?.closed)} encerrados`}>
          <span style={{width:`${summary?.total ? summary.active/summary.total*100 : 0}%`}}/>
          <span style={{width:`${summary?.total ? summary.closed/summary.total*100 : 0}%`}}/>
        </div>
        <div className="overview-status-rows">
          <div><span><i className="entry"/> Ativos</span><strong>{content(summary?.active)}</strong></div>
          <div><span><i className="close"/> Encerrados</span><strong>{content(summary?.closed)}</strong></div>
          <div><span><i className="other"/> Não informados</span><strong>{content(summary?.unknown)}</strong></div>
        </div>
        <button type="button" className="overview-link" onClick={()=>{(window as Environment).MBA_NAVIGATE?.('processos');}}>Abrir módulo Processos <ArrowUpRight size={14}/></button>
      </section>
    </div>
    <div className="overview-distributions">
      <Breakdown title="Por produto" subtitle="Distribuição dos processos" rows={shown?.charts.por_produto || []}/>
      <Breakdown title="Por UF" subtitle="Unidades federativas" rows={shown?.charts.por_uf || []}/>
      {ageComputed ? <Breakdown title="Aging dos ativos" subtitle={ageCaption} rows={shown?.charts.aging || []}/> : <section className="overview-panel overview-breakdown"><header><div><h2>Aging dos ativos</h2><p>Faixas em dias</p></div></header><p className="overview-empty">Aguardando cálculo pela data de entrada.</p></section>}
    </div>
  </section>;
}
