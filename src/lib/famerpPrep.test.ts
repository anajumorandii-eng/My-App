import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Question } from '../types.ts';
import {
  buildFamerpExam, famerpPriorities, famerpYears, formatClock, parseSimuladoState, scoreSimulado, secondsRemaining,
} from './famerpPrep.ts';

const bank = JSON.parse(readFileSync(new URL('../../public/questions.json', import.meta.url), 'utf8')) as Question[];

const q = (id: string, subject: string, correct: string, extra: Partial<Question> = {}): Question => ({
  id, topicId: 't', subject, prompt: '', options: [], correctOptionId: correct, explanation: '', difficulty: 'medium', ...extra,
});

describe('prova Famerp do banco', () => {
  it('cada ano importado vira um simulado de 80 questões na ordem do caderno', () => {
    const years = famerpYears(bank);
    assert.ok(years.length >= 5, 'as provas 2022–2026 estão no banco');
    for (const year of years) {
      const exam = buildFamerpExam(bank, year);
      assert.equal(exam.length, 80, `Famerp ${year}`);
      assert.deepEqual(exam.map((x) => x.examSource!.questionNumber), Array.from({ length: 80 }, (_, i) => i + 1));
    }
  });

  it('a trilha só traz capítulo que caiu em 3 ou mais anos e põe os mais repetidos primeiro', () => {
    const priorities = famerpPriorities(bank);
    assert.ok(priorities.length > 0);
    for (const p of priorities) {
      assert.ok(p.years.length >= 3);
      assert.equal(p.stars, p.years.length >= 4 ? 2 : 1);
    }
    for (let i = 1; i < priorities.length; i += 1) assert.ok(priorities[i - 1].years.length >= priorities[i].years.length);
    assert.ok(priorities.some((p) => p.chapter === 'Porcentagem' && p.years.length === 5));
  });
});

describe('correção do simulado', () => {
  const exam = [
    q('a', 'Biologia', 'A'), q('b', 'Biologia', 'B'), q('c', 'Física', 'C'),
    q('d', 'Física', 'D', { status: 'annulled' } as Partial<Question>),
  ];

  it('separa acerto, erro e branco, e tira a anulada do denominador', () => {
    const r = scoreSimulado(exam, { a: 'A', b: 'C', d: 'A' });
    assert.equal(r.correct, 1);
    assert.equal(r.answered, 2);
    assert.equal(r.total, 3);
    assert.equal(r.annulled, 1);
    assert.deepEqual(r.wrongIds, ['b']);
    assert.deepEqual(r.blankIds, ['c']);
  });

  it('ordena as matérias da pior para a melhor', () => {
    const r = scoreSimulado(exam, { a: 'A', b: 'B' });
    assert.deepEqual(r.bySubject.map((s) => s.subject), ['Física', 'Biologia']);
  });
});

describe('estado salvo', () => {
  it('recusa estado corrompido em vez de abrir prova quebrada', () => {
    assert.equal(parseSimuladoState(null), null);
    assert.equal(parseSimuladoState('{'), null);
    assert.equal(parseSimuladoState(JSON.stringify({ year: 2025, minutes: 0, startedAt: '2026-01-01T00:00:00Z' })), null);
    assert.equal(parseSimuladoState(JSON.stringify({ year: 2025, minutes: 60, startedAt: 'ontem' })), null);
  });

  it('descarta respostas que não são texto e mantém as válidas', () => {
    const s = parseSimuladoState(JSON.stringify({ year: 2025, minutes: 60, startedAt: '2026-01-01T00:00:00Z', answers: { a: 'A', b: 3 } }));
    assert.deepEqual(s?.answers, { a: 'A' });
  });

  it('conta o tempo restante pelo início, inclusive depois de estourar', () => {
    const s = { year: 2025, minutes: 60, startedAt: '2026-01-01T00:00:00Z', answers: {} };
    assert.equal(secondsRemaining(s, new Date('2026-01-01T00:30:00Z')), 1800);
    assert.equal(secondsRemaining(s, new Date('2026-01-01T01:00:05Z')), -5);
    assert.equal(formatClock(3725), '1:02:05');
    assert.equal(formatClock(-5), '−0:00:05');
  });
});
