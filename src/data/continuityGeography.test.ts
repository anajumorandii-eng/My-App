import { describe, expect, it } from 'vitest';
import { geographyInteractiveSummaries, geographySummaryMaterials } from './geographyInteractiveSummaries';
import { geografia } from '../views/topic-scenes/data/geografia';

describe('continuidade editorial de Geografia', () => {
  it('corrige Geoeconomia sem alterar IDs de resumo, material, seções ou recuperação', () => {
    const summary = geographyInteractiveSummaries.find(item => item.id === 'summary-geografia-gedeconomia-mundial')!;
    expect(summary.title).toBe('Geoeconomia Mundial');
    expect(summary.sections.map(section => section.id)).toEqual(['rapida', 'conceito', 'aplicacao', 'exercicio', 'prova'].map(suffix => 'geo-gedeconomia-mundial-' + suffix));
    expect(summary.retrieval[0].id).toBe('geo-gedeconomia-mundial-r1');
    expect(summary.retrieval[0].sectionId).toBe('geo-gedeconomia-mundial-exercicio');
    expect(geographySummaryMaterials.find(material => material.id === 'material-geografia-gedeconomia-mundial')?.chapter).toBe('Geoeconomia Mundial');
  });
  it('atribui a classificação de três formas do relevo a Jurandyr Ross', () => {
    const scene = geografia.find(entry => entry.chapterId === 'summary-geografia-relevo-brasileiro')!;
    expect(scene.question).toContain('Jurandyr Ross');
    expect(scene.question).not.toContain('Aziz');
    expect(scene.items.map(item => item.label)).toEqual(['Planaltos', 'Planícies', 'Depressões']);
  });
});
