/** Existing Backoffice auth transport; build-time, origin-limited read routing. */
import './backoffice.css';
import React,{useEffect,useSyncExternalStore} from 'react';
import {QueryClient,QueryClientProvider,useQuery} from '@tanstack/react-query';
import {runtimeScope} from '../tasks/runtimeQueries';
import {request,ApiError,type Access,type Module,type Session} from './client';
import {ModuleView,Skeleton,Failure} from './views';

type Source='LEGACY'|'V3';
const env=import.meta.env;
function settings():Partial<Record<Module,Source>> {
 if(!['development','testing','staging'].includes(String(env.VITE_V3_ROUTES_ENV||'')))return {};
 if(!String(env.VITE_V3_READ_ALLOWED_ORIGINS||'').split(',').map(s=>s.trim()).includes(location.origin))return {};
 try{const value=JSON.parse(String(env.VITE_V3_READ_SOURCES||'{}'));return value&&typeof value==='object'?value:{};}catch{return {};}
}
// Each domain is selected explicitly in an origin-limited testing build.
export function readSource(module:Module):Source {
 return settings()[module]==='V3'?'V3':'LEGACY';
}
const cache=new QueryClient({defaultOptions:{queries:{retry:false,refetchOnWindowFocus:false,gcTime:300000}}});
const events=['mba:authenticated','mba:profile-ready','mba:portfolio-changed','mba:logged-out','mba:session-expired','mba:authorization-invalidated'];
const deniedScopes=new Set<string>();
const snapshot=()=>runtimeScope()+'|'+(deniedScopes.has(runtimeScope())?'DENIED':'READY');
// Invalidation must outlive mounted views: the operational transport may unmount
// a page before its rejected promise delivers the denial to the V3 client.
const changed=()=>window.dispatchEvent(new Event('mba:v3-context-changed'));
const reset=()=>{void cache.cancelQueries();cache.clear();changed();};
events.forEach(event=>window.addEventListener(event,reset));
window.addEventListener('mba:v3-access-denied',event=>{
 const scope=(event as CustomEvent<{scope:string}>).detail?.scope;
 if(scope)deniedScopes.add(scope);
 reset();
});
window.addEventListener('mba:server-data-changed',()=>{void cache.invalidateQueries();});
function subscribe(listener:()=>void){
 window.addEventListener('mba:v3-context-changed',listener);
 return()=>window.removeEventListener('mba:v3-context-changed',listener);
}
type AuthAccess=Access&{portfolio_id:string;source_tenant:string;authentication_mode:string};
function Read({module}:{module:Module}){
 const scope=useSyncExternalStore(subscribe,snapshot);
 const api=(window as Window&{MBA_API?:{getPortfolioId:()=>string}}).MBA_API;
 const portfolio=api?.getPortfolioId()||'';
 const initial:Session={portfolio,tenant:'',token:'',transport:'BACKOFFICE'};
 const status=useQuery({queryKey:['v3-backoffice',scope,portfolio,'access'],enabled:!!runtimeScope()&&!!portfolio&&!deniedScopes.has(runtimeScope()),
  queryFn:({signal})=>request<AuthAccess>(initial,'/status',{},signal),retry:false,refetchInterval:30000});
 useEffect(()=>{if(status.error instanceof ApiError&&[401,403].includes(status.error.status)){void cache.cancelQueries();cache.clear();}},[status.error]);
 if(deniedScopes.has(runtimeScope()))return <p role="alert">Acesso não autorizado.</p>;
 if(!runtimeScope())return <p role="alert">Sessão necessária.</p>;
 if(status.isPending)return <Skeleton/>;
 if(status.error)return <Failure error={status.error} hasData={false} retry={()=>void status.refetch()}/>;
 const access=status.data!;
 if(!access.modules.includes(module))return <p role="alert">Acesso não autorizado.</p>;
 const session:Session={...initial,tenant:access.source_tenant};
 return <ModuleView key={scope+access.identity+module} module={module} session={session} access={access}/>;
}
export function BackofficeRead({module}:{module:Module}){
 return <div className="v3-read-surface"><QueryClientProvider client={cache}><Read module={module}/></QueryClientProvider></div>;
}

// Existing shell can avoid legacy reads when this build selects the V3 surface.
(window as Window & {MBA_V3_READ_SOURCE?:typeof readSource}).MBA_V3_READ_SOURCE=readSource;
