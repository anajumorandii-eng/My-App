import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDecisionChoreography } from './useDecisionChoreography';
import type { FeedbackStatus } from '../components/DisagreeControl';

const useReducedMotionMock = vi.hoisted(() => vi.fn(() => false));

vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
  return { ...actual, useReducedMotion: useReducedMotionMock };
});

describe('useDecisionChoreography', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    useReducedMotionMock.mockReturnValue(false);
  });
  afterEach(() => vi.useRealTimers());

  it('presents a resolved decision as analyzing, converging, then ready', () => {
    const { result } = renderHook(() => useDecisionChoreography({
      actionId: 'action-1', rankingChanged: false, feedbackStatus: 'idle', explanationOpen: false,
    }));
    expect(result.current.coreState).toBe('analyzing');
    act(() => vi.advanceTimersByTime(360));
    expect(result.current.coreState).toBe('converging');
    act(() => vi.advanceTimersByTime(560));
    expect(result.current.coreState).toBe('ready');
  });

  it('stays ready without scheduling choreography when reduced motion is enabled', () => {
    useReducedMotionMock.mockReturnValue(true);
    const { result } = renderHook(() => useDecisionChoreography({
      actionId: 'action-1', rankingChanged: true, feedbackStatus: 'idle', explanationOpen: false,
    }));
    expect(result.current.coreState).toBe('ready');
    expect(vi.getTimerCount()).toBe(0);
    act(() => vi.advanceTimersByTime(1000));
    expect(result.current.coreState).toBe('ready');
  });

  it('starts a real ranking change in recalibrating and finishes ready', () => {
    const { result } = renderHook(() => useDecisionChoreography({
      actionId: 'action-2', rankingChanged: true, feedbackStatus: 'idle', explanationOpen: false,
    }));
    expect(result.current.coreState).toBe('recalibrating');
    act(() => vi.advanceTimersByTime(900));
    expect(result.current.coreState).toBe('ready');
  });

  it('cancels the prior action choreography when actionId changes', () => {
    const { result, rerender } = renderHook(
      ({ actionId }: { actionId: string }) => useDecisionChoreography({
        actionId, rankingChanged: false, feedbackStatus: 'idle', explanationOpen: false,
      }),
      { initialProps: { actionId: 'action-1' } },
    );
    act(() => vi.advanceTimersByTime(200));
    rerender({ actionId: 'action-2' });
    expect(result.current.coreState).toBe('analyzing');
    act(() => vi.advanceTimersByTime(149));
    expect(result.current.coreState).toBe('analyzing');
    act(() => vi.advanceTimersByTime(201));
    expect(result.current.coreState).toBe('converging');
    // The old action's ready callback would fire at 900ms from the first render.
    // Crossing that deadline must not force the replacement action to ready.
    act(() => vi.advanceTimersByTime(351));
    expect(result.current.coreState).toBe('converging');
    act(() => vi.advanceTimersByTime(199));
    expect(result.current.coreState).toBe('ready');
  });

  it('confirms saved feedback without pretending the ranking changed', () => {
    const { result, rerender } = renderHook(
      ({ status }: { status: FeedbackStatus }) => useDecisionChoreography({
        actionId: 'action-1', rankingChanged: false, feedbackStatus: status, explanationOpen: false,
      }),
      { initialProps: { status: 'idle' as FeedbackStatus } },
    );
    act(() => vi.runAllTimers());
    const before = result.current.confirmationKey;
    rerender({ status: 'saved' });
    expect(result.current.confirmationKey).toBe(before + 1);
    expect(result.current.coreState).toBe('ready');
  });
});
