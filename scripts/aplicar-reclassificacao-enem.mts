/**
 * Aplica as listas de scripts/data/enem-reclassificacao/*.json ao banco.
 * Uso: npx tsx scripts/aplicar-reclassificacao-enem.mts
 * Recusa a lista inteira se um id não existir, se a questão não for do ENEM
 * ou se o capítulo não pertencer ao assunto no currículo — gravar pela metade
 * deixaria a análise misturando dois critérios, que é o defeito a corrigir.
 * Reaplicar não muda nada.
 */
import { readFile, readdir, writeFile } from 'node:fs/promises';
import { mockTopics } from '../src/data/mockData';

type Q = { id: string; topicId: string; subject: string; chapter?: string; examSource?: { board?: string } };
const dir = 'scripts/data/enem-reclassificacao';
const bank = JSON.parse(await readFile('public/questions.json', 'utf8')) as Q[];
const byId = new Map(bank.map(q => [q.id, q]));
const preserved = JSON.parse(await readFile('src/data/enemPreservedPositions.json', 'utf8')) as Record<string, unknown>;
const topics = new Map(mockTopics.map(t => [t.id, t]));

const changes: [Q, string, string][] = [];
for (const file of (await readdir(dir)).filter(f => f.endsWith('.json')).sort()) {
  const list = JSON.parse(await readFile(`${dir}/${file}`, 'utf8')) as Record<string, unknown>;
  for (const [id, value] of Object.entries(list)) {
    if (id.startsWith('_')) continue;
    const [topicId, chapter] = value as [string, string];
    const q = byId.get(id);
    if (!q) throw new Error(`${file}: id inexistente ${id}`);
    if (q.examSource?.board !== 'ENEM' && !(id in preserved)) throw new Error(`${file}: ${id} não é do ENEM`);
    const topic = topics.get(topicId);
    if (!topic || !topic.chapters.includes(chapter)) throw new Error(`${file}: ${chapter} não pertence a ${topicId}`);
    if (topic.subject !== q.subject) throw new Error(`${file}: ${id} mudaria de matéria`);
    changes.push([q, topicId, chapter]);
  }
}
let changed = 0;
for (const [q, topicId, chapter] of changes) {
  if (q.topicId !== topicId || q.chapter !== chapter) { q.topicId = topicId; q.chapter = chapter; changed++; }
}
await writeFile('public/questions.json', JSON.stringify(bank, null, 2) + '\n');
console.log(`${changes.length} itens nas listas; ${changed} alterados agora.`);
