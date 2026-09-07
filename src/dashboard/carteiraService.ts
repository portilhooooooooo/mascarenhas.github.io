export interface CarteiraFilters {
  entryStart:string;entryEnd:string;resolutionStart:string;resolutionEnd:string;
  state:string;resolution:string;cnj:string;integration:string;product:string;
  situation:''|'active'|'closed'|'unknown';attention:''|'aging'|'divergent'|'archive';
  groupBy:'day'|'week'|'month';page:number;pageSize:number;sortBy:string;sortDirection:'asc'|'desc';
}
export interface LabeledValue {label:string;value:number}
export interface CarteiraRow {id:string;cnj:string|null;integration:string|null;date:string|null;state:string|null;aging:number|null;resolution:string|null;date_resolution:string|null;situation_cpj:string|null;situation_benner:string|null;product:string|null;adverse_lawyer:string|null}
export interface CarteiraData {
 summary:{total:number;active:number;closed:number;unknown:number;aging_mean:number|null};
 movement:{entries:number;closures:number;balance:number};
 charts:{timeline:Array<{date:string;entries:number;closures:number}>;por_uf:LabeledValue[];por_produto:LabeledValue[];aging:LabeledValue[]};
 attention:{aging:number;divergent:number;archive:number;closures_below_average:{available:boolean;below:boolean;count:number;average:number|null;start:string;end:string}};
 table:{rows:CarteiraRow[];page:number;page_size:number;total:number;total_pages:number};
 filters:{states:string[];resolutions:string[];products:string[]};updated_at:string|null;
}
declare global {interface Window {
 MBA_AUTOMATION_API?:{request:(path:string)=>Promise<unknown>};
 MBA_CURRENT_USER?:{id:string;email:string;name?:string;nome?:string;access_kind:string;permissions:Record<string,boolean>}|null;
 MBA_PORTFOLIO_SEARCH?:string;
 MBA_PORTFOLIO_SECTION?:string;
}}
export async function getCarteiraData(filters:CarteiraFilters):Promise<CarteiraData> {
 const params=new URLSearchParams();
 const mapping:Record<keyof CarteiraFilters,string>={entryStart:'entry_start',entryEnd:'entry_end',resolutionStart:'resolution_start',resolutionEnd:'resolution_end',state:'state',resolution:'resolution',cnj:'cnj',integration:'integration',product:'product',situation:'situation',attention:'attention',groupBy:'group_by',page:'page',pageSize:'page_size',sortBy:'sort_by',sortDirection:'sort_direction'};
 (Object.keys(filters) as Array<keyof CarteiraFilters>).forEach(key=>{if(filters[key]!=='')params.set(mapping[key],String(filters[key]));});
 if(!window.MBA_AUTOMATION_API)throw new Error('Serviço indisponível.');
 return await window.MBA_AUTOMATION_API.request(`/api/carteira-processual?${params}`) as CarteiraData;
}
