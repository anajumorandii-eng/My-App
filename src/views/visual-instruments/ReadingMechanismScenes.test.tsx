import React from 'react';
import { render, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { READING_INSTRUMENTS, type ReadingInstrumentId } from '../../lib/readingInstrumentLab';
import { ReadingMechanismScene } from './ReadingMechanismScenes';

const OBJECTS: Array<[ReadingInstrumentId, string]> = [
  ['textuality','O aviso proíbe entrar na sala.'], ['levels','O guarda-chuva pingava.'],
  ['intertext','Quem abre um livro abre caminho.'], ['genres','Biblioteca reabre às 9h.'],
  ['narrative','Eu escondi a chave.'], ['nonverbal','cartaz original'],
  ['functions','A biblioteca abre às 9h.'], ['poetic','A chuva sussurra na sarjeta.'],
  ['figures','A fila era um caracol.'], ['distortions','Nesta turma, alguns alunos'],
  ['comic','Aqui economizamos papel.'], ['tdic','Compartilhe agora!'],
];

describe('leitura de objetos concretos LG2', () => {
  it.each(OBJECTS)('%s: já ensina com texto, pista e achado no estado estático', (id, object) => {
    const { container, unmount } = render(<ReadingMechanismScene id={id} selected={0} />);
    const scene = container.querySelector('.reading-scene')!;
    expect(scene).toHaveTextContent(object);
    expect(scene.querySelector('mark')).toBeInTheDocument();
    expect(scene.querySelector('.reading-finding')).toHaveTextContent(READING_INSTRUMENTS[id].states[0].reading);
    expect(scene.querySelector('.reading-annotation')).toHaveTextContent(READING_INSTRUMENTS[id].states[0].annotation);
    expect(scene.querySelector('svg')).toBeInTheDocument();
    unmount();
  });

  it.each(OBJECTS)('%s: mudar foco altera evidência e leitura sobre o objeto', (id) => {
    const { container, rerender } = render(<ReadingMechanismScene id={id} selected={0} />);
    const first = container.querySelector('.reading-finding')!.textContent;
    rerender(<ReadingMechanismScene id={id} selected={1} />);
    expect(container.querySelector('.reading-finding')).toHaveTextContent(READING_INSTRUMENTS[id].states[1].reading);
    expect(container.querySelector('.reading-finding')!.textContent).not.toBe(first);
    for (const clue of READING_INSTRUMENTS[id].states[1].evidence) {
      expect([...container.querySelectorAll('mark')].some(mark => mark.textContent === clue), clue).toBe(true);
    }
  });

  it('não chama ausência de evidência de conclusão certa', () => {
    const { container } = render(<ReadingMechanismScene id="distortions" selected={0} />);
    expect(within(container).getByText('Todos aprendem melhor sozinhos.')).toHaveClass('reading-rejected');
  });
});

  it('relaciona a paródia ao texto C e a citação ao texto B', () => {
    const { container, rerender } = render(<ReadingMechanismScene id="intertext" selected={1} />);
    expect(container.querySelector('svg')).toHaveTextContent('texto C');
    expect(container.querySelector('svg')).not.toHaveTextContent('texto B');
    rerender(<ReadingMechanismScene id="intertext" selected={0} />);
    expect(container.querySelector('svg')).toHaveTextContent('texto B');
  });
  it('contrasta a fala irônica com as duas horas de espera', () => {
    const { container } = render(<ReadingMechanismScene id="figures" selected={1} />);
    expect(container.querySelector('svg')).toHaveTextContent('Que rapidez!');
    expect(container.querySelector('svg')).toHaveTextContent('2 horas');
    expect(container.querySelector('svg')).not.toHaveTextContent('que ótimo');
  });
