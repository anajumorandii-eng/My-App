import { useState } from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canvasContext } from '../../../testSetup';
import type { AllocatedStudyAction, StudyAction } from '../../../types';
import { SubjectAtmosphere } from './SubjectAtmosphere';
import { TodayFocus } from './TodayFocus';
import { DecisionSequence } from './DecisionSequence';
import { DecisionFactorField } from './DecisionFactorField';

const useReducedMotionMock = vi.hoisted(() => vi.fn(() => false));

vi.mock('motion/react', async (importOriginal) => {
  const actual = await importOriginal<typeof import('motion/react')>();
  return { ...actual, useReducedMotion: useReducedMotionMock };
});

function rectangularBounds(width: number, height: number): DOMRect {
  return {
    width,
    height,
    top: 0,
    right: width,
    bottom: height,
    left: 0,
    x: 0,
    y: 0,
    toJSON: () => ({}),
  } as DOMRect;
}

const decisionAction: AllocatedStudyAction = {
  id: 'genetics',
  type: 'theory',
  topicId: 'bio-genetica',
  topicName: 'Genética Molecular',
  subject: 'Biologia',
  estimatedMinutes: 45,
  priorityScore: 100,
  reasons: ['dominio_insuficiente', 'revisao_urgente', 'proximidade_prova'],
  factors: [
    { kind: 'learning_gap', rawValue: 65, contribution: 26 },
    { kind: 'review_urgency', rawValue: 73, contribution: 21.9 },
    { kind: 'recurring_errors', rawValue: 2, contribution: 12 },
    { kind: 'energy_adjustment', rawValue: 0, contribution: 0 },
    { kind: 'exam_relevance', rawValue: 0.8, contribution: -4.93 },
  ],
  snapshot: { masteryLevel: 35, uncertainty: 0.3, calculatedAt: '2026-08-24T12:00:00.000Z' },
  intervalStart: '2026-08-24T14:40:00-03:00',
  intervalEnd: '2026-08-24T15:00:00-03:00',
  allocatedMinutes: 20,
};

const factorLabels = [
  'Lacuna de aprendizagem',
  'Urgência de revisão',
  'Erros recorrentes',
  'Ajuste de energia',
  'Relevância para a prova',
];

interface TodayFocusTestOptions {
  action?: AllocatedStudyAction;
  feedbackStatus?: 'idle' | 'saving' | 'saved' | 'error';
  onDisagree?: (reason: Parameters<NonNullable<React.ComponentProps<typeof TodayFocus>['onDisagree']>>[0]) => void;
  showAdaptiveUpdate?: boolean;
}

function renderTodayFocus({
  action = decisionAction,
  feedbackStatus = 'idle',
  onDisagree = vi.fn(),
  showAdaptiveUpdate = false,
}: TodayFocusTestOptions = {}) {
  return render(
    <TodayFocus
      action={action}
      actionLabel="Estudar teoria"
      mainReason="A lacuna de domínio tornou este tópico prioritário."
      onStart={vi.fn()}
      showAdaptiveUpdate={showAdaptiveUpdate}
      userId={undefined}
      feedbackStatus={feedbackStatus}
      onDisagree={onDisagree}
    />,
  );
}

function FeedbackTransitionHarness() {
  const [feedbackStatus, setFeedbackStatus] = useState<'idle' | 'saving' | 'saved'>('idle');
  return (
    <TodayFocus
      action={decisionAction}
      actionLabel="Estudar teoria"
      mainReason="A lacuna de domínio tornou este tópico prioritário."
      onStart={vi.fn()}
      showAdaptiveUpdate={false}
      userId={undefined}
      feedbackStatus={feedbackStatus}
      onDisagree={() => {
        setFeedbackStatus('saving');
        window.setTimeout(() => setFeedbackStatus('saved'), 0);
      }}
    />
  );
}

