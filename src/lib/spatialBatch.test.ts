import test from 'node:test';
import assert from 'node:assert/strict';
import { organicSpatial, waterPair, chromatinSpatial, type OrganicCase } from './organicSpatial';
import { electrostaticSpatial, radialDirections } from './electrostaticSpatial';
import { vectorSpatial } from './vectorSpatial';
import { SPATIAL_CHAPTER_LESSONS } from './spatialBatchCatalog';

test('moléculas mantêm tetravalência e fórmulas incluindo H implícitos',()=>{
  const examples:Partial<Record<OrganicCase,Record<string,number>>>={ethane:{C:2,H:6},propane:{C:3,H:8},butane:{C:4,H:10},branched:{C:4,H:10},ethanol:{C:2,H:6,O:1},secondary:{C:3,H:8,O:1},tertiary:{C:4,H:10,O:1},ethanal:{C:2,H:4,O:1},acetone:{C:3,H:6,O:1},acid:{C:2,H:4,O:2},ether:{C:2,H:6,O:1},amine:{C:2,H:7,N:1},ethene:{C:2,H:4},bromoethane:{C:2,H:5,Br:1},glycol:{C:2,H:6,O:2}};
  const valence:Record<string,number>={C:4,O:2,N:3,Br:1,H:1};
  for(const [kind,formula] of Object.entries(examples)){
    const m=organicSpatial(kind as OrganicCase),counts:Record<string,number>={};
    m.sites.forEach((s,i)=>{counts[s.element]=(counts[s.element]??0)+1;const degree=m.edges.reduce((n,[a,b,k])=>n+(a===i||b===i?k:0),0);assert.ok(degree<=valence[s.element],kind);if(s.element==='C')counts.H=(counts.H??0)+4-degree;else assert.equal(degree,valence[s.element],kind);});
    assert.deepEqual(counts,formula,kind);
  }
});
test('álcoois têm OH em carbono com um, dois ou três vizinhos C',()=>{
  for(const [kind,expected] of [['ethanol',1],['secondary',2],['tertiary',3]] as const){const m=organicSpatial(kind);const o=m.sites.findIndex(s=>s.element==='O');const edge=m.edges.find(([a,b])=>(a===o&&m.sites[b].element==='C')||(b===o&&m.sites[a].element==='C'))!;const c=edge[0]===o?edge[1]:edge[0];assert.equal(m.edges.filter(([a,b])=>(a===c&&m.sites[b].element==='C')||(b===c&&m.sites[a].element==='C')).length,expected);}
});
test('adição e oxidação branda conservam carbonos e alteram a ligação dupla',()=>{
  assert.equal(organicSpatial('ethene').edges[0][2],2);
  for(const kind of ['ethane','glycol'] as const){const m=organicSpatial(kind);assert.equal(m.sites.filter(s=>s.element==='C').length,2);assert.equal(m.edges[0][2],1);}
  assert.equal(organicSpatial('bromoethane').sites.filter(s=>s.element==='Br').length,1);
  assert.equal(organicSpatial('ethanol').sites.filter(s=>s.element==='Br').length,0);
});
test('polietileno mostra 2 C por unidade, ligações simples e duas continuidades',()=>{
  for(const n of [2,3,4]){const m=organicSpatial('polymer',n);assert.equal(m.sites.length,2*n);assert.ok(m.edges.every(e=>e[2]===1));assert.equal(m.bonds.length,2*n+1);}
});
test('separar águas conserva dois ângulos de 104,5° e as ligações O−H',()=>{
  for(const d of [60,70,110]){const m=waterPair(d);for(const o of [0,3]){const a=m.atoms[o+1].point.map((v,i)=>v-m.atoms[o].point[i]);const b=m.atoms[o+2].point.map((v,i)=>v-m.atoms[o].point[i]);const cosine=a.reduce((sum,v,i)=>sum+v*b[i],0)/(Math.hypot(...a)*Math.hypot(...b));assert.ok(Math.abs(Math.acos(cosine)*180/Math.PI-104.5)<1e-8);}assert.equal(m.bonds.filter(b=>b.kind==='hydrogen').length,1);assert.equal(m.bonds.filter(b=>!b.kind).length,4);}
});
test('águas não sobrepõem H entre moléculas na menor separação do controle',()=>{
  const m=waterPair(60);
  for(const a of m.atoms.slice(0,3))for(const b of m.atoms.slice(3))assert.ok(Math.hypot(...a.point.map((v,i)=>v-b.point[i]))>a.radius+b.radius);
});
test('compactar colar conserva nucleossomos e quantidade de segmentos de DNA',()=>{
  const a=chromatinSpatial(0),b=chromatinSpatial(1);assert.equal(a.atoms.length,8);assert.equal(b.atoms.length,8);assert.equal(a.bonds.length,b.bonds.length);assert.ok(Math.abs(b.centers[7][0]-b.centers[0][0])<Math.abs(a.centers[7][0]-a.centers[0][0]));
});
test('lei inversa quadrática, potencial inverso e aceleração são coerentes com o instrumento',()=>{
  assert.equal(electrostaticSpatial('coulomb',2).magnitude/electrostaticSpatial('coulomb',4).magnitude,4);
  assert.equal(electrostaticSpatial('potential',2).magnitude/electrostaticSpatial('potential',4).magnitude,2);
  assert.equal(electrostaticSpatial('uniform-field',3).deltaV,-12);
  assert.equal(electrostaticSpatial('charge-dynamics',4,1).distance,2);
  assert.equal(electrostaticSpatial('charge-dynamics',0,1).distance,0);
  for(const d of radialDirections())assert.ok(Math.abs(Math.hypot(...d)-1)<1e-10);
});
test('vetores preservam composição, módulo, sinais e plano físico',()=>{
  const m=vectorSpatial('vetores',-4);assert.deepEqual(m.resultant,[-4,3,0]);assert.equal(m.magnitude,5);
  const boat=vectorSpatial('composicao',3,.5);assert.deepEqual(boat.position,[1.5,2,0]);assert.equal(boat.magnitude,5);
  assert.deepEqual(vectorSpatial('velocidade',-3).resultant,[4,-3,0]);
});
test('catálogo molecular contém 12 IDs exatos, sem reusar capítulos de outras matérias',()=>{
  assert.equal(Object.keys(SPATIAL_CHAPTER_LESSONS).length,12);assert.ok(Object.keys(SPATIAL_CHAPTER_LESSONS).every(id=>/^summary-(quimica|biologia)-/.test(id)));
});
