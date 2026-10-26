// Permit-list persisted settings before constructing any authenticated reporting query.
export type ProductivityFilters={period:'today'|'7'|'30'|'90'|'all';deadline:'all'|'overdue'|'today'|'future'|'none';person:string};
export const DEFAULT_PRODUCTIVITY_FILTERS:ProductivityFilters={period:'30',deadline:'all',person:'all'};
const PERIODS=new Set(['today','7','30','90','all']);
const DEADLINES=new Set(['all','overdue','today','future','none']);
const PERSON=/^[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}$/i;
export function normalizeProductivityFilters(raw:unknown):ProductivityFilters{
  if(!raw||typeof raw!=='object')return {...DEFAULT_PRODUCTIVITY_FILTERS};
  const saved=raw as Record<string,unknown>;
  return {
    period:typeof saved.period==='string'&&PERIODS.has(saved.period)?saved.period as ProductivityFilters['period']:'30',
    deadline:typeof saved.deadline==='string'&&DEADLINES.has(saved.deadline)?saved.deadline as ProductivityFilters['deadline']:'all',
    person:typeof saved.person==='string'&&(saved.person==='all'||PERSON.test(saved.person))?saved.person:'all',
  };
}
export function productivityParams(filters:ProductivityFilters,canViewOthers:boolean,legacy:boolean):URLSearchParams{
  const params=new URLSearchParams({
    period:filters.period,deadline:filters.deadline,
    person:canViewOthers?filters.person:'all',
    duration:'all',
  });
  if(!legacy){params.set('include_pending','0');params.set('include_growth','0');}
  return params;
}
