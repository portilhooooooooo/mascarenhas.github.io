import {useEffect,useMemo,useState,type ReactNode} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {Clock3,FolderArchive,FolderOpen,ShieldCheck,UserX} from 'lucide-react';
import {runtimeScope} from '../tasks/runtimeQueries';
import {AUTH_EVENTS,type BackendCard,type CardState,MetricCard,classifyCard,currentPortfolio,failureState,formatCount,getApi,isCount,reasonText} from './metricState';
import {MetricCasesDialog,type CaseSource,cadastroCases} from './MetricCasesDialog';
import './baseGeral.css';

/**
 * GET /api/resultados/cadastro/cards (contract cadastro.cards.v3).
 * Each card carries its own value/status/source; drilldown uses
 * GET /api/resultados/cadastro/processos with the same filters, category and
 * the summary `revision`, so count and list come from the same pinned revision.
 */
type Summary={contract_version?:string;portfolio_id?:string;portfolio_kind?:'ENTER'|'REGULAR';status?:string;
  revision?:string|null;calculated_at?:string|null;source_revision?:Record<string,unknown>|null;
  cards?:Record<string,BackendCard&{chart?:ProductRow[]}>;product_chart?:ProductRow[];metrics?:Record<string,number|null>;
  filters_applied?:Record<string,string|null>;limitations?:string[]};
type ProductRow={label:string;value:number};
type CadastroLayout={cards:ReactNode;agingCards:ReactNode;products:ReactNode};
type Props={filters?:CadastroFilters;children?:(layout:CadastroLayout)=>ReactNode};
export type CadastroFilters={entry_start?:string;entry_end?:string;situation?:string};

const cache=new QueryClient({defaultOptions:{queries:{retry:false,staleTime:75000,refetchOnWindowFocus:false}}});
// `legacy` keys are read only when an older backend omits the per-card object.
const cards=[
  {key:'entradas',legacy:'entradas',label:'Entradas',icon:FolderOpen,drill:true},
  // Cadastrar exists only in Enter (agibank_enter).
  {key:'cadastrar',legacy:'para_cadastro',label:'Cadastrar',icon:Clock3,drill:true,only:'agibank_enter'},
  {key:'com_liminar',legacy:'com_liminar',label:'Com liminar',icon:ShieldCheck,drill:true},
  {key:'arquivar',legacy:'em_arquivamento',label:'Arquivar',icon:FolderArchive,drill:true},
  {key:'desconsideracao_patrocinio',legacy:'desconsideracao_patrocinio',label:'Desconsideração de patrocínio',icon:UserX,drill:true},
] as const;

const agingCards=[
  {key:'ativos',label:'Ativos',icon:FolderOpen},
  {key:'prescritos',label:'Prescritos',icon:Clock3},
] as const;

function Content({filters={},children}:Props){
  const [revision,setRevision]=useState(0);
  const [drill,setDrill]=useState<{scope:string;source:CaseSource}|null>(null);
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
  const scope=JSON.stringify([runtimeScope(),portfolio,qs,revision]);
  useEffect(()=>setDrill(null),[scope]);
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
  const stateFor=(key:string,legacy?:string):CardState=>{
    if(!api||!portfolio)return {kind:'unauthenticated',message:'Sessão não autenticada.'};
    if(summary.isLoading)return {kind:'loading'};
    if(summary.error)return failureState(summary.error);
    if(filterIgnored)return {kind:'absent',reasons:['FILTER_NOT_APPLIED']};
    const card=data?.cards?.[key]??(legacy&&data?.metrics&&legacy in data.metrics?{value:data.metrics[legacy]}:undefined);
    return classifyCard(card,data?.status);
  };
  // Drill only against the pinned revision of the counts shown; no revision → not drillable.
  const pinned=typeof data?.revision==='string'&&data.revision?data.revision:null;
  const visible=cards.filter(c=>!('only' in c)||(c.only===portfolio
    &&String(data?.cards?.[c.key]?.status||'').toUpperCase()!=='NOT_APPLICABLE'));
  const open=(key:string,label:string)=>pinned
    ?()=>setDrill({scope,source:cadastroCases(key,label,query,pinned)}):undefined;
  const cardNodes=visible.map(({key,legacy,label,icon,drill:canDrill})=><MetricCard key={key} label={label} icon={icon}
    state={stateFor(key,legacy)} onOpen={canDrill?open(key,label):undefined}/>);
  const agingNodes=agingCards.map(({key,label,icon})=><MetricCard key={key} label={label} icon={icon}
    state={stateFor(key)} onOpen={open(key,label)}/>);
  const productState=stateFor('produtos');
  const productAvailable=productState.kind==='certified'||productState.kind==='uncertified';
  const chart=data?.product_chart??data?.cards?.produtos?.chart;
  // Reject malformed/missing charts instead of publishing a fabricated zero total.
  const products=productAvailable&&Array.isArray(chart)&&chart.every(row=>row&&typeof row.label==='string'&&isCount(row.value))
    ?[...chart].sort((a,b)=>b.value-a.value):null;
  const productTotal=products?products.reduce((sum,row)=>sum+row.value,0):null;
  const productDetail='reasons' in productState?reasonText(productState.reasons)
    :'message' in productState?productState.message:'';
  const productTable=<section className="base-geral-panel base-geral-products-table cadastro-products" aria-label="Produtos">
    <header><div><h2>Produtos</h2>
      {productState.kind==='uncertified'&&products&&<span className="mba-data-tag mba-data-tag--warn" title={productDetail}>não certificado</span>}
      {productState.kind!=='loading'&&!products&&<span className="mba-data-tag mba-data-tag--muted" title={productDetail}>sem dados</span>}
    </div><span className="base-geral-tally">{productTotal===null?'—':formatCount(productTotal)} processos</span></header>
    <div className="base-geral-table-scroll"><table className="base-geral-products">
      <thead><tr><th>Produto</th><th>Processos</th><th>Participação</th></tr></thead>
      <tbody>{products?.length?products.map(row=>{
        const share=productTotal?row.value/productTotal*100:0;
        return <tr key={row.label}><td>{row.label}</td><td>{formatCount(row.value)}</td>
          <td><div className="base-geral-product-share"><div className="base-geral-product-share-track" aria-hidden="true"><span style={{width:share+'%'}}/></div><span>{share.toFixed(1).replace('.',',')}%</span></div></td></tr>;
      }):<tr><td colSpan={3} className="base-geral-empty">—</td></tr>}</tbody>
    </table></div>
  </section>;
  return <>
    {children?children({cards:cardNodes,agingCards:agingNodes,products:productTable}):cardNodes}
    {drill?.scope===scope&&<MetricCasesDialog source={drill.source} onClose={()=>setDrill(null)}/>}
  </>;
}
export function CadastroCpjCards(props:Props){
  return <QueryClientProvider client={cache}><Content {...props}/></QueryClientProvider>;
}
