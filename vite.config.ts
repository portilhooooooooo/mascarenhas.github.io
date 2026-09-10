import { defineConfig, type IndexHtmlTransformContext } from 'vite';
import react from '@vitejs/plugin-react';

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scriptTag(source: string) {
  const escaped = escapeRegExp(source);
  return new RegExp(`<script\\b(?=[^>]*\\bsrc=["']${escaped}(?:\\?[^"']*)?["'])[^>]*>\\s*<\\/script>`, 'gi');
}

function stylesheetTag(source: string) {
  const escaped = escapeRegExp(source);
  return new RegExp(`<link\\b(?=[^>]*\\bhref=["']${escaped}(?:\\?[^"']*)?["'])[^>]*>`, 'gi');
}

function singleRuntimeHtml(html: string, _context?: IndexHtmlTransformContext) {
  let next = html.replace(
    scriptTag('assets/react-dashboard/dashboard-react.js'),
    '<script src="/vendor/qrcode.js"></script>\n    <script type="module" src="/src/dashboard/main.tsx"></script>',
  );

  for (const source of [
    'page-init-1.js',
    'config.js',
    'mock-api.js',
    'data-api.js',
    'app.js',
    'agreements.js',
    'auth.js',
    'page-init-2.js',
    'assets/vendor/qrcode.js',
    'security-ui.js',
  ]) {
    next = next.replace(scriptTag(source), '');
  }

  next = next.replace(stylesheetTag('assets/react-dashboard/dashboard-react.css'), '');
  return next;
}

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
