import React, { Suspense, lazy, useMemo, type ComponentType, type LazyExoticComponent } from 'react';

/**
 * Cena 3D da matéria no cartão da decisão do Hoje.
 *
 * O registro é por matéria, por decisão da Ana Júlia (29/09/2026). Antes era
 * por tópico, para a cena só aparecer onde o objeto dela era o assunto — e na
 * prática quase nunca aparecia: das doze abas do Hoje, só a de Física mostrava
 * cena, porque "Evolução" e "Estequiometria" não são DNA nem molécula. Ela
 * preferiu que cada matéria tenha sempre o seu laboratório.
 *
 * Para não parecer que a cena ilustra o tópico do dia quando não ilustra, ela
 * se apresenta como "Laboratório de <matéria>" (a regra de não emprestar
 * ilustração, do Visual, continua valendo lá: aqui a cena é da matéria, e diz
 * isso). Matéria sem cena, ou aparelho sem WebGL, fica com o Núcleo do Crivo.
 *
 * As cenas carregam sob demanda: o three.js só baixa quando o Hoje mostra uma
 * matéria que tem cena. Cada uma recebe a reserva para voltar a ela se o WebGL
 * falhar depois da sonda: a sonda só cria um contexto de teste, e o de
 * verdade ainda pode ser negado.
 */
type Cena = LazyExoticComponent<ComponentType<{ reserva: React.ReactNode }>>;

export const CENAS_POR_MATERIA: Record<string, Cena> = {
  Física: lazy(() => import('./BancadaOptica')),
  Biologia: lazy(() => import('./DuplaHelice')),
  Química: lazy(() => import('./GeometriaMolecular')),
};

export function temCena(materia: string | undefined) {
  return !!materia && materia in CENAS_POR_MATERIA;
}

function suportaWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

export function CenaDaMateria({ materia, reserva }: { materia: string | undefined; reserva: React.ReactNode }) {
  const webgl = useMemo(suportaWebGL, []);
  const Cena = materia ? CENAS_POR_MATERIA[materia] : undefined;
  if (!Cena || !webgl) return <>{reserva}</>;
  return (
    <Suspense fallback={reserva}>
      <p className="crivo-cena__laboratorio">Laboratório de {materia}</p>
      <Cena reserva={reserva} />
    </Suspense>
  );
}
