import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import * as motionPreference from '../../hooks/useLiveReducedMotion';
import PcrImmersion, { PCR_PHASES } from './PcrImmersion';
import { IMMERSIVE_SCENES, immersiveSceneFor } from './registry';

afterEach(() => vi.mocked(motionPreference.useLiveReducedMotion).mockRestore?.());

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
    expect(screen.getByText('Novas fitas sintetizadas')).toBeInTheDocument();
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

describe('coerência do resultado da PCR', () => {
  it('troca o detalhe aberto quando os primers são retirados', () => {
    render(<PcrImmersion />);
    fireEvent.click(screen.getAllByRole('button', { name: /^0[1-5]/ })[4]);
    fireEvent.click(screen.getByRole('button', { name: 'Inspecionar nova fita' }));
    fireEvent.click(screen.getByRole('button', { name: 'Sem primers' }));
    expect(screen.getByRole('button', { name: 'Inspecionar fita molde' })).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByText(/O DNA inicial continua presente/)).toBeInTheDocument();
    expect(screen.queryByText(/Em ciclos repetidos, a quantidade/)).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Com primers' }));
    expect(screen.queryByText(/O DNA inicial continua presente/)).not.toBeInTheDocument();
  });

  it('com movimento reduzido, inspeciona a fita pronta em vez de uma enzima ausente', () => {
    vi.spyOn(motionPreference, 'useLiveReducedMotion').mockReturnValue(true);
    render(<PcrImmersion />);
    fireEvent.click(screen.getAllByRole('button', { name: /^0[1-5]/ })[3]);
    expect(screen.queryByRole('button', { name: 'Inspecionar dna polimerase' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Inspecionar nova fita' }));
    expect(screen.getByText(/Cada molécula resultante/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Movimento reduzido/ })).toBeDisabled();
  });
});

describe('previsão antes de cada etapa', () => {
  it('responder avança a etapa e devolve se a previsão estava certa', () => {
    render(<PcrImmersion />);
    fireEvent.click(screen.getByRole('button', { name: 'Separa as duas fitas' }));
    expect(screen.getAllByRole('button', { name: /^0[1-5]/ })[1]).toHaveAttribute('aria-current', 'step');
    expect(screen.getByRole('status')).toHaveTextContent('Você previu certo.');
  });

  it('no erro, explica o porquê em vez de só marcar errado', () => {
    render(<PcrImmersion />);
    fireEvent.click(screen.getByRole('button', { name: 'Quebra cada fita em pedaços' }));
    expect(screen.getByRole('status')).toHaveTextContent(/Não foi isso\. O calor rompe as ligações de hidrogênio/);
  });

  it('pular pelo trilho não deixa retorno de uma previsão que não foi feita', () => {
    render(<PcrImmersion />);
    fireEvent.click(screen.getByRole('button', { name: 'Separa as duas fitas' }));
    fireEvent.click(screen.getAllByRole('button', { name: /^0[1-5]/ })[3]);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('a última etapa não pede previsão: não há próxima', () => {
    render(<PcrImmersion />);
    fireEvent.click(screen.getAllByRole('button', { name: /^0[1-5]/ })[4]);
    expect(screen.queryByRole('group', { name: 'Antes de avançar, preveja' })).not.toBeInTheDocument();
  });
});

describe('tinta da cena', () => {
  it('abre em caderno e alterna para a versão da referência', () => {
    const { container } = render(<PcrImmersion />);
    expect(container.querySelector('.crivo-immersion')).toHaveAttribute('data-tema', 'caderno');
    fireEvent.click(screen.getByRole('button', { name: /Ver em noite/ }));
    expect(container.querySelector('.crivo-immersion')).toHaveAttribute('data-tema', 'noite');
    expect(screen.getByRole('button', { name: /Ver em caderno/ })).toBeInTheDocument();
  });
});

describe('tinta segue o tema do aplicativo', () => {
  it('abre em noite quando o aplicativo está no tema escuro', () => {
    document.documentElement.classList.add('dark');
    try {
      const { container } = render(<PcrImmersion />);
      expect(container.querySelector('.crivo-immersion')).toHaveAttribute('data-tema', 'noite');
      fireEvent.click(screen.getByRole('button', { name: /Ver em caderno/ }));
      expect(container.querySelector('.crivo-immersion')).toHaveAttribute('data-tema', 'caderno');
    } finally {
      document.documentElement.classList.remove('dark');
    }
  });
});

describe('registro de cenas imersivas', () => {
  // É protótipo de um capítulo só: registrar outro por engano trocaria a cena
  // dele por uma molécula de DNA que não é o assunto.
  it('atende só os dois capítulos que têm cena desenhada para eles', () => {
    expect(Object.keys(IMMERSIVE_SCENES)).toEqual(['summary-biologia-biotecnologia', 'summary-fisica-inducao-eletromagnetica-lei-de-lenz']);
    expect(immersiveSceneFor('summary-biologia-acidos-nucleicos')).toBeNull();
  });
});
