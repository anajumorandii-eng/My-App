import React, { useMemo, useState } from 'react';
import { mockQuestions, mockTopics } from '../data/mockData';
import { useAuth } from '../context/AuthContext';
import { useUserMastery } from '../hooks/useUserMastery';
import { addUserAttempt, addUserErrorLog } from '../lib/userData';
import { requestAiText } from '../lib/aiClient';
import { parseErrorDiagnosis, ErrorDiagnosis } from '../lib/errorDiagnosis';
import { ERROR_TYPE_LABELS, INTERVENTION_LABELS } from '../lib/errorLabels';
import { AiText } from '../components/AiText';
import { TopicMastery, ErrorLog } from '../types';
import { applyReviewOutcome, qualityFromAnswerCorrectness } from '../lib/spacedRepetition';
import { HelpCircle, CheckCircle2, XCircle, RotateCcw, CloudOff, Sparkles, BadgeCheck, ExternalLink, Stethoscope, Check } from 'lucide-react';

export default function Questoes() {
  const { user } = useAuth();
  const { updateMastery, isPersisted, syncError } = useUserMastery();
  const subjects = useMemo(() => ['Todas', ...new Set(mockQuestions.map((q) => q.subject))], []);
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
  }, [subjectFilter, onlyRealExams]);

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

    // Responder uma questão é uma tentativa de recuperação ativa (retrieval
    // practice — Roediger & Karpicke, 2006), então também alimenta o
    // cronograma de repetição espaçada do tópico (spacedRepetition.ts), não
    // só o nível de domínio: acertar adia a próxima revisão programada,
    // errar traz ela de volta pra amanhã.
    updateMastery((prev: TopicMastery[]) =>
      prev.map((m) =>
        m.topicId === question.topicId ? { ...m, ...applyReviewOutcome(m, qualityFromAnswerCorrectness(correct)) } : m
      )
    );

    if (user) {
      addUserAttempt(user.uid, {
        id: `attempt_${Date.now()}`,
        questionId: question.id,
        topicId: question.topicId,
        correct,
        date: new Date().toISOString(),
      }).catch((error) => console.error('Failed to save attempt:', error));
    }
  };

  const nextQuestion = () => {
    setIndex((i) => i + 1);
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

  const runDiagnosis = async () => {
    if (!question || !selectedOptionId) return;
    setDiagnosing(true);
    try {
      const topic = mockTopics.find((t) => t.id === question.topicId);
      const selectedOption = question.options.find((o) => o.id === selectedOptionId);
      const correctOption = question.options.find((o) => o.id === question.correctOptionId);
      const data = await requestAiText('error-hypothesis', {
        topic: topic?.name ?? question.subject,
        subject: question.subject,
        questionPrompt: question.prompt,
        selectedAnswer: selectedOption?.text ?? '',
        correctAnswer: correctOption?.text ?? '',
      });
      setDiagnosis(parseErrorDiagnosis(data.text));
    } catch (error) {
      console.error('Failed to diagnose error:', error);
    } finally {
      setDiagnosing(false);
    }
  };

  const confirmDiagnosis = () => {
    if (!diagnosis || !question) return;
    const log: ErrorLog = {
      id: `err_${Date.now()}`,
      topicId: question.topicId,
      questionId: question.id,
      date: new Date().toISOString(),
      type: diagnosis.type,
      notes: 'Diagnosticado a partir de uma questão de prática (JUJU sugeriu, você confirmou).',
      breakPoint: diagnosis.breakPoint,
      evidence: diagnosis.evidence,
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

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <HelpCircle className="w-7 h-7 mr-3 text-indigo-500" />
          Questões & Tentativas
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">Pratique com feedback imediato e explicação de cada questão.</p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu progresso de verdade.
          </p>
        )}
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
      </header>

      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex gap-2 flex-wrap">
          {subjects.map((subject) => (
            <button
              key={subject}
              onClick={() => changeSubject(subject)}
              className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                subjectFilter === subject
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
              }`}
            >
              {subject}
            </button>
          ))}
          <button
            onClick={toggleRealExams}
            className={`flex items-center px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
              onlyRealExams
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
          >
            <BadgeCheck className="w-4 h-4 mr-1.5" />
            Só questões reais
          </button>
        </div>
        <div className="flex items-center gap-3 text-sm text-zinc-500">
          <span>
            Acertos: <span className="font-semibold text-emerald-600 dark:text-emerald-400">{correctCount}</span> / {history.length}
          </span>
          <button onClick={resetSession} className="flex items-center hover:text-zinc-900 dark:hover:text-zinc-100">
            <RotateCcw className="w-3.5 h-3.5 mr-1" />
            Reiniciar
          </button>
        </div>
      </div>

      {!question ? (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500">Nenhuma questão real disponível ainda para esse filtro. Tente outra matéria ou desligue "Só questões reais".</p>
        </div>
      ) : (
      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-8 shadow-sm">
        <div className="flex items-center justify-between mb-6 flex-wrap gap-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs font-semibold uppercase tracking-wide text-indigo-600 dark:text-indigo-400">
              {question.subject} • {question.difficulty === 'easy' ? 'Fácil' : question.difficulty === 'medium' ? 'Médio' : 'Difícil'}
            </span>
            {question.examSource && (
              <a
                href={question.examSource.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center text-xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300 hover:underline"
              >
                <BadgeCheck className="w-3.5 h-3.5 mr-1" />
                {question.examSource.board} {question.examSource.year}
                <ExternalLink className="w-3 h-3 ml-1" />
              </a>
            )}
          </div>
          <span className="text-sm text-zinc-400">Questão {(index % pool.length) + 1} de {pool.length}</span>
        </div>

        <p className="text-lg font-medium mb-6 leading-relaxed">{question.prompt}</p>

        <div className="space-y-3 mb-6">
          {question.options.map((option) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrectOption = option.id === question.correctOptionId;
            let stateClasses = 'border-zinc-200 dark:border-zinc-700 hover:bg-zinc-50 dark:hover:bg-zinc-800';
            if (answered && isCorrectOption) {
              stateClasses = 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20';
            } else if (answered && isSelected && !isCorrectOption) {
              stateClasses = 'border-rose-500 bg-rose-50 dark:bg-rose-900/20';
            }

            return (
              <button
                key={option.id}
                onClick={() => selectOption(option.id)}
                disabled={answered}
                className={`w-full text-left px-5 py-4 rounded-xl border transition-colors flex items-center justify-between ${stateClasses}`}
              >
                <span>{option.text}</span>
                {answered && isCorrectOption && <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0 ml-3" />}
                {answered && isSelected && !isCorrectOption && <XCircle className="w-5 h-5 text-rose-500 shrink-0 ml-3" />}
              </button>
            );
          })}
        </div>

        {answered && (
          <div
            className={`p-4 rounded-xl mb-6 text-sm leading-relaxed ${
              isCorrect
                ? 'bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300'
                : 'bg-rose-50 dark:bg-rose-900/20 text-rose-800 dark:text-rose-300'
            }`}
          >
            <p className="font-semibold mb-1">{isCorrect ? 'Correto!' : 'Não foi dessa vez.'}</p>
            <p>{question.explanation}</p>
          </div>
        )}

        {answered && !isCorrect && !diagnosis && !diagnosisSaved && !diagnosisDismissed && (
          <button
            onClick={runDiagnosis}
            disabled={diagnosing}
            className="w-full flex items-center justify-center py-2.5 mb-6 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 rounded-xl font-medium text-sm hover:bg-rose-50 dark:hover:bg-rose-900/20 disabled:opacity-50 transition-colors"
          >
            <Stethoscope className={`w-4 h-4 mr-2 ${diagnosing ? 'animate-pulse' : ''}`} />
            {diagnosing ? 'Diagnosticando...' : 'Diagnosticar esse erro'}
          </button>
        )}

        {diagnosis && (
          <div className="p-4 rounded-xl mb-6 bg-zinc-50 dark:bg-zinc-800/50 border border-zinc-200 dark:border-zinc-700 text-sm">
            <div className="flex items-center gap-2 mb-2">
              <Stethoscope className="w-4 h-4 text-rose-500 shrink-0" />
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300">
                {ERROR_TYPE_LABELS[diagnosis.type]}
              </span>
              <span className="text-xs text-zinc-400">hipótese da IA — ainda não confirmada</span>
            </div>
            <p className="text-zinc-700 dark:text-zinc-300 mb-2">{diagnosis.breakPoint}</p>
            {diagnosis.evidence && <p className="text-xs text-zinc-500 mb-3">Evidência: {diagnosis.evidence}</p>}
            <p className="text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-3">
              Próximo passo sugerido ({INTERVENTION_LABELS[diagnosis.intervention.type]}): {diagnosis.intervention.description}
            </p>
            <div className="flex gap-2">
              <button
                onClick={confirmDiagnosis}
                className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-sm font-medium transition-colors"
              >
                Registrar no Caderno de Erros
              </button>
              <button
                onClick={dismissDiagnosis}
                className="flex-1 py-2 border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 rounded-lg text-sm font-medium hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
              >
                Não foi isso
              </button>
            </div>
          </div>
        )}

        {diagnosisSaved && (
          <div className="flex items-center p-3 rounded-xl mb-6 text-sm bg-emerald-50 dark:bg-emerald-900/20 text-emerald-700 dark:text-emerald-300">
            <Check className="w-4 h-4 mr-2 shrink-0" />
            Registrado no Caderno de Erros.
          </div>
        )}

        {answered && !deepExplanation && (
          <button
            onClick={fetchDeepExplanation}
            disabled={loadingDeepExplanation}
            className="w-full flex items-center justify-center py-2.5 mb-6 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl font-medium text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50 transition-colors"
          >
            <Sparkles className={`w-4 h-4 mr-2 ${loadingDeepExplanation ? 'animate-pulse' : ''}`} />
            {loadingDeepExplanation ? 'Gerando explicação com IA...' : 'Aprofundar explicação com IA'}
          </button>
        )}

        {deepExplanation && (
          <div className="flex items-start p-4 rounded-xl mb-6 text-sm leading-relaxed bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300">
            <Sparkles className="w-4 h-4 mr-2 mt-0.5 shrink-0" />
            <AiText text={deepExplanation} className="flex-1" />
          </div>
        )}

        <button
          onClick={nextQuestion}
          disabled={!answered}
          className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
        >
          Próxima questão
        </button>
      </div>
      )}
    </div>
  );
}
