/** Known screen-reader/OCR toolbar captured with the scanned textbook pages.
 * Reject the excerpt as a whole: removing toolbar words cannot repair formulas
 * or establish that the remaining OCR is faithful to the original page.
 */
export function hasCorruptedApostilaText(text: string): boolean {
  return /\bOpen\s+Save\s+Rec\s+Play\s+(?:exe\s+)?Prefs\b/i.test(text)
    || /\bDq\s+MO\s+NKrAO\b/i.test(text);
}
