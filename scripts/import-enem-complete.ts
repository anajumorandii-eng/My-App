/** npx tsx scripts/import-enem-complete.ts [--write] */
import assert from 'node:assert/strict';
import { readFile, writeFile, rename } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { mockTopics } from '../src/data/mockData';
import type { Question } from '../src/types';

const directory='scripts/data/enem-completo-2018-2025';
const manifest=JSON.parse(await readFile(`${directory}/manifest.json`,'utf8'));
const items=JSON.parse(await readFile(`${directory}/questions.json`,'utf8')) as Question[];
const bank=JSON.parse(await readFile('public/questions.json','utf8')) as Question[];
assert.equal(items.length,1440);assert.equal(manifest.positions.length,1440);
assert.equal(new Set(items.map(q=>q.id)).size,1440);
const catalog=new Map(mockTopics.map(t=>[t.id,t]));
for(let year=2018;year<=2025;year++)for(const day of [1,2]){
  const own=manifest.positions.filter((p:any)=>p.year===year&&p.day===day);
  assert.equal(own.length,90,`${year}/${day}`);
  assert.deepEqual(own.map((p:any)=>p.number),Array.from({length:90},(_,i)=>i+(day===1?1:91)));
}
for(const q of items){
  const position=manifest.positions.find((p:any)=>p.questionId===q.id);
  const topic=catalog.get(q.topicId);
  assert.equal(topic?.subject,q.subject,q.id);assert.ok(topic?.chapters.includes(q.chapter!),q.id);
  assert.ok(q.prompt.trim(),q.id);assert.ok(q.explanation.trim(),q.id);
  assert.equal(q.options.map(o=>o.id).join(''),'abcde');assert.ok(q.options.every(o=>o.text.trim()),q.id);
  if(position.status==='annulled'){assert.equal(q.status,'annulled');assert.equal(q.correctOptionId,'');}
  else {assert.ok(!q.status);assert.equal(q.correctOptionId,position.answer);assert.ok(q.options.some(o=>o.id===q.correctOptionId));}
}
for(const media of manifest.media){
  assert.match(media.url,/^\/question-media\/enem-completo\/enem-20\d\d-d[12]-q\d{3}-p\d+-\d+\.webp$/);
  const bytes=await readFile(`public${media.url}`);
  assert.equal(createHash('sha256').update(bytes).digest('hex'),media.sha256,media.url);
}
const existing=new Map(bank.map(q=>[q.id,q]));assert.equal(existing.size,bank.length);
let added=0,updated=0;
for(const q of items){
  const prior=existing.get(q.id);
  if(prior){
    // Preservar identidade/progresso e conteúdo anterior; somente figuras extraídas.
    const {figures:_a,...before}=prior;const {figures:_b,...after}=q;
    if(!q.id.startsWith('enem_completo_')) assert.deepEqual(before,after,`Conteúdo anterior alterado: ${q.id}`);
    else assert.deepEqual(prior.examSource,q.examSource,`Identidade da edição alterada: ${q.id}`);
    if(JSON.stringify(prior)!==JSON.stringify(q))updated++;
  }else added++;
  existing.set(q.id,q);
}
const merged=[...existing.values()];
if(process.argv.includes('--write')&&(added||updated)){
  const temporary='public/questions.json.enem.tmp';
  await writeFile(temporary,JSON.stringify(merged,null,2)+'\n');await rename(temporary,'public/questions.json');
}
console.log(`${process.argv.includes('--write')?'Importação':'Simulação'}: ${added} novas, ${updated} atualizadas; banco ${bank.length} → ${merged.length}; 1440 posições, 10 anuladas.`);
