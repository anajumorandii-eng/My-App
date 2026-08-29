import { MOTION_DURATION, MOTION_EASE, MOTION_EASE_EMPHASIZED, MOTION_STAGGER } from './motion/tokens';

export const PALETTE_TOKENS = [
  'bg', 'surface', 'primary', 'secondary', 'emissive',
  'textHighlight', 'dataPositive', 'dataWarning', 'atmoA', 'atmoB',
] as const;

export type PaletteToken = (typeof PALETTE_TOKENS)[number];
export type CrivoPalette = Record<PaletteToken, string>;
export type CoreType =
  | 'matematica_grid' | 'fisica_lentes' | 'quimica_rede' | 'biologia_helix'
  | 'portugues_sintaxe' | 'geografia_fluxos' | 'historia_campos' | 'default_neutro';
export type FieldType = 'grid' | 'lenses' | 'chamber' | 'organic' | 'syntax' | 'topography' | 'paired' | 'neutral';
export type CrivoTypography = 'mechanical' | 'vector' | 'reactive' | 'organic' | 'parsing' | 'cartographic' | 'stratified' | 'neutral';

export interface SubjectProfile {
  key: string;
  label: string;
  short: string;
  coreType: CoreType;
  fieldType: FieldType;
  tipografia: CrivoTypography;
  rhythm: number;
  damping: number;
  palette: CrivoPalette;
  /** True only for subjects that intentionally await a bespoke identity. */
  isFallback?: true;
}

const neutralPalette: CrivoPalette = {
  bg: '#101112', surface: '#191B1C', primary: '#8E9AA3', secondary: '#B8A778', emissive: '#EFF3F5',
  textHighlight: '#E8EDF0', dataPositive: '#7FBF8F', dataWarning: '#D98B4A', atmoA: '#1A2228', atmoB: '#0A0A0A',
};

export const DEFAULT_SUBJECT_PROFILE: SubjectProfile = {
  key: 'default', label: 'Matéria', short: 'CRI', coreType: 'default_neutro', fieldType: 'neutral',
  tipografia: 'neutral', rhythm: 1, damping: 1, palette: neutralPalette,
};

function profile(input: Omit<SubjectProfile, 'isFallback'>): SubjectProfile { return input; }

