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

describe('moldura de caderno', () => {
  it('só muda a prancha que pede: sem `caderno`, os morros e os cartões antigos ficam', () => {
    const { container } = render(<BoardShell {...props} />);
    expect(container.querySelector('.vs-study-board--caderno')).toBeNull();
    expect(container.querySelector('.vs-landscape-art')).not.toBeNull();
    expect(container.querySelector('.vs-concept-icon')).toBeNull();
  });

  it('com `caderno`, cada cartão ganha o ícone do seu estágio e a ideia central, a estrela', () => {
    const { container } = render(<BoardShell {...props} caderno />);
    expect(container.querySelector('.vs-study-board--caderno')).not.toBeNull();
    expect(container.querySelector('.vs-landscape-art')).toBeNull();
    const icones = [...container.querySelectorAll('.vs-concept-icon svg')].map(svg => svg.innerHTML);
    expect(icones).toHaveLength(2);
    // Conceito e Aplicação têm desenhos próprios, não a estrela genérica.
    expect(new Set(icones).size).toBe(2);
    expect(container.querySelector('.vs-landscape p .vs-star-icon')).not.toBeNull();
  });
});
