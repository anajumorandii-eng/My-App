import assert from 'node:assert/strict';
import test from 'node:test';
import { THERMO } from './thermoLab';
test('trabalho sob pressão constante usa P vezes delta V',()=>assert.equal(THERMO['gas-work'].readouts(4)[1].value,'12 J'));
test('primeira lei desconta trabalho do calor recebido',()=>assert.equal(THERMO['first-law'].readouts(5)[1].value,'7 J'));
test('ciclo calcula trabalho e rendimento',()=>assert.equal(THERMO.carnot.readouts(8)[2].value,'60%'));
test('Carnot conserva o balanço e usa Qc/Qh = Tc/Th em kelvin em todo o controle',()=>{
  for(let qc=1;qc<=18;qc++) {
    const readings=THERMO.carnot.readouts(qc);
    assert.equal(readings.find(r=>r.label==='Fonte quente')?.value,'600 K');
    assert.equal(readings.find(r=>r.label==='Fonte fria')?.value,`${30*qc} K`);
    assert.equal(readings.find(r=>r.label==='Trabalho W')?.value,`${20-qc} J`);
    assert.equal(readings.find(r=>r.label==='Rendimento')?.value,`${100-5*qc}%`);
  }
});
