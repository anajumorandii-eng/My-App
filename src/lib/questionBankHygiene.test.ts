import assert from 'node:assert/strict';
import test from 'node:test';
import { existsSync, readFileSync, statSync } from 'node:fs';
import path from 'node:path';
import type { Question } from '../types';

// Parte do banco vem de coletâneas em PDF que a Ana Júlia comprou, e cada
// página delas traz uma marca d'água com o nome, o e-mail e o CPF dela. O
// extrator remove isso, mas já deixou passar uma vez, grudada no fim da última
// alternativa. Este repositório é público: se escapar de novo, escapa para todo
// mundo. Por isso a checagem é aqui, no arquivo que vai pro commit, e não
// dentro do extrator.
const questions = JSON.parse(readFileSync('public/questions.json', 'utf8')) as Question[];

const textoDe = (q: Question) => [q.prompt, q.explanation, ...q.options.map((o) => o.text)].join(' ');

test('nenhuma questão carrega marca d’água de licença ou dado pessoal', () => {
  const vazamentos = [/Licenciado para/i, /Protegido por Eduzz/i, /\b\d{11}\b/, /@gmail\.com/i];
  for (const q of questions) {
    const texto = textoDe(q);
    for (const padrao of vazamentos) {
      assert.ok(!padrao.test(texto), `${q.id} contém ${padrao} — marca d'água da apostila não foi removida`);
    }
  }
});

test('nenhuma questão traz escape de markdown cru', () => {
  // A conversão do PDF escapa colchete e asterisco com contrabarra; se sobrar,
  // a aluna lê "Pode \[fazer tal coisa\]" na tela.
  for (const q of questions) {
    assert.ok(!/\\[[\]*_#]/.test(textoDe(q)), `${q.id} tem escape de markdown não desfeito`);
  }
});

test('todo gabarito aponta para uma alternativa que existe', () => {
  for (const q of questions) {
    const ids = q.options.map((o) => o.id);
    assert.ok(ids.includes(q.correctOptionId), `${q.id} aponta gabarito "${q.correctOptionId}", opções: ${ids.join(',')}`);
    assert.equal(new Set(ids).size, ids.length, `${q.id} tem alternativa com id repetido`);
  }
});

test('nenhum id de questão é duplicado', () => {
  const ids = questions.map((q) => q.id);
  const repetidos = ids.filter((id, i) => ids.indexOf(id) !== i);
  assert.deepEqual([...new Set(repetidos)], [], 'ids duplicados no banco de questões');
});

test('nenhuma questão foi publicada com o comentário em branco', () => {
  // As questões extraídas das coletâneas entram no banco com um comentário
  // provisório, que só diz o gabarito. Ele existe para o import poder ser
  // feito em duas etapas, e não para ficar. Este teste é o que garante que
  // ninguém — inclusive eu — deixe metade escrita e chame de pronto.
  const pendentes = questions.filter((q) => /ainda não escrito/i.test(q.explanation ?? ''));
  assert.deepEqual(pendentes.map((q) => q.id), [], 'questões sem comentário escrito');
  for (const q of questions) {
    assert.ok(q.explanation?.trim(), `${q.id} não tem comentário`);
  }
});

test('toda imagem de página original referenciada existe e não está vazia', () => {
  // As questões recuperadas das coletâneas dependem inteiramente da imagem:
  // sem ela, a aluna vê um enunciado que fala de uma figura que não aparece.
  // Um caminho errado no JSON não quebra build nem lint — só quebra na tela.
  for (const q of questions) {
    for (const pagina of q.originalPages ?? []) {
      const caminho = path.join(process.cwd(), 'public', pagina.url.replace(/^\//, ''));
      assert.ok(existsSync(caminho), `${q.id} aponta para ${pagina.url}, que não existe`);
      assert.ok(statSync(caminho).size > 0, `${q.id} aponta para ${pagina.url}, que está vazio`);
    }
  }
});
