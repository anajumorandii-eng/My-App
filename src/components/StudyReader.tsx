import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { ReadingSection } from '../lib/studyReading';
import './studyReader.css';

export default function StudyReader({ title, content, sections, onClose }: { title: string; content: HTMLElement; sections: ReadingSection[]; onClose: () => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const article = useRef<HTMLDivElement>(null);
  const headingId = useId();
  useEffect(() => {
    article.current?.replaceChildren(content);
    const element = dialog.current!;
    const previous = document.body.style.overflow;
    element.showModal(); document.body.style.overflow = 'hidden';
    return () => { element.close(); document.body.style.overflow = previous; };
  }, [content]);
  const close = () => { dialog.current?.close(); onClose(); };
  const visit = (id: string) => {
    const target = document.getElementById(id);
    let parent = target?.parentElement;
    while (parent && parent !== article.current) { if (parent instanceof HTMLDetailsElement) parent.open = true; parent = parent.parentElement; }
    target?.scrollIntoView({ block: 'start' });
    if (target instanceof HTMLElement) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  };
  return createPortal(<dialog ref={dialog} className="study-reader-dialog" aria-labelledby={headingId} onCancel={(event) => { event.preventDefault(); close(); }}>
    <header className="study-reader-masthead"><button type="button" onClick={close}>CRIVO · voltar ao material</button><button type="button" onClick={() => window.print()}>Imprimir / salvar PDF</button></header>
    <div className="study-reader-layout">
      <aside className="study-reader-index"><details open><summary>Consultar por seção</summary><nav aria-label="Seções da leitura">{sections.length ? sections.map(section => <a key={section.id} href={`#${section.id}`} onClick={(event) => { event.preventDefault(); visit(section.id); }}>{section.label}</a>) : <a href={`#${headingId}`} onClick={(event) => { event.preventDefault(); visit(headingId); }}>Início do material</a>}</nav></details></aside>
      <main className="study-reader-main"><h1 id={headingId}>{title}</h1><div ref={article} className="study-reader-content" /><footer>CRIVO · Guia para consulta e leitura. Para registrar respostas e progresso, volte ao material.</footer></main>
    </div>
  </dialog>, document.body);
}
