import test from 'node:test';
import assert from 'node:assert/strict';
import {
  CONFIGS, coeficienteAngular, distanciaEntrePontos, distanciaPontoReta, escreverReta,
  interseccao, moduloEArgumento, num, pontoMedio, posicaoDeRetas, posicaoNoCirculo,
  posicaoRetaCirculo, projecaoNaReta, type ConfigId,
} from './analyticPlane';

const IDS = Object.keys(CONFIGS) as ConfigId[];

test('distância e ponto médio saem de Pitágoras, não de fórmula nova', () => {
  assert.equal(distanciaEntrePontos({ x: 0, y: 0 }, { x: 3, y: 4 }), 5);
  assert.deepEqual(pontoMedio({ x: -3, y: -2 }, { x: 3, y: 2 }), { x: 0, y: 0 });
});

test('o coeficiente angular não existe na reta vertical', () => {
  assert.equal(coeficienteAngular({ x: 2, y: -1 }, { x: 2, y: 5 }), null);
  assert.equal(coeficienteAngular({ x: 0, y: 0 }, { x: 2, y: 4 }), 2);
});

test('a distância de um ponto a uma reta é medida na perpendicular', () => {
  // 3x + 4y − 10 = 0 e o ponto (0,0): |−10| / 5 = 2.
  const r = { a: 3, b: 4, c: -10 };
  assert.equal(distanciaPontoReta({ x: 0, y: 0 }, r), 2);

  // O pé da perpendicular está sobre a reta, e a distância até ele é a mesma.
  const pe = projecaoNaReta({ x: 0, y: 0 }, r);
  assert.ok(Math.abs(r.a * pe.x + r.b * pe.y + r.c) < 1e-9, 'o pé saiu fora da reta');
  assert.ok(Math.abs(distanciaEntrePontos({ x: 0, y: 0 }, pe) - 2) < 1e-9);
});

test('qualquer outro caminho até a reta é mais longo que a perpendicular', () => {
  const r = { a: 1, b: -1, c: -1 };
  const p = { x: 2.5, y: 3 };
  const d = distanciaPontoReta(p, r);
  const pe = projecaoNaReta(p, r);
  // Anda sobre a reta a partir do pé: todo ponto alcançado fica mais longe.
  for (const passo of [-3, -1, -0.4, 0.4, 1, 3]) {
    const outro = { x: pe.x + passo * 0.7071, y: pe.y + passo * 0.7071 };
    assert.ok(
      distanciaEntrePontos(p, outro) > d,
      `o ponto a ${passo} do pé ficou mais perto que a perpendicular`,
    );
  }
});

test('a posição no círculo compara distância e raio', () => {
  const c = { cx: 0, cy: 0, r: 3 };
  assert.equal(posicaoNoCirculo({ x: 0, y: 0 }, c), 'dentro');
  assert.equal(posicaoNoCirculo({ x: 3, y: 0 }, c), 'sobre');
  assert.equal(posicaoNoCirculo({ x: 5, y: 0 }, c), 'fora');
});

test('o determinante separa concorrentes, paralelas e coincidentes', () => {
  const r1 = { a: 1, b: -1, c: 0 };
  assert.equal(posicaoDeRetas(r1, { a: 1, b: 1, c: -2 }), 'concorrentes');
  assert.equal(posicaoDeRetas(r1, { a: 2, b: -2, c: 6 }), 'paralelas');
  // A mesma reta multiplicada por 2 não é uma reta nova.
  assert.equal(posicaoDeRetas(r1, { a: 2, b: -2, c: 0 }), 'coincidentes');
  assert.equal(interseccao(r1, { a: 2, b: -2, c: 6 }), null, 'paralelas não têm ponto comum');
  assert.deepEqual(interseccao(r1, { a: 1, b: 1, c: -2 }), { x: 1, y: 1 });
});

test('reta e circunferência: a comparação d × r decide o número de pontos', () => {
  const c = { cx: 0, cy: 0, r: 3 };
  assert.equal(posicaoRetaCirculo({ a: 1, b: 0, c: 0 }, c), 'secante');
  assert.equal(posicaoRetaCirculo({ a: 1, b: 0, c: -3 }, c), 'tangente');
  assert.equal(posicaoRetaCirculo({ a: 1, b: 0, c: -5 }, c), 'externa');
});

test('módulo e argumento do complexo', () => {
  const { modulo, argumento } = moduloEArgumento({ x: 3, y: 4 });
  assert.equal(modulo, 5);
  assert.ok(Math.abs(argumento - 53.13) < 0.01, `esperava ~53,13°, veio ${argumento}`);
  // Abaixo do eixo real o argumento é medido no sentido positivo, não negativo.
  assert.ok(moduloEArgumento({ x: 1, y: -1 }).argumento > 300);
});

