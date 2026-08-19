// Datas reais dos vestibulares de Medicina 2026, verificadas diretamente nos
// portais oficiais de cada instituição (Comvest, Fuvest, Vunesp, Santa Casa,
// Einstein, Sírio-Libanês, INEP) em agosto de 2026 — não apenas lidas do
// calendário interno do Anglo, que mistura provas oficiais com simulados
// próprios (ex.: "AP-1".."AP-8", "FUVEST 1".."FUVEST 7", "ENEM 1".."ENEM 4",
// "UNICAMP 1"/"2", "UNESP 1"/"2") e havia levado a algumas datas erradas aqui
// numa primeira leitura (Unicamp 1ª fase, Santa Casa, Einstein e Unesp
// tinham sido lidas incorretamente — corrigido depois de checar as fontes
// oficiais). Unifesp (Medicina, Sistema Misto) ficou de fora: não foi
// possível confirmar a data exata do ciclo 2027 nas buscas — no ciclo
// anterior as provas complementares foram em 18-19/dez, então o padrão é
// meados/fim de dezembro, mas vale conferir em ingresso.unifesp.br antes de
// confiar numa data específica.
export interface VestibularExam {
  id: string;
  board: string;
  label: string;
  date: string; // ISO yyyy-mm-dd
}

export const vestibularCalendar2026: VestibularExam[] = [
  { id: 'stacasa-d1', board: 'Santa Casa', label: 'Santa Casa — Dia 1 (conhecimentos gerais)', date: '2026-09-26' },
  { id: 'stacasa-d2', board: 'Santa Casa', label: 'Santa Casa — Dia 2 (conhecimentos específicos + redação)', date: '2026-09-27' },
  { id: 'einstein-1fase', board: 'Einstein', label: 'Einstein — prova escrita (1ª fase)', date: '2026-10-11' },
  { id: 'sirio-1fase', board: 'Sírio-Libanês', label: 'Sírio-Libanês — prova escrita (1ª fase)', date: '2026-10-12' },
  { id: 'unicamp-1fase', board: 'Unicamp', label: 'UNICAMP (Comvest) — 1ª fase', date: '2026-10-18' },
  { id: 'fuvest-1fase', board: 'Fuvest', label: 'FUVEST — 1ª fase', date: '2026-11-01' },
  { id: 'enem-d1', board: 'ENEM', label: 'ENEM — Dia 1', date: '2026-11-08' },
  { id: 'enem-d2', board: 'ENEM', label: 'ENEM — Dia 2', date: '2026-11-15' },
  { id: 'unesp-1fase', board: 'UNESP', label: 'UNESP (Vunesp) — 1ª fase', date: '2026-11-22' },
  { id: 'unicamp-2fase-d1', board: 'Unicamp', label: 'UNICAMP — 2ª fase, dia 1', date: '2026-11-29' },
  { id: 'unicamp-2fase-d2', board: 'Unicamp', label: 'UNICAMP — 2ª fase, dia 2', date: '2026-11-30' },
  { id: 'einstein-mme', board: 'Einstein', label: 'Einstein — Múltiplas Minientrevistas (MME)', date: '2026-12-03' },
  { id: 'fuvest-2fase-d1', board: 'Fuvest', label: 'FUVEST — 2ª fase, dia 1', date: '2026-12-06' },
  { id: 'fuvest-2fase-d2', board: 'Fuvest', label: 'FUVEST — 2ª fase, dia 2', date: '2026-12-07' },
  { id: 'unesp-2fase-d1', board: 'UNESP', label: 'UNESP — 2ª fase, dia 1', date: '2026-12-13' },
  { id: 'unesp-2fase-d2', board: 'UNESP', label: 'UNESP — 2ª fase, dia 2', date: '2026-12-14' },
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
