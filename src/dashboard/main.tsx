import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { DashboardPage } from './DashboardPage';
import { CarteiraProcessualPage } from './CarteiraProcessualPage';

const dashboardRoot = document.getElementById('dashboard-root');
const carteiraRoot = document.getElementById('carteira-root');

if (!dashboardRoot || !carteiraRoot) {
  throw new Error('Os pontos de montagem do dashboard não foram encontrados.');
}

createRoot(dashboardRoot).render(<StrictMode><DashboardPage/></StrictMode>);
createRoot(carteiraRoot).render(<StrictMode><CarteiraProcessualPage/></StrictMode>);
