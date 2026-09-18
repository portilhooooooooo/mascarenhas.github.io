import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'node:path';

const localPreviewAuthPlugin = {
  name: 'mba-local-preview-auth',
  apply: 'serve' as const,
  transformIndexHtml() {
    return [
      {
        tag: 'script',
        injectTo: 'body' as const,
        children: `
          window.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(location.search);
            const isLocalPreview = ['localhost', '127.0.0.1'].includes(location.hostname) && params.get('preview') === '1';
            if (!isLocalPreview) return;

            const permissions = {
              'dashboard.view': true,
              'automations.view': true,
              'automations.run': true,
              'automations.manage': true,
              'automations.override_daily_limit': true,
              'tutelas.view': true,
              'encerramentos.view': true,
              'pagamentos.view': true,
              'pagamentos.import': true,
              'agreements.view': true,
              'agreements.export': true,
              'tasks.view': true,
              'tasks.create': true,
              'tasks.assign': true,
              'tasks.execute': true,
              'tasks.manage': true,
              'users.view': true,
              'users.manage': true,
              'settings.view': true,
              'settings.manage': true,
            };

            const user = {
              id: 'local-preview-admin',
              name: 'Gabriel Portilho',
              email: 'gabriel.portilho@mascarenhasbarbosa.com.br',
              role: 'admin',
              is_master_admin: true,
              permissions,
            };

            // auth.js intentionally talks to the production backend. In localhost
            // preview mode we bypass OAuth completely so UI work never depends on
            // production CORS, Microsoft callbacks or a real session.
            queueMicrotask(() => {
              window.MBA_CURRENT_USER = user;
              document.body.classList.remove('auth-loading', 'auth-signed-out');
              document.body.classList.add('auth-signed-in');

              const profileName = document.getElementById('profile-name');
              const profileRole = document.getElementById('profile-role');
              const profileAvatar = document.getElementById('profile-avatar');
              const welcomeName = document.getElementById('welcome-name');
              if (profileName) profileName.textContent = user.name;
              if (profileRole) profileRole.textContent = 'Administrador';
              if (profileAvatar) profileAvatar.textContent = 'GP';
              if (welcomeName) welcomeName.textContent = 'Gabriel';

              document.querySelectorAll('[data-permission]').forEach((element) => {
                element.hidden = false;
              });
              document.querySelectorAll('.master-admin-only').forEach((element) => {
                element.hidden = false;
              });

              const badge = document.getElementById('local-preview-badge');
              if (badge) badge.hidden = false;

              window.dispatchEvent(new CustomEvent('mba:authenticated', { detail: user }));
              window.restorePageRoute?.();
            });
          });
        `,
      },
    ];
  },
};

export default defineConfig({
  plugins: [react(), localPreviewAuthPlugin],
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
