import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { BOARDS, findBoard, supportsIllustratedBoard } from './registry';

const capitulo = (fragmento: string) => {
  const achado = interactiveSummaries.find((item) =>
    `${item.subject} ${item.topic} ${item.title}`.toLowerCase().includes(fragmento.toLowerCase()));
  if (!achado) throw new Error(`capítulo de teste não encontrado: ${fragmento}`);
  return achado;
};

describe('registro de pranchas', () => {
  it('entrega a prancha adiabática ao capítulo das transformações particulares', () => {
    const summary = capitulo('transformações particulares');
    expect(supportsIllustratedBoard(summary)).toBe(true);
    expect(findBoard(summary)?.id).toBe('adiabatica');
  });

  it('recusa capítulo sem prancha em vez de emprestar a de outro assunto', () => {
    // A recusa é a regra do projeto, não um efeito colateral: sem representação
    // fiel, a tela diz que falta a prancha em vez de ilustrar com algo alheio.
    const summary = capitulo('Revolução Francesa');
    expect(supportsIllustratedBoard(summary)).toBe(false);
    expect(findBoard(summary)).toBeNull();
  });

  it('não casa prancha de uma matéria com capítulo de outra', () => {
    // As keywords são genéricas o bastante para colidir entre matérias — o
    // filtro por subject é o que impede uma prancha de Física atender Química.
    for (const board of BOARDS) {
      const alheios = interactiveSummaries.filter((item) => item.subject !== board.subject);
      for (const item of alheios) {
        expect(findBoard(item)?.id).not.toBe(board.id);
      }
    }
  });

  it('mantém id único por prancha', () => {
    const ids = BOARDS.map((board) => board.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('não registra prancha que nenhum capítulo alcança', () => {
    // Uma entrada cujas keywords não casam com nada é prancha escrita e nunca
    // exibida — o tipo de coisa que passa despercebida até alguém abrir a tela.
    for (const board of BOARDS) {
      const alcancados = interactiveSummaries.filter((item) => findBoard(item)?.id === board.id);
      expect(alcancados.length, `prancha "${board.id}" não alcança capítulo nenhum`).toBeGreaterThan(0);
    }
  });
});
