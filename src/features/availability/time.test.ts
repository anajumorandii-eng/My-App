import { describe, expect, it } from 'vitest';
import { isoToLocalDate, localDateTimeToIso } from './time';

describe('São Paulo schedule time', () => {
  it('converts a local wall-clock value with the São Paulo offset', () => {
    expect(localDateTimeToIso('2026-08-24', '14:40')).toBe('2026-08-24T14:40:00-03:00');
  });

  it('maps an instant to the correct São Paulo local date', () => {
    expect(isoToLocalDate('2026-08-25T01:30:00Z')).toBe('2026-08-24');
  });

  it('rejects malformed local dates and times', () => {
    expect(() => localDateTimeToIso('24/08/2026', '14:40')).toThrow('Invalid local date');
    expect(() => localDateTimeToIso('2026-08-24', '25:00')).toThrow('Invalid wall-clock time');
  });
});
