import React, { useState } from 'react';
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import Podcast from './Podcast';
import { requestAiTextStream } from '../lib/aiClient';
import { synthesizePodcastAudio } from '../lib/podcastAudio';
vi.mock('../hooks/useUserProfile', () => ({ useUserProfile: () => { const [profile, updateProfile] = useState({}); return { profile, updateProfile }; } }));
vi.mock('../hooks/usePodcastVoices', () => ({ usePodcastVoices: () => ({ voices: [{ value: 'Kore', label: 'Kore' }, { value: 'Puck', label: 'Puck' }] }) }));
vi.mock('../hooks/usePodcastEpisodes', () => ({ usePodcastEpisodes: () => ({ episodes: [] }) }));
vi.mock('../lib/aiClient', () => ({ requestAiTextStream: vi.fn() }));
vi.mock('../lib/podcastAudio', () => ({ synthesizePodcastAudio: vi.fn(), podcastAudioErrorMessage: () => 'Voz natural indisponível' }));
vi.mock('../hooks/usePersonalPodcasts', () => ({ usePersonalPodcasts: () => { const [episodes, set] = useState<any[]>([]); return { episodes, saveEpisode: async (ep: any) => set(old => [ep, ...old]) }; } }));
afterEach(cleanup);
beforeEach(() => {
  vi.spyOn(HTMLMediaElement.prototype, 'pause').mockImplementation(() => {});
  vi.spyOn(HTMLMediaElement.prototype, 'play').mockResolvedValue();
  URL.createObjectURL = vi.fn(() => 'blob:podcast'); URL.revokeObjectURL = vi.fn();
  vi.mocked(requestAiTextStream).mockResolvedValue({ text: 'Host1: Vamos aprender.\nHost2: Explique um exemplo.' });
  vi.mocked(synthesizePodcastAudio).mockResolvedValue(new Blob(['audio']));
});
it('gera usando escolhas de duração, foco e material; mantém a configuração do episódio no áudio', async () => {
  render(<Podcast />);
  fireEvent.change(screen.getByLabelText('Título do episódio'), { target: { value: 'Osmose do zero' } });
  fireEvent.change(screen.getByLabelText('Duração aproximada em minutos'), { target: { value: '12' } });
  fireEvent.change(screen.getByLabelText('Seu material de estudo'), { target: { value: 'A membrana é seletiva.' } });
  fireEvent.change(screen.getByLabelText('O que você quer aprender?'), { target: { value: 'Explique osmose com exemplos' } });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar meu podcast' }));
  await waitFor(() => expect(requestAiTextStream).toHaveBeenCalled());
  expect(vi.mocked(requestAiTextStream).mock.calls[0][1]).toMatchObject({ speakers: 2, durationMinutes: 12, sourceText: expect.stringContaining('membrana é seletiva'), focus: 'Explique osmose com exemplos' });
  fireEvent.click(await screen.findByRole('button', { name: 'Reproduzir episódio Osmose do zero' }));
  await waitFor(() => expect(synthesizePodcastAudio).toHaveBeenCalled());
  expect(vi.mocked(synthesizePodcastAudio).mock.calls[0][2]).toMatchObject({ speakers: 2, secondVoice: 'Puck' });
  expect(await screen.findByLabelText('Velocidade de reprodução')).toBeInTheDocument();
});
it('mostra falha de geração sem disponibilizar roteiro incompleto', async () => {
  vi.mocked(requestAiTextStream).mockImplementation(async (_ep, _payload, delta) => { delta('Trecho parcial'); throw new Error('Serviço indisponível'); });
  render(<Podcast />);
  fireEvent.change(screen.getByLabelText('Título do episódio'), { target: { value: 'Teste' } });
  fireEvent.click(screen.getByRole('button', { name: 'Gerar meu podcast' }));
  expect(await screen.findByRole('alert')).toHaveTextContent('Serviço indisponível');
  expect(screen.queryByRole('button', { name: 'Reproduzir episódio Teste' })).not.toBeInTheDocument();
});
it('uma pessoa oculta a segunda voz e vozes iguais impedem gerar diálogo', () => {
  render(<Podcast />);
  fireEvent.change(screen.getByLabelText('Voz da pessoa 2'), { target: { value: 'Kore' } });
  expect(screen.getByRole('button', { name: 'Gerar meu podcast' })).toBeDisabled();
  fireEvent.click(screen.getByRole('button', { name: 'Uma pessoa' }));
  expect(screen.queryByLabelText('Voz da pessoa 2')).not.toBeInTheDocument();
});
