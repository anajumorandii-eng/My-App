import { useEffect, useId, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { ArrowLeft, BookOpen, PanelLeft, Printer, Minus, Plus } from 'lucide-react';
import type { ReadingSection } from '../lib/studyReading';
import { readPrintCoverContext, preparedCoverIllustration } from '../lib/printCoverContext';
import { readingPreferences, saveReadingPreferences, type ReadingTheme } from '../lib/readingPreferences';
import './studyReader.css';

export default function StudyReader({ title, content, sections, onClose }: { title: string; content: HTMLElement; sections: ReadingSection[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null), article = useRef<HTMLDivElement>(null);
  const appearance = useRef<HTMLDivElement>(null), appearanceButton = useRef<HTMLButtonElement>(null);
  const [preferences, setPreferences] = useState(readingPreferences), [appearanceOpen, setAppearanceOpen] = useState(false);
  const [active, setActive] = useState(''), [progress, setProgress] = useState(0);
  const headingId = useId(), indexId = useId(), appearanceId = useId();
  const contextRoot = content.hasAttribute('data-print-subject') ? content : content.querySelector<HTMLElement>('[data-print-subject]') || content;
  const context = readPrintCoverContext(contextRoot);
  const specific = context.subtopic && !/^(vis[aã]o geral|obra completa|t[oó]pico completo)$/i.test(context.subtopic) ? context.subtopic : '';
  const displayTitle = context.work ? (specific && specific !== context.work ? `${context.work} · ${specific}` : context.work) : specific || context.topic || title;
  const kind = /^revis/i.test(context.purpose || title) ? 'Revisão' : /^aprofund/i.test(context.purpose || title) ? 'Aprofundamento' : /^resumo/i.test(context.purpose || title) ? 'Resumo' : 'Guia de estudo';
  const isLiterature = /literatura/i.test(context.subject || title);
  const art = preparedCoverIllustration(contextRoot) || (isLiterature ? '/reading/literature.png' : '/reading/notebook.png');
  const close = () => { dialog.current?.close(); onClose(); };
  useEffect(() => {
    article.current?.replaceChildren(content);
    const element = dialog.current!, previous = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previous; };
  }, [content]);
  useEffect(() => saveReadingPreferences(preferences), [preferences]);
  useEffect(() => {
    if (!appearanceOpen) return;
    const dismiss = (event: PointerEvent) => { if (!appearance.current?.contains(event.target as Node) && !appearanceButton.current?.contains(event.target as Node)) setAppearanceOpen(false); };
    document.addEventListener('pointerdown', dismiss);
    return () => document.removeEventListener('pointerdown', dismiss);
  }, [appearanceOpen]);
  const visit = (id: string) => {
    const candidate = document.getElementById(id);
    const target = candidate && dialog.current?.contains(candidate) ? candidate : undefined;
    let parent = target?.parentElement;
    while (parent && parent !== article.current) { if (parent instanceof HTMLDetailsElement) parent.open = true; parent = parent.parentElement; }
    target?.scrollIntoView({ block: 'start' });
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
    setActive(id);
  };
  const updateProgress = () => {
    const element = dialog.current!;
    setProgress(element.scrollHeight > element.clientHeight ? element.scrollTop / (element.scrollHeight - element.clientHeight) * 100 : 0);
  };
  return createPortal(<dialog ref={dialog} className="study-reader study-reader-dialog" data-theme={preferences.theme} style={{ '--reading-size': `${preferences.fontSize}px` } as CSSProperties} aria-label={title} onScroll={updateProgress} onCancel={event => {
    event.preventDefault();
    if (appearanceOpen) { setAppearanceOpen(false); appearanceButton.current?.focus(); } else close();
  }}>
    <header className="study-reader-masthead"><div className="study-reader-topbar">
      <div className="study-reader-brand"><span>CRIVO</span><small>Leitura</small></div>
      <div className="study-reader-tools">
        <button className="study-reader-back" type="button" aria-label="CRIVO · voltar ao material" onClick={close}><ArrowLeft aria-hidden="true" /><span>Voltar ao material</span></button>
        <button type="button" className="study-reader-mode" aria-expanded={preferences.showIndex} aria-controls={indexId} onClick={() => setPreferences(value => ({ ...value, showIndex: !value.showIndex }))}><PanelLeft aria-hidden="true" /><span>{preferences.showIndex ? 'Somente texto' : 'Mostrar núcleos'}</span></button>
        <button ref={appearanceButton} type="button" className="study-reader-aa" aria-label="Ajustar aparência da leitura" aria-expanded={appearanceOpen} aria-controls={appearanceId} onClick={() => setAppearanceOpen(value => !value)}>Aa</button>
        <button type="button" className="study-reader-print" onClick={() => window.print()}><Printer aria-hidden="true" /><span>Imprimir / salvar PDF</span></button>
      </div>
    </div><div className="study-reader-progress" aria-hidden="true"><span style={{ width: `${progress}%` }} /></div></header>
    {appearanceOpen && <div ref={appearance} id={appearanceId} className="study-reader-appearance" role="group" aria-label="Preferências de leitura">
      <p className="study-reader-eyebrow">Seu jeito de ler</p>
      <div className="study-reader-font-controls"><button type="button" aria-label="Diminuir tamanho do texto" disabled={preferences.fontSize <= 16} onClick={() => setPreferences(value => ({ ...value, fontSize: value.fontSize - 1 }))}><Minus aria-hidden="true" />A</button><output aria-live="polite">{preferences.fontSize} px</output><button type="button" aria-label="Aumentar tamanho do texto" disabled={preferences.fontSize >= 26} onClick={() => setPreferences(value => ({ ...value, fontSize: value.fontSize + 1 }))}>A<Plus aria-hidden="true" /></button></div>
      <p className="study-reader-eyebrow">Cor da página</p><div className="study-reader-swatches">{(['paper','sage','night'] as ReadingTheme[]).map(theme => <button type="button" key={theme} data-color={theme} aria-pressed={preferences.theme === theme} onClick={() => setPreferences(value => ({ ...value, theme }))}>{({ paper: 'Marfim', sage: 'Sálvia', night: 'Noturno' })[theme]}</button>)}</div>
    </div>}
    <div className={`study-reader-layout${preferences.showIndex ? '' : ' is-full-width'}`}>
      <aside className="study-reader-index" id={indexId} hidden={!preferences.showIndex}>
        <div className="study-reader-index-heading"><span className="study-reader-eyebrow">Neste caderno</span><BookOpen aria-hidden="true" /></div>
        <nav aria-label="Seções da leitura"><a className={!active ? 'is-active' : ''} href={`#${headingId}`} onClick={event => { event.preventDefault(); visit(headingId); setActive(''); }}><span aria-hidden="true">01</span>Visão geral</a>{sections.map((section,index) => <a className={active === section.id ? 'is-active' : ''} key={section.id} href={`#${section.id}`} onClick={event => { event.preventDefault(); visit(section.id); }}><span aria-hidden="true">{String(index+2).padStart(2,'0')}</span>{section.label}</a>)}</nav>
        <p className="study-reader-index-note">Ler com atenção.<br />Conectar com intenção.</p>
      </aside>
      <main className="study-reader-main">
        <header className="study-reader-hero" id={headingId} tabIndex={-1}>
          <div className="study-reader-meta"><span>{kind}</span>{context.subject && <small>{context.subject}</small>}{context.board && <small>{context.board}</small>}</div>
          <h1>{displayTitle}</h1><p className="study-reader-deck">{isLiterature && /contempor[aâ]nea/i.test(displayTitle) ? 'Vozes, memória e formas de narrar.' : context.purpose && context.purpose.toLocaleLowerCase('pt-BR') !== kind.toLocaleLowerCase('pt-BR') ? context.purpose : 'Seu caderno de leitura.'}</p>
          <img className="study-reader-hero-art" src={art} alt="" aria-hidden="true" decoding="async" />
          <div className="study-reader-hero-bottom"><span><BookOpen aria-hidden="true" />Caderno de leitura · Crivo</span><em>Recordar · Conectar · Aplicar</em></div>
        </header>
        <div ref={article} className="study-reader-content" />
        <footer><span>CRIVO</span><span>Leitura de consulta · respostas e progresso ficam no material.</span></footer>
      </main>
    </div>
  </dialog>, document.body);
}
