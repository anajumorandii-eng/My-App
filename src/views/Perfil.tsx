import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useStudentGoals } from '../hooks/useStudentGoals';
import { useAuth } from '../context/AuthContext';
import { disableReviewReminders, enableReviewReminders, getCurrentPushSubscription, isPushSupported, needsIosHomeScreenInstall } from '../lib/push';
import { BoardWeight } from '../types';
import {
  UserCircle,
  CloudOff,
  Check,
  Battery,
  BatteryLow,
  BatteryFull,
  Save,
  Brain,
  Bell,
  BellOff,
  Target,
  X,
} from 'lucide-react';

const KNOWN_EXAMS = ['ENEM', 'FUVEST', 'UNICAMP', 'UNESP', 'FAMERP', 'UNIFESP'];
const KNOWN_UNIVERSITIES = ['USP', 'UNICAMP', 'UNESP', 'FAMERP', 'UNIFESP'];

const PHASE_OPTIONS: { value: BoardWeight['phaseFocus']; label: string }[] = [
  { value: '1a-fase', label: '1ª fase' },
  { value: '2a-fase', label: '2ª fase' },
  { value: 'ambas', label: 'Ambas' },
];

const ENERGY_OPTIONS: { value: 'low' | 'medium' | 'high'; label: string; icon: React.ElementType }[] = [
  { value: 'low', label: 'Baixa', icon: BatteryLow },
  { value: 'medium', label: 'Média', icon: Battery },
  { value: 'high', label: 'Alta', icon: BatteryFull },
];

function toggleItem(list: string[], item: string): string[] {
  return list.includes(item) ? list.filter((i) => i !== item) : [...list, item];
}

