/** Rebuild metadata only; never infer exam-wide incidence from selected questions. */
import { readFile, writeFile } from 'node:fs/promises';
import { mockTopics } from '../src/data/mockData';
import { studyAreaForTopic } from '../src/data/studyProtocols';
const read = async (path: string) => JSON.parse(await readFile(path, 'utf8'));
const checks = await read('docs/estudos-2026/prioridades/fontes-verificadas.json');
const cohorts: any[] = [], cases: any[] = [];
const names = ['unicamp-2025-qz', 'unicamp-2026-qx', 'fuvest-2026-v1', 'unesp-2025-v1', 'famerp-2025-v1', 'unifesp-2025-v1', 'enem-2022-d2-cd5'];
const known = new Map(mockTopics.map(topic => [topic.id, topic]));
const verifySource = (id: string, source: any) => {
  const check = checks.find((item: any) => item.id === id);
  if (!check || !check.documents.every((document: any) => document.verified && document.matchesRecordedHash)) throw new Error(`Fonte não conferida: ${id}`);
  const exam = check.documents.find((item: any) => item.kind === 'exam' || item.kind === 'examAndExpectedAnswers');
  const key = check.documents.find((item: any) => item.kind === 'answerKey' || item.kind === 'examAndExpectedAnswers');
  if (exam?.sha256 !== source.examSha256 || key?.sha256 !== source.answerKeySha256) throw new Error(`Hashes da fonte diferem da conferência: ${id}`);
};
for (const id of names) {
  const source = await read(`scripts/data/${id}-source.json`);
  const items = await read(source.itemsFile ?? `scripts/data/${id}.json`);
  verifySource(id, source);
  const complete = id.startsWith('unicamp-');
  const expected = source.selectedNumbers ?? Array.from({ length: 72 }, (_, i) => i + 1);
  if (items.length !== expected.length || new Set(items.map((item: any) => item.number)).size !== expected.length || items.some((item: any) => !expected.includes(item.number))) throw new Error(`Recorte incompleto: ${id}`);
  cohorts.push({ id, board: source.board, year: source.year, phase: source.phase, phaseGroup: '1a', version: source.version,
    examUrl: source.examUrl, answerKeyUrl: source.answerKeyUrl, reviewedOn: '2026-10-17',
    examSha256: source.examSha256, answerKeySha256: source.answerKeySha256,
    completeSubjects: complete ? [...new Set(items.map((item: any) => studyAreaForTopic(known.get(item.topicId)!)))] : [],
    totalQuestions: source.totalQuestions ?? 72, excludedNumbers: source.excludedNumbers ?? [],
    classification: complete ? 'complete' : 'selected' });
  for (const item of items) {
    const topic = known.get(item.topicId);if (!topic) throw new Error(`Tópico desconhecido: ${item.topicId}`);
    const words = ['exceto', 'incorreta', 'correta', 'compare', 'justifique', 'explique', 'determine', 'calcule', 'identifique', 'assinale', 'por que'];
    cases.push({ id: `${id}:${item.number}`, cohortId: id, number: item.number, questionId: `${source.idPrefix ?? `unicamp_${source.year}`}_q${item.number}`,
      topicId: item.topicId, relatedTopicIds: [], subject: studyAreaForTopic(topic), chapter: item.chapter,
      title: item.title, concept: item.concept, trap: item.trap, steps: item.steps.slice(0, 2),
      commandWords: words.filter(word => new RegExp(`\\b${word}\\b`, 'i').test(item.statement ?? '')) });
  }
}
for (const source of await read('scripts/data/analise-discursivas-2026.json')) {
  verifySource(source.id, source);
  const { items, ...cohort } = source;
  if (items.length !== source.totalQuestions) throw new Error('Classificação discursiva incompleta.');
  cohorts.push({ ...cohort, classification: 'complete', excludedNumbers: [] });
  for (const item of items) {
    if (![item.topicId, ...item.relatedTopicIds].every(id => known.has(id))) throw new Error('Tópico discursivo inválido.');
    cases.push({ ...item, id: `${source.id}:${item.number}`, cohortId: source.id, subject: 'Biologia', chapter: '', steps: [] });
  }
}
const counts = cohorts.map(cohort => {
  const records = cases.filter(item => item.cohortId === cohort.id);
  const subjects = [...new Set(records.map(item => item.subject))].map(subject => {
    const selected = records.filter(item => item.subject === subject);
    const topics = [...new Set(selected.map(item => item.topicId))].map(topicId => ({
      topicId, count: selected.filter(item => item.topicId === topicId).length,
      numbers: selected.filter(item => item.topicId === topicId).map(item => item.number),
    }));
    return { subject, total: selected.length, topics };
  });
  return { ...cohort, subjects };
});
await writeFile('src/data/examEvidenceCounts.json', JSON.stringify({ reviewedOn: '2026-10-17', cohorts: counts }, null, 2) + '\n');
await writeFile('src/data/examEvidenceCases.json', JSON.stringify(cases, null, 2) + '\n');
console.log(`${cohorts.length} recortes; ${cases.length} questões; ${cohorts.filter(item => item.classification === 'complete').length} recortes completos (alguns restritos à Biologia).`);
