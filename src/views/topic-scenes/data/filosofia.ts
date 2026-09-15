import type { SceneEntry } from '../types';

/** Capítulos de Filosofia sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas. */
export const filosofiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-filosofia-o-nascimento-da-filosofia-do-mito-ao-logos',
    motivo: 'Já tem experiência interativa própria (myth) no mesmo slot do fluxo de Explorar.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 4-8
 *  preenchem esta lista, família por família. */
export const filosofia: SceneEntry[] = [];
