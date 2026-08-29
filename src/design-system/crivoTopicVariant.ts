/** Stable FNV-1a-derived bucket; intentionally independent from runtime randomness. */
export function topicVariantSeed(topicId: string, modulo = 5): number {
  if (!Number.isFinite(modulo) || modulo <= 1) return 0;
  let hash = 0x811c9dc5;
  for (let index = 0; index < topicId.length; index += 1) {
    hash ^= topicId.charCodeAt(index);
    hash = Math.imul(hash, 0x01000193);
  }
  return (hash >>> 0) % Math.floor(modulo);
}
