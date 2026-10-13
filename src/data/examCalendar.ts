// Calendário de provas com proveniência por registro. Rechecagem de 13/10:
// docs/estudos-2026/fontes-e-evidencias.md. Datas ainda sem confirmação
// independente ficam com confiança baixa e não bloqueiam automaticamente a agenda.
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
    source: 'https://www.comvest.unicamp.br/wp-content/uploads/2026/07/VU2027-Manual-do-Ingresso.pdf', verifiedOn: '2026-10-13', confidence: 'alta',
  },
  {
    id: 'unicamp-2fase-d1', board: 'Unicamp', phase: '2a-fase',
    label: 'UNICAMP — 2ª fase, dia 1', date: '2026-11-29',
    source: 'https://www.comvest.unicamp.br/wp-content/uploads/2026/07/VU2027-Manual-do-Ingresso.pdf', verifiedOn: '2026-10-13', confidence: 'alta',
  },
  {
    id: 'unicamp-2fase-d2', board: 'Unicamp', phase: '2a-fase',
    label: 'UNICAMP — 2ª fase, dia 2', date: '2026-11-30',
    source: 'https://www.comvest.unicamp.br/wp-content/uploads/2026/07/VU2027-Manual-do-Ingresso.pdf', verifiedOn: '2026-10-13', confidence: 'alta',
  },
  {
    id: 'fuvest-1fase', board: 'Fuvest', phase: '1a-fase',
    label: 'FUVEST — 1ª fase', date: '2026-11-01',
    source: 'https://www.fuvest.br/vestibular-da-usp/', verifiedOn: '2026-10-13', confidence: 'alta',
  },
  {
    id: 'fuvest-2fase-d1', board: 'Fuvest', phase: '2a-fase',
    label: 'FUVEST — 2ª fase, dia 1', date: '2026-12-06',
    source: 'https://www.fuvest.br/vestibular-da-usp/', verifiedOn: '2026-10-13', confidence: 'alta',
  },
  {
    id: 'fuvest-2fase-d2', board: 'Fuvest', phase: '2a-fase',
    label: 'FUVEST — 2ª fase, dia 2', date: '2026-12-07',
    source: 'https://www.fuvest.br/vestibular-da-usp/', verifiedOn: '2026-10-13', confidence: 'alta',
  },
  {
    id: 'enem-d1', board: 'ENEM', phase: 'unica',
    label: 'ENEM — Dia 1', date: '2026-11-08',
    source: 'https://www.gov.br/inep/pt-br/centrais-de-conteudo/noticias/enem/enem-2026-falta-um-mes-para-o-primeiro-dia-de-provas', verifiedOn: '2026-10-13', confidence: 'alta',
  },
  {
    id: 'enem-d2', board: 'ENEM', phase: 'unica',
    label: 'ENEM — Dia 2', date: '2026-11-15',
    source: 'https://www.gov.br/inep/pt-br/centrais-de-conteudo/noticias/enem/enem-2026-falta-um-mes-para-o-primeiro-dia-de-provas', verifiedOn: '2026-10-13', confidence: 'alta',
  },
  {
    id: 'unesp-1fase', board: 'UNESP', phase: '1a-fase',
    label: 'UNESP (Vunesp) — 1ª fase', date: '2026-11-22',
    source: 'https://vestibular.unesp.br/', verifiedOn: '2026-10-13', confidence: 'alta',
  },
  {
    id: 'unesp-2fase-d1', board: 'UNESP', phase: '2a-fase',
    label: 'UNESP — 2ª fase, dia 1', date: '2026-12-13',
    source: 'Cronograma fornecido; conferir edital vigente em https://vestibular.unesp.br/', verifiedOn: '2026-10-13', confidence: 'baixa',
  },
  {
    id: 'unesp-2fase-d2', board: 'UNESP', phase: '2a-fase',
    label: 'UNESP — 2ª fase, dia 2', date: '2026-12-14',
    source: 'Cronograma fornecido; conferir edital vigente em https://vestibular.unesp.br/', verifiedOn: '2026-10-13', confidence: 'baixa',
  },
  { id: 'famerp-d1', board: 'Famerp', phase: 'unica', label: 'FAMERP — conhecimentos gerais', date: '2026-12-10', source: 'https://www.famerp.br/wp-content/plugins/download-attachments/includes/download.php?id=31419', verifiedOn: '2026-10-13', confidence: 'alta' },
  { id: 'famerp-d2', board: 'Famerp', phase: 'unica', label: 'FAMERP — específicos e redação', date: '2026-12-11', source: 'https://www.famerp.br/wp-content/plugins/download-attachments/includes/download.php?id=31419', verifiedOn: '2026-10-13', confidence: 'alta' },
  { id: 'unifesp-d1', board: 'Unifesp', phase: '2a-fase', label: 'UNIFESP — dia 1 (a confirmar)', date: '2026-12-17', source: 'Cronograma fornecido; confirmação pendente em https://ingresso.unifesp.br/', verifiedOn: '2026-10-13', confidence: 'baixa' },
  { id: 'unifesp-d2', board: 'Unifesp', phase: '2a-fase', label: 'UNIFESP — dia 2 (a confirmar)', date: '2026-12-18', source: 'Cronograma fornecido; confirmação pendente em https://ingresso.unifesp.br/', verifiedOn: '2026-10-13', confidence: 'baixa' },
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
