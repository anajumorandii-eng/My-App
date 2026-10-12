import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { challengeSectionIndex } from '../lib/visualChallenge';

describe('authorial challenge links', () => {
  it('keeps browser audit expectations synchronized with all authored links', () => {
    const recorded = JSON.parse(readFileSync('docs/refinamento-visual-613-desafio/challenge-links.json', 'utf8'));
    expect(recorded).toEqual(interactiveSummaries.map(summary => ({
      id: summary.id,
      questionId: summary.retrieval[0].id,
      sectionId: summary.retrieval[0].sectionId,
      sectionTitle: summary.sections[challengeSectionIndex(summary)].title,
    })));
  });
  it.each(interactiveSummaries.map(summary => [summary.id, summary] as const))('%s points to its authored explanation', (_, summary) => {
    const question = summary.retrieval[0];
    expect(question.prompt.trim()).not.toBe('');
    expect(summary.sections[challengeSectionIndex(summary)].id).toBe(question.sectionId);
    expect(question.expectedElements.length).toBeGreaterThan(0);
    expect(question.transferPrompt.trim()).not.toBe('');
  });
  it('falls back to the first section for an unlinked question', () => {
    const summary = interactiveSummaries[0];
    expect(challengeSectionIndex({ ...summary, retrieval: [{ ...summary.retrieval[0], sectionId: 'missing' }] })).toBe(0);
  });
});
