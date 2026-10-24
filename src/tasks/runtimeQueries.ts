import { QueryClient } from '@tanstack/react-query';

export const runtimeQueries = new QueryClient({defaultOptions:{queries:{
  staleTime:45000,gcTime:300000,retry:false,refetchOnWindowFocus:false,
}}});
export function runtimeScope() {
  const w = window as Window & {MBA_CURRENT_USER?: {id?:string;role?:string;permissions?:Record<string,boolean>};MBA_API?:{getPortfolioId?:()=>string}};
  const user=w.MBA_CURRENT_USER;
  if(!user) return '';
  return JSON.stringify([user.id,(window as Window & {MBA_SESSION_GENERATION?:string}).MBA_SESSION_GENERATION,w.MBA_API?.getPortfolioId?.(),user.role,
    Object.entries(user.permissions||{}).sort(([a],[b])=>a.localeCompare(b)),'runtime-v2.1']);
}
let scope=runtimeScope();
for(const event of ['mba:authenticated','mba:profile-ready','mba:logged-out','mba:session-expired','mba:portfolio-changed']) {
  window.addEventListener(event,()=>{
    const next=runtimeScope();
    if(next)pruneRuntimeStorage(next);
    if(next!==scope || event==='mba:portfolio-changed' || event==='mba:logged-out' || event==='mba:session-expired') {
      if(scope || event==='mba:portfolio-changed' || event==='mba:logged-out' || event==='mba:session-expired')purgeRuntimeStorage();
      void runtimeQueries.cancelQueries(); runtimeQueries.clear(); scope=next;
    }
  });
}

export type SummarySnapshot={completed:number;today_completed:number;people:number;recorded:number};
const SNAPSHOT_PREFIX='mba_runtime_summary:';
const checksum=(text:string)=>{let h=2166136261;for(let i=0;i<text.length;i++)h=Math.imul(h^text.charCodeAt(i),16777619);return (h>>>0).toString(16);};
export function purgeRuntimeStorage(){
  try{for(const key of Object.keys(sessionStorage)) if(key.startsWith(SNAPSHOT_PREFIX)||key.startsWith('mba_runtime_filters:'))sessionStorage.removeItem(key);}catch{/* Storage unavailable. */}
}
export function readSummary(key:string):SummarySnapshot|null {
  try {
    if(!runtimeScope())return null;
    const raw=sessionStorage.getItem(SNAPSHOT_PREFIX+key);
    if(!raw || raw.length>4096)return null;
    const value=JSON.parse(raw);
    if(value.version!==1 || !Number.isFinite(value.at) || Date.now()-value.at>120000 || value.at>Date.now()+1000 || value.checksum!==checksum(JSON.stringify(value.data)))return null;
    if(Object.keys(value.data).sort().join(',')!=='completed,people,recorded,today_completed' || !Object.values(value.data).every(v=>typeof v==='number'&&Number.isFinite(v)&&v>=0))return null;
    return value.data;
  }catch{return null;}
}
export function saveSummary(key:string,data:SummarySnapshot){
  try{if(runtimeScope())sessionStorage.setItem(SNAPSHOT_PREFIX+key,JSON.stringify({version:1,at:Date.now(),data,checksum:checksum(JSON.stringify(data))}));}catch{/* Quota failure must not block queries. */}
}

function pruneRuntimeStorage(next:string){
 try{for(const key of Object.keys(sessionStorage)){
  if(key.startsWith(SNAPSHOT_PREFIX)){let owner='';try{owner=JSON.parse(key.slice(SNAPSHOT_PREFIX.length))[0];}catch{}if(owner!==next)sessionStorage.removeItem(key);}
  if(key.startsWith('mba_runtime_filters:')&&key.slice('mba_runtime_filters:'.length)!==next)sessionStorage.removeItem(key);
 }}catch{/* Storage disabled. */}
}
if(scope)pruneRuntimeStorage(scope);

// One bridge for confirmed mutations/realtime; hidden observers are only marked
// stale and revalidate on reentry. No optimistic or duplicated write is issued.
for(const event of ['mba:server-data-changed','mba:realtime-invalidate'])window.addEventListener(event,(raw:Event)=>{
 const detail=(raw as CustomEvent<{module?:string;portfolio_id?:string}>).detail;
 const w=window as Window & {MBA_API?:{getPortfolioId?:()=>string}};
 if(detail?.portfolio_id && detail.portfolio_id!==w.MBA_API?.getPortfolioId?.())return;
 const names=detail?.module==='tarefas'?['tasks-results','task-assignees','encerramentos']:
   detail?.module==='encerramentos'?['tasks-results','encerramentos','base-geral']:
   detail?.module==='pagamentos'?['base-geral']:[];
 if(names.length)void runtimeQueries.invalidateQueries({predicate:query=>query.queryKey[0]==='runtime-v2' && query.queryKey[1]===runtimeScope() && names.includes(String(query.queryKey[2]))});
});
