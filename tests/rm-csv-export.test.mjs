// THOM-OPUS-CSV-20261116 — "Baixar CSV" nos cards RM com relação de processos.
// Behavioural part runs the real metricCsvCore.ts through Node type stripping.
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import test from 'node:test';

const root=new URL('../',import.meta.url);
const src=path=>readFileSync(new URL('src/dashboard/'+path,root),'utf8');
const core=await import(new URL('src/dashboard/metricCsvCore.ts',root).href);
const {csvCell,buildCsv,csvFileName,collectCaseRows,CSV_EXPORT_MAX_ROWS}=core;

const row=i=>({id:'id-'+i,primary:'p'+i,cells:[],values:['v'+i]});
/** Offset (Cadastro) or keyset (V1) fake endpoint; records every request it receives. */
function fakeSource({total,cursorMode=false,exportPageSize=50,pageSize=25,mutate}={}){
  const calls=[];
  return {calls,source:{title:'t',source:'s',columns:[],pageSize,exportPageSize,cursorMode,exportName:'x',exportColumns:['A'],
    async load(cursor,page,_signal,size){
      calls.push({cursor,page,size});
      const offset=cursorMode?(cursor?Number(cursor):0):(page-1)*size;
      const t=mutate?mutate(calls.length,total):total;
      if(t===null)return {rows:[],total:null,next:null,reasons:['DETAIL_UNAVAILABLE']};
      const rows=[];for(let i=offset;i<Math.min(total,offset+size);i++)rows.push(row(i));
      const end=offset+rows.length;
      return {rows,total:t,next:cursorMode&&end<total?String(end):null,reasons:[]};
    }}};
}
const signal=()=>new AbortController().signal;

test('csvCell neutralizes spreadsheet formulas and quotes values',()=>{
  for(const evil of ['=HYPERLINK("x")','+1','-2+3','@SUM(A1)',' =cmd','\tx','\rx'])
    assert.ok(csvCell(evil).startsWith('"\''),evil);
  assert.equal(csvCell('a"b'),'"a""b"');
  assert.equal(csvCell(null),'""');
  assert.equal(csvCell('0001234-56.2024.8.26.0100'),'"0001234-56.2024.8.26.0100"');
});

test('buildCsv emits UTF-8 BOM, semicolon separator and CRLF',()=>{
  const csv=buildCsv(['CNJ','Situação'],[['1','Ativo'],['2','=x']]);
  assert.equal(csv.charCodeAt(0),0xFEFF);
  assert.equal(csv.slice(1),'"CNJ";"Situação"\r\n"1";"Ativo"\r\n"2";"\'=x"');
  assert.match(csvFileName(['cadastro','arquivar','rev12','agibank_enter','2026-11-16']),/^cadastro_arquivar_rev12_agibank_enter_2026-11-16\.csv$/);
  assert.doesNotMatch(csvFileName(['Situação ../x']),/[\/ ç]/);
});

test('offset mode reads every page at the export page size, not only the current page',async()=>{
  const {calls,source}=fakeSource({total:120});
  const {rows,total}=await collectCaseRows(source,{signal:signal()});
  assert.equal(total,120);assert.equal(rows.length,120);
  assert.deepEqual(calls.map(c=>[c.page,c.size]),[[1,50],[2,50],[3,50]]);
});

test('keyset mode follows the cursor until the end',async()=>{
  const {calls,source}=fakeSource({total:450,cursorMode:true,exportPageSize:200});
  const {rows}=await collectCaseRows(source,{signal:signal()});
  assert.equal(rows.length,450);
  assert.deepEqual(calls.map(c=>c.cursor),[null,'200','400']);
});

