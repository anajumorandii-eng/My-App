import type { ComponentType } from 'react';
import type { InteractiveSummary } from '../../types/summary';
import type { BoardProps } from './types';
import AdiabaticBoard from './AdiabaticBoard';
import WaveBoard from './WaveBoard';
import LensBoard from './LensBoard';
import PhotosynthesisBoard from './PhotosynthesisBoard';
import TrigCircleBoard from './TrigCircleBoard';
import CarbonCycleBoard from './CarbonCycleBoard';
import MembraneBoard from './MembraneBoard';
import StoichiometryBoard from './StoichiometryBoard';
import AtomModelsBoard from './AtomModelsBoard';
import ExponentialBoard from './ExponentialBoard';
import MendelBoard from './MendelBoard';
import ThermochemBoard from './ThermochemBoard';
import CircuitBoard from './CircuitBoard';
import QuadraticBoard from './QuadraticBoard';
import TrophicBoard from './TrophicBoard';
import BondingBoard from './BondingBoard';
import KinematicsBoard from './KinematicsBoard';
import ProgressionBoard from './ProgressionBoard';
import CellDivisionBoard from './CellDivisionBoard';
import HydrostaticsBoard from './HydrostaticsBoard';
import AcidBaseBoard from './AcidBaseBoard';
import LogarithmBoard from './LogarithmBoard';
import CalorimetryBoard from './CalorimetryBoard';
import CountingBoard from './CountingBoard';
import BloodTypeBoard from './BloodTypeBoard';
import SolutionsBoard from './SolutionsBoard';
import NewtonBoard from './NewtonBoard';
import FungiBoard from './FungiBoard';
import IndependenceBoard from './IndependenceBoard';

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
  Component: ComponentType<BoardProps>;
}

export const BOARDS: BoardEntry[] = [
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
    (board) => board.subject === summary.subject && board.keywords.every((k) => text.includes(k)),
  ) ?? null;
}

export function supportsIllustratedBoard(
  summary: Pick<InteractiveSummary, 'subject' | 'topic' | 'title'>,
): boolean {
  return findBoard(summary) !== null;
}
