// Single runtime entry for the imperative modules that still own the mature
// Backoffice screens. These imports are bundled by Vite and execute exactly
// once, in dependency order. There are no parallel application script tags in
// the production document anymore.
import './config.js';
import './mock-api.js';
import './data-api.js';
import './app.js';
import './agreements.js';
import './page-init-1.js';
import './page-init-2.js';
import './security-ui.js';
import './auth.js';

export {};
