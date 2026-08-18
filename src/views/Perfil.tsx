import React, { useEffect, useState } from 'react';
import { useUserProfile } from '../hooks/useUserProfile';
import { useAuth } from '../context/AuthContext';
import { disableReviewReminders, enableReviewReminders, getCurrentPushSubscription, isPushSupported } from '../lib/push';
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
} from 'lucide-react';

const KNOWN_EXAMS = ['ENEM', 'FUVEST', 'UNICAMP', 'UNESP', 'FAMERP', 'UNIFESP'];
const KNOWN_UNIVERSITIES = ['USP', 'UNICAMP', 'UNESP', 'FAMERP', 'UNIFESP'];

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
  const { isConnected } = useAuth();
  const [courseDraft, setCourseDraft] = useState(profile.targetCourse);
  const [hoursDraft, setHoursDraft] = useState(profile.availableHoursPerWeek);
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
