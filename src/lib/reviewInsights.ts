import type { ErrorLog, TopicMastery } from '../types';
import { urgencyOf } from './reviewUrgency';
import { isoToLocalDate } from '../features/availability/time';

export interface ReviewInsight { title: string; evidence: string; action: string; minutes: number; success: string; }
export function buildReviewInsight(mastery: TopicMastery, now: Date = new Date()): ReviewInsight {
  const level = Math.max(0, Math.min(100, mastery.level));
  const uncertainty = mastery.uncertainty;
  const base = `Domínio estimado: ${level}%. Incerteza da estimativa: ${Math.round(uncertainty * 100)}%.`;
  if (mastery.origin === 'demo' || mastery.origin === 'seed' || (mastery.level === 0 && mastery.lastReviewed === '1970-01-01T00:00:00.000Z')) return { title: 'Primeiro, produzir uma evidência', evidence: `${base} Este registro é inicial ou de demonstração.`, action: 'Responda uma questão sem consulta e explique sua primeira decisão antes de escolher o que revisar.', minutes: 15, success: 'Registrar a resposta e a justificativa; um valor inicial não comprova domínio ou dificuldade.' };
  if (mastery.errorSignals > 0) return { title: 'Corrigir o caminho antes de repetir a lista', evidence: `${base} Há ${mastery.errorSignals} sinal(is) recente(s) de erro registrado(s); a categoria do erro não está determinada por esse contador.`, action: 'Refaça uma questão errada sem olhar a solução. Localize o primeiro passo diferente do gabarito, explique a correção e tente uma variação.', minutes: 20, success: 'Resolver a variação sem ajuda e justificar por que o caminho anterior falhava.' };
  if (level < 40) return { title: 'Reconstruir a base em um bloco curto', evidence: base, action: 'Cheque o pré-requisito indispensável; estude um exemplo resolvido explicando cada decisão e complete outro exemplo com apoio reduzido.', minutes: 20, success: 'Explicar o conceito e completar o passo decisivo sem copiar a solução; depois tentar uma questão independente.' };
  if (uncertainty >= .5) return { title: 'Conferir se a familiaridade virou compreensão', evidence: `${base} A incerteza pede uma checagem, não permite afirmar domínio estável.`, action: 'Responda sem consulta a uma pergunta conceitual e a uma questão de representação diferente. Anote sua confiança antes de conferir.', minutes: 15, success: 'Resposta correta com justificativa e coerência entre confiança e resultado; se divergir, registrar a etapa que faltou.' };
  if (urgencyOf(mastery, now) > 50) return { title: 'Recuperar antes de reler', evidence: `${base} Urgência da revisão: ${Math.round(urgencyOf(mastery, now))}/100 pelo agendamento atual.`, action: 'Escreva de memória o mecanismo ou procedimento, confira lacunas e resolva uma questão curta. Releia somente a parte que não conseguiu recuperar.', minutes: 15, success: 'Recuperar as relações essenciais e aplicar sem consulta; registrar a dificuldade para ajustar o próximo intervalo.' };
  return { title: 'Testar transferência e manter o espaçamento', evidence: base, action: 'Compare dois problemas parecidos que exigem estratégias diferentes e justifique qual usar em cada um. Evite antecipar toda a fila de revisão.', minutes: 15, success: 'Escolher e justificar o método num contexto novo; uma resposta correta isolada não comprova retenção duradoura.' };
}

export interface ErrorRevisit { key: string; errorId: string; topicId: string; day: 1 | 3 | 7; dueDate: string; action: string; minutes: 15; overdue: boolean; }
export function buildErrorRevisitPlan(errors: ErrorLog[], localDate: string): ErrorRevisit[] {
  const result: ErrorRevisit[] = [];
  for (const error of errors) {
    if (!Number.isFinite(Date.parse(error.date))) continue;
    const errorDate = isoToLocalDate(error.date);
    const due = ([1, 3, 7] as const).map((day) => {
      const date = new Date(`${errorDate}T12:00:00Z`); date.setUTCDate(date.getUTCDate() + day);
      const previous = error.revisitResults?.[String(day) as '1'|'3'|'7'];
      const dueDate = previous?.nextAttemptDate ?? date.toISOString().slice(0, 10);
      return { day, dueDate, completed: previous?.rating === 'independente' };
    }).filter(({ dueDate, completed }) => dueDate <= localDate && !completed);
    // Se acumulou atraso, uma tentativa consolidada substitui as revisitas anteriores.
    const latest = due.at(-1);
    if (!latest) continue;
    result.push({ key: `${error.id}:${latest.day}`, errorId: error.id, topicId: error.topicId, day: latest.day, dueDate: latest.dueDate, minutes: 15, overdue: latest.dueDate < localDate,
      action: latest.day === 1 ? 'Refaça o primeiro passo e explique o conceito sem consultar a solução.' : latest.day === 3 ? 'Resolva uma variação e justifique a escolha da estratégia sem consulta.' : 'Misture com um tópico próximo e explique por que as estratégias diferem.' });
  }
  return result.sort((a, b) => a.dueDate.localeCompare(b.dueDate));
}
