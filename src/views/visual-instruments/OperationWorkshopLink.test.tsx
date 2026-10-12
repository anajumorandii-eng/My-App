import React from 'react';
import { act, cleanup, fireEvent, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { findInstrument } from './registry';
import { readingForSection, type Foundation } from './LiteratureFoundations';
import { PHILOSOPHY_OPERATIONS } from './PhilosophyOperations';
import { SOCIOLOGY_OPERATIONS } from './SociologyOperations';
import { LITERATURE_FOUNDATIONS } from './literatureFoundationsCatalog';

vi.mock('../topic-scenes/useSceneMotion', () => ({ useSceneMotion: () => ({ duration: 0 }) }));
afterEach(cleanup);

const GENERIC = ['tese → objeção → posição sustentada', 'caso → conceito → explicação sustentada', 'marca textual → efeito → interpretação sustentada'];

/** Os três catálogos que compartilham a `OperationWorkshop`, com o capítulo de cada entrada. */
const cases = ([['Filosofia', PHILOSOPHY_OPERATIONS], ['Sociologia', SOCIOLOGY_OPERATIONS], ['Literatura', LITERATURE_FOUNDATIONS]] as const)
  .flatMap(([subject, catalog]) => Object.entries(catalog as Record<string, Foundation>).map(([id, config]) => ({ subject, id, config })))
  .map(item => ({ ...item, summary: interactiveSummaries.find(s => s.subject === item.subject && s.topic === item.config.topic) }))
  .filter(item => item.summary && findInstrument(item.summary)?.id === item.id);

async function mount(item: (typeof cases)[number], props: { selectedId?: string | null; mode?: 'explorar' | 'reconstruir'; onSelect?: (id: string) => void }) {
  const instrument = findInstrument(item.summary!)!;
  const map = buildVisualMap(item.summary!);
  const view = render(<instrument.Component map={map} states={{}} selectedId={props.selectedId ?? null} onSelect={props.onSelect ?? (() => {})} hiddenEdgeIds={[]} mode={props.mode ?? 'explorar'}/>);
  await act(async () => { await vi.dynamicImportSettled(); });
  await waitFor(() => expect(view.container.querySelector('.lf-operation')).not.toBeNull());
  return { view, map };
}

describe('Oficina ligada ao mapa do capítulo', () => {
  it('cobre as oficinas das três matérias', () => {
    expect(cases.length).toBeGreaterThanOrEqual(70);
  });

  it.each(cases.map(c => [c.id, c] as const))('%s: o cartão 2 lê o capítulo, não a frase da família', async (_id, item) => {
    const { view, map } = await mount(item, {});
    const right = view.container.querySelector('.vs-concept-card--compression') ?? view.container.querySelectorAll('.vs-concept-card')[1];
    const text = right?.textContent ?? '';
    for (const generic of GENERIC) expect(text).not.toContain(generic);
    expect(text).toContain(readingForSection(item.config, map.nodes[2]?.label));
  });

  it.each(cases.map(c => [c.id, c] as const))('%s: o nó escolhido leva ao estado da mesma seção, e escolher estado não abre o inspetor', async (_id, item) => {
    const onSelect = vi.fn();
    const { view, map } = await mount(item, { onSelect });
    const buttons = [...view.container.querySelectorAll<HTMLButtonElement>('.lf-controls button')];
    const linked = item.config.states.findIndex(state => map.nodes.some(node => node.label === state.section));
    if (linked < 0) return;
    fireEvent.click(buttons[linked]);
    expect(onSelect).not.toHaveBeenCalled();
    const node = map.nodes.find(n => n.label === item.config.states[linked].section)!;
    cleanup();
    const again = await mount(item, { selectedId: node.id });
    const pressed = again.view.container.querySelector('.lf-controls button[aria-pressed="true"]');
    expect(pressed?.textContent).toContain(item.config.states[linked].label);
  });

  it.each(cases.slice(0, 6).map(c => [c.id, c] as const))('%s: em Reconstruir a conclusão só abre a pedido', async (_id, item) => {
    const { view } = await mount(item, { mode: 'reconstruir' });
    expect(view.container.querySelector('.lf-conclusion')).toBeNull();
    fireEvent.click(view.getByRole('button', { name: 'Conferir a conclusão' }));
    expect(view.container.querySelector('.lf-conclusion')?.textContent).toBe(item.config.states[0].conclusion);
  });
});
