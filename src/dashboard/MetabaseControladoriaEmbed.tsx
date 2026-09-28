import { LoaderCircle, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';

type EmbedConfig = {
  jwt: string;
  instance_url: string;
  expires_in?: number;
};

type BackofficeApi = {
  request: <T = unknown>(path: string, options?: RequestInit) => Promise<T>;
};

type DashboardWindow = Window & typeof globalThis & {
  MBA_API?: BackofficeApi;
};

function buildEmbedUrl(config: EmbedConfig) {
  const instanceUrl = config.instance_url.replace(/\/+$/, '');
  return `${instanceUrl}/embed/dashboard/${encodeURIComponent(config.jwt)}#bordered=false&titled=false&theme=light`;
}

export function MetabaseControladoriaEmbed() {
  const [url, setUrl] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const refreshTimer = useRef<number | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError('');

    try {
      const api = (window as DashboardWindow).MBA_API;
      if (!api) throw new Error('API indisponível.');

      const config = await api.request<EmbedConfig>('/api/protocolo/metabase/embed');
      if (!config?.jwt || !config?.instance_url) throw new Error('Painel indisponível.');

      setUrl(buildEmbedUrl(config));
      if (refreshTimer.current) window.clearTimeout(refreshTimer.current);
      const refreshAfter = Math.max(300, Number(config.expires_in || 3600) - 60);
      refreshTimer.current = window.setTimeout(() => void load(), refreshAfter * 1000);
    } catch (cause) {
      setUrl('');
      setError(cause instanceof Error ? cause.message : 'Não foi possível carregar os indicadores.');
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

  if (error) {
    return <div className="controladoria-metabase-state error">
      <strong>Não foi possível carregar os indicadores</strong>
      <span>{error}</span>
      <button type="button" onClick={() => void load()}><RefreshCw size={14}/>Tentar novamente</button>
    </div>;
  }

  if (!url) {
    return <div className="controladoria-metabase-state">
      <LoaderCircle className="spin" size={22}/>
      <strong>Carregando indicadores</strong>
    </div>;
  }

  return <div className="controladoria-metabase-view">
    {loading && <div className="controladoria-metabase-loading"><LoaderCircle className="spin" size={20}/></div>}
    <iframe
      className="controladoria-metabase-frame"
      src={url}
      title="Indicadores da Controladoria"
      onLoad={() => setLoading(false)}
      allow="fullscreen"
    />
  </div>;
}
