import assert from 'node:assert/strict';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import type { Question } from '../types';

const bank = JSON.parse(readFileSync('public/questions.json', 'utf8')) as Question[];
const lote = JSON.parse(readFileSync('scripts/data/crivo-fuvest-f1-lote1.json', 'utf8')) as (Question & { skill: string; trap: string })[];

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
    assert.doesNotMatch(q.prompt, /^FUVEST \d{4}/, q.id);
  }
});

test('gabarito do lote é distribuído entre as cinco letras', () => {
  // Quase todo o rascunho saiu com gabarito B; um padrão desses ensina a
  // chutar letra em vez de resolver.
  const contagem = new Map<string, number>();
  for (const q of lote) contagem.set(q.correctOptionId, (contagem.get(q.correctOptionId) ?? 0) + 1);
  assert.equal(contagem.size, 5);
  for (const [letra, n] of contagem) assert.ok(n <= Math.ceil(lote.length * 0.3), `${letra}: ${n}`);
});

test('cada comentário abre pela resposta e só aponta pegadinha em alternativa errada', () => {
  for (const q of lote) {
    assert.ok(q.explanation.startsWith(`Resposta ${q.correctOptionId.toUpperCase()}.`), q.id);
    const apontadas = [...q.explanation.matchAll(/^• ([A-E](?: e [A-E])*)/gm)].flatMap(m => m[1].split(' e '));
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
  const enunciados = lote.map(q => q.prompt.replace(/^Questão autoral[^\n]*\n\n/, ''));
  assert.ok(mediana(enunciados.map(p => p.length)) >= 450);
  assert.ok(mediana(lote.flatMap(q => q.options.map(o => o.text.length))) >= 70);
  for (const [i, p] of enunciados.entries()) {
    // Texto-base sempre com a origem declarada: fonte real citada, ou a
    // declaração de que foi escrito para a questão — nunca fonte inventada.
    assert.match(p, /Texto elaborado para esta questão\.|Decreto-Lei|Disponível em/, lote[i].id);
  }
});