describe('SubjectAtmosphere', () => {
  beforeEach(() => {
    document.documentElement.classList.remove('dark');
    useReducedMotionMock.mockReturnValue(false);
  });

  afterEach(() => {
    document.documentElement.classList.remove('dark');
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(canvasContext);
  });

  it('keeps the field inside an isolated visible layer', () => {
    render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);
    const atmosphere = screen.getByTestId('subject-atmosphere');
    expect(atmosphere).toHaveAttribute('data-subject', 'fisica');
    expect(atmosphere).toHaveClass('isolate');
    expect(atmosphere.querySelector('canvas')).toHaveClass('z-0');
    expect(atmosphere).toHaveStyle({ backgroundColor: 'var(--subject-bg)' });
  });

  it.each([
    ['is unavailable', undefined],
    ['throws during construction', vi.fn(function () { throw new Error('observer failed'); })],
  ])('keeps initial field measurement and CSS fallback when ResizeObserver %s', async (_label, observer) => {
    vi.stubGlobal('ResizeObserver', observer);
    vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect').mockReturnValue(rectangularBounds(320, 180));

    render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);

    const atmosphere = screen.getByTestId('subject-atmosphere');
    await waitFor(() => expect(atmosphere.querySelector('canvas')).toHaveAttribute('width', '320'));
    expect(screen.getByTestId('subject-atmosphere-fallback')).toHaveStyle({ background: 'var(--subject-field-css)' });
    vi.unstubAllGlobals();
  });

  it('keeps both theme translations local to the active subject', () => {
    render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);

    const style = screen.getByTestId('subject-atmosphere').style;
    expect(style.getPropertyValue('--subject-light-bg')).toBe('#FBF8F2');
    expect(style.getPropertyValue('--subject-dark-bg')).toBe('#0A0E15');
    expect(style.getPropertyValue('--subject-light-field-css')).not.toBe('');
    expect(style.getPropertyValue('--subject-dark-field-css')).not.toBe('');
  });

  it('redraws the resolved final field after theme and subject changes when motion is reduced', async () => {
    useReducedMotionMock.mockReturnValue(true);
    const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const node = element as HTMLElement;
      const theme = document.documentElement.classList.contains('dark') ? 'dark' : 'light';
      return {
        getPropertyValue: (property: string) => {
          const token = property.replace('--subject-', '');
          return node.style.getPropertyValue(`--subject-${theme}-${token}`);
        },
      } as CSSStyleDeclaration;
    });
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
    const clearRect = vi.mocked(canvasContext.clearRect);
    const initialDrawCount = clearRect.mock.calls.length;
    const { rerender } = render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);
    const atmosphere = screen.getByTestId('subject-atmosphere');

    await waitFor(() => expect(clearRect.mock.calls.length).toBeGreaterThan(initialDrawCount));
    const lightDrawCount = clearRect.mock.calls.length;
    document.documentElement.classList.add('dark');
    await waitFor(() => expect(clearRect.mock.calls.length).toBeGreaterThan(lightDrawCount));

    const darkDrawCount = clearRect.mock.calls.length;
    rerender(<SubjectAtmosphere subject="Biologia"><p>Decisão</p></SubjectAtmosphere>);
    await waitFor(() => expect(clearRect.mock.calls.length).toBeGreaterThan(darkDrawCount));

    expect(atmosphere.style.getPropertyValue('--subject-dark-bg')).toBe('#0A150F');
    expect(getComputedStyleSpy).toHaveBeenCalledWith(atmosphere);
    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
    getComputedStyleSpy.mockRestore();
    requestAnimationFrameSpy.mockRestore();
  });

  it('keeps the reduced-motion final frame after the canvas backing store resizes', async () => {
    useReducedMotionMock.mockReturnValue(true);
    let width = 120;
    let height = 80;
    let resizeCallback: ResizeObserverCallback | undefined;
    class ControlledResizeObserver implements ResizeObserver {
      constructor(callback: ResizeObserverCallback) {
        resizeCallback = callback;
      }
      observe() {}
      unobserve() {}
      disconnect() {}
    }
    vi.stubGlobal('ResizeObserver', ControlledResizeObserver);
    const boundsSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockImplementation(() => rectangularBounds(width, height));
    const getComputedStyleSpy = vi.spyOn(window, 'getComputedStyle').mockImplementation((element) => {
      const node = element as HTMLElement;
      return {
        getPropertyValue: (property: string) => {
          const token = property.replace('--subject-', '');
          return node.style.getPropertyValue(`--subject-light-${token}`);
        },
      } as CSSStyleDeclaration;
    });
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame');
    const clearRect = vi.mocked(canvasContext.clearRect);
    const initialDrawCount = clearRect.mock.calls.length;
    render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);

    await waitFor(() => expect(clearRect.mock.calls.length).toBeGreaterThan(initialDrawCount));
    const firstDrawCount = clearRect.mock.calls.length;
    const atmosphere = screen.getByTestId('subject-atmosphere');
    width = 240;
    height = 160;
    act(() => resizeCallback?.(
      [{ target: atmosphere, contentRect: rectangularBounds(width, height) } as unknown as ResizeObserverEntry],
      {} as ResizeObserver,
    ));

    expect(atmosphere.querySelector('canvas')).toHaveAttribute('width', '240');
    expect(clearRect.mock.calls.length).toBeGreaterThan(firstDrawCount);
    expect(requestAnimationFrameSpy).not.toHaveBeenCalled();
    boundsSpy.mockRestore();
    getComputedStyleSpy.mockRestore();
    requestAnimationFrameSpy.mockRestore();
    vi.unstubAllGlobals();
  });

  it('keeps its CSS fallback and decision controls when Canvas 2D is unavailable', async () => {
    useReducedMotionMock.mockReturnValue(true);
    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(null);

    render(
      <SubjectAtmosphere subject="Biologia">
        <TodayFocus
          action={decisionAction}
          actionLabel="Estudar teoria"
          mainReason="A lacuna de domínio tornou este tópico prioritário."
          onStart={vi.fn()}
          showAdaptiveUpdate={false}
          userId={undefined}
          feedbackStatus="idle"
          onDisagree={vi.fn()}
        />
      </SubjectAtmosphere>,
    );

    const atmosphere = screen.getByTestId('subject-atmosphere');
    await waitFor(() => expect(atmosphere).toHaveAttribute('data-canvas-fallback', 'true'));
    expect(atmosphere.querySelector('canvas')).not.toBeInTheDocument();
    expect(within(atmosphere).getByTestId('subject-atmosphere-fallback')).toHaveStyle({
      background: 'var(--subject-field-css)',
    });
    expect(screen.getByRole('heading', { name: 'Genética Molecular' })).toBeVisible();
    expect(screen.getByRole('button', { name: 'Começar' })).toBeVisible();

    vi.mocked(HTMLCanvasElement.prototype.getContext).mockReturnValue(canvasContext);
  });

  it('cancels queued visual frames when Hoje unmounts', () => {
    const queuedFrames = new Map<number, FrameRequestCallback>();
    let nextFrame = 1;
    const requestAnimationFrameSpy = vi.spyOn(window, 'requestAnimationFrame').mockImplementation((callback) => {
      const frame = nextFrame++;
      queuedFrames.set(frame, callback);
      return frame;
    });
    const cancelAnimationFrameSpy = vi.spyOn(window, 'cancelAnimationFrame').mockImplementation((frame) => {
      queuedFrames.delete(frame);
    });
    const boundsSpy = vi.spyOn(HTMLElement.prototype, 'getBoundingClientRect')
      .mockReturnValue(rectangularBounds(320, 240));
    const { unmount } = render(
      <SubjectAtmosphere subject="Biologia">
        <TodayFocus
          action={decisionAction}
          actionLabel="Estudar teoria"
          mainReason="A lacuna de domínio tornou este tópico prioritário."
          onStart={vi.fn()}
          showAdaptiveUpdate={false}
          userId={undefined}
          feedbackStatus="idle"
          onDisagree={vi.fn()}
        />
      </SubjectAtmosphere>,
    );

    expect(queuedFrames.size).toBeGreaterThan(0);
    const staleCallbacks = [...queuedFrames.values()];
    const drawCount = vi.mocked(canvasContext.clearRect).mock.calls.length;
    const requestCount = requestAnimationFrameSpy.mock.calls.length;
    unmount();

    expect(cancelAnimationFrameSpy).toHaveBeenCalled();
    expect(queuedFrames.size).toBe(0);
    for (const callback of staleCallbacks) callback(performance.now());
    expect(canvasContext.clearRect).toHaveBeenCalledTimes(drawCount);
    expect(requestAnimationFrameSpy).toHaveBeenCalledTimes(requestCount);
    expect(queuedFrames.size).toBe(0);

    boundsSpy.mockRestore();
    cancelAnimationFrameSpy.mockRestore();
    requestAnimationFrameSpy.mockRestore();
  });
});

