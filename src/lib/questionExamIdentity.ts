import positions from '../data/enemPreservedPositions.json';
import type { Question } from '../types';

/** Numeração canônica sem trocar os IDs que guardam o progresso da estudante. */
export function questionExamIdentity(question: Question | null | undefined): Question['examSource'] {
  const source=question?.examSource;
  const position=question ? (positions as Record<string,{year:number;day:number;number:number}>)[question.id] : undefined;
  if (!source || !position) return source;
  return {...source,year:position.year,phase:`${position.day}º dia · aplicação regular`,
    version:`CD${position.day===1?2:5} amarelo`,questionNumber:position.number};
}
