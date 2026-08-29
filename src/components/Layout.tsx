import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, useReducedMotion } from 'motion/react';
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
      { name: 'Reta Final', path: '/reta-final', icon: Flag },
      { name: 'Recuperação de Atrasos', path: '/recuperacao', icon: ListTodo },
    ],
  },
  {
    label: 'Prática',
    items: [
      { name: 'Sessão de Estudo', path: '/sessao', icon: PlayCircle },
      { name: 'Questões & Tentativas', path: '/questoes', icon: HelpCircle },
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

const RAIL_STORAGE_KEY = 'crivo_rail_expanded';

function getStoredRailExpanded(): boolean {
  try {
    const stored = localStorage.getItem(RAIL_STORAGE_KEY);
    return stored === null ? true : stored === 'true';
  } catch {
    return true;
  }
}

const NAV_ITEM_CLASS = (isActive: boolean, compact: boolean) =>
  cn(
    'spotlight relative flex items-center gap-3 px-3 py-2.5 min-h-11 rounded-control text-sm transition-colors',
    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
    compact && 'justify-center px-0',
    isActive ? 'bg-navigation-selected text-warm-50 font-semibold' : 'text-warm-100/70 hover:bg-forest-800/60 hover:text-warm-50 font-medium'
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

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Internal storage key, not a visible brand string — left as `juju_` on
    // purpose (see the rebrand's out-of-scope note on internal identifiers).
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
    <div className="min-h-screen flex bg-background-base text-text-primary transition-colors duration-200">
      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center px-3 border-b border-border-subtle bg-surface-elevated">
        <IconButton aria-label="Abrir menu" onClick={() => setMobileMenuOpen(true)}>
          <Menu className="w-5 h-5" aria-hidden="true" />
        </IconButton>
        <CrivoMark className="w-5 h-5 mx-2 text-action-primary" />
        <h1 className="font-display text-lg font-semibold tracking-tight">Crivo</h1>
      </div>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-ink-950/50" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Sidebar rail — Forest-toned in both themes; it's structure, not
          content. Compactable on desktop (icon-only, labels via title/
          sr-only) but always fully expanded on the mobile drawer, where it's
          a temporary overlay and legibility matters more than reclaiming
          width. */}
      <aside
        className={cn(
          'bg-navigation-background flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 transform lg:static lg:translate-x-0 lg:z-auto',
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full',
          'w-64',
          railExpanded ? 'lg:w-64' : 'lg:w-[76px]',
          railTransitionClass
        )}
      >
        <div className={cn('h-16 flex items-center border-b border-warm-50/10', railExpanded ? 'justify-between px-5' : 'lg:justify-center px-5 lg:px-0')}>
          <div className={cn('flex items-center gap-2', !railExpanded && 'lg:gap-0')}>
            <CrivoMark className="w-6 h-6 text-ember-500 shrink-0" />
            <h1 className={cn('font-display text-xl font-semibold tracking-tight text-warm-50 whitespace-nowrap', !railExpanded && 'lg:hidden')}>
              Crivo
            </h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
            className="lg:hidden p-2 -mr-2 min-w-11 min-h-11 flex items-center justify-center rounded-control text-warm-100/70 hover:bg-forest-800/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            <X className="w-5 h-5" aria-hidden="true" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto overflow-x-hidden py-4 px-3 space-y-5">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className={cn('px-3 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-warm-100/40 whitespace-nowrap', !railExpanded && 'lg:hidden')}>
                {group.label}
              </p>
              <div className="space-y-0.5">
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
                          className="absolute left-0 inset-y-1.5 w-0.5 rounded-full bg-ember-500"
                          transition={reducedMotion ? { duration: 0 } : { duration: MOTION_DURATION.panel, ease: MOTION_EASE }}
                        />
                      )}
                      <Icon className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span className={cn('whitespace-nowrap', !railExpanded && 'lg:sr-only')}>{item.name}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className={cn('p-4 border-t border-warm-50/10 space-y-3', !railExpanded && 'lg:px-2')}>
          {/* Só existe alguma coisa pra ver aqui se a conta logada estiver em
              ADMIN_EMAILS no servidor — pra quem não é admin, essas rotas já
              mostram "Entre na conta administrativa" em vez de quebrar (ver
              Admin.tsx, AdminObras.tsx, AdminConteudo.tsx). Deixado discreto
              (texto pequeno, sem ícone grande) pra não competir com o menu
              de estudo, que é o que a maioria de quem usa o app vai usar. */}
          <div className={cn('flex items-center justify-center gap-3 text-xs text-warm-100/40', !railExpanded && 'lg:hidden')}>
            <NavLink to="/admin" className="hover:text-warm-100/70 hover:underline">Admin</NavLink>
            <span aria-hidden="true">·</span>
            <NavLink to="/admin/obras" className="hover:text-warm-100/70 hover:underline">Obras</NavLink>
            <span aria-hidden="true">·</span>
            <NavLink to="/admin/conteudo" className="hover:text-warm-100/70 hover:underline">Conteúdo</NavLink>
          </div>
          <button
            onClick={toggleTheme}
            title={!railExpanded ? `Modo ${isDark ? 'Claro' : 'Escuro'}` : undefined}
            className={cn(
              'spotlight flex items-center justify-center w-full min-h-11 px-4 py-2 text-sm font-medium rounded-control text-warm-100/80 bg-forest-800/60 hover:bg-forest-800 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
              !railExpanded && 'lg:px-0'
            )}
            onPointerMove={onPointerMove}
          >
            {isDark ? <Sun className="w-4 h-4 shrink-0" aria-hidden="true" /> : <Moon className="w-4 h-4 shrink-0" aria-hidden="true" />}
            <span className={cn('ml-2', !railExpanded && 'lg:sr-only')}>Modo {isDark ? 'Claro' : 'Escuro'}</span>
          </button>
          <button
            onClick={toggleRail}
            aria-label={railExpanded ? 'Recolher menu' : 'Expandir menu'}
            className="hidden lg:flex items-center justify-center w-full min-h-9 rounded-control text-warm-100/50 hover:bg-forest-800/60 hover:text-warm-100/80 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring"
          >
            {railExpanded ? <PanelLeftClose className="w-4 h-4" aria-hidden="true" /> : <PanelLeftOpen className="w-4 h-4" aria-hidden="true" />}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0 pb-16 lg:pb-0">
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      <BottomNav />

      <OnboardingModal open={showOnboarding} onClose={closeOnboarding} onStartDiagnostic={startOnboardingDiagnostic} />
    </div>
  );
}
