import {fireEvent,render,screen} from '@testing-library/react';
import {expect,it,vi} from 'vitest';
import {BoardIncidencePanel} from './BoardIncidencePanel';
import * as research from '../lib/boardIncidence';
import type {BoardCorpus,BoardQuestion} from '../lib/boardIncidence';
const q=(number:string,changes:Partial<BoardQuestion>={}):BoardQuestion=>({id:`a:${number}`,paperId:'a',board:'FAMERP',year:2026,phase:'Conhecimentos gerais',number,page:2,subject:'Biologia',topicId:'bio_ecologia',topic:'Ecologia',subtopics:['Cadeias alimentares'],skills:['inferencia_causal'],relatedSubjects:['Química'],relatedTopicIds:[],summary:'Compara energia em uma cadeia alimentar',rationale:'É preciso comparar a energia entre níveis tróficos',strategy:['Identifique produtores','Aplique as perdas entre níveis'],trap:'Inverter o fluxo energético',confidence:'high',reviewNote:'',excluded:false,excludedReason:'',subitems:[],...changes});
const fixture:BoardCorpus={board:'FAMERP',reviewedOn:'2026-10-21',reviewType:'Fixture editorial',coverageNote:'Prova completa no recorte de teste',years:[2026],papers:[{id:'a',board:'FAMERP',year:2026,group:'conhecimentos-gerais',phase:'Conhecimentos gerais',phaseGroup:'1a',format:'multiple-choice',version:'V1',sourceUrl:'https://documento.vunesp.com.br/prova.pdf',answerKeyUrl:'https://documento.vunesp.com.br/gabarito.pdf',sha256:'a'.repeat(64),answerKeySha256:'b'.repeat(64),pages:2,expectedQuestions:2,classifiedQuestions:2}],questions:[q('01'),q('02',{excluded:true,excludedReason:'Anulada'})]};
it('mostra denominador válido, estratégia específica e arquivos da banca',async()=>{
 const spy=vi.spyOn(research,'loadBoardCorpus').mockResolvedValue(fixture);
 render(<BoardIncidencePanel board="FAMERP" subject="Biologia"/>);
 expect(await screen.findByText('1/2')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Ecologia'}));
 fireEvent.click(screen.getByText(/2026.*questão 01/));
 expect(screen.getByText('Aplique as perdas entre níveis')).toBeInTheDocument();
 expect(screen.getByRole('link',{name:'Enunciado da prova · página 2'})).toHaveAttribute('href',expect.stringContaining('#page=2'));
 fireEvent.click(screen.getByText('Cobertura, fontes e arquivos'));
 expect(screen.getByRole('link',{name:'Baixar questões e estratégias'})).toHaveAttribute('href','/analises/incidencia/famerp/questoes.csv');
 spy.mockRestore();
});
it('não estima percentuais quando a fonte de dados falha',async()=>{
 const spy=vi.spyOn(research,'loadBoardCorpus').mockRejectedValue(new Error('offline'));
 render(<BoardIncidencePanel board="ENEM" subject="Biologia"/>);
 expect(await screen.findByRole('alert')).toHaveTextContent('Nenhum percentual foi estimado');
 expect(screen.queryByRole('table')).toBeNull();
 spy.mockRestore();
});

it('explicita anos adiados e permite consultar ausência de cobertura sem percentual',async()=>{
 const spy=vi.spyOn(research,'loadBoardCorpus').mockResolvedValue({...fixture,plannedYears:[2025,2026]});
 render(<BoardIncidencePanel board="FAMERP" subject="Biologia"/>);
 expect(await screen.findByRole('note')).toHaveTextContent('Anos ainda não classificados: 2025');
 fireEvent.change(screen.getByLabelText('Do vestibular'),{target:{value:'2025'}});
 expect(screen.getByRole('table')).toHaveTextContent('Não classificado');
 fireEvent.change(screen.getByLabelText('Até o vestibular'),{target:{value:'2025'}});
 expect(screen.getByText('Este formato não está classificado no período selecionado. Não há denominador.')).toBeInTheDocument();
 expect(screen.queryByText(/NaN%|Infinity%/)).toBeNull();
 spy.mockRestore();
});
