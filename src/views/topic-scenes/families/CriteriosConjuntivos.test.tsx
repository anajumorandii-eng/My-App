import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { CriteriosConjuntivos } from './CriteriosConjuntivos';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-sociologia-o-que-e-o-fato-social',
  family: 'criterios-conjuntivos',
  question: 'O que torna um fenômeno um fato social?',
  items: [
    { label: 'Exterioridade', claim: 'existe fora da consciência individual', section: 'Os três traços', quote: 'preexiste ao indivíduo' },
    { label: 'Coercitividade', claim: 'impõe-se ao indivíduo', section: 'Os três traços', quote: 'exerce coerção sobre o indivíduo' },
    { label: 'Generalidade', claim: 'espalha-se por todo o grupo', section: 'Os três traços', quote: 'é geral em toda a extensão do grupo' },
  ],
};

describe('Critérios conjuntivos', () => {
  it('abre com a pergunta e nenhum critério marcado', () => {
    render(<CriteriosConjuntivos entry={entry} />);
    expect(screen.getByRole('heading', { level: 4 })).toHaveTextContent('O que torna um fenômeno');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('marca um critério por teclado com aria-pressed', () => {
    render(<CriteriosConjuntivos entry={entry} />);
    const botao = screen.getByRole('button', { name: 'Exterioridade' });
    fireEvent.click(botao);
    expect(botao).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('troca o veredito ao desmarcar, sem acumular o veredito anterior', () => {
    render(<CriteriosConjuntivos entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Exterioridade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Coercitividade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Generalidade' }));
    const veredito = screen.getByRole('status').textContent;
    fireEvent.click(screen.getByRole('button', { name: 'Coercitividade' }));
    const status = screen.getByRole('status');
    expect(status.textContent).not.toEqual(veredito);
  });

  it('mostra a citação dos critérios marcados', () => {
    render(<CriteriosConjuntivos entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Exterioridade' }));
    expect(screen.getByText(/preexiste ao indivíduo/)).toBeInTheDocument();
  });

  it('deixa explícito que os critérios valem em conjunto: derrubar um muda o veredito', () => {
    render(<CriteriosConjuntivos entry={entry} />);
    fireEvent.click(screen.getByRole('button', { name: 'Exterioridade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Coercitividade' }));
    fireEvent.click(screen.getByRole('button', { name: 'Generalidade' }));
    expect(screen.getByRole('status')).toHaveTextContent(/válido|reúne/i);

    fireEvent.click(screen.getByRole('button', { name: 'Coercitividade' }));
    expect(screen.getByRole('status')).not.toHaveTextContent(/válido|reúne/i);
    expect(screen.getByRole('status')).toHaveTextContent('Coercitividade');
  });

  it('trata a combinação dos fatores climáticos como nota, não como quarto fator', () => {
    render(<CriteriosConjuntivos entry={{ ...entry, chapterId: 'summary-geografia-clima-mundial', items: [
      { label: 'Latitude', claim: 'insolação', section: 'Clima', quote: 'latitude' },
      { label: 'Altitude', claim: 'temperatura', section: 'Clima', quote: 'altitude' },
      { label: 'Nenhum isolado', claim: 'interação', section: 'Clima', quote: 'combinados' },
    ] }} />);
    expect(screen.queryByRole('button', { name: 'Nenhum isolado' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Latitude' }));
    fireEvent.click(screen.getByRole('button', { name: 'Altitude' }));
    expect(screen.getByRole('status')).toHaveTextContent('Reúne todos os critérios');
  });
});
