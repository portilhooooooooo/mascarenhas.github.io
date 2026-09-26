import { LoaderCircle, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureMetabaseEmbedScript, normalizeMetabaseInstanceUrl } from './metabaseEmbedRuntime';

type EmbedConfig = { jwt: string; instance_url: string; expires_in?: number };
type BackofficeApi = { request: <T = unknown>(path: string, options?: RequestInit) => Promise<T> };
type GestaoWindow = Window & typeof globalThis & { MBA_API?: BackofficeApi };

export function MetabaseGestaoEmbed() {
  const mountRef = useRef<HTMLDivElement>(null);
  const refreshTimer = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const load = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const api = (window as GestaoWindow).MBA_API;
      if (!api) throw new Error('API indisponível.');
      const config = await api.request<EmbedConfig>('/api/analytics/metabase/embed');
      if (!config?.jwt || !config?.instance_url) throw new Error('Painel indisponível.');
      const instanceUrl = normalizeMetabaseInstanceUrl(config.instance_url);
      await ensureMetabaseEmbedScript(instanceUrl);
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
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar a Gestão Processual.');
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

  return <section className="gestao-metabase-shell">
    {error ? <div className="gestao-metabase-state error">
      <strong>Não foi possível carregar a Gestão Processual</strong>
      <span>{error}</span>
      <button type="button" onClick={() => void load()}><RefreshCw size={14}/>Tentar novamente</button>
    </div> : null}
    {!error ? <div ref={mountRef} className="gestao-metabase-mount" /> : null}
    {loading && !error ? <div className="gestao-metabase-loading"><LoaderCircle className="spin" size={20}/></div> : null}
  </section>;
}
