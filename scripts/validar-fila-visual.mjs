import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';

const read = path => JSON.parse(readFileSync(new URL(`../${path}`, import.meta.url), 'utf8'));
const queue = read('docs/FILA-VISUAL-2026-10-03.json');
const audit = read(queue.sourceAudit);
const source = new Map(audit.chapters.map(chapter => [chapter.id, chapter]));
const ids = new Set();
const counts = {preservar_mecanismo:0,achado_tratado:0,fila_a_revalidar:0}, batches = {}, subjects = {};
for (const chapter of queue.chapters) {
  assert(!ids.has(chapter.id), `ID duplicado: ${chapter.id}`);
  ids.add(chapter.id);
  const original = source.get(chapter.id);
  assert(original, `ID fora da auditoria: ${chapter.id}`);
  assert.equal(chapter.subject, original.subject);
  assert.equal(chapter.auditVerdict, original.verdict);
  assert(['preservar_mecanismo', 'achado_tratado', 'fila_a_revalidar'].includes(chapter.status));
  counts[chapter.status] = (counts[chapter.status] ?? 0) + 1;
  const subject = subjects[chapter.subject] ??= {total:0,preservar_mecanismo:0,achado_tratado:0,fila_a_revalidar:0};
  subject.total++; subject[chapter.status]++;
  if (chapter.status === 'fila_a_revalidar') {
    assert(chapter.batch, `Sem lote: ${chapter.id}`);
    batches[chapter.batch] = (batches[chapter.batch] ?? 0) + 1;
    assert(chapter.findings.length, `Sem achado: ${chapter.id}`);
  } else {
    assert.equal(chapter.batch, null);
    if (chapter.status === 'achado_tratado') assert(existsSync(new URL(`../${chapter.resolution.evidence}`, import.meta.url)), `Evidência ausente: ${chapter.id}`);
    else assert.equal(original.verdict, 'manter');
  }
  for (const file of chapter.sourceFiles) assert(existsSync(new URL(`../${file}`, import.meta.url)), `Fonte ausente: ${file}`);
}
assert.equal(ids.size, source.size);
assert.deepEqual(counts, queue.counts);
assert.deepEqual(subjects, queue.subjects);
assert.deepEqual(batches, queue.batchCounts);
assert.equal(counts.preservar_mecanismo, audit.chapters.filter(chapter => chapter.verdict === 'manter').length);
assert.equal(counts.fila_a_revalidar + counts.achado_tratado, audit.chapters.filter(chapter => chapter.verdict !== 'manter').length);
const cell = value => /[",\n\r]/.test(value) ? `"${value.replaceAll('"', '""')}"` : value;
const csvRows = [['id','materia','titulo','status','lote','arquivos','achados'], ...queue.chapters.filter(chapter => chapter.status === 'fila_a_revalidar').map(chapter => [chapter.id, chapter.subject, chapter.title, chapter.status, chapter.batch, chapter.sourceFiles.join(';'), chapter.findings.map(finding => finding.description).join(' | ')])];
const expectedCsv = csvRows.map(row => row.map(cell).join(',')).join('\n') + '\n';
assert.equal(readFileSync(new URL('../docs/FILA-VISUAL-2026-10-03.csv', import.meta.url), 'utf8').replaceAll('\r\n', '\n'), expectedCsv, 'CSV diverge da fila JSON');
console.log(`Fila íntegra: ${ids.size} IDs; ${counts.fila_a_revalidar} na fila, ${counts.achado_tratado} achados tratados, ${counts.preservar_mecanismo} mecanismos preservados; ${Object.keys(batches).length} lotes.`);
const deep = read(queue.editorial.source);
const pending = deep.filter(chapter => (chapter.rev ?? 1) < 2);
assert.equal(deep.length, queue.editorial.total);
assert.equal(deep.filter(chapter => chapter.rev === 2).length, queue.editorial.revision2);
assert.equal(deep.filter(chapter => chapter.rev === 3).length, queue.editorial.revision3 ?? 0);
assert.equal(deep.filter(chapter => chapter.rev === 4).length, queue.editorial.revision4 ?? 0);
assert.equal(pending.length, queue.editorial.pending);
assert.equal(queue.editorial.chapters.length, pending.length);
const editorialKeys = new Set();
for (const chapter of queue.editorial.chapters) {
  const key = `${chapter.subject}|${chapter.topic}`;
  assert(!editorialKeys.has(key), `Resumo editorial duplicado: ${key}`);
  editorialKeys.add(key);
  assert(pending.some(item => item.subject === chapter.subject && item.topic === chapter.topic));
  const visual = queue.chapters.find(item => item.id === chapter.id);
  assert(visual && visual.subject === chapter.subject && visual.title === chapter.topic);
  assert.equal(chapter.batch, visual.batch);
}
console.log(`Conteúdo vinculado: ${pending.length} resumos pendentes de ${deep.length}, em seus lotes visuais.`);
