/**
 * Desigualdade de renda: o laboratório de Sociologia no Hoje.
 *
 * A população vai em dez colunas, dos 10% mais pobres aos 10% mais ricos, e a
 * altura de cada uma é a fatia da renda total que aquele décimo recebe. Com
 * renda igual, todas têm 10%. O índice de Gini é o dobro da área entre a
 * diagonal da igualdade e a curva de Lorenz.
 *
 * A curva é um modelo, L(p) = p^k, escolhido porque o Gini sai dele em forma
 * fechada: G = (k − 1)/(k + 1). As fatias da cena são as da curva modelo com
 * o Gini escolhido, não a distribuição medida de um país — dois países com o
 * mesmo Gini podem repartir a renda de jeitos diferentes, e o resumo de
 * Geografia diz isso. As referências são as do mesmo resumo: Suécia perto de 0,28,
 * Estados Unidos perto de 0,41, Brasil em torno de 0,52.
 */

export const REFERENCIAS = [
  { id: 'suecia', nome: 'Suécia', gini: 0.28 },
  { id: 'eua', nome: 'EUA', gini: 0.41 },
  { id: 'brasil', nome: 'Brasil', gini: 0.52 },
] as const;

export const GINI_MAX = 0.7;

/** Expoente da curva modelo para um Gini dado. */
export const expoente = (gini: number) => (1 + gini) / (1 - gini);

/** Curva de Lorenz modelo: fração da renda com a fração p mais pobre. */
export const lorenz = (p: number, gini: number) => p ** expoente(gini);

/** Fatias da renda de cada décimo, do mais pobre ao mais rico; somam 1. */
export function fatiasPorDecimo(gini: number) {
  return Array.from({ length: 10 }, (_, i) => lorenz((i + 1) / 10, gini) - lorenz(i / 10, gini));
}

/** Gini pela área, numericamente: serve ao teste para conferir a forma fechada. */
export function giniPelaArea(gini: number, passos = 20_000) {
  let area = 0;
  for (let i = 0; i < passos; i += 1) {
    const p = (i + 0.5) / passos;
    area += (p - lorenz(p, gini)) / passos;
  }
  return 2 * area;
}

/** Quantas vezes a renda do décimo mais rico supera a do mais pobre. */
export function razaoTopoBase(gini: number) {
  const f = fatiasPorDecimo(gini);
  return f[9] / f[0];
}
