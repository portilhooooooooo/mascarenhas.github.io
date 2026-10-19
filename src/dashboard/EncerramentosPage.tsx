import { useCallback, useEffect, useRef, useState } from 'react';
import { Activity, CheckCircle2, ClipboardList, Clock3, RefreshCcw, SearchCheck, Send, UsersRound } from 'lucide-react';
import { regularAgingGoals, regularAgingSummary } from './closingAgingGoals';
import './encerramentos.css';

type Tipo = 'TODOS' | 'VITORIA' | 'DERROTA' | 'DERROTA_VOLUNTARIA' | 'ACORDO' | 'EXTINCAO';
type Etapa = 'validados' | 'enviados_benner';
type Numero = number | null;
type TipoRow = { tipo: string; quantidade: number };
type AgingRow = { faixa: string; quantidade: number };
type Analista = { id: string; nome: string; analisados: number };
type Uf = { uf: string; vitorias: number; derrotas: number; tkm?: Numero; amostra?: number };
type Comarca = { comarca: string; uf: string; derrotas: number };
type Matriz = { tipo: string; faixa: string; quantidade: number };
type Indicadores = { consultados: number; encontrados: number; analisados: number; ticket_medio: Numero; ticket_amostra: number; aging_medio: Numero };
type ResumoBennerAnterior = {
  periodo_inicio: string;
  periodo_fim_exclusivo: string;
  enviados: number;
  encerrados: number;
  em_andamento: number;
  fonte: string;
  historico?: {
    total: number;
    processos_unicos: number;
    encerrados: number;
    em_andamento: number;
    mes_atual: number;
    ultimo_andamento_em: string | null;
    ultima_importacao: string | null;
    tipos: TipoRow[];
  };
};
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
  { tipo: 'EXTINCAO', label: 'Extinção' },
];
const ageBands = (carteira: string) => carteira === 'Agibank Regular'
  ? ['0–12 meses', '12–24 meses', '>24 meses', 'Sem tag / não reconhecida']
  : ['0–3 meses', '4–10 meses', '>10 meses', 'Sem tag / não reconhecida'];
const num = (value: number) => new Intl.NumberFormat('pt-BR').format(value);
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

type MotivoDerrotaTask = { type: string; status: string; total_processes: number; completed_processes: number };
async function loadMotivosDerrotaPendentes(): Promise<number> {
  const api = (window as Window & { MBA_AUTOMATION_API?: BackofficeApi }).MBA_AUTOMATION_API;
  if (!api) throw new Error('Conexão com a API indisponível.');
  // Tasks expose the existing operational counter. Never infer pending reasons
  // from DERROTA_VOLUNTARIA cases or the DataJud classification.
  const tasks = await api.request<MotivoDerrotaTask[]>('/api/tasks?type=motivo_derrota&scope=all');
  if (!Array.isArray(tasks)) throw new Error('Resposta inválida da fila de motivos de derrota.');
  return tasks
    .filter(task => task.type === 'motivo_derrota' && ['pending', 'in_progress'].includes(task.status))
    .reduce((sum, task) => sum + Math.max(0, Number(task.total_processes || 0) - Number(task.completed_processes || 0)), 0);
}


function Metrics({ dados, selectedCount, etapa, acordo }: {dados: Dados | null; selectedCount: number | undefined; etapa: Etapa; acordo: boolean}) {
  const m = dados?.indicadores;
  const cards = [
    { icon: SearchCheck, label: acordo ? 'Indícios de acordo' : 'Encontrados', value: m ? num(acordo ? valueOrZero(dados?.distribuicao_tipos.find(t => t.tipo === 'ACORDO')?.quantidade) : m.encontrados) : '—', detail: 'Indícios identificados' },
    { icon: UsersRound, label: 'Analisados', value: m ? num(m.analisados) : '—', detail: 'Análises registradas' },
    { icon: CheckCircle2, label: etapa === 'validados' ? 'Aptos validados' : 'Enviados ao Benner', value: selectedCount == null ? '—' : num(selectedCount), detail: 'Etapa selecionada' },
    { icon: Activity, label: 'Em revisão', value: dados?.analises_humanas ? num(dados.analises_humanas.revisao) : '—', detail: 'Aguardando validação' },
  ];
  return <section className="closing-kpis" aria-label="Indicadores operacionais">
    {cards.map(card => <article className="closing-kpi" key={card.label}>
      <div className="closing-kpi-top"><span>{card.label}</span><card.icon size={16} strokeWidth={1.75}/></div>
      <strong>{card.value}</strong><small>{card.detail}</small>
    </article>)}
  </section>;
}

