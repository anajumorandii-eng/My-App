import { renderToStaticMarkup } from 'react-dom/server';
import AiTextRenderer from '../src/components/AiTextRenderer';
import { SourceParagraphs } from '../src/components/SourceParagraphs';
import { createStrategyPrintRoot } from '../src/lib/printStrategyGuide';
import { printStyles } from '../src/lib/printStyles';
import { nativeMathPrintStyles } from '../src/lib/printPdfFile';
import records from '../src/data/deepSummaryContent.json';
import { mockTopics } from '../src/data/mockData';

export function fixture(subject: string, topic: string, stress = false) {
  const chapters = mockTopics.find(entry => entry.name === topic)?.chapters ?? [topic];
  const selected = chapters.flatMap(chapter => records.filter(record => record.subject === subject && record.topic === chapter));
  if (!selected.length) throw new Error(`Missing editorial content: ${subject} / ${topic}`);
  const article = document.createElement('article');
  Object.assign(article.dataset, { printSubject: subject, printTopic: topic, printBoard: 'FUVEST', printPurpose: 'Revisão do gerador com conteúdo editorial disponível' });
  const markdown = selected.map(record => `## ${record.topic}\n\n` + record.sections.map(section => `### ${section.title}\n\n${section.content}`).join('\n\n')).join('\n\n');
  article.innerHTML = renderToStaticMarkup(<AiTextRenderer text={markdown} />);
  const editorialText = article.textContent;
  if (subject === 'Física') article.insertAdjacentHTML('beforeend', renderToStaticMarkup(<AiTextRenderer text={String.raw`## Verificação de fórmulas e etapas (teste de layout)

1. Defina os dados e a orientação.
2. Calcule o deslocamento:

   $$
   \Delta s = v_0t + \frac{at^2}{2}
   $$

3. Confira a velocidade final:

   $$
   \begin{aligned}
   v^2 &= v_0^2 + 2a\Delta s \\
   \Delta s &= \frac{v^2-v_0^2}{2a}
   \end{aligned}
   $$
`} />));
  if (stress) {
    article.insertAdjacentHTML('beforeend', '<h2>Diagrama — teste de unidade visual</h2><figure><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 600 160"><g fill="none" stroke="#145a60"><rect x="10" y="40" width="180" height="80"/><path d="M190 80H390"/><rect x="390" y="40" width="200" height="80"/></g><g fill="#263c3d" font-size="22"><text x="30" y="85">Observação</text><text x="410" y="85">Explicação</text></g></svg><figcaption>Figura sintética para verificar a preservação do diagrama e da legenda.</figcaption></figure>');
    const paragraph = selected[0].sections[0].content;
    article.insertAdjacentHTML('beforeend', '<h2>Tabela extensa — dados sintéticos de validação</h2><table><thead><tr><th>Registro</th><th>Descrição</th><th>Valor</th></tr></thead><tbody>' + Array.from({length: 95}, (_, index) => `<tr><td>Registro ${index + 1}</td><td>Verificação da continuidade e da repetição do cabeçalho.</td><td>${index * 3}</td></tr>`).join('') + '</tbody></table>');
    article.insertAdjacentHTML('beforeend', '<h2>Fontes e apoio — teste de continuidade</h2>' + renderToStaticMarkup(<SourceParagraphs text={Array(8).fill(paragraph).join('\n\n')} />));
    article.insertAdjacentHTML('beforeend', Array.from({length: 48}, (_, i) => `<h2>Seção de navegação extensa ${i + 1}</h2><p>Conteúdo sintético para verificar um sumário com mais de uma página e títulos consecutivos.</p>`).join(''));
  }
  const root = createStrategyPrintRoot(article, `${subject} — ${topic} — FUVEST`);
  return { html: `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><style>${printStyles}\n${nativeMathPrintStyles}</style></head><body>${root.outerHTML}</body></html>`, sourceText: editorialText, entries: [...root.querySelectorAll('[data-toc-page]')].map(entry => entry.getAttribute('data-toc-page')!) };
}
