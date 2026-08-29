import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { STATE_LABELS } from '../lib/backlogEngine';
import type { Question } from '../types';
import Diagnostico from './Diagnostico';

const authHook = vi.hoisted(() => vi.fn());
const masteryHook = vi.hoisted(() => vi.fn());
const questionsHook = vi.hoisted(() => vi.fn());
const addUserAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));
const addUserDiscursiveAttemptMock = vi.hoisted(() => vi.fn().mockResolvedValue(undefined));

vi.mock('../context/AuthContext', () => ({ useAuth: authHook }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: masteryHook }));
vi.mock('../hooks/useQuestions', () => ({ useQuestions: questionsHook }));
vi.mock('../lib/userData', () => ({
  addUserAttempt: addUserAttemptMock,
  addUserDiscursiveAttempt: addUserDiscursiveAttemptMock,
}));

const MC_TOPIC_ID = 'topic-mc';
const DISC_TOPIC_ID = 'topic-disc';

// Catálogo mínimo e determinístico: um tópico só com questão de múltipla
// escolha, outro só com prompt discursivo — evita depender do currículo real
// (grande, muda com frequência) para montar cada cenário de teste.
vi.mock('../data/mockData', () => ({
  mockTopics: [
    { id: 'topic-mc', name: 'Tópico MC', subject: 'Matemática', prerequisites: [] },
    { id: 'topic-disc', name: 'Tópico Discursivo', subject: 'Matemática', prerequisites: [] },
  ],
}));

vi.mock('../data/topicDiscursivePrompts', () => ({
  mockTopicDiscursivePrompts: [
    {
      id: 'disc-1',
      topicId: 'topic-disc',
      subject: 'Matemática',
      prompt: 'Explique o conceito X.',
      modelAnswer: 'Resposta modelo.',
      keyPoints: ['ponto-chave 1'],
      difficulty: 'medium',
    },
  ],
}));

const mcQuestion: Question = {
  id: 'q1',
  topicId: MC_TOPIC_ID,
  subject: 'Matemática',
  prompt: 'Quanto é 2 + 2?',
  options: [
    { id: 'a', text: '3' },
    { id: 'b', text: '4' },
  ],
  correctOptionId: 'b',
  explanation: 'Porque 2 + 2 = 4.',
  difficulty: 'easy',
};

function setup({
  user = { uid: 'user-1' } as { uid: string } | null,
  updateMastery = vi.fn().mockResolvedValue(true),
  questions = [mcQuestion],
}: {
  user?: { uid: string } | null;
  updateMastery?: ReturnType<typeof vi.fn>;
  questions?: Question[];
} = {}) {
  authHook.mockReturnValue({ user, isConnected: !!user });
  masteryHook.mockReturnValue({
    mastery: [],
    updateMastery,
    loading: false,
    syncError: null,
    isPersisted: !!user,
  });
  questionsHook.mockReturnValue({ questions, syncError: null });
  const view = render(<Diagnostico />);
  return { updateMastery, unmount: view.unmount };
}

// Autoavaliação (estado 2 = "Aplicação guiada") seguida de confirmação —
// mesmo passo em todo cenário, então fica isolado num helper.
function selfReport(stateIndex = 2) {
  fireEvent.click(screen.getByText(`${stateIndex} — ${STATE_LABELS[stateIndex]}`));
  fireEvent.click(screen.getByText(/Continuar para o teste rápido|Ver resultado/));
}

