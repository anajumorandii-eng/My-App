import React from 'react';
import { describe, it, expect } from 'vitest';
import { render } from '@testing-library/react';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { ChapterObjectIcon, chapterIconModels } from './ChapterObjectIcon';
import { chapterIconGeometry } from './chapterIconGeometry';

describe('modelos específicos dos capítulos', () => {
  it('cobre exatamente o catálogo e não deixa objeto sem desenho', () => {
    expect(Object.keys(chapterIconModels).sort()).toEqual(interactiveSummaries.map(s => s.id).sort());
    for (const summary of interactiveSummaries) {
      const config = chapterIconModels[summary.id];
      expect(config.label).toBe(summary.title);
      expect(chapterIconGeometry[config.model]?.paths.length).toBeGreaterThan(0);
    }
  });
  it('distingue órgãos, sólidos e instrumentos sem colisões de palavras', () => {
    const expected = {
      'summary-biologia-divisao-celular': 'chromosome',
      'summary-biologia-fisiologia-da-excrecao': 'kidney',
      'summary-biologia-fisiologia-da-respiracao': 'lungs',
      'summary-matematica-prismas': 'prism',
      'summary-matematica-piramides': 'pyramid',
      'summary-matematica-potencias-e-radicais': 'equation',
      'summary-fisica-trabalho-e-energia-teorema-da-energia-cinetica': 'energy',
      'summary-historia-a-republica-da-espada': 'fort',
      'summary-historia-a-era-vargas-o-estado-novo': 'scroll',
    };
    for (const [id, model] of Object.entries(expected)) expect(chapterIconModels[id].model).toBe(model);
  });
  it('isola gradientes entre ícones e mantém sua função decorativa', () => {
    const { container } = render(<><ChapterObjectIcon chapterId="summary-matematica-prismas"/><ChapterObjectIcon chapterId="summary-biologia-fisiologia-da-excrecao"/></>);
    const ids = Array.from(container.querySelectorAll('[id]')).map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(container.querySelectorAll('svg[aria-hidden="true"]')).toHaveLength(2);
    for (const path of container.querySelectorAll('path[fill^="url"]')) {
      const id = path.getAttribute('fill')!.slice(5,-1);
      expect(ids).toContain(id);
    }
  });
});
