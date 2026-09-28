/**
 * Ambiente de cor da tela do Visual: a paleta que a tela inteira veste quando
 * um capítulo usa a moldura tecnológica.
 *
 * A prancha tecnológica acendeu violeta e ciano, e o resto da tela — barra do
 * topo, trilho lateral, painel "Diagnóstico vivo" — continuou no creme e verde
 * de sempre. A Ana Júlia viu a quebra e pediu a tela inteira "adaptável de
 * acordo com a matéria e o conteúdo". Daí as duas camadas:
 *
 * 1. a matéria dá a base (Física em ciano e violeta, Biologia em esmeralda…);
 * 2. o conteúdo do capítulo, lido do próprio tópico, ajusta a base quando ele
 *    tem uma cor natural: órbita puxa para o azul do espaço, defeito de massa
 *    para o âmbar da energia liberada.
 *
 * A regra de conteúdo olha só o tópico e o id do capítulo, que são dados do
 * currículo — nenhuma cor é inventada por capítulo à mão, e um capítulo sem
 * regra fica com a base da matéria. Módulo puro, sem React, para rodar em
 * `node:test`.
 */

export interface Paleta {
  /** Tom principal: luz, destaque, valor lido. */
  a: string;
  /** Tom secundário: segundo foco da aurora, gradiente do título. */
  b: string;
  /** Terceiro foco da aurora. */
  c: string;
  /** Fundo da tela no tema escuro. O claro deriva de `a` no CSS. */
  fundo: string;
}

export interface Ambiente {
  paleta: Paleta;
  /** De onde veio a cor: a matéria, uma regra de conteúdo ou a escolha dela. */
  origem: 'materia' | 'conteudo' | 'escolha';
  /** Nome curto da regra, da matéria ou da paleta escolhida. */
  nome: string;
}

const BASE: Paleta = { a: '#a78bfa', b: '#22d3ee', c: '#f472b6', fundo: '#06070f' };

export const PALETAS_MATERIA: Record<string, Paleta> = {
  'Física': { a: '#22d3ee', b: '#a78bfa', c: '#f472b6', fundo: '#05070d' },
  'Química': { a: '#fbbf24', b: '#e879f9', c: '#fb923c', fundo: '#0c0710' },
  'Biologia': { a: '#34d399', b: '#a3e635', c: '#2dd4bf', fundo: '#03100b' },
  'Matemática': { a: '#60a5fa', b: '#818cf8', c: '#22d3ee', fundo: '#050816' },
};

/**
 * Regras de conteúdo, na ordem em que são testadas: a primeira que casa com o
 * tópico vence. As mais específicas vêm antes — "equivalência massa-energia"
 * precisa cair em energia nuclear antes de "energia" genérica.
 *
 * Cada regra vale só nas matérias listadas: "Dinâmica de populações", de
 * Biologia, casava com "dinamica" e saía com a cor de mecânica da Física.
 */
export const REGRAS_CONTEUDO: { nome: string; materias: string[]; termos: RegExp; paleta: Paleta }[] = [
  { nome: 'energia nuclear', materias: ['Física', 'Química'], termos: /massa-energia|nuclear|radioativ|fissao|fusao/, paleta: { a: '#fbbf24', b: '#fb923c', c: '#a78bfa', fundo: '#0d0906' } },
  { nome: 'espaço', materias: ['Física', 'Geografia'], termos: /orbita|gravita|kepler|satelit|astron|cosmo/, paleta: { a: '#818cf8', b: '#22d3ee', c: '#f0abfc', fundo: '#040614' } },
  { nome: 'eletricidade', materias: ['Física'], termos: /eletr(?!oquim)|magnet|corrente|circuit|resistor|gerador|capacitor|inducao/, paleta: { a: '#facc15', b: '#60a5fa', c: '#22d3ee', fundo: '#05080f' } },
  // Ondas antes de luz: "fenômenos ondulatórios: refração e reflexão em
  // cordas" tem "refração" e caía na paleta de óptica.
  { nome: 'ondas', materias: ['Física'], termos: /onda|ondulatori|interferenc|acustic|som\b|doppler|cordas|harmonic/, paleta: { a: '#22d3ee', b: '#a78bfa', c: '#34d399', fundo: '#04090f' } },
  { nome: 'luz', materias: ['Física'], termos: /optic|lente|espelho|refrac|luz|visao/, paleta: { a: '#fde047', b: '#22d3ee', c: '#f0abfc', fundo: '#07080d' } },
  { nome: 'calor', materias: ['Física', 'Química'], termos: /term|calor|temperatur|dilatac|calorimetr|gases/, paleta: { a: '#fb923c', b: '#f43f5e', c: '#fbbf24', fundo: '#0e0707' } },
  { nome: 'mecânica', materias: ['Física'], termos: /movimento|polia|dinamica|forca|cinematic|newton|energia|trabalho|impulso|estatica|hidrostat/, paleta: { a: '#fb923c', b: '#2dd4bf', c: '#a78bfa', fundo: '#080a0c' } },
  { nome: 'vida vegetal', materias: ['Biologia'], termos: /fotossint|planta|vegeta|botanic|angiosperm|gimnosperm/, paleta: { a: '#a3e635', b: '#34d399', c: '#fde047', fundo: '#050d05' } },
  { nome: 'célula', materias: ['Biologia'], termos: /celul|membrana|citoplasma|organela|mitocondr|nucleo/, paleta: { a: '#2dd4bf', b: '#a78bfa', c: '#34d399', fundo: '#040c0d' } },
  { nome: 'circulação', materias: ['Biologia'], termos: /sangue|cardio|coracao|circulat|respirat|imun/, paleta: { a: '#fb7185', b: '#f472b6', c: '#fbbf24', fundo: '#0e0508' } },
  { nome: 'genética', materias: ['Biologia'], termos: /genetic|dna|rna|heranca|mendel|mutac|cromossom/, paleta: { a: '#a78bfa', b: '#22d3ee', c: '#f472b6', fundo: '#07060f' } },
  { nome: 'ácido e base', materias: ['Química'], termos: /acid|base|ph\b|neutraliz/, paleta: { a: '#f472b6', b: '#a3e635', c: '#22d3ee', fundo: '#0d060b' } },
  { nome: 'eletroquímica', materias: ['Química'], termos: /eletroquim|pilha|eletrolis|oxirreduc/, paleta: { a: '#facc15', b: '#60a5fa', c: '#fb923c', fundo: '#07080e' } },
];

