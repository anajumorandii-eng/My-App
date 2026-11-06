import {afterEach,expect,it} from 'vitest';
import {readingPreferences,READING_PREFERENCES_KEY} from '../lib/readingPreferences';
afterEach(()=>localStorage.removeItem(READING_PREFERENCES_KEY));
it('valida aparência salva e limita tamanhos sem ler ou alterar progresso de estudo',()=>{
 localStorage.setItem('juju_summary_progress_v1','progresso-preservado');
 localStorage.setItem(READING_PREFERENCES_KEY,JSON.stringify({theme:'night',fontSize:500,showIndex:false}));
 expect(readingPreferences()).toEqual({theme:'night',fontSize:26,showIndex:false});
 localStorage.setItem(READING_PREFERENCES_KEY,'{invalid');expect(readingPreferences().theme).toBe('paper');
 expect(localStorage.getItem('juju_summary_progress_v1')).toBe('progresso-preservado');localStorage.removeItem('juju_summary_progress_v1');
});
