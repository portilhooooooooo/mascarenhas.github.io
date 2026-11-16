import {useCallback,useEffect,useRef,useState,type ReactNode} from 'react';
import {AUTH_EVENTS,currentPortfolio,failureState,formatCount} from './metricState';
import type {CaseSource} from './MetricCasesDialog';
import {CSV_EXPORT_MAX_ROWS,CsvExportError,buildCsv,collectCaseRows,csvFileName,limitMessage} from './metricCsvCore';

/**
 * "Baixar CSV" for Read Model drill-down cards (THOM-OPUS-CSV-20261116).
 *
 * No backend export endpoint exists for /api/resultados/cadastro/processos or
 * /api/dashboard/v1/<d>/metrics/<m>/cases. Both are pinned to an immutable
 * revision, so the browser walks every page of the SAME request the dialog uses
 * (same carteira header, filters, category, revision and permission) and only
 * writes a file when the collected rows match the published total exactly.
 * Above CSV_EXPORT_MAX_ROWS the export is refused instead of truncated; see
 * docs/rm-csv-export-20261116.md for the backend endpoint this needs.
 */
function download(name:string,csv:string){
  const url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'}));
  const link=document.createElement('a');
  link.href=url;link.download=name;document.body.appendChild(link);link.click();link.remove();
  window.setTimeout(()=>URL.revokeObjectURL(url),1000);
}

function errorMessage(cause:unknown):string{
  if(cause instanceof CsvExportError)return cause.message;
  const status=(cause as {status?:number})?.status;
  if(status===409)return 'Relação indisponível para esta revisão; CSV não gerado.';
  const state=failureState(cause);
  return 'message' in state?state.message:'Não foi possível gerar o CSV.';
}

type Status={kind:'busy';key:string;label:string;done:number;total:number|null}
  |{kind:'done';label:string;total:number}
  |{kind:'error';label:string;message:string};

/**
 * One export at a time per card group. Aborts on unmount and on any session or
 * carteira change, and discards the file if the carteira changed mid-export.
 */
export function useCaseCsvExport(){
  const [status,setStatus]=useState<Status|null>(null);
  const controller=useRef<AbortController|null>(null);
  const cancel=useCallback(()=>{controller.current?.abort();controller.current=null;},[]);
  useEffect(()=>{
    const reset=()=>{cancel();setStatus(null);};
    AUTH_EVENTS.forEach(e=>window.addEventListener(e,reset));
    return()=>{AUTH_EVENTS.forEach(e=>window.removeEventListener(e,reset));cancel();};
  },[cancel]);
  const start=useCallback((key:string,label:string,source:CaseSource,expected:number)=>{
    if(controller.current)return;
    if(expected>CSV_EXPORT_MAX_ROWS){setStatus({kind:'error',label,message:limitMessage(expected,CSV_EXPORT_MAX_ROWS)});return;}
    const ctl=new AbortController();controller.current=ctl;
    const portfolio=currentPortfolio();
    setStatus({kind:'busy',key,label,done:0,total:null});
    collectCaseRows(source,{signal:ctl.signal,onProgress:(done,total)=>{
      if(!ctl.signal.aborted)setStatus({kind:'busy',key,label,done,total});
    }}).then(({rows,total})=>{
      if(ctl.signal.aborted)return;
      if(currentPortfolio()!==portfolio)throw new CsvExportError('A carteira mudou durante a exportação; CSV descartado.','PORTFOLIO_CHANGED');
      download(csvFileName([source.exportName,portfolio,new Date().toISOString().slice(0,10)]),
        buildCsv(source.exportColumns,rows.map(r=>r.values)));
      setStatus({kind:'done',label,total});
    }).catch(cause=>{
      if(ctl.signal.aborted)return;
      setStatus({kind:'error',label,message:errorMessage(cause)});
    }).finally(()=>{if(controller.current===ctl)controller.current=null;});
  },[]);
  const stop=useCallback(()=>{cancel();setStatus(null);},[cancel]);
  const busyKey=status?.kind==='busy'?status.key:null;
  const node:ReactNode=!status?null:status.kind==='error'
    ?<p className="base-geral-error mba-metric-export-status" role="alert">CSV de {status.label}: {status.message}
      <button type="button" onClick={()=>setStatus(null)}>Fechar</button></p>
    :<p className="mba-metric-export-status" role="status">
      {status.kind==='busy'
        ?<>Gerando CSV de {status.label}{status.total!==null?`: ${formatCount(status.done)} de ${formatCount(status.total)} registros`:''}…
          <button type="button" className="base-geral-csv-action" onClick={stop}>Cancelar</button></>
        :<>CSV de {status.label} gerado com {formatCount(status.total)} registros.</>}
    </p>;
  return {start,busyKey,busy:Boolean(busyKey),status:node};
}
