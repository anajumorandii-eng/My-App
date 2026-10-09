import { describe, expect, it } from 'vitest';
import { geographyInteractiveSummaries, geographySummaryMaterials } from './geographyInteractiveSummaries';
import { interactiveSummaries } from './interactiveSummaries';
import { geografia } from '../views/topic-scenes/data/geografia';

describe('continuidade editorial de Geografia', () => {
  it('mantém conteúdo aprofundado de Geoeconomia e a classificação correta também no texto de relevo', () => {
    const geo = interactiveSummaries.find(item => item.id === 'summary-geografia-gedeconomia-mundial')!;
    expect(geo.contentStatus).toBe('aprofundado');
    expect(geo.sections.map(section => section.id)).toEqual([1,2,3,4,5].map(index => 'summary-geografia-gedeconomia-mundial-editorial-v2-' + index));
    expect(geo.retrieval[0].id).toBe('summary-geografia-gedeconomia-mundial-editorial-recall-v2');
    const relief = interactiveSummaries.find(item => item.id === 'summary-geografia-relevo-brasileiro')!;
    expect(relief.sections[0].content).toContain('Jurandyr Ross');
    expect(relief.sections[0].content).not.toContain('Aziz Ab-Sáber');
  });
  it('não apresenta a Escola de Sagres como instituição comprovada no resumo escrito', () => {
    const summary = interactiveSummaries.find(item => item.id === 'summary-historia-grandes-navegacoes-e-conquista-colonial')!;
    expect(summary.sections[0].content).not.toContain('centro de estudos náuticos associado');
    expect(summary.sections[1].content).toContain('negociado diretamente pelas Coroas de Portugal e Castela');
    expect(summary.sections[1].content).toContain('posteriormente confirmado pelo papa Júlio II em 1506');
    expect(summary.sections[1].content).not.toContain('mediado pelo papado');
    expect(summary.retrieval[0].prompt).toContain('Tordesilhas');
    expect(summary.retrieval[0].prompt).not.toContain('Madri');
    expect(summary.sections.map(section => section.id)).toEqual([1,2,3,4,5].map(index => 'summary-historia-grandes-navegacoes-e-conquista-colonial-editorial-v4-' + index));
    expect(summary.retrieval[0].id).toBe('summary-historia-grandes-navegacoes-e-conquista-colonial-editorial-recall-v4');
  });
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
