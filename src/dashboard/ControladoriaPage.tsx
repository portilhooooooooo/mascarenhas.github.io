import { useState } from 'react';
import { MetabaseControladoriaEmbed } from './MetabaseControladoriaEmbed';
import { ProtocolosPage } from './ProtocolosPage';

type ControladoriaView = 'protocolos' | 'indicadores';

export function ControladoriaPage() {
  const [view, setView] = useState<ControladoriaView>('protocolos');

  return <div className="controladoria-page-react">
    <nav className="controladoria-subnav controladoria-primary-subnav" aria-label="Módulos de Controladoria">
      <button type="button" className={view === 'protocolos' ? 'active' : ''} onClick={() => setView('protocolos')}>Protocolos</button>
      <button type="button" disabled title="Módulo em preparação">Liminar</button>
      <button type="button" disabled title="Módulo em preparação">Contestação</button>
      <button type="button" className={view === 'indicadores' ? 'active' : ''} onClick={() => setView('indicadores')}>Indicadores</button>
    </nav>

    {view === 'protocolos'
      ? <div className="controladoria-protocolos-view"><ProtocolosPage/></div>
      : <section className="controladoria-indicadores-view" aria-label="Indicadores da Controladoria"><MetabaseControladoriaEmbed/></section>}
  </div>;
}
