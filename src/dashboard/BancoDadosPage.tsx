import { Database, LoaderCircle, RefreshCw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ensureMetabaseEmbedScript, normalizeMetabaseInstanceUrl } from './metabaseEmbedRuntime';

type EmbedConfig = { jwt: string; instance_url: string; expires_in?: number };
type BackofficeWindow = Window & typeof globalThis & {
  MBA_API?: { request: <T = unknown>(path: string) => Promise<T>; getPortfolioId?: () => string };
  MBA_PORTFOLIO_POLICY?: { canAccess: (page: string) => boolean };
};

export function BancoDadosPage() {
  const mountRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const clearRefresh = useCallback(() => {
    if (timerRef.current !== null) window.clearTimeout(timerRef.current);
    timerRef.current = null;
  }, []);
  const load = useCallback(async () => {
    const win = window as BackofficeWindow;
    if (win.MBA_API?.getPortfolioId?.() !== 'agibank_mba' ||
        win.MBA_PORTFOLIO_POLICY?.canAccess('banco-dados') !== true) {
      setError('Esta área está disponível somente para Agibank <> MBA.');
      setLoading(false);
      mountRef.current?.replaceChildren();
      return;
    }
    setLoading(true);
    setError('');
    clearRefresh();
    try {
      if (!win.MBA_API) throw new Error('API indisponível.');
      const response = await win.MBA_API.request<EmbedConfig>('/api/banco-dados/metabase/embed');
      if (!response?.jwt || !response?.instance_url) throw new Error('O painel ainda não foi configurado.');
      const instanceUrl = normalizeMetabaseInstanceUrl(response.instance_url);
      await ensureMetabaseEmbedScript(instanceUrl);
      // Check again after async work: the user may have switched portfolios.
      if (win.MBA_API.getPortfolioId?.() !== 'agibank_mba' || !mountRef.current) return;
      const dashboard = document.createElement('metabase-dashboard');
      dashboard.setAttribute('token', response.jwt);
      dashboard.setAttribute('with-title', 'false');
      dashboard.setAttribute('with-downloads', 'true');
      mountRef.current.replaceChildren(dashboard);
      const refreshSeconds = Math.max(30, Number(response.expires_in || 600) - 60);
      timerRef.current = window.setTimeout(() => void load(), refreshSeconds * 1000);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : 'Não foi possível carregar o painel.');
      mountRef.current?.replaceChildren();
    } finally {
      setLoading(false);
    }
  }, [clearRefresh]);

  useEffect(() => {
    void load();
    return () => { clearRefresh(); mountRef.current?.replaceChildren(); };
  }, [load, clearRefresh]);

  return <div className="banco-dados-workspace">
    <header className="banco-dados-heading">
      <div className="banco-dados-title"><Database size={20} aria-hidden="true" />
        <div><h1>Banco de Dados</h1><p>Agibank &lt;&gt; MBA · Encerramentos validados, tarefas e andamentos do Benner</p></div>
      </div>
      <button type="button" className="banco-dados-refresh" onClick={() => void load()} disabled={loading}>
        <RefreshCw size={15} aria-hidden="true"/>Atualizar
      </button>
    </header>
    <div className="banco-dados-frame">
      <div ref={mountRef} className="banco-dados-mount" aria-label="Banco de Dados - Agibank MBA"/>
      {loading && <div className="banco-dados-state" role="status"><LoaderCircle className="spin" size={20}/>Carregando registros…</div>}
      {error && <div className="banco-dados-state banco-dados-error" role="alert">
        <strong>Não foi possível carregar o Banco de Dados</strong>
        <span>{error}</span>
        <button type="button" onClick={() => void load()}>Tentar novamente</button>
      </div>}
    </div>
  </div>;
}
