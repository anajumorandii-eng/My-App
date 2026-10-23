import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { mockTopics } from '../data/mockData';
import { loadStudyPacket } from './loadStudyPacket';
import { normalizeReviewOptions } from './strategicReview';
test('pacotes reais mudam com banca/fase e preservam diversidade sem preferência herdada',async()=>{
  const original=globalThis.fetch;
  globalThis.fetch=async()=>new Response(await readFile(new URL('../../public/questions.json',import.meta.url),'utf8'));
  try {
    const topic=mockTopics.find(t=>t.id==='mat_geometria_plana')!;
    const own=await loadStudyPacket(topic,'',['FUVEST'],[],normalizeReviewOptions({boards:['FUVEST']}));
    const other=await loadStudyPacket(topic,'',['UNESP'],[],normalizeReviewOptions({boards:['UNESP']}));
    assert.ok(own.sources.length);assert.ok(other.sources.length);
    assert.ok(own.sources.filter(s=>s.board).every(s=>s.board==='FUVEST'));
    assert.ok(other.sources.filter(s=>s.board).every(s=>s.board==='UNESP'));
    assert.notEqual(own.referenceText,other.referenceText);
    const multiple=await loadStudyPacket(topic,'',['UNESP','ENEM'],[],normalizeReviewOptions({boards:['UNESP','ENEM']}));
    assert.ok(multiple.sources.some(s=>s.board==='UNESP'));assert.ok(multiple.sources.some(s=>s.board==='ENEM'));
    assert.equal(multiple.sources.some(s=>s.board==='FUVEST'),false);
    const second=await loadStudyPacket(topic,'',['FUVEST'],[],normalizeReviewOptions({boards:['FUVEST'],scopes:{FUVEST:'second'}}));
    assert.ok(second.sources.filter(s=>s.board).every(s=>/2ª fase/.test(s.title)));
    const work=await loadStudyPacket({id:'obra:bras-cubas',name:'Brás Cubas',subject:'Literatura',prerequisites:[]},'',['UNESP'],[],normalizeReviewOptions({boards:['UNESP'],sourceMode:'work',materialKind:'literature'}));
    assert.ok(work.sources.some(s=>/Crítica documentada/.test(s.title)));
    assert.ok(work.sources.some(s=>/Edição consultada/.test(s.title)));
    assert.match(work.referenceText,/https:\/\/doi.org/);
  } finally {globalThis.fetch=original;}
});
