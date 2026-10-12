import React from 'react';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { planStageFocus } from '../../lib/stageFocus';
import { TopicScene } from '../topic-scenes/TopicScene';
import { sceneFor } from '../topic-scenes/sceneFor';
import { resolveVisualRepresentation } from '../visualRepresentation';
import { STAGE_CASE_SCENE_IDS, sceneStageDeclaration } from './sceneDeclarations';
import type { SceneStageBridge } from './stageCases';
import type { StageMode } from './contract';

function bridge(id: string, over: Partial<SceneStageBridge> = {}): SceneStageBridge {
  const summary = interactiveSummaries.find((item) => item.id === id)!;
  return {
    map: buildVisualMap(summary), sections: summary.sections, activeStep: 0, onStepChange: vi.fn(), selectedId: null,
    onSelect: vi.fn(), mode: 'explorar' as StageMode, hiddenEdgeIds: [], ...over,
  };
}

const semNumero = (label: string) => label.replace(/^\d+\.\s*/, '');
function casoAberto(container: HTMLElement) {
  const viewport = container.querySelector('.tc-scene')!;
  return within(viewport as HTMLElement).getAllByRole('button', { pressed: true }).map((b) => b.textContent ?? '');
}

// Um capítulo por família migrada, escolhido entre os que a etapa de fato
// troca de caso (ver a varredura em stageFocus.test.ts).
const POR_FAMILIA = [
  'summary-biologia-cordados-tetrapodes', // FenomenoFrame (Biologia)
  'summary-quimica-cinetica-quimica', // FenomenoFrame (Química)
  'summary-quimica-isomeria', // QuimicaOrganica
  'summary-biologia-coordenacao-endocrina-ii', // BiologiaFisiologia
  'summary-biologia-bioenergetica-fermentacao-e-respiracao', // BiologiaProcessos
  'bio-ecologia-sucessao', // EcologyPlayer
];

describe('palco → cenas de Química e Biologia', () => {
  it.each(POR_FAMILIA)('%s: trocar de etapa abre o caso que a seção da etapa discute', (id) => {
    const entry = sceneFor(id)!;
    const summary = interactiveSummaries.find((item) => item.id === id)!;
    const plan = planStageFocus(entry.items, summary.sections);
    let stage = bridge(id);
    const view = render(<TopicScene summaryId={id} stage={stage} />);
    let mudou = 0;
    let anterior = casoAberto(view.container).join('|');
    for (let step = 0; step < plan.byStep.length; step++) {
      stage = { ...stage, activeStep: step };
      view.rerender(<TopicScene summaryId={id} stage={stage} />);
      const top = plan.byStep[step][0];
      if (top === undefined) continue;
      expect(casoAberto(view.container).some((text) => text.includes(semNumero(entry.items[top].label)))).toBe(true);
      const atual = casoAberto(view.container).join('|');
      if (atual !== anterior) mudou++;
      anterior = atual;
    }
    expect(mudou).toBeGreaterThan(0);
    // A faixa diz em que etapa a cena está.
    expect(screen.getByRole('group', { name: 'Etapa no palco' })).toHaveTextContent(stage.map.nodes[stage.activeStep].label);
    view.unmount();
  });

  it('tocar num caso abre o inspetor do nó da etapa que mais o discute', () => {
    const id = 'summary-quimica-isomeria';
    const stage = bridge(id);
    const entry = sceneFor(id)!;
    const plan = planStageFocus(entry.items, stage.sections);
    render(<TopicScene summaryId={id} stage={stage} />);
    const optica = entry.items.findIndex((item) => item.label === 'Óptica');
    fireEvent.click(screen.getAllByRole('button', { name: /Óptica/ })[0]);
    expect(stage.onSelect).toHaveBeenCalledWith(stage.map.nodes[plan.homeStep[optica]].id);
  });

  it('Reconstruir cobre a afirmação que entregaria a relação oculta e pede observação na cena', () => {
    const id = 'summary-quimica-radioatividade-o-estudo-das-radiacoes';
    const summary = interactiveSummaries.find((item) => item.id === id)!;
    const map = buildVisualMap(summary);
    const relacao = map.relations.findIndex((relation) => relation.keywords.some((k) => /alfa|beta|gama/.test(k)));
    expect(relacao).toBeGreaterThanOrEqual(0);
    render(<TopicScene summaryId={id} stage={bridge(id, { mode: 'reconstruir', hiddenEdgeIds: [map.edges[relacao].id] })} />);
    expect(screen.getByRole('note')).toHaveTextContent('Desafio na cena');
    expect(screen.getAllByText(/Afirmação coberta/).length).toBeGreaterThan(0);
  });

  it('fora do palco, a família continua a escolha local de antes', () => {
    const id = 'summary-quimica-isomeria';
    render(<TopicScene summaryId={id} />);
    expect(screen.queryByRole('group', { name: 'Etapa no palco' })).toBeNull();
    fireEvent.click(screen.getAllByRole('button', { name: /Óptica/ })[0]);
    expect(screen.getAllByRole('button', { pressed: true }).some((b) => /Óptica/.test(b.textContent ?? ''))).toBe(true);
  });

  it('Geometria Molecular: a etapa escolhe a molécula girável e liga os vetores quando fala de polaridade', () => {
    const id = 'summary-quimica-geometria-molecular';
    let stage = bridge(id);
    const view = render(<TopicScene summaryId={id} stage={stage} />);
    stage = { ...stage, activeStep: 2 };
    view.rerender(<TopicScene summaryId={id} stage={stage} />);
    expect(view.container.querySelector('[data-molecule]')?.getAttribute('data-molecule')).toBe('H2O');
    expect(screen.getByRole('button', { name: 'Vetores de ligação' })).toHaveAttribute('aria-pressed', 'true');
    stage = { ...stage, activeStep: 4 };
    view.rerender(<TopicScene summaryId={id} stage={stage} />);
    expect(view.container.querySelector('[data-molecule]')?.getAttribute('data-molecule')).toBe('NH3');
  });

  it('Geometria Molecular: tocar no par isolado explica com uma frase do capítulo', () => {
    const id = 'summary-quimica-geometria-molecular';
    const stage = bridge(id);
    const summary = interactiveSummaries.find((item) => item.id === id)!;
    const view = render(<TopicScene summaryId={id} stage={stage} />);
    fireEvent.click(screen.getByRole('button', { name: 'Par isolado do átomo central' }));
    const explicacao = view.container.querySelector('.gm-explain p')!.textContent!.replace(/…$/, '');
    expect(summary.sections.some((section) => section.content.includes(explicacao))).toBe(true);
  });

  it('todo ponto declarado por cena migrada nomeia um caso dela ou a própria seção', () => {
    for (const id of STAGE_CASE_SCENE_IDS) {
      const summary = interactiveSummaries.find((item) => item.id === id);
      if (!summary || resolveVisualRepresentation(summary) !== 'scene') continue;
      const entry = sceneFor(id)!;
      const declaration = sceneStageDeclaration(summary)!;
      const labels = new Set([...entry.items.map((item) => item.label), ...summary.sections.map((section) => section.title)]);
      for (const spot of declaration.hotspots ?? []) expect(labels.has(spot.label)).toBe(true);
    }
  });
});
