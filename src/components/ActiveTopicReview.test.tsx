import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ActiveTopicReview } from './ActiveTopicReview';
import { mockTopicDiscursivePrompts } from '../data/topicDiscursivePrompts';
import type { Question } from '../types';
const prompt = mockTopicDiscursivePrompts[0];
const question: Question = { id: 'real', topicId: prompt.topicId, subject: prompt.subject, chapter: prompt.chapter, prompt: 'Escolha a proporção.', options: [{ id: 'a', text: 'Direta' }, { id: 'b', text: 'Inversa' }], correctOptionId: 'a', explanation: 'Multiplicar uma grandeza multiplica a outra pelo mesmo fator.', difficulty: 'easy', examSource: { board: 'COMVEST', year: 2026 } };
describe('revisão com evidência', () => {
  it.each(['a', 'b'])('exige recuperação e aplicação e explica o gabarito para resposta %s', async answer => {
    const complete = vi.fn().mockResolvedValue(true);
    render(<ActiveTopicReview topicId={prompt.topicId} chapter={prompt.chapter} board="Unicamp" questions={[question]} onComplete={complete} />);
    fireEvent.click(screen.getByText('Iniciar revisão ativa · 10–15 min'));
    expect(screen.getByText('Conferir minha recuperação')).toBeDisabled();
    expect(screen.queryByText(prompt.modelAnswer)).toBeNull();
    fireEvent.change(screen.getByLabelText('Sua explicação sem consulta'), { target: { value: 'Minha explicação original' } });
    fireEvent.click(screen.getByText('Conferir minha recuperação'));
    expect(screen.getByText('Registrar revisão com esta evidência')).toBeDisabled();
    for (const point of prompt.keyPoints) fireEvent.click(screen.getByLabelText(point));
    fireEvent.click(screen.getByText(`${answer.toUpperCase()}. ${answer === 'a' ? 'Direta' : 'Inversa'}`));
    expect(screen.getByText(question.explanation)).toBeInTheDocument();
    fireEvent.click(screen.getByText('Registrar revisão com esta evidência'));
    expect(complete).toHaveBeenCalledWith(answer === 'a' ? 'forte' : 'fraco');
    expect(await screen.findByText('Revisão registrada')).toBeDisabled();
  });
  it('não permite registrar uma revisão sem exercício para o recorte', () => {
    const complete = vi.fn().mockResolvedValue(true);
    render(<ActiveTopicReview topicId="inexistente" board="" questions={[]} onComplete={complete} />);
    expect(screen.queryByRole('button')).toBeNull();
    expect(complete).not.toHaveBeenCalled();
  });
});

it('mantém a questão da sessão e permite repetir gravação rejeitada', async () => {
  const complete = vi.fn().mockResolvedValue(false);
  const props = { topicId: prompt.topicId, chapter: prompt.chapter, board: 'Unicamp', onComplete: complete };
  const { rerender } = render(<ActiveTopicReview {...props} questions={[question]} />);
  fireEvent.click(screen.getByText('Iniciar revisão ativa · 10–15 min'));
  rerender(<ActiveTopicReview {...props} questions={[{ ...question, id: 'remote', prompt: 'Outra questão remota', correctOptionId: 'b' }]} />);
  fireEvent.change(screen.getByLabelText('Sua explicação sem consulta'), { target: { value: 'Explicação' } });
  fireEvent.click(screen.getByText('Conferir minha recuperação'));
  expect(screen.getByText(question.prompt)).toBeInTheDocument();
  expect(screen.queryByText('Outra questão remota')).toBeNull();
  fireEvent.click(screen.getByText('A. Direta'));
  fireEvent.click(screen.getByText('Registrar revisão com esta evidência'));
  await screen.findByRole('alert');
  expect(screen.getByText('Registrar revisão com esta evidência')).toBeEnabled();
  expect(screen.queryByText('Revisão registrada')).toBeNull();
});

it('aplica o capítulo recuperado mesmo quando o tópico inteiro está selecionado', () => {
  const complete = vi.fn().mockResolvedValue(true);
  render(<ActiveTopicReview topicId={prompt.topicId} board="Unicamp / Comvest" questions={[{ ...question, id: 'other', chapter: 'Outro capítulo', prompt: 'Aplicação de outro capítulo' }, question]} onComplete={complete} />);
  fireEvent.click(screen.getByText('Iniciar revisão ativa · 10–15 min'));
  fireEvent.change(screen.getByLabelText('Sua explicação sem consulta'), { target: { value: 'Explicação' } });
  fireEvent.click(screen.getByText('Conferir minha recuperação'));
  expect(screen.getByText(question.prompt)).toBeInTheDocument();
  expect(screen.queryByText('Aplicação de outro capítulo')).toBeNull();
});
