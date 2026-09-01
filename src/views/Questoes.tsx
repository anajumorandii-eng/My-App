import React, { useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useUserMastery } from '../hooks/useUserMastery';
import { useQuestions } from '../hooks/useQuestions';
import { addUserAttempt, addUserErrorLog } from '../lib/userData';
import { requestAiText } from '../lib/aiClient';
import { parseErrorDiagnosis, ErrorDiagnosis } from '../lib/errorDiagnosis';
import { ERROR_TYPE_LABELS, INTERVENTION_LABELS } from '../lib/errorLabels';
import { AiText } from '../components/AiText';
import { TopicMastery, ErrorLog } from '../types';
import { applyReviewOutcome, qualityFromAnswerCorrectness } from '../lib/spacedRepetition';
import { motion, AnimatePresence } from 'motion/react';
import {
  CheckCircle2,
  XCircle,
  RotateCcw,
  Sparkles,
  BadgeCheck,
  Stethoscope,
  ArrowRight,
  BookOpen,
  CloudOff,
} from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { Button } from '../components/ui/Button';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

function Metric({
  label,
  value,
  bar = false,
  warn = false,
}: {
  label: string;
  value: string;
  bar?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="ni-metric">
      <small>{label}</small>
      <b className={warn ? 'warn' : ''}>{value}</b>
      {bar && (
        <i>
          <span />
        </i>
      )}
    </div>
  );
}

function examSourceLabel(source: { board: string; year: number; sourceUrl: string } | string | undefined) {
  if (!source) return 'Banco de Questões';
  return typeof source === 'string' ? source : `${source.board} ${source.year}`;
}

