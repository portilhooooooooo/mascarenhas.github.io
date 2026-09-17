import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';

const dist = 'dist';

await rm(dist, { recursive: true, force: true });
await mkdir(`${dist}/assets/react-dashboard`, { recursive: true });

const files = [
  'index.html',
  'styles.css',
  'agreements.css',
  'protocolo.css',
  'config.js',
  'mock-api.js',
  'data-api.js',
  'app.js',
  'agreements.js',
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
await writeFile(
  indexPath,
  indexHtml
    .replace(/<title>[^<]*<\/title>/, '<title>Mascarenhas Backoffice</title>')
    .replace(/<meta name="description" content="[^"]*">/, '<meta name="description" content="Mascarenhas Backoffice">')
    .replace('</head>', '  <link rel="icon" type="image/svg+xml" href="/favicon.svg?v=20260917-exact-symbol">\n</head>')
    .replace(/dashboard-react\.css\?v=[^"']+/g, 'dashboard-react.css?v=20260917-profile-menu')
    .replace(/dashboard-react\.js\?v=[^"']+/g, 'dashboard-react.js?v=20260917-profile-menu')
    .replace(/data-api\.js(?:\?v=[^"']+)?/g, 'data-api.js?v=20260916-session-persist')
    .replace(/auth\.js(?:\?v=[^"']+)?/g, 'auth.js?v=20260917-exact-symbol'),
  'utf8'
);

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
