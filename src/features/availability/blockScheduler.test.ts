import { describe, expect, it } from 'vitest';
import { scheduleStudyBlocks } from './blockScheduler';

const policy = { blockMinutes: 50 as const, shortBreakMinutes: 10, longBreakMinutes: 30, blocksBeforeLongBreak: 3 };

describe('scheduleStudyBlocks', () => {
  it('creates the five approved Monday blocks and leaves 40 minutes of margin', () => {
    const result = scheduleStudyBlocks('2026-08-24', [{ start: '14:40', end: '20:30' }], policy);
    expect(result.map(({ start, end }) => [start.slice(11, 16), end.slice(11, 16)])).toEqual([
      ['14:40', '15:30'], ['15:40', '16:30'], ['16:40', '17:30'], ['18:00', '18:50'], ['19:00', '19:50'],
    ]);
    expect(result.reduce((sum, block) => sum + block.durationMinutes, 0)).toBe(250);
  });

  it('does not promote a 49-minute fragment to a full block', () => {
    expect(scheduleStudyBlocks('2026-08-24', [{ start: '18:00', end: '18:49' }], policy)).toEqual([]);
  });

  it('rejects a policy that changes the required 50-minute block length', () => {
    const invalidPolicy = { ...policy, blockMinutes: 25 } as unknown as typeof policy;
    expect(() => scheduleStudyBlocks('2026-08-24', [{ start: '14:40', end: '16:00' }], invalidPolicy))
      .toThrow('Block duration must be 50 minutes');
  });

  it('restarts placement after an interruption-created segment', () => {
    const result = scheduleStudyBlocks('2026-08-24', [
      { start: '14:40', end: '16:00' },
      { start: '16:30', end: '18:20' },
    ], policy);
    expect(result.map(({ start }) => start.slice(11, 16))).toEqual(['14:40', '16:30', '17:30']);
  });
});
