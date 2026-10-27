import { normalizeTopicCuts } from './topicCuts';
import { canonicalExamBoard } from './questionExamFilters';
export type ReviewDepth = 'quick' | 'strategic' | 'deep';
export type ReviewMaterialKind = 'disciplinary' | 'current-affairs' | 'literature';
export type ReviewScope = 'all' | 'first' | 'second' | 'objective' | 'discursive' | 'enem' | 'complementary';
export interface ReviewOptions {
  visualMode?: 'auto' | 'text';
  topicCuts?: Record<string,string[]>;
  boards: string[];
  scopes: Record<string, ReviewScope>;
  depth: ReviewDepth;
  materialKind: ReviewMaterialKind;
  useHistory: boolean;
  sourceMode: 'catalog' | 'provided' | 'work';
  sourceTitle: string;
  sourceDate: string;
  sourceUrl: string;
  sourceText: string;
}
export const reviewDepths: Record<ReviewDepth, string> = { quick: 'Revisão rápida', strategic: 'Revisão estratégica', deep: 'Revisão aprofundada' };
export const reviewScopeLabels: Record<ReviewScope, string> = { all: 'Todas as etapas', first: 'Primeira fase', second: 'Segunda fase', objective: 'Questões objetivas', discursive: 'Questões discursivas', enem: 'ENEM', complementary: 'Provas complementares do sistema misto' };
export function reviewBoard(board: string) {
  const key = canonicalExamBoard(board);
  return ({ 'UNICAMP/COMVEST': 'UNICAMP', 'UNESP/VUNESP': 'UNESP', 'ENEM/INEP': 'ENEM' } as Record<string, string>)[key] ?? key;
}
export const reviewBoards = ['FUVEST', 'UNICAMP', 'UNESP', 'FAMERP', 'UNIFESP', 'ENEM'];
export const reviewBoardLabels: Record<string, string> = { FUVEST: 'Fuvest', UNICAMP: 'Unicamp/Comvest', UNESP: 'Unesp/Vunesp', FAMERP: 'Famerp', UNIFESP: 'Unifesp — sistema misto', ENEM: 'ENEM/Inep' };
export function reviewScopes(board: string): ReviewScope[] {
  switch (reviewBoard(board)) {
    case 'FUVEST': case 'UNICAMP': case 'UNESP': return ['all', 'first', 'second'];
    case 'FAMERP': return ['all', 'objective', 'discursive'];
    case 'UNIFESP': return ['all', 'enem', 'complementary'];
    default: return ['all'];
  }
}
export function normalizeReviewOptions(value: Partial<ReviewOptions> = {}): ReviewOptions {
  const boards = [...new Set((value.boards ?? []).map(reviewBoard).filter(Boolean))].sort();
  return { ...(value.visualMode === 'text' ? {visualMode: 'text' as const} : {}), ...(Object.keys(normalizeTopicCuts(value.topicCuts)).length ? {topicCuts:normalizeTopicCuts(value.topicCuts)} : {}), boards, scopes: Object.fromEntries(boards.map(board => [board, reviewScopes(board).includes(value.scopes?.[board]!) ? value.scopes![board] : 'all'])),
    depth: value.depth && Object.hasOwn(reviewDepths, value.depth) ? value.depth : 'strategic',
    materialKind: ['disciplinary','current-affairs','literature'].includes(value.materialKind ?? '') ? value.materialKind! : 'disciplinary',
    useHistory: value.useHistory === true, sourceMode: value.sourceMode === 'provided' || value.sourceMode === 'work' ? value.sourceMode : 'catalog',
    sourceTitle: value.sourceMode === 'provided' ? value.sourceTitle ?? '' : '', sourceDate: value.sourceMode === 'provided' ? value.sourceDate ?? '' : '', sourceUrl: value.sourceMode === 'provided' ? value.sourceUrl ?? '' : '', sourceText: value.sourceMode === 'provided' ? value.sourceText ?? '' : '' };
}
export function reviewSelectionLabel(options: Pick<ReviewOptions, 'boards' | 'scopes'>) {
  return options.boards.length ? options.boards.map(board => `${reviewBoardLabels[board] ?? board} · ${board === 'ENEM' ? 'Exame sem fases' : reviewScopeLabels[options.scopes[board] ?? 'all']}`).join(' / ') : 'Revisão geral · sem banca selecionada';
}
/** Unknown phase metadata is excluded for a restricted request, rather than guessed. */
export function matchesReviewScope(board: string, phase: string | undefined, options?: Pick<ReviewOptions, 'boards' | 'scopes'>) {
  if (!options) return true;
  const bank = reviewBoard(board), scope = options.scopes[bank] ?? 'all';
  const mixedEnem = bank === 'ENEM' && options.boards.includes('UNIFESP') && ['all','enem'].includes(options.scopes.UNIFESP ?? 'all');
  if (options.boards.length && !options.boards.includes(bank) && !mixedEnem) return false;
  if (scope === 'all' || bank === 'ENEM') return true;
  const p = (phase ?? '').toLowerCase();
  if (scope === 'first') return /1[ªaº]?\s*(fase|$)|primeira/.test(p);
  if (scope === 'second') return !(bank === 'UNESP' && /objetiva/.test(p)) && /2[ªaº]?\s*(fase|$)|segunda/.test(p);
  if (scope === 'objective') return /objetiva|conhecimentos gerais/.test(p);
  if (scope === 'discursive') return /discursiva|específic/.test(p);
  if (scope === 'enem') return /enem/.test(p);
  return /complementar|misto|conhecimentos|dia|língua|redação/.test(p);
}
/** Answers are withheld even while a response is streaming. The explicit heading
 * also supports old sheets whose answer criteria were a numbered sixth section. */
