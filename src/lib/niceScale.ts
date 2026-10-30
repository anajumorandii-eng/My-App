/**
 * Escala com passos redondos para eixos de gráfico.
 *
 * O gráfico de linhas dividia o intervalo exato dos dados em quatro: a curva
 * de aquecimento (−20 a 120 °C) saía com 120, 85, 50, 15 e −20 no eixo, que
 * ninguém lê de cabeça. Aqui o passo é 1, 2, 2,5 ou 5 vezes uma potência de
 * dez, e o domínio se estende até o múltiplo do passo que cobre os dados.
 */
export function niceScale(min: number, max: number, maxTicks = 8): { min: number; max: number; ticks: number[] } {
  if (!Number.isFinite(min) || !Number.isFinite(max)) return { min: 0, max: 1, ticks: [0, 1] };
  if (min === max) { const pad = Math.max(1, Math.abs(min) * 0.1); min -= pad; max += pad; }
  if (min > max) [min, max] = [max, min];
  // O menor passo redondo que cabe em maxTicks marcas: o maior desperdiçava
  // metade do gráfico (−20 a 120 virava −50 a 150).
  const power = 10 ** Math.floor(Math.log10((max - min) / maxTicks));
  for (const step of [1, 2, 2.5, 5, 10, 20, 25, 50].map(m => m * power)) {
    const lo = Math.floor(min / step + 1e-9) * step, hi = Math.ceil(max / step - 1e-9) * step;
    if (Math.round((hi - lo) / step) + 1 > maxTicks) continue;
    const ticks: number[] = [];
    for (let value = lo; value <= hi + step * 1e-6; value += step) ticks.push(Number(value.toPrecision(12)));
    return { min: lo, max: hi, ticks };
  }
  return { min, max, ticks: [min, max] };
}
