import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {BookOpen,FileCheck2,FileText,Archive,Scale,PauseCircle,RotateCcw,Gavel} from 'lucide-react';
import {readSource} from '../v3/backoffice';
import {request,type Access,type Session,type Summary} from '../v3/client';
import './baseGeral.css';

type ScopedAccess=Access & {portfolio_id:string;source_tenant:string;authentication_mode:string};
const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:75000,refetchOnWindowFocus:false}}});
const labels=[
  {key:'SENTENCA',label:'Sentenças',icon:Gavel},
  {key:'ACORDAO',label:'Acórdãos',icon:Scale},
  {key:'TUTELA',label:'Tutelas',icon:FileCheck2},
  {key:'SUSPENSAO',label:'Suspensões',icon:PauseCircle},
  {key:'TRANSITO_EM_JULGADO',label:'Trânsito em julgado',icon:BookOpen},
  {key:'ARQUIVAMENTO',label:'Arquivamentos',icon:Archive},
  {key:'RECURSO',label:'Recursos',icon:RotateCcw},
  {key:'MOVIMENTACAO_NAO_CLASSIFICADA',label:'Não classificados',icon:FileText},
] as const;
const numeric=(value:unknown):number|null=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0?value:null;
const number=(value:number|null)=>value===null?'—':new Intl.NumberFormat('pt-BR').format(value);

function AndamentosContent(){
  const [revision,setRevision]=useState(0);
  useEffect(()=>{
    const sync=()=>{cache.clear();setRevision(x=>x+1);};
    const events=['mba:authenticated','mba:profile-ready','mba:portfolio-changed','mba:logged-out','mba:session-expired','mba:authorization-invalidated','mba:server-data-changed'];
    events.forEach(event=>window.addEventListener(event,sync));
    return()=>events.forEach(event=>window.removeEventListener(event,sync));
  },[]);
  const portfolio=(window as Window&{MBA_API?:{getPortfolioId?:()=>string}}).MBA_API?.getPortfolioId?.()||'';
  const initial:Session={portfolio,tenant:'',token:'',transport:'BACKOFFICE'};
  const active=Boolean(portfolio)&&readSource('andamentos')==='V3';
  const access=useQuery({
    queryKey:['analytics','andamentos','access',portfolio,revision],
    enabled:active,
    queryFn:({signal})=>request<ScopedAccess>(initial,'/status',{},signal),
  });
  const authorized=access.data?.modules.includes('andamentos')===true;
  const session:Session={...initial,tenant:access.data?.source_tenant||''};
  const summary=useQuery({
    queryKey:['analytics','andamentos','semantic-summary',portfolio,session.tenant,access.data?.identity,revision],
    enabled:active&&authorized,
    queryFn:({signal})=>request<Summary>(session,'/andamentos/summary',{},signal),
  });
  // O backend agrega apenas eventos já publicados no contrato canônico.
  // Não inferir classificações a partir de descrições no navegador.
  const byKind=summary.data?.metrics?.by_event_kind;
  const counts=byKind&&typeof byKind==='object'&&!Array.isArray(byKind)
    ? byKind as Record<string,unknown>:null;
  const hasSemanticMetrics=counts!==null;
  return <section className="base-geral-page" aria-label="Classificação semântica dos andamentos">
    <div className="base-geral-kpis cadastro-cards">
      {labels.map(({key,label,icon:Icon})=><article key={key} className="base-geral-card mba-metric-card" aria-label={label}>
        <span className="base-geral-card-top"><span>{label}</span><Icon size={15} strokeWidth={1.7}/></span>
        <strong>{number(numeric(counts?.[key]))}</strong>
      </article>)}
    </div>
    {!active&&<p className="base-geral-muted">Contrato de leitura dos andamentos não habilitado neste ambiente.</p>}
    {active&&access.isPending&&<p className="base-geral-muted">Consultando contrato publicado...</p>}
    {active&&access.error&&<p className="base-geral-error" role="alert">Não foi possível validar o acesso ao contrato dos andamentos.</p>}
    {active&&access.data&&!authorized&&<p className="base-geral-error" role="alert">Acesso aos andamentos não autorizado para este perfil.</p>}
    {authorized&&summary.isPending&&<p className="base-geral-muted">Consultando indicadores publicados...</p>}
    {authorized&&summary.error&&<p className="base-geral-error" role="alert">Indicadores indisponíveis no contrato de andamentos.</p>}
    {authorized&&summary.data&&!hasSemanticMetrics&&<p className="base-geral-muted">Os indicadores semânticos ainda não foram publicados no resumo do contrato final.</p>}
    {authorized&&summary.data?.status==='STALE'&&<p className="base-geral-muted">Última publicação de indicadores defasada.</p>}
  </section>;
}
export function AndamentosCardsPage(){
  return <QueryClientProvider client={cache}><AndamentosContent/></QueryClientProvider>;
}
