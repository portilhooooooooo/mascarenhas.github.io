import { useEffect, useId, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CheckCircle2, Clock3, FileCheck2, FileX2, RefreshCw, Search, X, type LucideIcon } from 'lucide-react';
import { runtimeQueries, runtimeScope } from '../tasks/runtimeQueries';
import './defesasResultados.css';

type Kind = 'apt' | 'inapt' | 'reschedule' | 'pending';
type DefenseSummary = Record<Kind, number>;
type DefenseRow = {
  id: string; cnj: string; task_status: string; analyst?: string | null;
  decision?: string | null; reason?: string | null; situation?: string | null;
  fatal_deadline?: string | null; analyzed_at?: string | null;
  reschedule_required: boolean;
};
type Response = {summary: DefenseSummary; rows: DefenseRow[]; total: number; page: number; limit: number};
type Api = {request: <T>(path: string, options?: RequestInit) => Promise<T>; getPortfolioId?: () => string};
type Environment = Window & {MBA_API?: Api; MBA_AUTOMATION_API?: Api};

const cards: Array<{kind: Kind; title: string; icon: LucideIcon}> = [
  {kind:'apt',title:'Aptos à defesa',icon:FileCheck2},
  {kind:'inapt',title:'Inaptos à defesa',icon:FileX2},
  {kind:'reschedule',title:'Aptos ao reagendamento',icon:Clock3},
  {kind:'pending',title:'Pendentes (sem análise)',icon:CheckCircle2},
];
const number = (value: unknown) => typeof value === 'number' && Number.isInteger(value) && value >= 0
  ? new Intl.NumberFormat('pt-BR').format(value) : '—';
const date = (value?: string | null) => {
  if (!value) return '—';
  const iso = value.slice(0,10), parts=iso.split('-');
  return parts.length === 3 ? parts.reverse().join('/') : '—';
};

function requestResults(kind: Kind, page: number, search: string, signal?: AbortSignal): Promise<Response> {
  const api = (window as Environment).MBA_API || (window as Environment).MBA_AUTOMATION_API;
  if (!api) return Promise.reject(new Error('API indisponível.'));
  const params = new URLSearchParams({kind,page:String(page),limit:'25'});
  if (search.trim()) params.set('q',search.trim());
  return api.request<Response>('/api/resultados/defesas?' + params, {signal});
}
function valid(value: Response): boolean {
  return !!value && !!value.summary && Array.isArray(value.rows) && Number.isInteger(value.total)
    && cards.every(card => Number.isInteger(value.summary[card.kind]) && value.summary[card.kind] >= 0);
}

