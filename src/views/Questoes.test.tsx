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
  masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn(), isPersisted: true, syncError: null });
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

describe('Questoes — banca, ano e fontes oficiais', () => {
  it('combina banca/ano e recalcula tópicos, contagens e resposta ao trocar a prova', async () => {
    questionsHook.mockReturnValue({ questions: [
      { ...QUESTION, id: 'comvest25', topicId: 'bio_estrutura_fisio_celular', chapter: 'Membranas Celulares', prompt: 'Prova de 2025', examSource: { board: 'COMVEST', year: 2025 } },
      { ...QUESTION, id: 'unicamp26', topicId: 'bio_genetica', chapter: 'Introdução à Genética', prompt: 'Prova de 2026', examSource: { board: 'UNICAMP', year: 2026 } },
      { ...QUESTION, id: 'fuvest26', topicId: 'bio_estrutura_fisio_celular', chapter: 'Núcleo Celular', prompt: 'Outra banca', examSource: { board: 'FUVEST', year: 2026 } },
    ], syncError: null });
    const user = userEvent.setup();
    render(<Questoes />);
    await user.selectOptions(screen.getByLabelText('Banca'), 'UNICAMP');
    expect(screen.getByText(/Questão 1 de 2/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Citoplasma/ }));
    expect(screen.getByText(QUESTION.explanation)).toBeInTheDocument();
    await user.selectOptions(screen.getByLabelText('Ano da prova'), '2026');
    expect(screen.getByText('Prova de 2026')).toBeInTheDocument();
    expect(screen.queryByText(QUESTION.explanation)).not.toBeInTheDocument();
    expect(screen.getByLabelText('Tópico')).toHaveTextContent('Genética (1)');
    expect(screen.getByRole('link', { name: /Caderno Unicamp 2026/ })).toHaveAttribute('href', '/real-exams/unicamp-2026.pdf');
    expect(screen.getByRole('button', { name: /Só Questões Reais \(1\)/ })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Só Questões Reais/ }));
    expect(screen.getByLabelText('Banca')).toHaveValue('all');
    expect(screen.getByLabelText('Ano da prova')).toHaveValue('all');
    expect(screen.queryByRole('link', { name: /Caderno Unicamp 2026/ })).not.toBeInTheDocument();
    expect(screen.getByText(/Questão 1 de 3/)).toBeInTheDocument();
  });

  it('mostra só o texto quando a questão não depende da página original', () => {
    questionsHook.mockReturnValue({ questions: [{ ...QUESTION,
      originalPages: [{ page: 5, url: '/question-media/oficiais/unicamp-2026-qx/p05.webp' }],
    }], syncError: null });
    render(<Questoes />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('mostra as figuras recortadas da questão, sem link para a página', () => {
    questionsHook.mockReturnValue({ questions: [{ ...QUESTION,
      originalPages: [{ page: 5, url: '/question-media/oficiais/unicamp-2026-qx/p05.webp' }],
      figures: [{ url: '/question-media/figuras/x-1.webp' }],
    }], syncError: null });
    render(<Questoes />);
    const figura = screen.getByRole('img', { name: 'Figura 1 da questão' });
    expect(figura).toHaveAttribute('src', '/question-media/figuras/x-1.webp');
    expect(figura.closest('a')).toBeNull();
  });

  it('preserva a página e mostra links separados para prova e gabarito após responder', async () => {
    questionsHook.mockReturnValue({ questions: [{ ...QUESTION, prompt: `${QUESTION.prompt} Observe a figura.`,
      originalPages: [{ page: 5, url: '/question-media/oficiais/unicamp-2026-qx/p05.webp' }],
      examSource: { board: 'UNICAMP', year: 2026, phase: '1ª fase', questionNumber: 9,
        sourceUrl: 'https://www.comvest.unicamp.br/prova.pdf', answerKeyUrl: 'https://www.comvest.unicamp.br/gabarito.pdf' },
    }], syncError: null });
    const user = userEvent.setup();
    render(<Questoes />);
    expect(screen.queryByRole('img', { hidden: true })).not.toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Citoplasma/ }));
    expect(screen.getByRole('link', { name: 'Conferir prova original' })).toHaveAttribute('href', 'https://www.comvest.unicamp.br/prova.pdf');
    expect(screen.getByRole('link', { name: 'Conferir gabarito oficial' })).toHaveAttribute('href', 'https://www.comvest.unicamp.br/gabarito.pdf');
    expect(requestAiTextMock).not.toHaveBeenCalled();
  });
});