export default function Perfil() {
  const { profile, updateProfile, isPersisted, syncError } = useUserProfile();
  const { goals, updateGoals } = useStudentGoals();
  const { isConnected } = useAuth();
  const [courseDraft, setCourseDraft] = useState(profile.targetCourse);
  const [hoursDraft, setHoursDraft] = useState(profile.availableHoursPerWeek);
  const [primaryGoalDraft, setPrimaryGoalDraft] = useState(goals.primaryGoal);
  const [secondaryGoalDraft, setSecondaryGoalDraft] = useState('');
  const [savedFlash, setSavedFlash] = useState(false);
  const [reminderState, setReminderState] = useState<'unknown' | 'on' | 'off'>('unknown');
  const [reminderError, setReminderError] = useState<string | null>(null);
  const [reminderBusy, setReminderBusy] = useState(false);

  // Keep local drafts in sync once the persisted profile finishes loading.
  useEffect(() => {
    setCourseDraft(profile.targetCourse);
    setHoursDraft(profile.availableHoursPerWeek);
  }, [profile.targetCourse, profile.availableHoursPerWeek]);

  useEffect(() => {
    setPrimaryGoalDraft(goals.primaryGoal);
  }, [goals.primaryGoal]);

  useEffect(() => {
    if (!isPushSupported()) {
      setReminderState('off');
      return;
    }
    getCurrentPushSubscription()
      .then((subscription) => setReminderState(subscription ? 'on' : 'off'))
      .catch(() => setReminderState('off'));
  }, []);

  const toggleReminders = async () => {
    setReminderError(null);
    setReminderBusy(true);
    try {
      if (reminderState === 'on') {
        await disableReviewReminders();
        setReminderState('off');
      } else {
        await enableReviewReminders();
        setReminderState('on');
      }
    } catch (error) {
      setReminderError(error instanceof Error ? error.message : 'Não foi possível atualizar as notificações.');
    } finally {
      setReminderBusy(false);
    }
  };

  const flashSaved = () => {
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 1500);
  };

  const commitCourse = () => {
    const trimmed = courseDraft.trim();
    if (trimmed && trimmed !== profile.targetCourse) {
      updateProfile((prev) => ({ ...prev, targetCourse: trimmed }));
      flashSaved();
    }
  };

  const commitHours = () => {
    if (hoursDraft !== profile.availableHoursPerWeek) {
      updateProfile((prev) => ({ ...prev, availableHoursPerWeek: hoursDraft }));
      flashSaved();
    }
  };

  const toggleExam = (exam: string) => {
    updateProfile((prev) => ({ ...prev, targetExams: toggleItem(prev.targetExams, exam) }));
    flashSaved();
  };

  const toggleUniversity = (uni: string) => {
    updateProfile((prev) => ({ ...prev, targetUniversities: toggleItem(prev.targetUniversities, uni) }));
    flashSaved();
  };

  const setEnergy = (value: 'low' | 'medium' | 'high') => {
    updateProfile((prev) => ({ ...prev, currentEnergyLevel: value }));
    flashSaved();
  };

  const commitPrimaryGoal = () => {
    const trimmed = primaryGoalDraft.trim();
    if (trimmed && trimmed !== goals.primaryGoal) {
      updateGoals((prev) => ({ ...prev, primaryGoal: trimmed }));
      flashSaved();
    }
  };

  const addSecondaryGoal = () => {
    const trimmed = secondaryGoalDraft.trim();
    if (!trimmed) return;
    updateGoals((prev) => ({ ...prev, secondaryGoals: [...prev.secondaryGoals, trimmed] }));
    setSecondaryGoalDraft('');
    flashSaved();
  };

  const removeSecondaryGoal = (goal: string) => {
    updateGoals((prev) => ({ ...prev, secondaryGoals: prev.secondaryGoals.filter((g) => g !== goal) }));
    flashSaved();
  };

  const boardWeightFor = (board: string): BoardWeight =>
    goals.boardWeights.find((bw) => bw.board === board) ?? { board, weight: 0.5, phaseFocus: 'ambas' };

  const setBoardWeight = (board: string, patch: Partial<Pick<BoardWeight, 'weight' | 'phaseFocus'>>) => {
    updateGoals((prev) => {
      const existing = prev.boardWeights.find((bw) => bw.board === board);
      const nextEntry: BoardWeight = { ...(existing ?? { board, weight: 0.5, phaseFocus: 'ambas' }), ...patch };
      const boardWeights = existing
        ? prev.boardWeights.map((bw) => (bw.board === board ? nextEntry : bw))
        : [...prev.boardWeights, nextEntry];
      return { ...prev, boardWeights };
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 flex items-center">
          <UserCircle className="w-7 h-7 mr-3 text-indigo-500" />
          Perfil
        </h1>
        <p className="text-zinc-500 dark:text-zinc-400">
          Esses dados moldam como a JUJU prioriza o seu plano — mantenha atualizados.
        </p>
        <div className="flex items-center gap-3 mt-2">
          {!isPersisted && (
            <p className="flex items-center text-xs text-zinc-400">
              <CloudOff className="w-3.5 h-3.5 mr-1.5" />
              Modo demonstração — conecte sua conta Google em "Conexões Google" para salvar seu perfil de verdade.
            </p>
          )}
          {savedFlash && (
            <p className="flex items-center text-xs text-emerald-500 font-medium">
              <Check className="w-3.5 h-3.5 mr-1" />
              Salvo
            </p>
          )}
        </div>
        {syncError && <p className="text-xs text-rose-500 mt-2">{syncError}</p>}
      </header>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div>
          <label htmlFor="course" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
            Curso-alvo
          </label>
          <input
            id="course"
            type="text"
            value={courseDraft}
            onChange={(e) => setCourseDraft(e.target.value)}
            onBlur={commitCourse}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Vestibulares que vai prestar</p>
          <div className="flex flex-wrap gap-2">
            {KNOWN_EXAMS.map((exam) => {
              const active = profile.targetExams.includes(exam);
              return (
                <button
                  key={exam}
                  onClick={() => toggleExam(exam)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {exam}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Universidades-alvo</p>
          <div className="flex flex-wrap gap-2">
            {KNOWN_UNIVERSITIES.map((uni) => {
              const active = profile.targetUniversities.includes(uni);
              return (
                <button
                  key={uni}
                  onClick={() => toggleUniversity(uni)}
                  className={`px-3.5 py-1.5 rounded-full text-sm font-medium border transition-colors ${
                    active
                      ? 'bg-indigo-600 border-indigo-600 text-white'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {uni}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="hours" className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
              Horas disponíveis por semana
            </label>
            <span className="text-lg font-bold text-indigo-600 dark:text-indigo-400">{hoursDraft}h</span>
          </div>
          <input
            id="hours"
            type="range"
            min={5}
            max={80}
            step={1}
            value={hoursDraft}
            onChange={(e) => setHoursDraft(Number(e.target.value))}
            onMouseUp={commitHours}
            onTouchEnd={commitHours}
            className="w-full accent-indigo-600"
          />
          <p className="text-xs text-zinc-500 mt-2">
            Usado como padrão do seu tempo semanal — o tempo de cada dia ainda pode ser ajustado em "Plano".
          </p>
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Energia padrão</p>
          <div className="flex gap-2">
            {ENERGY_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setEnergy(value)}
                className={`flex-1 flex items-center justify-center px-4 py-2.5 rounded-lg text-sm font-medium border transition-colors ${
                  profile.currentEnergyLevel === value
                    ? 'bg-indigo-600 border-indigo-600 text-white'
                    : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                }`}
              >
                <Icon className="w-4 h-4 mr-2" />
                {label}
              </button>
            ))}
          </div>
          <p className="text-xs text-zinc-500 mt-2">
            Ponto de partida do seu dia — em "Plano" você pode ajustar a energia específica de hoje sem alterar esse padrão.
          </p>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm space-y-6">
        <div className="flex items-center text-indigo-600 dark:text-indigo-400">
          <Target className="w-5 h-5 mr-2" />
          <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Objetivos e prioridade por banca</h3>
        </div>
        <p className="text-xs text-zinc-500 -mt-4">
          Isso não muda o que você domina ou não — só como a JUJU pondera a proximidade e a incidência de cada prova ao montar seu plano. Uma prova de banca com peso baixo perto não deve tomar o lugar da sua prioridade real.
        </p>

        <div>
          <label htmlFor="primaryGoal" className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2 block">
            Objetivo principal
          </label>
          <input
            id="primaryGoal"
            type="text"
            value={primaryGoalDraft}
            onChange={(e) => setPrimaryGoalDraft(e.target.value)}
            onBlur={commitPrimaryGoal}
            className="w-full px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <div>
          <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">Objetivos secundários</p>
          <div className="flex flex-wrap gap-2 mb-2">
            {goals.secondaryGoals.map((goal) => (
              <span
                key={goal}
                className="flex items-center gap-1.5 pl-3 pr-2 py-1.5 rounded-full text-sm bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300"
              >
                {goal}
                <button onClick={() => removeSecondaryGoal(goal)} aria-label={`Remover objetivo: ${goal}`}>
                  <X className="w-3.5 h-3.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200" />
                </button>
              </span>
            ))}
          </div>
          <div className="flex gap-2">
            <input
              type="text"
              value={secondaryGoalDraft}
              onChange={(e) => setSecondaryGoalDraft(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addSecondaryGoal(); } }}
              placeholder="Ex: não zerar Redação"
              className="flex-1 px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={addSecondaryGoal}
              className="px-4 py-2 rounded-lg text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700"
            >
              Adicionar
            </button>
          </div>
        </div>

        {profile.targetExams.length > 0 && (
          <div>
            <p className="text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-3">Peso e fase por banca ativa</p>
            <div className="space-y-4">
              {profile.targetExams.map((exam) => {
                const bw = boardWeightFor(exam);
                return (
                  <div key={exam} className="border border-zinc-100 dark:border-zinc-800 rounded-xl p-3.5">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">{exam}</span>
                      <span className="text-xs text-zinc-500">{Math.round(bw.weight * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={Math.round(bw.weight * 100)}
                      onChange={(e) => setBoardWeight(exam, { weight: Number(e.target.value) / 100 })}
                      className="w-full accent-indigo-600 mb-3"
                      aria-label={`Peso de ${exam}`}
                    />
                    <div className="flex gap-2">
                      {PHASE_OPTIONS.map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setBoardWeight(exam, { phaseFocus: value })}
                          className={`flex-1 px-2 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                            bw.phaseFocus === value
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                          }`}
                        >
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center text-emerald-600 dark:text-emerald-400 mb-2">
          <Brain className="w-5 h-5 mr-2" />
          <h3 className="font-medium">Índice de Autonomia</h3>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2 bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500" style={{ width: `${profile.autonomyIndex}%` }} />
          </div>
          <span className="text-sm font-semibold text-zinc-700 dark:text-zinc-300 shrink-0">{profile.autonomyIndex}/100</span>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          Calculado automaticamente pela JUJU a partir do seu histórico de estudo — não é editável diretamente.
        </p>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-indigo-600 dark:text-indigo-400">
            {reminderState === 'on' ? <Bell className="w-5 h-5 mr-2" /> : <BellOff className="w-5 h-5 mr-2" />}
            <h3 className="font-medium text-zinc-900 dark:text-zinc-100">Lembretes de revisão</h3>
          </div>
          <button
            onClick={toggleReminders}
            disabled={reminderBusy || !isConnected || !isPushSupported()}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 ${
              reminderState === 'on'
                ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 hover:bg-zinc-200 dark:hover:bg-zinc-700'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            {reminderBusy ? 'Aguarde...' : reminderState === 'on' ? 'Desativar' : 'Ativar'}
          </button>
        </div>
        <p className="text-xs text-zinc-500 mt-2">
          {!isConnected
            ? 'Conecte sua conta Google para ativar notificações.'
            : needsIosHomeScreenInstall()
            ? 'No iPhone/iPad, notificações só funcionam depois de adicionar a JUJU à Tela de Início (compartilhar → "Adicionar à Tela de Início") e abrir pelo ícone.'
            : !isPushSupported()
            ? 'Seu navegador não suporta notificações push.'
            : 'Quando ativado, você recebe um aviso quando houver tópicos urgentes esperando revisão.'}
        </p>
        {reminderError && <p className="text-xs text-rose-500 mt-2">{reminderError}</p>}
      </div>

      <div className="flex items-center text-xs text-zinc-400">
        <Save className="w-3.5 h-3.5 mr-1.5" />
        As alterações são salvas automaticamente.
      </div>
    </div>
  );
}
