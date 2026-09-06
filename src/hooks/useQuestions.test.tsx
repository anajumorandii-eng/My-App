import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

const getLocalQuestionBank = vi.hoisted(() => vi.fn());
const getQuestions = vi.hoisted(() => vi.fn());

vi.mock('../lib/contentCatalog', () => ({ getLocalQuestionBank, getQuestions }));

import { useQuestions } from './useQuestions';

const questao = (id: string, prompt: string) =>
  ({ id, prompt }) as never;

describe('useQuestions', () => {
  afterEach(() => {
    vi.clearAllMocks();
  });

  it('mantém a questão que só existe no arquivo local depois que o Firestore responde', async () => {
    // O bug que isto cobre: o Firestore substituía a lista inteira, então
    // questão recém-adicionada ao repositório sumia da tela até alguém
    // apertar "Semear" no painel — sem nenhum sinal de que estava faltando.
    getLocalQuestionBank.mockResolvedValue([questao('fuvest_2026_q01', 'do arquivo'), questao('antiga', 'local')]);
    getQuestions.mockResolvedValue([questao('antiga', 'do painel')]);

    const { result } = renderHook(() => useQuestions());
    await waitFor(() => expect(result.current.questions).toHaveLength(2));

    expect(result.current.questions.map((q) => q.id).sort()).toEqual(['antiga', 'fuvest_2026_q01']);
  });

  it('usa a versão do Firestore quando as duas fontes têm a mesma questão', async () => {
    getLocalQuestionBank.mockResolvedValue([questao('antiga', 'local')]);
    getQuestions.mockResolvedValue([questao('antiga', 'do painel')]);

    const { result } = renderHook(() => useQuestions());
    await waitFor(() => expect(result.current.questions[0]?.prompt).toBe('do painel'));
    expect(result.current.questions).toHaveLength(1);
  });

  it('mostra o banco local quando o Firestore falha', async () => {
    getLocalQuestionBank.mockResolvedValue([questao('antiga', 'local')]);
    getQuestions.mockRejectedValue(new Error('offline'));

    const { result } = renderHook(() => useQuestions());
    await waitFor(() => expect(result.current.loading).toBe(false));

    expect(result.current.questions).toHaveLength(1);
    expect(result.current.syncError).toContain('conjunto local');
  });
});
