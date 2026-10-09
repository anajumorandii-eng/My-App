import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { buildVisualMap } from '../lib/visualStudy';
import { HumanitiesConcepts } from './HumanitiesConcepts';

describe('percurso de Humanas', () => {
  it('seleciona o ID real pelo teclado sem promover o estado de aprendizagem', async () => {
    const map = buildVisualMap(interactiveSummaries.find(s => s.id === 'summary-geografia-relevo-brasileiro')!);
    const select = vi.fn();
    const node = map.nodes[1];
    const props = { map, states: { [node.id]: 'aplicacao-instavel' as const }, selectedId: null, onSelect: select };
    const { rerender } = render(<HumanitiesConcepts {...props} />);
    await userEvent.setup().click(screen.getByText('Conceitos do capítulo'));
    const button = screen.getByRole('button', { name: new RegExp(node.label) });
    expect(within(button).getByText('Aplicação instável')).toBeInTheDocument();
    button.focus();
    await userEvent.setup().keyboard('{Enter}');
    expect(select).toHaveBeenCalledExactlyOnceWith(node.id);
    rerender(<HumanitiesConcepts {...props} selectedId={node.id} />);
    expect(button).toHaveAttribute('aria-pressed', 'true');
    expect(within(button).getByText('Aplicação instável')).toBeInTheDocument();
    expect(screen.getAllByText('Não avaliado')).toHaveLength(map.nodes.length - 1);
  });
});
