export const PODCAST_VOICE_OPTIONS = [
  { value: 'Charon', label: 'Charon · informativa' },
  { value: 'Kore', label: 'Kore · firme' },
  { value: 'Aoede', label: 'Aoede · leve' },
  { value: 'Puck', label: 'Puck · animada' },
] as const;
export const PODCAST_SELECTED_VOICE_IDS = [
  'pt-BR-Chirp3-HD-Achernar', 'pt-BR-Chirp3-HD-Enceladus',
  'pt-BR-Chirp3-HD-Aoede', 'pt-BR-Chirp3-HD-Zubenelgenubi',
  'pt-BR-Wavenet-D', 'pt-BR-Chirp3-HD-Algenib',
] as const;

export function selectedPodcastVoices(voices: PodcastVoiceOption[]): PodcastVoiceOption[] {
  return PODCAST_SELECTED_VOICE_IDS.flatMap(id => {
    const voice = voices.find(option => option.value === id);
    return voice ? [voice] : [];
  });
}
export const PODCAST_FORMATS = { conversa: 'Conversa e descobertas', aula: 'Aula explicada', revisao: 'Revisão para prova', perguntas: 'Perguntas e respostas' };
export const PODCAST_LEVELS = { iniciante: 'Explique do zero', intermediario: 'Já conheço o básico', avancado: 'Quero aprofundar' };
export const PODCAST_PACES = { tranquilo: 'Tranquilo, com pausas', natural: 'Natural', dinamico: 'Dinâmico' };
export const PODCAST_TONES = { acolhedor: 'Acolhedor', objetivo: 'Direto e objetivo', descontraido: 'Descontraído' };
export const PODCAST_HOST_STYLES = { professor: 'Explica e conecta ideias', curioso: 'Pergunta e pede exemplos', analitico: 'Analisa e aprofunda' };
export interface PodcastSettings {
  speakers: 1 | 2;
  durationMinutes: number;
  format: keyof typeof PODCAST_FORMATS;
  level: keyof typeof PODCAST_LEVELS;
  pace: keyof typeof PODCAST_PACES;
  tone: keyof typeof PODCAST_TONES;
  hostStyle: keyof typeof PODCAST_HOST_STYLES;
  cohostStyle: keyof typeof PODCAST_HOST_STYLES;
  voiceName: string;
  secondVoice: string;
  exam: string;
}
export const DEFAULT_PODCAST_SETTINGS: PodcastSettings = {
  speakers: 2, durationMinutes: 5, format: 'conversa', level: 'iniciante', pace: 'natural',
  tone: 'acolhedor', hostStyle: 'professor', cohostStyle: 'curioso', voiceName: 'Achernar', secondVoice: 'Enceladus', exam: 'Geral',
};
export interface PodcastSpeechOptions {
  speakers: 1 | 2;
  secondVoice: string;
  pace: keyof typeof PODCAST_PACES;
  tone: keyof typeof PODCAST_TONES;
}

export interface PodcastVoiceOption { value: string; label: string; gender?: string; }
export function resolvePodcastVoice(value: string, voices: PodcastVoiceOption[], fallback = 'Achernar'): string {
  const shortName = /^pt-BR-Chirp3-HD-([A-Za-z]+)$/.exec(value)?.[1];
  return voices.find(voice => voice.value === value)?.value ?? voices.find(voice => voice.value === shortName)?.value ?? voices.find(voice => voice.value.endsWith(`Chirp3-HD-${value}`))?.value ?? voices.find(voice => voice.value === fallback || voice.value.endsWith(`Chirp3-HD-${fallback}`))?.value ?? voices[0]?.value ?? value;
}

export function resolvePodcastVoices(voiceName: string, secondVoice: string, voices: PodcastVoiceOption[]): { voiceName: string; secondVoice: string } {
  const resolved = { voiceName: resolvePodcastVoice(voiceName, voices), secondVoice: resolvePodcastVoice(secondVoice, voices, 'Enceladus') };
  const available = (value: string) => voices.some(voice => voice.value === value || voice.value === /^pt-BR-Chirp3-HD-([A-Za-z]+)$/.exec(value)?.[1] || voice.value.endsWith(`Chirp3-HD-${value}`));
  if (resolved.voiceName === resolved.secondVoice) {
    // Ao remover uma voz antiga, preserve a participante que ainda existe e
    // adapte a outra sem transformar o diálogo em duas vozes iguais.
    const alternative = voices.find(voice => voice.value !== resolved.voiceName)?.value;
    if (alternative && !available(secondVoice)) resolved.secondVoice = alternative;
    else if (alternative && !available(voiceName)) resolved.voiceName = alternative;
  }
  return resolved;
}
