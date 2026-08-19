import assert from 'node:assert/strict';
import test from 'node:test';
import { mockTopics } from '../data/mockData';

test('every topic has a non-empty chapters list sourced from the apostila', () => {
  for (const topic of mockTopics) {
    assert.ok(topic.chapters && topic.chapters.length > 0, `${topic.id} should have chapters`);
  }
});

test('no topic lists the same chapter twice', () => {
  for (const topic of mockTopics) {
    const unique = new Set(topic.chapters);
    assert.equal(unique.size, topic.chapters!.length, `${topic.id} has a duplicate chapter title`);
  }
});

test('no chapter title is blank', () => {
  for (const topic of mockTopics) {
    for (const chapter of topic.chapters!) {
      assert.ok(chapter.trim().length > 0, `${topic.id} has a blank chapter title`);
    }
  }
});
