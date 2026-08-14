import React, { useMemo, useState } from 'react';
import { mockTopics, mockQuestions } from '../data/mockData';
import { useUserBacklog } from '../hooks/useUserBacklog';
import { parseAiErrorMessage, AI_NETWORK_ERROR_MESSAGE } from '../lib/aiError';
import {
  priorityScore,
  priorityQueue,
  isReadyToClose,
  QUEUE_LABELS,
  QUEUE_CRITERIA,
  QUEUE_TREATMENT,
  STATE_LABELS,
  STATE_DESCRIPTIONS,
  SUPPORT_LEVELS,
  EXIT_CHECKLIST,
  BacklogQueue,
} from '../lib/backlogEngine';
import { BacklogItem, Topic } from '../types';
import {
  ListTodo,
  Plus,
  ChevronDown,
  CloudOff,
  CheckCircle2,
  Trophy,
  Trash2,
  Info,
  Sparkles,
  X,
} from 'lucide-react';

const QUEUE_ORDER: BacklogQueue[] = ['A', 'B', 'C', 'D'];

const QUEUE_COLORS: Record<BacklogQueue, string> = {
  A: 'bg-rose-50 dark:bg-rose-900/20 text-rose-700 dark:text-rose-300',
  B: 'bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300',
  C: 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300',
  D: 'bg-zinc-100 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-400',
};

const SUBJECT_COLORS: Record<string, string> = {
  Biologia: 'bg-emerald-500',
  Matemática: 'bg-indigo-500',
  Física: 'bg-amber-500',
  Química: 'bg-rose-500',
  Geografia: 'bg-teal-500',
  História: 'bg-orange-500',
  Português: 'bg-violet-500',
  Inglês: 'bg-sky-500',
};

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
      <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">{label}</p>
      <p className="text-xs text-zinc-500 mb-2">{helper}</p>
      <div className="flex gap-1.5">
        {options.map((n) => (
          <button
            key={n}
            type="button"
            onClick={() => onChange(n)}
            className={`w-9 h-9 rounded-lg text-sm font-medium border transition-colors ${
              value === n
                ? 'bg-indigo-600 border-indigo-600 text-white'
                : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
            }`}
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

function SupportLevelContent({ topic, supportLevel }: { topic: Topic; supportLevel: number }) {
  const [aiExerciseText, setAiExerciseText] = useState<string | null>(null);
  const [loadingExercise, setLoadingExercise] = useState(false);
  const [exerciseError, setExerciseError] = useState<string | null>(null);
  const [studentAnswer, setStudentAnswer] = useState('');
  const [correction, setCorrection] = useState<string | null>(null);
  const [loadingCorrection, setLoadingCorrection] = useState(false);
  const [correctionError, setCorrectionError] = useState<string | null>(null);

  const realQuestion = useMemo(() => {
    if (supportLevel !== 3 && supportLevel !== 4) return undefined;
    return mockQuestions.filter((q) => q.topicId === topic.id)[supportLevel - 3];
  }, [topic.id, supportLevel]);

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
      const res = await fetch('/api/ai/backlog-exercise', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic: topic.name, subject: topic.subject, mode: EXERCISE_MODE_BY_LEVEL[supportLevel] }),
      });
      if (res.ok) {
        const data = await res.json();
        setAiExerciseText(data.text);
      } else {
        setExerciseError(await parseAiErrorMessage(res));
      }
    } catch (error) {
      console.error('Failed to fetch backlog exercise:', error);
      setExerciseError(AI_NETWORK_ERROR_MESSAGE);
    } finally {
      setLoadingExercise(false);
    }
  };

  const fetchCorrection = async () => {
    if (!exerciseText || !studentAnswer.trim()) return;
    setLoadingCorrection(true);
    setCorrectionError(null);
    try {
      const res = await fetch('/api/ai/backlog-correction', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: topic.name,
          subject: topic.subject,
          exercise: exerciseText,
          studentAnswer,
          groundingAnswer,
        }),
      });
      if (res.ok) {
        const data = await res.json();
        setCorrection(data.text);
      } else {
        setCorrectionError(await parseAiErrorMessage(res));
      }
    } catch (error) {
      console.error('Failed to fetch backlog correction:', error);
      setCorrectionError(AI_NETWORK_ERROR_MESSAGE);
    } finally {
      setLoadingCorrection(false);
    }
  };

  if (!exerciseText) {
    return (
      <div>
        <button
          onClick={fetchExercise}
          disabled={loadingExercise}
          className="w-full flex items-center justify-center py-2.5 border border-indigo-200 dark:border-indigo-800 text-indigo-600 dark:text-indigo-400 rounded-xl font-medium text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/20 disabled:opacity-50 transition-colors"
        >
          <Sparkles className={`w-4 h-4 mr-2 ${loadingExercise ? 'animate-pulse' : ''}`} />
          {loadingExercise ? 'Gerando exercício com IA...' : 'Gerar exercício com IA'}
        </button>
        {exerciseError && <p className="text-xs text-rose-500 mt-2">{exerciseError}</p>}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-900 dark:text-indigo-200 text-sm leading-relaxed whitespace-pre-line">
        {exerciseText}
      </div>
      <div>
        <label htmlFor={`answer-${topic.id}-${supportLevel}`} className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5 block">
          Sua resposta
        </label>
        <textarea
          id={`answer-${topic.id}-${supportLevel}`}
          value={studentAnswer}
          onChange={(e) => setStudentAnswer(e.target.value)}
          rows={5}
          placeholder="Escreva sua resposta ou raciocínio de verdade — é isso que a IA vai corrigir."
          disabled={!!correction}
          className="w-full px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm leading-relaxed focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
        />
      </div>
      {!correction ? (
        <div>
          <button
            onClick={fetchCorrection}
            disabled={loadingCorrection || !studentAnswer.trim()}
            className="w-full flex items-center justify-center py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium text-sm transition-colors"
          >
            <Sparkles className={`w-4 h-4 mr-2 ${loadingCorrection ? 'animate-pulse' : ''}`} />
            {loadingCorrection ? 'Corrigindo com IA...' : 'Corrigir com IA'}
          </button>
          {correctionError && <p className="text-xs text-rose-500 mt-2">{correctionError}</p>}
        </div>
      ) : (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 text-emerald-900 dark:text-emerald-200 text-sm leading-relaxed whitespace-pre-line">
          {correction}
        </div>
      )}
    </div>
  );
}

