import { useMemo, useState, type ReactNode } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { priorityLevel, taskTypeLabel, workItemKey, type WorkItem } from './model';
import './taskCalendar.css';

export type CalendarMode = 'weekly' | 'monthly';

const WEEKDAYS = ['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'];
const PRIORITY_LABEL = { high: 'Alta', medium: 'Média', low: 'Baixa' } as const;
const WEEK_LIMIT = 12;
const MONTH_LIMIT = 4;
const LANE_LIMIT = 60;

export const dayKey = (date: Date) => [
  date.getFullYear(), String(date.getMonth() + 1).padStart(2, '0'), String(date.getDate()).padStart(2, '0'),
].join('-');

// Prazo do processo; na falta dele, o da tarefa (mesmo contrato do quadro de Atribuições).
export function itemDeadline(item: WorkItem): string | null {
  const raw = item.process.deadline_at || item.task.deadline_at;
  if (!raw) return null;
  const text = String(raw);
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(text);
  if (dateOnly) return text;
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? null : dayKey(date);
}

const parseKey = (key: string) => {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (date: Date, days: number) => { const next = new Date(date); next.setDate(next.getDate() + days); return next; };
const weekStart = (date: Date) => addDays(new Date(date.getFullYear(), date.getMonth(), date.getDate()), -((date.getDay() + 6) % 7));

export function calendarRange(mode: CalendarMode, anchor: Date) {
  if (mode === 'weekly') {
    const start = weekStart(anchor);
    return { start, end: addDays(start, 6), label: `${start.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })} – ${addDays(start, 4).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' })}` };
  }
  const start = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const end = new Date(anchor.getFullYear(), anchor.getMonth() + 1, 0);
  const label = start.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
  return { start, end, label: label.charAt(0).toUpperCase() + label.slice(1) };
}

export function shiftAnchor(mode: CalendarMode, anchor: Date, direction: -1 | 1) {
  return mode === 'weekly'
    ? addDays(anchor, 7 * direction)
    : new Date(anchor.getFullYear(), anchor.getMonth() + direction, 1);
}

function ItemButton({ item, selected, compact, onOpen }: { item: WorkItem; selected: boolean; compact?: boolean; onOpen: (item: WorkItem) => void }) {
  const priority = priorityLevel(item);
  const number = item.process.case_number || 'Processo sem número';
  const type = taskTypeLabel(item.task.type);
  return <button type="button" data-item-key={workItemKey(item)}
    className={`tcal-item ${priority} ${selected ? 'selected' : ''} ${compact ? 'compact' : ''}`}
    aria-label={`Abrir ${number}, ${type}, prioridade ${PRIORITY_LABEL[priority]}`}
    title={`${number} · ${type} · ${PRIORITY_LABEL[priority]}`}
    onClick={() => onOpen(item)}>
    <span className="tcal-item-main"><strong>{number}</strong>{compact ? null : <small>{type}</small>}</span>
    {compact ? null : <><span className="tcal-priority">{PRIORITY_LABEL[priority]}</span><ChevronRight className="tcal-item-arrow" size={14}/></>}
  </button>;
}

function DayItems({ id, items, limit, activeKey, compact, expanded, onToggle, onOpen }: {
  id: string; items: WorkItem[]; limit: number; activeKey: string | null; compact?: boolean;
  expanded: boolean; onToggle: (id: string) => void; onOpen: (item: WorkItem) => void;
}) {
  const shown = expanded ? items : items.slice(0, limit);
  return <>
    {shown.map(item => <ItemButton key={workItemKey(item)} item={item} compact={compact} selected={workItemKey(item) === activeKey} onOpen={onOpen} />)}
    {items.length > limit
      ? <button type="button" className="tcal-more" aria-expanded={expanded} onClick={() => onToggle(id)}>{expanded ? 'Mostrar menos' : `+${items.length - limit} mais`}</button>
      : null}
  </>;
}

export function TaskCalendar({ items, mode, anchor, activeKey, onModeChange, onAnchorChange, onOpen, actions }: {
  actions?: ReactNode; items: WorkItem[]; mode: CalendarMode; anchor: Date; activeKey: string | null;
  onModeChange: (mode: CalendarMode) => void; onAnchorChange: (anchor: Date) => void; onOpen: (item: WorkItem) => void;
}) {
  const [deadlineScope, setDeadlineScope] = useState<'dated' | 'undated' | 'weekend'>('dated');
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());
  const toggle = (id: string) => setExpanded(current => { const next = new Set(current); if (next.has(id)) next.delete(id); else next.add(id); return next; });
  const range = useMemo(() => calendarRange(mode, anchor), [mode, anchor]);
  const startKey = dayKey(range.start);
  const endKey = dayKey(range.end);
  const todayKey = dayKey(new Date());

  const buckets = useMemo(() => {
    const byDay = new Map<string, WorkItem[]>();
    const before: WorkItem[] = [];
    const undated: WorkItem[] = [];
    const weekend: WorkItem[] = [];
    let after = 0;
    for (const item of items) {
      const key = itemDeadline(item);
      if (!key) undated.push(item);
      else if (key < startKey) before.push(item);
      else if (key > endKey) after += 1;
      else if (mode === 'weekly' && [0, 6].includes(parseKey(key).getDay())) weekend.push(item);
      else { const list = byDay.get(key); if (list) list.push(item); else byDay.set(key, [item]); }
    }
    return { byDay, before, undated, weekend, after };
  }, [items, startKey, endKey, mode]);

  const days = useMemo(() => {
    if (mode === 'weekly') return Array.from({ length: 5 }, (_, index) => addDays(range.start, index));
    const first = weekStart(range.start);
    const total = Math.ceil((((range.end.getTime() - first.getTime()) / 86400000) + 1) / 7) * 7;
    return Array.from({ length: total }, (_, index) => addDays(first, index));
  }, [mode, range]);

  const limit = mode === 'weekly' ? WEEK_LIMIT : MONTH_LIMIT;

  return <section className={`tcal tcal-${mode}`} aria-label="Distribuição das tarefas">
    <header className="tcal-toolbar">
      <div className="tcal-modes" role="group" aria-label="Modo de visualização">
        <button type="button" aria-pressed={mode === 'weekly'} className={mode === 'weekly' ? 'active' : ''} onClick={() => { setDeadlineScope('dated'); onModeChange('weekly'); }}>Weekly</button>
        <button type="button" aria-pressed={mode === 'monthly'} className={mode === 'monthly' ? 'active' : ''} onClick={() => { setDeadlineScope('dated'); onModeChange('monthly'); }}>Monthly</button>
      </div>
      <select className="tcal-deadline-filter" aria-label="Prazo" value={deadlineScope} onChange={event => setDeadlineScope(event.target.value === 'undated' ? 'undated' : event.target.value === 'weekend' ? 'weekend' : 'dated')}>
        <option value="dated">Com prazo</option>
        <option value="undated">Sem prazo ({buckets.undated.length})</option>
        {mode === 'weekly' ? <option value="weekend">Fim de semana ({buckets.weekend.length})</option> : null}
      </select>
      {deadlineScope !== 'undated' ? <div className="tcal-nav">
        <button type="button" aria-label={mode === 'weekly' ? 'Semana anterior' : 'Mês anterior'} onClick={() => onAnchorChange(shiftAnchor(mode, anchor, -1))}><ChevronLeft size={15} /></button>
        <strong aria-live="polite">{range.label}</strong>
        <button type="button" aria-label={mode === 'weekly' ? 'Próxima semana' : 'Próximo mês'} onClick={() => onAnchorChange(shiftAnchor(mode, anchor, 1))}><ChevronRight size={15} /></button>
        <button type="button" className="tcal-today" onClick={() => onAnchorChange(new Date())}>Hoje</button>
      </div> : <div className="tcal-nav-spacer" />}
      {actions}
    </header>

    <div className="tcal-scroll">
      {deadlineScope === 'weekend' ? <section className="tcal-undated-view" aria-label="Tarefas de sábado e domingo">
        {buckets.weekend.length ? <div className="tcal-undated-items tcal-weekend-items"><DayItems id="weekend" items={buckets.weekend} limit={LANE_LIMIT} activeKey={activeKey} expanded={expanded.has('weekend')} onToggle={toggle} onOpen={onOpen} /></div> : <span className="tcal-undated-empty">Nenhuma tarefa no fim de semana.</span>}
      </section> : deadlineScope === 'undated' ? <section className="tcal-undated-view" aria-label="Tarefas sem prazo">
        {buckets.undated.length ? <div className="tcal-undated-items"><DayItems id="undated" items={buckets.undated} limit={LANE_LIMIT} activeKey={activeKey} expanded={expanded.has('undated')} onToggle={toggle} onOpen={onOpen} /></div> : <span className="tcal-undated-empty">Nenhuma tarefa sem prazo.</span>}
      </section> : <>{mode === 'weekly' ? <div className="tcal-kanban-scroll">
        <div className="tcal-kanban" aria-label={range.label}>
          {days.map((date, index) => {
            const key = dayKey(date);
            const rows = buckets.byDay.get(key) || [];
            const today = key === todayKey;
            return <section key={key} className={`tcal-kanban-column ${today ? 'today' : ''}`} aria-label={date.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' })}>
              <header className="tcal-kanban-heading">
                <div><strong>{WEEKDAYS[index]}</strong><span className="tcal-kanban-date">{date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' })}</span>{today ? <span className="tcal-today-label">Hoje</span> : null}</div>
                <span className="tcal-kanban-count" aria-label={`${rows.length} pendências`}>{rows.length}</span>
              </header>
              <div className="tcal-kanban-items">
                {rows.length ? <DayItems id={key} items={rows} limit={limit} activeKey={activeKey} expanded={expanded.has(key)} onToggle={toggle} onOpen={onOpen}/> : null}
              </div>
            </section>;
          })}
        </div>
      </div> : <div className="tcal-grid" role="grid" aria-label={range.label}>
        {WEEKDAYS.map(name => <div key={name} className="tcal-weekday" role="columnheader">{name}</div>)}
        {days.map(date => {
          const key = dayKey(date);
          const outside = key < startKey || key > endKey;
          const dayItems = outside ? [] : buckets.byDay.get(key) || [];
          return <div key={key} role="gridcell" className={`tcal-day ${key === todayKey ? 'today' : ''} ${outside ? 'outside' : ''}`}>
            <div className="tcal-day-head"><span>{date.getDate()}{date.getDate() === 1 ? ` ${date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '')}` : ''}</span>{dayItems.length ? <em>{dayItems.length}</em> : null}</div>
            <div className="tcal-day-items"><DayItems id={key} items={dayItems} limit={limit} compact activeKey={activeKey} expanded={expanded.has(key)} onToggle={toggle} onOpen={onOpen}/></div>
          </div>;
        })}
      </div>}

      {buckets.before.length ? <section className="tcal-lane overdue" aria-label="Anteriores ao período">
        <h3>Anteriores <em>{buckets.before.length}</em></h3>
        <div><DayItems id="before" items={buckets.before} limit={LANE_LIMIT} activeKey={activeKey} expanded={expanded.has('before')} onToggle={toggle} onOpen={onOpen} /></div>
      </section> : null}
      </>}
    </div>
  </section>;
}
