import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import HeartMechanism from '../visual-boards/HeartMechanism';
import AcidTheoryMechanism from '../visual-boards/AcidTheoryMechanism';
import { findBoard } from '../visual-boards/registry';
import ThermochemBoard from '../visual-boards/ThermochemBoard';
import MembraneBoard from '../visual-boards/MembraneBoard';
import AtomMechanism from '../visual-boards/AtomMechanism';
import PhotosynthesisMechanism from '../visual-boards/PhotosynthesisMechanism';
import MendelBoard from '../visual-boards/MendelBoard';
import MembraneMechanism from '../visual-boards/MembraneMechanism';
import { stageDeclarationFor } from './declarations';
import type { BoardProps } from '../visual-boards/types';

function props(id: string, over: Partial<BoardProps> = {}): BoardProps {
  const summary = interactiveSummaries.find((item) => item.id === id)!;
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar', activeStep: 0, onStepChange: vi.fn(), ...over };
}

describe('palco → pranchas de Biologia e Química', () => {
  it('Coração: a etapa de vasos abre os capilares e o modelo de área; tocar numa câmara explica com o capítulo', () => {
    const id = 'summary-biologia-coracao-e-vasos-sanguineos';
    const summary = interactiveSummaries.find((item) => item.id === id)!;
    const view = render(<HeartMechanism stage={props(id)} />);
    expect(screen.queryByRole('region', { name: /área vascular/ })).toBeNull();
    view.rerender(<HeartMechanism stage={props(id, { activeStep: 1 })} />);
    expect(screen.getByRole('region', { name: /área vascular/ })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Ventrículo esquerdo' }));
    const frase = view.container.querySelector('.vs-heart-explain p')!.textContent!;
    expect(summary.sections.some((section) => section.content.includes(frase))).toBe(true);
  });

  it('Coração fora do palco continua desenho (img) sem camada de toque', () => {
    render(<HeartMechanism />);
    expect(screen.getByRole('img', { name: /Circulação humana/ })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Aorta' })).toBeNull();
  });

  it('Teorias ácido-base: trocar de etapa troca a teoria aberta', () => {
    const summary = interactiveSummaries.find((item) => findBoard(item)?.id === 'acido-base')!;
    const view = render(<AcidTheoryMechanism stage={props(summary.id)} />);
    const abertos = new Set<string>();
    for (let step = 0; step < summary.sections.length; step++) {
      view.rerender(<AcidTheoryMechanism stage={props(summary.id, { activeStep: step })} />);
      const grupo = screen.getByRole('group', { name: 'Teoria ou representação' });
      grupo.querySelectorAll('[aria-pressed="true"]').forEach((b) => abertos.add(b.textContent ?? ''));
    }
    expect(abertos.size).toBeGreaterThan(1);
  });

  function abertoPorEtapa(id: string, Comp: React.ComponentType<{ stage?: BoardProps } & Partial<BoardProps>>, grupo: RegExp, asBoard = false) {
    const summary = interactiveSummaries.find((item) => item.id === id)!;
    const el = (step: number) => asBoard ? <Comp {...props(id, { activeStep: step })} /> : <Comp stage={props(id, { activeStep: step })} />;
    const view = render(el(0));
    const abertos: string[] = [];
    for (let step = 0; step < summary.sections.length; step++) {
      view.rerender(el(step));
      abertos.push(screen.getByRole('group', { name: grupo }).querySelector('[aria-pressed="true"]')?.textContent ?? '');
    }
    view.unmount();
    return abertos;
  }

  it('Termoquímica I: a etapa "Lei de Hess" abre os caminhos A → B → C', () => {
    const abertos = abertoPorEtapa('summary-quimica-termoquimica-i', ThermochemBoard as never, /Caso termoquímico/, true);
    expect(abertos[2]).toBe('Lei de Hess');
    expect(abertos[0]).not.toBe('Lei de Hess');
  });

  it('Termoquímica II: a reta de Gibbs troca o destaque por etapa e o cursor de T muda o sinal lido', () => {
    const id = 'summary-quimica-termoquimica-ii';
    const abertos = abertoPorEtapa(id, ThermochemBoard as never, /O que a reta mostra/, true);
    expect(abertos[1]).toBe('Energia livre de Gibbs');
    expect(abertos[2]).toBe('Entalpia');
    render(<ThermochemBoard {...props(id)} />);
    const cursor = screen.getByLabelText(/Temperatura/);
    fireEvent.change(cursor, { target: { value: '0.1' } });
    expect(screen.getByText(/ΔG > 0 · não espontânea\./)).toBeInTheDocument();
    fireEvent.change(cursor, { target: { value: '0.9' } });
    expect(screen.getByText(/ΔG < 0 · espontânea\./)).toBeInTheDocument();
  });

  it('Membranas: "Ler tonicidade" abre a osmose na cena e ela sai do painel de baixo', () => {
    const id = 'summary-biologia-membranas-celulares';
    const abertos = abertoPorEtapa(id, MembraneMechanism as never, /Transporte pela membrana/);
    expect(abertos[2]).toBe('Osmose');
    const view = render(<MembraneBoard {...props(id, { activeStep: 0 })} />);
    expect(screen.queryByRole('group', { name: 'Tonicidade do meio externo' })).toBeNull();
    view.rerender(<MembraneBoard {...props(id, { activeStep: 2 })} />);
    expect(screen.getAllByRole('group', { name: 'Tonicidade do meio externo' })).toHaveLength(1);
  });

  it('Membranas fora do palco mantém os dois casos e a osmose no apoio', () => {
    render(<MembraneMechanism />);
    expect(screen.getByRole('group', { name: 'Transporte pela membrana' }).querySelectorAll('button')).toHaveLength(2);
  });

  it('Modelos atômicos e bioenergética seguem a seção da etapa', () => {
    expect(abertoPorEtapa('summary-quimica-evolucao-dos-modelos-atomicos', AtomMechanism as never, /Evidência atômica/)[2]).toBe('Níveis de Bohr');
    const foto = abertoPorEtapa('summary-biologia-bioenergetica-fotossintese-e-quimiossintese', PhotosynthesisMechanism as never, /Etapas da bioenergética/);
    expect(foto[2]).toMatch(/Quimiossíntese/);
    expect(foto[1]).toMatch(/Reações fotoquímicas/);
  });

  it('Mendel: a etapa troca o quadro e tocar numa casa conta a classe no próprio quadro', () => {
    const id = 'summary-biologia-segunda-lei-de-mendel-e-interacao-genica';
    const abertos = abertoPorEtapa(id, MendelBoard as never, /^Quadro de Punnett$/, true);
    expect(abertos[0]).toBe('Segunda lei');
    expect(abertos[1]).toBe('Epistasia');
    render(<MendelBoard {...props(id, { activeStep: 1 })} />);
    fireEvent.click(screen.getByRole('button', { name: /Casa AABB/ }));
    expect(screen.getByText(/A_B_, pigmentada: 9 de 16 casas/)).toBeInTheDocument();
  });

  it('a barra do palco anuncia, por etapa, o mesmo caso que a prancha abre', () => {
    const summary = interactiveSummaries.find((item) => item.id === 'summary-biologia-membranas-celulares')!;
    const decl = stageDeclarationFor(summary, 'board');
    expect(decl?.hotspots?.[2]).toMatchObject({ label: 'Osmose', step: 2 });
  });
});
