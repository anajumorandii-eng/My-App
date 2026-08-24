import { resolveEffectiveStudyAvailability } from './availabilityEngine';
import { getOrCreateWeeklySchedule, getScheduleException } from './scheduleRepository';
import type { CalendarOverlayInput, DailyStudyAvailability } from './types';

export async function getEffectiveStudyAvailability(
  uid: string,
  localDate: string,
  calendar: CalendarOverlayInput,
): Promise<DailyStudyAvailability> {
  const [schedule, exception] = await Promise.all([
    getOrCreateWeeklySchedule(uid),
    getScheduleException(uid, localDate),
  ]);
  return resolveEffectiveStudyAvailability(schedule, exception, calendar, localDate);
}
