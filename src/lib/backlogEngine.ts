// Motor de priorização de conteúdo atrasado — implementa a matriz de
// prioridade e o sistema de filas descritos no Manual para Lidar com
// Matéria Atrasada. A fórmula não é uma escala científica validada; serve
// para impedir decisões movidas apenas por culpa ou preferência, e deve
// ser ajustada pelo desempenho real da aluna.

import { BacklogItem } from '../types';

export type BacklogQueue = 'A' | 'B' | 'C' | 'D';

export const QUEUE_LABELS: Record<BacklogQueue, string> = {
  A: 'Destravadores',
  B: 'Alto retorno',
  C: 'Consolidação',
  D: 'Complementares',
};

export const QUEUE_CRITERIA: Record<BacklogQueue, string> = {
  A: 'Pré-requisito de outros tópicos + alta incidência nas bancas-alvo.',
  B: 'Alta incidência, lacuna moderada.',
  C: 'Já estudado antes, mas com baixo desempenho.',
  D: 'Baixa incidência e pouca dependência de outros tópicos.',
};

export const QUEUE_TREATMENT: Record<BacklogQueue, string> = {
  A: 'Primeiro bloco disponível da semana — feche cedo.',
  B: 'Recuperação contínua, presente toda semana.',
  C: 'Questões diretas + correção focal no ponto de ruptura.',
  D: 'Resumo estratégico ou adiamento consciente — não é abandono.',
};

export const STATE_LABELS: Record<number, string> = {
  0: 'Desconhecido',
  1: 'Reconhecimento',
  2: 'Aplicação guiada',
  3: 'Aplicação independente',
  4: 'Transferência',
};

export const STATE_DESCRIPTIONS: Record<number, string> = {
  0: 'Não reconheço o assunto.',
  1: 'Entendo uma explicação, mas não resolvo sozinha.',
  2: 'Resolvo com exemplo ou pista.',
  3: 'Resolvo questões diretas sozinha, sem consulta.',
  4: 'Resolvo questões mistas, contextualizadas ou discursivas, e explico o raciocínio.',
};

export const SUPPORT_LEVELS: { level: number; activity: string; readyToAdvance: string }[] = [
  { level: 1, activity: 'Analisar exemplo resolvido e explicar cada passo.', readyToAdvance: 'Consigo justificar o caminho.' },
  { level: 2, activity: 'Completar exemplo com etapas faltantes.', readyToAdvance: 'Preencho sem copiar.' },
  { level: 3, activity: 'Resolver questão paralela sem apoio.', readyToAdvance: 'Monto o método sozinha.' },
  { level: 4, activity: 'Resolver questão diferente ou mista.', readyToAdvance: 'Reconheço o método sem rótulo.' },
  { level: 5, activity: 'Responder no formato da banca.', readyToAdvance: 'Comunico a solução com precisão.' },
];

export const EXIT_CHECKLIST: string[] = [
  'Consigo explicar a ideia central sem material?',
  'Consigo reconhecer quando usar e quando não usar?',
  'Resolvi ao menos uma questão independente?',
  'Consigo nomear meu erro mais provável?',
  'Há revisão futura registrada?',
];

export function priorityScore(item: BacklogItem): number {
  return (3 * item.dependencia + 3 * item.incidencia + 2 * item.lacuna + 2 * item.urgencia) / item.custo;
}

export function priorityQueue(item: BacklogItem): BacklogQueue {
  if (item.dependencia >= 2 && item.incidencia >= 2) return 'A';
  if (item.incidencia >= 2) return 'B';
  if (item.state >= 2) return 'C';
  return 'D';
}

export function isReadyToClose(item: BacklogItem): boolean {
  return item.independentSuccesses >= 2 && item.canExplainTypicalError;
}