function AgingPanel({ dados, etapa, tipo, analista, inicio, fim }: {
  dados: Dados | null; etapa: Etapa; tipo: Tipo; analista: string; inicio: string; fim: string;
}) {
  const regular = dados?.carteira !== 'Agibank Enter';
  const counts = dados?.etapas?.aging || [];
  const total = valueOrZero(dados?.etapas?.total);
  const stageLabel = etapa === 'validados' ? 'Validados' : 'Enviados ao Benner';
  const currentMonthStart = localISO(0).slice(0,7) + '-01';
  const fullMonth = inicio === currentMonthStart && fim === localISO(0) && tipo === 'TODOS' && analista === 'todos';
  const goals = regular ? regularAgingGoals(counts, total) : [];
  const summary = regularAgingSummary(goals);
  const enterBands = ['0–3 meses', '4–10 meses', '>10 meses'];
  const rows = regular ? goals.map(goal => ({
    label: goal.label, atual: goal.atual, meta: goal.meta, gap: goal.gap,
    achieved: goal.atingidoPercent,
    composition: goal.composicaoPercent,
  })) : enterBands.map(faixa => {
    const atual = valueOrZero(counts.find(row => row.faixa === faixa)?.quantidade);
    return { label: faixa, atual, meta: null, gap: null, achieved: total ? atual / total * 100 : 0, composition: total ? atual / total * 100 : 0 };
  });
  const found = rows.reduce((sum,row) => sum+row.atual,0);
  const unclassified = Math.max(0,total-found);
  const totalAchieved = summary.meta ? Math.max(0,Math.min(100,(summary.meta-summary.gap)/summary.meta*100)) : 0;
  return <section className="closing-surface closing-aging" aria-label="Metas e distribuição por aging">
    <header className="closing-card-head">
      <div><h2>{regular ? 'Metas de aging' : 'Distribuição por aging'}</h2><p>{stageLabel} · {num(total)} processos no recorte</p></div>
      {regular && dados?.etapas && <div className="closing-aging-summary">
        <span>GAP total</span>
        <strong>{num(summary.gap)} <small>processos</small></strong>
        <span>{percent(totalAchieved)} da meta cumprida</span>
      </div>}
    </header>
    {!dados?.etapas
      ? <p className="closing-nodata">Aguardando dados de aging.</p>
      : <div className="closing-aging-cards">{rows.map(row => <article className="closing-aging-card" key={row.label}>
        <div className="closing-aging-card-title"><strong>{row.label}</strong><span>{regular ? 'Meta: ' + num(row.meta || 0) : 'Distribuição'}</span></div>
        <div className="closing-aging-card-value"><strong>{num(row.atual)}</strong><span>{regular ? ' / ' + num(row.meta || 0) + ' processos' : ' processos'}</span></div>
        <div className="closing-rail closing-progress"><i style={{width: Math.max(0,Math.min(100,row.achieved)) + '%'}}/></div>
        <div className="closing-aging-card-foot">
          <span>{regular ? percent(row.achieved) + ' da meta' : percent(row.composition) + ' da composição'}</span>
          {regular && <strong className={row.gap === 0 ? 'complete' : ''}>{row.gap === 0 ? 'Meta atingida' : 'Faltam ' + num(row.gap || 0)}</strong>}
        </div>
      </article>)}</div>}
    {dados?.etapas && <div className="closing-aging-note">
      {unclassified > 0 && <span>{num(unclassified)} sem faixa de aging. </span>}
      {regular && !fullMonth && <span>Para acompanhar a meta mensal, selecione o mês atual, todos os tipos e analistas. </span>}
      <span>{regular ? 'Metas calculadas sobre a etapa selecionada; não equivalem à baixa efetiva no Benner.' : 'Faixas da carteira Enter.'}</span>
    </div>}
  </section>;
}

