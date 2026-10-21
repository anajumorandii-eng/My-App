import {useState} from 'react';
import {FuvestIncidencePanel} from './FuvestIncidencePanel';
import {BoardIncidencePanel} from './BoardIncidencePanel';
import type {ResearchBoard} from '../lib/boardIncidence';
export function ExamIncidenceExplorer({subject}:{subject:string}){
 const [board,setBoard]=useState<'FUVEST'|ResearchBoard>('FUVEST');
 return <div className="space-y-4"><label className="block text-sm ni-panel p-4">Banca da análise<select className="field block w-full mt-2" value={board} onChange={event=>setBoard(event.target.value as typeof board)}>{['FUVEST','ENEM','UNESP','FAMERP','UNIFESP'].map(value=><option key={value}>{value}</option>)}</select></label>{board==='FUVEST'?<FuvestIncidencePanel key={subject} subject={subject}/>:<BoardIncidencePanel key={`${board}-${subject}`} board={board} subject={subject}/>}</div>;
}
