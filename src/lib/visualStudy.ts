import { confidenceFromUncertainty, type ConfidenceLevel } from './confidence';
import type { InteractiveSummary, PedagogicalStage, RetrievalAttempt, SummaryProgress } from '../types/summary';

// Os sete estados do Visual. "sei/não sei" era pouco: a aluna que lê a seção e
// não reconstrói a relação não está no mesmo lugar de quem nunca abriu o
// capítulo, e quem acertava e voltou a errar precisa aparecer como regressão em
// vez de virar "não sabe" outra vez.
export type NodeState =
  | 'nao-avaliado' | 'reconhece' | 'compreende' | 'aplicacao-instavel'
  | 'aplica' | 'transfere' | 'possivel-regressao';

export type RelationKind =
  | 'pre-requisito' | 'causa' | 'consequencia' | 'contraste' | 'aplicacao' | 'transferencia';

export const NODE_STATE_LABEL: Record<NodeState, string> = {
  'nao-avaliado': 'Não avaliado',
  reconhece: 'Reconhece',
  compreende: 'Compreende',
  'aplicacao-instavel': 'Aplicação instável',
  aplica: 'Aplica',
  transfere: 'Transfere',
  'possivel-regressao': 'Possível regressão',
};

// Ordem pedagógica, do mais frágil ao mais consolidado. A regressão fica fora da
// escala: ela não é um degrau, é um alerta sobre um degrau que foi perdido.
export const NODE_STATE_RANK: Record<NodeState, number> = {
  'nao-avaliado': 0, reconhece: 1, compreende: 2, 'aplicacao-instavel': 3, aplica: 4, transfere: 5,
  'possivel-regressao': 2,
};

// Nome de exibição do estágio pedagógico. Fica aqui, e não na tela, porque a
// prancha manipulável também precisa dele — e importá-lo de Visual.tsx fecharia
// um ciclo (Visual → registro de instrumentos → instrumento → Visual).
export const STAGE_LABEL: Record<PedagogicalStage, string> = {
  intuicao: 'Intuição', conceito: 'Conceito', aplicacao: 'Aplicação',
  exercicio: 'Exercício', estrategia: 'Estratégia',
};

export const RELATION_LABEL: Record<RelationKind, string> = {
  'pre-requisito': 'é pré-requisito de',
  causa: 'leva a',
  consequencia: 'tem como consequência',
  contraste: 'contrasta com',
  aplicacao: 'aplica-se em',
  transferencia: 'transfere para',
};

export interface VisualNode {
  id: string;
  sectionId: string;
  label: string;
  stage: PedagogicalStage;
  excerpt: string;
}

export interface VisualEdge { id: string; from: string; to: string; kind: RelationKind; }

// Cada elemento da pergunta de recuperação é uma relação que a aluna precisa
// reconstruir. Guardar a relação como peça de primeira classe é o que permite
// avaliar o vínculo entre conceitos, e não só o capítulo inteiro.
export interface VisualRelation { id: string; label: string; keywords: string[]; }

export interface VisualMap {
  summaryId: string;
  subject: string;
  topic: string;
  title: string;
  centerLabel: string;
  prerequisites: string[];
  nodes: VisualNode[];
  edges: VisualEdge[];
  relations: VisualRelation[];
  recallPrompt: string | null;
  questionId: string | null;
}

// A sequência das cinco seções é fixa em applyDeepSummaries.ts (intuição,
// conceito, aplicação, estratégia, exercício). A relação entre cada par é
// editorial e vem daí: a seção de pegadinhas contrasta com o uso correto, e a
// de prática transfere a estratégia para um caso novo.
const STAGE_RELATION: RelationKind[] = ['causa', 'consequencia', 'contraste', 'transferencia'];

const firstSentence = (text: string) => {
  const trimmed = text.trim();
  const stop = trimmed.search(/(?<=\.)\s/);
  return stop === -1 ? trimmed : trimmed.slice(0, stop);
};

export function buildVisualMap(summary: InteractiveSummary): VisualMap {
  const nodes: VisualNode[] = summary.sections.map((section, index) => ({
    id: `${summary.id}-n${index + 1}`,
    sectionId: section.id,
    label: section.title,
    stage: section.stage,
    excerpt: firstSentence(section.content),
  }));

  const edges: VisualEdge[] = nodes.slice(0, -1).map((node, index) => ({
    id: `${node.id}-e`,
    from: node.id,
    to: nodes[index + 1].id,
    // Mapa com mais ou menos seções que o previsto não deve gerar aresta sem
    // tipo; cai no elo mais genérico em vez de sair undefined na tela.
    kind: STAGE_RELATION[index] ?? 'consequencia',
  }));

  const question = summary.retrieval[0] ?? null;
  const relations: VisualRelation[] = (question?.expectedElements ?? []).map((element, index) => ({
    id: `${summary.id}-r${index + 1}`,
    label: element.label,
    keywords: element.keywords,
  }));

  return {
    summaryId: summary.id,
    subject: summary.subject,
    topic: summary.topic,
    title: summary.title,
    centerLabel: summary.topic,
    prerequisites: summary.prerequisites,
    nodes,
    edges,
    relations,
    recallPrompt: question?.prompt ?? null,
    questionId: question?.id ?? null,
  };
}

