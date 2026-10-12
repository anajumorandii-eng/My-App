import React from 'react';
import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen, within } from '@testing-library/react';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { currentAffairsContextInstrument } from './CurrentAffairsContextInstrument';

const summary = interactiveSummaries.find((item) => item.id === 'atu-cop30-belem')!;
const Board = currentAffairsContextInstrument('cop30-belem');
const mount = (mode: 'explorar' | 'reconstruir') =>
  render(<Board map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={() => {}} hiddenEdgeIds={[]} mode={mode} />);

describe('dossiê da COP30', () => {
  it('desenha o caso, e não folhas genéricas: Belém, pacote, ausência e atores', () => {
    mount('explorar');
    const scene = screen.getByRole('group', { name: /Dossiê da COP30/ });
    for (const text of ['Belém (PA)', 'Pacote Político de Belém', '13 decisões de financiamento', 'ausente no texto final', 'países vulneráveis', 'povos indígenas']) {
      expect(within(scene).getByText(text)).toBeInTheDocument();
    }
  });

  it('a lente acende só as peças do seu tipo de evidência', () => {
    const { container } = mount('explorar');
    const lit = () => [...container.querySelectorAll('.vs-cop-piece[data-on]')].map((node) => node.getAttribute('aria-label'));
    expect(lit().every((label) => /fato$/.test(label!))).toBe(true);
    fireEvent.click(within(screen.getByRole('group', { name: 'Tipo de evidência em foco' })).getByRole('button', { name: 'Hipótese' }));
    expect(lit()).toEqual([expect.stringMatching(/efeito futuro/)]);
  });

  it('clicar numa peça da cena troca a lente para o tipo dela', () => {
    mount('explorar');
    fireEvent.click(screen.getByRole('button', { name: /avanço real, ambição incompleta/ }));
    expect(within(screen.getByRole('group', { name: 'Tipo de evidência em foco' })).getByRole('button', { name: 'Avaliação' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('em Reconstruir o tipo só aparece na cena depois de classificado certo, e a pegadinha é corrigida', () => {
    const { container } = mount('reconstruir');
    const tags = () => [...container.querySelectorAll('.vs-cop-scene text')].map((node) => node.textContent);
    expect(tags()).not.toContain('FATO');
    const sort = screen.getByRole('group', { name: 'Que tipo de evidência é esta afirmação?' });
    fireEvent.click(within(sort).getByRole('button', { name: 'Fato' }));
    expect(container.querySelector('.vs-cop-verdict')).toHaveTextContent('Certo.');
    expect(tags()).toContain('FATO');

    fireEvent.click(screen.getByRole('button', { name: 'Próxima afirmação' }));
    fireEvent.click(within(sort).getByRole('button', { name: 'Avaliação' }));
    expect(container.querySelector('.vs-cop-verdict')).toHaveTextContent(/É fato\..*Pegadinha/);
  });
});
