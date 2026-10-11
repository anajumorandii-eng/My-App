import test from 'node:test';
import assert from 'node:assert/strict';
import { CHEMISTRY_SPATIAL_LESSONS, colligativeState, compressedEquilibrium, copperMass, FARADAY, firstOrderState, idealGas, stoichiometricState } from './chemistrySpatialBatch';
import { chemistrySpatialDrawing } from './chemistrySpatialDrawing';
import { rotateSpatialPoint } from './spatialSolid';
const near=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-9,`${a} != ${b}`);
test('Clapeyron e Dalton conservam nRT e soma das pressões parciais',()=>{
  for(const v of [1,2,4])for(const fraction of [.1,.5,.9]){const m=idealGas(v,fraction);near(m.pressure*v,249.42);near(m.partialA+m.partialB,m.pressure);near(m.partialA/m.pressure,fraction);}
});
test('estequiometria conserva H, O e massa antes, durante e depois da conversão',()=>{
  for(const n of [1,3,4,6])for(const t of [0,.37,1]){const s=stoichiometricState(n,t);near(2*s.hydrogen+2*s.water,2*n);near(2*s.oxygen+s.water,4);near(s.mass,2*n+64);assert.ok(Math.min(s.hydrogen,s.oxygen,s.water)>=0);}
  near(stoichiometricState(3,1).oxygen,.5);near(stoichiometricState(6,1).hydrogen,2);near(stoichiometricState(4,1).hydrogen,0);
});
test('congelamento depende de molalidade e fator i, não da câmera',()=>{
  near(colligativeState(.5,false).freezing,-.93);near(colligativeState(.5,true).freezing,-1.86);
});
test('primeira ordem conserva A+B e obedece a meia-vida e velocidade instantânea',()=>{
  for(const k of [.1,.2,.5])for(const t of [0,.37,1]){const s=firstOrderState(k,t);near(s.a+s.b,1);near(s.rate,k*s.a);near(s.time,5*t);}
  near(firstOrderState(.5,Math.log(2)/2.5).a,.5);
});
test('Faraday deposita um mol de cobre por dois mols de elétrons',()=>{near(copperMass(2*FARADAY),63.546);near(copperMass(0),0);near(copperMass(4000),2*copperMass(2000));});
test('compressão conserva unidades NO2 e resolve Kc, com deslocamento correto',()=>{
  for(const v of [.5,1,2])for(const t of [0,.37,1]){const s=compressedEquilibrium(v,t);near((s.b+2*s.a)*v,3);if(t===1)near(s.quotient,1);}
  assert.ok(compressedEquilibrium(.5,1).extent<0);assert.ok(compressedEquilibrium(2,1).extent>0);near(compressedEquilibrium(1,1).extent,0);
});
test('Hess soma -60 para qualquer intermediário; Gibbs troca de sinal em 300 K',()=>{
  for(const h of [-80,-20,40]){const d=chemistrySpatialDrawing('enthalpy',h,0,'');assert.ok(d.reading.includes('soma = −60'));}
  assert.ok(chemistrySpatialDrawing('gibbs',200,0,'').reading.includes('não espontâneo'));assert.ok(chemistrySpatialDrawing('gibbs',500,0,'').reading.includes('termodinamicamente espontâneo'));
});
test('meias-vidas, carga e número atômico permanecem distintos',()=>{
  assert.ok(chemistrySpatialDrawing('decay',4,1,'alpha').reading.includes('6,25%'));
  assert.ok(chemistrySpatialDrawing('decay',2,1,'beta').reading.includes('A constante, Z +1'));
  assert.ok(chemistrySpatialDrawing('periodic',17,0,'').reading.includes('grupo 17; camadas: 2, 8, 7'));
  assert.ok(chemistrySpatialDrawing('cell',.3,1,'').reading.includes('ânodo (−)'));
  assert.ok(chemistrySpatialDrawing('electrolysis',2000,1,'').reading.includes('ânodo Cu (+)'));
});
test('24 IDs únicos geram geometria finita contida em todas as vistas e extremos',()=>{
  assert.equal(Object.keys(CHEMISTRY_SPATIAL_LESSONS).length,24);
  for(const c of Object.values(CHEMISTRY_SPATIAL_LESSONS))for(const v of [c.min,c.initial,c.max])for(const t of [0,.37,1])for(const choice of c.choices?.map(x=>x[0])||['']){
    const d=chemistrySpatialDrawing(c.kind,v,t,choice);assert.ok(d.reading&&d.legend);
    for(const p of [...d.traces.flatMap(x=>x.points),...d.dots.map(x=>x.point)]){assert.ok(p.every(Number.isFinite));assert.ok(Math.hypot(...p)<125,`${c.kind} ${p}`);for(const yaw of [0,90,180,270])near(Math.hypot(...rotateSpatialPoint(p,yaw,65)),Math.hypot(...p));}
  }
});
