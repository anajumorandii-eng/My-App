import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { LinguagensLiteratura, LINGUAGENS_LITERATURA_SCENE_IDS } from './LinguagensLiteratura';
import type { SceneEntry } from '../types';

const pessoa: SceneEntry = {
  chapterId: 'summary-literatura-fernando-pessoa', family: 'tipologia', question: 'Como os heterônimos diferem?',
  items: [
    { label: 'Alberto Caeiro', claim: 'olhar sem metafísica', section: 'Pessoa', quote: 'ver as coisas como são' },
    { label: 'Ricardo Reis', claim: 'medida clássica', section: 'Pessoa', quote: 'aceitação do destino' },
    { label: 'Álvaro de Campos', claim: 'máquina e desilusão', section: 'Pessoa', quote: 'exaltação futurista' },
  ],
};

const vanguardas: SceneEntry = {
  chapterId: 'summary-literatura-vanguardas-artisticas', family: 'tipologia', question: 'Como as vanguardas rompem?',
  items: [
    { label: 'Futurismo', claim: 'exalta velocidade', section: 'Vanguardas', quote: 'máquina e velocidade' },
    { label: 'Cubismo', claim: 'decompõe planos', section: 'Vanguardas', quote: 'planos simultâneos' },
    { label: 'Expressionismo', claim: 'deforma a imagem', section: 'Vanguardas', quote: 'expressar angústia' },
  ],
};

describe('LinguagensLiteratura', () => {
  it('usa artefatos próprios, e não a grade genérica de tipos', () => {
    render(<LinguagensLiteratura entry={pessoa} />);
    expect(document.querySelector('[data-literature-artifact="heteronyms"]')).not.toBeNull();
    expect(document.querySelector('[data-literature-board="detailed"]')).not.toBeNull();
    fireEvent.click(screen.getByRole('button', { name: /Ricardo Reis/i }));
    expect(screen.getAllByText(/medida clássica/i)).toHaveLength(2);
  });

  it('mantém os capítulos especializados explicitamente registrados', () => {
    expect(LINGUAGENS_LITERATURA_SCENE_IDS.has(pessoa.chapterId)).toBe(true);
    expect(LINGUAGENS_LITERATURA_SCENE_IDS.has(vanguardas.chapterId)).toBe(true);
  });
});
