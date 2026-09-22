import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const localBackend = process.env.VITE_BACKEND_TARGET || 'http://127.0.0.1:5000';
const localProxy = {
  '/api': { target: localBackend, changeOrigin: true },
  '/auth/': { target: localBackend, changeOrigin: true },
};

const localPreviewAuthPlugin = {
  name: 'mba-local-preview-auth',
  apply: 'serve' as const,
  transformIndexHtml() {
    return [{
      tag: 'script', injectTo: 'body' as const,
      children: `window.addEventListener('DOMContentLoaded',()=>{const p=new URLSearchParams(location.search);if(!['localhost','127.0.0.1'].includes(location.hostname)||p.get('preview')!=='1')return;const permissions={'dashboard.view':true,'automations.view':true,'automations.run':true,'automations.manage':true,'automations.override_daily_limit':true,'tutelas.view':true,'encerramentos.view':true,'pagamentos.view':true,'pagamentos.import':true,'agreements.view':true,'agreements.export':true,'tasks.view':true,'tasks.create':true,'tasks.assign':true,'tasks.execute':true,'tasks.manage':true,'users.view':true,'users.manage':true,'settings.view':true,'settings.manage':true};const user={id:'local-preview-admin',name:'Gabriel Portilho',email:'gabriel.portilho@mascarenhasbarbosa.com.br',role:'admin',is_master_admin:true,permissions};queueMicrotask(()=>{window.MBA_CURRENT_USER=user;document.body.classList.remove('auth-loading','auth-signed-out');document.body.classList.add('auth-signed-in');window.dispatchEvent(new CustomEvent('mba:authenticated',{detail:user}));window.restorePageRoute?.();});});`,
    }];
  },
};

export default defineConfig({
  plugins: [react(), localPreviewAuthPlugin],
  define: { 'process.env.NODE_ENV': JSON.stringify('production') },
  server: {
    host: '0.0.0.0',
    allowedHosts: ['dev.portilhobackoffice.site', 'local.portilhobackoffice.site'],
    proxy: localProxy,
  },
  preview: {
    host: 'localhost',
    port: 5173,
    strictPort: true,
    allowedHosts: ['dev.portilhobackoffice.site', 'local.portilhobackoffice.site'],
    proxy: localProxy,
  },
  build: {
    outDir: '.build/react-dashboard', emptyOutDir: true, cssCodeSplit: false,
    lib: { entry: resolve(__dirname, 'src/dashboard/main.tsx'), formats: ['es'], fileName: () => 'dashboard-react.js', cssFileName: 'dashboard-react' },
  },
});
