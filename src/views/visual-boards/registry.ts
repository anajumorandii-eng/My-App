import type { ComponentType } from 'react';
import type { InteractiveSummary } from '../../types/summary';
import type { BoardProps } from './types';
import AdiabaticBoard from './AdiabaticBoard';
import WaveBoard from './WaveBoard';
import LensBoard from './LensBoard';
import PhotosynthesisBoard from './PhotosynthesisBoard';
import TrigCircleBoard from './TrigCircleBoard';

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
