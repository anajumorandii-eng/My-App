import React, { useEffect, useMemo, useRef, useState } from 'react';
import { mockTopics } from '../data/mockData';
import { useUserBacklog } from '../hooks/useUserBacklog';
import { useUserMastery } from '../hooks/useUserMastery';
import { useQuestions } from '../hooks/useQuestions';
import { aiErrorMessage, requestAiText, requestAiTextStream } from '../lib/aiClient';
import { AiText } from '../components/AiText';
import {
  priorityScore,
  priorityQueue,
  isReadyToClose,
  RecoveryOutcome,
  QUEUE_LABELS,
  QUEUE_CRITERIA,
  QUEUE_TREATMENT,
  STATE_LABELS,
  STATE_DESCRIPTIONS,
  SUPPORT_LEVELS,
  EXIT_CHECKLIST,
  BacklogQueue,
} from '../lib/backlogEngine';
import { BacklogItem, RecoveryEvidence, Topic } from '../types';
import { applyRecoveryEvidence } from '../lib/recoveryEvidence';
import { recordUserRecoveryEvidence } from '../lib/userData';
import { useAuth } from '../context/AuthContext';
import { LEGACY_TOPIC_LABELS } from '../data/legacyTopics';
import {
  ListTodo,
  Plus,
  ChevronDown,
  Sparkles,
  CloudOff,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  Info,
  Trophy,
} from 'lucide-react';
import { Panel } from '../components/ui/Panel';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';
import { SUBJECT_ICONS } from './Dashboard';

const QUEUE_ORDER: BacklogQueue[] = ['A', 'B', 'C', 'D'];

function ScorePicker({
  label,
  value,
  onChange,
  max,
  helper,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  max: number;
  helper: string;
}) {
  const options = Array.from({ length: max + 1 }, (_, i) => i);
  return (
    <div>
      <p className="text-xs font-semibold text-[var(--text)] mb-0.5">{label}</p>
      <p className="text-[11px] text-[var(--dim)] mb-1.5">{helper}</p>
      <div className="flex gap-1.5">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className="w-8 h-8 rounded-lg text-xs font-semibold border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] transition-colors"
            style={value === n ? { backgroundColor: 'var(--primary)', color: 'var(--wash)', borderColor: 'var(--primary)' } : undefined}
          >
            {n}
          </button>
        ))}
      </div>
    </div>
  );
}

const EXERCISE_MODE_BY_LEVEL: Record<number, string> = {
  1: 'explain_steps',
  2: 'fill_gap',
  3: 'solve',
  4: 'solve_variant',
  5: 'discursive',
};

