import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { historia } from '../data/historia';
import { geografia } from '../data/geografia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('pranchas de História e Geografia', () => {
  it('separa a cronologia da Revolução Francesa das pressões que levaram ao Terror', async () => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === 'summary-historia-revolucao-francesa')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Revolução Francesa.*Terror/i });
    expect(diagram).toHaveTextContent('guerra externa + desconfiança interna');
    const terror = screen.getByRole('button', { name: 'O Terror' });
    terror.focus();
    await user.keyboard('{Enter}');
    expect(terror).toHaveAttribute('aria-pressed', 'true');
    expect(screen.getByRole('status')).toHaveTextContent('fatores internos e externos');
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('etapa 4'));
  });

  it('explica as propriedades preservadas por três projeções sem prometer um mapa sem distorção', async () => {
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === 'summary-geografia-projecoes-cartograficas')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Propriedades cartográficas comparadas/i });
    expect(diagram).toHaveTextContent('forma local');
    expect(diagram).toHaveTextContent('área relativa');
    expect(diagram).toHaveTextContent('distância do centro');
    await user.click(screen.getByRole('button', { name: 'Equidistante' }));
    expect(screen.getByRole('status')).toHaveTextContent('ponto central');
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('equidistante selecionada'));
  });

  it('liga cercamentos à fábrica e distingue documentação, pressão social e leis fabris', async () => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === 'summary-historia-revolucao-industrial')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Revolução Industrial.*leis fabris/i });
    expect(diagram).toHaveTextContent('mão de obra');
    expect(diagram).toHaveTextContent('documentação + pressão social');
    await user.click(screen.getByRole('button', { name: 'Leis fabris' }));
    expect(screen.getByRole('status')).toHaveTextContent('reformistas sociais');
  });

  it('contrasta chuva convectiva, orográfica e frontal pelo mecanismo de ascensão', async () => {
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === 'summary-geografia-dinamica-climatica')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Chuva convectiva.*orográfica.*frontal/i });
    expect(diagram).toHaveTextContent('barreira do relevo');
    await user.click(screen.getByRole('button', { name: 'Orográfica' }));
    expect(screen.getByRole('status')).toHaveTextContent('barlavento');
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('orográfica selecionada'));
  });
  it('segue a cadeia das navegações até a colonização de 1530', async () => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === 'summary-historia-grandes-navegacoes-e-conquista-colonial')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Grandes Navegações/i });
    expect(diagram).toHaveTextContent('Calicute, 1498');
    expect(diagram).toHaveTextContent('pau-brasil por escambo');
    await user.click(screen.getByRole('button', { name: 'Ameaça de invasão' }));
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('elo 4'));
  });

  it('só inclina a balança da mão de obra quando os três fatores atuam juntos', async () => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === 'summary-historia-a-montagem-da-colonizacao')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Montagem da colonização/i });
    expect(diagram).toHaveTextContent('sozinho, não basta');
    await user.click(screen.getByRole('button', { name: 'Nenhum fator isolado' }));
    expect(diagram).toHaveTextContent('juntos, inclinam a balança');
    expect(diagram).toHaveTextContent('Metáfora: sem peso medido.');
  });

  it('contrasta a composição social das duas revoltas contra o mesmo pacto colonial', async () => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === 'summary-historia-a-crise-do-antigo-sistema-colonial')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Inconfidência Mineira \(1789\).*Conjuração Baiana \(1798\)/i });
    expect(diagram).toHaveTextContent('elites locais de Minas');
    expect(diagram).toHaveTextContent('pautas radicais: abolição');
    await user.click(screen.getByRole('button', { name: 'Mesmo descontentamento' }));
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining('recorte 3'));
  });
});

