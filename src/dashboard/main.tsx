import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { CarteiraProcessualPage } from './CarteiraProcessualPage';

const root = document.getElementById('dashboard-root');

if (!root) {
  throw new Error('O ponto de montagem #dashboard-root não foi encontrado.');
}

createRoot(root).render(<StrictMode><CarteiraProcessualPage/></StrictMode>);
