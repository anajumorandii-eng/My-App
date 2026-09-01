import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import {
  Calendar,
  Map,
  PlayCircle,
  HelpCircle,
  Repeat,
  BookX,
  Headphones,
  Brain,
  FlaskConical,
  TrendingUp,
  Target,
  Compass,
  Link as LinkIcon,
  Sun,
  Moon,
  UserCircle,
  PenLine,
  ClipboardEdit,
  ListTodo,
  Stethoscope,
  Flag,
  X,
  Menu,
  Layers,
  BookOpen,
  Library,
  PanelLeftClose,
  PanelLeftOpen,
  type LucideIcon,
} from 'lucide-react';
import { CrivoMark } from './CrivoMark';
import { OnboardingModal } from './OnboardingModal';
import { BottomNav } from './BottomNav';
import { IconButton } from './ui/IconButton';
import { useTheme } from '../hooks/useTheme';
import { useSpotlight } from '../hooks/useSpotlight';
import { MOTION_DURATION, MOTION_EASE } from '../design-system/motion/tokens';
import { cn } from '../lib/cn';
import { routePresentationFor } from './layout/routePresentation';
import { RouteVisualShell } from './layout/RouteVisualShell';

interface NavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const NAV_GROUPS: NavGroup[] = [
  {
    label: 'Diagnóstico & Plano',
    items: [
      { name: 'Hoje', path: '/', icon: Calendar },
      { name: 'Diagnóstico', path: '/diagnostico', icon: Stethoscope },
      { name: 'Plano', path: '/plano', icon: Map },
      { name: 'Agenda', path: '/agenda', icon: Calendar },
      { name: 'Reta Final', path: '/reta-final', icon: Flag },
      { name: 'Recuperação de Atrasos', path: '/recuperacao', icon: ListTodo },
    ],
  },
  {
    label: 'Prática',
    items: [
      { name: 'Sessão de Estudo', path: '/sessao', icon: PlayCircle },
      { name: 'Questões & Tentativas', path: '/questoes', icon: HelpCircle },
      { name: 'Resumos Interativos', path: '/resumos', icon: Library },
      { name: 'Revisões Adaptativas', path: '/revisoes', icon: Repeat },
      { name: 'Flashcards', path: '/flashcards', icon: Layers },
      { name: 'Flashcards de Obras', path: '/obras-obrigatorias', icon: BookOpen },
      { name: 'Dossiês de Obras', path: '/obras', icon: Library },
      { name: 'Caderno de Erros', path: '/erros', icon: BookX },
    ],
  },
  {
    label: 'Aprofundamento',
    items: [
      { name: 'Podcast Crivo', path: '/podcast', icon: Headphones },
      { name: 'Tutor Socrático', path: '/tutor', icon: Brain },
      { name: 'Laboratório & Métodos', path: '/laboratorio', icon: FlaskConical },
      { name: 'Treino de 2ª Fase', path: '/treino-2a-fase', icon: ClipboardEdit },
      { name: 'Módulo de Redação', path: '/redacao', icon: PenLine },
      { name: 'Estratégias de Resolução', path: '/estrategias', icon: Compass },
    ],
  },
  {
    label: 'Acompanhamento',
    items: [
      { name: 'Evolução & Domínio', path: '/evolucao', icon: TrendingUp },
      { name: 'Prioridades por Vestibular', path: '/prioridades', icon: Target },
    ],
  },
  {
    label: 'Conta',
    items: [
      { name: 'Conexões Google', path: '/conexoes', icon: LinkIcon },
      { name: 'Perfil', path: '/perfil', icon: UserCircle },
    ],
  },
];

const TOP_LEVEL_NAV: NavItem[] = [
  { name: 'Hoje', path: '/', icon: Calendar },
  { name: 'Plano', path: '/plano', icon: Map },
  { name: 'Estudar', path: '/sessao', icon: PlayCircle },
  { name: 'Análises', path: '/evolucao', icon: TrendingUp },
  { name: 'Agenda', path: '/agenda', icon: Calendar },
];

const RAIL_STORAGE_KEY = 'crivo_rail_expanded';

function getStoredRailExpanded(): boolean {
  try {
    const stored = localStorage.getItem(RAIL_STORAGE_KEY);
    return stored === null ? false : stored === 'true';
  } catch {
    return false;
  }
}

