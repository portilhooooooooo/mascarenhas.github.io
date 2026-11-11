import {useEffect,useMemo,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {CalendarDays,Clock3,FolderArchive,FolderOpen,ShieldCheck} from 'lucide-react';
import {runtimeScope} from '../tasks/runtimeQueries';
import {AUTH_EVENTS,type BackendCard,type CardState,MetricCard,classifyCard,currentPortfolio,failureState,getApi} from './metricState';
import {MetricCasesDialog,type CaseSource,cadastroCases} from './MetricCasesDialog';
import './baseGeral.css';

/**
 * GET /api/resultados/cadastro/cards (contract cadastro.cards.v2.x).
 * Each card carries its own value/status/source; drilldown uses
 * GET /api/resultados/cadastro/processos with the same filters and category.
 */
type Summary={contract_version?:string;portfolio_id?:string;status?:string;
  cards?:Record<string,BackendCard>;metrics?:Record<string,number|null>;
  filters_applied?:Record<string,string|null>;limitations?:string[]};
export type CadastroFilters={entry_start?:string;entry_end?:string;situation?:string};

const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:75000,refetchOnWindowFocus:false}}});
// `legacy` keys are read only when an older backend omits the per-card object.
const cards=[
  {key:'entradas',legacy:'entradas',label:'Entradas',icon:FolderOpen,drill:true},
  {key:'cadastrar',legacy:'para_cadastro',label:'Cadastrar',icon:Clock3,drill:true},
  {key:'com_audiencia',legacy:'com_audiencia',label:'Com audiência',icon:CalendarDays,drill:false},
  {key:'com_liminar',legacy:'com_liminar',label:'Com liminar',icon:ShieldCheck,drill:true},
  {key:'arquivar',legacy:'em_arquivamento',label:'Arquivar',icon:FolderArchive,drill:true},
] as const;

function Content({filters}:{filters:CadastroFilters}){
  const [revision,setRevision]=useState(0);
  const [drill,setDrill]=useState<CaseSource|null>(null);
  useEffect(()=>{
    const change=()=>{cache.clear();setDrill(null);setRevision(n=>n+1);};
    AUTH_EVENTS.forEach(e=>window.addEventListener(e,change));
    return()=>AUTH_EVENTS.forEach(e=>window.removeEventListener(e,change));
  },[]);
  const api=getApi();
  const portfolio=currentPortfolio();
  const query=useMemo(()=>{
    const p=new URLSearchParams();
    for(const k of ['entry_start','entry_end','situation'] as const)if(filters[k])p.set(k,filters[k]!);
    return p;
  },[filters.entry_start,filters.entry_end,filters.situation]);
  const qs=query.toString();
  const summary=useQuery({
    queryKey:['resultados','cadastro','cards',runtimeScope(),portfolio,qs,revision],
    enabled:Boolean(portfolio&&api),
    queryFn:async({signal})=>{
      const body=await api!.request<Summary>('/api/resultados/cadastro/cards'+(qs?'?'+qs:''),{signal});
      if(body?.portfolio_id&&body.portfolio_id!==portfolio)throw Object.assign(new Error('Resposta de outra carteira descartada.'),{status:502});
      return body;
    },
  });
  const data=summary.data;
  // The backend must echo every requested filter; otherwise counts are global, not filtered.
  const filterIgnored=Boolean(data)&&[...query.entries()].some(([k,v])=>(data!.filters_applied?.[k]??null)!==v);
  const stateFor=(key:string,legacy:string):CardState=>{
    if(!api||!portfolio)return {kind:'unauthenticated',message:'Sessão não autenticada.'};
    if(summary.isLoading)return {kind:'loading'};
    if(summary.error)return failureState(summary.error);
    if(filterIgnored)return {kind:'absent',reasons:['FILTER_NOT_APPLIED']};
    const card=data?.cards?.[key]??(data?.metrics&&legacy in data.metrics?{value:data.metrics[legacy]}:undefined);
    return classifyCard(card,data?.status);
  };
  return <>
    {cards.map(({key,legacy,label,icon,drill:canDrill})=><MetricCard key={key} label={label} icon={icon}
      state={stateFor(key,legacy)}
      onOpen={canDrill?()=>setDrill(cadastroCases(key,label,query)):undefined}/>)}
    {drill&&<MetricCasesDialog source={drill} onClose={()=>setDrill(null)}/>}
  </>;
}
export function CadastroCpjCards({filters={}}:{filters?:CadastroFilters}){
  return <QueryClientProvider client={cache}><Content filters={filters}/></QueryClientProvider>;
}