// Mesma dobra de acentos e caixa que summaryEngine.ts aplica na recuperação
// ativa. Sem ela, "transformacao adiabatica" seria contado como erro, e o
// diagnóstico registraria uma lacuna que não existe.
export const foldAnswer = (value: string) =>
  value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();

export function matchesRelation(relation: VisualRelation, answer: string): boolean {
  const normalized = foldAnswer(answer);
  if (!normalized) return false;
  return relation.keywords.some((keyword) => {
    const folded = foldAnswer(keyword);
    if (!folded) return false;
    if (normalized.includes(folded)) return true;
    const tokens = folded.split(/\s+/).filter((token) => token.length > 2);
    return tokens.length > 0 && tokens.every((token) => normalized.includes(token));
  });
}

export type ReconstructionGrade = 'correta' | 'parcial' | 'incorreta';

export interface ReconstructionResult {
  grade: ReconstructionGrade;
  matchedRelationId: string | null;
  feedback: string;
}

// Errar de lugar não é o mesmo que não saber. Quando a resposta corresponde a
// outra relação do mesmo mapa, o conteúdo está certo e o vínculo é que saiu
// trocado — é o "quase isso" em vez de um erro cheio.
export function gradeReconstruction(map: VisualMap, relationId: string, answer: string): ReconstructionResult {
  const target = map.relations.find((relation) => relation.id === relationId);
  if (!target) return { grade: 'incorreta', matchedRelationId: null, feedback: 'Relação não encontrada neste mapa.' };
  if (matchesRelation(target, answer)) {
    return { grade: 'correta', matchedRelationId: target.id, feedback: `Correto. ${target.label}.` };
  }
  const elsewhere = map.relations.find((relation) => relation.id !== relationId && matchesRelation(relation, answer));
  if (elsewhere) {
    return {
      grade: 'parcial',
      matchedRelationId: elsewhere.id,
      feedback: `Quase isso. O que você respondeu sustenta outra relação do mapa (${elsewhere.label}). Aqui o elo esperado é outro.`,
    };
  }
  return { grade: 'incorreta', matchedRelationId: null, feedback: 'Ainda não é esse o elo. Releia a seção de conceito e tente reconstruir o vínculo.' };
}

export interface RelationEvidence {
  relationId: string;
  hits: number;
  misses: number;
  attempts: number;
  lastOutcome: 'acerto' | 'erro' | null;
}

// A evidência por relação já existe no histórico: cada tentativa de recuperação
// guarda quais elementos a aluna preservou. Ler daí evita criar um segundo
// histórico paralelo que discordaria do Caderno de Erros.
export function relationEvidence(relation: VisualRelation, answers: RetrievalAttempt[]): RelationEvidence {
  let hits = 0;
  let misses = 0;
  let lastOutcome: 'acerto' | 'erro' | null = null;
  for (const attempt of answers) {
    const touched = attempt.matchedElements ?? [];
    const missing = attempt.firstMissingElement ?? null;
    // Tentativa que não avaliou elemento nenhum (nem acerto nem falta
    // registrada) não é erro desta relação: é ausência de evidência, e contá-la
    // como erro inventaria uma lacuna que o histórico não sustenta.
    const evaluated = touched.length > 0 || missing !== null;
    if (!evaluated) continue;
    if (touched.includes(relation.label)) { hits += 1; lastOutcome = 'acerto'; }
    else { misses += 1; lastOutcome = 'erro'; }
  }
  return { relationId: relation.id, hits, misses, attempts: hits + misses, lastOutcome };
}

export function relationState(evidence: RelationEvidence): NodeState {
  if (evidence.attempts === 0) return 'nao-avaliado';
  if (evidence.hits === 0) return 'reconhece';
  if (evidence.misses > 0) return evidence.lastOutcome === 'erro' ? 'possivel-regressao' : 'aplicacao-instavel';
  if (evidence.hits >= 3) return 'transfere';
  if (evidence.hits >= 2) return 'aplica';
  return 'compreende';
}

// Espelha os patamares de confidence.ts em vez de criar uma segunda escala: uma
// tentativa é indício, não certeza, e nenhuma evidência tem de ler como "dados
// insuficientes", não como "confiança baixa".
export function evidenceUncertainty(attempts: number): number {
  if (attempts <= 0) return 0.9;
  if (attempts === 1) return 0.7;
  if (attempts === 2) return 0.4;
  return 0.2;
}

export function relationConfidence(evidence: RelationEvidence): ConfidenceLevel {
  return confidenceFromUncertainty(evidenceUncertainty(evidence.attempts));
}

