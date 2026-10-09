import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ChapterSceneFrame } from './ChapterSceneFrame';
function Scene() {
  const [value, setValue] = useState('5');
  return <input aria-label="Medida da cena" value={value} onChange={e => setValue(e.target.value)} />;
}
const input = { chapterId: 'capitulo-a', subject: 'Matemática', title: 'Prismas', topic: 'Sólidos' };

describe('exploração em foco', () => {
  it('amplia sem remontar a cena e restaura foco, interação e rolagem ao sair', () => {
    const { container } = render(<><button className="outside">Fora da cena</button><ChapterSceneFrame {...input}><Scene /></ChapterSceneFrame></>);
    const outside = container.querySelector<HTMLElement>('.outside')!;
    const scene = screen.getByRole('textbox');
    fireEvent.change(scene, { target: { value: '12' } });
    const previousOverflow = document.body.style.overflow;
    fireEvent.click(screen.getByRole('button', { name: 'Explorar em foco' }));
    expect(screen.getByRole('dialog', { name: 'Prismas' })).toHaveAttribute('aria-modal', 'true');
    expect(screen.getByRole('textbox')).toBe(scene);
    expect(scene).toHaveValue('12');
    expect(outside.inert).toBe(true);
    fireEvent.keyDown(document, { key: 'Escape' });
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(scene).toHaveValue('12');
    expect(screen.getByRole('button', { name: 'Explorar em foco' })).toHaveFocus();
    expect(outside.inert).toBe(false);
    expect(document.body.style.overflow).toBe(previousOverflow);
  });
  it('libera a interface quando o capítulo muda durante o foco', () => {
    const { rerender } = render(<ChapterSceneFrame {...input}><Scene /></ChapterSceneFrame>);
    fireEvent.click(screen.getByRole('button', { name: 'Explorar em foco' }));
    rerender(<ChapterSceneFrame {...input} chapterId="capitulo-b" title="Ondas"><Scene /></ChapterSceneFrame>);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
