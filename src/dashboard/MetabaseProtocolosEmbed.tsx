import { LoaderCircle } from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

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

function embedUrl(config: EmbedConfig) {
  const base = String(config.instance_url || '').replace(/\/$/, '');
  if (!base || !config.jwt) throw new Error('Embed indisponível.');
  return `${base}/embed/dashboard/${config.jwt}#bordered=false&titled=false`;
}

export function MetabaseProtocolosEmbed() {
  const [src, setSrc] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    const api = (window as DashboardWindow).MBA_API;
    if (!api) return;
    setLoading(true);
    setError(false);
    try {
      const config = await api.request<EmbedConfig>('/api/protocolo/metabase/embed');
      setSrc(embedUrl(config));
    } catch {
      setSrc('');
      setError(true);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  if (loading && !src) {
    return <div className="protocolos-empty">
      <LoaderCircle className="spin" size={22}/>
      <strong>Carregando protocolos</strong>
      <span>Atualizando a visão de acompanhamento.</span>
    </div>;
  }

  if (error || !src) {
    return <div className="protocolos-empty">
      <strong>Acompanhamento indisponível</strong>
      <span>Tente novamente em instantes.</span>
    </div>;
  }

  return <iframe
    title="Acompanhamento de protocolos"
    src={src}
    loading="eager"
    referrerPolicy="same-origin"
    style={{ width: '100%', minHeight: '720px', border: 0, display: 'block', background: '#fff' }}
  />;
}
