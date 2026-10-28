/**
 * Tinta das figuras dos resumos, para atributos de SVG.
 *
 * Cada token leva o valor claro como reserva: o PDF recebe só printStyles,
 * sem StudyVisual.css, e um `var()` sem reserva deixaria o traço sem cor.
 * Os valores são os da tinta de caderno do Visual (VisualAtlas.css).
 */
export const figureInk = {
  ink: 'var(--fig-ink, #29251f)',
  muted: 'var(--fig-muted, #74695d)',
  line: 'var(--fig-line, #e3dbcd)',
  oxygen: 'var(--fig-o, #852636)',
  nitrogen: 'var(--fig-n, #476e82)',
  sulfur: 'var(--fig-s, #8c6847)',
  halogen: 'var(--fig-halogen, #4f6b45)',
} as const;

/** Séries de gráfico: tinta, vinho, azul e ocre, cada uma com seu traço. */
export const seriesInk = [figureInk.ink, figureInk.oxygen, figureInk.nitrogen, figureInk.sulfur] as const;
export const seriesDash = ['none', '7 4', '2 4', '9 3 2 3'] as const;
export const seriesDashName = ['linha contínua', 'traços longos', 'pontilhada', 'traço e ponto'] as const;
export const figureSerif = 'Newsreader, Georgia, "Liberation Serif", serif';