function CompositionPanel({ dados, etapa, isNubank }: {dados: Dados | null; etapa: Etapa; isNubank: boolean}) {
  const types = dados?.etapas?.tipos || [];
  const bands = ageBands(dados?.carteira || 'Agibank Regular');
  const matrix = dados?.etapas?.matriz || [];
  const total = valueOrZero(dados?.etapas?.total);
  const count = (kind: string) => valueOrZero(types.find(item=>item.tipo===kind)?.quantidade);
  const rows = CLASSES.filter(item => !isNubank || item.tipo !== 'DERROTA_VOLUNTARIA').map(item=>({...item, quantity: count(item.tipo)}));
  const max = Math.max(1,...rows.map(row=>row.quantity));
  const other = Math.max(0,total-rows.reduce((sum,row)=>sum+row.quantity,0));
  return <section className="closing-surface closing-composition" aria-label="Composição dos encerramentos">
    <header className="closing-card-head"><div><h2>Composição dos encerramentos</h2><p>{etapa === 'validados' ? 'Validados' : 'Enviados ao Benner'} · {num(total)} processos</p></div></header>
    {dados?.etapas ? <>
      <div className="closing-composition-list">{rows.map(row=><div className="closing-composition-item" key={row.tipo}>
        <div className="closing-composition-line"><span>{row.label}</span><strong>{num(row.quantity)} <small>· {total ? percent(row.quantity/total*100) : '0,0%'}</small></strong></div>
        <div className="closing-rail"><i style={{width:(row.quantity/max*100)+'%'}}/></div>
      </div>)}</div>
      {other>0 && <p className="closing-composition-other">Outros ou não classificados: {num(other)}</p>}
      {!isNubank && total>0 && <details className="closing-details">
        <summary>Cruzamento por tipo e aging <span>Ver tabela</span></summary>
        <div className="closing-matrix-scroll"><table className="closing-matrix">
          <thead><tr><th>Tipo / Aging</th>{bands.map(band=><th key={band}>{band}</th>)}<th>Total</th></tr></thead>
          <tbody>{rows.map(row=><tr key={row.tipo}><th>{row.label}</th>
            {bands.map(band=><td key={band}>{num(valueOrZero(matrix.find(item=>item.tipo===row.tipo && item.faixa===band)?.quantidade))}</td>)}
            <td><strong>{num(row.quantity)}</strong></td></tr>)}</tbody>
        </table></div>
      </details>}
    </> : <p className="closing-nodata">Aguardando composição dos encerramentos.</p>}
  </section>;
}

