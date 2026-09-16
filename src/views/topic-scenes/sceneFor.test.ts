import { describe, it, expect } from 'vitest';
import { sceneFor, entradasValidas } from './sceneFor';
import { filosofia } from './data/filosofia';
import { sociologia } from './data/sociologia';
describe('Seleção de cena por capítulo', () => {
  it('devolve a cena pedida (Filosofia)', () => { const alvo = filosofia[0]; expect(sceneFor(alvo.chapterId)?.family).toBe(alvo.family); });
  it('devolve a cena pedida (Sociologia)', () => { const alvo = sociologia[0]; expect(sceneFor(alvo.chapterId)?.family).toBe(alvo.family); });
  it('falha fechada para capítulo sem entrada', () => {
    expect(sceneFor('summary-filosofia-o-nascimento-da-filosofia-do-mito-ao-logos')).toBeNull();
    expect(sceneFor('summary-sociologia-solidariedade-mecanica-e-solidariedade-organica')).toBeNull();
    expect(sceneFor('capitulo-inexistente')).toBeNull();
  });
  it('só expõe entradas com lastro, somando as duas matérias', () => { expect(entradasValidas().length).toBe(filosofia.length + sociologia.length); });
});
