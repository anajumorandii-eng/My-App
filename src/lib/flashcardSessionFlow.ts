export type FlashcardRatingResult = boolean | null | void;

export async function confirmFlashcardRating(
  rate: () => FlashcardRatingResult | Promise<FlashcardRatingResult>,
): Promise<boolean> {
  try {
    return (await rate()) === true;
  } catch {
    return false;
  }
}

export function startFlashcardSessionSnapshot<T>(
  current: T[] | null,
  candidates: readonly T[],
): T[] | null {
  if (current !== null) return current;
  return candidates.length > 0 ? [...candidates] : null;
}

export type FlashcardRatingProgress = {
  advance: boolean;
  complete: boolean;
};

export function resolveFlashcardRatingProgress(
  confirmed: boolean,
  index: number,
  total: number,
): FlashcardRatingProgress {
  return {
    advance: confirmed,
    complete: confirmed && total > 0 && index === total - 1,
  };
}

export function runFlashcardCompletion(
  progress: FlashcardRatingProgress,
  completionAlreadyCalled: boolean,
  onComplete: () => void,
): boolean {
  if (!progress.complete || completionAlreadyCalled) return completionAlreadyCalled;
  onComplete();
  return true;
}

export function clearFlashcardSessionSnapshot<T>(_snapshot: T[] | null): null {
  return null;
}

export type FlashcardSessionLifecycle = {
  mounted: boolean;
  generation: number;
};

export function createFlashcardSessionLifecycle(): FlashcardSessionLifecycle {
  return { mounted: false, generation: 0 };
}

export function setupFlashcardSessionLifecycle(lifecycle: FlashcardSessionLifecycle): void {
  lifecycle.mounted = true;
}

export function cleanupFlashcardSessionLifecycle(lifecycle: FlashcardSessionLifecycle): void {
  lifecycle.mounted = false;
  lifecycle.generation += 1;
}

export function renewFlashcardSessionLifecycle(lifecycle: FlashcardSessionLifecycle): number {
  lifecycle.generation += 1;
  return lifecycle.generation;
}

export function isFlashcardSessionLifecycleCurrent(
  lifecycle: FlashcardSessionLifecycle,
  generation: number,
): boolean {
  return lifecycle.mounted && lifecycle.generation === generation;
}
