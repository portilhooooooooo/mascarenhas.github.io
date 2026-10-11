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
type ResumoBennerAnterior = { periodo_inicio: string; periodo_fim_exclusivo: string; enviados: number; encerrados: number; em_andamento: number; fonte: string };
type Dados = {
  carteira: string;
  tipo: string | null;
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
    { icon: Wallet, name: 'Ticket médio', value: money(stage?.ticket_medio), sub: stage ? num(valueOrZero(stage.ticket_amostra)) + ' pagamentos' : 'Sem pagamentos' },
    { icon: Clock3, name: 'Aging médio', value: stage?.aging_medio == null ? '—' : (stage.aging_medio / 30.44).toFixed(1).replace('.', ',') + ' meses', sub: 'Desde a entrada da pasta' },
    { icon: Activity, name: 'Em revisão', value: dados?.analises_humanas ? num(dados.analises_humanas.revisao) : '—', sub: 'Discordâncias aguardando validação' },
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

function Composition({ dados, etapa, periodo, analista }: { dados: Dados | null; etapa: Etapa; periodo: string; analista: string }) {
  const bands = ageBands(dados?.carteira || 'Agibank Regular');
  const types = dados?.etapas?.tipos || [];
  const ages = dados?.etapas?.aging || [];
  const first = etapa === 'validados' ? 'Validados' : 'Enviados';
  const currentMonth = periodo === 'mes';
  const quantity = (kind: string) => valueOrZero(types.find(row=>row.tipo===kind)?.quantidade);
  const typeCount = Math.max(1,...CLASSES.map(t=>quantity(t.tipo)));
  const rows = (section: 'tipos'|'aging') => section==='tipos'
    ? CLASSES.map(t=>({key:t.tipo,label:t.label,found:quantity(t.tipo)}))
    : bands.map((faixa,index)=>({
        key:faixa,label:faixa,found:valueOrZero(ages.find(a=>a.faixa===faixa)?.quantidade),
      }));
  return <section className="closing-surface closing-composition">
    <div className="closing-card-head"><div>
      <h2>Composição dos encerramentos</h2>
      <p>{etapa==='validados'?'Validados':'Enviados ao Benner'} · {currentMonth?'Mês atual':'Período selecionado'}</p>
    </div></div>
    {(['tipos','aging'] as const).map(section => <div className="closing-composition-table" key={section}>
      <div className="closing-breakdown-head">
        <h3>{section==='tipos'?'Tipos':'Aging'}</h3>
        <span>{first}</span>
      </div>
      {rows(section).map(row=><div className="closing-breakdown-row" key={row.key}>
        <div className="closing-breakdown-name">
          <span>{row.label}</span>
          <div className="closing-rail"><i style={{width:(row.found/(section==='tipos'?typeCount:Math.max(1,...rows('aging').map(x=>x.found))))*100+'%'}}/></div>
        </div>
        <strong>{num(row.found)}</strong>
        
        
      </div>)}
    </div>)}
    <div className="closing-card-foot">Análises efetivamente registradas; sem metas de ranking.</div>
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
  const [carteira,setCarteira] = useState(() => {
    const id = (window as Window & { MBA_API?: { getPortfolioId?: () => string } }).MBA_API?.getPortfolioId?.();
    return id === 'agibank_enter' ? 'Agibank Enter' : 'Agibank Regular';
  });
  const [tipo,setTipo] = useState<Tipo>('TODOS');
  const [periodo,setPeriodo] = useState('30');
  const [analista,setAnalista] = useState('todos');
  const [etapa,setEtapa] = useState<Etapa>('validados');
  const [dados,setDados] = useState<Dados | null>(null);
  const [resumoBenner,setResumoBenner] = useState<ResumoBennerAnterior | null>(null);
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  const refresh = useCallback(async () => {
    setPending(true);
    try {
      const [painel, historico] = await Promise.allSettled([
        loadDashboard(carteira,tipo,periodo,analista,etapa),
        loadResumoBennerAnterior(),
      ]);
      if (painel.status === 'fulfilled') { setDados(painel.value); setError(''); }
      else { setError(painel.reason instanceof Error ? painel.reason.message : 'Erro ao carregar encerramentos.'); }
      setResumoBenner(historico.status === 'fulfilled' ? historico.value : null);
    } finally { setPending(false); }
  },[carteira,tipo,periodo,analista,etapa]);
  useEffect(() => {void refresh();},[refresh]);
  useEffect(() => { const id = window.setInterval(() => {if(!document.hidden)void refresh();},60000); return () => clearInterval(id);},[refresh]);
  useEffect(() => {
    const onSaved = () => { void refresh(); };
    window.addEventListener('mba:closing-analysis-saved', onSaved);
    return () => window.removeEventListener('mba:closing-analysis-saved', onSaved);
  }, [refresh]);
  const shown = dados;
  const analysts = dados?.etapas?.analistas || dados?.analistas || [];
  const analysed = dados?.etapas?.total;

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
      <label>Período<select value={periodo} onChange={e=>setPeriodo(e.target.value)}><option value="mes">Mês atual</option><option value="30">Últimos 30 dias</option><option value="90">Últimos 90 dias</option><option value="all">Todo o histórico</option></select></label>
      <label>Etapa<select value={etapa} onChange={e=>setEtapa(e.target.value as Etapa)}>
        <option value="validados">Validados</option>
        <option value="enviados_benner">Enviados ao Benner</option>
      </select></label>
      <label>Analista<select value={analista} onChange={e=>setAnalista(e.target.value)}><option value="todos">Todos</option><option value="gabriel">Gabriel</option><option value="elias">Elias</option><option value="gessica">Géssica</option></select></label>
    </div>
    {error ? <p className="closing-error" role="alert">{error}</p> : null}
    <Metrics dados={shown} acordo={tipo==='ACORDO'} analista={analista} selectedCount={analysed} etapa={etapa} resumo={resumoBenner}/>
    <div className="closing-main-grid">
      <MapPanel dados={shown}/>
      <Composition dados={shown} etapa={etapa} periodo={periodo} analista={analista}/>
    </div>
    <div className="closing-lower-grid">
      <ComarcasPanel dados={shown} etapa={etapa} analista={analista}/>
      <AnalystsPanel analysts={analysts}/>
    </div>
    <p className="closing-disclaimer">Acordos não integram oportunidades aptas ao encerramento. Os números exibidos dependem da fonte operacional.</p>
  </div>;
}
