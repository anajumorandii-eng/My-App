import type { SavedStudySelection } from './strategySelection';
const identity = (value:string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('pt-BR').trim().replace(/\s+/g,' ');
export function normalizeTopicCuts(value: unknown): Record<string,string[]> {
 if(!value || typeof value !== 'object' || Array.isArray(value))return {};
 return Object.fromEntries(Object.entries(value).slice(0,40).flatMap(([id,items])=>{
  if(!id || id.length>300 || !Array.isArray(items))return [];
  const seen=new Set<string>();const cuts=items.flatMap(item=>{if(typeof item!=='string')return [];const text=item.trim().replace(/\s+/g,' ').slice(0,180),key=identity(text);if(!key||seen.has(key))return [];seen.add(key);return [text];}).slice(0,8);
  return cuts.length ? [[id,cuts]] : [];
 }));
}
export function subtopicsFor(topic: {id:string;name:string;chapters?:string[]}): string[] {
 if(topic.id==='mat_geometria_plana')return ['Ângulos na circunferência','Comprimento da circunferência e de arcos','Área do círculo','Área de setores e segmentos circulares',...(topic.chapters??[]).filter(name=>!['Ângulos e Circunferências','Área do Círculo e de suas Partes'].includes(name))];
 return topic.chapters??[];
}
export function describeStudySelection(item: SavedStudySelection) {
 return `${item.topicName}: ${item.cuts?.length ? item.cuts.join(' + ') : item.chapter || 'tópico completo'}`;
}
/** Specific labels reuse the corresponding curriculum source without inventing a chapter. */
export function sourceChaptersForCuts(topic: {id:string;chapters?:string[]}, cuts:string[]): string[] {
 return [...new Set(cuts.map(cut=>topic.chapters?.find(name=>identity(name)===identity(cut)) ?? (topic.id==='mat_geometria_plana' ? ({'Ângulos na circunferência':'Ângulos e Circunferências','Área do círculo':'Área do Círculo e de suas Partes','Área de setores e segmentos circulares':'Área do Círculo e de suas Partes','Comprimento da circunferência e de arcos':'Ângulos e Circunferências'} as Record<string,string>)[cut] : undefined) ?? ''))];
}
