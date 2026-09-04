import React, { useEffect, useMemo, useState } from 'react';
import { discursiveQuestions, boardExamStructure } from '../data/discursiveQuestions';
import { secondPhaseProtocols } from '../data/resolutionStrategies';
import { useDiscursiveAttempts } from '../hooks/useDiscursiveAttempts';
import { useUserMastery } from '../hooks/useUserMastery';
import { applyDiscursiveSelfRatingOutcome } from '../lib/spacedRepetition';
import { requestAiTextStream } from '../lib/aiClient';
import { AiText } from '../components/AiText';
import { DiscursiveQuestion } from '../types';
import {
  ClipboardEdit,
  AlertTriangle,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Eye,
  Sparkles,
  Check,
  CloudOff,
  Compass,
  ChevronDown,
} from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { PALETTES, PALETTE_INK } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

function formatTime(totalSeconds: number) {
  const m = Math.floor(totalSeconds / 60).toString().padStart(2, '0');
  const s = Math.floor(totalSeconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function fullQuestionText(q: DiscursiveQuestion): string {
  let text = q.prompt;
  if (q.subItems) {
    text += '\n' + q.subItems.map((s) => `(${s.letter}) ${s.prompt}`).join('\n');
  }
  return text;
}

type Rating = 'fraco' | 'mediano' | 'forte';

const RATING_LABELS: { value: Rating; label: string; classes: string }[] = [
  { value: 'fraco', label: 'Fraco', classes: 'bg-rose-600 border-rose-600 text-white' },
  { value: 'mediano', label: 'Mediano', classes: 'bg-amber-500 border-amber-500 text-white' },
  { value: 'forte', label: 'Forte', classes: 'bg-emerald-600 border-emerald-600 text-white' },
];

export default function Treino2aFase() {
  const { attempts, addAttempt, isPersisted, syncError } = useDiscursiveAttempts();
  const { updateMastery, syncing: masterySyncing, syncError: masterySyncError } = useUserMastery();

  const boards = useMemo(() => ['Todas', ...new Set(discursiveQuestions.map((q) => q.board))], []);
  const [boardFilter, setBoardFilter] = useState('Todas');
  const subjects = useMemo(() => {
    const pool = boardFilter === 'Todas' ? discursiveQuestions : discursiveQuestions.filter((q) => q.board === boardFilter);
    return ['Todas', ...new Set(pool.map((q) => q.subject))];
  }, [boardFilter]);
  const [subjectFilter, setSubjectFilter] = useState('Todas');
  const [index, setIndex] = useState(0);

  const pool = useMemo(() => {
    let result = boardFilter === 'Todas' ? discursiveQuestions : discursiveQuestions.filter((q) => q.board === boardFilter);
    if (subjectFilter !== 'Todas') result = result.filter((q) => q.subject === subjectFilter);
    return result;
  }, [boardFilter, subjectFilter]);

  const question = pool.length > 0 ? pool[index % pool.length] : null;

  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [showProtocol, setShowProtocol] = useState(false);
  const [rating, setRating] = useState<Rating | null>(null);
  const [savedFlash, setSavedFlash] = useState(false);
  const [aiFeedback, setAiFeedback] = useState<string | null>(null);
  const [loadingFeedback, setLoadingFeedback] = useState(false);

  const [secondsLeft, setSecondsLeft] = useState((question?.suggestedMinutes ?? 15) * 60);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    setAnswer('');
    setRevealed(false);
    setShowProtocol(false);
    setRating(null);
    setAiFeedback(null);
    setIsRunning(false);
    setSecondsLeft((question?.suggestedMinutes ?? 15) * 60);
  }, [question?.id]);

  useEffect(() => {
    if (!isRunning) return;
    const interval = setInterval(() => {
      setSecondsLeft((prev) => (prev <= 1 ? 0 : prev - 1));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  const changeFilter = (setter: (v: string) => void, value: string) => {
    setter(value);
    setIndex(0);
  };

  const protocol = question
    ? secondPhaseProtocols.find((p) => p.board === question.board && !p.scope.toLowerCase().includes('literatura'))
    : undefined;

  const rate = (value: Rating) => {
    if (!question || rating) return;
    setRating(value);
    addAttempt({
      id: `disc_attempt_${Date.now()}`,
      questionId: question.id,
      topicId: question.topicId,
      selfRating: value,
      date: new Date().toISOString(),
    });
    updateMastery((items) => items.map((item) => item.topicId === question.topicId
      ? { ...item, ...applyDiscursiveSelfRatingOutcome(item, value) }
      : item));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const fetchAiFeedback = async () => {
    if (!question || !answer.trim()) return;
    setLoadingFeedback(true);
    try {
      let acumulado = '';
      const data = await requestAiTextStream('discursive-feedback', {
        board: question.board,
        subject: question.subject,
        prompt: fullQuestionText(question),
        modelAnswer: question.modelAnswer,
        studentAnswer: answer,
      }, (delta) => {
        acumulado += delta;
        setAiFeedback(acumulado);
      });
      setAiFeedback(data.text);
    } catch (error) {
      console.error('Failed to fetch AI feedback:', error);
    } finally {
      setLoadingFeedback(false);
    }
  };

  const attemptCountForQuestion = question ? attempts.filter((a) => a.questionId === question.id).length : 0;
  const currentPalette = PALETTES[question?.subject ?? 'Matemática'] ?? PALETTES.Matemática;
  const SubjIcon = SUBJECT_ICONS[question?.subject ?? 'Matemática'] ?? ClipboardEdit;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': currentPalette.primary, '--primary-ink': currentPalette.readable,
        '--secondary': currentPalette.secondary,
        '--wash': currentPalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>PRACTICE</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--ink-on-primary)]">
            <SubjIcon className="w-3 h-3" />
          </span>
          DISCURSIVAS
        </span>
        <i />
        <b>TREINO DE 2ª FASE</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Discursivas exigem raciocínio explícito.</h1>
          <p>Questões abertas com rubrica analítica — treine a argumentação e o rigor exigidos na segunda fase.</p>
        </div>
        <div className="ni-state">
          <i /> {pool.length} questões disponíveis · Crivo Discursivo
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-start text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          Modo demonstração — conecte sua conta Google em "Perfil" para salvar seu histórico de treino.
        </p>
      )}
      {(syncError || masterySyncError) && <p className="text-xs text-rose-500 mb-2">{syncError || masterySyncError}</p>}

      {/* Filter bars */}
      <div className="space-y-2 mb-4">
        <div className="ni-subjects" style={{ margin: 0 }}>
          {boards.map((b) => {
            const active = boardFilter === b;
            return (
              <button
                key={b}
                onClick={() => { changeFilter(setBoardFilter, b); changeFilter(setSubjectFilter, 'Todas'); }}
                style={
                  active
                    ? { backgroundColor: currentPalette.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px' }
                    : undefined
                }
              >
                {b}
              </button>
            );
          })}
        </div>

        <div className="ni-subjects" style={{ margin: 0 }}>
          {subjects.map((s) => {
            const active = subjectFilter === s;
            const subPal = PALETTES[s] ?? PALETTES.Matemática;
            const Icon = SUBJECT_ICONS[s] ?? ClipboardEdit;
            return (
              <button
                key={s}
                onClick={() => changeFilter(setSubjectFilter, s)}
                style={
                  active
                    ? { backgroundColor: subPal.primary, color: PALETTE_INK, borderRadius: '4px', padding: '2px 8px', display: 'inline-flex', alignItems: 'center', gap: '5px' }
                    : { display: 'inline-flex', alignItems: 'center', gap: '5px' }
                }
              >
                {s !== 'Todas' && <Icon className="w-3 h-3" style={{ color: active ? PALETTE_INK : subPal.primary }} />}
                <span>{s}</span>
              </button>
            );
          })}
        </div>
        {boardFilter !== 'Todas' && boardExamStructure[boardFilter] && (
          <p className="text-[11px] text-[var(--dim)] font-mono">{boardExamStructure[boardFilter]}</p>
        )}
      </div>

      {!question ? (
        <div className="text-center py-16 border border-dashed border-[var(--line)] rounded-2xl text-xs text-[var(--dim)]">
          Nenhuma questão disponível ainda para esse filtro.
        </div>
      ) : (
        <Panel
          key={question.id}
          subject={question.subject}
          className="ni-panel p-6 sm:p-8 space-y-6"
        >
          {/* Header row */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-2 flex-wrap">
              <span
                className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-full"
                style={{ backgroundColor: currentPalette.primary, color: PALETTE_INK }}
              >
                {question.board} {question.year}
              </span>
              <span className="text-xs font-semibold uppercase tracking-wide text-[var(--dim)]">{question.subject}</span>
              {attemptCountForQuestion > 0 && (
                <span className="text-[11px] font-mono text-[var(--dim)]">treinada {attemptCountForQuestion}x</span>
              )}
            </div>
            <span className="text-xs font-mono text-[var(--dim)]">Questão {(index % pool.length) + 1} de {pool.length}</span>
          </div>

          {/* Question text */}
          <div>
            <p className="text-xs font-semibold text-[var(--dim)] mb-1">{question.topic}</p>
            <p className="text-sm font-display text-[var(--text)] leading-relaxed">{question.prompt}</p>
            {question.subItems && (
              <ul className="mt-3 space-y-2">
                {question.subItems.map((s) => (
                  <li key={s.letter} className="text-xs text-[var(--text)] flex">
                    <span className="font-semibold mr-2 shrink-0 subject-text">({s.letter})</span>
                    <span>{s.prompt}</span>
                  </li>
                ))}
              </ul>
            )}
            {question.uncertain && question.note && (
              <div className="flex items-start p-2.5 mt-3 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs">
                <AlertTriangle className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0 text-amber-400" />
                <p>{question.note}</p>
              </div>
            )}
          </div>

          {/* Protocol popup */}
          {protocol && (
            <div className="border border-[var(--line)] rounded-xl overflow-hidden bg-[var(--surface2)]/50">
              <button
                onClick={() => setShowProtocol((v) => !v)}
                className="w-full flex items-center justify-between px-4 py-2.5 text-left text-xs font-medium subject-text"
              >
                <span className="flex items-center">
                  <Compass className="w-3.5 h-3.5 mr-2" />
                  Protocolo sugerido para {protocol.board}: {protocol.name}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 shrink-0 ml-3 transition-transform ${showProtocol ? 'rotate-180' : ''}`} />
              </button>
              {showProtocol && (
                <div className="px-4 pb-4 space-y-2">
                  {protocol.steps.map((step) => (
                    <div key={step.letter} className="flex items-start text-xs">
                      <span
                        className="w-5 h-5 rounded-full flex items-center justify-center mr-2 shrink-0 font-bold text-[10px] font-mono"
                        style={{ backgroundColor: currentPalette.primary, color: PALETTE_INK }}
                      >
                        {step.letter}
                      </span>
                      <div>
                        <p className="font-medium text-[var(--text)]">{step.title}</p>
                        <p className="text-[var(--dim)]">{step.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Timer row */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
            <div className="flex items-center">
              <Timer className="w-4 h-4 mr-2 text-[var(--dim)]" />
              <span className="text-xs text-[var(--dim)] mr-3">Tempo sugerido: {question.suggestedMinutes} min</span>
              <span className="text-xl font-bold font-mono text-[var(--text)] tabular-nums">{formatTime(secondsLeft)}</span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsRunning((r) => !r)}
                disabled={secondsLeft === 0}
                className="flex items-center px-3 py-1.5 bg-[var(--primary)] text-[var(--ink-on-primary)] disabled:opacity-50 rounded-lg text-xs font-semibold transition-opacity"
              >
                {isRunning ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              </button>
              <button
                onClick={() => { setIsRunning(false); setSecondsLeft(question.suggestedMinutes * 60); }}
                className="flex items-center px-2.5 py-1.5 border border-[var(--line)] rounded-lg text-xs text-[var(--dim)] hover:text-[var(--text)] transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Answer textarea */}
          <div>
            <label htmlFor="answer" className="text-xs font-medium text-[var(--dim)] mb-1.5 block">
              Sua resposta (redija com rigor)
            </label>
            <textarea
              id="answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              rows={8}
              placeholder="Escreva sua resposta como se estivesse na prova — demonstre o raciocínio e os passos intermediários."
              className="w-full px-4 py-3 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] leading-relaxed focus:outline-none focus:border-[var(--primary)]"
            />
          </div>

          {/* Reveal button or answer feedback */}
          {!revealed ? (
            <button
              onClick={() => setRevealed(true)}
              className="w-full flex items-center justify-center py-2.5 border border-[var(--primary)] subject-text rounded-xl text-xs font-semibold hover:bg-[var(--surface2)] transition-colors"
            >
              <Eye className="w-4 h-4 mr-2" />
              Revelar gabarito comentado
            </button>
          ) : (
            <div className="space-y-4">
              <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs leading-relaxed text-[var(--text)]">
                <p className="font-semibold text-emerald-400 mb-2">Pontos esperados na resposta</p>
                <ul className="space-y-1.5">
                  {question.modelAnswer.map((m, i) => (
                    <li key={i} className="flex items-start">
                      <span className="mr-2 text-emerald-400">•</span>
                      <span>{m}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {!aiFeedback && (
                <button
                  onClick={fetchAiFeedback}
                  disabled={loadingFeedback || !answer.trim()}
                  className="w-full flex items-center justify-center py-2.5 border border-[var(--primary)] subject-text rounded-xl font-semibold text-xs hover:bg-[var(--surface2)] disabled:opacity-50 transition-colors"
                >
                  <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${loadingFeedback ? 'animate-pulse' : ''}`} />
                  {loadingFeedback ? 'Corrigindo com IA...' : answer.trim() ? 'Corrigir minha resposta com IA' : 'Escreva sua resposta para pedir correção'}
                </button>
              )}

              {aiFeedback && (
                <div className="p-4 rounded-xl text-xs leading-relaxed border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--text)]">
                  <div className="flex items-start gap-2">
                    <Sparkles className="w-4 h-4 subject-text shrink-0 mt-0.5" />
                    <AiText text={aiFeedback} className="flex-1" />
                  </div>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-medium text-[var(--dim)]">Como você avalia sua resposta?</p>
                  {savedFlash && (
                    <p className="flex items-center text-xs text-emerald-400 font-medium font-mono">
                      <Check className="w-3 h-3 mr-1" />
                      Salvo
                    </p>
                  )}
                  {masterySyncing && <p className="text-[11px] text-[var(--dim)]">Sincronizando domínio...</p>}
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {RATING_LABELS.map((r) => (
                    <button
                      key={r.value}
                      onClick={() => rate(r.value)}
                      disabled={rating !== null}
                      className="px-3 py-2 rounded-lg text-xs font-semibold border border-[var(--line)] bg-[var(--surface2)] hover:border-[var(--primary)] text-[var(--text)] transition-colors disabled:opacity-60"
                      style={rating === r.value ? { backgroundColor: currentPalette.primary, color: PALETTE_INK } : undefined}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setIndex((i) => i + 1)}
                className="w-full py-2.5 bg-[var(--primary)] text-[var(--ink-on-primary)] rounded-xl font-semibold text-xs hover:opacity-90 transition-opacity"
              >
                Próxima questão
              </button>
            </div>
          )}
        </Panel>
      )}
    </div>
  );
}
