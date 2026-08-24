import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, Save } from 'lucide-react';
import { useDailyStudyAvailability } from './useDailyStudyAvailability';
import {
  SAO_PAULO_TIME_ZONE,
  type ScheduleEntry,
  type ScheduleException,
  type Weekday,
  type WeeklySchedule,
} from './types';

const WEEKDAYS: Array<{ key: Weekday; label: string }> = [
  { key: 'monday', label: 'Segunda-feira' },
  { key: 'tuesday', label: 'Terça-feira' },
  { key: 'wednesday', label: 'Quarta-feira' },
  { key: 'thursday', label: 'Quinta-feira' },
  { key: 'friday', label: 'Sexta-feira' },
  { key: 'saturday', label: 'Sábado' },
  { key: 'sunday', label: 'Domingo' },
];

type ExceptionForm = {
  localDate: string;
  reason: ScheduleException['reason'];
  operation: ScheduleException['operation'];
  start: string;
  end: string;
  departureTime: string;
};

function todayInSaoPaulo(): string {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: SAO_PAULO_TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(new Date());
  const value = Object.fromEntries(parts.map(({ type, value: part }) => [type, part]));
  return `${value.year}-${value.month}-${value.day}`;
}

function newExceptionForm(localDate: string, exception?: ScheduleException): ExceptionForm {
  return {
    localDate,
    reason: exception?.reason ?? 'appointment',
    operation: exception?.operation ?? 'busy_interval',
    start: exception?.intervals?.[0]?.start ?? '14:40',
    end: exception?.intervals?.[0]?.end ?? '15:30',
    departureTime: exception?.departureTime ?? '18:30',
  };
}

function formatInterval(iso: string): string {
  return iso.slice(11, 16);
}

