export const modules=['cadastro','andamentos','encerramentos','liminar','pagamentos','faturamento','controladoria','tarefas','processos','automacoes'] as const;
export type Module=typeof modules[number];
export type Status='CURRENT'|'STALE'|'UNAVAILABLE'|'PARTIAL'|'REBUILDING';
export type Session={token:string;portfolio:string;tenant:string};
export type Access={contract_version:'1.0.0';identity:string;modules:Module[];hosted_authority_active:false;read_only:true};
export type Row={item_id:string;module:Module;portfolio_case_id:string|null;proceeding_id:string|null;recorded_at:string;source:string;status:string;data:Record<string,unknown>};
export type Page={contract_version:'1.0.0';portfolio_id:string;source_tenant:string;items:Row[];next_cursor:string|null;has_more:boolean;filters_applied:Record<string,string>;data_revision:string;status:Status;limitations:string[]};
export type Summary={contract_version:'1.0.0';portfolio_id:string;source_tenant:string;module:Module;source_revision:string;calculated_at:string|null;status:Status;metrics:Record<string,unknown>;charts:{by_status?:{label:string;value:number}[]};limitations:string[]};
export class ApiError extends Error {constructor(public status:number,public code:string,message:string){super(message);}}
const statuses=new Set(['CURRENT','STALE','UNAVAILABLE','PARTIAL','REBUILDING']);
export const contextKey=(s:Session,identity:string)=>['v3',s.portfolio,s.tenant,identity] as const;
export async function request<T>(s:Session,path:string,params:Record<string,string>={},signal?:AbortSignal):Promise<T>{
 if(!/^\/(status|cadastro|andamentos|encerramentos|liminar|pagamentos|faturamento|controladoria|tarefas|processos|automacoes)(\/[^?#]*)?$/.test(path))throw new ApiError(400,'INVALID_PATH','Consulta inválida.');
 const query=new URLSearchParams({...params,portfolio_id:s.portfolio,source_tenant:s.tenant});
 const controller=new AbortController();const abort=()=>controller.abort(signal?.reason);signal?.addEventListener('abort',abort,{once:true});if(signal?.aborted)abort();
 const timer=setTimeout(()=>controller.abort(new Error('Tempo limite de consulta.')),8000);
 try{
  const response=await fetch('/api/v3'+path+'?'+query,{method:'GET',headers:{Authorization:'Bearer '+s.token},signal:controller.signal,credentials:'omit',cache:'no-store'});
  const data=await response.json() as Record<string,unknown>;
  if(!response.ok)throw new ApiError(response.status,String(data.error_code||'READ_UNAVAILABLE'),String(data.message||'Consulta indisponível.'));
  if(data.contract_version!=='1.0.0')throw new ApiError(502,'INVALID_CONTRACT','Contrato de resposta incompatível.');
  if(path!=='/status'&&(data.portfolio_id!==s.portfolio||data.source_tenant!==s.tenant))throw new ApiError(502,'SCOPE_MISMATCH','Resposta de outra carteira descartada.');
  if(path==='/status'&&(!Array.isArray(data.modules)||typeof data.identity!=='string'||data.hosted_authority_active!==false||data.read_only!==true))throw new ApiError(502,'INVALID_CONTRACT','Sessão de validação inválida.');
  if(data.status&&!statuses.has(String(data.status)))throw new ApiError(502,'INVALID_CONTRACT','Estado dos dados incompatível.');
  if(path.endsWith('/summary')&&(!data.metrics||!data.charts||!Array.isArray(data.limitations)))throw new ApiError(502,'INVALID_CONTRACT','Resumo incompatível.');
  if(Array.isArray(data.items)&&data.items.some((v:unknown)=>!v||typeof (v as Row).item_id!=='string'||!(v as Row).data||typeof (v as Row).source!=='string'))throw new ApiError(502,'INVALID_CONTRACT','Lista incompatível.');
  return data as T;
 }finally{clearTimeout(timer);signal?.removeEventListener('abort',abort);}
}
