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

const indexPath = `${dist}/index.html`;
const indexHtml = await readFile(indexPath, 'utf8');
await writeFile(
  indexPath,
  indexHtml
    .replace(/dashboard-react\.css\?v=[^"']+/g, 'dashboard-react.css?v=20260912-operation-subnav-v1')
    .replace(/dashboard-react\.js\?v=[^"']+/g, 'dashboard-react.js?v=20260912-operation-subnav-v1'),
  'utf8'
);

console.log('dist preparado para deploy.');

await cp('assets/vendor', `${dist}/assets/vendor`, {recursive: true});
