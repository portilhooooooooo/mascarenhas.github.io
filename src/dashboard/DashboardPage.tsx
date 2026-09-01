import { useCallback, useEffect, useState } from 'react';
import { getDashboardData } from './dashboardService';
import type { DashboardFilters } from './dashboardService';
import type { DashboardData } from './types';
import { DashboardError, DashboardSkeleton } from './components/common';
import { DashboardFooter, PaymentsSection, PortfolioDistributionMovement, PortfolioOverview, WelcomePanel } from './components/sections';
import './dashboard.css';

export function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [selectedCredenciado, setSelectedCredenciado] = useState('');
  const [error, setError] = useState(false);

  const loadDashboard = useCallback(async (filters?: Partial<DashboardFilters>) => {
    try {
      setError(false);
      const nextData = await getDashboardData(filters);
      setData(nextData);
    } catch {
      setError(true);
    }
  }, []);

  useEffect(() => { void loadDashboard(); }, [loadDashboard]);

  const handlePeriodChange = (start: string, end: string) => {
    setData((current) => current ? { ...current, period: { start, end } } : current);
  };

  const handleCredenciadoChange = (value: string) => {
    setSelectedCredenciado(value);
    void loadDashboard({
      credenciado: value,
      startDate: data?.period.start,
      endDate: data?.period.end,
    });
  };

  if (error) return <DashboardError onRetry={() => void loadDashboard()}/>;
  if (!data) return <DashboardSkeleton/>;

  return <div className="react-dashboard">
    <WelcomePanel data={data} onPeriodChange={handlePeriodChange}/>
    <PortfolioOverview data={data}/>
    <PortfolioDistributionMovement data={data}/>
    <PaymentsSection data={data} selectedCredenciado={selectedCredenciado} onCredenciadoChange={handleCredenciadoChange}/>
    <DashboardFooter updatedAt={data.updatedAt} autoRefreshMinutes={data.autoRefreshMinutes}/>
  </div>;
}
