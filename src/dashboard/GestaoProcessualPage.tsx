import { useEffect, useState } from 'react';
import { EncerramentosPage } from './EncerramentosPage';
import { MetabaseGestaoEmbed } from './MetabaseGestaoEmbed';
import './gestaoMetabase.css';

function getPermissions() {
  const user = (window as Window & { MBA_CURRENT_USER?: { permissions?: Record<string, boolean> } }).MBA_CURRENT_USER;
  return user?.permissions || {};
}

export function GestaoProcessualPage() {
  const [permissions, setPermissions] = useState(getPermissions);
  const [activeTab, setActiveTab] = useState<'geral' | 'encerramentos'>('geral');
  const canViewClosing = permissions['encerramentos.view'] === true;

  useEffect(() => {
    const sync = () => setPermissions(getPermissions());
    window.addEventListener('mba:authenticated', sync);
    window.addEventListener('mba:session-expired', sync);
    return () => {
      window.removeEventListener('mba:authenticated', sync);
      window.removeEventListener('mba:session-expired', sync);
    };
  }, []);
  useEffect(() => {
    if (!canViewClosing && activeTab === 'encerramentos') setActiveTab('geral');
  }, [activeTab, canViewClosing]);

  return <div className="gestao-metabase-page gestao-processual-react">
    <nav className="mba-operation-subnav gestao-processual-subnav" aria-label="Seções de Gestão Processual">
      <button type="button" className={activeTab === 'geral' ? 'active' : ''} aria-current={activeTab === 'geral' ? 'page' : undefined} onClick={() => setActiveTab('geral')}>Visão geral</button>
      {canViewClosing && <button type="button" className={activeTab === 'encerramentos' ? 'active' : ''} aria-current={activeTab === 'encerramentos' ? 'page' : undefined} onClick={() => setActiveTab('encerramentos')}>Encerramentos</button>}
    </nav>
    {activeTab === 'encerramentos' && canViewClosing ? <EncerramentosPage/> : <MetabaseGestaoEmbed/>}
  </div>;
}
