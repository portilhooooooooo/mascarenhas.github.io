import {useEffect,useState} from 'react';
import {MetricDots} from './dashboardFeedback';
import type {ClosingStatus,ClosingSummary,ClosingCase} from './operacaoEncerramentosService';
import {getClosingCases,getClosingSummary} from './operacaoEncerramentosService';
import type {LiminarClassificacao,LiminarResumo,LiminarItem} from './operacaoLiminarService';
import {getLiminarResumo,getLiminarLista} from './operacaoLiminarService';
import type {PagamentoOperacaoStatus,PagamentoOperacaoSummary,PagamentoOperacaoItem} from './operacaoPagamentosService';
import {getPagamentoOperacaoSummary} from './operacaoPagamentosService';
import type {ProtocoloStatus,ProtocoloSummary,ProtocoloItem} from './protocoloService';
import {getProtocoloSummary} from './protocoloService';
import './automationWorkspace.css';

export type KanbanFlow='encerramentos'|'pagamentos'|'liminar'|'protocolos'|'defesas';
type Lane={key:string;label:string;count:number|null;items:Array<{id:string;cnj:string;secondary:string}>};
type Api={request:<T>(path:string,options?:RequestInit)=>Promise<T>};
const limit=24;
const paymentStages:[PagamentoOperacaoStatus,string][]=[
  ['IMPORTADO','Importados'],['NA_FILA','Na fila'],['EM_APROVACAO','Em aprovação'],
  ['EM_RETIFICACAO','Em retificação'],['PAGO_SEM_COMPROVANTE','Sem comprovante'],
  ['PAGO_COM_COMPROVANTE','Com comprovante'],['ACAO_NECESSARIA','Ação necessária'],
];
const closingStages:[ClosingStatus,string][]=[
  ['PENDENTES','Pendentes'],['APTOS','Aptos'],['INAPTOS','Inaptos'],
  ['EM_FASE_RECURSAL','Fase recursal'],['DERROTA','Derrota'],
  ['DERROTA_VOLUNTARIA','Derrota voluntária'],['VITORIA','Vitória'],['ENVIADOS_BENNER','Enviados'],
];
const liminarStages:[LiminarClassificacao,string][]=[
  ['sem_decisao','Sem decisão'],['deferido','Deferida'],['indeferido','Indeferida'],['com_sentenca','Com sentença'],
];
const protocolStages:[ProtocoloStatus,string][]=[
  ['SEM_DOCUMENTOS','Sem documentos'],['PENDING','Pendente'],['RUNNING','Executando'],
  ['DOCUMENTOS_ENVIADOS','Documentos enviados'],['ENVIADO','Enviado'],
  ['DONE','Concluído'],['HUMAN_NECESSARY','Ação humana'],
];
const getApi=()=>{
  const w=window as Window&{MBA_API?:Api;MBA_AUTOMATION_API?:Api};
  return w.MBA_AUTOMATION_API||w.MBA_API;
};
function displayCount(value:unknown):number|null{
  return typeof value==='number'&&Number.isSafeInteger(value)&&value>=0?value:null;
}
function labelCount(value:number|null){return value===null?'—':new Intl.NumberFormat('pt-BR').format(value);}
async function loadKanban(module:KanbanFlow):Promise<Lane[]>{
  const api=getApi();
  if(!api)throw new Error('API indisponível.');
  if(module==='encerramentos'){
    const summary:ClosingSummary=await getClosingSummary();
    return Promise.all(closingStages.map(async ([key,label])=>{
      const list=await getClosingCases(key,limit,0);
      return {key,label,count:displayCount(summary.statuses?.[key]),items:list.rows.map((item:ClosingCase)=>({
        id:item.cnj,cnj:item.cnj,secondary:item.pasta||item.tipo_validado||'',
      }))};
    }));
  }
  if(module==='pagamentos'){
    const summary:PagamentoOperacaoSummary=await getPagamentoOperacaoSummary();
    return Promise.all(paymentStages.map(async ([key,label])=>{
      const params=new URLSearchParams({status:key,limit:String(limit),offset:'0'});
      const list=await api.request<{rows:PagamentoOperacaoItem[]}>('/api/operacao/pagamentos/items?'+params);
      return {key,label,count:displayCount(summary.statuses?.[key]),items:(list.rows||[]).map(item=>({
        id:item.id,cnj:item.processo||item.identificador_input||item.pasta||'—',secondary:item.pasta||'',
      }))};
    }));
  }
  if(module==='liminar'){
    const summary:LiminarResumo=await getLiminarResumo();
    return Promise.all(liminarStages.map(async ([key,label])=>{
      const list=await getLiminarLista(key,1,limit);
      return {key,label,count:displayCount(summary.cards?.[key]),items:list.rows.map((item:LiminarItem)=>({
        id:String(item.id),cnj:item.cnj,secondary:item.fonte||'',
      }))};
    }));
  }
  if(module==='protocolos'){
    const summary:ProtocoloSummary=await getProtocoloSummary();
    return Promise.all(protocolStages.map(async ([key,label])=>{
      const params=new URLSearchParams({status:key,limit:String(limit),offset:'0'});
      const list=await api.request<{rows:ProtocoloItem[]}>('/api/protocolo/items?'+params);
      return {key,label,count:displayCount(summary.statuses?.[key]),items:(list.rows||[]).map(item=>({
        id:item.id,cnj:item.cnj,secondary:item.stage||item.human_reason||'',
      }))};
    }));
  }
  // Reuse the existing defense-task read contract; no dispatch, import or update.
  const tasks=await api.request<Array<{id:string;type?:string;source?:string}>>('/api/tasks');
  const defenseTasks=(Array.isArray(tasks)?tasks:[]).filter(item=>
    item.type?.toLowerCase()==='defesa'&&item.source?.toLowerCase()==='automation');
  const records=await Promise.all(defenseTasks.map(item=>api.request<Array<{
    id:string;case_number?:string;status?:string;source?:string;
    source_metadata?:Record<string,unknown>;
  }>>('/api/tasks/'+encodeURIComponent(item.id)+'/processes')));
  const columns:[string,string][]=[['aguardando','Aguardando'],['saneado','Saneados'],['tarefa','Para tarefa']];
  const buckets=new Map(columns.map(([key])=>[key,[] as Array<{id:string;cnj:string;secondary:string}>]));
  for(const item of records.flat()){
    if(item.source?.toLowerCase()!=='talisman_contestacao'||item.status?.toLowerCase()==='completed')continue;
    const metadata=item.source_metadata||{};
    const state=String(metadata.saneamento_status||metadata.routing_status||metadata.status_saneamento||'').toLowerCase();
    const key=['saneado','resolved','resolvido'].includes(state)?'saneado':
      ['tarefa','task','human','human_review'].includes(state)||metadata.human_review_required===true?'tarefa':'aguardando';
    buckets.get(key)!.push({id:item.id,cnj:item.case_number||'—',secondary:''});
  }
  return columns.map(([key,label])=>({key,label,count:buckets.get(key)!.length,items:buckets.get(key)!.slice(0,limit)}));
}
export function AutomationKanban({module,active}:{module:KanbanFlow;active:boolean}){
  const [lanes,setLanes]=useState<Lane[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    const change=()=>{setLanes([]);setRevision(n=>n+1);};
    const events=['mba:portfolio-changed','mba:session-expired','mba:logged-out','mba:authorization-invalidated'];
    events.forEach(e=>window.addEventListener(e,change));
    return()=>events.forEach(e=>window.removeEventListener(e,change));
  },[]);
  useEffect(()=>{
    if(!active)return;
    let cancelled=false;
    setLoading(true);setError('');setLanes([]);
    void loadKanban(module).then(rows=>{if(!cancelled)setLanes(rows);}).catch(()=>{
      if(!cancelled)setError('Não foi possível carregar os status.');
    }).finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[module,active,revision]);
  const navigate=(cnj:string)=>{
    if(!/^\d{7}-?\d{2}\.?\d{4}/.test(cnj))return;
    (window as Window&{MBA_NAVIGATE?:(route:string)=>boolean}).MBA_NAVIGATE?.('processos/'+encodeURIComponent(cnj));
  };
  return <section className="automation-kanban-section" aria-label={'Kanban de '+module}>
    <div className="automation-board-head"><h2>Status</h2><button type="button" className="automation-refresh" disabled={loading} onClick={()=>setRevision(x=>x+1)}>Atualizar</button></div>
    {loading&&<div className="automation-board-loading" role="status"><MetricDots/></div>}
    {error&&<p role="alert" className="automation-board-error">{error}</p>}
    {!loading&&lanes.length>0&&<div className="automation-kanban" role="group" aria-label="Colunas por status">
      {lanes.map(lane=><section className="automation-lane" key={lane.key} aria-label={lane.label}>
        <header><strong>{lane.label}</strong><span>{labelCount(lane.count)}</span></header>
        <div className="automation-lane-items">
          {lane.items.map(item=><button type="button" className="automation-lane-item" key={item.id}
            disabled={!/^\d{7}-?\d{2}\.?\d{4}/.test(item.cnj)} onClick={()=>navigate(item.cnj)}>
            <strong>{item.cnj}</strong>{item.secondary&&<small>{item.secondary}</small>}
          </button>)}
          {!lane.items.length&&<span className="automation-lane-empty">—</span>}
          {lane.count!==null&&lane.count>lane.items.length&&<span className="automation-lane-extra">+ {labelCount(lane.count-lane.items.length)} registros</span>}
        </div>
      </section>)}
    </div>}
  </section>;
}
