import assert from 'node:assert/strict';
import test from 'node:test';
import { applyRecoveryOutcome, isReadyToClose } from './backlogEngine';
import { BacklogItem } from '../types';

function item(patch: Partial<BacklogItem> = {}): BacklogItem {
  return {
    id: 'b1', topicId: 'bio_ecologia', state: 2, dependencia: 2,
    incidencia: 2, lacuna: 2, urgencia: 2, custo: 2,
    independentSuccesses: 0, canExplainTypicalError: false,
    supportLevel: 3, dateAdded: '2026-08-01T00:00:00.000Z', ...patch,
  };
}

test('resultado independente avança apoio e registra sucesso sem fechar sozinho', () => {
  const next = applyRecoveryOutcome(item(), 'independente', new Date('2026-08-23T12:00:00Z'));
  assert.equal(next.supportLevel, 4);
  assert.equal(next.state, 3);
  assert.equal(next.independentSuccesses, 1);
  assert.equal(next.closedAt, undefined);
  assert.equal(isReadyToClose(next), false);
});

test('resultado difícil recua apoio e zera sucessos independentes', () => {
  const next = applyRecoveryOutcome(item({ state: 3, supportLevel: 4, independentSuccesses: 1 }), 'ainda_dificil');
  assert.equal(next.supportLevel, 3);
  assert.equal(next.state, 2);
  assert.equal(next.independentSuccesses, 0);
});

test('resultado com ajuda não conta como sucesso independente', () => {
  const next = applyRecoveryOutcome(item({ state: 1, independentSuccesses: 1 }), 'com_ajuda');
  assert.equal(next.state, 2);
  assert.equal(next.independentSuccesses, 0);
});

test('dois sucessos independentes no mesmo dia contam como uma única ocasião', () => {
  const first = applyRecoveryOutcome(item(), 'independente', new Date('2026-08-23T09:00:00Z'));
  const repeated = applyRecoveryOutcome(first, 'independente', new Date('2026-08-23T20:00:00Z'));
  assert.equal(repeated.independentSuccesses, 1);
  assert.equal(repeated.lastIndependentSuccessAt, '2026-08-23T09:00:00.000Z');
});

test('sucessos independentes em dias distintos contam como ocasiões separadas', () => {
  const first = applyRecoveryOutcome(item(), 'independente', new Date('2026-08-23T20:00:00Z'));
  const nextDay = applyRecoveryOutcome(first, 'independente', new Date('2026-08-24T09:00:00Z'));
  assert.equal(nextDay.independentSuccesses, 2);
  assert.equal(isReadyToClose({ ...nextDay, canExplainTypicalError: true }), true);
});

test('ocasiões seguem o dia civil de São Paulo, não a virada em UTC', () => {
  const first = applyRecoveryOutcome(item(), 'independente', new Date('2026-08-24T00:30:00Z'));
  const sameLocalDay = applyRecoveryOutcome(first, 'independente', new Date('2026-08-24T02:30:00Z'));
  assert.equal(sameLocalDay.independentSuccesses, 1);
});

test('timestamp legado inválido não bloqueia uma nova evidência independente', () => {
  const next = applyRecoveryOutcome(item({ lastIndependentSuccessAt: 'inválido' }), 'independente', new Date('2026-08-24T12:00:00Z'));
  assert.equal(next.independentSuccesses, 1);
});
