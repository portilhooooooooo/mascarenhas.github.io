import { useCallback, useEffect, useMemo, useState } from 'react';
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
type Dados = {
  carteira: string;
  tipo: string | null;
  indicadores: Indicadores;
  aging: AgingRow[];
  estados: Array<{ uf: string; perdas: number; amostra: number; ticket_medio: Numero; faixa: string }>;
  analistas: Analista[];
  classificacoes: TipoRow[];
  distribuicao_tipos: TipoRow[];
  mapa?: Uf[];
  comarcas?: Comarca[];
  matriz?: Matriz[];
  meta_configurada?: boolean;
  ranking?: { faixas: Array<{ id: string; rotulo: string; estoque: number | null; meta_percentual: number; meta_quantidade: number | null }> };
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
const STAFF = [
  { id: 'demo-gabriel', nome: 'Gabriel', analisados: 43 },
  { id: 'demo-elias', nome: 'Elias', analisados: 31 },
  { id: 'demo-gessica', nome: 'Géssica', analisados: 26 },
];
const num = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
const money = (value: Numero | undefined) => value == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(value);
const percent = (value: number) => value.toFixed(1).replace('.', ',') + '%';
const valueOrZero = (value: number | undefined | null) => Number(value || 0);

function localISO(daysBack: number): string {
  const now = new Date(); now.setDate(now.getDate() - daysBack);
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}

async function loadDashboard(carteira: string, tipo: Tipo, periodo: string, analista: string, etapa: Etapa): Promise<Dados> {
  const api = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!api) throw new Error('Conexão com a API indisponível.');
  const query = new URLSearchParams({ carteira, tipo, etapa });
  if (periodo === 'mes') { const d = new Date(); query.set('inicio', [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),'01'].join('-')); }
  if (periodo === '30') query.set('inicio', localISO(29));
  if (periodo === '90') query.set('inicio', localISO(89));
  if (analista !== 'todos') query.set('analista', analista);
  return api.request<Dados>('/api/operacao/encerramentos/dashboard?' + query.toString());
}

/** Números fictícios, calculados exclusivamente na interface de demonstração. */
function makeDemo(carteira: string, tipo: Tipo, periodo: string, etapa: Etapa, analista: string): Dados {
  const factor = (periodo === 'mes' ? .16 : periodo === '30' ? .23 : periodo === '90' ? .55 : 1) * (carteira === 'Agibank Enter' ? .72 : 1);
  const actorFactor = analista === 'todos' ? 1 : analista === 'gabriel' ? .43 : analista === 'elias' ? .31 : .26;
  const stageFactor = (etapa === 'validados' ? .78 : .47) * actorFactor;
  const bands = ageBands(carteira);
  const seed = [
    { tipo: 'DERROTA_VOLUNTARIA', quantidade: 190 },
    { tipo: 'DERROTA', quantidade: 476 },
    { tipo: 'VITORIA', quantidade: 330 },
    { tipo: 'ACORDO', quantidade: 74 },
    { tipo: 'EXTINCAO', quantidade: 32 },
  ];
  const selected = seed.filter(item => tipo === 'TODOS' || item.tipo === tipo)
    .map(item => ({ ...item, quantidade: Math.max(1, Math.round(item.quantidade * factor)) }));
  const classification = selected.filter(item => item.tipo !== 'ACORDO');
  const found = classification.reduce((sum, row) => sum + row.quantidade, 0);
  const divided = CLASSES.map(item => ({ tipo: item.tipo, quantidade: selected.find(s => s.tipo === item.tipo)?.quantidade || 0 }));
  const stageTypes = divided.map(row => ({...row, quantidade: Math.round(row.quantidade * stageFactor)}));
  const matriz: Matriz[] = stageTypes.flatMap((row, index) => {
    const weights = [0.3 + index * .016, .33, .30 - index * .012, .07 - index * .004];
    const numbers = weights.map((weight, i) => i === 3 ? 0 : Math.round(row.quantidade * weight));
    numbers[3] = Math.max(0, row.quantidade - numbers[0] - numbers[1] - numbers[2]);
    return bands.map((faixa, i) => ({ tipo: row.tipo, faixa, quantidade: numbers[i] }));
  });
  const aging: AgingRow[] = bands.map(faixa => ({ faixa, quantidade: matriz.filter(m => m.faixa === faixa).reduce((v, m) => v + m.quantidade, 0) }));
  const map: Uf[] = BRAZIL_STATES.map((state, i) => ({
    uf: state.uf,
    vitorias: Math.round((stageTypes.find(x => x.tipo === 'VITORIA')?.quantidade || 0) * (5 + (i * 13 % 19)) / 345),
    derrotas: Math.round((stageTypes[0].quantidade + stageTypes[1].quantidade) * (5 + (i * 7 % 21)) / 390),
    tkm: 6100 + ((i * 1337) % 9100),
    amostra: 7 + (i % 16),
  }));
  const demoComarcas: Comarca[] = BRAZIL_STATES.map((state,i) => ({
    comarca: ['Porto Alegre','São Paulo','Campo Grande','Florianópolis','Rio de Janeiro','Salvador'][i] || state.name,
    uf: state.uf, derrotas: Math.max(1,Math.round((155 - i*4)*factor*stageFactor)),
  })).sort((a,b) => b.derrotas-a.derrotas);
  return {
    carteira, tipo: tipo === 'TODOS' ? null : tipo,
    indicadores: { consultados: Math.round(found * 1.4), encontrados: found, analisados: 100, ticket_medio: 9356.74, ticket_amostra: 420, aging_medio: 224 },
    aging, estados: [], analistas: STAFF, classificacoes: classification,
    distribuicao_tipos: divided, matriz, mapa: map,
    etapas: {
      etapa, total: stageTypes.reduce((sum, row) => sum + row.quantidade, 0),
      tipos: stageTypes, aging, matriz, mapa: map, comarcas: stageTypes[0].quantidade+stageTypes[1].quantidade>0?demoComarcas:[],
      ticket_medio: 9356.74, ticket_amostra: 36, aging_medio: 224,
      fonte: 'demonstracao',
      mensagem: etapa === 'validados' ? 'Validações simuladas' : 'Envios confirmados simulados',
    },
    comarcas: stageTypes[0].quantidade+stageTypes[1].quantidade>0?demoComarcas:[],
    ranking: {faixas: bands.slice(0,3).map((rotulo,i) => ({
      id: rotulo, rotulo, estoque: [1240,2500,1850][i],
      meta_percentual: carteira === 'Agibank Regular' ? 5 : [3,4,5][i],
      meta_quantidade: carteira === 'Agibank Regular' ? [62,125,93][i] : [38,100,93][i],
    }))},
    meta_configurada: true,
  };
}

