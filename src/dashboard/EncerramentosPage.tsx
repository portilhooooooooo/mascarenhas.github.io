import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Activity, BarChart3, CheckCircle2, Clock3, MapPinned, RefreshCcw, SearchCheck, UsersRound, Wallet } from 'lucide-react';
import { BRAZIL_STATES } from './brazilStates';
import './encerramentos.css';

type Tipo = 'TODOS' | 'VITORIA' | 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'ACORDO' | 'EXTINCAO';
type VisaoMapa = 'vitorias' | 'derrotas' | 'tkm';
type Etapa = 'validados' | 'enviados_benner';
type Numero = number | null;
type TipoRow = { tipo: string; quantidade: number };
type AgingRow = { faixa: string; quantidade: number };
type Analista = { id: string; nome: string; analisados: number };
type Uf = { uf: string; vitorias: number; derrotas: number; tkm?: Numero; amostra?: number };
type Comarca = { comarca: string; uf: string; derrotas: number };
type Matriz = { tipo: string; faixa: string; quantidade: number };
type Indicadores = { consultados: number; encontrados: number; analisados: number; ticket_medio: Numero; ticket_amostra: number; aging_medio: Numero };
type ResumoBennerAnterior = { periodo_inicio: string; periodo_fim_exclusivo: string; enviados: number; encerrados: number; em_andamento: number; fonte: string };
type Dados = {
  carteira: string;
  tipo: string | null;
  _dashboard_stale?: boolean;
  indicadores: Indicadores;
  analises_humanas?: { total: number; aptos: number; inaptos: number; revisao: number; outros: number; fonte: string };
  aging: AgingRow[];
  estados: Array<{ uf: string; perdas: number; amostra: number; ticket_medio: Numero; faixa: string }>;
  analistas: Analista[];
  classificacoes: TipoRow[];
  distribuicao_tipos: TipoRow[];
  mapa?: Uf[];
  comarcas?: Comarca[];
  matriz?: Matriz[];
  meta_configurada?: boolean;
  etapas?: { etapa: Etapa; total: number; tipos: TipoRow[]; aging: AgingRow[]; matriz: Matriz[]; fonte: string; mensagem: string;
    mapa?: Uf[]; comarcas?: Comarca[]; ticket_medio?: Numero; ticket_amostra?: number; aging_medio?: Numero; analistas?: Analista[] };
};
type BackofficeApi = { request: <T = unknown>(path: string, options?: RequestInit) => Promise<T> };
const TIPOS: { value: Tipo; label: string }[] = [
  { value: 'TODOS', label: 'Todos os tipos' },
  { value: 'DERROTA_VOLUNTARIA', label: 'Derrota voluntária' },
  { value: 'DERROTA', label: 'Derrota' },
  { value: 'VITORIA', label: 'Vitória' },
  { value: 'ACORDO', label: 'Acordo' },
  { value: 'EXTINCAO', label: 'Extinção' },
];
const CLASSES = [
  { tipo: 'DERROTA_VOLUNTARIA', label: 'Derrota voluntária' },
  { tipo: 'DERROTA', label: 'Derrota' },
  { tipo: 'VITORIA', label: 'Vitória' },
  { tipo: 'ACORDO', label: 'Acordo' },
];
const ageBands = (carteira: string) => carteira === 'Agibank Regular'
  ? ['0–12 meses', '12–24 meses', '>24 meses', 'Sem tag / não reconhecida']
  : ['0–3 meses', '4–10 meses', '>10 meses', 'Sem tag / não reconhecida'];
const num = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
const money = (value: Numero | undefined) => value == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(value);
const percent = (value: number) => value.toFixed(1).replace('.', ',') + '%';
const valueOrZero = (value: number | undefined | null) => Number(value || 0);

function localISO(daysBack: number): string {
  const now = new Date(); now.setDate(now.getDate() - daysBack);
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}

