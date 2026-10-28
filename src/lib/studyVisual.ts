type Base = { title: string; caption: string; question: string };
export type StudyMolecule = { label: string; smiles: string };
export type StudyVisual = Base & (
  { type: 'flow'; steps: string[] } |
  { type: 'bars'; unit: string; data: { label: string; value: number }[] } |
  { type: 'line'; xLabel: string; yLabel: string; series: { label: string; points: { x: number; y: number }[] }[] } |
  { type: 'molecule'; molecule: StudyMolecule } |
  { type: 'reaction'; molecules: StudyMolecule[]; conditions: string[] } |
  { type: 'geometry' } & StudyGeometry |
  { type: 'circuit'; loop: CircuitItem[] } |
  { type: 'timeline'; events: { year: number; label: string }[]; periods?: { start: number; end: number; label: string }[] } |
  { type: 'pedigree'; individuals: PedigreeIndividual[]; couples: { a: string; b: string; children: string[] }[] } |
  { type: 'climate'; place: string; months: { label: string; temp: number; rain: number }[] }
);
export const CIRCUIT_KINDS = ['battery', 'resistor', 'lamp', 'capacitor', 'switch', 'ammeter', 'voltmeter'] as const;
export type CircuitComponent = { kind: typeof CIRCUIT_KINDS[number]; label?: string };
export type CircuitItem = CircuitComponent | { parallel: CircuitComponent[] };
export type PedigreeIndividual = { id: string; sex: 'M' | 'F'; generation: number; affected?: boolean; carrier?: boolean };
export type StudyGeometry = {
  points: { id: string; x: number; y: number; hidden?: boolean }[];
  segments?: { from: string; to: string; label?: string; dashed?: boolean; arrow?: boolean }[];
  polygons?: { vertices: string[] }[];
  circles?: { center: string; radius: number; label?: string }[];
  angles?: { vertex: string; from: string; to: string; label?: string; right?: boolean }[];
};
const label = (value: unknown, max = 240): value is string => typeof value === 'string' && value.trim().length > 0 && value.length <= max;
const number = (value: unknown): value is number => typeof value === 'number' && Number.isFinite(value) && Math.abs(value) <= 1e9;
const molecule = (value: unknown): value is StudyMolecule => Boolean(value && typeof value === 'object' && label((value as StudyMolecule).label,120) && label((value as StudyMolecule).smiles,180) && /^[A-Za-z0-9@+\-[\]()=#\\/%.]+$/.test((value as StudyMolecule).smiles));
/**
 * Figura geométrica em coordenadas do próprio desenho. Antes não existia:
 * em Geometria o modelo só tinha curva, barra ou fluxo e entregava um
 * gráfico sem relação com o triângulo do enunciado. Toda referência a ponto
 * precisa existir, para a seta nunca apontar para o vazio.
 */
function geometry(value: Record<string, unknown>): boolean {
  const points = value.points;
  if (!Array.isArray(points) || points.length < 2 || points.length > 16) return false;
  if (!points.every(p => p && label(p.id, 8) && number(p.x) && number(p.y) && (p.hidden === undefined || typeof p.hidden === 'boolean'))) return false;
  const ids = new Set(points.map(p => p.id as string));
  if (ids.size !== points.length) return false;
  const known = (id: unknown) => typeof id === 'string' && ids.has(id);
  const list = (key: string, max: number, ok: (item: Record<string, unknown>) => boolean) => {
    const items = value[key];
    return items === undefined || (Array.isArray(items) && items.length <= max && items.every(item => item && typeof item === 'object' && ok(item)));
  };
  const optional = (text: unknown, max: number) => text === undefined || label(text, max);
  const valid = list('segments', 24, s => known(s.from) && known(s.to) && s.from !== s.to && optional(s.label, 24) && (s.dashed === undefined || typeof s.dashed === 'boolean') && (s.arrow === undefined || typeof s.arrow === 'boolean'))
    && list('polygons', 6, p => Array.isArray(p.vertices) && p.vertices.length >= 3 && p.vertices.length <= 12 && p.vertices.every(known))
    && list('circles', 6, c => known(c.center) && number(c.radius) && (c.radius as number) > 0 && optional(c.label, 24))
    && list('angles', 12, a => known(a.vertex) && known(a.from) && known(a.to) && new Set([a.vertex, a.from, a.to]).size === 3 && optional(a.label, 16) && (a.right === undefined || typeof a.right === 'boolean'));
  const drawn = ['segments', 'polygons', 'circles'].some(key => Array.isArray(value[key]) && (value[key] as unknown[]).length > 0);
  return valid && drawn;
}
const flag = (value: unknown) => value === undefined || typeof value === 'boolean';
const component = (value: unknown): value is CircuitComponent => Boolean(value && typeof value === 'object'
  && CIRCUIT_KINDS.includes((value as CircuitComponent).kind) && ((value as CircuitComponent).label === undefined || label((value as CircuitComponent).label, 20)));
/** Circuito em malha única, com ramos em paralelo: é o que cabe no desenho sem cruzar fios. */
function circuit(value: Record<string, unknown>): boolean {
  const loop = value.loop;
  return Array.isArray(loop) && loop.length >= 2 && loop.length <= 8 && loop.some(item => component(item) && item.kind === 'battery')
    && loop.every(item => component(item) || (item && Array.isArray(item.parallel) && item.parallel.length >= 2 && item.parallel.length <= 4 && item.parallel.every(component)));
}
function timeline(value: Record<string, unknown>): boolean {
  const year = (n: unknown) => number(n) && Number.isInteger(n) && Math.abs(n as number) <= 100000;
  const events = value.events, periods = value.periods;
  return Array.isArray(events) && events.length >= 2 && events.length <= 16 && events.every(e => e && year(e.year) && label(e.label, 60))
    && (periods === undefined || (Array.isArray(periods) && periods.length <= 6 && periods.every(p => p && year(p.start) && year(p.end) && (p.end as number) > (p.start as number) && label(p.label, 50))));
}
/** Heredograma: todo filho e todo cônjuge citados precisam existir, e o filho fica uma geração abaixo. */
function pedigree(value: Record<string, unknown>): boolean {
  const people = value.individuals, couples = value.couples;
  if (!Array.isArray(people) || people.length < 3 || people.length > 24 || !Array.isArray(couples) || couples.length < 1 || couples.length > 8) return false;
  if (!people.every(p => p && label(p.id, 6) && (p.sex === 'M' || p.sex === 'F') && Number.isInteger(p.generation) && p.generation >= 1 && p.generation <= 4 && flag(p.affected) && flag(p.carrier))) return false;
  const byId = new Map(people.map(p => [p.id as string, p]));
  if (byId.size !== people.length) return false;
  return couples.every(c => c && byId.has(c.a) && byId.has(c.b) && c.a !== c.b && byId.get(c.a).generation === byId.get(c.b).generation
    && Array.isArray(c.children) && c.children.length <= 6 && c.children.every((child: unknown) => typeof child === 'string' && byId.has(child) && byId.get(child).generation === byId.get(c.a).generation + 1));
}
function climate(value: Record<string, unknown>): boolean {
  const months = value.months;
  return label(value.place, 80) && Array.isArray(months) && months.length === 12
    && months.every(m => m && label(m.label, 4) && number(m.temp) && Math.abs(m.temp) <= 60 && number(m.rain) && m.rain >= 0 && m.rain <= 2000);
}
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
    if (value.type === 'geometry' && geometry(value)) return value;
    if (value.type === 'circuit' && circuit(value)) return value;
    if (value.type === 'timeline' && timeline(value)) return value;
    if (value.type === 'pedigree' && pedigree(value)) return value;
    if (value.type === 'climate' && climate(value)) return value;
    if (value.type === 'line' && label(value.xLabel,100) && label(value.yLabel,100) && Array.isArray(value.series) && value.series.length >= 1 && value.series.length <= 4 && value.series.every((series: { label?: unknown; points?: { x?: unknown; y?: unknown }[] } | null) => series && label(series.label,100) && Array.isArray(series.points) && series.points.length >= 2 && series.points.length <= 40 && series.points.every((point, index, points) => point && number(point.x) && number(point.y) && (index===0 || Number(point.x)>Number(points[index-1]?.x))))) return value;
  } catch { /* Incomplete streaming blocks never become executable markup. */ }
}
