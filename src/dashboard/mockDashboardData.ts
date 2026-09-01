import type { DashboardData } from './types';

const entries = [9, 8, 9, 12, 16, 11, 11, 10, 9, 10, 10, 11, 10, 9, 12, 14, 10, 10, 13, 9, 8, 10, 9, 10, 8, 7, 9, 13, 12, 11];
const closures = [8, 7, 8, 12, 15, 10, 10, 9, 8, 9, 11, 10, 9, 8, 11, 13, 9, 10, 12, 8, 7, 9, 8, 9, 7, 6, 8, 13, 12, 11];

export const mockDashboardData: DashboardData = {
  period: { start: '2026-09-01', end: '2026-09-30' },
  status: { backendConnected: true, enterSession: 'active', errorsToday: 0, updatedAt: '08:45' },
  portfolio: {
    activeBase: 10379,
    monthlyEntries: 310,
    entriesTrend: 26.7,
    monthlyClosures: 287,
    closuresTrend: 192,
    monthlyAgreements: 21,
    pendingAgreements: 19,
    archivableProcesses: 83,
  },
  distribution: {
    states: [
      { label: 'SP', value: 1419 }, { label: 'Outros', value: 1294 }, { label: 'RJ', value: 687 },
      { label: 'BA', value: 670 }, { label: 'MG', value: 664 }, { label: 'SC', value: 637 },
      { label: 'AM', value: 505 }, { label: 'MA', value: 465 }, { label: 'PR', value: 434 },
      { label: 'PE', value: 355 }, { label: 'GO', value: 249 },
    ],
    products: [
      { label: 'Cartão Consignado', value: 4231 }, { label: 'Crédito Pessoal', value: 2505 },
      { label: 'Empréstimo Consignado', value: 2132 }, { label: 'Seguros Diversos', value: 639 },
      { label: 'Conta Corrente', value: 468 }, { label: 'Outros', value: 402 },
    ],
    courtTypes: [{ label: 'Vara Cível', value: 7450 }, { label: 'Juizado', value: 2929 }],
    burden: [{ label: 'Com ônus', value: 332 }, { label: 'Sem ônus', value: 10047 }],
  },
  movement: {
    daily: entries.map((value, index) => ({
      day: String(index + 1).padStart(2, '0'),
      fullDate: `${String(index + 1).padStart(2, '0')}/09/2026`,
      entries: value,
      closures: closures[index],
    })),
    closureReasons: [
      { label: 'Improcedente', value: 175 },
      { label: 'Sem Resolução', value: 80 },
      { label: 'Acordo', value: 32 },
    ],
  },
  payments: {
    totalAmount: 261216.34,
    totalTrend: 18,
    tkm: 842.17,
    pendingApproval: { count: 17, amount: 28450.32 },
    missingReceipt: { count: 24, amount: 15237.8 },
    cancelled: { count: 6, amount: 4890.11 },
    agreementPayments: { count: 21, amount: 68342.2 },
    tkmHistory: [
      { label: 'Abr/26', value: 734.12 }, { label: 'Mai/26', value: 781.33 },
      { label: 'Jun/26', value: 812.44 }, { label: 'Jul/26', value: 790.88 },
      { label: 'Ago/26', value: 835.91 }, { label: 'Set/26', value: 842.17 },
    ],
    topCredenciados: [
      { label: 'Credenciado A', value: 98213.44 },
      { label: 'Credenciado B', value: 76721.33 },
      { label: 'Credenciado C', value: 42556.11 },
    ],
    credenciados: ['Credenciado A', 'Credenciado B', 'Credenciado C'],
  },
  updatedAt: '2026-09-01T08:45:00-04:00',
  autoRefreshMinutes: 15,
};

export const mockCredenciadoShares: Record<string, number> = {
  'Credenciado A': 98213.44 / 261216.34,
  'Credenciado B': 76721.33 / 261216.34,
  'Credenciado C': 42556.11 / 261216.34,
};
