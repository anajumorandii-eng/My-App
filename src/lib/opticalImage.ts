/**
 * Onde a imagem de uma lente convergente se forma, e para que lado.
 *
 * Módulo puro porque isto é conteúdo de prova, não desenho: a prancha de lentes
 * desenhava a imagem com a orientação trocada nos dois casos — objeto além do
 * foco saía com imagem direita e objeto entre foco e lente saía invertida —
 * contra a legenda da própria cena. Um erro de sinal dentro do JSX passou por
 * lint e por teste porque nada avaliava a física, só a renderização.
 */
export interface OpticalImage {
  /** Distância da imagem à lente. Negativa quando a imagem é virtual. */
  distancia: number;
  /** Altura com sinal: negativa quando invertida, na convenção do objeto. */
  altura: number;
  real: boolean;
  invertida: boolean;
  /** Maior que 1 quando a imagem é ampliada. */
  ampliacao: number;
}

export function imagemDeLenteConvergente(
  distanciaObjeto: number,
  alturaObjeto: number,
  distanciaFocal: number,
): OpticalImage {
  // 1/f = 1/p + 1/p′
  const inverso = 1 / distanciaFocal - 1 / distanciaObjeto;
  const distancia = 1 / inverso;
  const ampliacao = -distancia / distanciaObjeto;
  const altura = alturaObjeto * ampliacao;
  return {
    distancia,
    altura,
    real: distancia > 0,
    invertida: altura < 0,
    ampliacao: Math.abs(ampliacao),
  };
}
