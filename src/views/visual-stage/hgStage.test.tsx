import React from 'react';
import { fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { planStageFocus } from '../../lib/stageFocus';
import { TopicScene } from '../topic-scenes/TopicScene';
import { sceneFor } from '../topic-scenes/sceneFor';
import { HISTORIA_GEOGRAFIA_IDS } from '../topic-scenes/families/HistoriaGeografia';
import { resolveVisualRepresentation } from '../visualRepresentation';
import { findInstrument } from '../visual-instruments/registry';
import { findBoard } from '../visual-boards/registry';
import IndependenceBoard from '../visual-boards/IndependenceBoard';
import type { BoardProps } from '../visual-boards/types';
import type { InteractiveSummary } from '../../types/summary';
import { stageDeclarationFor } from './declarations';
import { resolveStageDeclaration } from './contract';
import { LAYER_BY_STAGE, stepReading } from './hgLayers';
import type { SceneStageBridge } from './stageCases';

const summaries = new Map(interactiveSummaries.map((summary) => [summary.id, summary]));

function bridge(id: string, over: Partial<SceneStageBridge> = {}): SceneStageBridge {
  const summary = summaries.get(id)!;
  return {
    map: buildVisualMap(summary), sections: summary.sections, activeStep: 0, onStepChange: vi.fn(), selectedId: null,
    onSelect: vi.fn(), mode: 'explorar', hiddenEdgeIds: [], ...over,
  };
}

function boardProps(summary: InteractiveSummary, over: Partial<BoardProps> = {}): BoardProps {
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar', activeStep: 0, onStepChange: vi.fn(), ...over };
}

const HG_SCENES = interactiveSummaries.filter((summary) => HISTORIA_GEOGRAFIA_IDS.has(summary.id) && resolveVisualRepresentation(summary) === 'scene');
const pressedRecorte = (container: HTMLElement) =>
  within(container.querySelector('.hu-recortes') as HTMLElement).getAllByRole('button', { pressed: true }).map((b) => b.textContent ?? '');

describe('palco → cenas de História e Geografia', () => {
  it('cobre os capítulos de História e Geografia que abrem pela família de cenas', () => {
    // Medição de 12/10/2026: 103 dos 113 capítulos de História, Geografia e
    // Atualidades abrem por esta família. Se o número cair, alguém trocou a
    // representação de um capítulo e este teste deixou de vigiá-lo.
    expect(HG_SCENES.length).toBeGreaterThanOrEqual(100);
  });

  it.each(HG_SCENES.map((summary) => summary.id))('%s: cada etapa muda a cena — recorte citado e camada de leitura', (id) => {
    const entry = sceneFor(id)!;
    const summary = summaries.get(id)!;
    const plan = planStageFocus(entry.items, summary.sections);
    let stage = bridge(id);
    const view = render(<TopicScene summaryId={id} stage={stage} />);
    let anterior = '';
    for (let step = 0; step < stage.map.nodes.length; step++) {
      stage = { ...stage, activeStep: step };
      view.rerender(<TopicScene summaryId={id} stage={stage} />);
      const scene = view.container.querySelector('.hg-scene') as HTMLElement;
      expect(scene.getAttribute('data-hg-layer')).toBe(LAYER_BY_STAGE[stage.map.nodes[step].stage]);
      const top = plan.byStep[step][0];
      if (top !== undefined) expect(pressedRecorte(view.container)[0]).toContain(entry.items[top].label);
      const atual = scene.innerHTML;
      expect(atual).not.toBe(anterior);
      anterior = atual;
      // A frase que a camada põe sob a figura é da própria seção da etapa.
      const leitura = stepReading(summary.sections[step], entry.items[plan.byStep[step][0] ?? 0].label);
      if (leitura) expect(summary.sections[step].content).toContain(leitura);
    }
    view.unmount();
  });

  it('aplicação abre a comparação de dois recortes; missão cobre a afirmação até conferir', () => {
    const id = 'summary-geografia-sistema-de-fusos-horarios';
    const entry = sceneFor(id)!;
    let stage = bridge(id);
    const view = render(<TopicScene summaryId={id} stage={stage} />);
    const aplicacao = stage.map.nodes.findIndex((node) => node.stage === 'aplicacao');
    stage = { ...stage, activeStep: aplicacao };
    view.rerender(<TopicScene summaryId={id} stage={stage} />);
    expect(view.container.querySelectorAll('.hg-figure-panel')).toHaveLength(2);
    expect(screen.getByRole('group', { name: 'Comparação entre recortes' })).toBeInTheDocument();

    const exercicio = stage.map.nodes.findIndex((node) => node.stage === 'exercicio');
    stage = { ...stage, activeStep: exercicio };
    view.rerender(<TopicScene summaryId={id} stage={stage} />);
    expect(view.container.querySelectorAll('.hg-figure-panel')).toHaveLength(1);
    const detalhe = view.container.querySelector('.hg-detail') as HTMLElement;
    const ativo = entry.items.findIndex((item) => pressedRecorte(view.container)[0].includes(item.label));
    expect(detalhe).not.toHaveTextContent(entry.items[ativo].claim);
    // Escolher outro recorte na missão é a resposta dela: não move o palco.
    const outro = (ativo + 1) % entry.items.length;
    fireEvent.click(within(view.container.querySelector('.hu-recortes') as HTMLElement).getAllByRole('button')[outro]);
    expect(stage.onSelect).not.toHaveBeenCalled();
    expect(stage.onStepChange).not.toHaveBeenCalled();
    fireEvent.click(screen.getByRole('button', { name: 'Conferir este recorte' }));
    expect(view.container.querySelector('.hg-detail')).toHaveTextContent(entry.items[outro].claim);
  });

  it('em Explorar, tocar num recorte abre o inspetor do nó da etapa que o discute', () => {
    const id = 'summary-geografia-sistema-de-fusos-horarios';
    const entry = sceneFor(id)!;
    const stage = bridge(id, { activeStep: 1 });
    const plan = planStageFocus(entry.items, stage.sections);
    const view = render(<TopicScene summaryId={id} stage={stage} />);
    fireEvent.click(within(view.container.querySelector('.hu-recortes') as HTMLElement).getAllByRole('button')[3]);
    expect(stage.onSelect).toHaveBeenCalledWith(stage.map.nodes[plan.homeStep[3]].id);
  });

  it('Reconstruir cobre a afirmação que entregaria a relação oculta e pede observação na cena', () => {
    let achou = 0;
    for (const summary of HG_SCENES) {
      const map = buildVisualMap(summary);
      for (const edge of map.edges) {
        const view = render(<TopicScene summaryId={summary.id} stage={bridge(summary.id, { mode: 'reconstruir', hiddenEdgeIds: [edge.id] })} />);
        const veiled = view.container.querySelectorAll('[data-stage-veiled="true"]').length;
        if (veiled > 0) {
          achou++;
          expect(screen.getByRole('note')).toHaveTextContent('Desafio na cena');
          expect(view.container.querySelector('.hg-scene')!.hasAttribute('data-hg-layer')).toBe(false);
        }
        view.unmount();
        if (achou >= 3) return;
      }
    }
    expect(achou).toBeGreaterThan(0);
  });

  it('fora do palco, a família continua a escolha local de antes', () => {
    const id = 'summary-geografia-sistema-de-fusos-horarios';
    const view = render(<TopicScene summaryId={id} />);
    expect(screen.queryByRole('group', { name: 'Etapa no palco' })).toBeNull();
    expect(view.container.querySelector('.hg-scene')!.hasAttribute('data-hg-layer')).toBe(false);
    expect(view.container.querySelector('.hg-layer')).toBeNull();
    const botoes = within(view.container.querySelector('.hu-recortes') as HTMLElement).getAllByRole('button');
    fireEvent.click(botoes[2]);
    expect(botoes[2]).toHaveAttribute('aria-pressed', 'true');
  });

  it('pontos de investigação das cenas nomeiam um recorte da cena ou o título de um nó', () => {
    for (const summary of HG_SCENES) {
      const entry = sceneFor(summary.id)!;
      const map = buildVisualMap(summary);
      const declared = resolveStageDeclaration(map, stageDeclarationFor(summary, 'scene'));
      const labels = new Set([...entry.items.map((item) => item.label), ...map.nodes.map((node) => node.label)]);
      expect(declared.hotspots).toHaveLength(map.nodes.length);
      for (const spot of declared.hotspots) expect(labels.has(spot.label)).toBe(true);
    }
  });
});

const HG_INSTRUMENTS = interactiveSummaries.filter((summary) =>
  /^(História|Geografia|Atualidades)$/.test(String(summary.subject)) && resolveVisualRepresentation(summary) === 'instrument');

// O registro entrega os laboratórios embrulhados em lazyBoard: o primeiro
// render é o aviso de carregamento, e afirmar sobre ele passaria (ou falharia)
// sem que o instrumento tivesse sido montado.
async function renderLoaded(Component: React.ComponentType<BoardProps>, props: BoardProps) {
  const view = render(<Component {...props} />);
  await waitFor(() => expect(view.container.querySelector('.vs-instrument')).not.toBeNull());
  return view;
}

describe('palco → laboratórios de História, Geografia e Atualidades', () => {
  it.each(HG_INSTRUMENTS.map((summary) => summary.id))('%s: a faixa da etapa entra na cena e a etapa troca o que ela mostra', async (id) => {
    const summary = summaries.get(id)!;
    const Component = findInstrument(summary)!.Component;
    const view = await renderLoaded(Component, boardProps(summary));
    const vistos = new Set<string>();
    for (let step = 0; step < summary.sections.length; step++) {
      view.rerender(<Component {...boardProps(summary, { activeStep: step })} />);
      expect(screen.getByRole('group', { name: 'Etapa no palco' })).toHaveAttribute('data-stage-step', String(step));
      vistos.add(view.container.querySelector('.vs-instrument')!.innerHTML);
    }
    expect(vistos.size).toBeGreaterThan(1);
    // Os pontos declarados apontam para nós do mapa e nomeiam algo do capítulo ou do instrumento.
    const declared = resolveStageDeclaration(buildVisualMap(summary), stageDeclarationFor(summary, 'instrument'));
    expect(declared.hotspots).toHaveLength(buildVisualMap(summary).nodes.length);
    view.unmount();
  });

  it('COP30: a etapa acende as peças da seção dela e tocar numa peça abre o nó de onde ela saiu', async () => {
    const summary = summaries.get('atu-cop30-belem')!;
    const Component = findInstrument(summary)!.Component;
    const props = boardProps(summary, { activeStep: 1 });
    const view = await renderLoaded(Component, props);
    const acesas = [...view.container.querySelectorAll('[data-stage-step-piece="true"]')].map((piece) => piece.getAttribute('aria-label'));
    expect(acesas.some((label) => /Acordo de Paris|amazônico/.test(label ?? ''))).toBe(true);
    fireEvent.click(view.container.querySelector('[aria-label^="Pacote Político"]')!);
    expect(props.onSelect).toHaveBeenCalledWith(props.map.nodes[0].id);
  });

  it('fora do palco, os laboratórios não mostram a faixa da etapa', async () => {
    for (const summary of HG_INSTRUMENTS) {
      const Component = findInstrument(summary)!.Component;
      const view = await renderLoaded(Component, boardProps(summary, { activeStep: undefined, onStepChange: undefined }));
      expect(screen.queryByRole('group', { name: 'Etapa no palco' })).toBeNull();
      view.unmount();
    }
  });

  it('Independência: a etapa escolhe o eixo da prancha e a de pegadinhas acende o rodapé', () => {
    const summary = interactiveSummaries.find((item) => findBoard(item)?.id === 'independencia-brasil')!;
    const view = render(<IndependenceBoard {...boardProps(summary)} />);
    expect(view.container.querySelector('.independence-board__map')).toHaveAttribute('data-focus', 'processo');
    view.rerender(<IndependenceBoard {...boardProps(summary, { activeStep: 1 })} />);
    expect(view.container.querySelector('.independence-board__map')).toHaveAttribute('data-focus', 'guerras');
    const estrategia = buildVisualMap(summary).nodes.findIndex((node) => node.stage === 'estrategia');
    view.rerender(<IndependenceBoard {...boardProps(summary, { activeStep: estrategia })} />);
    expect(view.container.querySelector('footer')).toHaveAttribute('data-stage-focus', 'true');
    view.rerender(<IndependenceBoard {...boardProps(summary, { activeStep: undefined, onStepChange: undefined })} />);
    expect(view.container.querySelector('.independence-board__map')).toHaveAttribute('data-focus', 'nenhum');
  });
});
