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
  'air-pollution': 'Poluição do Ar',
  'climate-pops': 'Poluição: Aquecimento Global, POPs e Biorremediação',
  inorganic: 'Composição Química Celular: Compostos Inorgânicos',
  // Trocados em 27/09: o citoesqueleto está no resumo II; a rota de secreção
  // (RER, Golgi), no I. Cada capítulo mostrava o assunto do outro.
  'cytoplasm-one': 'Citoplasma: Estrutura e Componentes II',
  'cytoplasm-two': 'Citoplasma: Estrutura e Componentes I',
  nucleus: 'Núcleo Celular',
  'chromosome-mutations': 'Mutações Cromossômicas e Gametogênese',
  biotechnology: 'Biotecnologia',
  cnidarians: 'Poríferos e Cnidários',
  'body-plan': 'Arquitetura Corporal dos Animais e o Filo dos Platelmintos e dos Nematódeos',
  insects: 'Artrópodes: Insetos, Crustáceos e Miriápodes',
  arachnids: 'Artrópodes: Aracnídeos',
  fish: 'Introdução aos Cordados e os Peixes',
  angiosperms: 'Plantas Terrestres II: Gimnospermas e Angiospermas',
  procaryotes: 'Procariotos',
  senses: 'Sistemas Sensoriais: Visão e Audição',
  reproduction: 'Reprodução Humana e Métodos Contraceptivos',
  'plant-tissues': 'Histologia e Morfologia Vegetal',
  'stems-leaves': 'Morfofisiologia Vegetal: Caules e Folhas',
};
const chapter = (topic: string) => interactiveSummaries.find(s => s.subject === 'Biologia' && s.topic === topic)!;
function props(topic: string) { return { map: buildVisualMap(chapter(topic)), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const }; }
describe('mecanismos de Biologia', () => {
  it('cada configuração alcança exatamente seu capítulo, sem cruzar matérias', () => {
    Object.values(EXPECTED).forEach((topic) => {
      expect(findInstrument(chapter(topic))?.subject).toBe('Biologia');
      expect(interactiveSummaries.filter(s => findInstrument(s)?.id === findInstrument(chapter(topic))?.id).map(s => s.topic)).toEqual([topic]);
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
    expect(biologyRemainingReadout('angiosperms', 2)).toBe('fruto (do ovário)');
    expect(biologyRemainingReadout('procaryotes', 1)).toBe('transdução');
  });
  it('distingue dispersão no ar de transformação de contaminantes por biorremediação', () => {
    const air = render(React.createElement(biologyRemainingInstrument('air-pollution'), props(EXPECTED['air-pollution'])));
    // Desde 27/09 a cena mostra a inversão térmica, que o resumo descreve como
    // o que prende a dispersão; a leitura inicial é a dispersão normal.
    expect(air.container.querySelector('[data-bio-system="thermal-inversion"]')).not.toBeNull();
    expect(air.container.textContent).toContain('dispersão');
    air.unmount();

    const climate = render(React.createElement(biologyRemainingInstrument('climate-pops'), props(EXPECTED['climate-pops'])));
    expect(climate.container.querySelector('[data-bio-system="bioremediation"]')).not.toBeNull();
    expect(climate.container.textContent).toContain('bactérias, fungos, plantas');
    climate.unmount();
  });
});
