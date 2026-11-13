import assert from 'node:assert/strict';
import test from 'node:test';
import { FLASHCARD_FOCUS_BOARDS, describeBoardFocus, flashcardBoardFocus, flashcardFocusBoards } from './flashcardBoardFocus';

test('todo cartão com tópico recebe as seis bancas cadastradas, uma vez cada', () => {
  const focus = flashcardBoardFocus({ subject: 'Biologia', topicId: 'bio_ecologia' });
  assert.deepEqual([...focus.map(item => item.board)].sort(), [...FLASHCARD_FOCUS_BOARDS].sort());
  for (const item of focus) assert.ok(item.how.length > 0, item.board);
});

test('a ordem vai da banca que mais cobra para a que menos', () => {
  const rank = { frequente: 0, aparece: 1, 'nao-apareceu': 2, 'sem-dados': 3 };
  const focus = flashcardBoardFocus({ subject: 'Física', topicId: 'fis_circuitos' });
  for (let i = 1; i < focus.length; i++) assert.ok(rank[focus[i - 1].level] <= rank[focus[i].level]);
});

test('frequente exige peso na matéria, não só presença em metade das provas', () => {
  for (const item of flashcardBoardFocus({ subject: 'Física', topicId: 'fis_circuitos' })) {
    if (item.level === 'frequente') assert.ok(item.count / item.total >= 0.08 && item.editions * 2 >= item.observed, item.board);
  }
});

test('a leitura mostra a base da conta, e tópico nunca cobrado não entra no filtro da banca', () => {
  const famerp = flashcardBoardFocus({ subject: 'Português', topicId: 'por_lit_modernismo' }).find(item => item.board === 'FAMERP')!;
  assert.equal(famerp.level, 'nao-apareceu');
  assert.match(describeBoardFocus(famerp, 'Literatura'), /^0 de \d+ questões de Literatura, em 0 de \d+ provas\.$/);
  assert.ok(!flashcardFocusBoards({ subject: 'Português', topicId: 'por_lit_modernismo' }).includes('FAMERP'));
});

test('cartão sem tópico cadastrado não inventa incidência', () => {
  assert.deepEqual(flashcardBoardFocus({ subject: 'Biologia', topicId: undefined }), []);
});
