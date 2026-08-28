import assert from 'node:assert/strict';
import test from 'node:test';

type Decision = {
  changed: boolean;
  previousSubject?: string;
};

type AdaptiveRankingModule = {
  parseAdaptiveRankingSnapshot: (raw: string | null) => { topicId: string; subject?: string; date: string } | null;
  decideAdaptiveRankingChange: (
    previous: { topicId: string; subject?: string; date: string } | null,
    current: { topicId: string; subject?: string },
    today: string,
  ) => Decision;
};

const loadModule = async () => {
  const module = (await import('../hooks/useAdaptiveRankingChange')) as unknown as AdaptiveRankingModule;
  return module;
};

test('reports a prior subject when a different topic is recommended on a later day', async () => {
  const { decideAdaptiveRankingChange: decide } = await loadModule();

  assert.deepEqual(
    decide(
      { topicId: 'bio-celula', subject: 'Biologia', date: '2026-08-27' },
      { topicId: 'fisica-cinematica', subject: 'Física' },
      '2026-08-28',
    ),
    { changed: true, previousSubject: 'Biologia' },
  );
});

test('does not report a change for the same topic or the same day', async () => {
  const { decideAdaptiveRankingChange: decide } = await loadModule();

  assert.deepEqual(
    decide(
      { topicId: 'bio-celula', subject: 'Biologia', date: '2026-08-28' },
      { topicId: 'fisica-cinematica', subject: 'Física' },
      '2026-08-28',
    ),
    { changed: false },
  );
  assert.deepEqual(
    decide(
      { topicId: 'bio-celula', subject: 'Biologia', date: '2026-08-27' },
      { topicId: 'bio-celula', subject: 'Biologia' },
      '2026-08-28',
    ),
    { changed: false },
  );
});

test('keeps legacy records without a subject compatible', async () => {
  const { decideAdaptiveRankingChange: decide } = await loadModule();

  assert.deepEqual(
    decide(
      { topicId: 'bio-celula', date: '2026-08-27' },
      { topicId: 'fisica-cinematica', subject: 'Física' },
      '2026-08-28',
    ),
    { changed: true },
  );
});

test('does not report a change when the previous recommendation is two or more days old', async () => {
  const { decideAdaptiveRankingChange: decide } = await loadModule();

  const result = decide(
    { topicId: 'bio-celula', subject: 'Biologia', date: '2026-08-26' },
    { topicId: 'fisica-cinematica', subject: 'Física' },
    '2026-08-28',
  );

  assert.equal(result.changed, false);
  assert.equal(result.previousSubject, undefined);
});

test('ignores malformed storage JSON while preserving valid legacy records', async () => {
  const { parseAdaptiveRankingSnapshot: parse } = await loadModule();

  assert.equal(parse('{not-json'), null);
  assert.deepEqual(parse('{"topicId":"bio-celula","date":"2026-08-27"}'), {
    topicId: 'bio-celula',
    date: '2026-08-27',
  });
});
