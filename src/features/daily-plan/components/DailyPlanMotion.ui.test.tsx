import { useState } from 'react';
import { act, render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { canvasContext } from '../../../testSetup';
import type { AllocatedStudyAction } from '../../../types';
import { SubjectAtmosphere } from './SubjectAtmosphere';
import { TodayFocus } from './TodayFocus';

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

  afterEach(() => document.documentElement.classList.remove('dark'));

  it('keeps the field inside an isolated visible layer', () => {
    render(<SubjectAtmosphere subject="Física"><p>Decisão</p></SubjectAtmosphere>);
    const atmosphere = screen.getByTestId('subject-atmosphere');
    expect(atmosphere).toHaveAttribute('data-subject', 'fisica');
    expect(atmosphere).toHaveClass('isolate');
    expect(atmosphere.querySelector('canvas')).toHaveClass('z-0');
    expect(atmosphere).toHaveStyle({ backgroundColor: 'var(--subject-bg)' });
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
});

describe('TodayFocus explanation and feedback', () => {
  let scrollToSpy: ReturnType<typeof vi.spyOn>;

  beforeEach(() => {
    useReducedMotionMock.mockReturnValue(false);
    scrollToSpy = vi.spyOn(window, 'scrollTo').mockImplementation(() => {});
  });

  afterEach(() => scrollToSpy.mockRestore());

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
});
