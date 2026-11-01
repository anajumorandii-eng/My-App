/**
 * Probabilidade histórica de cobrança no ENEM, por assunto e capítulo.
 * Reaplicável: npx tsx scripts/analisar-enem-probabilidades.mts
 *
 * Corpus: as oito aplicações regulares 2018–2025 do banco (public/questions.json),
 * 180 itens por edição, já classificadas por assunto (topicId) e capítulo.
 * A FUVEST foi medida por n/N e recorrência por edição; aqui o mesmo desenho é
 * estendido com uma estimativa explícita de "cair pelo menos uma vez" e um
 * retroteste (2018–2024 prevendo 2025), porque um número de probabilidade sem
 * verificação contra uma prova real seria só um percentual bonito.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { mockTopics } from '../src/data/mockData';

type Q = { id: string; topicId: string; subject: string; chapter?: string; examSource?: { board?: string; year?: number; questionNumber?: number } };
const bank = JSON.parse(await readFile('public/questions.json', 'utf8')) as Q[];
const topicName = new Map(mockTopics.map(t => [t.id, t.name]));

// Um item por (ano, número): ids "completo" e "expansao" descrevem a mesma prova.
const items = new Map<string, Q & { year: number; n: number }>();
for (const q of bank) {
  const s = q.examSource;
  if (s?.board !== 'ENEM' || !s.year || !s.questionNumber || s.year < 2018 || s.year > 2025) continue;
  const key = `${s.year}:${s.questionNumber}`;
  if (!items.has(key)) items.set(key, { ...q, year: s.year, n: s.questionNumber });
}
const YEARS = [2018, 2019, 2020, 2021, 2022, 2023, 2024, 2025];
const all = [...items.values()];
for (const y of YEARS) {
  const c = all.filter(q => q.year === y).length;
  if (c < 170) throw new Error(`Edição ${y} incompleta no banco: ${c} itens`);
}

// Peso por recência: meia-vida de ~4 edições. Mudanças de matriz e de estilo
// (ex.: a virada de 2020/2021 com mais leitura de dados) fazem o passado
// distante valer menos, sem descartá-lo.
const DECAY = 0.84;
type Row = { key: string; subject: string; label: string; perYear: number[]; total: number; presence: number; pAtLeastOne: number; expected: number; trend: number };

function score(perYear: number[], years: number[]): { p: number; lambda: number; trend: number } {
  const last = years[years.length - 1];
  let wSum = 0, wPres = 0, wCount = 0;
  years.forEach((y, i) => { const w = DECAY ** (last - y); wSum += w; wPres += w * (perYear[i] > 0 ? 1 : 0); wCount += w * perYear[i]; });
  const lambda = wCount / wSum;
  // Duas leituras da mesma história e a mais prudente das duas:
  // presença suavizada (Laplace) e Poisson com a média ponderada.
  const presence = (wPres + 0.5) / (wSum + 1);
  const poisson = 1 - Math.exp(-lambda);
  const p = Math.min(presence, poisson) * 0.5 + Math.max(presence, poisson) * 0.5;
  const mean = years.reduce((a, y) => a + y, 0) / years.length;
  const mk = perYear.reduce((a, k) => a + k, 0) / perYear.length;
  const num = years.reduce((a, y, i) => a + (y - mean) * (perYear[i] - mk), 0);
  const den = years.reduce((a, y) => a + (y - mean) ** 2, 0);
  return { p, lambda, trend: num / den };
}

function build(keyOf: (q: Q) => string | null, labelOf: (k: string, q: Q) => string, years: number[]): Row[] {
  const groups = new Map<string, { subject: string; label: string; perYear: number[] }>();
  for (const q of all) {
    if (!years.includes(q.year)) continue;
    const k = keyOf(q); if (!k) continue;
    const g = groups.get(k) ?? { subject: q.subject, label: labelOf(k, q), perYear: years.map(() => 0) };
    g.perYear[years.indexOf(q.year)]++;
    groups.set(k, g);
  }
  return [...groups].map(([key, g]) => {
    const s = score(g.perYear, years);
    return { key, ...g, total: g.perYear.reduce((a, b) => a + b, 0), presence: g.perYear.filter(Boolean).length, pAtLeastOne: s.p, expected: s.lambda, trend: s.trend };
  }).sort((a, b) => b.pAtLeastOne - a.pAtLeastOne || b.expected - a.expected);
}

const byTopic = (q: Q) => q.topicId;
const topicLabel = (k: string) => topicName.get(k) ?? k;
const byChapter = (q: Q) => (q.chapter ? `${q.topicId}::${q.chapter}` : null);
const chapterLabel = (k: string) => `${k.split('::')[1]} (${topicLabel(k.split('::')[0])})`;

const topics = build(byTopic, topicLabel, YEARS);
const chapters = build(byChapter, chapterLabel, YEARS);

// Retroteste: modelo treinado em 2018–2024 prevê presença em 2025.
function backtest(keyOf: (q: Q) => string | null, labelOf: (k: string, q: Q) => string) {
  const train = build(keyOf, labelOf, YEARS.slice(0, -1));
  const seen2025 = new Set(all.filter(q => q.year === 2025).map(keyOf).filter(Boolean) as string[]);
  const universe = new Set([...train.map(r => r.key), ...seen2025]);
  const pred = new Map(train.map(r => [r.key, r.pAtLeastOne]));
  let brier = 0, naive = 0;
  const base = train.length ? [...seen2025].filter(k => pred.has(k)).length / universe.size : 0;
  for (const k of universe) { const y = seen2025.has(k) ? 1 : 0; brier += ((pred.get(k) ?? 0.05) - y) ** 2; naive += (base - y) ** 2; }
  const bins = [[0.8, 1.01], [0.6, 0.8], [0.4, 0.6], [0.2, 0.4], [0, 0.2]].map(([lo, hi]) => {
    const ks = [...universe].filter(k => (pred.get(k) ?? 0.05) >= lo && (pred.get(k) ?? 0.05) < hi);
    return { faixa: `${Math.round(lo * 100)}–${Math.min(100, Math.round(hi * 100))}%`, n: ks.length, caiu: ks.filter(k => seen2025.has(k)).length };
  });
  const top = train.slice(0, 30);
  return { brier: brier / universe.size, naive: naive / universe.size, bins, top30Hit: top.filter(r => seen2025.has(r.key)).length, unseenThatAppeared: [...seen2025].filter(k => !pred.has(k)).length };
}
const btTopic = backtest(byTopic, topicLabel);
const btChapter = backtest(byChapter, chapterLabel);

const pct = (x: number) => `${Math.round(x * 100)}%`;
const arrow = (t: number) => (t > 0.12 ? '↑' : t < -0.12 ? '↓' : '→');
const subjects = [...new Set(all.map(q => q.subject))].sort((a, b) => all.filter(q => q.subject === b).length - all.filter(q => q.subject === a).length);
const perEdition = (s: string) => (all.filter(q => q.subject === s).length / YEARS.length).toFixed(1);

const L: string[] = [];
L.push('# ENEM 2026: o que tem maior probabilidade de cair', '');
L.push(`Gerado por \`scripts/analisar-enem-probabilidades.mts\` a partir de ${all.length} itens das oito aplicações regulares 2018–2025 do banco (Inglês como língua estrangeira). Provas em 8 e 15/11/2026.`, '');
L.push('## Como ler', '');
L.push('- **P(cair)**: estimativa de aparecer **pelo menos uma questão** do assunto no ENEM 2026. Média de duas leituras do histórico ponderado por recência (peso 0,84 por ano de distância): presença por edição suavizada e Poisson sobre a média de questões.');
L.push('- **Questões esperadas**: média ponderada de itens por edição. **Edições**: em quantas das 8 provas o assunto apareceu. **Tendência**: inclinação de 2018 a 2025 (↑ / → / ↓).');
L.push('- A classificação por assunto e capítulo é a do banco (uma classificação editorial por questão), não oficial do Inep. Assunto que aparece pouco aqui pode estar escondido dentro de uma questão classificada em outro assunto — interdisciplinaridade é a regra no ENEM.');
L.push('- Probabilidade de cair não é peso na nota: na TRI, a questão fácil que você erra pesa mais que a difícil. Prioridade real = P(cair) × quanto você ainda erra o assunto.', '');
L.push('## O modelo acerta? Retroteste 2018–2024 → 2025', '');
L.push('Antes de confiar nos números de 2026, o mesmo cálculo foi feito só com 2018–2024 e comparado com a prova de 2025.', '');
L.push('|Nível|Brier do modelo|Brier de referência (taxa única)|Top-30 previstos que caíram em 2025|Caíram sem histórico|');
L.push('|---|---|---|---|---|');
L.push(`|Assunto|${btTopic.brier.toFixed(3)}|${btTopic.naive.toFixed(3)}|${btTopic.top30Hit}/30|${btTopic.unseenThatAppeared}|`);
L.push(`|Capítulo|${btChapter.brier.toFixed(3)}|${btChapter.naive.toFixed(3)}|${btChapter.top30Hit}/30|${btChapter.unseenThatAppeared}|`, '');
L.push('Calibração por faixa (assunto): ' + btTopic.bins.map(b => `${b.faixa}: ${b.caiu}/${b.n}`).join(' · ') + '.', '');
L.push('Calibração por faixa (capítulo): ' + btChapter.bins.map(b => `${b.faixa}: ${b.caiu}/${b.n}`).join(' · ') + '.', '');
L.push('Brier menor que a referência significa que o histórico separa de fato o que cai do que não cai. Capítulo é mais incerto que assunto: o currículo tem muitos capítulos e cada prova escolhe poucos.', '');

L.push('## Top 40 assuntos de todo o exame', '');
L.push('|#|Matéria|Assunto|P(cair)|Questões esperadas|Edições|Tendência|2018→2025|');
L.push('|---|---|---|---|---|---|---|---|');
topics.slice(0, 40).forEach((r, i) => L.push(`|${i + 1}|${r.subject}|${r.label}|${pct(r.pAtLeastOne)}|${r.expected.toFixed(1)}|${r.presence}/8|${arrow(r.trend)}|${r.perYear.join(' ')}|`));
L.push('');

L.push('## Por matéria: assuntos e capítulos', '');
for (const s of subjects) {
  L.push(`### ${s} — ${perEdition(s)} questões por edição`, '');
  L.push('|Assunto|P(cair)|Esperadas|Edições|Tend.|2018→2025|', '|---|---|---|---|---|---|');
  topics.filter(r => r.subject === s).forEach(r => L.push(`|${r.label}|${pct(r.pAtLeastOne)}|${r.expected.toFixed(1)}|${r.presence}/8|${arrow(r.trend)}|${r.perYear.join(' ')}|`));
  const ch = chapters.filter(r => r.subject === s && r.presence >= 3).slice(0, 12);
  if (ch.length) {
    L.push('', `**Capítulos mais recorrentes de ${s}** (3+ edições):`, '');
    L.push('|Capítulo|P(cair)|Edições|2018→2025|', '|---|---|---|---|');
    ch.forEach(r => L.push(`|${r.label}|${pct(r.pAtLeastOne)}|${r.presence}/8|${r.perYear.join(' ')}|`));
  }
  L.push('');
}

await mkdir('docs/estudos-2026/enem-incidencia', { recursive: true });
await writeFile('docs/estudos-2026/enem-incidencia/probabilidades-2026.md', L.join('\n') + '\n');
await writeFile('docs/estudos-2026/enem-incidencia/probabilidades-2026.json', JSON.stringify({
  generatedFrom: 'public/questions.json', editions: YEARS, items: all.length, decay: DECAY,
  backtest: { topic: btTopic, chapter: btChapter },
  topics: topics.map(r => ({ ...r, label: r.label, pAtLeastOne: +r.pAtLeastOne.toFixed(3), expected: +r.expected.toFixed(2), trend: +r.trend.toFixed(3) })),
  chapters: chapters.map(r => ({ ...r, pAtLeastOne: +r.pAtLeastOne.toFixed(3), expected: +r.expected.toFixed(2), trend: +r.trend.toFixed(3) })),
}, null, 1) + '\n');
console.log(`itens ${all.length}; assuntos ${topics.length}; capítulos ${chapters.length}`);
console.log('retroteste assunto', btTopic, 'capítulo', btChapter);
