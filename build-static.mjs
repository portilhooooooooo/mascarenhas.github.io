import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const dist = 'dist';
const hardeningVersion = '20260918-auth-performance-hardening';

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
  'assets/react-dashboard',
  `${dist}/assets/react-dashboard`,
  { recursive: true }
);

// Stable filenames need explicit versioning so browser/CDN caches cannot keep
// serving an older workspace or authentication bootstrap after a deploy.
const indexPath = `${dist}/index.html`;
const indexHtml = await readFile(indexPath, 'utf8');
const builtIndexHtml = indexHtml
  .replace(/<title>[^<]*<\/title>/, '<title>Mascarenhas Backoffice</title>')
  .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Mascarenhas Backoffice">')
  .replace('</head>', `  <link rel="stylesheet" href="/tasks.css?v=${hardeningVersion}">\n  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260917-exact-symbol">\n</head>`)
  .replace('</body>', `  <script src="/tasks-lobby.js?v=${hardeningVersion}"></script>\n</body>`)
  .replace(/dashboard-react\.css\?v=[^"']+/g, `dashboard-react.css?v=${hardeningVersion}`)
  .replace(/dashboard-react\.js\?v=[^"']+/g, `dashboard-react.js?v=${hardeningVersion}`)
  .replace(/data-api\.js(?:\?v=[^"']+)?/g, `data-api.js?v=${hardeningVersion}`)
  .replace(/auth\.js(?:\?v=[^"']+)?/g, `auth.js?v=${hardeningVersion}`)
  .replace(/app\.js(?:\?v=[^"']+)?/g, `app.js?v=${hardeningVersion}`)
  .replace(/agreements\.js(?:\?v=[^"']+)?/g, `agreements.js?v=${hardeningVersion}`)
  .replace(/payment-receipt\.js(?:\?v=[^"']+)?/g, `payment-receipt.js?v=${hardeningVersion}`)
  // Every local asset is rooted at /. Direct SPA routes such as /tarefas and
  // /tarefas/comprovante-pagamento must never resolve assets inside the route.
  .replace(/(href|src)="(?!https?:|\/\/|\/|#|mailto:|data:)([^"]+)"/g, '$1="/$2"');

await writeFile(indexPath, builtIndexHtml, 'utf8');

// Keep the runtime brand image on the same cache-busted exact asset used by
// the document head. The source image is extracted from the provided artwork,
// not redrawn from approximate SVG paths.
const authPath = `${dist}/auth.js`;
const authJs = await readFile(authPath, 'utf8');
await writeFile(
  authPath,
  authJs.replace(/20260916-mascarenhas/g, '20260917-exact-symbol'),
  'utf8'
);

console.log('dist preparado para deploy.');

await cp('assets/vendor', `${dist}/assets/vendor`, { recursive: true });
