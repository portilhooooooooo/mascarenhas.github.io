import { cp, mkdir, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

// Build target. Production (default) copies config.js byte-for-byte into dist/.
// Staging writes to dist-staging/ and points the API at a loopback backend only;
// the production API host is rejected anywhere in the staging artifact.
const PRODUCTION_API_HOST = 'api.portilhobackoffice.site';
const target = String(process.env.MBA_BUILD_TARGET || 'production').trim();
if (!['production', 'staging'].includes(target)) throw new Error(`MBA_BUILD_TARGET inválido: ${target}`);
const staging = target === 'staging';
const stagingApiBaseUrl = String(process.env.MBA_STAGING_API_BASE_URL || 'http://127.0.0.1:5051').trim().replace(/\/$/, '');
if (staging && !/^http:\/\/(127\.0\.0\.1|localhost):[0-9]{2,5}$/.test(stagingApiBaseUrl)) {
  throw new Error('MBA_STAGING_API_BASE_URL deve ser um backend loopback (http://127.0.0.1:<porta> ou http://localhost:<porta>).');
}
const dist = staging ? (process.env.MBA_DIST_DIR || 'dist-staging') : 'dist';
if (staging && dist === 'dist') throw new Error('O build de staging não pode sobrescrever dist/ de produção.');
const fallbackVersion = '20260923-react-login';
let buildVersion = process.env.CF_PAGES_COMMIT_SHA || process.env.GITHUB_SHA || '';

if (!buildVersion) {
  try {
    buildVersion = execSync('git rev-parse --short HEAD', { encoding: 'utf8' }).trim();
  } catch (_error) {
    buildVersion = fallbackVersion;
  }
}

buildVersion = String(buildVersion || fallbackVersion).slice(0, 16);

await rm(dist, { recursive: true, force: true });
await mkdir(`${dist}/assets/react-dashboard`, { recursive: true });

const files = [
  'index.html',
  'styles.css',
  'brand-identity.css',
  'brand-themes.css',
  'design-system-v2.css',
  'reimagined-workspace.css',
  'nav-editorial.css',
  'brand-theme.js',
  'agreements.css',
  'payment-receipt.css',
  'protocolo.css',
  'config.js',
  'data-api.js',
  'portfolio-policy.js',
  'app.js',
  'user-access-manager.js',
  'react-compat.js',
  'agreements.js',
  'payment-receipt.js',
  'protocolo.js',
  'auth.js',
  'page-init-1.js',
  'page-init-2.js',
  'favicon.svg',
  'favicon-white.svg',
  '_headers',
];

for (const file of files) {
  await cp(file, `${dist}/${file}`);
}

if (staging) {
  const apiLine = /^window\.MBA_API_BASE_URL = '[^']*';$/m;
  const configJs = await readFile('config.js', 'utf8');
  if ((configJs.match(/^window\.MBA_API_BASE_URL = /gm) || []).length !== 1 || !apiLine.test(configJs)) {
    throw new Error('config.js deve declarar MBA_API_BASE_URL exatamente uma vez.');
  }
  // Same preview/auth logic as production; only the API origin and staging flags differ.
  const stagingConfig = configJs.replace(apiLine,
    `// STAGING BUILD (MBA_BUILD_TARGET=staging): backend loopback, nunca a API de produção.\n`
    + `window.MBA_API_BASE_URL = '${stagingApiBaseUrl}';\n`
    + `window.MBA_BUILD_TARGET = 'staging';\n`
    + `window.MBA_DASHBOARD_V1_ENABLED = true;`);
  await writeFile(`${dist}/config.js`, stagingConfig, 'utf8');
  const headers = await readFile('_headers', 'utf8');
  await writeFile(`${dist}/_headers`, headers.replaceAll(`https://${PRODUCTION_API_HOST}`, stagingApiBaseUrl), 'utf8');
}

// O vídeo institucional da branch de testes é obrigatório na tela de login.
// Falhe no build se algum dos arquivos desaparecer, em vez de mostrar um símbolo genérico.
await cp('assets/mascarenhas-login.mp4', `${dist}/assets/mascarenhas-login.mp4`);
await cp('assets/mascarenhas-login-poster.jpg', `${dist}/assets/mascarenhas-login-poster.jpg`);

await cp(
  '.build/react-dashboard',
  `${dist}/assets/react-dashboard`,
  { recursive: true },
);

const indexPath = `${dist}/index.html`;
const indexHtml = await readFile(indexPath, 'utf8');
// O HTML fonte deve ter um único ponto de montagem; não depender do markup legado.
const reactLoginMounts = indexHtml.match(/id="login-view"/g) || [];
if (reactLoginMounts.length !== 1 || !/<div class="auth-view" id="login-view"><\/div>/.test(indexHtml)) {
  throw new Error('O index.html deve conter somente um ponto de montagem React do login.');
}
if (/id="task-only-login"|id="google-login"|data-auth-provider="google"/.test(indexHtml)) {
  throw new Error('O index.html ainda contém implementação legada de login.');
}

