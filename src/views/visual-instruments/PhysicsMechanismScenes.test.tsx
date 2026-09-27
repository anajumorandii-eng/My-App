import React from 'react';
import { render } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DYNAMICS, type DynamicsId } from '../../lib/dynamicsLab';
import { VECTORS, type VectorId } from '../../lib/vectorsLab';
import { ORBITAL, type OrbitalId } from '../../lib/orbitalLab';
import { ENERGY, type EnergyId } from '../../lib/energyLab';
import { DinamicaCena, EnergiaCena, OrbitalCena, VetoresCena, trajetoria } from './PhysicsMechanismScenes';

// A auditoria 37 achou três capítulos de órbita com a mesma cena byte a byte e
// "corpos interagindo" com um bloco só. O teste compara o SVG de cada capítulo
// com o dos vizinhos do mesmo instrumento, no valor inicial de cada um.
function svgs<T extends string>(ids: T[], Cena: (p: { id: T; v: number }) => React.ReactElement, inicial: (id: T) => number) {
  return ids.map((id) => {
    const { container, unmount } = render(<svg><Cena id={id} v={inicial(id)} /></svg>);
    const html = container.innerHTML; unmount(); return html;
  });
}

describe('cenas de física por capítulo', () => {
  it.each([
    ['dinâmica', Object.keys(DYNAMICS) as DynamicsId[], DinamicaCena, (id: DynamicsId) => DYNAMICS[id].control.initial],
    ['vetores', Object.keys(VECTORS) as VectorId[], VetoresCena, (id: VectorId) => VECTORS[id].control.initial],
    ['órbitas', Object.keys(ORBITAL) as OrbitalId[], OrbitalCena, (id: OrbitalId) => ORBITAL[id].control.initial],
    ['energia', Object.keys(ENERGY) as EnergyId[], EnergiaCena, (id: EnergyId) => ENERGY[id].control.initial],
  ] as const)('%s: nenhum capítulo repete o desenho de outro', (_, ids, Cena, inicial) => {
    const html = svgs(ids as string[], Cena as never, inicial as never);
    expect(new Set(html).size).toBe(html.length);
  });

  it('corpos interagindo desenha dois blocos e o fio', () => {
    const { container } = render(<svg><DinamicaCena id="corpos" v={6} /></svg>);
    expect(container.querySelectorAll('rect')).toHaveLength(2);
    expect(container.textContent).toContain('fio');
  });

  it('a trajetória concorda com a leitura "cai" / "orbita" do instrumento', () => {
    for (let v = 1; v <= 8; v++) {
      const leitura = ORBITAL.orbitas.readouts(v)[0].value;
      expect(trajetoria(v).caiu, `v = ${v}`).toBe(leitura === 'cai');
    }
  });
});
