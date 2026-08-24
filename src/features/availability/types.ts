export const SAO_PAULO_TIME_ZONE = 'America/Sao_Paulo' as const;
export type Weekday = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
export type ScheduleEntryKind = 'class' | 'transport' | 'meal' | 'rest' | 'study_window' | 'unavailable';

export interface ScheduleEntry {
  id: string;
  label: string;
  kind: ScheduleEntryKind;
  start: string;
  end: string;
  isEstimate?: boolean;
}

export interface WeeklySchedule {
  version: 1;
  timeZone: typeof SAO_PAULO_TIME_ZONE;
  blockPolicy: {
    blockMinutes: 50;
    shortBreakMinutes: 10;
    longBreakMinutes: 30;
    blocksBeforeLongBreak: 3;
  };
  days: Record<Weekday, ScheduleEntry[]>;
  updatedAt: string;
}

export interface ScheduleException {
  localDate: string;
  timeZone: typeof SAO_PAULO_TIME_ZONE;
  reason: 'holiday' | 'absence' | 'simulation_exam' | 'appointment' | 'exceptional_schedule' | 'day_without_classes' | 'early_departure';
  operation: 'day_unavailable' | 'busy_interval' | 'replacement_windows' | 'early_departure';
  intervals?: Array<{ start: string; end: string }>;
  departureTime?: string;
  notes?: string;
  updatedAt: string;
}

export interface AvailabilityCalendarEvent {
  id: string;
  summary: string;
  start: { dateTime?: string; date?: string };
  end: { dateTime?: string; date?: string };
  transparency?: 'opaque' | 'transparent';
  status?: 'confirmed' | 'tentative' | 'cancelled';
}

export type CalendarOverlayInput =
  | { status: 'connected'; events: AvailabilityCalendarEvent[] }
  | { status: 'disconnected' }
  | { status: 'failed'; warning: string };

export interface StudyInterval {
  start: string;
  end: string;
  durationMinutes: 50;
}

export type AvailabilityWarning =
  | { code: 'calendar-disconnected'; message: string }
  | { code: 'calendar-failed'; message: string }
  | { code: 'schedule-unavailable'; message: string };

export interface DailyStudyAvailability {
  localDate: string;
  timeZone: typeof SAO_PAULO_TIME_ZONE;
  intervals: StudyInterval[];
  totalMinutes: number;
  status: 'ready' | 'no-availability' | 'degraded';
  warnings: AvailabilityWarning[];
}
