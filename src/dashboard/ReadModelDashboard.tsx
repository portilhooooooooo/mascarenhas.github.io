import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {CheckCircle2,FolderOpen,BookOpen,Send,RefreshCw,Archive,FileCheck2,Scale,PauseCircle,Gavel,ShieldAlert,type LucideIcon} from 'lucide-react';
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
  andamentos:[
    {name:'fase_conhecimento',label:'Fase de conhecimento',kind:'STOCK',icon:BookOpen},
    {name:'recursal_extincao',label:'Recursal - Extinção',kind:'STOCK',icon:Archive},
    {name:'recursal_improcedente',label:'Recursal - Improcedente',kind:'STOCK',icon:FileCheck2},
    {name:'recursal_procedente',label:'Recursal - Procedente',kind:'STOCK',icon:Scale},
    {name:'transito_em_julgado',label:'Trânsito em julgado',kind:'STOCK',icon:BookOpen},
    {name:'transito_em_julgado_extincao',label:'Trânsito em julgado - Extinção',kind:'STOCK',icon:Archive},
    {name:'transito_em_julgado_improcedente',label:'Trânsito em julgado - Improcedente',kind:'STOCK',icon:FileCheck2},
    {name:'transito_em_julgado_procedente',label:'Trânsito em julgado - Procedente',kind:'STOCK',icon:Scale},
    {name:'suspensao',label:'Suspensos',kind:'STOCK',icon:PauseCircle},
    {name:'pedido_bloqueio',label:'Pedido de bloqueio',kind:'STOCK',icon:ShieldAlert},
    {name:'cumprimento_sentenca',label:'Cumprimento de Sentença',kind:'STOCK',icon:Gavel},
  ],
  encerramentos:[
    {name:'validated_cases',label:'Validados',kind:'FLOW',icon:CheckCircle2},
    {name:'confirmed_benner_cases',label:'Confirmados no Benner',kind:'FLOW',icon:Send},
  ],
};
// Cadastro and Andamentos poll their compact aggregated release, never raw cases.
// Andamentos' 30s cadence follows the producer's 100-case webhook batches.
const CADASTRO_REFRESH_MS=60000;
const ANDAMENTOS_REFRESH_MS=30000;
const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:60000,refetchOnWindowFocus:false}}});

// The routes-testing build is an isolated, read-only preview. Its static config
// is not the staging build, so route selection cannot depend on a staging flag.
export const readModelEnabled=()=>import.meta.env.MODE==='routes-testing'
  ||Boolean((window as Window&{MBA_DASHBOARD_V1_ENABLED?:boolean}).MBA_DASHBOARD_V1_ENABLED);

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
  const isCadastro=dashboard==='cadastro';
  const isAndamentos=dashboard==='andamentos';
  useEffect(()=>isCadastro
    ?onCadastroInvalidate(()=>void cache.invalidateQueries({queryKey:['dashboard-v1','cadastro']})):undefined,[isCadastro]);
  const api=getApi();
  const portfolio=currentPortfolio();
  const summary=useQuery({
    queryKey:['dashboard-v1',dashboard,runtimeScope(),portfolio,revision],
    enabled:Boolean(visible&&portfolio&&api),
    staleTime:isCadastro||isAndamentos?15000:60000,
    refetchOnWindowFocus:isCadastro||isAndamentos,
    refetchInterval:visible&&(isCadastro||isAndamentos)
      ?(isCadastro?CADASTRO_REFRESH_MS:ANDAMENTOS_REFRESH_MS):false,
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
    const card=data.cards?.[name];
    // Confirmed-minimum 0: has_unknown=true is incomplete coverage ("sem dado"); has_unknown=false is a certified real 0.
    // Old responses without has_unknown keep the conservative rule: treat as "sem dado".
    if(dashboard==='andamentos'&&card?.value_semantics==='confirmed_minimum'&&card.value===0){
      if(card.has_unknown===false)return {kind:'certified',value:0,source:card.provenance?.source??card.source??null,reasons:[]};
      return {kind:'absent',reasons:['CONFIRMED_MINIMUM_ZERO_NO_BASIS']};
    }
    const state=classifyCard(card);
    return state.kind==='absent'&&!state.reasons?.length?{...state,reasons:['NO_FROZEN_DETAILS']}:state;
  };
  const when=(iso?:string)=>{if(!iso)return '—';const d=new Date(iso);return Number.isNaN(d.getTime())?iso:d.toLocaleString('pt-BR',{dateStyle:'short',timeStyle:'short'});};
  const uncertified=Boolean(data&&data.status!=='UNAVAILABLE'&&!certified);
  // Preserve Cadastro's accessible, quiet certification status without a banner.
  const status=isCadastro&&uncertified?['não certificado',reasonText(limitations)].filter(Boolean).join(' — '):'';
  return <section className="base-geral-panel mba-read-model" aria-label={'Read Model V1 — '+dashboard+(status?' — '+status:'')} data-dashboard={dashboard}>
    {dashboard!=='andamentos'&&<header className="mba-read-model-head">
      <div><h2>Read Model V1</h2>
        <span className="base-geral-context">{data?.revision?`Revisão ${data.revision} · dados até ${when(data.data_as_of)} · calculado ${when(data.calculated_at)}`:'Publicação revisionada'}</span>
      </div>
      {!isCadastro&&uncertified&&<span className="mba-data-tag mba-data-tag--warn" title={reasonText(limitations)}>não certificado</span>}
      {!isCadastro&&summary.error&&failureState(summary.error).kind==='error'&&<button type="button" className="mba-read-model-retry" onClick={()=>void summary.refetch()} disabled={summary.isFetching}>
        <RefreshCw size={13}/> Recarregar</button>}
    </header>}
    <div className="base-geral-kpis andamento-cards mba-read-model-cards">
      {METRICS[dashboard].map(m=>{
        const state=stateFor(m.name);
        const rev=data?.revision;
        const source=()=>dashboardV1Cases(dashboard,m.name,m.label+' (Read Model)',rev!,portfolio);
        // A partial total is a confirmed lower bound; exact-revision case lists
        // remain unavailable until the producer certifies their coverage.
        const partialWithoutDetails=dashboard==='andamentos'&&state.kind==='uncertified';
        return <MetricCard key={m.name} label={m.label} icon={m.icon} state={state}
          hideCertTag={isCadastro} uncertifiedLabel={dashboard==='andamentos'?'parcial':undefined}
          onOpen={rev&&!partialWithoutDetails?()=>setDrill(source()):undefined}/>;
      })}
    </div>
    {dashboard!=='andamentos'&&limitations.length>0&&<p className="mba-read-model-note">{reasonText(limitations)}</p>}
    {drill&&<MetricCasesDialog source={drill} onClose={()=>setDrill(null)}/>}
  </section>;
}

export function ReadModelDashboard({dashboard,visible=true}:{dashboard:ReadModelName;visible?:boolean}){
  if(!readModelEnabled())return null;
  return <QueryClientProvider client={cache}><Panel dashboard={dashboard} visible={visible}/></QueryClientProvider>;
}