function SupportLevelContent({
  topic,
  subtopic,
  supportLevel,
  onOutcome,
}: {
  topic: Topic;
  subtopic?: string;
  supportLevel: number;
  onOutcome: (outcome: RecoveryOutcome, evidenceId: string) => Promise<boolean>;
}) {
  const [aiExerciseText, setAiExerciseText] = useState<string | null>(null);
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState<string | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [correction, setCorrection] = useState<string | null>(null);
  const [loadingCorrection, setLoadingCorrection] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);
  const [recordedOutcome, setRecordedOutcome] = useState<RecoveryOutcome | null>(null);
  const [pendingOutcome, setPendingOutcome] = useState<{ id: string; outcome: RecoveryOutcome } | null>(null);
  const [savingOutcome, setSavingOutcome] = useState(false);
  const [outcomeError, setOutcomeError] = useState<string | null>(null);

  const submitOutcome = async (outcome: RecoveryOutcome) => {
    if (recordedOutcome || savingOutcome) return;
    const pending = pendingOutcome ?? {
      id: globalThis.crypto?.randomUUID?.() ?? `recovery_${Date.now()}_${Math.random().toString(36).slice(2)}`,
      outcome,
    };
    if (pending.outcome !== outcome) return;
    setPendingOutcome(pending);
    setSavingOutcome(true);
    setOutcomeError(null);
    const saved = await onOutcome(outcome, pending.id);
    setSavingOutcome(false);
    if (saved) setRecordedOutcome(outcome);
    else setOutcomeError('Não foi possível salvar esta evidência. Tente novamente.');
  };

  const effectiveTopic = subtopic ? `${topic.name} — ${subtopic}` : topic.name;
  const { questions } = useQuestions();

  const realQuestion = useMemo(() => {
    if (supportLevel !== 3 && supportLevel !== 4) return undefined;
    return questions.filter((q) => q.topicId === topic.id)[supportLevel - 3];
  }, [questions, topic.id, supportLevel]);

  const exerciseText = realQuestion
    ? `${realQuestion.prompt}\n\nAlternativas:\n${realQuestion.options.map((o) => `- ${o.text}`).join('\n')}`
    : aiExerciseText;

  const groundingAnswer = realQuestion
    ? `Alternativa correta: "${realQuestion.options.find((o) => o.id === realQuestion.correctOptionId)?.text}". Explicação: ${realQuestion.explanation}`
    : undefined;

  const fetchExercise = async () => {
    setLoadingExercise(true);
    setExerciseError(null);
    try {
      let acumulado = '';
      const data = await requestAiTextStream('backlog-exercise', {
        topic: effectiveTopic,
        subject: topic.subject,
        mode: EXERCISE_MODE_BY_LEVEL[supportLevel],
      }, (delta) => {
        acumulado += delta;
        setAiExerciseText(acumulado);
      });
      setAiExerciseText(data.text);
    } catch (error) {
      console.error('Failed to fetch backlog exercise:', error);
      setExerciseError(aiErrorMessage(error));
    } finally {
      setLoadingExercise(false);
    }
  };

  const fetchCorrection = async () => {
    if (!exerciseText || !studentAnswer.trim()) return;
    setLoadingCorrection(true);
    setCorrectionError(null);
    try {
      let acumulado = '';
      const data = await requestAiTextStream('backlog-correction', {
        topic: effectiveTopic,
        subject: topic.subject,
        exercise: exerciseText,
        studentAnswer,
        groundingAnswer,
      }, (delta) => {
        acumulado += delta;
        setCorrection(acumulado);
      });
      setCorrection(data.text);
    } catch (error) {
      console.error('Failed to fetch backlog correction:', error);
      setCorrectionError(aiErrorMessage(error));
    } finally {
      setLoadingCorrection(false);
    }
  };

  if (!exerciseText) {
    return (
      <div className="space-y-2">
        <button
          onClick={fetchExercise}
          disabled={loadingExercise}
          className="w-full flex items-center justify-center py-2.5 border border-[var(--primary)] text-[var(--primary)] rounded-xl font-semibold text-xs hover:bg-[var(--surface2)] disabled:opacity-50 transition-colors"
        >
          <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${loadingExercise ? 'animate-pulse' : ''}`} />
          {loadingExercise ? 'Gerando exercício com IA...' : 'Gerar exercício com IA'}
        </button>
        {exerciseError && <p className="text-xs text-rose-500">{exerciseError}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-3.5 rounded-xl border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-xs text-[var(--text)] leading-relaxed">
        <AiText text={exerciseText} />
      </div>
      <div>
        <label htmlFor={`answer-${topic.id}-${supportLevel}`} className="text-xs font-medium text-[var(--dim)] mb-1 block">
          Sua resolução
        </label>
        <textarea
          id={`answer-${topic.id}-${supportLevel}`}
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          rows={4}
          placeholder="Demonstre seus passos e raciocínio de verdade."
          disabled={!!correction}
          className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] leading-relaxed outline-none focus:border-[var(--primary)] disabled:opacity-60"
        />
      </div>
      {!correction ? (
        <div className="space-y-2">
          <button
            onClick={fetchCorrection}
            disabled={loadingCorrection || !studentAnswer.trim()}
            className="w-full flex items-center justify-center py-2 bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 rounded-xl text-xs font-semibold transition-opacity"
          >
            <Sparkles className={`w-3.5 h-3.5 mr-1.5 ${loadingCorrection ? 'animate-pulse' : ''}`} />
            {loadingCorrection ? 'Corrigindo com IA...' : 'Corrigir com IA'}
          </button>
          {correctionError && <p className="text-xs text-rose-500">{correctionError}</p>}
        </div>
      ) : (
        <>
          <div className="p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-xs text-[var(--text)] leading-relaxed">
            <AiText text={correction} />
          </div>
          <div>
            <p className="text-xs font-semibold text-[var(--dim)] mb-1.5">Após a correção, como foi seu desempenho?</p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {([
                ['ainda_dificil', 'Ainda não consegui'],
                ['com_ajuda', 'Consegui com ajuda'],
                ['independente', 'Consegui sozinha'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  disabled={recordedOutcome !== null || savingOutcome || (!!pendingOutcome && pendingOutcome.outcome !== value)}
                  onClick={() => void submitOutcome(value)}
                  className="px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface2)] text-xs font-semibold text-[var(--text)] disabled:opacity-60 transition-colors"
                  style={recordedOutcome === value ? { backgroundColor: 'var(--primary)', color: 'var(--wash)', borderColor: 'var(--primary)' } : undefined}
                >
                  {label}
                </button>
              ))}
            </div>
            {savingOutcome && <p className="text-[11px] text-[var(--dim)] mt-1.5">Salvando evidência...</p>}
            {outcomeError && <p className="text-xs text-rose-500 mt-1.5">{outcomeError}</p>}
          </div>
        </>
      )}
    </div>
  );
}

function OrphanedBacklogItem({
  item,
  allSubjects,
  onReassign,
  onRemove,
}: {
  item: BacklogItem;
  allSubjects: string[];
  onReassign: (topicId: string) => void;
  onRemove: () => void;
}) {
  const oldLabel = LEGACY_TOPIC_LABELS[item.topicId];

  return (
    <Panel subject="Matemática" className="ni-panel p-4 space-y-3 border-amber-500/40">
      <div className="flex items-start">
        <AlertTriangle className="w-4 h-4 mr-2 mt-0.5 text-amber-400 shrink-0" />
        <div>
          <p className="font-semibold text-xs text-amber-300">
            {oldLabel ? `"${oldLabel}"` : `Tópico "${item.topicId}"`} não existe mais no currículo atual
          </p>
          <p className="text-[11px] text-[var(--dim)] mt-1">
            O currículo foi atualizado. Seus parâmetros continuam salvos — reatribua ao tópico correspondente ou remova.
          </p>
        </div>
      </div>
      <div className="flex flex-col sm:flex-row gap-2">
        <select
          value=""
          onChange={(e) => {
            if (e.target.value) onReassign(e.target.value);
          }}
          className="flex-1 px-3 py-1.5 rounded-lg border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
        >
          <option value="" className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Selecione o tópico correto...</option>
          {allSubjects.map((subject) => (
            <optgroup key={subject} label={subject} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
              {mockTopics.filter((t) => t.subject === subject).map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </optgroup>
          ))}
        </select>
        <button
          onClick={onRemove}
          className="flex items-center justify-center px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--line)] text-[var(--dim)] hover:text-rose-400 transition-colors"
        >
          <Trash2 className="w-3 h-3 mr-1" />
          Remover
        </button>
      </div>
    </Panel>
  );
}

export default function Recuperacao() {
  const { user } = useAuth();
  const activeRecoveryUid = useRef<string | null>(user?.uid ?? null);
  activeRecoveryUid.current = user?.uid ?? null;
  const { backlog, updateBacklog, acceptCommittedBacklog, isPersisted, syncError } = useUserBacklog();
  const { mastery, updateMastery, acceptCommittedMastery, syncError: masterySyncError } = useUserMastery();
  const [recoverySyncError, setRecoverySyncError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTracks, setShowTracks] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checkedExit, setCheckedExit] = useState<Record<number, boolean>>({});
  const [manualEvidenceIds, setManualEvidenceIds] = useState<Record<string, string>>({});
  const [manualSavingId, setManualSavingId] = useState<string | null>(null);

  useEffect(() => {
    setRecoverySyncError(null);
    setManualEvidenceIds({});
    setManualSavingId(null);
  }, [user?.uid]);

  const [formTopicId, setFormTopicId] = useState('');
  const [formSubtopic, setFormSubtopic] = useState('');
  const [formState, setFormState] = useState(0);
  const [formDependencia, setFormDependencia] = useState(1);
  const [formIncidencia, setFormIncidencia] = useState(1);
  const [formLacuna, setFormLacuna] = useState(1);
  const [formUrgencia, setFormUrgencia] = useState(1);
  const [formCusto, setFormCusto] = useState(2);

  const activeItems = backlog.filter((b) => !b.closedAt);
  const closedItems = backlog.filter((b) => b.closedAt);
  const allSubjects = useMemo(() => [...new Set(mockTopics.map((t) => t.subject))], []);
  const topicById = (id: string) => mockTopics.find((t) => t.id === id);
  const formTopic = formTopicId ? topicById(formTopicId) : null;

  const grouped = useMemo(() => {
    const map: Record<BacklogQueue, (BacklogItem & { score: number })[]> = { A: [], B: [], C: [], D: [] };
    activeItems.forEach((item) => {
      map[priorityQueue(item)].push({ ...item, score: priorityScore(item) });
    });
    QUEUE_ORDER.forEach((q) => map[q].sort((a, b) => b.score - a.score));
    return map;
  }, [activeItems]);

  const resetForm = () => {
    setFormTopicId('');
    setFormSubtopic('');
    setFormState(0);
    setFormDependencia(1);
    setFormIncidencia(1);
    setFormLacuna(1);
    setFormUrgencia(1);
    setFormCusto(2);
  };

  const addToBacklog = () => {
    if (!formTopicId) return;
    const newItem: BacklogItem = {
      id: `backlog_${formTopicId}_${Date.now()}`,
      topicId: formTopicId,
      ...(formSubtopic ? { subtopic: formSubtopic } : {}),
      state: formState,
      dependencia: formDependencia,
      incidencia: formIncidencia,
      lacuna: formLacuna,
      urgencia: formUrgencia,
      custo: formCusto,
      independentSuccesses: 0,
      canExplainTypicalError: false,
      dateAdded: new Date().toISOString(),
    };
    updateBacklog((prev) => [...prev, newItem]);
    resetForm();
    setShowAddForm(false);
  };

  const patchItem = (id: string, patch: Partial<BacklogItem>) => {
    updateBacklog((prev) => prev.map((b) => (b.id === id ? { ...b, ...patch } : b)));
  };

  const recordRecoveryOutcome = async (item: BacklogItem, outcome: RecoveryOutcome, evidenceId: string): Promise<boolean> => {
    const now = new Date();
    const evidence: RecoveryEvidence = {
      id: evidenceId,
      backlogItemId: item.id,
      topicId: item.topicId,
      outcome,
      occurredAt: now.toISOString(),
    };
    setRecoverySyncError(null);

    if (!user) {
      const result = applyRecoveryEvidence(backlog, mastery, evidence, false);
      const [backlogSaved, masterySaved] = await Promise.all([
        updateBacklog(() => result.backlog),
        updateMastery(() => result.mastery),
      ]);
      return backlogSaved && masterySaved;
    }

    const operationUid = user.uid;
    try {
      const result = await recordUserRecoveryEvidence(operationUid, evidence);
      const acceptedBacklog = acceptCommittedBacklog(operationUid, result.backlog);
      const acceptedMastery = acceptCommittedMastery(operationUid, result.mastery);
      return acceptedBacklog && acceptedMastery;
    } catch (error) {
      console.error('Failed to save recovery evidence:', error);
      if (activeRecoveryUid.current === operationUid) {
        setRecoverySyncError('Não foi possível salvar a evidência de recuperação. Nenhuma alteração foi confirmada.');
      }
      return false;
    }
  };

  const recordManualSuccess = async (item: BacklogItem) => {
    if (manualSavingId) return;
    const operationUid = activeRecoveryUid.current;
    const evidenceId = manualEvidenceIds[item.id]
      ?? (globalThis.crypto?.randomUUID?.() ?? `recovery_${Date.now()}_${Math.random().toString(36).slice(2)}`);
    setManualEvidenceIds((current) => ({ ...current, [item.id]: evidenceId }));
    setManualSavingId(item.id);
    const saved = await recordRecoveryOutcome(item, 'independente', evidenceId);
    if (activeRecoveryUid.current !== operationUid) return;
    setManualSavingId(null);
    if (saved) {
      setManualEvidenceIds((current) => {
        const next = { ...current };
        delete next[item.id];
        return next;
      });
    }
  };

  const removeItem = (id: string) => {
    updateBacklog((prev) => prev.filter((b) => b.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const closeItem = (item: BacklogItem) => {
    patchItem(item.id, { closedAt: new Date().toISOString() });
    setExpandedId(null);
  };

  const basePalette = PALETTES.Matemática;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': basePalette.primary,
        '--secondary': basePalette.secondary,
        '--wash': basePalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>DECISÃO</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
            <ListTodo className="w-3 h-3" />
          </span>
          FILA PONTE
        </span>
        <i />
        <b>RECUPERAÇÃO DE ATRASOS</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Recalcule a rota sem perder o ritmo.</h1>
          <p>Atrasos viram insumo ordenado pelo protocolo PONTE — o motor redistribui a carga e protege suas prioridades.</p>
        </div>
        <div className="ni-state">
          <i /> {activeItems.length} tópicos na fila PONTE
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-start text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          Modo demonstração — conecte sua conta Google em "Perfil" para salvar sua fila permanentemente.
        </p>
      )}
      {(recoverySyncError || syncError || masterySyncError) && (
        <p className="text-xs text-rose-500 mb-2">{recoverySyncError || syncError || masterySyncError}</p>
      )}

      {/* Actions / Filter bar */}
      <div className="ni-subjects">
        <button
          onClick={() => setShowAddForm((v) => !v)}
          style={
            showAddForm
              ? { backgroundColor: basePalette.primary, color: basePalette.wash, borderRadius: '4px', padding: '2px 8px' }
              : undefined
          }
        >
          <Plus className="w-3 h-3 inline mr-1" />
          Adicionar tópico atrasado
        </button>
        <button
          onClick={() => setShowTracks((v) => !v)}
          style={
            showTracks
              ? { backgroundColor: basePalette.primary, color: basePalette.wash, borderRadius: '4px', padding: '2px 8px' }
              : undefined
          }
        >
          <Info className="w-3 h-3 inline mr-1" />
          Como encaixar na semana
        </button>
      </div>

      {showTracks && (
        <Panel subject="Matemática" className="ni-panel p-5 space-y-2 text-xs leading-relaxed">
          <p className="text-[var(--text)]">
            Mantenha três trilhos rodando em paralelo sem deixar o atraso engolir o presente: <strong>Atual</strong> (acompanhar a matéria corrente), <strong>Recuperação</strong> (eliminar gargalos prioritários — Fila A primeiro) e <strong>Manutenção</strong> (revisão espaçada adaptativa).
          </p>
          <p className="text-[var(--dim)]">
            Distribuição recomendada: 55–65% no conteúdo atual, 25–35% em recuperação e 10–15% em manutenção.
          </p>
        </Panel>
      )}

      {showAddForm && (
        <Panel subject="Matemática" className="ni-panel p-6 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-medium text-sm text-[var(--text)]">Novo tópico atrasado</h3>
            <button onClick={() => { setShowAddForm(false); resetForm(); }} className="text-[var(--dim)] hover:text-[var(--text)]">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label htmlFor="topic-select" className="text-xs font-semibold text-[var(--text)] mb-1 block">
              Tópico
            </label>
            <select
              id="topic-select"
              value={formTopicId}
              onChange={(e) => { setFormTopicId(e.target.value); setFormSubtopic(''); }}
              className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
            >
              <option value="" className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Selecione um tópico...</option>
              {allSubjects.map((subject) => (
                <optgroup key={subject} label={subject} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">
                  {mockTopics.filter((t) => t.subject === subject).map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {!!formTopic?.chapters?.length && (
            <div>
              <label htmlFor="subtopic-select" className="text-xs font-semibold text-[var(--text)] mb-1 block">
                Capítulo específico (opcional)
              </label>
              <select
                id="subtopic-select"
                value={formSubtopic}
                onChange={(e) => setFormSubtopic(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
              >
                <option value="" className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">Frente inteira ({formTopic.name})</option>
                {formTopic.chapters!.map((chapter) => (
                  <option key={chapter} value={chapter} className="bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100">{chapter}</option>
                ))}
              </select>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold text-[var(--text)] mb-1.5">Estado atual de domínio</p>
            <div className="flex flex-wrap gap-1.5">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormState(n)}
                  className="px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)]"
                  style={formState === n ? { backgroundColor: 'var(--primary)', color: 'var(--wash)', borderColor: 'var(--primary)' } : undefined}
                >
                  {n} — {STATE_LABELS[n]}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-[var(--dim)] mt-1">{STATE_DESCRIPTIONS[formState]}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <ScorePicker label="Dependência" value={formDependencia} onChange={setFormDependencia} max={3} helper="Destrava outros conteúdos?" />
            <ScorePicker label="Incidência" value={formIncidencia} onChange={setFormIncidencia} max={3} helper="Cai com frequência nas suas bancas?" />
            <ScorePicker label="Lacuna" value={formLacuna} onChange={setFormLacuna} max={3} helper="Gravidade da falha conceitual?" />
            <ScorePicker label="Urgência" value={formUrgencia} onChange={setFormUrgencia} max={3} helper="Há prova ou simulado próximo?" />
          </div>
          <ScorePicker label="Custo estimado" value={formCusto} onChange={setFormCusto} max={3} helper="Sessões estimadas para consolidar (1 = poucas, 3 = muitas)" />

          <button
            onClick={addToBacklog}
            disabled={!formTopicId}
            className="w-full py-2.5 bg-[var(--primary)] text-[var(--wash)] disabled:opacity-50 rounded-xl text-xs font-semibold transition-opacity"
          >
            Adicionar à fila PONTE
          </button>
        </Panel>
      )}

      {activeItems.length === 0 ? (
        <div className="text-center py-16 border border-dashed border-[var(--line)] rounded-2xl text-xs text-[var(--dim)]">
          Nenhum tópico atrasado na fila. Adicione um para calibrar.
        </div>
      ) : (
        QUEUE_ORDER.map((q) => {
          if (grouped[q].length === 0) return null;
          return (
            <section key={q} className="space-y-3">
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: 'var(--primary)', color: 'var(--wash)' }}
                >
                  Fila {q}
                </span>
                <h2 className="font-display font-medium text-sm text-[var(--text)]">{QUEUE_LABELS[q]}</h2>
              </div>
              <p className="text-[11px] text-[var(--dim)] -mt-1">{QUEUE_CRITERIA[q]} — {QUEUE_TREATMENT[q]}</p>

              <div className="space-y-2">
                {grouped[q].map((item) => {
                  const topic = topicById(item.topicId);
                  if (!topic) {
                    return (
                      <OrphanedBacklogItem
                        key={item.id}
                        item={item}
                        allSubjects={allSubjects}
                        onReassign={(topicId) => patchItem(item.id, { topicId })}
                        onRemove={() => removeItem(item.id)}
                      />
                    );
                  }
                  const isExpanded = expandedId === item.id;
                  const ready = isReadyToClose(item);
                  const supportLevel = item.supportLevel ?? 1;
                  const currentSupport = SUPPORT_LEVELS.find((s) => s.level === supportLevel) ?? SUPPORT_LEVELS[0];
                  const subPal = PALETTES[topic.subject] ?? PALETTES.Matemática;
                  const SubIcon = SUBJECT_ICONS[topic.subject] ?? ListTodo;

                  return (
                    <Panel
                      key={item.id}
                      subject={topic.subject}
                      className="ni-panel overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="w-full flex items-center justify-between p-4 text-left hover:bg-[var(--surface2)] transition-colors"
                      >
                        <div className="flex items-center min-w-0">
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center mr-3 shrink-0"
                            style={{ backgroundColor: subPal.primary, color: subPal.wash }}
                          >
                            <SubIcon className="w-3 h-3" />
                          </span>
                          <div className="min-w-0">
                            <p className="font-display font-medium text-xs text-[var(--text)] truncate">{topic.name}{item.subtopic ? ` — ${item.subtopic}` : ''}</p>
                            <p className="text-[11px] text-[var(--dim)] font-mono">{topic.subject} • {STATE_LABELS[item.state]} • score {priorityScore(item).toFixed(1)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {ready && <Trophy className="w-4 h-4 text-emerald-400" />}
                          <ChevronDown className={`w-3.5 h-3.5 text-[var(--dim)] transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-[var(--line)] space-y-4 text-xs">
                          <div className="flex items-center justify-between">
                            <p className="text-[11px] text-[var(--dim)]">Protocolo PONTE — Retirada progressiva de apoio.</p>
                            <button onClick={() => removeItem(item.id)} className="flex items-center text-[11px] text-[var(--dim)] hover:text-rose-400 shrink-0 ml-3">
                              <Trash2 className="w-3 h-3 mr-1" />
                              Remover
                            </button>
                          </div>

                          <div>
                            <p className="font-semibold text-[var(--text)] mb-1">Estado de domínio</p>
                            <div className="flex flex-wrap gap-1.5">
                              {[0, 1, 2, 3, 4].map((n) => (
                                <button
                                  key={n}
                                  onClick={() => patchItem(item.id, { state: n })}
                                  className="px-2 py-1 rounded-lg text-xs font-semibold border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)]"
                                  style={item.state === n ? { backgroundColor: subPal.primary, color: subPal.wash, borderColor: subPal.primary } : undefined}
                                >
                                  {n} — {STATE_LABELS[n]}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label htmlFor={`objective-${item.id}`} className="font-semibold text-[var(--text)] mb-1 block">
                              Objetivo mínimo observável
                            </label>
                            <input
                              id={`objective-${item.id}`}
                              type="text"
                              defaultValue={item.objective ?? ''}
                              onBlur={(e) => patchItem(item.id, { objective: e.target.value })}
                              placeholder="Ex: resolvo questão modelo sem consultar gabarito..."
                              className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
                            />
                          </div>

                          <div className="p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)] space-y-3">
                            <p className="font-semibold text-[var(--text)]">Retirada de apoio — Nível {supportLevel}/5</p>
                            <div className="p-2.5 rounded-lg border border-[var(--primary)]/30 bg-[var(--primary)]/10 text-[var(--text)]">
                              <p className="font-semibold text-xs">{currentSupport.activity}</p>
                              <p className="text-[11px] text-[var(--dim)] mt-0.5">Pronta para avançar quando: {currentSupport.readyToAdvance}</p>
                            </div>
                            <SupportLevelContent
                              key={`${user?.uid ?? 'demo'}_${item.id}_${supportLevel}`}
                              topic={topic}
                              subtopic={item.subtopic}
                              supportLevel={supportLevel}
                              onOutcome={(outcome, evidenceId) => recordRecoveryOutcome(item, outcome, evidenceId)}
                            />
                            <div className="flex gap-2">
                              <button
                                onClick={() => patchItem(item.id, { supportLevel: Math.max(1, supportLevel - 1) })}
                                disabled={supportLevel <= 1}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-[var(--line)] text-[var(--dim)] hover:text-[var(--text)] disabled:opacity-40"
                              >
                                Nível anterior
                              </button>
                              <button
                                onClick={() => patchItem(item.id, { supportLevel: Math.min(5, supportLevel + 1) })}
                                disabled={supportLevel >= 5}
                                className="px-2.5 py-1 rounded-lg text-xs font-semibold border border-[var(--line)] text-[var(--dim)] hover:text-[var(--text)] disabled:opacity-40"
                              >
                                Avançar nível
                              </button>
                            </div>
                          </div>

                          <div>
                            <p className="font-semibold text-[var(--text)] mb-1.5">Critérios de saída</p>
                            <div className="space-y-1">
                              {EXIT_CHECKLIST.map((c, i) => (
                                <label key={i} className="flex items-start text-xs text-[var(--dim)]">
                                  <input
                                    type="checkbox"
                                    checked={!!checkedExit[i]}
                                    onChange={(e) => setCheckedExit((prev) => ({ ...prev, [i]: e.target.checked }))}
                                    className="mt-0.5 mr-2 accent-[var(--primary)]"
                                  />
                                  <span>{c}</span>
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-3 rounded-xl bg-[var(--surface2)] border border-[var(--line)]">
                            <div>
                              <p className="font-semibold text-xs text-[var(--text)]">Sucessos independentes: {item.independentSuccesses}</p>
                              <label className="flex items-center text-[11px] text-[var(--dim)] mt-0.5">
                                <input
                                  type="checkbox"
                                  checked={item.canExplainTypicalError}
                                  onChange={(e) => patchItem(item.id, { canExplainTypicalError: e.target.checked })}
                                  className="mr-1.5 accent-[var(--primary)]"
                                />
                                Consigo explicar o erro típico deste tópico
                              </label>
                            </div>
                            <button
                              onClick={() => void recordManualSuccess(item)}
                              disabled={manualSavingId === item.id}
                              className="px-3 py-1.5 bg-[var(--primary)] text-[var(--wash)] rounded-lg text-xs font-semibold hover:opacity-90 disabled:opacity-50"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 inline mr-1" />
                              {manualSavingId === item.id ? 'Salvando...' : 'Registrar sucesso'}
                            </button>
                          </div>

                          {ready && (
                            <button
                              onClick={() => closeItem(item)}
                              className="w-full py-2.5 bg-emerald-600 text-white rounded-xl font-semibold text-xs hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
                            >
                              <Trophy className="w-4 h-4" />
                              Marcar tópico como recuperado
                            </button>
                          )}
                        </div>
                      )}
                    </Panel>
                  );
                })}
              </div>
            </section>
          );
        })
      )}

      {closedItems.length > 0 && (
        <section className="space-y-3 pt-4">
          <h2 className="font-display font-medium text-sm text-[var(--text)] flex items-center gap-1.5">
            <Trophy className="w-4 h-4 text-emerald-400" />
            Tópicos Recuperados
          </h2>
          <div className="space-y-2">
            {closedItems.map((item) => {
              const topic = topicById(item.topicId);
              if (!topic) return null;
              const subPal = PALETTES[topic.subject] ?? PALETTES.Matemática;
              return (
                <Panel key={item.id} subject={topic.subject} className="ni-panel p-3.5 flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <span
                      className="w-2 h-2 rounded-full mr-2.5 shrink-0"
                      style={{ backgroundColor: subPal.primary }}
                    />
                    <div className="min-w-0 text-xs">
                      <p className="font-medium text-[var(--text)] truncate">{topic.name}{item.subtopic ? ` — ${item.subtopic}` : ''}</p>
                      <p className="text-[11px] text-[var(--dim)] font-mono">{topic.subject} • Migrou para manutenção</p>
                    </div>
                  </div>
                </Panel>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
