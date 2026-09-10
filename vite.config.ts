import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { singleRuntimeHtml } from './scripts/single-runtime-html.mjs';

export default defineConfig({
  plugins: [
    {
      name: 'mba-single-runtime-html',
      transformIndexHtml: {
        order: 'pre',
        handler: singleRuntimeHtml,
      },
    },
    react(),
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    target: 'es2020',
    cssCodeSplit: true,
  },
});
