import { timingSafeEqual } from 'node:crypto';

export function isValidSharedSecret(provided: unknown, expected: string): boolean {
  if (typeof provided !== 'string') return false;
  const actualBytes = Buffer.from(provided);
  const expectedBytes = Buffer.from(expected);
  // Headers can have the same character count but different UTF-8 byte lengths.
  return actualBytes.length === expectedBytes.length && timingSafeEqual(actualBytes, expectedBytes);
}
