import type { LiteraryWork } from '../types/literaryWorks';
import { SEED_WORKS, SEED_EXAM_REQUIREMENTS } from '../../server/literary/seedCatalog';
import { DOSSIER_SLUGS } from './workDossiers';

// Obras que a aba Revisões oferece para gerar resumo.
//
// O Firestore é a fonte preferida, mas a regra de leitura de literaryWorks
// exige login: sem conta, ou com o catálogo vazio, a lista vinha em branco e a
// tela só dizia "use um trecho informado", embora os 18 dossiês estejam no
// próprio app. O catálogo semente (as 18 exigências oficiais do ciclo 2027)
// cobre esse caso.
//
// Só entra obra com dossiê: é ele que vira a fonte do resumo
// (loadStudyPacket). Oferecer obra sem dossiê terminaria em "O dossiê desta
// obra não está disponível" depois do clique em gerar.

export type WorkBoard = 'FUVEST' | 'UNICAMP';
export interface ReviewWorkOption { slug: string; title: string; author: string; boards: WorkBoard[] }

const BOARDS_BY_WORK = SEED_EXAM_REQUIREMENTS.reduce<Record<string, WorkBoard[]>>((byWork, requirement) => {
  if (!requirement.active || (requirement.board !== 'FUVEST' && requirement.board !== 'UNICAMP')) return byWork;
  byWork[requirement.workId] = [...new Set([...(byWork[requirement.workId] ?? []), requirement.board as WorkBoard])];
  return byWork;
}, {});

export function reviewWorkOptions(catalog: readonly LiteraryWork[] = []): ReviewWorkOption[] {
  const source = catalog.length ? catalog : SEED_WORKS;
  const withDossier = new Set(DOSSIER_SLUGS);
  return source
    .filter((work) => withDossier.has(work.slug))
    .map((work) => ({ slug: work.slug, title: work.title, author: work.author, boards: BOARDS_BY_WORK[work.id] ?? BOARDS_BY_WORK[work.slug] ?? [] }))
    .sort((a, b) => a.title.localeCompare(b.title, 'pt-BR'));
}

/** Grupos para o seletor: cada obra aparece sob a banca que a exige. */
export function groupWorksByBoard(options: readonly ReviewWorkOption[]): { label: string; works: ReviewWorkOption[] }[] {
  const groups = [
    { label: 'Fuvest', works: options.filter((work) => work.boards.includes('FUVEST')) },
    { label: 'Unicamp', works: options.filter((work) => work.boards.includes('UNICAMP')) },
    { label: 'Outras obras', works: options.filter((work) => !work.boards.length) },
  ];
  return groups.filter((group) => group.works.length);
}
