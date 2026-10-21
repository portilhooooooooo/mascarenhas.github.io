import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, Download, Search, Send, Target, UsersRound, X } from 'lucide-react';
import { getClosingCases, type ClosingCase, type ClosingStatus } from './operacaoEncerramentosService';
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
  acuracia_originaria?: { confirmados: number; avaliados: number };
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



type ClosingCard = 'analisados' | 'acuracia' | 'aptidoes' | 'benner' | 'motivo';
const CARD_LABELS: Record<ClosingCard, string> = {
  analisados: 'Analisados', acuracia: 'Acurácia', aptidoes: 'Aptidões',
  benner: 'Enviados ao Benner', motivo: 'Motivo derrota',
};
const closingCnj = (value: string) => {
  const digits = String(value || '').replace(/\D/g, '');
  return digits.length === 20
    ? digits.slice(0,7)+'-'+digits.slice(7,9)+'.'+digits.slice(9,13)+'.'+digits.slice(13,14)+'.'+digits.slice(14,16)+'.'+digits.slice(16)
    : value;
};
function saveClosingCsv(rows: ClosingCase[]) {
  const cells = [['CNJ','Pasta','Resultado','Analista','Validado em','Situação Benner'],
    ...rows.map(row => [closingCnj(row.cnj),row.pasta || '',row.tipo_validado || '',row.analista_id || '',
      row.validado_em || '',row.status_envio || ''])];
  const csv = '\ufeff' + cells.map(line=>line.map(v=>'"'+String(v).replace(/"/g,'""')+'"').join(';')).join('\r\n');
  const url = URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const a = document.createElement('a'); a.href=url;a.download='encerramentos_consulta.csv';
  document.body.appendChild(a);a.click();a.remove();URL.revokeObjectURL(url);
}
/** Drill-down de leitura: nunca mistura a contagem da BI com a contagem da fila operacional. */
function ClosingDetailsDialog({kind,onClose}: {kind:ClosingCard;onClose:()=>void}) {
  const [query,setQuery] = useState('');
  const [search,setSearch] = useState('');
  const [page,setPage] = useState(1);
  const [items,setItems] = useState<ClosingCase[]>([]);
  const [total,setTotal] = useState<number | null>(null);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const listStatus: ClosingStatus | null =
    kind==='aptidoes'?'APTOS':kind==='benner'?'ENVIADOS_BENNER':kind==='motivo'?'DERROTA':null;
  const pageSize=20;
  useEffect(()=>{
    if(!listStatus)return;
    let active=true;
    setBusy(true);setError('');
    void getClosingCases(listStatus,pageSize,(page-1)*pageSize,search,
      kind==='motivo'?'nao':'todos')
      .then(data=>{if(active){setItems(data.rows || []);setTotal(data.total);}})
      .catch(cause=>{if(active){setError(cause instanceof Error?cause.message:'Consulta indisponível.');setItems([]);setTotal(null);}})
      .finally(()=>{if(active)setBusy(false);});
    return()=>{active=false};
  },[listStatus,page,search,kind]);
  useEffect(()=>{
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose();};
    window.addEventListener('keydown',onKey);
    const old=document.body.style.overflow;
    document.body.style.overflow='hidden';
    return()=>{window.removeEventListener('keydown',onKey);document.body.style.overflow=old;};
  },[onClose]);
  const pages=Math.max(1,Math.ceil((total||0)/pageSize));
  return <div className="closing-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section role="dialog" aria-modal="true" aria-label={CARD_LABELS[kind]} className="closing-dialog">
      <header className="closing-dialog-head">
        <h2>{CARD_LABELS[kind]}</h2>
        <button type="button" onClick={onClose} aria-label="Fechar detalhes"><X size={18}/></button>
      </header>
      {!listStatus ? <div className="closing-dialog-empty" role="status">
        A relação de CNJs deste indicador ainda não é disponibilizada pela API de Resultados.
      </div> : <>
        <div className="closing-dialog-toolbar">
          <form onSubmit={event=>{event.preventDefault();setPage(1);setSearch(query);}}>
            <Search size={15}/><input value={query} onChange={event=>setQuery(event.target.value)}
              placeholder="Buscar CNJ" aria-label="Buscar CNJ"/>
            <button type="submit">Buscar</button>
          </form>
          <button type="button" onClick={()=>saveClosingCsv(items)} disabled={!items.length} title="Exporta a página carregada">
            <Download size={15}/>CSV
          </button>
        </div>
        <p className="closing-dialog-source">Relação da fila operacional · os totais podem diferir dos indicadores do período.</p>
        {error && <p className="closing-error" role="alert">{error}</p>}
        <div className="closing-dialog-table-wrap">
          <table className="closing-dialog-table">
            <thead><tr><th>CNJ</th><th>Pasta</th><th>Classificação</th><th>Analista</th><th>Benner</th></tr></thead>
            <tbody>{items.map(row=><tr key={row.cnj}>
              <td><strong>{closingCnj(row.cnj)}</strong></td>
              <td>{row.pasta || '—'}</td><td>{row.tipo_validado || '—'}</td>
              <td>{row.analista_id || '—'}</td><td>{row.status_envio || '—'}</td>
            </tr>)}</tbody>
          </table>
          {!busy&&!items.length&&!error&&<div className="closing-dialog-empty">Nenhum registro encontrado.</div>}
          {busy&&<div className="closing-dialog-empty" role="status">Consultando registros…</div>}
        </div>
        <footer className="closing-dialog-footer">
          <span>{total === null ? '—' : num(total)} registros na fila</span>
          <nav aria-label="Páginas da consulta">
            <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={busy||page===1} aria-label="Anterior"><ChevronLeft size={16}/></button>
            <span>{page} / {pages}</span>
            <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={busy||page>=pages} aria-label="Próxima"><ChevronRight size={16}/></button>
          </nav>
        </footer>
      </>}
    </section>
  </div>;
}

function Metrics({ dados, enviados, motivosPendentes, onOpen }: {
  dados: Dados | null; enviados: Dados | null; motivosPendentes: number | null;
  onOpen: (kind:ClosingCard)=>void;
}) {
  const aptos=dados?.etapas?.total;
  const sent=enviados?.etapas?.total;
  const accuracy=dados?.acuracia_originaria;
  const cards: Array<{key:ClosingCard;icon:typeof UsersRound;value:string}> = [
    {key:'analisados',icon:UsersRound,value:dados ? num(dados.indicadores.analisados):'—'},
    {key:'acuracia',icon:Target,value:accuracy && accuracy.avaliados>0 ? percent(accuracy.confirmados/accuracy.avaliados*100):'—'},
    {key:'aptidoes',icon:CheckCircle2,value:aptos == null ? '—':num(aptos)},
    {key:'benner',icon:Send,value:aptos != null && sent != null && aptos>0 && sent<=aptos ? percent(sent/aptos*100):'—'},
    {key:'motivo',icon:ClipboardList,value:motivosPendentes == null ? '—':num(motivosPendentes)},
  ];
  return <section className="closing-kpis closing-kpis-main" aria-label="Indicadores operacionais">
    {cards.map(card=><button className="closing-kpi closing-kpi-button" type="button"
      key={card.key} onClick={()=>onOpen(card.key)}
      aria-label={CARD_LABELS[card.key]+': '+card.value+'. Ver relação'}>
      <div className="closing-kpi-top"><span>{CARD_LABELS[card.key]}</span><card.icon size={15} strokeWidth={1.7}/></div>
      <strong>{card.value}</strong>
    </button>)}
  </section>;
}


function AgingPanel({ dados, tipo, inicio, fim }: {
  dados: Dados | null; tipo: Tipo; inicio: string; fim: string;
}) {
  const regular = dados?.carteira !== 'Agibank Enter';
  const counts=dados?.etapas?.aging || [];
  const total=valueOrZero(dados?.etapas?.total);
  const monthStart=localISO(0).slice(0,7)+'-01';
  const isMonth=inicio===monthStart && fim===localISO(0) && tipo==='TODOS';
  const goals=regular?regularAgingGoals(counts,total):[];
  const summary=regularAgingSummary(goals);
  const enterBands=['0–3 meses','4–10 meses','>10 meses'];
  const rows=regular?goals.map(goal=>({label:goal.label,atual:goal.atual,
    meta:goal.meta,achieved:goal.atingidoPercent})):
    enterBands.map(faixa=>{
      const atual=valueOrZero(counts.find(row=>row.faixa===faixa)?.quantidade);
      return {label:faixa,atual,meta:0,achieved:total?atual/total*100:0};
    });
  const achievement=summary.meta>0?summary.atual/summary.meta*100:0;
  return <section className="closing-surface closing-aging" aria-label="Meta de aging">
    <header className="closing-card-head closing-goal-head">
      <h2>{regular?'Meta de aging':'Distribuição por aging'}</h2>
      {regular && dados?.etapas && <div className="closing-goal-summary" aria-label="Cumprimento da meta">
        <strong>{num(summary.atual)} <span>/ {num(summary.meta)}</span></strong>
        <b>{percent(achievement)}</b>
        <small>Faltam {num(summary.gap)}</small>
      </div>}
    </header>
    {!dados?.etapas?<p className="closing-nodata">Dados indisponíveis.</p>:
      <div className="closing-aging-cards">{rows.map(row=><article className="closing-aging-card" key={row.label}>
        <div className="closing-aging-card-title"><strong>{row.label}</strong><b>{percent(row.achieved)}</b></div>
        <div className="closing-aging-card-value"><strong>{num(row.atual)}</strong>
          {regular&&<span>/ {num(row.meta)}</span>}</div>
        <div className="closing-rail closing-progress"><i style={{width:Math.max(0,Math.min(100,row.achieved))+'%'}}/></div>
      </article>)}</div>}
    {regular && dados?.etapas && !isMonth &&
      <span className="closing-goal-context">Recorte filtrado · referência: meta mensal integral</span>}
  </section>;
}

function CompositionPanel({ dados, etapa, isNubank }: {dados: Dados | null; etapa: Etapa; isNubank: boolean}) {
  const types = dados?.etapas?.tipos || [];
  const total = valueOrZero(dados?.etapas?.total);
  const count = (kind: string) => valueOrZero(types.find(item=>item.tipo===kind)?.quantidade);
  const rows = CLASSES.filter(item => !isNubank || item.tipo !== 'DERROTA_VOLUNTARIA').map(item=>({...item, quantity: count(item.tipo)}));
  const max = Math.max(1,...rows.map(row=>row.quantity));
  const other = Math.max(0,total-rows.reduce((sum,row)=>sum+row.quantity,0));
  return <section className="closing-surface closing-composition" aria-label="Composição dos encerramentos">
    <header className="closing-card-head"><h2>Composição dos encerramentos</h2></header>
    {dados?.etapas ? <>
      <div className="closing-composition-list">{rows.map(row=><div className="closing-composition-item" key={row.tipo}>
        <div className="closing-composition-line"><span>{row.label}</span><strong>{num(row.quantity)} <small>· {total ? percent(row.quantity/total*100) : '0,0%'}</small></strong></div>
        <div className="closing-rail"><i style={{width:(row.quantity/max*100)+'%'}}/></div>
      </div>)}</div>
      {other>0 && <p className="closing-composition-other">Outros ou não classificados: {num(other)}</p>}

    </> : <p className="closing-nodata">Aguardando composição dos encerramentos.</p>}
  </section>;
}


function BennerHistory({ resumo, inicio, fim }: {resumo: ResumoBennerAnterior | null; inicio:string; fim:string}) {
  const start = localISO(0).slice(0,7);
  const currentMonth = inicio.slice(0,7) === start && fim.slice(0,7) === start;
  return <section className="closing-surface closing-benner-history" aria-label="Histórico Benner">
    <h2>Benner · mês anterior</h2>
    <div><span>Andamentos <strong>{resumo?num(resumo.enviados):'—'}</strong></span>
      <span>Baixas <strong>{resumo?num(resumo.encerrados):'—'}</strong></span>
      <span>Sem baixa <strong>{resumo?num(resumo.em_andamento):'—'}</strong></span>
      {currentMonth && <span className="closing-carryover" title="Andamentos do mês anterior ainda sem baixa. Contam como pendências a acompanhar neste mês, não como baixas realizadas.">
        Pendentes trazidos para este mês <strong>{resumo?num(resumo.em_andamento):'—'}</strong>
      </span>}</div>
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
    <div className="closing-card-head"><h2>Comarcas com mais derrotas</h2></div>
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
  const max = Math.max(1,...analysts.map(a=>a.analisados));
  return <section className="closing-surface closing-bottom">
    <div className="closing-card-head"><h2>Produtividade dos analistas</h2></div>
    {analysts.length ? <div className="closing-staff">
      {analysts.map(a => <div className="closing-staff-row" key={a.id}>
        <span className="closing-avatar">{a.nome.slice(0,2).toUpperCase()}</span>
        <div className="closing-staff-name"><strong>{a.nome}</strong></div>
        <div className="closing-rail"><i style={{width:a.analisados/max*100+'%'}}/></div>
        <b>{num(a.analisados)}</b>
      </div>)}
    </div> : <p className="closing-nodata">Sem análises atribuídas no período selecionado.</p>}
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
  const analista = 'todos';
  const etapa:Etapa = 'validados';
  const [dados,setDados] = useState<Dados | null>(null);
  const [enviados,setEnviados] = useState<Dados | null>(null);
  const [activeCard,setActiveCard] = useState<ClosingCard | null>(null);
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
      setEnviados(null);
      setActiveCard(null);
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
      const [painel, envios] = await Promise.all([
        loadDashboard(carteira,tipo,inicio,fim,analista,etapa),
        loadDashboard(carteira,tipo,inicio,fim,analista,'enviados_benner').catch(() => null),
      ]);
      if (sequence !== refreshSequence.current) return;
      setDados(painel);
      setEnviados(envios);
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

  return <div className="closing-page-v2">
    <div className="closing-heading"><h1>Encerramentos</h1></div>
    <div className="closing-filter-row">
      <label><span>Carteira</span><select value={carteira} disabled aria-label="Carteira atual autorizada">
        <option value="Agibank Regular">Agibank · MBA</option><option value="Agibank Enter">Agibank · Enter</option><option value="Nubank">Nubank · MBA</option>
      </select></label>
      <label><span>Tipo</span><select value={tipo} onChange={e=>setTipo(e.target.value as Tipo)}>
        {visibleTypes.map(t=><option key={t.value} value={t.value}>{t.label}</option>)}
      </select></label>
      <fieldset className="closing-date-range"><legend>Período</legend>
        <input type="date" aria-label="Data inicial" value={inicio} max={fim || undefined} onChange={e=>setInicio(e.target.value)}/>
        <span>até</span>
        <input type="date" aria-label="Data final" value={fim} min={inicio || undefined} onChange={e=>setFim(e.target.value)}/>
      </fieldset>
    </div>
    {invalidRange && <p className="closing-error" role="alert">A data inicial não pode ser posterior à data final.</p>}
    {pending && !shown ? <p className="closing-stale-note" role="status">Carregando indicadores da carteira...</p> : null}
    {error ? <p className="closing-error" role="alert">{shown ? 'Atualização temporariamente indisponível. Exibindo os últimos indicadores carregados.' : error}</p> : null}
    {shown?._dashboard_stale && !error ? <p className="closing-stale-note" role="status">Exibindo os últimos indicadores disponíveis. A atualização automática tentará novamente.</p> : null}
    <Metrics dados={shown} enviados={loadedKey===filterKey?enviados:null}
      motivosPendentes={motivosPendentes} onOpen={setActiveCard}/>
    <BennerHistory resumo={resumoBenner} inicio={inicio} fim={fim}/>
    {!isNubank && <AgingPanel dados={shown} tipo={tipo} inicio={inicio} fim={fim}/>}
    <div className="closing-secondary-grid">
      <CompositionPanel dados={shown} etapa={etapa} isNubank={isNubank}/>
      <AnalystsPanel analysts={analysts}/>
    </div>
    <section className="closing-territory" aria-label="Detalhamento territorial">
      <header className="closing-territory-heading">Detalhamento territorial</header>
      <ComarcasPanel dados={shown} etapa={etapa} analista={analista}/>
    </section>
    {activeCard && <ClosingDetailsDialog key={activeCard+filterKey} kind={activeCard} onClose={()=>setActiveCard(null)}/>}
  </div>;
}
