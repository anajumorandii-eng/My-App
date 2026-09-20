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

  it('cada configuração de geometria plana alcança exatamente seu capítulo', () => {
    const esperado: Record<string, string> = {
      'geometria-plana-fundamentos': 'Introdução à Geometria Plana',
      'angulos-triangulo': 'Ângulos em Triângulos',
      'angulos-poligono': 'Ângulos em Polígonos',
      'angulos-circunferencia': 'Ângulos e Circunferências',
      'simetrias-congruencias': 'Simetrias e Congruências',
      'simetrias-i': 'Identificação de Simetrias I',
      'simetrias-ii': 'Identificação de Simetrias II',
      'geometria-proporcionalidade': 'A Geometria da Proporcionalidade',
      'semelhanca-triangulos': 'Semelhança de Triângulos',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('cada instrumento de medidas e áreas alcança exatamente seu capítulo', () => {
    const esperado: Record<string, string> = {
      'triangulo-retangulo-metrico': 'Triângulo Retângulo',
      'geometria-metrica-plana': 'A Geometria Métrica Plana',
      'areas-poligonos': 'Áreas de Polígonos',
      'area-circulo-partes': 'Área do Círculo e de suas Partes',
      'razoes-areas-planas': 'Razões entre Áreas de Figuras Planas',
      'areas-figuras-planas': 'Áreas de Figuras Planas',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('cada configuração de álgebra alcança exatamente seu capítulo', () => {
    const esperado: Record<string, string> = {
      'tecnicas-algebricas': 'Técnicas Algébricas',
      igualdades: 'Igualdades',
      desigualdades: 'Desigualdades',
      'modelagem-algebrica-i': 'Modelagem Algébrica de Problemas I',
      'modelagem-algebrica-ii': 'Modelagem Algébrica de Problemas II',
      'representacao-geometrica-inequacoes': 'Representação Geométrica de Inequações',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('cada configuração de matrizes e sistemas alcança exatamente seu capítulo', () => {
    const esperado: Record<string, string> = {
      'sistemas-equacoes': 'Sistemas de Equações',
      'tabelas-matrizes': 'Tabelas e Matrizes',
      'multiplicacao-matrizes': 'Multiplicação de Matrizes',
      determinantes: 'Determinantes',
      'discussao-sistemas': 'Discussão de Sistemas Lineares',
    };
    for (const [id, topic] of Object.entries(esperado)) {
      expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === id).map((s) => s.topic), id).toEqual([topic]);
    }
  });

  it('separa PA de PG pelo tópico e pela regra', () => {
    expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === 'progressao-aritmetica').map((s) => s.topic)).toEqual(['Progressão Aritmética']);
    expect(interactiveSummaries.filter((s) => findInstrument(s)?.id === 'progressao-geometrica').map((s) => s.topic)).toEqual(['Progressão Geométrica']);
  });
});
