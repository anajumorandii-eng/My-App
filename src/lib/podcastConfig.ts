export const PODCAST_VOICE_OPTIONS = [
  { value: 'Charon', label: 'Charon · informativa' },
  { value: 'Kore', label: 'Kore · firme' },
  { value: 'Aoede', label: 'Aoede · leve' },
  { value: 'Puck', label: 'Puck · animada' },
] as const;
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
  tone: 'acolhedor', hostStyle: 'professor', cohostStyle: 'curioso', voiceName: 'Kore', secondVoice: 'Puck', exam: 'Geral',
};
export interface PodcastSpeechOptions {
  speakers: 1 | 2;
  secondVoice: string;
  pace: keyof typeof PODCAST_PACES;
  tone: keyof typeof PODCAST_TONES;
}

export interface PodcastVoiceOption { value: string; label: string; gender?: string; }
export function resolvePodcastVoice(value: string, voices: PodcastVoiceOption[]): string {
  const shortName = /^pt-BR-Chirp3-HD-([A-Za-z]+)$/.exec(value)?.[1];
  return voices.find(voice => voice.value === value)?.value ?? voices.find(voice => voice.value === shortName)?.value ?? voices.find(voice => voice.value.endsWith(`Chirp3-HD-${value}`))?.value ?? value;
}