const NAV_ITEM_CLASS = (isActive: boolean, compact: boolean) =>
  cn(
    'spotlight relative flex items-center gap-3 px-2.5 py-2 min-h-11 rounded-control text-sm transition-all',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    compact && 'justify-center px-0',
    isActive
      ? 'bg-[var(--ni-surface2)] text-[var(--ni-text)] font-semibold shadow-sm border border-[var(--ni-line)]'
      : 'text-[var(--ni-dim)] hover:bg-[var(--ni-surface2)] hover:text-[var(--ni-text)] font-medium'
  );

export default function Layout() {
  const { isDark, toggleTheme } = useTheme();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [railExpanded, setRailExpanded] = useState(getStoredRailExpanded);
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const { onPointerMove } = useSpotlight();
  const presentation = routePresentationFor(location.pathname);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const hasSeenOnboarding = localStorage.getItem('juju_onboarding');
    if (!hasSeenOnboarding) {
      setShowOnboarding(true);
    }
  }, []);

  const closeOnboarding = () => {
    setShowOnboarding(false);
    localStorage.setItem('juju_onboarding', 'true');
  };

  const startOnboardingDiagnostic = () => {
    closeOnboarding();
    navigate('/diagnostico');
  };

  const toggleRail = () => {
    setRailExpanded((prev) => {
      const next = !prev;
      try {
        localStorage.setItem(RAIL_STORAGE_KEY, String(next));
      } catch {
        // best-effort persistence only
      }
      return next;
    });
  };

  const railTransitionClass = reducedMotion ? '' : 'transition-[width] duration-[280ms] ease-[cubic-bezier(0.4,0,0.2,1)]';

  return (
    <div className={cn("crivo-app-shell min-h-screen flex flex-col lg:flex-row font-sans selection:bg-action-primary/20", "ni-prototype", !isDark && "is-light")}>
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center justify-between px-3 border-b border-[var(--ni-line)] bg-[var(--ni-surface)]/90 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <IconButton aria-label="Abrir menu" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-5 h-5" aria-hidden="true" />
          </IconButton>
          <CrivoMark className="w-5 h-5 text-ember-500" />
          <h1 className="font-display text-lg font-semibold tracking-tight">Crivo</h1>
        </div>
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
          className="p-2 rounded-full border border-[var(--ni-line)] bg-[var(--ni-surface2)] text-[var(--ni-text)]"
        >
          {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar rail */}
      <aside
        className={cn(
          'ni-rail bg-[var(--ni-surface)]/95 backdrop-blur-xl border-r border-[var(--ni-line)] flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 transform lg:static lg:translate-x-0 lg:z-auto',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64',
          railExpanded ? 'lg:w-64' : 'lg:w-[76px]',
          railTransitionClass
        )}
      >
        <div className={cn('h-16 flex items-center border-b border-[var(--ni-line)]', railExpanded ? 'justify-between px-5' : 'lg:justify-center px-5 lg:px-0')}>
          <div className={cn('flex items-center gap-2.5', !railExpanded && 'lg:gap-0')}>
            <span className="w-8 h-8 rounded-lg bg-[rgba(230,240,234,0.06)] border border-[var(--ember-500)] flex items-center justify-center text-[var(--ember-500)] text-sm shadow-[0_0_12px_rgba(201,164,104,0.25)]">
              ◉
            </span>
            <h1 className={cn('font-display text-xl font-semibold tracking-tight text-[var(--ni-text)] whitespace-nowrap', !railExpanded && 'lg:hidden')}>
              Crivo
            </h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
            className="lg:hidden p-2 -mr-2 min-w-11 min-h-11 flex items-center justify-center rounded-control text-[var(--ni-dim)] hover:bg-[var(--ni-surface2)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2.5 space-y-4">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className={cn('px-2.5 mb-1.5 text-[10px] font-mono font-semibold uppercase tracking-widest text-[var(--ni-faint)] whitespace-nowrap', !railExpanded && 'lg:hidden')}>
                {group.label}
              </p>
              <div className="space-y-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                  return (
                    <NavLink
                      key={item.path}
                      to={item.path}
                      end={item.path === '/'}
                      onClick={() => setMobileMenuOpen(false)}
                      onPointerMove={onPointerMove}
                      title={!railExpanded ? item.name : undefined}
                      className={({ isActive: active }) => NAV_ITEM_CLASS(active, !railExpanded)}
                    >
                      {isActive && (
                        <motion.span
                          layoutId="nav-active-glow"
                          className="absolute left-0 inset-y-1.5 w-0.5 rounded-full bg-[var(--subject-primary,#6E93B3)] shadow-[0_0_8px_var(--subject-primary,#6E93B3)]"
                          transition={reducedMotion ? { duration: 0 } : { duration: MOTION_DURATION.panel, ease: MOTION_EASE }}
                        />
                      )}
                      <span className="ni-icon-depth">
                        <Icon className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                      </span>
                      <span className={cn('whitespace-nowrap text-xs font-medium', !railExpanded && 'lg:sr-only')}>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={cn('p-3 border-t border-[var(--ni-line)] space-y-2.5', !railExpanded && 'lg:px-2')}>
          <div className={cn('flex items-center justify-center gap-3 text-xs text-[var(--ni-faint)] font-mono', !railExpanded && 'lg:hidden')}>
            <NavLink to="/admin" className="hover:text-[var(--ni-text)] hover:underline">Admin</NavLink>
            <span aria-hidden="true">·</span>
            <NavLink to="/admin/obras" className="hover:text-[var(--ni-text)] hover:underline">Obras</NavLink>
            <span aria-hidden="true">·</span>
          </div>
          <button
            onClick={toggleTheme}
            title={!railExpanded ? `Modo ${isDark ? 'Claro' : 'Escuro'}` : undefined}
            className={cn(
              'spotlight flex items-center justify-center w-full min-h-10 px-3 py-1.5 text-xs font-mono font-medium rounded-control text-[var(--ni-text)] bg-[var(--ni-surface2)] border border-[var(--ni-line)] hover:border-[var(--subject-primary,#6E93B3)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
              !railExpanded && 'lg:px-0'
            )}
            onPointerMove={onPointerMove}
          >
            {isDark ? <Sun className="w-4 h-4 shrink-0 text-amber-300" aria-hidden="true" /> : <Moon className="w-4 h-4 shrink-0 text-sky-600" aria-hidden="true" />}
            <span className={cn('ml-2', !railExpanded && 'lg:sr-only')}>Modo {isDark ? 'Claro' : 'Escuro'}</span>
          </button>
          <button
            onClick={toggleRail}
            aria-label={railExpanded ? 'Recolher menu' : 'Expandir menu'}
            className="hidden lg:flex items-center justify-center w-full min-h-8 rounded-control text-[var(--ni-faint)] hover:bg-[var(--ni-surface2)] hover:text-[var(--ni-text)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {railExpanded ? <PanelLeftClose className="w-4 h-4" aria-hidden="true" /> : <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={cn(
          'crivo-main-shell flex-1 overflow-y-auto pt-14 lg:pt-0 pb-20 lg:pb-0',
          presentation.mainClassName,
          presentation.immersive && 'route-presentation-immersive'
        )}
      >
        <RouteVisualShell pathname={location.pathname}>
          <div className={presentation.contentClassName}>
            <header className="ni-top crivo-production-top hidden lg:flex" aria-label="Navegação principal">
              <strong>Crivo</strong>
              <nav>
                {TOP_LEVEL_NAV.map((item) => {
                  const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
                  return (
                    <NavLink key={item.path} to={item.path} className={isActive ? 'active' : undefined}>
                      {item.name}
                    </NavLink>
                  );
                })}
              </nav>
              <span className="ni-prototype-badge">INTERFACE INSTRUMENTAL · DADOS REAIS</span>
              <button
                type="button"
                className="ni-theme-toggle"
                onClick={toggleTheme}
                aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}
              >
                {isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
                <span>{isDark ? 'claro' : 'escuro'}</span>
              </button>
              <div className="ni-avatar" aria-label="Perfil">AJ</div>
            </header>
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={location.pathname}
                initial={reducedMotion ? false : { opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={reducedMotion ? undefined : { opacity: 0 }}
                transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE }}
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </RouteVisualShell>
      </main>

      <BottomNav />

      <OnboardingModal open={showOnboarding} onClose={closeOnboarding} onStartDiagnostic={startOnboardingDiagnostic} />
    </div>
  );
}
