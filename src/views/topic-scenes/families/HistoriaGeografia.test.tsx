import React from 'react';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { historia } from '../data/historia';
import { geografia } from '../data/geografia';
import { HistoriaGeografia } from './HistoriaGeografia';

describe('pranchas de História e Geografia', () => {
  it('mantém duas figuras distintas visíveis e compara fontes sem permitir A e B iguais', async () => {
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === 'summary-geografia-relevo-brasileiro')!;
    const { container } = render(<HistoriaGeografia entry={entry} />);
    const figure = screen.getByRole('img', { name: /Relevo brasileiro em perfil/ });
    const original = figure.getAttribute('aria-label');
    const compare = screen.getByRole('button', { name: 'Comparar recortes' });
    compare.focus();
    await user.keyboard('{Enter}');
    const group = screen.getByRole('group', { name: 'Comparação entre recortes' });
    expect(within(group).getByText(entry.items[0].claim)).toBeInTheDocument();
    expect(within(group).getByText(entry.items[1].claim)).toBeInTheDocument();
    const choice = screen.getByRole('combobox', { name: 'Recorte B' });
    expect(within(choice).queryByRole('option', { name: entry.items[0].label })).toBeNull();
    expect(container.querySelectorAll('.hg-figure')).toHaveLength(2);
    const figures = screen.getAllByRole('img', { name: /Relevo brasileiro em perfil/ });
    expect(figures[0].getAttribute('aria-label')).toBe(original);
    expect(figures[1].getAttribute('aria-label')).not.toBe(original);
    await user.click(screen.getByRole('button', { name: 'Localizar painel B' }));
    expect(container.querySelectorAll('.hg-figure')[1]).toHaveFocus();
    await user.selectOptions(choice, '2');
    expect(within(group).getByText(entry.items[2].claim)).toBeInTheDocument();
    expect(figures[1]).toHaveAttribute('aria-label', expect.stringContaining('depressões em foco'));
    expect(figures[0].getAttribute('aria-label')).toBe(original);
    await user.click(screen.getByRole('button', { name: entry.items[2].label }));
    expect(figures[0]).toHaveAttribute('aria-label', expect.stringContaining('depressões em foco'));
    const ids = Array.from(container.querySelectorAll('[id]')).map(e => e.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(choice).not.toHaveValue('2');
    await user.click(screen.getByRole('button', { name: 'Fechar comparação' }));
    expect(screen.queryByRole('group', { name: 'Comparação entre recortes' })).toBeNull();
    expect(screen.getByRole('status')).toHaveTextContent(entry.items[2].claim);
    await user.click(screen.getByRole('button', { name: 'Comparar recortes' }));
    expect(screen.getByRole('combobox', { name: 'Recorte B' })).not.toHaveValue('2');
    expect(figures[0]).toHaveAttribute('aria-label', expect.stringContaining('depressões em foco'));

  });
  it('integra estamentos, disputa de representação e mudanças de regime na prancha francesa', () => {
    const entry = historia.find(item => item.chapterId === 'summary-historia-revolucao-francesa')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Revolução Francesa.*Terror/i });
    expect(diagram).toHaveTextContent('Clero');
    expect(diagram).toHaveTextContent('Nobreza');
    expect(diagram).toHaveTextContent('Terceiro Estado');
    expect(diagram).toHaveTextContent('privilégios fiscais');
    expect(diagram).toHaveTextContent('Constituição · 1791');
    expect(diagram).toHaveTextContent('República · 1792');
    expect(diagram).toHaveTextContent('igualdade jurídica');
  });

  it('mostra aquecimento, condensação e os dois lados do relevo na prancha climática', () => {
    const entry = geografia.find(item => item.chapterId === 'summary-geografia-dinamica-climatica')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Chuva convectiva.*orográfica.*frontal/i });
    expect(diagram).toHaveTextContent('superfície aquece o ar');
    expect(diagram).toHaveTextContent('expande e esfria');
    expect(diagram).toHaveTextContent('condensação');
    expect(diagram).toHaveTextContent('barlavento');
    expect(diagram).toHaveTextContent('sotavento');
    expect(diagram).toHaveTextContent('massa fria');
    expect(diagram).toHaveTextContent('massa quente');
  });

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

  it('explora fatores históricos mantendo a coexistência regional em todos os recortes', async () => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === 'summary-historia-a-montagem-da-colonizacao')!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name: /Montagem da colonização/i });
    for (const label of ['Resistência indígena', 'Mortalidade por epidemias', 'Oposição jesuíta', 'Circuito atlântico']) {
      await user.click(screen.getByRole('button', { name: label }));
      expect(screen.getByRole('button', { name: label })).toHaveAttribute('aria-pressed', 'true');
      expect(diagram).toHaveTextContent('persistência do cativeiro indígena');
      expect(diagram).toHaveTextContent('maior fluxo de africanos escravizados');
      expect(diagram).not.toHaveTextContent('sozinho, não basta');
    }
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
  it.each([
    ['summary-geografia-movimentos-da-terra', /Movimentos da Terra/, 'periélio e afélio', 'Estações opostas', 'elo 4'],
    ['summary-geografia-relevo-brasileiro', /Relevo brasileiro em perfil/, 'escudo cristalino antigo', 'Depressões', 'depressões em foco'],
    ['summary-geografia-pedologia', /Perfis de solo/, 'sobre basalto', 'Semiárido', 'semiárido em foco'],
    ['summary-geografia-climatologia-do-brasil', /Climas do Brasil/, 'Trópico de Capricórnio', 'Subtropical', 'subtropical em foco'],
    ['summary-geografia-dominios-morfoclimaticos', /Domínios morfoclimáticos/, 'faixas de transição', 'Caatinga', 'Caatinga em foco'],
    ['summary-geografia-geologia-e-geomorfologia', /Rochas por origem/, 'rochas em profundidade', 'Metamórficas', 'metamórficas em foco'],
  ] as const)('desenha o processo físico de %s', async (chapterId, name, text, button, focus) => {
    const user = userEvent.setup();
    const entry = geografia.find(item => item.chapterId === chapterId)!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name });
    expect(diagram).toHaveTextContent(text);
    await user.click(screen.getByRole('button', { name: button }));
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining(focus));
  });

  it.each([
    ['summary-historia-brasil-imperio-formacao-do-estado-nacional-brasileiro', /Poder Moderador acima dos três poderes/, 'nomeia senadores vitalícios', 'Abdicação de 1831', 'cala a revolta, não o problema'],
    ['summary-historia-brasil-imperio-o-periodo-regencial-1831-1840', /Período Regencial.*1831 a 1845/, '1840: maioridade', 'Revoltas regenciais', 'não contém as províncias'],
    ['summary-historia-brasil-imperio-o-declinio-do-segundo-reinado', /Declínio do Segundo Reinado.*movimento militar republicano/, 'sem indenização', 'Perda simultânea', '15 nov. 1889'],
    ['summary-historia-ascensao-e-dominio-das-oligarquias', /do eleitor dependente ao coronel/, 'eleitores dependentes', 'Café com leite', 'de excedentes de café'],
    ['summary-historia-a-primeira-republica-o-declinio-oligarquico-1889-1930', /tenentismo, pelo movimento operário e pelo modernismo/, 'greve geral, SP 1917', 'Modernismo', 'na arte'],
  ] as const)('desenha a estrutura de poder de %s', async (chapterId, name, text, button, after) => {
    const user = userEvent.setup();
    const entry = historia.find(item => item.chapterId === chapterId)!;
    render(<HistoriaGeografia entry={entry} />);
    const diagram = screen.getByRole('img', { name });
    expect(diagram).toHaveTextContent(text);
    const target = screen.getByRole('button', { name: button });
    await user.click(target);
    expect(target).toHaveAttribute('aria-pressed', 'true');
    expect(diagram).toHaveTextContent(after);
    expect(diagram).toHaveAttribute('aria-label', expect.stringContaining(`recorte ${entry.items.length}`));
  });
});
