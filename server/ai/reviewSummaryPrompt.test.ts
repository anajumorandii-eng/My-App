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

test('recortes específicos delimitam explicações e tarefas sem ampliar para todo o tópico',()=>{
 const result=prompt([], {depth:'deep',topicCuts:{mat_geometria_plana:['Ângulos na circunferência','Área do círculo']}}, {chapters:'Geometria plana: Ângulos na circunferência + Área do círculo'});
 assert.match(result,/Ângulos na circunferência \+ Área do círculo/);assert.match(result,/RECORTES SOBERANOS/);assert.match(result,/pré-requisitos breves e conectados/);assert.ok(result.includes('\\alpha'));assert.ok(!result.includes('\u0000'));
});
test('figuras automáticas orientam estruturas e gráficos; preferência somente texto chega ao prompt',()=>{
 const automatic=prompt([],{}, {subject:'Química',topic:'Química orgânica'});
 assert.match(automatic,/FIGURAS AUTOMÁTICAS/);
 assert.match(automatic,/SMILES/);
 assert.match(automatic,/x estritamente crescente/);
 const text=prompt([],{visualMode:'text'});
 assert.match(text,/PREFERÊNCIA DESTA REVISÃO: somente texto/);
 assert.throws(()=>validateAiPayload('review-tip',{...base,reviewOptions:{visualMode:'unknown'}}));
});
test('obra literária segue o método da tutora de obras: seções próprias e protocolo por banca', () => {
  const work = { topic: 'Memórias Póstumas de Brás Cubas', subject: 'Literatura', chapter: undefined };
  const fuvest = prompt(['FUVEST'], { materialKind: 'literature', sourceMode: 'work' }, work);
  for (const required of ['Pergunta central da obra', 'Como a forma produz sentido', 'Treino com trecho', 'Evidência da obra', 'Síntese do CRIVO', 'F.O.R.M.A.', 'não substitui a leitura integral']) assert.ok(fuvest.includes(required), required);
  assert.doesNotMatch(fuvest, /F\.O\.N\.T\.E\.|Comvest|UNICAMP/);
  assert.doesNotMatch(fuvest, /Entenda o mecanismo \(porquê/);
  const unicamp = prompt(['UNICAMP'], { materialKind: 'literature', sourceMode: 'work' }, work);
  assert.match(unicamp, /F\.O\.N\.T\.E\./);
  assert.doesNotMatch(unicamp, /F\.O\.R\.M\.A\.|FUVEST|Fuvest/);
  const geral = prompt([], { materialKind: 'literature', sourceMode: 'work' }, work);
  assert.match(geral, /F\.O\.R\.M\.A\./); assert.match(geral, /F\.O\.N\.T\.E\./);
  const outra = prompt(['UNESP'], { materialKind: 'literature', sourceMode: 'work' }, work);
  assert.doesNotMatch(outra, /F\.O\.R\.M\.A\.|F\.O\.N\.T\.E\./, 'outra banca selecionada não recebe protocolo de Fuvest/Unicamp');
});
test('conteúdo disciplinar não recebe as seções de obra', () => {
  assert.doesNotMatch(prompt(['FUVEST']), /Pergunta central da obra|Treino com trecho|protocolo F\.O\.R\.M\.A\./);
});
test('obra literária respeita a etapa escolhida', () => {
  const work = { topic: 'A Paixão Segundo G.H.', subject: 'Literatura', chapter: undefined };
  const first = prompt(['FUVEST'], { materialKind: 'literature', sourceMode: 'work', scopes: { FUVEST: 'first' } }, work);
  assert.match(first, /FUVEST 1ª fase/);
  assert.doesNotMatch(first, /F\.O\.R\.M\.A\.|FUVEST 2ª fase|Diferencie 1ª e 2ª fase/);
  const second = prompt(['FUVEST'], { materialKind: 'literature', sourceMode: 'work', scopes: { FUVEST: 'second' } }, work);
  assert.match(second, /F\.O\.R\.M\.A\./); assert.doesNotMatch(second, /FUVEST 1ª fase/);
  const enem = prompt(['ENEM'], { materialKind: 'literature', sourceMode: 'work' }, work);
  assert.doesNotMatch(enem, /uma discursiva de 2ª fase|Diferencie 1ª e 2ª fase/);
});
