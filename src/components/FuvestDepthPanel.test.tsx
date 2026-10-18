import { fireEvent, render, screen, within } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';
import { FuvestDepthPanel } from './FuvestDepthPanel';
import { fuvestAreaDepth, priorityCurriculum, topicDepthDrill } from '../data/fuvestStudyDepth';

it('permite localizar subassunto com busca sem acento e preserva a transparência do histórico', () => {
  render(<MemoryRouter><FuvestDepthPanel subject="Biologia" /></MemoryRouter>);
  fireEvent.change(screen.getByRole('searchbox'), { target: { value: 'ligacao genica' } });
  expect(screen.getByText('Genética')).toBeInTheDocument();
  expect(screen.getByText(/1 de 12 assuntos encontrados/)).toBeInTheDocument();
  expect(screen.getByRole('link', { name: 'Buscar questões FUVEST do assunto' })).toHaveAttribute('href', '/questoes?topic=bio_genetica&board=FUVEST');
});

it('troca a tarefa por fase sem apresentar estatística discursiva inexistente', () => {
  render(<MemoryRouter><FuvestDepthPanel subject="Física" /></MemoryRouter>);
  fireEvent.change(screen.getByRole('combobox', { name: 'Recorte de preparação' }), { target: { value: 'second' } });
  expect(screen.getByText(/Este seletor muda o roteiro e consulta/)).toBeInTheDocument();
  expect(screen.getAllByText('Treino discursivo:').length).toBeGreaterThan(0);
  expect(screen.getByText(/componentes da sua carreira e unidade/)).toBeInTheDocument();
});

it('inclui Arte e Educação Física sem prometer integração inexistente ao diagnóstico', () => {
  for (const subject of ['Arte', 'Educação Física']) {
    const view = render(<MemoryRouter><FuvestDepthPanel subject={subject} /></MemoryRouter>);
    expect(within(view.container).getAllByText(/ainda não integrado ao diagnóstico/)).toHaveLength(2);
    expect(within(view.container).queryByRole('link', { name: 'Buscar questões FUVEST do assunto' })).toBeNull();
    view.unmount();
  }
});

it('todas as áreas do roteiro têm capítulos, habilidades e identificadores únicos', () => {
  const ids = new Set<string>();
  for (const subject of Object.keys(fuvestAreaDepth)) {
    const topics = priorityCurriculum(subject);
    expect(topics.length).toBeGreaterThan(0);
    for (const topic of topics) {
      expect(ids.has(topic.id)).toBe(false);
      ids.add(topic.id);
      expect(topic.chapters?.length).toBeGreaterThan(0);
      expect(topicDepthDrill(topic)?.task.length).toBeGreaterThan(30);
      expect(topicDepthDrill(topic)?.criteria.length).toBeGreaterThan(30);
    }
  }
});

it('Redação começa em produção discursiva e não oferece treino objetivo de redação', () => {
  render(<MemoryRouter><FuvestDepthPanel subject="Redação" /></MemoryRouter>);
  expect(screen.getByRole('combobox', { name: 'Recorte de preparação' })).toHaveValue('second');
  expect(screen.getByRole('option', { name: '1ª fase · cobertura e resolução objetiva' })).toBeDisabled();
  expect(screen.queryByText('Treino objetivo:')).toBeNull();
});
