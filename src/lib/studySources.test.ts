import test from 'node:test';
import assert from 'node:assert/strict';
import { buildStudyPacket } from './studySources';
import { resolveStudyTargets } from './studyTargets';
import type { Question, Topic } from '../types';
const topic: Topic = { id: 'bio_genetica', name: 'Genética', subject: 'Biologia', prerequisites: [], chapters: ['Mendel'] };
const question = (id: string, board: string): Question => ({ id, topicId: topic.id, subject: topic.subject, prompt: 'Explique a segregação.', options: [], correctOptionId: 'a', explanation: 'Separação de alelos.', difficulty: 'easy', examSource: { board, year: 2024 } });
test('bancas configuradas são deduplicadas e pesos são normalizados sem dados de demonstração', () => {
  const profile = { targetExams: ['COMVEST', 'Unicamp', 'Fuvest'] };
  assert.deepEqual(resolveStudyTargets(profile, false), []);
  const targets = resolveStudyTargets(profile, true, { boardWeights: [{ board: 'Unicamp', weight: 0.2, phaseFocus: 'ambas' }, { board: 'Fuvest', weight: 0.8, phaseFocus: 'ambas' }] }, true);
  assert.deepEqual(targets.map(t => t.weight), [0.2, 0.8]);
});
test('cada banca recebe uma questão antes de repetir; figuras e origens ambíguas não viram evidência textual', () => {
  const packet = buildStudyPacket({ topic, boards: ['Unicamp', 'Fuvest', 'VUNESP', 'UNESP'], summaries: [], questions: [question('u1', 'COMVEST'), question('u2', 'UNICAMP'), question('f1', 'FUVEST'), { ...question('v1', 'VUNESP'), figures: [{ url: '/mapa.png' }] }] });
  assert.deepEqual(packet.sources.map(s => s.questionId), ['u1', 'f1', 'u2']);
  assert.equal(packet.coverage.find(c => c.board === 'UNESP')!.available, 0);
  assert.equal(packet.coverage.find(c => c.board === 'VUNESP')!.readable, 0);
  assert.ok(!packet.referenceText.includes('mapa.png'));
});
test('um pacote cabe no orçamento, declara recortes e preserva os identificadores das fontes', () => {
  const packet = buildStudyPacket({ topic, summaries: [{ subject: 'Biologia', topic: 'Mendel', sections: [{ title: 'Mecanismo', content: 'Palavra '.repeat(4000) }] }], questions: Array.from({ length: 20 }, (_, i) => question(`${i}`, 'FUVEST')) });
  assert.ok(packet.referenceText.length <= 24000);
  assert.ok(packet.sources[0].excerpt);
  assert.equal(packet.sources[0].id, 'F1');
});

test('questões incluídas preservam o enunciado inteiro, sem amputar dados para caber', () => {
  const long = { ...question('longa', 'FUVEST'), prompt: 'Contexto '.repeat(1000) };
  const packet = buildStudyPacket({ topic, summaries: [], questions: [long, question('curta', 'FUVEST')] });
  assert.deepEqual(packet.sources.map(source => source.questionId), ['curta']);
  assert.equal(packet.coverage[0].available, 2);
  assert.equal(packet.sources[0].excerpt, false);
});

test('o áudio de uma obra usa apenas análise e passagens publicadas, com edição e localização', async () => {
  const { buildWorkStudyPacket } = await import('./studySources');
  const { loadWorkDossier } = await import('./workDossiers');
  const dossier = structuredClone((await loadWorkDossier('olhos-dagua'))!);
  const packet = buildWorkStudyPacket(dossier);
  assert.equal(packet.topicId, 'obra:olhos-dagua');
  assert.ok(packet.referenceText.includes(dossier.edition.label));
  dossier.modules.forEach(module => { module.editorialStatus = 'needs_review'; });
  assert.throws(() => buildWorkStudyPacket(dossier));
});

test('metas persistidas também são configuração real quando o perfil ainda não carregou', () => {
  const targets = resolveStudyTargets({ targetExams: ['DEMO'] }, false, { boardWeights: [{ board: 'UNESP', weight: 1, phaseFocus: '2a-fase' }] }, true);
  assert.deepEqual(targets.map(item => item.board), ['UNESP']);
  assert.equal(targets[0].phaseFocus, '2a-fase');
});

test('títulos iguais de capítulos não misturam matérias nas fontes', () => {
  const packet = buildStudyPacket({ topic, questions: [], summaries: [{ subject: 'História', topic: 'Mendel', sections: [{ title: 'Outro assunto', content: 'Não pertence à Biologia.' }] }, { subject: 'Biologia', topic: 'Mendel', sections: [{ title: 'Mecanismo', content: 'Fonte correta.' }] }] });
  assert.equal(packet.sources.length, 1);
  assert.match(packet.referenceText, /Fonte correta/);
  assert.ok(!packet.referenceText.includes('Outro assunto'));
});

test('os 18 dossiês podem formar pacotes de áudio dentro do limite de contexto', async () => {
  const { buildWorkStudyPacket } = await import('./studySources');
  const { DOSSIER_SLUGS, loadWorkDossier } = await import('./workDossiers');
  for (const slug of DOSSIER_SLUGS) {
    const packet = buildWorkStudyPacket((await loadWorkDossier(slug))!);
    assert.ok(packet.referenceText.length <= 24000, slug);
    assert.ok(packet.sources.length > 1, slug);
  }
});

test('recorte literário inclui a unidade publicada e apenas as suas passagens', async () => {
  const { buildWorkStudyPacket } = await import('./studySources');
  const { loadWorkDossier } = await import('./workDossiers');
  const dossier = (await loadWorkDossier('olhos-dagua'))!;
  const packet = buildWorkStudyPacket(dossier, 'maria');
  assert.equal(packet.chapter, 'Maria');
  assert.ok(packet.referenceText.includes('Unidade publicada · Maria'));
  const other = dossier.evidence.find(card => card.unitId !== 'maria');
  assert.ok(other);
  assert.ok(!packet.sources.some(source => source.content.includes(other.quote)));
  dossier.units.find(unit => unit.id === 'maria')!.guide.editorialStatus = 'needs_review';
  assert.throws(() => buildWorkStudyPacket(dossier, 'maria'));
});
