/** Creates the editorial pages of the workbook. Official PDF pages are merged unchanged afterwards. */
import { readFile, writeFile } from 'node:fs/promises';
import { mockTopics } from '../src/data/mockData';
import type { Question } from '../src/types';

const escape = (value: string) => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
async function main() {
  const target = process.argv[2];
  if (!target) throw new Error('Informe o caminho do HTML editorial de saída.');
  const bank = JSON.parse(await readFile('public/questions.json', 'utf8')) as Question[];
  const questions = bank.filter(q => q.id.startsWith('unicamp_2026_q')).sort((a, b) => a.examSource!.questionNumber! - b.examSource!.questionNumber!);
  if (questions.length !== 72 || questions.some((q, i) => q.examSource?.questionNumber !== i + 1 || !q.originalPages?.length)) {
    throw new Error('O caderno exige as 72 questões conferidas e seus originais.');
  }
  const topics = new Map(mockTopics.map(topic => [topic.id, topic.name]));
  const groups = new Map<string, number[]>();
  questions.forEach(q => groups.set(q.subject, [...(groups.get(q.subject) ?? []), q.examSource!.questionNumber!]));
  const table = [...groups].map(([subject, numbers]) => `<tr><th>${escape(subject)}</th><td>${numbers.join(', ')}</td></tr>`).join('');
  const editorial = questions.map(q => {
    const n = q.examSource!.questionNumber!;
    const title = q.prompt.split('\n')[1].replace(/^Tema de estudo: /, '').replace(/\.$/, '');
    const blocks = q.explanation.split('\n\n').slice(1).map(block => {
      const [heading, ...body] = block.split('\n');
      return `<section><h3>${escape(heading)}</h3><p>${escape(body.join('\n'))}</p></section>`;
    }).join('');
    return `<article class="sheet"><div class="kicker">Resolução e revisão · comentário autoral</div><h2>Questão ${n} — ${escape(title)}</h2><div class="meta">${escape(q.subject)} · ${escape(topics.get(q.topicId) ?? q.topicId)}<br>${escape(q.chapter ?? '')}</div><div class="source">Prova Q/X · resposta oficial ${q.correctOptionId.toUpperCase()} · página${q.originalPages!.length > 1 ? 's' : ''} ${q.originalPages!.map(p => p.page).join(', ')} do PDF original</div>${blocks}<footer>Crivo · Unicamp 2026 · caderno, página ${27 + n}</footer></article>`;
  }).join('');
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><title>Questões reais — Unicamp 2026</title><style>
  @page { size: A4; margin: 15mm; }
  *{box-sizing:border-box} body{margin:0;color:#192831;font:10.5pt/1.4 Arial,sans-serif}
  .sheet{height:267mm;position:relative;break-after:page;page-break-after:always;padding-bottom:12mm}.sheet:last-child{break-after:auto;page-break-after:auto}
  .kicker{font-size:8pt;letter-spacing:.12em;text-transform:uppercase;color:#48645d;padding:3mm 0;border-bottom:1px solid #9bb3a8;margin-bottom:7mm}
  h1,h2{font-family:Georgia,serif;line-height:1.16} h1{font-size:39pt;margin:18mm 0 8mm} h2{font-size:18pt;margin:0 0 4mm} h3{font-size:9pt;line-height:1.3;margin:4mm 0 1.5mm;color:#285849}
  p{white-space:pre-line;margin:0 0 2mm} section{break-inside:avoid} .meta{font-size:9pt;color:#435964}.source{font-size:9pt;margin:4mm 0;padding:3mm;background:#edf3ef}
  .lead{font-size:17pt;line-height:1.45;margin:6mm 0 12mm}.big{font:68pt Georgia,serif;color:#285849;margin:17mm 0 2mm}.cover-note{font-size:12pt;max-width:145mm}
  table{width:100%;border-collapse:collapse;font-size:9pt;margin:5mm 0}th,td{text-align:left;padding:2mm 3mm;border-bottom:1px solid #ccd7d2}th{width:34%}
  a{color:#285849;word-break:break-word}ul{padding-left:5mm}li{margin-bottom:2mm}footer{position:absolute;bottom:0;left:0;right:0;border-top:1px solid #ccd7d2;padding-top:2mm;font-size:8pt;color:#48645d}
  </style></head><body>
  <article class="sheet"><div class="kicker">Crivo · treino, resolução e revisão</div><h1>Questões reais<br>Unicamp 2026</h1><div class="lead">Primeira fase · provas Q/X<br>Caderno de estudo e impressão</div><div class="big">72</div><div class="cover-note">questões oficiais, com figuras e fórmulas originais.<br>144 perguntas de recuperação.<br>72 exercícios autorais de transferência.</div><p style="margin-top:15mm">A prova e o gabarito são da Comvest. As resoluções, perguntas de recuperação e transferências são comentários editoriais próprios. A edição 2026 é uma prova anterior: este caderno não contém questões da edição 2027.</p><footer>Crivo · fontes conferidas em 13/10/2026 · página 1</footer></article>
  <article class="sheet"><div class="kicker">Como usar o caderno</div><h2>Da tentativa à revisão</h2><ul><li><b>Páginas 3–26:</b> prova original completa. Resolva a questão indicada antes de consultar a resposta.</li><li><b>Página 27:</b> gabarito oficial Q/X. Confira pelo número original, sem misturar versões.</li><li><b>Páginas 28–99:</b> resolução por etapas, pegadinha, recuperação e transferência. A resolução da questão n está na página 27 + n.</li><li>Em um bloco compatível com sua agenda, resolva sem consulta e registre dados, estratégia e justificativa. Separe tempo para corrigir.</li><li>No dia seguinte, responda às perguntas de recuperação sem reler. Depois, faça a transferência e compare com os critérios.</li><li>Se houver erro, indique se foi de conceito, leitura, estratégia ou cálculo. Retome o ponto necessário e refaça em outro momento.</li></ul><h3>Localização por matéria no currículo do aplicativo</h3><p>A classificação identifica o conceito principal. Questões interdisciplinares podem atravessar outras matérias; esta tabela não é uma matriz oficial de distribuição.</p><table>${table}</table><h3>Fontes primárias</h3><p><a href="${escape(questions[0].examSource!.sourceUrl!)}">Prova oficial Q/X — Comvest</a><br><a href="${escape(questions[0].examSource!.answerKeyUrl!)}">Gabarito oficial Q/X — Comvest</a></p><footer>Crivo · as páginas da prova mantêm também a numeração impressa original · página 2</footer></article>
  ${editorial}</body></html>`;
  await writeFile(target, html);
  console.log('HTML editorial: duas páginas iniciais e 72 resoluções.');
}
main().catch(error => { console.error(error.message); process.exitCode = 1; });
