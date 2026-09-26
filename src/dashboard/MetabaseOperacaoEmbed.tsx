import { LoaderCircle, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type EmbedConfig = { jwt: string; instance_url: string; expires_in?: number };
type BackofficeApi = { request: <T = unknown>(path: string, options?: RequestInit) => Promise<T> };
type OperacaoWindow = Window & typeof globalThis & {
  MBA_API?: BackofficeApi;
  metabaseConfig?: { isGuest: boolean; instanceUrl: string };
};

let embedScriptPromise: Promise<void> | null = null;
let embedInstanceUrl = '';

function normalizeInstanceUrl(value: string) {
  const target = new URL(value);
  if (!['https:', 'http:'].includes(target.protocol)) throw new Error('Endereço do Metabase inválido.');
  return target.href.replace(/\/$/, '');
}

function ensureMetabaseScript(instanceUrl: string) {
  if (customElements.get('metabase-dashboard')) return Promise.resolve();
  if (embedScriptPromise && embedInstanceUrl === instanceUrl) return embedScriptPromise;
  const targetWindow = window as OperacaoWindow;
  targetWindow.metabaseConfig = { isGuest: true, instanceUrl };
  embedInstanceUrl = instanceUrl;
  embedScriptPromise = new Promise((resolve, reject) => {
    document.querySelector('script[data-metabase-operacao]')?.remove();
    const script = document.createElement('script');
    script.defer = true;
    script.src = `${instanceUrl}/app/embed.js`;
    script.dataset.metabaseOperacao = 'true';
    script.addEventListener('load', async () => {
      try {
        await customElements.whenDefined('metabase-dashboard');
        resolve();
      } catch (error) {
        reject(error);
      }
    }, { once: true });
    script.addEventListener('error', () => reject(new Error('Não foi possível carregar o Metabase.')), { once: true });
    document.head.appendChild(script);
  });
  return embedScriptPromise;
}

export function MetabaseOperacaoEmbed() {
  const mountRef = useRef<HTMLDivElement>(null);
  const refreshTimer = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const api = (window as OperacaoWindow).MBA_API;
      if (!api) throw new Error('API indisponível.');
      const config = await api.request<EmbedConfig>('/api/operacao/metabase/embed');
      if (!config?.jwt || !config?.instance_url) throw new Error('Painel indisponível.');
      const instanceUrl = normalizeInstanceUrl(config.instance_url);
      await ensureMetabaseScript(instanceUrl);
      if (!mountRef.current) return;
      mountRef.current.replaceChildren();
      const dashboard = document.createElement('metabase-dashboard');
      dashboard.setAttribute('token', config.jwt);
      dashboard.setAttribute('with-title', 'false');
      dashboard.setAttribute('with-downloads', 'true');
      mountRef.current.appendChild(dashboard);
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
      const refreshAfter = Math.max(300, Number(config.expires_in || 600) - 60);
      refreshTimer.current = window.setTimeout(() => void load(), refreshAfter * 1000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a Operação.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    return () => {
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
    };
  }, [load]);

  return <section className="operacao-metabase-shell">
    {error ? <div className="operacao-metabase-state error">
      <strong>Não foi possível carregar a Operação</strong>
      <span>{error}</span>
      <button type="button" onClick={() => void load()}><RefreshCw size={14}/>Tentar novamente</button>
    </div> : null}
    {!error ? <div ref={mountRef} className="operacao-metabase-mount" /> : null}
    {loading && !error ? <div className="operacao-metabase-loading"><LoaderCircle className="spin" size={20}/></div> : null}
  </section>;
}
