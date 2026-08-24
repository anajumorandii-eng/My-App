import { TZDate } from '@date-fns/tz';
import { localDateTimeToDate } from './time';
import { SAO_PAULO_TIME_ZONE, type StudyInterval, type WeeklySchedule } from './types';

export type CandidateStudyWindow = { start: string; end: string };

type BlockPolicy = {
  blockMinutes: WeeklySchedule['blockPolicy']['blockMinutes'];
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

      return { start, end };
    })
    .sort((left, right) => left.start.getTime() - right.start.getTime());

  for (let index = 1; index < segments.length; index += 1) {
    if (segments[index].start.getTime() < segments[index - 1].end.getTime()) {
      throw new Error('Overlapping study windows');
    }
  }

  const blocks: StudyInterval[] = [];

  for (const segment of segments) {
    let cursor = new TZDate(segment.start.getTime(), SAO_PAULO_TIME_ZONE);
    let consecutive = 0;

    while (cursor.getTime() + policy.blockMinutes * 60_000 <= segment.end.getTime()) {
      const end = new TZDate(cursor.getTime() + policy.blockMinutes * 60_000, SAO_PAULO_TIME_ZONE);
      blocks.push({
        start: cursor.toISOString().replace(/\.000(?=[+-]\d{2}:\d{2}$)/, ''),
        end: end.toISOString().replace(/\.000(?=[+-]\d{2}:\d{2}$)/, ''),
        durationMinutes: 50,
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
