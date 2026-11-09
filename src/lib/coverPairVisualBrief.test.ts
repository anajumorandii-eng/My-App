import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCoverPairVisualBrief } from './coverPairVisualBrief';

test('genética geral conecta DNA e cromatina aos estudos de ervilhas de Mendel', () => {
 const brief=buildCoverPairVisualBrief({subject:'Biologia',topic:'Genética'});
 assert.match(brief.frontScenes.join(' '),/paired DNA strands.*chromatin/);
 assert.match(brief.backScenes.join(' '),/Mendelian.*pea/);
 assert.match(brief.connection.join(' '),/DNA filament/);
 assert.notDeepEqual(brief.frontScenes,brief.backScenes);
});

test('subtópicos não herdam o inventário da genética geral', () => {
 const molecular=buildCoverPairVisualBrief({subject:'Biologia',topic:'Genética',subtopic:'Replicação do DNA'});
 assert.match(molecular.frontScenes.join(' '),/replication/);
 assert.doesNotMatch(JSON.stringify(molecular),/\bpea\b|Mendelian/);
 const mendelian=buildCoverPairVisualBrief({subject:'Biologia',topic:'Genética',subtopic:'Leis de Mendel'});
 assert.match(mendelian.frontScenes.join(' '),/pea/);
 assert.doesNotMatch(JSON.stringify(mendelian),/chromatin|microscope/);
 const ecology=buildCoverPairVisualBrief({subject:'Biologia',topic:'Genética',subtopic:'Teias alimentares'});
 assert.doesNotMatch(JSON.stringify(ecology),/Mendelian|DNA filament/);
});

test('replicação de RNA ou viral e herança não mendeliana não recebem cenas de DNA ou Mendel', () => {
 for(const subtopic of ['Replicação do RNA','Replicação viral','Herança não mendeliana','Genética não-mendeliana']) {
  const brief=buildCoverPairVisualBrief({subject:'Biologia',topic:'Genética',subtopic});
  assert.doesNotMatch(brief.frontScenes.join(' '),/DNA replication|Mendelian inheritance|pea/);
 }
});

test('geometria plana ganha cenas próprias sem contaminar outro recorte', () => {
 const plane=buildCoverPairVisualBrief({subject:'Matemática',topic:'Geometria plana'});
 assert.match(plane.frontScenes.join(' '),/compass.*circles.*triangles/);
 assert.match(plane.backScenes.join(' '),/construction notebook/);
 assert.match(plane.connection.join(' '),/construction arc/);
 const specific=buildCoverPairVisualBrief({subject:'Matemática',topic:'Geometria plana',subtopic:'Semelhança de triângulos'});
 assert.match(specific.frontScenes.join(' '),/corresponding triangles/);
 const other=buildCoverPairVisualBrief({subject:'Matemática',topic:'Geometria plana',subtopic:'Função quadrática'});
 assert.doesNotMatch(JSON.stringify(other),/construction notebook|brass compass/);
 const history=buildCoverPairVisualBrief({subject:'História',topic:'Genética e geometria plana'});
 assert.doesNotMatch(JSON.stringify(history),/Mendelian|construction notebook/);
});

test('população e urbanização planejam duas cenas humanas e espaciais, sem o inventário climático',()=>{
 const brief=buildCoverPairVisualBrief({subject:'Geografia',topic:'Geografia da População e Urbana do Brasil'});
 assert.match(brief.frontScenes.join(' '),/Population geography.*Urban geography/);
 assert.match(brief.backScenes.join(' '),/generations/);
 assert.match(brief.backScenes.join(' '),/urban neighborhoods/);
 assert.match(brief.connection.join(' '),/transit route/);
 assert.doesNotMatch(JSON.stringify(brief),/watershed|ANTIQUE BRASS|cloud band/);
});
test('climatologia preserva a composição aprovada exclusivamente no seu recorte',()=>{
 const brief=buildCoverPairVisualBrief({subject:'Geografia',topic:'Climatologia e Problemas Socioambientais'});
 assert.match(brief.frontScenes.join(' '),/globe IN ITS ANTIQUE BRASS SUPPORT WITH VISIBLE BASE AND STAND/);
 assert.match(brief.backScenes.join(' '),/watershed/);
 assert.match(brief.connection.join(' '),/cloud band/);
 assert.doesNotMatch(brief.backScenes.join(' '),/urban neighborhoods/);
});
test('um recorte específico substitui os temas amplos, inclusive em matérias diferentes',()=>{
 const specific=buildCoverPairVisualBrief({subject:'Geografia',topic:'Climatologia, população e cidades',subtopic:'Migrações internas'});
 assert.match(specific.frontScenes.join(' '),/Migration geography/);
 assert.doesNotMatch(JSON.stringify(specific),/watershed|ANTIQUE BRASS|urban neighborhoods/);
 const general=buildCoverPairVisualBrief({subject:'Geografia',topic:'Urbanização',subtopic:'Visão geral'});
 assert.match(general.backScenes.join(' '),/urban neighborhoods/);
 const other=buildCoverPairVisualBrief({subject:'História',topic:'História urbana'});
 assert.doesNotMatch(other.frontScenes.join(' '),/Urban geography/);
});
test('recorte livre e obra literária permanecem dados e não recebem cenas de outros conteúdos',()=>{
 for(const context of [
  {subject:'Geografia',topic:'Climatologia',subtopic:'Recorte personalizado <especial>'},
  {subject:'Literatura',work:'Obra de teste',subtopic:'Espaço narrativo'},
  {subject:'Português',topic:'Sintaxe'},
 ]){
  const brief=buildCoverPairVisualBrief(context);
  assert.equal(brief.scope,context.subtopic||context.topic);
  assert.match(brief.backScenes.join(' '),/DIFFERENT scene grounded in the same exact scope/);
  assert.match(brief.pairRule,/Check each side independently/);
  assert.doesNotMatch(JSON.stringify(brief),/Brazilian watershed|ANTIQUE BRASS|urban neighborhoods/);
 }
});
