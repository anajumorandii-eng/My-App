import { useState } from 'react';
import { CalendarDays, ChevronLeft, ChevronRight, Clock3, Flag, Leaf, ListChecks, NotebookPen } from 'lucide-react';
import { studyPlanForDate, type StudyPlan } from '../../lib/studyPlan';
import { localDateTimeToDate } from './time';
import type { ScheduleException, Weekday, WeeklySchedule } from './types';

const WEEKDAYS: Weekday[] = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
const dateValue = (date: string) => new Date(`${date}T12:00:00Z`);
const dateLabel = (date: string, options: Intl.DateTimeFormatOptions) => dateValue(date).toLocaleDateString('pt-BR', { ...options, timeZone: 'UTC' });
function addDays(date: string, count: number) {
  const value = dateValue(date); value.setUTCDate(value.getUTCDate() + count);
  return value.toISOString().slice(0, 10);
}

type Props = {
  localDate: string;
  today: string;
  onDateChange: (date: string) => void;
  plan: StudyPlan | null;
  planLoading: boolean;
  planError: string | null;
  schedule?: WeeklySchedule;
  exception?: ScheduleException;
};

/** O planner apresenta o cronograma salvo; disponibilidade e edição continuam nos seus próprios fluxos. */
export function AgendaPlanner({ localDate, today, onDateChange, plan, planLoading, planError, schedule, exception }: Props) {
  const [view, setView] = useState<'day' | 'week'>('day');
  const selected = plan ? studyPlanForDate(plan, localDate) : undefined;
  const day = selected?.day;
  const weekday = dateValue(localDate).getUTCDay();
  const weekStart = addDays(localDate, -(weekday === 0 ? 6 : weekday - 1));
  const week = Array.from({ length: 7 }, (_, index) => addDays(weekStart, index));
  const recurring = schedule?.days[WEEKDAYS[weekday]] ?? [];
  const priorities = day?.blocks.filter((block) => block.resource && !/^aula\b/i.test(block.label)).slice(0, 3) ?? [];

  return <div className="agenda-planner">
    <div className="agenda-toolbar">
      <div className="agenda-switch" aria-label="Visão da agenda">
        <button type="button" aria-pressed={view === 'day'} onClick={() => setView('day')}>Dia</button>
        <button type="button" aria-pressed={view === 'week'} onClick={() => setView('week')}>Semana</button>
      </div>
      <div className="agenda-date-controls">
        <button type="button" aria-label={view === 'day' ? 'Dia anterior' : 'Semana anterior'} onClick={() => onDateChange(addDays(localDate, view === 'day' ? -1 : -7))}><ChevronLeft size={18} /></button>
        <input type="date" aria-label="Dia da agenda" value={localDate} onChange={(event) => { try { localDateTimeToDate(event.target.value, '12:00'); } catch { return; } onDateChange(event.target.value); }} />
        <button type="button" aria-label={view === 'day' ? 'Próximo dia' : 'Próxima semana'} onClick={() => onDateChange(addDays(localDate, view === 'day' ? 1 : 7))}><ChevronRight size={18} /></button>
        <button type="button" onClick={() => onDateChange(today)}>Hoje</button>
      </div>
    </div>
    {planError && <p role="alert" className="agenda-notice">{planError} A rotina recorrente continua disponível.</p>}
    {planLoading && <p role="status">Carregando seu cronograma…</p>}
    <div className="agenda-planner-grid">
      <div className="agenda-main-column">
        {view === 'day' ? <section className="agenda-paper" aria-labelledby="agenda-rotina">
          <div className="agenda-panel-heading"><Clock3 size={20} /><h2 id="agenda-rotina">Minha rotina</h2><span>{dateLabel(localDate, { month: 'long', year: 'numeric' })}</span></div>
          <div className="agenda-day-heading">
            <div className="agenda-date-stamp"><strong>{localDate.slice(8)}</strong><span>{dateLabel(localDate, { weekday: 'long' })}</span></div>
            <div><h3>{day?.title ?? 'Rotina recorrente'}</h3><p>{selected?.phase?.label ?? 'Seu planejamento para este dia'}</p></div>
          </div>
          {day?.morning && <p className="agenda-morning">{day.morning}</p>}
          {exception && <p className="agenda-notice">Há uma exceção para este dia.{exception.notes ? ` ${exception.notes}` : ' Confira o ajuste e as janelas disponíveis abaixo.'}</p>}
          <div className="agenda-table-head" aria-hidden="true"><span>Horário</span><span>Atividade e foco</span></div>
          {day ? <>
            <ol className="agenda-routine">{day.blocks.map((block, index) => <li key={`${block.start}-${index}`}>
              <div className="agenda-time"><time>{block.start}</time><span>{block.end}</span></div>
              <div className="agenda-activity"><h4>{block.label}</h4><p>{block.activity}</p>{block.questions && <small>{block.questions} questões</small>}{block.tip && <p className="agenda-tip">{block.tip}</p>}
                {block.resource && <a href={block.path ?? `/${block.resource === 'discursivas' ? 'treino-2a-fase' : block.resource}`} className="agenda-open" aria-label={`Abrir ${block.label}`}>Abrir atividade</a>}
              </div>
            </li>)}</ol>
            {day.blocks.length === 0 && <p className="agenda-empty">{day.kind === 'exam' ? 'Dia de prova. Confira os horários e preserve o descanso.' : day.kind === 'eve' ? 'Revisão leve e checklist. Preserve o sono e evite conteúdo novo.' : 'Nenhuma atividade com horário fixado neste dia.'}</p>}
          </> : <>
            <ol className="agenda-routine">{recurring.map((entry) => <li key={entry.id}>
              <div className="agenda-time"><time>{entry.start}</time><span>{entry.end}</span></div>
              <div className="agenda-activity"><h4>{entry.label}</h4>{entry.isEstimate && <p>Horário estimado; confirme na edição da semana.</p>}</div>
            </li>)}</ol>
            {recurring.length === 0 && <p className="agenda-empty">Sem rotina para este dia. Adicione suas janelas na semana recorrente abaixo.</p>}
          </>}
          <p className="agenda-footnote">Rotina planejada. Os blocos livres abaixo consideram os compromissos e as exceções do dia.</p>
        </section> : <section aria-labelledby="agenda-semana">
          <div className="agenda-week-intro"><div><h2 id="agenda-semana">Minha semana</h2><p>{dateLabel(week[0], { day: 'numeric', month: 'long' })} a {dateLabel(week[6], { day: 'numeric', month: 'long' })}</p></div><CalendarDays aria-hidden="true" /></div>
          <div className="agenda-week-grid">{week.map((date) => {
            const planned = plan?.days[date];
            const entries = schedule?.days[WEEKDAYS[dateValue(date).getUTCDay()]] ?? [];
            const items = planned ? planned.blocks.map((block) => ({ time: block.start, label: block.label })) : entries.map((entry) => ({ time: entry.start, label: entry.label }));
            return <article key={date} className={`agenda-week-card${date === localDate ? ' is-selected' : ''}${planned?.kind === 'exam' ? ' is-exam' : ''}`}>
              <button type="button" onClick={() => { onDateChange(date); setView('day'); }} aria-label={`Ver ${dateLabel(date, { weekday: 'long', day: 'numeric', month: 'long' })}`} aria-current={date === localDate ? 'date' : undefined}><span>{dateLabel(date, { weekday: 'long' })}</span><strong>{date.slice(8)}</strong></button>
              {planned && <h3>{planned.title}</h3>}
              <ul>{items.slice(0, 4).map((item, index) => <li key={index}><time>{item.time}</time><span>{item.label}</span></li>)}</ul>
              {items.length > 4 && <p className="agenda-week-more">Mais {items.length - 4} atividades ao abrir o dia</p>}
              {items.length === 0 && <p className="agenda-week-more">{planned?.kind === 'exam' ? 'Prova e descanso.' : planned?.morning ?? 'Sem horários fixados.'}</p>}
            </article>;
          })}</div>
          <p className="agenda-footnote">A semana mostra o planejamento. Exceções e compromissos do Calendar são consultados ao abrir cada dia.</p>
        </section>}
        {day?.notes && day.notes.length > 0 && <section className="agenda-paper" aria-labelledby="agenda-lembretes"><div className="agenda-panel-heading is-sand"><NotebookPen size={20} /><h2 id="agenda-lembretes">Notas e lembretes</h2></div><ul className="agenda-notes">{day.notes.map((note) => <li key={note}>{note}</li>)}</ul></section>}
      </div>
      <aside className="agenda-side-column">
        <section className="agenda-paper" aria-labelledby="agenda-prioridades"><div className="agenda-panel-heading is-sage"><Flag size={20} /><h2 id="agenda-prioridades">Prioridades do dia</h2></div>
          {priorities.length ? <ol className="agenda-priorities">{priorities.map((block, index) => <li key={`${block.start}-${index}`}><span>{index + 1}</span><p>{block.label}<small>{block.start}–{block.end}</small></p></li>)}</ol> : <p className="agenda-empty">{day?.kind === 'exam' ? 'Chegar com antecedência e preservar o descanso.' : 'Confira as sugestões em “O que cabe neste dia”.'}</p>}
        </section>
        <section className="agenda-paper" aria-labelledby="agenda-provas"><div className="agenda-panel-heading is-wine"><CalendarDays size={20} /><h2 id="agenda-provas">No horizonte</h2></div>
          {selected?.upcomingExams.length ? <ul className="agenda-exams">{selected.upcomingExams.map((exam) => <li key={`${exam.date}-${exam.label}`}><div className="agenda-exam-date"><strong>{exam.date.slice(8)}</strong><small>{dateLabel(exam.date, { month: 'short' })}</small></div><div><h3>{exam.label}</h3><p>{exam.endDate && `${dateLabel(exam.date, { day: 'numeric', month: 'short' })} a ${dateLabel(exam.endDate, { day: 'numeric', month: 'short' })} · `}{exam.time ?? 'Confira o horário na convocação.'}</p></div></li>)}</ul> : <p className="agenda-empty">As próximas provas aparecem aqui quando houver um cronograma na sua conta.</p>}
          {!!selected?.deadlines.length && <div className="agenda-deadlines"><h3>Não esquecer</h3><ul>{selected.deadlines.map((deadline) => <li key={`${deadline.date}-${deadline.label}`}>{deadline.label} · {deadline.date.slice(8)}/{deadline.date.slice(5, 7)}</li>)}</ul></div>}
        </section>
        {!!plan?.rules.length && <section className="agenda-paper" aria-labelledby="agenda-ritmo"><div className="agenda-panel-heading is-rose"><Leaf size={20} /><h2 id="agenda-ritmo">Cuidar do ritmo</h2></div><ul className="agenda-notes">{plan.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul></section>}
        {day?.kind === 'eve' && !!plan?.eveChecklist.length && <section className="agenda-paper" aria-labelledby="agenda-checklist"><div className="agenda-panel-heading is-sage"><ListChecks size={20} /><h2 id="agenda-checklist">Checklist da véspera</h2></div><ul className="agenda-notes">{plan.eveChecklist.map((item) => <li key={item}>{item}</li>)}</ul></section>}
      </aside>
    </div>
  </div>;
}
