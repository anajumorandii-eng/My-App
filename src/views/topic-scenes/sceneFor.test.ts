import { describe, it, expect } from 'vitest';
import { sceneFor, entradasValidas } from './sceneFor';
import { filosofia } from './data/filosofia';
describe('Seleção de cena por capítulo', () => {
  it('devolve a cena pedida', () => { const alvo = filosofia[0]; expect(sceneFor(alvo.chapterId)?.family).toBe(alvo.family); });
  it('falha fechada para capítulo sem entrada', () => { expect(sceneFor('summary-filosofia-o-nascimento-da-filosofia-do-mito-ao-logos')).toBeNull(); expect(sceneFor('capitulo-inexistente')).toBeNull(); });
  it('só expõe entradas com lastro', () => { expect(entradasValidas().length).toBe(filosofia.length); });
});
