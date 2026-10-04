import type {ReactNode} from 'react';
/** Um caso próprio e as leituras que o desenho permite comparar. */
export interface ContrastPlate {
 chapterId:string;
 context:string;
 annotation:string;
 positions:{reading:string;focus:string[]}[];
 illustration:(focus:number|null)=>ReactNode;
}
