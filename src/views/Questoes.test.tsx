import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import type { Question } from '../types';
import Questoes from './Questoes';

const authHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const questionsHook = vi.hoisted(() => vi.fn());
const addUserAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const addUserErrorLogMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const requestAiTextMock = vi.hoisted(() => vi.fn());

vi.mock('../context/AuthContext', () => ({ useAuth: authHook }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('../hooks/useQuestions', () => ({ useQuestions: questionsHook }));
vi.mock('../lib/userData', () => ({
  addUserAttempt: addUserAttemptMock,
  addUserErrorLog: addUserErrorLogMock,
}));
vi.mock('../lib/aiClient', () => ({ requestAiText: requestAiTextMock }));

const QUESTION: Question = {
  id: 'q1',
  subject: 'Biologia',
  topicId: 'topic-1',
  prompt: 'Onde ocorre a glicólise?',
  options: [
    { id: 'a', text: 'Citoplasma' },
    { id: 'b', text: 'Mitocôndria' },
  ],
  correctOptionId: 'a',
  explanation: 'A glicólise ocorre no citoplasma.',
  difficulty: 'easy',
};

beforeEach(() => {
  vi.clearAllMocks();
  authHook.mockReturnValue({ user: { uid: 'user-1' } });
  masteryHook.mockReturnValue({ updateMastery: vi.fn(), isPersisted: true, syncError: null });
  questionsHook.mockReturnValue({ questions: [QUESTION], syncError: null });
  requestAiTextMock.mockResolvedValue({
    text: JSON.stringify({
      type: 'concept_confusion',
      breakPoint: 'Confundiu organela com compartimento.',
      evidence: 'Marcou mitocôndria.',
      confidence: 'media',
      intervention: { type: 'revisao_dirigida', description: 'Revisar respiração celular.' },
    }),
  });
});

describe('Questoes — estados de persistência (regressão da migração instrumental)', () => {
  it('mostra o aviso de modo demonstração quando o domínio não está sendo persistido', () => {
    masteryHook.mockReturnValue({ updateMastery: vi.fn(), isPersisted: false, syncError: null });
    render(<Questoes />);
    expect(screen.getByText(/Modo demonstração/i)).toBeInTheDocument();
  });

  it('mostra o erro de sincronização do banco de questões', () => {
    questionsHook.mockReturnValue({ questions: [QUESTION], syncError: 'Falha ao sincronizar questões.' });
    render(<Questoes />);
    expect(screen.getByText('Falha ao sincronizar questões.')).toBeInTheDocument();
  });
});

describe('Questoes — diagnóstico de erro salvo no Caderno', () => {
  it('grava o ErrorLog como fato confirmado e intervenção pendente ao salvar', async () => {
    const user = userEvent.setup();
    render(<Questoes />);

    await user.click(screen.getByRole('button', { name: /Mitocôndria/ }));

    const saveButton = await screen.findByRole('button', { name: /Adicionar ao Caderno de Erros/i });
    await user.click(saveButton);

    await waitFor(() => expect(addUserErrorLogMock).toHaveBeenCalled());
    const [, log] = addUserErrorLogMock.mock.calls[0];
    expect(log).toMatchObject({
      questionId: 'q1',
      topicId: 'topic-1',
      type: 'concept_confusion',
      confidence: 'confirmado',
      interventionStatus: 'pendente',
    });
  });

  it('permite registrar o erro mesmo quando o diagnóstico da IA falha', async () => {
    // Regressão: o guard exigia um diagnóstico para salvar, então uma falha de
    // rede tornava o erro impossível de registrar — justamente quando
    // registrar importa.
    requestAiTextMock.mockRejectedValue(new Error('sem rede'));
    const user = userEvent.setup();
    render(<Questoes />);

    await user.click(screen.getByRole('button', { name: /Mitocôndria/ }));

    expect(await screen.findByText(/Não consegui diagnosticar agora/i)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Adicionar ao Caderno de Erros/i }));

    await waitFor(() => expect(addUserErrorLogMock).toHaveBeenCalled());
    const [, log] = addUserErrorLogMock.mock.calls[0];
    expect(log).toMatchObject({ questionId: 'q1', confidence: 'confirmado' });
    // Sem hipótese da IA, o registro não inventa uma.
    expect(log.aiHypothesis).toBeUndefined();
    expect(log.notes).toMatch(/classificado por você/);
  });

  it('usa o tipo escolhido pela estudante, não o sugerido pela IA', async () => {
    const user = userEvent.setup();
    render(<Questoes />);

    await user.click(screen.getByRole('button', { name: /Mitocôndria/ }));
    const select = await screen.findByLabelText(/Tipo do erro/i);
    await user.selectOptions(select, 'attention');
    await user.click(screen.getByRole('button', { name: /Adicionar ao Caderno de Erros/i }));

    await waitFor(() => expect(addUserErrorLogMock).toHaveBeenCalled());
    const [, log] = addUserErrorLogMock.mock.calls[0];
    expect(log.type).toBe('attention');
    // Trocou o tipo: a hipótese descartada da IA não vai junto.
    expect(log.aiHypothesis).toBeUndefined();
  });

  it('não mostra o bloco de erro quando a resposta está correta', async () => {
    const user = userEvent.setup();
    render(<Questoes />);

    await user.click(screen.getByRole('button', { name: /Citoplasma/ }));

    expect(screen.queryByRole('button', { name: /Adicionar ao Caderno de Erros/i })).not.toBeInTheDocument();
  });
});