describe('DecisionFactorField motion activity', () => {
  beforeEach(() => useReducedMotionMock.mockReturnValue(false));

  it('keeps motion activity marked through factor exit completion', async () => {
    const { rerender } = render(<DecisionFactorField factors={decisionAction.factors} phase="ready" />);

    rerender(<DecisionFactorField factors={decisionAction.factors} phase="decomposed" />);
    const field = screen.getAllByTestId('decision-factor')[0].parentElement!;
    expect(field).toHaveAttribute('data-motion-active', 'true');
    await waitFor(() => expect(field).not.toHaveAttribute('data-motion-active'));

    rerender(<DecisionFactorField factors={decisionAction.factors} phase="ready" />);
    expect(field).toHaveAttribute('data-motion-active', 'true');
    await waitFor(() => expect(field).not.toHaveAttribute('data-motion-active'));
  });

  it('never marks factor motion when reduced motion is requested', () => {
    useReducedMotionMock.mockReturnValue(true);
    render(<DecisionFactorField factors={decisionAction.factors} phase="decomposed" />);

    const field = screen.getAllByTestId('decision-factor')[0].parentElement!;
    expect(field).not.toHaveAttribute('data-motion-active');
  });
});

describe('DecisionSequence motion and disclosure', () => {
  const labels = {
    review: 'Revisar para consolidar',
    practice: 'Praticar sem apoio',
    theory: 'Reconstruir a base',
    error_analysis: 'Analisar erros recorrentes',
  } as const;

  const waitingAction: StudyAction = { ...decisionAction, id: 'waiting', topicId: 'waiting-topic', topicName: 'Fisiologia Renal' };

  it('renders one ranked motion container with stable action metadata and a closed waiting disclosure', () => {
    useReducedMotionMock.mockReturnValue(false);
    render(<DecisionSequence next={[decisionAction]} waiting={[waitingAction]} actionLabels={labels} onStart={vi.fn()} />);

    const sequence = screen.getByRole('region', { name: 'Sequência de decisão' });
    expect(sequence.querySelectorAll('ol')).toHaveLength(2);
    expect(sequence.querySelector('ol')?.querySelector('[data-action-id="genetics"]')).toBeInTheDocument();
    expect(sequence.querySelector('[data-action-id="waiting"]')).not.toBeInTheDocument();
    const waitingButton = within(screen.getByRole('group', { name: 'Pode esperar' })).getByRole('button');
    expect(waitingButton).toHaveAttribute('aria-expanded', 'false');
    expect(waitingButton).toHaveAttribute('aria-controls', 'decision-sequence-waiting-list');
    expect(waitingButton).toHaveClass('min-h-11');
  });

  it('renders the final frame without layout animation when reduced motion is requested', () => {
    useReducedMotionMock.mockReturnValue(true);
    render(<DecisionSequence next={[decisionAction]} waiting={[]} actionLabels={labels} onStart={vi.fn()} />);

    const actionItem = document.querySelector('[data-action-id="genetics"]');
    expect(actionItem).not.toBeNull();
    expect(actionItem).not.toHaveStyle({ transform: expect.any(String) });
    expect(actionItem).not.toHaveStyle({ opacity: '0' });
  });
});

