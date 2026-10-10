import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

// Both the legacy operational fixture and the isolated five-role prototype are built.
// The production Vite config is untouched.
export default defineConfig({
  root: 'ux-preview',
  plugins: [react()],
  server: { host: '0.0.0.0', port: 5174, strictPort: true },
  build: {
    outDir: '../.build/ux-preview',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        index: resolve(process.cwd(), 'ux-preview/index.html'),
        reimagined: resolve(process.cwd(), 'ux-preview/reimagined/index.html'),
      },
    },
  },
});
