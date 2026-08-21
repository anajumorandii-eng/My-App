// Horário semanal do cursinho (MED4-PLT, Anglo), extraído do print enviado pela
// aluna referente à semana de 17-22/ago/2026. As matérias específicas de cada
// horário mudam ao longo do trimestre (o cursinho roda módulos diferentes),
// mas os BLOCOS DE HORÁRIO (quando começa e termina a aula em cada dia da
// semana) se repetem — é essa parte estável que usamos para saber quando a
// aluna está livre para estudo autônomo. Não há aula aos domingos nesse
// horário. Datas de feriado ou provas do próprio cursinho não estão
// capturadas aqui — se um dia específico for atípico, isso precisa ser
// ajustado manualmente.
export interface ClassBlock {
  start: string; // "HH:MM"
  end: string; // "HH:MM"
  label: string;
}

// Chave = Date.getDay() (0 = domingo ... 6 = sábado).
export const CURSINHO_WEEKLY_SCHEDULE: Record<number, ClassBlock[]> = {
  0: [], // domingo — sem aula
  1: [
    // segunda
    { start: '07:00', end: '07:50', label: 'Geografia do Brasil' },
    { start: '07:55', end: '08:45', label: 'Biologia C' },
    { start: '08:50', end: '09:40', label: 'Atualidades' },
    { start: '09:45', end: '10:35', label: 'Física A' },
    { start: '11:05', end: '11:55', label: 'História Geral' },
    { start: '12:00', end: '12:50', label: 'Física C' },
    { start: '12:55', end: '13:45', label: 'Química A' },
    { start: '14:55', end: '15:45', label: 'Inglês' },
  ],
  2: [
    // terça
    { start: '07:00', end: '07:50', label: 'História do Brasil' },
    { start: '07:55', end: '08:45', label: 'História do Brasil' },
    { start: '08:50', end: '09:40', label: 'Matemática A' },
    { start: '09:45', end: '10:35', label: 'Texto' },
    { start: '11:05', end: '11:55', label: 'Sociologia' },
    { start: '12:00', end: '12:50', label: 'Matemática A' },
    { start: '12:55', end: '13:45', label: 'Geografia Geral' },
  ],
  3: [
    // quarta
    { start: '07:00', end: '07:50', label: 'Geografia do Brasil' },
    { start: '07:55', end: '08:45', label: 'Física C' },
    { start: '08:50', end: '09:40', label: 'Matemática C' },
    { start: '09:45', end: '10:35', label: 'Literatura' },
    { start: '11:05', end: '11:55', label: 'Física B' },
    { start: '12:00', end: '12:50', label: 'Literatura' },
    { start: '12:55', end: '13:45', label: 'Matemática C' },
  ],
  4: [
    // quinta
    { start: '07:00', end: '07:50', label: 'Biologia A' },
    { start: '07:55', end: '08:45', label: 'Biologia A' },
    { start: '08:50', end: '09:40', label: 'Física A' },
    { start: '09:45', end: '10:35', label: 'Biologia C' },
    { start: '11:05', end: '11:55', label: 'Gramática' },
    { start: '12:00', end: '12:50', label: 'Física B' },
    { start: '12:55', end: '13:45', label: 'Química B' },
    { start: '14:55', end: '15:45', label: 'Física D' },
    { start: '15:50', end: '16:40', label: 'Obras Fuvest' },
    { start: '16:45', end: '17:35', label: 'Matemática D' },
  ],
  5: [
    // sexta
    { start: '07:00', end: '07:50', label: 'História Geral' },
    { start: '07:55', end: '08:45', label: 'Biologia B' },
    { start: '08:50', end: '09:40', label: 'Gramática' },
    { start: '09:45', end: '10:35', label: 'Química C' },
    { start: '11:05', end: '11:55', label: 'Matemática B' },
    { start: '12:00', end: '12:50', label: 'Química C' },
    { start: '12:55', end: '13:45', label: 'Biologia B' },
  ],
  6: [
    // sábado
    { start: '07:00', end: '07:50', label: 'Geografia Geral' },
    { start: '07:55', end: '08:45', label: 'Química B' },
    { start: '08:50', end: '09:40', label: 'Matemática B' },
    { start: '09:45', end: '10:35', label: 'Filosofia' },
    { start: '11:05', end: '11:55', label: 'Redação' },
    { start: '12:00', end: '12:50', label: 'Redação' },
    { start: '12:55', end: '13:45', label: 'Química A' },
  ],
};

function timeToMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number);
  return h * 60 + m;
}

/** Minuto (desde 00:00) em que termina a última aula do dia, ou null se não há aula. */
export function lastClassEndMinutes(weekday: number): number | null {
  const blocks = CURSINHO_WEEKLY_SCHEDULE[weekday] ?? [];
  if (blocks.length === 0) return null;
  return Math.max(...blocks.map((b) => timeToMinutes(b.end)));
}
