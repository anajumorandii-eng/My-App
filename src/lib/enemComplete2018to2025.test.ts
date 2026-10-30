import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import type { Question } from '../types';
const bank:Question[]=JSON.parse(readFileSync('public/questions.json','utf8'));
const manifest=JSON.parse(readFileSync('scripts/data/enem-completo-2018-2025/manifest.json','utf8'));

test('ENEM integral: 16 cadernos, 1440 posições distintas, sem contar cores ou idiomas duas vezes',()=>{
  assert.equal(manifest.positions.length,1440);
  assert.equal(new Set(manifest.positions.map((p:any)=>p.questionId)).size,1440);
  assert.equal(manifest.positions.filter((p:any)=>p.status==='annulled').length,10);
  for(let y=2018;y<=2025;y++)for(const day of [1,2]){
    const positions=manifest.positions.filter((p:any)=>p.year===y&&p.day===day);
    assert.deepEqual(positions.map((p:any)=>p.number),Array.from({length:90},(_,i)=>i+(day===1?1:91)));
    for(const p of positions){
      const q=bank.find(q=>q.id===p.questionId)!;assert.ok(q,p.questionId);
      if(p.status==='annulled'){assert.equal(q.status,'annulled');assert.equal(q.correctOptionId,'');}
      else assert.equal(q.correctOptionId,p.answer,q.id);
    }
  }
});

test('contexto compartilhado, figuras nativas e equivalência entre cadernos preservados',()=>{
  const get=(year:number,number:number)=>bank.find(q=>q.id===manifest.positions.find((p:any)=>p.year===year&&p.number===number).questionId)!;
  assert.match(get(2025,6).prompt,/De próprio punho/);
  assert.match(get(2025,10).prompt,/o punho e o pixel/);
  assert.ok(get(2022,5).figures?.length,'tirinha da opção inglês');
  assert.ok(get(2025,93).figures?.length,'esquema da vacina');
  for(const [year,number] of [[2019,22],[2019,147],[2021,134],[2023,145],[2023,147],[2023,148],[2024,122],[2025,140]]) {
    assert.ok(get(year,number).figures?.length,`Contexto visual obrigatório: ${year}/${number}`);
  }
  assert.match(get(2023,147).prompt,/AQₙB/);
  for(const number of [101,103]) {
    const id=get(2025,number).id;
    assert.ok(manifest.media.some((f:any)=>f.questionId===id&&f.box[0]>=280&&f.box[3]>730),`Alternativa visual E completa: 2025/${number}`);
  }
  assert.equal(get(2022,157).id,'enem_2022_d2_cd5_q157');
  assert.equal(get(2023,142).id,'q_real_enem_2023_mat');
  assert.equal(get(2018,42).id,'enem_expansao_2018_q06');
  for(const media of manifest.media){
    assert.match(media.url,/\/enem-completo\/enem-20\d\d-d[12]-q\d{3}-p\d+-\d+\.webp$/);
    assert.equal(createHash('sha256').update(readFileSync(`public${media.url}`)).digest('hex'),media.sha256);
  }
});
