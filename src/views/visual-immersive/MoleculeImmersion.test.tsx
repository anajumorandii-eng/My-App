import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { MOLECULAS } from '../../lib/geometriaMolecular';
import MoleculeImmersion, { VSEPR_PHASES } from './MoleculeImmersion';
import { SEQUENCIA } from './vseprStages';

// O jsdom não tem WebGL: o motor não monta e a cena fica com a casca e o texto,
// que é o que estes testes conferem. O desenho é conferido no navegador.
const etapas = () => screen.getAllByRole('button', { name: /^0[1-5]/ });
const leitura = (container: HTMLElement) => container.querySelector('.cr-temp-number')?.textContent;
const graus = (valor: number) => `${valor.toLocaleString('pt-BR', { maximumFractionDigits: 1 })}°`;

describe('cena imersiva de geometria molecular', () => {
  it('cada etapa mostra o ângulo que a biblioteca dá para a molécula dela', () => {
    const { container } = render(<MoleculeImmersion />);
    expect(etapas()).toHaveLength(5);
    SEQUENCIA.forEach((id, index) => {
      fireEvent.click(etapas()[index]);
      expect(leitura(container)).toBe(graus(MOLECULAS[id].anguloGraus));
    });
  });

  it('as quatro previsões têm a resposta da repulsão das nuvens', () => {
    const certas = VSEPR_PHASES.filter(phase => phase.predict).map(phase => phase.predict!.options[phase.predict!.right]);
    expect(certas).toEqual(['120°', 'Não, sai do plano', 'Fecha', 'Angular']);
    expect(VSEPR_PHASES[4].predict).toBeUndefined();
  });

  it('errar que o par livre abre o ângulo explica por que ele fecha', () => {
    render(<MoleculeImmersion />);
    fireEvent.click(etapas()[2]);
    fireEvent.click(screen.getByRole('button', { name: 'Abre' }));
    expect(etapas()[3]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('status')).toHaveTextContent(/Não foi isso\..*empurra as ligações/);
  });

  // A pegadinha de prova: ligação polar nas duas, molécula polar em uma só.
  it('na última etapa compara a água polar com o CO₂ apolar', () => {
    const { container } = render(<MoleculeImmersion />);
    fireEvent.click(etapas()[4]);
    expect(screen.getByText(/se somam: a molécula é polar/)).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'CO₂, linear' }));
    expect(leitura(container)).toBe('μ = 0');
    expect(screen.getByText(/a soma é zero e a molécula é apolar/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'CO₂, linear' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('voltar a outra etapa recomeça a comparação pela água', () => {
    const { container } = render(<MoleculeImmersion />);
    fireEvent.click(etapas()[4]);
    fireEvent.click(screen.getByRole('button', { name: 'CO₂, linear' }));
    fireEvent.click(etapas()[0]);
    fireEvent.click(etapas()[4]);
    expect(leitura(container)).toBe(graus(MOLECULAS.H2O.anguloGraus));
  });

  it('descreve a molécula em texto para quem não vê a cena', () => {
    render(<MoleculeImmersion />);
    fireEvent.click(etapas()[3]);
    expect(screen.getByRole('img', { name: /NH₃.*4 nuvens.*1 par livre.*piramidal.*polar/ })).toBeInTheDocument();
  });

  it('usa a casca comum: tinta, pausa e aproximação', () => {
    render(<MoleculeImmersion temaInicial="caderno" />);
    expect(screen.getByRole('button', { name: /Ver em noite/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Pausar movimento/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Aproximar molécula' })).toBeInTheDocument();
  });
});
