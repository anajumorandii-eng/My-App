import React from 'react';
import { cleanup, render, screen, within } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import AiTextRenderer from './AiTextRenderer';

afterEach(cleanup);
const table = `### Relação entre subtópicos

| Subtópico | Conceito exigido | Habilidade | Condição de aplicação |
|---|---|---|---|
| Potências e Radicais | propriedades de expoentes, conversão entre radical e potência | simplificar e comparar expressões | quando há multiplicações, divisões, raízes ou escalas |
| Razão e Proporção | comparação por divisão e igualdade entre razões | montar relações entre grandezas | quando existe uma relação constante entre quantidades |
| Porcentagem | razão com base 100, fator multiplicativo | interpretar aumentos e reduções | quando o problema envolve variação relativa |`;

it('apresenta a tabela do guia com cabeçalhos, linhas e células reais', () => {
  const { container } = render(<AiTextRenderer text={table} />);
  const rendered = container.querySelector('table');
  expect(rendered).not.toBeNull();
  expect(within(rendered!).getAllByRole('columnheader', { hidden: true }).map(cell => cell.textContent)).toEqual([
    'Subtópico', 'Conceito exigido', 'Habilidade', 'Condição de aplicação',
  ]);
  expect(within(rendered!).getAllByRole('row', { hidden: true })).toHaveLength(4);
  expect(within(rendered!).getAllByRole('cell', { hidden: true })).toHaveLength(12);
  expect(within(rendered!).getByRole('cell', { name: 'interpretar aumentos e reduções', hidden: true })).toHaveTextContent('interpretar aumentos e reduções');
  expect(rendered!.textContent).not.toContain('|---|');
});
it('mantém fórmulas, negrito e listas junto das tabelas', () => {
  const { container } = render(<AiTextRenderer text={`**Checagem rápida**\n\n- Operações com frações\n\n| Operação | Resultado |\n|---|---|\n| $\\frac{2}{3}+\\frac{1}{6}$ | $\\frac{5}{6}$ |\n\nSe \\(x=2\\), confira o resultado.`} />);
  expect(screen.getByText('Checagem rápida').tagName).toBe('STRONG');
  expect(screen.getByRole('listitem', { hidden: true })).toHaveTextContent('Operações com frações');
  const rendered = container.querySelector('table');
  expect(rendered).not.toBeNull();
  expect(within(rendered!).getAllByRole('cell', { hidden: true })).toHaveLength(2);
  expect(container.querySelectorAll('.katex')).toHaveLength(3);
  expect(container.querySelector('.katex-error')).toBeNull();
});
it('preserva blocos de código que contêm barras e separadores literais', () => {
  render(<AiTextRenderer text={'```text\n| Exemplo | Valor |\n|---|---|\n| a | b |\n```'} />);
  expect(screen.queryByRole('table')).toBeNull();
  expect(screen.getByText(/\| Exemplo \| Valor \|/).tagName).toBe('CODE');
});
