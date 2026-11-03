import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

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
assert.match(storyboard, /export const OFFICE_SWITCH_MS = 2000/);
assert.match(storyboard, /useState\(readNextScene\)/);
assert.doesNotMatch(storyboard, /STORYBOARD_SCENE_MS|setScene\(/);
assert.match(storyboard, /mba-storyboard-presence-meta[\s\S]*mba-storyboard-presence-stat[\s\S]*mba-storyboard-location-label[\s\S]*mba-storyboard-offices[\s\S]*<BrazilPresence city=\{city\}\s*\/>/);
assert.match(styles, /\.mba-storyboard-presence-meta\s*\{[\s\S]*?margin-top:clamp\(42px,6\.5vh,78px\)/);
assert.match(styles, /\.mba-storyboard-location-label\s*\{[\s\S]*?position:relative/);
assert.match(auth, /INSTITUTIONAL_WELCOME_MS = 6000/);
assert.match(auth, /setTimeout\(resolve, INSTITUTIONAL_WELCOME_MS\)/);
assert.match(auth, /await loadProfileWithRetry\([\s\S]*?advanceInstitutionalScene\(\)/);
assert.match(auth, /window\.MBA_INSTITUTIONAL_LOGIN_SCENE = institutionalScene/);
assert.match(auth, /MBA_INSTITUTIONAL_LOGIN_OFFICE_START = institutionalOfficeStart/);
assert.match(storyboard, /useState\(readOfficeStart\)/);
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
// Exercise the actual scene selection/advancement logic in a browser-like VM.
// Refresh and failed authentication must never advance the sequence.
const rotationStart = auth.indexOf("  const institutionalNextSceneKey = 'mba-institutional-scene-next-v1';");
const rotationEnd = auth.indexOf('  const moduleActivationAt = new Map();', rotationStart);
assert.ok(rotationStart > 0 && rotationEnd > rotationStart);
const rotationCode = auth.slice(rotationStart, rotationEnd);
const stored = new Map();
const localStorage = {
  getItem: key => stored.has(key) ? stored.get(key) : null,
  setItem: (key, value) => stored.set(key, String(value)),
};
const officeStarts = [];
const openPage = successfulLogin => {
  const window = {};
  vm.runInNewContext(rotationCode + (successfulLogin ? '\nadvanceInstitutionalScene();' : ''), { localStorage, window });
  officeStarts.push(window.MBA_INSTITUTIONAL_LOGIN_OFFICE_START);
  return window.MBA_INSTITUTIONAL_LOGIN_SCENE;
};
assert.equal(openPage(false), 0, 'Initial page shows history without consuming a scene');
assert.equal(openPage(true), 0, 'First login shows history');
assert.equal(openPage(false), 1, 'Refresh does not consume another scene');
assert.equal(openPage(true), 1, 'Second login shows presence');
assert.equal(officeStarts.at(-1), 0, 'First presence login starts with Campo Grande');
assert.equal(openPage(true), 2, 'Third login shows Backoffice');
assert.equal(openPage(true), 3, 'Fourth login shows product vision');
assert.equal(openPage(true), 0, 'Fifth login loops to history');
stored.set('mba-institutional-scene-next-v1', 'invalid');
assert.equal(openPage(true), 0, 'Invalid index safely resets to history');
assert.equal(openPage(false), 1, 'Next staged login shows presence again');
assert.equal(officeStarts.at(-1), 3, 'Next presence login starts with the remaining three offices');

console.log('PASS: one scene per login; 6-second hold; 2-second city rotation; presence layout.');
