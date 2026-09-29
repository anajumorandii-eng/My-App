import { useEffect, useState } from 'react';

/**
 * O que a cena 3D precisa ler do ambiente do app: a cor da matéria e o tema.
 *
 * O WebGL não enxerga variável CSS: a cor precisa ser lida do <html> e
 * repassada ao material. Sem isso a cena ficaria numa cor só, o mesmo defeito
 * das fichas raster que ela substitui — que não acompanhavam nem o tema nem a
 * matéria. O resto da paleta (papel, latão, tinta) é fixo por tema e mora no
 * motor da cena: é a identidade do Crivo, não da matéria.
 */
export interface CoresDaCena {
  acento: string;
  escuro: boolean;
}

function misturar(cor: string, alvo: number, quanto: number) {
  const m = /^#([0-9a-f]{6})$/i.exec(cor.trim());
  if (!m) return cor;
  const n = parseInt(m[1], 16);
  const canal = (d: number) => {
    const v = (n >> d) & 255;
    return Math.round(v + (alvo - v) * quanto).toString(16).padStart(2, '0');
  };
  return `#${canal(16)}${canal(8)}${canal(0)}`;
}

/** Mistura a cor com preto. Aceita #rrggbb; outro formato volta como veio. */
export const escurecer = (cor: string, quanto: number) => misturar(cor, 0, quanto);
/** Mistura a cor com branco. Aceita #rrggbb; outro formato volta como veio. */
export const clarear = (cor: string, quanto: number) => misturar(cor, 255, quanto);

function ler(): CoresDaCena {
  const raiz = typeof document !== 'undefined' ? document.documentElement : null;
  const acento = (raiz && getComputedStyle(raiz).getPropertyValue('--amb-a-neon').trim()) || '#22d3ee';
  return { acento, escuro: raiz?.classList.contains('dark') ?? true };
}

/** Relê as cores quando o tema ou o ambiente mudam no <html>. */
export function useCoresDaCena(): CoresDaCena {
  const [cores, setCores] = useState(ler);
  useEffect(() => {
    const raiz = document.documentElement;
    const observador = new MutationObserver(() => {
      const novas = ler();
      // O observador dispara a cada mudança de estilo no <html>; sem a
      // comparação, cada uma remontaria a cena inteira.
      setCores((antes) => (antes.acento === novas.acento && antes.escuro === novas.escuro ? antes : novas));
    });
    observador.observe(raiz, { attributes: true, attributeFilter: ['class', 'style', 'data-ambiente-nome'] });
    return () => observador.disconnect();
  }, []);
  return cores;
}
