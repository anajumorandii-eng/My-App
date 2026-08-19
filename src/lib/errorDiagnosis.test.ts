import assert from 'node:assert/strict';
import test from 'node:test';
import { parseErrorDiagnosis } from './errorDiagnosis';

test('faz o parse de um JSON válido e íntegro', () => {
  const raw = JSON.stringify({
    type: 'prerequisite',
    breakPoint: 'Não reconheceu que precisava decompor a força em componentes.',
    evidence: 'Escolheu a alternativa que ignora o ângulo dado no enunciado.',
    confidence: 'media',
    intervention: { type: 'microbloco_prerequisito', description: 'Revisar decomposição vetorial antes de tentar de novo.' },
  });
  const result = parseErrorDiagnosis(raw);

  assert.equal(result.type, 'prerequisite');
  assert.match(result.breakPoint, /decompor a força/);
  assert.equal(result.confidence, 'media');
  assert.equal(result.intervention.type, 'microbloco_prerequisito');
});

test('extrai o JSON mesmo com texto ou markdown ao redor', () => {
  const raw = 'Aqui está:\n```json\n' + JSON.stringify({
    type: 'calculation',
    breakPoint: 'Errou o sinal ao isolar a variável.',
    evidence: '',
    confidence: 'baixa',
    intervention: { type: 'revisao_curta', description: 'Praticar isolamento de variáveis com sinais trocados.' },
  }) + '\n```';
  const result = parseErrorDiagnosis(raw);

  assert.equal(result.type, 'calculation');
  assert.equal(result.intervention.type, 'revisao_curta');
});

test('nunca deixa passar confidence diferente de baixa/media', () => {
  const raw = JSON.stringify({
    type: 'conceptual',
    breakPoint: 'x',
    evidence: '',
    confidence: 'alta', // o modelo não deveria mandar isso, mas se mandar...
    intervention: { type: 'questao_guiada', description: 'y' },
  });
  const result = parseErrorDiagnosis(raw);
  assert.equal(result.confidence, 'baixa');
});

test('cai em categoria e intervenção padrão quando o código não é válido', () => {
  const raw = JSON.stringify({
    type: 'algo_inventado',
    breakPoint: 'Descrição válida.',
    evidence: '',
    confidence: 'media',
    intervention: { type: 'tambem_inventado', description: 'z' },
  });
  const result = parseErrorDiagnosis(raw);

  assert.equal(result.type, 'conceptual');
  assert.equal(result.intervention.type, 'recuperacao_ativa');
  assert.equal(result.breakPoint, 'Descrição válida.'); // campos válidos são preservados
});

test('não quebra com texto que não é JSON — usa o texto como ponto de ruptura', () => {
  const result = parseErrorDiagnosis('O modelo respondeu só um parágrafo solto, sem JSON nenhum.');
  assert.equal(result.type, 'conceptual');
  assert.equal(result.confidence, 'baixa');
  assert.match(result.breakPoint, /parágrafo solto/);
});

test('não quebra com string vazia', () => {
  const result = parseErrorDiagnosis('');
  assert.equal(result.confidence, 'baixa');
  assert.ok(result.breakPoint.length > 0);
});
