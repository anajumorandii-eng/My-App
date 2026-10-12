import type { PedagogicalStage } from '../types/summary';

/**
 * O que cada etapa do palco faz com os parâmetros de um instrumento.
 *
 * Antes do palco, trocar de etapa no trilho mudava só o texto à direita: o
 * gráfico, o circuito e o raio de luz continuavam no valor inicial, e a cena
 * não dizia nada sobre a etapa que a estudante estava lendo. Aqui a etapa vira
 * um estado do próprio modelo do instrumento, calculado pelas mesmas
 * `readouts` que já alimentam as leituras — nenhuma configuração é escrita à
 * mão e nenhum número sai de fora do capítulo:
 *
 * - intuição e conceito: o valor inicial do instrumento, o fenômeno como ele
 *   aparece;
 * - aplicação: o mesmo modelo com outro valor, para a leitura mostrar o que a
 *   fórmula prevê quando o dado muda (com o "antes → agora" ao lado);
 * - estratégia: o caso-limite. Onde a leitura principal muda de natureza
 *   ("duas raízes" → "uma"), é esse ponto de virada; quando ela só muda de
 *   número, é o extremo da faixa, onde as pegadinhas costumam morar;
 * - exercício: volta ao inicial e propõe uma meta que só se alcança mexendo na
 *   cena. A meta é observação, não evidência: a resposta continua indo pelo
 *   desafio do capítulo (evaluateRetrievalAnswer + applySummaryAttempt).
 *
 * Módulo puro, sem React, para rodar em node:test.
 */
export interface StageParam {
  min: number;
  max: number;
  step: number;
  initial: number;
}

export interface StageReadout {
  label: string;
  value: string;
  pivot?: boolean;
}

export type StagePreset = Partial<Record<PedagogicalStage, number[]>>;

export interface StageChallenge {
  label: string;
  /** Valor da leitura que a estudante precisa fazer aparecer. */
  target: string;
  /** `natureza` compara a leitura sem os números (ex.: "nenhuma" raiz). */
  match: 'exato' | 'natureza';
}

export interface StagePlan {
  presets: Record<PedagogicalStage, number[]>;
  /** A leitura em que a estratégia mostra a virada, ou o extremo. */
  limit: { kind: 'virada' | 'extremo'; label: string; from: string; to: string } | null;
  challenge: StageChallenge | null;
}

const MAX_GRID = 41;

function decimals(step: number): number {
  const text = String(step);
  const dot = text.indexOf('.');
  return dot < 0 ? 0 : text.length - dot - 1;
}

function snap(param: StageParam, value: number): number {
  const clamped = Math.min(param.max, Math.max(param.min, value));
  const steps = Math.round((clamped - param.min) / param.step);
  return Number((param.min + steps * param.step).toFixed(decimals(param.step)));
}

/** Valores alcançáveis do controle, amostrados quando a faixa é longa demais. */
export function gridOf(param: StageParam): number[] {
  if (!(param.step > 0) || param.max < param.min) return [param.initial];
  const count = Math.floor((param.max - param.min) / param.step + 1e-9) + 1;
  const stride = Math.max(1, Math.ceil(count / MAX_GRID));
  const values = new Set<number>();
  for (let k = 0; k < count; k += stride) values.add(snap(param, param.min + k * param.step));
  values.add(snap(param, param.max));
  values.add(snap(param, param.initial));
  return [...values].sort((a, b) => a - b);
}

export function pivotOf(readouts: StageReadout[]): StageReadout | null {
  return readouts.find((item) => item.pivot) ?? readouts[0] ?? null;
}

/** A leitura sem os números: o que sobra é a "natureza" (nenhuma, duas, sem fluxo…). */
export function natureOf(value: string): string {
  return value.replace(/[-−+]?\d+(?:[.,]\d+)*/g, '#').replace(/\s+/g, ' ').trim();
}

function safe(readouts: (values: number[]) => StageReadout[], values: number[]): StageReadout[] {
  try { return readouts(values); } catch { return []; }
}

