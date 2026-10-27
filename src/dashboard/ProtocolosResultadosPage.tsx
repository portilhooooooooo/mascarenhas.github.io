import { useEffect, useId, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, Clock3, FileX2, Send, RefreshCw, Search, X, type LucideIcon } from 'lucide-react';
import { runtimeQueries, runtimeScope } from '../tasks/runtimeQueries';
import './defesasResultados.css';

type Kind = 'no_documents' | 'processing' | 'sent' | 'human';
type ProtocolSummary = Record<Kind, number> & {active: number};
type ProtocolRow = {
  id: string; cnj: string; task_url?: string|null;
  analyst?: string|null; status: string; stage?: string|null;
  error_code?: string|null; error_message?: string|null; human_reason?: string|null;
  operational_deadline?: string|null; fatal_deadline?: string|null; updated_at?: string|null;
};
type Response = {summary: ProtocolSummary; rows: ProtocolRow[]; total: number; page: number; limit: number};
type Api = {request: <T>(path: string, options?: RequestInit) => Promise<T>; getPortfolioId?: () => string};
type Env = Window & {MBA_API?: Api; MBA_AUTOMATION_API?: Api};

const cards: Array<{kind: Kind; title: string; icon: LucideIcon}> = [
  {kind:'no_documents', title:'Sem documentos', icon:FileX2},
  {kind:'processing', title:'Em execução', icon:Clock3},
  {kind:'sent', title:'Enviados', icon:Send},
  {kind:'human', title:'Intervenção necessária', icon:AlertTriangle},
];
const count = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value >= 0
  ? new Intl.NumberFormat('pt-BR').format(value) : '—';
const formatDate = (value?: string|null) => {
  if(!value)return '—';
  const parts=value.slice(0,10).split('-');
  return parts.length===3 ? parts.reverse().join('/') : '—';
};
const labelStatus = (status:string) => ({
  SEM_DOCUMENTOS:'Sem documentos', PENDING:'Pendente', RUNNING:'Em execução',
  DOCUMENTOS_ENVIADOS:'Documentos enviados', ENVIADO:'Enviado', DONE:'Concluído',
  HUMAN_NECESSARY:'Intervenção necessária'
} as Record<string,string>)[status] || status;

function requestResults(kind: Kind, page: number, search: string, signal?: AbortSignal): Promise<Response> {
  const api=(window as Env).MBA_API || (window as Env).MBA_AUTOMATION_API;
  if(!api)return Promise.reject(new Error('API indisponível.'));
  const params=new URLSearchParams({kind,page:String(page),limit:'25'});
  if(search.trim())params.set('q',search.trim());
  return api.request<Response>('/api/resultados/protocolos?'+params,{signal});
}
function valid(data:Response):boolean {
  return !!data && !!data.summary && Array.isArray(data.rows) && Number.isInteger(data.total) &&
    Number.isInteger(data.summary.active) && data.summary.active>=0 &&
    cards.every(card=>Number.isInteger(data.summary[card.kind]) && data.summary[card.kind]>=0);
}

