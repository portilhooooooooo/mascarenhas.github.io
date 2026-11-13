import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {CheckCircle2,FolderOpen,BookOpen,Send,type LucideIcon} from 'lucide-react';
import {runtimeScope} from '../tasks/runtimeQueries';
import {AUTH_EVENTS,type BackendCard,type CardState,MetricCard,classifyCard,currentPortfolio,failureState,getApi,reasonText} from './metricState';
import {MetricCasesDialog,type CaseSource,dashboardV1Cases} from './MetricCasesDialog';
import {onCadastroInvalidate} from './CadastroCpjCards';
import './baseGeral.css';

/**
 * GET /api/dashboard/v1/<dashboard> (opt-in, development/homologation only).
 * Rendered only when the build sets MBA_DASHBOARD_V1_ENABLED (staging config or
 * localhost preview); production config leaves it unset, so prod is unchanged.
 */
export type ReadModelName='cadastro'|'andamentos'|'encerramentos';
type Summary={contract_version?:string;dashboard?:string;status?:string;portfolio_id?:string;source_tenant?:string;
  revision?:string;calculated_at?:string;data_as_of?:string;cards?:Record<string,BackendCard>;limitations?:string[]};

const METRICS:Record<ReadModelName,{name:string;label:string;kind:'STOCK'|'FLOW';icon:LucideIcon}[]>={
  cadastro:[{name:'entradas',label:'Entradas',kind:'STOCK',icon:FolderOpen}],
  andamentos:[{name:'fase_conhecimento',label:'Fase de conhecimento',kind:'STOCK',icon:BookOpen}],
  encerramentos:[
    {name:'validated_cases',label:'Validados',kind:'FLOW',icon:CheckCircle2},
    {name:'confirmed_benner_cases',label:'Confirmados no Benner',kind:'FLOW',icon:Send},
  ],
};
// Auto-refresh replaces the manual button: every 60s while visible, plus on window refocus.
const REFRESH_MS=60000;
const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:15000,refetchOnWindowFocus:true}}});

export const readModelEnabled=()=>Boolean((window as Window&{MBA_DASHBOARD_V1_ENABLED?:boolean}).MBA_DASHBOARD_V1_ENABLED);

/** Contract 1.1.0: one card per metric, counted only from frozen detail evidence. 1.0.0 is accepted for UNAVAILABLE only. */
const CONTRACTS=new Set(['1.0.0','1.1.0']);

function Panel({dashboard,visible}:{dashboard:ReadModelName;visible:boolean}){
  const [revision,setRevision]=useState(0);
  const [drill,setDrill]=useState<CaseSource|null>(null);
  useEffect(()=>{
    const change=()=>{cache.clear();setDrill(null);setRevision(n=>n+1);};
    AUTH_EVENTS.forEach(e=>window.addEventListener(e,change));
    return()=>AUTH_EVENTS.forEach(e=>window.removeEventListener(e,change));
  },[]);
  useEffect(()=>dashboard==='cadastro'
    ?onCadastroInvalidate(()=>void cache.invalidateQueries({queryKey:['dashboard-v1','cadastro']})):undefined,[dashboard]);
  const api=getApi();
  const portfolio=currentPortfolio();
  const summary=useQuery({
    queryKey:['dashboard-v1',dashboard,runtimeScope(),portfolio,revision],
    enabled:Boolean(visible&&portfolio&&api),
    refetchInterval:visible?REFRESH_MS:false,
    queryFn:async({signal})=>{
      const body=await api!.request<Summary>('/api/dashboard/v1/'+dashboard,{signal,cache:'no-store'});
      if(!CONTRACTS.has(String(body?.contract_version))||body.dashboard!==dashboard)
        throw Object.assign(new Error('Contrato do Read Model incompatível.'),{status:502});
      if(body.status!=='UNAVAILABLE'&&(body.contract_version!=='1.1.0'||body.portfolio_id!==portfolio||!body.cards||typeof body.cards!=='object'||!body.revision))
        throw Object.assign(new Error('Resposta de outra carteira descartada.'),{status:502});
      return body;
    },
  });
  const data=summary.data;
  const limitations=Array.isArray(data?.limitations)?data!.limitations:[];
  const certified=Boolean(data?.cards)&&Object.values(data!.cards!).every(c=>c?.data_status==='certified');
  const stateFor=(name:string):CardState=>{
    if(!api||!portfolio)return {kind:'unauthenticated',message:'Sessão não autenticada.'};
    if(summary.isLoading)return {kind:'loading'};
    if(summary.error)return failureState(summary.error);
    if(!data||data.status==='UNAVAILABLE')return {kind:'absent',reasons:limitations.length?limitations:['NO_PUBLISHED_REVISION']};
    const state=classifyCard(data.cards?.[name]);
    return state.kind==='absent'&&!state.reasons?.length?{...state,reasons:['NO_FROZEN_DETAILS']}:state;
  };
  const when=(iso?:string)=>{if(!iso)return '—';const d=new Date(iso);return Number.isNaN(d.getTime())?iso:d.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});};
  // No visible "não certificado" tag; the status stays in the section's title/aria-label.
  const status=data&&data.status!=='UNAVAILABLE'&&!certified?['não certificado',reasonText(limitations)].filter(Boolean).join(' — '):'';
  return <section className="base-geral-panel mba-read-model" aria-label={'Read Model V1 — '+dashboard+(status?' — '+status:'')}
    title={status||undefined} data-dashboard={dashboard}>
    <header className="mba-read-model-head">
      <div><h2>Read Model V1</h2>
        <span className="base-geral-context">{data?.revision?`Revisão ${data.revision} · dados até ${when(data.data_as_of)} · calculado ${when(data.calculated_at)}`:'Publicação revisionada'}</span>
      </div>
    </header>
    <div className="base-geral-kpis andamento-cards mba-read-model-cards">
      {METRICS[dashboard].map(m=>{
        const state=stateFor(m.name);
        return <MetricCard key={m.name} label={m.label} icon={m.icon} state={state} hideCertTag
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
