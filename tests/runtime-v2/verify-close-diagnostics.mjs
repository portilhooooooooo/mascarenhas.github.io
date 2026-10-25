// Fault injection verifies that a closed browser remains a failed case with evidence.
import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFile,writeFile,rm} from 'node:fs/promises';
const browser=process.env.BROWSER||'chromium';
assert.ok(['chromium','firefox'].includes(browser));
const phase='ci-close-diagnostics-'+browser;
const out='docs/runtime-v2/evidence/'+phase;
await rm(out,{recursive:true,force:true});
const result=spawnSync(process.execPath,['tests/runtime-v2/browser.mjs'],{
 env:{...process.env,BROWSER:browser,PORT:'5206',PHASE:phase,TEST_IDS:'PROBE-browser-close',BROWSER_TERMINATION_PROBE:'1'},
 encoding:'utf8',timeout:45000,maxBuffer:10*1024*1024,
});
assert.equal(result.status,1,'Fault-injected child must report failure; no retries');
const metrics=JSON.parse(await readFile(out+'/metrics.json','utf8'));
assert.ok(metrics.fatal);
assert.equal(metrics.results.length,1);
assert.equal(metrics.results[0].id,'PROBE-browser-close');
assert.equal(metrics.results[0].status,'FALHOU');
assert.ok(metrics.browserLifecycle.some(e=>e.event==='browser_disconnected'));
assert.ok(metrics.browserLifecycle.some(e=>e.event==='page_closed'));
const report={timestamp:new Date().toISOString(),fixture:true,purpose:'simulated browser termination; not historical Firefox root cause',browser,expectedExit:result.status,failedCasePreserved:true,lifecycle:metrics.browserLifecycle};
await writeFile(out+'/verification.json',JSON.stringify(report,null,2));
await writeFile(out+'/probe.log',(result.stdout||'')+(result.stderr||''));
console.log(JSON.stringify(report));
