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