async function loadDashboard(carteira: string, tipo: Tipo, inicio: string, fim: string, analista: string, etapa: Etapa): Promise<Dados> {
  const api = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!api) throw new Error('Conexão com a API indisponível.');
  const query = new URLSearchParams({ carteira, tipo, etapa });
  if (inicio) query.set('inicio', inicio);
  if (fim) query.set('fim', fim);
  if (analista !== 'todos') query.set('analista', analista);
  const path = '/api/operacao/encerramentos/dashboard?' + query.toString();
  // The dashboard is a read-only request. A momentary 502/503 or transport
  // reset should not blank all KPIs; retry briefly without repeating mutations.
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const controller = new AbortController();
      const timeout = window.setTimeout(() => controller.abort(), 15000);
      try {
        return await api.request<Dados>(path, { signal: controller.signal });
      } finally {
        window.clearTimeout(timeout);
      }
    } catch (error) {
      const status = (error as Error & { status?: number })?.status;
      const transient = status === 429 || status === 500 || status === 502
        || status === 503 || status === 504
        || (status == null && (error instanceof TypeError || (error as Error)?.name === 'AbortError'));
      if (!transient || attempt === 2) throw error;
      await new Promise<void>(resolve => window.setTimeout(resolve, (attempt + 1) * 450));
    }
  }
  throw new Error('Não foi possível carregar os indicadores.');
}

async function loadResumoBennerAnterior(): Promise<ResumoBennerAnterior> {
  const api = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!api) throw new Error('Conexão com a API indisponível.');
  return api.request<ResumoBennerAnterior>('/api/operacao/encerramentos/resumo-mes-anterior');
}

function Metrics({ dados, analista, selectedCount, acordo, etapa, resumo }: { dados: Dados | null; analista: string; selectedCount: number | undefined; acordo: boolean; etapa: Etapa; resumo: ResumoBennerAnterior | null }) {
  const m = dados?.indicadores;
  const accord = dados?.distribuicao_tipos.find(c => c.tipo === 'ACORDO')?.quantidade;
  const stage = dados?.etapas;
  const mesAnterior = resumo?.periodo_inicio
    ? new Intl.DateTimeFormat('pt-BR', { month: 'short', year: 'numeric' }).format(new Date(resumo.periodo_inicio.slice(0, 7) + '-02T12:00:00'))
    : 'mês anterior';
  const cards = [
    { icon: SearchCheck, name: acordo ? 'Indícios de acordo' : 'Encontrados', value: m ? num(acordo ? valueOrZero(accord) : m.encontrados) : '—', sub: m ? num(m.consultados) + ' consultados · Indícios DataJud' : 'Sem dados' },
    { icon: UsersRound, name: 'Analisados', value: m ? num(m.analisados) : '—', sub: 'Respostas de análise registradas no período' },
    { icon: CheckCircle2, name: etapa === 'validados' ? 'Aptos validados' : 'Enviados ao Benner', value: selectedCount === undefined ? '—' : num(selectedCount), sub: analista !== 'todos' ? 'Analista selecionado' : 'Análises registradas' },
    { icon: Wallet, name: 'Ticket médio', value: money(stage?.ticket_medio), sub: stage ? (stage.ticket_amostra ? num(stage.ticket_amostra) + ' pagamentos liquidados' : 'Sem pagamentos liquidados vinculados') : 'Aguardando apuração' },
    { icon: Clock3, name: 'Aging médio', value: stage?.aging_medio == null ? '—' : (stage.aging_medio / 30.44).toFixed(1).replace('.', ',') + ' meses', sub: 'Desde a entrada da pasta' },
    { icon: Activity, name: 'Em revisão', value: dados?.analises_humanas ? num(dados.analises_humanas.revisao) : '—', sub: 'Análises pendentes de validação' },
    { icon: CheckCircle2, name: 'Enviados', value: resumo ? num(resumo.enviados) : '—', sub: 'Ao Benner · ' + mesAnterior },
    { icon: Activity, name: 'Encerrados', value: resumo ? num(resumo.encerrados) : '—', sub: 'Baixa efetiva · ' + mesAnterior },
  ];
  return <div className="closing-kpis">
    {cards.map(item => <article className="closing-kpi" key={item.name}>
      <div className="closing-kpi-top"><span>{item.name}</span><item.icon size={17} strokeWidth={1.75}/></div>
      <strong>{item.value}</strong><small>{item.sub}</small>
    </article>)}
  </div>;
}

function Choice({ value, onChange, options }: { value: string; onChange: (value: string) => void; options: Array<{ value: string; label: string }> }) {
  return <div className="closing-choice">
    {options.map(item => <button key={item.value} type="button" className={value === item.value ? 'active' : ''} onClick={() => onChange(item.value)} aria-pressed={value === item.value}>{item.label}</button>)}
  </div>;
}

