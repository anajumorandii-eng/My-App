import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, expect, it, vi } from 'vitest';
import Aprofundamentos, { SavedReviewSummaries } from './Aprofundamentos';
import { cacheStrategyGuides, strategyGuideUrl, type StrategyGuide } from '../lib/strategyGuides';
import { printStrategyGuide } from '../lib/printStrategyGuide';

const mocks = vi.hoisted(() => ({ uid: null as string | null, load: vi.fn() }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: mocks.uid ? { uid: mocks.uid } : null }) }));
vi.mock('../lib/strategyGuides', async () => ({ ...await vi.importActual('../lib/strategyGuides'), loadStrategyGuides: mocks.load }));
vi.mock('../lib/printStrategyGuide', () => ({ printStrategyGuide: vi.fn() }));
const guide = (i: number): StrategyGuide => ({ key: JSON.stringify(['Matemática', 'mat_aritmetica', `Capítulo ${i}`, 'UNICAMP']), subject: 'Matemática', topicId: 'mat_aritmetica', topicName: 'Aritmética', chapter: `Capítulo ${i}`, board: 'UNICAMP', text: `Explicação preservada número ${i}.`, savedAt: new Date(Date.UTC(2026, 9, 17, 12, i)).toISOString() });
const collection = (...items: StrategyGuide[]) => Object.fromEntries(items.map(item => [item.key, item]));
beforeEach(() => { localStorage.clear(); mocks.uid = null; mocks.load.mockReset().mockResolvedValue({}); vi.mocked(printStrategyGuide).mockClear(); });
const open = (path = '/aprofundamentos') => render(<MemoryRouter initialEntries={[path]}><Aprofundamentos /></MemoryRouter>);

