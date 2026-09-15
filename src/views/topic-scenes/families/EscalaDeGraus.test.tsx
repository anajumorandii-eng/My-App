import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { EscalaDeGraus } from './EscalaDeGraus';
import type { SceneEntry } from '../types';

const entry: SceneEntry = {
  chapterId: 'summary-filosofia-a-alegoria-da-linha-dividida-e-o-conhecimento',
  family: 'escala-de-graus',
  question: 'Quantos graus separam a sombra da ideia?',
  items: [
    { label: 'eikasia', claim: 'imagens e sombras', section: 'A linha e seus segmentos', quote: 'a eikasia' },
    { label: 'pistis', claim: 'as coisas sensíveis', section: 'A linha e seus segmentos', quote: 'pistis' },
    { label: 'dianoia', claim: 'o raciocínio que ainda parte de hipóteses', section: 'A matemática como passagem', quote: 'dianoia' },
    { label: 'noesis', claim: 'a apreensão direta das ideias', section: 'Doxa e episteme', quote: 'noesis' },
  ],
};

describe('Escala de graus', () => {
  it('abre no primeiro degrau e anuncia a posição', () => {
    render(<EscalaDeGraus entry={entry} />);
    expect(screen.getByRole('status')).toHaveTextContent('imagens e sombras');
    expect(screen.getByRole('slider')).toHaveValue('0');
  });

  it('sobe de degrau e troca a afirmação', () => {
    render(<EscalaDeGraus entry={entry} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '3' } });
    expect(screen.getByRole('status')).toHaveTextContent('apreensão direta das ideias');
  });

  it('nomeia o degrau atual no rótulo acessível do desenho', () => {
    render(<EscalaDeGraus entry={entry} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '2' } });
    expect(screen.getByRole('img')).toHaveAccessibleName('Grau 3 de 4: dianoia');
  });

  it('usa a legenda de eixo do próprio capítulo quando presente', () => {
    const comEixo: SceneEntry = { ...entry, eixo: 'do grau mais distante ao mais próximo do inteligível' };
    render(<EscalaDeGraus entry={comEixo} />);
    expect(screen.getByText('do grau mais distante ao mais próximo do inteligível')).toBeInTheDocument();
  });

  it('usa uma legenda genérica quando o capítulo não declara eixo', () => {
    render(<EscalaDeGraus entry={entry} />);
    expect(screen.getByText('do primeiro ao último grau')).toBeInTheDocument();
  });
});
