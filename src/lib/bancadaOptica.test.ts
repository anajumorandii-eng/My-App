import test from 'node:test';
import assert from 'node:assert/strict';
import { MEDIDAS, PREFERENCIAS_PADRAO, lerPreferencias } from './bancadaOptica';
import { imagemDaLente, raiosNotaveis } from './lenteDelgada';

const { foco, alturaObjeto, raioLente, pMin, pMax, trilhoFim, meiaAlturaAnteparo, eixo } = MEDIDAS;
const extremos = [pMin, pMax, (pMin + pMax) / 2];

test('os três raios notáveis atravessam a lente em todo o curso do objeto', () => {
  // O feixe desenhado vai até 96% do raio; o raio notável precisa caber nele.
  for (const p of extremos) {
    for (const raio of raiosNotaveis(p, foco, alturaObjeto)) {
      assert.ok(Math.abs(raio[1].y) < raioLente * 0.96, `p = ${p}: raio cruza a lente em y = ${raio[1].y}`);
    }
  }
});

test('a imagem cabe no anteparo e o anteparo cabe no trilho', () => {
  for (const p of extremos) {
    const imagem = imagemDaLente(p, foco)!;
    assert.ok(Math.abs(imagem.aumento) * alturaObjeto < meiaAlturaAnteparo, `p = ${p}: imagem maior que o anteparo`);
    assert.ok(imagem.pLinha < trilhoFim - 0.5, `p = ${p}: anteparo fora do trilho`);
  }
});

test('o objeto nunca chega ao foco, onde não há imagem', () => {
  assert.ok(pMin > foco);
});

test('o anel da lente fica acima do trilho', () => {
  // Trilho até y = 0,19; o carro sobe até 0,41. O anel precisa passar disso.
  assert.ok(eixo - raioLente - 0.13 > 0.41);
});

test('preferências: armazenamento vazio, quebrado ou inválido volta ao padrão', () => {
  assert.deepEqual(lerPreferencias(null), PREFERENCIAS_PADRAO);
  assert.deepEqual(lerPreferencias('{quebrado'), PREFERENCIAS_PADRAO);
  assert.deepEqual(lerPreferencias('"texto"'), PREFERENCIAS_PADRAO);
  assert.deepEqual(lerPreferencias(JSON.stringify({ papel: 'pautado' })), { papel: 'pautado' });
  assert.equal(lerPreferencias(JSON.stringify({ papel: 'quadriculado' })).papel, 'milimetrado');
  // Chave gravada antes, com rabiscos, carimbo e movimento: o papel continua valendo.
  assert.deepEqual(lerPreferencias(JSON.stringify({ rabiscos: false, carimbo: true, papel: 'liso', movimento: false })), { papel: 'liso' });
});
