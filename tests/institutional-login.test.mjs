import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const storyboard = read('src/login/institutional-loading.tsx');
const styles = read('src/login/institutional-loading.css');
const geography = read('src/login/brazil-geography.ts');
const login = read('src/login/main.tsx');
const auth = read('auth.js');

for (const name of [
  '58 anos de trajetória.',
  'Fundado em 1968',
  'Presença nacional.',
  'Estamos distribuídos em diferentes regiões do Brasil.',
  '60.000',
  'processos na plataforma Mascarenhas Backoffice.',
  'Cadastro',
  'Operação',
  'Jurimetria',
  'Encerramentos',
  'Ideias que se transformam em',
  'Produtos que impactam dezenas de milhares de processos.',
]) {
  assert.ok(storyboard.includes(name), `Missing institutional message: ${name}`);
}
assert.match(storyboard, /export const STORYBOARD_SCENE_MS = 2300/);
assert.match(auth, /setTimeout\(resolve, 9200\)/);
assert.match(login, /createPortal\(<InstitutionalLoading visible=\{preparing\}\/>/);
assert.doesNotMatch(login, /DataField|react-login-theme-toggle/);
assert.match(styles, /\.mba-storyboard-vision h1\s*\{[\s\S]*?font-size:clamp\(58px,7\.2vw,120px\)/);
assert.match(styles, /\.mba-storyboard-journey-step strong\s*\{[\s\S]*?color:#111/);
assert.doesNotMatch(styles, /mba-flow|progress-bar|wave-overlay/i);
assert.equal((geography.match(/"uf":/g) || []).length, 33, 'Expected all 27 state boundaries and 6 office markers');
for (const name of ['Campo Grande', 'Cuiabá', 'Brasília', 'São Paulo', 'Rio de Janeiro', 'Salvador']) {
  assert.ok(geography.includes(`"name": "${name}"`), `Missing office: ${name}`);
}
assert.match(geography, /"name": "Campo Grande",\s*"uf": "MS",\s*"region": "Mato Grosso do Sul"/);
assert.match(geography, /"name": "Brasília",\s*"uf": "DF"/);
console.log('PASS: institutional login loading storyboard, typography and Brazil map.');
