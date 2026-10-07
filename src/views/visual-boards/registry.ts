import { lazyBoard } from './lazyBoard';
import type { ComponentType } from 'react';
import type { InteractiveSummary } from '../../types/summary';
import type { BoardProps } from './types';
const AdiabaticBoard = lazyBoard(() => import('./AdiabaticBoard'));
const WaveBoard = lazyBoard(() => import('./WaveBoard'));
const LensBoard = lazyBoard(() => import('./LensBoard'));
const PhotosynthesisBoard = lazyBoard(() => import('./PhotosynthesisBoard'));
const TrigCircleBoard = lazyBoard(() => import('./TrigCircleBoard'));
const CarbonCycleBoard = lazyBoard(() => import('./CarbonCycleBoard'));
const MembraneBoard = lazyBoard(() => import('./MembraneBoard'));
const StoichiometryBoard = lazyBoard(() => import('./StoichiometryBoard'));
const AtomModelsBoard = lazyBoard(() => import('./AtomModelsBoard'));
const ExponentialBoard = lazyBoard(() => import('./ExponentialBoard'));
const MendelBoard = lazyBoard(() => import('./MendelBoard'));
const ThermochemBoard = lazyBoard(() => import('./ThermochemBoard'));
const CircuitBoard = lazyBoard(() => import('./CircuitBoard'));
const QuadraticBoard = lazyBoard(() => import('./QuadraticBoard'));
const TrophicBoard = lazyBoard(() => import('./TrophicBoard'));
const BondingBoard = lazyBoard(() => import('./BondingBoard'));
const KinematicsBoard = lazyBoard(() => import('./KinematicsBoard'));
const ProgressionBoard = lazyBoard(() => import('./ProgressionBoard'));
const CellDivisionBoard = lazyBoard(() => import('./CellDivisionBoard'));
const HydrostaticsBoard = lazyBoard(() => import('./HydrostaticsBoard'));
const AcidBaseBoard = lazyBoard(() => import('./AcidBaseBoard'));
const LogarithmBoard = lazyBoard(() => import('./LogarithmBoard'));
const CalorimetryBoard = lazyBoard(() => import('./CalorimetryBoard'));
const CountingBoard = lazyBoard(() => import('./CountingBoard'));
const ProbabilityPairsBoard = lazyBoard(() => import('./ProbabilityPairsBoard'));
const RightTriangleBoard = lazyBoard(() => import('./RightTriangleBoard'));
const BloodTypeBoard = lazyBoard(() => import('./BloodTypeBoard'));
const SolutionsBoard = lazyBoard(() => import('./SolutionsBoard'));
const NewtonBoard = lazyBoard(() => import('./NewtonBoard'));
const FungiBoard = lazyBoard(() => import('./FungiBoard'));
const EnzymeBoard = lazyBoard(() => import('./EnzymeBoard'));
const IndependenceBoard = lazyBoard(() => import('./IndependenceBoard'));
const HeartCirculationBoard = lazyBoard(() => import('./HeartCirculationBoard'));
const VisionDefectsBoard = lazyBoard(() => import('./VisionDefectsBoard'));

/**
 * Quais capítulos têm prancha ilustrada, e qual.
 *
 * Antes isso era uma condição solta dentro de Visual.tsx:
 *
 *     return summary.subject === 'Física' && title.includes('transformações particulares');
 *
 * Com uma prancha só, funcionava. Com duas, a tela teria que ganhar um `if`
 * novo a cada conteúdo desenhado, e a lista do que existe ficaria espalhada
 * pelo componente. Aqui a pergunta "este capítulo tem prancha?" e a resposta
 * "qual delas" vêm da mesma tabela, que é também o inventário do que já foi
 * ilustrado — e o que ainda não foi continua caindo no aviso honesto, em vez
 * de receber a ilustração de outro assunto.
 *
 * Este registro legado contém cenas de quatro matérias. Isso é uma lacuna de
 * cobertura, não uma autorização para excluir Humanidades ou Linguagens.
 * O requisito atual abrange todas as matérias e tópicos. Experiências novas
 * com vínculo explícito ao capítulo ficam em topic-experiments/catalog.ts.
 */
export interface BoardEntry {
  /** Identificador estável; é o que os testes citam. */
  id: string;
  subject: string;
  /**
   * Todos os termos precisam aparecer no texto do capítulo (matéria, tópico e
   * título juntos). Casar por termo, e não por id de capítulo, é deliberado: os
   * ids mudam quando o currículo é reorganizado, e uma prancha de transformação
   * adiabática continua valendo para o capítulo que trate do mesmo fenômeno.
   */
  keywords: string[];
  /** Termos que indicam outro objeto matemático, apesar do casamento positivo. */
  excludedKeywords?: string[];
  Component: ComponentType<BoardProps>;
}

