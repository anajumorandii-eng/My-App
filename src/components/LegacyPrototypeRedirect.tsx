import { Navigate, useLocation } from 'react-router-dom';

/**
 * Keeps shared links to the old clickable mock useful after the Núcleo
 * Instrumental became the production application. The old `screen` query is
 * translated to the equivalent real route instead of mounting a static view.
 */
const PROTOTYPE_SCREEN_ROUTES: Record<string, string> = {
  hoje: '/',
  diagnostico: '/diagnostico',
  plano: '/plano',
  agenda: '/agenda',
  'reta-final': '/reta-final',
  recuperacao: '/recuperacao',
  sessao: '/sessao',
  questoes: '/questoes',
  resumos: '/resumos',
  revisoes: '/revisoes',
  flashcards: '/flashcards',
  'obras-obrigatorias': '/obras-obrigatorias',
  obras: '/obras',
  'obra-detalhe': '/obras',
  erros: '/erros',
  podcast: '/podcast',
  tutor: '/tutor',
  laboratorio: '/laboratorio',
  'treino-2a-fase': '/treino-2a-fase',
  redacao: '/redacao',
  estrategias: '/estrategias',
  evolucao: '/evolucao',
  prioridades: '/prioridades',
  conexoes: '/conexoes',
  perfil: '/perfil',
  admin: '/admin',
  'admin-obras': '/admin/obras',
  'admin-conteudo': '/admin/conteudo',
};

export function LegacyPrototypeRedirect() {
  const { search } = useLocation();
  const screen = new URLSearchParams(search).get('screen');

  return <Navigate replace to={screen ? (PROTOTYPE_SCREEN_ROUTES[screen] ?? '/') : '/'} />;
}