/** Minúsculas e sem acento: o tópico "Órbitas" e o id `...-orbitas` casam igual. */
export function normalizar(texto: string) {
  return texto.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * Paletas fixas que a estudante pode escolher em vez da cor automática. Os
 * nomes são do que a cor lembra, não da matéria: servem a qualquer capítulo.
 */
export const PALETAS_FIXAS: Record<string, Paleta> = {
  'Neon': { a: '#22d3ee', b: '#a78bfa', c: '#f472b6', fundo: '#05070d' },
  'Aurora': { a: '#f472b6', b: '#a78bfa', c: '#22d3ee', fundo: '#0b0610' },
  'Solar': { a: '#fbbf24', b: '#fb923c', c: '#f472b6', fundo: '#0d0906' },
  'Floresta': { a: '#34d399', b: '#a3e635', c: '#22d3ee', fundo: '#03100b' },
  'Oceano': { a: '#60a5fa', b: '#22d3ee', c: '#818cf8', fundo: '#040816' },
};

/**
 * Como a cor é escolhida: `automatica` (matéria + conteúdo, o padrão), `materia`
 * (ignora as regras de conteúdo) ou o nome de uma paleta fixa.
 */
export type ModoCor = 'automatica' | 'materia' | keyof typeof PALETAS_FIXAS;

export function ambienteDoCapitulo({ id, subject, topic }: { id: string; subject: string; topic: string }, modo: ModoCor = 'automatica'): Ambiente {
  if (modo in PALETAS_FIXAS) return { paleta: PALETAS_FIXAS[modo], origem: 'escolha', nome: modo };
  if (modo === 'materia') {
    const daMateria = PALETAS_MATERIA[subject];
    return { paleta: daMateria ?? BASE, origem: 'materia', nome: daMateria ? subject : 'padrão' };
  }
  const alvo = normalizar(`${topic} ${id}`);
  const regra = REGRAS_CONTEUDO.find((item) => item.materias.includes(subject) && item.termos.test(alvo));
  if (regra) return { paleta: regra.paleta, origem: 'conteudo', nome: regra.nome };
  const daMateria = PALETAS_MATERIA[subject];
  return { paleta: daMateria ?? BASE, origem: 'materia', nome: daMateria ? subject : 'padrão' };
}

/**
 * Capítulos com a moldura tecnológica. É o piloto aprovado para prova — cinco
 * capítulos de Física — e o único lugar a mexer para estender a moldura: o
 * `BoardShell` e o ambiente da tela leem daqui, pelo contexto do Visual.
 */
export const CAPITULOS_TECNOLOGICOS = new Set([
  'summary-fisica-interferencia-de-ondas-analise-quantitativa-aplicacoes-e-batimento',
  'summary-fisica-equivalencia-massa-energia',
  'summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas',
  'summary-fisica-orbitas',
  'summary-fisica-o-movimento-circular',
]);

/**
 * Todo capítulo usa a moldura tecnológica desde que a Ana Júlia aprovou o
 * piloto ("agora sim"). O conjunto acima fica como registro do piloto e é o
 * que o teste de cores de conteúdo verifica.
 */
export const usaMolduraTecnologica = (_id: string) => true;

/** Converte `#rrggbb` em "r, g, b", o formato que o canvas das partículas usa. */
export function rgbDe(hex: string) {
  const limpo = hex.replace('#', '');
  const n = parseInt(limpo.length === 3 ? limpo.split('').map((c) => c + c).join('') : limpo, 16);
  return `${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}`;
}

/** Ambiente da biblioteca: a matéria filtrada, ou a paleta padrão em "Todas". */
export function ambienteDaMateria(subject: string, modo: ModoCor = 'automatica'): Ambiente {
  if (modo in PALETAS_FIXAS) return { paleta: PALETAS_FIXAS[modo], origem: 'escolha', nome: modo };
  const daMateria = PALETAS_MATERIA[subject];
  return { paleta: daMateria ?? BASE, origem: 'materia', nome: daMateria ? subject : 'padrão' };
}
