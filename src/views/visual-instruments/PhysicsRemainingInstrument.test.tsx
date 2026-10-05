import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { interactiveSummaries } from '../../data/interactiveSummaries';
import { buildVisualMap } from '../../lib/visualStudy';
import { physicsRemainingInstrument } from './PhysicsRemainingInstrument';
import type { PhysicsRemainingId } from '../../lib/physicsRemainingLab';

const props = (id: string) => ({ map: buildVisualMap(interactiveSummaries.find(item => item.id === id)!), states: {}, selectedId: null, onSelect: vi.fn(), hiddenEdgeIds: [], mode: 'explorar' as const });

describe('instrumento de ondas e física moderna', () => {
  it('expõe uma cena e um controle de faixa para cada capítulo', () => {
    const chapters: Array<[PhysicsRemainingId, string]> = [
      ['echo', 'summary-fisica-reflexao-eco-reverberacao-e-refracao-de-ondas'],
      ['diffraction', 'summary-fisica-fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia'],
      ['tube-harmonics', 'summary-fisica-ondas-estacionarias-em-tubos'],
      ['quantum-photon', 'summary-fisica-nocoes-basicas-de-fisica-quantica'],
      ['circular-motion', 'summary-fisica-o-movimento-circular'],
      ['electric-field-map', 'summary-fisica-mapeamento-do-campo-eletrico-linhas-de-forca-e-superficies-equipotenciais'],
      ['electric-meters', 'summary-fisica-medidores-eletricos'],
      ['generator', 'summary-fisica-geradores'],
      ['receiver', 'summary-fisica-receptores'],
      ['magnet-field', 'summary-fisica-imas-campo-de-inducao-magnetico-devido-a-imas-e-campo-magnetico-terrestre'],
      ['geometric-optics', 'summary-fisica-fundamentos-da-optica-geometrica'],
      ['optical-instruments', 'summary-fisica-microscopio-e-luneta-astronomica-ou-telescopio-refrator-nocoes-basicas'],
      ['wave-basics', 'summary-fisica-conceitos-basicos'],
      ['rope-boundary', 'summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas'],
      ['string-standing-wave', 'summary-fisica-um-caso-particular-de-interferencia-onda-estacionaria'],
    ];
    for (const [id, chapter] of chapters) { const Component = physicsRemainingInstrument(id); const view = render(<Component {...props(chapter)} />); expect(screen.getByRole('img')).toBeInTheDocument(); expect(screen.getByRole('slider', { name: id === 'diffraction' ? /a\/λ/i : undefined })).toHaveAttribute('type', 'range'); view.unmount(); }
  });

  it('troca a regra visual entre ligação fixa e livre de uma corda', () => {
    const Component = physicsRemainingInstrument('rope-boundary');
    render(<Component {...props('summary-fisica-fenomenos-ondulatorios-analise-de-refracao-e-reflexao-em-cordas')} />);
    expect(screen.getAllByText('invertido').length).toBeGreaterThan(0);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(screen.getAllByText('sem inversão').length).toBeGreaterThan(0);
  });

  it('recalcula a distância quando o eco demora mais para voltar', () => {
    const Component = physicsRemainingInstrument('echo');
    render(<Component {...props('summary-fisica-reflexao-eco-reverberacao-e-refracao-de-ondas')} />);
    fireEvent.change(screen.getByRole('slider'), { target: { value: '0.4' } });
    expect(screen.getAllByText('68 m').length).toBeGreaterThan(0);
  });

  it('liga o amperímetro no ramo principal e o voltímetro aos dois lados do resistor', () => {
    const Component = physicsRemainingInstrument('electric-meters');
    const { container } = render(<Component {...props('summary-fisica-medidores-eletricos')} />);
    const diagram = container.querySelector('[data-physics-system="electric-meters"]')!;
    expect(diagram.querySelector('[data-meter-connection="series"]')).toHaveTextContent('A');
    expect(diagram.querySelector('[data-meter-connection="parallel"]')).toBeNull();
    expect(diagram.querySelector('path')?.getAttribute('d')).toContain('M190 76H152M112 76H52');
    expect(diagram.querySelector('[data-meter-connection="series"] circle')).toHaveAttribute('fill', 'var(--vs-blue)');
    expect(diagram.querySelector('[data-meter-connection="series"] text')).toHaveAttribute('fill', 'white');

    fireEvent.change(screen.getByRole('slider'), { target: { value: '1' } });
    expect(diagram.querySelector('[data-meter-connection="series"]')).toBeNull();
    expect(diagram.querySelector('[data-meter-connection="parallel"]')).toHaveTextContent('em paralelo a R');
    expect(diagram.querySelector('[data-meter-connection="parallel"] circle:last-of-type')).toHaveAttribute('fill', 'var(--vs-blue)');
    expect(diagram.querySelector('[data-meter-connection="parallel"] path')?.getAttribute('d'))
      .toBe('M174 76V158H193M233 158H252V76');
    expect(diagram.querySelector('path')?.getAttribute('d')).toContain('M190 76H52');
  });

  it('desenha os dois semiperfis opostos da onda estacionária no tubo', () => {
    const Component = physicsRemainingInstrument('tube-harmonics');
    const { container } = render(<Component {...props('summary-fisica-ondas-estacionarias-em-tubos')} />);
    const upper = container.querySelector('[data-harmonic-profile="upper"]')?.getAttribute('d');
    const lower = container.querySelector('[data-harmonic-profile="lower"]')?.getAttribute('d');
    expect(upper).toBeTruthy();
    expect(lower).toBeTruthy();
    expect(upper).not.toBe(lower);
    // No primeiro quarto do modo fundamental, um perfil sobe e o outro desce.
    const upperY = Number(upper!.match(/^M\s+43\s+150\s+L\s+[\d.]+\s+([\d.]+)/)?.[1]);
    const lowerY = Number(lower!.match(/^M\s+43\s+150\s+L\s+[\d.]+\s+([\d.]+)/)?.[1]);
    expect(upperY).toBeLessThan(150);
    expect(lowerY).toBeGreaterThan(150);
  });
});