function BennerHistory({ resumo, motivosPendentes, isNubank }: {resumo: ResumoBennerAnterior | null; motivosPendentes: number | null; isNubank: boolean}) {
  const historico = resumo?.historico;
  const classes = [
    { tipo: 'VITORIA', label: 'Vitórias' },
    { tipo: 'DERROTA', label: 'Derrotas' },
    { tipo: 'DERROTA_VOLUNTARIA', label: 'Derrotas voluntárias' },
    { tipo: 'ACORDO', label: 'Acordos' },
    { tipo: 'ERRO_CADASTRO', label: 'Erros de cadastro' },
  ];
  const latest = historico?.ultimo_andamento_em
    ? historico.ultimo_andamento_em.split('-').reverse().join('/')
    : '—';
  const cards = [
    { icon: Send, label: 'Andamentos do mês anterior', value: resumo ? num(resumo.enviados) : '—', detail: 'Histórico do Benner · mês anterior' },
    { icon: CheckCircle2, label: 'Baixas no mês anterior', value: resumo ? num(resumo.encerrados) : '—', detail: 'Encerrados conforme o extrato' },
    ...(!isNubank ? [
      { icon: Clock3, label: 'Sem baixa no mês anterior', value: resumo ? num(resumo.em_andamento) : '—', detail: 'Em andamento · não indica negativa' },
      { icon: ClipboardList, label: 'Motivo derrota pendente', value: motivosPendentes == null ? '—' : num(motivosPendentes), detail: 'Tarefas aguardando cadastro' },
    ] : []),
  ];
  return <>
    {!isNubank && historico && <section className="closing-surface closing-benner-historic" aria-label="Resultados históricos registrados no Benner">
      <header className="closing-card-head">
        <div>
          <h2>Andamentos registrados no Benner · histórico completo</h2>
          <p>Dados do extrato importado, separados dos envios confirmados pela automação</p>
        </div>
        <span className="closing-benner-last">Último andamento na fonte: {latest}</span>
      </header>
      <div className="closing-benner-historic-kpis">
        {[
          { label: 'Andamentos', value: historico.total },
          { label: 'Processos únicos', value: historico.processos_unicos },
          { label: 'Encerrados', value: historico.encerrados },
          { label: 'Em andamento', value: historico.em_andamento },
          { label: 'No mês atual', value: historico.mes_atual },
        ].map(item => <div className="closing-benner-historic-item" key={item.label}>
          <span>{item.label}</span><strong>{num(item.value)}</strong>
        </div>)}
      </div>
      <div className="closing-benner-historic-types">
        {classes.map(item => <span key={item.tipo}>{item.label}: <strong>{num(valueOrZero(historico.tipos.find(row => row.tipo === item.tipo)?.quantidade))}</strong></span>)}
      </div>
      <p className="closing-benner-historic-note">Este bloco apresenta todo o histórico importado e não aplica os filtros de análise acima. O dado “No mês atual” utiliza a data do andamento no extrato.</p>
    </section>}
    <section className="closing-kpis closing-kpis-benner" aria-label="Histórico do mês anterior e pendências">
      {cards.map(card => <article className="closing-kpi" key={card.label}>
        <div className="closing-kpi-top"><span>{card.label}</span><card.icon size={16} strokeWidth={1.75}/></div>
        <strong>{card.value}</strong><small>{card.detail}</small>
      </article>)}
    </section>
  </>;
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
    return id === 'nubank_mba' || id === 'nubank' ? 'Nubank' : id === 'agibank_enter' ? 'Agibank Enter' : 'Agibank Regular';
  });
  const [tipo,setTipo] = useState<Tipo>('TODOS');
  const [inicio,setInicio] = useState(() => { const now = new Date(); return [now.getFullYear(),String(now.getMonth()+1).padStart(2,'0'),'01'].join('-'); });
  const [fim,setFim] = useState(() => localISO(0));
  const [analista,setAnalista] = useState('todos');
  const [etapa,setEtapa] = useState<Etapa>('validados');
  const [dados,setDados] = useState<Dados | null>(null);
  const [resumoBenner,setResumoBenner] = useState<ResumoBennerAnterior | null>(null);
  const [motivosPendentes,setMotivosPendentes] = useState<number | null>(null);
  const [snapshotRevision,setSnapshotRevision] = useState(0);
  const [pending,setPending] = useState(false);
  const [error,setError] = useState('');
  const refreshSequence = useRef(0);
  const activeRequest = useRef<{ key: string; sequence: number } | null>(null);
  // The page can remain mounted while the authenticated portfolio changes.
  // A stale disabled portfolio selector previously caused INVALID_FILTERS 400s.
  useEffect(() => {
    const syncPortfolio = () => {
      const id=(window as Window & {MBA_API?:{getPortfolioId?:()=>string}}).MBA_API?.getPortfolioId?.();
      const next=id==='nubank_mba'||id==='nubank'?'Nubank':id==='agibank_enter'?'Agibank Enter':'Agibank Regular';
      refreshSequence.current += 1;
      // A portfolio event can re-select the same portfolio. Re-fetch anyway
      // instead of clearing the KPIs with no state dependency to reload them.
      setPortfolioRevision(revision => revision + 1);
      setCarteira(next);
      setDados(null);
      setResumoBenner(null);
      setMotivosPendentes(null);
      setError('');
    };
    window.addEventListener('mba:portfolio-changed',syncPortfolio);
    return () => window.removeEventListener('mba:portfolio-changed',syncPortfolio);
  },[]);
  const isNubank = carteira === 'Nubank';
  const visibleTypes = isNubank ? TIPOS.filter(item => item.value !== 'DERROTA_VOLUNTARIA') : TIPOS;
  useEffect(() => { if (isNubank && tipo === 'DERROTA_VOLUNTARIA') setTipo('TODOS'); }, [isNubank, tipo]);
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

  // Benner reflects the previous calendar month; pending reasons reflect
  // the current task queue. Reload independently, without zeroing missing data.
  useEffect(() => {
    let active = true;
    void loadResumoBennerAnterior()
      .then(value => { if (active) setResumoBenner(value); })
      .catch(() => { if (active) setResumoBenner(null); });
    if (!isNubank) void loadMotivosDerrotaPendentes()
      .then(value => { if (active) setMotivosPendentes(value); })
      .catch(() => { if (active) setMotivosPendentes(null); });
    return () => { active = false; };
  },[carteira,portfolioRevision,snapshotRevision,isNubank]);

  // Events drive normal updates. The 5-minute check recovers missed events.
  useEffect(() => {
    const update = () => { if (!document.hidden) { void refresh(); setSnapshotRevision(value => value + 1); } };
    const id = window.setInterval(update,300000);
    const visible = update;
    document.addEventListener('visibilitychange', visible);
    return () => {window.clearInterval(id);document.removeEventListener('visibilitychange',visible);};
  },[refresh]);
  useEffect(() => {
    let timeout: number | undefined;
    const schedule = () => {
      if (document.hidden) return;
      window.clearTimeout(timeout);
      timeout = window.setTimeout(() => { void refresh(); setSnapshotRevision(value => value + 1); },350);
    };
    const onRealtime = (event: Event) => {
      const module = (event as CustomEvent<{module?: string}>).detail?.module;
      if (module === 'encerramentos' || module === 'tarefas') schedule();
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
        <button type="button" className="closing-refresh" onClick={() => { void refresh(); setSnapshotRevision(value => value + 1); }} disabled={pending}><RefreshCcw size={15}/> Atualizar</button>
      </div>
    </div>
    <div className="closing-filter-row">
      <label>Carteira<select value={carteira} disabled aria-label="Carteira atual autorizada"><option value="Agibank Regular">Agibank · MBA</option><option value="Agibank Enter">Agibank · Enter</option><option value="Nubank">Nubank · MBA</option></select></label>
      <label>Tipo<select value={tipo} onChange={e=>setTipo(e.target.value as Tipo)}>{visibleTypes.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}</select></label>
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
    <Metrics dados={shown} selectedCount={analysed} etapa={etapa} acordo={tipo==='ACORDO'}/>
    <BennerHistory resumo={resumoBenner} motivosPendentes={motivosPendentes} isNubank={isNubank}/>
    {!isNubank && <AgingPanel dados={shown} etapa={etapa} tipo={tipo} analista={analista} inicio={inicio} fim={fim}/>}
    <div className="closing-secondary-grid">
      <CompositionPanel dados={shown} etapa={etapa} isNubank={isNubank}/>
      <AnalystsPanel analysts={analysts}/>
    </div>
    <details className="closing-territory">
      <summary><span>Detalhamento territorial</span><small>Comarcas com mais derrotas</small></summary>
      <ComarcasPanel dados={shown} etapa={etapa} analista={analista}/>
    </details>
    <p className="closing-disclaimer">Acordos não integram oportunidades aptas ao encerramento.</p>
  </div>;
}
