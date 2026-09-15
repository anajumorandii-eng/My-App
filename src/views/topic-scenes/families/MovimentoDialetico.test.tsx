import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MovimentoDialetico } from './MovimentoDialetico';
import type { SceneEntry } from '../types';
const entry: SceneEntry = { chapterId: 'summary-filosofia-hegel-e-a-dialetica', family: 'movimento-dialetico', question: 'Por que o senhor depende do escravo?', items: [
  { label: 'Senhor', claim: 'reconhecido', section: 'Dialética do senhor e do escravo', quote: 'senhor' },
  { label: 'Escravo', claim: 'transforma', section: 'Dialética do senhor e do escravo', quote: 'escravo' },
  { label: 'Inversão', claim: 'se reconhece na obra', section: 'O movimento dialético', quote: 'movimento' },
] };
describe('Movimento dialético', () => {
  it('abre sem o terceiro momento', () => { render(<MovimentoDialetico entry={entry} />); expect(screen.getByText('Senhor')).toBeInTheDocument(); expect(screen.queryByRole('status')).not.toBeInTheDocument(); });
  it('completa o movimento', () => { render(<MovimentoDialetico entry={entry} />); fireEvent.click(screen.getByRole('button', { name: 'Completar o movimento' })); expect(screen.getByRole('status')).toHaveTextContent('se reconhece na obra'); });
  it('permite voltar', () => { render(<MovimentoDialetico entry={entry} />); fireEvent.click(screen.getByRole('button', { name: 'Completar o movimento' })); fireEvent.click(screen.getByRole('button', { name: 'Voltar ao início' })); expect(screen.queryByRole('status')).not.toBeInTheDocument(); });
});
