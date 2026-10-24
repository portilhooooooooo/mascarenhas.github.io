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
      void runtimeQueries.cancelQueries(); runtimeQueries.clear(); scope=next;
    }
  });
}
