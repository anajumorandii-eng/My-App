import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
import { useQuestions } from './useQuestions';
import { getLocalQuestionBank, getQuestions } from '../lib/contentCatalog';
import type { Question } from '../types';

vi.mock('../lib/contentCatalog', () => ({ getLocalQuestionBank: vi.fn(), getQuestions: vi.fn() }));
const question = (id: string, subject = 'Física') => ({ id, subject } as Question);
beforeEach(() => vi.resetAllMocks());
it('preserva questões locais quando o catálogo remoto contém apenas parte do banco', async () => {
  vi.mocked(getLocalQuestionBank).mockResolvedValue([question('fis'), question('geo', 'Geografia')]);
  vi.mocked(getQuestions).mockResolvedValue([question('fis'), question('his', 'História')]);
  const { result } = renderHook(() => useQuestions());
  await waitFor(() => expect(result.current.loading).toBe(false));
  expect(result.current.questions.map(q => q.id).sort()).toEqual(['fis', 'geo', 'his']);
});
it('incorpora o local mesmo quando ele chega depois do remoto e preserva a edição remota', async () => {
  let resolveLocal!: (q: Question[]) => void;
  vi.mocked(getLocalQuestionBank).mockReturnValue(new Promise(resolve => { resolveLocal = resolve; }));
  vi.mocked(getQuestions).mockResolvedValue([{ ...question('fis'), explanation: 'Edição revisada' }]);
  const { result } = renderHook(() => useQuestions());
  await waitFor(() => expect(result.current.questions).toHaveLength(1));
  await act(async () => resolveLocal([question('fis'), question('geo', 'Geografia')]));
  expect(result.current.questions).toHaveLength(2);
  expect(result.current.questions.find(q => q.id === 'fis')?.explanation).toBe('Edição revisada');
});
