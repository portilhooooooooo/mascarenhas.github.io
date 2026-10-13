import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const flow = readFileSync(new URL('../src/tasks/ClosingAnalysisFlow.tsx', import.meta.url), 'utf8');
const renderer = readFileSync(new URL('../src/tasks/renderers.tsx', import.meta.url), 'utf8');

assert.match(renderer, /encerramento-prefill/, 'Read-only preselection is fetched by process');
assert.match(renderer, /closingPrefill\?\.processId === process\.id/, 'Response must match selected process');
assert.match(flow, /hasStoredClosingDraft\(draftKey\)/, 'Restore prior draft');
assert.match(flow, /interactedBeforePrefill\.current/, 'Do not overwrite an analyst editing');
assert.match(flow, /setSentence\(current => current \?\? prefill\.first_instance_merit!\)/);
assert.match(flow, /setTransitConfirmed\(current => current \?\? yesNo\(prefill\.transit_confirmed\)\)/);
assert.match(flow, /setExecutionRequested\(current => current \?\? yesNo\(prefill\.execution_requested\)\)/);
assert.match(flow, /classificationAgreed deliberately stays null/, 'Human approval is not prefilled');
assert.doesNotMatch(flow, /setClassificationAgreed\([^)]*prefill/, 'Do not pre-confirm');
assert.match(flow, /<TaskForm className="closing-flow" progressive/, 'Preserve original workspace and progressive questions');
assert.match(flow, /<TaskActionBar busy=\{busy\}/, 'Preserve save flow');
console.log('Encerramentos preselection: draft, operator edits, final confirmation, and UI structure protected.');
