import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { READING_INSTRUMENTS, type ReadingInstrumentId } from '../../lib/readingInstrumentLab';
import { WRITING_INSTRUMENTS } from '../../lib/writingInstrumentLab';
import { ReadingMechanismScene } from './ReadingMechanismScenes';
import { WRITING_MECHANISM_IDS, WritingMechanismScene } from './WritingMechanismScenes';

const html = (el: React.ReactElement) => { const { container, unmount } = render(<svg>{el}</svg>); const h = container.innerHTML; unmount(); return h; };

// Auditoria 34: onze fichas de Redação mostravam "EIXO → TESE" sem relação com
// o conteúdo, e os onze capítulos de Leitura dividiam três formas genéricas.
describe('oficinas de Redação e Leitura', () => {
  it('as onze fichas que caíam na cena de recorte deixaram de usá-la', () => {
    for (const id of WRITING_MECHANISM_IDS) expect(WRITING_INSTRUMENTS[id], id).toBeDefined();
    const desenhos = [...WRITING_MECHANISM_IDS].map((id) => html(<WritingMechanismScene id={id} selected={0} />));
    expect(new Set(desenhos).size).toBe(desenhos.length);
    for (const d of desenhos) expect(d).not.toContain('delimitar');
  });

  it('o defeito e a correção são desenhos diferentes em cada ficha', () => {
    for (const id of WRITING_MECHANISM_IDS) expect(html(<WritingMechanismScene id={id} selected={0} />), id).not.toBe(html(<WritingMechanismScene id={id} selected={1} />));
  });

  it('cada capítulo de Leitura tem o próprio objeto, e os dois estados mudam o desenho', () => {
    const ids = Object.keys(READING_INSTRUMENTS) as ReadingInstrumentId[];
    const zero = ids.map((id) => html(<ReadingMechanismScene id={id} selected={0} />));
    expect(new Set(zero).size).toBe(ids.length);
    for (const id of ids) expect(html(<ReadingMechanismScene id={id} selected={0} />), id).not.toBe(html(<ReadingMechanismScene id={id} selected={1} />));
  });
});
