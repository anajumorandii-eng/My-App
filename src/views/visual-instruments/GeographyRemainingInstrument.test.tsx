import React from 'react';
import { describe, expect, it } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { GEOGRAPHY_REMAINING } from '../../lib/geographyRemainingLab';
import { findInstrument } from './registry';
import { geographyRemainingInstrument } from './GeographyRemainingInstrument';
import { buildVisualMap } from '../../lib/visualStudy';

const addedIds = ['summary-geografia-cartografia-digital', 'summary-geografia-representacoes-graficas-e-cartograficas', 'summary-geografia-hidrogeografia-mundial', 'summary-geografia-hidrogeografia-do-brasil'];

describe('Geografia: os capítulos antes sem artefato', () => {
  it('alcança apenas os quatro capítulos das relações espaciais implementadas', () => {
    expect(addedIds).toHaveLength(4);
    const remaining = new Set(Object.keys(GEOGRAPHY_REMAINING));
    const registered = interactiveSummaries.filter(s => s.subject === 'Geografia' && remaining.has(findInstrument(s)?.id ?? ''));
    expect(registered.map(s => s.id).sort()).toEqual([...addedIds].sort());
  });
  it('a escolha de um uso do rio atualiza a inferência e o desenho', () => {
    const summary = interactiveSummaries.find(s => s.id === 'summary-geografia-hidrogeografia-mundial')!;
    const Board = geographyRemainingInstrument('world-basin');
    const map = buildVisualMap(summary);
    render(<Board map={map} states={{}} selectedId={null} onSelect={() => {}} hiddenEdgeIds={[]} mode="explorar"/>);
    fireEvent.click(screen.getByRole('button', {name:'Efluente'}));
    expect(screen.getByRole('button', {name:'Efluente'}).getAttribute('aria-pressed')).toBe('true');
    expect(screen.getAllByText(/dispersão pode afetar a qualidade da água a jusante/i).length).toBeGreaterThan(0);
    expect(screen.getByRole('img', {name:/Efluente no percurso fluvial/})).toBeTruthy();
  });
});
