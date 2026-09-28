import { useEffect, useState } from 'react';

/**
 * Cores das cenas 3D, lidas do ambiente do app.
 *
 * O WebGL não enxerga variável CSS: a cor precisa ser lida do <html> e
 * repassada ao material. Sem isso a cena ficaria numa cor só, o mesmo defeito
 * das fichas raster que ela substitui — que não acompanhavam nem o tema nem a
 * matéria.
 */
export interface CoresDaCena {
  raio: string;
  raioNucleo: string;
  objeto: string;
  imagem: string;
  eixo: string;
  marca: string;
  latao: string;
  aco: string;
  metalEscuro: string;
  vidro: string;
  anteparo: string;
  ceu: string;
  chao: string;
  /** Estúdio: fundo curvo, mesa e névoa. A cena tem cenário próprio, como uma vitrine dentro do cartão. */
  fundo: string;
  mesa: string;
  /** Multiplicador da emissão. No claro, emissão alta devolve ao acento escurecido o brilho que tirava o contraste. */
  brilho: number;
  escuro: boolean;
}

/** Mistura a cor com preto. Aceita #rrggbb; outro formato volta como veio. */
function escurecer(cor: string, quanto: number) {
  const m = /^#([0-9a-f]{6})$/i.exec(cor.trim());
  if (!m) return cor;
  const n = parseInt(m[1], 16);
  const canal = (deslocamento: number) => Math.round(((n >> deslocamento) & 255) * (1 - quanto)).toString(16).padStart(2, '0');
  return `#${canal(16)}${canal(8)}${canal(0)}`;
}

function ler(): CoresDaCena {
  const raiz = typeof document !== 'undefined' ? document.documentElement : null;
  const estilo = raiz ? getComputedStyle(raiz) : null;
  const acento = estilo?.getPropertyValue('--amb-a-neon').trim() || '#e2a261';
  const escuro = raiz?.classList.contains('dark') ?? true;
  // No claro, o acento vivo e o âmbar do objeto sumiam no creme; escurecidos,
  // guardam a cor e ganham contraste.
  const acentoLegivel = escuro ? acento : escurecer(acento, 0.42);
  return {
    raio: acentoLegivel,
    raioNucleo: escuro ? '#fff6e8' : acentoLegivel,
    objeto: escuro ? '#ffc46b' : '#b8650f',
    imagem: acentoLegivel,
    eixo: escuro ? '#8a8f86' : '#6b6259',
    marca: escuro ? '#c9c3b6' : '#e9e2d4',
    latao: '#b8894e',
    aco: '#c8ccd0',
    metalEscuro: escuro ? '#23262a' : '#2e3136',
    vidro: '#dff2ff',
    anteparo: escuro ? '#a7a39b' : '#f4efe5',
    ceu: escuro ? '#cfd8ff' : '#ffffff',
    chao: escuro ? '#1a1410' : '#d8cdbd',
    fundo: escuro ? '#080a09' : '#efe8dc',
    mesa: escuro ? '#0e1010' : '#ddd3c3',
    brilho: escuro ? 1 : 0.38,
    escuro,
  };
}

/** Relê as cores quando o tema ou o ambiente mudam no <html>. */
export function useCoresDaCena(): CoresDaCena {
  const [cores, setCores] = useState(ler);
  useEffect(() => {
    const raiz = document.documentElement;
    const observador = new MutationObserver(() => setCores(ler()));
    observador.observe(raiz, { attributes: true, attributeFilter: ['class', 'style', 'data-ambiente-nome'] });
    return () => observador.disconnect();
  }, []);
  return cores;
}
