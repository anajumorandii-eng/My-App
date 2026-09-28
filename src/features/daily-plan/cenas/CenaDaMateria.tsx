import React, { Suspense, lazy, useMemo, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Cena 3D da matéria no cartão da decisão do Hoje.
 *
 * Cada matéria ganha a sua cena à medida que é desenhada; quem ainda não tem,
 * ou o aparelho sem WebGL, fica com o Núcleo do Crivo (o `reserva`). As cenas
 * carregam sob demanda: o three.js só baixa quando o Hoje mostra uma matéria
 * que tem cena, e não pesa nas outras telas.
 */
// A cena recebe a reserva para voltar a ela se o WebGL falhar depois da sonda:
// a sonda só cria um contexto de teste, e o de verdade ainda pode ser negado.
const CENAS: Record<string, LazyExoticComponent<ComponentType<{ reserva: React.ReactNode }>>> = {
  Física: lazy(() => import('./BancadaOptica')),
};

export function temCena(materia: string) {
  return materia in CENAS;
}

function suportaWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function CenaDaMateria({ materia, reserva }: { materia: string; reserva: React.ReactNode }) {
  const webgl = useMemo(suportaWebGL, []);
  const Cena = CENAS[materia];
  if (!Cena || !webgl) return <>{reserva}</>;
  return (
    <Suspense fallback={reserva}>
      <Cena reserva={reserva} />
    </Suspense>
  );
}
