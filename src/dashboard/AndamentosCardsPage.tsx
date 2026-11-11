import {useEffect,useState} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {Archive,BookOpen,FileCheck2,Scale,PauseCircle,Gavel,CheckCircle2,ShieldAlert} from 'lucide-react';
import {SelectMenu} from './SelectMenu';
import {runtimeScope} from '../tasks/runtimeQueries';
import {AUTH_EVENTS,type BackendCard,type CardState,MetricCard,classifyCard,currentPortfolio,failureState,getApi} from './metricState';
import {ReadModelDashboard} from './ReadModelDashboard';
import './baseGeral.css';

/**
 * GET /api/resultados/andamentos/cards[?office=].
 * Preferred contract: `cards[<KIND>] = {value,status|data_status,source,...}`.
 * Legacy contract (metrics.by_event_kind) carries no certification, so its
 * numbers are always labelled "não certificado". A kind missing from the
 * published counts is "sem dados", never an invented zero.
 */
type CardSummary={status?:string;portfolio_id?:string;cards?:Record<string,BackendCard>;
  metrics?:{by_event_kind?:Record<string,number|null>;fase_conhecimento?:number|null};
  charts?:{offices?:string[]};limitations?:string[]};
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
  {key:'TRANSITO_EM_JULGADO_DERROTA',label:'Trânsito em julgado - Derrota',icon:Scale},
  {key:'SUSPENSAO',label:'Suspensos',icon:PauseCircle},
  {key:'PEDIDO_BLOQUEIO',label:'Pedido de bloqueio',icon:ShieldAlert},
  {key:'CUMPRIMENTO_SENTENCA',label:'Cumprimento de Sentença',icon:Gavel},
] as const;

function legacyCard(data:CardSummary,key:string):BackendCard|undefined{
  const m=data.metrics;
  if(!m)return undefined;
  const limitations=Array.isArray(data.limitations)?data.limitations:[];
  if(key==='FASE_CONHECIMENTO')
    return {value:m.fase_conhecimento,status:m.fase_conhecimento==null?'UNAVAILABLE':'PARTIAL',limitations};
  const value=m.by_event_kind?.[key];
  if(value===undefined)return {status:'UNAVAILABLE',limitations:[...limitations,'NO_PUBLISHED_EVENTS_FOR_KIND']};
  // Legacy body status CURRENT only means "events published", not certified coverage.
  return {value,status:'PARTIAL',limitations};
}

function Content({visible}:{visible:boolean}){
  const [revision,setRevision]=useState(0);
  const [office,setOffice]=useState('');
  useEffect(()=>{
    const sync=()=>{cache.clear();setOffice('');setRevision(x=>x+1);};
    AUTH_EVENTS.forEach(e=>window.addEventListener(e,sync));
    return()=>AUTH_EVENTS.forEach(e=>window.removeEventListener(e,sync));
  },[]);
  const api=getApi();
  const portfolio=currentPortfolio();
  const summary=useQuery({queryKey:['resultados','andamentos','published-cards',runtimeScope(),portfolio,office,revision],
    enabled:Boolean(visible&&portfolio&&api),
    queryFn:async({signal})=>{
      const body=await api!.request<CardSummary>('/api/resultados/andamentos/cards'+(office?'?office='+encodeURIComponent(office):''),{signal});
      if(body?.portfolio_id&&body.portfolio_id!==portfolio)throw Object.assign(new Error('Resposta de outra carteira descartada.'),{status:502});
      return body;
    },
  });
  const data=summary.data;
  const offices=Array.isArray(data?.charts?.offices)?data!.charts!.offices!:[];
  const stateFor=(key:string):CardState=>{
    if(!api||!portfolio)return {kind:'unauthenticated',message:'Sessão não autenticada.'};
    if(summary.isLoading)return {kind:'loading'};
    if(summary.error)return failureState(summary.error);
    if(!data)return {kind:'absent',reasons:[]};
    return data.cards?classifyCard(data.cards[key],data.status):classifyCard(legacyCard(data,key),data.status);
  };
  return <section className="base-geral-page" aria-label="Andamentos">
    <div className="andamentos-office-filter base-geral-filters">
      <SelectMenu label="Escritório" className="base-geral-filter" value={office} onChange={setOffice}
        options={[{value:'',label:'Todos'},...offices.map(name=>({value:name,label:name}))]} searchable={offices.length>8}/>
    </div>
    <div className="base-geral-kpis andamento-cards">
      {cards.map(({key,label,icon})=><MetricCard key={key} label={label} icon={icon} state={stateFor(key)}/>)}
    </div>
    <ReadModelDashboard dashboard="andamentos" visible={visible}/>
  </section>;
}
export function AndamentosCardsPage({visible=true}:{visible?:boolean}){return <QueryClientProvider client={cache}><Content visible={visible}/></QueryClientProvider>; }
