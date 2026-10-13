import type { ResultPayload } from './TaskResults';

// Fixture exclusivamente visual: não representa usuários, tarefas ou telemetria do banco.
const PEOPLE = [
  { id: 'demo-gabriel-portilho', name: 'Gabriel Portilho', factor: 2 },
  { id: 'demo-gessica-avalos', name: 'Géssica Avalos', factor: 1 },
] as const;
const TYPES = ['encerramento', 'liminar', 'defesa', 'comprovante_pagamento', 'protocolo', 'acordos'] as const;
const DEADLINES = ['overdue', 'today', 'future', 'none'] as const;
const DAYS: Record<string, number> = { today: 1, '7': 7, '30': 30, '90': 90, all: 180 };
type DemoFilters = { period: string; deadline: string; person: string; duration: string };
type Sample = { age: number; personId: string; type: string; deadline: string; count: number; analysisSeconds: number; stepSeconds: number; steps: number };
type DraftPerson = ResultPayload['people'][number] & { totalAnalysisSeconds: number; totalStepSeconds: number; analysisDurations: number[] };

function samples(): Sample[] {
  const rows: Sample[] = [];
  for (let age = 0; age < 180; age += 1) {
    PEOPLE.forEach((person, personIndex) => TYPES.forEach((type, typeIndex) => {
      const count = (age + typeIndex * 3 + personIndex) % 11 === 0
        ? 0 : 1 + ((age * 3 + typeIndex * 5 + personIndex) % 4) + person.factor;
      if (!count) return;
      const analysisSeconds = (age + typeIndex * 3 + personIndex) % 17 === 0
        ? 645 + (age % 4) * 38
        : 47 + typeIndex * 67 + ((age * 13 + personIndex * 29 + typeIndex * 17) % 113);
      rows.push({
        age, personId: person.id, type,
        deadline: DEADLINES[(age + typeIndex * 2 + personIndex) % DEADLINES.length],
        count, analysisSeconds,
        stepSeconds: 19 + typeIndex * 9 + ((age * 7 + personIndex * 11) % 25),
        steps: count * (2 + ((age + typeIndex) % 2)),
      });
    }));
  }
  return rows;
}
const ALL_SAMPLES = samples();

function matchesDuration(seconds: number, duration: string) {
  if (duration === 'under2') return seconds < 120;
  if (duration === '2to5') return seconds >= 120 && seconds < 300;
  if (duration === '5to10') return seconds >= 300 && seconds < 600;
  if (duration === 'over10') return seconds >= 600;
  return true;
}

function matchingRows(filters: DemoFilters, from: number, to: number): Sample[] {
  return ALL_SAMPLES.filter(row =>
    row.age >= from && row.age < to
    && (filters.person === 'all' || row.personId === filters.person)
    && (filters.deadline === 'all' || row.deadline === filters.deadline)
    && matchesDuration(row.analysisSeconds, filters.duration));
}

function sumCount(rows: Sample[]) {
  return rows.reduce((total, row) => total + row.count, 0);
}

function buildPeople(rows: Sample[]): ResultPayload['people'] {
  return PEOPLE.filter(person => rows.some(row => row.personId === person.id)).map(person => {
    const aggregate: DraftPerson = {
      id: person.id, name: person.name, completed: 0,
      analysis_samples: 0, mean_analysis_seconds: null, median_analysis_seconds: null,
      step_samples: 0, mean_step_seconds: null, by_type: {},
      totalAnalysisSeconds: 0, totalStepSeconds: 0, analysisDurations: [],
    };
    rows.filter(row => row.personId === person.id).forEach(row => {
      aggregate.completed += row.count;
      aggregate.analysis_samples += row.count;
      aggregate.totalAnalysisSeconds += row.analysisSeconds * row.count;
      aggregate.step_samples += row.steps;
      aggregate.totalStepSeconds += row.stepSeconds * row.steps;
      aggregate.by_type[row.type] = (aggregate.by_type[row.type] || 0) + row.count;
      for (let i = 0; i < row.count; i += 1) aggregate.analysisDurations.push(row.analysisSeconds);
    });
    aggregate.analysisDurations.sort((a, b) => a - b);
    const middle = Math.floor(aggregate.analysisDurations.length / 2);
    aggregate.median_analysis_seconds = aggregate.analysisDurations.length % 2
      ? aggregate.analysisDurations[middle]
      : (aggregate.analysisDurations[middle - 1] + aggregate.analysisDurations[middle]) / 2;
    aggregate.mean_analysis_seconds = Math.round(aggregate.totalAnalysisSeconds / aggregate.analysis_samples);
    aggregate.mean_step_seconds = Math.round(aggregate.totalStepSeconds / aggregate.step_samples);
    const { totalAnalysisSeconds, totalStepSeconds, analysisDurations, ...result } = aggregate;
    return result;
  });
}

function pendingCount(filters: DemoFilters) {
  const byDeadline: Record<string, number> = { overdue: 8, today: 6, future: 15, none: 4 };
  const amount = filters.deadline === 'all'
    ? Object.values(byDeadline).reduce((sum, count) => sum + count, 0)
    : (byDeadline[filters.deadline] || 0);
  return PEOPLE.filter(person => filters.person === 'all' || filters.person === person.id)
    .reduce((sum, person) => sum + amount + (person.factor === 2 ? 3 : 0), 0);
}

export function isDemoTaskResultsHost() {
  return /^(dev\.portilhobackoffice\.site|local\.portilhobackoffice\.site|localhost|127\.0\.0\.1)$/i.test(window.location.hostname);
}

// Mantém os filtros do componente funcionais sem tocar nas APIs, no Supabase ou nos registros reais.
export function createDemoTaskResults(filters: DemoFilters): ResultPayload {
  const days = DAYS[filters.period] || 30;
  const selected = matchingRows(filters, 0, days);
  const people = buildPeople(selected);
  const completed = sumCount(selected);
  const previousCompleted = days === 180 ? 0 : sumCount(matchingRows(filters, days, Math.min(days * 2, 180)));
  const todayCompleted = sumCount(matchingRows(filters, 0, 1));
  const slowest = [...people].filter(person => person.step_samples >= 5)
    .sort((a, b) => (b.mean_step_seconds || 0) - (a.mean_step_seconds || 0))[0] || null;
  return {
    period: filters.period, people,
    summary: {
      completed, today_completed: todayCompleted, pending: pendingCount(filters),
      growth_percent: previousCompleted ? Math.round((completed / previousCompleted - 1) * 1000) / 10 : null,
      previous_completed: previousCompleted, people: people.length,
      measured_analyses: people.reduce((sum, person) => sum + person.analysis_samples, 0),
      measured_transitions: people.reduce((sum, person) => sum + person.step_samples, 0),
      slowest,
    },
    methodology: 'Indicadores simulados para demonstração. Não correspondem a atividades efetivamente realizadas.',
    generated_at: new Date().toISOString(), truncated: false,
  };
}