export default function AgendaView() {
  const [localDate, setLocalDate] = useState(todayInSaoPaulo);
  const { availability, schedule, exception, loading, syncError, saveSchedule, saveException, deleteException } = useDailyStudyAvailability(localDate);
  const [draftSchedule, setDraftSchedule] = useState<WeeklySchedule>();
  const [editedEntryIds, setEditedEntryIds] = useState<Set<string>>(new Set());
  const [exceptionForm, setExceptionForm] = useState<ExceptionForm>(() => newExceptionForm(localDate));

  useEffect(() => {
    setDraftSchedule(schedule);
    setEditedEntryIds(new Set());
  }, [schedule]);

  useEffect(() => {
    setExceptionForm(newExceptionForm(localDate, exception));
  }, [exception, localDate]);

  const updateStudyWindow = (day: Weekday, entryId: string, field: 'start' | 'end', value: string) => {
    setDraftSchedule((current) => current && {
      ...current,
      days: {
        ...current.days,
        [day]: current.days[day].map((entry) => entry.id === entryId ? { ...entry, [field]: value } : entry),
      },
    });
    setEditedEntryIds((current) => new Set(current).add(entryId));
  };

  const saveWeeklySchedule = async () => {
    if (!draftSchedule) return;
    const confirmedSchedule: WeeklySchedule = {
      ...draftSchedule,
      days: Object.fromEntries(WEEKDAYS.map(({ key }) => [
        key,
        draftSchedule.days[key].map((entry) => editedEntryIds.has(entry.id) ? withoutEstimate(entry) : entry),
      ])) as WeeklySchedule['days'],
      updatedAt: new Date().toISOString(),
    };
    await saveSchedule(confirmedSchedule);
    setDraftSchedule(confirmedSchedule);
    setEditedEntryIds(new Set());
  };

  const saveDateException = async () => {
    const nextException: ScheduleException = {
      localDate: exceptionForm.localDate,
      timeZone: SAO_PAULO_TIME_ZONE,
      reason: exceptionForm.reason,
      operation: exceptionForm.operation,
      ...(exceptionForm.operation === 'early_departure' ? { departureTime: exceptionForm.departureTime } : {}),
      ...(exceptionForm.operation === 'busy_interval' || exceptionForm.operation === 'replacement_windows'
        ? { intervals: [{ start: exceptionForm.start, end: exceptionForm.end }] }
        : {}),
      updatedAt: new Date().toISOString(),
    };
    await saveException(nextException);
  };

  const updateException = <Field extends keyof ExceptionForm>(field: Field, value: ExceptionForm[Field]) => {
    setExceptionForm((current) => ({ ...current, [field]: value }));
    if (field === 'localDate') setLocalDate(value as string);
  };

  if (loading) return <p role="status">Carregando agenda…</p>;

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <CalendarDays className="w-7 h-7 mr-3 text-indigo-500" />
          Agenda
        </h1>
        <p className="text-zinc-600 dark:text-zinc-400">Defina quando você pode estudar; a agenda calcula os blocos disponíveis.</p>
      </header>

      <section aria-labelledby="semana-recorrente" className="space-y-3">
        <div>
          <h2 id="semana-recorrente" className="text-xl font-semibold">Semana recorrente</h2>
          <p className="text-sm text-zinc-500">Compromissos são apenas um resumo; edite as janelas de estudo.</p>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {WEEKDAYS.map(({ key, label }) => (
            <WeekdayCard
              key={key}
              label={label}
              entries={draftSchedule?.days[key] ?? []}
              onChange={(entryId, field, value) => updateStudyWindow(key, entryId, field, value)}
            />
          ))}
        </div>
        <button type="button" onClick={() => void saveWeeklySchedule()} disabled={!draftSchedule} className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium disabled:opacity-50">
          <Save className="w-4 h-4 mr-2" /> Salvar semana
        </button>
      </section>

      <section aria-labelledby="excecao-data" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
        <div>
          <h2 id="excecao-data" className="text-xl font-semibold">Exceção por data</h2>
          <p className="text-sm text-zinc-500">Aplica-se somente ao dia escolhido e não altera a semana recorrente.</p>
        </div>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Data da exceção"><input aria-label="Data da exceção" type="date" value={exceptionForm.localDate} onChange={(event) => updateException('localDate', event.target.value)} className="field" /></Field>
          <Field label="Motivo">
            <select aria-label="Motivo" value={exceptionForm.reason} onChange={(event) => updateException('reason', event.target.value as ScheduleException['reason'])} className="field">
              <option value="appointment">Compromisso</option><option value="holiday">Feriado</option><option value="absence">Ausência</option><option value="simulation_exam">Simulado</option><option value="exceptional_schedule">Horário excepcional</option><option value="day_without_classes">Dia sem aulas</option><option value="early_departure">Saída antecipada</option>
            </select>
          </Field>
          <Field label="Operação">
            <select aria-label="Operação" value={exceptionForm.operation} onChange={(event) => updateException('operation', event.target.value as ScheduleException['operation'])} className="field">
              <option value="busy_interval">Bloquear intervalo</option><option value="replacement_windows">Substituir janelas</option><option value="day_unavailable">Indisponibilizar o dia</option><option value="early_departure">Saída antecipada</option>
            </select>
          </Field>
          {exceptionForm.operation === 'early_departure' && <Field label="Horário de saída"><input aria-label="Horário de saída" type="time" value={exceptionForm.departureTime} onChange={(event) => updateException('departureTime', event.target.value)} className="field" /></Field>}
          {(exceptionForm.operation === 'busy_interval' || exceptionForm.operation === 'replacement_windows') && <>
            <Field label="Início do intervalo"><input aria-label="Início do intervalo" type="time" value={exceptionForm.start} onChange={(event) => updateException('start', event.target.value)} className="field" /></Field>
            <Field label="Fim do intervalo"><input aria-label="Fim do intervalo" type="time" value={exceptionForm.end} onChange={(event) => updateException('end', event.target.value)} className="field" /></Field>
          </>}
        </div>
        <div className="flex gap-3">
          <button type="button" onClick={() => void saveDateException()} className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium">Salvar exceção</button>
          {exception && <button type="button" onClick={() => void deleteException()} className="px-4 py-2 rounded-lg border border-zinc-300 dark:border-zinc-700 text-sm font-medium">Remover exceção</button>}
        </div>
      </section>

      <section aria-labelledby="disponibilidade-efetiva" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div><h2 id="disponibilidade-efetiva" className="text-xl font-semibold">Disponibilidade efetiva</h2><p className="text-sm text-zinc-500">Para {localDate}</p></div>
          <strong className="text-indigo-600 dark:text-indigo-400">{availability?.totalMinutes ?? 0} min</strong>
        </div>
        <p role="status" className="text-sm text-zinc-600 dark:text-zinc-400">Calendar: {availability?.status === 'degraded' ? 'disponibilidade degradada' : availability?.status === 'ready' ? 'agenda aplicada' : 'sem blocos disponíveis'}</p>
        {syncError && <p role="alert" className="text-sm text-amber-700">{syncError}</p>}
        {availability?.warnings.map((warning) => <p key={warning.code} role="status" className="text-sm text-amber-700 dark:text-amber-300">{warning.message}</p>)}
        <ul aria-label="Blocos disponíveis" className="flex flex-wrap gap-2">
          {availability?.intervals.map((interval) => <li key={interval.start} className="inline-flex items-center rounded-lg bg-zinc-100 dark:bg-zinc-800 px-3 py-2 text-sm font-medium"><Clock3 className="w-4 h-4 mr-2" />{formatInterval(interval.start)}–{formatInterval(interval.end)}</li>)}
        </ul>
      </section>
    </div>
  );
}

function withoutEstimate(entry: ScheduleEntry): ScheduleEntry {
  const { isEstimate: _, ...confirmedEntry } = entry;
  return confirmedEntry;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}<span className="mt-1 block">{children}</span></label>;
}

function WeekdayCard({ label, entries, onChange }: { label: string; entries: ScheduleEntry[]; onChange: (entryId: string, field: 'start' | 'end', value: string) => void }) {
  const studyEntries = entries.filter((entry) => entry.kind === 'study_window');
  const protectedEntries = entries.filter((entry) => entry.kind !== 'study_window');
  return <article className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 space-y-3"><h3 className="font-semibold">{label}</h3><ul className="text-sm text-zinc-500 space-y-1">{protectedEntries.map((entry) => <li key={entry.id}>{entry.label}: {entry.start}–{entry.end}{entry.isEstimate && <span className="ml-2 text-amber-700 dark:text-amber-300">Estimativa editável</span>}</li>)}</ul>{studyEntries.map((entry) => <div key={entry.id} className="grid grid-cols-2 gap-2"><Field label={`Início de ${label.toLowerCase()}`}><input aria-label={`Início de ${label.toLowerCase()}`} type="time" value={entry.start} onChange={(event) => onChange(entry.id, 'start', event.target.value)} className="field" /></Field><Field label={`Fim de ${label.toLowerCase()}`}><input aria-label={`Fim de ${label.toLowerCase()}`} type="time" value={entry.end} onChange={(event) => onChange(entry.id, 'end', event.target.value)} className="field" /></Field>{entry.isEstimate && <p className="col-span-2 text-xs text-amber-700 dark:text-amber-300">Estimativa editável</p>}</div>)}</article>;
}
