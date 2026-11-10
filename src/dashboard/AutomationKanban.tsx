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
  // Os dois status de elegibilidade vêm do contrato Talisman utilizado em Resultados.
  // Concluídos utiliza a situação persistida das tarefas, sem inferir resultado por ausência.
  type DefenseRow={id:string;cnj:string;analyst?:string|null;situation?:string|null};
  type DefenseResult={summary:{apt:number;reschedule:number};rows:DefenseRow[];total:number};
  const [apt,reschedule]=await Promise.all((['apt','reschedule'] as const).map(kind=>
    api.request<DefenseResult>('/api/resultados/defesas?'+new URLSearchParams({kind,page:'1',limit:String(limit)}))
  ));
  let completed:Lane['items']=[];
  let completedCount:number|null=null;
  try{
    const tasks=await api.request<Array<{id:string;type?:string;source?:string}>>('/api/tasks');
    const defenses=(Array.isArray(tasks)?tasks:[]).filter(task=>
      task.type?.toLowerCase()==='defesa'&&task.source?.toLowerCase()==='automation');
    const batches=await Promise.all(defenses.map(task=>api.request<Array<{
      id:string;case_number?:string;status?:string;source?:string;
    }>>('/api/tasks/'+encodeURIComponent(task.id)+'/processes')));
    completed=batches.flat().filter(item=>
      item.source?.toLowerCase()==='talisman_contestacao'&&item.status?.toLowerCase()==='completed')
      .map(item=>({id:item.id,cnj:item.case_number||'—',secondary:'Concluído'}));
    completedCount=completed.length;
  }catch{ /* Não transformar falha da leitura de concluídos em zero. */ }
  const mapRows=(rows:DefenseRow[])=>rows.map(item=>({id:item.id,cnj:item.cnj||'—',secondary:item.analyst||item.situation||''}));
  return [
    {key:'apt',label:'Aptos à defesa',count:displayCount(apt.summary?.apt),items:mapRows(apt.rows||[])},
    {key:'reschedule',label:'Aptos ao reagendamento',count:displayCount(reschedule.summary?.reschedule),items:mapRows(reschedule.rows||[])},
    {key:'completed',label:'Concluídos',count:completedCount,items:completed},
  ];
}
async function loadMoreLane(module:KanbanFlow,key:string,offset:number):Promise<Lane['items']>{
  const api=getApi();
  if(!api)throw new Error('API indisponível.');
  if(module==='encerramentos'){
    const data=await getClosingCases(key as ClosingStatus,limit,offset);
    return data.rows.map(item=>({id:item.cnj,cnj:item.cnj,secondary:item.pasta||item.tipo_validado||''}));
  }
  if(module==='pagamentos'){
    const query=new URLSearchParams({status:key,limit:String(limit),offset:String(offset)});
    const data=await api.request<{rows:PagamentoOperacaoItem[]}>('/api/operacao/pagamentos/items?'+query);
    return (data.rows||[]).map(item=>({id:item.id,cnj:item.processo||item.identificador_input||item.pasta||'—',secondary:item.pasta||''}));
  }
  if(module==='liminar'){
    const data=await getLiminarLista(key as LiminarClassificacao,Math.floor(offset/limit)+1,limit);
    return data.rows.map(item=>({id:String(item.id),cnj:item.cnj,secondary:item.fonte||''}));
  }
  if(module==='protocolos'){
    const query=new URLSearchParams({status:key,limit:String(limit),offset:String(offset)});
    const data=await api.request<{rows:ProtocoloItem[]}>('/api/protocolo/items?'+query);
    return (data.rows||[]).map(item=>({id:item.id,cnj:item.cnj,secondary:item.stage||item.human_reason||''}));
  }
  if(module==='defesas'&&(key==='apt'||key==='reschedule')){
    const query=new URLSearchParams({kind:key,page:String(Math.floor(offset/limit)+1),limit:String(limit)});
    const data=await api.request<{rows:Array<{id:string;cnj:string;analyst?:string|null;situation?:string|null}>}>('/api/resultados/defesas?'+query);
    return (data.rows||[]).map(item=>({id:item.id,cnj:item.cnj||'—',secondary:item.analyst||item.situation||''}));
  }
  return [];
}
export function AutomationKanban({module,active}:{module:KanbanFlow;active:boolean}){
  const [lanes,setLanes]=useState<Lane[]>([]);
  const [loading,setLoading]=useState(false);
  const [error,setError]=useState('');
  const [revision,setRevision]=useState(0);
  const [loadingLane,setLoadingLane]=useState<string|null>(null);
  const [exhausted,setExhausted]=useState<string[]>([]);
  useEffect(()=>{
    const change=()=>{setLanes([]);setExhausted([]);setRevision(n=>n+1);};
    const events=['mba:portfolio-changed','mba:session-expired','mba:logged-out','mba:authorization-invalidated'];
    events.forEach(e=>window.addEventListener(e,change));
    return()=>events.forEach(e=>window.removeEventListener(e,change));
  },[]);
  useEffect(()=>{
    if(!active)return;
    let cancelled=false;
    setLoading(true);setError('');setExhausted([]);
    void loadKanban(module).then(rows=>{if(!cancelled)setLanes(rows);}).catch(()=>{
      if(!cancelled)setError('Não foi possível carregar os status.');
    }).finally(()=>{if(!cancelled)setLoading(false);});
    return()=>{cancelled=true;};
  },[module,active,revision]);
  const onScroll=(key:string,el:HTMLElement)=>{
    const lane=lanes.find(item=>item.key===key);
    if(!lane||loading||loadingLane!==null||exhausted.includes(key)||
       lane.count===0||(lane.count!==null&&lane.items.length>=lane.count)||
       el.scrollTop+el.clientHeight<el.scrollHeight-160)return;
    setLoadingLane(key);
    void loadMoreLane(module,key,lane.items.length).then(next=>{
      if(!next.length){setExhausted(keys=>keys.includes(key)?keys:[...keys,key]);return;}
      setLanes(previous=>previous.map(current=>{
        if(current.key!==key)return current;
        const seen=new Set(current.items.map(item=>item.id));
        return {...current,items:[...current.items,...next.filter(item=>!seen.has(item.id))]};
      }));
    }).catch(()=>setExhausted(keys=>keys.includes(key)?keys:[...keys,key]))
      .finally(()=>setLoadingLane(null));
  };
  const navigate=(cnj:string)=>{
    if(!/^\d{7}-?\d{2}\.?\d{4}/.test(cnj))return;
    (window as Window&{MBA_NAVIGATE?:(route:string)=>boolean}).MBA_NAVIGATE?.('processos/'+encodeURIComponent(cnj));
  };
  return <section className="automation-kanban-section" aria-label={'Kanban de '+module}>
    <div className="automation-board-head"><h2>Fluxo por status</h2><span>Os registros são carregados conforme a rolagem.</span></div>
    {loading&&<div className="automation-board-loading" role="status"><MetricDots/></div>}
    {error&&<p role="alert" className="automation-board-error">{error}</p>}
    {!loading&&lanes.length>0&&<div className="automation-kanban" role="group" aria-label="Colunas por status">
      {lanes.map(lane=><section className="automation-lane" key={lane.key} aria-label={lane.label}>
        <header><strong>{lane.label}</strong><span>{labelCount(lane.count)}</span></header>
        <div className="automation-lane-items" onScroll={event=>onScroll(lane.key,event.currentTarget)}>
          {lane.items.map(item=><button type="button" className="automation-lane-item" key={item.id}
            disabled={!/^\d{7}-?\d{2}\.?\d{4}/.test(item.cnj)} onClick={()=>navigate(item.cnj)}>
            <strong>{item.cnj}</strong>{item.secondary&&<small>{item.secondary}</small>}
          </button>)}
          {!lane.items.length&&<span className="automation-lane-empty">—</span>}
          {loadingLane===lane.key&&<span className="automation-lane-extra">Carregando mais…</span>}
          {lane.count!==null&&lane.count>lane.items.length&&!exhausted.includes(lane.key)&&<span className="automation-lane-extra">Role para carregar mais</span>}
        </div>
      </section>)}
    </div>}
  </section>;
}
