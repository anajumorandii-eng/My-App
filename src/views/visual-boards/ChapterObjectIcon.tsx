import React, { useId } from 'react';
import models from './chapterIconModels.json';
import { chapterIconGeometry } from './chapterIconGeometry';

export const chapterIconModels: Record<string, {model: string; context: string; label: string}> = models;
const contextPaths: Record<string,string> = {
  dna:'M2 1q12 4 0 8t0 8M14 1q-12 4 0 8t0 8M5 4h6M4 9h8M5 14h6',
  sun:'M8 1v2m0 12v2M1 9h2m12 0h2M3 3l2 2m7 8 2 2M3 15l2-2m7-8 2-2M8 5a4 4 0 1 0 0 8 4 4 0 1 0 0-8',
  drop:'M8 1Q1 9 2 12a6 6 0 0 0 12 0Q15 9 8 1Z',
  arrow:'M2 9h13m-5-5 5 5-5 5',plus:'M2 9h13M8 3v12',minus:'M2 9h13',
  chart:'M2 15V9m6 6V5m6 10V1',globe:'M1 9a7 7 0 1 0 14 0 7 7 0 1 0-14 0M8 2q-7 7 0 14 7-7 0-14M1 9h14',
  quote:'M2 12V5h5v7H2Zm8 0V5h5v7h-5Z',link:'M6 3H3v9h6V9m2 6h3V6H8v3M5 8h6',
  balance:'M8 2v13M3 5h10M1 11l2-6 3 6ZM10 11l3-6 3 6Z',spark:'M9 1 2 10h6l-1 7 8-10H9Z',
  angle:'M2 2v13h13M2 10h5v5',question:'M3 5q0-6 8-3 5 3-3 6v3M8 15v1',people:'M2 15v-4q6-6 12 0v4M8 2a3 3 0 1 0 0 6 3 3 0 1 0 0-6',
};

/** O ID escolhe o objeto curado; a sombra, o bisel e os materiais dão volume sem animação ornamental. */
export function ChapterObjectIcon({chapterId}: {chapterId: string}) {
  const uid = useId().replace(/:/g, '');
  const config = chapterIconModels[chapterId];
  const art = config && chapterIconGeometry[config.model];
  if (!art) return null;
  const copper = `url(#${uid}-copper)`,metal = `url(#${uid}-metal)`,jade = `url(#${uid}-jade)`;
  return <svg className="vs-object-icon vs-chapter-object" viewBox="0 0 80 80" aria-hidden="true"
    data-chapter-object={chapterId} data-study-object={config.model} data-object-context={config.context}>
    <defs>
      <linearGradient id={`${uid}-copper`} x1="0" y1="0" x2=".9" y2="1"><stop stopColor="#fae2b4"/><stop offset=".35" stopColor="#e8ba78"/><stop offset=".7" stopColor="#be884e"/><stop offset="1" stopColor="#805735"/></linearGradient>
      <linearGradient id={`${uid}-metal`} x1="0" y1="0" x2="1" y2="1"><stop stopColor="#e2eeea"/><stop offset=".35" stopColor="#b9cdd0"/><stop offset=".72" stopColor="#74999f"/><stop offset="1" stopColor="#385d69"/></linearGradient>
      <linearGradient id={`${uid}-jade`} x1="0" y1="0" x2=".8" y2="1"><stop stopColor="#e1e8b3"/><stop offset=".4" stopColor="#a6bc8f"/><stop offset="1" stopColor="#4e7863"/></linearGradient>
      <filter id={`${uid}-shadow`} x="-30%" y="-30%" width="160%" height="170%"><feDropShadow dx="0" dy="3" stdDeviation="1.5" floodColor="#252a25" floodOpacity=".28"/></filter>
    </defs>
    <ellipse cx="38" cy="69" rx="28" ry="5" fill="#272c26" opacity=".13"/>
    <g transform="translate(5 5)" filter={`url(#${uid}-shadow)`} strokeLinejoin="round" strokeLinecap="round">
      {art.paths.map((d,i)=><path key={i} d={d} fill={i%2===0?copper:metal} stroke="#826c4f" strokeWidth=".7"/>)}
      {art.circles?.map(([cx,cy,r],i)=><circle key={i} cx={cx} cy={cy} r={r} fill={i%2===0?jade:metal} stroke="#58776b" strokeWidth=".7"/>)}
      {art.lines?.map((d,i)=><path key={i} d={d} fill="none" stroke="#4c6a70" strokeWidth="2"/>)}
      {art.symbol&&<text x="32" y="37" textAnchor="middle" fontFamily="Georgia,serif" fontSize="24" fontWeight="700" fill="#435e65">{art.symbol}</text>}
    </g>
    {contextPaths[config.context]&&<g transform="translate(59 51)">
      <path d="m-4-2 13-3 13 3v19l-13 4-13-4Z" fill={metal} stroke="#66858b" strokeWidth=".6"/>
      <path d={contextPaths[config.context]} fill="none" stroke="#fbf0d5" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
    </g>}
  </svg>;
}
