import { CoverIllustrationButton } from './CoverIllustrationButton';
import React, { useRef, useState } from 'react';
import { printStrategyGuide } from '../lib/printStrategyGuide';

/** Freeze editable answers so printing includes the student's current reasoning. */
export function prepareStudyExport(source: HTMLElement): HTMLElement {
  const copy = source.cloneNode(true) as HTMLElement;
  const originalFields = source.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input, textarea, select');
  copy.querySelectorAll('input, textarea, select').forEach((field, index) => {
    const original = originalFields[index];
    const paragraph = document.createElement('p');
    paragraph.style.whiteSpace = 'pre-wrap';
    if (original instanceof HTMLInputElement && ['checkbox', 'radio'].includes(original.type)) paragraph.textContent = original.checked ? '☑' : '☐';
    else if (original instanceof HTMLSelectElement) paragraph.textContent = original.selectedOptions[0]?.textContent ?? '';
    else paragraph.textContent = original.value;
    field.replaceWith(paragraph);
  });
  copy.querySelectorAll('button, nav, audio, [data-print-exclude]').forEach(element => element.remove());
  copy.querySelectorAll<HTMLElement>('[class]').forEach(element => {
    element.style.maxHeight = 'none';
    element.style.height = 'auto';
    element.style.overflow = 'visible';
  });
  return copy;
}

export function StudyExportButton({ title }: { title: string }) {
  const [error, setError] = useState('');
  const controls = useRef<HTMLDivElement>(null);
  return <div data-print-exclude ref={controls}>
    <button type="button" className="rounded-lg border border-[var(--line)] px-4 py-2 text-sm" onClick={event => {
      const root = event.currentTarget.closest<HTMLElement>('[data-study-export]');
      if (!root) return;
      try { printStrategyGuide(prepareStudyExport(root), title); setError(''); }
      catch { setError('Não foi possível abrir a impressão. Tente novamente.'); }
    }}>Imprimir / Salvar em PDF</button>
    <CoverIllustrationButton getContent={() => controls.current?.closest<HTMLElement>('[data-study-export]') ?? null} />
    {error && <p role="alert" className="text-sm text-status-error">{error}</p>}
  </div>;
}
