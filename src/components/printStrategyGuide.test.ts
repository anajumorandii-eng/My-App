import { expect, it, vi } from 'vitest';
import { createStrategyPrintRoot, printStrategyGuide } from '../lib/printStrategyGuide';
import { openStudyPdf } from '../lib/printPdfFile';
vi.mock('../lib/printPdfFile', () => ({ openStudyPdf: vi.fn() }));

it('usa o mesmo arquivo paginado em todos os dispositivos', () => {
  const content = document.createElement('article');
  content.innerHTML = '<h2>Seção</h2><p>Texto original</p>';
  printStrategyGuide(content, 'Guia');
  expect(openStudyPdf).toHaveBeenCalledWith(expect.any(HTMLElement), 'Guia', expect.stringContaining('Liberation Serif'));
  expect(content.querySelector('[data-print-cover]')).toBeNull();
});
it('sumário inclui somente dois níveis semânticos, sem frases ou etapas', () => {
  const content = document.createElement('article');
  content.innerHTML = '<h2 id="original">Contexto</h2><p><b>Frase em destaque</b></p><h3>Análise</h3><h4>Detalhe</h4><ol><li><h3>Etapa</h3>Calcule.</li></ol><details><summary>Fontes</summary><p>Referência</p></details>';
  const root = createStrategyPrintRoot(content, 'Guia');
  const links = [...root.querySelectorAll<HTMLAnchorElement>('[data-print-toc] a')];
  expect(links.map(link => link.textContent)).toEqual(['Contexto', 'Análise', 'Fontes']);
  expect(root.querySelector('[data-print-content] h2')!.id).toBe('original');
  expect(root.querySelectorAll('[data-toc-page]')).toHaveLength(3);
  for (const link of links) expect(root.querySelector(link.hash)?.tagName).toMatch(/H2|H3|SUMMARY/);
  expect(content.querySelector('h3')!.id).toBe('');
});
it('preserva o nível do Markdown mesmo quando o título da tela tem outro nível', () => {
  const content = document.createElement('article');
  content.innerHTML = '<h3 data-heading-level="1">Principal</h3><h3 data-heading-level="2">Subseção</h3><h4 data-heading-level="3">Detalhe</h4>';
  const root = createStrategyPrintRoot(content, 'Guia');
  expect([...root.querySelectorAll('[data-print-toc] li')].map(li => li.getAttribute('data-toc-level'))).toEqual(['1', '2']);
});
it('abre detalhes, preserva fontes e figuras e exclui controles na cópia', () => {
  const content = document.createElement('article');
  content.innerHTML = '<label data-print-exclude>Controle</label><details><summary>Análise</summary><p>Explicação</p></details><div hidden class="hidden" data-print-only>Fonte</div><img src="data:image/png;base64,AA" alt="Mapa">';
  const root = createStrategyPrintRoot(content, 'Guia');
  expect(root.querySelector('label')).toBeNull();
  expect(root.querySelector('details')!.open).toBe(true);
  expect(content.querySelector('details')!.open).toBe(false);
  expect(root.querySelector('[data-print-only]')).not.toHaveClass('hidden');
  expect(root.querySelector('[data-print-only]')).not.toHaveAttribute('hidden');
  expect(root.querySelector('[data-print-content] img')).toHaveAttribute('alt', 'Mapa');
});
it.each([['Biologia', 'biology'], ['Física', 'physics'], ['História', 'history'], ['Química', 'chemistry'], ['Matemática', 'mathematics']])('preserva a capa e metadados de %s', (subject, art) => {
  const content = document.createElement('article');
  Object.assign(content.dataset, { printSubject: subject, printTopic: 'Tópico <teste>', printBoard: 'FUVEST' });
  const root = createStrategyPrintRoot(content, 'Guia');
  expect(root.querySelector('[data-print-cover]')).toHaveAttribute('data-print-art', art);
  expect(root.querySelector('[data-print-cover] h1')!.textContent).toBe('Tópico <teste>');
  expect(root.querySelector('teste')).toBeNull();
  expect(root.querySelector('[data-print-cover-field="board"]')!.textContent).toContain('FUVEST');
  expect(root.querySelector('[data-print-illustration]')).toBeTruthy();
});
it('não elimina entradas de um sumário extenso', () => {
  const content = document.createElement('article');
  content.innerHTML = Array.from({length: 70}, (_, i) => `<h2>Seção ${i}</h2><p>Texto.</p>`).join('');
  expect(createStrategyPrintRoot(content, 'Guia').querySelectorAll('[data-toc-page]')).toHaveLength(70);
});
it('revisão exporta gabarito em bloco final separado após as fontes, sem alterar a tela',()=>{
  const content=document.createElement('article');
  content.dataset.printPurpose='Revisão estratégica';
  content.innerHTML='<h2>Recuperação ativa</h2><p>Pergunta</p><details data-review-answer-key><summary>Abrir depois</summary><p>Resposta</p></details><details><summary>Fontes</summary><p>Referências</p></details>';
  const root=createStrategyPrintRoot(content,'Revisão');
  const printable=root.querySelector('[data-print-content]')!;
  expect(printable.lastElementChild).toHaveAttribute('data-print-answer-key');
  expect(printable.lastElementChild?.textContent).toContain('Gabarito da recuperação ativa');
  expect(content.querySelector('details')?.open).toBe(false);
  expect(root.querySelector('[data-print-cover-collection]')?.textContent).toBe('CADERNOS DE REVISÃO');
});
it('revisão e aprofundamento da mesma matéria recebem composições próprias, e cada exportação tem outra capa',()=>{
 const content=document.createElement('article');
 Object.assign(content.dataset,{printSubject:'Biologia',printTopic:'Genética',printBoard:'FUVEST',printPurpose:'Aprofundamento'});
 content.innerHTML='<h2>Herança genética</h2><p>Texto preservado.</p>';
 const first=createStrategyPrintRoot(content,'Genética');
 const next=createStrategyPrintRoot(content,'Genética');
 const firstImage=first.querySelector('img[data-print-illustration]')!.getAttribute('src');
 expect(next.querySelector('img[data-print-illustration]')!.getAttribute('src')).not.toBe(firstImage);
 content.dataset.printPurpose='Revisão estratégica';
 const review=createStrategyPrintRoot(content,'Genética');
 expect(review.querySelector('img[data-print-illustration]')!.getAttribute('src')).not.toBe(firstImage);
 expect(review.querySelector('[data-print-cover]')).toHaveAttribute('data-print-material','review');
 expect(review.querySelector('[data-print-content]')!.textContent).toContain('Texto preservado.');
 expect(content.dataset.printCoverEdition).toBeUndefined();
});
it('preserva a ilustração inteira na revisão, sem recorte em medalhão',()=>{
 const content=document.createElement('article');
 Object.assign(content.dataset,{printSubject:'Matemática',printTopic:'Geometria Plana',printPurpose:'Revisão estratégica'});
 const root=createStrategyPrintRoot(content,'Geometria');
 const source=root.querySelector<HTMLImageElement>('[data-print-illustration]')!.src;
 const svg=decodeURIComponent(source.split(',').slice(1).join(','));
 expect(svg).toContain('width="400" height="500"');
 expect(svg).not.toMatch(/clipPath|medallion|<ellipse|scale\(-1/);
});
