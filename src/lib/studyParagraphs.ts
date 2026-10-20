// Explicit discourse transitions mark a new idea. No character/word thresholds
// and no sentence rewriting: quotations, references and formulas stay intact.
export function studyParagraphs(text: string): string[] {
  return text.split(/\r?\n\s*\r?\n|(?<=[.!?])\s+(?=(?:Por outro lado|Em contrapartida|Além disso|No entanto|Nesse contexto|Como consequência|Por fim|Em síntese)\b)/u)
    .filter(part => part.trim());
}
