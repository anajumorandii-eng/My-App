import { render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import { interactiveSummaries } from '../data/interactiveSummaries';
import { buildVisualMap } from '../lib/visualStudy';
import type { RetrievalAttempt, SummaryProgress, SummaryProgressMap } from '../types/summary';
import Visual from './Visual';

const capitulo = interactiveSummaries.find((item) => item.id === 'fis-termologia-calor')!;
const mapa = buildVisualMap(capitulo);
const rota = `/visual?summary=${capitulo.id}`;

let progress: SummaryProgressMap = {};
const update = vi.fn();
vi.mock('../hooks/useSummaryProgress', () => ({
  useSummaryProgress: () => ({ progress, update, loading: false, syncError: null, isCloudSynced: false }),
}));

function comProgresso(answers: RetrievalAttempt[]): SummaryProgress {
  return { readSectionIds: capitulo.sections.map((section) => section.id), status: 'em-revisao', important: false, answers };
}

function tentativa(matched: string[], missing: string | null): RetrievalAttempt {
  return { questionId: capitulo.retrieval[0].id, answer: '…', matchedElements: matched, firstMissingElement: missing, date: '2026-01-01' };
}

beforeEach(() => { progress = {}; update.mockClear(); });

describe('biblioteca do Visual', () => {
  it('lista capítulos e abre o mapa do capítulo escolhido', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={['/visual']}><Visual /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /Veja as relações/ })).toBeInTheDocument();

    await user.type(screen.getByLabelText(/Buscar capítulo/), capitulo.title.slice(0, 12));
    await user.click(await screen.findByText(capitulo.title));
    expect(await screen.findByRole('img', { name: new RegExp(`Mapa de relações de ${capitulo.title}`) })).toBeInTheDocument();
  });

  it('avisa quando a URL aponta para um capítulo que não existe mais', () => {
    render(<MemoryRouter initialEntries={['/visual?summary=removido']}><Visual /></MemoryRouter>);
    expect(screen.getByRole('alert')).toHaveTextContent(/Capítulo indisponível/);
  });
});

describe('modo Explorar', () => {
  it('abre o inspetor do nó selecionado com estado, confiança e evidência', async () => {
    const user = userEvent.setup();
    progress = { [capitulo.id]: comProgresso([tentativa([mapa.relations[0].label], mapa.relations[1].label)]) };
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);

    expect(screen.getByText(/Selecione um nó da prancha/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: new RegExp(mapa.nodes[1].label.slice(0, 14)) }));

    expect(screen.getByRole('heading', { name: mapa.nodes[1].label })).toBeInTheDocument();
    expect(screen.getByText(new RegExp(mapa.relations[0].label, 'i'))).toBeInTheDocument();
    expect(screen.getAllByText(/Confiança|Dados insuficientes/).length).toBeGreaterThan(0);
  });

  it('apresenta diagnóstico raso como hipótese, não como fato', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: new RegExp(mapa.nodes[0].label.slice(0, 14)) }));
    expect(screen.getAllByText('Hipótese.').length).toBe(mapa.relations.length);
    expect(screen.getByText(/ainda não têm evidência suficiente/)).toBeInTheDocument();
  });

  it('registra a discordância sem apagar o estado diagnosticado', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);
    await user.click(screen.getByRole('button', { name: new RegExp(mapa.nodes[0].label.slice(0, 14)) }));
    await user.click(screen.getByRole('button', { name: /Discordo deste diagnóstico/ }));
    expect(screen.getByRole('status')).toHaveTextContent(/evidência nova que muda o diagnóstico/);
  });
});

describe('modo Testar', () => {
  it('grava a tentativa pela mesma porta da recuperação ativa', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);
    await user.click(screen.getByRole('tab', { name: 'Testar' }));

    const enviar = screen.getByRole('button', { name: /Enviar para correção/ });
    expect(enviar).toBeDisabled();

    await user.type(screen.getByLabelText('Sua resposta'), capitulo.retrieval[0].expectedElements[0].keywords[0]);
    await user.click(enviar);

    expect(update).toHaveBeenCalledWith(capitulo.id, expect.any(Function));
    expect(screen.getByRole('status')).toHaveTextContent(/Você preservou/);
  });
});

describe('modo Reconstruir', () => {
  it('oculta as relações mais frágeis e explica a escolha', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);
    await user.click(screen.getByRole('tab', { name: 'Reconstruir' }));

    expect(screen.getByText(/ocultou primeiro as relações em que suas evidências são mais frágeis/)).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: /Por que estas\?/ }));
    expect(screen.getAllByText(/Nunca houve tentativa registrada/).length).toBeGreaterThan(0);
  });

  it('corrige de forma graduada e grava a reconstrução como evidência', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);
    await user.click(screen.getByRole('tab', { name: 'Reconstruir' }));

    const lacunas = screen.getAllByRole('listitem').filter((item) => within(item).queryByText(/^Lacuna \d$/));
    expect(lacunas.length).toBe(2);

    // Troca deliberada: na primeira lacuna a estudante põe a peça de outra
    // relação do mesmo mapa — conteúdo certo, vínculo errado. É o "quase isso",
    // que não pode sair como erro cheio.
    const [primeira] = lacunas;
    const pecas = within(primeira).getAllByRole('button');
    await user.click(pecas[pecas.length - 1]);
    await user.click(screen.getByRole('button', { name: /Conferir reconstrução/ }));

    expect(update).toHaveBeenCalledWith(capitulo.id, expect.any(Function));
    expect(within(primeira).getByRole('status')).toHaveTextContent(/Quase isso/);
  });

  it('desfaz e reinicia as peças colocadas', async () => {
    const user = userEvent.setup();
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);
    await user.click(screen.getByRole('tab', { name: 'Reconstruir' }));

    const desfazer = screen.getByRole('button', { name: /Desfazer/ });
    expect(desfazer).toBeDisabled();

    const lacuna = screen.getByText(/^Lacuna 1$/).closest('li')!;
    const peca = within(lacuna).getAllByRole('button')[0];
    await user.click(peca);
    expect(peca).toHaveAttribute('aria-pressed', 'true');

    await user.click(screen.getByRole('button', { name: /Desfazer/ }));
    expect(within(lacuna).getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'false');

    await user.click(within(lacuna).getAllByRole('button')[0]);
    await user.click(screen.getByRole('button', { name: /Reiniciar/ }));
    expect(within(lacuna).getAllByRole('button')[0]).toHaveAttribute('aria-pressed', 'false');
  });
});

describe('intervenção mínima', () => {
  it('aponta o elo mais frágil em vez de mandar rever o capítulo inteiro', () => {
    progress = { [capitulo.id]: comProgresso([
      tentativa(mapa.relations.map((relation) => relation.label), null),
      tentativa([mapa.relations[0].label], mapa.relations[1].label),
    ]) };
    render(<MemoryRouter initialEntries={[rota]}><Visual /></MemoryRouter>);
    const bloco = screen.getByRole('heading', { name: /Menor lacuna que explica o problema/ }).closest('section')!;
    expect(within(bloco).getByText(new RegExp(mapa.relations[1].label, 'i'))).toBeInTheDocument();
    expect(within(bloco).getByRole('button', { name: /Reconstruir esta relação/ })).toBeInTheDocument();
  });
});