test('a reta é escrita sem coeficiente 1 nem termo nulo', () => {
  assert.equal(escreverReta({ a: 1, b: -1, c: 0 }), 'x − y = 0');
  assert.equal(escreverReta({ a: 1, b: 1, c: -4 }), 'x + y − 4 = 0');
  assert.equal(escreverReta({ a: 3, b: 4, c: -10 }), '3x + 4y − 10 = 0');
  assert.equal(escreverReta({ a: 0, b: 1, c: 2 }), 'y + 2 = 0');
});

test('num usa o menos tipográfico, igual ao resto da prancha', () => {
  assert.equal(num(-2.5), '−2,5');
  assert.equal(num(4), '4');
});

test('toda configuração responde nos valores iniciais', () => {
  for (const id of IDS) {
    const c = CONFIGS[id];
    assert.ok(c.readouts(c.inicial).length > 0, `${id}: sem leitura`);
    assert.ok(c.insight.length > 60, `${id}: fecho curto demais para ensinar algo`);
    assert.ok(
      Math.abs(c.inicial.x) <= c.alcance && Math.abs(c.inicial.y) <= c.alcance,
      `${id}: o ponto começa fora do plano desenhado`,
    );
    for (const m of c.annotations(c.inicial)) {
      assert.ok(Number.isFinite(m.x) && Number.isFinite(m.y), `${id}: âncora não numérica em "${m.text}"`);
      assert.ok(m.text.length <= 26, `${id}: legenda longa demais — "${m.text}"`);
    }
  }
});

test('arrastar o ponto muda alguma leitura em toda configuração', () => {
  // A regra que faltava: `reta-circunferencia` e `duas-retas` nasceram com
  // leituras que ignoravam o ponto. A prancha desenhava, a estudante arrastava,
  // e nada mudava — instrumento que não responde à manipulação é figura.
  for (const id of IDS) {
    const c = CONFIGS[id];
    const base = c.readouts(c.inicial).map((l) => l.value).join('|');
    const mexido = c.readouts({ x: c.inicial.x - 1.7, y: c.inicial.y + 1.3 })
      .map((l) => l.value).join('|');
    assert.notEqual(mexido, base, `${id}: mover o ponto não mudou leitura nenhuma`);
  }
});

test('a reta que depende do ponto realmente passa por ele', () => {
  for (const id of IDS) {
    const c = CONFIGS[id];
    if (!c.retaDe) continue;
    for (const p of [c.inicial, { x: 1.5, y: -2 }, { x: -3, y: 4 }]) {
      const r = c.retaDe(p);
      assert.ok(
        Math.abs(r.a * p.x + r.b * p.y + r.c) < 1e-9,
        `${id}: a reta gerada não contém o ponto (${p.x}; ${p.y})`,
      );
    }
  }
});

test('afastar a reta do centro leva de secante a externa', () => {
  const c = CONFIGS['reta-circunferencia'];
  const circulo = c.circulo!;
  const leia = (p: { x: number; y: number }) =>
    c.readouts(p).find((l) => l.label === 'posição')?.value;
  // Perto do centro corta duas vezes; longe, não toca. É o que o arraste ensina.
  assert.equal(leia({ x: 0.5, y: 0.5 }), 'secante');
  assert.equal(leia({ x: 4.5, y: 4.5 }), 'externa');
  assert.ok(circulo.r === 3, 'o raio mudou e os valores do teste não valem mais');
});

test('girar r₂ até ficar paralela faz o ponto comum sumir', () => {
  const c = CONFIGS['duas-retas'];
  const posicao = (p: { x: number; y: number }) =>
    c.readouts(p).find((l) => l.label === 'posição')?.value;
  const comum = (p: { x: number; y: number }) =>
    c.readouts(p).find((l) => l.label === 'ponto comum')?.value;

  assert.equal(posicao({ x: 3, y: 1 }), 'concorrentes');
  // r₁ tem inclinação 1 e A está em (0; −3): o ponto (3; 0) deixa r₂ paralela.
  assert.equal(posicao({ x: 3, y: 0 }), 'paralelas');
  assert.equal(comum({ x: 3, y: 0 }), 'nenhum');
});

test('a anotação das duas retas não confunde paralelismo com cruzamento fora da vista', () => {
  const c = CONFIGS['duas-retas'];
  const texto = (p: { x: number; y: number }) => c.annotations(p)[0]?.text ?? '';

  // Cruzamento dentro do quadro.
  assert.equal(texto(c.inicial), 'o ponto comum');
  // Paralelas de verdade: aí sim não existe ponto comum.
  assert.equal(texto({ x: 3, y: 0 }), 'paralelas: não se cruzam');
  // Concorrentes com o encontro longe: continua havendo ponto comum, e dizer o
  // contrário seria mentir sobre a geometria.
  assert.equal(texto({ x: 3, y: 1 }), 'cruzam fora do quadro');
  assert.equal(
    c.readouts({ x: 3, y: 1 }).find((l) => l.label === 'posição')?.value,
    'concorrentes',
  );
});
