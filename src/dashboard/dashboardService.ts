import { mockCredenciadoShares, mockDashboardData } from './mockDashboardData';
import type { DashboardData } from './types';

export interface DashboardFilters {
  startDate: string;
  endDate: string;
  credenciado?: string;
}

export async function getDashboardData(filters?: Partial<DashboardFilters>): Promise<DashboardData> {
  const data = structuredClone(mockDashboardData);
  if (filters?.startDate) data.period.start = filters.startDate;
  if (filters?.endDate) data.period.end = filters.endDate;
  const selected = filters?.credenciado;
  const share = selected ? mockCredenciadoShares[selected] : undefined;
  if (!selected || share === undefined) return data;

  data.payments.totalAmount = data.payments.topCredenciados.find((item) => item.label === selected)?.value ?? 0;
  data.payments.pendingApproval.count = Math.round((data.payments.pendingApproval.count ?? 0) * share);
  data.payments.pendingApproval.amount *= share;
  data.payments.missingReceipt.count = Math.round((data.payments.missingReceipt.count ?? 0) * share);
  data.payments.missingReceipt.amount *= share;
  data.payments.cancelled.count = Math.round((data.payments.cancelled.count ?? 0) * share);
  data.payments.cancelled.amount *= share;
  data.payments.agreementPayments.count = Math.round((data.payments.agreementPayments.count ?? 0) * share);
  data.payments.agreementPayments.amount *= share;
  data.payments.topCredenciados = data.payments.topCredenciados.filter((item) => item.label === selected);
  return data;
}
