import React, { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, Moon, PanelLeftClose, PanelLeftOpen, Sun, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { OnboardingModal } from './OnboardingModal';
import { IconButton } from './ui/IconButton';
import { useTheme } from '../hooks/useTheme';
import { MOTION_DURATION, MOTION_EASE } from '../design-system/motion/tokens';
import { cn } from '../lib/cn';
import { PALETTES, SCREENS } from '../prototypes/NucleoInstrumentalPrototype';

const PATH_BY_SCREEN: Record<string, string> = {
  hoje: '/', diagnostico: '/diagnostico', plano: '/plano', agenda: '/agenda', 'reta-final': '/reta-final', recuperacao: '/recuperacao',
  sessao: '/sessao', questoes: '/questoes', resumos: '/resumos', revisoes: '/revisoes', flashcards: '/flashcards',
  'obras-obrigatorias': '/obras-obrigatorias', obras: '/obras', 'obra-detalhe': '/obras', erros: '/erros', podcast: '/podcast',
  tutor: '/tutor', laboratorio: '/laboratorio', 'treino-2a-fase': '/treino-2a-fase', redacao: '/redacao', estrategias: '/estrategias',
  evolucao: '/evolucao', prioridades: '/prioridades', conexoes: '/conexoes', perfil: '/perfil', admin: '/admin',
  'admin-obras': '/admin/obras', 'admin-conteudo': '/admin/conteudo',
};

const TOP_LEVEL = [
  ['hoje', 'Hoje'], ['plano', 'Plano'], ['sessao', 'Estudar'], ['evolucao', 'Análises'], ['agenda', 'Agenda'],
] as const;

function screenForPath(pathname: string) {
  if (pathname.startsWith('/obras/')) return SCREENS.find((screen) => screen.key === 'obra-detalhe')!;
  return SCREENS.find((screen) => PATH_BY_SCREEN[screen.key] === pathname) ?? SCREENS[0];
}

/** The approved Núcleo composition, populated by the real route outlet. */
export default function NucleoInstrumentalProductionLayout() {
  const { isDark, toggleTheme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [railExpanded, setRailExpanded] = useState(() =>
    typeof window !== 'undefined' && window.localStorage.getItem('crivo_rail_expanded') === 'true',
  );
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const screen = useMemo(() => screenForPath(location.pathname), [location.pathname]);
  const palette = PALETTES[screen.subject] ?? PALETTES.Matemática;

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => { if (!localStorage.getItem('juju_onboarding')) setShowOnboarding(true); }, []);
  useEffect(() => { localStorage.setItem('crivo_rail_expanded', String(railExpanded)); }, [railExpanded]);
  const closeOnboarding = () => { setShowOnboarding(false); localStorage.setItem('juju_onboarding', 'true'); };

  return (
    <div className={cn('ni-prototype ni-production-app', !isDark && 'is-light')} style={{ '--primary': palette.primary, '--secondary': palette.secondary, '--wash': palette.wash } as React.CSSProperties} data-family={palette.family}>
      <header className="ni-production-mobile lg:hidden">
        <IconButton aria-label="Abrir menu" onClick={() => setMenuOpen(true)}><Menu className="h-5 w-5" aria-hidden="true" /></IconButton>
        <strong>Crivo</strong>
        <button type="button" onClick={toggleTheme} aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>{isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button>
      </header>
      {menuOpen && <button className="ni-production-backdrop lg:hidden" aria-label="Fechar menu" onClick={() => setMenuOpen(false)} />}

      <aside className={cn('ni-rail', railExpanded && 'is-expanded', menuOpen && 'is-open')}>
        <button className="ni-mark" aria-label="Ir para Hoje" onClick={() => navigate('/')}><img src="/app-icon.png" alt="" /></button>
        <button className="ni-production-close lg:hidden" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><X aria-hidden="true" /></button>
        <nav className="ni-rail-scroll" aria-label="Todas as telas do app">
          {SCREENS.map((item) => {
            const Icon = item.icon;
            const target = PATH_BY_SCREEN[item.key];
            return <NavLink key={item.key} to={target} end={target === '/'} className={item.key === screen.key ? 'active' : undefined} title={item.label}><span className="ni-icon-depth"><Icon aria-hidden="true" /></span>{railExpanded && <b>{item.label}</b>}</NavLink>;
          })}
        </nav>
        <button
          className="ni-rail-toggle"
          type="button"
          onClick={() => setRailExpanded((expanded) => !expanded)}
          aria-label={railExpanded ? 'Recolher barra lateral' : 'Expandir barra lateral'}
          aria-pressed={railExpanded}
        >
          {railExpanded ? <PanelLeftClose aria-hidden="true" /> : <PanelLeftOpen aria-hidden="true" />}
        </button>
      </aside>

      <div className="ni-page">
        <header className="ni-top">
          <div className="ni-mobile-mark"><img src="/app-icon.png" alt="" /></div><strong>Crivo</strong>
          <nav aria-label="Áreas principais">
            {TOP_LEVEL.map(([key, label]) => {
              const target = PATH_BY_SCREEN[key];
              const active = target === '/' ? location.pathname === '/' : location.pathname.startsWith(target);
              return <NavLink key={key} to={target} className={active ? 'active' : undefined}>{label}</NavLink>;
            })}
          </nav>
          <span className="ni-prototype-badge">DADOS REAIS · {screen.kind.toUpperCase()}</span>
          <button className="ni-theme-toggle" onClick={toggleTheme} aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>{isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}<span>{isDark ? 'claro' : 'escuro'}</span></button>
          <div className="ni-avatar" aria-label="Perfil">AJ</div>
        </header>
        <main className="ni-production-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={location.pathname} className="ni-production-view" initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE }}>
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <BottomNav />
      <OnboardingModal open={showOnboarding} onClose={closeOnboarding} onStartDiagnostic={() => { closeOnboarding(); navigate('/diagnostico'); }} />
    </div>
  );
}
