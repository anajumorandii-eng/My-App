import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Flag, XCircle } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUserMastery } from '../../hooks/useUserMastery';
import { QuestionStatement } from '../QuestionStatement';
import { Panel } from '../ui/Panel';
import { Button } from '../ui/Button';
import { addUserAttempt, addUserErrorLog } from '../../lib/userData';
import { applyReviewOutcome, qualityFromAnswerCorrectness } from '../../lib/spacedRepetition';
import type { Question, TopicMastery } from '../../types';
import {
  buildExam, examEditions, formatClock, parseSimuladoState, scoreSimulado, secondsRemaining,
  type SimuladoState,
} from '../../lib/boardPrep';
import { canonicalExamBoard } from '../../lib/questionExamFilters';

// Um simulado por vez por estudante, de qualquer banca: a chave não leva a
// banca porque não faz sentido manter duas provas de horas abertas ao mesmo
// tempo, e a tela de outra banca mostra a prova em andamento em vez de
// apagá-la.
const storageKey = (uid: string | undefined) => `crivo-simulado-v1:${uid ?? 'guest'}`;

// A tela avulsa /famerp, anterior a esta área, guardava a prova em outra
// chave e sem banca nem caderno. Sem esta migração, uma prova em andamento ou
// um resultado ainda não registrado sumiam na troca de tela.
const legacyFamerpKey = (key: string) => key.replace('crivo-simulado-v1:', 'crivo-famerp-simulado-v1:');

function readState(key: string): SimuladoState | null {
  try {
    const current = parseSimuladoState(localStorage.getItem(key));
    if (current) return current;
    const legacyRaw = localStorage.getItem(legacyFamerpKey(key));
    if (!legacyRaw) return null;
    const legacy = JSON.parse(legacyRaw) as Record<string, unknown>;
    // As provas completas da Famerp no banco são todas do caderno V1.
    const migrated = parseSimuladoState(JSON.stringify({ ...legacy, board: 'FAMERP', version: 'V1' }));
    if (migrated) localStorage.setItem(key, JSON.stringify(migrated));
    localStorage.removeItem(legacyFamerpKey(key));
    return migrated;
  } catch { return null; }
}
function writeState(key: string, state: SimuladoState | null) {
  try { if (state) localStorage.setItem(key, JSON.stringify(state)); else localStorage.removeItem(key); } catch { /* sem armazenamento: a prova segue só na memória */ }
}

const editionLabel = (board: string, year: number, version: string) => `${board} ${year}${version && version !== 'V1' ? ` · ${version}` : ''}`;

