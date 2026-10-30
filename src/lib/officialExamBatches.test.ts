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
  ['unicamp-2025-qz',71], ['fuvest-2026-v1',49], ['unesp-2025-v1',12],
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

test('preserva os registros anteriores fora da correção conferida de G6PD, sem reaplicar conteúdo', () => {
  // Hash refeito quando os 72 enunciados da Unicamp 2026 foram transcritos
  // (prompt dessas questões, e o texto das alternativas gráficas da 13, que
  // apontava para a página; o resto foi conferido igual). O sinalizador de
  // migração statementComplete é aditivo e não integra esse hash de conteúdo.
  // G6PD foi corrigida contra prova/gabarito oficiais; a regressão detalhada
  // está em questionBankContent.test.ts. Os outros 2.958 registros mantêm
  // exatamente o conteúdo anterior, não um novo baseline indiscriminado.
  const preserved = bank.slice(0, 2959).filter(q => q.id !== 'q_real_fuvest_2022_bio');
  assert.equal(preserved.length, 2958);
  assert.equal(bank.filter(q => q.id === 'q_real_fuvest_2022_bio').length, 1);
  assert.equal(hash(JSON.stringify(preserved.map(({ statementComplete: _complete, ...q }) => q))), '7dca5c26bac9342c1b33fb72ad47c375d67ad813e96ebb84cb457e010fc75d1e');
  // Questões autorais (crivo_*) têm teste próprio; aqui só conta o que veio de prova.
  assert.equal(bank.filter(q=>!q.id.startsWith('crivo_')).length,4553);
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
  assert.throws(()=>buildReviewedOfficialQuestions([{...first,options:first.options.slice(0,-1)},...items.slice(1)],answers,source,mockTopics),/Alternativas/);
  assert.throws(()=>buildReviewedOfficialQuestions(items,answers,{...source,media:[]},mockTopics),/preservada/);
  assert.throws(()=>readOfficialAnswerKey(text + '\n' + text.split('\n').find(line=>/^\s*18\s/.test(line)),source),/repetido/);
});


test('reaplicar lote no banco publicado preserva as figuras derivadas', () => {
  const published = JSON.parse(readFileSync('public/questions.json', 'utf8')) as Question[];
  const { source, items, answers } = load('unicamp-2025-qz');
  const additions = buildReviewedOfficialQuestions(items, answers, source, mockTopics);
  assert.ok(published.some(q => q.id.startsWith('unicamp_2025_') && q.figures?.length));
  assert.deepEqual(appendReviewedQuestions(published, additions), published);
  assert.throws(() => appendReviewedQuestions(published, [{ ...additions[0], correctOptionId: 'z' }]), /Conflito/);
});

test('todas as novas questões possuem enunciado e contexto em texto antes da tentativa', () => {
  for (const [slug] of batches) {
    const { source, items } = load(slug);
    for (const item of items) {
      const id = `${source.idPrefix}_q${String(item.number).padStart(2, '0')}`;
      const published = bank.find(q => q.id === id)!;
      assert.ok(item.statement && item.statement.trim().length > 60, id);
      assert.doesNotMatch(published.prompt, /Leia o enunciado original|nas páginas abaixo/, id);
    }
  }
  const topic = (id: string) => bank.find(q => q.id === id)!.prompt;
  assert.match(topic('unifesp_2025_v1_q03'), /escrever-lhe-ia/);
  assert.match(topic('unifesp_2025_v1_q07'), /Da sopa primordial/);
  assert.match(topic('famerp_2025_v1_q72'), /4 \| −1 \| 3,5/);
  assert.match(topic('enem_2022_d2_cd5_q99'), /2 \| 608 \| 4/);
  assert.match(topic('enem_2022_d2_cd5_q130'), /8 \| 6,0/);
});

test('gráficos, estruturas e contextos visuais decisivos permanecem disponíveis sem a página inteira', () => {
  const published: Question[] = JSON.parse(readFileSync('public/questions.json', 'utf8'));
  for (const id of ['unicamp_2025_q01', 'unicamp_2025_q08', 'unicamp_2025_q12',
    'fuvest_2026_q23', 'fuvest_2026_q24', 'fuvest_2026_q34', 'fuvest_2026_q67', 'fuvest_2026_q84', 'fuvest_2026_q85',
    'unesp_2025_v1_q78', 'famerp_2025_v1_q55', 'unifesp_2025_v1_q10',
    'unifesp_2025_v1_q16', 'unifesp_2025_v1_q19', 'unifesp_2025_v1_q23', 'unifesp_2025_v1_q25']) {
    const question = published.find(q => q.id === id)!;
    assert.ok(question.figures?.length, `Figura ausente: ${id}`);
    for (const figure of question.figures!) assert.ok(readFileSync(`public${figure.url}`).length > 1000, id);
  }
});
