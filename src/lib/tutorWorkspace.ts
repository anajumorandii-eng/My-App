import type { AnswerCorrection, ContentExplanation } from './tutorContracts';

export function isExplanation(value: unknown): value is ContentExplanation | null {
  return value === null || !!value && typeof value === 'object' &&
    ['intuicao', 'conceito', 'aplicacao', 'comoCai', 'pegadinha', 'checagem'].every(key => typeof (value as Record<string, unknown>)[key] === 'string');
}
export function isCorrection(value: unknown): value is AnswerCorrection | null {
  return value === null || !!value && typeof value === 'object' &&
    ['acertos', 'rupturaPoint', 'porque', 'correcaoMinima', 'respostaModelo'].every(key => typeof (value as Record<string, unknown>)[key] === 'string') &&
    ((value as Record<string, unknown>).padraoRecorrente === null || typeof (value as Record<string, unknown>).padraoRecorrente === 'string');
}
export interface TutorMessage { id: string; sender: 'ai' | 'user'; text: string; state?: 'pending' | 'complete' | 'error' }
export function isTutorMessages(value: unknown): value is TutorMessage[] {
  return Array.isArray(value) && value.every(item => item && typeof item.id === 'string' && typeof item.text === 'string' && ['ai', 'user'].includes(item.sender) && (item.state === undefined || ['pending', 'complete', 'error'].includes(item.state)));
}
export function conversationHistory(messages: TutorMessage[]) {
  const history: { role: 'user' | 'assistant'; content: string }[] = [];
  let budget = 12000;
  for (const message of [...messages].reverse()) {
    if (!message.text.trim() || message.state === 'pending' || message.state === 'error') continue;
    const content = message.text.length > 2000 ? `${message.text.slice(0, 1950)}\n[trecho parcial]` : message.text;
    if (content.length > budget || history.length === 12) break;
    history.unshift({ role: message.sender === 'user' ? 'user' : 'assistant', content });
    budget -= content.length;
  }
  return history;
}
