// Cronograma de estudos importado da conta da estudante. Mora em
// users/{uid}/data/studyPlan, e nunca no código: o repositório é público e o
// cronograma traz rotina, turma do cursinho e horários dela. O código só sabe
// a forma do documento e como ler o dia; o conteúdo chega pela importação.
//
// O documento é escrito pelo Admin SDK (scripts/importar-cronograma.mts), mas
// a regra do Firestore deixa a própria conta gravar em users/{uid}/**. Por
// isso a leitura não confia na forma: o que não passa na validação é
// descartado item a item, e um documento inteiro inválido vira "sem
// cronograma", nunca uma tela quebrada.

export const STUDY_PLAN_RESOURCES = ['questoes', 'erros', 'obras', 'redacao', 'discursivas', 'flashcards', 'resumos', 'fila'] as const;
export type StudyPlanResource = typeof STUDY_PLAN_RESOURCES[number];

export interface StudyPlanBlock {
  start: string;
  end: string;
  label: string;
  activity: string;
  questions?: number;
  tip?: string;
  resource?: StudyPlanResource;
  /** Caminho dentro do recurso, como `/questoes?board=FUVEST`. */
  path?: string;
}

export type StudyPlanDayKind = 'study' | 'simulado' | 'eve' | 'exam' | 'rest';

export interface StudyPlanDay {
  title: string;
  kind: StudyPlanDayKind;
  morning?: string;
  blocks: StudyPlanBlock[];
  notes?: string[];
}

export interface StudyPlanExam { label: string; date: string; endDate?: string; time?: string }
export interface StudyPlanDeadline { label: string; date: string }
export interface StudyPlanPhase { id: string; label: string; start: string; end: string; focus: string }

export interface StudyPlan {
  version: 1;
  title: string;
  exams: StudyPlanExam[];
  deadlines: StudyPlanDeadline[];
  phases: StudyPlanPhase[];
  rules: string[];
  eveChecklist: string[];
  days: Record<string, StudyPlanDay>;
}

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const KINDS: ReadonlySet<string> = new Set<StudyPlanDayKind>(['study', 'simulado', 'eve', 'exam', 'rest']);
const RESOURCES: ReadonlySet<string> = new Set<string>(STUDY_PLAN_RESOURCES);

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null && !Array.isArray(value);
const text = (value: unknown, max = 400): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const date = (value: unknown): value is string => typeof value === 'string' && DATE_RE.test(value);
const strings = (value: unknown): string[] => Array.isArray(value) ? value.filter((item): item is string => text(item)) : [];

function parseBlock(value: unknown): StudyPlanBlock | null {
  if (!isRecord(value)) return null;
  const { start, end, label, activity, questions, tip, resource, path } = value;
  if (typeof start !== 'string' || !TIME_RE.test(start) || typeof end !== 'string' || !TIME_RE.test(end) || end <= start) return null;
  if (!text(label, 80) || !text(activity)) return null;
  const block: StudyPlanBlock = { start, end, label, activity };
  if (typeof questions === 'number' && Number.isInteger(questions) && questions > 0 && questions <= 200) block.questions = questions;
  if (text(tip)) block.tip = tip;
  if (typeof resource === 'string' && RESOURCES.has(resource)) {
    block.resource = resource as StudyPlanResource;
    // O caminho só vale dentro do próprio recurso: um documento gravado pela
    // conta não pode fazer o botão "Abrir" sair do app.
    if (typeof path === 'string' && path.startsWith(`/${resource === 'discursivas' ? 'treino-2a-fase' : resource}`) && !path.includes('//')) block.path = path;
  }
  return block;
}

function parseDay(value: unknown): StudyPlanDay | null {
  if (!isRecord(value) || !text(value.title, 120) || typeof value.kind !== 'string' || !KINDS.has(value.kind)) return null;
  const blocks = Array.isArray(value.blocks) ? value.blocks.map(parseBlock).filter((b): b is StudyPlanBlock => b !== null) : [];
  blocks.sort((a, b) => a.start.localeCompare(b.start));
  const day: StudyPlanDay = { title: value.title, kind: value.kind as StudyPlanDayKind, blocks };
  if (text(value.morning)) day.morning = value.morning;
  const notes = strings(value.notes);
  if (notes.length) day.notes = notes;
  return day;
}

