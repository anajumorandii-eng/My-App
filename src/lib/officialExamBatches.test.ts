import test from 'node:test';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { mockTopics } from '../data/mockData';
import type { Question } from '../types';
import { buildReviewedOfficialQuestions, type ReviewedExamItem } from './officialExamExpansion';
import { readOfficialAnswerKey, type OfficialBatchSource } from './officialAnswerKeys';
import { appendReviewedQuestions } from './officialExamImport';

const batches = [
  ['unicamp-2025-qz',71], ['fuvest-2026-v1',16], ['unesp-2025-v1',12],
  ['famerp-2025-v1',12], ['unifesp-2025-v1',12], ['enem-2022-d2-cd5',12],
] as const;
const hash = (bytes: Uint8Array | string) => createHash('sha256').update(bytes).digest('hex');
// `figures` é gravado depois, por scripts/extrair-figuras.py, a partir da
// página; não faz parte do que a revisão das provas gera nem do hash histórico.
const bank: Question[] = (JSON.parse(readFileSync('public/questions.json','utf8')) as Question[])
  .map(({ figures: _figures, ...q }) => q);
function load(slug: string) {
  const source: OfficialBatchSource = JSON.parse(readFileSync(`scripts/data/${slug}-source.json`,'utf8'));
  const items: ReviewedExamItem[] = JSON.parse(readFileSync(source.itemsFile,'utf8'));
  const text = readFileSync(source.answerKeyTextFile,'utf8');
  const answers = readOfficialAnswerKey(text, source);
  return {source,items,text,answers};
}

for (const [slug,count] of batches) {
  test(`${slug}: respostas por número, currículo, páginas íntegras e conteúdo publicado`, () => {
    const {source,items,text,answers} = load(slug);
    assert.equal(hash(text),source.answerKeyTextSha256);
    assert.equal(answers.size,source.totalQuestions);
    assert.equal(items.length,count);
    for (const n of source.excludedNumbers ?? []) assert.equal(answers.get(n),'*');
    for (const media of source.media) assert.equal(hash(readFileSync(`public${media.url}`)),media.sha256);
    const questions = buildReviewedOfficialQuestions(items,answers,source,mockTopics);
    for (const question of questions) {
      assert.deepEqual(bank.find(q=>q.id===question.id), question);
      assert.equal(question.correctOptionId,answers.get(question.examSource!.questionNumber!));
      assert.equal(question.options.length,source.optionIds.length);
      assert.equal(question.originalPages?.length,items.find(i=>i.number===question.examSource!.questionNumber)!.pages.length);
    }
    assert.throws(()=>readOfficialAnswerKey(text,{...source,year:2040}),/edição/);
    assert.throws(()=>readOfficialAnswerKey(text,{...source,version:'versão inexistente'}),/corresponde|incompatível|Versão da prova inválida/);
  });
}

test('preserva os 2.959 registros anteriores, ids e comentários, sem reaplicar conteúdo', () => {
  assert.equal(hash(JSON.stringify(bank.slice(0,2959))),'ad331585c0efd3ef134b2a1ee434363df1c515cfa0e6e85e1fa8ac7133ac3de3');
  assert.equal(bank.length,3094);
  const additions = batches.flatMap(([slug])=>{
    const {source,items,answers}=load(slug);
    return buildReviewedOfficialQuestions(items,answers,source,mockTopics);
  });
  assert.deepEqual(appendReviewedQuestions(bank,additions),bank);
  assert.throws(()=>appendReviewedQuestions(bank,[{...additions[0],explanation:'conflito'}]),/Conflito/);
  assert.throws(()=>appendReviewedQuestions(bank,[{...additions[0],id:'outra_versao'}]),/duplicada/);
});

test('ENEM mantém números 91–180, identidade de dia/cor e rejeita seleção fora da faixa ou anulada', () => {
  const {source,items,text,answers} = load('enem-2022-d2-cd5');
  assert.equal(answers.get(175),'*');
  assert.throws(()=>readOfficialAnswerKey(text,{...source,version:'CD7 azul'}),/incompatível/);
  assert.throws(()=>readOfficialAnswerKey(text,{...source,phase:'1º dia · aplicação regular'}),/incompatível/);
  assert.throws(()=>readOfficialAnswerKey(text.replace(/91\s+E/,'90 E'),source),/incompleto/);
  assert.throws(()=>readOfficialAnswerKey(text.replace(/92\s+A/,'91 A'),source),/repetido/);
  assert.throws(()=>buildReviewedOfficialQuestions(items,answers,{...source,selectedNumbers:[1,...source.selectedNumbers.slice(1)]},mockTopics),/Seleção/);
  assert.throws(()=>buildReviewedOfficialQuestions(items,answers,{...source,excludedNumbers:[]},mockTopics),/anulado/);
  assert.throws(()=>buildReviewedOfficialQuestions(items.slice(1),answers,source,mockTopics),/Seleção/);
  const questions=buildReviewedOfficialQuestions(items,answers,source,mockTopics);
  assert.equal(questions[0].id,'enem_2022_d2_cd5_q92');
  assert.equal(questions[0].examSource?.questionNumber,92);
  assert.equal(questions[0].sourceMaterial?.questionNumber,92);
});

test('Fuvest não mistura V1–V4 e importação recusa alternativas ou contexto incompletos', () => {
  const {source,items,text,answers} = load('fuvest-2026-v1');
  assert.equal(answers.get(18),'e');
  assert.equal(answers.get(3),'*');
  assert.notEqual(readOfficialAnswerKey(text,{...source,version:'V2'}).get(18),answers.get(18));
  const first=items[0];
  assert.throws(()=>buildReviewedOfficialQuestions([{...first,options:first.options.slice(1)},...items.slice(1)],answers,source,mockTopics),/Alternativas/);
  assert.throws(()=>buildReviewedOfficialQuestions(items,answers,{...source,media:[]},mockTopics),/preservada/);
  assert.throws(()=>readOfficialAnswerKey(text + '\n' + text.split('\n').find(line=>/^\s*18\s/.test(line)),source),/repetido/);
});
