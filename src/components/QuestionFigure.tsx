import React, { useEffect, useRef, useState } from 'react';
import { transparentFigurePixels } from '../lib/figureTransparency';

const cache = new Map<string, string>();

/** Transparência apenas na renderização: nenhuma prova é redesenhada. */
export function QuestionFigure({ url, alt }: { url: string; alt: string }) {
  const ref = useRef<HTMLImageElement>(null);
  const [rendered, setRendered] = useState<{ source: string; url: string } | null>(null);
  useEffect(() => {
    let cancelled = false;
    const image = new Image();
    image.crossOrigin = 'anonymous';
    const paint = () => {
      if (cancelled || !ref.current || !image.naturalWidth) return;
      const style = getComputedStyle(ref.current);
      // A propriedade de tinta muda imediatamente; `color` pode estar no
      // primeiro quadro de uma transição de tema do cartão.
      const color = style.getPropertyValue('--text').trim() || style.color;
      const key = `${url}:${color}`;
      let output = cache.get(key);
      if (!output) {
        const canvas = document.createElement('canvas');
        canvas.width = image.naturalWidth; canvas.height = image.naturalHeight;
        const context = canvas.getContext('2d');
        if (!context) return;
        try {
          context.fillStyle = color;
          context.fillRect(0, 0, 1, 1);
          const ink = context.getImageData(0, 0, 1, 1).data;
          context.clearRect(0, 0, 1, 1);
          context.drawImage(image, 0, 0);
          const pixels = context.getImageData(0, 0, canvas.width, canvas.height);
          pixels.data.set(transparentFigurePixels(pixels.data, canvas.width, canvas.height, ink));
          context.putImageData(pixels, 0, 0);
          output = canvas.toDataURL('image/png');
          // Evita acumular todas as imagens do banco na memória da sessão.
          if (cache.size >= 32) cache.delete(cache.keys().next().value!);
          cache.set(key, output);
        } catch {
          // Uma fonte remota sem CORS continua legível como imagem original.
          return;
        }
      }
      setRendered({ source: url, url: output });
    };
    image.onload = paint;
    image.src = url;
    const observer = new MutationObserver(paint);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class', 'style', 'data-fundo', 'data-ambiente'] });
    return () => { cancelled = true; image.onload = null; observer.disconnect(); };
  }, [url]);
  const ready = rendered?.source === url;
  return <img ref={ref} src={ready ? rendered.url : url} data-source={url}
    data-background={ready ? 'transparent' : 'pending'} alt={alt} loading="lazy"
    className="block max-w-full h-auto mx-auto" />;
}
