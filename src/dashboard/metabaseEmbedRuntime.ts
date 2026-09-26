type MetabaseRuntimeWindow = Window & typeof globalThis & {
  metabaseConfig?: { isGuest: boolean; instanceUrl: string };
};

let embedScriptPromise: Promise<void> | null = null;
let embedInstanceUrl = '';

export function normalizeMetabaseInstanceUrl(value: string) {
  const target = new URL(value);
  if (!['https:', 'http:'].includes(target.protocol)) throw new Error('Endereço do Metabase inválido.');
  return target.href.replace(/\/$/, '');
}

export function ensureMetabaseEmbedScript(instanceUrl: string) {
  if (customElements.get('metabase-dashboard')) return Promise.resolve();
  if (embedScriptPromise) {
    if (embedInstanceUrl !== instanceUrl) throw new Error('Instâncias Metabase divergentes no mesmo runtime.');
    return embedScriptPromise;
  }

  const targetWindow = window as MetabaseRuntimeWindow;
  targetWindow.metabaseConfig = { isGuest: true, instanceUrl };
  embedInstanceUrl = instanceUrl;
  embedScriptPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.defer = true;
    script.src = `${instanceUrl}/app/embed.js`;
    script.dataset.metabaseRuntime = 'true';
    script.addEventListener('load', async () => {
      try {
        await customElements.whenDefined('metabase-dashboard');
        resolve();
      } catch (error) {
        reject(error);
      }
    }, { once: true });
    script.addEventListener('error', () => {
      embedScriptPromise = null;
      embedInstanceUrl = '';
      reject(new Error('Não foi possível carregar o Metabase.'));
    }, { once: true });
    document.head.appendChild(script);
  });
  return embedScriptPromise;
}
