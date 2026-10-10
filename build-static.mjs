import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const dist = 'dist';
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

// Publica também a demonstração isolada de cinco perfis no site de testes.
// Nunca importa credenciais nem conecta essa experiência à API de produção.
await mkdir(`${dist}/reimagined`, { recursive: true });
for (const file of ['index.html', 'app.js', 'design.css']) {
  await cp(`ux-preview/reimagined/${file}`, `${dist}/reimagined/${file}`);
}

const files = [
  'index.html',
  'styles.css',
  'brand-identity.css',
  'brand-themes.css',
  'design-system-v2.css',
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
  '_headers',
];

for (const file of files) {
  await cp(file, `${dist}/${file}`);
}

/* Mídia institucional opcional: sem o vídeo o login usa fallback local. */
let hasBrandVideo = false;
try {
  await cp('assets/mascarenhas-login.mp4', `${dist}/assets/mascarenhas-login.mp4`);
  hasBrandVideo = true;
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}
try {
  await cp('assets/mascarenhas-login-poster.jpg', `${dist}/assets/mascarenhas-login-poster.jpg`);
} catch (error) {
  if (error?.code !== 'ENOENT') throw error;
}

await cp(
  '.build/react-dashboard',
  `${dist}/assets/react-dashboard`,
  { recursive: true },
);

const indexPath = `${dist}/index.html`;
const indexHtml = await readFile(indexPath, 'utf8');
const reactOwnedIndexHtml = indexHtml
  .replace(
    /<div class="auth-view" id="login-view">[\s\S]*?<\/div>\s*<div class="login-security">/,
    '<div class="auth-view" id="login-view"></div>\n\n        <div class="login-security">',
  )
  .replace(/\s*<script src="\/?security-ui\.js(?:\?v=[^"]+)?"><\/script>/g, '')
  .replace(/\s*<script src="\/?mock-api\.js(?:\?v=[^"]+)?"><\/script>/g, '');

if (reactOwnedIndexHtml === indexHtml) {
  throw new Error('Não foi possível isolar o ponto de montagem React do login.');
}

const builtIndexHtml = reactOwnedIndexHtml
  .replace(/<title>[^<]*<\/title>/, '<title>Mascarenhas Backoffice</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Mascarenhas Backoffice">')
  .replace('</head>', `  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260917-exact-symbol">\n</head>`)
  .replace(/(<script src="\/?app\.js\?v=[^"]+"><\/script>)/, `$1\n  <script src="/react-compat.js?v=${buildVersion}"></script>`)
  .replace('</body>', `${hasBrandVideo ? '<script>window.MBA_BRAND_MEDIA={videoUrl:"/assets/mascarenhas-login.mp4",posterUrl:"/assets/mascarenhas-login-poster.jpg"};</script>\\n' : ''}  <script type="module" src="/assets/react-dashboard/login-react.js?v=${buildVersion}"></script>\n</body>`)
  .replace(/brand-identity\.css(?:\?v=[^"']+)?/g, `brand-identity.css?v=${buildVersion}`)
  .replace(/brand-themes\.css(?:\?v=[^"']+)?/g, `brand-themes.css?v=${buildVersion}`)
  .replace(/design-system-v2\.css(?:\?v=[^"\']+)?/g, `design-system-v2.css?v=${buildVersion}`)
  .replace(/brand-theme\.js(?:\?v=[^"']+)?/g, `brand-theme.js?v=${buildVersion}`)
  .replace(/styles\.css(?:\?v=[^"']+)?/g, `styles.css?v=${buildVersion}`)
  .replace(/agreements\.css(?:\?v=[^"']+)?/g, `agreements.css?v=${buildVersion}`)
  .replace(/payment-receipt\.css(?:\?v=[^"']+)?/g, `payment-receipt.css?v=${buildVersion}`)
  .replace(/protocolo\.css(?:\?v=[^"']+)?/g, `protocolo.css?v=${buildVersion}`)
  .replace(/dashboard-react\.css\?v=[^"']+/g, `dashboard-react.css?v=${buildVersion}`)
  .replace(/dashboard-react\.js\?v=[^"']+/g, `dashboard-react.js?v=${buildVersion}`)
  .replace(/config\.js(?:\?v=[^"']+)?/g, `config.js?v=${buildVersion}`)
  .replace(/data-api\.js(?:\?v=[^"']+)?/g, `data-api.js?v=${buildVersion}`)
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
if (!/<div class="auth-view" id="login-view"><\/div>/.test(builtIndexHtml)) {
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
