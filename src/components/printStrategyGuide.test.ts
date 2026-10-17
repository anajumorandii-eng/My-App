import { expect, it, vi } from 'vitest';
import { printStrategyGuide } from '../lib/printStrategyGuide';

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

it('inclui a análise recolhida no PDF e retira controles de seleção', async () => {
  const content = document.createElement('article');
  content.innerHTML = '<label data-print-exclude>Unidade<select><option>Conto</option></select></label><details><summary>Análise</summary><p>Explicação aprofundada</p></details>';
  printStrategyGuide(content, 'Resumo de obra');
  const frame = document.querySelector('iframe')!;
  vi.spyOn(frame.contentWindow!, 'print').mockImplementation(() => {});
  vi.spyOn(frame.contentWindow!, 'focus').mockImplementation(() => {});
  expect(frame.contentDocument!.querySelector('select')).toBeNull();
  expect(frame.contentDocument!.querySelector('details')!.open).toBe(true);
  expect(content.querySelector('details')!.open).toBe(false);
  await vi.waitFor(() => expect(frame.contentWindow!.print).toHaveBeenCalledOnce());
  frame.contentWindow!.dispatchEvent(new Event('afterprint'));
});
