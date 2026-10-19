import { afterEach, expect, it, vi } from 'vitest';
import { printStrategyGuide } from '../lib/printStrategyGuide';
afterEach(() => { window.dispatchEvent(new Event('afterprint')); vi.restoreAllMocks(); });
it('imprime somente o guia renderizado na janela atual e restaura a tela ao terminar', () => {
  const title = document.title;
  const content = document.createElement('article');
  content.innerHTML = '<h1>Matemática · Unicamp</h1><p><strong>Conceito</strong> e resolução</p><img src="https://example.org/diagrama.svg" alt="Diagrama do conteúdo">';
  const print = vi.spyOn(window, 'print').mockImplementation(() => {});
  printStrategyGuide(content, 'Aprofundamento de Matemática');
  expect(print).toHaveBeenCalledOnce();
  expect(document.querySelector('iframe')).toBeNull();
  const printable = document.querySelector('[data-crivo-print-root]')!;
  expect(document.title).toBe('Aprofundamento de Matemática');
  expect(printable.querySelector('strong')!.textContent).toBe('Conceito');
  const art = printable.querySelector<HTMLImageElement>('[data-print-cover] img')!;
  expect(art.src).toMatch(/^data:image\/webp;base64,/);
  expect(art.alt).toBe('');
  expect(printable.querySelector('[data-print-content] img')!.getAttribute('alt')).toBe('Diagrama do conteúdo');
  expect(printable.querySelector('[data-print-cover-header]')!.textContent).toContain('CRIVO');
  expect(printable.querySelector('[data-print-cover-base]')).not.toBeNull();
  expect(printable.querySelector('[data-print-content]')!.textContent).toContain('Matemática');
  expect(content.isConnected).toBe(false);
  window.dispatchEvent(new Event('afterprint'));
  expect(document.querySelector('[data-crivo-print-root]')).toBeNull();
  expect(document.title).toBe(title);
});
it('inclui a análise recolhida e fontes ocultas no PDF e retira controles de seleção', () => {
  const content = document.createElement('article');
  content.innerHTML = '<label data-print-exclude>Unidade<select><option>Conto</option></select></label><details><summary>Análise</summary><p>Explicação aprofundada</p></details><div class="hidden" data-print-only>Fonte conferida</div>';
  const print = vi.spyOn(window, 'print').mockImplementation(() => {});
  printStrategyGuide(content, 'Resumo de obra');
  const printable = document.querySelector('[data-crivo-print-root]')!;
  expect(printable.querySelector('select')).toBeNull();
  expect(printable.querySelector('details')!.open).toBe(true);
  expect(content.querySelector('details')!.open).toBe(false);
  expect(printable.querySelector('[data-print-only]')).not.toHaveClass('hidden');
  expect(printable.textContent).toContain('Fonte conferida');
  expect(print).toHaveBeenCalledOnce();
});
it('limpa a preparação anterior ao imprimir novamente e restaura a tela se o navegador falhar', () => {
  const title = document.title;
  const print = vi.spyOn(window, 'print').mockImplementation(() => {});
  const content = document.createElement('article');content.textContent = 'Texto';
  printStrategyGuide(content, 'Primeiro');printStrategyGuide(content, 'Segundo');
  expect(document.querySelectorAll('[data-crivo-print-root]')).toHaveLength(1);
  print.mockImplementation(() => { throw new Error('blocked'); });
  expect(() => printStrategyGuide(content, 'Terceiro')).toThrow('blocked');
  expect(document.querySelector('[data-crivo-print-root]')).toBeNull();expect(document.title).toBe(title);
});
it('cria capa contextual e sumário fiel sem alterar IDs ou interpretar os metadados como HTML', () => {
  vi.spyOn(window, 'print').mockImplementation(() => {});
  const content = document.createElement('article');
  Object.assign(content.dataset, { printSubject: 'Literatura', printWork: 'Obra <exemplo>', printSubtopic: 'Capítulo 2', printBoard: 'UNICAMP', printPurpose: 'Interpretar forma e contexto' });
  content.innerHTML = '<h2 id="crivo-print-section-1">Contexto</h2><p>Texto original</p><h3>Interpretação</h3><p><strong>Aplicação na prova</strong></p><details><summary>Fontes</summary><p>Referência</p></details>';
  printStrategyGuide(content, 'Guia');
  const root = document.querySelector('[data-crivo-print-root]')!;
  const cover = root.querySelector('[data-print-cover]')!;
  expect(cover.textContent).toContain('Obra <exemplo>');
  expect(cover.querySelector('exemplo')).toBeNull();
  expect(cover.textContent).toContain('Capítulo 2'); expect(cover.textContent).toContain('UNICAMP');
  expect(cover.textContent).toContain('Interpretar forma e contexto');
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-print-toc] a')];
  expect(links.map(link => link.textContent)).toEqual(['Contexto', 'Interpretação', 'Aplicação na prova', 'Fontes']);
  for (const link of links) expect(root.querySelector(link.hash)).not.toBeNull();
  expect(content.querySelectorAll('[data-print-anchor]')).toHaveLength(0);
  expect(root.querySelector('[data-print-content] h2')!.id).toBe('crivo-print-section-1');
  expect(root.querySelector('[data-print-layout] [data-print-illustration]')).toBeNull();
});
it('gera uma entrada honesta quando o material não possui títulos', () => {
  vi.spyOn(window, 'print').mockImplementation(() => {});
  const content = document.createElement('article'); content.innerHTML = '<p>Explicação sem seções</p>';
  printStrategyGuide(content, 'Meu estudo');
  expect(document.querySelector('[data-print-cover] h1')!.textContent).toBe('Meu estudo');
  expect(document.querySelector('[data-print-toc] a')!.textContent).toBe('Conteúdo do material');
  expect(content.querySelector('h2')).toBeNull();
});

