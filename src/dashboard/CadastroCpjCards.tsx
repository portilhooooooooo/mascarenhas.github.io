import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {CalendarDays,Clock3,FolderArchive,FolderOpen,ShieldCheck} from 'lucide-react';
import {MetricDots} from './dashboardFeedback';
import {runtimeScope} from '../tasks/runtimeQueries';
import './baseGeral.css';

type Summary={metrics:Record<string,number|null>};
type Api={request:<T>(path:string,options?:RequestInit)=>Promise<T>;getPortfolioId?:()=>string};
const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:75000,refetchOnWindowFocus:false}}});
const cards=[
  {key:'entradas',label:'Entradas',icon:FolderOpen},
  {key:'para_cadastro',label:'Cadastrar',icon:Clock3},
  {key:'com_audiencia',label:'Com audiência',icon:CalendarDays},
  {key:'com_liminar',label:'Com liminar',icon:ShieldCheck},
  {key:'em_arquivamento',label:'Arquivar',icon:FolderArchive},
] as const;
const format=(value:unknown)=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0
  ?new Intl.NumberFormat('pt-BR').format(value):'—';
function Content({filtered}:{filtered:boolean}){
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    const change=()=>{cache.clear();setRevision(n=>n+1);};
    const events=['mba:authenticated','mba:profile-ready','mba:portfolio-changed','mba:logged-out','mba:session-expired','mba:authorization-invalidated','mba:server-data-changed'];
    events.forEach(e=>window.addEventListener(e,change));
    return()=>events.forEach(e=>window.removeEventListener(e,change));
  },[]);
  const w=window as Window&{MBA_API?:Api;MBA_AUTOMATION_API?:Api};
  const portfolio=w.MBA_API?.getPortfolioId?.()||'';
  const api=w.MBA_AUTOMATION_API||w.MBA_API;
  const summary=useQuery({
    queryKey:['resultados','cadastro','cpj-cards',runtimeScope(),portfolio,revision],
    enabled:Boolean(portfolio&&api),
    queryFn:({signal})=>api!.request<Summary>('/api/resultados/cadastro/cards',{signal}),
  });
  // Este contrato CPJ ainda não admite filtros de entrada/situação. Não apresentar
  // contagens globais como se tivessem sido filtradas.
  return <>{cards.map(({key,label,icon:Icon})=><article key={key} className="base-geral-card mba-metric-card" aria-label={label}>
    <span className="base-geral-card-top"><span>{label}</span><Icon size={14} strokeWidth={1.7}/></span>
    <strong>{summary.isLoading&&!filtered?<MetricDots/>:filtered?'—':format(summary.data?.metrics?.[key])}</strong>
  </article>)}</>;
}
export function CadastroCpjCards({filtered=false}:{filtered?:boolean}){
  return <QueryClientProvider client={cache}><Content filtered={filtered}/></QueryClientProvider>;
}
