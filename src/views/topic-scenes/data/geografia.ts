import type { SceneEntry } from '../types';

/** Capítulos de Geografia sem cena-âncora, com o motivo. A lista é lida pelo
 *  teste de completude: nenhum capítulo pode ficar fora das duas listas.
 *
 *  Estado ao fim da Task 1: só a lacuna já conhecida antes da leitura. A
 *  atribuição definitiva dos 63 capítulos (famílias e lacunas adicionais)
 *  está em docs/visual-personalizado/10-familias-geografia.md — as Tasks
 *  2-4 preenchem `geografia` e completam `geografiaSemCena` a partir dali. */
export const geografiaSemCena: { chapterId: string; motivo: string }[] = [
  {
    chapterId: 'summary-geografia-coordenadas-geograficas',
    motivo: 'Já tem experiência interativa própria (coordinates) no catálogo de topic-experiments.',
  },
];

/** Uma entrada por capítulo, escrita à mão lendo o capítulo. As Tasks 2-4
 *  preenchem esta lista, família por família, seguindo a atribuição
 *  definitiva do documento de famílias. */
export const geografia: SceneEntry[] = [];
