export function preparePodcastPlayback(audio: HTMLAudioElement | null): void {
  if (audio) {
    audio.muted = false;
    if (audio.volume === 0) audio.volume = 1;
  }
  // A sessão de mídia mantém podcasts na categoria de reprodução no Safari.
  // Navegadores sem essa API continuam usando o elemento de áudio nativo.
  try {
    const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
    if (session) session.type = 'playback';
  } catch {
    // Uma política do navegador pode recusar a sessão sem impedir o play nativo.
  }
}