test('refuses instead of truncating: cap, unavailable, changed total, early end',async()=>{
  const big=fakeSource({total:CSV_EXPORT_MAX_ROWS+1});
  await assert.rejects(collectCaseRows(big.source,{signal:signal()}),{code:'EXPORT_LIMIT'});
  assert.equal(big.calls.length,1,'stops after the first page once the cap is exceeded');
  await assert.rejects(collectCaseRows(fakeSource({total:10,mutate:()=>null}).source,{signal:signal()}),{code:'DETAIL_UNAVAILABLE'});
  await assert.rejects(collectCaseRows(fakeSource({total:120,mutate:(n,t)=>n===2?t+1:t}).source,{signal:signal()}),{code:'TOTAL_CHANGED'});
  const short={...fakeSource({total:80}).source};
  const load=short.load;short.load=async(...args)=>{const r=await load(...args);return args[1]===2?{...r,rows:[]}:r;};
  await assert.rejects(collectCaseRows(short,{signal:signal()}),{code:'INCOMPLETE'});
  const dup={...fakeSource({total:100}).source};
  const dload=dup.load;dup.load=async(c,p,s,size)=>dload(c,1,s,size);
  await assert.rejects(collectCaseRows(dup,{signal:signal()}),{code:'DUPLICATE_ROW'});
});

test('authorization failures propagate and abort stops further requests',async()=>{
  const denied={...fakeSource({total:10}).source,load:async()=>{throw Object.assign(new Error('x'),{status:403});}};
  await assert.rejects(collectCaseRows(denied,{signal:signal()}),{status:403});
  const ctl=new AbortController();
  const {calls,source}=fakeSource({total:200});
  const load=source.load;source.load=async(...a)=>{const r=await load(...a);ctl.abort();return r;};
  await assert.rejects(collectCaseRows(source,{signal:ctl.signal}),{code:'ABORTED'});
  assert.equal(calls.length,1);
});

test('card action is separate from the card click (no nested buttons)',()=>{
  const card=src('metricState.tsx');
  const branch=card.slice(card.indexOf('mba-metric-card--actions'),card.indexOf('</article>;'));
  assert.match(branch,/<button type="button" className="mba-metric-open"[^>]*\/>/);
  assert.match(branch,/className="mba-metric-export" aria-label=\{'Baixar CSV — '\+label\}/);
  assert.match(card,/canOpen&&onExport&&hasValue&&state\.value>0/);
  const css=src('ui-foundations.css');
  assert.match(css,/\.mba-metric-export:focus-visible/);
  assert.match(css,/\.mba-metric-open:focus-visible/);
  assert.match(css,/@media \(pointer:coarse\)/);
});

test('every RM drilldown card exports with the same scope as its drilldown',()=>{
  const cadastro=src('CadastroCpjCards.tsx');
  assert.match(cadastro,/open=\(key:string,label:string\)=>pinned\s*\?\(\)=>setDrill\(\{scope,source:cadastroCases\(key,label,query,pinned\)\}\)/);
  assert.match(cadastro,/csv\.start\(key,label,cadastroCases\(key,label,query,pinned\),state\.value\)/);
  assert.match(cadastro,/onOpen=\{canDrill\?open\(key,label\):undefined\} \{\.\.\.\(canDrill\?exportProps/);
  assert.match(cadastro,/onOpen=\{open\(key,label\)\} \{\.\.\.exportProps\(key,label,state\)\}/);
  const rm=src('ReadModelDashboard.tsx');
  assert.match(rm,/dashboardV1Cases\(dashboard,m\.name,m\.label\+' \(Read Model\)',rev!,portfolio\)/);
  assert.match(rm,/onOpen=\{rev\?\(\)=>setDrill\(source\(\)\):undefined\}/);
  assert.match(rm,/csv\.start\(m\.name,m\.label,source\(\),state\.value\)/);
  const dialog=src('MetricCasesDialog.tsx');
  assert.match(dialog,/params\.set\('category',category\);params\.set\('revision',revision\)/);
  assert.match(dialog,/new URLSearchParams\(filters\)/);
  assert.match(dialog,/body\.portfolio_id!==portfolio\|\|body\.revision!==revision/);
  const hook=src('metricCsv.tsx');
  assert.match(hook,/AUTH_EVENTS\.forEach\(e=>window\.addEventListener\(e,reset\)\)/);
  assert.match(hook,/currentPortfolio\(\)!==portfolio/);
  assert.match(hook,/if\(controller\.current\)return;/,'one export at a time');
});
