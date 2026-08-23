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
