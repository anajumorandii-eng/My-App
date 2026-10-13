import { TZDate } from '@date-fns/tz';
import { localDateTimeToDate } from './time';
import { SAO_PAULO_TIME_ZONE, type StudyInterval, type WeeklySchedule } from './types';

export type CandidateStudyWindow = { start: string; end: string; purpose?: 'review' };

type BlockPolicy = {
  blockMinutes: WeeklySchedule['blockPolicy']['blockMinutes'];
  allowShortStudyBlocks?: boolean;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  blocksBeforeLongBreak: number;
};

export function scheduleStudyBlocks(
  localDate: string,
  windows: CandidateStudyWindow[],
  policy: BlockPolicy,
): StudyInterval[] {
  if (policy.blockMinutes !== 50) {
    throw new Error('Block duration must be 50 minutes');
  }

  const segments = windows
    .map((window) => {
      const start = localDateTimeToDate(localDate, window.start);
      const end = localDateTimeToDate(localDate, window.end);

      if (end.getTime() <= start.getTime()) {
        throw new Error('Invalid study window order');
      }

      return { start, end, purpose: window.purpose };
    })
    .sort((left, right) => left.start.getTime() - right.start.getTime());

  for (let index = 1; index < segments.length; index += 1) {
    if (segments[index].start.getTime() < segments[index - 1].end.getTime()) {
      throw new Error('Overlapping study windows');
    }
  }

  const blocks: StudyInterval[] = [];

  for (const segment of segments) {
    if (segment.purpose === 'review') {
      let cursorMs = segment.start.getTime();
      while (segment.end.getTime() - cursorMs >= 15 * 60_000) {
        const minutes = Math.min(30, Math.floor((segment.end.getTime() - cursorMs) / 60_000));
        const endMs = cursorMs + minutes * 60_000;
        blocks.push({ start: new TZDate(cursorMs, SAO_PAULO_TIME_ZONE).toISOString().replace(/\.000(?=[+-]\d{2}:\d{2}$)/, ''), end: new TZDate(endMs, SAO_PAULO_TIME_ZONE).toISOString().replace(/\.000(?=[+-]\d{2}:\d{2}$)/, ''), durationMinutes: minutes, purpose: 'review' });
        cursorMs = endMs + policy.shortBreakMinutes * 60_000;
      }
      continue;
    }
    let cursor = new TZDate(segment.start.getTime(), SAO_PAULO_TIME_ZONE);
    let consecutive = 0;

    while (segment.end.getTime() - cursor.getTime() >= (policy.allowShortStudyBlocks ? 25 : policy.blockMinutes) * 60_000) {
      const durationMinutes = Math.min(policy.blockMinutes, Math.floor((segment.end.getTime() - cursor.getTime()) / 60_000));
      const end = new TZDate(cursor.getTime() + durationMinutes * 60_000, SAO_PAULO_TIME_ZONE);
      blocks.push({
        start: cursor.toISOString().replace(/\.000(?=[+-]\d{2}:\d{2}$)/, ''),
        end: end.toISOString().replace(/\.000(?=[+-]\d{2}:\d{2}$)/, ''),
        durationMinutes,
      });
      consecutive += 1;
      const breakMinutes = consecutive % policy.blocksBeforeLongBreak === 0
        ? policy.longBreakMinutes
        : policy.shortBreakMinutes;
      cursor = new TZDate(end.getTime() + breakMinutes * 60_000, SAO_PAULO_TIME_ZONE);
    }
  }

  return blocks;
}
