import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import Redacao from './Redacao';
const mocks = vi.hoisted(() => ({ request: vi.fn(), uid: null as string | null }));
vi.mock('../lib/aiClient', () => ({ requestAiText: mocks.request, aiErrorMessage: () => 'Não foi possível corrigir.' }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: mocks.uid ? { uid: mocks.uid } : null }) }));
const correction = (rupture: string) => ({ text: JSON.stringify({ acertos: 'O recorte foi atendido.', rupturaPoint: rupture, porque: 'Falta explicar a ligação.', correcaoMinima: 'Explique o mecanismo.', respostaModelo: 'Exemplo autoral para comparação.' }) });
function fillDraft() {
  fireEvent.change(screen.getByLabelText('Tema da redação'), { target: { value: 'Acesso à leitura' } });
  fireEvent.change(screen.getByLabelText('Primeira versão da redação'), { target: { value: 'Texto original de treino.' } });
}
beforeEach(() => { localStorage.clear(); mocks.uid = null; mocks.request.mockReset().mockResolvedValue(correction('Ruptura original')); });
describe('redação aprofundada', () => {
  it('envia gênero, proposta e plano e reavalia a reescrita com a versão original', async () => {
    mocks.request.mockResolvedValueOnce(correction('Ruptura original')).mockResolvedValueOnce(correction('Ajuste da reescrita'));
    render(<Redacao />); fillDraft();
    fireEvent.change(screen.getByLabelText('Banca da redação'), { target: { value: 'Unicamp' } });
    fireEvent.change(screen.getByLabelText('Gênero solicitado'), { target: { value: 'Carta' } });
    fireEvent.change(screen.getByLabelText('Proposta e informações da coletânea'), { target: { value: 'Escreva uma carta à direção solicitando um horário.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Corrigir com IA' }));
    await screen.findByText('Ruptura original');
    expect(mocks.request).toHaveBeenCalledWith('answer-correction', expect.objectContaining({ board: 'Unicamp', question: expect.stringContaining('Gênero solicitado: Carta'), studentAnswer: 'Texto original de treino.' }));
    fireEvent.change(screen.getByLabelText('Reescrita da redação'), { target: { value: 'Texto reescrito com mecanismo explicado.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Reavaliar reescrita' }));
    await screen.findByText(/Ajuste da reescrita/);
    expect(mocks.request.mock.calls[1][1].question).toContain('Texto original de treino.');
    expect(mocks.request.mock.calls[1][1].question).toContain('Ruptura original');
  });
  it('descarta retorno de IA quando o contexto muda', async () => {
    let resolve!: (value: { text: string }) => void;
    mocks.request.mockImplementationOnce(() => new Promise(done => { resolve = done; }));
    render(<Redacao />); fillDraft(); fireEvent.click(screen.getByRole('button', { name: 'Corrigir com IA' }));
    fireEvent.change(screen.getByLabelText('Banca da redação'), { target: { value: 'Fuvest' } });
    resolve(correction('Retorno obsoleto'));
    await waitFor(() => expect(screen.getByRole('button', { name: 'Corrigir com IA' })).toBeEnabled());
    expect(screen.queryByText('Retorno obsoleto')).toBeNull();
  });
  it('salva o texto atual antes de restaurar e mantém reescrita visível após recarga', () => {
    localStorage.setItem('juju-essay-rewrite', 'Reescrita salva de treino.');
    const { unmount } = render(<Redacao />); fillDraft();
    expect(screen.getByLabelText('Reescrita da redação')).toHaveValue('Reescrita salva de treino.');
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }));
    fireEvent.change(screen.getByLabelText('Primeira versão da redação'), { target: { value: 'Texto modificado sem salvar.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Restaurar versão' }));
    expect(screen.getByLabelText('Primeira versão da redação')).toHaveValue('Texto original de treino.');
    const history = JSON.parse(localStorage.getItem('crivo_essay_versions_v1:demo')!);
    expect(history.some((item: { draft: string }) => item.draft === 'Texto modificado sem salvar.')).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }));
    unmount(); render(<Redacao />);
    expect(screen.getByLabelText('Reescrita da redação')).toHaveValue('Reescrita salva de treino.');
  });
  it('não marca checklist antes de escrever evidência e limpa quando texto muda', () => {
    render(<Redacao />); fillDraft(); fireEvent.click(screen.getByRole('button', { name: 'Checklist de Revisão' }));
    const check = screen.getByLabelText('Conferi Tema, tarefa e gênero');
    expect(check).toBeDisabled();
    fireEvent.change(screen.getByLabelText(/Evidência de Tema, tarefa e gênero/), { target: { value: 'Meu trecho responde ao recorte porque...' } });
    fireEvent.click(check); expect(check).toBeChecked();
    fireEvent.click(screen.getByRole('button', { name: 'Escrever e Reescrever' }));
    fireEvent.change(screen.getByLabelText('Primeira versão da redação'), { target: { value: 'Outra versão.' } });
    fireEvent.click(screen.getByRole('button', { name: 'Checklist de Revisão' }));
    expect(screen.getByLabelText('Conferi Tema, tarefa e gênero')).not.toBeChecked();
  });
  it('exige tentativa antes do exemplo e reinicia treino ao mudar a habilidade', () => {
    render(<Redacao />);
    const button = screen.getByRole('button', { name: 'Conferir critérios e exemplo' });
    expect(button).toBeDisabled();
    fireEvent.change(screen.getByLabelText('Minha resposta sem consultar'), { target: { value: 'Minha tese delimitada.' } });
    fireEvent.click(button);
    expect(screen.getByText(/Uma possibilidade:/)).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText('Habilidade para treinar'), { target: { value: 'coesao' } });
    expect(screen.getByLabelText('Minha resposta sem consultar')).toHaveValue('');
    expect(screen.getByRole('button', { name: 'Conferir critérios e exemplo' })).toBeDisabled();
  });
});

