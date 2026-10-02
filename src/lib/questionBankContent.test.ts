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

  assert.equal(questions.length, 2_887);
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

test('FUVEST 2025 oferece os 90 enunciados recuperados e distingue alternativas gráficas', async () => {
  const questions = (await loadQuestions()).filter(q => q.id.startsWith('fuvest_2025_q'));
  assert.equal(questions.length, 90);
  for (const question of questions) {
    assert.doesNotMatch(question.prompt, /Leia a questão e suas alternativas na página original/);
    for (const option of question.options) assert.doesNotMatch(option.text, /^Alternativa [A-E] da prova$/);
  }
  for (const number of [60, 69]) {
    const question = questions.find(q => q.id === `fuvest_2025_q${number}`)!;
    assert.match(question.prompt, /As cinco alternativas são gráficos/);
    assert.ok(question.options.every(option => /alternativa visual/.test(option.text)));
  }
});

test('FUVEST 2025 preserva expoentes, frações e índices que mudam o problema científico', async () => {
  const questions = new Map((await loadQuestions()).map(q => [q.id, q]));
  const q18 = questions.get('fuvest_2025_q18')!;
  assert.equal(q18.options[0].text, '7 × 10⁻² N.');
  assert.equal(q18.options[4].text, '7 × 10⁶ N.');
  assert.match(q18.prompt, /1 m\.p\.h\. = 0,5 m\/s/);
  assert.match(questions.get('fuvest_2025_q19')!.prompt, /λ′ = λ₀ \+ \(α\/m\)\(1 − cos θ\)/);
  assert.match(questions.get('fuvest_2025_q70')!.prompt, /bₙ₊₁= bₙ\+aₙ/);
  const q76 = questions.get('fuvest_2025_q76')!;
  assert.match(q76.prompt, /h\/2/);
  assert.match(q76.prompt, /r\/2/);
  assert.equal(q76.options[3].text, 'V=V₁+2V₂  e  A=A₁+A₂');
  for (const q of questions.values()) {
    if (q.id.startsWith('fuvest_2025_q')) assert.doesNotMatch(q.prompt + q.options.map(o => o.text).join(''), /[\u0B00-\u0FFF\u1200-\u137F\uA7F7]/);
  }
});

test('questões FUVEST dependentes de textos compartilhados conservam o contexto', async () => {
  const questions = new Map((await loadQuestions()).map(q => [q.id, q]));
  const groups: [number[], RegExp][] = [
    [[10, 11], /cultura do\s+cancelamento/],
    [[27, 28, 29], /Climate change is messing with time/],
    [[37, 38], /Meus olhos encheram de mar/],
    [[41, 42], /The Tortured Poets Department/],
    [[65, 66], /caldo de cana/],
    [[73, 74], /CH₃COOH \+ NaHCO₃ → CH₃COONa \+ CO₂ \+ H₂O/],
  ];
  for (const [numbers, source] of groups) for (const number of numbers) assert.match(questions.get(`fuvest_2025_q${number}`)!.prompt, source);
});