export function ProtocolosResultadosPage({visible}:{visible:boolean}) {
  const id=useId(),scope=runtimeScope();
  const [kind,setKind]=useState<Kind|null>(null);
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);
  const [querySearch,setQuerySearch]=useState('');
  const portfolio=(window as Env).MBA_API?.getPortfolioId?.();
  const allowed=portfolio==='agibank_enter' && Boolean(scope);
  const summary=useQuery({queryKey:['runtime-v2',scope,'enter-protocol-results','summary'],
    enabled:visible&&allowed,queryFn:async({signal})=>{
      const data=await requestResults('no_documents',1,'',signal);
      if(!valid(data))throw new Error('Indicadores de Protocolos inválidos.');
      return data.summary;
    }},runtimeQueries);
  const detail=useQuery({queryKey:['runtime-v2',scope,'enter-protocol-results','detail',kind,page,querySearch],
    enabled:visible&&allowed&&kind!==null,queryFn:async({signal})=>{
      const data=await requestResults(kind!,page,querySearch,signal);
      if(!valid(data))throw new Error('Relação de Protocolos inválida.');
      return data;
    }},runtimeQueries);
  useEffect(()=>{
    const timer=setTimeout(()=>{setPage(1);setQuerySearch(search)},280);
    return ()=>clearTimeout(timer);
  },[search]);
  useEffect(()=>{
    if(!kind)return;
    const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setKind(null)};
    window.addEventListener('keydown',close);
    return ()=>window.removeEventListener('keydown',close);
  },[kind]);
  const open=(next:Kind)=>{setSearch('');setQuerySearch('');setPage(1);setKind(next)};
  const selected=cards.find(card=>card.kind===kind);
  if(!allowed)return <section className="defense-results-page"><p className="defense-results-state">Disponível apenas na carteira Agibank · Enter.</p></section>;

  return <section className="defense-results-page" aria-label="Resultados dos protocolos pendentes no Talisman">
    <div className="defense-results-heading">
      <div><h1>Protocolos</h1><span>Enter · {count(summary.data?.active)} pendências Talisman</span></div>
      <button className="defense-results-refresh" type="button" onClick={()=>void summary.refetch()} disabled={summary.isFetching}>
        <RefreshCw size={14} className={summary.isFetching?'defense-results-spinning':''}/>Atualizar
      </button>
    </div>
    {summary.error&&<div className="defense-results-error" role="alert">
      Indicadores indisponíveis. {(summary.error as Error).message}
      <button type="button" onClick={()=>void summary.refetch()}>Tentar novamente</button>
    </div>}
    <div className="defense-results-grid">
      {cards.map(({kind:cardKind,title,icon:Icon})=><button key={cardKind} type="button"
        className="defense-results-card mba-metric-card" onClick={()=>open(cardKind)}
        aria-label={title+': '+count(summary.data?.[cardKind])+'. Abrir processos'}>
        <span className="defense-results-card-heading"><span>{title}</span><Icon size={17} strokeWidth={1.7}/></span>
        <strong>{count(summary.data?.[cardKind])}</strong>
      </button>)}
    </div>
    {summary.isFetching&&<span role="status" className="defense-results-status">{summary.data?'Atualizando indicadores…':'Consultando indicadores…'}</span>}
    {kind&&<div className="defense-results-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setKind(null)}}>
      <section className="defense-results-dialog" role="dialog" aria-modal="true" aria-labelledby={id+'-title'}>
        <header className="defense-results-dialog-header">
          <div><h2 id={id+'-title'}>{selected?.title}</h2><span>{detail.data?count(detail.data.total)+' processos':'Relação de processos'}</span></div>
          <button type="button" aria-label="Fechar relação" onClick={()=>setKind(null)}><X size={18}/></button>
        </header>
        <div className="defense-results-dialog-toolbar"><label><Search size={15}/><input aria-label="Buscar CNJ" placeholder="Buscar CNJ" value={search} onChange={event=>setSearch(event.target.value)}/></label></div>
        {detail.error&&<p className="defense-results-error" role="alert">Não foi possível consultar os processos. {(detail.error as Error).message} <button type="button" onClick={()=>void detail.refetch()}>Tentar novamente</button></p>}
        <div className="defense-results-table-wrap"><table className="defense-results-table">
          <thead><tr><th>CNJ</th><th>Responsável</th><th>Situação</th><th>Prazo</th><th>Atualização</th></tr></thead>
          <tbody>{(detail.data?.rows||[]).map(row=><tr key={row.id}>
            <td><strong>{row.task_url?.startsWith('https://www.app.getenter.ai/')
              ? <a href={row.task_url} target="_blank" rel="noopener noreferrer">{row.cnj||'—'}</a>
              : row.cnj||'—'}</strong></td>
            <td>{row.analyst||'—'}</td>
            <td title={row.human_reason||row.error_message||row.error_code||undefined}>{labelStatus(row.status)}</td>
            <td>{formatDate(row.operational_deadline||row.fatal_deadline)}</td>
            <td>{formatDate(row.updated_at)}</td>
          </tr>)}</tbody>
        </table>
        {detail.isFetching&&!detail.data&&<p className="defense-results-empty" role="status">Carregando processos…</p>}
        {!detail.isFetching&&detail.data&&!detail.data.rows.length&&<p className="defense-results-empty">Nenhum processo encontrado.</p>}
        </div>
        <footer className="defense-results-pagination">
          <span>{detail.data?count(detail.data.total)+' registros':'—'}</span>
          <div><button type="button" disabled={page<=1||detail.isFetching} onClick={()=>setPage(v=>v-1)}>Anterior</button><span>Página {page}</span>
          <button type="button" disabled={detail.isFetching||!detail.data||page*25>=detail.data.total} onClick={()=>setPage(v=>v+1)}>Próxima</button></div>
        </footer>
      </section>
    </div>}
  </section>;
}
