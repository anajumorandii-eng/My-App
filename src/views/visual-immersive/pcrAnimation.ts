/** Cada base termina sua aparição antes de a frente de síntese alcançar a seguinte. */
export function newBaseOpacity(extension: number, order: number, count: number): number {
  return Math.max(0, Math.min(1, extension * count - order));
}

/** Pausa manual conserva o progresso; apresentação estática mostra a fita completa. */
export function advanceSynthesis(extension: number, delta: number, paused: boolean, instant: boolean): number {
  if (instant) return 1;
  return paused ? extension : Math.min(1, extension + delta * .105);
}
