import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { geografia } from '../data/geografia';
import { historia } from '../data/historia';
import { HistoriaGeografia, HISTORIA_GEOGRAFIA_IDS } from './HistoriaGeografia';
import { DigitalMapping, TimeZones, SurfaceWater } from './Cartografia';
import { WorldWarTwo, ColdWar } from './HistoriaMundial';
import { ClimateFactors, BiomeBelt, NileBasin } from './GeografiaMundial';

describe('recortes simultâneos', () => {
  it.each([DigitalMapping, TimeZones, SurfaceWater, WorldWarTwo, ColdWar, ClimateFactors, BiomeBelt, NileBasin])('isola recortes e mantém setas, materiais e recortes de mapa em %s', Drawing => {
    const { container } = render(<><Drawing active={0}/><Drawing active={1}/></>);
    const ids = Array.from(container.querySelectorAll('[id]')).map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const element of container.querySelectorAll('*')) {
      for (const attribute of ['fill','marker-end','marker-start','clip-path']) {
        const value = element.getAttribute(attribute);
        const reference = value?.match(/url\(#([^)]*)\)/)?.[1];
        if (reference) expect(ids, `${attribute}: ${reference}`).toContain(reference);
      }
    }
  });
  it.each([...geografia, ...historia].filter(entry => HISTORIA_GEOGRAFIA_IDS.has(entry.chapterId) && entry.items.length > 1))('compara as pranchas de $chapterId sem referências quebradas', entry => {
    const { container } = render(<HistoriaGeografia entry={entry}/>);
    fireEvent.click(screen.getByRole('button', { name: 'Comparar recortes' }));
    expect(container.querySelectorAll('.hg-figure')).toHaveLength(2);
    const ids = Array.from(container.querySelectorAll('[id]')).map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const element of container.querySelectorAll('*')) {
      for (const attribute of ['fill','marker-end','marker-start','clip-path']) {
        const reference = element.getAttribute(attribute)?.match(/url\(#([^)]*)\)/)?.[1];
        if (reference) expect(ids, `${attribute}: ${reference}`).toContain(reference);
      }
    }
  });

});
