import { useState } from 'react';
import { MetabaseControladoriaEmbed } from './MetabaseControladoriaEmbed';
import { ProtocolosPage } from './ProtocolosPage';
import { DefesasPage } from './DefesasPage';

type ControladoriaView = 'protocolos' | 'defesas' | 'indicadores';

export function ControladoriaPage() {
  const [view, setView] = useState<ControladoriaView>('protocolos');

  return <div className="controladoria-page-react">
    <nav className="controladoria-subnav controladoria-primary-subnav" aria-label="Módulos de Controladoria">
      <button type="button" className={view === 'protocolos' ? 'active' : ''} onClick={() => setView('protocolos')}>Protocolos</button>
      <button type="button" disabled title="Módulo em preparação">Liminar</button>
      <button type="button" className={view === 'defesas' ? 'active' : ''} onClick={() => setView('defesas')}>Defesas</button>
      <button type="button" className={view === 'indicadores' ? 'active' : ''} onClick={() => setView('indicadores')}>Indicadores</button>
    </nav>

    {view === 'protocolos' ? <div className="controladoria-protocolos-view"><ProtocolosPage/></div> : null}
    {view === 'defesas' ? <DefesasPage/> : null}
    {view === 'indicadores' ? <section className="controladoria-indicadores-view" aria-label="Indicadores da Controladoria"><MetabaseControladoriaEmbed/></section> : null}
  </div>;
}
