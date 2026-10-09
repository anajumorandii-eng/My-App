import React, { useId } from 'react';

/** Volume só nos corpos biológicos; setas, genes e cores de seleção continuam no desenho original. */
export function BiologicalVolume({ children }: { children: React.ReactNode }) {
  const id = useId().replace(/:/g, '');
  const materials = { fluid: 'var(--vs-blue)', tissue: 'var(--vs-burgundy)', plant: 'var(--vs-green)', shell: 'var(--vs-amber)' };
  return <g className="biological-volume" style={Object.fromEntries(Object.keys(materials).map(material => [`--bio-${material}`, `url(#${id}-${material})`])) as React.CSSProperties}>
    <defs>{Object.entries(materials).map(([material, color]) => <radialGradient key={material} id={`${id}-${material}`} cx=".25" cy=".2" r=".9">
      <stop stopColor={`color-mix(in srgb,${color} 12%,var(--vs-paper-strong))`}/>
      <stop offset=".48" stopColor={`color-mix(in srgb,${color} 30%,var(--vs-paper-strong))`}/>
      <stop offset="1" stopColor={`color-mix(in srgb,${color} 68%,var(--vs-paper-strong))`}/>
    </radialGradient>)}</defs>{children}
  </g>;
}
