import React, { Suspense, lazy, useMemo, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Cena 3D do tópico no cartão da decisão do Hoje.
 *
 * O registro é por tópico, não por matéria. Pela matéria, a bancada óptica
 * aparecia em qualquer decisão de Física — "Circuitos Elétricos" abriria uma
 * lente, o mesmo erro de emprestar ilustração de outro assunto que a regra do
 * Visual proíbe (`ap_mat_fuvest_110`, prancha necessária). A cena só entra
 * onde o objeto dela é o assunto do tópico; o resto fica com o Núcleo do
 * Crivo (o `reserva`), assim como o aparelho sem WebGL.
 *
 * As cenas carregam sob demanda: o three.js só baixa quando o Hoje mostra um
 * tópico que tem cena. Cada uma recebe a reserva para voltar a ela se o WebGL
 * falhar depois da sonda: a sonda só cria um contexto de teste, e o de
 * verdade ainda pode ser negado.
 */
type Cena = LazyExoticComponent<ComponentType<{ reserva: React.ReactNode }>>;

const BANCADA_OPTICA: Cena = lazy(() => import('./BancadaOptica'));
const DUPLA_HELICE: Cena = lazy(() => import('./DuplaHelice'));
const GEOMETRIA_MOLECULAR: Cena = lazy(() => import('./GeometriaMolecular'));

export const CENAS_POR_TOPICO: Record<string, Cena> = {
  // Lentes, focos e imagem: o objeto das duas óticas.
  fis_optica_geometrica: BANCADA_OPTICA,
  fis_optica_instrumental: BANCADA_OPTICA,
  // Ácidos nucleicos, pareamento e o códon que o molde forma.
  bio_codigo_genetico_sintese: DUPLA_HELICE,
  // A forma da molécula no espaço: é o próprio assunto do tópico.
  qui_polaridade_geometria: GEOMETRIA_MOLECULAR,
};

export function temCena(topicId: string | undefined) {
  return !!topicId && topicId in CENAS_POR_TOPICO;
}

function suportaWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function CenaDaMateria({ topicId, reserva }: { topicId: string | undefined; reserva: React.ReactNode }) {
  const webgl = useMemo(suportaWebGL, []);
  const Cena = topicId ? CENAS_POR_TOPICO[topicId] : undefined;
  if (!Cena || !webgl) return <>{reserva}</>;
  return (
    <Suspense fallback={reserva}>
      <Cena reserva={reserva} />
    </Suspense>
  );
}
