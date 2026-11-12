import {useEffect,useState} from 'react';
import {ArrowUpRight,X} from 'lucide-react';
import {failureState,formatCount,getApi,reasonText} from './metricState';

/**
 * One drilldown dialog for both contracts:
 *  - Cadastro: GET /api/resultados/cadastro/processos (offset pages, CNJ rows)
 *  - Dashboard V1: GET /api/dashboard/v1/<d>/metrics/<m>/cases (keyset cursor, canonical case IDs)
 * The dialog never fabricates a total: 409/absent detail is shown as unavailable.
 */
export type CaseRow={id:string;cnj?:string|null;primary:string;cells:string[]};
export type CasePage={rows:CaseRow[];total:number|null;next:string|null;status?:string;reasons:string[]};
export type CaseSource={
  title:string;source:string;columns:string[];pageSize:number;
  load:(cursor:string|null,page:number,signal:AbortSignal)=>Promise<CasePage>;
  cursorMode:boolean;
};

type Env=Window&{MBA_NAVIGATE?:(path:string)=>void};

export function MetricCasesDialog({source,onClose}:{source:CaseSource;onClose:()=>void}){
  const [page,setPage]=useState(1);
  const [cursors,setCursors]=useState<(string|null)[]>([null]);
  const [data,setData]=useState<CasePage|null>(null);
  const [error,setError]=useState<string>('');
  const [pending,setPending]=useState(true);
  useEffect(()=>{
    const controller=new AbortController();
    setPending(true);setError('');
    source.load(source.cursorMode?cursors[page-1]??null:null,page,controller.signal)
      .then(result=>{if(!controller.signal.aborted)setData(result);})
      .catch(cause=>{
        if(controller.signal.aborted)return;
        const status=(cause as {status?:number})?.status;
        const code=(cause as {code?:string})?.code;
        if(status===409){setData({rows:[],total:null,next:null,reasons:[code||'DETAIL_UNAVAILABLE']});return;}
        const state=failureState(cause);
        setData(null);setError(state.kind==='error'||state.kind==='forbidden'||state.kind==='unauthenticated'?state.message:'Falha ao carregar processos.');
      })
      .finally(()=>{if(!controller.signal.aborted)setPending(false);});
    return()=>controller.abort();
  },[source,page,cursors]);
  useEffect(()=>{
    const key=(event:KeyboardEvent)=>{if(event.key==='Escape')onClose();};
    const previous=document.body.style.overflow;document.body.style.overflow='hidden';
    window.addEventListener('keydown',key);
    return()=>{document.body.style.overflow=previous;window.removeEventListener('keydown',key);};
  },[onClose]);
  const unavailable=Boolean(data&&data.total===null);
  const lastPage=data&&data.total!==null?Math.max(1,Math.ceil(data.total/source.pageSize)):null;
  const hasNext=source.cursorMode?Boolean(data?.next):Boolean(lastPage&&page<lastPage);
  const next=()=>{
    if(source.cursorMode&&data?.next)setCursors(list=>[...list.slice(0,page),data.next]);
    setPage(p=>p+1);
  };
  return <div className="base-geral-overlay" role="presentation" onMouseDown={event=>{if(event.target===event.currentTarget)onClose();}}>
    <section className="base-geral-dialog" role="dialog" aria-modal="true" aria-label={'Relação de processos: '+source.title}>
      <header className="base-geral-dialog-head">
        <div><h2>{source.title}</h2><p>Processos que compõem o indicador</p></div>
        <button type="button" className="base-geral-dismiss" onClick={onClose} aria-label="Fechar relação"><X size={19}/></button>
      </header>
      <p className="base-geral-dialog-source">{source.source}{data?.status&&data.status!=='CURRENT'?' · '+data.status.toLowerCase():''}</p>
      {data?.status&&data.status!=='CURRENT'&&!unavailable&&<div className="base-geral-warning mba-data-warning">Relação não certificada: {reasonText(data.reasons)||'certificação pendente'}.</div>}
      {unavailable&&<div className="base-geral-warning">Relação indisponível: {reasonText(data!.reasons)}. Nenhum total é exibido.</div>}
      {error&&<p className="base-geral-error base-geral-dialog-error" role="alert">{error}</p>}
      {!unavailable&&!error&&<div className="base-geral-dialog-table-wrap">
        <table className="base-geral-detail-table">
          <thead><tr>{source.columns.map(c=><th key={c}>{c}</th>)}</tr></thead>
          <tbody>{data?.rows.map(row=><tr key={row.id}>
            <td>{row.cnj
              ?<button type="button" onClick={()=>(window as Env).MBA_NAVIGATE?.('processos/'+encodeURIComponent(row.cnj!))}>{row.primary} <ArrowUpRight size={12}/></button>
              :<code title={row.id}>{row.primary}</code>}</td>
            {row.cells.map((cell,i)=><td key={i}>{cell||'—'}</td>)}
          </tr>)}</tbody>
        </table>
        {pending&&<p className="base-geral-dialog-empty" role="status">Consultando registros...</p>}
        {!pending&&data&&!data.rows.length&&<p className="base-geral-dialog-empty">Nenhum processo localizado.</p>}
      </div>}
      <footer className="base-geral-dialog-footer">
        <span>{data&&data.total!==null?formatCount(data.total)+' registros':'—'}</span>
        {!unavailable&&!error&&<nav aria-label="Páginas da consulta">
          <button type="button" disabled={page<=1||pending} onClick={()=>setPage(p=>p-1)} aria-label="Página anterior">Anterior</button>
          <span>Página {page}{lastPage?' de '+lastPage:''}</span>
          <button type="button" disabled={pending||!hasNext} onClick={next} aria-label="Próxima página">Próxima</button>
        </nav>}
      </footer>
    </section>
  </div>;
}

