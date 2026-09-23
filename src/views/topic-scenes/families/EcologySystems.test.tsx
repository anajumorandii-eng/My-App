import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import { biologia } from '../data/biologia';
import { EcologySystems } from './EcologySystems';

const entry = (id: string) => biologia.find(item => item.chapterId === id)!;
const cases = [
  ['bio-ecologia-dinamica-populacoes', /muitos descendentes.*poucos descendentes/i, /K-estrategistas/],
  ['bio-ecologia-invasoras-controle-biologico', /invasora.*nativa.*recurso/i, /Competição/],
  ['bio-ecologia-sucessao', /pioneira.*gramíneas.*arbustos.*árvores/i, /Comunidade clímax/],
  ['bio-ecologia-ciclo-hidrologico-poluicao-agua', /fonte.*água.*efeito/i, /Térmica/],
] as const;

describe('sistemas ecológicos', () => {
  for (const [id, name, choice] of cases) {
    it(`mostra mecanismo e lastro ao selecionar ${id}`, async () => {
      const user = userEvent.setup();
      render(<EcologySystems entry={entry(id)}/>);
      const diagram = screen.getByRole('img', { name });
      const button = screen.getByRole('button', { name: choice });
      button.focus();
      await user.keyboard('{Enter}');
      expect(button).toHaveAttribute('aria-pressed', 'true');
      const selected = entry(id).items.find(item => choice.test(item.label))!;
      expect(screen.getByRole('status')).toHaveTextContent(selected.claim);
      expect(screen.getByRole('status')).toHaveTextContent(selected.quote);
      expect(diagram).toHaveAttribute('aria-label', expect.stringContaining(selected.label));
    });
  }
});
