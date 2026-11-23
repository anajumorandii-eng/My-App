import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Question } from '../types.ts';
import {
  boardPriorities, buildExam, countdownPlan, examEditions, formatClock, parseSimuladoState, scoreSimulado, secondsRemaining,
} from './boardPrep.ts';

const bank = JSON.parse(readFileSync(new URL('../../public/questions.json', import.meta.url), 'utf8')) as Question[];

const q = (id: string, subject: string, correct: string, extra: Partial<Question> = {}): Question => ({
  id, topicId: 't', subject, prompt: '', options: [], correctOptionId: correct, explanation: '', difficulty: 'medium', ...extra,
});

describe('provas do banco', () => {
  it('cada ano da Famerp vira um simulado de 80 questões na ordem do caderno', () => {
    const editions = examEditions(bank, 'Famerp');
    assert.ok(editions.length >= 5, 'as provas 2022–2026 estão no banco');
    for (const edition of editions) {
      const exam = buildExam(bank, 'Famerp', edition.year, edition.version);
      assert.equal(exam.length, 80, `Famerp ${edition.year}`);
      assert.deepEqual(exam.map((x) => x.examSource!.questionNumber), Array.from({ length: 80 }, (_, i) => i + 1));
    }
  });

  it('a grafia da banca não importa: Famerp e FAMERP são a mesma prova', () => {
    assert.deepEqual(examEditions(bank, 'Famerp'), examEditions(bank, 'FAMERP'));
  });

  it('cadernos diferentes do mesmo ano não se misturam e recorte curto não vira simulado', () => {
    const enem = examEditions(bank, 'ENEM');
    for (const edition of enem) assert.ok(edition.count >= 40);
    assert.ok(new Set(enem.map((e) => `${e.year}-${e.version}`)).size === enem.length);
    assert.equal(examEditions(bank, 'Unifesp').length, 0, 'as 25 questões da Unifesp não são prova completa');
  });

  it('a trilha da Famerp só traz o que se repete, com os mais repetidos primeiro', () => {
    const { years, oneStar, twoStars, chapters } = boardPriorities(bank, 'Famerp');
    assert.equal(years.length, 5);
    assert.equal(oneStar, 3);
    assert.equal(twoStars, 4);
    for (const p of chapters) {
      assert.ok(p.years.length >= 3);
      assert.equal(p.stars, p.years.length >= 4 ? 2 : 1);
    }
    for (let i = 1; i < chapters.length; i += 1) assert.ok(chapters[i - 1].years.length >= chapters[i].years.length);
    assert.ok(chapters.some((p) => p.chapter === 'Porcentagem' && p.years.length === 5));
  });

  it('com 4 anos os cortes ficam em 3 e 4, e com menos de 3 anos não há trilha', () => {
    const unesp = boardPriorities(bank, 'UNESP');
    assert.equal(unesp.years.length, 4);
    assert.equal(unesp.oneStar, 3);
    assert.equal(unesp.twoStars, 4);
    assert.deepEqual(boardPriorities(bank, 'Unicamp').chapters, []);
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
  const base = { board: 'Famerp', year: 2025, version: 'V1', minutes: 60, startedAt: '2026-01-01T00:00:00Z' };

  it('recusa estado corrompido em vez de abrir prova quebrada', () => {
    assert.equal(parseSimuladoState(null), null);
    assert.equal(parseSimuladoState('{'), null);
    assert.equal(parseSimuladoState(JSON.stringify({ ...base, minutes: 0 })), null);
    assert.equal(parseSimuladoState(JSON.stringify({ ...base, startedAt: 'ontem' })), null);
    assert.equal(parseSimuladoState(JSON.stringify({ ...base, board: undefined })), null);
  });

  it('descarta respostas que não são texto e mantém as válidas', () => {
    const s = parseSimuladoState(JSON.stringify({ ...base, answers: { a: 'A', b: 3 } }));
    assert.deepEqual(s?.answers, { a: 'A' });
  });

  it('conta o tempo restante pelo início, inclusive depois de estourar', () => {
    const s = { ...base, answers: {} };
    assert.equal(secondsRemaining(s, new Date('2026-01-01T00:30:00Z')), 1800);
    assert.equal(secondsRemaining(s, new Date('2026-01-01T01:00:05Z')), -5);
    assert.equal(formatClock(3725), '1:02:05');
    assert.equal(formatClock(-5), '−0:00:05');
  });
});

describe('plano até a prova', () => {
  it('com tempo, divide em conteúdo, simulados nas duas últimas semanas e revisão', () => {
    const plan = countdownPlan(30);
    assert.deepEqual(plan.map((p) => [p.fromDay, p.toDay]), [[30, 15], [14, 3], [2, 0]]);
  });

  it('com menos de duas semanas, começa pelos simulados', () => {
    assert.deepEqual(countdownPlan(10).map((p) => p.title), ['Simulados', 'Revisão final']);
    assert.equal(countdownPlan(10)[0].fromDay, 10);
  });

  it('na véspera é só revisão, e depois da prova não há plano', () => {
    assert.deepEqual(countdownPlan(1).map((p) => p.title), ['Revisão final']);
    assert.deepEqual(countdownPlan(-1), []);
  });
});