function MapPanel({ dados }: { dados: Dados | null }) {
  const [lens, setLens] = useState<VisaoMapa>('derrotas');
  const [selected, setSelected] = useState<string | null>(null);
  const stats = dados?.etapas?.mapa || [];
  const byUF = new Map(stats.map(row => [row.uf, row]));
  const metric = (item: Uf) => lens === 'vitorias' ? item.vitorias : lens === 'derrotas' ? item.derrotas : item.tkm;
  const ranked = [...stats].filter(s => metric(s) != null).sort((a,b) => valueOrZero(metric(b))-valueOrZero(metric(a))).slice(0,6);
  const ceiling = Math.max(1, ...ranked.map(row => valueOrZero(metric(row))));
  const current = selected ? byUF.get(selected) : undefined;
  return <section className="closing-surface closing-map">
    <div className="closing-card-head">
      <div><h2>Distribuição dos encerramentos</h2><p>Por unidade federativa</p></div>
    </div>
    <div className="closing-map-tabs" aria-label="Visão do mapa">
      <Choice value={lens} onChange={v => setLens(v as VisaoMapa)} options={[
        {value:'vitorias',label:'Vitórias'},{value:'derrotas',label:'Derrotas'},{value:'tkm',label:'Maior TKM'}
      ]}/>
    </div>
    <div className="closing-map-layout-v2">
      <svg viewBox="0 0 690 690" className="closing-map-svg" aria-label="Mapa do Brasil por UF" role="img">
        {BRAZIL_STATES.map(state => {
          const value = byUF.get(state.uf) ? metric(byUF.get(state.uf)!) : null;
          const shade = value == null ? 0 : .16+.68*Math.sqrt(Math.max(0,value)/ceiling);
          return <path key={state.uf} d={state.path} className={'closing-map-state'+(selected===state.uf?' selected':'')}
            style={{fill:value==null?'#e8edf5':'rgba(20,43,103,'+shade+')'}}
            role="button" tabIndex={0} onClick={()=>setSelected(state.uf===selected?null:state.uf)}
            onKeyDown={e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();setSelected(state.uf);}}}
            aria-label={state.name+': '+(value==null?'sem dados':lens==='tkm'?money(value):num(value))}>
            <title>{state.name}: {value==null?'sem dados':lens==='tkm'?money(value):num(value)}</title>
          </path>;
        })}
      </svg>
      <div className="closing-map-ranking">
        {current ? <div className="closing-selected-uf"><span>{BRAZIL_STATES.find(s=>s.uf===selected)?.name} · {selected}</span>
          <strong>{metric(current)==null?'—':lens==='tkm'?money(metric(current)):num(metric(current)!)}</strong>
        </div> : null}
        <div className="closing-rank-head"><span>UF</span><span>{lens==='tkm'?'Ticket médio':'Processos'}</span></div>
        {ranked.map(item=><div className="closing-rank-row" key={item.uf}>
          <span>{item.uf}</span><div className="closing-rank-bar"><i style={{width:valueOrZero(metric(item))/ceiling*100+'%'}}/></div>
          <strong>{lens==='tkm'?money(metric(item)):num(metric(item)!)}</strong>
        </div>)}
        {!ranked.length&&<p className="closing-nodata">Sem dados para a seleção</p>}
      </div>
    </div>
    <div className="closing-card-foot">{lens==='tkm'?'Pagamentos liquidados do conjunto selecionado.':'Dados por analista e etapa.'}</div>
  </section>;
}

