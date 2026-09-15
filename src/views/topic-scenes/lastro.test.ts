import { describe, it, expect } from 'vitest';
import { validarLastro } from './lastro';
import type { InteractiveSummary } from '../../types/summary';
import type { SceneEntry } from './types';

const capitulo = {
  id: 'summary-teste',
  sections: [{ id: 's1', title: 'A linha e seus segmentos', content: 'Na República, Platão propõe que se divida uma linha em dois segmentos desiguais.' }],
} as unknown as InteractiveSummary;

const entrada = (quote: string, section = 'A linha e seus segmentos'): SceneEntry => ({
  chapterId: 'summary-teste',
  family: 'escala-de-graus',
  question: 'Quantos graus de conhecimento a linha separa?',
  items: [{ label: 'eikasia', claim: 'o grau mais distante do inteligível', section, quote }],
});

describe('Portão de lastro', () => {
  it('aceita o trecho que está literalmente na seção citada', () => {
    expect(validarLastro(entrada('divida uma linha em dois segmentos desiguais'), capitulo)).toEqual([]);
  });

  it('aceita diferença de caixa e de espaço em branco', () => {
    expect(validarLastro(entrada('DIVIDA   uma linha\nem dois segmentos'), capitulo)).toEqual([]);
  });

  it('rejeita trecho inventado que não está no capítulo', () => {
    expect(validarLastro(entrada('quatro graus de realidade segundo Aristóteles'), capitulo))
      .toEqual([{ chapterId: 'summary-teste', label: 'eikasia', reason: 'trecho-ausente' }]);
  });

  it('rejeita acento trocado, porque acento não é normalizado', () => {
    expect(validarLastro(entrada('Na Republica, Platao propoe'), capitulo))
      .toEqual([{ chapterId: 'summary-teste', label: 'eikasia', reason: 'trecho-ausente' }]);
  });

  it('rejeita seção que não existe no capítulo', () => {
    expect(validarLastro(entrada('divida uma linha', 'Doxa e episteme'), capitulo))
      .toEqual([{ chapterId: 'summary-teste', label: 'eikasia', reason: 'secao-ausente' }]);
  });

  it('rejeita entrada cujo capítulo não existe no catálogo', () => {
    expect(validarLastro(entrada('divida uma linha'), undefined))
      .toEqual([{ chapterId: 'summary-teste', label: '—', reason: 'capitulo-ausente' }]);
  });
});
