/** Reaplicável e local: npx tsx scripts/import-enem-2018-2025.ts [--write]. */
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
import { mockTopics } from '../src/data/mockData';
import type { Question } from '../src/types';

const batch = JSON.parse(await readFile('scripts/data/enem-2018-2025/questions.json', 'utf8')) as Question[];
const sources = JSON.parse(await readFile('scripts/data/enem-2018-2025/sources.json', 'utf8')) as {
  year: number; number: number; kind: string; url: string;
  raw?: { correctAlternative: string; files: string[]; alternatives: { file: string | null }[] };
  answerRecord?: string;
}[];
const bank = JSON.parse(await readFile('public/questions.json', 'utf8')) as Question[];
const catalog = new Map(mockTopics.map(t => [t.id, t]));
const ids = new Set(bank.map(q => q.id));
assert.equal(ids.size, bank.length, 'IDs duplicados no banco anterior');
assert.equal(batch.length, 64, 'Lote deve conter oito questões por ano');
assert.equal(new Set(batch.map(q => q.id)).size, batch.length);
assert.equal(sources.length, batch.length);
const canonical = (s: string) => s.normalize('NFKD').replace(/\p{M}/gu, '').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '');
const additions: Question[] = [];
for (const q of batch) {
  const source = q.examSource!;
  const topic = catalog.get(q.topicId);
  assert.equal(source.board, 'ENEM');
  assert.ok(source.year! >= 2018 && source.year! <= 2025);
  assert.ok(source.questionNumber! >= 6 && source.questionNumber! <= 180);
  assert.equal(q.id, `enem_expansao_${source.year}_q${String(source.questionNumber).padStart(2, '0')}`);
  assert.equal(topic?.subject, q.subject, q.id);
  assert.ok(topic?.chapters.includes(q.chapter!), q.id);
  assert.equal(q.statementComplete, true, q.id);
  assert.ok(q.prompt.length > 80 && q.explanation.length > 150, q.id);
  assert.doesNotMatch(q.prompt, /Leia o enunciado original|nas páginas abaixo|ainda não escrito/i);
  assert.equal(q.options.map(o => o.id).join(''), 'abcde');
  assert.ok(q.options.every(o => o.text.trim()), q.id);
  assert.ok(q.options.some(o => o.id === q.correctOptionId), q.id);
  const evidence = sources.filter(s => s.year === source.year && s.number === source.questionNumber);
  assert.equal(evidence.length, 1, q.id);
  if (evidence[0].kind === 'secondary-transcription') {
    assert.equal(evidence[0].raw!.correctAlternative.toLowerCase(), q.correctOptionId);
    assert.equal(evidence[0].raw!.files.length, 0, 'Figura necessária não importada');
    assert.ok(evidence[0].raw!.alternatives.every(o => !o.file));
  } else {
    assert.equal(evidence[0].answerRecord, `scripts/data/board-incidence/enem/${source.year}.json`);
    const corpus = JSON.parse(await readFile(evidence[0].answerRecord!, 'utf8'));
    const paper = corpus.papers.find((p: { version: string }) => p.version === source.version);
    const entry = paper?.questions.find((item: { number: string }) => Number(item.number) === source.questionNumber);
    assert.ok(entry && !entry.excluded, `Anulada ou ausente: ${q.id}`);
    assert.equal(entry.answer.toLowerCase(), q.correctOptionId, q.id);
    assert.equal(paper.answerKeyUrl, source.answerKeyUrl, q.id);
  }
  const previous = bank.find(old => old.id === q.id);
  if (previous) {
    const {figures:_previousFigures,...before}=previous;
    const {figures:_batchFigures,...after}=q;
    assert.deepEqual(before, after, `Conflito: ${q.id}`); continue;
  }
  const duplicate = [...bank, ...additions].find(old => {
    if (old.examSource?.board !== 'ENEM' || old.examSource.year !== source.year) return false;
    const sameEdition = old.examSource.version === source.version && old.examSource.phase === source.phase;
    return (sameEdition && old.examSource.questionNumber === source.questionNumber) ||
      canonical(old.prompt).slice(0, 180) === canonical(q.prompt).slice(0, 180);
  });
  assert.ok(!duplicate, `Duplicação: ${q.id} e ${duplicate?.id}`);
  additions.push(q);
}
for (let year = 2018; year <= 2025; year++) {
  const own = batch.filter(q => q.examSource?.year === year);
  assert.equal(own.length, 8);
  for (const [min, max] of [[6,45], [46,90], [91,135], [136,180]]) {
    assert.equal(own.filter(q => q.examSource!.questionNumber! >= min && q.examSource!.questionNumber! <= max).length, 2);
  }
}
if (process.argv.includes('--write') && additions.length) {
  await writeFile('public/questions.json', JSON.stringify([...bank, ...additions], null, 2) + '\n');
}
console.log(`${process.argv.includes('--write') ? 'Importação' : 'Simulação'}: ${additions.length} novas questões; banco ${bank.length} → ${bank.length + additions.length}.`);