it('exclui pelo leitor após confirmação, volta à biblioteca e preserva outros guias e progresso', async () => {
  cacheStrategyGuides(null, collection(guide(0), guide(1)));
  localStorage.setItem('juju_summary_progress_v1', 'progresso preservado');
  open(strategyGuideUrl(guide(0)));
  fireEvent.click(screen.getByRole('button', { name: 'Excluir material: Capítulo 0' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
  await waitFor(() => expect(screen.getByRole('searchbox')).toBeInTheDocument());
  expect(screen.getAllByRole('link', { name: /Abrir aprofundamento:/ })).toHaveLength(1);
  expect(screen.getByRole('link', { name: /Abrir aprofundamento:/ })).toHaveTextContent('Capítulo 1');
  expect(localStorage.getItem('juju_summary_progress_v1')).toBe('progresso preservado');
});

it('organiza os guias antigos em páginas e abre um leitor separado sem modificar o armazenamento', async () => {
  cacheStrategyGuides(null, collection(...Array.from({ length: 27 }, (_, i) => guide(i))));
  const before = localStorage.getItem('crivo:strategy-guides:v1:guest');
  open();
  expect(screen.getAllByRole('link', { name: /Abrir aprofundamento:/ })).toHaveLength(12);
  expect(screen.getByRole('status')).toHaveTextContent('27 guias encontrados');
  fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
  expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
  fireEvent.click(screen.getAllByRole('link', { name: /Abrir aprofundamento:/ })[0]);
  expect(screen.getByText('Explicação preservada número 14.')).toBeInTheDocument();
  expect(screen.queryByRole('searchbox')).toBeNull();
  fireEvent.click(screen.getByRole('button', { name: 'Imprimir / Salvar em PDF' }));
  expect(printStrategyGuide).toHaveBeenCalledWith(expect.any(HTMLElement), expect.stringContaining('Capítulo 14'));
  fireEvent.click(screen.getByRole('link', { name: 'Voltar à biblioteca de aprofundamentos' }));
  expect(screen.getByText('Página 2 de 3')).toBeInTheDocument();
  expect(localStorage.getItem('crivo:strategy-guides:v1:guest')).toBe(before);
});

it('combina busca sem acentos, matéria e banca e mantém o filtro ao voltar da leitura', () => {
  const chemical = { ...guide(2), key: 'quimica', subject: 'Química', chapter: 'Equilíbrio químico', board: 'FUVEST' };
  cacheStrategyGuides(null, collection(guide(0), chemical));
  open();
  fireEvent.change(screen.getByLabelText('Buscar nos aprofundamentos'), { target: { value: 'equilibrio' } });
  fireEvent.change(screen.getByLabelText('Matéria'), { target: { value: 'Química' } });
  fireEvent.change(screen.getByLabelText('Banca'), { target: { value: 'FUVEST' } });
  expect(screen.getAllByRole('link', { name: /Abrir aprofundamento:/ })).toHaveLength(1);
  fireEvent.click(screen.getByRole('link', { name: /Abrir aprofundamento:/ }));
  fireEvent.click(screen.getByRole('link', { name: 'Voltar à biblioteca de aprofundamentos' }));
  expect(screen.getByRole('searchbox')).toHaveValue('equilibrio');
  expect(screen.getByLabelText('Matéria')).toHaveValue('Química');
  fireEvent.click(screen.getByRole('button', { name: 'Limpar filtros' }));
  expect(screen.getAllByRole('link', { name: /Abrir aprofundamento:/ })).toHaveLength(2);
});

it('recebe um guia concluído em outra atividade sem exigir recarregar', () => {
  open();
  expect(screen.getByText('Sua biblioteca ainda não tem aprofundamentos')).toBeInTheDocument();
  act(() => cacheStrategyGuides(null, collection(guide(1))));
  expect(screen.getByRole('link', { name: /Abrir aprofundamento:/ })).toBeInTheDocument();
});

it('o filtro de banca reúne grafias antigas e inclui guias multibanca com essa origem', () => {
  cacheStrategyGuides(null, collection({ ...guide(1), board: 'Unicamp' }, { ...guide(2), board: 'COMVEST' }, { ...guide(3), board: 'Todas as bancas', targetBoards: ['UNICAMP', 'FUVEST'] }, { ...guide(4), board: 'UNESP' }));
  open();
  fireEvent.change(screen.getByLabelText('Banca'), { target: { value: 'UNICAMP' } });
  expect(screen.getAllByRole('link', { name: /Abrir aprofundamento:/ })).toHaveLength(3);
});

it('recupera a conta sem substituir uma cópia local mais recente nem revelar os dados de outra conta', async () => {
  mocks.uid = 'A';
  cacheStrategyGuides('A', collection(guide(2)));
  mocks.load.mockResolvedValueOnce(collection(guide(1), { ...guide(2), text: 'Versão antiga.', savedAt: '2026-01-01T00:00:00Z' }));
  const first = open(strategyGuideUrl(guide(2)));
  await waitFor(() => expect(mocks.load).toHaveBeenCalledWith('A'));
  expect(screen.getByText('Explicação preservada número 2.')).toBeInTheDocument();
  expect(screen.queryByText('Versão antiga.')).toBeNull();
  mocks.uid = 'B'; first.rerender(<MemoryRouter><Aprofundamentos /></MemoryRouter>);
  await screen.findByText('Guia não encontrado nas cópias disponíveis');
  expect(screen.queryByText('Explicação preservada número 2.')).toBeNull();
});

it('um link inválido não impede voltar à biblioteca e uma falha da conta mantém as cópias locais', async () => {
  mocks.uid = 'offline'; mocks.load.mockRejectedValue(Error('offline'));
  cacheStrategyGuides('offline', collection(guide(1)));
  open('/aprofundamentos?guia=constructor');
  await screen.findByRole('alert');
  expect(screen.getByText('Guia não encontrado nas cópias disponíveis')).toBeInTheDocument();
  fireEvent.click(screen.getByRole('link', { name: 'Voltar à biblioteca de aprofundamentos' }));
  expect(screen.getByRole('link', { name: /Abrir aprofundamento:/ })).toBeInTheDocument();
});

it('retorna do guia literário à obra e à unidade que originaram o aprofundamento', () => {
  const literary = { ...guide(0), key: 'obra:maria', topicId: 'obra:olhos-dagua', topicName: 'Olhos d’água', chapter: 'Maria', subject: 'Literatura', workSlug: 'olhos-dagua', workUnitId: 'maria' };
  cacheStrategyGuides(null, collection(literary));
  open(strategyGuideUrl(literary));
  expect(screen.getByRole('link', { name: 'Voltar à estratégia deste tópico' })).toHaveAttribute('href', '/obras/olhos-dagua?aba=estrategias&unidade=maria');
});

it('preserva capítulos dos dois tópicos ao voltar do leitor combinado à estratégia', () => {
  const combined = { ...guide(0), key: 'combined', subject: 'Biologia', topicId: 'bio_ecologia', topicName: 'Ecologia + Evolução', chapter: '', selections: [{ topicId: 'bio_ecologia', topicName: 'Ecologia', chapter: 'Dinâmica de Populações' }, { topicId: 'bio_evolucao', topicName: 'Evolução', chapter: 'Mecanismos da Evolução Biológica' }] };
  cacheStrategyGuides(null, collection(combined));open(strategyGuideUrl(combined));
  const url = new URL(screen.getByRole('link', { name: 'Voltar à estratégia deste tópico' }).getAttribute('href')!, 'http://localhost');
  expect(url.searchParams.get('chapter')).toBe('Dinâmica de Populações');
  expect(JSON.parse(url.searchParams.get('topics')!)).toEqual([combined.selections[1]]);
  expect(screen.getByText(/Recortes: Ecologia: Dinâmica de Populações/)).toBeInTheDocument();
});

it('mantém os resumos de revisão na biblioteca própria sem apagar os aprofundamentos', () => {
  const summary: StrategyGuide = { ...guide(1), key: 'review-summary:1', kind: 'review-summary', topicName: 'Resumo para FUVEST' };
  cacheStrategyGuides(null, collection(guide(0), summary));
  open();
  expect(screen.getAllByRole('link', { name: /Abrir aprofundamento:/ })).toHaveLength(1);
  expect(screen.queryByText('Resumo para FUVEST')).toBeNull();
  expect(localStorage.getItem('crivo:strategy-guides:v1:guest')).toContain('review-summary:1');
});

const reviewGuide = (i: number): StrategyGuide => ({ ...guide(i), key: `review-${i}`, kind: 'review-summary', topicName: 'Geometria Plana', chapter: `Revisão ${i}`, selections: [{ topicId: 'mat_geometria_plana', topicName: 'Geometria Plana', chapter: '', cuts: ['Ângulos na circunferência'] }] });
const openReviews = (path = '/meus-resumos-revisao') => render(<MemoryRouter initialEntries={[path]}><SavedReviewSummaries /></MemoryRouter>);
it('biblioteca de revisões tem leitura própria e preserva busca e recortes ao voltar', () => {
  cacheStrategyGuides(null, collection(guide(0), reviewGuide(1), reviewGuide(2)));
  const before = localStorage.getItem('crivo:strategy-guides:v1:guest');
  openReviews();
  expect(screen.getByRole('heading', { name: 'Meus resumos de revisão' })).toBeInTheDocument();
  expect(screen.queryByRole('link', { name: /Abrir aprofundamento:/ })).toBeNull();
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'angulos circunferencia' } });
  expect(screen.getAllByRole('link', { name: /Abrir resumo de revisão:/ })).toHaveLength(2);
  fireEvent.click(screen.getAllByRole('link', { name: /Abrir resumo de revisão:/ })[0]);
  expect(screen.getByText('Explicação preservada número 2.')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Editar configurações desta revisão' })).toHaveAttribute('href', '/resumos-revisao?guia=review-2');
  fireEvent.click(screen.getByRole('button', { name: 'Imprimir / Salvar em PDF' }));
  expect(printStrategyGuide).toHaveBeenCalledWith(expect.any(HTMLElement), expect.stringContaining('Revisão —'));
  fireEvent.click(screen.getByRole('link', { name: 'Voltar à biblioteca de resumos de revisão' }));
  expect(screen.getByRole('searchbox')).toHaveValue('angulos circunferencia');
  expect(localStorage.getItem('crivo:strategy-guides:v1:guest')).toBe(before);
});
it('biblioteca de revisões pagina, exclui apenas a seleção e mostra um estado vazio útil', async () => {
  cacheStrategyGuides(null, collection(guide(0), ...Array.from({ length: 13 }, (_, i) => reviewGuide(i))));
  openReviews();
  expect(screen.getAllByRole('link', { name: /Abrir resumo de revisão:/ })).toHaveLength(12);
  fireEvent.click(screen.getByRole('button', { name: 'Próxima' }));
  fireEvent.click(screen.getByRole('link', { name: /Abrir resumo de revisão:/ }));
  fireEvent.click(screen.getByRole('button', { name: 'Excluir material: Revisão 0' }));
  fireEvent.click(screen.getByRole('button', { name: 'Confirmar exclusão' }));
  await waitFor(() => expect(screen.getAllByRole('link', { name: /Abrir resumo de revisão:/ })).toHaveLength(12));
  expect(localStorage.getItem('crivo:strategy-guides:v1:guest')).toContain('Explicação preservada número 0.');
});
it('links entre bibliotecas não abrem materiais do tipo errado', () => {
  cacheStrategyGuides(null, collection(guide(0)));
  openReviews(`/meus-resumos-revisao?${new URLSearchParams({ guia: guide(0).key })}`);
  expect(screen.getByText('Guia não encontrado nas cópias disponíveis')).toBeInTheDocument();
  expect(screen.queryByText('Explicação preservada número 0.')).toBeNull();
  fireEvent.click(screen.getByRole('link', { name: 'Voltar à biblioteca de resumos de revisão' }));
  expect(screen.getByText('Sua biblioteca ainda não tem resumos de revisão')).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Criar resumo de revisão' })).toHaveAttribute('href', '/resumos-revisao');
});
