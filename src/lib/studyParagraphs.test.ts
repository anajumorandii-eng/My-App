import assert from 'node:assert/strict';
import test from 'node:test';
import { studyParagraphs } from './studyParagraphs';

test('separa ideias por transições e preserva palavras, fórmulas e referências', () => {
  const text = 'A primeira ideia é sustentada por [F1]. Além disso, $v^2=v_0^2+2a\\Delta s$ permite conferir o cálculo.\n\nA fonte continua integralmente.';
  const parts = studyParagraphs(text);
  assert.equal(parts.length, 3);
  assert.equal(parts.join(' ').replace(/\s+/g, ' '), text.replace(/\s+/g, ' '));
});
test('não corta um texto por comprimento nem separa uma frase', () => {
  const text = 'Uma explicação sem mudança explícita de ideia '.repeat(100);
  assert.deepEqual(studyParagraphs(text), [text]);
});
