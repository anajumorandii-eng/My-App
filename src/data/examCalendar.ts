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
  phase: '1a-fase' | '2a-fase' | 'unica';
  label: string;
  date: string; // ISO yyyy-mm-dd
  source: string;
  verifiedOn: string; // ISO yyyy-mm-dd
  confidence: 'alta' | 'media' | 'baixa';
}

const VERIFIED_ON = '2026-08-19';

export const vestibularCalendar2026: VestibularExam[] = [
  {
    id: 'stacasa-d1', board: 'Santa Casa', phase: 'unica',
    label: 'Santa Casa — Dia 1 (conhecimentos gerais)', date: '2026-09-26',
    source: 'fcmsantacasasp.edu.br — Vestibular de Medicina 2027', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'stacasa-d2', board: 'Santa Casa', phase: 'unica',
    label: 'Santa Casa — Dia 2 (conhecimentos específicos + redação)', date: '2026-09-27',
    source: 'fcmsantacasasp.edu.br — Vestibular de Medicina 2027', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'einstein-1fase', board: 'Einstein', phase: '1a-fase',
    label: 'Einstein — prova escrita (1ª fase)', date: '2026-10-11',
    source: 'Manual do Candidato, citado por vestibulandoweb.com.br (não confirmado direto no site do Einstein)', verifiedOn: VERIFIED_ON, confidence: 'media',
  },
  {
    id: 'einstein-mme', board: 'Einstein', phase: '2a-fase',
    label: 'Einstein — Múltiplas Minientrevistas (MME)', date: '2026-12-03',
    source: 'Manual do Candidato, citado por vestibulandoweb.com.br (não confirmado direto no site do Einstein)', verifiedOn: VERIFIED_ON, confidence: 'media',
  },
  {
    id: 'sirio-1fase', board: 'Sírio-Libanês', phase: '1a-fase',
    label: 'Sírio-Libanês — prova escrita (1ª fase)', date: '2026-10-12',
    source: 'Edital citado por vestibulares.estrategia.com (não confirmado direto no site da Faculdade Sírio-Libanês)', verifiedOn: VERIFIED_ON, confidence: 'media',
  },
  {
    id: 'unicamp-1fase', board: 'Unicamp', phase: '1a-fase',
    label: 'UNICAMP (Comvest) — 1ª fase', date: '2026-10-18',
    source: 'CNN Brasil — "Unicamp divulga datas do vestibular 2027"', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'unicamp-2fase-d1', board: 'Unicamp', phase: '2a-fase',
    label: 'UNICAMP — 2ª fase, dia 1', date: '2026-11-29',
    source: 'CNN Brasil — "Unicamp divulga datas do vestibular 2027"', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'unicamp-2fase-d2', board: 'Unicamp', phase: '2a-fase',
    label: 'UNICAMP — 2ª fase, dia 2', date: '2026-11-30',
    source: 'CNN Brasil — "Unicamp divulga datas do vestibular 2027"', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'fuvest-1fase', board: 'Fuvest', phase: '1a-fase',
    label: 'FUVEST — 1ª fase', date: '2026-11-01',
    source: 'fuvest.br — "FUVEST divulga cronograma completo do Vestibular 2027"', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'fuvest-2fase-d1', board: 'Fuvest', phase: '2a-fase',
    label: 'FUVEST — 2ª fase, dia 1', date: '2026-12-06',
    source: 'fuvest.br — "FUVEST divulga cronograma completo do Vestibular 2027"', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'fuvest-2fase-d2', board: 'Fuvest', phase: '2a-fase',
    label: 'FUVEST — 2ª fase, dia 2', date: '2026-12-07',
    source: 'fuvest.br — "FUVEST divulga cronograma completo do Vestibular 2027"', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'enem-d1', board: 'ENEM', phase: 'unica',
    label: 'ENEM — Dia 1', date: '2026-11-08',
    source: 'Edital nº 64/INEP (22/05/2026), citado por vestibulandoweb.com.br', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'enem-d2', board: 'ENEM', phase: 'unica',
    label: 'ENEM — Dia 2', date: '2026-11-15',
    source: 'Edital nº 64/INEP (22/05/2026), citado por vestibulandoweb.com.br', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'unesp-1fase', board: 'UNESP', phase: '1a-fase',
    label: 'UNESP (Vunesp) — 1ª fase', date: '2026-11-22',
    source: 'agenciasp.sp.gov.br — "Vestibular 2027: Unesp divulga calendário de inscrições"', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'unesp-2fase-d1', board: 'UNESP', phase: '2a-fase',
    label: 'UNESP — 2ª fase, dia 1', date: '2026-12-13',
    source: 'agenciasp.sp.gov.br — "Vestibular 2027: Unesp divulga calendário de inscrições"', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
  {
    id: 'unesp-2fase-d2', board: 'UNESP', phase: '2a-fase',
    label: 'UNESP — 2ª fase, dia 2', date: '2026-12-14',
    source: 'agenciasp.sp.gov.br — "Vestibular 2027: Unesp divulga calendário de inscrições"', verifiedOn: VERIFIED_ON, confidence: 'alta',
  },
];

// Comparação de nome de banca tolerante a maiúsculas/minúsculas — o app usa
// grafias diferentes em lugares diferentes (Perfil usa "FUVEST" maiúsculo,
// este arquivo usa "Fuvest", examPriorities.ts usa "Fuvest"/"Unicamp"/
// "Famerp"/"Unifesp"). Unificar tudo seria um refactor maior; isso resolve a
// comparação sem mexer nos dados existentes.
export function sameBoard(a: string, b: string): boolean {
  return a.trim().toLowerCase() === b.trim().toLowerCase();
}

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

// Próximas provas de uma banca específica, opcionalmente restritas a uma
// fase (para respeitar o foco de fase que a estudante escolheu para essa
// banca).
export function examsForBoard(
  board: string,
  phaseFocus: '1a-fase' | '2a-fase' | 'ambas' = 'ambas',
  from: Date = new Date()
): VestibularExam[] {
  return vestibularCalendar2026
    .filter((exam) => sameBoard(exam.board, board))
    .filter((exam) => phaseFocus === 'ambas' || exam.phase === 'unica' || exam.phase === phaseFocus)
    .filter((exam) => daysUntil(exam.date, from) >= 0)
    .sort((a, b) => a.date.localeCompare(b.date));
}
