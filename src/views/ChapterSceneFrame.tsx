import React, { useEffect, useId, useRef, useState } from 'react';
import { Maximize2, Minimize2 } from 'lucide-react';
import { StudyObjectIcon } from './visual-boards/StudyObjectIcon';
import './ChapterSceneFrame.css';

/** A mesma cena fica no lugar ao ampliar: medidas, casos e evidências não são reiniciados. */
export function ChapterSceneFrame({ chapterId, subject, title, topic, children }: {
  chapterId: string; subject: string; title: string; topic: string; children: React.ReactNode;
}) {
  const [focused, setFocused] = useState(false);
  const root = useRef<HTMLDivElement>(null), toggle = useRef<HTMLButtonElement>(null);
  const id = useId();
  useEffect(() => { setFocused(false); }, [chapterId]);
  useEffect(() => {
    if (!focused || !root.current) return;
    const element = root.current;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    // Isola o resto da aplicação sem mover nem remontar a cena interativa.
    const siblings: Array<{ element: HTMLElement; inert: boolean }> = [];
    let current: HTMLElement = element;
    while (current.parentElement) {
      for (const sibling of Array.from(current.parentElement.children)) {
        if (sibling !== current && sibling instanceof HTMLElement) {
          siblings.push({ element: sibling, inert: sibling.inert === true }); sibling.inert = true;
        }
      }
      current = current.parentElement;
      if (current === document.body) break;
    }
    toggle.current?.focus();
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); setFocused(false); }
      if (event.key !== 'Tab') return;
      const candidates = Array.from(element.querySelectorAll<HTMLElement>('button:not(:disabled),input:not(:disabled),select:not(:disabled),textarea:not(:disabled),a[href],[tabindex="0"]'))
        .filter(e => e.getClientRects().length > 0);
      const first = candidates[0], last = candidates.at(-1);
      if (!first) { event.preventDefault(); toggle.current?.focus(); return; }
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last?.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    };
    document.addEventListener('keydown', keyboard, true);
    return () => {
      document.removeEventListener('keydown', keyboard, true);
      document.body.style.overflow = previousOverflow;
      siblings.forEach(s => { s.element.inert = s.inert; });
      toggle.current?.focus();
    };
  }, [focused]);
  return <div ref={root} className={`vs-chapter-scene${focused ? ' vs-chapter-scene--focus' : ''}`}
    data-chapter-scene={chapterId} role={focused ? 'dialog' : undefined} aria-modal={focused || undefined} aria-labelledby={focused ? id : undefined}>
    <header className="vs-chapter-scene-tools">
      <StudyObjectIcon subject={subject} topic={topic + ' ' + title} />
      <div><small>{subject} · cena do capítulo</small><strong id={id}>{title}</strong></div>
      <button ref={toggle} type="button" onClick={() => setFocused(!focused)} aria-expanded={focused}>
        {focused ? <Minimize2 aria-hidden="true" /> : <Maximize2 aria-hidden="true" />}
        <span>{focused ? 'Sair do modo foco' : 'Explorar em foco'}</span>
      </button>
    </header>
    <div className="vs-chapter-scene-body">{children}</div>
  </div>;
}
