/**
 * Períodos da história do Brasil: o laboratório de História no Hoje.
 *
 * A faixa de trás mostra os cinco séculos em proporção, e é essa a lição que a
 * linha do tempo dos livros esconde quando dá a cada período o mesmo espaço:
 * a Colônia sozinha ocupa mais da metade da história do país, e a Era Vargas
 * cabe em quinze anos. A faixa da frente amplia o período escolhido com os
 * seus marcos.
 *
 * As datas são as de manual, com os marcos que a Fuvest e o ENEM cobram. Os
 * limites são contíguos por construção — o teste confere que o fim de um é o
 * começo do seguinte.
 */

export interface Marco { ano: number; texto: string }

export interface Periodo {
  id: string;
  nome: string;
  /** Nome curto para o botão. */
  curto: string;
  inicio: number;
  fim: number;
  /** O que abre e o que fecha o período. */
  abertura: string;
  fechamento: string;
  marcos: Marco[];
}

/** Ano de referência para o período que não terminou. */
export const ANO_ATUAL = 2026;

export const PERIODOS: Periodo[] = [
  {
    id: 'colonia', nome: 'Brasil Colônia', curto: 'Colônia', inicio: 1500, fim: 1822,
    abertura: 'chegada da esquadra de Cabral', fechamento: 'Independência',
    marcos: [
      { ano: 1549, texto: 'Governo-Geral em Salvador' },
      { ano: 1763, texto: 'capital vai para o Rio' },
      { ano: 1808, texto: 'chegada da Corte' },
    ],
  },
  {
    id: 'imperio', nome: 'Império', curto: 'Império', inicio: 1822, fim: 1889,
    abertura: 'Independência', fechamento: 'Proclamação da República',
    marcos: [
      { ano: 1824, texto: 'primeira Constituição' },
      { ano: 1850, texto: 'Lei Eusébio de Queirós' },
      { ano: 1888, texto: 'Lei Áurea' },
    ],
  },
  {
    id: 'primeira-republica', nome: 'Primeira República', curto: '1ª República', inicio: 1889, fim: 1930,
    abertura: 'Proclamação da República', fechamento: 'Revolução de 1930',
    marcos: [
      { ano: 1891, texto: 'Constituição republicana' },
      { ano: 1922, texto: 'Semana de Arte Moderna' },
    ],
  },
  {
    id: 'era-vargas', nome: 'Era Vargas', curto: 'Era Vargas', inicio: 1930, fim: 1945,
    abertura: 'Revolução de 1930', fechamento: 'deposição de Vargas',
    marcos: [
      { ano: 1932, texto: 'Revolução Constitucionalista' },
      { ano: 1937, texto: 'Estado Novo' },
      { ano: 1943, texto: 'CLT' },
    ],
  },
  {
    id: 'republica-45', nome: 'República de 1945–1964', curto: '1945–1964', inicio: 1945, fim: 1964,
    abertura: 'deposição de Vargas', fechamento: 'golpe civil-militar',
    marcos: [
      { ano: 1953, texto: 'criação da Petrobras' },
      { ano: 1960, texto: 'inauguração de Brasília' },
    ],
  },
  {
    id: 'ditadura', nome: 'Ditadura Militar', curto: 'Ditadura', inicio: 1964, fim: 1985,
    abertura: 'golpe civil-militar', fechamento: 'posse do primeiro presidente civil',
    marcos: [
      { ano: 1968, texto: 'AI-5' },
      { ano: 1979, texto: 'Lei da Anistia' },
      { ano: 1984, texto: 'Diretas Já' },
    ],
  },
  {
    id: 'nova-republica', nome: 'Nova República', curto: 'Nova República', inicio: 1985, fim: ANO_ATUAL,
    abertura: 'posse do primeiro presidente civil', fechamento: 'em curso',
    marcos: [
      { ano: 1988, texto: 'Constituição Cidadã' },
      { ano: 1994, texto: 'Plano Real' },
    ],
  },
];

export const duracao = (p: Periodo) => p.fim - p.inicio;

/** Fração da história do país (de 1500 até hoje) que o período ocupa. */
export function fracao(p: Periodo) {
  const total = ANO_ATUAL - PERIODOS[0].inicio;
  return duracao(p) / total;
}

export function periodoDoAno(ano: number) {
  return PERIODOS.find((p) => ano >= p.inicio && ano < p.fim) ?? PERIODOS[PERIODOS.length - 1];
}
