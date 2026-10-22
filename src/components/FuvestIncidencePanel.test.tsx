import { fireEvent, render, screen } from '@testing-library/react';
import { expect, it, vi } from 'vitest';
import { FuvestIncidencePanel } from './FuvestIncidencePanel';
import * as analysis from '../lib/fuvestIncidence';

it('separa a primeira fase, Medicina e o banco completo sem trocar denominadores',async()=>{
 render(<FuvestIncidencePanel subject="Biologia"/>);
 expect(await screen.findByText('1135')).toBeInTheDocument();
 fireEvent.click(screen.getByRole('button',{name:'Recorte recente (2022–2026)'}));
 expect(screen.getByRole('combobox',{name:'Recorte da prova'})).toHaveValue('1a');
 fireEvent.change(screen.getByRole('combobox',{name:'Recorte da prova'}),{target:{value:'medicina'}});
 expect(screen.getByText('15/15')).toBeInTheDocument();
 expect(screen.getAllByText('5/15').length).toBeGreaterThan(0);
 fireEvent.click(screen.getByRole('checkbox',{name:'Panorama de todas as matérias'}));
 expect(screen.getByText('60/60')).toBeInTheDocument();
 fireEvent.change(screen.getByRole('combobox',{name:'Recorte da prova'}),{target:{value:'2a-dia2'}});
 expect(screen.getByText('180/180')).toBeInTheDocument();
});

it('abre o caminho de uma questão real com fonte e estratégia, e exporta a auditoria',async()=>{
 render(<FuvestIncidencePanel subject="Biologia"/>);
 await screen.findByText('1135');
 fireEvent.click(screen.getByRole('button',{name:'Recorte recente (2022–2026)'}));
 const ecology=await screen.findByRole('button',{name:'Ecologia'});fireEvent.click(ecology);
 expect(screen.getByText(/14 questões encontradas/)).toBeInTheDocument();
 const summaries=screen.getAllByText(/2026.*questão/);fireEvent.click(summaries[0]);
 expect(screen.getAllByText('Erro a evitar:').length).toBeGreaterThan(0);
 expect(screen.getAllByRole('link',{name:/Enunciado oficial/})[0]).toHaveAttribute('href',expect.stringContaining('fuvest.br'));
 fireEvent.click(screen.getByText('Método, cobertura, fontes e arquivos de auditoria'));
 expect(screen.getByRole('link',{name:'Baixar classificação completa em CSV'})).toHaveAttribute('href','/analises/fuvest/questoes-2017-2026.csv');
});

it('não inventa percentuais quando a carga falha e permite tentar novamente',async()=>{
 const actual=await analysis.loadFuvestCorpus();
 const spy=vi.spyOn(analysis,'loadFuvestCorpus').mockRejectedValueOnce(new Error('offline')).mockResolvedValue(actual);
 render(<FuvestIncidencePanel subject="Química"/>);
 expect(await screen.findByRole('alert')).toHaveTextContent('Nenhum percentual foi estimado');
 expect(screen.queryByText('1135')).toBeNull();
 fireEvent.click(screen.getByRole('button',{name:'Tentar carregar novamente'}));
 expect(await screen.findByText('1135')).toBeInTheDocument();spy.mockRestore();
});

it('separa fase antiga sem cobertura e oferece comparação descritiva dos períodos',async()=>{
 const actual=await analysis.loadFuvestCorpus();
 const example=actual.questions.find(q=>q.phase==='1a'&&q.subject==='Biologia')!;
 const paper=actual.papers.find(p=>p.id===example.paperId)!;
 const data={...actual,years:[2017,2022],papers:[{...paper,id:'old',year:2017},{...paper,id:'recent',year:2022}],questions:[{...example,id:'old:01',paperId:'old',year:2017},{...example,id:'recent:01',paperId:'recent',year:2022}]};
 const spy=vi.spyOn(analysis,'loadFuvestCorpus').mockResolvedValue(data);
 render(<FuvestIncidencePanel subject="Biologia"/>);
 expect(await screen.findByText('2')).toBeInTheDocument();
 fireEvent.change(screen.getByRole('combobox',{name:'Até o vestibular'}),{target:{value:'2017'}});
 fireEvent.change(screen.getByRole('combobox',{name:'Recorte da prova'}),{target:{value:'2a-dia1'}});
 expect(screen.getByText(/Fase ainda não classificada neste período/)).toBeInTheDocument();
 expect(screen.getByText('Comparar 2017–2021 com 2022–2026')).toBeInTheDocument();
 spy.mockRestore();
});
