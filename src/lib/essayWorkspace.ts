import { emptyEssayPlan, essayGenres, type EssayPlan } from '../data/essayWorkshop';
export interface EssayVersion { id: string; date: string; board: string; theme: string; draft: string; rewrite: string; plan: EssayPlan }
export function readEssayPlan(key: string): EssayPlan {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '{}');
    const plan = { ...emptyEssayPlan };
    for (const name of Object.keys(plan) as (keyof EssayPlan)[]) if (typeof value?.[name] === 'string') plan[name] = value[name];
    if (!essayGenres.includes(plan.genre)) plan.genre = emptyEssayPlan.genre;
    return plan;
  } catch { return { ...emptyEssayPlan }; }
}
export function readEssayVersions(key: string): EssayVersion[] {
  try {
    const value = JSON.parse(localStorage.getItem(key) ?? '[]');
    return Array.isArray(value) ? value.filter(item => item && typeof item.id === 'string' && typeof item.date === 'string' && typeof item.board === 'string' && typeof item.theme === 'string' && typeof item.draft === 'string' && typeof item.rewrite === 'string' && item.plan && Object.keys(emptyEssayPlan).every(name => typeof item.plan[name] === 'string')) : [];
  } catch { return []; }
}
export function essayCorrectionQuestion(board: string, theme: string, plan: EssayPlan, previous?: { draft: string; rupture: string }): string {
  const { proposal: _proposal, genre: _genre, ...outline } = plan;
  const genre = board === 'ENEM' ? 'Dissertativo-argumentativo' : plan.genre;
  return [
    `Avaliação formativa de redação para ${board}. Tema: ${theme}. Gênero solicitado: ${genre}.`,
    plan.proposal.trim() ? `Proposta e informações da coletânea fornecidas pela estudante:\n${plan.proposal}` : 'A proposta completa e a coletânea não foram fornecidas. Não invente textos de apoio, exigências específicas ou conformidade com informações ausentes.',
    `Projeto da estudante (intenção, não prova de que o texto a realiza):\n${JSON.stringify(outline)}`,
    'Avalie o texto efetivamente escrito: recorte, cumprimento da tarefa, gênero, voz/destinatário, progressão, evidência, raciocínio, coesão e linguagem. Intervenção é exigência do ENEM; nas demais bancas, apenas se a proposta ou o critério fornecido a exigir. Não aplique automaticamente uma tese dissertativa a texto de outro gênero. Não invente nota oficial, dados, referências ou citação. Indique um trecho que sustenta o diagnóstico, explique o mecanismo do erro e proponha uma mudança mínima. O modelo é exemplo formativo, não texto para copiar.',
    previous ? `Reavalie a reescrita, verificando se a ruptura anterior foi resolvida sem criar novo problema. Ruptura anterior: ${previous.rupture}\nVersão original para comparação:\n${previous.draft}` : '',
  ].filter(Boolean).join('\n\n');
}
export function readEssayCurrent(scope: string): Omit<EssayVersion, 'id' | 'date'> {
  try {
    const value = JSON.parse(localStorage.getItem(`crivo_essay_current_v1:${scope}`) ?? 'null');
    if (value && ['ENEM', 'Fuvest', 'Unicamp', 'Unesp/Vunesp', 'Famerp', 'Unifesp'].includes(value.board) && ['theme', 'draft', 'rewrite'].every(key => typeof value[key] === 'string') && value.plan && Object.keys(emptyEssayPlan).every(key => typeof value.plan[key] === 'string')) return value;
  } catch { /* Um registro inválido não substitui o rascunho legado. */ }
  return { board: 'ENEM', theme: scope === 'demo' ? localStorage.getItem('juju-essay-theme') ?? '' : '', draft: scope === 'demo' ? localStorage.getItem('juju-essay-draft') ?? '' : '', rewrite: scope === 'demo' ? localStorage.getItem('juju-essay-rewrite') ?? '' : '', plan: readEssayPlan(`crivo_essay_plan_v1:${scope}`) };
}
