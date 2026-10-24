import { QueryClient } from '@tanstack/react-query';

export const runtimeQueries = new QueryClient({defaultOptions:{queries:{
  staleTime:45000,gcTime:300000,retry:false,refetchOnWindowFocus:false,
}}});
export function runtimeScope() {
  const w = window as Window & {MBA_CURRENT_USER?: {id?:string;role?:string;permissions?:Record<string,boolean>};MBA_API?:{getPortfolioId?:()=>string}};
  const user=w.MBA_CURRENT_USER;
  if(!user) return '';
  return JSON.stringify([user.id,sessionStorage.getItem('mba_runtime_generation'),w.MBA_API?.getPortfolioId?.(),user.role,
    Object.entries(user.permissions||{}).sort(([a],[b])=>a.localeCompare(b)),'runtime-v2.1']);
}
let scope=runtimeScope();
for(const event of ['mba:authenticated','mba:profile-ready','mba:logged-out','mba:session-expired','mba:portfolio-changed']) {
  window.addEventListener(event,()=>{
    const next=runtimeScope();
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
