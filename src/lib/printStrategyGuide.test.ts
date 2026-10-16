import { expect, it, vi } from 'vitest';
import { printStrategyGuide } from './printStrategyGuide';

it('imprime somente o guia renderizado e remove o quadro ao terminar', async () => {
  const content = document.createElement('article');
  content.innerHTML = '<h1>Matemática · Unicamp</h1><p><strong>Conceito</strong> e resolução</p>';
  printStrategyGuide(content, 'Aprofundamento de Matemática');
  const frame = document.querySelector('iframe')!;
  const print = vi.spyOn(frame.contentWindow!, 'print').mockImplementation(() => {});
  vi.spyOn(frame.contentWindow!, 'focus').mockImplementation(() => {});
  await vi.waitFor(() => expect(print).toHaveBeenCalledOnce());
  expect(frame.contentDocument!.title).toBe('Aprofundamento de Matemática');
  expect(frame.contentDocument!.querySelector('strong')!.textContent).toBe('Conceito');
  expect(content.isConnected).toBe(false);
  frame.contentWindow!.dispatchEvent(new Event('afterprint'));
  expect(document.querySelector('iframe')).toBeNull();
});
