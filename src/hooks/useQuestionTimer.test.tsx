import { act, cleanup, renderHook } from '@testing-library/react';
import { afterEach, beforeEach, expect, it, vi } from 'vitest';
import { useQuestionTimer } from './useQuestionTimer';
beforeEach(()=>vi.useFakeTimers());
afterEach(()=>{cleanup();vi.useRealTimers();vi.restoreAllMocks()});
it('mede intervalos reais, congela no envio e impede conclusão duplicada',()=>{
 const {result}=renderHook(()=>useQuestionTimer('q1',true));
 act(()=>vi.advanceTimersByTime(12350));
 expect(result.current.seconds).toBe(12);
 let saved;act(()=>{saved=result.current.finish()});
 expect(saved).toMatchObject({durationSeconds:12,startedAt:expect.any(String),completedAt:expect.any(String)});
 act(()=>vi.advanceTimersByTime(60000));expect(result.current.seconds).toBe(12);
 expect(result.current.finish()).toBeNull();
});
it('exclui pausa manual e aba oculta, sem retomar uma pausa manual ao voltar',()=>{
 let hidden=false;vi.spyOn(document,'hidden','get').mockImplementation(()=>hidden);
 const {result}=renderHook(()=>useQuestionTimer('q1',true));
 act(()=>vi.advanceTimersByTime(5000));
 act(()=>result.current.togglePause());act(()=>vi.advanceTimersByTime(20000));
 act(()=>{hidden=true;document.dispatchEvent(new Event('visibilitychange'))});
 act(()=>{hidden=false;document.dispatchEvent(new Event('visibilitychange'))});
 expect(result.current.manualPause).toBe(true);expect(result.current.running).toBe(false);
 act(()=>result.current.togglePause());act(()=>vi.advanceTimersByTime(4000));
 act(()=>{hidden=true;document.dispatchEvent(new Event('visibilitychange'))});act(()=>vi.advanceTimersByTime(50000));
 expect(result.current.seconds).toBe(9);
 act(()=>{hidden=false;document.dispatchEvent(new Event('visibilitychange'))});act(()=>vi.advanceTimersByTime(3000));
 expect(result.current.seconds).toBe(12);
});
it('reinicia ao trocar de questão/conta ou repetir a mesma e não cronometra consulta anulada',()=>{
 const {result,rerender}=renderHook(({id,enabled})=>useQuestionTimer(id,enabled),{initialProps:{id:'a:q1',enabled:true}});
 act(()=>vi.advanceTimersByTime(5000));act(()=>result.current.finish());
 act(()=>result.current.restart());expect(result.current.seconds).toBe(0);expect(result.current.running).toBe(true);
 act(()=>vi.advanceTimersByTime(10000));rerender({id:'b:q1',enabled:true});expect(result.current.seconds).toBe(0);
 rerender({id:'b:q2',enabled:false});act(()=>vi.advanceTimersByTime(60000));expect(result.current.seconds).toBe(0);expect(result.current.finish()).toBeNull();
});
