
import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { buildVisualMap } from '../lib/visualStudy';
import type { RetrievalAttempt, SummaryProgress, SummaryProgressMap } from '../types/summary';
import Visual from './Visual';

const capitulo = interactiveSummaries.find(
  (item) => item.id === 'summary-fisica-primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares',
)!;
const mapa = buildVisualMap(capitulo);
const rota = '/visual?summary=' + capitulo.id;
const semPrancha = interactiveSummaries.find((item) => item.subject !== 'Física')!;

let progress: SummaryProgressMap = {};
const update = vi.fn();

vi.mock('../hooks/useSummaryProgress', () => ({
  useSummaryProgress: () => ({ progress, update, loading: false, syncError: null, isCloudSynced: false }),
}));

function comProgresso(answers: RetrievalAttempt[]): SummaryProgress {
  return {
    readSectionIds: capitulo.sections.map((section) => section.id),
    status: 'em-revisao',
    important: false,
    answers,
  };
}

function tentativa(matched: string[], missing: string | null): RetrievalAttempt {
  return {
    questionId: capitulo.retrieval[0].id,
    answer: '…',
    matchedElements: matched,
    firstMissingElement: missing,
    date: '2026-09-13',
  };
}

beforeEach(() => {
  progress = {};
  update.mockClear();
});

describe('Visual aprovado', () => {
  it('mantém a prancha ilustrada como centro da experiência', () => {
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    expect(screen.getByTestId('visual-study-board')).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Transformação adiabática' })).toBeInTheDocument();
    expect(screen.getByText('Prancha ilustrada')).toBeInTheDocument();
    expect(screen.getByText('Q = 0')).toBeInTheDocument();
    expect(screen.queryByText('Mapa de relações')).not.toBeInTheDocument();
  });

  it('mantém os três modos com logística estável', () => {
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    const modos = screen.getByRole('tablist', { name: 'Modo de estudo' });
    expect(within(modos).getByRole('tab', { name: 'Explorar' })).toBeInTheDocument();
    expect(within(modos).getByRole('tab', { name: 'Testar' })).toBeInTheDocument();
    expect(within(modos).getByRole('tab', { name: 'Reconstruir' })).toBeInTheDocument();
  });

  it('abre e fecha o inspetor contextual sem cobrir permanentemente a prancha', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    const card = screen.getByText('Expansão adiabática').closest('button');
    expect(card).not.toBeNull();
    await user.click(card!);

    expect(screen.getByRole('dialog', { name: 'Conceito selecionado' })).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Fechar inspetor' }));
    expect(screen.queryByRole('dialog', { name: 'Conceito selecionado' })).not.toBeInTheDocument();
  });

  it('fecha o inspetor ao mudar de modo', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    await user.click(screen.getByText('Compressão adiabática').closest('button')!);
    expect(screen.getByRole('dialog', { name: 'Conceito selecionado' })).toBeInTheDocument();

    await user.click(screen.getByRole('tab', { name: 'Testar' }));
    expect(screen.queryByRole('dialog', { name: 'Conceito selecionado' })).not.toBeInTheDocument();
    expect(screen.getByRole('heading', { name: 'Recuperação sem consulta' })).toBeInTheDocument();
  });

  it('usa a mesma evidência da recuperação ativa no modo Testar', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    await user.click(screen.getByRole('tab', { name: 'Testar' }));
    const enviar = screen.getByRole('button', { name: /Enviar para correção/ });
    expect(enviar).toBeDisabled();

    await user.type(screen.getByLabelText('Sua resposta'), capitulo.retrieval[0].expectedElements[0].keywords[0]);
    await user.click(enviar);

    expect(update).toHaveBeenCalledWith(capitulo.id, expect.any(Function));
    expect(screen.getByText(/Você preservou:/)).toBeInTheDocument();
  });

  it('prioriza relações frágeis no modo Reconstruir', async () => {
    const user = userEvent.setup();
    progress = {
      [capitulo.id]: comProgresso([
        tentativa([mapa.relations[0].label], mapa.relations[1].label),
      ]),
    };
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    await user.click(screen.getByRole('tab', { name: 'Reconstruir' }));
    expect(screen.getByRole('heading', { name: 'Reconstrução ativa' })).toBeInTheDocument();
    expect(screen.getByText(/relações em que suas evidências são mais frágeis/)).toBeInTheDocument();
  });

  it('não reaproveita a prancha de Termodinâmica em capítulos sem material autoral', () => {
    render(
      <MemoryRouter initialEntries={['/visual?summary=' + semPrancha.id]}>
        <Visual />
      </MemoryRouter>,
    );

    expect(screen.getByRole('status')).toHaveTextContent(/ainda não possui uma prancha visual própria/i);
    expect(screen.queryByTestId('visual-study-board')).not.toBeInTheDocument();
    expect(screen.queryByText('Transformação adiabática')).not.toBeInTheDocument();
  });

  it('continua distinguindo hipótese de fato no inspetor', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    await user.click(screen.getByText('Expansão adiabática').closest('button')!);
    const dialog = screen.getByRole('dialog', { name: 'Conceito selecionado' });
    expect(within(dialog).getAllByText(/hipótese, não fato/i).length).toBeGreaterThan(0);
  });
});
