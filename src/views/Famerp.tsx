import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Clock, Flag, ListChecks, PenLine, XCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useQuestions } from '../hooks/useQuestions';
import { useUserMastery } from '../hooks/useUserMastery';
import { QuestionStatement } from '../components/QuestionStatement';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { addUserAttempt, addUserErrorLog } from '../lib/userData';
import { applyReviewOutcome, qualityFromAnswerCorrectness } from '../lib/spacedRepetition';
import { discursiveQuestions } from '../data/discursiveQuestions';
import type { Question, TopicMastery } from '../types';
import {
  buildFamerpExam, famerpPriorities, famerpYears, formatClock, parseSimuladoState, scoreSimulado, secondsRemaining,
  type SimuladoState,
} from '../lib/famerpPrep';

type Tab = 'simulado' | 'prioridades' | 'segundo-dia';

const storageKey = (uid: string | undefined) => `crivo-famerp-simulado-v1:${uid ?? 'guest'}`;

function readState(key: string): SimuladoState | null {
  try { return parseSimuladoState(localStorage.getItem(key)); } catch { return null; }
}
function writeState(key: string, state: SimuladoState | null) {
  try { if (state) localStorage.setItem(key, JSON.stringify(state)); else localStorage.removeItem(key); } catch { /* sem armazenamento: a prova segue só na memória */ }
}

export default function Famerp() {
  const [tab, setTab] = useState<Tab>('simulado');
  const { questions, loading } = useQuestions(true);

  return (
    <div className="ni-main space-y-5">
      <div className="ni-title">
        <h1 className="text-2xl font-semibold">Famerp</h1>
        <p className="text-sm text-[var(--text-secondary)]">Provas reais de 2022 a 2026 como simulado, os assuntos que mais se repetem e o treino do 2º dia.</p>
      </div>
      <div role="tablist" aria-label="Preparação Famerp" className="flex flex-wrap gap-2">
        {([['simulado', 'Simulado 1º dia'], ['prioridades', 'Prioridades'], ['segundo-dia', '2º dia e redação']] as const).map(([id, label]) => (
          <Button key={id} role="tab" aria-selected={tab === id} variant={tab === id ? 'primary' : 'secondary'} size="sm" onClick={() => setTab(id)}>{label}</Button>
        ))}
      </div>
      {loading && questions.length === 0
        ? <Panel className="p-5"><p>Carregando as provas…</p></Panel>
        : tab === 'simulado' ? <Simulado questions={questions} />
        : tab === 'prioridades' ? <Prioridades questions={questions} />
        : <SegundoDia />}
    </div>
  );
}

