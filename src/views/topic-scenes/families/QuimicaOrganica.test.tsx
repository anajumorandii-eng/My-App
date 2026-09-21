import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { QuimicaOrganica } from './QuimicaOrganica';
import { TopicScene } from '../TopicScene';
import type { SceneEntry } from '../types';

const functions: SceneEntry = {
  chapterId: 'summary-quimica-nomenclatura-de-compostos-organicos-oxigenados-e-nitrogenados',
  family: 'tipologia',
  question: 'Que sufixo identifica cada função?',
  items: [
    { label: 'Álcool', claim: 'hidroxila em carbono saturado', section: 'Funções', quote: 'recebem sufixo -ol' },
    { label: 'Amida', claim: 'carbonila ligada a nitrogênio', section: 'Funções', quote: 'recebem sufixo -amida' },
    { label: 'Nitrila', claim: 'grupo C≡N', section: 'Funções', quote: 'recebem sufixo -nitrila' },
  ],
};

const isomerism: SceneEntry = {
  chapterId: 'summary-quimica-isomeria',
  family: 'tipologia',
  question: 'Quais isomerias?',
  items: [
    { label: 'Plana', claim: 'conectividade diferente', section: 'Isomeria', quote: 'diferem na conectividade' },
    { label: 'Geométrica', claim: 'disposição espacial diferente', section: 'Isomeria', quote: 'ao redor de uma dupla' },
    { label: 'Óptica', claim: 'imagens especulares', section: 'Isomeria', quote: 'não sobreponível' },
  ],
};

describe('QuimicaOrganica', () => {
  it('desenha ligações e destaca heteroátomos para cada grupo funcional', () => {
    const { container } = render(<QuimicaOrganica entry={functions} />);
    expect(container.querySelectorAll('[data-structure]').length).toBe(3);
    expect(container.querySelectorAll('.tc-organic-bond').length).toBeGreaterThan(3);
    expect(container.querySelectorAll('.tc-organic-atom--hetero').length).toBeGreaterThan(2);
  });

  it('troca a explicação detalhada quando a estrutura é selecionada', () => {
    render(<QuimicaOrganica entry={functions} />);
    fireEvent.click(screen.getByRole('button', { name: /amida/i }));
    expect(screen.getByRole('status')).toHaveTextContent('diretamente ligado ao carbono da carbonila');
    expect(screen.getByRole('status')).toHaveTextContent('recebem sufixo -amida');
  });

  it('compara desenhos próprios para isomeria plana, geométrica e óptica', () => {
    const { container } = render(<QuimicaOrganica entry={isomerism} />);
    expect(container.querySelector('[data-structure="constitutional-isomers"]')).toBeInTheDocument();
    expect(container.querySelector('[data-structure="cis-trans"]')).toBeInTheDocument();
    expect(container.querySelector('[data-structure="enantiomers"]')).toBeInTheDocument();
  });

  it('é usada pela cena real tanto em nomenclatura quanto na oxidação de álcoois', () => {
    const rendered = render(<TopicScene summaryId="summary-quimica-nomenclatura-de-compostos-organicos-oxigenados-e-nitrogenados" />);
    expect(rendered.container.querySelector('.tc-organic-scene')).toBeInTheDocument();
    expect(rendered.container.querySelector('[data-structure="Amida"]')).toBeInTheDocument();

    rendered.rerender(<TopicScene summaryId="summary-quimica-alcoois" />);
    expect(rendered.container.querySelector('[data-structure="primary-alcohol"]')).toBeInTheDocument();
    expect(rendered.container.querySelector('[data-structure="tertiary-alcohol"]')).toBeInTheDocument();
  });
});
