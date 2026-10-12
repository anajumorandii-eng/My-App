/**
 * Etapa → o que a cena mostra.
 *
 * O palco imersivo entrega a toda cena a etapa ativa do trilho (intuição,
 * conceito, aplicação, estratégia, exercício). Para a troca de etapa mudar a
 * cena de verdade, sem desenho novo por capítulo e sem inventar conteúdo, a
 * cena precisa saber *quais dos seus casos* cada etapa discute. A resposta já
 * está no capítulo: a seção da etapa nomeia os casos de que trata. Em Geometria
 * Molecular, "Por que isso importa" fala de CO2 e de H2O; "Pratique e confira"
 * fala de CH4 e de NH3 — então a cena da aplicação abre a água e a do exercício
 * abre a amônia, e essa escolha sai do texto que a estudante está lendo ao lado.
 *
 * Módulo puro, sem React, para rodar em `node:test`.
 */

export interface FocusCandidate {
  /** Rótulo do caso na cena (ex.: "Angular (H2O)", "Golgi"). */
  label: string;
  /** Título da seção de onde o caso foi tirado, quando a cena o registra. */
  section?: string;
}

export interface FocusSection { title: string; content: string }

export interface StageFocusPlan {
  /** Para cada etapa, os casos que ela discute, do mais citado ao menos. */
  byStep: number[][];
  /** Para cada caso, a etapa que mais o discute (é para lá que o toque leva). */
  homeStep: number[];
  /** Pontuação bruta [etapa][caso], exposta para o teste explicar a escolha. */
  scores: number[][];
}

const SUBSCRITOS: Record<string, string> = {
  '₀': '0', '₁': '1', '₂': '2', '₃': '3', '₄': '4', '₅': '5', '₆': '6', '₇': '7', '₈': '8', '₉': '9',
  '⁰': '0', '¹': '1', '²': '2', '³': '3', '⁴': '4', '⁵': '5', '⁶': '6', '⁷': '7', '⁸': '8', '⁹': '9',
};

// Palavras que aparecem em qualquer rótulo e não identificam caso nenhum.
const VAZIAS = new Set([
  'para', 'com', 'sem', 'entre', 'sobre', 'como', 'mais', 'menos', 'pelo', 'pela', 'pelos', 'pelas',
  'dos', 'das', 'nos', 'nas', 'uma', 'uns', 'umas', 'que', 'por', 'ate', 'apos', 'sua', 'seu',
  'outro', 'outra', 'tipo', 'caso', 'fase', 'etapa', 'nivel', 'grupo', 'efeito', 'processo',
]);

