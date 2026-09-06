import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';

import type { Question } from '../types';

const repositoryRoot = process.cwd();

async function loadQuestions(): Promise<Question[]> {
  const contents = await readFile(
    path.join(repositoryRoot, 'public', 'questions.json'),
    'utf8',
  );
  return JSON.parse(contents) as Question[];
}

test('the published question bank has unique and answerable entries', async () => {
  const questions = await loadQuestions();
  const ids = questions.map((question) => question.id);

  assert.equal(questions.length, 1_793);
  assert.equal(new Set(ids).size, ids.length);

  for (const question of questions) {
    assert.ok(question.prompt.trim(), `${question.id} has no prompt`);
    assert.ok(question.options.length >= 2, `${question.id} has too few options`);
    assert.ok(
      question.options.some((option) => option.id === question.correctOptionId),
      `${question.id} has an invalid correct option`,
    );
  }
});

test('all 90 FUVEST 2025 questions retain their original page images', async () => {
  const questions = await loadQuestions();
  const fuvest2025 = questions.filter(
    (question) =>
      question.examSource?.board === 'FUVEST' && question.examSource.year === 2025,
  );

  assert.equal(fuvest2025.length, 90);

  for (const question of fuvest2025) {
    assert.ok(question.originalPages?.length, `${question.id} has no original page`);
    for (const originalPage of question.originalPages ?? []) {
      const imagePath = path.join(
        repositoryRoot,
        'public',
        originalPage.url.replace(/^\//, ''),
      );
      const image = await stat(imagePath);
      assert.ok(image.size > 0, `${question.id} references an empty image`);
    }
  }
});
