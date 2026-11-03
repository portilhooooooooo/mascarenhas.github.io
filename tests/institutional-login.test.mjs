import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import vm from 'node:vm';

const read = path => readFileSync(new URL('../' + path, import.meta.url), 'utf8');
const storyboard = read('src/login/institutional-loading.tsx');
const styles = read('src/login/institutional-loading.css');
const geography = read('src/login/brazil-geography.ts');
const login = read('src/login/main.tsx');
const auth = read('auth.js');
const portfolioSwitcher = read('src/dashboard/PortfolioSwitcher.tsx');

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
assert.match(storyboard, /useState\(readSelectedScene\)/);
assert.doesNotMatch(storyboard, /STORYBOARD_SCENE_MS|setScene\(/);
assert.match(storyboard, /mba-storyboard-presence-meta[\s\S]*mba-storyboard-presence-stat[\s\S]*mba-storyboard-location-label[\s\S]*mba-storyboard-offices[\s\S]*<BrazilPresence city=\{city\}\s*\/>/);
assert.match(styles, /\.mba-storyboard-presence-meta\s*\{[\s\S]*?margin-top:clamp\(42px,6\.5vh,78px\)/);
assert.match(styles, /\.mba-storyboard-location-label\s*\{[\s\S]*?position:relative/);
assert.match(auth, /INSTITUTIONAL_LOGIN_MS = 6000/);
assert.match(auth, /INSTITUTIONAL_PORTFOLIO_MS = 3000/);
assert.match(auth, /setTimeout\(resolve, institutionalPortfolioSwitch && !code \? INSTITUTIONAL_PORTFOLIO_MS : INSTITUTIONAL_LOGIN_MS\)/);
assert.match(auth, /await loadProfileWithRetry\([\s\S]*?rememberInstitutionalScene\(\)/);
assert.match(auth, /window\.MBA_INSTITUTIONAL_LOGIN_SCENE = institutionalScene/);
assert.match(auth, /window\.MBA_INSTITUTIONAL_LOGIN_OFFICE_START = institutionalRandomIndex\(6\)/);
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
// Test real random-selection code without coupling to the UI. Last shown scene is
// tracked to avoid consecutive repetition, but order is not cyclic or predictable.
const snippetStart = auth.indexOf("  const institutionalSwitchKey = 'mba-institutional-portfolio-switch-v1';");
const snippetEnd = auth.indexOf('  const moduleActivationAt = new Map();', snippetStart);
assert.ok(snippetStart > 0 && snippetEnd > snippetStart);
const snippet = auth.slice(snippetStart, snippetEnd);
const stored = new Map();
const session = new Map();
const localStorage = {
  getItem: key => stored.has(key) ? stored.get(key) : null,
  setItem: (key, value) => stored.set(key, String(value)),
};
const sessionStorage = {
  getItem: key => session.has(key) ? session.get(key) : null,
  setItem: (key, value) => session.set(key, String(value)),
  removeItem: key => session.delete(key),
};
const simulate = (choice, success = false, switching = false) => {
  if (switching) sessionStorage.setItem('mba-institutional-portfolio-switch-v1', '1');
  const window = {
    crypto: { getRandomValues: arr => { arr[0] = choice; return arr; } },
  };
  const script = snippet + '\nwindow.MBA_TEST_SWITCH = institutionalPortfolioSwitch;' +
    (success ? '\nrememberInstitutionalScene();' : '');
  vm.runInNewContext(script, { localStorage, sessionStorage, window });
  return {scene:window.MBA_INSTITUTIONAL_LOGIN_SCENE,office:window.MBA_INSTITUTIONAL_LOGIN_OFFICE_START,switched:window.MBA_TEST_SWITCH};
};

const first = simulate(2);
assert.equal(first.scene, 2, 'Random input chooses the Backoffice scene');
assert.equal(stored.has('mba-institutional-last-scene-v1'), false, 'Refresh / failed login does not record a scene');
const shown = simulate(2, true);
assert.equal(shown.scene, 2, 'Successful login may display Backoffice');
assert.equal(stored.get('mba-institutional-last-scene-v1'), '2');
const next = simulate(2, true, true);
assert.equal(next.switched, true, 'Portfolio switch marker recognized');
assert.notEqual(next.scene, 2, 'Consecutive scenes must differ');
assert.equal(session.has('mba-institutional-portfolio-switch-v1'), false, 'Switch marker consumed after reload');
assert.equal(simulate(1).switched, false, 'Refresh does not replay portfolio welcome');
const other = simulate(1, true);
assert.notEqual(other.scene, next.scene, 'A subsequent successful login is not a repetition');
assert.ok([0,1,2,3].includes(other.scene));
assert.ok(other.office >= 0 && other.office < 6, 'Office start is randomly selected within valid bounds');

assert.match(auth, /Boolean\(code \|\| institutionalPortfolioSwitch\)/);
assert.match(auth, /if \(showInstitutionalWelcome\) \{/);
assert.match(portfolioSwitcher, /sessionStorage\.setItem\('mba-institutional-portfolio-switch-v1', '1'\)/);
assert.match(portfolioSwitcher, /setPortfolioId\(nextId\);[\s\S]*window\.location\.reload\(\)/);
assert.match(storyboard, /Math\.floor\(Math\.random\(\) \* \(LAST_SCENE \+ 1\)\)/);

console.log('PASS: random institutional scenes on login and portfolio switch, no consecutive repeats, 6s welcome, 2s city rotation.');
