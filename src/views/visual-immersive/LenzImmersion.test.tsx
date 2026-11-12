import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import LenzImmersion, { LENZ_PHASES } from './LenzImmersion';

const etapas = () => screen.getAllByRole('button', { name: /^0[1-5]/ });
const leitura = (container: HTMLElement) => container.querySelector('.cr-temp-number')?.textContent;

describe('cena imersiva da lei de Lenz', () => {
  it('percorre as cinco etapas, e cada uma mostra a sua leitura', () => {
    const { container } = render(<LenzImmersion />);
    expect(etapas()).toHaveLength(5);
    expect(leitura(container)).toBe('Φ');
    fireEvent.click(screen.getByRole('button', { name: /Aproximar o ímã/ }));
    expect(etapas()[1]).toHaveAttribute('aria-current', 'step');
    expect(leitura(container)).toBe('Φ ↑');
    fireEvent.click(etapas()[2]);
    expect(leitura(container)).toBe('i ↺');
    fireEvent.click(etapas()[3]);
    expect(leitura(container)).toBe('i ↻');
  });

  // Aproximar e afastar têm de dar respostas opostas no texto, como dão na física.
  it('diz que aproximar repele e afastar atrai', () => {
    render(<LenzImmersion />);
    fireEvent.click(etapas()[2]);
    expect(screen.getByText(/anti-horária.*vira polo norte e o repele/)).toBeInTheDocument();
    fireEvent.click(etapas()[3]);
    expect(screen.getByText(/horária para quem olha.*vira polo sul e o atrai/)).toBeInTheDocument();
  });

  it('as quatro previsões têm a resposta que a física dá', () => {
    const certas = LENZ_PHASES.filter(phase => phase.predict).map(phase => phase.predict!.options[phase.predict!.right]);
    expect(certas).toEqual(['Aumenta', 'Contra o campo do ímã', 'Inverte o sentido', 'Nula']);
    expect(LENZ_PHASES[4].predict).toBeUndefined();
  });

  it('errar a pegadinha do ímã parado explica que o que induz é a variação', () => {
    render(<LenzImmersion />);
    fireEvent.click(etapas()[3]);
    fireEvent.click(screen.getByRole('button', { name: 'Máxima, porque o fluxo é máximo' }));
    expect(etapas()[4]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('status')).toHaveTextContent(/Não foi isso\. O que induz corrente é a variação do fluxo/);
  });

  it('compara ímã em movimento e parado só na última etapa', () => {
    const { container } = render(<LenzImmersion />);
    expect(screen.queryByRole('group', { name: 'Cenário do ímã' })).not.toBeInTheDocument();
    fireEvent.click(etapas()[4]);
    expect(leitura(container)).toBe('i ≠ 0');
    fireEvent.click(screen.getByRole('button', { name: 'Ímã parado' }));
    expect(leitura(container)).toBe('i = 0');
    expect(screen.getByText(/não há corrente/)).toBeInTheDocument();
    expect(container.querySelector('.cr-temp-caption')).toHaveTextContent('Fluxo constante');
  });

  it('o detalhe aberto acompanha o cenário', () => {
    render(<LenzImmersion />);
    fireEvent.click(etapas()[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Inspecionar espira' }));
    expect(screen.getByText(/É assim que um gerador funciona/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ímã parado' }));
    expect(screen.getByText(/Um ímã encostado numa bobina não acende nada/)).toBeInTheDocument();
  });

  it('voltar a uma etapa e retornar reabre a comparação no ímã em movimento', () => {
    render(<LenzImmersion />);
    fireEvent.click(etapas()[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Ímã parado' }));
    fireEvent.click(etapas()[1]);
    fireEvent.click(etapas()[4]);
    expect(screen.getByRole('button', { name: 'Ímã em movimento' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('usa a mesma casca da outra cena: pausa, tinta e câmera', () => {
    const { container } = render(<LenzImmersion />);
    expect(container.querySelector('.crivo-immersion')).toHaveAttribute('data-tema', 'caderno');
    fireEvent.click(screen.getByRole('button', { name: /Ver em noite/ }));
    expect(container.querySelector('.crivo-immersion')).toHaveAttribute('data-tema', 'noite');
    const pausa = screen.getByRole('button', { name: /Pausar movimento/ });
    fireEvent.click(pausa);
    expect(screen.getByRole('button', { name: /Retomar movimento/ })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getByRole('button', { name: 'Aproximar cena' }));
    expect(screen.getByRole('button', { name: 'Afastar cena' })).toHaveAttribute('aria-pressed', 'true');
  });
});
