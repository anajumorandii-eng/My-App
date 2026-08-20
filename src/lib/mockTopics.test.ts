import assert from 'node:assert/strict';
import test from 'node:test';
import { mockTopics, mockMastery, mockQuestions, mockPodcastEpisodes, mockBacklog, mockErrorLogs } from '../data/mockData';
import { mockTopicDiscursivePrompts } from '../data/topicDiscursivePrompts';
import { SPLIT_TOPIC_PARENTS } from '../data/topicSplits';

test('no topic id is duplicated', () => {
  const ids = mockTopics.map((t) => t.id);
  assert.equal(new Set(ids).size, ids.length);
});

test('every prerequisite points at a real topic', () => {
  const ids = new Set(mockTopics.map((t) => t.id));
  for (const topic of mockTopics) {
    for (const prereq of topic.prerequisites) {
      assert.ok(ids.has(prereq), `${topic.id} lists an unknown prerequisite: ${prereq}`);
    }
  }
});

test('every topicId referenced elsewhere in the mock dataset resolves to a real topic', () => {
  const ids = new Set(mockTopics.map((t) => t.id));
  for (const m of mockMastery) assert.ok(ids.has(m.topicId), `mockMastery references unknown topic ${m.topicId}`);
  for (const q of mockQuestions) assert.ok(ids.has(q.topicId), `mockQuestions references unknown topic ${q.topicId}`);
  for (const p of mockPodcastEpisodes) assert.ok(ids.has(p.topicId), `mockPodcastEpisodes references unknown topic ${p.topicId}`);
  for (const b of mockBacklog) assert.ok(ids.has(b.topicId), `mockBacklog references unknown topic ${b.topicId}`);
  for (const e of mockErrorLogs) assert.ok(ids.has(e.topicId), `mockErrorLogs references unknown topic ${e.topicId}`);
  for (const d of mockTopicDiscursivePrompts) assert.ok(ids.has(d.topicId), `mockTopicDiscursivePrompts references unknown topic ${d.topicId}`);
});

test('no duplicate id within mockTopicDiscursivePrompts', () => {
  const ids = mockTopicDiscursivePrompts.map((d) => d.id);
  assert.equal(new Set(ids).size, ids.length, 'mockTopicDiscursivePrompts has a duplicate id');
});

test('every topic has exactly one mastery seed row', () => {
  const masteryIds = mockMastery.map((m) => m.topicId);
  assert.equal(new Set(masteryIds).size, masteryIds.length, 'no duplicate topicId in mockMastery');
  const topicIds = new Set(mockTopics.map((t) => t.id));
  const masterySet = new Set(masteryIds);
  assert.deepEqual(masterySet, topicIds, 'mockMastery must have exactly one row per topic, no more, no less');
});

test('every split-topic parent in topicSplits.ts is a real, retired (non-current) topic id', () => {
  const currentIds = new Set(mockTopics.map((t) => t.id));
  for (const [childId, parents] of Object.entries(SPLIT_TOPIC_PARENTS)) {
    assert.ok(currentIds.has(childId), `${childId} in SPLIT_TOPIC_PARENTS should be a current topic`);
    for (const parent of parents) {
      assert.ok(!currentIds.has(parent), `${parent} is listed as a retired parent but is still a current topic id`);
    }
  }
});

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
