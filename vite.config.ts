import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['dev.portilhobackoffice.site', 'local.portilhobackoffice.site'],
  },
  preview: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    allowedHosts: ['dev.portilhobackoffice.site', 'local.portilhobackoffice.site'],
  },
  build: {
    outDir: '.build/react-dashboard', emptyOutDir: true, cssCodeSplit: false,
    lib: { entry: resolve(__dirname, 'src/dashboard/main.tsx'), formats: ['es'], fileName: () => 'dashboard-react.js', cssFileName: 'dashboard-react' },
  },
});
