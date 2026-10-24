import { beforeEach, expect, it, vi } from 'vitest';
import { clearReviewReloadSelection, readReviewReloadSelection, saveReviewReloadSelection } from '../lib/reviewReloadRecovery';
import { normalizeReviewOptions } from '../lib/strategicReview';
beforeEach(()=>{sessionStorage.clear();vi.restoreAllMocks();});
const selection={subject:'Biologia',topicId:'bio_fisiologia',chapter:'Circulação',options:normalizeReviewOptions({boards:['FUVEST'],depth:'deep'}),openedKey:'saved-guide',configurationOpen:false};
it('isola a retomada por conta e a mantém disponível até a tela consumir',()=>{
 saveReviewReloadSelection('A',selection);
 expect(readReviewReloadSelection('B')).toBeUndefined();
 expect(readReviewReloadSelection(null)).toBeUndefined();
 expect(readReviewReloadSelection('A')).toMatchObject(selection);
 expect(readReviewReloadSelection('A')).toMatchObject(selection);
 clearReviewReloadSelection('A');expect(readReviewReloadSelection('A')).toBeUndefined();
});
it('ignora retomadas antigas e dados inválidos',()=>{
 vi.spyOn(Date,'now').mockReturnValue(1000);
 saveReviewReloadSelection(null,selection);
 vi.spyOn(Date,'now').mockReturnValue(302000);
 expect(readReviewReloadSelection(null)).toBeUndefined();
 sessionStorage.setItem('crivo:review-reload:v1:guest','{invalid');
 expect(readReviewReloadSelection(null)).toBeUndefined();
 sessionStorage.setItem('crivo:review-reload:v1:guest',JSON.stringify({...selection,savedAt:302000,options:null}));
 expect(readReviewReloadSelection(null)).toBeUndefined();
});
it('a falta de armazenamento não impede a atualização do aplicativo',()=>{
 vi.spyOn(Storage.prototype,'setItem').mockImplementation(()=>{throw new Error('Unavailable');});
 expect(()=>saveReviewReloadSelection(null,selection)).not.toThrow();
 expect(readReviewReloadSelection(null)).toBeUndefined();
});
