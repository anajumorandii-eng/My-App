/** Gera as fontes editoriais usadas no motor a partir das análises versionadas. */
import { readFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const subjects=['Matemática','Biologia','Física','Química','Português','Literatura','História','Geografia','Filosofia','Sociologia','Inglês','Arte'];
const entries=[];
for(const filename of ['aulas-videos-2026.md','padroes-de-questao.md']){
 const sourcePath=`docs/estudos-2026/enem-incidencia/${filename}`;
 const raw=await readFile(sourcePath,'utf8');
 const sourceSha256=createHash('sha256').update(raw).digest('hex');
 for(const section of raw.split(/^## /m).slice(1)){
  const newline=section.indexOf('\n'),title=section.slice(0,newline),content=section.slice(newline+1).trim();
  let own;
  if(filename.startsWith('aulas')){
   if(/^(Vídeo 1 |Vídeo 7 )/.test(title))own=subjects.slice(0,4);
   else if(/^(Vídeos 2|Vídeo 6)/.test(title))own=subjects.slice(4);
   else if(title.startsWith('Vídeo 4'))own=['Biologia'];
   else if(/^(Vídeo 5|Conferência)/.test(title))own=['Biologia','Química','Geografia'];
   else if(title.startsWith('Vídeo 8'))own=['Matemática'];
   else continue;
  }else{
   const match=title.match(/^(\d+)\./);if(!match)continue;
   const n=Number(match[1]);own=[1,7,9,13].includes(n)?subjects.slice(0,4):[2,3,4,5,10].includes(n)?['Matemática']:[8,11,12].includes(n)?subjects.slice(4):['Biologia','Química','Física'];
  }
  entries.push({id:`EG${entries.length+1}`,title,subjects:own,content,sourcePath,sourceSha256});
 }
}
await writeFile('src/data/enemStudyGuidance.json',JSON.stringify({reviewedOn:'2026-11-02',entries},null,2)+'\n');
console.log(`${entries.length} análises editoriais ENEM disponíveis para geração.`);