function Composition({ dados, etapa }: { dados: Dados | null; etapa: Etapa }) {
  const bands = ageBands(dados?.carteira || 'Agibank Regular');
  const types = dados?.etapas?.tipos || [];
  const ages = dados?.etapas?.aging || [];
  const first = etapa === 'validados' ? 'Validados' : 'Enviados';
  const total = valueOrZero(dados?.etapas?.total);
  const matrix = dados?.etapas?.matriz || [];
  const quantity = (kind: string) => valueOrZero(types.find(row=>row.tipo===kind)?.quantidade);
  const typeCount = Math.max(1,...CLASSES.map(t=>quantity(t.tipo)));
  const rows = (section: 'tipos'|'aging') => section==='tipos'
    ? CLASSES.map(t=>({key:t.tipo,label:t.label,found:quantity(t.tipo)}))
    : bands.map(faixa=>({
        key:faixa,label:faixa,found:valueOrZero(ages.find(a=>a.faixa===faixa)?.quantidade),
      }));
  return <section className="closing-surface closing-composition">
    <div className="closing-card-head"><div>
      <h2>Composição dos encerramentos</h2>
      <p>{etapa==='validados'?'Validados':'Enviados ao Benner'} · aging calculado na data da etapa · {num(total)} processos</p>
    </div></div>
    {(['tipos','aging'] as const).map(section => <div className="closing-composition-table" key={section}>
      <div className="closing-breakdown-head">
        <h3>{section==='tipos'?'Tipos':'Aging'}</h3>
        <span>{first} · % da etapa</span>
      </div>
      {rows(section).map(row=><div className="closing-breakdown-row" key={row.key}>
        <div className="closing-breakdown-name">
          <span>{row.label}</span>
          <div className="closing-rail"><i style={{width:(row.found/(section==='tipos'?typeCount:Math.max(1,...rows('aging').map(x=>x.found))))*100+'%'}}/></div>
        </div>
        <strong>{num(row.found)} <small>{total ? percent(row.found / total * 100) : '0%'}</small></strong>
      </div>)}
    </div>)}
    {total > 0 && <div className="closing-matrix-scroll"><table className="closing-matrix" aria-label="Composição por tipo e aging">
      <thead><tr><th>Tipo / Aging</th>{bands.map(faixa=><th key={faixa}>{faixa}</th>)}<th>Total</th></tr></thead>
      <tbody>{CLASSES.map(classe=><tr key={classe.tipo}><th>{classe.label}</th>{bands.map(faixa=><td key={faixa}>{num(valueOrZero(matrix.find(item=>item.tipo===classe.tipo && item.faixa===faixa)?.quantidade))}</td>)}<td className="closing-matrix-total">{num(quantity(classe.tipo))}</td></tr>)}</tbody>
    </table></div>}
    <div className="closing-card-foot">A composição acompanha o intervalo de datas e a etapa. Sem pagamentos liquidados associados, o TKM permanece sem amostra.</div>
  </section>;
}

function ComarcasPanel({ dados, etapa, analista }: { dados: Dados | null; etapa: Etapa; analista: string }) {
  const [page,setPage] = useState(1);
  const list = dados?.etapas?.comarcas || [];
  const pageSize = 6;
  const pages = Math.max(1,Math.ceil(list.length/pageSize));
  useEffect(()=>setPage(1),[etapa,analista,dados?.carteira,dados?.tipo]);
  const safePage = Math.min(page,pages);
  const slice = list.slice((safePage-1)*pageSize,safePage*pageSize);
  const max = Math.max(1,...list.map(c=>c.derrotas));
  const firstPage = Math.max(1,Math.min(safePage-1,pages-3));
  const buttons = Array.from({length:Math.min(pages,4)},(_,i)=>firstPage+i);
  return <section className="closing-surface closing-bottom">
    <div className="closing-card-head"><div><h2>Comarcas com mais derrotas</h2><p>{num(list.length)} comarcas · ordem decrescente</p></div></div>
    <div className="closing-comarca-list">
      {slice.map((c,index)=><div className="closing-comarca-row" key={c.uf+c.comarca}>
        <span className="closing-index">{String((safePage-1)*pageSize+index+1).padStart(2,'0')}</span>
        <div><strong>{c.comarca}</strong><small>{c.uf}</small></div>
        <div className="closing-rail"><i style={{width:c.derrotas/max*100+'%'}}/></div><b>{num(c.derrotas)}</b>
      </div>)}
      {!slice.length&&<p className="closing-nodata">Nenhuma comarca validada nesta seleção</p>}
    </div>
    {pages>1&&<nav className="closing-pagination" aria-label="Páginas de comarcas">
      <button type="button" onClick={()=>setPage(Math.max(1,safePage-1))} disabled={safePage===1} aria-label="Página anterior">‹</button>
      {buttons.map(p=><button key={p} type="button" className={p===safePage?'active':''} onClick={()=>setPage(p)} aria-current={p===safePage?'page':undefined}>{p}</button>)}
      <button type="button" onClick={()=>setPage(Math.min(pages,safePage+1))} disabled={safePage===pages} aria-label="Próxima página">›</button>
    </nav>}
  </section>;
}

