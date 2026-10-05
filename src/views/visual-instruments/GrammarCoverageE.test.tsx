import React from 'react';
import {render} from '@testing-library/react';
import {it,expect,vi} from 'vitest';
import {grammarInstrument} from './GrammarInstrument';
import type {GrammarInstrumentId} from '../../lib/grammarInstrumentLab';
import {interactiveSummaries} from '../../data/interactiveSummaries';
import {buildVisualMap} from '../../lib/visualStudy';
const cases:Array<[GrammarInstrumentId,string,string[]]>=[
 ['language-system','lingua-um-sistema-complexo',['norma-padrão','adequação','não mede inteligência']],
 ['text-type','tipos-de-texto-explorando-elementos-concretos-e-conceitos-abstratos',['laboratório','acesso','não prova todos']],
 ['adverb-circumstance','adverbio-e-locucoes-adverbiais-circunstanciadores',['Só Ana','Ana só','modalização']],
 ['word-formation','processos-de-formacao-de-palavras',['passatempo','planalto','fotografia','pescar']],
 ['verb-syntax','verbo-e-sintaxe-da-oracao',['chegaram cansados','considerou','predicativo do objeto']],
 ['government','mecanismo-de-regencia',['depende de','de quem','aspirar o aroma','aspirar ao cargo']],
 ['pronoun-reference','pronomes',['Não me','oblíquo','próclise']],
 ['verbal-voice','vozes-verbais',['Apagam-se arquivos','Trabalha-se com arquivos','indetermina']],
 ['adverbial-clause','oracoes-adverbiais',['tão','que','consequência']],
 ['clause-relations','oracoes-coordenadas',['Feche a janela','Vim cedo','explica a orientação']],
 ['lexical-context','o-lexico-em-contexto-variadas-possibilidades-semanticas',['rosa','flor','sinônimos','antônimos']],
 ['comma-scope','pontuacao-i-principios-para-o-uso-da-virgula',['Ana, revise','sujeito','não separar']],
 ['verbal-aspect','verbo',['segundo uma funcionária','se houvesse quórum','fonte','condição']],
 ['clause-punctuation','pontuacao-ii-virgula-entre-oracoes-e-outros-sinais-de-pontuacao',['Se o pedido chegar hoje,','informou que','complemento']],
 ['adjective-clause','oracoes-adjetivas',['de cujas pinturas','gosto de','concorda']],
 ['noun-class','substantivo-os-nomes-e-a-visao-do-enunciador',['manifestantes','baderneiros','avaliação']],
];
it.each(cases)('%s representa a aplicação central ensinada no texto e no recall',(id,chapter,terms)=>{
 const summary=interactiveSummaries.find(s=>s.id===`summary-gramatica-${chapter}`)!;
 const Board=grammarInstrument(id);const view=render(<Board map={buildVisualMap(summary)} states={{}} selectedId={null} onSelect={vi.fn()} hiddenEdgeIds={[]} mode="explorar"/>);
 const operation=view.container.querySelector(`[data-grammar-application="${id}"]`);
 expect(operation).not.toBeNull();for(const term of terms)expect(operation).toHaveTextContent(term);
 expect(operation!.querySelectorAll('path,line').length).toBeGreaterThan(0);
 view.unmount();
});