describe('Questoes — estados de persistência (regressão da migração instrumental)', () => {
  it('mostra o aviso de modo demonstração quando o domínio não está sendo persistido', () => {
    masteryHook.mockReturnValue({ mastery: [], updateMastery: vi.fn(), isPersisted: false, syncError: null });
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
    // Sem diagnóstico e sem escolha dela, o erro entra como 'unknown' com
    // confiança baixa. Antes entrava como 'conceptual' e 'confirmado', o que
    // fabricava uma categoria que ninguém tinha afirmado.
    expect(log).toMatchObject({ questionId: 'q1', type: 'unknown', confidence: 'baixa' });
    // Sem hipótese da IA, o registro não inventa uma.
    expect(log.aiHypothesis).toBeUndefined();
    expect(log.notes).toMatch(/motivo ainda não identificado/);
  });

  it('pede o diagnóstico com o relato dela quando ela não sabe por que errou', async () => {
    requestAiTextMock.mockRejectedValueOnce(new Error('sem rede'));
    const user = userEvent.setup();
    render(<Questoes />);

    await user.click(screen.getByRole('button', { name: /Mitocôndria/ }));
    expect(await screen.findByText(/Não consegui diagnosticar agora/i)).toBeInTheDocument();

    // O campo de relato só existe porque a alternativa marcada, sozinha, não
    // distingue um erro de conta de um conceito trocado.
    const relato = await screen.findByLabelText(/o que passou pela sua cabeça/i);
    await user.type(relato, 'confundi a organela com o cloroplasto');

    requestAiTextMock.mockResolvedValueOnce({
      text: JSON.stringify({
        type: 'concept_confusion',
        breakPoint: 'trocou a organela da respiração pela da fotossíntese',
        evidence: 'o relato nomeia o cloroplasto',
        confidence: 'media',
        intervention: { type: 'comparacao_conceitos', description: 'compare as duas organelas lado a lado' },
      }),
    });
    await user.click(screen.getByRole('button', { name: /Diagnosticar de novo/i }));

    await waitFor(() => {
      const [, payload] = requestAiTextMock.mock.calls[requestAiTextMock.mock.calls.length - 1];
      expect(payload).toMatchObject({ studentAccount: 'confundi a organela com o cloroplasto' });
    });
    expect(await screen.findByText(/trocou a organela da respiração/i)).toBeInTheDocument();
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

  const seletorTopico = () => screen.getByLabelText(/^Tópico$/) as HTMLSelectElement;
  const escolherTopico = async (user: ReturnType<typeof userEvent.setup>, prefixo: string) => {
    const alvo = [...seletorTopico().querySelectorAll('option')]
      .find((o) => o.textContent?.startsWith(prefixo));
    await user.selectOptions(seletorTopico(), alvo!.value);
  };
  const seletorSubtopico = () => screen.getByLabelText(/^Subtópico$/) as HTMLSelectElement;

  it('lista os tópicos presentes no banco com a contagem de questões', () => {
    render(<Questoes />);
    const rotulos = [...seletorTopico().querySelectorAll('option')].map((o) => o.textContent);
    expect(rotulos).toContain('Estrutura e Fisiologia Celular (3)');
    expect(rotulos).toContain('Metabolismo Energético (1)');
  });

  it('só oferece subtópicos depois que um tópico é escolhido', async () => {
    const user = userEvent.setup();
    render(<Questoes />);
    // Desabilitado, e não escondido: um campo que some quando o de cima muda
    // faz a linha inteira pular. Desabilitado, o lugar dele continua visível.
    expect(seletorSubtopico()).toBeDisabled();

    await escolherTopico(user, 'Estrutura e Fisiologia Celular');

    expect(seletorSubtopico()).toBeEnabled();
    const rotulos = [...seletorSubtopico().querySelectorAll('option')].map((o) => o.textContent);
    expect(rotulos).toContain('Membranas Celulares (2)');
    expect(rotulos).toContain('Núcleo Celular (1)');
  });

  it('restringe o conjunto ao subtópico escolhido', async () => {
    const user = userEvent.setup();
    render(<Questoes />);
    await escolherTopico(user, 'Estrutura e Fisiologia Celular');
    const membranas = [...seletorSubtopico().querySelectorAll('option')]
      .find((o) => o.textContent?.startsWith('Membranas Celulares'))!;
    await user.selectOptions(seletorSubtopico(), membranas.value);

    await waitFor(() => {
      expect(screen.getByText(/Questão 1 de 2/)).toBeInTheDocument();
    });
  });

  it('trocar de matéria limpa o tópico escolhido', async () => {
    const user = userEvent.setup();
    render(<Questoes />);
    await escolherTopico(user, 'Estrutura e Fisiologia Celular');
    expect(seletorSubtopico()).toBeEnabled();

    await user.click(screen.getByRole('button', { name: /^Biologia$/ }));

    expect(seletorTopico().value).toBe('Todas');
    expect(seletorSubtopico()).toBeDisabled();
  });
});

describe('Questoes — visibilidade do filtro de questões reais', () => {
  function comFonte(patch: Partial<Question>): Question {
    return {
      ...QUESTION,
      examSource: { board: 'FUVEST', year: 2026, sourceUrl: 'https://exemplo/g.pdf' },
      ...patch,
    };
  }

  it('mostra no botão quantas questões reais o banco carregado tem', () => {
    questionsHook.mockReturnValue({
      questions: [QUESTION, comFonte({ id: 'r1' }), comFonte({ id: 'r2' })],
      syncError: null,
    });
    render(<Questoes />);
    expect(screen.getByRole('button', { name: /Só Questões Reais \(2\)/ })).toBeInTheDocument();
  });

  it('mostra zero quando o banco carregado não tem nenhuma questão de prova', () => {
    questionsHook.mockReturnValue({ questions: [QUESTION], syncError: null });
    render(<Questoes />);
    expect(screen.getByRole('button', { name: /Só Questões Reais \(0\)/ })).toBeInTheDocument();
  });

  it('explica o vazio quando o filtro é ligado e não há questão real alguma', async () => {
    // Sem essa explicação, banco desatualizado e filtro quebrado ficam
    // indistinguíveis para quem está usando o app.
    questionsHook.mockReturnValue({ questions: [QUESTION], syncError: null });
    const user = userEvent.setup();
    render(<Questoes />);

    await user.click(screen.getByRole('button', { name: /Só Questões Reais/ }));

    expect(screen.getByText(/não tem nenhuma questão de prova real/i)).toBeInTheDocument();
    expect(screen.getByText(/semeie o banco em \/admin\/conteudo/i)).toBeInTheDocument();
  });

  it('filtra para as questões reais quando elas existem', async () => {
    questionsHook.mockReturnValue({
      questions: [QUESTION, comFonte({ id: 'r1' }), comFonte({ id: 'r2' })],
      syncError: null,
    });
    const user = userEvent.setup();
    render(<Questoes />);

    await user.click(screen.getByRole('button', { name: /Só Questões Reais/ }));

    await waitFor(() => expect(screen.getByText(/Questão 1 de 2/)).toBeInTheDocument());
  });

  it('a barra de precisão acompanha o valor em vez de ficar cheia por padrão', async () => {
    // Regressão: .ni-metric>i span tinha width:62% fixo no CSS, então a barra
    // aparecia mais da metade cheia num treino 0/0, ao lado de um valor "—".
    const user = userEvent.setup();
    const { container } = render(<Questoes />);

    const barra = () => container.querySelector('.ni-metric > i > span') as HTMLElement;
    expect(barra().style.getPropertyValue('--bar-fill')).toBe('0%');

    await user.click(screen.getByRole('button', { name: /Mitocôndria/ }));
    await waitFor(() => expect(barra().style.getPropertyValue('--bar-fill')).toBe('0%'));
  });

  it('agrupa os tópicos por matéria em vez de listar todos de uma vez', async () => {
    render(<Questoes />);
    const seletor = (await screen.findByLabelText(/Tópico/)) as HTMLSelectElement;
    // Com "Todas" selecionado, o primeiro nível do seletor são as matérias:
    // antes eram mais de sessenta tópicos numa fileira única de chips.
    const grupos = [...seletor.children].filter((filho) => filho.tagName === 'OPTGROUP');
    expect(grupos.length).toBeGreaterThan(0);
    expect(grupos.every((grupo) => (grupo as HTMLOptGroupElement).children.length > 0)).toBe(true);
  });
});

it.each(['Citoplasma', 'Mitocôndria'])('mostra justificativa da alternativa correta ao responder %s', async answer => {
  const user = userEvent.setup();
  render(<Questoes />);
  await user.click(screen.getByRole('button', { name: new RegExp(answer) }));
  expect(screen.getByText('Por que a alternativa correta está certa')).toBeInTheDocument();
  expect(screen.getByText(QUESTION.explanation)).toBeInTheDocument();
});

it('abre o tópico encaminhado por Prioridades sem trocar o recorte', () => {
  window.history.pushState({}, '', '/questoes?topic=bio_genetica');
  questionsHook.mockReturnValue({ questions: [{ ...QUESTION, topicId: 'bio_genetica' }], syncError: null });
  render(<Questoes />);
  expect(screen.getByRole('combobox', { name: 'Tópico' })).toHaveValue('bio_genetica');
  expect(screen.getByText(QUESTION.prompt)).toBeInTheDocument();
  window.history.replaceState({}, '', '/');
});

it('mantém a banca e o tópico encaminhados por Prioridades', () => {
  window.history.pushState({}, '', '/questoes?topic=bio_genetica&board=FUVEST');
  questionsHook.mockReturnValue({ questions: [{ ...QUESTION, id: 'fuvest', topicId: 'bio_genetica', prompt: 'Treino Fuvest encaminhado', examSource: { board: 'FUVEST', year: 2026 } }, { ...QUESTION, id: 'comvest', topicId: 'bio_genetica', prompt: 'Questão de outra banca', examSource: { board: 'COMVEST', year: 2026 } }], syncError: null });
  render(<Questoes />);
  expect(screen.getByRole('combobox', { name: 'Banca' })).toHaveValue('FUVEST');
  expect(screen.getByText('Treino Fuvest encaminhado')).toBeInTheDocument();
  expect(screen.queryByText('Questão de outra banca')).toBeNull();
  window.history.replaceState({}, '', '/');
});

it('usa a banca da navegação local da central, preservando o endereço externo',async()=>{
 const {MemoryRouter}=await import('react-router-dom');
 questionsHook.mockReturnValue({questions:[{...QUESTION,id:'local-unicamp',prompt:'Questão da central',examSource:{board:'UNICAMP',year:2026}}],syncError:null});
 render(<MemoryRouter initialEntries={['/questoes?board=UNICAMP']}><Questoes/></MemoryRouter>);
 expect(screen.getByRole('combobox',{name:'Banca'})).toHaveValue('UNICAMP');
});
