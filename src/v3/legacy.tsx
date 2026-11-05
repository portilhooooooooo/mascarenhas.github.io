/** Explicit LEGACY source for the existing Benner read status, no dispatch. */
import {useEffect,useState} from 'react';
import {runtimeScope} from '../tasks/runtimeQueries';
export function LegacyAndamentos(){
 const [data,setData]=useState<Record<string,unknown>|null>(null),[failed,setFailed]=useState(false);
 useEffect(()=>{const controller=new AbortController();const scope=runtimeScope();
 const api=(window as Window&{MBA_API?:{request:<T>(p:string,o?:RequestInit)=>Promise<T>}}).MBA_API;
 api?.request<Record<string,unknown>>('/api/integrations/benner-andamentos/status',{signal:controller.signal}).then(d=>{if(!controller.signal.aborted&&scope===runtimeScope())setData(d);}).catch(()=>{if(!controller.signal.aborted)setFailed(true);});
 return()=>controller.abort();},[]);
 return <section className="base-geral-page"><h1>Andamentos</h1><p>Consulta legada de integração. Nenhum lançamento é executado.</p>{failed?<p role="alert">Consulta indisponível.</p>:data?<><p>Sessão da integração: {data.online===true?'Ativa':'Indisponível'}</p><button onClick={()=>(window as Window&{MBA_NAVIGATE?:(p:string)=>void}).MBA_NAVIGATE?.('automacoes')}>Abrir consultas legadas</button></>:<p role="status">Carregando dados</p>}</section>;
}
