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
import { CenaDaMateria, temCena } from '../cenas/CenaDaMateria';
import { DecisionSignalStrip } from './DecisionSignalStrip';
import { focusEnter } from '../../../design-system/motion/variants';
import { usePreviousFeedback } from '../../../hooks/usePreviousFeedback';
import { useDecisionChoreography } from '../motion/useDecisionChoreography';
import { cn } from '../../../lib/cn';

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
  /** Minutos livres na agenda de hoje. Zero quando não há janela configurada. */
  availableMinutes?: number;
  /** Quantas ações o alocador pôs no dia. */
  plannedCount?: number;
  /** Quantas ficaram na fila de espera. */
  waitingCount?: number;
}

/** "1h30", "45 min". */
function formatarMinutos(total: number) {
  const h = Math.floor(total / 60), m = total % 60;
  return h ? `${h}h${m ? String(m).padStart(2, '0') : ''}` : `${m} min`;
}

export function TodayFocus({ action, actionLabel, mainReason, onStart, showAdaptiveUpdate, previousSubject, userId, feedbackStatus, onDisagree, onOpenQuestions, onOpenReview, availableMinutes = 0, plannedCount = 0, waitingCount = 0 }: TodayFocusProps) {
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
      <div className={cn('ni-panel ni-decision crivo-observatorio-decision-copy', explanationOpen && 'crivo-observatorio-decision-copy--explaining')}>
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
        {/* Antes das métricas: no celular a cena vem logo depois dos botões. */}
        <div className={cn('crivo-observatorio-visual-support', explanationOpen && 'crivo-observatorio-visual-support--explaining', temCena(action.subject) && 'crivo-observatorio-visual-support--cena')}>
          <CenaDaMateria
            materia={action.subject}
            reserva={(
              <div className="crivo-observatorio-nucleo" aria-hidden="true">
                <CrivoCore size="fill" scale="hero" decorative state={coreState} subject={action.subject} previousSubject={previousSubject} topicId={action.topicId} />
              </div>
            )}
          />
          <DecisionFactorField factors={action.factors} phase={phase} />
        </div>
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

      {/* Este painel dizia "Você está em ritmo." sobre um gráfico desenhado à mão
          (a curva era fixa no código e o leitor de tela anunciava "cresce de 42
          para 74"), e marcava "Próximo bloco às 23:11" mesmo sem janela na
          agenda — a hora era só "agora". Repetia também domínio, incerteza e
          tempo, que o cartão ao lado já mostra. Agora só diz o que a agenda
          e o plano de hoje sabem. */}
      <div className="ni-panel ni-trajectory crivo-observatorio-trajectory">
        <span className="ni-kicker">Hoje na agenda</span>
        <h3>{availableMinutes > 0 ? `${formatarMinutos(availableMinutes)} livres hoje.` : 'Sem janela na agenda hoje.'}</h3>
        <ul>
          <li>Próximo bloco <b>{availableMinutes > 0 ? `às ${formatIsoTimeInSaoPaulo(action.intervalStart)}` : '—'}</b></li>
          <li>Ações no plano de hoje <b>{plannedCount}</b></li>
          <li>Na fila de espera <b>{waitingCount}</b></li>
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
        <h3>Treinar em questões</h3>
        <p>Banco de questões para aplicar o que estudou.</p>
      </button>
      <button type="button" className="ni-panel ni-mini" onClick={onOpenReview ?? onStart}>
        <span className="ni-icon-depth"><ArrowRight aria-hidden="true" /></span>
        <h3>Revisar o que venceu</h3>
        <p>Revisões espaçadas marcadas para hoje.</p>
      </button>
    </section>
    </>
  );
}
