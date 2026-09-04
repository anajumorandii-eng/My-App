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
import { Panel } from '../components/ui/Panel';
import { PALETTES } from '../prototypes/NucleoInstrumentalPrototype';

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

  const currentPalette = PALETTES.Matemática;

  return (
    <div
      className="ni-main"
      style={{
        '--primary': currentPalette.primary,
        '--secondary': currentPalette.secondary,
        '--wash': currentPalette.wash,
      } as React.CSSProperties}
    >
      {/* Route Breadcrumb */}
      <div className="ni-route">
        <span>CONTA</span>
        <i />
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
          <span className="w-5 h-5 flex items-center justify-center rounded-full bg-[var(--primary)] text-[var(--wash)]">
            <UserCircle className="w-3 h-3" />
          </span>
          CONFIGURAÇÕES
        </span>
        <i />
        <b>PERFIL & PREFERÊNCIAS</b>
      </div>

      {/* Main Title */}
      <div className="ni-title">
        <div>
          <h1>Sua conta, suas preferências.</h1>
          <p>Configurações de estudo, metas e parâmetros que calibram o motor de recomendação.</p>
        </div>
        <div className="ni-state">
          <i /> {profile.targetExams.length} bancas selecionadas
        </div>
      </div>

      {!isPersisted && (
        <p className="flex items-start text-xs text-[var(--dim)] mb-2">
          <CloudOff className="w-3.5 h-3.5 mr-1.5 mt-0.5 shrink-0" />
          Modo demonstração — conecte sua conta Google para sincronizar suas preferências.
        </p>
      )}
      {savedFlash && (
        <p className="flex items-center text-xs text-emerald-400 font-medium mb-2">
          <Check className="w-3.5 h-3.5 mr-1" />
          Salvo automaticamente
        </p>
      )}
      {syncError && <p className="text-xs text-rose-500 mb-2">{syncError}</p>}

      {/* Personal Settings */}
      <Panel subject="Matemática" className="ni-panel p-6 space-y-5">
        <div>
          <label htmlFor="course" className="text-xs font-semibold text-[var(--text)] mb-1 block">
            Curso-alvo
          </label>
          <input
            id="course"
            type="text"
            value={courseDraft}
            onChange={(e) => setCourseDraft(e.target.value)}
            onBlur={commitCourse}
            className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--text)] mb-1.5">Vestibulares que vai prestar</p>
          <div className="flex flex-wrap gap-1.5">
            {KNOWN_EXAMS.map((exam) => {
              const active = profile.targetExams.includes(exam);
              return (
                <button
                  key={exam}
                  onClick={() => toggleExam(exam)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] transition-colors"
                  style={active ? { backgroundColor: 'var(--primary)', color: 'var(--wash)', borderColor: 'var(--primary)' } : undefined}
                >
                  {exam}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--text)] mb-1.5">Universidades-alvo</p>
          <div className="flex flex-wrap gap-1.5">
            {KNOWN_UNIVERSITIES.map((uni) => {
              const active = profile.targetUniversities.includes(uni);
              return (
                <button
                  key={uni}
                  onClick={() => toggleUniversity(uni)}
                  className="px-3 py-1 rounded-full text-xs font-semibold border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] transition-colors"
                  style={active ? { backgroundColor: 'var(--primary)', color: 'var(--wash)', borderColor: 'var(--primary)' } : undefined}
                >
                  {uni}
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label htmlFor="hours" className="text-xs font-semibold text-[var(--text)]">
              Horas disponíveis por semana
            </label>
            <span className="text-xs font-mono font-bold text-[var(--primary)]">{hoursDraft}h/sem</span>
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
            className="w-full accent-[var(--primary)]"
          />
          <p className="text-[11px] text-[var(--dim)] mt-1">
            Padrão da carga semanal — o tempo de cada dia ainda pode ser refinado no Plano.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--text)] mb-1.5">Energia padrão</p>
          <div className="flex gap-2">
            {ENERGY_OPTIONS.map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                onClick={() => setEnergy(value)}
                className="flex-1 flex items-center justify-center px-3 py-2 rounded-xl text-xs font-semibold border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] transition-colors"
                style={profile.currentEnergyLevel === value ? { backgroundColor: 'var(--primary)', color: 'var(--wash)', borderColor: 'var(--primary)' } : undefined}
              >
                <Icon className="w-3.5 h-3.5 mr-1.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Target Goals & Board Weights */}
      <Panel subject="Matemática" className="ni-panel p-6 space-y-5">
        <div className="flex items-center text-[var(--primary)]">
          <Target className="w-4 h-4 mr-2" />
          <h3 className="font-display font-medium text-xs text-[var(--text)]">Objetivos e prioridade por banca</h3>
        </div>
        <p className="text-[11px] text-[var(--dim)] -mt-3">
          Calibra como o motor pondera a proximidade e a incidência de cada prova ao montar seu plano de estudo.
        </p>

        <div>
          <label htmlFor="primaryGoal" className="text-xs font-semibold text-[var(--text)] mb-1 block">
            Objetivo principal
          </label>
          <input
            id="primaryGoal"
            type="text"
            value={primaryGoalDraft}
            onChange={(e) => setPrimaryGoalDraft(e.target.value)}
            onBlur={commitPrimaryGoal}
            className="w-full px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
          />
        </div>

        <div>
          <p className="text-xs font-semibold text-[var(--text)] mb-1.5">Objetivos secundários</p>
          <div className="flex flex-wrap gap-1.5 mb-2">
            {goals.secondaryGoals.map((goal) => (
              <span
                key={goal}
                className="flex items-center gap-1.5 pl-2.5 pr-2 py-1 rounded-full text-xs bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)]"
              >
                {goal}
                <button onClick={() => removeSecondaryGoal(goal)} aria-label={`Remover objetivo: ${goal}`}>
                  <X className="w-3 h-3 text-[var(--dim)] hover:text-rose-400" />
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
              placeholder="Ex: Gabaritar Biologia na 2ª fase"
              className="flex-1 px-3 py-2 rounded-xl border border-[var(--line)] bg-[var(--surface2)] text-xs text-[var(--text)] outline-none focus:border-[var(--primary)]"
            />
            <button
              onClick={addSecondaryGoal}
              className="px-3 py-2 rounded-xl text-xs font-semibold bg-[var(--surface2)] border border-[var(--line)] text-[var(--text)] hover:bg-[var(--surface)]"
            >
              Adicionar
            </button>
          </div>
        </div>

        {profile.targetExams.length > 0 && (
          <div>
            <p className="text-xs font-semibold text-[var(--text)] mb-2">Peso e foco de fase por banca</p>
            <div className="space-y-3">
              {profile.targetExams.map((exam) => {
                const bw = boardWeightFor(exam);
                return (
                  <div key={exam} className="border border-[var(--line)] bg-[var(--surface2)] rounded-xl p-3 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-display font-medium text-xs text-[var(--text)]">{exam}</span>
                      <span className="text-[11px] font-mono text-[var(--dim)]">{Math.round(bw.weight * 100)}%</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100}
                      step={5}
                      value={Math.round(bw.weight * 100)}
                      onChange={(e) => setBoardWeight(exam, { weight: Number(e.target.value) / 100 })}
                      className="w-full accent-[var(--primary)]"
                      aria-label={`Peso de ${exam}`}
                    />
                    <div className="flex gap-1.5">
                      {PHASE_OPTIONS.map(({ value, label }) => (
                        <button
                          key={value}
                          onClick={() => setBoardWeight(exam, { phaseFocus: value })}
                          className="flex-1 py-1 rounded-lg text-[11px] font-semibold border border-[var(--line)] bg-[var(--surface)] text-[var(--text)] transition-colors"
                          style={bw.phaseFocus === value ? { backgroundColor: 'var(--primary)', color: 'var(--wash)', borderColor: 'var(--primary)' } : undefined}
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
      </Panel>

      {/* Autonomy Index */}
      <Panel subject="Matemática" className="ni-panel p-6 space-y-3">
        <div className="flex items-center text-emerald-400 mb-1">
          <Brain className="w-4 h-4 mr-2" />
          <h3 className="font-display font-medium text-xs text-[var(--text)]">Índice de Autonomia</h3>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-[var(--surface2)] border border-[var(--line)] rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${profile.autonomyIndex}%` }} />
          </div>
          <span className="text-xs font-mono font-bold text-[var(--text)] shrink-0">{profile.autonomyIndex}/100</span>
        </div>
        <p className="text-[11px] text-[var(--dim)]">
          Calculado automaticamente a partir da constância e das evidências de resolução independente.
        </p>
      </Panel>

      {/* Push Notifications */}
      <Panel subject="Matemática" className="ni-panel p-6 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center text-[var(--primary)]">
            {reminderState === 'on' ? <Bell className="w-4 h-4 mr-2" /> : <BellOff className="w-4 h-4 mr-2" />}
            <h3 className="font-display font-medium text-xs text-[var(--text)]">Lembretes de revisão</h3>
          </div>
          <button
            onClick={toggleReminders}
            disabled={reminderBusy || !isConnected || !isPushSupported()}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-[var(--line)] bg-[var(--surface2)] text-[var(--text)] hover:bg-[var(--surface)] disabled:opacity-50 transition-colors"
            style={reminderState === 'on' ? { backgroundColor: 'var(--primary)', color: 'var(--wash)', borderColor: 'var(--primary)' } : undefined}
          >
            {reminderBusy ? 'Aguarde...' : reminderState === 'on' ? 'Ativado' : 'Ativar'}
          </button>
        </div>
        <p className="text-[11px] text-[var(--dim)]">
          {!isConnected
            ? 'Conecte sua conta Google para ativar notificações.'
            : needsIosHomeScreenInstall()
            ? 'No iOS, adicione o Crivo à Tela de Início (Compartilhar → "Adicionar à Tela de Início") para receber notificações push.'
            : !isPushSupported()
            ? 'Seu navegador atual não suporta notificações push.'
            : 'Receba avisos quando houver revisões adaptativas críticas antes do vencimento do intervalo SM-2.'}
        </p>
        {reminderError && <p className="text-xs text-rose-500 mt-1">{reminderError}</p>}
      </Panel>

      <div className="flex items-center text-[11px] text-[var(--dim)] font-mono">
        <Save className="w-3.5 h-3.5 mr-1.5" />
        Configurações salvas automaticamente no estado local e sincronizadas.
      </div>
    </div>
  );
}
