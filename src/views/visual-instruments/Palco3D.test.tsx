import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { beforeEach, describe, expect, it } from 'vitest';
import { SpatialLessonLab } from './SpatialLessonLab';
import { placeSpatialLabels } from './SpatialStage';
import { physicsSpatialDrawing } from '../../lib/physicsSpatialDrawing';
import { lerPreferenciasCena, PREFERENCIAS_CENA_PADRAO } from '../../hooks/usePreferenciasCena';

const lab = () => render(<SpatialLessonLab
  config={{ kind: 'weight', title: 'Peso', label: 'Massa', min: 1, max: 10, step: 1, initial: 2, note: 'Esquema' }}
  draw={v => physicsSpatialDrawing('weight', v, 0, '')} moving={() => false} dataAttributes={{}} />);

beforeEach(() => localStorage.clear());

describe('etiquetas do palco', () => {
  // Nos anéis concêntricos as etiquetas nascem quase no mesmo ponto; desenhadas
  // ali, viravam uma pilha em que só a última se lia.
  it('separa etiquetas que cairiam no mesmo ponto e guarda a origem de cada uma', () => {
    const placed = placeSpatialLabels(['Sugestão', 'Musicalidade', 'Sinestesia', 'Espiritualidade'].map(text => ({ text, x: 180, y: 150 })));
    for (let i = 0; i < placed.length; i++) for (let j = i + 1; j < placed.length; j++) {
      const a = placed[i], b = placed[j];
      const sobrepoe = Math.abs(a.x - b.x) < (a.w + b.w) / 2 && Math.abs(a.y - b.y) < 19;
      expect(sobrepoe, `${a.text} × ${b.text}`).toBe(false);
    }
    expect(placed.every(label => label.ax === 180 && label.ay === 150)).toBe(true);
  });

  it('não move etiqueta que já está livre e mantém todas dentro do quadro', () => {
    const [a, b, c] = placeSpatialLabels([{ text: 'A', x: 60, y: 60 }, { text: 'B', x: 300, y: 250 }, { text: 'Etiqueta bem comprida', x: 358, y: 318 }]);
    expect([a.x, a.y, b.x, b.y]).toEqual([60, 60, 300, 250]);
    expect(c.x + c.w / 2).toBeLessThanOrEqual(360);
    expect(c.y + 9.5).toBeLessThanOrEqual(320);
  });
});

describe('personalização da cena', () => {
  it('abre recolhida, aplica a paleta escolhida e a guarda no aparelho', () => {
    const { container } = lab();
    expect(screen.queryByRole('region', { name: 'Personalizar cena' })).not.toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Personalizar cena' }));
    fireEvent.click(screen.getByRole('radio', { name: 'Oceano' }));
    expect(container.querySelector('.vs-palco')).toHaveAttribute('data-palco-cor', 'oceano');
    expect(lerPreferenciasCena(localStorage.getItem('crivo_cena3d_preferencias')).cor).toBe('oceano');
  });

  it('esconde etiquetas e piso sem alterar a leitura do modelo', () => {
    const { container } = lab();
    const leitura = screen.getByRole('status', { name: 'Leitura do modelo espacial' }).textContent;
    expect(container.querySelector('[data-spatial-floor]')).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Personalizar cena' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Piso em grade' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Etiquetas' }));
    expect(container.querySelector('[data-spatial-floor]')).not.toBeInTheDocument();
    expect(container.querySelector('.vs-spatial-label')).not.toBeInTheDocument();
    expect(screen.getByRole('status', { name: 'Leitura do modelo espacial' }).textContent).toBe(leitura);
  });

  it('volta ao padrão diante de valor desconhecido ou armazenamento corrompido', () => {
    expect(lerPreferenciasCena('{"cor":"neon","rotulos":"sim"}')).toEqual(PREFERENCIAS_CENA_PADRAO);
    expect(lerPreferenciasCena('{nao é json')).toEqual(PREFERENCIAS_CENA_PADRAO);
  });
});
