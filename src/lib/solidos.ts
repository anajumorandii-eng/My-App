/**
 * Sólidos geométricos: a matemática do laboratório de Matemática no Hoje.
 *
 * Módulo puro, como os das outras cenas: a cena desenha o sólido e a leitura
 * mostra o que sai daqui, conferido no node:test. As fórmulas são as dos
 * livros de vestibular; o teste confere as relações que a prova cobra (o cone
 * é um terço do cilindro de mesma base e altura, a geratriz vem de Pitágoras,
 * a pirâmide é um terço do prisma).
 *
 * A base é fixa em "medida 3" (raio 3, ou lado 3 no prisma e na pirâmide
 * quadrangulares) e só a altura varia: com duas variáveis na mão, a relação
 * que o controle mostra — o volume cresce linear com a altura — se perdia.
 */

export type IdSolido = 'prisma' | 'cilindro' | 'piramide' | 'cone' | 'esfera';

export const BASE = 3;
export const ALTURA_MIN = 2;
export const ALTURA_MAX = 8;

/** Valor com a parte em π separada, para escrever "12π" e não só "37,7". */
export interface Medida {
  /** Coeficiente de π; 0 quando o valor não tem π. */
  pi: number;
  /** Parte sem π (soma quando há raiz, como a área lateral da pirâmide). */
  racional: number;
  valor: number;
}

const comPi = (k: number): Medida => ({ pi: k, racional: 0, valor: k * Math.PI });
const semPi = (v: number): Medida => ({ pi: 0, racional: v, valor: v });

export interface Leitura {
  id: IdSolido;
  nome: string;
  volume: Medida;
  areaTotal: Medida;
  /** Fórmula do volume como a estudante escreve. */
  formulaVolume: string;
  /** Uma medida auxiliar que a prova cobra (geratriz, apótema), quando existe. */
  auxiliar?: { nome: string; valor: number };
}

export function medir(id: IdSolido, h: number): Leitura {
  const r = BASE, l = BASE;
  switch (id) {
    case 'prisma':
      return {
        id, nome: 'prisma quadrangular',
        volume: semPi(l * l * h),
        areaTotal: semPi(2 * l * l + 4 * l * h),
        formulaVolume: 'V = Ab · h',
      };
    case 'cilindro':
      return {
        id, nome: 'cilindro',
        volume: comPi(r * r * h),
        areaTotal: comPi(2 * r * r + 2 * r * h),
        formulaVolume: 'V = πr² · h',
      };
    case 'piramide': {
      // Apótema da pirâmide: hipotenusa entre a altura e metade do lado.
      const ap = Math.hypot(h, l / 2);
      return {
        id, nome: 'pirâmide quadrangular',
        volume: semPi((l * l * h) / 3),
        areaTotal: semPi(l * l + 4 * ((l * ap) / 2)),
        formulaVolume: 'V = ⅓ · Ab · h',
        auxiliar: { nome: 'apótema', valor: ap },
      };
    }
    case 'cone': {
      // Geratriz: hipotenusa entre a altura e o raio (Pitágoras).
      const g = Math.hypot(h, r);
      return {
        id, nome: 'cone',
        volume: comPi((r * r * h) / 3),
        areaTotal: comPi(r * r + r * g),
        formulaVolume: 'V = ⅓ · πr² · h',
        auxiliar: { nome: 'geratriz', valor: g },
      };
    }
    case 'esfera':
      return {
        id, nome: 'esfera',
        volume: comPi((4 / 3) * r ** 3),
        areaTotal: comPi(4 * r * r),
        formulaVolume: 'V = ⁴⁄₃ · πr³',
      };
  }
}

export const ORDEM: IdSolido[] = ['prisma', 'cilindro', 'piramide', 'cone', 'esfera'];

/** A esfera não tem altura própria: o controle some para ela. */
export const temAltura = (id: IdSolido) => id !== 'esfera';

const num = (v: number) => v.toLocaleString('pt-BR', { maximumFractionDigits: 2 });

/** "12π ≈ 37,7" ou "36" — a escrita que a prova aceita, com a aproximação ao lado. */
export function escrever(m: Medida) {
  if (m.pi) return `${num(m.pi)}π ≈ ${num(m.valor)}`;
  return num(m.racional);
}
