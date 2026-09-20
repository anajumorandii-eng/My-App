import { describe, expect, it } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { findBoard } from '../visual-boards/registry';
import { INSTRUMENTS, findInstrument } from './registry';

describe('registro de instrumentos', () => {
  it('não registra instrumento que nenhum capítulo alcança', () => {
    for (const item of INSTRUMENTS) {
      const alcancados = interactiveSummaries.filter((s) => findInstrument(s)?.id === item.id);
      expect(alcancados.length, `instrumento "${item.id}" não alcança capítulo nenhum`).toBeGreaterThan(0);
    }
  });

  it('não empresta instrumento de uma matéria para capítulo de outra', () => {
    for (const item of INSTRUMENTS) {
      const alheios = interactiveSummaries.filter((s) => s.subject !== item.subject);
      for (const s of alheios) expect(findInstrument(s)?.id).not.toBe(item.id);
    }
  });

  it('mantém id único por instrumento', () => {
    const ids = INSTRUMENTS.map((item) => item.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('não disputa capítulo com prancha autoral', () => {
    // A cena desenhada à mão sempre ganha, e a tela consulta os dois registros
    // nessa ordem. Um capítulo que casasse com os dois esconderia a cena atrás
    // de um instrumento genérico — que é justamente o que não pode acontecer.
    const disputados = interactiveSummaries.filter((s) => findBoard(s) && findInstrument(s));
    expect(disputados.map((s) => s.topic)).toEqual([]);
  });

  it('só entra onde o instrumento é o objeto do capítulo', () => {
    // "Determinantes", "Estatística Descritiva" e "O Universo Tridimensional"
    // são Matemática e não têm instrumento: o último trata de retas e planos no
    // espaço, não de sólidos, então o instrumento de sólidos não lhe serve.
    // Preencher a tela com o que estiver à mão seria emprestar ilustração.
    for (const topico of ['Determinantes', 'Estatística Descritiva', 'O Universo Tridimensional']) {
      const item = interactiveSummaries.find((s) => s.topic === topico);
      expect(item, `capítulo "${topico}" sumiu do currículo`).toBeDefined();
      expect(findInstrument(item!)).toBeNull();
    }
  });

  it('cada instrumento de sólidos alcança exatamente o capítulo de que é objeto', () => {
    const esperado: Record<string, string> = {
      'cubos-paralelepipedos': 'Cubos e Paralelepípedos',
      prismas: 'Prismas',
      piramides: 'Pirâmides',
      'solidos-de-revolucao': 'Sólidos de Revolução',
      'razoes-entre-volumes': 'Razões entre Volumes de Sólidos',
    };
    for (const [id, topico] of Object.entries(esperado)) {
      const alcancados = interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic);
      expect(alcancados, id).toEqual([topico]);
    }
  });
});
