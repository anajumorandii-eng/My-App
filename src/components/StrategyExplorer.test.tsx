import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
const { generate } = vi.hoisted(() => ({ generate: vi.fn(async () => ({ text: 'Guia do tópico selecionado' })) }));
vi.mock('../lib/contentCatalog', () => ({ getLocalQuestionBank: async () => [] }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: generate }));
import StrategyExplorer from './StrategyExplorer';

describe('guia por matéria, tópico e banca', () => {
  it('seleciona currículo real, apresenta procedimento da matéria e envia recorte completo à IA', async () => {
    render(<StrategyExplorer />);
    fireEvent.change(screen.getByLabelText('Matéria do guia'), { target: { value: 'Química' } });
    fireEvent.change(screen.getByLabelText('Banca do guia'), { target: { value: 'Unicamp' } });
    expect(screen.getAllByText(/mol antes da proporção/i).length).toBeGreaterThan(0);
    fireEvent.click(screen.getByRole('button', { name: 'Aprofundar este tópico e sua cobrança' }));
    await waitFor(() => expect(generate).toHaveBeenCalledWith('review-tip', expect.objectContaining({ subject: 'Química', board: 'Unicamp', guideMode: 'strategy' }), expect.any(Function)));
    await screen.findByText('Guia do tópico selecionado');
    fireEvent.change(screen.getByLabelText('Banca do guia'), { target: { value: 'Fuvest' } });
    expect(screen.queryByText('Guia do tópico selecionado')).toBeNull();
  });
  it('Literatura e Redação usam os tópicos próprios sem oferecer os de gramática', () => {
    render(<StrategyExplorer />);
    fireEvent.change(screen.getByLabelText('Matéria do guia'), { target: { value: 'Redação' } });
    expect(screen.getByLabelText('Tópico do guia').textContent).toContain('Fundamentos da Dissertação');
    expect(screen.getByLabelText('Tópico do guia').textContent).not.toContain('Análise Sintática');
  });
});
