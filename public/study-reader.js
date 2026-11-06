(() => {
  const root = document.body, layout = document.querySelector('.study-reader-layout');
  if (!layout) return;
  const key = root.dataset.preferencesKey;
  const toggle = document.querySelector('[data-reader-toggle]'), index = document.querySelector('.study-reader-index');
  const appearanceButton = document.querySelector('[data-reader-appearance]'), appearance = document.querySelector('.study-reader-appearance');
  const smaller = document.querySelector('[data-reader-smaller]'), larger = document.querySelector('[data-reader-larger]');
  const defaults = { theme: 'paper', fontSize: 20, showIndex: matchMedia('(min-width: 800px)').matches };
  let preferences = { ...defaults };
  try {
    const stored = JSON.parse(localStorage.getItem(key) || 'null');
    if (stored && typeof stored === 'object') preferences = {
      theme: ['paper','sage','night'].includes(stored.theme) ? stored.theme : defaults.theme,
      fontSize: Number.isFinite(stored.fontSize) ? Math.max(16,Math.min(26,stored.fontSize)) : defaults.fontSize,
      showIndex: typeof stored.showIndex === 'boolean' ? stored.showIndex : defaults.showIndex,
    };
  } catch { /* A leitura continua sem armazenamento. */ }
  const update = () => {
    root.dataset.theme = preferences.theme;
    root.style.setProperty('--reading-size', `${preferences.fontSize}px`);
    layout.classList.toggle('is-full-width', !preferences.showIndex);
    index.hidden = !preferences.showIndex;
    toggle.setAttribute('aria-expanded', String(preferences.showIndex));
    toggle.querySelector('span').textContent = preferences.showIndex ? 'Somente texto' : 'Mostrar núcleos';
    document.querySelector('[data-reader-size]').value = `${preferences.fontSize} px`;
    smaller.disabled = preferences.fontSize <= 16; larger.disabled = preferences.fontSize >= 26;
    document.querySelectorAll('[data-color]').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.color === preferences.theme)));
    try { localStorage.setItem(key, JSON.stringify(preferences)); } catch { /* Sem alterar os dados de estudo. */ }
  };
  toggle.onclick = () => { preferences.showIndex = !preferences.showIndex; update(); };
  appearanceButton.onclick = () => { appearance.hidden = !appearance.hidden; appearanceButton.setAttribute('aria-expanded', String(!appearance.hidden)); };
  smaller.onclick = () => { preferences.fontSize = Math.max(16,preferences.fontSize - 1); update(); };
  larger.onclick = () => { preferences.fontSize = Math.min(26,preferences.fontSize + 1); update(); };
  document.querySelectorAll('[data-color]').forEach(button => { button.onclick = () => { preferences.theme = button.dataset.color; update(); }; });
  const dismiss = () => { appearance.hidden = true; appearanceButton.setAttribute('aria-expanded','false'); };
  document.addEventListener('pointerdown', event => { if (!appearance.contains(event.target) && !appearanceButton.contains(event.target)) dismiss(); });
  document.addEventListener('keydown', event => { if (event.key === 'Escape' && !appearance.hidden) { dismiss(); appearanceButton.focus(); } });
  document.querySelector('[data-reader-print]').onclick = () => window.print();
  document.querySelectorAll('.study-reader-index a').forEach(link => { link.onclick = () => { document.querySelectorAll('.study-reader-index a').forEach(item => item.classList.toggle('is-active', item === link)); }; });
  addEventListener('scroll', () => { const total = document.documentElement.scrollHeight - innerHeight; document.querySelector('.study-reader-progress span').style.width = `${total > 0 ? scrollY / total * 100 : 0}%`; }, { passive: true });
  update();
})();
