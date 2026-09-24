import { AlertTriangle, LoaderCircle, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type EmbedConfig = { jwt: string; instance_url: string; expires_in?: number };
type MbaWindow = Window & typeof globalThis & {
  MBA_API?: { request: <T = unknown>(path: string, options?: RequestInit) => Promise<T> };
  metabaseConfig?: { isGuest: boolean; instanceUrl: string };
};

const mbaWindow = window as MbaWindow;
let metabaseScriptPromise: Promise<void> | null = null;
let loadedInstanceUrl = '';

function normalizeInstanceUrl(value: string) {
  const target = new URL(value);
  const localHttp = target.protocol === 'http:' && ['localhost', '127.0.0.1'].includes(target.hostname);
  if (target.protocol !== 'https:' && !localHttp) throw new Error('O endereço do Metabase é inválido.');
  target.pathname = target.pathname.replace(/\/$/, '');
  target.search = '';
  target.hash = '';
  return target.href.replace(/\/$/, '');
}

function ensureMetabaseScript(instanceUrl: string) {
  if (customElements.get('metabase-dashboard')) return Promise.resolve();
  if (metabaseScriptPromise && loadedInstanceUrl === instanceUrl) return metabaseScriptPromise;

  mbaWindow.metabaseConfig = { isGuest: true, instanceUrl };
  loadedInstanceUrl = instanceUrl;
  metabaseScriptPromise = new Promise<void>((resolve, reject) => {
    document.querySelector('script[data-metabase-embed]')?.remove();
    const script = document.createElement('script');
    script.defer = true;
    script.src = `${instanceUrl}/app/embed.js`;
    script.dataset.metabaseEmbed = 'true';
    script.addEventListener('load', async () => {
      await customElements.whenDefined('metabase-dashboard');
      resolve();
    }, { once: true });
    script.addEventListener('error', () => reject(new Error('Não foi possível carregar o Metabase.')), { once: true });
    document.head.appendChild(script);
  });
  return metabaseScriptPromise;
}

export function MetabaseProtocolosEmbed() {
  const hostRef = useRef<HTMLDivElement>(null);
  const refreshTimerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    if (!mbaWindow.MBA_API || !hostRef.current) return;
    setLoading(true);
    setError('');
    try {
      const config = await mbaWindow.MBA_API.request<EmbedConfig>('/api/protocolo/metabase/embed');
      if (!config?.jwt || !config?.instance_url) throw new Error('O servidor retornou um embed inválido.');
      const instanceUrl = normalizeInstanceUrl(config.instance_url);
      await ensureMetabaseScript(instanceUrl);

      let dashboard = hostRef.current.querySelector('metabase-dashboard');
      if (!dashboard) {
        dashboard = document.createElement('metabase-dashboard');
        dashboard.setAttribute('with-title', 'false');
        dashboard.setAttribute('with-downloads', 'false');
        hostRef.current.replaceChildren(dashboard);
      }
      dashboard.setAttribute('token', config.jwt);

      if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
      const refreshSeconds = Math.max(60, Number(config.expires_in || 600) - 60);
      refreshTimerRef.current = window.setTimeout(() => void load(), refreshSeconds * 1000);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar o acompanhamento de protocolos.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
    return () => {
      if (refreshTimerRef.current) window.clearTimeout(refreshTimerRef.current);
    };
  }, [load]);

  return <div className="protocolos-metabase-panel">
    <div className="protocolos-metabase-head">
      <div><h2>Acompanhamento</h2><p>Leitura operacional diretamente pelo Metabase.</p></div>
      <button type="button" className="protocolos-button secondary" onClick={() => void load()} disabled={loading}>
        <RefreshCw className={loading ? 'spin' : ''} size={15}/> Atualizar painel
      </button>
    </div>
    {error && <div className="protocolos-alert error"><AlertTriangle size={16}/><span>{error}</span></div>}
    {loading && !hostRef.current?.childElementCount && <div className="protocolos-metabase-loading"><LoaderCircle className="spin" size={20}/><span>Carregando painel…</span></div>}
    <div ref={hostRef} className="protocolos-metabase-host" aria-label="Dashboard de Protocolos"/>
  </div>;
}
