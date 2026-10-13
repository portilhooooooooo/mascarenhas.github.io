import { useEffect, useState } from 'react';
import { MetabaseControladoriaEmbed } from './MetabaseControladoriaEmbed';
import { ProtocolosPage } from './ProtocolosPage';
import { DefesasPage } from './DefesasPage';

type ControladoriaView = 'protocolos' | 'defesas' | 'indicadores';
function currentControladoriaView(): ControladoriaView {
  const path = (window.location.hash.startsWith('#/') ? window.location.hash.slice(2) : window.location.pathname).replace(/^\/+|\/+$/g, '');
  if (path === 'controladoria/defesas') return 'defesas';
  if (path === 'controladoria/indicadores') return 'indicadores';
  return 'protocolos';
}
function navigateControladoria(view: ControladoriaView) {
  (window as Window & { MBA_NAVIGATE?: (route: string) => boolean }).MBA_NAVIGATE?.('controladoria/' + view);
}
export function ControladoriaPage() {
  const [view, setView] = useState<ControladoriaView>(currentControladoriaView);
  useEffect(() => {
    const sync = () => setView(currentControladoriaView());
    window.addEventListener('mba:route-changed', sync);
    return () => window.removeEventListener('mba:route-changed', sync);
  }, []);
  return <div className="controladoria-page-react">
    <nav className="controladoria-subnav controladoria-primary-subnav" aria-label="Fluxos operacionais (atalho legado)">
      <button type="button" className={view === 'protocolos' ? 'active' : ''} onClick={() => navigateControladoria('protocolos')}>Protocolos</button>
      <button type="button" className={view === 'defesas' ? 'active' : ''} onClick={() => navigateControladoria('defesas')}>Defesas</button>
      <button type="button" className={view === 'indicadores' ? 'active' : ''} onClick={() => navigateControladoria('indicadores')}>Indicadores</button>
    </nav>
    {view === 'protocolos' ? <div className="controladoria-protocolos-view"><ProtocolosPage/></div> : null}
    {view === 'defesas' ? <DefesasPage/> : null}
    {view === 'indicadores' ? <section className="controladoria-indicadores-view" aria-label="Indicadores da Controladoria"><MetabaseControladoriaEmbed/></section> : null}
  </div>;
}
