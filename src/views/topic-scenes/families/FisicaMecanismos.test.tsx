import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { fisica } from '../data/fisica';
import { FisicaMecanismos, PHYSICS_MECHANISM_IDS } from './FisicaMecanismos';

const entry = (id: string) => {
  const chapter = fisica.find(item => item.chapterId === id);
  if (!chapter) throw new Error(`Capítulo ausente: ${id}`);
  return chapter;
};

describe('mecanismos específicos de Física', () => {
  it('representa todos os cinco capítulos antes servidos por cartões', () => {
    for (const id of PHYSICS_MECHANISM_IDS) {
      const { unmount } = render(<FisicaMecanismos entry={entry(id)}/>);
      expect(screen.getByRole('img')).toHaveAttribute('aria-label', expect.stringContaining(entry(id).question));
      unmount();
    }
  });

  it('mostra a exceção fotovoltaica sem turbina ao selecionar energia solar', () => {
    render(<FisicaMecanismos entry={entry('summary-fisica-a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares')}/>);
    fireEvent.click(screen.getByRole('button', { name: 'Solar fotovoltaica' }));
    expect(screen.getByRole('img')).toHaveTextContent('células fotovoltaicas');
    expect(screen.getByRole('img')).not.toHaveTextContent('turbina + gerador');
    expect(screen.getByRole('status')).toHaveTextContent('não há turbina');
  });

  it('distingue polarização sem contato de transferência por contato', () => {
    render(<FisicaMecanismos entry={entry('summary-fisica-eletrostatica-processos-de-eletrizacao-e-aplicacoes')}/>);
    fireEvent.click(screen.getByRole('button', { name: 'Indução' }));
    expect(screen.getByRole('img')).toHaveTextContent('sem contato');
    expect(screen.getByRole('img')).toHaveTextContent('carga total permanece zero');
  });
});
