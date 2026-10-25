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

it('preserva reais e alternativas como texto sem capturar tudo entre dois R$', () => {
  const text = String.raw`Preço: $P(m)=10+6m$.

**B)** O preço permanece acima de R$ 6/kg.
**C)** O preço por quilograma é constante.
**D)** O preço fica abaixo de R$ 6/kg.`;
  const {container} = render(<AiTextRenderer text={text} />);
  expect(container.querySelectorAll('.katex')).toHaveLength(1);
  expect(screen.getByText('C)').tagName).toBe('STRONG');
  expect(container.textContent).toContain('R$ 6/kg.');
  expect(container.querySelector('.katex-error')).toBeNull();
});

it('isola fórmula multilinha com delimitador colado e preserva o texto posterior', () => {
  const {container} = render(<AiTextRenderer text={String.raw`$$f(x)=\begin{cases}
 x & x>0\\
 -x & x\leq0
\end{cases}$$

**Conferência:** aplique a condição.`} />);
  expect(container.querySelectorAll('.katex')).toHaveLength(1);
  expect(container.querySelector('.katex-display')).not.toBeNull();
  expect(screen.getByText('Conferência:').tagName).toBe('STRONG');
  expect(container.textContent).not.toContain('undefined');
});

it('não modifica delimitadores nem moeda dentro de código', () => {
 const {container} = render(<AiTextRenderer text={'```text\nR$ 6; \\[x\\]; $$f(x)$$\n```\n\n`R$ 8`'} />);
 expect(container.querySelector('pre code')?.textContent).toBe('R$ 6; \\[x\\]; $$f(x)$$\n');
 expect(container.querySelectorAll('.katex')).toHaveLength(0);
});

it('normaliza símbolos gregos apenas nas expressões e preserva o texto comum', () => {
 const {container}=render(<AiTextRenderer text={'No texto: α, β e π. Na fórmula: $𝛼 + β + γ = 180^\\circ$ e $θ = 2π/3$.'}/>);
 const annotations=[...container.querySelectorAll('annotation')].map(item=>item.textContent);
 expect(annotations[0]).toContain('\\alpha');
 expect(annotations[0]).toContain('\\beta');
 expect(annotations[1]).toContain('\\theta');
 expect(annotations[1]).toContain('\\pi');
 expect(container.textContent).toContain('No texto: α, β e π.');
 expect(container.querySelector('.katex-error')).toBeNull();
});

it('preserva texto LaTeX e normaliza a variável mesmo quando a expressão contém moeda escapada',()=>{
 const {container}=render(<AiTextRenderer text={String.raw`$𝛼 + \text{valor R\$ 12 e ângulo α} = β$`}/>);
 const formula=container.querySelector('annotation')?.textContent??'';
 expect(formula).toContain('\\alpha');expect(formula).toContain('\\beta');expect(formula).toContain('\\text{valor R\\textdollar{} 12 e ângulo α}');expect(container.querySelector('.katex-error')).toBeNull();
});
