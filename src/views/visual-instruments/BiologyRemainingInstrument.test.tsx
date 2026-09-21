import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { BIOLOGY_REMAINING, biologyRemainingReadout } from '../../lib/biologyRemainingLab';
import { buildVisualMap } from '../../lib/visualStudy';
import { biologyRemainingInstrument } from './BiologyRemainingInstrument';
import { findInstrument } from './registry';

const EXPECTED: Record<keyof typeof BIOLOGY_REMAINING, string> = {
  'genetics-intro': 'Introdução à Genética',
  'blood-groups': 'Alelos Múltiplos e Herança dos Grupos Sanguíneos',
  locomotion: 'Fisiologia da Sustentação e da Locomoção',
  endocrine: 'Coordenação Endócrina I',
};
const chapter = (topic: string) => interactiveSummaries.find(s => s.subject === 'Biologia' && s.topic === topic)!;
function props(topic: string) { return { map: buildVisualMap(chapter(topic)), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('mecanismos de Biologia', () => {
  it('cada configuração alcança exatamente seu capítulo, sem cruzar matérias', () => {
    const productIds = ['introducao-genetica','alelos-multiplos','sustentacao-locomocao','coordenacao-endocrina-i'];
    Object.values(EXPECTED).forEach((topic, index) => {
      expect(interactiveSummaries.filter(s => findInstrument(s)?.id === productIds[index]).map(s => s.topic)).toEqual([topic]);
    });
  });
  it('permite manipular cada cena com teclado e mantém o resultado anunciado', () => {
    for (const [id, topic] of Object.entries(EXPECTED)) {
      const Component = biologyRemainingInstrument(id as keyof typeof BIOLOGY_REMAINING);
      const view = render(<Component {...props(topic)} />);
      expect(screen.getByRole('img')).toHaveAccessibleName();
      const slider = screen.getByRole('slider');
      expect(slider).toHaveAccessibleName();
      const config = BIOLOGY_REMAINING[id as keyof typeof BIOLOGY_REMAINING];
      fireEvent.change(slider, { target: { value: String(config[4]) } });
      expect(screen.getByRole('img')).toHaveAccessibleName(new RegExp(biologyRemainingReadout(id as keyof typeof BIOLOGY_REMAINING, config[4]).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
      view.unmount();
    }
  });
  it('modela mecanismos com resultados distintos nas decisões pedagógicas', () => {
    expect(biologyRemainingReadout('genetics-intro', 1)).toBe('Aa: 50% A e 50% a');
    expect(biologyRemainingReadout('genetics-intro', 0)).toBe('AA: 100% A');
    expect(biologyRemainingReadout('blood-groups', 3)).toBe('AB: compatível');
    expect(biologyRemainingReadout('endocrine', 70)).toBe('30% de estímulo relativo');
  });
});
