import { act, renderHook, waitFor } from '@testing-library/react';
import { it, expect, vi } from 'vitest';
const repository=vi.hoisted(()=>({load:vi.fn(),save:vi.fn()}));
const auth=vi.hoisted(()=>({user:{uid:'A'}}));
vi.mock('../context/AuthContext',()=>({useAuth:()=>auth}));
vi.mock('../lib/userData',()=>({getUserMastery:repository.load,updateUserMastery:repository.save}));
import { useUserMastery } from './useUserMastery';
import { notifyStudyData } from '../lib/studyDataEvents';
it('atualiza uma instância montada depois de uma prática e rejeita uma leitura anterior',async()=>{
 repository.load.mockResolvedValue([{topicId:'t',level:10}]);
 const {result}=renderHook(()=>useUserMastery());
 await waitFor(()=>expect(result.current.mastery[0]?.level).toBe(10));
 let oldResolve!:(value:unknown)=>void;
 repository.load.mockImplementationOnce(()=>new Promise(resolve=>{oldResolve=resolve;}));
 act(()=>notifyStudyData('A','mastery'));
 await waitFor(()=>expect(oldResolve).toBeDefined());
 repository.load.mockResolvedValue([{topicId:'t',level:60}]);
 act(()=>notifyStudyData('A','mastery'));
 await waitFor(()=>expect(result.current.mastery[0]?.level).toBe(60));
 await act(async()=>oldResolve([{topicId:'t',level:20}]));
 expect(result.current.mastery[0].level).toBe(60);
 act(()=>notifyStudyData('B','mastery'));
 expect(result.current.mastery[0].level).toBe(60);
});

it('a leitura nova libera a atividade mesmo enquanto a leitura inicial está atrasada',async()=>{
 let initial!:(value:unknown)=>void;
 repository.load.mockImplementationOnce(()=>new Promise(resolve=>{initial=resolve;})).mockResolvedValue([{topicId:'t',level:60}]);
 const {result}=renderHook(()=>useUserMastery());
 act(()=>notifyStudyData('A','mastery'));
 await waitFor(()=>expect(result.current.mastery[0]?.level).toBe(60));
 expect(result.current.loading).toBe(false);
 expect(result.current.isPersisted).toBe(true);
 await act(async()=>initial([{topicId:'t',level:10}]));
 expect(result.current.mastery[0].level).toBe(60);
});