export const SUBJECT_REGISTRY: Record<string, SubjectProfile> = {
  matematica: profile({ key: 'matematica', label: 'Matemática', short: 'MAT', coreType: 'matematica_grid', fieldType: 'grid', tipografia: 'mechanical', rhythm: 1.3, damping: 1.25, palette: { bg:'#12161A', surface:'#1A2126', primary:'#6E93B3', secondary:'#C9A468', emissive:'#F1EFE9', textHighlight:'#D9E4EB', dataPositive:'#7FBF8F', dataWarning:'#D98B4A', atmoA:'#1E2C36', atmoB:'#0B0E11' } }),
  fisica: profile({ key: 'fisica', label: 'Física', short: 'FIS', coreType: 'fisica_lentes', fieldType: 'lenses', tipografia: 'vector', rhythm: 0.9, damping: 0.8, palette: { bg:'#0A0E15', surface:'#121A24', primary:'#4C7FE0', secondary:'#E0B23A', emissive:'#F3F6FF', textHighlight:'#CFE0FF', dataPositive:'#6FCF97', dataWarning:'#E0954C', atmoA:'#16264A', atmoB:'#080A0F' } }),
  quimica: profile({ key: 'quimica', label: 'Química', short: 'QUI', coreType: 'quimica_rede', fieldType: 'chamber', tipografia: 'reactive', rhythm: 1.2, damping: 0.65, palette: { bg:'#0D1714', surface:'#15211D', primary:'#B87545', secondary:'#7C9C74', emissive:'#FBF6EC', textHighlight:'#E8D9C8', dataPositive:'#8FBF7F', dataWarning:'#D9773F', atmoA:'#173029', atmoB:'#080D0B' } }),
  biologia: profile({ key: 'biologia', label: 'Biologia', short: 'BIO', coreType: 'biologia_helix', fieldType: 'organic', tipografia: 'organic', rhythm: 0.65, damping: 1.05, palette: { bg:'#0A150F', surface:'#122018', primary:'#54D998', secondary:'#E0876A', emissive:'#F3EFE2', textHighlight:'#CDEBD9', dataPositive:'#6FE0A0', dataWarning:'#E0A15F', atmoA:'#0F2E1E', atmoB:'#070C09' } }),
  portugues: profile({ key: 'portugues', label: 'Português', short: 'POR', coreType: 'portugues_sintaxe', fieldType: 'syntax', tipografia: 'parsing', rhythm: 1.1, damping: 1.1, palette: { bg:'#160B0E', surface:'#231216', primary:'#8A2E3F', secondary:'#C1443D', emissive:'#F4EDE6', textHighlight:'#F0D8DA', dataPositive:'#7FBF8F', dataWarning:'#D97A4A', atmoA:'#241A1C', atmoB:'#0C0708' } }),
  geografia: profile({ key: 'geografia', label: 'Geografia', short: 'GEO', coreType: 'geografia_fluxos', fieldType: 'topography', tipografia: 'cartographic', rhythm: 0.75, damping: 1, palette: { bg:'#0F130D', surface:'#181F14', primary:'#77804E', secondary:'#B5723F', emissive:'#E9DFC4', textHighlight:'#DCE0C4', dataPositive:'#7FBF8F', dataWarning:'#C97A4A', atmoA:'#12262A', atmoB:'#0A0D08' } }),
  historia: profile({ key: 'historia', label: 'História', short: 'HIS', coreType: 'historia_campos', fieldType: 'paired', tipografia: 'stratified', rhythm: 0.8, damping: 0.55, palette: { bg:'#130F09', surface:'#1F1810', primary:'#9C7A45', secondary:'#A1483A', emissive:'#EAD9A8', textHighlight:'#E8D2A8', dataPositive:'#7FBF8F', dataWarning:'#B25A3E', atmoA:'#241A12', atmoB:'#0A0806' } }),
  ingles: { ...DEFAULT_SUBJECT_PROFILE, key: 'ingles', label: 'Inglês', short: 'ING', isFallback: true },
  filosofia: { ...DEFAULT_SUBJECT_PROFILE, key: 'filosofia', label: 'Filosofia', short: 'FIL', isFallback: true },
  sociologia: { ...DEFAULT_SUBJECT_PROFILE, key: 'sociologia', label: 'Sociologia', short: 'SOC', isFallback: true },
};

export interface TypographyPreset {
  stagger: number;
  duration: number;
  ease: readonly [number, number, number, number];
}

// Each matéria's kinetic-headline "law of motion" — reuses the shared
// MOTION_* constants (never a one-off value), per subject.tipografia.
export const TYPOGRAPHY_PRESETS: Record<CrivoTypography, TypographyPreset> = {
  mechanical: { stagger: 0.012, duration: 0.16, ease: MOTION_EASE },
  vector: { stagger: 0.016, duration: 0.2, ease: MOTION_EASE_EMPHASIZED },
  reactive: { stagger: 0.014, duration: 0.18, ease: MOTION_EASE_EMPHASIZED },
  organic: { stagger: 0.03, duration: 0.32, ease: MOTION_EASE },
  parsing: { stagger: 0.045, duration: 0.26, ease: MOTION_EASE },
  cartographic: { stagger: 0.022, duration: 0.24, ease: MOTION_EASE },
  stratified: { stagger: 0.05, duration: 0.3, ease: MOTION_EASE_EMPHASIZED },
  neutral: { stagger: MOTION_STAGGER.letters, duration: MOTION_DURATION.component, ease: MOTION_EASE },
};

const warnedUnknownSubjects = new Set<string>();
const normalizeSubject = (subject: string) => subject.trim().normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function getSubjectProfile(subject: string | null | undefined): SubjectProfile {
  const key = normalizeSubject(subject ?? '');
  const known = SUBJECT_REGISTRY[key];
  if (known) return known;
  if (!warnedUnknownSubjects.has(key)) {
    warnedUnknownSubjects.add(key);
    console.warn('[Crivo] matéria sem perfil registrado; usando perfil neutro:', subject ?? '');
  }
  return DEFAULT_SUBJECT_PROFILE;
}
