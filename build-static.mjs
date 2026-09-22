import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execSync } from 'node:child_process';

const dist = 'dist';
const fallbackVersion = '20260922-tasks-workspace';
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
  'tasks.css',
  'agreements.css',
  'payment-receipt.css',
  'protocolo.css',
  'config.js',
  'mock-api.js',
  'data-api.js',
  'app.js',
  'tasks-lobby.js',
  'agreements.js',
  'payment-receipt.js',
  'protocolo.js',
  'auth.js',
  'security-ui.js',
  'page-init-1.js',
  'page-init-2.js',
  'favicon.svg',
  '_headers',
];

for (const file of files) {
  await cp(file, `${dist}/${file}`);
}

await cp(
  '.build/react-dashboard',
  `${dist}/assets/react-dashboard`,
  { recursive: true }
);

const indexPath = `${dist}/index.html`;
const indexHtml = await readFile(indexPath, 'utf8');
const builtIndexHtml = indexHtml
  .replace(/<title>[^<]*<\/title>/, '<title>Mascarenhas Backoffice</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Mascarenhas Backoffice">')
  .replace('</head>', `  <link rel="stylesheet" href="/tasks.css?v=${buildVersion}">\n  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260917-exact-symbol">\n</head>`)
  .replace('</body>', `  <script src="/tasks-lobby.js?v=${buildVersion}"></script>\n  <script type="module" src="/assets/react-dashboard/login-react.js?v=${buildVersion}"></script>\n</body>`)
  .replace(/styles\.css(?:\?v=[^"']+)?/g, `styles.css?v=${buildVersion}`)
  .replace(/agreements\.css(?:\?v=[^"']+)?/g, `agreements.css?v=${buildVersion}`)
  .replace(/payment-receipt\.css(?:\?v=[^"']+)?/g, `payment-receipt.css?v=${buildVersion}`)
  .replace(/protocolo\.css(?:\?v=[^"']+)?/g, `protocolo.css?v=${buildVersion}`)
  .replace(/dashboard-react\.css\?v=[^"']+/g, `dashboard-react.css?v=${buildVersion}`)
  .replace(/dashboard-react\.js\?v=[^"']+/g, `dashboard-react.js?v=${buildVersion}`)
  .replace(/config\.js(?:\?v=[^"']+)?/g, `config.js?v=${buildVersion}`)
  .replace(/mock-api\.js(?:\?v=[^"']+)?/g, `mock-api.js?v=${buildVersion}`)
  .replace(/data-api\.js(?:\?v=[^"']+)?/g, `data-api.js?v=${buildVersion}`)
  .replace(/auth\.js(?:\?v=[^"']+)?/g, `auth.js?v=${buildVersion}`)
  .replace(/app\.js(?:\?v=[^"']+)?/g, `app.js?v=${buildVersion}`)
  .replace(/agreements\.js(?:\?v=[^"']+)?/g, `agreements.js?v=${buildVersion}`)
  .replace(/payment-receipt\.js(?:\?v=[^"']+)?/g, `payment-receipt.js?v=${buildVersion}`)
  .replace(/protocolo\.js(?:\?v=[^"']+)?/g, `protocolo.js?v=${buildVersion}`)
  .replace(/security-ui\.js(?:\?v=[^"']+)?/g, `security-ui.js?v=${buildVersion}`)
  .replace(/page-init-1\.js(?:\?v=[^"']+)?/g, `page-init-1.js?v=${buildVersion}`)
  .replace(/page-init-2\.js(?:\?v=[^"']+)?/g, `page-init-2.js?v=${buildVersion}`)
  .replace(/(href|src)="(?!https?:|\/\/|\/|#|mailto:|data:)([^"]+)"/g, '$1="/$2"');

await writeFile(indexPath, builtIndexHtml, 'utf8');
await writeFile(`${dist}/mba-build-sha.txt`, `${buildVersion}\n`, 'utf8');

const authPath = `${dist}/auth.js`;
const authJs = await readFile(authPath, 'utf8');
await writeFile(
  authPath,
  authJs.replace(/20260916-mascarenhas/g, '20260917-exact-symbol'),
  'utf8'
);

console.log(`dist preparado para deploy e preview local (${buildVersion}).`);

await cp('assets/vendor', `${dist}/assets/vendor`, { recursive: true });
