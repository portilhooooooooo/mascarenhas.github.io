import type {CaseRow,CaseSource} from './MetricCasesDialog';

/**
 * Pure CSV export logic for Read Model drill-downs (THOM-OPUS-CSV-20261116).
 * Kept free of JSX/runtime imports so tests can run it with Node type stripping.
 */
const counter=new Intl.NumberFormat('pt-BR');
const formatCount=(value:number)=>counter.format(value);

export const CSV_EXPORT_MAX_ROWS=5000;

export class CsvExportError extends Error{
  code:string;
  constructor(message:string,code:string){super(message);this.code=code;}
}

const FORMULA_START=/^[\s]*[=+\-@]|^[\t\r]/;
/** Quote one cell; neutralize spreadsheet formulas (=,+,-,@,tab,CR) with a leading apostrophe. */
export function csvCell(value:unknown):string{
  const text=value===null||value===undefined?'':String(value);
  const safe=FORMULA_START.test(text)?"'"+text:text;
  return '"'+safe.replace(/"/g,'""')+'"';
}

/** UTF-8 BOM + `;` separator + CRLF: opens correctly in pt-BR Excel. */
export function buildCsv(columns:string[],rows:string[][]):string{
  return '\uFEFF'+[columns,...rows].map(row=>row.map(csvCell).join(';')).join('\r\n');
}

export const csvFileName=(parts:(string|null|undefined)[])=>
  parts.filter(Boolean).join('_').normalize('NFD').replace(/[\u0300-\u036f]/g,'')
    .toLowerCase().replace(/[^a-z0-9_-]+/g,'-').replace(/-+/g,'-').slice(0,140)+'.csv';

/**
 * Read every row of a drill-down. Throws instead of returning a partial set when
 * the detail is unavailable, the total exceeds the cap, the total changes between
 * pages, a row repeats or the page sequence ends early.
 */
export async function collectCaseRows(source:CaseSource,{signal,maxRows=CSV_EXPORT_MAX_ROWS,onProgress}:{
  signal:AbortSignal;maxRows?:number;onProgress?:(done:number,total:number)=>void;
}):Promise<{rows:CaseRow[];total:number}>{
  const size=source.exportPageSize??source.pageSize;
  const pageLimit=Math.ceil(maxRows/size)+1;
  const rows:CaseRow[]=[];
  const seen=new Set<string>();
  let cursor:string|null=null;
  let expected:number|null=null;
  for(let page=1;;page++){
    if(signal.aborted)throw new CsvExportError('Exportação cancelada.','ABORTED');
    if(page>pageLimit)throw new CsvExportError('Paginação inconsistente; CSV não gerado.','PAGINATION_MISMATCH');
    const result=await source.load(source.cursorMode?cursor:null,page,signal,size);
    if(result.total===null)throw new CsvExportError('Relação indisponível para esta revisão; CSV não gerado.','DETAIL_UNAVAILABLE');
    if(expected===null){
      expected=result.total;
      if(expected>maxRows)throw new CsvExportError(limitMessage(expected,maxRows),'EXPORT_LIMIT');
    }else if(result.total!==expected)throw new CsvExportError('A relação mudou durante a exportação. Tente novamente.','TOTAL_CHANGED');
    for(const row of result.rows){
      if(seen.has(row.id))throw new CsvExportError('Registro repetido entre páginas; CSV não gerado.','DUPLICATE_ROW');
      seen.add(row.id);rows.push(row);
    }
    if(rows.length>expected)throw new CsvExportError('A relação mudou durante a exportação. Tente novamente.','TOTAL_CHANGED');
    onProgress?.(rows.length,expected);
    const done=source.cursorMode?!result.next:rows.length>=expected||!result.rows.length;
    if(done)break;
    cursor=result.next;
  }
  if(rows.length!==expected)throw new CsvExportError('Exportação incompleta; CSV não gerado.','INCOMPLETE');
  return {rows,total:expected};
}

export const limitMessage=(total:number,max:number)=>
  `A relação tem ${formatCount(total)} registros; o download pelo navegador está limitado a ${formatCount(max)}. CSV não gerado.`;

