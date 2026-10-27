type Base = { title: string; caption: string; question: string };
export type StudyMolecule = { label: string; smiles: string };
export type StudyVisual = Base & (
  { type: 'flow'; steps: string[] } |
  { type: 'bars'; unit: string; data: { label: string; value: number }[] } |
  { type: 'line'; xLabel: string; yLabel: string; series: { label: string; points: { x: number; y: number }[] }[] } |
  { type: 'molecule'; molecule: StudyMolecule } |
  { type: 'reaction'; molecules: StudyMolecule[]; conditions: string[] }
);
const label = (value: unknown, max = 240): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const number = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e9;
const molecule = (value: unknown): value is StudyMolecule => Boolean(value && typeof value === 'object' && label((value as StudyMolecule).label,120) && label((value as StudyMolecule).smiles,180) && /^[A-Za-z0-9@+\-[\]()=#\\/%.]+$/.test((value as StudyMolecule).smiles));
/** Model output is untrusted: only finite, bounded data reaches the renderer. */
export function parseStudyVisual(text: string): StudyVisual | undefined {
  if (text.length > 8000) return;
  try {
    const value = JSON.parse(text);
    if (!value || !label(value.title) || !label(value.caption, 1200) || !label(value.question, 600)) return;
    if (value.type === 'flow' && Array.isArray(value.steps) && value.steps.length >= 2 && value.steps.length <= 8 && value.steps.every((step: unknown) => label(step))) return value;
    if (value.type === 'bars' && label(value.unit, 80) && Array.isArray(value.data) && value.data.length >= 2 && value.data.length <= 12 && value.data.every((item: { label?: unknown; value?: unknown } | null) => item && label(item.label, 120) && typeof item.value === 'number' && Number.isFinite(item.value) && item.value >= 0)) return value;
    if (value.type === 'molecule' && molecule(value.molecule)) return value;
    if (value.type === 'reaction' && Array.isArray(value.molecules) && value.molecules.length >= 2 && value.molecules.length <= 4 && value.molecules.every(molecule) && Array.isArray(value.conditions) && value.conditions.length === value.molecules.length-1 && value.conditions.every((condition: unknown) => label(condition,180))) return value;
    if (value.type === 'line' && label(value.xLabel,100) && label(value.yLabel,100) && Array.isArray(value.series) && value.series.length >= 1 && value.series.length <= 4 && value.series.every((series: { label?: unknown; points?: { x?: unknown; y?: unknown }[] } | null) => series && label(series.label,100) && Array.isArray(series.points) && series.points.length >= 2 && series.points.length <= 40 && series.points.every((point, index, points) => point && number(point.x) && number(point.y) && (index===0 || Number(point.x)>Number(points[index-1]?.x))))) return value;
  } catch { /* Incomplete streaming blocks never become executable markup. */ }
}
