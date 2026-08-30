import { act, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { useDecisionChoreography } from './useDecisionChoreography';
import type { FeedbackStatus } from '../components/DisagreeControl';

vi.mock('motion/react', async () => {
  const actual = await vi.importActual<typeof import('motion/react')>('motion/react');
  return { ...actual, useReducedMotion: vi.fn(() => false) };
});

describe('useDecisionChoreography', () => {
  beforeEach(() => vi.useFakeTimers());
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
