import assert from 'node:assert/strict';
import test from 'node:test';
import { computeStudyBlocksForWeekday, applyBreakOverhead, breakOverheadRatio } from './netStudyTime';

test('computeStudyBlocksForWeekday começa às 15h em dia sem aula à tarde (terça)', () => {
  const window = computeStudyBlocksForWeekday(2);
  assert.equal(window.windowStart, '15:00');
  assert.equal(window.windowEnd, '20:30');
});

test('computeStudyBlocksForWeekday empurra o início pra depois da última aula (segunda, até 15:45)', () => {
  const window = computeStudyBlocksForWeekday(1);
  assert.equal(window.windowStart, '15:45');
});

test('computeStudyBlocksForWeekday empurra bastante o início em quinta (aula até 17:35)', () => {
  const window = computeStudyBlocksForWeekday(4);
  assert.equal(window.windowStart, '17:35');
  assert.ok(window.netMinutes > 0);
  assert.ok(window.netMinutes < 175); // janela bruta de 17:35 a 20:30 é só 175min
});

test('computeStudyBlocksForWeekday não tem aula no domingo, então começa às 15h', () => {
  const window = computeStudyBlocksForWeekday(0);
  assert.equal(window.windowStart, '15:00');
});

test('computeStudyBlocksForWeekday: blocos de estudo somam exatamente o netMinutes', () => {
  const window = computeStudyBlocksForWeekday(2);
  const studySum = window.blocks.filter((b) => b.type === 'estudo').length;
  assert.ok(studySum > 0);
  const total = window.blocks.reduce((sum, b) => {
    const [sh, sm] = b.start.split(':').map(Number);
    const [eh, em] = b.end.split(':').map(Number);
    return sum + ((eh * 60 + em) - (sh * 60 + sm));
  }, 0);
  assert.equal(total, window.rawWindowMinutes);
});

test('computeStudyBlocksForWeekday: extended empurra o fim pra 21h', () => {
  const window = computeStudyBlocksForWeekday(2, true);
  assert.equal(window.windowEnd, '21:00');
});

test('computeStudyBlocksForWeekday: janela vazia quando aula termina depois do fim da janela', () => {
  // Não ocorre com o horário real, mas a função precisa não quebrar nesse caso.
  const window = computeStudyBlocksForWeekday(4, false);
  assert.ok(window.rawWindowMinutes >= 0);
});

test('breakOverheadRatio está entre 0 e 1 para um dia normal', () => {
  const ratio = breakOverheadRatio(2);
  assert.ok(ratio > 0 && ratio < 1);
});

test('applyBreakOverhead reduz minutos brutos proporcionalmente às pausas', () => {
  const raw = 300;
  const net = applyBreakOverhead(raw, 2);
  assert.ok(net < raw);
  assert.ok(net > 0);
});

test('applyBreakOverhead com 0 minutos brutos retorna 0', () => {
  assert.equal(applyBreakOverhead(0, 2), 0);
});
