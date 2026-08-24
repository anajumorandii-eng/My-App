import { lastClassEndMinutes } from '../data/weeklySchedule';

// Janela-alvo de estudo autônomo (depois do cursinho), definida pela aluna:
// "das 15h até 20:30/21:00". Usamos 20:30 como padrão (fim realista de
// estudo líquido) e 21:00 como teto esticado, disponível via `extended`.
export const NET_STUDY_WINDOW_START = '15:00';
export const NET_STUDY_WINDOW_END = '20:30';
export const NET_STUDY_WINDOW_END_EXTENDED = '21:00';

// Blocos de 50min de estudo + 10min de pausa curta, com uma pausa longa
// (jantar) a cada 3 blocos — aproximação razoável de como o tempo bruto vira
// tempo líquido de estudo de verdade, sem simular uma rotina rígida demais.
const STUDY_BLOCK_MINUTES = 50;
const SHORT_BREAK_MINUTES = 10;
const LONG_BREAK_MINUTES = 30;
const LONG_BREAK_EVERY_N_BLOCKS = 3;

export interface StudyBlock {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  type: 'estudo' | 'pausa';
}

export interface DailyStudyWindow {
  weekday: number;
  windowStart: string;
  windowEnd: string;
  rawWindowMinutes: number;
  netMinutes: number;
  breakMinutes: number;
  blocks: StudyBlock[];
}

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

function buildBlocks(startMinutes: number, endMinutes: number): StudyBlock[] {
  const blocks: StudyBlock[] = [];
  let cursor = startMinutes;
  let studyBlockCount = 0;

  while (cursor < endMinutes) {
    const studyEnd = Math.min(cursor + STUDY_BLOCK_MINUTES, endMinutes);
    blocks.push({ start: minutesToTime(cursor), end: minutesToTime(studyEnd), type: 'estudo' });
    cursor = studyEnd;
    studyBlockCount += 1;
    if (cursor >= endMinutes) break;

    const isLongBreak = studyBlockCount % LONG_BREAK_EVERY_N_BLOCKS === 0;
    const breakLength = isLongBreak ? LONG_BREAK_MINUTES : SHORT_BREAK_MINUTES;
    const breakEnd = Math.min(cursor + breakLength, endMinutes);
    blocks.push({ start: minutesToTime(cursor), end: minutesToTime(breakEnd), type: 'pausa' });
    cursor = breakEnd;
  }

  return blocks;
}

/**
 * Janela de estudo líquido de um dia da semana: começa às 15h (ou mais tarde,
 * se a última aula do cursinho naquele dia terminar depois disso — ex.:
 * quinta, que vai até 17:35) e vai até NET_STUDY_WINDOW_END, com pausas
 * intercaladas nos blocos de estudo.
 */
export function computeStudyBlocksForWeekday(weekday: number, extended = false): DailyStudyWindow {
  const classEnd = lastClassEndMinutes(weekday);
  const nominalStart = timeToMinutes(NET_STUDY_WINDOW_START);
  const startMinutes = classEnd !== null ? Math.max(nominalStart, classEnd) : nominalStart;
  const endMinutes = timeToMinutes(extended ? NET_STUDY_WINDOW_END_EXTENDED : NET_STUDY_WINDOW_END);

  if (startMinutes >= endMinutes) {
    return {
      weekday,
      windowStart: minutesToTime(startMinutes),
      windowEnd: minutesToTime(endMinutes),
      rawWindowMinutes: 0,
      netMinutes: 0,
      breakMinutes: 0,
      blocks: [],
    };
  }

  const blocks = buildBlocks(startMinutes, endMinutes);
  const netMinutes = blocks.filter((b) => b.type === 'estudo').reduce((sum, b) => sum + (timeToMinutes(b.end) - timeToMinutes(b.start)), 0);
  const rawWindowMinutes = endMinutes - startMinutes;

  return {
    weekday,
    windowStart: minutesToTime(startMinutes),
    windowEnd: minutesToTime(endMinutes),
    rawWindowMinutes,
    netMinutes,
    breakMinutes: rawWindowMinutes - netMinutes,
    blocks,
  };
}

/**
 * Fração do tempo bruto que vira pausa nesse dia — usado para aplicar o
 * mesmo desconto de pausas sobre um intervalo livre calculado de outra forma
 * (ex.: minutos livres reais vindos da agenda do Google), sem assumir que
 * esse intervalo é necessariamente contíguo.
 */
export function breakOverheadRatio(weekday: number, extended = false): number {
  const window = computeStudyBlocksForWeekday(weekday, extended);
  if (window.rawWindowMinutes === 0) return 0;
  return window.breakMinutes / window.rawWindowMinutes;
}

export function applyBreakOverhead(rawMinutes: number, weekday: number, extended = false): number {
  if (rawMinutes <= 0) return 0;
  const ratio = breakOverheadRatio(weekday, extended);
  return Math.round(rawMinutes * (1 - ratio));
}
