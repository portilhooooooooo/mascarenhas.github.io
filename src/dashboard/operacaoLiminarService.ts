export type LiminarClassificacao = 'sem_decisao'|'deferido'|'indeferido'|'com_sentenca';
export interface LiminarItem {
  id: number;
  cnj: string;
  classificacao: LiminarClassificacao;
  historico_encontrado: boolean;
  fonte: string;
  evidencia?: {texto?: string; data?: string}|null;
}
export interface LiminarImport {
  id: string;
  carteira: string;
  filename: string;
  total: number;
  invalidos: number;
  duplicados: number;
  completed_at?: string | null;
  created_at: string;
}
export interface LiminarResumo {
  importacao: LiminarImport|null;
  cards: {total:number; sem_decisao:number; deferido:number; indeferido:number; com_sentenca:number};
}
export interface LiminarLista {
  rows: LiminarItem[];
  total: number;
  page: number;
  page_size: number;
  importacao: LiminarImport|null;
}
export interface LiminarImportResult {
  importacao_id: string;
  total: number;
  invalidos: number;
  duplicados: number;
  scraping_disparado: false;
  cards: LiminarResumo['cards'];
}
type Api = {
  request: <T>(path:string, options?:RequestInit)=>Promise<T>;
  fetch: (path:string, options?:RequestInit)=>Promise<Response>;
  getPortfolioId: ()=>string;
};
function api():Api {
  const instance=(window as Window & {MBA_API?:Api}).MBA_API;
  if(!instance)throw new Error('API indisponível.');
  return instance;
}
const portfolio=()=>api().getPortfolioId();
const endpoint=()=>'/api/operacao/liminar';
export const getLiminarResumo=():Promise<LiminarResumo>=>api().request(endpoint()+'/resumo?'+new URLSearchParams({carteira:portfolio()}));
export function getLiminarLista(status:LiminarClassificacao|'ALL',page=1,pageSize=10,search=''):Promise<LiminarLista> {
  const params=new URLSearchParams({carteira:portfolio(),page:String(page),page_size:String(pageSize)});
  if(status!=='ALL')params.set('classificacao',status);
  if(search.trim())params.set('q',search.trim());
  return api().request(endpoint()+'?'+params.toString());
}
export function importarLiminar(file:File):Promise<LiminarImportResult> {
  const form=new FormData();
  form.set('carteira',portfolio());
  form.set('file',file);
  return api().request(endpoint()+'/importar',{method:'POST',body:form});
}
export async function exportarLiminar(status:LiminarClassificacao|'ALL'):Promise<void> {
  const params=new URLSearchParams({carteira:portfolio()});
  if(status!=='ALL')params.set('classificacao',status);
  const response=await api().fetch(endpoint()+'/exportar?'+params.toString());
  if(!response.ok)throw new Error('Falha ao exportar os processos.');
  const blob=await response.blob();
  const url=URL.createObjectURL(blob);
  const anchor=document.createElement('a');
  anchor.href=url;
  anchor.download='liminar_'+portfolio()+'_'+new Date().toISOString().slice(0,10)+'.xlsx';
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}
