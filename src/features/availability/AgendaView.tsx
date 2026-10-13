import AdaptiveStudyDay from '../../components/AdaptiveStudyDay';
import { useEffect, useState } from 'react';
import { CalendarDays, Clock3, Save } from 'lucide-react';
import { useDailyStudyAvailability } from './useDailyStudyAvailability';
import { createCourseRoutine } from './courseRoutine';
import { entriesAreSafe } from './scheduleSafety';
import { motion } from 'motion/react';
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
  const [scheduleSaveError, setScheduleSaveError] = useState<string | null>(null);
  const [exceptionForm, setExceptionForm] = useState<ExceptionForm>(() => newExceptionForm(localDate));

  useEffect(() => {
    setDraftSchedule(schedule);
    setEditedEntryIds(new Set());
  }, [schedule]);

  useEffect(() => {
    setExceptionForm(newExceptionForm(localDate, exception));
  }, [exception, localDate]);

  const updateStudyWindow = (day: Weekday, entryId: string, field: 'start' | 'end' | 'label' | 'kind' | 'purpose', value: string) => {
    setScheduleSaveError(null);
    setDraftSchedule((current) => current && {
      ...current,
      days: {
        ...current.days,
        [day]: current.days[day].map((entry) => entry.id === entryId ? Object.fromEntries(Object.entries({ ...entry, [field]: value, ...(field === 'kind' && value !== 'study_window' ? { purpose: '' } : {}) }).filter(([key, val]) => key !== 'purpose' || val === 'review')) as unknown as ScheduleEntry : entry),
      },
    });
    setEditedEntryIds((current) => new Set(current).add(entryId));
  };

  const addStudyWindow = (day: Weekday) => setDraftSchedule((current) => current && ({
    ...current,
    days: { ...current.days, [day]: [...current.days[day], { id: `${day}-study-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, label: 'Estudo autônomo', kind: 'study_window', start: '14:40', end: day === 'sunday' ? '15:30' : '20:30' }] },
  }));

  const removeStudyWindow = (day: Weekday, entryId: string) => setDraftSchedule((current) => current && ({
    ...current,
    days: { ...current.days, [day]: current.days[day].filter((entry) => entry.id !== entryId) },
  }));

  const saveWeeklySchedule = async () => {
    if (!draftSchedule) return;
    const invalidWindow = WEEKDAYS
      .flatMap(({ key }) => draftSchedule.days[key])
      .find((entry) => entry.kind === 'study_window' && entry.end <= entry.start);
    if (invalidWindow) {
      setScheduleSaveError('O fim precisa ser posterior ao início da janela de estudo.');
      return;
    }
    if (WEEKDAYS.some(({ key }) => !entriesAreSafe(key, draftSchedule.days[key]))) {
      setScheduleSaveError('Janelas não podem sobrepor compromissos. Estudo termina até 20:30 e revisão até 21:00 de segunda a sábado.');
      return;
    }
    const confirmedSchedule: WeeklySchedule = {
      ...draftSchedule,
      days: Object.fromEntries(WEEKDAYS.map(({ key }) => [
        key,
        draftSchedule.days[key].map((entry) => editedEntryIds.has(entry.id) ? withoutEstimate(entry) : entry),
      ])) as WeeklySchedule['days'],
      updatedAt: new Date().toISOString(),
    };
    const saved = await saveSchedule(confirmedSchedule);
    if (!saved) {
      setScheduleSaveError('Não foi possível salvar a semana. Revise os horários e tente novamente.');
      return;
    }
    setScheduleSaveError(null);
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
    if (field === 'localDate' && !/^\d{4}-\d{2}-\d{2}$/.test(value as string)) return;
    setExceptionForm((current) => ({ ...current, [field]: value }));
    if (field === 'localDate') setLocalDate(value as string);
  };

  if (loading) return <div className="ni-main"><p role="status">Carregando agenda…</p></div>;

  return (
    <div className="ni-main space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <div className="flex items-center gap-2 mb-1.5">
          <span className="w-2 h-2 rounded-full bg-ember-500 shadow-[0_0_8px_var(--color-ember-500)]" />
          <span className="text-[11px] font-mono tracking-widest uppercase text-ember-600 dark:text-ember-400">Janelas & Orçamento de Tempo · Crivo</span>
        </div>
        <h1 className="font-display text-3xl sm:text-4xl font-semibold italic text-text-primary tracking-tight flex items-center gap-3">
          <CalendarDays className="w-7 h-7 text-action-primary" />
          Agenda
        </h1>
        <p className="text-text-secondary mt-1 max-w-2xl text-base">Defina suas janelas de estudo recorrentes e exceções por data; o Crivo calcula os blocos disponíveis.</p>
      </header>

      <section aria-labelledby="semana-recorrente" className="space-y-3">
        <div>
          <h2 id="semana-recorrente" className="text-xl font-semibold">Semana recorrente</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Edite aulas, refeições, deslocamentos, descanso e janelas de estudo. Confirme as estimativas antes de salvar.</p>
        </div>
        <div className="rounded-xl border border-[var(--line)] p-4 space-y-2">
          <h3 className="font-semibold">Rotina com cursinho e revisão noturna</h3>
          <p className="text-sm text-[var(--dim)]">Modelo do cronograma: aulas até 13h45, Obras quinta 15h50–16h40, pausas de 15 minutos e revisão 20h30–21h. Horários e deslocamentos aguardam sua conferência. Carregar altera o rascunho; use Salvar semana para aplicar.</p>
          <button type="button" className="text-sm underline" onClick={() => { setDraftSchedule(createCourseRoutine(new Date().toISOString())); setEditedEntryIds(new Set()); setScheduleSaveError(null); }}>Carregar rotina do cronograma</button>
        </div>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {WEEKDAYS.map(({ key, label }, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04, duration: 0.25 }}
              whileHover={{ y: -2 }}
            >
              <WeekdayCard
                label={label}
                entries={draftSchedule?.days[key] ?? []}
                onChange={(entryId, field, value) => updateStudyWindow(key, entryId, field, value)}
                onAdd={() => addStudyWindow(key)}
                onRemove={(entryId) => removeStudyWindow(key, entryId)}
              />
            </motion.div>
          ))}
        </div>
        <button type="button" onClick={() => void saveWeeklySchedule()} disabled={!draftSchedule} className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium disabled:opacity-50">
          <Save className="w-4 h-4 mr-2" /> Salvar semana
        </button>
        {scheduleSaveError && <p role="alert" className="text-sm text-red-700 dark:text-red-300">{scheduleSaveError}</p>}
      </section>

      <section aria-labelledby="excecao-data" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-4">
        <div>
          <h2 id="excecao-data" className="text-xl font-semibold">Exceção por data</h2>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">Aplica-se somente ao dia escolhido e não altera a semana recorrente.</p>
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

      <AdaptiveStudyDay localDate={localDate} availability={availability} schedule={schedule} />

      <section aria-labelledby="disponibilidade-efetiva" className="rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 space-y-3">
        <div className="flex items-center justify-between gap-4">
          <div><h2 id="disponibilidade-efetiva" className="text-xl font-semibold">Capacidade da rotina antes das restrições de prova</h2><p className="text-sm text-zinc-600 dark:text-zinc-400">Para {localDate}. O plano acima aplica prova e véspera a estas janelas.</p></div>
          <strong className="text-indigo-600 dark:text-indigo-400">{availability?.totalMinutes ?? 0} min</strong>
        </div>
        <p role="status" className="text-sm text-zinc-600 dark:text-zinc-400">Calendar: {availability?.warnings.some(({ code }) => code === 'calendar-disconnected') ? 'desconectado' : availability?.warnings.some(({ code }) => code === 'calendar-failed') ? 'falha na consulta' : availability?.status === 'ready' ? 'exceções aplicadas' : 'indisponível'}</p>
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

function WeekdayCard({ label, entries, onChange, onAdd, onRemove }: { label: string; entries: ScheduleEntry[]; onChange: (entryId: string, field: 'start' | 'end' | 'label' | 'kind' | 'purpose', value: string) => void; onAdd: () => void; onRemove: (entryId: string) => void }) {
  return <article className="rounded-xl border border-[var(--line)] bg-[var(--surface)] p-3 space-y-3">
    <h3 className="font-semibold">{label}</h3>
    {entries.map((entry, index) => <details key={entry.id} className="border-t border-[var(--line)] pt-2">
      <summary className="cursor-pointer text-sm">{entry.label}: {entry.start}–{entry.end}{entry.isEstimate && <span className="ml-2 text-xs text-amber-700 dark:text-amber-300">Estimativa editável</span>}</summary>
      <div className="grid grid-cols-2 gap-2 mt-2">
        <Field label={`Atividade de ${label.toLowerCase()} ${index + 1}`}><input value={entry.label} onChange={(event) => onChange(entry.id, 'label', event.target.value)} className="field" /></Field>
        <Field label={`Tipo de ${label.toLowerCase()} ${index + 1}`}><select value={entry.kind} onChange={(event) => onChange(entry.id, 'kind', event.target.value)} className="field">{[['class','Aula'],['transport','Deslocamento'],['meal','Refeição'],['rest','Descanso'],['study_window','Estudo'],['unavailable','Compromisso']].map(([value, name]) => <option key={value} value={value}>{name}</option>)}</select></Field>
        <Field label={`Início de ${label.toLowerCase()} ${index + 1}`}><input aria-label={entry.kind === 'study_window' && entries.filter((e) => e.kind === 'study_window').length === 1 ? `Início de ${label.toLowerCase()}` : `Início de ${label.toLowerCase()} ${index + 1}`} type="time" value={entry.start} onChange={(event) => onChange(entry.id, 'start', event.target.value)} className="field" /></Field>
        <Field label={`Fim de ${label.toLowerCase()} ${index + 1}`}><input aria-label={entry.kind === 'study_window' && entries.filter((e) => e.kind === 'study_window').length === 1 ? `Fim de ${label.toLowerCase()}` : `Fim de ${label.toLowerCase()} ${index + 1}`} type="time" value={entry.end} onChange={(event) => onChange(entry.id, 'end', event.target.value)} className="field" /></Field>
        {entry.kind === 'study_window' && <Field label={`Finalidade de ${label.toLowerCase()} ${index + 1}`}><select value={entry.purpose ?? ''} onChange={(event) => onChange(entry.id, 'purpose', event.target.value)} className="field"><option value="">Estudo e prática (50 min)</option><option value="review">Revisão e erros (15–30 min)</option></select></Field>}
        <button type="button" onClick={() => onRemove(entry.id)} className="text-sm text-red-700 dark:text-red-400">Remover {entry.kind === 'study_window' ? 'janela' : 'atividade'}</button>
      </div>
    </details>)}
    <button type="button" onClick={onAdd} className="text-sm underline">Adicionar janela ou compromisso</button>
  </article>;
}
