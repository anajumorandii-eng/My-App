import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, expect, it, vi } from 'vitest';
import Flashcards from './Flashcards';
import type { Flashcard } from '../types';

const state = vi.hoisted(() => ({ reviews: {} as Record<string, unknown>, currentOwnerUid: null as string | null }));
vi.mock('../hooks/useFlashcardReviews', () => ({ useFlashcardReviews: () => ({
  ...state, recordReview: vi.fn(), hydrationStatus: 'ready', hydratedOwnerUid: state.currentOwnerUid,
  isReadyForStudy: true, retryHydration: vi.fn(), isPersisted: false, syncError: null,
}) }));
vi.mock('../components/FlashcardSession', () => ({ default: ({ cards, onExit }: any) => <div>
  <p>Cartões da sessão: {cards.map((card: any) => card.id).join(',')}</p><button onClick={onExit}>Sair da sessão</button>
</div> }));
const card = (id: string, topicId: string, tags: string[], chapter = 'Capítulo comum'): Flashcard => ({
  id, topicId, tags, chapter, subject: 'Biologia', front: id, back: 'Resposta', source: 'sistema_priorizado',
});
const cards = [
  card('cell-fuvest', 'bio_estrutura_fisio_celular', ['fuvest']),
  card('gen-enem', 'bio_genetica', ['10_enem_contexto_e_habilidade']),
  card('gen-both', 'bio_genetica', ['fuvest', 'enem']),
  card('eco-unicamp', 'bio_ecologia', ['comvest']),
  card('generic', 'bio_ecologia', []),
];
beforeEach(() => {
  state.reviews = {}; state.currentOwnerUid = null;
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => cards });
});

it('reúne dois tópicos e duas bancas numa sessão, sem duplicar cartão multibanca', async () => {
  state.reviews = { 'gen-enem': { cardId: 'gen-enem', dueDate: '2099-01-01T00:00:00Z' } };
  const user = userEvent.setup(); render(<Flashcards />);
  await user.click(screen.getByRole('button', { name: 'Biologia' }));
  await screen.findByRole('group', { name: 'Tópicos' });
  await user.click(screen.getByRole('checkbox', { name: /^Estrutura e Fisiologia Celular/ }));
  await user.click(screen.getByRole('checkbox', { name: /^Genética/ }));
  await user.click(screen.getByRole('checkbox', { name: 'FUVEST' }));
  await user.click(screen.getByRole('checkbox', { name: 'ENEM' }));
  expect(screen.getByRole('status')).toHaveTextContent('3 cartões · 2 vencidos');
  await user.click(screen.getByRole('button', { name: 'Revisar todos os vencidos da seleção' }));
  expect(screen.getByText('Cartões da sessão: cell-fuvest,gen-both')).toBeInTheDocument();
  await user.click(screen.getByRole('button', { name: 'Sair da sessão' }));
  expect(screen.getByRole('checkbox', { name: 'ENEM' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: /^Genética/ })).toBeChecked();
});

it('permite desfazer filtro vazio e usar Todos sem perder cartões sem banca', async () => {
  const user = userEvent.setup(); render(<Flashcards />);
  await user.click(screen.getByRole('button', { name: 'Biologia' }));
  await user.click(await screen.findByRole('checkbox', { name: /^Estrutura e Fisiologia Celular/ }));
  await user.click(screen.getByRole('checkbox', { name: 'ENEM' }));
  expect(screen.getByRole('status')).toHaveTextContent('0 cartões');
  expect(screen.getByRole('button', { name: 'Revisar todos os vencidos da seleção' })).toBeDisabled();
  await user.click(screen.getByRole('checkbox', { name: /^Estrutura e Fisiologia Celular/ }));
  expect(screen.getByRole('status')).toHaveTextContent('2 cartões');
  await user.click(screen.getByRole('checkbox', { name: 'Todas as bancas' }));
  expect(screen.getByRole('status')).toHaveTextContent('5 cartões');
});

it('aplica a união também na sessão por subtópico, prioridade e tipo de treino', async () => {
  const user = userEvent.setup(); render(<Flashcards />);
  await user.click(screen.getByRole('button', { name: 'Biologia' }));
  await user.click(await screen.findByRole('checkbox', { name: /^Estrutura e Fisiologia Celular/ }));
  await user.click(screen.getByRole('checkbox', { name: /^Genética/ }));
  await user.click(screen.getByRole('button', { name: 'Escolher subtópico ou prioridade' }));
  await user.click(screen.getByRole('button', { name: /Capítulo comum/ }));
  await user.click(screen.getByRole('button', { name: 'Escolher prioridade' }));
  await user.click(screen.getByRole('button', { name: /^Regular/ }));
  await user.click(screen.getByRole('button', { name: /^Objetivos/ }));
  expect(screen.getByText('Cartões da sessão: cell-fuvest,gen-enem,gen-both')).toBeInTheDocument();
});

it('limpa a seleção ao trocar de matéria', async () => {
  const user = userEvent.setup(); render(<Flashcards />);
  await user.click(screen.getByRole('button', { name: 'Biologia' }));
  await user.click(await screen.findByRole('checkbox', { name: 'ENEM' }));
  await user.click(screen.getByRole('button', { name: 'Voltar' }));
  await user.click(screen.getByRole('button', { name: 'Química' }));
  expect(await screen.findByRole('checkbox', { name: 'Todas as bancas' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Todos os tópicos' })).toBeChecked();
});

it('as contagens de prioridade respeitam o subtópico selecionado entre vários tópicos', async () => {
  global.fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => [
    card('a', 'bio_estrutura_fisio_celular', [], 'Membranas'),
    card('b', 'bio_genetica', [], 'Herança'),
    card('c', 'bio_genetica', [], 'Herança'),
  ] });
  const user = userEvent.setup(); render(<Flashcards />);
  await user.click(screen.getByRole('button', { name: 'Biologia' }));
  await user.click(await screen.findByRole('checkbox', { name: /^Estrutura e Fisiologia Celular/ }));
  await user.click(screen.getByRole('checkbox', { name: /^Genética/ }));
  await user.click(screen.getByRole('button', { name: 'Escolher subtópico ou prioridade' }));
  await user.click(screen.getByRole('button', { name: /^Membranas/ }));
  await user.click(screen.getByRole('button', { name: 'Escolher prioridade' }));
  expect(screen.getByRole('button', { name: /^Regular/ })).toHaveTextContent('1 cartões');
});

it('limpa o recorte e a sessão ao trocar de conta', async () => {
  state.currentOwnerUid = 'owner-a';
  const user = userEvent.setup(); const view = render(<Flashcards />);
  await user.click(screen.getByRole('button', { name: 'Biologia' }));
  await user.click(await screen.findByRole('checkbox', { name: 'ENEM' }));
  await user.click(screen.getByRole('checkbox', { name: /^Genética/ }));
  state.currentOwnerUid = 'owner-b'; view.rerender(<Flashcards />);
  await user.click(await screen.findByRole('button', { name: 'Biologia' }));
  expect(await screen.findByRole('checkbox', { name: 'Todas as bancas' })).toBeChecked();
  expect(screen.getByRole('checkbox', { name: 'Todos os tópicos' })).toBeChecked();
});
