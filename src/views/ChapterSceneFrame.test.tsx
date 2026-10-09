import React, { useState } from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ChapterSceneFrame } from './ChapterSceneFrame';
function Scene() {
  const [value, setValue] = useState('5');
  return <input aria-label="Medida da cena" value={value} onChange={e => setValue(e.target.value)} />;
}
const input = { chapterId: 'capitulo-a', subject: 'Matemática', title: 'Prismas', topic: 'Sólidos' };

describe('exploração em foco', () => {
  it('fecha o ciclo de Tab no summary e ignora controles dentro de painéis recolhidos', () => {
    const rects = vi.spyOn(HTMLElement.prototype, 'getClientRects').mockReturnValue([{} as DOMRect] as unknown as DOMRectList);
    try {
      const { container } = render(<ChapterSceneFrame {...input}><details><summary>Fontes da cena</summary><button type="button">Abrir fonte</button></details></ChapterSceneFrame>);
      fireEvent.click(screen.getByRole('button', { name: 'Explorar em foco' }));
      const toggle = screen.getByRole('button', { name: 'Sair do modo foco' });
      const summary = screen.getByText('Fontes da cena');
      summary.focus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(screen.getByRole('button', { name: 'Comparar painéis' })).toHaveFocus();
      fireEvent.keyDown(document, { key: 'Tab', shiftKey: true });
      expect(summary).toHaveFocus();
      container.querySelector('details')!.open = true;
      screen.getByRole('button', { name: 'Abrir fonte' }).focus();
      fireEvent.keyDown(document, { key: 'Tab' });
      expect(screen.getByRole('button', { name: 'Comparar painéis' })).toHaveFocus();
      fireEvent.keyDown(document, { key: 'Escape' });
    } finally { rects.mockRestore(); }
  });
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
  it('compara os painéis sem reiniciar medidas e reseta o layout ao trocar de capítulo', () => {
    const { container, rerender } = render(<ChapterSceneFrame {...input}><Scene /></ChapterSceneFrame>);
    const measure = screen.getByRole('textbox');
    fireEvent.change(measure, { target: { value: '19' } });
    fireEvent.click(screen.getByRole('button', { name: 'Comparar painéis' }));
    expect(container.querySelector('.vs-chapter-scene')).toHaveClass('vs-chapter-scene--comparison');
    expect(screen.getByRole('button', { name: 'Comparar painéis' })).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('textbox')).toBe(measure);
    expect(measure).toHaveValue('19');
    rerender(<ChapterSceneFrame {...input} chapterId="capitulo-b"><Scene /></ChapterSceneFrame>);
    expect(screen.getByRole('button', { name: 'Comparar painéis' })).toHaveAttribute('aria-pressed', 'false');
  });
  it('libera a interface quando o capítulo muda durante o foco', () => {
    const { rerender } = render(<ChapterSceneFrame {...input}><Scene /></ChapterSceneFrame>);
    fireEvent.click(screen.getByRole('button', { name: 'Explorar em foco' }));
    rerender(<ChapterSceneFrame {...input} chapterId="capitulo-b" title="Ondas"><Scene /></ChapterSceneFrame>);
    expect(screen.queryByRole('dialog')).toBeNull();
    expect(document.body.style.overflow).not.toBe('hidden');
  });
});