export function splitReviewAnswers(text: string) {
  const match = /^#{1,6}\s+(?:\d+[.)]?\s*)?(?:Gabarito(?:\s+da recuperação ativa)?|Respostas(?:\s+da recuperação ativa)?|Critérios para conferir)\b[^\n]*$/im.exec(text);
  return match ? { body: text.slice(0, match.index).trimEnd(), answers: text.slice(match.index + match[0].length).trim() } : { body: text, answers: '' };
}

export function isReviewOptions(value: unknown): value is ReviewOptions {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false;
  const v = value as Record<string, unknown>;
  if(v.visualMode !== undefined && !['auto','text'].includes(String(v.visualMode)))return false;
  if(v.topicCuts !== undefined && (!v.topicCuts || typeof v.topicCuts !== 'object' || Array.isArray(v.topicCuts) || Object.values(v.topicCuts).some(items=>!Array.isArray(items)||items.length>8||items.some(item=>typeof item!=='string'||item.length>180))))return false;
  return Array.isArray(v.boards) && v.boards.length <= 15 && v.boards.every(b => typeof b === 'string' && b.length <= 100) && Boolean(v.scopes && typeof v.scopes === 'object' && !Array.isArray(v.scopes)) &&
    ['quick','strategic','deep'].includes(String(v.depth)) && ['disciplinary','current-affairs','literature'].includes(String(v.materialKind)) && ['catalog','provided','work'].includes(String(v.sourceMode)) && typeof v.useHistory === 'boolean' &&
    ['sourceTitle','sourceDate','sourceUrl','sourceText'].every(field => typeof v[field] === 'string') && v.boards.every(b => reviewScopes(b).includes((v.scopes as Record<string, ReviewScope>)[b]));
}

export function reviewEvidenceBoards(options: Pick<ReviewOptions, 'boards' | 'scopes'>) {
  return [...new Set(options.boards.flatMap(board => board === 'UNIFESP' ? options.scopes.UNIFESP === 'enem' ? ['ENEM'] : options.scopes.UNIFESP === 'all' ? ['UNIFESP','ENEM'] : [board] : [board]))];
}
