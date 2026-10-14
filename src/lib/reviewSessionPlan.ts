import { sameBoard, vestibularCalendar2026, type VestibularExam } from '../data/examCalendar';
import type { StudentGoals } from '../types';
import type { StudyInterval } from '../features/availability/types';
import { applyExamDayLimits } from './examDayLimits';

export interface ReviewExamFocus { exam: VestibularExam; days: number }
export function reviewExamFocus(localDate: string, goals: StudentGoals): ReviewExamFocus | null {
  const exam = vestibularCalendar2026.filter(exam => exam.confidence === 'alta' && exam.date >= localDate &&
    goals.boardWeights.some(goal => goal.weight > 0 && sameBoard(goal.board, exam.board) &&
      (goal.phaseFocus === 'ambas' || exam.phase === 'unica' || goal.phaseFocus === exam.phase)))
    .sort((a,b) => a.date.localeCompare(b.date))[0];
  return exam ? { exam, days: Math.round((Date.parse(`${exam.date}T12:00:00Z`)-Date.parse(`${localDate}T12:00:00Z`))/86400000) } : null;
}

export function remainingReviewIntervals(intervals: StudyInterval[], localDate: string, goals: StudentGoals, now: string): StudyInterval[] {
  const timestamp = Date.parse(now);
  if (!Number.isFinite(timestamp)) return [];
  const remaining = intervals.flatMap(interval => {
    const start = Math.max(Date.parse(interval.start),timestamp);
    const end = Date.parse(interval.end);
    const durationMinutes = Math.floor((end-start)/60000);
    return durationMinutes >= 5 ? [{ ...interval, start: new Date(start).toISOString(), durationMinutes }] : [];
  }).sort((a,b) => a.start.localeCompare(b.start));
  return applyExamDayLimits(remaining,localDate,goals);
}

export interface ReviewBlock { resource: string; title: string; action: string; criterion: string; minutes: number; start: string; end: string }
export function buildReviewBlocks(intervals: StudyInterval[], budget: number, focus: ReviewExamFocus | null): ReviewBlock[] {
  const light = focus?.days === 1;
  const second = focus?.exam.phase === '2a-fase';
  const essay = focus?.exam.id === 'enem-d1' || focus?.exam.id === 'famerp-d2';
  const steps = light ? [
    { resource:'flashcards', title:'Recuperar o essencial', action:'Responda sem consulta a cartões já estudados. Não abra conteúdo novo.', criterion:'Explicar o conceito em voz alta e conferir o cartão.', minutes:10 },
    { resource:'erros', title:'Rever erros conhecidos', action:'Refaça um erro recorrente e confira a etapa em que ele aconteceu.', criterion:'Identificar o sinal de alerta e a conferência que evita repeti-lo.', minutes:10 },
    { resource:'resumos', title:'Fechar com uma síntese', action:'Reconstrua de memória as relações centrais de um capítulo já estudado.', criterion:'Conferir lacunas e encerrar, preservando descanso e sono.', minutes:10 },
  ] : [
    { resource:'erros', title:'Retomar um erro', action:'Escolha um erro com relato. Refaça sem olhar e explique onde o raciocínio mudou.', criterion:'Resolver sem ajuda e justificar a correção; com ajuda, retomar a base.', minutes:10 },
    { resource:second ? 'discursivas' : essay ? 'redacao' : 'questoes', title:second ? 'Treinar uma resposta discursiva' : essay ? 'Planejar a redação' : 'Resolver uma questão real', action:second ? 'Identifique o comando, selecione dados e escreva o encadeamento da resposta.' : essay ? 'Leia a proposta e escreva tese, argumento e projeto conforme o gênero.' : 'Identifique dados → escolha estratégia → aplique → justifique → confira a alternativa.', criterion:second ? 'Responder todos os comandos com conceitos e evidências.' : essay ? 'Adequação ao tema, gênero e interlocutor, com argumento sustentado.' : 'Explicar a correta e o erro das alternativas, mesmo após acertar.', minutes:15 },
    ...(second && focus?.exam.id.endsWith('-d1') ? [{ resource:'redacao', title:'Planejar e revisar o texto', action:'Identifique proposta, gênero e interlocutor. Revise um trecho e justifique uma mudança.', criterion:'Sustentar a escolha com um trecho e conferir adequação ao comando da banca.', minutes:15 }] : []),
    { resource:'resumos', title:'Reconstruir e transferir', action:'Escreva a síntese sem consultar; depois aplique a relação numa situação diferente.', criterion:'Nomear a condição de aplicação e explicar por que a relação continua válida.', minutes:10 },
    { resource:'obras', title:'Recuperar uma passagem', action:'Relacione voz, linguagem e conflito a uma passagem publicada da obra.', criterion:'Sustentar a leitura com um elemento localizado do texto.', minutes:10 },
  ];
  let remaining = Number.isFinite(budget) ? Math.max(0,Math.floor(budget)) : 0;
  const preferred = intervals.filter(i=>i.purpose==='review');
  const windows = (preferred.length ? preferred : intervals).map(i=>({...i}));
  const blocks: ReviewBlock[]=[];
  for (const step of steps) {
    if (remaining < 5) break;
    const window = windows.find(i=>i.durationMinutes>=5);
    if (!window) break;
    const minutes=Math.min(step.minutes,remaining,window.durationMinutes);
    const start=window.start;
    const end=new Date(Date.parse(start)+minutes*60000).toISOString();
    blocks.push({...step,minutes,start,end});
    window.start=end; window.durationMinutes-=minutes; remaining-=minutes;
  }
  return blocks;
}