it('mantém ponto de operação sobre a curva U(i) nos dois extremos', () => {
  for (const [id, chapter, maximum] of [['generator', 'geradores', 12], ['receiver', 'receptores', 10]] as const) {
    const Component = physicsRemainingInstrument(id);
    const { container, unmount } = render(<Component {...props(`summary-fisica-${chapter}`)} />);
    for (const current of [0, maximum]) {
      fireEvent.change(screen.getByRole('slider'), { target: { value: String(current) } });
      const point = container.querySelector('[data-operating-point]')!;
      expect(point).not.toBeNull();
      const actual = Number(screen.getByRole('slider').getAttribute('value'));
      expect(Number(point.getAttribute('cx'))).toBeCloseTo(45 + actual * (240 / maximum));
      expect(Number(point.getAttribute('cy'))).toBeCloseTo(id === 'generator' ? 58 + actual * 13 : 214 - actual * 15.6);
    }
    unmount();
  }
});
it('orienta campo externo e interno e identifica polos terrestres', () => {
  const Component = physicsRemainingInstrument('magnet-field');
  const { container } = render(<Component {...props('summary-fisica-imas-campo-de-inducao-magnetico-devido-a-imas-e-campo-magnetico-terrestre')} />);
  expect(container.querySelector('[data-magnet-field="external"]')).toBeInTheDocument();
  expect(container.querySelector('[data-magnet-field="internal"]')).toHaveAttribute('d', 'M204 158H116m8-6-8 6 8 6');
  expect(screen.getByText(/N geográfico ≈ S magnético/i)).toBeInTheDocument();
  expect(container.querySelector('[data-earth-field]')).toBeInTheDocument();
});
it('preserva bússola apontando ao longo de B ao orientar ímã', () => {
 const Component = physicsRemainingInstrument('magnet-field');
 const {container} = render(<Component {...props('summary-fisica-imas-campo-de-inducao-magnetico-devido-a-imas-e-campo-magnetico-terrestre')} />);
 expect(container.querySelector('[data-compass]')).toBeInTheDocument();
 fireEvent.change(screen.getByRole('slider'), {target:{value:'30'}});
 expect(container.querySelector('[data-compass]')).toHaveAttribute('transform', 'rotate(30 160 158)');
});
it('alinha curto-circuito ao eixo U=0 e explicita escala truncada do receptor', () => {
 for (const [id, chapter] of [['generator','geradores'],['receiver','receptores']] as const) {
  const Component = physicsRemainingInstrument(id);
  const {container,unmount} = render(<Component {...props(`summary-fisica-${chapter}`)} />);
  if(id === 'generator') expect(container.querySelector('[data-current-axis]')).toHaveAttribute('d','M45 214H286');
  else expect(screen.getByText(/escala U: 100–120 V/i)).toBeInTheDocument();
  unmount();
 }
});

