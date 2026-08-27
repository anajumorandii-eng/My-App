import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { deriveSummaryErrorEntries } from '../lib/summaryStudy';
import type { SummaryProgress } from '../types/summary';
import Resumos from './Resumos';

const update = vi.fn();
vi.mock('../hooks/useSummaryProgress', () => ({
  useSummaryProgress: () => ({ progress: {}, update, loading: false, syncError: null, isCloudSynced: false }),
}));

describe('restauração do contexto do resumo', () => {
  beforeEach(() => update.mockClear());

  it('abre diretamente a pergunta indicada na URL após recarregar', () => {
    render(<MemoryRouter initialEntries={['/resumos?summary=fis-termologia-calor&question=calor-r1']}><Resumos/></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Calor, temperatura/ })).toBeInTheDocument();
    expect(screen.getByText(/por que a temperatura não aumenta/i)).toBeInTheDocument();
    expect(screen.getByLabelText('Sua resposta')).toHaveAttribute('data-question-id', 'calor-r1');
  });

  it('mostra referência indisponível para URL antiga em vez de quebrar', () => {
    render(<MemoryRouter initialEntries={['/resumos?summary=removido&question=q-antiga']}><Resumos/></MemoryRouter>);
    expect(screen.getByRole('alert')).toHaveTextContent(/não está mais disponível/i);
    expect(screen.getByRole('button', { name: /Voltar à biblioteca/ })).toBeInTheDocument();
  });

  it('avisa quando apenas a pergunta foi removida e mantém o resumo acessível', () => {
    render(<MemoryRouter initialEntries={['/resumos?summary=fis-termologia-calor&question=q-removida']}><Resumos/></MemoryRouter>);
    expect(screen.getByRole('alert')).toHaveTextContent(/pergunta indicada não está mais disponível/i);
    expect(screen.getByRole('heading', { name: /Calor, temperatura/ })).toBeInTheDocument();
  });

  it('restaura filtros acionáveis do Painel de Evolução pela URL', () => {
    render(<MemoryRouter initialEntries={['/resumos?subject=Geografia&board=Unesp%2FVunesp&phase=segunda']}><Resumos/></MemoryRouter>);
    expect(screen.getByLabelText('Filtrar por disciplina')).toHaveValue('Geografia');
    expect(screen.getByLabelText('Filtrar por banca')).toHaveValue('Unesp/Vunesp');
    expect(screen.getByLabelText('Filtrar por fase')).toHaveValue('segunda');
    expect(screen.getByRole('heading', { name: 'Transição e bônus demográfico' })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /Calor, temperatura/ })).not.toBeInTheDocument();
  });

  it.each(['História', 'Língua Inglesa', 'Redação', 'Gramática', 'Literatura', 'Entendimento de Texto', 'Matemática', 'Química'])(
    'oferece e restaura o catálogo de %s',
    (subject) => {
      render(<MemoryRouter initialEntries={[`/resumos?subject=${encodeURIComponent(subject)}`]}><Resumos/></MemoryRouter>);
      expect(screen.getByLabelText('Filtrar por disciplina')).toHaveValue(subject);
      expect(screen.getAllByRole('heading', { level: 2 }).length).toBeGreaterThan(0);
    },
  );

  it('submete resposta parcial e produz a entrada derivada no caderno', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/resumos?summary=fis-termologia-calor&question=calor-r1']}><Resumos/></MemoryRouter>);
    await user.type(screen.getByLabelText('Sua resposta'), 'A temperatura fica constante.');
    await user.click(screen.getByRole('button', { name: 'Enviar para correção' }));
    const updater = update.mock.calls.at(-1)?.[1] as (progress: SummaryProgress) => SummaryProgress;
    const created = updater({ readSectionIds: [], status: 'nao-iniciado', important: false, answers: [] });
    const errors = deriveSummaryErrorEntries({ 'fis-termologia-calor': created }, interactiveSummaries);
    expect(errors).toHaveLength(1);
    expect(errors[0].outcome).toBe('parcial');
  });

  it('não cria erro quando a primeira resposta contém todos os mecanismos', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/resumos?summary=fis-termologia-calor&question=calor-r1']}><Resumos/></MemoryRouter>);
    await user.type(screen.getByLabelText('Sua resposta'), 'A temperatura constante caracteriza a mudança de fase, enquanto a energia reorganiza as interações.');
    await user.click(screen.getByRole('button', { name: 'Enviar para correção' }));
    const updater = update.mock.calls.at(-1)?.[1] as (progress: SummaryProgress) => SummaryProgress;
    const created = updater({ readSectionIds: [], status: 'nao-iniciado', important: false, answers: [] });
    expect(deriveSummaryErrorEntries({ 'fis-termologia-calor': created }, interactiveSummaries)).toHaveLength(0);
  });
});
