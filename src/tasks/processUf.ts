import type { TaskProcess } from './model';

/** Federal and labour court regions span UFs; never infer a state from them. */
const STATE_COURTS = [
  'AC','AL','AP','AM','BA','CE','DF','ES','GO',
  'MA','MT','MS','MG','PA','PB','PR','PE','PI',
  'RJ','RN','RS','RO','RR','SC','SE','SP','TO',
] as const;
const VALID_UFS = new Set<string>(STATE_COURTS);

export function getProcessUf(process: Pick<TaskProcess, 'case_number'> & Record<string, unknown>): string | null {
  for (const name of ['uf','sigla_uf','tribunal_uf','state','estado']) {
    const value = process[name];
    if (typeof value !== 'string') continue;
    const uf = value.trim().toUpperCase();
    if (VALID_UFS.has(uf)) return uf;
  }
  const cnj = String(process.case_number || '').replace(/\s/g, '');
  const parts = /^\d{7}-\d{2}\.\d{4}\.8\.(\d{2})\.\d{4}$/.exec(cnj);
  if (!parts) return null;
  const code = Number(parts[1]);
  return Number.isInteger(code) && code >= 1 && code <= 27 ? STATE_COURTS[code - 1] : null;
}
