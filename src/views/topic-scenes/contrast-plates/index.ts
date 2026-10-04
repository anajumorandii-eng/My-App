import {filosofiaPlates1} from './filosofia1';
import {filosofiaPlates2} from './filosofia2';
import {sociologiaPlates} from './sociologia';
export const CONTRAST_PLATES=[...filosofiaPlates1,...filosofiaPlates2,...sociologiaPlates];
export const contrastPlateFor=(id:string)=>CONTRAST_PLATES.find(p=>p.chapterId===id);