function Metrics({ dados, demo, analista, selectedCount, acordo, etapa }: { dados: Dados | null; demo: boolean; analista: string; selectedCount: number | undefined; acordo: boolean; etapa: Etapa }) {
  const m = dados?.indicadores;
  const accord = dados?.distribuicao_tipos.find(c => c.tipo === 'ACORDO')?.quantidade;
  const stage = dados?.etapas;
  const cards = [
    { icon: SearchCheck, name: acordo ? 'Indícios de acordo' : 'Encontrados', value: m ? num(acordo ? valueOrZero(accord) : m.encontrados) : '—', sub: m ? num(m.consultados) + ' consultados · Indícios DataJud' : 'Sem dados' },
    { icon: CheckCircle2, name: etapa === 'validados' ? 'Aptos validados' : 'Enviados ao Benner', value: selectedCount === undefined ? '—' : num(selectedCount), sub: analista !== 'todos' ? 'Analista selecionado' : 'Análises registradas' },
    { icon: Wallet, name: 'Ticket médio', value: money(stage?.ticket_medio), sub: stage ? num(valueOrZero(stage.ticket_amostra)) + ' pagamentos' : 'Sem pagamentos' },
    { icon: Clock3, name: 'Aging médio', value: stage?.aging_medio == null ? '—' : (stage.aging_medio / 30.44).toFixed(1).replace('.', ',') + ' meses', sub: 'Desde a entrada da pasta' },
  ];
  return <div className="closing-kpis">
    {cards.map(item => <article className="closing-kpi" key={item.name}>
      <div className="closing-kpi-top"><span>{item.name}</span><item.icon size={17} strokeWidth={1.75}/></div>
      <strong>{item.value}</strong><small>{item.sub}</small>
    </article>)}
    {demo ? null : null}
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

function Composition({ dados, etapa, periodo, analista }: { dados: Dados | null; etapa: Etapa; periodo: string; analista: string }) {
  const bands = ageBands(dados?.carteira || 'Agibank Regular');
  const types = dados?.etapas?.tipos || [];
  const ages = dados?.etapas?.aging || [];
  const rules = dados?.ranking?.faixas || [];
  const first = etapa === 'validados' ? 'Validados' : 'Enviados';
  const currentMonth = periodo === 'mes';
  const quantity = (kind: string) => valueOrZero(types.find(row=>row.tipo===kind)?.quantidade);
  const typeCount = Math.max(1,...CLASSES.map(t=>quantity(t.tipo)));
  const rows = (section: 'tipos'|'aging') => section==='tipos'
    ? CLASSES.map(t=>({key:t.tipo,label:t.label,found:quantity(t.tipo),goal:null as number|null}))
    : bands.map((faixa,index)=>({
        key:faixa,label:faixa,found:valueOrZero(ages.find(a=>a.faixa===faixa)?.quantidade),
        goal:index===3||analista!=='todos'?null:(currentMonth?rules.find(r=>r.rotulo===faixa)?.meta_quantidade??null:null),
      }));
  return <section className="closing-surface closing-composition">
    <div className="closing-card-head"><div>
      <h2>Composição dos encerramentos</h2>
      <p>{etapa==='validados'?'Validados':'Enviados ao Benner'} · {currentMonth?'Mês atual':'Período selecionado'}</p>
    </div></div>
    {(['tipos','aging'] as const).map(section => <div className="closing-composition-table" key={section}>
      <div className="closing-breakdown-head">
        <h3>{section==='tipos'?'Tipos':'Aging'}</h3>
        <span>{first}</span><span>Meta</span><span>Restantes</span>
      </div>
      {rows(section).map(row=><div className="closing-breakdown-row" key={row.key}>
        <div className="closing-breakdown-name">
          <span>{row.label}</span>
          <div className="closing-rail"><i style={{width:(row.found/(section==='tipos'?typeCount:Math.max(1,...rows('aging').map(x=>x.found))))*100+'%'}}/></div>
        </div>
        <strong>{num(row.found)}</strong>
        <span title={section==='tipos'?'Edital sem meta por tipo':currentMonth?'Meta mensal por faixa':'Meta mensal disponível somente no mês atual'}>{row.goal==null?'—':num(row.goal)}</span>
        <strong>{row.goal==null?'—':num(Math.max(0,row.goal-row.found))}</strong>
      </div>)}
    </div>)}
    <div className="closing-card-foot">Meta mensal apenas para aging. Tipo não tem meta individual no edital.</div>
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
    <div className="closing-card-head"><div><h2>Produtividade dos analistas</h2><p>Análises do dia</p></div></div>
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
  const [carteira,setCarteira] = useState('Agibank Regular');
  const [tipo,setTipo] = useState<Tipo>('TODOS');
  const [periodo,setPeriodo] = useState('mes');
  const [analista,setAnalista] = useState('todos');
  const [etapa,setEtapa] = useState<Etapa>('validados');
  const [demo,setDemo] = useState(true);
  const [dados,setDados] = useState<Dados | null>(null);
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  const refresh = useCallback(async () => {
    setPending(true);
    try { const result = await loadDashboard(carteira,tipo,periodo,analista,etapa); setDados(result); setError(''); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Erro ao carregar encerramentos.'); }
    finally { setPending(false); }
  },[carteira,tipo,periodo,analista,etapa]);
  useEffect(() => {void refresh();},[refresh]);
  useEffect(() => { const id = window.setInterval(() => {if(!document.hidden)void refresh();},60000); return () => clearInterval(id);},[refresh]);
  const fake = useMemo(() => makeDemo(carteira,tipo,periodo,etapa,analista),[carteira,tipo,periodo,etapa,analista]);
  const shown = demo ? fake : dados;
  const analysts = demo
    ? STAFF.filter(a=>analista==='todos'||a.id==='demo-'+analista).map(a=>({
        ...a, analisados: Math.round(a.analisados * (etapa==='validados'?1:.62)),
      }))
    : (dados?.etapas?.analistas || dados?.analistas || []);
  const analysed = demo ? shown?.etapas?.total : shown?.etapas?.total;

  return <div className="closing-page-v2">
    <div className="closing-heading">
      <div><h1>Encerramentos</h1><span>{demo ? 'Visualização de demonstração' : 'Visão da carteira'}</span></div>
      <div className="closing-heading-actions">
        <label className="closing-demo-switch"><input type="checkbox" checked={demo} onChange={e=>setDemo(e.target.checked)}/> Demonstração</label>
        <button type="button" className="closing-refresh" onClick={()=>void refresh()} disabled={pending}><RefreshCcw size={15}/> Atualizar</button>
      </div>
    </div>
    <div className="closing-filter-row">
      <label>Carteira<select value={carteira} onChange={e=>setCarteira(e.target.value)}><option value="Agibank Regular">Agibank · MBA</option><option value="Agibank Enter">Agibank · Enter</option></select></label>
      <label>Tipo<select value={tipo} onChange={e=>setTipo(e.target.value as Tipo)}>{TIPOS.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
      <label>Período<select value={periodo} onChange={e=>setPeriodo(e.target.value)}><option value="mes">Mês atual</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option><option value="all">Todo o histórico</option></select></label>
      <label>Etapa<select value={etapa} onChange={e=>setEtapa(e.target.value as Etapa)}>
        <option value="validados">Validados</option>
        <option value="enviados_benner">Enviados ao Benner</option>
      </select></label>
      <label>Analista<select value={analista} onChange={e=>setAnalista(e.target.value)}><option value="todos">Todos</option><option value="gabriel">Gabriel</option><option value="elias">Elias</option><option value="gessica">Géssica</option></select></label>
    </div>
    {!demo && error ? <p className="closing-error" role="alert">{error}</p> : null}
    <Metrics dados={shown} demo={demo} acordo={tipo==='ACORDO'} analista={analista} selectedCount={analysed} etapa={etapa}/>
    <div className="closing-main-grid">
      <MapPanel dados={shown}/>
      <Composition dados={shown} etapa={etapa} periodo={periodo} analista={analista}/>
    </div>
    <div className="closing-lower-grid">
      <ComarcasPanel dados={shown} etapa={etapa} analista={analista}/>
      <AnalystsPanel analysts={analysts}/>
    </div>
    <p className="closing-disclaimer">{demo ? 'Dados demonstrativos — sem impacto na base.' : 'Acordos não integram oportunidades aptas ao encerramento.'}</p>
  </div>;
}
