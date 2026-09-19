import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const localBackend = process.env.VITE_BACKEND_TARGET || 'http://127.0.0.1:5000';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
  },
  server: {
    host: '0.0.0.0',
    proxy: {
      '/api': {
        target: localBackend,
        changeOrigin: true,
      },
      '/auth': {
        target: localBackend,
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'assets/react-dashboard',
    emptyOutDir: true,
    cssCodeSplit: false,
    lib: {
      entry: resolve(__dirname, 'src/dashboard/main.tsx'),
      formats: ['es'],
      fileName: () => 'dashboard-react.js',
      cssFileName: 'dashboard-react',
    },
  },
});
