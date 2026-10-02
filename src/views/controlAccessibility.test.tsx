import React from 'react';
import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import Podcast from './Podcast';
import Tutor from './Tutor';
import Redacao from './Redacao';
import Treino2aFase from './Treino2aFase';
import AdminConteudo from './AdminConteudo';
import { synthesizePodcastAudio } from '../lib/podcastAudio';

vi.mock('../lib/podcastAudio', () => ({ synthesizePodcastAudio: vi.fn(), podcastAudioErrorMessage: () => 'Áudio indisponível' }));
vi.mock('./Dashboard', () => ({ SUBJECT_ICONS: {} }));
vi.mock('./visual-boards/ambiente', () => ({ useAmbienteDaTela: () => {} }));
vi.mock('../hooks/useUserProfile', () => ({ useUserProfile: () => ({ profile: {}, updateProfile: vi.fn() }) }));
vi.mock('../hooks/usePodcastEpisodes', () => ({ usePodcastEpisodes: () => ({ episodes: [{ id: 'ep1', title: 'Divisão celular', subject: 'Biologia', topicId: 'bio', script: 'Conteúdo', durationMinutes: 5 }] }) }));
vi.mock('../hooks/useUserMastery', () => ({ useUserMastery: () => ({ updateMastery: vi.fn(), syncing: false }) }));
vi.mock('../hooks/useDiscursiveAttempts', () => ({ useDiscursiveAttempts: () => ({ attempts: [], addAttempt: vi.fn(), isPersisted: true }) }));
vi.mock('../lib/auth', () => ({ getFirebaseIdToken: async () => 'admin-test' }));
afterEach(cleanup);
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  URL.createObjectURL = vi.fn(() => 'blob:episode');
  URL.revokeObjectURL = vi.fn();
  vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => [] }))); });

describe('Controles com propósito acessível', () => {
  it('identifica o episódio ao reproduzir, carregar e parar', async () => {
    let finish!: (blob: Blob) => void;
    vi.mocked(synthesizePodcastAudio).mockImplementation(() => new Promise((resolve) => { finish = resolve; }));
    render(<Podcast />);
    fireEvent.click(screen.getByRole('button', { name: 'Reproduzir episódio Divisão celular' }));
    expect(screen.getByRole('button', { name: 'Carregando áudio do episódio Divisão celular' })).toBeDisabled();
    finish(new Blob(['audio']));
    fireEvent.click(await screen.findByRole('button', { name: 'Parar episódio Divisão celular' }));
    expect(screen.getByRole('button', { name: 'Reproduzir episódio Divisão celular' })).toBeEnabled();
  });
  it('identifica iniciar, pausar e reiniciar o cronômetro', () => {
    render(<Treino2aFase />);
    fireEvent.click(screen.getByRole('button', { name: 'Iniciar cronômetro da questão' }));
    expect(screen.getByRole('button', { name: 'Pausar cronômetro da questão' })).toBeEnabled();
    fireEvent.click(screen.getByRole('button', { name: 'Reiniciar cronômetro da questão' }));
    expect(screen.getByRole('button', { name: 'Iniciar cronômetro da questão' })).toBeEnabled();
  });
  it('identifica tópico, capítulo, mensagem e bancas do tutor', () => {
    render(<MemoryRouter><Tutor /></MemoryRouter>);
    expect(screen.getByRole('combobox', { name: 'Tópico para o tutor' })).toBeInTheDocument();
    expect(screen.getByRole('combobox', { name: /Capítulo específico/ })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Enviar mensagem ao tutor' })).toBeDisabled();
    fireEvent.click(screen.getByRole('button', { name: 'Corrigir resposta' }));
    expect(screen.getByRole('combobox', { name: 'Banca para critério analítico (opcional)' })).toBeInTheDocument();
    fireEvent.click(screen.getByRole('button', { name: 'Criar questão' }));
    fireEvent.click(screen.getByRole('checkbox', { name: 'Questão discursiva (2ª fase)' }));
    expect(screen.getByRole('combobox', { name: 'Banca da questão discursiva' })).toBeInTheDocument();
  });
  it('identifica a banca da redação', () => {
    render(<Redacao />);
    expect(screen.getByRole('combobox', { name: 'Banca da redação' })).toBeInTheDocument();
  });
  it('distingue os seis selects administrativos', async () => {
    render(<AdminConteudo />);
    for (const name of ['Filtrar questões por matéria', 'Tópico da questão', 'Dificuldade da questão', 'Alternativa correta da questão', 'Categoria do método de estudo', 'Tópico do episódio']) {
      expect(await screen.findByRole('combobox', { name })).toBeInTheDocument();
    }
  });
});
