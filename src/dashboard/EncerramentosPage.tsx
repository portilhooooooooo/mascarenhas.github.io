import { useCallback, useEffect, useMemo, useState } from 'react';
import { Activity, BarChart3, CheckCircle2, Clock3, MapPinned, RefreshCcw, SearchCheck, UsersRound, Wallet } from 'lucide-react';
import { BRAZIL_STATES } from './brazilStates';
import './encerramentos.css';

type Tipo = 'TODOS' | 'VITORIA' | 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'ACORDO' | 'EXTINCAO';
type VisaoMapa = 'vitorias' | 'derrotas' | 'tkm';
type Modo = 'encontrados' | 'meta';
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
const AGES = ['0 a 3 meses', '3 a 10 meses', 'Mais de 10 meses', 'Sem tag / não reconhecida'];
const STAFF = [
  { id: 'demo-gabriel', nome: 'Gabriel', analisados: 43 },
  { id: 'demo-elias', nome: 'Elias', analisados: 31 },
  { id: 'demo-gessica', nome: 'Géssica', analisados: 26 },
];
const num = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
const money = (value: Numero | undefined) => value == null ? '—' : new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 2 }).format(value);
const percent = (value: number) => value.toFixed(1).replace('.', ',') + '%';
const captionTipo = (value: string) => CLASSES.find(t => t.tipo === value)?.label || value;
const valueOrZero = (value: number | undefined | null) => Number(value || 0);

function localISO(daysBack: number): string {
  const now = new Date(); now.setDate(now.getDate() - daysBack);
  return [now.getFullYear(), String(now.getMonth() + 1).padStart(2, '0'), String(now.getDate()).padStart(2, '0')].join('-');
}

async function loadDashboard(carteira: string, tipo: Tipo, periodo: string, analista: string): Promise<Dados> {
  const api = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!api) throw new Error('Conexão com a API indisponível.');
  const query = new URLSearchParams({ carteira, tipo });
  if (periodo === '30') query.set('inicio', localISO(29));
  if (periodo === '90') query.set('inicio', localISO(89));
  if (analista !== 'todos') query.set('analista', analista);
  return api.request<Dados>('/api/operacao/encerramentos/dashboard?' + query.toString());
}

/** Números fictícios, calculados exclusivamente na interface de demonstração. */
function makeDemo(carteira: string, tipo: Tipo, periodo: string): Dados {
  const factor = (periodo === '30' ? .23 : periodo === '90' ? .55 : 1) * (carteira === 'Agibank Enter' ? .72 : 1);
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
  const matriz: Matriz[] = divided.flatMap((row, index) => {
    const weights = [0.3 + index * .016, .33, .30 - index * .012, .07 - index * .004];
    const numbers = weights.map((weight, i) => i === 3 ? 0 : Math.round(row.quantidade * weight));
    numbers[3] = Math.max(0, row.quantidade - numbers[0] - numbers[1] - numbers[2]);
    return AGES.map((faixa, i) => ({ tipo: row.tipo, faixa, quantidade: numbers[i] }));
  });
  const aging: AgingRow[] = AGES.map(faixa => ({ faixa, quantidade: matriz.filter(m => m.faixa === faixa).reduce((v, m) => v + m.quantidade, 0) }));
  const map: Uf[] = BRAZIL_STATES.map((state, i) => ({
    uf: state.uf,
    vitorias: Math.round((selected.find(x => x.tipo === 'VITORIA')?.quantidade || 0) * (5 + (i * 13 % 19)) / 345),
    derrotas: Math.round((divided[0].quantidade + divided[1].quantidade) * (5 + (i * 7 % 21)) / 390),
    tkm: 6100 + ((i * 1337) % 9100),
    amostra: 7 + (i % 16),
  }));
  const demoComarcas = [
    ['Porto Alegre', 'RS', 115], ['São Paulo', 'SP', 94], ['Rio de Janeiro', 'RJ', 76],
    ['Campo Grande', 'MS', 63], ['Florianópolis', 'SC', 54], ['Salvador', 'BA', 48],
  ] as const;
  return {
    carteira, tipo: tipo === 'TODOS' ? null : tipo,
    indicadores: { consultados: Math.round(found * 1.4), encontrados: found, analisados: 100, ticket_medio: 9356.74, ticket_amostra: 420, aging_medio: 224 },
    aging, estados: [], analistas: STAFF, classificacoes: classification,
    distribuicao_tipos: divided, matriz, mapa: map,
    comarcas: ['DERROTA','DERROTA_VOLUNTARIA','TODOS'].includes(tipo)
      ? demoComarcas.map(([comarca, uf, derrotas]) => ({ comarca, uf, derrotas: Math.round(derrotas * factor) }))
      : [],
    meta_configurada: true,
  };
}

