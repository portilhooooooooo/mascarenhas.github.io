import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {CheckCircle2,FolderOpen,BookOpen,Send,RefreshCw,type LucideIcon} from 'lucide-react';
import {runtimeScope} from '../tasks/runtimeQueries';
import {AUTH_EVENTS,type CardState,MetricCard,currentPortfolio,failureState,getApi,reasonText} from './metricState';
import {MetricCasesDialog,type CaseSource,dashboardV1Cases} from './MetricCasesDialog';
import './baseGeral.css';

/**
 * GET /api/dashboard/v1/<dashboard> (opt-in, development/homologation only).
 * Rendered only when the build sets MBA_DASHBOARD_V1_ENABLED (staging config or
 * localhost preview); production config leaves it unset, so prod is unchanged.
 */
export type ReadModelName='cadastro'|'andamentos'|'encerramentos';
type Contribution={module:string;name:string;version:string;reference_date:string;numerator:string;denominator:string};
type Summary={contract_version?:string;dashboard?:string;status?:string;portfolio_id?:string;source_tenant?:string;
  revision?:string;calculated_at?:string;data_as_of?:string;metrics?:Contribution[];limitations?:string[]};

const METRICS:Record<ReadModelName,{name:string;label:string;kind:'STOCK'|'FLOW';icon:LucideIcon}[]>={
  cadastro:[{name:'entradas',label:'Entradas',kind:'STOCK',icon:FolderOpen}],
  andamentos:[{name:'fase_conhecimento',label:'Fase de conhecimento',kind:'STOCK',icon:BookOpen}],
  encerramentos:[
    {name:'validated_cases',label:'Validados',kind:'FLOW',icon:CheckCircle2},
    {name:'confirmed_benner_cases',label:'Confirmados no Benner',kind:'FLOW',icon:Send},
  ],
};
const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:60000,refetchOnWindowFocus:false}}});

export const readModelEnabled=()=>Boolean((window as Window&{MBA_DASHBOARD_V1_ENABLED?:boolean}).MBA_DASHBOARD_V1_ENABLED);

/** Sum a metric's published grain. STOCK uses only the latest snapshot day. */
export function metricValue(rows:Contribution[],dashboard:string,name:string,kind:'STOCK'|'FLOW'):number|null{
  let own=rows.filter(r=>r.module===dashboard&&r.name===name&&r.version==='1');
  if(!own.length)return null;
  if(kind==='STOCK'){const last=own.reduce((m,r)=>r.reference_date>m?r.reference_date:m,'');own=own.filter(r=>r.reference_date===last);}
  let total=0;
  for(const r of own){
    if(!/^[0-9]+$/.test(String(r.numerator)))return null;
    total+=Number(r.numerator);
    if(!Number.isSafeInteger(total))return null;
  }
  return total;
}

function Panel({dashboard,visible}:{dashboard:ReadModelName;visible:boolean}){
  const [revision,setRevision]=useState(0);
  const [drill,setDrill]=useState<CaseSource|null>(null);
  useEffect(()=>{
    const change=()=>{cache.clear();setDrill(null);setRevision(n=>n+1);};
    AUTH_EVENTS.forEach(e=>window.addEventListener(e,change));
    return()=>AUTH_EVENTS.forEach(e=>window.removeEventListener(e,change));
  },[]);
  const api=getApi();
  const portfolio=currentPortfolio();
  const summary=useQuery({
    queryKey:['dashboard-v1',dashboard,runtimeScope(),portfolio,revision],
    enabled:Boolean(visible&&portfolio&&api),
    queryFn:async({signal})=>{
      const body=await api!.request<Summary>('/api/dashboard/v1/'+dashboard,{signal,cache:'no-store'});
      if(body?.contract_version!=='1.0.0'||body.dashboard!==dashboard)
        throw Object.assign(new Error('Contrato do Read Model incompatível.'),{status:502});
      if(body.status!=='UNAVAILABLE'&&(body.portfolio_id!==portfolio||!Array.isArray(body.metrics)||!body.revision))
        throw Object.assign(new Error('Resposta de outra carteira descartada.'),{status:502});
      return body;
    },
  });
  const data=summary.data;
  const limitations=Array.isArray(data?.limitations)?data!.limitations:[];
  const certified=data?.status==='CURRENT'&&!limitations.includes('LEGACY_PARITY_PENDING');
  const stateFor=(name:string,kind:'STOCK'|'FLOW'):CardState=>{
    if(!api||!portfolio)return {kind:'unauthenticated',message:'Sessão não autenticada.'};
    if(summary.isLoading)return {kind:'loading'};
    if(summary.error)return failureState(summary.error);
    if(!data||data.status==='UNAVAILABLE')return {kind:'absent',reasons:limitations.length?limitations:['NO_PUBLISHED_REVISION']};
    const value=metricValue(data.metrics||[],dashboard,name,kind);
    if(value===null)return {kind:'absent',reasons:['NO_METRIC_CONTRIBUTIONS']};
    return {kind:certified?'certified':'uncertified',value,source:'dashboard_v1:'+dashboard,reasons:limitations};
  };
  const when=(iso?:string)=>{if(!iso)return '—';const d=new Date(iso);return Number.isNaN(d.getTime())?iso:d.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});};
  return <section className="base-geral-panel mba-read-model" aria-label={'Read Model V1 — '+dashboard} data-dashboard={dashboard}>
    <header className="mba-read-model-head">
      <div><h2>Read Model V1</h2>
        <span className="base-geral-context">{data?.revision?`Revisão ${data.revision} · dados até ${when(data.data_as_of)} · calculado ${when(data.calculated_at)}`:'Publicação revisionada'}</span>
      </div>
      {data&&data.status!=='UNAVAILABLE'&&!certified&&<span className="mba-data-tag mba-data-tag--warn" title={reasonText(limitations)}>não certificado</span>}
      {summary.error&&failureState(summary.error).kind==='error'&&<button type="button" className="mba-read-model-retry" onClick={()=>void summary.refetch()} disabled={summary.isFetching}>
        <RefreshCw size={13}/> Recarregar</button>}
    </header>
    <div className="base-geral-kpis andamento-cards mba-read-model-cards">
      {METRICS[dashboard].map(m=>{
        const state=stateFor(m.name,m.kind);
        return <MetricCard key={m.name} label={m.label} icon={m.icon} state={state}
          onOpen={data?.revision?()=>setDrill(dashboardV1Cases(dashboard,m.name,m.label+' (Read Model)',data.revision!,portfolio)):undefined}/>;
      })}
    </div>
    {limitations.length>0&&<p className="mba-read-model-note">{reasonText(limitations)}</p>}
    {drill&&<MetricCasesDialog source={drill} onClose={()=>setDrill(null)}/>}
  </section>;
}

export function ReadModelDashboard({dashboard,visible=true}:{dashboard:ReadModelName;visible?:boolean}){
  if(!readModelEnabled())return null;
  return <QueryClientProvider client={cache}><Panel dashboard={dashboard} visible={visible}/></QueryClientProvider>;
}
