import type { Topic } from '../types';
import { mockTopics } from './mockData';
import supplements from './questionOnlyTopics.json';

/** Exam classification is broader than the student's study materials. These
 * topics organize questions; they do not create lessons or summaries in the study curriculum. */
export const questionOnlyTopics: Topic[] = supplements;
const supplementalIds = new Set(questionOnlyTopics.map(topic => topic.id));
export const isQuestionOnlyTopic = (id: string) => supplementalIds.has(id);
export function withQuestionTopics(topics: Topic[]): Topic[] {
  const ids = new Set(topics.map(topic => topic.id));
  return [...topics, ...questionOnlyTopics.filter(topic => !ids.has(topic.id))];
}
export const questionTopics = withQuestionTopics(mockTopics);