export function nodeState(node: VisualNode, progress: SummaryProgress | undefined, relationStates: NodeState[]): NodeState {
  const read = progress?.readSectionIds?.includes(node.sectionId) ?? false;
  if (relationStates.some((state) => state === 'possivel-regressao')) return 'possivel-regressao';
  const strongest = relationStates.reduce<NodeState>((best, state) =>
    NODE_STATE_RANK[state] > NODE_STATE_RANK[best] ? state : best, 'nao-avaliado');
  // A pergunta de recuperação avalia o capítulo inteiro, então a evidência de
  // reconstrução sobe os nós em conjunto; a leitura é o que ainda diferencia um
  // nó do outro. Sem a leitura, o nó não passa de "não avaliado".
  if (!read) return strongest === 'nao-avaliado' ? 'nao-avaliado' : 'reconhece';
  return NODE_STATE_RANK[strongest] > NODE_STATE_RANK['reconhece'] ? strongest : 'reconhece';
}

export interface HiddenPlan { relationId: string; reason: string; }

// "O CRIVO ocultou primeiro as relações em que suas evidências são mais
// frágeis": ordena por estado mais frágil e, no empate, por menos tentativas —
// ocultar o que ela já domina não produz evidência nova.
export function chooseHiddenRelations(map: VisualMap, answers: RetrievalAttempt[], limit = 2): HiddenPlan[] {
  return map.relations
    .map((relation) => {
      const evidence = relationEvidence(relation, answers);
      return { relation, evidence, state: relationState(relationEvidence(relation, answers)) };
    })
    .sort((a, b) =>
      NODE_STATE_RANK[a.state] - NODE_STATE_RANK[b.state] || a.evidence.attempts - b.evidence.attempts)
    .slice(0, Math.max(0, limit))
    .map(({ relation, evidence, state }) => ({
      relationId: relation.id,
      reason: evidence.attempts === 0
        ? 'Nunca houve tentativa registrada sobre esta relação.'
        : `Estado atual: ${NODE_STATE_LABEL[state].toLowerCase()} — ${evidence.hits} acerto(s) em ${evidence.attempts} tentativa(s).`,
    }));
}

export interface Intervention {
  relationId: string;
  label: string;
  state: NodeState;
  confidence: ConfidenceLevel;
  why: string;
  action: string;
}

// Intervenção mínima eficaz: antes de mandar rever o capítulo, procura a menor
// lacuna que explica o problema e propõe testar só aquele elo.
export function minimalIntervention(map: VisualMap, answers: RetrievalAttempt[]): Intervention | null {
  const weakest = map.relations
    .map((relation) => ({ relation, evidence: relationEvidence(relation, answers) }))
    .map((item) => ({ ...item, state: relationState(item.evidence) }))
    .sort((a, b) =>
      NODE_STATE_RANK[a.state] - NODE_STATE_RANK[b.state] || b.evidence.misses - a.evidence.misses)[0];
  if (!weakest) return null;
  if (weakest.state === 'transfere') return null;
  const regressed = weakest.state === 'possivel-regressao';
  return {
    relationId: weakest.relation.id,
    label: weakest.relation.label,
    state: weakest.state,
    confidence: relationConfidence(weakest.evidence),
    why: regressed
      ? 'Esta relação já foi reconstruída antes e voltou a falhar na última tentativa.'
      : weakest.evidence.attempts === 0
        ? 'Esta é a única relação do capítulo sem nenhuma evidência registrada.'
        : `Esta é a relação com evidência mais frágil: ${weakest.evidence.hits} acerto(s) em ${weakest.evidence.attempts} tentativa(s).`,
    action: 'Reconstruir esta relação',
  };
}

export interface WhyExplanation { state: NodeState; confidence: ConfidenceLevel; evidence: string[]; caveat: string | null; }

// A tela precisa distinguir fato de hipótese. Com uma tentativa só, o
// diagnóstico é indício, e o texto tem de dizer isso em vez de afirmar domínio.
export function explainRelation(relation: VisualRelation, answers: RetrievalAttempt[]): WhyExplanation {
  const evidence = relationEvidence(relation, answers);
  const state = relationState(evidence);
  const confidence = relationConfidence(evidence);
  const lines: string[] = [];
  if (evidence.attempts === 0) lines.push('Nenhuma tentativa de recuperação registrada para esta relação.');
  else {
    lines.push(`${evidence.hits} acerto(s) e ${evidence.misses} erro(s) em ${evidence.attempts} tentativa(s).`);
    if (evidence.lastOutcome) lines.push(`Última tentativa: ${evidence.lastOutcome}.`);
  }
  return {
    state,
    confidence,
    evidence: lines,
    caveat: confidence === 'insufficient_data' || confidence === 'low'
      ? 'Com esta quantidade de evidência o resultado é hipótese, não fato. Uma nova reconstrução muda o diagnóstico.'
      : null,
  };
}