export function parseStudyPlan(value: unknown): StudyPlan | null {
  if (!isRecord(value) || value.version !== 1 || !text(value.title, 120) || !isRecord(value.days)) return null;
  const exams = Array.isArray(value.exams) ? value.exams.flatMap((exam): StudyPlanExam[] => {
    if (!isRecord(exam) || !text(exam.label, 120) || !date(exam.date)) return [];
    const parsed: StudyPlanExam = { label: exam.label, date: exam.date };
    if (date(exam.endDate) && exam.endDate >= exam.date) parsed.endDate = exam.endDate;
    if (text(exam.time, 80)) parsed.time = exam.time;
    return [parsed];
  }) : [];
  const deadlines = Array.isArray(value.deadlines) ? value.deadlines.flatMap((item): StudyPlanDeadline[] =>
    isRecord(item) && text(item.label, 160) && date(item.date) ? [{ label: item.label, date: item.date }] : []) : [];
  const phases = Array.isArray(value.phases) ? value.phases.flatMap((item): StudyPlanPhase[] =>
    isRecord(item) && text(item.id, 40) && text(item.label, 120) && date(item.start) && date(item.end) && item.end >= item.start && text(item.focus)
      ? [{ id: item.id, label: item.label, start: item.start, end: item.end, focus: item.focus }] : []) : [];
  const days: Record<string, StudyPlanDay> = {};
  for (const [key, day] of Object.entries(value.days)) {
    const parsed = date(key) ? parseDay(day) : null;
    if (parsed) days[key] = parsed;
  }
  exams.sort((a, b) => a.date.localeCompare(b.date));
  deadlines.sort((a, b) => a.date.localeCompare(b.date));
  return { version: 1, title: value.title, exams, deadlines, phases, rules: strings(value.rules), eveChecklist: strings(value.eveChecklist), days };
}

/** Dias corridos entre duas datas locais (AAAA-MM-DD), sem fuso. */
export function daysBetween(from: string, to: string): number {
  return Math.round((Date.UTC(+to.slice(0, 4), +to.slice(5, 7) - 1, +to.slice(8, 10)) - Date.UTC(+from.slice(0, 4), +from.slice(5, 7) - 1, +from.slice(8, 10))) / 86_400_000);
}

export interface StudyPlanToday {
  localDate: string;
  phase?: StudyPlanPhase;
  day?: StudyPlanDay;
  /** Provas que ainda não terminaram, a partir de hoje (no máximo quatro). */
  upcomingExams: (StudyPlanExam & { days: number })[];
  /** Prazos de hoje em diante; os vencidos somem em vez de acusar. */
  deadlines: (StudyPlanDeadline & { days: number })[];
  /** O bloco em andamento ou o próximo, pelo horário de agora. */
  currentBlockIndex: number | null;
}

export function studyPlanForDate(plan: StudyPlan, localDate: string, localTime?: string): StudyPlanToday {
  const day = plan.days[localDate];
  let currentBlockIndex: number | null = null;
  if (day && localTime) {
    const index = day.blocks.findIndex((block) => block.end > localTime);
    currentBlockIndex = index >= 0 ? index : null;
  }
  return {
    localDate,
    phase: plan.phases.find((phase) => phase.start <= localDate && localDate <= phase.end),
    day,
    upcomingExams: plan.exams.filter((exam) => (exam.endDate ?? exam.date) >= localDate).slice(0, 4).map((exam) => ({ ...exam, days: Math.max(0, daysBetween(localDate, exam.date)) })),
    deadlines: plan.deadlines.filter((item) => item.date >= localDate).map((item) => ({ ...item, days: daysBetween(localDate, item.date) })),
    currentBlockIndex,
  };
}
