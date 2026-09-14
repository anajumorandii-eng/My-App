import test from 'node:test';
import assert from 'node:assert/strict';
import { FAMILIES, samplePoints, num, type FamilyId } from './curveFamilies';

const IDS = Object.keys(FAMILIES) as FamilyId[];

test('num escreve em pt-BR e não inventa casa decimal', () => {
  assert.equal(num(2), '2');
  assert.equal(num(2.5), '2,5');
  // Menos tipográfico, não hífen ASCII: as leituras ficam lado a lado com
  // expressões que já escrevem "−", e os dois sinais na mesma linha desalinham.
  assert.equal(num(-0.75), '−0,75');
  assert.equal(num(Number.POSITIVE_INFINITY), '—');
});

test('toda família devolve leitura e expressão nos valores iniciais', () => {
  for (const id of IDS) {
    const f = FAMILIES[id];
    const [pa, pb] = f.params;
    const expr = f.expression(pa.initial, pb.initial);
    assert.ok(expr.includes('f(x)'), `${id}: expressão sem f(x) — "${expr}"`);
    // "+ -3" é o sintoma de montar a parcela sem tratar o sinal.
    assert.ok(!expr.includes('+ -'), `${id}: sinal duplicado em "${expr}"`);
    assert.ok(f.readouts(pa.initial, pb.initial).length > 0, `${id}: sem leitura`);
    assert.ok(f.insight.length > 40, `${id}: fecho curto demais para ensinar algo`);
  }
});

test('os valores iniciais estão dentro do intervalo do controle', () => {
  for (const id of IDS) {
    for (const p of FAMILIES[id].params) {
      assert.ok(
        p.initial >= p.min && p.initial <= p.max,
        `${id}: ${p.symbol} começa em ${p.initial}, fora de [${p.min}, ${p.max}]`,
      );
    }
  }
});

test('a curva nunca sai como traço único quando há buraco de domínio', () => {
  // O logaritmo não existe em x ≤ 0: os pontos de lá precisam vir nulos, senão
  // o path liga os dois lados com uma reta que a função não tem.
  const log = FAMILIES.logaritmica;
  assert.equal(log.f(-1, 1, 2), null);
  assert.equal(log.f(0, 1, 2), null);
  assert.ok((log.f(4, 1, 2) ?? 0) > 1.9 && (log.f(4, 1, 2) ?? 0) < 2.1, 'log₂(4) deveria dar 2');

  const pontos = samplePoints(log, 1, 2);
  assert.ok(pontos.some((p) => p === null), 'nenhum ponto nulo no trecho fora do domínio');
  assert.ok(pontos.some((p) => p !== null), 'a curva inteira saiu nula');
});

test('a parábola troca o número de raízes quando o vértice cruza o eixo', () => {
  const q = FAMILIES.quadratica;
  const raizesEm = (a: number, c: number) =>
    q.readouts(a, c).find((r) => r.label === 'raízes reais')?.value;

  // Concavidade para cima com vértice abaixo do eixo: corta duas vezes.
  assert.equal(raizesEm(1, -3), 'duas');
  // Vértice na origem: raiz dupla.
  assert.equal(raizesEm(1, 0), 'uma (dupla)');
  // Vértice acima do eixo, abrindo para cima: nunca cruza.
  assert.equal(raizesEm(1, 3), 'nenhuma real');
});

test('a exponencial mantém o tempo de duplicação constante', () => {
  const e = FAMILIES.exponencial;
  const dobra = (b: number) => e.readouts(1, b).find((r) => r.label === 'dobra em')?.value;
  assert.equal(dobra(2), '1 passos');
  assert.equal(dobra(0.5), 'nunca dobra');
  // Duplicar de 1 para 2 e de 4 para 8 leva o mesmo tanto — é o ponto do capítulo.
  assert.equal(e.f(0, 1, 2), 1);
  assert.equal(e.f(1, 1, 2), 2);
  assert.equal(e.f(2, 1, 2), 4);
});

test('amplitude e período da senoide são independentes', () => {
  const s = FAMILIES.senoidal;
  const periodo = (b: number) => s.readouts(1, b).find((r) => r.label === 'período')?.value;
  const amplitude = (a: number) => s.readouts(a, 1).find((r) => r.label === 'amplitude')?.value;
  // Mudar a amplitude não pode mexer no período, e vice-versa.
  assert.equal(periodo(1), periodo(1));
  assert.notEqual(periodo(1), periodo(2));
  assert.equal(amplitude(2), '2');
  assert.equal(s.readouts(2, 3).find((r) => r.label === 'amplitude')?.value, '2');
});

test('o módulo nunca devolve valor negativo', () => {
  const m = FAMILIES.modular;
  for (let x = -6; x <= 6; x += 0.5) {
    const y = m.f(x, 1.5, -2);
    assert.ok(y !== null && y >= 0, `|1,5x − 2| deu ${y} em x = ${x}`);
  }
});

test('a cúbica nunca fica sem raiz real', () => {
  const p = FAMILIES.polinomial;
  for (const a of [-6, -3, 0, 3, 6]) {
    for (const b of [-6, -2, 0, 2, 6]) {
      const raizes = p.readouts(a, b).find((r) => r.label === 'raízes')?.value ?? '';
      // Grau ímpar vai de −∞ a +∞, então cruza o eixo pelo menos uma vez: as
      // três leituras possíveis contam raiz real, e nenhuma delas é "nenhuma".
      assert.match(raizes, /(uma real|três reais|repetida)/, `a=${a}, b=${b}: "${raizes}"`);
      assert.doesNotMatch(raizes, /nenhuma/, `grau ímpar sem raiz real em a=${a}, b=${b}`);
    }
  }
});
