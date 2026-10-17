import { act, renderHook } from '@testing-library/react';
import { beforeEach, afterEach, expect, it, vi } from 'vitest';
import { isText, useStudyDraft } from './useStudyDraft';

const auth = vi.hoisted(() => ({ uid: 'a' as string | null }));
vi.mock('../context/AuthContext', () => ({ useAuth: () => ({ user: auth.uid ? { uid: auth.uid } : null }) }));
beforeEach(() => { localStorage.clear(); auth.uid = 'a'; });
afterEach(() => vi.restoreAllMocks());

it('persiste imediatamente e restaura ao remontar, separando assunto e conta', () => {
  const first = renderHook(({ scope }) => useStudyDraft(scope, '', isText), { initialProps: { scope: 'genetica' } });
  act(() => first.result.current[1]('Minha explicação.'));
  expect(first.result.current[2]).toBe('saved');
  first.rerender({ scope: 'ecologia' });
  expect(first.result.current[0]).toBe('');
  first.rerender({ scope: 'genetica' });
  expect(first.result.current[0]).toBe('Minha explicação.');
  auth.uid = 'b'; first.rerender({ scope: 'genetica' });
  expect(first.result.current[0]).toBe('');
  first.unmount(); auth.uid = 'a';
  const restored = renderHook(() => useStudyDraft('genetica', '', isText));
  expect(restored.result.current[0]).toBe('Minha explicação.');
});

it('ignora respostas tardias de outro assunto, conta e componente desmontado', () => {
  const first = renderHook(({ scope }) => useStudyDraft(scope, '', isText), { initialProps: { scope: 'a' } });
  const oldSetter = first.result.current[1];
  first.rerender({ scope: 'b' });
  act(() => oldSetter('Resposta atrasada'));
  expect(first.result.current[0]).toBe('');
  const setter = first.result.current[1]; first.unmount();
  setter('Depois de sair');
  expect(localStorage.length).toBe(0);
});

it('mantém o texto aberto quando a quota impede a gravação', () => {
  const { result } = renderHook(() => useStudyDraft('a', '', isText));
  vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => { throw Error('quota'); });
  act(() => result.current[1]('Não perder este texto'));
  expect(result.current[0]).toBe('Não perder este texto');
  expect(result.current[2]).toBe('unavailable');
});

it('rejeita conteúdo corrompido sem derrubar a tela', () => {
  localStorage.setItem('crivo_study_draft_v1:a:a', '{');
  const { result } = renderHook(() => useStudyDraft('a', '', isText));
  expect(result.current[0]).toBe('');
  expect(result.current[2]).toBe('unavailable');
});
