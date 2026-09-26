const { test } = require('node:test');
const assert = require('node:assert/strict');
const { readFileSync } = require('node:fs');
const { join } = require('node:path');
const { JSDOM } = require('jsdom');

const html = readFileSync(join(__dirname, '../aj-motion-lab-preview.html'), 'utf8');

function openLab() {
  const errors = [];
  const dom = new JSDOM(html, {
    runScripts: 'dangerously',
    url: 'http://localhost/',
    beforeParse(window) {
      window.addEventListener('error', event => errors.push(event.message));
    },
  });
  return { document: dom.window.document, errors };
}

test('each subject requires real manipulation before verification', () => {
  const { document: d, errors } = openLab();
  for (const key of ['math', 'bio', 'chem']) {
    d.querySelector(`[data-subject="${key}"]`).click();
    d.querySelector('#prediction-options button').click();
    assert.equal(d.querySelector('#answer-options button').disabled, true, key);
    const slider = d.querySelector('#control');
    slider.value = Number(slider.value) + 1;
    slider.dispatchEvent(new d.defaultView.Event('input', { bubbles: true }));
    assert.equal(d.querySelector('#answer-options button').disabled, false, key);
  }
  assert.deepEqual(errors, []);
});

test('example priority is labeled and SVG description changes with subject', () => {
  const { document: d } = openLab();
  for (const key of ['math', 'bio', 'chem']) {
    d.querySelector(`[data-subject="${key}"]`).click();
    assert.match(d.querySelector('.reason').textContent, /demonstração/i);
    assert.match(d.querySelector('#viz-title').textContent, new RegExp(d.querySelector('#topic-title').textContent, 'i'));
    assert.match(d.querySelector('#viz-desc').textContent, key === 'math' ? /curva/i : key === 'bio' ? /oxigênio/i : /reagentes/i);
  }
});

test('next action opens actual practice questions', () => {
  const { document: d } = openLab();
  d.querySelector('#prediction-options button').click();
  const slider = d.querySelector('#control');
  slider.value = Number(slider.value) + 1;
  slider.dispatchEvent(new d.defaultView.Event('input', { bubbles: true }));
  d.querySelector('#answer-options button').click();
  d.querySelector('#cta').click();
  assert.equal(d.querySelectorAll('#practice fieldset').length, 2);
});

test('biology uses nutrient stages and chemistry uses a reagent action', () => {
  const { document: d } = openLab();
  d.querySelector('[data-subject="bio"]').click();
  assert.equal(d.querySelector('#control').hidden, true);
  d.querySelector('#prediction-options button').click();
  assert.equal(d.querySelectorAll('#subject-actions button').length, 3);
  d.querySelector('#subject-actions button:last-child').click();
  assert.equal(d.querySelector('#answer-options button').disabled, false);

  d.querySelector('[data-subject="chem"]').click();
  assert.equal(d.querySelector('#answer-options button').disabled, true);
  d.querySelector('#prediction-options button').click();
  assert.equal(d.querySelectorAll('#subject-actions button').length, 1);
  d.querySelector('#subject-actions button').click();
  assert.equal(d.querySelector('#answer-options button').disabled, false);
  assert.match(d.querySelector('#annotation').textContent, /reagente/i);
});

test('fast slider input is excluded from live announcements', () => {
  const { document: d } = openLab();
  assert.equal(d.querySelector('#annotation').hasAttribute('aria-live'), false);
  d.querySelector('#prediction-options button').click();
  const live = d.querySelector('#live');
  live.textContent = '';
  const slider = d.querySelector('#control');
  slider.value = '181';
  slider.dispatchEvent(new d.defaultView.Event('input'));
  assert.equal(live.textContent, '');
  slider.dispatchEvent(new d.defaultView.Event('change'));
  assert.ok(live.textContent.length > 0);
});

test('chemical addition does not depict fewer reagents than before addition', () => {
  const { document: d } = openLab();
  d.querySelector('[data-subject="chem"]').click();
  const initialReagents = d.querySelectorAll('#viz-content circle').length;
  d.querySelector('#prediction-options button').click();
  d.querySelector('#subject-actions button').click();
  assert.ok(d.querySelectorAll('#viz-content circle').length >= initialReagents);
});
