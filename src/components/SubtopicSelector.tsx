import {useState} from 'react';
import {normalizeTopicCuts,subtopicsFor} from '../lib/topicCuts';
export function SubtopicSelector({topic,value,onChange,disabled=false}:{topic:{id:string;name:string;chapters?:string[]};value:string[];onChange:(value:string[])=>void;disabled?:boolean}){
 const [custom,setCustom]=useState('');
 const options=[...new Set([...subtopicsFor(topic),...value])];
 return <details className="mt-2 min-w-0"><summary className="min-h-11 cursor-pointer py-2 text-sm font-medium">Selecionar subtópicos de {topic.name}{value.length ? ` (${value.length})` : ''}</summary>
 <fieldset disabled={disabled} className="space-y-3 py-3"><legend className="sr-only">Subtópicos de {topic.name}</legend>
 <p className="text-xs text-[var(--dim)]">{value.length ? 'O material se concentrará nos recortes selecionados.' : 'Sem recortes selecionados: tópico completo.'}</p>
 <div className="grid gap-1 sm:grid-cols-2">{options.map(name=><label key={name} className="flex min-h-11 items-start gap-2 py-2 text-sm"><input className="mt-1" type="checkbox" checked={value.includes(name)} disabled={!value.includes(name)&&value.length>=8} onChange={e=>onChange(e.target.checked?[...value,name]:value.filter(item=>item!==name))}/><span className="min-w-0 break-words">{name}</span></label>)}</div>
 <div className="flex flex-wrap items-end gap-2"><label className="min-w-0 flex-1 text-sm">Recorte personalizado de {topic.name}<input className="field mt-1 block min-h-11 w-full" maxLength={180} value={custom} onChange={e=>setCustom(e.target.value)}/></label><button className="min-h-11 px-3 text-sm underline disabled:opacity-50" type="button" disabled={!custom.trim()||value.length>=8} onClick={()=>{onChange(normalizeTopicCuts({[topic.id]:[...value,custom]})[topic.id]??[]);setCustom('');}}>Adicionar recorte</button></div>
 {value.length>0&&<button type="button" className="min-h-11 text-sm underline" onClick={()=>onChange([])}>Usar tópico completo</button>}
 </fieldset></details>;
}
