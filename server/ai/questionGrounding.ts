import { readFile, realpath } from 'node:fs/promises';
import path from 'node:path';
import type { Question } from '../../src/types';
import type { AiGenerationRequest } from './types';
import { AiValidationError } from './errors';
import { questionExamIdentity } from '../../src/lib/questionExamIdentity';
import { mockTopics } from '../../src/data/mockData';

let catalog: Promise<Map<string, Question>> | undefined;
const publicRoot = () => path.resolve(process.env.NODE_ENV === 'production' ? 'dist' : 'public');
const load = () => catalog ??= readFile(path.join(publicRoot(),'questions.json'),'utf8')
  .then(raw => new Map((JSON.parse(raw) as Question[]).map(q => [q.id,q])))
  .catch(error => { catalog = undefined; throw error; });

/** Apenas o servidor resolve IDs e lê mídia local. Nenhum fetch arbitrário. */
export async function groundQuestion(payload: Record<string, unknown>): Promise<AiGenerationRequest['images']> {
  if (!payload.questionId) return undefined;
  const question = (await load()).get(String(payload.questionId));
  if (!question) throw new AiValidationError('Questão não encontrada no banco local.');
  if (question.status === 'annulled') throw new AiValidationError('Questão anulada: não há alternativa correta para comentar.');
  const selected = question.options.find(o => o.id === payload.selectedOptionId);
  const correct = question.options.find(o => o.id === question.correctOptionId);
  if (!selected || !correct) throw new AiValidationError('Alternativa inválida para esta questão.');
  payload.prompt = `${question.prompt}\n\nAlternativas:\n${question.options.map(o => `${o.id.toUpperCase()}) ${o.text}`).join('\n')}`;
  payload.subject = question.subject;
  payload.topic = mockTopics.find(topic => topic.id === question.topicId)?.name ?? question.chapter ?? '';
  payload.board = question.examSource?.board;
  payload.chapter = question.chapter;
  payload.selectedAnswer = selected.text;
  payload.correctAnswer = `${correct.id.toUpperCase()}) ${correct.text}`;
  payload.isCorrect = selected.id === correct.id;
  payload.baseExplanation = question.explanation;
  payload.hasQuestionFigures = Boolean(question.figures?.length);
  const identity=questionExamIdentity(question);
  payload.examIdentity = identity ? `${identity.board} ${identity.year ?? ''} · ${identity.phase ?? ''} · ${identity.version ?? ''} · questão ${identity.questionNumber ?? ''}` : '';
  const mediaRoot = await realpath(path.join(publicRoot(),'question-media'));
  const images: NonNullable<AiGenerationRequest['images']> = [];
  let bytes = 0;
  for (const figure of question.figures ?? []) {
    if (!/^\/question-media\/[a-zA-Z0-9_./-]+\.(webp|png|jpe?g)$/.test(figure.url)) throw new AiValidationError('Mídia da questão inválida.');
    const file = await realpath(path.resolve(publicRoot(), '.' + figure.url));
    if (!file.startsWith(mediaRoot + path.sep)) throw new AiValidationError('Mídia fora do catálogo.');
    const buffer = await readFile(file);
    bytes += buffer.length;
    if (bytes > 12 * 1024 * 1024 || images.length >= 24) throw new AiValidationError('As figuras da questão excedem o limite de análise.');
    const extension = path.extname(file);
    images.push({ mimeType: extension === '.webp' ? 'image/webp' : extension === '.png' ? 'image/png' : 'image/jpeg', data: buffer.toString('base64') });
  }
  return images;
}
