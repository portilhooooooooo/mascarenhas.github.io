import { QueryClient } from '@tanstack/react-query';

export const runtimeQueries = new QueryClient({defaultOptions:{queries:{
  staleTime:45000,gcTime:300000,retry:false,refetchOnWindowFocus:false,
}}});
type QueryMetric={module:string;cache:'hit'|'miss'|'revalidate';ms?:number;result?:string;payloadBytes?:number};
const queryStarts=new WeakMap<object,{at:number;cache:'miss'|'revalidate'}>();
const observerEnabled=new WeakMap<object,boolean>();
function recordQueryMetric(entry:QueryMetric){
 const env=window as Window & {MBA_RUNTIME_QUERY_METRICS?:QueryMetric[]};
 const rows=env.MBA_RUNTIME_QUERY_METRICS||(env.MBA_RUNTIME_QUERY_METRICS=[]);
 rows.push(entry);if(rows.length>100)rows.shift();
}
runtimeQueries.getQueryCache().subscribe(event=>{
 const query=event.query;if(query.queryKey[0]!=='runtime-v2')return;
 const module=String(query.queryKey[2]);
 if(query.state.fetchStatus==='fetching'&&!queryStarts.has(query))queryStarts.set(query,{at:performance.now(),cache:query.state.data===undefined?'miss':'revalidate'});
 else if(query.state.fetchStatus==='idle'&&queryStarts.has(query)){
  const start=queryStarts.get(query)!;queryStarts.delete(query);
  let payloadBytes:number|undefined;
  try{if(query.state.data!==undefined)payloadBytes=new TextEncoder().encode(JSON.stringify(query.state.data)).byteLength;}catch{}
  recordQueryMetric({module,cache:start.cache,ms:performance.now()-start.at,result:query.state.status,payloadBytes});
 }
 if(event.type==='observerAdded'||event.type==='observerOptionsUpdated'){
  const active=event.observer.options.enabled!==false;
  const previous=observerEnabled.get(event.observer);observerEnabled.set(event.observer,active);
  const freshness=event.observer.options.staleTime;
  const ttl=typeof freshness==='number'?freshness:45000;
  if(active&&(event.type==='observerAdded'||previous===false)&&query.state.data!==undefined&&!query.state.isInvalidated&&Date.now()-query.state.dataUpdatedAt<ttl)recordQueryMetric({module,cache:'hit'});
 }
});

export function runtimeScope() {
  const w = window as Window & {MBA_CURRENT_USER?: {id?:string;role?:string;authorization_version?:string;access_kind?:string;is_master_admin?:boolean;allowed_modules?:string[];capabilities?:Record<string,boolean>;permissions?:Record<string,boolean>};MBA_API?:{getPortfolioId?:()=>string}};
  const user=w.MBA_CURRENT_USER;
  if(!user) return '';
  return JSON.stringify([user.id,(window as Window & {MBA_SESSION_GENERATION?:string}).MBA_SESSION_GENERATION,w.MBA_API?.getPortfolioId?.(),user.role,
    Object.entries(user.permissions||{}).sort(([a],[b])=>a.localeCompare(b)),user.authorization_version||'legacy','runtime-v2.2',
    user.access_kind,user.is_master_admin,[...(user.allowed_modules||[])].sort(),Object.entries(user.capabilities||{}).sort(([a],[b])=>a.localeCompare(b))]);
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

// Recovery keeps the same UI identity. Revalidate stale/failed active queries
// once after access becomes valid, without remounting or retrying writes.
let recoveryScope:string|null=null;
window.addEventListener('mba:auth-state',(raw:Event)=>{
 const status=(raw as CustomEvent<{status?:string}>).detail?.status;
 if(status==='temporarily_unavailable')recoveryScope=runtimeScope();
 else if(status==='authenticated'){
  const current=runtimeScope();
  if(recoveryScope&&recoveryScope===current)void runtimeQueries.invalidateQueries({predicate:query=>query.queryKey[0]==='runtime-v2'&&query.queryKey[1]===current&&(query.state.status==='error'||query.isStale())});
  recoveryScope=null;
 }else if(status==='expired_or_revoked'||status==='forbidden')recoveryScope=null;
});
