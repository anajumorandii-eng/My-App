import React from 'react';
import { act, cleanup, render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { INSTRUMENTS, findInstrument } from './registry';

afterEach(cleanup);

// 23 instrumentos escreviam no cartão esquerdo o texto do nó 0 enquanto o
// boardPair pintava ali a cor e a seleção do nó 1: clicar no cartão acendia a
// evidência de uma relação e mostrava o enunciado de outra. Aqui o cartão
// selecionado precisa trazer o rótulo do próprio nó que o selecionou.
describe('contrato do par de cartões nos instrumentos', () => {
  // Um caso por matéria mantém a mesma cobertura sem submeter centenas de
  // renderizações ao prazo de um único teste, e identifica a frente da falha.
  it.each([...new Set(INSTRUMENTS.map(item => item.subject))])('%s: o cartão aceso mostra o nó que ele representa', async subject => {
    const erros: string[] = [];
    for (const item of INSTRUMENTS.filter(item => item.subject === subject)) {
      const summary = interactiveSummaries.find((s) => findInstrument(s)?.id === item.id);
      if (!summary) continue;
      const map = buildVisualMap(summary);
      const [n0, n1, n2] = map.nodes;
      if (!n0 || !n1 || !n2) continue;
      for (const node of [n1, n2]) {
        const view = render(
          <item.Component map={map} states={{}} selectedId={node.id} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar" />,
        );
        await act(async () => { await vi.dynamicImportSettled(); });
        await waitFor(() => expect(view.queryByText('Carregando representação…')).not.toBeInTheDocument());
        const aceso = view.container.querySelector('.vs-concept-card.is-selected strong')?.textContent ?? '';
        const outro = node === n1 ? n0 : n1;
        if (outro.label !== node.label && aceso === outro.label) {
          erros.push(`${item.id}: cartão de "${node.label}" mostra "${outro.label}"`);
        }
        view.unmount();
      }
    }
    expect(erros).toEqual([]);
  }, 30_000);
});