export function ExamSimulator({ questions, board, boardName, defaultMinutes }: { questions: Question[]; board: string; boardName: string; defaultMinutes: number }) {
  const { user } = useAuth();
  const { updateMastery } = useUserMastery();
  const key = storageKey(user?.uid);
  const editions = useMemo(() => examEditions(questions, board), [questions, board]);
  const [state, setStateRaw] = useState<SimuladoState | null>(() => readState(key));
  const [editionKey, setEditionKey] = useState<string | null>(null);
  const [minutes, setMinutes] = useState(defaultMinutes);
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const [recorded, setRecorded] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  const setState = (next: SimuladoState | null) => { setStateRaw(next); writeState(key, next); };
  const exam = useMemo(() => (state ? buildExam(questions, state.board, state.year, state.version) : []), [questions, state?.board, state?.year, state?.version]);

  useEffect(() => {
    if (!state || state.finishedAt) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [state?.startedAt, state?.finishedAt]);

  // Começa pela edição mais antiga: as recentes ficam para a reta final.
  const chosen = editions.find((e) => `${e.year}::${e.version}` === editionKey) ?? editions[editions.length - 1] ?? null;

  if (!state) {
    return (
      <Panel className="p-5 space-y-4">
        <h2 className="text-lg font-semibold">Prova completa, como no dia</h2>
        <p className="text-sm">O caderno oficial inteiro, na ordem, sem correção até entregar. Deixe as provas mais recentes para as duas últimas semanas.</p>
        <div className="flex flex-wrap gap-4 items-end">
          <label className="flex flex-col gap-1 text-sm">Ano da prova
            <select className="ni-input" value={chosen ? `${chosen.year}::${chosen.version}` : ''} onChange={(e) => setEditionKey(e.target.value)}>
              {editions.map((e) => <option key={`${e.year}::${e.version}`} value={`${e.year}::${e.version}`}>{editionLabel(boardName, e.year, e.version)} · {e.count} questões</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">Tempo (minutos)
            <input className="ni-input w-28" type="number" min={30} max={480} step={10} value={minutes} onChange={(e) => setMinutes(Math.max(30, Number(e.target.value) || 30))} />
          </label>
          <Button disabled={chosen === null} onClick={() => { setIndex(0); setRecorded('idle'); setState({ board, year: chosen!.year, version: chosen!.version, minutes, startedAt: new Date().toISOString(), answers: {} }); }}>Começar simulado</Button>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">Use o tempo de prova do edital; o valor inicial é só uma sugestão. Ritmo: {(minutes * 60 / Math.max(1, chosen?.count ?? 1) / 60).toFixed(1).replace('.', ',')} min por questão, sem contar o gabarito.</p>
      </Panel>
    );
  }

  if (canonicalExamBoard(state.board) !== canonicalExamBoard(board)) {
    return (
      <Panel className="p-5 space-y-3">
        <p>Há um simulado {state.board} {state.year} {state.finishedAt ? 'entregue, com o resultado ainda aberto' : 'em andamento'} na página dessa banca.</p>
        <p className="text-sm">Um simulado por vez: termine ou descarte aquele antes de começar outro.</p>
        <Button variant="secondary" onClick={() => { if (window.confirm('Descartar o outro simulado? As respostas dele serão perdidas.')) setState(null); }}>Descartar e começar aqui</Button>
      </Panel>
    );
  }

  if (exam.length === 0) {
    return <Panel className="p-5 space-y-3"><p>A prova {editionLabel(boardName, state.year, state.version)} não está no banco carregado.</p><Button variant="secondary" onClick={() => setState(null)}>Escolher outra prova</Button></Panel>;
  }

  if (state.finishedAt) {
    return <Resultado boardName={boardName} exam={exam} state={state} recorded={recorded} onRecord={async () => {
      if (!user || recorded === 'saving' || recorded === 'done') return;
      setRecorded('saving');
      const result = scoreSimulado(exam, state.answers);
      const date = state.finishedAt!;
      try {
        await Promise.all(exam.filter((q) => q.status !== 'annulled' && state.answers[q.id]).map((q) => addUserAttempt(user.uid, {
          id: `attempt_${crypto.randomUUID()}`, questionId: q.id, topicId: q.topicId, correct: state.answers[q.id] === q.correctOptionId, date,
        })));
        await Promise.all(result.wrongIds.map((id) => {
          const q = exam.find((x) => x.id === id)!;
          return addUserErrorLog(user.uid, {
            id: `error_${crypto.randomUUID()}`, topicId: q.topicId, questionId: q.id, date, type: 'unknown', confidence: 'baixa',
            notes: `Simulado ${editionLabel(boardName, state.year, state.version)}, questão ${q.examSource?.questionNumber}: marcou ${state.answers[id].toUpperCase()}, gabarito ${q.correctOptionId.toUpperCase()}.`,
          });
        }));
        setRecorded('done');
      } catch { setRecorded('error'); }
    }} onRestart={() => setState(null)} />;
  }

  const remaining = secondsRemaining(state, now);
  const question = exam[Math.min(index, exam.length - 1)];
  const answeredCount = exam.filter((q) => state.answers[q.id]).length;

  const finish = () => {
    const blanks = exam.length - answeredCount;
    if (blanks > 0 && !window.confirm(`Ainda há ${blanks} questões em branco. Entregar mesmo assim?`)) return;
    const finished = { ...state, finishedAt: new Date().toISOString() };
    setState(finished);
    // O domínio é atualizado na entrega, uma vez, como no treino avulso.
    updateMastery((previous) => {
      const next = [...previous];
      for (const q of exam) {
        const answer = state.answers[q.id];
        if (!answer || q.status === 'annulled') continue;
        const i = next.findIndex((m) => m.topicId === q.topicId);
        const current: TopicMastery = i >= 0 ? next[i] : { topicId: q.topicId, level: 50, uncertainty: 0.8, lastReviewed: new Date(0).toISOString(), errorSignals: 0 };
        const updated: TopicMastery = { ...current, ...applyReviewOutcome(current, qualityFromAnswerCorrectness(answer === q.correctOptionId)), origin: 'observed' };
        if (i >= 0) next[i] = updated; else next.push(updated);
      }
      return next;
    });
  };

  return (
    <div className="space-y-4">
      <Panel className="p-4 flex flex-wrap items-center gap-4 justify-between">
        <div className="flex items-center gap-2 font-semibold">
          <Clock className="w-4 h-4" aria-hidden />
          <span aria-live="off" style={{ color: remaining < 0 ? 'var(--status-error)' : remaining < 900 ? 'var(--status-warning)' : undefined }}>{formatClock(remaining)}</span>
          {remaining < 0 && <span className="text-sm" style={{ color: 'var(--status-error)' }}>tempo esgotado</span>}
        </div>
        <span className="text-sm">{editionLabel(boardName, state.year, state.version)} · {answeredCount}/{exam.length} respondidas</span>
        <Button size="sm" onClick={finish}><Flag className="w-4 h-4" aria-hidden /> Entregar prova</Button>
      </Panel>

      <nav aria-label="Questões da prova" className="flex flex-wrap gap-1">
        {exam.map((q, i) => (
          <button key={q.id} type="button" onClick={() => setIndex(i)} aria-current={i === index ? 'true' : undefined}
            aria-label={`Questão ${i + 1}${state.answers[q.id] ? ', respondida' : ''}`}
            className="w-8 h-8 text-xs rounded border border-[var(--line)]"
            // Fundo opaco do token: sem ele a decoração da tela aparecia por trás dos números.
            style={i === index ? { background: 'var(--action-primary)', color: 'var(--text-inverse)' } : { background: 'var(--surface-default)', ...(state.answers[q.id] ? { fontWeight: 700, borderColor: 'var(--action-primary)' } : {}) }}>
            {i + 1}
          </button>
        ))}
      </nav>

      <Panel className="p-5 space-y-4">
        <p className="text-xs uppercase tracking-wide">Questão {question.examSource?.questionNumber} · {question.subject}</p>
        <div className="ni-question min-w-0" style={{ maxWidth: 'none' }}><QuestionStatement question={question} /></div>
        <div className="ni-options" role="radiogroup" aria-label="Alternativas" style={{ gridTemplateColumns: '1fr' }}>
          {question.options.map((option) => {
            const selected = state.answers[question.id] === option.id;
            return (
              <button key={option.id} type="button" role="radio" aria-checked={selected}
                onClick={() => setState({ ...state, answers: { ...state.answers, [question.id]: option.id } })}
                className="text-xs text-left flex items-center gap-2"
                style={selected ? { borderColor: 'var(--action-primary)', boxShadow: 'inset 0 0 0 1px var(--action-primary)' } : undefined}>
                <b>{option.id.toUpperCase()}</b><span>{option.text}</span>
              </button>
            );
          })}
        </div>
        <div className="flex justify-between">
          <Button variant="secondary" size="sm" disabled={index === 0} onClick={() => setIndex(index - 1)}>Anterior</Button>
          <Button variant="secondary" size="sm" disabled={index >= exam.length - 1} onClick={() => setIndex(index + 1)}>Próxima</Button>
        </div>
      </Panel>
      <p className="text-xs">As respostas ficam salvas neste navegador; recarregar a página não perde a prova.</p>
    </div>
  );
}

function Resultado({ boardName, exam, state, recorded, onRecord, onRestart }: {
  boardName: string; exam: Question[]; state: SimuladoState; recorded: 'idle' | 'saving' | 'done' | 'error'; onRecord: () => void; onRestart: () => void;
}) {
  const { user } = useAuth();
  const result = useMemo(() => scoreSimulado(exam, state.answers), [exam, state.answers]);
  const usedSeconds = Math.round((Date.parse(state.finishedAt!) - Date.parse(state.startedAt)) / 1000);
  const wrong = exam.filter((q) => result.wrongIds.includes(q.id) || result.blankIds.includes(q.id));

  return (
    <div className="space-y-4">
      <Panel className="p-5 space-y-3">
        <h2 className="text-lg font-semibold">{editionLabel(boardName, state.year, state.version)}: {result.correct} de {result.total}</h2>
        <p className="text-sm">{result.answered} respondidas, {result.blankIds.length} em branco{result.annulled ? `, ${result.annulled} anulada(s) fora da conta` : ''}. Tempo usado: {formatClock(usedSeconds)} de {formatClock(state.minutes * 60)}.</p>
        <table className="w-full text-sm">
          <caption className="text-left text-xs mb-1">Da matéria mais fraca para a mais forte</caption>
          <thead><tr><th className="text-left">Matéria</th><th className="text-right">Acertos</th><th className="text-right">%</th></tr></thead>
          <tbody>{result.bySubject.map((s) => (
            <tr key={s.subject}><td>{s.subject}</td><td className="text-right">{s.correct}/{s.total}</td><td className="text-right">{Math.round((100 * s.correct) / s.total)}%</td></tr>
          ))}</tbody>
        </table>
        <div className="flex flex-wrap gap-2">
          {user
            ? <Button size="sm" disabled={recorded === 'saving' || recorded === 'done'} onClick={onRecord}>{recorded === 'done' ? 'Registrado no Caderno de Erros' : 'Registrar erros e tentativas'}</Button>
            : <p className="text-xs">Entre na sua conta para levar os erros ao Caderno de Erros.</p>}
          <Button size="sm" variant="secondary" onClick={onRestart}>Novo simulado</Button>
        </div>
        {recorded === 'error' && <p role="alert" className="text-sm" style={{ color: 'var(--status-error)' }}>Não foi possível registrar agora. O resultado continua aqui; tente de novo.</p>}
        {recorded === 'done' && <p className="text-sm">Os erros entraram como “não sei o motivo”. Diagnostique cada um no <Link className="ni-link" to="/erros">Caderno de Erros</Link>.</p>}
      </Panel>

      <h3 className="font-semibold">Erros e brancos ({wrong.length})</h3>
      {wrong.map((q) => {
        const mine = state.answers[q.id];
        return (
          <details key={q.id} className="ni-panel p-4">
            <summary className="cursor-pointer text-sm flex items-center gap-2">
              <XCircle className="w-4 h-4 shrink-0" style={{ color: 'var(--status-error)' }} aria-hidden />
              Questão {q.examSource?.questionNumber} · {q.subject} · {q.chapter ?? ''} — {mine ? `marcou ${mine.toUpperCase()}` : 'em branco'}, gabarito {q.correctOptionId.toUpperCase()}
            </summary>
            <div className="mt-3 space-y-3">
              <div className="ni-question min-w-0" style={{ maxWidth: 'none' }}><QuestionStatement question={q} /></div>
              <ul className="text-xs space-y-1">{q.options.map((o) => (
                <li key={o.id} style={o.id === q.correctOptionId ? { color: 'var(--status-success)', fontWeight: 600 } : o.id === mine ? { color: 'var(--status-error)' } : undefined}>
                  {o.id === q.correctOptionId && <CheckCircle2 className="inline w-3 h-3 mr-1" aria-label="gabarito" />}{o.id.toUpperCase()}) {o.text}
                </li>
              ))}</ul>
              <p className="text-sm whitespace-pre-line">{q.explanation}</p>
            </div>
          </details>
        );
      })}
    </div>
  );
}

