import { deleteDoc, doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../lib/firestore';
import { createInitialWeeklySchedule } from './weeklyScheduleSeed';
import {
  SAO_PAULO_TIME_ZONE,
  type ScheduleEntry,
  type ScheduleEntryKind,
  type ScheduleException,
  type Weekday,
  type WeeklySchedule,
} from './types';

const WEEKDAYS: Weekday[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const ENTRY_KINDS: ReadonlySet<string> = new Set<ScheduleEntryKind>(['class', 'transport', 'meal', 'rest', 'study_window', 'unavailable']);
const EXCEPTION_REASONS: ReadonlySet<string> = new Set<ScheduleException['reason']>([
  'holiday', 'absence', 'simulation_exam', 'appointment', 'exceptional_schedule', 'day_without_classes', 'early_departure',
]);
const EXCEPTION_OPERATIONS: ReadonlySet<string> = new Set<ScheduleException['operation']>([
  'day_unavailable', 'busy_interval', 'replacement_windows', 'early_departure',
]);
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const LOCAL_DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const ISO_DATE_TIME_RE = /^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/;

export async function getOrCreateWeeklySchedule(uid: string): Promise<WeeklySchedule> {
  const ref = weeklyScheduleRef(uid);
  const snapshot = await getDoc(ref);
  if (snapshot.exists()) return parseWeeklySchedule(snapshot.data());

  const schedule = createInitialWeeklySchedule(new Date().toISOString());
  await setDoc(ref, schedule);
  return schedule;
}

export async function saveWeeklySchedule(uid: string, schedule: WeeklySchedule): Promise<void> {
  validateWeeklySchedule(schedule);
  await setDoc(weeklyScheduleRef(uid), schedule);
}

export async function getScheduleException(uid: string, localDate: string): Promise<ScheduleException | undefined> {
  const ref = scheduleExceptionRef(uid, localDate);
  const snapshot = await getDoc(ref);
  return snapshot.exists() ? parseScheduleException(snapshot.data()) : undefined;
}

export async function saveScheduleException(uid: string, exception: ScheduleException): Promise<void> {
  validateScheduleException(exception);
  await setDoc(scheduleExceptionRef(uid, exception.localDate), exception);
}

export async function deleteScheduleException(uid: string, localDate: string): Promise<void> {
  await deleteDoc(scheduleExceptionRef(uid, localDate));
}

function weeklyScheduleRef(uid: string) {
  requireUid(uid);
  return doc(db, 'users', uid, 'data', 'weeklySchedule');
}

function scheduleExceptionRef(uid: string, localDate: string) {
  requireUid(uid);
  if (!isLocalDate(localDate)) throw new Error('Invalid local date');
  return doc(db, 'users', uid, 'scheduleExceptions', localDate);
}

function requireUid(uid: string): void {
  if (!uid.trim()) throw new Error('A user id is required');
}

function parseWeeklySchedule(value: unknown): WeeklySchedule {
  if (!isWeeklySchedule(value)) throw new Error('Invalid weekly schedule document');
  return value;
}

function parseScheduleException(value: unknown): ScheduleException {
  if (!isScheduleException(value)) throw new Error('Invalid schedule exception document');
  return value;
}

function validateWeeklySchedule(value: unknown): asserts value is WeeklySchedule {
  if (!isWeeklySchedule(value)) throw new Error('Invalid weekly schedule');
}

function validateScheduleException(value: unknown): asserts value is ScheduleException {
  if (!isScheduleException(value)) throw new Error('Invalid schedule exception');
}

function isWeeklySchedule(value: unknown): value is WeeklySchedule {
  if (!isRecord(value) || value.version !== 1 || value.timeZone !== SAO_PAULO_TIME_ZONE || !isIsoDateTime(value.updatedAt)) {
    return false;
  }
  if (!isBlockPolicy(value.blockPolicy) || !isRecord(value.days) || !hasOnlyWeekdays(value.days)) return false;
  return WEEKDAYS.every((day) => Array.isArray(value.days[day]) && value.days[day].every(isScheduleEntry));
}

function isBlockPolicy(value: unknown): value is WeeklySchedule['blockPolicy'] {
  return isRecord(value)
    && value.blockMinutes === 50
    && value.shortBreakMinutes === 10
    && value.longBreakMinutes === 30
    && value.blocksBeforeLongBreak === 3;
}

function hasOnlyWeekdays(days: Record<string, unknown>): boolean {
  return Object.keys(days).length === WEEKDAYS.length && WEEKDAYS.every((day) => Object.hasOwn(days, day));
}

function isScheduleEntry(value: unknown): value is ScheduleEntry {
  return isRecord(value)
    && isNonEmptyString(value.id)
    && isNonEmptyString(value.label)
    && typeof value.kind === 'string'
    && ENTRY_KINDS.has(value.kind)
    && isTime(value.start)
    && isTime(value.end)
    && value.end > value.start
    && (value.isEstimate === undefined || typeof value.isEstimate === 'boolean');
}

function isScheduleException(value: unknown): value is ScheduleException {
  if (!isRecord(value)
    || !isLocalDate(value.localDate)
    || value.timeZone !== SAO_PAULO_TIME_ZONE
    || typeof value.reason !== 'string'
    || !EXCEPTION_REASONS.has(value.reason)
    || typeof value.operation !== 'string'
    || !EXCEPTION_OPERATIONS.has(value.operation)
    || !isIsoDateTime(value.updatedAt)
    || (value.notes !== undefined && typeof value.notes !== 'string')) {
    return false;
  }

  const intervalsAreValid = Array.isArray(value.intervals) && value.intervals.length > 0 && value.intervals.every(isTimeInterval);
  switch (value.operation) {
    case 'day_unavailable':
      return value.intervals === undefined && value.departureTime === undefined;
    case 'busy_interval':
    case 'replacement_windows':
      return intervalsAreValid && value.departureTime === undefined;
    case 'early_departure':
      return value.intervals === undefined && isTime(value.departureTime);
  }
}

function isTimeInterval(value: unknown): value is NonNullable<ScheduleException['intervals']>[number] {
  return isRecord(value) && isTime(value.start) && isTime(value.end) && value.end > value.start;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function isTime(value: unknown): value is string {
  return typeof value === 'string' && TIME_RE.test(value);
}

function isLocalDate(value: unknown): value is string {
  if (typeof value !== 'string' || !LOCAL_DATE_RE.test(value)) return false;
  const [year, month, day] = value.split('-').map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));
  return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day;
}

function isIsoDateTime(value: unknown): value is string {
  return typeof value === 'string' && ISO_DATE_TIME_RE.test(value) && !Number.isNaN(Date.parse(value));
}
