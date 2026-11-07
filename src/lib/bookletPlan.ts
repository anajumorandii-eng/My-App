export type BookletMode = 'integrated' | 'separate';
export type BookletSlot = number | 'front' | 'back' | null;
export type BookletMetadata = { layoutVersion: 2; mode: BookletMode; contentPages: number; blankPages: number; sheets: number; coverSheets: number };

/** Páginas de leitura, antes de qualquer imposição. Os números identificam somente o miolo. */
export function bookletPrintPlan(contentPages: number, mode: BookletMode) {
 if (!Number.isInteger(contentPages) || contentPages < (mode === 'separate' ? 1 : 0) || contentPages > 399 || !['integrated','separate'].includes(mode)) throw new Error('Quantidade de páginas ou formato de livreto inválido.');
 const padding = (4 - contentPages % 4) % 4;
 const body: BookletSlot[] = Array.from({length:contentPages},(_,index)=>index);
 body.push(...Array<null>(padding).fill(null));
 const logical: BookletSlot[] = mode === 'integrated' ? ['front',null,...body,null,'back'] : body;
 const sides: BookletSlot[][] = [];
 for (let sheet=0;sheet<logical.length/4;sheet++) {
  sides.push([logical[logical.length-1-sheet*2],logical[sheet*2]]);
  sides.push([logical[sheet*2+1],logical[logical.length-2-sheet*2]]);
 }
 const metadata: BookletMetadata = {layoutVersion:2,mode,contentPages,blankPages:padding+(mode==='integrated'?2:0),sheets:logical.length/4,coverSheets:mode==='separate'?1:0};
 return {...metadata,logical,sides};
}

export function validateBookletMetadata(value: unknown): BookletMetadata {
 const data=value as BookletMetadata;
 if (!data || data.layoutVersion!==2) throw new Error('Metadados de livreto inválidos.');
 const plan=bookletPrintPlan(data.contentPages,data.mode);
 if (data.blankPages!==plan.blankPages || data.sheets!==plan.sheets || data.coverSheets!==plan.coverSheets) throw new Error('Contagem de páginas de livreto inválida.');
 return {layoutVersion:2,mode:plan.mode,contentPages:plan.contentPages,blankPages:plan.blankPages,sheets:plan.sheets,coverSheets:plan.coverSheets};
}
export const bookletMetadataPrefix='CRIVO_BOOKLET_V2:';
