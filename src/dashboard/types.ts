export type Tone = 'blue' | 'green' | 'amber' | 'red' | 'navy';

export interface LabeledValue {
  label: string;
  value: number;
}

export interface DailyMovement {
  day: string;
  fullDate: string;
  entries: number;
  closures: number;
}

export interface FinancialMetric {
  count?: number;
  amount: number;
}

export interface DashboardData {
  period: { start: string; end: string };
  status: {
    backendConnected: boolean;
    enterSession: 'active' | 'expired' | 'unavailable';
    errorsToday: number;
    updatedAt: string;
  };
  portfolio: {
    activeBase: number;
    monthlyEntries: number;
    entriesTrend: number;
    monthlyClosures: number;
    closuresTrend: number;
    monthlyAgreements: number;
    pendingAgreements: number;
    archivableProcesses: number;
  };
  distribution: {
    states: LabeledValue[];
    products: LabeledValue[];
    courtTypes: LabeledValue[];
    burden: LabeledValue[];
  };
  movement: {
    daily: DailyMovement[];
    closureReasons: LabeledValue[];
  };
  payments: {
    totalAmount: number;
    totalTrend: number;
    tkm: number;
    pendingApproval: FinancialMetric;
    missingReceipt: FinancialMetric;
    cancelled: FinancialMetric;
    agreementPayments: FinancialMetric;
    tkmHistory: LabeledValue[];
    topCredenciados: LabeledValue[];
    credenciados: string[];
  };
  updatedAt: string;
  autoRefreshMinutes: number;
}
