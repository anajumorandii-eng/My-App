import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CalendarClock, ChevronRight } from 'lucide-react';
import { useQuestions } from '../hooks/useQuestions';
import { Panel } from '../components/ui/Panel';
import { examBoards } from '../data/examBoards';
import { examsForBoard, daysUntil } from '../data/examCalendar';
import { discursiveQuestions } from '../data/discursiveQuestions';
import { playbookFor } from '../data/examPlaybooks';
import { examEditions } from '../lib/boardPrep';

// Texto corrido em corpo normal: .ni-link é a etiqueta miúda de rodapé e
// deixava as ações principais da página em 10px.
export const LINK = 'text-sm underline underline-offset-2 hover:text-[var(--action-primary)]';

export const CHIP = 'rounded-full border border-[var(--line)] px-2 py-0.5';

export function daysLabel(days: number): string {
  if (days === 0) return 'é hoje';
  if (days === 1) return 'é amanhã';
  return `faltam ${days} dias`;
}

export function formatExamDate(iso: string): string {
  const [y, m, d] = iso.split('-');
  return `${d}/${m}/${y}`;
}

export default function Provas() {
  const { questions } = useQuestions(true);

  const cards = useMemo(() => examBoards.map((board) => {
    const upcoming = board.calendarBoard ? examsForBoard(board.calendarBoard) : [];
    const editions = board.questionBoard ? examEditions(questions, board.questionBoard) : [];
    const discursive = board.discursiveBoard ? discursiveQuestions.filter((q) => q.board === board.discursiveBoard).length : 0;
    return { board, next: upcoming[0], editions, discursive, playbook: Boolean(playbookFor(board.name)) };
  })
    // Banca com estratégia completa primeiro; depois, a prova mais próxima.
    // Banca sem prova futura vai para o fim: ela continua útil para treino,
    // mas não deve disputar atenção com o que está para acontecer.
    .sort((a, b) => Number(b.playbook) - Number(a.playbook)
      || (a.next ? 0 : 1) - (b.next ? 0 : 1)
      || (a.next && b.next ? a.next.date.localeCompare(b.next.date) : 0)), [questions]);

  return (
    <div className="ni-main space-y-5">
      <div className="ni-title">
        <h1 className="text-2xl font-semibold">Provas e bancas</h1>
        <p className="text-sm">Cada banca cobra de um jeito. Aqui ficam o formato da prova, a estratégia para o dia, como cada matéria é cobrada, o que mais se repete e as provas reais para simulado.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        {cards.map(({ board, next, editions, discursive, playbook }) => {
          const days = next ? daysUntil(next.date) : null;
          return (
            <Link key={board.slug} to={`/provas/${board.slug}`} className="block" aria-label={`Abrir ${board.name}`}>
              <Panel interactive className="p-5 h-full space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-lg font-semibold">{board.name}</h2>
                  <ChevronRight className="w-5 h-5 shrink-0" aria-hidden />
                </div>
                {next ? (
                  <p className="text-sm flex items-center gap-2">
                    <CalendarClock className="w-4 h-4 shrink-0" aria-hidden />
                    <span>{formatExamDate(next.date)} · {daysLabel(days!)}{next.confidence === 'baixa' ? ' · data a confirmar' : ''}</span>
                  </p>
                ) : <p className="text-sm">Sem prova marcada no calendário.</p>}
                <ul className="flex flex-wrap gap-2 text-xs">
                  {playbook && <li className={CHIP} style={{ borderColor: 'var(--action-primary)' }}>Estratégia completa</li>}
                  {editions.length > 0 && <li className={CHIP}>{editions.length} {editions.length === 1 ? 'prova' : 'provas'} para simulado</li>}
                  {discursive > 0 && <li className={CHIP}>{discursive} discursivas</li>}
                </ul>
              </Panel>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
