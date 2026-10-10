import { test } from 'node:test';
import assert from 'node:assert/strict';
import { atwoodState, circularState, conicalState, contactState, gasState, lensState, makerFocal, PHYSICS_SPATIAL_LESSONS, standingDisplacement, tubeMode, wireForce, type GasProcess } from './physicsSpatialBatch';
import { physicsSpatialDrawing } from './physicsSpatialDrawing';
import { rotateSpatialPoint } from './spatialSolid';
const close=(a:number,b:number)=>assert.ok(Math.abs(a-b)<1e-8,`${a} != ${b}`);
test('gases conservam quantidade e energia em expansão e compressão',()=>{
  for(const process of ['isotherm','isobar','isochor','adiabat'] as GasProcess[])for(const ratio of [.5,1,1.5,2]) {
    const m=gasState(process,ratio);
    close(m.pressure*m.volume/m.temperature,1/3);close(m.heat,m.deltaU+m.work);
    if(process==='isotherm') {close(m.temperature,300);close(m.deltaU,0);}
    if(process==='isobar')close(m.pressure,100);
    if(process==='isochor') {close(m.volume,1);close(m.work,0);}
    if(process==='adiabat') {close(m.heat,0);close(m.pressure*m.volume**(5/3),100);}
    if(process!=='isochor'&&ratio!==1)assert.equal(Math.sign(m.work),Math.sign(ratio-1));
  }
});
test('MCU conserva raio e rapidez com velocidade tangente e aceleração radial',()=>{
  for(const phase of [0,.13,.25,.7,1]) {
    const m=circularState(4,phase);close(Math.hypot(...m.position),2);close(Math.hypot(...m.velocity),4);
    close(m.position.reduce((s,v,i)=>s+v*m.velocity[i],0),0);
    m.acceleration.forEach((v,i)=>close(v,-4*m.position[i]));
  }
});
test('pêndulo cônico respeita comprimento do fio e equilíbrio vertical',()=>{
  for(const angle of [15,35,60]) {
    const m=conicalState(angle,.37);close(Math.hypot(...m.position),2);close(m.tension*Math.cos(angle*Math.PI/180),10);
    close(m.radial,m.speed*m.speed/m.radius);
  }
});
test('atrito estático se ajusta e a transição preserva a condição inicial',()=>{
  for(const force of [0,3,8,10]) {const m=contactState(force,1);close(m.friction,force);close(m.displacement,0);assert.equal(m.sliding,false);}
  const m=contactState(12,1);close(m.friction,6);close(m.acceleration,3);close(m.displacement,.375);close(contactState(12,0).displacement,0);
});
test('Atwood conserva fio e atende Newton nos dois corpos inclusive quando o sentido inverte',()=>{
  for(const mass of [1,2,3,5]) {
    const m=atwoodState(mass,1);close(m.tension-20,2*m.acceleration);close(mass*10-m.tension,mass*m.acceleration);close(atwoodState(mass,0).displacement,0);
    const arrows=physicsSpatialDrawing('atwood',mass,1,'fixed').traces.filter(t=>t.arrow);
    const length=(points:number[][])=>Math.hypot(...points[1].map((v,i)=>v-points[0][i]));
    close(length(arrows[0].points)/length(arrows[1].points),m.tension/(mass*10));
    const labels=physicsSpatialDrawing('atwood',mass,0,'fixed').labels;
    assert.deepEqual(labels.map(l=>l.text),['m₁','m₂']);
    const views=labels.map(l=>rotateSpatialPoint(l.point,25,20));assert.ok(views[1][0]-views[0][0]>50);
  }
});
test('lentes concordam com Gauss e ficam mais fracas em meio de maior índice',()=>{
  for(const p of [30,40,60,90]) {const m=lensState(p);close(1/20,1/p+1/m.image);close(m.height/10,-m.image/p);assert.ok(m.image>0&&m.height<0);}
  close(makerFocal(1),20);assert.ok(makerFocal(1.35)>makerFocal(1));
});
test('nós da corda permanecem imóveis em todos os instantes',()=>{
  for(let mode=1;mode<=4;mode++)for(let node=0;node<=mode;node++)for(const phase of [0,.125,.25,.5,.8,1])close(standingDisplacement(node/mode,mode,phase),0);
  close(standingDisplacement(.25,2,0),.04);close(standingDisplacement(.25,2,.5),-.04);
});
test('tubo fechado seleciona apenas os harmônicos ímpares e respeita extremos de deslocamento',()=>{
  for(let mode=1;mode<=4;mode++) {const open=tubeMode(mode,false),closed=tubeMode(mode,true);close(open.frequency,170*mode);close(closed.frequency,85*(2*mode-1));close(Math.abs(Math.cos(open.waveNumber)),1);close(Math.abs(Math.sin(closed.waveNumber)),1);}
});
test('força no fio é perpendicular ao campo e à corrente e desaparece no paralelismo',()=>{
  for(const angle of [0,30,90,150,180]) {const f=wireForce(angle);close(f[0],0);close(f[1],0);close(f[2],Math.sin(angle*Math.PI/180));}
  close(wireForce(0)[2],0);close(wireForce(180)[2],0);close(wireForce(90)[2],1);
  for(const angle of [0,180])assert.match(physicsSpatialDrawing('wire',angle,0,'fixed').reading,/sem direção definida/);
});
test('24 capítulos têm geometria finita nos extremos e câmera conserva distâncias',()=>{
  assert.equal(Object.keys(PHYSICS_SPATIAL_LESSONS).length,24);
  for(const c of Object.values(PHYSICS_SPATIAL_LESSONS))for(const value of [c.min,c.initial,c.max])for(const time of [0,.5,1]) {
    const choices=c.kind==='gas'?['isotherm','isobar','isochor','adiabat']:c.kind==='tube'?['open','closed']:c.kind==='reflection'?['fixed','free']:['fixed'];
    for(const choice of choices) {
      const m=physicsSpatialDrawing(c.kind,value,time,choice);assert.ok(m.traces.length&&m.reading&&m.legend);
      for(const p of [...m.traces.flatMap(t=>t.points),...m.dots.map(d=>d.point)]) {assert.ok(p.every(Number.isFinite));close(Math.hypot(...p),Math.hypot(...rotateSpatialPoint(p,190,45)));}
    }
  }
});
