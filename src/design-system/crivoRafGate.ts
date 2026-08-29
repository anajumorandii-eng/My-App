export function shouldRunLoop(reducedMotion: boolean, visibilityState: DocumentVisibilityState | 'visible' | 'hidden', hasSize: boolean): boolean {
  return !reducedMotion && visibilityState === 'visible' && hasSize;
}
