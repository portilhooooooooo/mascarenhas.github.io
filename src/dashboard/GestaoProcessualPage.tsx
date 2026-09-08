import { useEffect, useState } from 'react';
import { CarteiraProcessualPage } from './CarteiraProcessualPage';
import { AcordosAnalyticsPage } from './AcordosAnalyticsPage';
import { PagamentosAnalyticsPage } from './PagamentosAnalyticsPage';

export type GestaoTab = 'carteira' | 'acordos' | 'pagamentos';

export function GestaoProcessualPage({ initialTab = 'carteira' }: { initialTab?: GestaoTab }) {
  const [tab, setTab] = useState<GestaoTab>(initialTab);

  useEffect(() => {
    const handler = (event: Event) => {
      const value = (event as CustomEvent<{ tab?: GestaoTab }>).detail?.tab;
      if (value && ['carteira', 'acordos', 'pagamentos'].includes(value)) setTab(value);
    };
    window.addEventListener('mba:gestao-tab', handler);
    return () => window.removeEventListener('mba:gestao-tab', handler);
  }, []);

  return <div className="analytics-page">
    <nav className="analytics-subnav" aria-label="Gestão Processual">
      <button type="button" className={tab === 'carteira' ? 'active' : ''} onClick={() => setTab('carteira')}>Carteira Processual</button>
      <button type="button" className={tab === 'acordos' ? 'active' : ''} onClick={() => setTab('acordos')}>Acordos</button>
      <button type="button" className={tab === 'pagamentos' ? 'active' : ''} onClick={() => setTab('pagamentos')}>Pagamentos</button>
    </nav>
    {tab === 'carteira' && <CarteiraProcessualPage/>}
    {tab === 'acordos' && <AcordosAnalyticsPage/>}
    {tab === 'pagamentos' && <PagamentosAnalyticsPage/>}
  </div>;
}
