import { useCallback, useEffect, useRef, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, ClipboardList, Download, Search, Send, Target, UsersRound, X } from 'lucide-react';
import { getClosingCases, sendClosingsToBenner, type ClosingCase, type ClosingStatus, type ClosingValidatedFilter } from './operacaoEncerramentosService';
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
type AnalysisEntry = { id:string; cnj:string; analista:string; analista_id:string; tipo:string|null; resultado:string|null; analisado_em:string; classificador_originario:string|null; concorda:boolean|null };
type AnalysisResult = { total:number; rows:AnalysisEntry[]; analistas:Analista[]; limit:number; offset:number; acuracia_originaria?:{confirmados:number;divergentes:number;avaliados:number;nao_avaliados:number;percentual:number|null} };
type ClosingSendRate = { aptos:number; enviados:number; percentual:number|null };
async function loadClosingAnalyses(inicio:string,fim:string,tipo:Tipo,limit=20,offset=0,q='',concordancia:'todos'|'sim'|'nao'|'nao_avaliados'='todos'):Promise<AnalysisResult> {
  const api=(window as Window & {MBA_AUTOMATION_API?:BackofficeApi}).MBA_AUTOMATION_API;
  if(!api)throw new Error('API indisponível.');
  const params=new URLSearchParams({tipo,limit:String(limit),offset:String(offset)});
  if(inicio)params.set('inicio',inicio);
  if(fim)params.set('fim',fim);
  if(q)params.set('q',q);
  if(concordancia!=='todos')params.set('concordancia',concordancia);
  return api.request('/api/operacao/encerramentos/analises?'+params);
}
async function loadClosingSendRate(inicio:string,fim:string,tipo:Tipo):Promise<ClosingSendRate> {
  const api=(window as Window & {MBA_AUTOMATION_API?:BackofficeApi}).MBA_AUTOMATION_API;
  if(!api)throw new Error('API indisponível.');
  const params=new URLSearchParams({tipo});
  if(inicio)params.set('inicio',inicio);
  if(fim)params.set('fim',fim);
  return api.request('/api/operacao/encerramentos/taxa-envio?'+params);
}
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

// Contador e modal compartilham a mesma relação de processos, não a soma de tarefas.
async function loadMotivosDerrotaPendentes(): Promise<number> {
  const result=await getClosingCases('DERROTA',1,0,'','nao','todos','todos','DERROTA');
  return result.total;
}



