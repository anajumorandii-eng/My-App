/**
 * Visual ownership for every production route.
 *
 * A view can still choose a more specific subject from its own data, but this
 * registry gives every route a calm, consistent instrumental field while it
 * loads and when no item has been selected yet.
 */
export type RouteVisualKind = 'decision' | 'practice' | 'library' | 'analysis' | 'account' | 'admin';

export interface RouteVisual {
  subject?: string;
  kind: RouteVisualKind;
}

const ROUTE_VISUALS: Record<string, RouteVisual> = {
  '/': { kind: 'decision' },
  '/plano': { subject: 'Matemática', kind: 'decision' },
  '/agenda': { kind: 'account' },
  '/reta-final': { subject: 'Atualidades', kind: 'decision' },
  '/sessao': { subject: 'Matemática', kind: 'practice' },
  '/questoes': { subject: 'Física', kind: 'practice' },
  '/resumos': { subject: 'Atualidades', kind: 'library' },
  '/revisoes': { subject: 'Biologia', kind: 'practice' },
  '/erros': { subject: 'Português', kind: 'analysis' },
  '/podcast': { subject: 'Atualidades', kind: 'library' },
  '/tutor': { subject: 'Filosofia', kind: 'library' },
  '/laboratorio': { subject: 'Biologia', kind: 'library' },
  '/evolucao': { subject: 'Geografia', kind: 'analysis' },
  '/prioridades': { subject: 'Atualidades', kind: 'analysis' },
  '/estrategias': { subject: 'Matemática', kind: 'library' },
  '/conexoes': { kind: 'account' },
  '/perfil': { kind: 'account' },
  '/redacao': { subject: 'Redação', kind: 'practice' },
  '/treino-2a-fase': { subject: 'História', kind: 'practice' },
  '/recuperacao': { subject: 'Química', kind: 'decision' },
  '/diagnostico': { kind: 'analysis' },
  '/flashcards': { subject: 'Química', kind: 'practice' },
  '/obras-obrigatorias': { subject: 'Literatura', kind: 'practice' },
  '/obras': { subject: 'Literatura', kind: 'library' },
  '/admin': { kind: 'admin' },
  '/admin/obras': { subject: 'Literatura', kind: 'admin' },
  '/admin/conteudo': { kind: 'admin' },
};

const FALLBACK_VISUAL: RouteVisual = { kind: 'account' };

export function routeVisualFor(pathname: string): RouteVisual {
  if (pathname.startsWith('/obras/')) return { subject: 'Literatura', kind: 'library' };
  return ROUTE_VISUALS[pathname] ?? FALLBACK_VISUAL;
}

export const PRODUCTION_ROUTE_VISUAL_COUNT = Object.keys(ROUTE_VISUALS).length + 1;
