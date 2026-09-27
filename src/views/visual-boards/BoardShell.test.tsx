import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import BoardShell, { type BoardShellProps } from './BoardShell';

const lado = { label: 'Conceito', headline: 'Título', detail: 'Detalhe', formula: 'E = mc²' };
const props: BoardShellProps = {
  title: 'Prancha', subtitle: 'Sub', condition: { label: 'F', value: '1' },
  left: lado, right: { ...lado, label: 'Aplicação' },
  leftState: 'nao-avaliado', rightState: 'nao-avaliado',
  onSelectLeft: vi.fn(), onSelectRight: vi.fn(), leftSelected: false, rightSelected: false,
  scene: <svg />, closing: 'Ideia', ariaLabel: 'Prancha de teste',
};

describe('moldura tecnológica', () => {
  it('só muda a prancha que pede: sem `tecnologico`, os morros e os cartões antigos ficam', () => {
    const { container } = render(<BoardShell {...props} />);
    expect(container.querySelector('.vs-study-board--tech')).toBeNull();
    expect(container.querySelector('.vs-landscape-art')).not.toBeNull();
    expect(container.querySelector('.vs-concept-icon')).toBeNull();
  });

  it('com `tecnologico`, cada cartão ganha o ícone do seu estágio e a ideia central, o ponto aceso', () => {
    const { container } = render(<BoardShell {...props} tecnologico />);
    expect(container.querySelector('.vs-study-board--tech')).not.toBeNull();
    expect(container.querySelector('.vs-landscape-art')).toBeNull();
    const icones = [...container.querySelectorAll('.vs-concept-icon svg')].map(svg => svg.innerHTML);
    expect(icones).toHaveLength(2);
    // Conceito e Aplicação têm ícones próprios, não o brilho genérico.
    expect(new Set(icones).size).toBe(2);
    expect(container.querySelector('.vs-landscape p .vs-tech-dot')).not.toBeNull();
  });
});
