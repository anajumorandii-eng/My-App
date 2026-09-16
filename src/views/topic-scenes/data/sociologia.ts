import type { SceneEntry } from '../types';

/** Capítulos de Sociologia sem cena-âncora, com o motivo. */
export const sociologiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-sociologia-solidariedade-mecanica-e-solidariedade-organica',
    motivo: 'Já tem experiência interativa própria (solidarity) no mesmo slot do fluxo de Explorar.',
  },
  {
    chapterId: 'summary-sociologia-anomia-e-coesao-social',
    motivo:
      'Os quatro tipos de suicídio cruzam dois eixos independentes (integração e regulação, cada um por falta ' +
      'ou por excesso) e não são um continuum entre dois polos nem tipos que se combinam num mesmo caso concreto — ' +
      'nenhuma das sete famílias (as cinco de Filosofia mais tipologia e critérios-conjuntivos) representa uma ' +
      'grade de duas dimensões sem forçar a estrutura. Ver docs/visual-personalizado/08-familias-sociologia.md.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 2-4 preenchem. */
export const sociologia: SceneEntry[] = [];