export function DefesasResultadosPage({visible}: {visible: boolean}) {
  const id=useId(), scope=runtimeScope();
  const [kind,setKind]=useState<Kind|null>(null);
  const [search,setSearch]=useState('');
  const [page,setPage]=useState(1);
  const [querySearch,setQuerySearch]=useState('');
  const portfolio=(window as Environment).MBA_API?.getPortfolioId?.();
  const allowed=portfolio==='agibank_enter' && Boolean(scope);
  const summary=useQuery({queryKey:['runtime-v2',scope,'enter-defense-results','summary'],
    enabled:visible&&allowed,queryFn:async({signal})=>{
      const payload=await requestResults('apt',1,'',signal);
      if (!valid(payload)) throw new Error('Indicadores de Defesas inválidos.');
      return payload.summary;
    }},runtimeQueries);
  const detail=useQuery({queryKey:['runtime-v2',scope,'enter-defense-results','detail',kind,page,querySearch],
    enabled:visible&&allowed&&kind!==null,queryFn:async({signal})=>{
      const payload=await requestResults(kind!,page,querySearch,signal);
      if (!valid(payload)) throw new Error('Relação de Defesas inválida.');
      return payload;
    }},runtimeQueries);

  useEffect(()=>{
    const handle=setTimeout(()=>{setPage(1);setQuerySearch(search)},280);
    return ()=>clearTimeout(handle);
  },[search]);
  useEffect(()=>{
    if(!kind)return;
    const close=(event:KeyboardEvent)=>{if(event.key==='Escape')setKind(null)};
    window.addEventListener('keydown',close);
    return ()=>window.removeEventListener('keydown',close);
  },[kind]);
  const open=(next:Kind)=>{setSearch('');setQuerySearch('');setPage(1);setKind(next)};
  const active=cards.find(card=>card.kind===kind);
  if(!allowed) return <section className="defense-results-page"><p className="defense-results-state">Disponível apenas na carteira Agibank · Enter.</p></section>;

  return <section className="defense-results-page" aria-label="Resultados de Defesas da Enter">
    <div className="defense-results-heading">
      <div><h1>Defesas</h1><span>Agibank · Enter</span></div>
      <button className="defense-results-refresh" type="button" onClick={()=>void summary.refetch()} disabled={summary.isFetching}>
        <RefreshCw size={14} className={summary.isFetching?'defense-results-spinning':''}/>Atualizar
      </button>
    </div>
    {summary.error && <div className="defense-results-error" role="alert">
      Indicadores indisponíveis. {(summary.error as Error).message}
      <button type="button" onClick={()=>void summary.refetch()}>Tentar novamente</button>
    </div>}
    <div className="defense-results-grid">
      {cards.map(({kind:cardKind,title,icon:Icon})=><button key={cardKind} type="button"
        className="defense-results-card mba-metric-card" onClick={()=>open(cardKind)}
        aria-label={title+': '+number(summary.data?.[cardKind])+'. Abrir processos'}>
        <span className="defense-results-card-heading"><span>{title}</span><Icon size={17} strokeWidth={1.7}/></span>
        <strong>{number(summary.data?.[cardKind])}</strong>
      </button>)}
    </div>
    {summary.isFetching && <span role="status" className="defense-results-status">{summary.data?'Atualizando indicadores…':'Consultando indicadores…'}</span>}
    {kind && <div className="defense-results-backdrop" onMouseDown={event=>{if(event.target===event.currentTarget)setKind(null)}}>
      <section className="defense-results-dialog" role="dialog" aria-modal="true" aria-labelledby={id+'-title'}>
        <header className="defense-results-dialog-header">
          <div><h2 id={id+'-title'}>{active?.title}</h2><span>{detail.data ? number(detail.data.total)+' processos' : 'Relação de processos'}</span></div>
          <button type="button" aria-label="Fechar relação" onClick={()=>setKind(null)}><X size={18}/></button>
        </header>
        <div className="defense-results-dialog-toolbar"><label><Search size={15}/><input aria-label="Buscar CNJ" placeholder="Buscar CNJ" value={search} onChange={event=>setSearch(event.target.value)}/></label></div>
        {detail.error && <p className="defense-results-error" role="alert">Não foi possível consultar os processos. {(detail.error as Error).message} <button type="button" onClick={()=>void detail.refetch()}>Tentar novamente</button></p>}
        <div className="defense-results-table-wrap"><table className="defense-results-table">
          <thead><tr><th>CNJ</th><th>Analista</th><th>Situação</th><th>Prazo</th><th>Última análise</th></tr></thead>
          <tbody>{(detail.data?.rows||[]).map(row=><tr key={row.id}>
            <td><strong>{row.cnj||'—'}</strong></td><td>{row.analyst||'—'}</td><td>{row.situation|| (kind==='pending'?'Sem análise':'—')}</td><td>{date(row.fatal_deadline)}</td><td>{date(row.analyzed_at)}</td>
          </tr>)}</tbody>
        </table>
        {detail.isFetching&&!detail.data&&<p className="defense-results-empty" role="status">Carregando processos…</p>}
        {!detail.isFetching&&detail.data&&!detail.data.rows.length&&<p className="defense-results-empty">Nenhum processo encontrado.</p>}
        </div>
        <footer className="defense-results-pagination">
          <span>{detail.data ? number(detail.data.total)+' registros' : '—'}</span>
          <div><button type="button" disabled={page<=1||detail.isFetching} onClick={()=>setPage(value=>value-1)}>Anterior</button><span>Página {page}</span>
          <button type="button" disabled={detail.isFetching||!detail.data||page*25>=detail.data.total} onClick={()=>setPage(value=>value+1)}>Próxima</button></div>
        </footer>
      </section>
    </div>}
  </section>;
}
