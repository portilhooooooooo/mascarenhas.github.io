import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {CheckCircle2,CirclePause,Clock3,FileCheck2,FolderOpen,Hourglass,ShieldAlert} from 'lucide-react';
import {SelectMenu} from './SelectMenu';
import {runtimeScope} from '../tasks/runtimeQueries';
import './baseGeral.css';

type CardSummary={
  status:'CURRENT'|'PARTIAL'|'UNAVAILABLE'|'STALE';
  metrics:Record<string,number|null>;
  charts:{offices:string[]};
  limitations:string[];
};
type Api={request:<T>(path:string,options?:RequestInit)=>Promise<T>;getPortfolioId?:()=>string};
const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:75000,refetchOnWindowFocus:false}}});
const cards=[
  {key:'entradas',label:'Entradas',icon:FolderOpen},
  {key:'para_cadastro',label:'Para cadastro',icon:Clock3},
  {key:'com_citacao',label:'Com citação',icon:FileCheck2},
  {key:'suspenso',label:'Suspenso',icon:CirclePause},
  {key:'desconsideracao_patrocinio',label:'Desconsideração de patrocínio',icon:ShieldAlert},
  {key:'em_arquivamento',label:'Em arquivamento',icon:Hourglass},
  {key:'faturavel',label:'Faturável',icon:CheckCircle2},
] as const;
const getApi=()=>{
  const w=window as Window&{MBA_API?:Api;MBA_AUTOMATION_API?:Api};
  return w.MBA_AUTOMATION_API||w.MBA_API;
};
function Content(){
  const [office,setOffice]=useState('');
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    const change=()=>{cache.clear();setOffice('');setRevision(x=>x+1);};
    const events=['mba:authenticated','mba:profile-ready','mba:portfolio-changed','mba:logged-out','mba:session-expired','mba:authorization-invalidated','mba:server-data-changed'];
    events.forEach(event=>window.addEventListener(event,change));
    return()=>events.forEach(event=>window.removeEventListener(event,change));
  },[]);
  const api=getApi();
  const portfolio=(window as Window&{MBA_API?:Api}).MBA_API?.getPortfolioId?.()||'';
  const enabled=Boolean(portfolio&&api);
  const summary=useQuery({
    queryKey:['resultados','cadastro','cpj-cards',runtimeScope(),portfolio,office,revision],
    enabled,
    queryFn:({signal})=>api!.request<CardSummary>('/api/resultados/cadastro/cards'+(office?'?office='+encodeURIComponent(office):''),{signal}),
  });
  const offices=Array.isArray(summary.data?.charts.offices)?summary.data!.charts.offices:[];
  const number=(value:unknown)=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0
    ?new Intl.NumberFormat('pt-BR').format(value):'—';
  return <>
    <div className="cadastro-cpj-toolbar">
      <SelectMenu label="Escritório (CPJ)" className="base-geral-filter" value={office} onChange={setOffice}
        options={[{value:'',label:'Todos'},...offices.map(name=>({value:name,label:name}))]} searchable={offices.length>8}/>
      <span className="base-geral-muted">Prescrito e Faturamento preservam os cálculos existentes.</span>
    </div>
    {cards.map(({key,label,icon:Icon})=><article className="base-geral-card mba-metric-card" key={key}>
      <span className="base-geral-card-top"><span>{label}</span><Icon size={15} strokeWidth={1.7}/></span>
      <strong>{summary.isPending?'—':number(summary.data?.metrics?.[key])}</strong>
    </article>)}
    <div className="cadastro-cpj-note">
      {!enabled&&<p className="base-geral-muted">Sessão ou carteira indisponível.</p>}
      {enabled&&summary.isPending&&<p className="base-geral-muted">Consultando cadastros publicados...</p>}
      {enabled&&summary.error&&<p role="alert" className="base-geral-error">Falha ao consultar os cadastros do CPJ.</p>}
      {summary.data?.status==='UNAVAILABLE'&&<p className="base-geral-muted">Nenhum cadastro CPJ publicado no contrato canônico desta carteira.</p>}
      {summary.data?.status==='STALE'&&<p className="base-geral-muted">Indicadores temporariamente defasados.</p>}
      {summary.data?.limitations.includes('CPJ_STATUS_COVERAGE_INCOMPLETE')&&<p className="base-geral-muted">Algumas situações ainda não têm classificação comprovada.</p>}
    </div>
  </>;
}
export function CadastroCpjCards(){
  return <QueryClientProvider client={cache}><Content/></QueryClientProvider>;
}
