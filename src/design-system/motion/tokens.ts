// Durations in seconds (motion/react's native unit).
export const MOTION_DURATION = {
  micro: 0.16, // hover/press feedback, spotlight follow
  component: 0.22, // a card/row entering or updating
  panel: 0.28, // disclosure panels, the nav rail expanding
  entrance: 0.5, // whole-screen/hero entrance, played once per context
  core: 0.7, // Núcleo do Crivo state-to-state transition
  subjectTween: 0.9, // subject-level metamorphosis and atmosphere transition
} as const;

// A single standard ease for interface feedback — deliberately no
// spring/bounce. A slightly more emphasized curve is reserved for the rare
// whole-screen entrance and the Núcleo's state changes, so those two read as
// more considered than a button hover without the app feeling springy.
export const MOTION_EASE = [0.4, 0, 0.2, 1] as const;
export const MOTION_EASE_EMPHASIZED = [0.16, 1, 0.3, 1] as const;

export const MOTION_STAGGER = {
  list: 0.045, // secondary-action rows entering in sequence
  letters: 0.018, // kinetic-type convergence, per character
} as const;

// Perspective/depth for the CSS-3D Núcleo do Crivo — one shared scale so a
// future second 3D surface doesn't invent its own numbers.
export const MOTION_DEPTH = {
  perspective: 900, // px, on the containing element
  ringOffset: 26, // px, translateZ between the core's stacked rings
} as const;

/**
 * Motion matrix — the "system before scattered animations" the visual
 * direction brief asks for. Every animated moment in the app should trace to
 * one row here; a moment that doesn't fit any row is a sign to add a row
 * (and think about why), not to invent a one-off value in a component.
 */
export const MOTION_MATRIX = [
  {
    component: 'TodayFocus (hero card)',
    trigger: 'Mount / navigating to Hoje',
    purpose: 'Introduce the day\'s single recommendation without competing with the Núcleo',
    duration: MOTION_DURATION.entrance,
    easing: 'MOTION_EASE_EMPHASIZED',
    property: 'opacity, transform: translateY',
    reducedMotion: 'Renders in final state immediately, no transform',
  },
  {
    component: 'Núcleo do Crivo (CrivoCore)',
    trigger: 'Recommendation state change: listening → analyzing → converging → ready / recalibrando',
    purpose: 'Make the engine\'s work visible as it happens — the one protagonist effect on Hoje',
    duration: MOTION_DURATION.core,
    easing: 'MOTION_EASE_EMPHASIZED',
    property: 'transform: rotateX/rotateY/translateZ/scale, opacity',
    reducedMotion: 'Cross-fades directly between each state\'s static frame, no rotation',
  },
  {
    component: 'Metamorfose de CrivoCore',
    trigger: 'Mudança da matéria recomendada',
    purpose: 'Transformar o Núcleo junto com a mudança de matéria, preservando a sensação de continuidade da decisão',
    duration: MOTION_DURATION.subjectTween,
    easing: 'MOTION_EASE_EMPHASIZED',
    property: 'transform: rotateX/rotateY/translateZ/scale, opacity, color',
    reducedMotion: 'Aplica diretamente o frame final da nova matéria, sem transformação',
  },
  {
    component: 'SubjectAtmosphere',
    trigger: 'Mudança da matéria recomendada',
    purpose: 'Transicionar a atmosfera cromática da matéria sem interromper a leitura do plano',
    duration: MOTION_DURATION.subjectTween,
    easing: 'MOTION_EASE',
    property: 'background, border-color, box-shadow, color',
    reducedMotion: 'Aplica diretamente as cores finais da nova matéria',
  },
  {
    component: 'KineticText (topic name)',
    trigger: 'First mount of a new primary topic id (not on every re-render/re-focus)',
    purpose: 'Mark that a *new* decision just arrived, once, without ever blocking reading',
    duration: MOTION_DURATION.component,
    easing: 'MOTION_EASE',
    property: 'opacity, transform: translateY (per character, staggered)',
    reducedMotion: 'Renders the final text instantly',
  },
  {
    component: 'DecisionExplanation panel ("Por que isso?")',
    trigger: 'Toggle open/closed',
    purpose: 'Progressive disclosure of the waterfall factors',
    duration: MOTION_DURATION.panel,
    easing: 'MOTION_EASE',
    property: 'height, opacity, clip-path (mask reveal)',
    reducedMotion: 'Height/opacity snap to the open/closed value, no clip-path animation',
  },
  {
    component: 'AdaptiveUpdate banner',
    trigger: 'Ranking changed since last visit',
    purpose: 'Announce a real day-over-day change, not a static banner',
    duration: MOTION_DURATION.component,
    easing: 'MOTION_EASE',
    property: 'opacity, transform: translateY',
    reducedMotion: 'Renders in final state immediately',
  },
  {
    component: 'SecondaryActionList rows',
    trigger: 'Mount',
    purpose: 'Sequence the "depois disso" / "pode esperar" rows so they read as ranked, not stacked',
    duration: MOTION_DURATION.micro,
    easing: 'MOTION_EASE',
    property: 'opacity, transform: translateY',
    reducedMotion: 'Renders in final state immediately, no stagger',
  },
  {
    component: 'Nav rail (Layout sidebar)',
    trigger: 'Compact/expand toggle',
    purpose: 'Let the rail reclaim width without disorienting a recurring user',
    duration: MOTION_DURATION.panel,
    easing: 'MOTION_EASE',
    property: 'width, opacity (labels)',
    reducedMotion: 'Width/opacity snap to the target value',
  },
  {
    component: 'Route transition (Layout <Outlet />)',
    trigger: 'Pathname change',
    purpose: 'Acknowledge a navigation happened without competing with any screen\'s own entrance motion',
    duration: MOTION_DURATION.micro,
    easing: 'MOTION_EASE',
    property: 'opacity',
    reducedMotion: 'No transition — new route renders immediately',
  },
  {
    component: 'Spotlight hover (nav items, primary button, interactive cards)',
    trigger: 'Pointer move within the element',
    purpose: 'Mark what is explorable, locally — never a page-wide cursor glow',
    duration: MOTION_DURATION.micro,
    easing: 'MOTION_EASE',
    property: 'background-position via CSS custom properties (--spotlight-x/-y), opacity',
    reducedMotion: 'Disabled — hover state falls back to the plain background-color change',
  },
  {
    component: 'Confirmation (Discordo salvo, etc.)',
    trigger: 'Action succeeds',
    purpose: 'Confirm without a full re-render/jump',
    duration: MOTION_DURATION.micro,
    easing: 'MOTION_EASE',
    property: 'opacity, transform: scale',
    reducedMotion: 'Renders in final state immediately',
  },
] as const;
