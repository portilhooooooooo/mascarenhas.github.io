import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {BookOpen,FileCheck2,FileText,Archive,Scale,PauseCircle,RotateCcw,Gavel} from 'lucide-react';
import {SelectMenu} from './SelectMenu';
import {runtimeScope} from '../tasks/runtimeQueries';
import './baseGeral.css';

type CardSummary={
  status:'CURRENT'|'PARTIAL'|'UNAVAILABLE'|'STALE';
  metrics:{by_event_kind?:Record<string,number>;fase_conhecimento?:number|null};
  charts:{offices:string[]};
  limitations:string[];
};
type Api={request:<T>(path:string,options?:RequestInit)=>Promise<T>;getPortfolioId?:()=>string};
const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:75000,refetchOnWindowFocus:false}}});
const labels=[
  {key:'FASE_CONHECIMENTO',label:'Fase de conhecimento',icon:BookOpen},
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
const getApi=()=>{
  const w=window as Window&{MBA_API?:Api;MBA_AUTOMATION_API?:Api};
  return w.MBA_AUTOMATION_API||w.MBA_API;
};

function AndamentosContent(){
  const [revision,setRevision]=useState(0);
  const [office,setOffice]=useState('');
  useEffect(()=>{
    const sync=()=>{cache.clear();setOffice('');setRevision(x=>x+1);};
    const events=['mba:authenticated','mba:profile-ready','mba:portfolio-changed','mba:logged-out','mba:session-expired','mba:authorization-invalidated','mba:server-data-changed'];
    events.forEach(event=>window.addEventListener(event,sync));
    return()=>events.forEach(event=>window.removeEventListener(event,sync));
  },[]);
  const api=getApi();
  const portfolio=(window as Window&{MBA_API?:Api}).MBA_API?.getPortfolioId?.()||'';
  const enabled=Boolean(portfolio&&api);
  const summary=useQuery({
    queryKey:['resultados','andamentos','published-cards',runtimeScope(),portfolio,office,revision],
    enabled,
    queryFn:({signal})=>api!.request<CardSummary>('/api/resultados/andamentos/cards'+(office?'?office='+encodeURIComponent(office):''),{signal}),
  });
  const data=summary.data;
  const counts=data?.metrics?.by_event_kind||{};
  const offices=Array.isArray(data?.charts.offices)?data!.charts.offices:[];
  return <section className="base-geral-page" aria-label="Classificação semântica dos andamentos">
    <div className="andamentos-office-filter base-geral-filters">
      <SelectMenu label="Escritório" className="base-geral-filter" value={office} onChange={setOffice}
        options={[{value:'',label:'Todos'},...offices.map(name=>({value:name,label:name}))]}
        searchable={offices.length>8}/>
    </div>
    <div className="base-geral-kpis cadastro-cards">
      {labels.map(({key,label,icon:Icon})=><article key={key} className="base-geral-card mba-metric-card" aria-label={label}>
        <span className="base-geral-card-top"><span>{label}</span><Icon size={15} strokeWidth={1.7}/></span>
        <strong>{summary.isPending?'—':number(numeric(key==='FASE_CONHECIMENTO'?data?.metrics?.fase_conhecimento:counts[key]))}</strong>
      </article>)}
    </div>
    {!enabled&&<p className="base-geral-muted">Sessão ou carteira indisponível.</p>}
    {enabled&&summary.isPending&&<p className="base-geral-muted">Consultando andamentos publicados...</p>}
    {summary.error&&<p className="base-geral-error" role="alert">Não foi possível consultar os andamentos publicados para esta carteira.</p>}
    {data?.status==='UNAVAILABLE'&&<p className="base-geral-muted">Nenhum andamento publicado no contrato canônico desta carteira e escritório.</p>}
    {data?.status==='STALE'&&<p className="base-geral-muted">Indicadores temporariamente defasados.</p>}
    {data?.limitations.includes('CANONICAL_PROCESS_PHASE_NOT_AVAILABLE')&&<p className="base-geral-muted">Fase de conhecimento indisponível para esta carteira.</p>}
  </section>;
}
export function AndamentosCardsPage(){
  return <QueryClientProvider client={cache}><AndamentosContent/></QueryClientProvider>;
}
