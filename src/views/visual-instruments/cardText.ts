/**
 * Primeira frase do excerto, com teto de 180 caracteres, para o cartão do
 * par. Os instrumentos de Geografia e História passavam o excerto inteiro, e
 * o cartão chegava a ~1.400 px de altura (auditoria de 26/09).
 */
export function short(text?: string) {
  const sentence = text?.trim().split(/(?<=[.!?])\s/)[0] ?? '';
  return sentence.length > 180 ? `${sentence.slice(0, 176)}…` : sentence;
}

/**
 * Quebra a frase de relação em linhas de até `max` caracteres. Ela era
 * desenhada numa linha só, centrada numa cena de 320 de largura, e saía
 * cortada dos dois lados em quase todos os capítulos.
 */
export function wrapLines(text: string, max = 44): string[] {
  const lines: string[] = [];
  for (const word of text.split(/\s+/)) {
    const last = lines[lines.length - 1];
    if (last !== undefined && `${last} ${word}`.length <= max) lines[lines.length - 1] = `${last} ${word}`;
    else lines.push(word);
  }
  return lines;
}
