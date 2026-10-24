import { act, renderHook, waitFor } from '@testing-library/react';
import { beforeEach, expect, it, vi } from 'vitest';
const remote = vi.hoisted(() => ({ load: vi.fn(), save: vi.fn() }));
vi.mock('../lib/strategyGuides', async () => ({ ...await vi.importActual('../lib/strategyGuides'), loadStrategyGuides: remote.load, saveStrategyGuide: remote.save }));
import { useStrategyGuides } from './useStrategyGuides';
import { cacheStrategyGuides, readStrategyGuides, type StrategyGuide } from '../lib/strategyGuides';
const guide: StrategyGuide = { key: 'one', subject: 'Biologia', topicId: 'bio', topicName: 'Fisiologia', chapter: '', board: 'FUVEST', text: 'Conteúdo antigo', savedAt: '2025-01-01T00:00:00Z' };
beforeEach(() => { localStorage.clear(); remote.load.mockReset().mockResolvedValue({}); remote.save.mockReset().mockResolvedValue(undefined); });

it('exclui só o material escolhido, sincroniza abas e permite gerar outro com a mesma chave', async () => {
  cacheStrategyGuides(null, { one: guide, two: { ...guide, key: 'two' } });
  const first = renderHook(() => useStrategyGuides(null));
  const second = renderHook(() => useStrategyGuides(null));
  await act(() => first.result.current.remove('one'));
  expect(Object.keys(first.result.current.guides)).toEqual(['two']);
  expect(Object.keys(second.result.current.guides)).toEqual(['two']);
  expect(readStrategyGuides(null).one).toMatchObject({ text: '', deletedAt: expect.any(String) });
  act(() => cacheStrategyGuides(null, { one: guide }));
  expect(first.result.current.guides.one).toBeUndefined();
  expect(readStrategyGuides(null).one.deletedAt).toBeTruthy();
  await act(() => first.result.current.persist(guide));
  expect(first.result.current.guides.one).toBeUndefined();
  first.unmount(); second.unmount();
  const reopened = renderHook(() => useStrategyGuides(null));
  expect(reopened.result.current.guides.one).toBeUndefined();
  const newer = { ...guide, text: 'Nova versão', savedAt: new Date(Date.now() + 1000).toISOString() };
  await act(() => reopened.result.current.persist(newer));
  expect(reopened.result.current.guides.one.text).toBe('Nova versão');
});

it('uma leitura remota atrasada não restaura o material excluído', async () => {
  let finish!: (value: Record<string, StrategyGuide>) => void;
  remote.load.mockImplementationOnce(() => new Promise(resolve => { finish = resolve; }));
  cacheStrategyGuides('A', { one: guide });
  const hook = renderHook(() => useStrategyGuides('A'));
  await act(() => hook.result.current.remove('one'));
  expect(remote.save).toHaveBeenCalledWith('A', expect.objectContaining({ key: 'one', text: '', deletedAt: expect.any(String) }));
  await act(async () => finish({ one: guide }));
  expect(hook.result.current.guides.one).toBeUndefined();
  expect(readStrategyGuides('A').one.deletedAt).toBeTruthy();
  expect(readStrategyGuides('B')).toEqual({});
});

it('falha da conta mantém o guia e permite repetir a exclusão', async () => {
  cacheStrategyGuides('A', { one: guide });
  const hook = renderHook(() => useStrategyGuides('A'));
  await waitFor(() => expect(hook.result.current.loading).toBe(false));
  remote.save.mockRejectedValueOnce(new Error('offline'));
  await act(async () => { await expect(hook.result.current.remove('one')).rejects.toThrow('offline'); });
  expect(hook.result.current.guides.one.text).toBe(guide.text);
  expect(readStrategyGuides('A').one.deletedAt).toBeUndefined();
  await act(() => hook.result.current.remove('one'));
  expect(hook.result.current.guides.one).toBeUndefined();
});