describe('Diagnostico', () => {
  // Rascunho de retomada vive em sessionStorage, não em mock — sem isolar
  // entre testes, um rascunho gravado (ou corrompido de propósito) num teste
  // vazaria pro próximo.
  beforeEach(() => {
    window.sessionStorage.clear();
  });

  it('grava um QuestionAttempt real ao responder uma questão de múltipla escolha', () => {
    setup();
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));

    expect(addUserAttemptMock).toHaveBeenCalledTimes(1);
    expect(addUserAttemptMock).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        questionId: 'q1',
        topicId: MC_TOPIC_ID,
        correct: true,
        date: expect.any(String),
      })
    );
  });

  it('não grava tentativa em modo demonstração (sem usuário autenticado)', () => {
    setup({ user: null });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));

    expect(addUserAttemptMock).not.toHaveBeenCalled();
  });

  it('grava um DiscursiveAttempt ao autoavaliar uma discursiva como "mediano"', () => {
    setup({ questions: [] });
    fireEvent.click(screen.getByText('Tópico Discursivo'));
    selfReport();
    fireEvent.click(screen.getByText('Pensei na resposta — ver o gabarito'));
    fireEvent.click(screen.getByText('Mediano'));

    expect(addUserDiscursiveAttemptMock).toHaveBeenCalledTimes(1);
    expect(addUserDiscursiveAttemptMock).toHaveBeenCalledWith(
      'user-1',
      expect.objectContaining({
        questionId: 'disc-1',
        topicId: DISC_TOPIC_ID,
        selfRating: 'mediano',
        date: expect.any(String),
      })
    );
  });

  it('mostra "Diagnóstico salvo" quando updateMastery resolve true', async () => {
    setup({ updateMastery: vi.fn().mockResolvedValue(true) });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Ver resultado'));

    fireEvent.click(screen.getByText('Salvar diagnóstico'));

    await waitFor(() => expect(screen.getByText(/Diagnóstico salvo/)).toBeInTheDocument());
  });

  it('mostra um erro real (e não "salvo") quando updateMastery resolve false', async () => {
    setup({ updateMastery: vi.fn().mockResolvedValue(false) });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Ver resultado'));

    fireEvent.click(screen.getByText('Salvar diagnóstico'));

    await waitFor(() => expect(screen.getByText(/Não foi possível salvar/)).toBeInTheDocument());
    expect(screen.queryByText(/Diagnóstico salvo/)).not.toBeInTheDocument();
  });

  it('a entrada passada para updateMastery inclui origin "diagnostic"', async () => {
    const updateMastery = vi.fn().mockResolvedValue(true);
    setup({ updateMastery });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Ver resultado'));

    fireEvent.click(screen.getByText('Salvar diagnóstico'));

    await waitFor(() => expect(updateMastery).toHaveBeenCalledTimes(1));
    const updater = updateMastery.mock.calls[0][0] as (prev: unknown[]) => { topicId: string; origin?: string }[];
    const result = updater([]);
    expect(result[0]).toMatchObject({ topicId: MC_TOPIC_ID, origin: 'diagnostic' });
  });

  it('clicar "Salvar diagnóstico" duas vezes rápido só resulta em uma chamada de updateMastery', async () => {
    let resolvePending: (value: boolean) => void = () => {};
    const updateMastery = vi.fn().mockImplementation(
      () => new Promise<boolean>((resolve) => { resolvePending = resolve; })
    );
    setup({ updateMastery });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Ver resultado'));

    const saveButton = screen.getByText('Salvar diagnóstico');
    fireEvent.click(saveButton);
    fireEvent.click(saveButton);

    expect(updateMastery).toHaveBeenCalledTimes(1);

    await act(async () => {
      resolvePending(true);
      await Promise.resolve();
    });
  });

  it('retoma no índice 2 do quiz (não no 1) e mantém a resposta da questão anterior ao desmontar e remontar (simulando reload)', () => {
    // Segunda questão de múltipla escolha só para este teste, pra "mesmo
    // índice" ser uma afirmação real: respondemos a questão 1 e avançamos
    // pra questão 2 ANTES de recarregar — só assim um bug em quizIndex (ex.:
    // sempre voltar pro índice 0) teria como reprovar o teste.
    const secondQuestion: Question = {
      id: 'q2',
      topicId: MC_TOPIC_ID,
      subject: 'Matemática',
      prompt: 'Quanto é 3 + 3?',
      options: [
        { id: 'a', text: '5' },
        { id: 'b', text: '6' },
      ],
      correctOptionId: 'b',
      explanation: 'Porque 3 + 3 = 6.',
      difficulty: 'easy',
    };
    const questions = [mcQuestion, secondQuestion];

    // buildQuizPool embaralha com Math.random — travado aqui só pra pool sair
    // na mesma ordem nas duas montagens (o que o rascunho real precisa garantir sozinho).
    const randomSpy = vi.spyOn(Math, 'random').mockReturnValue(0.99);
    try {
      const { unmount } = setup({ questions });
      fireEvent.click(screen.getByText('Tópico MC'));
      selfReport();
      fireEvent.click(screen.getByText('4')); // responde a questão 1 (correta)
      fireEvent.click(screen.getByText('Próxima questão')); // avança pro índice 1

      expect(screen.getByText('Questão 2 de 2')).toBeInTheDocument();

      unmount();
      setup({ questions });

      // Reabriu direto na questão 2 — não voltou pra questão 1 nem pra 'pick'.
      expect(screen.getByText('Questão 2 de 2')).toBeInTheDocument();
      expect(screen.queryByText('Correto!')).not.toBeInTheDocument();

      // Responde a questão 2 e confirma que o resultado final soma as DUAS
      // respostas — prova de que a resposta da questão 1 (dada antes do
      // recarregamento, quando essa questão nem era mais a atual) não foi perdida.
      fireEvent.click(screen.getByText('6'));
      fireEvent.click(screen.getByText('Ver resultado'));

      expect(screen.getByText(/ajustado por 2 acerto\(s\) e 0 erro\(s\)/)).toBeInTheDocument();
    } finally {
      randomSpy.mockRestore();
    }
  });

  it('sessionStorage com rascunho corrompido não impede a tela de abrir normalmente em "pick"', () => {
    window.sessionStorage.setItem('crivo_diagnostico_draft:user-1', '{not valid json');

    expect(() => setup()).not.toThrow();
    expect(screen.getByText('Tópico MC')).toBeInTheDocument();
  });

  it('rascunho com formato válido mas topicId que não existe mais em mockTopics abre em "pick"', () => {
    // Formato correto (passa por todas as validações de parseDiagnosticoDraft),
    // só o topicId é de um tópico que não está (mais) no catálogo — cobre a
    // checagem "topicId ainda existe em mockTopics" do contrato, separada da
    // validação de formato do JSON.
    window.sessionStorage.setItem(
      'crivo_diagnostico_draft:user-1',
      JSON.stringify({
        topicId: 'topic-que-nao-existe-mais',
        selectedSubtopic: '',
        phase: 'quiz',
        selfState: 2,
        dontKnow: false,
        quizIndex: 0,
        quizAnswers: [],
        quizChapter: null,
        chapterFallback: false,
        quizPoolItems: [{ kind: 'mc', id: 'q1' }],
      })
    );

    expect(() => setup()).not.toThrow();
    expect(screen.getByText('Tópico MC')).toBeInTheDocument();
    expect(screen.queryByText(/Questão \d+ de \d+/)).not.toBeInTheDocument();
  });

  it('apaga o rascunho em sessionStorage ao concluir "saveDiagnostic" com sucesso', async () => {
    setup({ updateMastery: vi.fn().mockResolvedValue(true) });
    fireEvent.click(screen.getByText('Tópico MC'));
    selfReport();
    fireEvent.click(screen.getByText('4'));
    fireEvent.click(screen.getByText('Ver resultado'));

    expect(window.sessionStorage.getItem('crivo_diagnostico_draft:user-1')).not.toBeNull();

    fireEvent.click(screen.getByText('Salvar diagnóstico'));

    await waitFor(() => expect(screen.getByText(/Diagnóstico salvo/)).toBeInTheDocument());
    expect(window.sessionStorage.getItem('crivo_diagnostico_draft:user-1')).toBeNull();
  });
});
