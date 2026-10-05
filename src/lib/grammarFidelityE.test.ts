import assert from 'node:assert/strict';
import test from 'node:test';
import {GRAMMAR_INSTRUMENTS as configs} from './grammarInstrumentLab';
test('funções nominais focalizam a ligação ao nome e o chamamento',()=>{
 assert.equal(configs['nominal-function'].control.display(0),'adjunto adnominal');
 assert.equal(configs['nominal-function'].control.display(1),'complemento nominal');
 assert.match(configs['nominal-function'].readouts(0).find(r=>r.pivot)!.value,/livro de Ana/);
 assert.match(configs['nominal-function'].readouts(1).find(r=>r.pivot)!.value,/respeito às regras/);
 assert.match(configs['nominal-function'].readouts(2).find(r=>r.pivot)!.value,/Ana, revise/);
});
test('onde retoma lugar numa restritiva, não cria terceira classe de oração adjetiva',()=>{
 assert.equal(configs['adjective-clause'].control.display(2),'restritiva com onde');
});
test('abstrato nomeia propriedade dependente de ser sem reduzir realidade a imaginação',()=>{
 const config=configs['noun-class'];
 assert.doesNotMatch(config.insight,/só existe na percepção/);
 assert.match(config.readouts(1).find(r=>r.label==='O que nomeia')!.value,/atribuída a um ser/);
});
test('reescrita do telescópio identifica expressamente quem usou o instrumento',()=>{
 assert.equal(configs.ambiguity.readouts(1).find(r=>r.pivot)!.value,'Usei o telescópio para ver a aluna.');
});
test('parar é aspectual e projeção de pressupostos não é invariância absoluta',()=>{
 assert.doesNotMatch(configs['implicit-meaning'].relation,/factivo/);
 assert.doesNotMatch(configs['implicit-meaning'].insight,/continua valendo/);
 assert.match(configs['implicit-meaning'].insight,/contexto/);
});
