
import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { buildVisualMap } from '../lib/visualStudy';
import type { RetrievalAttempt, SummaryProgress, SummaryProgressMap } from '../types/summary';
import Visual from './Visual';
import { findBoard } from './visual-boards/registry';
import { findInstrument } from './visual-instruments/registry';

const capitulo = interactiveSummaries.find(
  (item) => item.id === 'summary-fisica-primeira-lei-da-termodinamica-aplicada-a-algumas-transformacoes-particulares',
)!;
const mapa = buildVisualMap(capitulo);
const rota = '/visual?summary=' + capitulo.id;
// Capítulo sem cena autoral E sem instrumento — o estado em que a tela tem de
// mostrar o aviso sem perder o resto de si.
const semPrancha = interactiveSummaries.find(
  (item) => !findBoard(item) && !findInstrument(item),
)!;
// Capítulo que o instrumento representa de fato: a parábola é o assunto dele.
const comInstrumento = interactiveSummaries.find((item) => item.topic === 'Função Quadrática')!;

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
    // Pelo texto, e não por getByRole('status'): a prancha tem sete live
    // regions e o papel sozinho não é mais único. Mas o closest() continua
    // exigindo que o retorno esteja dentro de uma delas — sem isso, remover o
    // role deixaria de anunciar o resultado e o teste seguiria verde.
    expect(screen.getByText(/Você preservou:/).closest('[role="status"]')).toBeInTheDocument();
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

    expect(screen.getByText(/não tem cena própria nem instrumento/i)).toBeInTheDocument();
    expect(screen.queryByTestId('visual-study-board')).not.toBeInTheDocument();
    expect(screen.queryByText('Transformação adiabática')).not.toBeInTheDocument();
  });

  it('mantém mapa, modos e diagnóstico no capítulo que só tem o aviso', () => {
    // O aviso já foi um `return` antecipado que descartava a tela inteira: o
    // capítulo perdia o mapa, os três modos e o diagnóstico junto com a
    // ilustração, em 576 dos 613 capítulos. O aviso é uma peça da tela, não a
    // tela.
    render(
      <MemoryRouter initialEntries={['/visual?summary=' + semPrancha.id]}>
        <Visual />
      </MemoryRouter>,
    );

    const modos = screen.getByRole('tablist', { name: 'Modo de estudo' });
    for (const modo of ['Explorar', 'Testar', 'Reconstruir']) {
      expect(within(modos).getByRole('tab', { name: modo })).toBeInTheDocument();
    }
  });

  it('dá prancha manipulável ao capítulo cujo objeto é a curva', () => {
    render(
      <MemoryRouter initialEntries={['/visual?summary=' + comInstrumento.id]}>
        <Visual />
      </MemoryRouter>,
    );

    expect(screen.getByTestId('visual-study-board')).toBeInTheDocument();
    // Com o vértice em −3 e concavidade para cima, a parábola corta duas vezes.
    expect(screen.getByText('duas')).toBeInTheDocument();

    // Subir o vértice acima do eixo apaga as raízes — é o que a manipulação
    // existe para mostrar, e o que trava a leitura ligada ao controle.
    const vertice = screen.getByLabelText(/altura do vértice/i);
    fireEvent.change(vertice, { target: { value: '3' } });
    expect(screen.getByText('nenhuma real')).toBeInTheDocument();
  });

  it('mostra o domínio do capítulo inteiro, com a legenda junto', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    const interruptor = screen.getByRole('button', { name: /Mostrar domínio/i });
    expect(interruptor).toHaveAttribute('aria-pressed', 'false');
    expect(screen.queryByLabelText(/Domínio de cada conceito/i)).not.toBeInTheDocument();

    await user.click(interruptor);
    const painel = screen.getByLabelText(/Domínio de cada conceito/i);
    expect(interruptor).toHaveAttribute('aria-pressed', 'true');

    // Um item por nó do mapa, e a legenda dos sete estados junto — cor sozinha
    // não diz nada para quem abriu a tela pela primeira vez.
    expect(within(painel).getAllByRole('listitem')).toHaveLength(mapa.nodes.length + 7);
    expect(within(painel).getByText('Possível regressão')).toBeInTheDocument();
  });

  it('continua distinguindo hipótese de fato no inspetor', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    await user.click(screen.getByText('Expansão adiabática').closest('button')!);
    const dialog = screen.getByRole('dialog', { name: 'Conceito selecionado' });
    expect(within(dialog).getAllByText(/hipótese, não fato/i).length).toBeGreaterThan(0);
  });
});

