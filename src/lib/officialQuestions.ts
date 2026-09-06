/**
 * Cruza a prova extraída com o gabarito oficial e produz um rascunho de
 * questões objetivas para revisão. A CLI que usa isto está em
 * scripts/extrair-questoes-oficiais.ts; aqui fica só a lógica pura, que é o
 * que os testes exercitam.
 *
 * Regras que existem para não ensinar resposta errada:
 *
 * 1. Casa por NÚMERO explícito, nunca por posição. A Unicamp 2023 tem a
 *    questão 29 saindo depois da 33 no texto extraído; alinhar por ordem
 *    deslocaria cinco respostas silenciosamente.
 * 2. Descarta questão anulada pela banca (asterisco no gabarito).
 * 3. Descarta questão que depende de imagem, gráfico ou mapa: o texto traz a
 *    legenda, não a figura, e a questão fica sem resposta possível.
 * 4. Descarta questão cujo bloco não tenha exatamente as alternativas
 *    esperadas — alternativa faltando significa extração incompleta.
 * 5. Descarta questão com caracteres de escrita estrangeira (bengali,
 *    télugo, devanágari…). Não é conteúdo: é fórmula que o PDF desenhou com
 *    fonte simbólica e saiu mapeada para outro alfabeto. "sen గ/ଶ" no lugar
 *    de "sen π/2" é uma fórmula errada com aparência de prova oficial.
 *
 * A saída é um RASCUNHO: matéria, tópico e subtópico ainda precisam ser
 * atribuídos por quem revisa. O script não adivinha classificação.
 */
export interface Rascunho {
  numero: number;
  prompt: string;
  options: { id: string; text: string }[];
  correctOptionId: string;
  examSource: { board: string; year: number; sourceUrl: string };
}

// Palavras que denunciam dependência de um elemento visual. Ampla de
// propósito: descartar uma questão boa custa menos que publicar uma
// impossível de responder.
const VISUAL = /\b(charge|imagem|figura|gr[áa]fico|mapa|tabela|fotografia|foto|cartum|tirinha|ilustra[çc][ãa]o|esquema|diagrama|pintura|cartaz|infogr[áa]fico|a seguir|abaixo)\b/i;

// Blocos Unicode que nunca aparecem numa prova em português. Quando surgem, é
// fórmula desenhada com fonte simbólica que a extração leu como outro alfabeto.
const ESCRITA_ESTRANGEIRA = /[\u0900-\u0DFF\u0E00-\u0E7F\u0600-\u06FF\u4E00-\u9FFF\uAC00-\uD7AF]/;

function limpar(texto: string): string {
  return texto
    .replace(/¬/g, ' ')
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

/** Respostas da coluna pedida do gabarito da Fuvest (V1..V4 lado a lado). */
export function lerGabaritoFuvest(texto: string, coluna: number): Map<number, string> {
  const respostas = new Map<number, string>();
  for (const linha of texto.split('\n')) {
    if (!/^\s*\d{1,2}\s+[A-E*]\s/.test(linha)) continue;
    const pares = [...linha.matchAll(/(\d{1,2})\s+([A-E*])/g)];
    // Cada versão ocupa dois pares na linha (1..45 e 46..90). Uma linha com
    // outro número de pares é ruído de extração e não pode ser interpretada.
    if (pares.length !== 8) continue;
    for (const [, n, a] of pares.slice(coluna * 2, coluna * 2 + 2)) {
      respostas.set(Number(n), a);
    }
  }
  return respostas;
}

/** Divide a prova em blocos por questão, indexados pelo número declarado. */
export function lerProva(texto: string, marcador: RegExp): Map<number, string> {
  const t = limpar(texto);
  const ms = [...t.matchAll(marcador)];
  const blocos = new Map<number, string>();
  ms.forEach((m, i) => {
    const fim = i + 1 < ms.length ? ms[i + 1].index! : t.length;
    blocos.set(Number(m[1]), t.slice(m.index!, fim));
  });
  return blocos;
}

/** Separa enunciado e alternativas. Devolve null se faltar alguma. */
export function separarAlternativas(
  bloco: string,
  letras: string[],
): { prompt: string; options: { id: string; text: string }[] } | null {
  const marcas = letras.map((L) => {
    const re = new RegExp(`\\(${L}\\)`, 'g');
    const m = [...bloco.matchAll(re)];
    return m.length > 0 ? m[m.length - 1].index! : -1;
  });
  if (marcas.some((i) => i < 0)) return null;
  // As alternativas têm que aparecer em ordem; fora de ordem indica que o
  // texto misturou colunas e o bloco não é confiável.
  for (let i = 1; i < marcas.length; i += 1) {
    if (marcas[i] <= marcas[i - 1]) return null;
  }
  const prompt = bloco.slice(0, marcas[0]).replace(/^\{?\d{1,2}\}?/, '').trim();
  const options = letras.map((L, i) => {
    const fim = i + 1 < marcas.length ? marcas[i + 1] : bloco.length;
    const texto = bloco
      .slice(marcas[i], fim)
      .replace(new RegExp(`^\\(${L}\\)`), '')
      .replace(/#####[\s\S]*$/, '')
      .trim();
    return { id: L.toLowerCase(), text: texto };
  });
  if (!prompt || options.some((o) => !o.text)) return null;
  return { prompt, options };
}

export interface Descarte {
  numero: number;
  motivo:
    | 'anulada'
    | 'depende de imagem'
    | 'alternativas incompletas'
    | 'sem resposta no gabarito'
    | 'formula corrompida';
}

export function montar(
  blocos: Map<number, string>,
  respostas: Map<number, string>,
  letras: string[],
  examSource: Rascunho['examSource'],
): { questoes: Rascunho[]; descartes: Descarte[] } {
  const questoes: Rascunho[] = [];
  const descartes: Descarte[] = [];
  for (const numero of [...blocos.keys()].sort((a, b) => a - b)) {
    const bloco = blocos.get(numero)!;
    const resposta = respostas.get(numero);
    if (!resposta) {
      descartes.push({ numero, motivo: 'sem resposta no gabarito' });
      continue;
    }
    if (resposta === '*') {
      descartes.push({ numero, motivo: 'anulada' });
      continue;
    }
    if (VISUAL.test(bloco)) {
      descartes.push({ numero, motivo: 'depende de imagem' });
      continue;
    }
    if (ESCRITA_ESTRANGEIRA.test(bloco)) {
      descartes.push({ numero, motivo: 'formula corrompida' });
      continue;
    }
    const partes = separarAlternativas(bloco, letras);
    if (!partes) {
      descartes.push({ numero, motivo: 'alternativas incompletas' });
      continue;
    }
    questoes.push({
      numero,
      prompt: partes.prompt,
      options: partes.options,
      correctOptionId: resposta.toLowerCase(),
      examSource,
    });
  }
  return { questoes, descartes };
}