export const BOARDS: BoardEntry[] = [
  {
    id: 'probabilidade-pares',
    subject: 'Matemática',
    keywords: ['contagem sistemática e probabilidade'],
    Component: ProbabilityPairsBoard,
  },
  {
    id: 'trigonometria-triangulo',
    subject: 'Matemática',
    keywords: ['trigonometria no triângulo retângulo'],
    Component: RightTriangleBoard,
  },
  {
    id: 'defeitos-visao',
    subject: 'Física',
    keywords: ['óptica da visão'],
    Component: VisionDefectsBoard,
  },
  {
    id: 'coracao-circulacao',
    subject: 'Biologia',
    keywords: ['coração e vasos sanguíneos'],
    Component: HeartCirculationBoard,
  },
  {
    id: 'independencia-brasil',
    subject: 'História',
    keywords: ['independência do brasil'],
    Component: IndependenceBoard,
  },
  {
    id: 'fungos',
    subject: 'Biologia',
    keywords: ['fungos'],
    Component: FungiBoard,
  },
  {
    id: 'enzimas',
    subject: 'Biologia',
    keywords: ['proteínas', 'enzimas'],
    Component: EnzymeBoard,
  },
  {
    id: 'leis-newton',
    subject: 'Física',
    keywords: ['leis de newton'],
    Component: NewtonBoard,
  },
  {
    id: 'adiabatica',
    subject: 'Física',
    keywords: ['transformações particulares'],
    Component: AdiabaticBoard,
  },
  {
    id: 'ondulatoria',
    subject: 'Física',
    keywords: ['ondulatória'],
    Component: WaveBoard,
  },
  {
    id: 'lentes',
    subject: 'Física',
    keywords: ['lentes'],
    Component: LensBoard,
  },
  {
    id: 'bioenergetica',
    subject: 'Biologia',
    keywords: ['fotossíntese'],
    Component: PhotosynthesisBoard,
  },
  {
    id: 'trigonometria',
    subject: 'Matemática',
    keywords: ['trigonometria'],
    excludedKeywords: ['triângulo retângulo'],
    Component: TrigCircleBoard,
  },
  {
    id: 'ciclo-carbono',
    subject: 'Biologia',
    keywords: ['ciclo do carbono'],
    Component: CarbonCycleBoard,
  },
  {
    id: 'membrana',
    subject: 'Biologia',
    keywords: ['membranas celulares'],
    Component: MembraneBoard,
  },
  {
    id: 'leis-ponderais',
    subject: 'Química',
    keywords: ['leis ponderais'],
    Component: StoichiometryBoard,
  },
  {
    id: 'modelos-atomicos',
    subject: 'Química',
    keywords: ['modelos atômicos'],
    Component: AtomModelsBoard,
  },
  {
    id: 'exponencial',
    subject: 'Matemática',
    keywords: ['modelo exponencial'],
    Component: ExponentialBoard,
  },
  {
    id: 'mendel',
    subject: 'Biologia',
    keywords: ['mendel'],
    Component: MendelBoard,
  },
  {
    id: 'termoquimica',
    subject: 'Química',
    keywords: ['termoquímica'],
    Component: ThermochemBoard,
  },
  {
    id: 'circuitos',
    subject: 'Física',
    keywords: ['circuitos'],
    Component: CircuitBoard,
  },
  {
    id: 'segundo-grau',
    subject: 'Matemática',
    keywords: ['2º grau'],
    Component: QuadraticBoard,
  },
  {
    id: 'trofico',
    subject: 'Biologia',
    keywords: ['ecologia'],
    Component: TrophicBoard,
  },
  {
    id: 'ligacoes',
    subject: 'Química',
    keywords: ['ligações químicas'],
    Component: BondingBoard,
  },
  {
    id: 'cinematica',
    subject: 'Física',
    keywords: ['cinemática'],
    Component: KinematicsBoard,
  },
  {
    id: 'progressoes',
    subject: 'Matemática',
    keywords: ['sequências'],
    Component: ProgressionBoard,
  },
  {
    id: 'divisao-celular',
    subject: 'Biologia',
    keywords: ['divisão celular'],
    Component: CellDivisionBoard,
  },
  {
    id: 'hidrostatica',
    subject: 'Física',
    keywords: ['hidrostática'],
    Component: HydrostaticsBoard,
  },
  {
    id: 'acido-base',
    subject: 'Química',
    keywords: ['ácidos e bases'],
    Component: AcidBaseBoard,
  },
  {
    id: 'logaritmos',
    subject: 'Matemática',
    keywords: ['logaritmos'],
    Component: LogarithmBoard,
  },
  {
    id: 'calorimetria',
    subject: 'Física',
    // 'calor sensível' deixava de fora "Calor, temperatura e mudanças de estado",
    // capítulo de prioridade muito-alta que é exatamente esta curva: as rampas de
    // calor sensível e os patamares de latente. Só 'calor' casa com os dois
    // capítulos do fenômeno em Física, e com nenhum outro.
    keywords: ['calor'],
    Component: CalorimetryBoard,
  },
  {
    id: 'contagem',
    subject: 'Matemática',
    keywords: ['contagem'],
    excludedKeywords: ['probabilidade'],
    Component: CountingBoard,
  },
  {
    id: 'abo',
    subject: 'Biologia',
    keywords: ['imunologia'],
    Component: BloodTypeBoard,
  },
  {
    id: 'dispersoes',
    subject: 'Química',
    keywords: ['dispersões'],
    Component: SolutionsBoard,
  },
];

/** Texto do capítulo em caixa baixa, como as keywords são escritas. */
function chapterText(summary: Pick<InteractiveSummary, 'subject' | 'topic' | 'title'>): string {
  return [summary.subject, summary.topic, summary.title].join(' ').toLowerCase();
}

export function findBoard(
  summary: Pick<InteractiveSummary, 'subject' | 'topic' | 'title'>,
): BoardEntry | null {
  const text = chapterText(summary);
  return BOARDS.find(
    (board) => board.subject === summary.subject
      && board.keywords.every((k) => text.includes(k))
      && !(board.excludedKeywords?.some((k) => text.includes(k)) ?? false),
  ) ?? null;
}

export function supportsIllustratedBoard(
  summary: Pick<InteractiveSummary, 'subject' | 'topic' | 'title'>,
): boolean {
  return findBoard(summary) !== null;
}
