import React from 'react';
import { render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
const probe = vi.hoisted(() => ({ loads: 0 }));
vi.mock('./OpticsInstrument', () => {
  probe.loads++;
  return { opticsInstrument: () => () => <p>Instrumento de óptica carregado</p> };
});
import { findInstrument } from './registry';
it('consulta o catálogo sem carregar o instrumento e só o busca quando é exibido', async () => {
  expect(probe.loads).toBe(0);
  const entry = findInstrument({ subject: 'Física', topic: 'Reflexão em Superfícies Esféricas', title: 'Reflexão em Superfícies Esféricas' });
  expect(entry).not.toBeNull();
  expect(probe.loads).toBe(0);
  const Component = entry!.Component;
  render(<Component map={{ nodes: [], edges: [] } as any} states={{}} selectedId={null} onSelect={() => {}} hiddenEdgeIds={[]} mode="explorar" />);
  expect(await screen.findByText('Instrumento de óptica carregado')).toBeVisible();
  expect(probe.loads).toBe(1);
});
