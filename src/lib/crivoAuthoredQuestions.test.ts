import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync, readdirSync } from 'node:fs';
import type { Question } from '../types';

const bank = JSON.parse(readFileSync('public/questions.json', 'utf8')) as Question[];
type Autoral = Question & { skill: string; trap: string };
const arquivos = readdirSync('scripts/data').filter(f => /^crivo-fuvest-f1-lote\d+\.json$/.test(f)).sort();
const lotes = arquivos.map(f => ({ arquivo: f, questoes: JSON.parse(readFileSync(`scripts/data/${f}`, 'utf8')) as Autoral[] }));
const lote = lotes.flatMap(l => l.questoes);

test('o lote autoral estilo FUVEST está gravado no banco sem os metadados de treino', () => {
  const porId = new Map(bank.map(q => [q.id, q]));
  for (const { skill: _skill, trap: _trap, ...questao } of lote) {
    assert.deepEqual(porId.get(questao.id), questao, questao.id);
  }
});

test('questão autoral nunca se passa por prova real', () => {
  // examSource faria o filtro "provas reais" da tela listar a questão como
  // se a FUVEST a tivesse aplicado.
  for (const q of bank.filter(q => q.id.startsWith('crivo_'))) {
    assert.equal(q.examSource, undefined, q.id);
    // Sem styleOf, o filtro de banca não a encontra: foi assim que as
    // autorais sumiam ao escolher a FUVEST.
    assert.equal(q.styleOf, 'FUVEST', q.id);
    assert.doesNotMatch(q.prompt, /^FUVEST \d{4}/, q.id);
  }
});

test('gabarito de cada lote é distribuído entre as cinco letras', () => {
  // Quase todo o rascunho do lote 1 saiu com gabarito B; um padrão desses
  // ensina a chutar letra em vez de resolver.
  for (const { arquivo, questoes } of lotes) {
    const contagem = new Map<string, number>();
    for (const q of questoes) contagem.set(q.correctOptionId, (contagem.get(q.correctOptionId) ?? 0) + 1);
    assert.equal(contagem.size, 5, arquivo);
    for (const [letra, n] of contagem) assert.ok(n <= Math.ceil(questoes.length * 0.3), `${arquivo} ${letra}: ${n}`);
  }
});

test('ids autorais não se repetem entre lotes', () => {
  const ids = lote.map(q => q.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('cada comentário abre pela resposta e só aponta pegadinha em alternativa errada', () => {
  for (const q of lote) {
    assert.ok(q.explanation.startsWith(`Resposta ${q.correctOptionId.toUpperCase()}.`), q.id);
    const apontadas = [...q.explanation.matchAll(/^• ([A-E](?:(?:, | e )[A-E])*)/gm)].flatMap(m => m[1].split(/, | e /));
    assert.ok(apontadas.length >= 3, `${q.id} explica poucas alternativas erradas`);
    assert.ok(!apontadas.includes(q.correctOptionId.toUpperCase()), q.id);
    assert.ok(q.trap.length > 0 && q.skill.length > 0, q.id);
  }
});

test('o lote acompanha o formato medido nas questões oficiais da FUVEST', () => {
  // Medido nas 165 questões oficiais de 2025 e 2026 do banco: enunciado
  // mediano de ~840 caracteres e alternativa mediana de ~94. A primeira versão
  // do lote tinha enunciados de ~250 caracteres, sem texto-base: parecia
  // questão de apostila, não da banca.
  const mediana = (xs: number[]) => [...xs].sort((a, b) => a - b)[Math.floor(xs.length / 2)];
  const corpo = (q: Autoral) => q.prompt.replace(/^Questão autoral[^\n]*\n\n/, '');
  // Por lote, e não no total: do lote 2 ao 8 a mediana caiu de 470 para 380
  // caracteres sem que a média geral denunciasse a tempo.
  for (const { arquivo, questoes } of lotes) {
    assert.ok(mediana(questoes.map(q => corpo(q).length)) >= 450, arquivo);
    // Os lotes 11 a 13 encheram-se de alternativas só numéricas ("27 g") e
    // derrubaram a mediana geral para 67 antes de o teste do conjunto acusar.
    assert.ok(mediana(questoes.flatMap(q => q.options.map(o => o.text.length))) >= 60, `${arquivo}: alternativas curtas`);
  }
  const enunciados = lote.map(corpo);
  assert.ok(mediana(lote.flatMap(q => q.options.map(o => o.text.length))) >= 70);
  for (const [i, p] of enunciados.entries()) {
    // Texto-base sempre com a origem declarada: fonte primária real citada
    // numa linha que termina com o ano (lei, declaração, obra), ou a
    // declaração de que foi escrito para a questão — nunca fonte inventada.
    assert.match(p, /Texto elaborado para esta questão\.|^[^\n]*\b1[5-9]\d\d\.$|^[^\n]*\b20\d\d\.$/m, lote[i].id);
  }
});