export function normalizeFocusText(text: string): string {
  return text
    .replace(/[₀-₉⁰-⁹]/g, (char) => SUBSCRITOS[char] ?? char)
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

// "transformações" e "transformação" precisam casar, e o plural simples também.
// A raiz é comparada por prefixo, então só o fim da palavra é aparado — e com
// cuidado: aparar duas letras de "angular" dava "angul", que casava com
// "ângulos" e punha a água em toda etapa que citasse um ângulo.
function raiz(token: string): string {
  let t = token.replace(/coes$/, 'cao').replace(/oes$/, 'ao').replace(/aes$/, 'ao');
  if (/\d/.test(t) || t.length <= 4) return t;
  if (t.endsWith('s')) t = t.slice(0, -1);
  if (t.length >= 5 && /[aeiou]$/.test(t)) t = t.slice(0, -1);
  return t;
}

function casa(termo: string, token: string): boolean {
  if (/\d/.test(termo) || termo.length <= 4) return token === termo || token === `${termo}s`;
  return token.startsWith(termo);
}

/** Termos que identificam o caso: palavras com 3+ letras (fora as vazias) e fórmulas. */
export function focusTerms(label: string): string[] {
  const tokens = normalizeFocusText(label).split(' ').filter(Boolean);
  const termos = tokens.filter((token) => /\d/.test(token) ? /[a-z]/.test(token) : token.length >= 3 && !VAZIAS.has(token));
  return [...new Set(termos.map(raiz))];
}

function tokensDe(text: string): string[] {
  return normalizeFocusText(text).split(' ').filter(Boolean).map((token) => token.replace(/coes$/, 'cao').replace(/oes$/, 'ao').replace(/aes$/, 'ao'));
}

/** Quantas vezes os termos do caso aparecem no texto. Fórmula vale o dobro: é específica. */
export function focusScore(candidate: FocusCandidate, text: string): number {
  const termos = focusTerms(candidate.label);
  if (termos.length === 0) return 0;
  const tokens = tokensDe(text);
  let total = 0;
  let presentes = 0;
  for (const termo of termos) {
    const peso = /\d/.test(termo) ? 2 : 1;
    let achou = 0;
    for (const token of tokens) if (casa(termo, token)) achou += peso;
    if (achou > 0) presentes += 1;
    total += achou;
  }
  // Rótulo de várias palavras só conta se o texto trouxer ao menos duas delas
  // (as duas, num rótulo de duas): "veias" solto num parágrafo sobre vasos não
  // é citação das "veias cavas".
  if (presentes < Math.min(2, termos.length)) total = 0;
  // Rótulo de duas palavras ("ventrículo direito") vale mais quando aparece
  // inteiro: contar só "ventrículo" e "direito" soltos empatava o lado direito
  // com o esquerdo em todo parágrafo que fala dos dois ventrículos.
  if (termos.length >= 2) {
    const frase = ` ${normalizeFocusText(candidate.label).replace(/\s*\d+\s*/g, ' ').trim()} `;
    const corpo = ` ${normalizeFocusText(text)} `;
    if (frase.trim().split(' ').length >= 2) total += 3 * (corpo.split(frase).length - 1);
  }
  return total;
}

/**
 * Distribui os casos da cena pelas etapas do capítulo.
 *
 * Um caso que nenhuma seção cita vai para a etapa da seção de onde foi tirado
 * (`section`); sem isso, para a etapa de conceito. Toda etapa de origem inclui
 * os casos que moram nela, de modo que tocar num caso e ir para a etapa dele
 * nunca troca o caso tocado por outro.
 */
export function planStageFocus(candidates: FocusCandidate[], sections: FocusSection[]): StageFocusPlan {
  const scores = sections.map((section) => candidates.map((candidate) =>
    focusScore(candidate, `${section.title} ${section.content}`)));
  const conceito = Math.min(1, Math.max(0, sections.length - 1));
  const homeStep = candidates.map((candidate, index) => {
    let best = -1;
    let bestScore = 0;
    scores.forEach((row, step) => { if (row[index] > bestScore) { bestScore = row[index]; best = step; } });
    if (best >= 0) return best;
    const origem = candidate.section ? sections.findIndex((section) => section.title === candidate.section) : -1;
    return origem >= 0 ? origem : conceito;
  });
  const byStep = sections.map((_, step) => {
    const citados = candidates.map((_, index) => index).filter((index) => scores[step][index] > 0 || homeStep[index] === step);
    return citados.sort((a, b) => (scores[step][b] - scores[step][a]) || a - b);
  });
  return { byStep, homeStep, scores };
}

/** Caso que a etapa abre: mantém o atual se a etapa também o discute. */
export function caseForStep(plan: StageFocusPlan, step: number, current: number | null): number | null {
  const focus = plan.byStep[step] ?? [];
  if (current !== null && focus.includes(current)) return current;
  return focus[0] ?? null;
}

export interface FocusRelation { id: string; label: string; keywords: string[] }

/**
 * Casos que entregariam a relação oculta em Reconstruir. A cena mantém a
 * figura (é ela que a estudante observa), mas cobre a afirmação desses casos:
 * mostrar "ângulo de 104,5°, dois pares isolados" ao lado da água daria a
 * resposta que o diagnóstico escondeu.
 */
export function casesRevealing(candidates: { label: string; claim?: string }[], relations: FocusRelation[]): number[] {
  const veiled = new Set<number>();
  for (const relation of relations) {
    const chaves = relation.keywords.map(normalizeFocusText).filter(Boolean);
    const counts = candidates.map((candidate) => {
      const texto = ` ${normalizeFocusText(`${candidate.label} ${candidate.claim ?? ''}`)} `;
      return chaves.filter((chave) => texto.includes(` ${chave}`)).length;
    });
    const max = Math.max(0, ...counts);
    if (max === 0) continue;
    counts.forEach((count, index) => { if (count === max) veiled.add(index); });
  }
  return [...veiled].sort((a, b) => a - b);
}

/** A relação de índice i é desenhada sobre a aresta de índice i (mesma convenção de Visual.tsx). */
export function hiddenRelations<R extends { id: string }>(relations: R[], edges: { id: string }[], hiddenEdgeIds: string[]): R[] {
  return edges.flatMap((edge, index) => (hiddenEdgeIds.includes(edge.id) && relations[index] ? [relations[index]] : []));
}

export interface StageParameter { min: number; max: number; step: number; unit: string; control?: string }

function numero(texto: string): number {
  return Number(texto.replace(/\./g, '').replace(',', '.'));
}

function encaixar(valor: number, p: StageParameter): number | null {
  if (!Number.isFinite(valor) || valor < p.min - 1e-9 || valor > p.max + 1e-9) return null;
  const passos = Math.round((valor - p.min) / p.step);
  const encaixado = Number((p.min + passos * p.step).toFixed(6));
  // Só aceita o valor do texto se ele cair na grade do controle: arredondar
  // 0,15 para a grade de 0,01 é fiel; transformar 37 em 40 seria inventar.
  return Math.abs(encaixado - valor) <= p.step * 0.01 + 1e-9 ? encaixado : null;
}

/**
 * Valor do parâmetro citado na etapa, quando o texto cita um número com a
 * unidade do controle e ele cabe na faixa do instrumento. Sem citação, `null`:
 * o controle fica onde a estudante deixou, em vez de pular para um valor que o
 * capítulo nunca disse.
 */
export function parameterFromText(text: string, p: StageParameter): number | null {
  const unidade = normalizeFocusText(p.unit);
  const plano = text.replace(/[₀-₉⁰-⁹]/g, (char) => SUBSCRITOS[char] ?? char);
  const candidatos: number[] = [];
  if (unidade) {
    const escapada = p.unit.trim().replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    // A barra fica de fora: "18 g/mol" é massa molar, não os 18 g de amostra
    // que o cursor de massa representa.
    const re = new RegExp(`(\\d+(?:[.,]\\d+)?)\\s*${escapada}(?![\\p{L}\\d/])`, 'giu');
    for (const match of plano.matchAll(re)) candidatos.push(numero(match[1]));
  } else if (p.control) {
    const nome = p.control.trim().split(/\s+/)[0].replace(/[.*+?^${}()|[\]\\/]/g, '\\$&');
    const re = new RegExp(`${nome}\\s*(?:de|igual a|=|próximo de|em torno de)?\\s*(\\d+(?:[.,]\\d+)?)`, 'giu');
    for (const match of plano.matchAll(re)) candidatos.push(numero(match[1]));
  }
  for (const valor of candidatos) {
    const encaixado = encaixar(valor, p);
    if (encaixado !== null) return encaixado;
  }
  return null;
}

/**
 * Frase do texto que contém o termo (para explicar um ponto da cena com o
 * próprio capítulo). Entre as frases que o citam, vence a que o traz mais cedo:
 * é nela que o termo é assunto, e não um aparte entre parênteses.
 */
export function sentenceWith(text: string, terms: string[]): string | null {
  const frases = text.split(/(?<=[.!?;])\s+|\s—\s/);
  const alvos = terms.map(normalizeFocusText).filter(Boolean);
  let melhor: { frase: string; posicao: number } | null = null;
  for (const frase of frases) {
    const n = ` ${normalizeFocusText(frase)} `;
    for (const alvo of alvos) {
      const posicao = n.indexOf(` ${alvo}`);
      if (posicao >= 0 && (!melhor || posicao < melhor.posicao)) melhor = { frase: frase.trim(), posicao };
    }
  }
  return melhor?.frase ?? null;
}
