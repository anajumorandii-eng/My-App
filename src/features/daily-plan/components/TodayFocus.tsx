import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ArrowRight, Library, Play, PlayCircle } from 'lucide-react';
import { AllocatedStudyAction, DisagreeReason } from '../../../types';
import { formatIsoTimeInSaoPaulo } from '../../../features/availability/time';
import { Button } from '../../../components/ui/Button';
import { KineticText } from '../../../components/ui/KineticText';
import { CrivoCore } from '../../../components/CrivoCore';
import { getSubjectProfile, TYPOGRAPHY_PRESETS } from '../../../design-system/crivoSubjects';
import { DecisionExplanation } from './DecisionExplanation';
import { DisagreeControl, FeedbackStatus } from './DisagreeControl';
import { AdaptiveUpdate } from './AdaptiveUpdate';
import { DecisionFactorField } from './DecisionFactorField';
import { DecisionSignalStrip } from './DecisionSignalStrip';
import { focusEnter } from '../../../design-system/motion/variants';
import { usePreviousFeedback } from '../../../hooks/usePreviousFeedback';
import { useDecisionChoreography } from '../motion/useDecisionChoreography';
import { cn } from '../../../lib/cn';
import { ObservatoryTrajectoryChart } from '../../../prototypes/NucleoInstrumentalPrototype';
import { SubjectEvidence } from './SubjectEvidence';

export interface TodayFocusProps {
  /** Allocated, not merely ranked: the focus card states *when* today's
   * recommendation is scheduled, so it needs the slot the allocator placed
   * it in, not just the priority-engine fields. */
  action: AllocatedStudyAction;
  actionLabel: string;
  mainReason: string;
  onStart: () => void;
  showAdaptiveUpdate: boolean;
  /** The matéria of yesterday's primary recommendation, only when it genuinely differs from today's — drives the Núcleo's metamorphosis instead of an instant recolor. */
  previousSubject?: string;
  userId: string | undefined;
  feedbackStatus: FeedbackStatus;
  onDisagree: (reason: DisagreeReason) => void;
  onOpenQuestions?: () => void;
  onOpenReview?: () => void;
}

