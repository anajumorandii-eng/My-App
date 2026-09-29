/**
 * A caverna de Platão: o laboratório de Filosofia no Hoje.
 *
 * No livro VII da República, os prisioneiros só veem, na parede do fundo, as
 * sombras dos objetos que passam diante do fogo, e tomam as sombras pelas
 * coisas. A cena monta a alegoria com a óptica de verdade: a sombra de um
 * objeto iluminado por uma fonte pontual cresce por semelhança de triângulos,
 * na razão entre a distância do fogo à parede e a do fogo ao objeto.
 *
 * É a lição da alegoria em número: a mesma estátua projeta sombras de tamanhos
 * diferentes conforme o lugar em que passa, e quem só vê a parede não tem
 * como saber o tamanho da coisa.
 */

/** Distância do fogo à parede, em metros. */
export const PAREDE = 6;
/** Altura da estátua levada diante do fogo, em metros. */
export const ESTATUA = 0.5;
export const D_MIN = 1;
export const D_MAX = 5;

/** Quantas vezes a sombra é maior que o objeto: D / d. */
export function ampliacao(d: number, parede = PAREDE) {
  return parede / d;
}

export function alturaDaSombra(d: number, altura = ESTATUA, parede = PAREDE) {
  return altura * ampliacao(d, parede);
}
