import type { BoardWeight, Topic, TopicMastery } from '../types';
import { completeTopicEvidence } from './examEvidence';
import { topicIncidenceWeight } from './topicIncidence';
import { urgencyOf } from './reviewUrgency';

export function hasPriorityEvidence(mastery: TopicMastery | undefined): mastery is TopicMastery {
  return Boolean(mastery && mastery.origin !== 'seed' && mastery.origin !== 'demo' && Number.isFinite(new Date(mastery.lastReviewed).getTime()) && new Date(mastery.lastReviewed).getTime() > 0);
}
export function buildActionablePriorities(topics: Topic[], mastery: TopicMastery[], persisted: boolean, board?: string, now = new Date(), targets: BoardWeight[] = [], fuvestCareer?: 'medicina') {
  const observed = new Map(persisted ? mastery.filter(hasPriorityEvidence).map(item => [item.topicId, item]) : []);
  return topics.map(topic => {
    const evidence = observed.get(topic.id);
    const clamp = (value: number) => Math.min(100, Math.max(0, Number.isFinite(value) ? value : 0));
    const urgency = evidence ? urgencyOf(evidence, now) : 0;
    const boardFactors = (board ? [{ board, weight: 1, phaseFocus: 'ambas' as const }] : targets).map(target => {
      const specificHistory = completeTopicEvidence(topic, target.board, target.phaseFocus, fuvestCareer).length > 0;
      return { ...target, specificHistory, history: Math.min(1, Math.max(0, topicIncidenceWeight(topic, target.board, target.phaseFocus, fuvestCareer))) * 15 };
    });
    const totalWeight = boardFactors.reduce((sum, item) => sum + Math.max(0, item.weight), 0);
    const combinedHistory = totalWeight ? boardFactors.reduce((sum, item) => sum + item.history * Math.max(0, item.weight) / totalWeight, 0) : Math.min(1, Math.max(0, topicIncidenceWeight(topic, board, 'ambas', fuvestCareer))) * 15;
    const factors = {
      gap: evidence ? (100 - clamp(evidence.level)) * 0.45 : 0,
      review: evidence ? clamp(urgency) * 0.25 : 0,
      uncertainty: evidence ? clamp(evidence.uncertainty * 100) * 0.15 : 0,
      history: combinedHistory,
    };
    const blockers = topic.prerequisites.filter(id => { const item = observed.get(id); return item && item.level < 50; });
    const action = blockers.length ? 'base' : !evidence ? 'diagnostic' : evidence.level < 50 ? 'base' : urgency >= 60 ? 'review' : 'practice';
    return { topic, evidence, boardFactors, blockers, action, urgency, factors, score: Object.values(factors).reduce((sum, value) => sum + value, 0) };
  }).sort((a, b) => b.score - a.score || a.topic.name.localeCompare(b.topic.name, 'pt-BR'));
}
export function priorityStudyBlock(minutes: 15 | 30 | 45, approach: 'explicar' | 'ensinar' | 'comparar' | 'questao' = 'explicar') {
  const times = minutes === 15 ? [3, 7, 3, 2] : minutes === 30 ? [5, 15, 5, 5] : [8, 22, 8, 7];
  const exploration = { explicar: 'Reconstrua o mecanismo com suas palavras: relacione conceitos, justifique as conexões e identifique o passo que ainda não sabe explicar. Use um desenho ou exemplo para testar a relação.', ensinar: 'Grave ou explique em voz alta como ensinaria a outra pessoa. Pare onde recorreu só a um nome ou fórmula e tente justificar esse elo com um exemplo e uma condição de validade.', comparar: 'Compare duas ideias ou representações próximas. Explique o que muda, proponha um contraexemplo e diga qual evidência permitiria distinguir suas hipóteses.', questao: 'Explique uma questão passo a passo: dados, representação, escolha da estratégia, justificativa de cada decisão e verificação. Antes do gabarito, diga por que descartou outro caminho.' };
  return [
    { minutes: times[0], task: 'Recupere o conceito e suas condições de uso sem consultar. Se faltar base, use este tempo para reconstruí-la.' },
    { minutes: times[1], task: exploration[approach] },
    { minutes: times[2], task: 'Confronte sua explicação com uma fonte ou exemplo comentado. Marque o que mudou, o que faltava e o que permanece em dúvida. Se usou uma questão, confira o gabarito sem substituir a justificativa.' },
    { minutes: times[3], task: 'Sem olhar a solução, reconstrua a estratégia e diga o que mudaria com outro dado. Registre o resultado na atividade e programe a revisão.' },
  ];
}

/** Nomes usados pelo catálogo de resumos, diferentes das áreas do currículo. */
export function prioritySummarySubject(topic: Pick<Topic, 'id' | 'subject'>): string {
  if (topic.id.startsWith('por_lit_')) return 'Literatura';
  if (topic.id.startsWith('por_red_')) return 'Redação';
  if (topic.subject === 'Português') return topic.id === 'por_texto' ? 'Entendimento de Texto' : 'Gramática';
  if (topic.subject === 'Inglês') return 'Língua Inglesa';
  return topic.subject;
}
