import { describe, expect, it } from 'vitest';
import { geographyInteractiveSummaries, geographySummaryMaterials } from './geographyInteractiveSummaries';
import { interactiveSummaries } from './interactiveSummaries';
import { evaluateRetrievalAnswer, getReadingProgress } from '../lib/summaryEngine';
import { geografia } from '../views/topic-scenes/data/geografia';
import { historia } from '../views/topic-scenes/data/historia';

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

describe('continuidade editorial de Brasil Colônia', () => {
  const summary = (id: string) => interactiveSummaries.find(item => item.id === 'summary-historia-' + id)!;
  const evaluate = (id: string, answer: string) => evaluateRetrievalAnswer(summary(id).retrieval[0], answer);

  it('avalia a participação popular na independência sem exigir reconhecimento internacional fora do texto', () => {
    const item = summary('a-independencia-do-brasil');
    expect(item.retrieval[0].prompt).not.toContain('reconhecimento internacional');
    expect(item.retrieval[0].expectedElements.map(element => element.label).join(' ')).not.toContain('sem participacao popular');
    const result = evaluate('a-independencia-do-brasil', 'Preservou monarquia, escravidão e latifúndio. Houve participação popular nas guerras; a Bahia consolidou a independência em 1823.');
    expect(result.firstMissingElement).toBeNull();
    expect(result.matchedElements).toHaveLength(3);
  });

  it('avalia roças e resistência com o conteúdo de Dinâmica Interna, sem cobrar pecuária não explicada', () => {
    const item = summary('dinamica-interna-da-colonizacao');
    expect(item.retrieval[0].prompt).not.toContain('pecuária');
    expect(evaluate('dinamica-interna-da-colonizacao', 'Roças produziam alimentos; o artesanato complementava a economia. Houve fugas para quilombos e sabotagem como resistência cotidiana.').firstMissingElement).toBeNull();
  });

  it('avalia os vetores de interiorização sem cobrar fiscalidade de outro capítulo', () => {
    const item = summary('a-interiorizacao-da-colonizacao');
    expect(item.retrieval[0].prompt).not.toContain('derrama');
    expect(evaluate('a-interiorizacao-da-colonizacao', 'A mineração atraiu migração e cidades. A capital foi transferida para o Rio de Janeiro em 1763. A pecuária fornecia carne, couro e animais de tração.').firstMissingElement).toBeNull();
  });

  it('compara as duas revoltas sem exigir uma conclusão sobre a Inglaterra ausente do texto', () => {
    const item = summary('a-crise-do-antigo-sistema-colonial');
    expect(item.retrieval[0].expectedElements.map(element => element.label).join(' ')).not.toContain('Inglaterra');
    expect(evaluate('a-crise-do-antigo-sistema-colonial', 'Terminou o exclusivo comercial. A Mineira mobilizou elites contra os impostos sobre o ouro e a derrama; a Baiana teve participação popular e defendeu a abolição.').firstMissingElement).toBeNull();
  });

  it('distingue a tomada de Macaco em 1694 da morte de Zumbi em 1695 nos trechos que ensinam a cronologia', () => {
    const item = summary('dinamica-interna-da-colonizacao');
    for (const index of [1, 3, 4]) {
      expect(item.sections[index].content).toContain('1694');
      expect(item.sections[index].content).toContain('1695');
      expect(item.sections[index].content).not.toContain('destruição definitiva em 1695');
    }
  });

  it('situa a Insurreição Pernambucana depois da administração de Nassau', () => {
    const item = summary('disputas-europeias-no-brasil-colonial');
    expect(item.sections[1].content).toContain('1637-1644');
    expect(item.sections[2].content).toContain('iniciada em 1645, após a saída de Nassau em 1644');
    expect(item.sections[2].content).not.toContain('ainda durante a administração de Nassau');
  });
});

describe('recuperação editorial de Mineração', () => {
  it('oferece uma recuperação avaliável sobre os três mecanismos de controle ensinados no capítulo', () => {
    const item = interactiveSummaries.find(summary => summary.id === 'summary-historia-a-mineracao-no-brasil-colonial')!;
    expect(item.retrieval).toHaveLength(1);
    const result = evaluateRetrievalAnswer(item.retrieval[0], 'O quinto separava 20% do ouro para a Coroa. As Casas de Fundição faziam barras seladas após reter o imposto. A derrama cobrava a diferença para a cota mínima coletivamente.');
    expect(result.matchedElements).toHaveLength(3);
    expect(result.firstMissingElement).toBeNull();
  });
});

const summary = (id: string) => interactiveSummaries.find(item => item.id === id)!;
describe('continuidade das pendências Design & Motion Kit', () => {
  it('ensina as condições da fusão e encaminha a recuperação para a explicação pertinente', () => {
    const item = summary('fis-termologia-calor');
    expect(item.sections.map(s => s.content).join(' ')).toMatch(/substância pura.*pressão constante/s);
    expect(item.retrieval[0].hint).toContain('Mudanças de estado');
    expect(evaluateRetrievalAnswer(item.retrieval[0], 'A temperatura permanece constante; a energia modifica as interações entre partículas. No vácuo ocorre radiação.').firstMissingElement).toBeNull();
    expect(evaluateRetrievalAnswer(item.retrieval[0], 'A temperatura permanece constante; no vácuo ocorre radiação.').firstMissingElement).not.toBeNull();
  });
  it('cobra simbiose e risco do branqueamento sem afirmar morte inevitável', () => {
    const item = summary('summary-biologia-poriferos-e-cnidarios');
    expect(item.sections[1].content).toContain('zooxantelas');
    expect(item.sections[1].content).toContain('não significa morte imediata');
    expect(item.retrieval[0].prompt).not.toContain('branqueamento mata');
    const answer = 'Perde zooxantelas e o aporte de nutrientes. Não significa morte imediata, pode se recuperar. Os flagelos movimentam a água e os coanócitos capturam partículas alimentares.';
    expect(evaluateRetrievalAnswer(item.retrieval[0], answer).firstMissingElement).toBeNull();
    expect(evaluateRetrievalAnswer(item.retrieval[0], 'zooxantela nutriente coanócito').firstMissingElement).not.toBeNull();
  });
  it('sustenta os recortes históricos no texto sem transformar causas em condições necessárias', () => {
    const item = summary('summary-historia-a-montagem-da-colonizacao');
    const scene = historia.find(s => s.chapterId === item.id)!;
    expect(scene.question).not.toContain('nenhum sozinho suficiente');
    expect(scene.items.some(i => i.label === 'Circuito atlântico')).toBe(true);
    for (const recorte of scene.items) {
      const section = item.sections.find(s => s.title === recorte.section)!;
      expect(section.content).toContain(recorte.quote);
    }
    expect(item.sections[2].content).toContain('coexistiram');
    expect(item.sections[2].content).toContain('trabalho compulsório');
  });
  it.each(['fis-termologia-calor', 'summary-biologia-poriferos-e-cnidarios', 'summary-historia-a-montagem-da-colonizacao'])('solicita releitura apenas da revisão editorial de %s', id => {
    const item = summary(id);
    expect(item.sections.every(s => s.id.includes('-editorial-v3-'))).toBe(true);
    expect(getReadingProgress(item, { readSectionIds: [1,2,3,4,5].map(i => `${id}-editorial-v2-${i}`), status: 'em-revisao', important: true, answers: [] })).toBe(0);
  });
});