it('mantém polos e vetor interno legíveis sobre o corpo preenchido do ímã', () => {
 const Component=physicsRemainingInstrument('magnet-field');
 const {container}=render(<Component {...props('summary-fisica-imas-campo-de-inducao-magnetico-devido-a-imas-e-campo-magnetico-terrestre')} />);
 const body=container.querySelector('[data-physics-system="magnet-field"] rect')!;
 expect(body.getAttribute('fill')).not.toBe('none');
 expect(body.getAttribute('fill')).toBe('var(--vs-burgundy)');
});

it('mostra difração, polarizadores e oscilador forçado estaticamente e opera seus extremos', () => {
  const Component = physicsRemainingInstrument('diffraction');
  const { container } = render(<Component {...props('summary-fisica-fenomenos-ondulatorios-difracao-polarizacao-e-ressonancia')} />);
  expect(container.querySelector('[data-physics-system="diffraction"]')).toBeInTheDocument();
  expect(container.querySelector('[data-physics-system="polarization"]')).toBeInTheDocument();
  expect(container.querySelector('[data-physics-system="resonance"]')).toBeInTheDocument();
  const analyzer = screen.getByRole('slider', { name: /ângulo do analisador/i });
  for (const [angle, intensity] of [[0, '100%'], [90, '0%']] as const) {
    fireEvent.change(analyzer, { target: { value: String(angle) } });
    expect(container.querySelector('[data-physics-system="polarization"]')).toHaveTextContent(intensity);
  }
  const forcing = screen.getByRole('slider', { name: /frequência de excitação/i });
  fireEvent.change(forcing, { target: { value: '1' } });
  expect(container.querySelector('[data-physics-system="resonance"]')).toHaveTextContent('5 A₀');
  expect(container.querySelector('[data-physics-system="resonance"] [data-resonance-drive]')).toBeInTheDocument();
  for (const ratio of [0.5, 1, 5]) {
    fireEvent.change(screen.getByRole('slider', { name: /a\/λ/i }), { target: { value: String(ratio) } });
    expect(container.querySelector('[data-physics-system="diffraction"]')?.innerHTML).not.toMatch(/NaN|Infinity/);
  }
});

it('absorve somente fóton ressonante e separa emissão fotoelétrica de transição discreta', () => {
  const Component = physicsRemainingInstrument('quantum-photon');
  const { container } = render(<Component {...props('summary-fisica-nocoes-basicas-de-fisica-quantica')} />);
  for (let frequency = 3; frequency <= 12; frequency++) {
    fireEvent.change(screen.getByRole('slider'), { target: { value: String(frequency) } });
    const absorption = container.querySelector('[data-quantum-mechanism="absorption"]')!;
    expect(absorption).toBeInTheDocument();
    expect(absorption.querySelector('[data-quantum-transition]')).toHaveAttribute('data-quantum-transition', frequency === 6 ? 'E1' : frequency === 10 ? 'E2' : 'none');
    const electron = absorption.querySelector('[data-bound-electron]')!;
    expect(electron).toHaveAttribute('cy', frequency === 6 ? '110' : frequency === 10 ? '70' : '150');
    const photoelectric = container.querySelector('[data-quantum-mechanism="photoelectric"]')!;
    expect(photoelectric).toHaveAttribute('data-emission', frequency >= 8 ? 'true' : 'false');
    expect(photoelectric).toHaveTextContent('φ = 3 eV');
  }
  expect(container.textContent).not.toContain('frequência maior → salto possível maior');
});
