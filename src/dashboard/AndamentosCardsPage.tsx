import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {Archive,BookOpen,FileCheck2,FileText,Scale,PauseCircle,Gavel,CheckCircle2} from 'lucide-react';
import {SelectMenu} from './SelectMenu';
import {MetricDots} from './dashboardFeedback';
import {runtimeScope} from '../tasks/runtimeQueries';
import './baseGeral.css';

type CardSummary={status:'CURRENT'|'PARTIAL'|'UNAVAILABLE'|'STALE';metrics:{by_event_kind?:Record<string,number|null>;fase_conhecimento?:number|null};charts:{offices:string[]}};
type Api={request:<T>(path:string,options?:RequestInit)=>Promise<T>;getPortfolioId?:()=>string};
const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:75000,refetchOnWindowFocus:false}}});
const cards=[
  {key:'FASE_CONHECIMENTO',label:'Fase de conhecimento',icon:BookOpen},
  {key:'SENTENCA_EXTINCAO',label:'Sentença - Extinção',icon:Archive},
  {key:'SENTENCA_IMPROCEDENTE',label:'Sentença - Improcedente',icon:FileCheck2},
  {key:'SENTENCA_PROCEDENTE',label:'Sentença - Procedente',icon:Gavel},
  {key:'RECURSAL_EXTINCAO',label:'Recursal - Extinção',icon:Archive},
  {key:'RECURSAL_IMPROCEDENTE',label:'Recursal - Improcedente',icon:FileCheck2},
  {key:'RECURSAL_PROCEDENTE',label:'Recursal - Procedente',icon:Scale},
  {key:'TRANSITO_EM_JULGADO_VITORIA',label:'Trânsito em julgado - Vitória',icon:CheckCircle2},
  {key:'TRANSITO_EM_JULGADO',label:'Trânsito em julgado',icon:BookOpen},
  {key:'DERROTA_VOLUNTARIA',label:'Derrota voluntária',icon:FileText},
  {key:'SUSPENSAO',label:'Suspensos',icon:PauseCircle},
  {key:'CUMPRIMENTO_SENTENCA',label:'Cumprimento de Sentença',icon:Gavel},
] as const;
const numeric=(value:unknown)=>typeof value==='number'&&Number.isSafeInteger(value)&&value>=0?new Intl.NumberFormat('pt-BR').format(value):'—';
function Content(){
  const [revision,setRevision]=useState(0);
  const [office,setOffice]=useState('');
  useEffect(()=>{
    const sync=()=>{cache.clear();setOffice('');setRevision(x=>x+1);};
    const events=['mba:authenticated','mba:profile-ready','mba:portfolio-changed','mba:logged-out','mba:session-expired','mba:authorization-invalidated','mba:server-data-changed'];
    events.forEach(e=>window.addEventListener(e,sync));
    return()=>events.forEach(e=>window.removeEventListener(e,sync));
  },[]);
  const w=window as Window&{MBA_API?:Api;MBA_AUTOMATION_API?:Api};
  const portfolio=w.MBA_API?.getPortfolioId?.()||'';
  const api=w.MBA_AUTOMATION_API||w.MBA_API;
  const summary=useQuery({queryKey:['resultados','andamentos','published-cards',runtimeScope(),portfolio,office,revision],
    enabled:Boolean(portfolio&&api),
    queryFn:({signal})=>api!.request<CardSummary>('/api/resultados/andamentos/cards'+(office?'?office='+encodeURIComponent(office):''),{signal}),
  });
  const data=summary.data;
  const counts=data?.metrics?.by_event_kind||{};
  const offices=Array.isArray(data?.charts?.offices)?data!.charts.offices:[];
  return <section className="base-geral-page" aria-label="Andamentos">
    <div className="andamentos-office-filter base-geral-filters">
      <SelectMenu label="Escritório" className="base-geral-filter" value={office} onChange={setOffice}
        options={[{value:'',label:'Todos'},...offices.map(name=>({value:name,label:name}))]} searchable={offices.length>8}/>
    </div>
    <div className="base-geral-kpis andamento-cards">
      {cards.map(({key,label,icon:Icon})=><article key={key} className="base-geral-card mba-metric-card" aria-label={label}>
        <span className="base-geral-card-top"><span>{label}</span><Icon size={14} strokeWidth={1.7}/></span>
        <strong>{summary.isPending?<MetricDots/>:numeric(key==='FASE_CONHECIMENTO'?data?.metrics?.fase_conhecimento:counts[key])}</strong>
      </article>)}
    </div>
  </section>;
}
export function AndamentosCardsPage(){return <QueryClientProvider client={cache}><Content/></QueryClientProvider>;}
