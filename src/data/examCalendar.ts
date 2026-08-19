// Datas reais dos vestibulares de Medicina 2026, extraídas do calendário
// acadêmico do Anglo Vestibulares (V.7, 07/07/2026) que a aluna enviou. O
// calendário mistura provas oficiais com simulados internos do próprio curso
// (ex.: "AP-1".."AP-8", "FUVEST 1".."FUVEST 7", "ENEM 1".."ENEM 4", "UNICAMP 1"/"2")
// — esses simulados foram propositalmente deixados de fora daqui. As datas de
// 1ª fase/dia único têm alta confiança; as de 2ª fase (nov/dez) vieram de uma
// grade mais densa do calendário e vale conferir no edital oficial de cada
// instituição conforme a data se aproxima.
export interface VestibularExam {
  id: string;
  board: string;
  label: string;
  date: string; // ISO yyyy-mm-dd
}

export const vestibularCalendar2026: VestibularExam[] = [
  { id: 'unesp1-sirio', board: 'UNESP', label: 'UNESP (1ª aplicação) ou Sírio-Libanês', date: '2026-05-10' },
  { id: 'stacasa-d1', board: 'Santa Casa', label: 'Santa Casa — Dia 1', date: '2026-06-07' },
  { id: 'stacasa-d2', board: 'Santa Casa', label: 'Santa Casa — Dia 2', date: '2026-06-14' },
  { id: 'unifesp1-d1', board: 'Unifesp', label: 'UNIFESP (1ª aplicação) — Dia 1', date: '2026-08-05' },
  { id: 'unifesp1-d2', board: 'Unifesp', label: 'UNIFESP (1ª aplicação) — Dia 2', date: '2026-08-12' },
  { id: 'unesp2-einstein', board: 'UNESP', label: 'UNESP (2ª aplicação) ou Einstein', date: '2026-09-13' },
  { id: 'unicamp-1fase', board: 'Unicamp', label: 'UNICAMP (Comvest) — 1ª fase', date: '2026-10-11' },
  { id: 'fuvest-1fase', board: 'Fuvest', label: 'FUVEST — 1ª fase', date: '2026-11-01' },
  { id: 'enem-d1', board: 'ENEM', label: 'ENEM — Dia 1', date: '2026-11-08' },
  { id: 'enem-d2', board: 'ENEM', label: 'ENEM — Dia 2', date: '2026-11-15' },
  { id: 'unicamp-2fase', board: 'Unicamp', label: 'UNICAMP — 2ª fase (discursiva)', date: '2026-11-29' },
  { id: 'fuvest-2fase', board: 'Fuvest', label: 'FUVEST — 2ª fase (discursiva)', date: '2026-12-06' },
  { id: 'unesp-2fase', board: 'UNESP', label: 'UNESP — 2ª fase (discursiva)', date: '2026-12-13' },
  { id: 'unifesp-2fase', board: 'Unifesp', label: 'UNIFESP — reta final / prova', date: '2026-12-17' },
];

export function daysUntil(dateIso: string, from: Date = new Date()): number {
  const target = new Date(`${dateIso}T00:00:00`);
  const start = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  return Math.round((target.getTime() - start.getTime()) / 86400000);
}

export function nextExams(from: Date = new Date(), limit = 3): VestibularExam[] {
  return vestibularCalendar2026
    .filter((exam) => daysUntil(exam.date, from) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date))
    .slice(0, limit);
}

export function nearestExamDate(from: Date = new Date()): VestibularExam | undefined {
  return nextExams(from, 1)[0];
}