function Metrics({ dados, demo, analista, selectedCount, acordo }: { dados: Dados | null; demo: boolean; analista: string; selectedCount: number | undefined; acordo: boolean }) {
  const m = dados?.indicadores;
  const accord = dados?.distribuicao_tipos.find(c => c.tipo === 'ACORDO')?.quantidade;
  const cards = [
    { icon: SearchCheck, name: acordo ? 'Indícios de acordo' : 'Encontrados', value: m ? num(acordo ? valueOrZero(accord) : m.encontrados) : '—', sub: m ? num(m.consultados) + ' consultados' : 'Sem dados' },
    { icon: CheckCircle2, name: 'Analisados', value: selectedCount === undefined ? '—' : num(selectedCount), sub: analista !== 'todos' ? 'Analista selecionado' : 'Análises registradas' },
    { icon: Wallet, name: 'Ticket médio', value: money(m?.ticket_medio), sub: m ? num(m.ticket_amostra) + ' pagamentos' : 'Sem pagamentos' },
    { icon: Clock3, name: 'Aging médio', value: m?.aging_medio == null ? '—' : (m.aging_medio / 30.44).toFixed(1).replace('.', ',') + ' meses', sub: 'Desde a entrada da pasta' },
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

function MapPanel({ dados, demo }: { dados: Dados | null; demo: boolean }) {
  const [lens, setLens] = useState<VisaoMapa>('derrotas');
  const [mode, setMode] = useState<Modo>('encontrados');
  const [selected, setSelected] = useState<string | null>(null);
  const available = mode === 'encontrados' || demo || dados?.meta_configurada === true;
  const stats = useMemo(() => {
    const payments = new Map((dados?.estados || []).map(item => [item.uf, item]));
    return (dados?.mapa || []).map(item => ({
      ...item,
      tkm: demo ? item.tkm : payments.get(item.uf)?.ticket_medio ?? null,
      amostra: demo ? item.amostra : payments.get(item.uf)?.amostra || 0,
    }));
  }, [dados, demo]);
  const byUF = new Map(stats.map(row => [row.uf, row]));
  const readMetric = (item: Uf) => {
    const val = lens === 'vitorias' ? item.vitorias : lens === 'derrotas' ? item.derrotas : item.tkm;
    return val == null ? null : mode === 'meta' ? (demo ? Math.round(val * 1.15) : null) : val;
  };
  const ranked = available ? stats.filter(s => readMetric(s) !== null).sort((a,b) => (readMetric(b) || 0) - (readMetric(a) || 0)).slice(0,6) : [];
  const ceiling = Math.max(1, ...ranked.map(row => valueOrZero(readMetric(row))));
  const current = selected ? byUF.get(selected) : undefined;
  return <section className="closing-surface closing-map">
    <div className="closing-card-head">
      <div><h2>Distribuição dos encerramentos</h2><p>Por unidade federativa</p></div>
      <Choice value={mode} onChange={v => setMode(v as Modo)} options={[{value:'encontrados',label:'Encontrados'},{value:'meta',label:'Meta'}]}/>
    </div>
    <div className="closing-map-tabs" aria-label="Visão do mapa">
      <Choice value={lens} onChange={v => setLens(v as VisaoMapa)}
        options={[{value:'vitorias',label:'Vitórias'},{value:'derrotas',label:'Derrotas'},{value:'tkm',label:'Maior TKM'}]}/>
    </div>
    {!available ? <div className="closing-unset">Meta não configurada</div> :
      <div className="closing-map-layout-v2">
        <svg viewBox="0 0 690 690" className="closing-map-svg" aria-label="Mapa do Brasil por UF" role="img">
          {BRAZIL_STATES.map(state => {
            const value = byUF.get(state.uf) ? readMetric(byUF.get(state.uf)!) : null;
            const shade = value === null ? .06 : .16 + .68 * Math.sqrt(Math.max(0,value) / ceiling);
            return <path key={state.uf} d={state.path} className={'closing-map-state' + (selected === state.uf ? ' selected' : '')}
              style={{ fill: value === null ? '#e8edf5' : 'rgba(20,43,103,' + shade + ')' }}
              role="button" tabIndex={0}
              onClick={() => setSelected(state.uf === selected ? null : state.uf)}
              onKeyDown={e => {if(e.key === 'Enter' || e.key === ' ') {e.preventDefault();setSelected(state.uf);}}}
              aria-label={state.name + ': ' + (value === null ? 'sem dados' : lens === 'tkm' ? money(value) : num(value))}
            ><title>{state.name}: {value === null ? 'sem dados' : lens === 'tkm' ? money(value) : num(value)}</title></path>;
          })}
        </svg>
        <div className="closing-map-ranking">
          {current ? <div className="closing-selected-uf"><span>{BRAZIL_STATES.find(s => s.uf === selected)?.name} · {selected}</span>
            <strong>{readMetric(current) == null ? '—' : lens === 'tkm' ? money(readMetric(current)) : num(readMetric(current)!)}</strong>
          </div> : null}
          <div className="closing-rank-head"><span>UF</span><span>{lens === 'tkm' ? 'Ticket médio' : 'Processos'}</span></div>
          {ranked.map(item => <div className="closing-rank-row" key={item.uf}><span>{item.uf}</span>
            <div className="closing-rank-bar"><i style={{width:(valueOrZero(readMetric(item))/ceiling*100)+'%'}}/></div>
            <strong>{lens === 'tkm' ? money(readMetric(item)) : num(readMetric(item)!)}</strong>
          </div>)}
          {!ranked.length && <p className="closing-nodata">Nenhum resultado</p>}
        </div>
      </div>}
    <div className="closing-card-foot">{lens === 'tkm' ? 'TKM considera apenas pagamentos liquidados.' : 'Selecione uma UF para detalhar.'}</div>
  </section>;
}

function Composition({ dados, demo }: { dados: Dados | null; demo: boolean }) {
  const [mode, setMode] = useState<Modo>('encontrados');
  const available = mode === 'encontrados' || demo || dados?.meta_configurada === true;
  const ratio = mode === 'meta' && demo ? 1.15 : 1;
  const matrix = dados?.matriz || [];
  const rawClasses = dados?.distribuicao_tipos || [];
  const types = CLASSES.map(row => ({
    ...row, count: available ? Math.round(valueOrZero(rawClasses.find(item => item.tipo === row.tipo)?.quantidade) * ratio) : 0,
  }));
  const ages = AGES.map(faixa => ({faixa, count: available ? Math.round(matrix.filter(item => item.faixa === faixa).reduce((s,c) => s + c.quantidade,0) * ratio) : 0}));
  const total = types.reduce((s,row) => s + row.count,0);
  const maxType = Math.max(1,...types.map(row => row.count));
  const maxAge = Math.max(1,...ages.map(row => row.count));
  const maxMatrix = Math.max(1,...matrix.map(row => row.quantidade));
  return <section className="closing-surface closing-composition">
    <div className="closing-card-head">
      <div><h2>Composição dos encerramentos</h2><p>Tipo × aging</p></div>
      <Choice value={mode} onChange={v => setMode(v as Modo)} options={[{value:'encontrados',label:'Encontrados'},{value:'meta',label:'Meta'}]}/>
    </div>
    {!available ? <div className="closing-unset">Meta não configurada</div> : <>
      <div className="closing-composition-top">
        <div><h3>Tipos</h3>
          {types.map(item => <div className="closing-smallbar" key={item.tipo}>
            <div className="closing-smallbar-label"><span>{item.label}</span><strong>{num(item.count)}</strong></div>
            <div className="closing-rail"><i style={{width:item.count/maxType*100+'%'}}/></div>
          </div>)}
        </div>
        <div><h3>Aging</h3>
          {ages.map(item => <div className="closing-smallbar" key={item.faixa}>
            <div className="closing-smallbar-label"><span>{item.faixa}</span><strong>{num(item.count)}</strong></div>
            <div className="closing-rail"><i style={{width:item.count/maxAge*100+'%'}}/></div>
          </div>)}
        </div>
      </div>
      <div className="closing-matrix-head"><h3>Cruzamento tipo × aging</h3><span>{num(total)} processos</span></div>
      <div className="closing-matrix-scroll"><table className="closing-matrix">
        <thead><tr><th>Tipo</th><th>0–3m</th><th>3–10m</th><th>10m+</th><th>Sem tag</th><th>Total</th></tr></thead>
        <tbody>{types.map(row => <tr key={row.tipo}><th>{row.label}</th>
          {AGES.map(faixa => {
            const raw = valueOrZero(matrix.find(cell => cell.tipo === row.tipo && cell.faixa === faixa)?.quantidade);
            const value = Math.round(raw * ratio);
            const opacity = .035 + Math.sqrt(raw/maxMatrix) * .28;
            return <td key={faixa} style={{background:'rgba(20,43,103,' + opacity + ')'}} title={row.label + ' / ' + faixa}>{num(value)}</td>;
          })}
          <td className="closing-matrix-total">{num(row.count)}</td></tr>)}</tbody>
      </table></div>
    </>}
  </section>;
}

function ComarcasPanel({ dados }: { dados: Dados | null }) {
  const comarcas = dados?.comarcas || [];
  const max = Math.max(1,...comarcas.map(c => c.derrotas));
  return <section className="closing-surface closing-bottom">
    <div className="closing-card-head"><div><h2>Comarcas com mais derrotas</h2><p>Top 6 no período</p></div></div>
    {comarcas.length ? <div className="closing-comarca-list">
      {comarcas.slice(0,6).map((c,index) => <div className="closing-comarca-row" key={c.uf+c.comarca}>
        <span className="closing-index">{String(index+1).padStart(2,'0')}</span>
        <div><strong>{c.comarca}</strong><small>{c.uf}</small></div>
        <div className="closing-rail"><i style={{width:c.derrotas/max*100+'%'}}/></div>
        <b>{num(c.derrotas)}</b>
      </div>)}
    </div> : <p className="closing-nodata">Nenhuma comarca com derrota no recorte.</p>}
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
  const [periodo,setPeriodo] = useState('all');
  const [analista,setAnalista] = useState('todos');
  const [demo,setDemo] = useState(true);
  const [dados,setDados] = useState<Dados | null>(null);
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  const refresh = useCallback(async () => {
    setPending(true);
    try { const result = await loadDashboard(carteira,tipo,periodo,analista); setDados(result); setError(''); }
    catch (cause) { setError(cause instanceof Error ? cause.message : 'Erro ao carregar encerramentos.'); }
    finally { setPending(false); }
  },[carteira,tipo,periodo,analista]);
  useEffect(() => {void refresh();},[refresh]);
  useEffect(() => { const id = window.setInterval(() => {if(!document.hidden)void refresh();},60000); return () => clearInterval(id);},[refresh]);
  const fake = useMemo(() => makeDemo(carteira,tipo,periodo),[carteira,tipo,periodo]);
  const shown = demo ? fake : dados;
  const analysts = demo ? STAFF.filter(a => analista==='todos' || a.id==='demo-'+analista) : (dados?.analistas || []);
  const analysed = demo ? analysts.reduce((v,a)=>v+a.analisados,0) : shown?.indicadores.analisados;

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
      <label>Período<select value={periodo} onChange={e=>setPeriodo(e.target.value)}><option value="all">Todo o histórico</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option></select></label>
      <label>Analista<select value={analista} onChange={e=>setAnalista(e.target.value)}><option value="todos">Todos</option><option value="gabriel">Gabriel</option><option value="elias">Elias</option><option value="gessica">Géssica</option></select></label>
    </div>
    {!demo && error ? <p className="closing-error" role="alert">{error}</p> : null}
    <Metrics dados={shown} demo={demo} acordo={tipo==='ACORDO'} analista={analista} selectedCount={analysed}/>
    <div className="closing-main-grid">
      <MapPanel dados={shown} demo={demo}/>
      <Composition dados={shown} demo={demo}/>
    </div>
    <div className="closing-lower-grid">
      <ComarcasPanel dados={shown}/>
      <AnalystsPanel analysts={analysts}/>
    </div>
    <p className="closing-disclaimer">{demo ? 'Dados demonstrativos — sem impacto na base.' : 'Acordos não integram oportunidades aptas ao encerramento.'}</p>
  </div>;
}