function AnalystsPanel({ analysts }: { analysts: Analista[] }) {
  const total = analysts.reduce((sum,a) => sum+a.analisados,0);
  const max = Math.max(1,...analysts.map(a=>a.analisados));
  return <section className="closing-surface closing-bottom">
    <div className="closing-card-head"><div><h2>Produtividade dos analistas</h2><p>Análises registradas no período selecionado</p></div></div>
    {analysts.length ? <div className="closing-staff">
      {analysts.map(a => <div className="closing-staff-row" key={a.id}>
        <span className="closing-avatar">{a.nome.slice(0,2).toUpperCase()}</span>
        <div className="closing-staff-name"><strong>{a.nome}</strong><small>{total ? percent(a.analisados/total*100) + ' do total' : 'Sem análises'}</small></div>
        <div className="closing-rail"><i style={{width:a.analisados/max*100+'%'}}/></div>
        <b>{num(a.analisados)}</b>
      </div>)}
    </div> : <p className="closing-nodata">Sem análises registradas hoje.</p>}
  </section>;
}

export function EncerramentosPage() {
  const [portfolioRevision,setPortfolioRevision] = useState(0);
  const [carteira,setCarteira] = useState(() => {
    const id = (window as Window & { MBA_API?: { getPortfolioId?: () => string } }).MBA_API?.getPortfolioId?.();
    return id === 'agibank_enter' ? 'Agibank Enter' : 'Agibank Regular';
  });
  const [tipo,setTipo] = useState<Tipo>('TODOS');
  const [inicio,setInicio] = useState(() => { const now = new Date(); return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),'01'].join('-'); });
  const [fim,setFim] = useState(() => localISO(0));
  const [analista,setAnalista] = useState('todos');
  const [etapa,setEtapa] = useState<Etapa>('validados');
  const [dados,setDados] = useState<Dados | null>(null);
  const [resumoBenner,setResumoBenner] = useState<ResumoBennerAnterior | null>(null);
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  const refreshSequence = useRef(0);
  const activeRequest = useRef<{ key: string; sequence: number } | null>(null);
  // The page can remain mounted while the authenticated portfolio changes.
  // A stale disabled portfolio selector previously caused INVALID_FILTERS 400s.
  useEffect(() => {
    const syncPortfolio = () => {
      const id=(window as Window & {MBA_API?:{getPortfolioId?:()=>string}}).MBA_API?.getPortfolioId?.();
      const next=id==='agibank_enter'?'Agibank Enter':'Agibank Regular';
      refreshSequence.current += 1;
      // A portfolio event can re-select the same portfolio. Re-fetch anyway
      // instead of clearing the KPIs with no state dependency to reload them.
      setPortfolioRevision(revision => revision + 1);
      setCarteira(next);
      setDados(null);
      setResumoBenner(null);
      setError('');
    };
    window.addEventListener('mba:portfolio-changed',syncPortfolio);
    return () => window.removeEventListener('mba:portfolio-changed',syncPortfolio);
  },[]);
  const invalidRange = Boolean(inicio && fim && inicio > fim);
  const filterKey = [carteira,tipo,inicio,fim,analista,etapa,portfolioRevision].join('|');
  const [loadedKey,setLoadedKey] = useState('');
  const refresh = useCallback(async () => {
    // Duplicate realtime events must not continually supersede pending data.
    // A change of filters or portfolio still starts a new request.
    if (invalidRange || activeRequest.current?.key === filterKey) return;
    const sequence = ++refreshSequence.current;
    activeRequest.current = { key: filterKey, sequence };
    setPending(true);
    try {
      const painel = await loadDashboard(carteira,tipo,inicio,fim,analista,etapa);
      if (sequence !== refreshSequence.current) return;
      setDados(painel);
      setLoadedKey(filterKey);
      setError('');
    } catch (cause) {
      if (sequence === refreshSequence.current) {
        setError(cause instanceof Error ? cause.message : 'Erro ao carregar encerramentos.');
      }
    } finally {
      if (activeRequest.current?.sequence === sequence) activeRequest.current = null;
      if (sequence === refreshSequence.current) setPending(false);
    }
  },[carteira,tipo,inicio,fim,analista,etapa,invalidRange,filterKey]);

  useEffect(() => {void refresh();},[refresh]);
  useEffect(() => () => {
    // React StrictMode runs effect cleanup/setup twice. Clearing the request
    // lease allows the second setup to load rather than showing blank KPIs.
    refreshSequence.current += 1;
    activeRequest.current = null;
  },[]);

  // Historical Benner data is a previous-month snapshot, not a live KPI.
  useEffect(() => {
    let active = true;
    void loadResumoBennerAnterior().then(value => {
      if (active) setResumoBenner(value);
    }).catch(() => {/* Keep the previous snapshot on network errors. */});
    return () => {active=false;};
  },[carteira,portfolioRevision]);

  // Events drive normal updates. The 5-minute check recovers missed events.
  useEffect(() => {
    const id = window.setInterval(() => {if(!document.hidden)void refresh();},300000);
    const visible = () => {if(!document.hidden)void refresh();};
    document.addEventListener('visibilitychange', visible);
    return () => {window.clearInterval(id);document.removeEventListener('visibilitychange',visible);};
  },[refresh]);
  useEffect(() => {
    let timeout: number | undefined;
    const schedule = () => {
      if (document.hidden) return;
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => {void refresh();},350);
    };
    const onRealtime = (event: Event) => {
      const module = (event as CustomEvent<{module?: string}>).detail?.module;
      if (module === 'encerramentos') schedule();
    };
    window.addEventListener('mba:realtime-invalidate', onRealtime);
    window.addEventListener('mba:closing-analysis-saved', schedule);
    return () => {
      window.clearTimeout(timeout);
      window.removeEventListener('mba:realtime-invalidate', onRealtime);
      window.removeEventListener('mba:closing-analysis-saved', schedule);
    };
  },[refresh]);
  const shown = loadedKey === filterKey ? dados : null;
  const analysts = shown?.analistas?.length ? shown.analistas : shown?.etapas?.analistas || [];
  const analysed = shown?.etapas?.total;

  return <div className="closing-page-v2">
    <div className="closing-heading">
      <div><h1>Encerramentos</h1><span>Visão da carteira · dados operacionais</span></div>
      <div className="closing-heading-actions">
        <button type="button" className="closing-refresh" onClick={()=>void refresh()} disabled={pending}><RefreshCcw size={15}/> Atualizar</button>
      </div>
    </div>
    <div className="closing-filter-row">
      <label>Carteira<select value={carteira} disabled aria-label="Carteira atual autorizada"><option value="Agibank Regular">Agibank · MBA</option><option value="Agibank Enter">Agibank · Enter</option></select></label>
      <label>Tipo<select value={tipo} onChange={e=>setTipo(e.target.value as Tipo)}>{TIPOS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
      <fieldset className="closing-date-range"><legend>Período</legend>
        <label>De<input type="date" aria-label="Data inicial dos encerramentos" value={inicio} max={fim || undefined} onChange={e=>setInicio(e.target.value)}/></label>
        <label>Até<input type="date" aria-label="Data final dos encerramentos" value={fim} min={inicio || undefined} onChange={e=>setFim(e.target.value)}/></label>
        <button type="button" className="closing-date-clear" onClick={()=>{setInicio('');setFim('');}} disabled={!inicio && !fim}>Todo o histórico</button>
      </fieldset>
      <label>Etapa<select value={etapa} onChange={e=>setEtapa(e.target.value as Etapa)}>
        <option value="validados">Validados</option>
        <option value="enviados_benner">Enviados ao Benner</option>
      </select></label>
      <label>Analista<select value={analista} onChange={e=>setAnalista(e.target.value)}><option value="todos">Todos</option><option value="gabriel">Gabriel</option><option value="elias">Elias</option><option value="gessica">Géssica</option></select></label>
    </div>
    {invalidRange && <p className="closing-error" role="alert">A data inicial não pode ser posterior à data final.</p>}
    {pending && !shown ? <p className="closing-stale-note" role="status">Carregando indicadores da carteira...</p> : null}
    {error ? <p className="closing-error" role="alert">{shown ? 'Atualização temporariamente indisponível. Exibindo os últimos indicadores carregados.' : error}</p> : null}
    {shown?._dashboard_stale && !error ? <p className="closing-stale-note" role="status">Exibindo os últimos indicadores disponíveis. A atualização automática tentará novamente.</p> : null}
    <Metrics dados={shown} acordo={tipo==='ACORDO'} analista={analista} selectedCount={analysed} etapa={etapa} resumo={resumoBenner}/>
    <div className="closing-main-grid">
      <MapPanel dados={shown}/>
      <Composition dados={shown} etapa={etapa}/>
    </div>
    <div className="closing-lower-grid">
      <ComarcasPanel dados={shown} etapa={etapa} analista={analista}/>
      <AnalystsPanel analysts={analysts}/>
    </div>
    <p className="closing-disclaimer">Acordos não integram oportunidades aptas ao encerramento. Os números exibidos dependem da fonte operacional.</p>
  </div>;
}
