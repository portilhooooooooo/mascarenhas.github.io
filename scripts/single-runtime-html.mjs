const LEGACY_LOCAL_SCRIPTS = [
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
  'assets/react-dashboard/dashboard-react.js',
];

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function scriptTag(source) {
  const escaped = escapeRegExp(source);
  return new RegExp(`<script\\b(?=[^>]*\\bsrc=["']/?${escaped}(?:\\?[^"']*)?["'])[^>]*>\\s*<\\/script>`, 'gi');
}

function stylesheetTag(source) {
  const escaped = escapeRegExp(source);
  return new RegExp(`<link\\b(?=[^>]*\\bhref=["']/?${escaped}(?:\\?[^"']*)?["'])[^>]*>`, 'gi');
}

export function singleRuntimeHtml(html) {
  let next = html;
  for (const source of LEGACY_LOCAL_SCRIPTS) next = next.replace(scriptTag(source), '');
  next = next.replace(stylesheetTag('assets/react-dashboard/dashboard-react.css'), '');

  if (!/src=["']\/src\/dashboard\/main\.tsx["']/.test(next)) {
    const entry = '    <script src="/vendor/qrcode.js"></script>\n    <script type="module" src="/src/dashboard/main.tsx"></script>\n';
    next = next.replace(/<\/body>/i, `${entry}</body>`);
  }
  return next;
}

export { LEGACY_LOCAL_SCRIPTS };
