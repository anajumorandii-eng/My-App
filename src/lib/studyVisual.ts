type Base = { title: string; caption: string; question: string };
export type StudyVisual = Base & ({ type: 'flow'; steps: string[] } | { type: 'bars'; unit: string; data: { label: string; value: number }[] });
const label = (value: unknown, max = 240): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
/** Model output is untrusted: only finite, bounded data reaches the renderer. */
export function parseStudyVisual(text: string): StudyVisual | undefined {
  if (text.length > 8000) return;
  try {
    const value = JSON.parse(text);
    if (!value || !label(value.title) || !label(value.caption, 1200) || !label(value.question, 600)) return;
    if (value.type === 'flow' && Array.isArray(value.steps) && value.steps.length >= 2 && value.steps.length <= 8 && value.steps.every((step: unknown) => label(step))) return value;
    if (value.type === 'bars' && label(value.unit, 80) && Array.isArray(value.data) && value.data.length >= 2 && value.data.length <= 12 && value.data.every((item: { label?: unknown; value?: unknown } | null) => item && label(item.label, 120) && typeof item.value === 'number' && Number.isFinite(item.value) && item.value >= 0)) return value;
  } catch { /* Incomplete streaming blocks never become executable markup. */ }
}
