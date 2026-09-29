/**
 * Estações do ano: o laboratório de Geografia no Hoje.
 *
 * O eixo da Terra é inclinado 23,44° em relação à órbita, e é por isso que o
 * Sol do meio-dia sobe e desce no céu ao longo do ano e a duração do dia muda
 * com a latitude. A estudante escolhe a data e a cidade; a cena ilumina o
 * globo pela declinação do Sol, e a leitura dá a altura do Sol ao meio-dia e
 * a duração do dia.
 *
 * Contas geométricas, como as dos livros: não descontam a refração da
 * atmosfera, que na prática alonga o dia em alguns minutos. A declinação usa
 * a aproximação de Cooper, com erro abaixo de meio grau.
 */

export const INCLINACAO = 23.44;

export interface Cidade { id: string; nome: string; latitude: number }

/** Latitudes em graus, sul negativo. São Paulo fica quase sobre o Trópico de Capricórnio. */
export const CIDADES: Cidade[] = [
  { id: 'manaus', nome: 'Manaus', latitude: -3.12 },
  { id: 'brasilia', nome: 'Brasília', latitude: -15.79 },
  { id: 'sao-paulo', nome: 'São Paulo', latitude: -23.55 },
  { id: 'porto-alegre', nome: 'Porto Alegre', latitude: -30.03 },
];

const rad = (g: number) => (g * Math.PI) / 180;
const graus = (r: number) => (r * 180) / Math.PI;

/** Declinação do Sol, em graus, no dia N do ano (1 = 1º de janeiro). */
export function declinacao(dia: number) {
  return -INCLINACAO * Math.cos(rad((360 / 365) * (dia + 10)));
}

/** Duração do dia claro, em horas, na latitude dada. */
export function duracaoDoDia(latitude: number, dia: number) {
  const x = -Math.tan(rad(latitude)) * Math.tan(rad(declinacao(dia)));
  if (x <= -1) return 24;
  if (x >= 1) return 0;
  return (2 * graus(Math.acos(x))) / 15;
}

/** Altura do Sol acima do horizonte ao meio-dia solar, em graus. */
export function alturaAoMeioDia(latitude: number, dia: number) {
  return 90 - Math.abs(latitude - declinacao(dia));
}

/** Estação no hemisfério sul, pelos marcos astronômicos aproximados. */
export function estacaoNoSul(dia: number) {
  // 20/3 = dia 79, 21/6 = 172, 22/9 = 265, 21/12 = 355.
  if (dia >= 79 && dia < 172) return 'outono';
  if (dia >= 172 && dia < 265) return 'inverno';
  if (dia >= 265 && dia < 355) return 'primavera';
  return 'verão';
}

const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
const DIAS_NO_MES = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

/** "21 jun", num ano não bissexto. */
export function escreverDia(dia: number) {
  let resto = dia;
  for (let m = 0; m < 12; m += 1) {
    if (resto <= DIAS_NO_MES[m]) return `${resto} ${MESES[m]}`;
    resto -= DIAS_NO_MES[m];
  }
  return `31 dez`;
}

/**
 * Dia no ano de 365 dias que o resto do módulo usa. Em ano bissexto, contar
 * os dias de verdade empurrava tudo depois de 28/2 um dia à frente (29/2
 * saía como 1º de março) e juntava 30 e 31/12 no dia 365; 29/2 conta como 28/2.
 */
export function diaDoAno(data: Date) {
  const mes = data.getMonth();
  const dia = mes === 1 ? Math.min(data.getDate(), 28) : data.getDate();
  return (Date.UTC(2025, mes, dia) - Date.UTC(2025, 0, 1)) / 86_400_000 + 1;
}

/** "13 h 25 min". */
export function escreverHoras(h: number) {
  let horas = Math.floor(h);
  let min = Math.round((h - horas) * 60);
  if (min === 60) { horas += 1; min = 0; }
  return `${horas} h ${String(min).padStart(2, '0')} min`;
}