export function planStageParameters(
  params: StageParam[],
  readouts: (values: number[]) => StageReadout[],
): StagePlan {
  const initial = params.map((param) => snap(param, param.initial));
  const presets: Record<PedagogicalStage, number[]> = {
    intuicao: initial, conceito: initial, aplicacao: initial, estrategia: initial, exercicio: initial,
  };
  const base = pivotOf(safe(readouts, initial));
  if (!base || params.length === 0) return { presets, limit: null, challenge: null };
  const baseKey = JSON.stringify(safe(readouts, initial));

  // Aplicação: o primeiro parâmetro anda um quarto da faixa (para cima, ou para
  // baixo se já está no topo) até as leituras mudarem.
  for (let index = 0; index < params.length && presets.aplicacao === initial; index += 1) {
    const grid = gridOf(params[index]);
    const at = grid.indexOf(initial[index]);
    const jump = Math.max(1, Math.round(grid.length / 4));
    const order = [at + jump, at - jump, at + 1, at - 1].filter((k) => k >= 0 && k < grid.length && k !== at);
    for (const k of order) {
      const candidate = initial.map((value, i) => (i === index ? grid[k] : value));
      if (JSON.stringify(safe(readouts, candidate)) !== baseKey) { presets.aplicacao = candidate; break; }
    }
  }

  // Estratégia: a virada mais próxima do inicial, em qualquer eixo.
  const baseNature = natureOf(base.value);
  let turn: { values: number[]; distance: number; to: StageReadout } | null = null;
  const natures = new Map<string, { values: number[]; pivot: StageReadout; distance: number }>();
  params.forEach((param, index) => {
    const grid = gridOf(param);
    const at = grid.indexOf(initial[index]);
    grid.forEach((value, k) => {
      if (k === at) return;
      const candidate = initial.map((current, i) => (i === index ? value : current));
      const pivot = pivotOf(safe(readouts, candidate));
      // "—" é leitura que não existe (a = 0 numa quadrática deixa de ser
      // quadrática): é o capítulo saindo do próprio assunto, não uma virada.
      if (!pivot || !meaningful(pivot.value)) return;
      const nature = natureOf(pivot.value);
      const distance = Math.abs(k - at);
      if (nature !== baseNature) {
        if (!turn || distance < turn.distance) turn = { values: candidate, distance, to: pivot };
        const known = natures.get(nature);
        if (!known || distance > known.distance) natures.set(nature, { values: candidate, pivot, distance });
      }
    });
  });

  let limit: StagePlan['limit'] = null;
  const found = turn as { values: number[]; distance: number; to: StageReadout } | null;
  if (found) {
    presets.estrategia = found.values;
    limit = { kind: 'virada', label: base.label, from: base.value, to: found.to.value };
  } else {
    // Sem virada, o extremo da faixa em que alguma leitura de fato muda —
    // preferindo a principal. Extremo que não muda nada não ensina nada.
    const extremes = params.flatMap((param, index) => {
      const grid = gridOf(param);
      return [grid[0], grid[grid.length - 1]]
        .filter((value) => value !== initial[index])
        .map((value) => initial.map((current, i) => (i === index ? value : current)));
    });
    const before = safe(readouts, initial);
    let best: { values: number[]; label: string; to: string; from: string; score: number } | null = null;
    for (const candidate of extremes) {
      const after = safe(readouts, candidate);
      const pivot = pivotOf(after);
      if (pivot && meaningful(pivot.value) && pivot.value !== base.value) { best = { values: candidate, label: pivot.label, from: base.value, to: pivot.value, score: 2 }; break; }
      const changed = changedReadouts(before, after).find((item) => meaningful(item.after));
      if (changed && (!best || best.score < 1)) best = { values: candidate, label: changed.label, from: changed.before, to: changed.after, score: 1 };
    }
    if (best) {
      presets.estrategia = best.values;
      limit = { kind: 'extremo', label: best.label, from: best.from, to: best.to };
    }
  }

  // Exercício: a meta é outra natureza, de preferência distinta da que a
  // estratégia já mostrou; sem natureza nova, um valor exato a três quartos da
  // faixa, para que só se chegue lá mexendo.
  let challenge: StageChallenge | null = null;
  const shown = limit?.kind === 'virada' ? natureOf(limit.to) : null;
  const options = [...natures.entries()].sort((a, b) => b[1].distance - a[1].distance);
  const pick = options.find(([nature]) => nature !== shown) ?? options[0];
  if (pick) {
    challenge = { label: base.label, target: pick[1].pivot.value, match: 'natureza' };
  } else {
    const before = safe(readouts, initial);
    for (let index = 0; index < params.length && !challenge; index += 1) {
      const grid = gridOf(params[index]);
      const at = grid.indexOf(initial[index]);
      const k = Math.round((grid.length - 1) * 0.75);
      const position = k !== at ? k : Math.round((grid.length - 1) * 0.25);
      if (position === at) continue;
      const candidate = initial.map((value, i) => (i === index ? grid[position] : value));
      const after = safe(readouts, candidate);
      const pivot = pivotOf(after);
      const target = pivot && meaningful(pivot.value) && pivot.value !== base.value
        ? { label: pivot.label, value: pivot.value }
        : changedReadouts(before, after).filter((item) => meaningful(item.after)).map((item) => ({ label: item.label, value: item.after }))[0];
      if (target) challenge = { label: target.label, target: target.value, match: 'exato' };
    }
  }
  return { presets, limit, challenge };
}

function meaningful(value: string): boolean {
  return value.trim().length > 0 && !/^[—–-]+$/.test(value.trim());
}

export function challengeReached(challenge: StageChallenge | null, readouts: StageReadout[]): boolean {
  if (!challenge) return false;
  const current = readouts.find((item) => item.label === challenge.label);
  if (!current) return false;
  return challenge.match === 'exato'
    ? current.value === challenge.target
    : natureOf(current.value) === natureOf(challenge.target);
}

/** Leituras que mudaram entre dois estados: o "antes → agora" da aplicação. */
export function changedReadouts(before: StageReadout[], after: StageReadout[]) {
  return after
    .map((item) => ({ label: item.label, before: before.find((old) => old.label === item.label)?.value ?? '', after: item.value }))
    .filter((item) => item.before !== item.after);
}