function Simulado({ questions }: { questions: Question[] }) {
  const { user } = useAuth();
  const { updateMastery } = useUserMastery();
  const key = storageKey(user?.uid);
  const years = useMemo(() => famerpYears(questions), [questions]);
  const [state, setStateRaw] = useState<SimuladoState | null>(() => readState(key));
  const [year, setYear] = useState<number | null>(null);
  const [minutes, setMinutes] = useState(240);
  const [index, setIndex] = useState(0);
  const [now, setNow] = useState(() => new Date());
  const [recorded, setRecorded] = useState<'idle' | 'saving' | 'done' | 'error'>('idle');

  const setState = (next: SimuladoState | null) => { setStateRaw(next); writeState(key, next); };
  const exam = useMemo(() => (state ? buildFamerpExam(questions, state.year) : []), [questions, state?.year]);

  useEffect(() => {
    if (!state || state.finishedAt) return;
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, [state?.startedAt, state?.finishedAt]);

  const chosenYear = year ?? years[years.length - 1] ?? null;

  if (!state) {
    return (
      <Panel className="p-5 space-y-4">
        <h2 className="text-lg font-semibold">Prova completa, como no dia</h2>
        <p className="text-sm">As 80 questões do caderno oficial, na ordem, sem correção até entregar. Para o plano do guia, deixe 2025 e 2026 para as duas últimas semanas.</p>
        <div className="flex flex-wrap gap-4 items-end">
          <label className="flex flex-col gap-1 text-sm">Ano da prova
            <select className="ni-input" value={chosenYear ?? ''} onChange={(e) => setYear(Number(e.target.value))}>
              {years.map((y) => <option key={y} value={y}>Famerp {y}</option>)}
            </select>
          </label>
          <label className="flex flex-col gap-1 text-sm">Tempo (minutos)
            <input className="ni-input w-28" type="number" min={30} max={480} step={10} value={minutes} onChange={(e) => setMinutes(Math.max(30, Number(e.target.value) || 30))} />
          </label>
          <Button disabled={chosenYear === null} onClick={() => { setIndex(0); setRecorded('idle'); setState({ year: chosenYear!, minutes, startedAt: new Date().toISOString(), answers: {} }); }}>Começar simulado</Button>
        </div>
        <p className="text-xs text-[var(--text-secondary)]">Use o tempo de prova do edital do Vestibular 2027; o valor inicial é só uma sugestão.</p>
      </Panel>
    );
  }

  if (exam.length === 0) {
    return <Panel className="p-5 space-y-3"><p>A prova Famerp {state.year} não está no banco carregado.</p><Button variant="secondary" onClick={() => setState(null)}>Escolher outra prova</Button></Panel>;
  }

  if (state.finishedAt) {
    return <Resultado exam={exam} state={state} recorded={recorded} onRecord={async () => {
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
            notes: `Simulado Famerp ${state.year}, questão ${q.examSource?.questionNumber}: marcou ${state.answers[id].toUpperCase()}, gabarito ${q.correctOptionId.toUpperCase()}.`,
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
        <span className="text-sm">Famerp {state.year} · {answeredCount}/{exam.length} respondidas</span>
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

function Resultado({ exam, state, recorded, onRecord, onRestart }: {
  exam: Question[]; state: SimuladoState; recorded: 'idle' | 'saving' | 'done' | 'error'; onRecord: () => void; onRestart: () => void;
}) {
  const { user } = useAuth();
  const result = useMemo(() => scoreSimulado(exam, state.answers), [exam, state.answers]);
  const usedSeconds = Math.round((Date.parse(state.finishedAt!) - Date.parse(state.startedAt)) / 1000);
  const wrong = exam.filter((q) => result.wrongIds.includes(q.id) || result.blankIds.includes(q.id));

  return (
    <div className="space-y-4">
      <Panel className="p-5 space-y-3">
        <h2 className="text-lg font-semibold">Famerp {state.year}: {result.correct} de {result.total}</h2>
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

function Prioridades({ questions }: { questions: Question[] }) {
  const priorities = useMemo(() => famerpPriorities(questions), [questions]);
  const years = useMemo(() => famerpYears(questions), [questions]);
  const subjects = [...new Set(priorities.map((p) => p.subject))];

  return (
    <div className="space-y-4">
      <Panel className="p-5 space-y-2">
        <h2 className="text-lg font-semibold">O que mais se repete</h2>
        <p className="text-sm">Capítulos que caíram em 3 ou mais das {years.length} provas objetivas do banco ({years[years.length - 1]}–{years[0]}). ★★ = 4 anos ou mais; ★ = 3 anos. A lista sai das próprias provas e muda se um ano novo for importado.</p>
        <p className="text-sm">Treine cada um com as provas de 2022 a 2024 e deixe 2025 e 2026 para os simulados completos.</p>
      </Panel>
      {subjects.map((subject) => (
        <Panel key={subject} className="p-5 space-y-2">
          <h3 className="font-semibold">{subject}</h3>
          <ul className="space-y-2">
            {priorities.filter((p) => p.subject === subject).map((p) => (
              <li key={`${p.topicId}-${p.chapter}`} className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
                <span aria-label={p.stars === 2 ? 'caiu em 4 anos ou mais' : 'caiu em 3 anos'}>{p.stars === 2 ? '★★' : '★'}</span>
                <span className="font-medium">{p.chapter}</span>
                <span className="text-xs">{p.years.join(', ')} · {p.count} questões</span>
                <Link className="ni-link text-xs ml-auto" to={`/questoes?board=FAMERP&topic=${encodeURIComponent(p.topicId)}&chapter=${encodeURIComponent(p.chapter)}`}>Treinar</Link>
              </li>
            ))}
          </ul>
        </Panel>
      ))}
    </div>
  );
}

function SegundoDia() {
  const famerp = discursiveQuestions.filter((q) => q.board === 'Famerp');
  const bySubject = famerp.reduce<Record<string, number>>((acc, q) => ({ ...acc, [q.subject]: (acc[q.subject] ?? 0) + 1 }), {});
  return (
    <div className="space-y-4">
      <Panel className="p-5 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2"><ListChecks className="w-5 h-5" aria-hidden /> Discursivas</h2>
        <p className="text-sm">{famerp.length} questões reais do 2º dia: {Object.entries(bySubject).map(([s, n]) => `${s} ${n}`).join(', ')}. Escreva a resposta e peça a correção do CRIVO, que compara com a resposta-modelo.</p>
        <ol className="text-sm list-decimal pl-5 space-y-1">
          <li>Procure no texto de apoio o dado decisivo (massa molar, potencial, meia-vida).</li>
          <li>Sublinhe o verbo de comando de cada item: cite, explique, justifique, calcule, escreva a equação.</li>
          <li>Nomeie com o termo técnico e explique o porquê em uma frase.</li>
          <li>Nas contas: fórmula, substituição com unidades, resultado com unidade.</li>
        </ol>
        <Link className="ni-link" to="/treino-2a-fase?banca=Famerp">Treinar discursivas da Famerp</Link>
      </Panel>
      <Panel className="p-5 space-y-2">
        <h2 className="text-lg font-semibold flex items-center gap-2"><PenLine className="w-5 h-5" aria-hidden /> Redação</h2>
        <p className="text-sm">Uma redação por semana no formato Famerp: tese clara, duas razões explicadas, coletânea sem cópia. A correção usa os critérios da banca.</p>
        <Link className="ni-link" to="/redacao">Abrir o ateliê de redação</Link>
      </Panel>
    </div>
  );
}
