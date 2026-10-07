import React, { Suspense, lazy, type ComponentType, type LazyExoticComponent } from 'react';

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
 * isso). Matéria sem cena, ou aparelho sem WebGL, usa a reserva oferecida pela tela.
 *
 * As cenas carregam sob demanda: o three.js só baixa quando o Hoje mostra uma
 * matéria que tem cena. Cada uma recebe a reserva para voltar a ela se o WebGL
 * falhar depois da sonda: a sonda só cria um contexto de teste, e o de
 * verdade ainda pode ser negado.
 */
type Cena = LazyExoticComponent<ComponentType<{ reserva: React.ReactNode }>>;

type Carga = () => Promise<{ default: ComponentType<{ reserva: React.ReactNode }> }>;

const CARGAS = {
  Física: () => import('./BancadaOptica'),
  Biologia: () => import('./DuplaHelice'),
  Química: () => import('./GeometriaMolecular'),
  Matemática: () => import('./SolidosGeometricos'),
  História: () => import('./LinhaDoTempo'),
  Geografia: () => import('./EstacoesDoAno'),
  Português: () => import('./AnaliseSintatica'),
  Literatura: () => import('./Escansao'),
  Redação: () => import('./CompetenciasEnem'),
  Filosofia: () => import('./Caverna'),
  Sociologia: () => import('./Desigualdade'),
  Atualidades: () => import('./EfeitoEstufa'),
} satisfies Record<string, Carga>;

export const CENAS_POR_MATERIA: Record<string, Cena> = {
  Física: lazy(CARGAS.Física),
  Biologia: lazy(CARGAS.Biologia),
  Química: lazy(CARGAS.Química),
  Matemática: lazy(CARGAS.Matemática),
  História: lazy(CARGAS.História),
  Geografia: lazy(CARGAS.Geografia),
  Português: lazy(CARGAS.Português),
  Literatura: lazy(CARGAS.Literatura),
  Redação: lazy(CARGAS.Redação),
  Filosofia: lazy(CARGAS.Filosofia),
  Sociologia: lazy(CARGAS.Sociologia),
  Atualidades: lazy(CARGAS.Atualidades),
};

export function temCena(materia: string | undefined) {
  return !!materia && materia in CENAS_POR_MATERIA;
}

/**
 * A sonda cria um contexto WebGL de teste. Criada a cada troca de aba, ela
 * custava um contexto novo por toque (medido: `getContext` entre as funções
 * mais caras da troca). A resposta não muda durante a página, então fica
 * guardada, e o contexto de teste é liberado logo.
 */
let webglDisponivel: boolean | undefined;
function suportaWebGL() {
  if (webglDisponivel !== undefined) return webglDisponivel;
  webglDisponivel = sondarWebGL();
  return webglDisponivel;
}

function sondarWebGL() {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl2') || canvas.getContext('webgl')) as WebGLRenderingContext | null;
    gl?.getExtension('WEBGL_lose_context')?.loseContext();
    return !!gl;
  } catch {
    return false;
  }
}

export function CenaDaMateria({ materia, reserva }: { materia: string | undefined; reserva: React.ReactNode }) {
  const Cena = materia ? CENAS_POR_MATERIA[materia] : undefined;
  // Não criar contexto de teste para matéria sem cena, nem baixar as outras
  // onze cenas na abertura: o idle callback disparava todos os imports juntos.
  if (!Cena || !suportaWebGL()) return <>{reserva}</>;
  return (
    // Enquanto o código da cena chega, um palco vazio do mesmo tamanho — não a
    // reserva: o Núcleo montava inteiro (canvas, medição, laço de animação)
    // só para ser trocado pela cena um instante depois, a cada primeira visita.
    <Suspense fallback={<div className="crivo-cena" aria-hidden="true"><div className="crivo-cena__palco" /></div>}>
      <p className="crivo-cena__laboratorio">Laboratório de {materia}</p>
      <Cena reserva={reserva} />
    </Suspense>
  );
}
