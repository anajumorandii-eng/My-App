import React from 'react';

/** Materiais compartilham luz e profundidade, mas as cores continuam vindo da prancha e do tema. */
export function IllustrationMaterials({ id, palette }: { id: string; palette: string }) {
  return <defs>{['stone','earth','sea'].map(material => <linearGradient key={material} id={`${id}-${material}`} x1="0" y1="0" x2=".9" y2="1">
    <stop stopColor={`color-mix(in srgb,var(--${palette}-${material}) 58%,var(--${palette}-paper))`}/>
    <stop offset=".48" stopColor={`var(--${palette}-${material})`}/>
    <stop offset="1" stopColor={`color-mix(in srgb,var(--${palette}-${material}) 78%,#243631)`}/>
  </linearGradient>)}</defs>;
}
export function illustrationMaterialStyle(id: string): React.CSSProperties {
  return { '--plate-stone': `url(#${id}-stone)`, '--plate-earth': `url(#${id}-earth)`, '--plate-sea': `url(#${id}-sea)` } as React.CSSProperties;
}