it('preserva banca e gênero ao reabrir e mantém textos e histórico separados por conta', () => {
  mocks.uid = 'a';
  const { unmount } = render(<Redacao />); fillDraft();
  fireEvent.change(screen.getByLabelText('Banca da redação'), { target: { value: 'Unicamp' } });
  fireEvent.change(screen.getByLabelText('Gênero solicitado'), { target: { value: 'Carta' } });
  fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }));
  unmount(); const { rerender } = render(<Redacao />);
  expect(screen.getByLabelText('Banca da redação')).toHaveValue('Unicamp');
  expect(screen.getByLabelText('Gênero solicitado')).toHaveValue('Carta');
  expect(screen.getByLabelText('Primeira versão da redação')).toHaveValue('Texto original de treino.');
  mocks.uid = 'b'; rerender(<Redacao />);
  expect(screen.getByLabelText('Primeira versão da redação')).toHaveValue('');
  expect(screen.queryByText(/Versões salvas neste navegador/)).toBeNull();
});
it('rascunho legado só é importado para uma conta por ação explícita, mantendo as chaves antigas', () => {
  localStorage.setItem('juju-essay-draft', 'Rascunho legado de treino.');
  mocks.uid = 'a'; render(<Redacao />);
  expect(screen.getByLabelText('Primeira versão da redação')).toHaveValue('');
  fireEvent.click(screen.getByRole('button', { name: 'Importar meu rascunho anterior' }));
  expect(screen.getByLabelText('Primeira versão da redação')).toHaveValue('Rascunho legado de treino.');
  fireEvent.click(screen.getByRole('button', { name: 'Salvar rascunho' }));
  expect(localStorage.getItem('juju-essay-draft')).toBe('Rascunho legado de treino.');
});

it('importar legado preserva a redação aberta em uma versão antes da substituição', () => {
  localStorage.setItem('juju-essay-draft', 'Texto anterior não associado.');
  mocks.uid = 'a'; render(<Redacao />); fillDraft();
  fireEvent.click(screen.getByRole('button', { name: 'Importar meu rascunho anterior' }));
  expect(screen.getByLabelText('Primeira versão da redação')).toHaveValue('Texto anterior não associado.');
  const versions = JSON.parse(localStorage.getItem('crivo_essay_versions_v1:a')!);
  expect(versions.some((item: { draft: string }) => item.draft === 'Texto original de treino.')).toBe(true);
});
