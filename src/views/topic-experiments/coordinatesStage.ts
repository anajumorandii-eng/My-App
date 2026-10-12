import type { PedagogicalStage } from '../../types/summary';

/**
 * O que o globo de Coordenadas Geográficas mostra em cada etapa do palco.
 *
 * Antes, o experimento abria sempre em 20°N, 30°L e não sabia em que etapa a
 * estudante estava: a leitura resolvida do texto (23°S, 46°O, São Paulo) e o
 * exercício (o paralelo de 40°N) ficavam no painel, longe do globo que serve
 * para conferi-los. Cada entrada aqui sai da seção da própria etapa — `cita` é
 * um trecho literal dela, e o teste confere que continua lá — e só põe o ponto
 * numa coordenada quando a seção a escreve. As etapas sem coordenada escrita
 * não movem o ponto: apenas acendem a parte do globo de que a seção fala.
 *
 * A missão do exercício não registra nada: a estudante ajusta a latitude e lê
 * a barra, mas a resposta continua no formulário do painel, avaliada pelo
 * mesmo fluxo do Caderno.
 */
export type CoordinatesFocus = 'barras' | 'referencias' | 'leitura' | 'convergencia' | 'missao';

export interface CoordinatesStep {
  focus: CoordinatesFocus;
  /** Rótulo do ponto de investigação na barra do palco. */
  label: string;
  /** Trecho literal da seção da etapa. */
  cita: string;
  /** Coordenada que a seção escreve; ausente quando a seção não escreve nenhuma. */
  preset?: { latitude: number; longitude: number };
  /** Latitude que a missão pede para a estudante alcançar. */
  alvo?: number;
}

export const COORDINATES_CHAPTER = 'summary-geografia-coordenadas-geograficas';

export const COORDINATES_STEPS: Record<PedagogicalStage, CoordinatesStep> = {
  intuicao: { focus: 'barras', label: '1° de latitude × 1° de longitude', cita: 'cerca de 111 km' },
  conceito: {
    focus: 'referencias', label: 'Equador e Greenwich', cita: 'Meridiano de Greenwich (a referência de longitude zero',
    preset: { latitude: 0, longitude: 0 },
  },
  aplicacao: { focus: 'leitura', label: '23°S, 46°O', cita: '23°S, 46°O', preset: { latitude: -23, longitude: -46 } },
  estrategia: { focus: 'convergencia', label: 'Meridianos convergem', cita: 'até convergirem completamente a zero exatamente nos polos' },
  exercicio: { focus: 'missao', label: 'Missão: paralelo de 40°N', cita: 'ao longo do paralelo de 40°N', alvo: 40 },
};

export const COORDINATES_FOCUS_TEXT: Record<CoordinatesFocus, string> = {
  barras: 'Compare as duas barras: o grau de latitude não muda de tamanho; mova a latitude e veja o de longitude encolher.',
  referencias: 'O ponto está sobre as duas referências: o Equador separa Norte e Sul; Greenwich separa Leste e Oeste.',
  leitura: 'O ponto foi para a coordenada que o texto lê: valor, unidade e direção cardinal, juntos.',
  convergencia: 'A pegadinha mais cobrada: leve a latitude para perto do polo e veja a barra de longitude se aproximar de zero.',
  missao: 'Ajuste a latitude até 40°N e leia na barra quanto vale 1° de longitude ali. A resposta do exercício continua no painel.',
};
