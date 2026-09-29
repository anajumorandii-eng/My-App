/**
 * Efeito estufa: o laboratório de Atualidades no Hoje.
 *
 * A estudante move a concentração de CO₂ entre a pré-industrial e o dobro
 * dela, e a leitura dá o forçamento radiativo — quanta energia a mais, por
 * metro quadrado, a Terra passa a reter. A fórmula é a de Myhre e
 * colaboradores (1998), adotada pelo IPCC: ΔF = 5,35 · ln(C / C₀) W/m².
 *
 * Os números de referência são os dos resumos de Biologia: cerca de 280 ppm
 * antes da Revolução Industrial e mais de 420 ppm hoje, na curva de Keeling.
 * O aquecimento de equilíbrio para o CO₂ dobrado é a faixa provável do sexto
 * relatório do IPCC, de 2,5 a 4 °C — a cena não converte forçamento em
 * temperatura para outros valores, porque essa conversão depende da
 * sensibilidade do clima, que é justamente o que a faixa expressa.
 */

export const PRE_INDUSTRIAL = 280;
export const HOJE = 420;
export const DOBRO = 2 * PRE_INDUSTRIAL;

export function forcamento(ppm: number, referencia = PRE_INDUSTRIAL) {
  return 5.35 * Math.log(ppm / referencia);
}

/** Aumento em relação ao pré-industrial, em porcentagem. */
export const aumento = (ppm: number) => (ppm / PRE_INDUSTRIAL - 1) * 100;

/** Fração do caminho até o dobro, para a cena engrossar a camada de gás. */
export const fracaoAteODobro = (ppm: number) => Math.log(ppm / PRE_INDUSTRIAL) / Math.log(2);
