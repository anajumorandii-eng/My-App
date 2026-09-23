import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { TopicScene } from './TopicScene';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { visualCandidates } from '../visualRepresentation';

const cases = [
  ['bio-ecologia-ciclo-nitrogenio', /N₂.*amônia.*nitrito.*nitrato.*N₂/i],
  ['bio-ecologia-eutrofizacao', /nutrientes.*floração.*luz.*oxigênio.*peixes/i],
  ['bio-ecologia-dinamica-populacoes', /muitos descendentes.*poucos descendentes/i],
  ['bio-ecologia-invasoras-controle-biologico', /invasora.*nativa.*recurso/i],
  ['bio-ecologia-sucessao', /pioneira.*gramíneas.*arbustos.*árvores/i],
  ['bio-ecologia-ciclo-hidrologico-poluicao-agua', /fonte.*água.*efeito/i],
] as const;

describe('roteamento de ecologia', () => {
  for (const [id, name] of cases) {
    it(`seleciona a geometria própria de ${id}`, () => {
      const view = render(<TopicScene summaryId={id}/>);
      expect(screen.getByRole('img', { name })).toBeInTheDocument();
      view.unmount();
    });
  }
  it('mantém experimento prioritário e uma cena de biologia fora do lote', () => {
    const chapter = interactiveSummaries.find(item => item.id === 'bio-ecologia-introducao')!;
    expect(visualCandidates(chapter)[0]).toEqual({ kind: 'experiment', id: 'ecology' });
    render(<TopicScene summaryId="summary-biologia-algas"/>);
    expect(screen.getByRole('img', { name: /luz vermelha se atenua/i })).toBeInTheDocument();
  });
});
