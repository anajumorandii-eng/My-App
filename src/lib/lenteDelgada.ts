/**
 * Lente delgada convergente: a física da bancada óptica do Hoje.
 *
 * Módulo puro, sem three.js, para rodar em node:test. A cena 3D só desenha o
 * que sai daqui; se a conta estiver errada, o teste pega antes de a imagem
 * aparecer no lugar errado do anteparo.
 *
 * Convenção de Gauss: objeto real à esquerda, a uma distância p > 0 da lente;
 * imagem real à direita, a p' > 0. 1/f = 1/p + 1/p' e A = -p'/p.
 */

export interface Ponto { x: number; y: number }

export interface ImagemDaLente {
  /** Distância da imagem à lente. Positiva: imagem real, do outro lado. */
  pLinha: number;
  /** Aumento linear transversal. Negativo: imagem invertida. */
  aumento: number;
  real: boolean;
  invertida: boolean;
  /** "maior", "menor" ou "do mesmo tamanho", pelo módulo do aumento. */
  tamanho: 'maior' | 'menor' | 'do mesmo tamanho';
}

/** Equação dos pontos conjugados. p igual a f não tem imagem: os raios saem paralelos. */
export function imagemDaLente(p: number, f: number): ImagemDaLente | null {
  if (p <= 0 || f <= 0) throw new Error('p e f precisam ser positivos numa lente convergente com objeto real');
  if (Math.abs(p - f) < 1e-9) return null;
  const pLinha = (p * f) / (p - f);
  const aumento = -pLinha / p;
  const modulo = Math.abs(aumento);
  return {
    pLinha,
    aumento,
    real: pLinha > 0,
    invertida: aumento < 0,
    tamanho: Math.abs(modulo - 1) < 0.02 ? 'do mesmo tamanho' : modulo > 1 ? 'maior' : 'menor',
  };
}

/**
 * Os três raios notáveis que saem do topo do objeto (altura h) e chegam ao
 * topo da imagem. Cada raio tem dois trechos: até a lente e depois dela.
 * A lente fica em x = 0; o objeto em x = -p.
 *
 * 1. Paralelo ao eixo: refrata passando pelo foco imagem (f, 0).
 * 2. Pelo centro óptico: atravessa sem desvio.
 * 3. Pelo foco objeto (-f, 0): sai paralelo ao eixo.
 */
export function raiosNotaveis(p: number, f: number, h: number): Ponto[][] {
  const imagem = imagemDaLente(p, f);
  if (!imagem || !imagem.real) throw new Error('a bancada só desenha imagem real: use p > f');
  const topo: Ponto = { x: -p, y: h };
  const topoImagem: Ponto = { x: imagem.pLinha, y: imagem.aumento * h };
  const naLenteRaio3 = -(h * f) / (p - f);
  return [
    [topo, { x: 0, y: h }, topoImagem],
    [topo, { x: 0, y: 0 }, topoImagem],
    [topo, { x: 0, y: naLenteRaio3 }, topoImagem],
  ];
}

/** Texto curto da natureza da imagem, como a banca pede: "real, invertida e menor". */
export function naturezaDaImagem(imagem: ImagemDaLente): string {
  return `${imagem.real ? 'real' : 'virtual'}, ${imagem.invertida ? 'invertida' : 'direita'} e ${imagem.tamanho}`;
}
