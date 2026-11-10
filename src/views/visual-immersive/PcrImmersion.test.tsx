import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import PcrImmersion, { PCR_PHASES } from './PcrImmersion';
import { IMMERSIVE_SCENES, immersiveSceneFor } from './registry';

describe('cena imersiva da PCR', () => {
  it('percorre as cinco etapas pelo trilho e pelo botão de avançar', () => {
    render(<PcrImmersion />);
    const etapas = screen.getAllByRole('button', { name: /^0[1-5]/ });
    expect(etapas).toHaveLength(5);
    expect(etapas[0]).toHaveAttribute('aria-current', 'step');
    fireEvent.click(screen.getByRole('button', { name: /Aquecer a reação/ }));
    expect(etapas[1]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByText('95°')).toBeInTheDocument();
    fireEvent.click(etapas[3]);
    expect(screen.getByText(PCR_PHASES[3].text)).toBeInTheDocument();
    expect(screen.getByText('72°')).toBeInTheDocument();
  });

  it('compara a reação com e sem primers só na última etapa', () => {
    const { container } = render(<PcrImmersion />);
    const leitura = () => container.querySelector('.cr-temp-number')?.textContent;
    expect(screen.queryByRole('group', { name: 'Cenário da reação' })).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /^0[1-5]/ })[4]);
    expect(leitura()).toBe('02');
    fireEvent.click(screen.getByRole('button', { name: 'Sem primers' }));
    expect(screen.getByText(/Não há amplificação do trecho-alvo/)).toBeInTheDocument();
    expect(leitura()).toBe('00');
    expect(screen.getByText('Novas fitas sintetizadas')).toBeInTheDocument();
    // Voltar a uma etapa anterior não pode carregar o cenário sem primers.
    fireEvent.click(screen.getAllByRole('button', { name: /^0[1-5]/ })[2]);
    fireEvent.click(screen.getAllByRole('button', { name: /^0[1-5]/ })[4]);
    expect(screen.getByRole('button', { name: 'Com primers' })).toHaveAttribute('aria-pressed', 'true');
  });

  it('mostra o detalhe ao tocar no ponto de interesse e o recolhe ao trocar de etapa', () => {
    render(<PcrImmersion />);
    fireEvent.click(screen.getByRole('button', { name: 'Inspecionar dupla hélice' }));
    expect(screen.getByText(PCR_PHASES[0].detail)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Afastar molécula' })).toHaveAttribute('aria-pressed', 'true');
    fireEvent.click(screen.getAllByRole('button', { name: /^0[1-5]/ })[1]);
    expect(screen.queryByText(PCR_PHASES[0].detail)).not.toBeInTheDocument();
  });

  it('termina no desafio real do capítulo, não num botão que só reinicia a animação', () => {
    const onPractice = vi.fn();
    render(<PcrImmersion onPractice={onPractice} />);
    expect(screen.queryByRole('button', { name: 'Testar o que entendi' })).not.toBeInTheDocument();
    fireEvent.click(screen.getAllByRole('button', { name: /^0[1-5]/ })[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Testar o que entendi' }));
    expect(onPractice).toHaveBeenCalledTimes(1);
  });

  it('deixa pausar e retomar o movimento', () => {
    render(<PcrImmersion />);
    const pausa = screen.getByRole('button', { name: /Pausar movimento|Retomar movimento/ });
    const antes = pausa.getAttribute('aria-pressed');
    fireEvent.click(pausa);
    expect(pausa.getAttribute('aria-pressed')).not.toBe(antes);
  });
});

describe('registro de cenas imersivas', () => {
  // É protótipo de um capítulo só: registrar outro por engano trocaria a cena
  // dele por uma molécula de DNA que não é o assunto.
  it('atende só o capítulo de Biotecnologia', () => {
    expect(Object.keys(IMMERSIVE_SCENES)).toEqual(['summary-biologia-biotecnologia']);
    expect(immersiveSceneFor('summary-biologia-acidos-nucleicos')).toBeNull();
  });
});
