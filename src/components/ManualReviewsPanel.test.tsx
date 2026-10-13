import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { ManualReviewsPanel } from './ManualReviewsPanel';
import { mockTopicDiscursivePrompts } from '../data/topicDiscursivePrompts';
import { mockTopics } from '../data/mockData';
const mocks = vi.hoisted(() => ({ uid: null as string | null, get: vi.fn(), save: vi.fn(), complete: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: mocks.uid ? { uid: mocks.uid } : null }) }));
vi.mock('../lib/manualReviews', async importOriginal => ({ ...await importOriginal<typeof import('../lib/manualReviews')>(), getManualReviews: mocks.get, saveManualReview: mocks.save }));
vi.mock('../lib/userData', () => ({ completeUserManualReview: mocks.complete }));
vi.mock('./ActiveTopicReview', () => ({ ActiveTopicReview: ({ onComplete }: { onComplete: (rating: 'forte') => Promise<boolean> }) => <button onClick={() => onComplete('forte')}>Completar treino de teste</button> }));
const topic = mockTopics[0];
const supportedChapter = mockTopicDiscursivePrompts.find(prompt => prompt.topicId === topic.id && topic.chapters?.includes(prompt.chapter))!.chapter;
const item = { id: 'manual1', topicId: topic.id, chapter: '', board: '', date: '2099-01-01', status: 'scheduled' };
beforeEach(() => { mocks.uid = null; mocks.get.mockReset().mockResolvedValue([]); mocks.save.mockReset().mockResolvedValue(undefined); mocks.complete.mockReset().mockResolvedValue([]); });
async function openForm() {
  fireEvent.click(screen.getByRole('button', { name: 'Adicionar revisão' }));
  await waitFor(() => expect(screen.getByRole('button', { name: 'Salvar revisão' })).toBeEnabled());
  fireEvent.change(screen.getByLabelText('Matéria da nova revisão'), { target: { value: topic.subject } });
  fireEvent.change(screen.getByLabelText('Tópico da nova revisão'), { target: { value: topic.id } });
  fireEvent.change(screen.getByLabelText('Data da nova revisão'), { target: { value: '2099-01-01' } });
}
describe('adição manual de revisão', () => {
  it('salva o recorte escolhido e mostra na fila sem registrar domínio', async () => {
    const onReview = vi.fn();
    mocks.uid = 'user-a';
    render(<ManualReviewsPanel questions={[]} loading={false} onCommitted={vi.fn()} onReview={onReview} />);
    await openForm();
    fireEvent.change(screen.getByLabelText('Capítulo da nova revisão'), { target: { value: supportedChapter } });
    fireEvent.change(screen.getByLabelText('Banca da nova revisão'), { target: { value: 'Fuvest' } });
    fireEvent.click(screen.getByRole('button', { name: 'Salvar revisão' }));
    await screen.findByText('Revisão adicionada.');
    expect(mocks.save).toHaveBeenCalledWith('user-a', expect.objectContaining({ topicId: topic.id, chapter: supportedChapter, date: '2099-01-01', board: 'Fuvest', status: 'scheduled' }));
    expect(screen.getByRole('heading', { name: topic.name })).toBeInTheDocument();
    expect(onReview).not.toHaveBeenCalled();
  });
  it('preserva os campos se salvar falhar e permite tentar novamente', async () => {
    mocks.save.mockRejectedValueOnce(new Error('offline'));
    render(<ManualReviewsPanel questions={[]} loading={false} onCommitted={vi.fn()} onReview={vi.fn()} />);
    await openForm(); fireEvent.click(screen.getByRole('button', { name: 'Salvar revisão' }));
    await screen.findByRole('alert');
    expect(screen.getByLabelText('Tópico da nova revisão')).toHaveValue(topic.id);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar revisão' }));
    await screen.findByText('Revisão adicionada.');
  });
  it('bloqueia duplicação e datas passadas', async () => {
    mocks.get.mockResolvedValue([item]);
    render(<ManualReviewsPanel questions={[]} loading={false} onCommitted={vi.fn()} onReview={vi.fn()} />);
    await openForm(); fireEvent.click(screen.getByRole('button', { name: 'Salvar revisão' }));
    await screen.findByText('Esta revisão já está agendada para essa data.');
    fireEvent.change(screen.getByLabelText('Data da nova revisão'), { target: { value: '2000-01-01' } });
    fireEvent.submit(screen.getByRole('button', { name: 'Salvar revisão' }).closest('form')!);
    await screen.findByText('Escolha matéria, tópico e uma data a partir de hoje.');
    expect(mocks.save).not.toHaveBeenCalled();
  });
  it('isola a conta e ignora carregamento atrasado da conta anterior', async () => {
    let resolveOld!: (items: typeof item[]) => void;
    mocks.uid = 'a'; mocks.get.mockImplementationOnce(() => new Promise(resolve => { resolveOld = resolve; }));
    const { rerender } = render(<ManualReviewsPanel questions={[]} loading={false} onCommitted={vi.fn()} onReview={vi.fn()} />);
    mocks.uid = 'b'; rerender(<ManualReviewsPanel questions={[]} loading={false} onCommitted={vi.fn()} onReview={vi.fn()} />);
    await screen.findByText('Você ainda não tem revisões manuais pendentes.');
    resolveOld([item]);
    await waitFor(() => expect(screen.queryByRole('heading', { name: topic.name })).toBeNull());
    expect(mocks.get).toHaveBeenCalledWith('b');
  });
  it('retenta conclusão sem registrar domínio duas vezes se salvar o agendamento falhar', async () => {
    mocks.uid = 'a'; mocks.get.mockResolvedValue([item]); mocks.complete.mockRejectedValueOnce(new Error('offline'));
    const onReview = vi.fn().mockResolvedValue(true);
    render(<ManualReviewsPanel questions={[]} loading={false} onCommitted={vi.fn()} onReview={onReview} />);
    fireEvent.click(await screen.findByRole('button', { name: 'Abrir revisão' }));
    fireEvent.click(screen.getByText('Completar treino de teste'));
    await waitFor(() => expect(mocks.complete).toHaveBeenCalledTimes(1));
    fireEvent.click(screen.getByText('Completar treino de teste'));
    await screen.findByText('Revisão concluída e próximo intervalo atualizado.');
    expect(onReview).not.toHaveBeenCalled();
    expect(mocks.complete).toHaveBeenLastCalledWith('a', item.id, 'forte');
  });
});

it('a conclusão atrasada de uma revisão não fecha o treino de outra', async () => {
  mocks.uid = 'a'; mocks.get.mockResolvedValue([item, { ...item, id: 'manual2' }]);
  let resolve!: (value: []) => void;
  mocks.complete.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
  render(<ManualReviewsPanel questions={[]} loading={false} onCommitted={vi.fn()} onReview={vi.fn()} />);
  await screen.findAllByRole('button', { name: 'Abrir revisão' });
  fireEvent.click(screen.getAllByRole('button', { name: 'Abrir revisão' })[0]);
  fireEvent.click(screen.getByText('Completar treino de teste'));
  fireEvent.click(screen.getByRole('button', { name: 'Abrir revisão' }));
  resolve([]);
  await screen.findByText('Revisão concluída e próximo intervalo atualizado.');
  expect(screen.getByText('Completar treino de teste')).toBeInTheDocument();
});