describe('TodayFocus explanation and feedback', () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    useReducedMotionMock.mockReturnValue(false);
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => {
    scrollToSpy.mockRestore();
    vi.useRealTimers();
  });

  it('decomposes the decision into every real factor when Por que isso opens', async () => {
    const user = userEvent.setup();
    renderTodayFocus();
    const trigger = screen.getByRole('button', { name: 'Por que isso?' });

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    await user.click(trigger);

    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('today-decision-stage')).toHaveAttribute('data-phase', 'decomposed');
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(panel).not.toBeNull();
    for (const label of factorLabels) expect(panel).toHaveTextContent(label);

    const visualFactors = screen.getAllByTestId('decision-factor');
    expect(visualFactors).toHaveLength(5);
    expect(visualFactors.map((node) => node.textContent)).toEqual(expect.arrayContaining([
      expect.stringContaining('+26.00'),
      expect.stringContaining('0.00'),
      expect.stringContaining('-4.93'),
    ]));
  });

  it('offers Por que isso and Discordo together before the explanation opens with 44px targets', async () => {
    const user = userEvent.setup();
    renderTodayFocus();
    const explain = screen.getByRole('button', { name: 'Por que isso?' });
    const disagree = screen.getByRole('button', { name: 'Discordo' });
    expect(explain).toHaveAttribute('aria-expanded', 'false');
    expect(explain).toHaveClass('min-h-11');
    expect(disagree).toHaveClass('min-h-11');

    await user.click(disagree);
    expect(screen.getByRole('group', { name: 'Discordância da recomendação' })).toBeVisible();
    for (const reason of screen.getAllByRole('button').filter((button) => button.closest('[aria-label="Motivo da discordância"]'))) {
      expect(reason).toHaveClass('min-h-11');
    }
  });

  it('opens the controlled explanation from the keyboard', async () => {
    const user = userEvent.setup();
    renderTodayFocus();
    const trigger = screen.getByRole('button', { name: 'Por que isso?' });

    trigger.focus();
    await user.keyboard('{Enter}');

    expect(trigger).toHaveFocus();
    expect(trigger).toHaveAttribute('aria-expanded', 'true');
    expect(screen.getByTestId('today-decision-stage')).toHaveAttribute('data-phase', 'decomposed');
  });

  it('completes Por que isso → Discordo → confirmation using only the keyboard', async () => {
    const user = userEvent.setup();
    render(<FeedbackTransitionHarness />);

    await user.tab();
    expect(screen.getByRole('button', { name: 'Começar' })).toHaveFocus();
    await user.tab();
    const explanation = screen.getByRole('button', { name: 'Por que isso?' });
    expect(explanation).toHaveFocus();
    expect(explanation).toHaveAttribute('aria-expanded', 'false');

    await user.keyboard('{Enter}');
    expect(explanation).toHaveFocus();
    expect(explanation).toHaveAttribute('aria-expanded', 'true');
    await user.tab();
    const disagree = screen.getByRole('button', { name: 'Discordo' });
    expect(disagree).toHaveFocus();
    await user.keyboard('{Enter}');

    await user.tab();
    await user.tab();
    const reason = screen.getByRole('button', { name: 'Já estudei isso' });
    expect(reason).toHaveFocus();
    await user.keyboard('{Enter}');

    const confirmation = await screen.findByRole('status');
    const feedbackGroup = screen.getByRole('group', { name: 'Discordância da recomendação' });
    expect(confirmation).toHaveTextContent('Registrado');
    expect(feedbackGroup).toHaveFocus();
    expect(feedbackGroup).toHaveClass('focus-visible:ring-2');
    expect(document.body).not.toHaveFocus();
  });

  it('marks only the non-final visual phase as motion-active', () => {
    vi.useFakeTimers();
    renderTodayFocus();
    const stage = screen.getByTestId('today-decision-stage');

    expect(stage).toHaveAttribute('data-motion-active', 'true');
    act(() => vi.advanceTimersByTime(900));
    expect(stage).toHaveAttribute('data-phase', 'ready');
    expect(stage).not.toHaveAttribute('data-motion-active');
    expect(stage.querySelector('[data-motion-active="true"]')).toBeNull();

    vi.useRealTimers();
  });

  it('announces saved disagreement without claiming the ranking changed', async () => {
    const user = userEvent.setup();
    renderTodayFocus({ feedbackStatus: 'saved' });

    await user.click(screen.getByRole('button', { name: 'Por que isso?' }));
    await user.click(screen.getByRole('button', { name: 'Discordo' }));

    expect(screen.getByRole('status')).toHaveTextContent('Registrado');
    expect(screen.getByRole('status')).toHaveTextContent('o plano não muda sozinho');
  });

  it('keeps one live-region mount and a stable focus target through idle, saving, and saved', async () => {
    const user = userEvent.setup();
    const { container } = render(<FeedbackTransitionHarness />);
    const mountedStatuses: Element[] = [];
    const observer = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (!(node instanceof Element)) continue;
          if (node.getAttribute('role') === 'status') mountedStatuses.push(node);
          mountedStatuses.push(...node.querySelectorAll('[role="status"]'));
        }
      }
    });
    observer.observe(container, { childList: true, subtree: true });

    await user.click(screen.getByRole('button', { name: 'Por que isso?' }));
    await user.click(screen.getByRole('button', { name: 'Discordo' }));
    await user.click(screen.getByRole('button', { name: 'Já estudei isso' }));

    const status = await screen.findByRole('status');
    await waitFor(() => expect(screen.getByTestId('today-decision-stage')).toHaveAttribute('data-confirmation-key', '1'));
    observer.disconnect();

    expect(screen.getAllByRole('status')).toHaveLength(1);
    expect(mountedStatuses).toHaveLength(1);
    expect(mountedStatuses[0]).toBe(status);
    expect(screen.getByRole('group', { name: 'Discordância da recomendação' })).toHaveFocus();
    expect(document.body).not.toHaveFocus();
  });

  it('shows zero and small negative contributions verbatim in the accessible panel', async () => {
    const user = userEvent.setup();
    const smallContributionAction: AllocatedStudyAction = {
      ...decisionAction,
      factors: decisionAction.factors.map((factor) => (
        factor.kind === 'exam_relevance' ? { ...factor, contribution: -0.01 } : factor
      )),
    };
    renderTodayFocus({ action: smallContributionAction });

    const trigger = screen.getByRole('button', { name: 'Por que isso?' });
    await user.click(trigger);
    const panel = document.getElementById(trigger.getAttribute('aria-controls')!);

    expect(within(panel!).getByText('Ajuste de energia').parentElement).toHaveTextContent('0.00');
    expect(within(panel!).getByText('Relevância para a prova').parentElement).toHaveTextContent('-0.01');
    expect(panel).not.toHaveTextContent('Sem efeito hoje');
  });

  it('returns focus to Por que isso when the explanation closes', async () => {
    const user = userEvent.setup();
    renderTodayFocus();
    const trigger = screen.getByRole('button', { name: 'Por que isso?' });

    await user.click(trigger);
    await user.click(screen.getByRole('button', { name: 'Entendi' }));

    expect(trigger).toHaveAttribute('aria-expanded', 'false');
    expect(trigger).toHaveFocus();
    expect(document.body).not.toHaveFocus();
  });

  it('renders real ranking and saved statuses in their final reduced-motion frame', async () => {
    useReducedMotionMock.mockReturnValue(true);
    const user = userEvent.setup();
    const { rerender } = renderTodayFocus({ showAdaptiveUpdate: true });
    const rankingStatus = screen.getByRole('status');
    expect(rankingStatus).toHaveTextContent('alterou a ordem recomendada');
    expect(rankingStatus).not.toHaveStyle({ opacity: '0' });
    expect(rankingStatus).not.toHaveStyle({ transform: expect.any(String) });

    rerender(
      <TodayFocus
        action={decisionAction}
        actionLabel="Estudar teoria"
        mainReason="A lacuna de domínio tornou este tópico prioritário."
        onStart={vi.fn()}
        showAdaptiveUpdate={false}
        userId={undefined}
        feedbackStatus="saved"
        onDisagree={vi.fn()}
      />,
    );
    await user.click(screen.getByRole('button', { name: 'Por que isso?' }));
    await user.click(screen.getByRole('button', { name: 'Discordo' }));
    const savedStatus = screen.getByRole('status');
    expect(savedStatus).toHaveTextContent('Registrado');
    expect(savedStatus).not.toHaveStyle({ opacity: '0' });
    expect(savedStatus).not.toHaveStyle({ transform: expect.any(String) });
  });

  it('keeps disclosed evidence visible without initial transforms when motion is reduced', async () => {
    useReducedMotionMock.mockReturnValue(true);
    const user = userEvent.setup();
    renderTodayFocus();

    const trigger = screen.getByRole('button', { name: 'Por que isso?' });
    await user.click(trigger);

    const panel = document.getElementById(trigger.getAttribute('aria-controls')!);
    expect(panel).not.toBeNull();
    for (const label of factorLabels) expect(panel).toHaveTextContent(label);
    expect(panel).not.toHaveStyle({ opacity: '0' });
    expect(panel).not.toHaveStyle({ transform: expect.any(String) });
    for (const node of screen.getAllByTestId('decision-factor')) {
      expect(node).not.toHaveStyle({ opacity: '0' });
      expect(node).not.toHaveStyle({ transform: expect.any(String) });
    }
    expect(within(panel!).getByText(/Domínio estimado no momento do cálculo/)).toBeVisible();
  });

  it('renders DecisionFactorField safely without errors when factors is null or undefined in decomposed phase', () => {
    expect(() => {
      render(<DecisionFactorField factors={null as any} phase="decomposed" />);
    }).not.toThrow();
    expect(() => {
      render(<DecisionFactorField factors={undefined as any} phase="decomposed" />);
    }).not.toThrow();
  });
});