it('preserva todos os metadados de tópicos combinados e usa a capa compacta quando necessário', () => {
  vi.spyOn(window, 'print').mockImplementation(() => {});
  const content = document.createElement('article');
  const context = 'Ecologia de populações, mecanismos evolutivos e relações entre organismos e ambiente. '.repeat(4);
  Object.assign(content.dataset, { printSubject: 'Biologia', printTopic: context, printSubtopic: context, printPurpose: 'Articular os conceitos e explicar o raciocínio de prova' });
  content.innerHTML = '<h2>Relações entre conceitos</h2>';
  printStrategyGuide(content, 'Estudo combinado');
  const cover = document.querySelector('[data-print-cover]')!;
  expect(cover).toHaveAttribute('data-print-dense-cover');
  expect(cover.querySelector('h1')!.textContent).toBe(context);
  expect(cover.querySelector('[data-print-cover-field="scope"] dd')!.textContent).toBe(context);
  expect(cover.querySelector('dl')).toHaveAttribute('data-print-single-column');
  expect(cover.querySelector('[data-print-cover-field="board"]')).toBeNull();
  expect(content.querySelector('[data-print-cover]')).toBeNull();
});

it.each([['Biologia', 'biology'], ['Química', 'chemistry'], ['Física', 'physics'], ['Matemática', 'mathematics'], ['Geografia', 'geography'], ['História', 'history'], ['Filosofia', 'history'], ['Redação', 'literature']])('seleciona uma ilustração de %s para o material', (subject, illustration) => {
  vi.spyOn(window, 'print').mockImplementation(() => {});
  const content = document.createElement('article');
  content.dataset.printSubject = subject;
  content.dataset.printTopic = 'Tópico selecionado';
  printStrategyGuide(content, 'Meu material');
  expect(document.querySelector('[data-print-cover]')).toHaveAttribute('data-print-art', illustration);
  expect(document.querySelector('[data-print-cover-subject]')!.textContent).toBe(subject);
  expect(document.querySelector('[data-print-cover] h1')!.textContent).toBe('Tópico selecionado');
});
it('usa a capa literária para uma obra e preserva seu nome e a banca de origem', () => {
  vi.spyOn(window, 'print').mockImplementation(() => {});
  const content = document.createElement('article');
  Object.assign(content.dataset, { printSubject: 'História', printWork: 'A vida não é útil', printBoard: 'UNICAMP' });
  printStrategyGuide(content, 'Resumo de obra');
  const cover = document.querySelector('[data-print-cover]')!;
  expect(cover).toHaveAttribute('data-print-art', 'literature');
  expect(cover.querySelector('h1')!.textContent).toBe('A vida não é útil');
  expect(cover.textContent).toContain('Obra completa');
  expect(cover.textContent).toContain('UNICAMP');
});

it('usa moldura idêntica em áreas distintas e mantém as quatro legendas científicas como texto', () => {
  vi.spyOn(window, 'print').mockImplementation(() => {});
  const content = document.createElement('article');
  Object.assign(content.dataset, { printSubject: 'Biologia', printTopic: 'Sangue e imunologia', printBoard: 'FUVEST 2027' });
  printStrategyGuide(content, 'Biologia');
  const frame = document.querySelector('[data-print-cover-base]')!.outerHTML;
  expect(document.querySelector('[data-print-cover]')).toHaveAttribute('data-print-art', 'blood');
  expect([...document.querySelectorAll('[data-print-vignette]')].map(e => e.textContent)).toEqual(['Hemácias', 'Defesa', 'Anticorpos', 'Circulação']);
  content.dataset.printSubject = 'Matemática';
  printStrategyGuide(content, 'Matemática');
  expect(document.querySelector('[data-print-cover-base]')!.outerHTML).toBe(frame);
  expect(document.querySelector('[data-print-cover]')).toHaveAttribute('data-print-art', 'mathematics');
});
