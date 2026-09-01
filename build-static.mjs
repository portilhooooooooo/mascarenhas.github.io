import { cp, mkdir, rm } from 'node:fs/promises';

const dist = 'dist';

await rm(dist, { recursive: true, force: true });
await mkdir(`${dist}/assets/react-dashboard`, { recursive: true });

const files = [
  'index.html',
  'styles.css',
  'agreements.css',
  'config.js',
  'supabase-client.js',
  'mock-api.js',
  'data-api.js',
  'app.js',
  'agreements.js',
  'auth.js',
];

for (const file of files) {
  await cp(file, `${dist}/${file}`);
}

await cp(
  'assets/react-dashboard',
  `${dist}/assets/react-dashboard`,
  { recursive: true }
);

console.log('dist preparado para deploy.');