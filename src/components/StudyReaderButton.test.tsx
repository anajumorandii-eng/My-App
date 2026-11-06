import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react';
import { StudyReaderButton } from './StudyReaderButton';
import { prepareStudyReading, summaryReadingContent } from '../lib/studyReading';
import type { InteractiveSummary } from '../types/summary';

const descriptors = [
  [HTMLDialogElement.prototype, 'showModal'], [HTMLDialogElement.prototype, 'close'], [Element.prototype, 'scrollIntoView'],
].map(([object, name]) => ({ object: object as object, name: name as string, descriptor: Object.getOwnPropertyDescriptor(object, name as string) }));
beforeEach(() => {
  Object.defineProperty(HTMLDialogElement.prototype, 'showModal', { configurable: true, value: vi.fn(function (this: HTMLDialogElement) { this.setAttribute('open', ''); }) });
  Object.defineProperty(HTMLDialogElement.prototype, 'close', { configurable: true, value: vi.fn(function (this: HTMLDialogElement) { this.removeAttribute('open'); }) });
  Object.defineProperty(Element.prototype, 'scrollIntoView', { configurable: true, value: vi.fn() });
});
afterEach(() => {
  cleanup(); vi.restoreAllMocks(); document.body.style.overflow = '';
  for (const { object, name, descriptor } of descriptors) { if (descriptor) Object.defineProperty(object, name, descriptor); else Reflect.deleteProperty(object, name); }
});

it('preserva fórmulas, imagens e respostas escritas, sem alterar o material nem revelar o gabarito', () => {
  const source = document.createElement('article');
  source.innerHTML = '<h2 id="conceito">Conceito</h2><p><math><mi>x</mi></math></p><img src="/figura.svg" alt="Diagrama"><svg><defs><clipPath id="recorte"></clipPath></defs><path clip-path="url(#recorte)" /></svg><textarea></textarea><details data-review-answer-key open><summary>Gabarito</summary><h3>Critérios</h3><p>Resposta reservada</p></details><button>Marcar como lida</button><div data-print-exclude>Controles de PDF</div>';
  source.querySelector('textarea')!.value = 'Meu raciocínio independente';
  const result = prepareStudyReading(source, 'teste');
  expect(result.content.querySelector('math mi')?.textContent).toBe('x');
  expect(result.content.querySelector('img')?.getAttribute('src')).toBe('/figura.svg');
  expect(result.content.querySelector('path')?.getAttribute('clip-path')).toBe('url(#teste-id-1)');
  expect(result.content.textContent).toContain('Meu raciocínio independente');
  expect(result.content.querySelector('details')?.open).toBe(false);
  expect(result.sections.map(s => s.label)).toEqual(['Conceito']);
  expect(result.content.querySelector('button')).toBeNull();
  expect(result.content.textContent).not.toContain('Controles de PDF');
  expect(source.querySelector('details')?.open).toBe(true);
  expect(source.querySelector('h2')?.id).toBe('conceito');
});

it('monta todas as seções do resumo, sem antecipar os critérios de correção', () => {
  const summary: InteractiveSummary = { id: 'teste', title: 'Capítulo de teste', subject: 'Matemática', topic: 'Funções', priority: 'media', boards: [], prerequisites: ['Álgebra'], overview: 'Visão geral', sources: [], sections: [
    { id: 'a', title: 'Primeira seção', stage: 'conceito', depth: 'rapida', content: 'Conteúdo inicial.' },
    { id: 'b', title: 'Seção aprofundada', stage: 'aplicacao', depth: 'aprofundamento', content: 'Conteúdo completo, mesmo sem expansão na tela.', evidenceKind: 'interpretacao' },
  ], retrieval: [{ id: 'q', prompt: 'Explique a relação.', expectedElements: [{ label: 'CRITÉRIO RESERVADO', keywords: ['segredo'] }], hint: 'Pista', transferPrompt: 'Transferência' }] };
  const content = summaryReadingContent(summary);
  expect(content.textContent).toContain('Conteúdo completo, mesmo sem expansão na tela.');
  expect(content.textContent).toContain('Interpretação sustentada');
  expect(content.textContent).toContain('Explique a relação.');
  expect(content.textContent).not.toContain('CRITÉRIO RESERVADO');
});

it('abre o guia com índice e fecha pelo botão ou Escape, devolvendo o foco ao material', async () => {
  const content = document.createElement('article'); content.innerHTML = '<h2>Conceito central</h2><p>Texto da explicação.</p>';
  render(<StudyReaderButton title="Minha revisão" getContent={() => content} />);
  const open = screen.getByRole('button', { name: 'Abrir para leitura' });
  fireEvent.click(open);
  const dialog = await screen.findByRole('dialog', { name: 'Minha revisão' });
  expect(within(dialog).getByRole('navigation', { name: 'Seções da leitura' })).toBeInTheDocument();
  fireEvent.click(within(dialog).getByRole('link', { name: 'Conceito central' }));
  expect(Element.prototype.scrollIntoView).toHaveBeenCalled();
  fireEvent.click(within(dialog).getByRole('button', { name: 'CRIVO · voltar ao material' }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(open).toHaveFocus();
  fireEvent.click(open); const second = await screen.findByRole('dialog'); fireEvent(second, new Event('cancel', { bubbles: true, cancelable: true }));
  expect(screen.queryByRole('dialog')).not.toBeInTheDocument(); expect(document.body.style.overflow).toBe('');
});

it('espera a formatação do texto antes de congelar a cópia para leitura', async () => {
  const content = document.createElement('article'); content.innerHTML = '<div data-ai-text-pending>Carregando</div>';
  render(<StudyReaderButton title="Guia formatado" getContent={() => content} />);
  fireEvent.click(screen.getByRole('button', { name: 'Abrir para leitura' }));
  expect(screen.getByRole('button', { name: 'Preparando leitura…' })).toBeDisabled();
  content.innerHTML = '<h2>Seção formatada</h2><p>Explicação pronta.</p>';
  expect(await screen.findByRole('dialog', { name: 'Guia formatado' })).toHaveTextContent('Explicação pronta.');
});

it('permite tentar novamente quando o conteúdo ainda não está disponível', async () => {
  const get = vi.fn<() => HTMLElement | null>().mockReturnValueOnce(null).mockReturnValue(document.createElement('article'));
  render(<StudyReaderButton title="Guia" getContent={get} />);
  fireEvent.click(screen.getByRole('button', { name: 'Abrir para leitura' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Tente novamente.');
  fireEvent.click(screen.getByRole('button', { name: 'Abrir para leitura' }));
  expect(await screen.findByRole('dialog', { name: 'Guia' })).toBeInTheDocument();
});
