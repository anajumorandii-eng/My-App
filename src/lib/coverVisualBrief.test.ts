import assert from 'node:assert/strict';
import test from 'node:test';
import { buildCoverVisualBrief } from './coverVisualBrief';

test('recortes de Português mudam o motivo principal em vez de repetir uma figura de leitura', () => {
  const context = {subject: 'Português', topic: 'Gramática', purpose: 'Aprofundamento'};
  const syntax = buildCoverVisualBrief({...context,subtopic:'Orações subordinadas · Concordância verbal'});
  const words = buildCoverVisualBrief({...context,subtopic:'Formação de palavras'});
  const communication = buildCoverVisualBrief({...context,subtopic:'Função referencial e emotiva'});
  assert.match(syntax.motifs.join(' '),/Sentence structure/);
  assert.doesNotMatch(syntax.motifs.join(' '),/Sound and writing|Communication and language use/);
  assert.match(words.motifs.join(' '),/Word structure/);
  assert.match(communication.motifs.join(' '),/Communication and language use/);
  for (const brief of [syntax,words,communication]) assert.match(brief.humanFigures,/Do not depict any woman, man/);
});
test('o recorte específico prevalece sobre outros conteúdos do tópico amplo', () => {
  const brief=buildCoverVisualBrief({subject:'Português',topic:'Verbos, sintaxe e fonologia',subtopic:'Metáfora e polissemia'});
  assert.match(brief.motifs.join(' '),/Meaning and reading/);
  assert.doesNotMatch(brief.motifs.join(' '),/Word structure|Sentence structure|Sound and writing/);
});
test('tópico completo usa seu conteúdo e um recorte personalizado permanece intacto', () => {
  assert.match(buildCoverVisualBrief({subject:'Português',topic:'Sintaxe',subtopic:'Visão geral'}).motifs.join(' '),/Sentence structure/);
  const custom='Meu recorte particular <sem interpretação como marcação>';
  const brief=buildCoverVisualBrief({subject:'Português',topic:'Verbos',subtopic:custom});
  assert.equal(brief.scope,custom);
  assert.doesNotMatch(brief.motifs.join(' '),/Word structure/);
});
test('regra contextual alcança literatura, história e biologia sem proibir pessoas pertinentes', () => {
  for (const context of [{subject:'Literatura',work:'Obra de teste',subtopic:'Espaço narrativo'}, {subject:'História',topic:'Mulheres na Revolução Francesa'}, {subject:'Biologia',topic:'Anatomia humana'}]) {
    const brief=buildCoverVisualBrief(context);
    assert.match(brief.humanFigures,/allowed only when the selected content itself requires/);
    assert.ok(brief.scope);
    assert.match(brief.relevanceCheck,/every supporting object/);
  }
});
