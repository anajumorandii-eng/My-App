// Uma entrada por banca da área Provas. Existe porque o app grafa a mesma
// banca de jeitos diferentes em cada fonte: "FAMERP" no banco de questões,
// "Famerp" no calendário, "Unesp / Vunesp" nas discursivas, "UNESP" nos
// perfis. Em vez de adivinhar por comparação de texto, cada banca diz aqui o
// nome que usa em cada lugar; ausência significa que aquela fonte não tem
// nada da banca.

export interface ExamBoardEntry {
  slug: string;
  name: string;
  /** Nome em questions.json (examSource.board). */
  questionBoard?: string;
  /** Nome em vestibularCalendar2026. */
  calendarBoard?: string;
  /** Nome em discursiveQuestions e boardExamStructure. */
  discursiveBoard?: string;
  /** Nome em studyBoardProfiles. */
  profileBoard?: string;
  /** Nome em secondPhaseProtocols. */
  protocolBoard?: string;
}

export const examBoards: ExamBoardEntry[] = [
  { slug: 'famerp', name: 'Famerp', questionBoard: 'FAMERP', calendarBoard: 'Famerp', discursiveBoard: 'Famerp', profileBoard: 'Famerp' },
  { slug: 'unifesp', name: 'Unifesp', questionBoard: 'UNIFESP', calendarBoard: 'Unifesp', discursiveBoard: 'Unifesp', profileBoard: 'Unifesp' },
  { slug: 'fuvest', name: 'Fuvest', questionBoard: 'FUVEST', calendarBoard: 'Fuvest', discursiveBoard: 'Fuvest', profileBoard: 'Fuvest', protocolBoard: 'Fuvest' },
  { slug: 'unicamp', name: 'Unicamp', questionBoard: 'UNICAMP', calendarBoard: 'Unicamp', discursiveBoard: 'Unicamp / Comvest', profileBoard: 'Unicamp', protocolBoard: 'Unicamp / Comvest' },
  { slug: 'unesp', name: 'Unesp', questionBoard: 'UNESP', calendarBoard: 'UNESP', discursiveBoard: 'Unesp / Vunesp', profileBoard: 'UNESP', protocolBoard: 'Unesp / Vunesp' },
  { slug: 'enem', name: 'ENEM', questionBoard: 'ENEM', calendarBoard: 'ENEM', profileBoard: 'ENEM' },
  { slug: 'santa-casa', name: 'Santa Casa', calendarBoard: 'Santa Casa' },
  { slug: 'einstein', name: 'Einstein', calendarBoard: 'Einstein' },
  { slug: 'sirio-libanes', name: 'Sírio-Libanês', calendarBoard: 'Sírio-Libanês' },
];

export function examBoardBySlug(slug: string | undefined): ExamBoardEntry | undefined {
  return examBoards.find((b) => b.slug === slug);
}
