import { useEffect, useState } from 'react';
import { formatIsoTimeInSaoPaulo, isoToLocalDate } from '../features/availability/time';
import { studyPlanForDate, type StudyPlan, type StudyPlanResource } from '../lib/studyPlan';

const OPEN_LABEL: Record<StudyPlanResource, string> = {
  questoes: 'Abrir questões', erros: 'Abrir caderno de erros', obras: 'Abrir obras', redacao: 'Abrir redação',
  discursivas: 'Abrir discursivas', flashcards: 'Abrir flashcards', resumos: 'Abrir resumos', fila: 'Abrir fila',
};

const hhmm = (time: string) => time.replace(':', 'h');
const shortDate = (date: string) => `${date.slice(8, 10)}/${date.slice(5, 7)}`;
const inDays = (days: number) => days === 0 ? 'hoje' : days === 1 ? 'amanhã' : `em ${days} dias`;

export function StudyPlanToday({ plan, open }: { plan: StudyPlan; open: (resource: string, path?: string) => void }) {
  const [now, setNow] = useState(() => new Date().toISOString());
  useEffect(() => { const timer = setInterval(() => setNow(new Date().toISOString()), 60_000); return () => clearInterval(timer); }, []);
  const today = studyPlanForDate(plan, isoToLocalDate(now), formatIsoTimeInSaoPaulo(now));
  const { day, phase } = today;
  const nextExam = today.upcomingExams[0];

  return <section className="ni-panel p-5 space-y-4" aria-labelledby="cronograma-hoje">
    <div className="space-y-1">
      <p className="text-xs font-semibold uppercase tracking-wide text-[var(--dim)]">
        {phase ? phase.label : 'Cronograma'}{nextExam && <> · {phase?.label.includes(nextExam.label) ? 'prova' : nextExam.label} {inDays(nextExam.days)}</>}
      </p>
      <h2 id="cronograma-hoje" className="font-display text-2xl">{day ? day.title : `Hoje, ${shortDate(today.localDate)}`}</h2>
      {phase && <p className="text-sm text-[var(--dim)]">{phase.focus}</p>}
    </div>

    {!day && <p className="text-sm">O cronograma não tem atividades marcadas para hoje.</p>}
    {day?.morning && <p className="text-sm"><b>Manhã:</b> {day.morning}</p>}

    {day && day.blocks.length > 0 && <ol className="space-y-2">{day.blocks.map((block, index) => {
      const current = index === today.currentBlockIndex;
      return <li key={`${block.start}-${block.label}`} aria-current={current ? 'step' : undefined}
        className={`rounded-lg border p-3 sm:flex sm:items-start sm:gap-4 ${current ? 'border-[var(--action-primary)] border-2' : 'border-[var(--line)]'}`}>
        <p className="shrink-0 text-sm font-semibold tabular-nums sm:w-28">{hhmm(block.start)}–{hhmm(block.end)}{current && <span className="block text-xs font-normal text-[var(--dim)]">agora / próximo</span>}</p>
        <div className="min-w-0 flex-1 space-y-1">
          <h3 className="font-semibold">{block.label}{block.questions && <span className="font-normal text-[var(--dim)]"> · {block.questions} questões</span>}</h3>
          <p className="text-sm">{block.activity}</p>
          {block.tip && <p className="text-xs text-[var(--dim)]"><b>Dica:</b> {block.tip}</p>}
        </div>
        {block.resource && <button type="button" onClick={() => open(block.resource!, block.path)}
          className="mt-2 min-h-11 shrink-0 rounded-lg bg-[var(--action-primary)] px-3 py-2 text-sm text-[var(--text-inverse)] sm:mt-0">{OPEN_LABEL[block.resource]}</button>}
      </li>;
    })}</ol>}

    {day?.notes && <ul className="list-disc space-y-1 pl-5 text-sm">{day.notes.map((note) => <li key={note}>{note}</li>)}</ul>}

    {day?.kind === 'eve' && plan.eveChecklist.length > 0 && <div className="space-y-1">
      <h3 className="font-semibold">Checklist da véspera</h3>
      <ul className="list-disc space-y-1 pl-5 text-sm">{plan.eveChecklist.map((item) => <li key={item}>{item}</li>)}</ul>
    </div>}

    {(today.upcomingExams.length > 0 || today.deadlines.length > 0) && <div className="grid gap-3 border-t border-[var(--line)] pt-3 sm:grid-cols-2">
      {today.upcomingExams.length > 0 && <div><h3 className="text-sm font-semibold">Próximas provas</h3>
        <ul className="mt-1 space-y-1 text-sm">{today.upcomingExams.map((exam) => <li key={exam.label}>
          <b className="tabular-nums">{shortDate(exam.date)}{exam.endDate && exam.endDate !== exam.date ? ` e ${shortDate(exam.endDate)}` : ''}</b> · {exam.label} <span className="text-[var(--dim)]">({inDays(exam.days)}{exam.time ? ` · ${exam.time}` : ''})</span>
        </li>)}</ul></div>}
      {today.deadlines.length > 0 && <div><h3 className="text-sm font-semibold">Prazos</h3>
        <ul className="mt-1 space-y-1 text-sm">{today.deadlines.map((item) => <li key={item.label}>
          <b className="tabular-nums">{shortDate(item.date)}</b> · {item.label} <span className="text-[var(--dim)]">({inDays(item.days)})</span>
        </li>)}</ul></div>}
    </div>}

    {plan.rules.length > 0 && <details className="border-t border-[var(--line)] pt-2">
      <summary className="min-h-11 cursor-pointer py-2 text-sm font-semibold">Regras do cronograma</summary>
      <ul className="list-disc space-y-1 pl-5 text-sm">{plan.rules.map((rule) => <li key={rule}>{rule}</li>)}</ul>
    </details>}
  </section>;
}
