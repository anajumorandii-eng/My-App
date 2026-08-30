import type { CrivoPalette, FieldType } from './crivoSubjects';

type FieldGradient = (palette: CrivoPalette) => string;
const gradient = (shape: string, palette: CrivoPalette, extra: string) => `${shape}, ${extra}, ${palette.atmoA} 0%, ${palette.atmoB} 100%)`;

export const FIELD_REGISTRY: Record<FieldType, FieldGradient> = {
  grid: (palette) => gradient('linear-gradient(145deg', palette, 'rgba(255,255,255,.03) 1px, transparent 1px'),
  lenses: (palette) => gradient('radial-gradient(ellipse at 72% 20%', palette, `${palette.primary}33 0%, transparent 44%`),
  chamber: (palette) => gradient('radial-gradient(circle at 50% 40%', palette, `${palette.secondary}2B 0%, transparent 48%`),
  organic: (palette) => gradient('radial-gradient(ellipse at 20% 80%', palette, `${palette.primary}2B 0%, transparent 50%`),
  syntax: (palette) => gradient('linear-gradient(180deg', palette, `${palette.primary}1A 0%, transparent 36%`),
  topography: (palette) => gradient('radial-gradient(ellipse at 70% 65%', palette, `${palette.primary}26 0%, transparent 52%`),
  paired: (palette) => gradient('linear-gradient(120deg', palette, `${palette.primary}22 0 42%, ${palette.secondary}18 58%`),
  semantic: (palette) => `radial-gradient(ellipse at 50% 44%, ${palette.primary}24 0%, transparent 36%), linear-gradient(90deg, ${palette.atmoA}, ${palette.atmoB})`,
  dialectic: (palette) => `radial-gradient(ellipse at 22% 50%, ${palette.primary}24 0%, transparent 42%), radial-gradient(ellipse at 78% 50%, ${palette.secondary}20 0%, transparent 42%), linear-gradient(180deg, ${palette.atmoA}, ${palette.atmoB})`,
  social: (palette) => `radial-gradient(circle at 24% 32%, ${palette.primary}22 0%, transparent 22%), radial-gradient(circle at 72% 68%, ${palette.secondary}1C 0%, transparent 24%), linear-gradient(145deg, ${palette.atmoA}, ${palette.atmoB})`,
  neutral: (palette) => `linear-gradient(135deg, ${palette.atmoA}, ${palette.atmoB})`,
};
