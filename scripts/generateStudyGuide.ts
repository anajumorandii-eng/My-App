import { readFileSync, writeFileSync } from 'node:fs';
import { studyProtocols, studyBoardProfiles, studyAreaForTopic } from '../src/data/studyProtocols';
import { mockTopics } from '../src/data/mockData';
const root = new URL('../', import.meta.url);
let markdown = readFileSync(new URL('docs/estudos-2026/guia-base.md', root), 'utf8');
for (const protocol of studyProtocols) {
  markdown += `\n## ${protocol.subject}: protocolo de resolução e revisão\n\n${protocol.focus}\n\n${protocol.steps.map((step, i) => `${i+1}. ${step}`).join('\n')}\n\n**Conferência:** ${protocol.check}\n\n**Exemplo resolvido autoral:** ${protocol.example.prompt}\n\n${protocol.example.solution.map((step, i) => `${i+1}. ${step}`).join('\n')}\n\n**Transferência — tente antes de conferir:** ${protocol.example.transfer}\n\n**Critérios de resposta:** ${protocol.example.expected}\n\n**Pegadinhas com correção:**\n\n${protocol.pitfalls.map((pitfall) => `- ${pitfall}`).join('\n')}\n\n**Como revisar:** ${protocol.review}\n`;
}
markdown += '\n## Como preparar cada banca\n\nAs orientações abaixo são roteiros didáticos; diferenças de tópico devem ser confrontadas com questões identificadas, não inferidas de uma regra geral da banca.\n';
for (const profile of studyBoardProfiles) markdown += `\n### ${profile.board}\n\n${profile.format}\n\n${profile.training}\n\n[Fonte institucional${profile.confirmed ? '' : ' — confirmação pendente'}](${profile.source})\n`;
markdown += '\n## Índice de tópicos disponíveis no guia do app\n\nOs 105 tópicos do currículo podem ser selecionados na tela de estratégias; o capítulo permite recorte mais preciso. Isso indica acesso ao currículo, não revisão humana de todo guia gerado.\n\n| Área | Tópico | Capítulos cadastrados |\n|---|---|---|\n';
for (const topic of mockTopics) markdown += `| ${studyAreaForTopic(topic)} | ${topic.name} | ${topic.chapters?.length ?? 0} |\n`;
writeFileSync(new URL('docs/estudos-2026/guia-de-estudo.md', root), markdown);
const escape = (value: string) => value.replace(/[&<>"']/g, (c) => ({'&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'}[c]!));
const inline = (value: string) => escape(value).replace(/\[([^\]]+)\]\((https:\/\/[^)]+)\)/g, '<a href="$2" target="_blank" rel="noreferrer">$1</a>').replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
const slug = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'');
const blocks = markdown.trim().split(/\n\s*\n/);
const toc: string[] = [];
const body = blocks.map((block) => {
  if (block.startsWith('# ')) return `<h1>${inline(block.slice(2))}</h1>`;
  if (block.startsWith('## ')) { const title = block.slice(3); const id = slug(title); toc.push(`<a href="#${id}">${escape(title)}</a>`); return `<h2 id="${id}">${inline(title)}</h2>`; }
  if (block.startsWith('### ')) return `<h3>${inline(block.slice(4))}</h3>`;
  if (block.startsWith('|')) { const rows = block.split('\n').filter((row) => !/^\|[-\s|]+\|$/.test(row)); return `<div class="table-scroll"><table>${rows.map((row,i) => `<tr>${row.split('|').slice(1,-1).map((cell) => `<${i===0?'th':'td'}>${inline(cell.trim())}</${i===0?'th':'td'}>`).join('')}</tr>`).join('')}</table></div>`; }
  if (/^\d+\. /.test(block)) return `<ol>${block.split('\n').map((line) => `<li>${inline(line.replace(/^\d+\. /,''))}</li>`).join('')}</ol>`;
  if (block.startsWith('- ')) return `<ul>${block.split('\n').map((line) => `<li>${inline(line.slice(2))}</li>`).join('')}</ul>`;
  return `<p>${inline(block.replace(/\n/g,' '))}</p>`;
}).join('\n');
const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Guia de estudo e revisão · CRIVO</title><link rel="stylesheet" href="study-guide.css"></head><body><header class="masthead"><a href="/estrategias">CRIVO · voltar às estratégias</a><div><button type="button" onclick="window.print()">Imprimir / salvar PDF</button><a href="study-guide.pdf">Baixar PDF</a></div></header><div class="layout"><aside><details open><summary>Consultar por seção</summary><nav aria-label="Seções do guia">${toc.join('')}</nav></details></aside><main>${body}<footer>Este guia é material complementar. Use as fontes, pergunte sobre o que não ficou claro e registre tentativas antes de conferir respostas.</footer></main></div></body></html>`;
writeFileSync(new URL('public/study-guide.html', root), html);
console.log(`Guia gerado: ${studyProtocols.length} áreas, ${mockTopics.length} tópicos no índice e ${toc.length} seções.`);
