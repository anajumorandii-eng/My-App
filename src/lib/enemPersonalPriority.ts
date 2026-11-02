import type { TopicMastery } from '../types';
import { hasPriorityEvidence } from './actionablePriorities';

export interface EnemTopicProbability {
  topicId: string;
  subject: string;
  pAtLeastOne: number;
  expected: number;
  presence: number;
}

export type EnemDay = 1 | 2;

// Dia 1: Linguagens, Humanas e Redação. Dia 2: Natureza e Matemática.
const DAY_TWO = new Set(['Matemática', 'Biologia', 'Física', 'Química']);
export const enemDayOf = (subject: string): EnemDay => (DAY_TWO.has(subject) ? 2 : 1);

// Sem registro pessoal válido o domínio é desconhecido, não zero: assumir 0%
// poria no topo tudo o que ela nunca registrou, inclusive o que já domina.
// 50% mantém o assunto na lista pelo peso histórico e marca o diagnóstico.
const UNKNOWN_LEVEL = 50;

export interface EnemPersonalEntry extends EnemTopicProbability {
  day: EnemDay;
  level: number | null;
  /** Questões esperadas que hoje tenderiam a sair erradas: expected × (1 − domínio). */
  atStake: number;
}

export function buildEnemPersonalPriorities(
  topics: EnemTopicProbability[],
  mastery: TopicMastery[],
  persisted: boolean,
  day?: EnemDay,
): EnemPersonalEntry[] {
  const observed = new Map(persisted ? mastery.filter(hasPriorityEvidence).map(m => [m.topicId, m]) : []);
  return topics
    .map(topic => {
      const evidence = observed.get(topic.topicId);
      const level = evidence ? Math.min(100, Math.max(0, evidence.level)) : null;
      const atStake = topic.expected * (1 - (level ?? UNKNOWN_LEVEL) / 100);
      return { ...topic, day: enemDayOf(topic.subject), level, atStake };
    })
    .filter(entry => !day || entry.day === day)
    .sort((a, b) => b.atStake - a.atStake || b.pAtLeastOne - a.pAtLeastOne);
}
