import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

export default defineConfig({
  plugins: [react()],
  define: {
    'process.env.NODE_ENV': JSON.stringify('production'),
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
