import React from 'react';
import { act, fireEvent, render, screen, within } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { resolveVisualRepresentation } from '../visualRepresentation';
import { findBoard } from './registry';
import { findInstrument } from '../visual-instruments/registry';
import { electricInstrument } from '../visual-instruments/ElectricInstrument';
import { cartesianInstrument } from '../visual-instruments/CartesianInstrument';
import QuadraticBoard from './QuadraticBoard';
import { StageStepProvider } from './stageStep';
import type { BoardProps } from './types';

function propsOf(summaryId: string, extra: Partial<BoardProps> = {}): BoardProps {
  const summary = interactiveSummaries.find((item) => item.id === summaryId)!;
  return { map: buildVisualMap(summary), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar', ...extra };
}

function noPalco(Component: React.ComponentType<BoardProps>, props: BoardProps) {
  return <StageStepProvider props={props}><Component {...props} /></StageStepProvider>;
}

const RESISTORES = 'summary-fisica-resistores';

describe('palco: a etapa muda a cena', () => {
  it('fora do palco o instrumento fica como era: sem faixa e no valor inicial', () => {
    const Component = electricInstrument('resistor');
    render(<Component {...propsOf(RESISTORES)} />);
    expect(screen.queryByRole('region', { name: /na cena/ })).not.toBeInTheDocument();
    expect(screen.getByRole('slider')).toHaveValue('4');
  });

  it('no resistor, aplicação troca o dado e estratégia vai ao caso-limite, com a leitura no quadro', () => {
    const Component = electricInstrument('resistor');
    const base = propsOf(RESISTORES, { activeStep: 0, onStepChange: vi.fn() });
    const view = render(noPalco(Component, base));
    expect(screen.getByRole('slider')).toHaveValue('4');
    expect(screen.getByRole('region', { name: 'Etapa 1 na cena' })).toBeInTheDocument();

    view.rerender(noPalco(Component, { ...base, activeStep: 2 }));
    expect(screen.getByRole('slider')).not.toHaveValue('4');
    const aplicacao = screen.getByRole('region', { name: 'Etapa 3 na cena' });
    expect(within(aplicacao).getByRole('list', { name: /Leituras que mudaram/ })).toHaveTextContent('Corrente i');

    view.rerender(noPalco(Component, { ...base, activeStep: 3 }));
    expect(screen.getByRole('slider')).toHaveValue('1');
    expect(screen.getByRole('region', { name: 'Etapa 4 na cena' })).toHaveTextContent('Caso-limite');
  });

  it('as setas da faixa pedem a troca de etapa ao palco, sem guardar etapa própria', () => {
    const onStepChange = vi.fn();
    const Component = electricInstrument('resistor');
    render(noPalco(Component, propsOf(RESISTORES, { activeStep: 1, onStepChange })));
    fireEvent.click(screen.getByRole('button', { name: 'Próxima etapa' }));
    expect(onStepChange).toHaveBeenCalledWith(2);
    fireEvent.click(screen.getByRole('button', { name: 'Etapa anterior' }));
    expect(onStepChange).toHaveBeenCalledWith(0);
  });

  it('em Reconstruir a cena propõe uma meta alcançável com o próprio controle e não grava nada', () => {
    const onSelect = vi.fn();
    const Component = electricInstrument('resistor');
    render(noPalco(Component, propsOf(RESISTORES, { activeStep: 0, mode: 'reconstruir', onSelect })));
    const lente = screen.getByRole('region', { name: 'Etapa 1 na cena' });
    expect(lente).toHaveTextContent('Desafio na cena');
    expect(lente).not.toHaveTextContent('Chegou');
    const slider = screen.getByRole('slider');
    let chegou = false;
    for (let r = 1; r <= 12 && !chegou; r += 1) {
      act(() => { fireEvent.change(slider, { target: { value: String(r) } }); });
      chegou = /Chegou/.test(lente.textContent ?? '');
    }
    expect(chegou).toBe(true);
    // A meta é observação: nada é selecionado nem registrado pela cena.
    expect(onSelect).not.toHaveBeenCalled();
    expect(lente).toHaveTextContent('o que conta como evidência é a sua resposta no desafio');
  });

  it('na quadrática, a estratégia leva a parábola ao ponto em que as raízes mudam', () => {
    const id = 'summary-matematica-funcao-quadratica';
    const Component = cartesianInstrument('quadratica');
    const base = propsOf(id, { activeStep: 0 });
    const view = render(noPalco(Component, base));
    const raizes = () => within(document.querySelector('.vs-plane-readouts') as HTMLElement).getByText('raízes reais').nextElementSibling?.textContent;
    expect(raizes()).toBe('duas');
    view.rerender(noPalco(Component, { ...base, activeStep: 3 }));
    expect(raizes()).not.toBe('duas');
    expect(screen.getByRole('region', { name: 'Etapa 4 na cena' })).toHaveTextContent('Ponto de virada');
  });

  it('prancha autoral: conceito e aplicação mostram os dois lados do par na própria cena', () => {
    const id = 'summary-matematica-equacoes-do-2-grau';
    const base = propsOf(id, { activeStep: 1 });
    const view = render(noPalco(QuadraticBoard, base));
    expect(screen.getByRole('img', { name: /cortando o eixo x em dois pontos/ })).toBeInTheDocument();
    expect(document.querySelector('[data-stage-focus]')).toHaveClass('vs-concept-card--expansion');
    view.rerender(noPalco(QuadraticBoard, { ...base, activeStep: 2 }));
    expect(screen.getByRole('img', { name: /sem raízes reais/ })).toBeInTheDocument();
    expect(document.querySelector('[data-stage-focus]')).toHaveClass('vs-concept-card--compression');
    // Selecionar um cartão continua mandando: a etapa só decide sem seleção.
    view.rerender(noPalco(QuadraticBoard, { ...base, activeStep: 2, selectedId: base.map.nodes[1].id }));
    expect(screen.getByRole('img', { name: /cortando o eixo x em dois pontos/ })).toBeInTheDocument();
  });
});

describe('palco em Física e Matemática', () => {
  const capitulos = interactiveSummaries.filter((summary) => (summary.subject === 'Física' || summary.subject === 'Matemática')
    && ['board', 'instrument'].includes(resolveVisualRepresentation(summary)));

  it('toda prancha e todo instrumento das duas matérias põe a faixa da etapa na cena', async () => {
    expect(capitulos.length).toBe(159);
    const semFaixa: string[] = [];
    const cenaParada: string[] = [];
    // A cena é o que está dentro da janela de zoom; a faixa da etapa fica fora.
    const cena = () => document.querySelector('.vs-viewport-conteudo')?.innerHTML ?? '';
    for (const summary of capitulos) {
      const representation = resolveVisualRepresentation(summary);
      const Component = (representation === 'board' ? findBoard(summary) : findInstrument(summary))!.Component;
      const props = propsOf(summary.id, { activeStep: 0, onStepChange: () => {} });
      const view = render(<Component {...props} />);
      await screen.findByRole('region', { name: 'Etapa 1 na cena' }).catch(() => null);
      const desenhos = new Set([cena()]);
      for (const step of [1, 2, 3]) {
        view.rerender(<Component {...props} activeStep={step} />);
        desenhos.add(cena());
      }
      const lente = screen.queryByRole('region', { name: 'Etapa 4 na cena' });
      if (!lente) semFaixa.push(summary.id);
      if (desenhos.size < 2) cenaParada.push(summary.id);
      view.unmount();
    }
    expect(semFaixa).toEqual([]);
    // Toda cena das duas matérias muda de desenho em ao menos uma etapa.
    expect(cenaParada).toEqual([]);
  }, 120_000);
});