export default function Questoes() {
  const { user } = useAuth();
  const { updateMastery, isPersisted, syncError } = useUserMastery();
  const { questions: mockQuestions, syncError: questionsSyncError } = useQuestions();
  const subjects = useMemo(() => ['Todas', ...new Set(mockQuestions.map((q) => q.subject))], [mockQuestions]);
  const [subjectFilter, setSubjectFilter] = useState('Todas');
  const [onlyRealExams, setOnlyRealExams] = useState(false);
  const [index, setIndex] = useState(0);
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [history, setHistory] = useState<{ questionId: string; correct: boolean }[]>([]);
  const [deepExplanation, setDeepExplanation] = useState<string | null>(null);
  const [loadingDeepExplanation, setLoadingDeepExplanation] = useState(false);
  const [diagnosis, setDiagnosis] = useState<ErrorDiagnosis | null>(null);
  const [diagnosing, setDiagnosing] = useState(false);
  const [diagnosisSaved, setDiagnosisSaved] = useState(false);
  const [diagnosisDismissed, setDiagnosisDismissed] = useState(false);

  const pool = useMemo(() => {
    let result = subjectFilter === 'Todas' ? mockQuestions : mockQuestions.filter((q) => q.subject === subjectFilter);
    if (onlyRealExams) result = result.filter((q) => q.examSource);
    return result;
  }, [mockQuestions, subjectFilter, onlyRealExams]);

  const question = pool.length > 0 ? pool[index % pool.length] : null;
  const answered = selectedOptionId !== null;
  const isCorrect = answered && question !== null && selectedOptionId === question.correctOptionId;
  const correctCount = history.filter((h) => h.correct).length;

  const resetDiagnosisState = () => {
    setDiagnosis(null);
    setDiagnosing(false);
    setDiagnosisSaved(false);
    setDiagnosisDismissed(false);
  };

  const changeSubject = (subject: string) => {
    setSubjectFilter(subject);
    setIndex(0);
    setSelectedOptionId(null);
    setDeepExplanation(null);
    resetDiagnosisState();
  };

  const toggleRealExams = () => {
    setOnlyRealExams((v) => !v);
    setIndex(0);
    setSelectedOptionId(null);
    setDeepExplanation(null);
    resetDiagnosisState();
  };

  const selectOption = (optionId: string) => {
    if (answered || !question) return;
    const correct = optionId === question.correctOptionId;
    setSelectedOptionId(optionId);
    setHistory((h) => [...h, { questionId: question.id, correct }]);

    updateMastery((previous) => {
      const current = previous.find((item) => item.topicId === question.topicId);
      const existing: TopicMastery = current ?? {
        topicId: question.topicId,
        level: 50,
        uncertainty: 0.8,
        lastReviewed: new Date(0).toISOString(),
        errorSignals: 0,
      };

      const outcome = applyReviewOutcome(existing, qualityFromAnswerCorrectness(correct));
      const updated: TopicMastery = {
        ...existing,
        ...outcome,
        origin: 'observed',
      };
      return current
        ? previous.map((item) => (item.topicId === question.topicId ? updated : item))
        : [...previous, updated];
    });

    if (user) {
      addUserAttempt(user.uid, {
        id: `attempt_${Date.now()}`,
        questionId: question.id,
        topicId: question.topicId,
        correct,
        date: new Date().toISOString(),
      }).catch((error) => console.error('Failed to save attempt:', error));
    }

    if (!correct) {
      fetchDiagnosis(optionId);
    }
  };

  const nextQuestion = () => {
    setIndex((i) => (i + 1) % pool.length);
    setSelectedOptionId(null);
    setDeepExplanation(null);
    resetDiagnosisState();
  };

  const resetSession = () => {
    setIndex(0);
    setSelectedOptionId(null);
    setHistory([]);
    setDeepExplanation(null);
    resetDiagnosisState();
  };

  const fetchDiagnosis = async (optionId: string) => {
    if (!question) return;
    setDiagnosing(true);
    resetDiagnosisState();
    try {
      const selectedOption = question.options.find((o) => o.id === optionId);
      const correctOption = question.options.find((o) => o.id === question.correctOptionId);
      const data = await requestAiText('error-diagnosis', {
        prompt: question.prompt,
        subject: question.subject,
        selectedAnswer: selectedOption?.text ?? '',
        correctAnswer: correctOption?.text ?? '',
        baseExplanation: question.explanation,
      });
      const parsed = parseErrorDiagnosis(data.text);
      if (parsed) {
        setDiagnosis(parsed);
      }
    } catch (error) {
      console.error('Failed to diagnose error:', error);
    } finally {
      setDiagnosing(false);
    }
  };

  const saveErrorToLog = () => {
    if (!question || !diagnosis || !selectedOptionId) return;
    const selectedOption = question.options.find((o) => o.id === selectedOptionId);
    const correctOption = question.options.find((o) => o.id === question.correctOptionId);
    const log: ErrorLog = {
      id: `err_${question.id}_${Date.now()}`,
      questionId: question.id,
      topicId: question.topicId,
      date: new Date().toISOString(),
      type: diagnosis.type,
      notes: `Diagnosticado a partir de uma questão de prática (JUJU sugeriu, você salvou). Resposta marcada: ${selectedOption?.text ?? ''}. Gabarito: ${correctOption?.text ?? ''}.`,
      breakPoint: diagnosis.breakPoint,
      evidence: diagnosis.evidence,
      // Salvar no caderno é o gesto de validação da estudante — só aqui a
      // hipótese da IA passa a ser tratada como fato ('confirmado').
      confidence: 'confirmado',
      proposedIntervention: diagnosis.intervention,
      interventionStatus: 'pendente',
    };
    if (user) {
      addUserErrorLog(user.uid, log).catch((error) => console.error('Failed to save error log:', error));
    }
    setDiagnosisSaved(true);
  };

  const dismissDiagnosis = () => {
    setDiagnosis(null);
    setDiagnosisDismissed(true);
  };

  const fetchDeepExplanation = async () => {
    if (!selectedOptionId || !question) return;
    setLoadingDeepExplanation(true);
    try {
      const selectedOption = question.options.find((o) => o.id === selectedOptionId);
      const correctOption = question.options.find((o) => o.id === question.correctOptionId);
      const data = await requestAiText('question-explanation', {
        prompt: question.prompt,
        subject: question.subject,
        selectedAnswer: selectedOption?.text ?? '',
        correctAnswer: correctOption?.text ?? '',
        isCorrect,
        baseExplanation: question.explanation,
      });
      setDeepExplanation(data.text);
    } catch (error) {
      console.error('Failed to fetch deep explanation:', error);
    } finally {
      setLoadingDeepExplanation(false);
    }
  };

  const palette = PALETTES[question?.subject ?? 'Matemática'] ?? PALETTES.Matemática;
  const precisionPercent = history.length > 0 ? `${Math.round((correctCount / history.length) * 100)}%` : '—';

  return (
    <div
      className="ni-main"
      style={
        {
          '--primary': palette.primary,
          '--secondary': palette.secondary,
          '--wash': palette.wash,
        } as React.CSSProperties
      }
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>PRACTICE</span>
        <i />
        <span>QUESTÕES</span>
        {question && (
          <>
            <i />
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
              <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
                {React.createElement(SUBJECT_ICONS[question.subject] ?? BookOpen, { className: 'w-3 h-3' })}
              </span>
              {(question?.subject ?? 'GERAL').toUpperCase()}
            </span>
          </>
        )}
        <i /> <b>{examSourceLabel(question?.examSource)}</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Transforme tentativa em evidência.</h1>
          <p>Cada resposta atualiza a leitura do seu domínio e calibra a repetição espaçada.</p>
        </div>
        <div className="ni-state">
          <i /> perfil {palette.family} · treino ativo
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-center text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5" />
          Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
        </p>
      )}
      {syncError && <p className="text-xs text-rose-500 mb-2">{syncError}</p>}
      {questionsSyncError && <p className="text-xs text-rose-500 mb-2">{questionsSyncError}</p>}

      {/* Subject Filter & Real Exams Toggle */}
      <div className="ni-subjects">
        {subjects.map((subject) => {
          const active = subjectFilter === subject;
          const Icon = SUBJECT_ICONS[subject] ?? BookOpen;
          const subPalette = PALETTES[subject] ?? PALETTES.Matemática;
          return (
            <button
              key={subject}
              onClick={() => changeSubject(subject)}
              style={
                active
                  ? { backgroundColor: subPalette.primary, color: subPalette.wash, display: 'inline-flex', alignItems: 'center', gap: '6px', borderRadius: '4px', padding: '2px 6px' }
                  : { display: 'inline-flex', alignItems: 'center', gap: '6px' }
              }
            >
              {subject !== 'Todas' && <Icon className="w-3 h-3" style={{ color: active ? subPalette.wash : subPalette.primary }} />}
              <span>{subject}</span>
            </button>
          );
        })}
        <button
          onClick={toggleRealExams}
          className={onlyRealExams ? 'active' : ''}
          style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
        >
          <BadgeCheck className="w-3 h-3" />
          <span>Só Questões Reais</span>
        </button>
      </div>

      {question ? (
        <section className="ni-grid ni-grid--practice">
          {/* Left Workspace Panel */}
          <Panel subject={question.subject} interactive className="ni-panel ni-workspace">
            <div className="flex items-center justify-between gap-4">
              <span className="ni-kicker">
                Questão {index + 1} de {pool.length} {question.examSource ? `· ${examSourceLabel(question.examSource)}` : ''}
              </span>
              <span className="text-[10px] font-mono text-[var(--dim)]">
                Acertos: <b className="text-[var(--text)]">{correctCount}</b> / {history.length}
              </span>
            </div>

            <h2>Qual é o próximo passo do raciocínio?</h2>
            <p>O feedback e a justificativa só aparecem após a sua tentativa.</p>

            <div className="ni-question">{question.prompt}</div>

            <div className="ni-options" style={{ gridTemplateColumns: '1fr' }}>
              {question.options.map((option) => {
                const isSelected = selectedOptionId === option.id;
                const isCorrectOption = option.id === question.correctOptionId;
                let styleExtra: React.CSSProperties = { textAlign: 'left', display: 'flex', alignItems: 'center', gap: '10px' };
                if (answered) {
                  if (isCorrectOption) {
                    styleExtra = { ...styleExtra, borderColor: '#86dca5', color: '#86dca5', background: 'rgba(134,220,165,0.1)' };
                  } else if (isSelected && !isCorrectOption) {
                    styleExtra = { ...styleExtra, borderColor: '#e08391', color: '#e08391', background: 'rgba(224,131,145,0.1)' };
                  }
                }
                return (
                  <button
                    key={option.id}
                    disabled={answered}
                    onClick={() => selectOption(option.id)}
                    style={styleExtra}
                    className="transition-colors hover:border-[var(--primary)] text-xs"
                  >
                    <b style={{ color: 'var(--primary)', font: 'inherit' }}>{option.id.toUpperCase()}</b>
                    <span>{option.text}</span>
                    {answered && isCorrectOption && <CheckCircle2 className="w-4 h-4 ml-auto text-status-success shrink-0" />}
                    {answered && isSelected && !isCorrectOption && <XCircle className="w-4 h-4 ml-auto text-status-error shrink-0" />}
                  </button>
                );
              })}
            </div>

            {answered && (
              <div className="mt-6 flex flex-col gap-4">
                <Button
                  subject={question.subject}
                  onClick={nextQuestion}
                  className="ni-primary w-full"
                >
                  <ArrowRight className="w-4 h-4 mr-2" />
                  Próxima Questão
                </Button>

                {/* Explanation & Diagnosis */}
                <div className="p-4 rounded-xl border border-[var(--line)] bg-[var(--surface2)]/40 text-left space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="ni-kicker" style={{ margin: 0 }}>Gabarito & Justificativa</span>
                    {!isCorrect && (
                      <button onClick={fetchDeepExplanation} className="ni-link text-xs">
                        <Sparkles className="w-3.5 h-3.5 inline mr-1" />
                        {loadingDeepExplanation ? 'Analisando...' : 'Explicar com IA'}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-[var(--dim)] leading-relaxed">{question.explanation}</p>

                  {deepExplanation && (
                    <div className="mt-3 p-3 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs">
                      <AiText text={deepExplanation} />
                    </div>
                  )}

                  {diagnosis && !diagnosisDismissed && (
                    <div className="mt-3 p-3 rounded-lg border border-amber-500/30 bg-amber-500/10 text-xs text-amber-300">
                      <div className="flex items-center justify-between mb-1">
                        <b>Diagnóstico de Erro: {ERROR_TYPE_LABELS[diagnosis.type]}</b>
                        {!diagnosisSaved ? (
                          <button onClick={saveErrorToLog} className="underline text-amber-200">
                            Salvar no Caderno de Erros
                          </button>
                        ) : (
                          <span>Salvo ✓</span>
                        )}
                      </div>
                      <p className="text-[11px] text-amber-200/80">{diagnosis.breakPoint}</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </Panel>

          {/* Right Session Side Panel */}
          <Panel subject={question.subject} interactive className="ni-panel ni-session-side">
            <span className="ni-kicker">Telemetria de Treino</span>
            <div className="ni-timer" style={{ fontSize: '36px' }}>
              {correctCount} / {history.length}
            </div>

            <Metric label="Taxa de Precisão" value={precisionPercent} bar />
            <Metric label="Filtro Ativo" value={subjectFilter} />

            <div className="ni-stack">
              <span />
              <span />
              <span />
            </div>

            <p>Cada tentativa bem-sucedida estende o ciclo de revisão deste tópico no motor de eficiência.</p>

            <div className="mt-6 pt-3 border-t border-[var(--line)] flex items-center justify-between text-xs text-[var(--dim)]">
              <button onClick={resetSession} className="flex items-center gap-1.5 hover:text-[var(--text)]">
                <RotateCcw className="w-3.5 h-3.5" />
                Reiniciar Treino
              </button>
              <span>{pool.length} questões disponíveis</span>
            </div>
          </Panel>
        </section>
      ) : (
        <div className="text-center py-16">
          <p className="text-[var(--dim)]">Nenhuma questão encontrada para este filtro.</p>
        </div>
      )}
    </div>
  );
}