/* ---------- Loaders ---------- */

type CadastroRow={id:string;cnj?:string;pasta?:string|null;situation?:string;state?:string;entry_date?:string;product?:string;
  archive_reasons?:string[]|null;current_credited_office?:string|null};
type CadastroList={status?:string;category?:string;revision?:string|null;rows?:CadastroRow[];total?:number|null;
  page?:number;page_size?:number;blockers?:string[];source_revision?:Record<string,unknown>|null};

/** Cadastro drilldown pinned to the `revision` returned by /cadastro/cards. */
export function cadastroCases(category:string,label:string,filters:URLSearchParams,revision:string):CaseSource{
  const pageSize=25;
  return {
    title:label,cursorMode:false,pageSize,
    source:'Fonte: /api/resultados/cadastro/processos · categoria '+category+' · revisão '+revision,
    columns:['CNJ','Pasta','Situação','UF','Data entrada','Produto'],
    async load(_cursor,page,signal){
      const api=getApi();
      if(!api)throw Object.assign(new Error('API indisponível.'),{status:0});
      const params=new URLSearchParams(filters);
      params.set('category',category);params.set('revision',revision);
      params.set('page',String(page));params.set('page_size',String(pageSize));
      const body=await api.request<CadastroList>('/api/resultados/cadastro/processos?'+params,{signal});
      if(body?.revision&&body.revision!==revision)
        throw Object.assign(new Error('Resposta de detalhe incompatível com a revisão solicitada.'),{status:502});
      if(!body||body.total===null||body.total===undefined)return {rows:[],total:null,next:null,status:body?.status,reasons:body?.blockers||['DETAIL_UNAVAILABLE']};
      return {
        total:body.total,next:null,status:body.status,reasons:body.blockers||[],
        rows:(body.rows||[]).map(r=>({id:r.id,cnj:r.cnj||null,primary:r.cnj||r.id,
          cells:[r.pasta||'',r.situation||'',r.state||'',r.entry_date||'',r.product||'']})),
      };
    },
  };
}

type V1Case={canonical_case_id:string;reference_date?:string;dimensions?:Record<string,string>;
  evidence?:{source_revision?:unknown;source_position?:unknown;batch_id?:unknown}|null};
type V1Cases={contract_version?:string;portfolio_id?:string;total?:number;cases?:V1Case[];next_after?:string|null;revision?:string};

// Mirrors backend dashboard_api.METRIC_VERSIONS: Cadastro Enter publishes metric version 2.
const METRIC_VERSIONS:Record<string,string>={cadastro:'2'};

export function dashboardV1Cases(dashboard:string,metric:string,label:string,revision:string,portfolio:string):CaseSource{
  const pageSize=50;
  const version=METRIC_VERSIONS[dashboard]||'1';
  return {
    title:label,cursorMode:true,pageSize,
    source:`Fonte: Read Model V1 · ${dashboard}/${metric} v${version} · revisão ${revision}`,
    columns:['Caso canônico','Data de referência','Dimensões','Evidência'],
    async load(cursor,_page,signal){
      const api=getApi();
      if(!api)throw Object.assign(new Error('API indisponível.'),{status:0});
      const params=new URLSearchParams({revision,version,limit:String(pageSize)});
      if(cursor)params.set('after',cursor);
      const body=await api.request<V1Cases>(`/api/dashboard/v1/${dashboard}/metrics/${metric}/cases?`+params,{signal});
      if(body?.contract_version!=='1.0.0'||body.portfolio_id!==portfolio||body.revision!==revision||!Array.isArray(body.cases))
        throw Object.assign(new Error('Resposta de detalhe incompatível com a revisão solicitada.'),{status:502});
      return {
        total:typeof body.total==='number'?body.total:null,next:body.next_after||null,status:'PARTIAL',
        reasons:['LEGACY_PARITY_PENDING'],
        rows:body.cases.map(c=>({id:c.canonical_case_id,cnj:null,primary:c.canonical_case_id.slice(0,8)+'…',
          cells:[c.reference_date||'',Object.entries(c.dimensions||{}).map(([k,v])=>k+': '+v).join(', '),
            c.evidence?.source_revision!=null?'rev. '+String(c.evidence.source_revision):''],
        })),
      };
    },
  };
}