describe('zoom da cena', () => {
  it('amplia, informa a escala e volta ao natural', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    const escala = screen.getByLabelText('Ampliação da cena');
    expect(escala).toHaveTextContent('100%');
    expect(screen.getByLabelText('Voltar ao tamanho natural')).toBeDisabled();
    // Em 100% não há excedente para arrastar, então a dica ensina a ampliar.
    expect(screen.getByText(/pinça ou \+ para ampliar/)).toBeInTheDocument();

    await user.click(screen.getByLabelText('Ampliar a cena'));
    expect(escala).toHaveTextContent('125%');
    expect(screen.getByText('arraste para navegar')).toBeInTheDocument();

    await user.click(screen.getByLabelText('Voltar ao tamanho natural'));
    expect(escala).toHaveTextContent('100%');
    expect(screen.getByLabelText('Voltar ao tamanho natural')).toBeDisabled();
  });

  it('não passa do teto nem do piso de ampliação', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    const mais = screen.getByLabelText('Ampliar a cena');
    for (let i = 0; i < 12; i += 1) if (!(mais as HTMLButtonElement).disabled) await user.click(mais);
    expect(screen.getByLabelText('Ampliação da cena')).toHaveTextContent('300%');
    expect(mais).toBeDisabled();
  });
});

describe('prancha no celular', () => {
  // O breakpoint do projeto. O stub de teste devolve `matches: false`, então a
  // prancha completa é o padrão; aqui a consulta é forçada a casar.
  function comLarguraDeCelular() {
    const original = window.matchMedia;
    window.matchMedia = ((query: string) => ({
      matches: query.includes('900px'),
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    })) as unknown as typeof window.matchMedia;
    return () => { window.matchMedia = original; };
  }

  it('divide a prancha em duas faces e não esconde nada no desktop', async () => {
    // Desktop: o alternador não existe, e equação e apoios estão na tela junto
    // com os conceitos.
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);
    expect(screen.queryByRole('tablist', { name: 'Seções da prancha' })).not.toBeInTheDocument();
    expect(screen.getByText('Expansão adiabática')).toBeInTheDocument();
    // A tira de equação e os apoios ficam na outra face, e no desktop aparecem
    // junto com os conceitos em vez de se esconderem atrás de uma aba.
    expect(screen.getByLabelText(/Primeira lei aplicada/i)).toBeInTheDocument();
    expect(screen.getByText('Relações úteis')).toBeInTheDocument();
  });

  it('esconde os apoios atrás da face Relações no celular', async () => {
    const restaurar = comLarguraDeCelular();
    try {
      const user = userEvent.setup();
      render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

      const faces = screen.getByRole('tablist', { name: 'Seções da prancha' });
      expect(within(faces).getByRole('tab', { name: 'Essencial' })).toHaveAttribute('aria-selected', 'true');
      // Essencial mostra os conceitos; a tira de equação fica para a outra face.
      expect(screen.getByText('Expansão adiabática')).toBeInTheDocument();
      expect(screen.queryByText('Relações úteis')).not.toBeInTheDocument();

      await user.click(within(faces).getByRole('tab', { name: 'Relações' }));
      expect(screen.getByText('Relações úteis')).toBeInTheDocument();
      expect(screen.queryByText('Expansão adiabática')).not.toBeInTheDocument();
    } finally {
      restaurar();
    }
  });
});