const builtIndexHtml = indexHtml
  .replace(/\s*<script src="\/?security-ui\.js(?:\?v=[^"]+)?"><\/script>/g, '')
  .replace(/\s*<script src="\/?mock-api\.js(?:\?v=[^"]+)?"><\/script>/g, '')
  .replace(/<title>[^<]*<\/title>/, '<title>Mascarenhas Barbosa</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Mascarenhas Backoffice">')
  .replace(/<link[^>]*rel="icon"[^>]*>/g, `<link rel="icon" type="image/svg+xml" sizes="any" href="/favicon-white.svg?v=${buildVersion}">`)
  .replace(/(<script src="\/?app\.js\?v=[^"]+"><\/script>)/, `$1\n  <script src="/react-compat.js?v=${buildVersion}"></script>`)
  .replace('</body>', `  <script type="module" src="/assets/react-dashboard/login-react.js?v=${buildVersion}"></script>\n</body>`)
  .replace(/brand-identity\.css(?:\?v=[^"']+)?/g, `brand-identity.css?v=${buildVersion}`)
  .replace(/brand-themes\.css(?:\?v=[^"']+)?/g, `brand-themes.css?v=${buildVersion}`)
  .replace(/design-system-v2\.css(?:\?v=[^"\']+)?/g, `design-system-v2.css?v=${buildVersion}`)
  .replace(/reimagined-workspace\.css(?:\?v=[^"\']+)?/g, `reimagined-workspace.css?v=${buildVersion}`)
  .replace(/nav-editorial\.css(?:\?v=[^"\']+)?/g, `nav-editorial.css?v=${buildVersion}`)
  .replace(/brand-theme\.js(?:\?v=[^"']+)?/g, `brand-theme.js?v=${buildVersion}`)
  .replace(/styles\.css(?:\?v=[^"']+)?/g, `styles.css?v=${buildVersion}`)
  .replace(/agreements\.css(?:\?v=[^"']+)?/g, `agreements.css?v=${buildVersion}`)
  .replace(/payment-receipt\.css(?:\?v=[^"']+)?/g, `payment-receipt.css?v=${buildVersion}`)
  .replace(/protocolo\.css(?:\?v=[^"']+)?/g, `protocolo.css?v=${buildVersion}`)
  .replace(/dashboard-react\.css\?v=[^"']+/g, `dashboard-react.css?v=${buildVersion}`)
  .replace(/dashboard-react\.js\?v=[^"']+/g, `dashboard-react.js?v=${buildVersion}`)
  .replace(/config\.js(?:\?v=[^"']+)?/g, `config.js?v=${buildVersion}`)
  .replace(/data-api\.js(?:\?v=[^"']+)?/g, `data-api.js?v=${buildVersion}`)
  .replace(/portfolio-policy\.js(?:\?v=[^"']+)?/g, `portfolio-policy.js?v=${buildVersion}`)
  .replace(/auth\.js(?:\?v=[^"']+)?/g, `auth.js?v=${buildVersion}`)
  .replace(/user-access-manager\.js(?:\?v=[^"']+)?/g, `user-access-manager.js?v=${buildVersion}`)
  .replace(/app\.js(?:\?v=[^"']+)?/g, `app.js?v=${buildVersion}`)
  .replace(/agreements\.js(?:\?v=[^"']+)?/g, `agreements.js?v=${buildVersion}`)
  .replace(/payment-receipt\.js(?:\?v=[^"']+)?/g, `payment-receipt.js?v=${buildVersion}`)
  .replace(/protocolo\.js(?:\?v=[^"']+)?/g, `protocolo.js?v=${buildVersion}`)
  .replace(/page-init-1\.js(?:\?v=[^"']+)?/g, `page-init-1.js?v=${buildVersion}`)
  .replace(/page-init-2\.js(?:\?v=[^"']+)?/g, `page-init-2.js?v=${buildVersion}`)
  .replace(/(href|src)="(?!https?:|\/\/|\/|#|mailto:|data:)([^"]+)"/g, '$1="/$2"');

if (/id="task-only-login"|id="google-login"|data-auth-provider="google"/.test(builtIndexHtml)) {
  throw new Error('O artefato final ainda contém implementação legada de login.');
}
if ((builtIndexHtml.match(/id="login-view"/g) || []).length !== 1 || !/<div class="auth-view" id="login-view"><\/div>/.test(builtIndexHtml)) {
  throw new Error('O artefato final deve conter somente o mount React do login.');
}
if (/security-ui\.js|login-ui\.css|mock-api\.js/.test(builtIndexHtml)) {
  throw new Error('O artefato final ainda referencia implementação legada ou mock de API.');
}

await writeFile(indexPath, builtIndexHtml, 'utf8');
await writeFile(`${dist}/mba-build-sha.txt`, `${buildVersion}\n`, 'utf8');

const authPath = `${dist}/auth.js`;
const authJs = await readFile(authPath, 'utf8');
await writeFile(
  authPath,
  authJs.replace(/20260916-mascarenhas/g, '20260917-exact-symbol'),
  'utf8',
);

console.log(`dist preparado para deploy e preview local (${buildVersion}).`);

await cp('assets/vendor', `${dist}/assets/vendor`, { recursive: true });

// Pin and serve the existing icon library with the application, without a CDN dependency.
await cp('node_modules/lucide/dist/umd/lucide.min.js', `${dist}/assets/vendor/lucide.min.js`);
await cp('node_modules/lucide/LICENSE', `${dist}/assets/vendor/lucide-LICENSE`);

if (staging) {
  const textFile = /\.(?:js|mjs|css|html|txt|json|svg)$|^_headers$/;
  const walk = async (dir) => (await Promise.all((await readdir(dir, { withFileTypes: true }))
    .map((entry) => entry.isDirectory() ? walk(`${dir}/${entry.name}`) : [`${dir}/${entry.name}`]))).flat();
  const leaks = [];
  for (const path of await walk(dist)) {
    if (!textFile.test(path.split('/').pop())) continue;
    if ((await readFile(path, 'utf8')).includes(PRODUCTION_API_HOST)) leaks.push(path);
  }
  if (leaks.length) throw new Error(`Build de staging referencia a API de produção: ${leaks.join(', ')}`);
  console.log(`staging: ${dist}/ usa MBA_API_BASE_URL=${stagingApiBaseUrl}; nenhuma referência a ${PRODUCTION_API_HOST}.`);
}
