import assert from 'node:assert/strict';
import test from 'node:test';

import {
  lerGabaritoFuvest,
  lerProva,
  montar,
  separarAlternativas,
} from './officialQuestions';

const LETRAS = ['A', 'B', 'C', 'D', 'E'];
const FONTE = { board: 'FUVEST', year: 2026, sourceUrl: 'https://exemplo/gabarito.pdf' };

// Formato real do gabarito da Fuvest: as quatro versões lado a lado, cada uma
// ocupando dois pares por linha (1..45 e 46..90).
const GABARITO = [
  'PROVA V1  PROVA V2  PROVA V3  PROVA V4 ',
  '1 E  46 C  1 C  46 B  1 C  46 E  1 C  46 C ',
  '2 B  47 D  2 C  47 A  2 D  47 B  2 D  47 A ',
  '3 *  48 B  3 A  48 B  3 B  48 *  3 B  48 B ',
  'linha de ruido que nao e tabela',
].join('\n');

test('lerGabaritoFuvest devolve a coluna V1, nao a de outra versao', () => {
  const v1 = lerGabaritoFuvest(GABARITO, 0);
  assert.equal(v1.get(1), 'E');
  assert.equal(v1.get(2), 'B');
  assert.equal(v1.get(46), 'C');
  assert.equal(v1.get(47), 'D');
});

test('lerGabaritoFuvest lê as demais versões pela coluna pedida', () => {
  // Ler a coluna errada troca todas as respostas do ano — por isso cada
  // versão é verificada separadamente.
  assert.equal(lerGabaritoFuvest(GABARITO, 1).get(1), 'C');
  assert.equal(lerGabaritoFuvest(GABARITO, 2).get(46), 'E');
  assert.equal(lerGabaritoFuvest(GABARITO, 3).get(47), 'A');
});

test('lerGabaritoFuvest ignora linha que não tem os oito pares', () => {
  const v1 = lerGabaritoFuvest(GABARITO, 0);
  assert.equal(v1.size, 6); // 3 linhas válidas × 2 pares
});

test('lerProva indexa pelo número declarado, não pela ordem no texto', () => {
  // A Unicamp 2023 traz a questão 29 depois da 33; casar por posição
  // deslocaria as respostas em silêncio.
  const texto = '{30}\nA\n{31}\nB\n{29}\nC\n';
  const blocos = lerProva(texto, /\{(\d{2})\}/g);
  assert.deepEqual([...blocos.keys()].sort((a, b) => a - b), [29, 30, 31]);
  assert.match(blocos.get(29)!, /C/);
  assert.match(blocos.get(30)!, /A/);
});

test('separarAlternativas devolve enunciado e as cinco alternativas', () => {
  const bloco = '{07}\nQual a resposta?\n(A) um\n(B) dois\n(C) tres\n(D) quatro\n(E) cinco\n#####';
  const r = separarAlternativas(bloco, LETRAS)!;
  assert.match(r.prompt, /Qual a resposta\?/);
  assert.deepEqual(r.options.map((o) => o.id), ['a', 'b', 'c', 'd', 'e']);
  assert.equal(r.options[0].text, 'um');
  assert.equal(r.options[4].text, 'cinco');
});

test('separarAlternativas recusa bloco com alternativa faltando', () => {
  const bloco = 'Enunciado\n(A) um\n(B) dois\n(C) tres\n(D) quatro';
  assert.equal(separarAlternativas(bloco, LETRAS), null);
});

test('separarAlternativas recusa alternativas fora de ordem', () => {
  // Ordem trocada indica que a extração misturou colunas do PDF.
  const bloco = 'Enunciado\n(B) dois\n(A) um\n(C) tres\n(D) quatro\n(E) cinco';
  assert.equal(separarAlternativas(bloco, LETRAS), null);
});

function bloco(numero: number, corpo: string): string {
  return `{${String(numero).padStart(2, '0')}}\n${corpo}\n(A) um\n(B) dois\n(C) tres\n(D) quatro\n(E) cinco`;
}

test('montar descarta questão anulada pela banca', () => {
  const blocos = new Map([[3, bloco(3, 'Enunciado limpo')]]);
  const { questoes, descartes } = montar(blocos, new Map([[3, '*']]), LETRAS, FONTE);
  assert.equal(questoes.length, 0);
  assert.deepEqual(descartes, [{ numero: 3, motivo: 'anulada' }]);
});

test('montar descarta questão que depende de imagem', () => {
  const blocos = new Map([[5, bloco(5, 'Observe a charge de Angelo Agostini')]]);
  const { questoes, descartes } = montar(blocos, new Map([[5, 'a']]), LETRAS, FONTE);
  assert.equal(questoes.length, 0);
  assert.equal(descartes[0].motivo, 'depende de imagem');
});

test('montar descarta fórmula corrompida por fonte simbólica', () => {
  // "sen గ/ଶ" no lugar de "sen π/2": o PDF desenhou a fórmula com fonte
  // simbólica e a extração leu como outro alfabeto.
  const blocos = new Map([[7, bloco(7, 'Considere sen గ ଶ e resolva')]]);
  const { questoes, descartes } = montar(blocos, new Map([[7, 'd']]), LETRAS, FONTE);
  assert.equal(questoes.length, 0);
  assert.equal(descartes[0].motivo, 'formula corrompida');
});

test('montar descarta questão sem resposta no gabarito', () => {
  const blocos = new Map([[9, bloco(9, 'Enunciado limpo')]]);
  const { questoes, descartes } = montar(blocos, new Map(), LETRAS, FONTE);
  assert.equal(questoes.length, 0);
  assert.equal(descartes[0].motivo, 'sem resposta no gabarito');
});

test('montar aproveita questão limpa e carrega a resposta oficial', () => {
  const blocos = new Map([[6, bloco(6, 'Quantos metros foram percorridos?')]]);
  const { questoes, descartes } = montar(blocos, new Map([[6, 'E']]), LETRAS, FONTE);
  assert.equal(descartes.length, 0);
  assert.equal(questoes.length, 1);
  assert.equal(questoes[0].numero, 6);
  assert.equal(questoes[0].correctOptionId, 'e');
  assert.equal(questoes[0].options.length, 5);
  assert.deepEqual(questoes[0].examSource, FONTE);
});

test('montar devolve as questões em ordem numérica mesmo com entrada fora de ordem', () => {
  const blocos = new Map([
    [30, bloco(30, 'trinta')],
    [29, bloco(29, 'vinte e nove')],
  ]);
  const respostas = new Map([[29, 'a'], [30, 'b']]);
  const { questoes } = montar(blocos, respostas, LETRAS, FONTE);
  assert.deepEqual(questoes.map((q) => q.numero), [29, 30]);
  // E cada uma mantém a SUA resposta, não a da vizinha.
  assert.equal(questoes[0].correctOptionId, 'a');
  assert.equal(questoes[1].correctOptionId, 'b');
});
