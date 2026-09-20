import assert from 'node:assert/strict';import test from 'node:test';import {SEQUENCE_CONFIGS}from './sequenceLab';
test('PA preserva diferença',()=>assert.equal(SEQUENCE_CONFIGS.pa.readouts(2)[2].value,'11'));
test('PG preserva razão',()=>assert.equal(SEQUENCE_CONFIGS.pg.readouts(2)[2].value,'48'));