export default function Recuperacao() {
  const { backlog, updateBacklog, isPersisted, syncError } = useUserBacklog();
  const [showAddForm, setShowAddForm] = useState(false);
  const [showTracks, setShowTracks] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [checkedExit, setCheckedExit] = useState<Record<number, boolean>>({});

  const [formTopicId, setFormTopicId] = useState('');
  const [formState, setFormState] = useState(0);
  const [formDependencia, setFormDependencia] = useState(1);
  const [formIncidencia, setFormIncidencia] = useState(1);
  const [formLacuna, setFormLacuna] = useState(1);
  const [formUrgencia, setFormUrgencia] = useState(1);
  const [formCusto, setFormCusto] = useState(2);

  const activeItems = backlog.filter((b) => !b.closedAt);
  const closedItems = backlog.filter((b) => b.closedAt);
  const backloggedTopicIds = new Set(backlog.map((b) => b.topicId));
  const availableTopics = mockTopics.filter((t) => !backloggedTopicIds.has(t.id));
  const allSubjects = useMemo(() => [...new Set(mockTopics.map((t) => t.subject))], []);
  const topicById = (id: string) => mockTopics.find((t) => t.id === id);

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

  const removeItem = (id: string) => {
    updateBacklog((prev) => prev.filter((b) => b.id !== id));
    if (expandedId === id) setExpandedId(null);
  };

  const closeItem = (item: BacklogItem) => {
    patchItem(item.id, { closedAt: new Date().toISOString() });
    setExpandedId(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <ListTodo className="w-7 h-7 mr-3 text-indigo-500" />
          Recuperação de Atrasos
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Transforme "matéria atrasada" numa fila priorizada, sem travar o conteúdo atual: diagnostique, priorize e feche cada tópico com o protocolo PONTE.
        </p>
        {!isPersisted && (
          <p className="flex items-center text-xs text-zinc-400 mt-2">
            <CloudOff className="w-3.5 h-3.5 mr-1.5" />
            Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar sua fila de verdade.
          </p>
        )}
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
      </header>

      <div className="flex gap-2 flex-wrap">
        <button
          onClick={() => setShowAddForm((v) => !v)}
          className="flex items-center px-4 py-2 rounded-lg text-sm font-medium bg-indigo-600 hover:bg-indigo-700 text-white transition-colors"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Adicionar tópico atrasado
        </button>
        <button
          onClick={() => setShowTracks((v) => !v)}
          className="flex items-center px-4 py-2 rounded-lg text-sm font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
        >
          <Info className="w-4 h-4 mr-1.5" />
          Como encaixar isso na semana
        </button>
      </div>

      {showTracks && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-3">
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Mantenha três trilhos rodando ao mesmo tempo, sem deixar o atraso engolir o presente: <strong>Atual</strong> (acompanhar o que está sendo ensinado agora), <strong>Recuperação</strong> (eliminar gargalos antigos prioritários — a fila abaixo) e <strong>Manutenção</strong> (impedir novo esquecimento, via Revisões Adaptativas).
          </p>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            Em uma semana comum, algo como 55–65% do tempo no conteúdo atual, 25–35% em recuperação (comece pela Fila A) e 10–15% em manutenção costuma funcionar — perto de uma prova, os pesos mudam a favor da recuperação. Se a semana falhar, não tente encaixar tudo no dia seguinte: preserve o conteúdo atual, mantenha a revisão mais importante e recoloque apenas a prioridade máxima da fila.
          </p>
        </div>
      )}

      {showAddForm && (
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-5">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Novo tópico atrasado</h3>
            <button onClick={() => { setShowAddForm(false); resetForm(); }} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
              <X className="w-4 h-4" />
            </button>
          </div>

          <div>
            <label htmlFor="topic-select" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
              Tópico
            </label>
            <select
              id="topic-select"
              value={formTopicId}
              onChange={(e) => setFormTopicId(e.target.value)}
              className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">Selecione um tópico...</option>
              {allSubjects.map((subject) => (
                <optgroup key={subject} label={subject}>
                  {availableTopics.filter((t) => t.subject === subject).map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Estado atual</p>
            <div className="flex flex-wrap gap-2">
              {[0, 1, 2, 3, 4].map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormState(n)}
                  className={`px-3 py-2 rounded-lg text-xs font-medium border transition-colors text-left ${
                    formState === n
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {n} — {STATE_LABELS[n]}
                </button>
              ))}
            </div>
            <p className="text-xs text-zinc-500 mt-1.5">{STATE_DESCRIPTIONS[formState]}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <ScorePicker label="Dependência" value={formDependencia} onChange={setFormDependencia} max={3} helper="Este tópico destrava outros?" />
            <ScorePicker label="Incidência" value={formIncidencia} onChange={setFormIncidencia} max={3} helper="Aparece muito nas suas bancas-alvo?" />
            <ScorePicker label="Lacuna" value={formLacuna} onChange={setFormLacuna} max={3} helper="O diagnóstico mostra falha real?" />
            <ScorePicker label="Urgência" value={formUrgencia} onChange={setFormUrgencia} max={3} helper="Há prova, simulado ou aula dependente próxima?" />
          </div>
          <ScorePicker label="Custo" value={formCusto} onChange={setFormCusto} max={3} helper="Quantas sessões você estima precisar (1 = poucas, 3 = muitas)?" />

          <button
            onClick={addToBacklog}
            disabled={!formTopicId}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-zinc-300 dark:disabled:bg-zinc-700 text-white rounded-xl font-medium transition-colors"
          >
            Adicionar à fila
          </button>
        </div>
      )}

      {activeItems.length === 0 ? (
        <div className="text-center py-16 bg-zinc-50 dark:bg-zinc-900/50 rounded-2xl border border-dashed border-zinc-200 dark:border-zinc-800">
          <p className="text-zinc-500">Nenhum tópico atrasado na fila. Adicione um para começar.</p>
        </div>
      ) : (
        QUEUE_ORDER.map((q) => {
          if (grouped[q].length === 0) return null;
          return (
            <section key={q}>
              <div className="flex items-center mb-1">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full mr-2.5 ${QUEUE_COLORS[q]}`}>Fila {q}</span>
                <h2 className="text-xl font-semibold">{QUEUE_LABELS[q]}</h2>
              </div>
              <p className="text-xs text-zinc-500 mb-3">{QUEUE_CRITERIA[q]} — {QUEUE_TREATMENT[q]}</p>

              <div className="space-y-3">
                {grouped[q].map((item) => {
                  const topic = topicById(item.topicId);
                  if (!topic) return null;
                  const isExpanded = expandedId === item.id;
                  const ready = isReadyToClose(item);
                  const supportLevel = item.supportLevel ?? 1;
                  const currentSupport = SUPPORT_LEVELS.find((s) => s.level === supportLevel) ?? SUPPORT_LEVELS[0];

                  return (
                    <div key={item.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl shadow-sm overflow-hidden">
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="w-full flex items-center justify-between p-5 text-left"
                      >
                        <div className="flex items-center min-w-0">
                          <span className={`w-2 h-2 rounded-full mr-3 shrink-0 ${SUBJECT_COLORS[topic.subject] ?? 'bg-zinc-400'}`} />
                          <div className="min-w-0">
                            <p className="font-semibold truncate">{topic.name}</p>
                            <p className="text-xs text-zinc-500">{topic.subject} • {STATE_LABELS[item.state]} • score {priorityScore(item).toFixed(1)}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 shrink-0 ml-3">
                          {ready && <Trophy className="w-4 h-4 text-emerald-500" />}
                          <ChevronDown className={`w-4 h-4 text-zinc-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                        </div>
                      </button>

                      {isExpanded && (
                        <div className="px-5 pb-5 pt-1 border-t border-zinc-100 dark:border-zinc-800 space-y-5">
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-zinc-500">Protocolo PONTE — Pré-teste, Objetivo, Núcleo teórico, Treino com retirada de apoio, Evidência.</p>
                            <button onClick={() => removeItem(item.id)} className="flex items-center text-xs text-zinc-400 hover:text-rose-500 shrink-0 ml-3">
                              <Trash2 className="w-3.5 h-3.5 mr-1" />
                              Remover
                            </button>
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1">Estado atual</p>
                            <div className="flex flex-wrap gap-2">
                              {[0, 1, 2, 3, 4].map((n) => (
                                <button
                                  key={n}
                                  onClick={() => patchItem(item.id, { state: n })}
                                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                                    item.state === n
                                      ? 'bg-indigo-600 border-indigo-600 text-white'
                                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                                  }`}
                                >
                                  {n} — {STATE_LABELS[n]}
                                </button>
                              ))}
                            </div>
                          </div>

                          <div>
                            <label htmlFor={`objective-${item.id}`} className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-1 block">
                              Objetivo mínimo de domínio
                            </label>
                            <p className="text-xs text-zinc-500 mb-2">Uma frase observável — ex.: "resolvo uma questão de função quadrática com gráfico e justifico vértice e raízes".</p>
                            <input
                              id={`objective-${item.id}`}
                              type="text"
                              defaultValue={item.objective ?? ''}
                              onBlur={(e) => patchItem(item.id, { objective: e.target.value })}
                              placeholder="Escreva seu objetivo mínimo..."
                              className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                            />
                          </div>

                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500">
                            Núcleo teórico: estude só o necessário para atingir o objetivo acima. Antes de ver o próximo passo de um exemplo, tente antecipá-lo.
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Retirada de apoio — nível {supportLevel}/5</p>
                            <div className="p-3 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-800 dark:text-indigo-300 text-sm mb-3">
                              <p className="font-medium">{currentSupport.activity}</p>
                              <p className="text-xs mt-1">Pronta para avançar quando: {currentSupport.readyToAdvance}</p>
                            </div>
                            <SupportLevelContent key={`${item.id}_${supportLevel}`} topic={topic} supportLevel={supportLevel} />
                            <div className="flex gap-2 mt-3">
                              <button
                                onClick={() => patchItem(item.id, { supportLevel: Math.max(1, supportLevel - 1) })}
                                disabled={supportLevel <= 1}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                              >
                                Nível anterior
                              </button>
                              <button
                                onClick={() => patchItem(item.id, { supportLevel: Math.min(5, supportLevel + 1) })}
                                disabled={supportLevel >= 5}
                                className="px-3 py-1.5 rounded-lg text-xs font-medium border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors"
                              >
                                Avançar nível
                              </button>
                            </div>
                          </div>

                          <div className="p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 text-xs text-zinc-500">
                            Correção produtiva: não copie a resolução inteira. Localize o primeiro ponto de divergência entre seu raciocínio e o correto, classifique o erro, escreva a regra que faltou e refaça sem olhar.
                          </div>

                          <div>
                            <p className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2">Checagem de saída</p>
                            <div className="space-y-1.5">
                              {EXIT_CHECKLIST.map((c, i) => (
                                <label key={i} className="flex items-start text-sm text-zinc-600 dark:text-zinc-400">
                                  <input
                                    type="checkbox"
                                    checked={!!checkedExit[i]}
                                    onChange={(e) => setCheckedExit((prev) => ({ ...prev, [i]: e.target.checked }))}
                                    className="mt-0.5 mr-2.5 accent-indigo-600"
                                  />
                                  {c}
                                </label>
                              ))}
                            </div>
                          </div>

                          <div className="flex items-center justify-between p-4 rounded-xl bg-zinc-50 dark:bg-zinc-800/50">
                            <div>
                              <p className="text-sm font-medium">Sucessos independentes: {item.independentSuccesses}</p>
                              <label className="flex items-center text-xs text-zinc-500 mt-1">
                                <input
                                  type="checkbox"
                                  checked={item.canExplainTypicalError}
                                  onChange={(e) => patchItem(item.id, { canExplainTypicalError: e.target.checked })}
                                  className="mr-1.5 accent-indigo-600"
                                />
                                Consigo explicar o erro típico deste tópico
                              </label>
                            </div>
                            <button
                              onClick={() => patchItem(item.id, { independentSuccesses: item.independentSuccesses + 1 })}
                              className="flex items-center px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors shrink-0 ml-3"
                            >
                              <CheckCircle2 className="w-4 h-4 mr-1.5" />
                              Registrar sucesso
                            </button>
                          </div>

                          {ready && (
                            <button
                              onClick={() => closeItem(item)}
                              className="w-full flex items-center justify-center py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-medium transition-colors"
                            >
                              <Trophy className="w-4 h-4 mr-2" />
                              Marcar tópico como recuperado
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          );
        })
      )}

      {closedItems.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-3 flex items-center">
            <Trophy className="w-5 h-5 mr-2 text-emerald-500" />
            Recuperados
          </h2>
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl divide-y divide-zinc-100 dark:divide-zinc-800 overflow-hidden">
            {closedItems.map((item) => {
              const topic = topicById(item.topicId);
              if (!topic) return null;
              return (
                <div key={item.id} className="p-4 flex items-center justify-between">
                  <div className="flex items-center min-w-0">
                    <span className={`w-2 h-2 rounded-full mr-3 shrink-0 ${SUBJECT_COLORS[topic.subject] ?? 'bg-zinc-400'}`} />
                    <div className="min-w-0">
                      <p className="font-medium truncate">{topic.name}</p>
                      <p className="text-xs text-zinc-500">{topic.subject} — migrou para manutenção (Revisões Adaptativas)</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
