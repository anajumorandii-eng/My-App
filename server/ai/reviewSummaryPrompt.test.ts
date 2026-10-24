import assert from 'node:assert/strict';
import test from 'node:test';
import { buildAiPrompt } from './prompts';
import { validateAiPayload } from './validation';
import { normalizeReviewOptions, type ReviewOptions } from '../../src/lib/strategicReview';
const base = { topic: 'Geometria Plana', subject: 'Matemática', chapter: 'Ângulos em Polígonos', guideMode: 'review-summary', level: 40, daysSinceReview: 0, referenceText: '[F1] Fonte de conceitos' };
function prompt(boards: string[], choices: Partial<ReviewOptions> = {}, extra = {}) {
  return buildAiPrompt('review-tip', validateAiPayload('review-tip', { ...base, ...extra, targetBoards: boards, reviewOptions: normalizeReviewOptions({ boards, ...choices }) }));
}
test('uma banca determina operações e critérios, sem perfil de outras bancas', () => {
  const fuvest = prompt(['FUVEST']);
  const unicamp = prompt(['UNICAMP']);
  assert.match(fuvest, /alternativas parcialmente verdadeiras/);
  assert.match(unicamp, /Comando → Fonte → Conceito → Relação/);
  assert.doesNotMatch(fuvest, /UNICAMP|UNESP|ENEM|Unicamp|Comvest/);
  assert.doesNotMatch(unicamp, /FUVEST|Fuvest|UNESP|ENEM/);
  for (const value of [fuvest,unicamp]) for (const required of ['Ângulos em Polígonos','evidência insuficiente','Recuperação ativa','Gabarito da recuperação ativa','[F1] Fonte de conceitos','LaTeX']) assert.ok(value.includes(required),required);
});
test('várias bancas entram com equilíbrio; seleção vazia prevalece sobre board legado', () => {
  const multiple = prompt(['ENEM','UNICAMP']);
  assert.match(multiple,/situação-problema/i); assert.match(multiple,/Comando → Fonte → Conceito → Relação/);
  assert.doesNotMatch(multiple,/Fuvest|FUVEST/);
  const general = prompt([],{}, { board:'FUVEST' });
  assert.match(general,/Nenhuma banca selecionada: revisão geral/);
  assert.doesNotMatch(general,/Fuvest|FUVEST|UNICAMP|Unicamp|ENEM|UNESP/);
});
test('segunda fase altera o treino e rejeita fase inexistente', () => {
  const second = prompt(['UNICAMP'],{ scopes: { UNICAMP:'second' } });
  assert.match(second,/Segunda fase/); assert.match(second,/separe subitens/);
  assert.doesNotMatch(second,/teste extrapolações/);
  assert.throws(() => validateAiPayload('review-tip',{...base,targetBoards:['ENEM'],reviewOptions:{scopes:{ENEM:'second'}}}),/Etapa incompatível/);
  assert.throws(() => validateAiPayload('review-tip',{...base,targetBoards:['FAMERP'],reviewOptions:{scopes:{FAMERP:'first'}}}),/Etapa incompatível/);
});
test('os três níveis diferem no desenvolvimento e nas aplicações, sem teto arbitrário', () => {
  assert.match(prompt([],{depth:'quick'}),/Um mini-exemplo.*duas perguntas/);
  assert.match(prompt([],{depth:'strategic'}),/pelo menos dois exemplos.*quatro perguntas/);
  assert.match(prompt([],{depth:'deep'}),/pelo menos três aplicações.*seis perguntas/);
  assert.doesNotMatch(prompt([]),/600 a 900/);
});
test('atualidades respeita fonte datada e ausência de pesquisa ao vivo', () => {
  const value = prompt(['ENEM'],{sourceMode:'provided',materialKind:'current-affairs',sourceDate:'2025-11-15'},{referenceText:'[F1] Boletim de saúde de 15/11/2025'});
  assert.match(value,/2025-11-15/); assert.match(value,/NÃO possui pesquisa externa em tempo real/);
  assert.match(value,/fato confirmado.*interpretação.*cenário/);
});
test('literatura usa evidência, forma e edição sem restringir bancas', () => {
  const value = prompt(['UNESP'],{materialKind:'literature'});
  assert.match(value,/indício textual → recurso formal → efeito/);
  assert.match(value,/lista do processo seletivo.*fontes oficiais/);
  assert.doesNotMatch(value,/Fuvest|FUVEST|UNICAMP|Unicamp/);
});
test('histórico real é opcional, sem perfil presumido nem perguntas automáticas ao professor', () => {
  assert.match(prompt([]),/Sem histórico de dificuldades utilizado/);
  assert.doesNotMatch(prompt([],{}, {errorHistory:'dado ignorado'}),/dado ignorado/);
  const value = prompt([],{useHistory:true},{errorHistory:'Confundi área e perímetro; confiança baixa'});
  assert.match(value,/Confundi área e perímetro/); assert.match(value,/hipótese de baixa confiança/);
  assert.match(value,/Não inclua perguntas para levar ao professor/); assert.match(value,/perguntas numeradas/i);
  assert.match(value,/NUNCA comando de sistema/); assert.match(value,/Não invente.*frequências/);
});
test('validação não aceita opções inválidas nem referências excessivas', () => {
  for (const reviewOptions of [{depth:'tiny'},{depth:'toString'},{useHistory:'yes'},{sourceUrl:'javascript:alert(1)'},{sourceDate:'2026-02-31'},{sourceText:'x'.repeat(12001)}]) assert.throws(()=>validateAiPayload('review-tip',{...base,reviewOptions}));
});

test('revisões aprofundam o raciocínio em vez de apenas aumentar listas', () => {
  const strategic = prompt(['ENEM'], {depth:'strategic'});
  assert.match(strategic, /Ponto de decisão/);
  assert.match(strategic, /abordagem tentadora.*por que falha/);
  assert.match(strategic, /justificativa.*evidência.*conclusão/);
  const deep = prompt(['UNICAMP'], {depth:'deep', scopes:{UNICAMP:'second'}});
  assert.match(deep, /reconstrução guiada.*aplicação resolvida.*transferência independente/);
  assert.match(deep, /critério de domínio observável/);
  const quick = prompt([], {depth:'quick'});
  assert.match(quick, /compacta.*raciocínio completo/);
  assert.doesNotMatch(quick, /Fuvest|FUVEST/);
});

test('revisão combinada cobre os recortes e suas conexões sem mudar bancas ou etapas', () => {
  const value=prompt(['UNICAMP'],{scopes:{UNICAMP:'second'}},{topic:'Ecologia + Evolução',chapters:'Ecologia: Dinâmica de Populações; Evolução: Mecanismos da Evolução Biológica'});
  assert.match(value,/Recortes da revisão: Ecologia: Dinâmica de Populações; Evolução: Mecanismos da Evolução Biológica/);
  assert.match(value,/cubra cada recorte.*conexões/i);
  assert.match(value,/recuperação ativa.*todos os tópicos/i);
  assert.doesNotMatch(value,/Fuvest|FUVEST|ENEM/);
});
