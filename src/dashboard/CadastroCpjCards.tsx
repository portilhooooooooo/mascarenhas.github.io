import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {CheckCircle2,CirclePause,Clock3,FileCheck2,FolderOpen,Hourglass,ShieldAlert} from 'lucide-react';
import {SelectMenu} from './SelectMenu';
import {readSource} from '../v3/backoffice';
import {request,type Access,type Session,type Summary} from '../v3/client';
import './baseGeral.css';

type ScopedAccess=Access&{portfolio_id:string;source_tenant:string;authentication_mode:string};
type CardSummary=Summary&{charts:Summary['charts']&{offices?:string[]}};
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
function Content(){
  const [office,setOffice]=useState('');
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    const change=()=>{cache.clear();setOffice('');setRevision(x=>x+1);};
    const events=['mba:authenticated','mba:profile-ready','mba:portfolio-changed','mba:logged-out','mba:session-expired','mba:authorization-invalidated','mba:server-data-changed'];
    events.forEach(event=>window.addEventListener(event,change));
    return()=>events.forEach(event=>window.removeEventListener(event,change));
  },[]);
  const portfolio=(window as Window&{MBA_API?:{getPortfolioId?:()=>string}}).MBA_API?.getPortfolioId?.()||'';
  const initial:Session={portfolio,tenant:'',token:'',transport:'BACKOFFICE'};
  const enabled=Boolean(portfolio)&&readSource('cadastro')==='V3';
  const access=useQuery({
    queryKey:['analytics','cadastro','access',portfolio,revision],
    enabled,
    queryFn:({signal})=>request<ScopedAccess>(initial,'/status',{},signal),
  });
  const authorized=access.data?.modules.includes('cadastro')===true;
  const session:Session={...initial,tenant:access.data?.source_tenant||''};
  const summary=useQuery({
    queryKey:['analytics','cadastro','cpj-cards',portfolio,session.tenant,access.data?.identity,office,revision],
    enabled:enabled&&authorized,
    queryFn:({signal})=>request<CardSummary>(session,'/cadastro/cards',office?{office}:{},signal),
  });
  const offices=Array.isArray(summary.data?.charts.offices)?summary.data!.charts.offices:[];
  const number=(value:unknown)=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0
    ?new Intl.NumberFormat('pt-BR').format(value):'—';
  return <>
    <div className="cadastro-cpj-toolbar">
      <SelectMenu label="Escritório (CPJ)" className="base-geral-filter" value={office} onChange={setOffice}
        options={[{value:'',label:'Todos'},...offices.map(name=>({value:name,label:name}))]} searchable={offices.length>8}/>
      <span className="base-geral-muted">O filtro de escritório aplica-se aos indicadores do CPJ. Prescrito e Faturamento preservam seus cálculos existentes.</span>
    </div>
    {cards.map(({key,label,icon:Icon})=><article className="base-geral-card mba-metric-card" key={key}>
      <span className="base-geral-card-top"><span>{label}</span><Icon size={15} strokeWidth={1.7}/></span>
      <strong>{summary.isPending?'—':number(summary.data?.metrics?.[key])}</strong>
    </article>)}
    <div className="cadastro-cpj-note">
      {!enabled&&<p className="base-geral-muted">Contrato de leitura CPJ não habilitado neste ambiente.</p>}
      {enabled&&access.isPending&&<p className="base-geral-muted">Verificando acesso aos cadastros...</p>}
      {enabled&&access.error&&<p role="alert" className="base-geral-error">Não foi possível validar a autorização para os cadastros.</p>}
      {enabled&&access.data&&!authorized&&<p role="alert" className="base-geral-error">Acesso aos cadastros não autorizado.</p>}
      {authorized&&summary.error&&<p role="alert" className="base-geral-error">Não foi possível consultar os cadastros publicados.</p>}
      {authorized&&summary.data?.status==='UNAVAILABLE'&&<p className="base-geral-muted">Nenhum cadastro CPJ publicado no contrato canônico desta carteira.</p>}
      {authorized&&summary.data?.limitations.includes('CPJ_STATUS_COVERAGE_INCOMPLETE')&&<p className="base-geral-muted">Algumas situações do CPJ não possuem classificação comprovada; não foram convertidas em zero.</p>}
    </div>
  </>;
}
export function CadastroCpjCards(){
  return <QueryClientProvider client={cache}><Content/></QueryClientProvider>;
}