describe('Questoes — navegação por tópico e subtópico', () => {
  // Usa tópicos reais do currículo: a árvore só reconhece topicIds cadastrados
  // em mockTopics, então ids inventados cairiam todos em "Fora do currículo".
  const bioCell = 'bio_estrutura_fisio_celular';

  function question(patch: Partial<Question>): Question {
    return { ...QUESTION, ...patch };
  }

  const bank: Question[] = [
    question({ id: 'a', topicId: bioCell, chapter: 'Membranas Celulares', prompt: 'Sobre membranas?' }),
    question({ id: 'b', topicId: bioCell, chapter: 'Membranas Celulares', prompt: 'Outra de membranas?' }),
    question({ id: 'c', topicId: bioCell, chapter: 'Núcleo Celular', prompt: 'Sobre o núcleo?' }),
    question({
      id: 'd',
      topicId: 'bio_metabolismo_energetico',
      chapter: 'Respiração Celular',
      prompt: 'Sobre respiração?',
    }),
  ];

  beforeEach(() => {
    questionsHook.mockReturnValue({ questions: bank, syncError: null });
  });

  it('lista os tópicos presentes no banco com a contagem de questões', () => {
    render(<Questoes />);
    expect(screen.getByRole('button', { name: /Estrutura e Fisiologia Celular \(3\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Metabolismo Energético \(1\)/ })).toBeInTheDocument();
  });

  it('só mostra a faixa de subtópicos depois que um tópico é escolhido', async () => {
    const user = userEvent.setup();
    render(<Questoes />);
    expect(screen.queryByRole('button', { name: /Todos os subtópicos/ })).not.toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /Estrutura e Fisiologia Celular/ }));

    expect(screen.getByRole('button', { name: /Todos os subtópicos/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Membranas Celulares \(2\)/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Núcleo Celular \(1\)/ })).toBeInTheDocument();
  });

  it('restringe o conjunto ao subtópico escolhido', async () => {
    const user = userEvent.setup();
    render(<Questoes />);
    await user.click(screen.getByRole('button', { name: /Estrutura e Fisiologia Celular/ }));
    await user.click(screen.getByRole('button', { name: /Membranas Celulares \(2\)/ }));

    await waitFor(() => {
      expect(screen.getByText(/Questão 1 de 2/)).toBeInTheDocument();
    });
  });

  it('trocar de matéria limpa o tópico escolhido', async () => {
    const user = userEvent.setup();
    render(<Questoes />);
    await user.click(screen.getByRole('button', { name: /Estrutura e Fisiologia Celular/ }));
    expect(screen.getByRole('button', { name: /Todos os subtópicos/ })).toBeInTheDocument();

    await user.click(screen.getByRole('button', { name: /^Biologia$/ }));

    expect(screen.queryByRole('button', { name: /Todos os subtópicos/ })).not.toBeInTheDocument();
  });
});