export function TodayFocus({ action, actionLabel, mainReason, onStart, showAdaptiveUpdate, previousSubject, userId, feedbackStatus, onDisagree, onOpenQuestions, onOpenReview }: TodayFocusProps) {
  const [disagreeOpen, setDisagreeOpen] = useState(false);
  const [explanationOpen, setExplanationOpen] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const previous = usePreviousFeedback(action.topicId, userId);
  const subjectProfile = getSubjectProfile(action.subject);
  const typographyPreset = TYPOGRAPHY_PRESETS[subjectProfile.tipografia];
  const { coreState, phase, confirmationKey, reducedMotion } = useDecisionChoreography({
    actionId: action.id,
    rankingChanged: showAdaptiveUpdate,
    feedbackStatus,
    explanationOpen,
  });
  const reviewUrgency = action.factors?.find((factor) => factor.kind === 'review_urgency')?.rawValue ?? 0;
  const masteryValue = action.snapshot?.masteryLevel ?? 0;
  const uncertaintyValue = action.snapshot?.uncertainty ?? 0;
  const masteryPercent = Math.round(Math.min(100, masteryValue <= 1 ? masteryValue * 100 : masteryValue));
  const confidencePercent = Math.round(Math.min(100, Math.max(0, 100 - (uncertaintyValue <= 1 ? uncertaintyValue * 100 : uncertaintyValue))));

  return (
    <>
    <motion.section
      data-testid="today-decision-stage"
      data-phase={phase}
      data-geometry={subjectProfile.fieldType}
      data-confirmation-key={confirmationKey}
      data-motion-active={!reducedMotion && (phase === 'forming' || phase === 'recomposing') ? 'true' : undefined}
      aria-labelledby={`decision-${action.id}`}
      className={cn("ni-grid ni-grid--hero crivo-observatorio-decision transition-all duration-300", isMaximized && "crivo-observatorio-decision--maximized scale-[1.02] shadow-2xl z-10")}
      layout={!reducedMotion}
      initial={reducedMotion ? false : 'hidden'}
      animate="visible"
      variants={focusEnter}
    >
      <div className="ni-panel ni-decision crivo-observatorio-decision-copy">
        <p className="ni-kicker">Decisão recomendada · 01</p>
        <p className="sr-only">Hoje · decisão principal</p>
        <h2 id={`decision-${action.id}`} aria-label={action.topicName}>
          <KineticText
            as="span"
            runKey={action.id}
            text={`${action.topicName} antes da prova.`}
            className="block"
            stagger={typographyPreset.stagger}
            duration={typographyPreset.duration}
            ease={typographyPreset.ease}
          />
        </h2>
        <p>{mainReason}</p>
        <Button onClick={onStart} aria-label="Começar" className="ni-primary crivo-observatorio-cta">
          <PlayCircle className="w-4 h-4" aria-hidden="true" />
          {actionLabel}
        </Button>
        <div className="crivo-observatorio-explanation">
          <DecisionExplanation
            mainReason=""
            factors={action.factors}
            snapshot={action.snapshot}
            open={explanationOpen}
            onOpenChange={setExplanationOpen}
            onDisagree={() => setDisagreeOpen(true)}
            className="crivo-decision-explanation"
          />
        </div>
        <SubjectEvidence subject={action.subject} topic={action.topicName} />
        <div className="ni-metrics" aria-label="Sinais da decisão">
          <div className="ni-metric"><small>Domínio</small><b>{masteryPercent}%</b><i><span style={{ width: `${masteryPercent}%` }} /></i></div>
          <div className="ni-metric"><small>Confiança</small><b>{confidencePercent}%</b></div>
          <div className="ni-metric"><small>Urgência</small><b className="warn">{Math.round(reviewUrgency)}%</b></div>
          <div className="ni-metric"><small>Tempo</small><b>{action.allocatedMinutes} min</b></div>
        </div>
        <div className="sr-only">
          <DecisionSignalStrip
            mastery={masteryPercent}
            uncertainty={uncertaintyValue <= 1 ? uncertaintyValue : uncertaintyValue / 100}
            urgency={Math.round(reviewUrgency)}
            minutes={action.allocatedMinutes}
          />
        </div>
        <div className="crivo-observatorio-visual-support" aria-hidden="true">
          <CrivoCore size={190} scale="hero" decorative state={coreState} subject={action.subject} previousSubject={previousSubject} topicId={action.topicId} />
          <DecisionFactorField factors={action.factors} phase={phase} />
        </div>
        <AnimatePresence initial={false}>{showAdaptiveUpdate && <AdaptiveUpdate key={action.id} className="crivo-adaptive-update" />}</AnimatePresence>
        {disagreeOpen && (
          <DisagreeControl
            status={feedbackStatus}
            previous={previous}
            onSelect={onDisagree}
            className="crivo-disagree-control rounded-control focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background-base"
          />
        )}
      </div>

      <div className="ni-panel ni-trajectory crivo-observatorio-trajectory">
        <span className="ni-kicker">Trajetória semanal</span>
        <h3>Você está em ritmo.</h3>
        <ObservatoryTrajectoryChart />
        <p><span>Próximo bloco</span> às {formatIsoTimeInSaoPaulo(action.intervalStart)}</p>
        <ul>
          <li>Domínio do tópico <b>{masteryPercent}%</b></li>
          <li>Incerteza atual <b>{100 - confidencePercent}%</b></li>
          <li>Sessão recomendada <b>{action.allocatedMinutes} min</b></li>
        </ul>
      </div>
    </motion.section>
    <section className="ni-card-row crivo-observatorio-next-steps" aria-label="Próximos instrumentos">
      <button type="button" className="ni-panel ni-mini" onClick={onStart}>
        <span className="ni-icon-depth"><Play aria-hidden="true" /></span>
        <h3>Resolver por etapas</h3>
        <p>Prática aplicada a {action.topicName}.</p>
      </button>
      <button type="button" className="ni-panel ni-mini" onClick={onOpenQuestions ?? onStart}>
        <span className="ni-icon-depth"><Library aria-hidden="true" /></span>
        <h3>Testar representação</h3>
        <p>Instrumentos para ler {action.topicName}.</p>
      </button>
      <button type="button" className="ni-panel ni-mini" onClick={onOpenReview ?? onStart}>
        <span className="ni-icon-depth"><ArrowRight aria-hidden="true" /></span>
        <h3>Validar resultado</h3>
        <p>Proteja a próxima janela de estudo.</p>
      </button>
    </section>
    </>
  );
}