type ClosingCard = 'analisados' | 'acuracia' | 'aptidoes' | 'benner' | 'meta' | 'motivo';
const CARD_LABELS: Record<ClosingCard, string> = {
  analisados: 'Analisados', acuracia: 'Acurácia', aptidoes: 'Aptidões',
  benner: 'Enviados ao Benner', meta: 'Meta', motivo: 'Motivo derrota',
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
function ClosingDetailsDialog({kind,onClose,inicio,fim,tipo,tipoRecorte}: {kind:ClosingCard;onClose:()=>void;inicio:string;fim:string;tipo:Tipo;tipoRecorte?:Tipo|null}) {
  const [query,setQuery] = useState('');
  const [search,setSearch] = useState('');
  const [concordancia,setConcordancia] = useState<'todos'|'sim'|'nao'|'nao_avaliados'>('todos');
  const [page,setPage] = useState(1);
  const [items,setItems] = useState<ClosingCase[]>([]);
  const [total,setTotal] = useState<number | null>(null);
  const [busy,setBusy] = useState(false);
  const [error,setError] = useState('');
  const listStatus: ClosingStatus | null =
    kind==='aptidoes'?'APTOS':kind==='motivo'?'DERROTA':null;
  const hasDetails = kind==='analisados' || kind==='acuracia' || Boolean(listStatus);
  const pageSize=20;
  useEffect(()=>{
    if(!hasDetails)return;
    let active=true;
    setBusy(true);setError('');
    const request: Promise<{rows:ClosingCase[];total:number}> =
      (kind==='analisados'||kind==='acuracia')
      ? loadClosingAnalyses(inicio,fim,tipo,pageSize,(page-1)*pageSize,search,kind==='acuracia'?concordancia:'todos').then(data=>({
        total:data.total,
        rows:data.rows.map(row=>({
          portfolio_id:'',cnj:row.cnj,analista_id:row.analista,
          tipo_validado:row.tipo,validacao_decisao:null,analisado_em:row.analisado_em,
          validado_em:row.analisado_em,status_envio:undefined,
          classificador_originario:row.classificador_originario, concorda_originario:row.concorda,
        } as ClosingCase))
      }))
      : getClosingCases(listStatus!,pageSize,(page-1)*pageSize,search,kind==='motivo'?'nao':'todos',
          'todos','todos',kind==='aptidoes'&&tipoRecorte?tipoRecorte:'todos');
    void request
      .then(data=>{if(active){setItems(data.rows || []);setTotal(data.total);}})
      .catch(cause=>{if(active){setError(cause instanceof Error?cause.message:'Consulta indisponível.');setItems([]);setTotal(null);}})
      .finally(()=>{if(active)setBusy(false);});
    return()=>{active=false};
  },[listStatus,hasDetails,page,search,concordancia,kind,inicio,fim,tipo,tipoRecorte]);
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
        <h2>{kind==='aptidoes'&&tipoRecorte ? "Composição — "+(CLASSES.find(c=>c.tipo===tipoRecorte)?.label||tipoRecorte) : CARD_LABELS[kind]}</h2>
        <button type="button" onClick={onClose} aria-label="Fechar detalhes"><X size={18}/></button>
      </header>
      {!hasDetails ? <div className="closing-dialog-empty" role="status">
        A relação de CNJs deste indicador ainda não é disponibilizada pela API de Resultados.
      </div> : <>
        {kind==='acuracia' && <div className="closing-accuracy-tabs" role="group" aria-label="Concordância com o classificador">
          {([{key:'todos',label:'Todos'},{key:'sim',label:'Concordantes'},{key:'nao',label:'Divergentes'},{key:'nao_avaliados',label:'Não avaliados'}] as const).map(item=>
            <button key={item.key} type="button" aria-pressed={concordancia===item.key}
              className={concordancia===item.key?'active':''} onClick={()=>{setConcordancia(item.key);setPage(1);}}>{item.label}</button>)}
        </div>}
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
        <p className="closing-dialog-source">{kind==='acuracia'?'Classificação sugerida antes da tarefa × concordância declarada pelo analista':
          kind==='analisados' ? 'Análises humanas do período selecionado' : 'Relação da fila operacional · os totais podem diferir dos indicadores do período.'}</p>
        {error && <p className="closing-error" role="alert">{error}</p>}
        <div className="closing-dialog-table-wrap">
          <table className="closing-dialog-table">
            <thead><tr><th>CNJ</th><th>{kind==='acuracia'?'Classificador':'Pasta'}</th><th>{kind==='acuracia'?'Concordância':'Classificação'}</th><th>Analista</th><th>{kind==='analisados'||kind==='acuracia'?'Analisado em':'Benner'}</th></tr></thead>
            <tbody>{items.map(row=><tr key={row.cnj}>
              <td><strong>{closingCnj(row.cnj)}</strong></td>
              <td>{kind==='acuracia'?(row as ClosingCase & {classificador_originario?:string|null}).classificador_originario||'—':row.pasta||'—'}</td>
              <td>{kind==='acuracia'?((row as ClosingCase & {concorda_originario?:boolean|null}).concorda_originario===true?'Concorda':
                (row as ClosingCase & {concorda_originario?:boolean|null}).concorda_originario===false?'Diverge':'Não avaliado'):row.tipo_validado||'—'}</td>
              <td>{row.analista_id || '—'}</td>
              <td>{kind==='analisados'||kind==='acuracia'?(row.analisado_em ? new Date(row.analisado_em).toLocaleDateString('pt-BR') : '—') : (row.status_envio || '—')}</td>
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

function Metrics({ dados, metaMensal, analises, taxaEnvio, motivosPendentes, onOpen }: {
  dados: Dados | null; metaMensal:Dados|null; analises: AnalysisResult | null; taxaEnvio: ClosingSendRate | null;
  motivosPendentes: number | null; onOpen: (kind:ClosingCard)=>void;
}) {
  const aptos=dados?.etapas?.total;
  const accuracy=analises?.acuracia_originaria;
  const goals=metaMensal && metaMensal.carteira!=='Agibank Enter' ? regularAgingSummary(regularAgingGoals(metaMensal.etapas?.aging || [], metaMensal.etapas?.total || 0)):null;
  const goalPercent=goals && goals.meta > 0 ? Math.max(0,Math.min(100,goals.atual / goals.meta * 100)) : null;
  const cards: Array<{key:ClosingCard;icon:typeof UsersRound;value:string}> = [
    {key:'analisados',icon:UsersRound,value:analises ? num(analises.total):'—'},
    {key:'acuracia',icon:Target,value:accuracy?.percentual!=null ? percent(accuracy.percentual):'—'},
    {key:'aptidoes',icon:CheckCircle2,value:aptos == null ? '—':num(aptos)},
    {key:'benner',icon:Send,value:taxaEnvio?.percentual != null ? percent(taxaEnvio.percentual):'—'},
    {key:'meta',icon:Target,value:goalPercent!==null?percent(goalPercent):'—'},
    {key:'motivo',icon:ClipboardList,value:motivosPendentes == null ? '—':num(motivosPendentes)},
  ];
  return <section className="closing-kpis closing-kpis-main" aria-label="Indicadores operacionais">
    {cards.map(card=>card.key==='meta'
      ? <button className="closing-kpi closing-kpi-button closing-goal-kpi" type="button" key={card.key}
          onClick={()=>document.getElementById('closing-aging-target')?.scrollIntoView({behavior:'smooth',block:'center'})}
          aria-label={'Meta: '+card.value+'. Ver metas por aging'}>
          <span className="closing-goal-kpi-title">Meta</span>
          <svg viewBox="0 0 104 57" className="closing-gauge" aria-hidden="true">
            <path d="M 9 49 A 43 43 0 0 1 95 49" stroke="var(--closing-gauge-track)" strokeWidth="9" strokeLinecap="round" fill="none"/>
            <path d="M 9 49 A 43 43 0 0 1 95 49" stroke="var(--closing-gauge-fill)" strokeWidth="9" strokeLinecap="round" fill="none"
              strokeDasharray={Math.PI*43} strokeDashoffset={(1-(goalPercent??0)/100)*Math.PI*43}/>
          </svg>
          <strong className="closing-gauge-value">{card.value}</strong>
        </button>
      : <button className="closing-kpi closing-kpi-button" type="button"
          key={card.key} onClick={()=>onOpen(card.key)}
          title={card.key==='motivo'?'Derrotas aptas com motivo não cadastrado':undefined}
          aria-label={CARD_LABELS[card.key]+': '+card.value+'. Ver relação'}>
          <div className="closing-kpi-top"><span>{CARD_LABELS[card.key]}</span><card.icon size={15} strokeWidth={1.7}/></div>
          <strong>{card.value}</strong>
        </button>)}
  </section>;
}



type QueueView = 'enviados' | 'pendentes';
const QUEUE_TYPES: Array<{key:ClosingValidatedFilter;label:string}> = [
  {key:'todos',label:'Todos'},
  {key:'DERROTA_VOLUNTARIA',label:'Derrota voluntária'},
  {key:'DERROTA',label:'Derrota'},
  {key:'ACORDO',label:'Acordos'},
  {key:'VITORIA',label:'Vitória'},
];
const MOVIMENTOS:Record<string,string>={
  DERROTA:'Apto ao encerramento - Derrota',
  DERROTA_VOLUNTARIA:'Apto ao encerramento - Derrota Voluntária',
  VITORIA:'Apto ao encerramento - Vitória',
};
const labelTipo=(tipo?:string|null)=>QUEUE_TYPES.find(item=>item.key===tipo)?.label || tipo || '—';
function queueEligible(row:ClosingCase) {
  return row.validacao_decisao==='apto' && Boolean(row.validado_em) &&
    !row.enviado_benner_em && ['NAO_ENVIADO','ERRO'].includes(row.status_envio||'NAO_ENVIADO') &&
    Object.prototype.hasOwnProperty.call(MOVIMENTOS,row.tipo_validado||'');
}
function ClosingQueuePanel({carteira,onSent}: {carteira:string;onSent:()=>void}) {
  const [view,setView]=useState<QueueView>('enviados');
  const [tipo,setTipo]=useState<ClosingValidatedFilter>('todos');
  const [page,setPage]=useState(1);
  const [search,setSearch]=useState('');
  const [input,setInput]=useState('');
  useEffect(()=>{const id=window.setTimeout(()=>setSearch(input.trim()),320);return()=>window.clearTimeout(id);},[input]);
  const [rows,setRows]=useState<ClosingCase[]>([]);
  const [total,setTotal]=useState<number|null>(null);
  const [selected,setSelected]=useState<Record<string,ClosingCase>>({});
  const [loading,setLoading]=useState(false);
  const [sending,setSending]=useState(false);
  const [error,setError]=useState('');
  const [feedback,setFeedback]=useState('');
  const [revision,setRevision]=useState(0);
  const [canSend,setCanSend]=useState(false);
  const limit=20;
  const isPending=view==='pendentes';
  useEffect(()=>{
    const sync=()=>{
      const current=(window as Window & {MBA_CURRENT_USER?:{permissions?:Record<string,boolean>}}).MBA_CURRENT_USER;
      setCanSend(current?.permissions?.['automations.run']===true && current?.permissions?.['encerramentos.view']===true);
    };
    sync();
    window.addEventListener('mba:authenticated',sync);
    window.addEventListener('mba:profile-ready',sync);
    return()=>{window.removeEventListener('mba:authenticated',sync);window.removeEventListener('mba:profile-ready',sync);};
  },[]);
  useEffect(()=>{setPage(1);setSelected({});setError('');setFeedback('');},[view,tipo,search,carteira]);
  useEffect(()=>{
    let active=true;
    setLoading(true);setError('');
    void getClosingCases(isPending?'APTOS':'ENVIADOS_BENNER',limit,(page-1)*limit,
      search,'todos','todos',isPending?'nao':'sim',isPending?tipo:'todos')
      .then(data=>{if(active){setRows(data.rows||[]);setTotal(data.total);}})
      .catch(cause=>{if(active){setRows([]);setTotal(null);setError(cause instanceof Error?cause.message:'Fila indisponível.');}})
      .finally(()=>{if(active)setLoading(false);});
    return()=>{active=false;};
  },[isPending,page,search,tipo,carteira,revision]);
  const eligible=rows.filter(queueEligible);
  const pageSelected=eligible.length>0 && eligible.every(row=>Boolean(selected[row.cnj]));
  const checked=Object.values(selected).filter(queueEligible);
  const pages=Math.max(1,Math.ceil((total||0)/limit));
  const selectCurrent=()=>{
    setSelected(prev=>{
      const next={...prev};
      if(pageSelected)eligible.forEach(row=>delete next[row.cnj]);
      else eligible.forEach(row=>{next[row.cnj]=row;});
      return next;
    });
  };
  const selectAll=async()=>{
    if(!canSend || sending || !isPending)return;
    setLoading(true);setError('');
    try{
      const first=await getClosingCases('APTOS',100,0,search,'todos','todos','nao',tipo);
      if(first.total>1500)throw new Error('Mais de 1.500 registros. Filtre por tipo antes de selecionar todos.');
      const accumulated=[...first.rows];
      for(let offset=100;offset<first.total;offset+=100){
        const next=await getClosingCases('APTOS',100,offset,search,'todos','todos','nao',tipo);
        accumulated.push(...next.rows);
      }
      setSelected(Object.fromEntries(accumulated.filter(queueEligible).map(row=>[row.cnj,row])));
      setFeedback(num(accumulated.filter(queueEligible).length)+' aptos selecionados.');
    }catch(cause){setError(cause instanceof Error?cause.message:'Não foi possível selecionar todos.');}
    finally{setLoading(false);}
  };
  const send=async()=>{
    const candidates=Object.values(selected).filter(queueEligible);
    if(!canSend || !candidates.length || sending)return;
    if(!window.confirm('Enviar '+num(candidates.length)+' andamento(s) apto(s) ao Benner? A confirmação de baixa depende do retorno do Benner.'))return;
    setSending(true);setError('');setFeedback('');
    let sent=0;
    try{
      for(let offset=0;offset<candidates.length;offset+=100){
        const batch=candidates.slice(offset,offset+100);
        const result=await sendClosingsToBenner(batch.map(row=>({
          cnj:row.cnj,andamento:MOVIMENTOS[row.tipo_validado||''],
        })));
        sent+=result.queued;
        setSelected(prev=>{
          const next={...prev};batch.forEach(row=>delete next[row.cnj]);return next;
        });
      }
      setFeedback(num(sent)+' envio(s) encaminhado(s) à fila do Benner.');
      setRevision(x=>x+1);onSent();
    }catch(cause){
      setError('Envio interrompido após '+num(sent)+' item(ns) recebidos. Reconsulte a fila antes de repetir. '+(cause instanceof Error?cause.message:''));
      setRevision(x=>x+1);onSent();
    }finally{setSending(false);}
  };
  const typeOptions=carteira==='Nubank'?QUEUE_TYPES.filter(item=>item.key!=='DERROTA_VOLUNTARIA'):QUEUE_TYPES;
  return <section className="closing-surface closing-queue" aria-label="Enviados e pendentes do Benner">
    <header className="closing-queue-head">
      <h2>Andamentos Benner</h2>
      <div className="closing-toggle" role="group" aria-label="Situação de envio">
        <button type="button" className={view==='enviados'?'active':''} aria-pressed={view==='enviados'} onClick={()=>setView('enviados')}>Enviados</button>
        <button type="button" className={isPending?'active':''} aria-pressed={isPending} onClick={()=>setView('pendentes')}>Pendentes</button>
      </div>
    </header>
    {isPending && <div className="closing-queue-filters" role="group" aria-label="Tipo de encerramento pendente">
      {typeOptions.map(item=><button type="button" key={item.key} aria-pressed={tipo===item.key}
        className={tipo===item.key?'active':''} onClick={()=>setTipo(item.key)}>{item.label}</button>)}
    </div>}
    <div className="closing-queue-tools">
      <div className="closing-queue-search" role="search">
        <Search size={16} aria-hidden="true"/>
        <input type="search" value={input} onChange={e=>setInput(e.target.value)}
          placeholder="Buscar CNJ ou pasta" aria-label="Buscar CNJ ou pasta"/>
        {input.trim() && <button type="button" onClick={()=>{setInput('');setSearch('');setPage(1);}} aria-label="Limpar busca"><X size={14}/></button>}
      </div>
      <span className="closing-queue-total">{total===null?'—':num(total)} {isPending?'pendentes':'enviados'}</span>
      {isPending && canSend && <>
        <button type="button" className="closing-queue-all" onClick={()=>void selectAll()} disabled={loading||sending}>Selecionar todos</button>
        <button type="button" className="closing-queue-send" onClick={()=>void send()} disabled={sending||loading||checked.length===0}>
          <Send size={14}/>{sending?'Enviando…':'Enviar '+num(checked.length)+' ao Benner'}
        </button>
      </>}
    </div>
    {error && <p className="closing-error" role="alert">{error}</p>}
    {feedback && <p className="closing-queue-feedback" role="status">{feedback}</p>}
    <div className="closing-queue-table-wrap"><table className="closing-queue-table">
      <thead><tr>
        {isPending&&<th className="closing-check-cell">{canSend&&<input type="checkbox" checked={pageSelected} onChange={selectCurrent}
          disabled={!eligible.length||loading||sending} aria-label="Selecionar todos os aptos desta página"/>}</th>}
        <th>CNJ</th><th>Pasta</th><th>Tipo</th><th>Analista</th><th>Situação</th>
      </tr></thead>
      <tbody>{rows.map(row=><tr key={row.cnj}>
        {isPending&&<td className="closing-check-cell"><input type="checkbox" checked={Boolean(selected[row.cnj])}
          disabled={!canSend||!queueEligible(row)||loading||sending} aria-label={'Selecionar '+closingCnj(row.cnj)}
          title={!queueEligible(row)?'Registro sem aptidão validada, já em fila ou sem andamento compatível':''}
          onChange={e=>setSelected(prev=>{
            const next={...prev};if(e.target.checked)next[row.cnj]=row;else delete next[row.cnj];return next;
          })}/></td>}
        <td className="closing-queue-cnj">{closingCnj(row.cnj)}</td>
        <td>{row.pasta||'—'}</td>
        <td>{labelTipo(row.tipo_validado)}</td>
        <td>{row.analista_id||'—'}</td>
        <td>{row.enviado_benner_em?'Enviado':row.status_envio==='NA_FILA'?'Na fila':
          row.status_envio==='PROCESSANDO'?'Processando':row.status_envio==='ERRO'?'Erro':'Aguardando envio'}</td>
      </tr>)}</tbody>
    </table>
    {!rows.length && <p className="closing-queue-empty">{loading?'Carregando registros…':'Nenhum registro nesta seleção.'}</p>}
    </div>
    {isPending && tipo==='ACORDO' && <p className="closing-queue-warning">Acordos: consulta disponível; envio indisponível neste fluxo de andamentos.</p>}
    <footer className="closing-queue-footer">
      <span>{isPending && checked.length?num(checked.length)+' selecionados · ':''}Estoque da carteira · consulta paginada</span>
      <nav aria-label="Paginação de andamentos">
        <button type="button" disabled={page===1||loading} onClick={()=>setPage(p=>Math.max(1,p-1))} aria-label="Página anterior"><ChevronLeft size={16}/></button>
        <span>{page} / {pages}</span>
        <button type="button" disabled={page>=pages||loading} onClick={()=>setPage(p=>Math.min(pages,p+1))} aria-label="Próxima página"><ChevronRight size={16}/></button>
      </nav>
    </footer>
  </section>;
}


function ClosingQueueDialog({carteira,onClose,onSent}: {carteira:string;onClose:()=>void;onSent:()=>void}) {
  const closeButton=useRef<HTMLButtonElement>(null);
  useEffect(()=>{
    closeButton.current?.focus();
    const previousOverflow=document.body.style.overflow;
    document.body.style.overflow='hidden';
    const onKey=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose();};
    window.addEventListener('keydown',onKey);
    return()=>{document.body.style.overflow=previousOverflow;window.removeEventListener('keydown',onKey);};
  },[onClose]);
  return <div className="closing-dialog-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section className="closing-dialog closing-queue-dialog" role="dialog" aria-modal="true" aria-labelledby="closing-queue-dialog-title">
      <header className="closing-dialog-head">
        <h2 id="closing-queue-dialog-title">Andamentos Benner</h2>
        <button ref={closeButton} type="button" aria-label="Fechar andamentos Benner" onClick={onClose}><X size={18}/></button>
      </header>
      <div className="closing-queue-dialog-body">
        <ClosingQueuePanel carteira={carteira} onSent={onSent}/>
      </div>
    </section>
  </div>;
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
  return <section id="closing-aging-target" className="closing-surface closing-aging" aria-label="Meta de aging">
    <header className="closing-card-head closing-goal-head">
      <h2>{regular?'Meta de aging':'Distribuição por aging'}</h2>
      {regular && dados?.etapas && <div className="closing-goal-summary" aria-label="Cumprimento da meta">
        <strong>{num(summary.atual)} <span>/ {num(summary.meta)}</span></strong>
        <b>{percent(achievement)}</b>

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
      <span className="closing-goal-context">Meta mensal integral · valores conforme filtro</span>}
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

function AnalystsPanel({ analysts, unavailable }: { analysts: Analista[]; unavailable:boolean }) {
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
    </div> : <p className="closing-nodata">{unavailable ? 'Consulta de análises indisponível.' : 'Sem análises no período selecionado.'}</p>}
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
  const [metaMensal,setMetaMensal] = useState<Dados | null>(null);
  const [analises,setAnalises] = useState<AnalysisResult | null>(null);
  const [taxaEnvio,setTaxaEnvio] = useState<ClosingSendRate | null>(null);
  const [activeCard,setActiveCard] = useState<ClosingCard | null>(null);
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
      setMetaMensal(null);
      setAnalises(null);
      setTaxaEnvio(null);
      setActiveCard(null);
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
      const monthStart=localISO(0).slice(0,7)+'-01';
      const monthEnd=localISO(0);
      const isMonthly=inicio===monthStart && fim===monthEnd && tipo==='TODOS';
      const [painel, registros, taxa, monthly] = await Promise.all([
        loadDashboard(carteira,tipo,inicio,fim,analista,etapa),
        loadClosingAnalyses(inicio,fim,tipo).catch(() => null),
        loadClosingSendRate(inicio,fim,tipo).catch(() => null),
        isMonthly ? Promise.resolve(null) : loadDashboard(carteira,'TODOS',monthStart,monthEnd,'todos','validados').catch(() => null),
      ]);
      if (sequence !== refreshSequence.current) return;
      setDados(painel);
      setMetaMensal(isMonthly?painel:monthly);
      setAnalises(registros);
      setTaxaEnvio(taxa);
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
  const analysts = loadedKey===filterKey && analises ? analises.analistas : [];

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
    <Metrics dados={shown} metaMensal={loadedKey===filterKey?metaMensal:null} analises={loadedKey===filterKey?analises:null}
      taxaEnvio={loadedKey===filterKey?taxaEnvio:null}
      motivosPendentes={motivosPendentes} onOpen={setActiveCard}/>
    {!isNubank && <AgingPanel dados={shown} tipo={tipo} inicio={inicio} fim={fim}/>}
    <div className="closing-secondary-grid">
      <CompositionPanel dados={shown} etapa={etapa} isNubank={isNubank}/>
      <AnalystsPanel analysts={analysts} unavailable={!analises || loadedKey!==filterKey}/>
    </div>
    <section className="closing-territory" aria-label="Detalhamento territorial">
      <header className="closing-territory-heading">Detalhamento territorial</header>
      <ComarcasPanel dados={shown} etapa={etapa} analista={analista}/>
    </section>
    {activeCard==='benner'
      ? <ClosingQueueDialog key={carteira+filterKey} carteira={carteira} onClose={()=>setActiveCard(null)}
          onSent={()=>{void refresh();setSnapshotRevision(x=>x+1);}}/>
      : activeCard && <ClosingDetailsDialog key={activeCard+filterKey} kind={activeCard} inicio={inicio} fim={fim} tipo={tipo} onClose={()=>setActiveCard(null)}/>}
  </div>;
}
