import type { InteractiveSummary } from '../types/summary';

export interface ReadingSection { id: string; label: string; }

/** Copia a leitura já renderizada, preservando o material e o estado de estudo originais. */
export function prepareStudyReading(source: HTMLElement, prefix: string) {
  const content = source.cloneNode(true) as HTMLElement;
  const originals = source.querySelectorAll<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>('input,textarea,select');
  content.querySelectorAll('input,textarea,select').forEach((field, index) => {
    const original = originals[index];
    const value = document.createElement('p');
    value.style.whiteSpace = 'pre-wrap';
    value.textContent = original instanceof HTMLSelectElement ? original.selectedOptions[0]?.textContent ?? '' : original instanceof HTMLInputElement && ['checkbox', 'radio'].includes(original.type) ? (original.checked ? 'Marcado' : 'Não marcado') : original.value;
    field.replaceWith(value);
  });
  // A consulta mantém referências, sem repetir os textos brutos usados como insumo da explicação.
  content.querySelectorAll('script,style,iframe,object,embed,audio,video,form,nav,[data-print-exclude],[data-reader-exclude],[data-study-source] [data-source-content]').forEach(element => element.remove());
  content.querySelectorAll('button').forEach(button => {
    if (button.querySelector('h1,h2,h3,h4,h5,h6')) button.replaceWith(...button.childNodes);
    else button.remove();
  });
  content.querySelectorAll<HTMLElement>('[data-print-only]').forEach(element => { element.hidden = false; element.classList.remove('hidden'); element.style.display = 'block'; });
  content.querySelectorAll<HTMLElement>('[class]').forEach(element => {
    [...element.classList].filter(name => name.startsWith('dark:')).forEach(name => element.classList.remove(name));
  });
  content.querySelectorAll('[data-review-answer-key]').forEach(element => element.removeAttribute('open'));
  content.querySelectorAll<HTMLElement>('[data-heading-level="1"],[data-heading-level="2"]').forEach(heading => {
    const replacement = document.createElement('h2'); replacement.append(...heading.childNodes); replacement.id = heading.id; heading.replaceWith(replacement);
  });
  // SVGs e âncoras usam IDs próprios: o original continua montado atrás da leitura.
  const ids = new Map<string, string>();
  content.querySelectorAll('[id]').forEach((element, index) => { if (element.id) { ids.set(element.id, `${prefix}-id-${index}`); element.id = ids.get(element.id)!; } else element.removeAttribute('id'); });
  content.querySelectorAll('*').forEach(element => {
    for (const attr of [...element.attributes]) {
      if (attr.name.startsWith('on')) element.removeAttribute(attr.name);
      else {
        let value = attr.value.replace(/url\(#([^)]*)\)/g, (all, id) => ids.has(id) ? `url(#${ids.get(id)})` : all);
        if (['href', 'xlink:href'].includes(attr.name) && value.startsWith('#') && ids.has(value.slice(1))) value = `#${ids.get(value.slice(1))}`;
        if (['aria-labelledby', 'aria-describedby'].includes(attr.name)) value = value.split(' ').map(id => ids.get(id) ?? id).join(' ');
        if (value !== attr.value) element.setAttribute(attr.name, value);
      }
    }
  });
  const sections: ReadingSection[] = [];
  content.querySelectorAll('h1,h2,h3,h4,h5,h6').forEach((heading, index) => {
    if (heading.closest('[data-review-answer-key]') || !heading.textContent?.trim()) return;
    heading.id ||= `${prefix}-section-${index}`;
    sections.push({ id: heading.id, label: heading.textContent.trim() });
  });
  return { content, sections };
}

/** O capítulo completo vem dos dados; seções recolhidas na tela não podem desaparecer do guia. */
export function summaryReadingContent(summary: InteractiveSummary) {
  const root = document.createElement('article');
  const add = (tag: string, text: string, parent = root) => { const element = document.createElement(tag); element.textContent = text; parent.append(element); return element; };
  add('p', `${summary.subject} · ${summary.topic}`);
  add('p', summary.contentStatus === 'roteiro' ? 'Roteiro inicial · aprofundamento pendente' : summary.contentStatus === 'aprofundado' ? 'Capítulo aprofundado · exemplos resolvidos e prática' : 'Material de estudo');
  add('p', summary.overview);
  add('h2', 'Pré-requisitos'); add('p', summary.prerequisites.join(' · '));
  const stages = { intuicao: 'Intuição', conceito: 'Conceito', aplicacao: 'Aplicação', exercicio: 'Exercício', estrategia: 'Estratégia de prova' };
  const evidence = { fato: 'Fato confirmado', contexto: 'Contexto estrutural', interpretacao: 'Interpretação sustentada', hipotese: 'Hipótese / cenário' };
  for (const section of summary.sections) {
    add('h2', section.title);
    add('p', stages[section.stage] + (section.evidenceKind ? ` · ${evidence[section.evidenceKind]}` : ''));
    add('p', section.content).style.whiteSpace = 'pre-line';
    if (section.callout) add('blockquote', section.callout);
  }
  if (summary.boards.length) { add('h2', 'Orientações por banca'); for (const board of summary.boards) { add('h3', board.board); if (board.guidance) add('p', board.guidance); } }
  if (summary.retrieval.length) {
    add('h2', 'Recuperação ativa'); add('p', 'Tente responder sem consulta. Volte ao resumo para registrar sua resposta e conferir a correção.');
    const list = add('ol', '');
    for (const question of summary.retrieval) add('li', question.prompt, list);
  }
  if (summary.sources.length) {
    add('h2', 'Fontes'); const list = add('ul', '');
    for (const source of summary.sources) { const item = add('li', source.label, list); if (source.url && /^https?:\/\//i.test(source.url)) { const link = add('a', ' Consultar fonte', item) as HTMLAnchorElement; link.href = source.url; link.target = '_blank'; link.rel = 'noreferrer'; } }
  }
  return root;
}

export type ResolutionReadingSection = 'metodo' | 'materia' | 'banca' | 'segunda-fase';
export function resolutionReadingContent(section: ResolutionReadingSection, data: {
  method: import('../data/resolutionStrategies').ResolutionStep[];
  subjects: import('../data/resolutionStrategies').SubjectStrategy[];
  boards: import('../data/resolutionStrategies').BancaStrategy[];
  protocols: import('../data/resolutionStrategies').SecondPhaseProtocol[];
}) {
  const root = document.createElement('article');
  const add = (tag: string, text: string, parent = root) => { const element = document.createElement(tag); element.textContent = text; parent.append(element); return element; };
  const list = (title: string, items: string[]) => { add('h3', title); const node = add('ul', ''); items.forEach(item => add('li', item, node)); };
  if (section === 'metodo') for (const step of data.method) { add('h2', `${step.step}. ${step.title}`); add('p', step.description); }
  if (section === 'materia') for (const subject of data.subjects) { add('h2', subject.subject); list('Estratégias de resolução', subject.tips); list('Pegadinhas comuns', subject.pitfalls); }
  if (section === 'banca') for (const board of data.boards) { add('h2', board.board); add('p', board.profile); add('h3', 'Como preparar a resolução'); add('p', board.examStrategy); }
  if (section === 'segunda-fase') for (const protocol of data.protocols) { add('h2', `${protocol.board} — ${protocol.name}`); add('p', protocol.scope); for (const step of protocol.steps) { add('h3', `${step.letter}. ${step.title}`); add('p', step.description); } if (protocol.responseStructure?.length) list('Estrutura recomendada de resposta', protocol.responseStructure); }
  return root;
}
