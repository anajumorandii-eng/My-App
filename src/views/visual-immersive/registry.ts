import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

export interface ImmersiveSceneProps { onPractice?: () => void }

/**
 * Capítulos cuja cena 3D é uma experiência imersiva própria.
 *
 * É protótipo de direção: um capítulo só, para a Ana Júlia ver a referência
 * dela dentro do aplicativo antes de decidir se as outras cenas seguem o mesmo
 * caminho. A cena cobre a PCR, que é parte do capítulo de Biotecnologia, não o
 * capítulo inteiro — o esquema plano continua a um toque, com o restante.
 *
 * Carregamento sob demanda: a cena desenha em canvas e não deve pesar na
 * abertura dos outros 633 capítulos.
 */
export const IMMERSIVE_SCENES: Record<string, LazyExoticComponent<ComponentType<ImmersiveSceneProps>>> = {
  'summary-biologia-biotecnologia': lazy(() => import('./PcrImmersion')),
  // Segunda cena, para testar a linguagem fora da Biologia. Aqui a cena é o
  // capítulo inteiro: fluxo, sentido da corrente e o caso do ímã parado.
  'summary-fisica-inducao-eletromagnetica-lei-de-lenz': lazy(() => import('./LenzImmersion')),
};

export const immersiveSceneFor = (chapterId: string) => IMMERSIVE_SCENES[chapterId] ?? null;
