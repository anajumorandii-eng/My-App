import test from 'node:test';
import assert from 'node:assert/strict';
import { generatorSpatial } from './generatorSpatial';
test('a normal da bobina define fluxo e a fase define FEM, conservando área', () => {
  for (const phase of [0,30,90,180,270,360]) {
    const m=generatorSpatial(phase,10);
    assert.ok(Math.abs(Math.hypot(...m.normal)-1)<1e-10);
    assert.ok(Math.abs(m.fluxLinkage-.4*m.normal[2])<1e-10);
    for (const p of m.points) assert.ok(Math.abs(p.reduce((sum,v,i)=>sum+v*m.normal[i],0))<1e-10);
    assert.ok(Math.abs(Math.hypot(...m.points[0].map((v,i)=>v-m.points[1][i]))-130)<1e-10);
  }
  assert.equal(generatorSpatial(0,10).emf,0);
  assert.equal(generatorSpatial(90,10).emf,4);
  assert.equal(generatorSpatial(270,10).emf,-4);
});
test('a FEM é menos a derivada temporal do fluxo concatenado e zera sem rotação',()=>{
  const theta=40, omega=12,dt=1e-6;
  const m=generatorSpatial(theta,omega),next=generatorSpatial(theta+omega*dt*180/Math.PI,omega);
  assert.ok(Math.abs(m.emf+(next.fluxLinkage-m.fluxLinkage)/dt)<1e-4);
  assert.equal(generatorSpatial(90,0).emf,0);
});
