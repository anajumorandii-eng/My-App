/** A matriz registra o desenho efetivamente renderizado, inclusive as cenas
 * específicas que conservam a família pedagógica da entrada original. */
const DEDICATED_SCENES: Record<string, string> = {
  'summary-biologia-algas': 'atlas-luz-e-algas',
  'summary-biologia-ciclos-de-vida': 'ciclos-meiose',
  'summary-biologia-bioenergetica-fermentacao-e-respiracao': 'respiracao-compartimentos',
  'bio-ecologia-biomagnificacao': 'biomagnificacao-trofica',
  'summary-fisica-forca-e-seus-tipos': 'forcas-vetores',
  'summary-fisica-colisoes': 'colisoes-momento-energia',
  'summary-fisica-a-fisica-por-tras-da-obtencao-de-energia-eletrica-das-quedas-d-agua-aos-reatores-nucleares': 'geracao-eletrica',
  'summary-fisica-gases-ideais-variaveis-de-estado-e-as-transformacoes-gasosas': 'transformacoes-pv',
  'summary-fisica-eletrostatica-processos-de-eletrizacao-e-aplicacoes': 'eletrizacao-cargas',
};

export function sceneArtifactId(chapterId: string, family: string): string {
  return DEDICATED_SCENES[chapterId] ?? family;
}
