import { cleanup, render, screen } from '@testing-library/react';
import { afterEach, expect, it } from 'vitest';
import AiTextRenderer from './AiTextRenderer';
import { createStrategyPrintRoot } from '../lib/printStrategyGuide';
import { parseStudyVisual } from '../lib/studyVisual';
afterEach(cleanup);
const flow = { type: 'flow', title: 'Conservação de água', steps: ['Osmolaridade aumenta', 'Liberação de ADH aumenta', 'Reabsorção de água aumenta'], caption: 'Rins funcionantes e gradiente preservado.', question: 'O que muda se o receptor não responder?' };
it('renderiza o bloco de estudo como figura, preservando mecanismo e pergunta no PDF', () => {
  const text = '```study-visual\n' + JSON.stringify(flow) + '\n```';
  const { container } = render(<AiTextRenderer text={text} />);
  expect(container.querySelector('[data-study-visual="flow"]')).toBeTruthy();
  expect(screen.getByRole('list', { name: flow.title })).toBeInTheDocument();
  const root = createStrategyPrintRoot(container, 'Revisão');
  expect(root.querySelector('[data-study-visual]')?.textContent).toContain(flow.question);
  expect(container.querySelector('pre')).toBeNull();
});
it('mostra barras proporcionais com valores, unidade e origem didática', () => {
  const bars = { type: 'bars', title: 'Débito cardíaco', unit: 'L/min', data: [{ label: 'Repouso', value: 4.9 }, { label: 'Exercício', value: 14 }], caption: 'Dados didáticos.', question: 'Qual variável mudou?' };
  const { container } = render(<AiTextRenderer text={'```study-visual\n' + JSON.stringify(bars) + '\n```'} />);
  expect(container.querySelectorAll('svg')).toHaveLength(2);
  expect(container.textContent).toContain('4,9 L/min');
  expect(container.textContent).toContain('Dados didáticos.');
});
it('recusa estrutura incompleta, números inválidos e blocos excessivos', () => {
  expect(parseStudyVisual('{')).toBeUndefined();
  expect(parseStudyVisual(JSON.stringify({ ...flow, steps: ['uma'] }))).toBeUndefined();
  expect(parseStudyVisual(JSON.stringify({ ...flow, type: 'bars', unit: 'mg', data: [{ label: 'A', value: -1 }, { label: 'B', value: 2 }] }))).toBeUndefined();
  expect(parseStudyVisual('x'.repeat(8001))).toBeUndefined();
});
