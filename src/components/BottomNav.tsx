import React from 'react';
import { motion, useReducedMotion } from 'motion/react';
import { NavLink } from 'react-router-dom';
import { Calendar, Map, PlayCircle, TrendingUp, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';
import { MOTION_DURATION, MOTION_EASE } from '../design-system/motion/tokens';

interface BottomNavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

// Five real destinations, mapped from the brief's ideal set (Hoje, Plano,
// Estudar, Análises, Agenda) onto the routes that actually exist in this app
// (see App.tsx).
const ITEMS: BottomNavItem[] = [
  { name: 'Hoje', path: '/', icon: Calendar },
  { name: 'Plano', path: '/plano', icon: Map },
  { name: 'Estudar', path: '/sessao', icon: PlayCircle },
  { name: 'Análises', path: '/evolucao', icon: TrendingUp },
  { name: 'Agenda', path: '/agenda', icon: Calendar },
];

export function BottomNav() {
  const reducedMotion = useReducedMotion();

  return (
    <nav
      aria-label="Navegação principal"
      className="crivo-mobile-toolbar lg:hidden pointer-events-none fixed bottom-0 inset-x-0 z-30 px-3 [padding-bottom:calc(env(safe-area-inset-bottom)+0.5rem)]"
    >
      <div className="crivo-mobile-toolbar__surface pointer-events-auto mx-auto flex w-full max-w-lg items-stretch">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'crivo-mobile-toolbar__item flex min-w-0 flex-1 flex-col items-center justify-center gap-1 px-1 py-2 text-[10px] font-semibold leading-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
                  isActive
                    ? 'is-active'
                    : ''
                )
              }
            >
              {({ isActive }) => (
                <motion.span
                  className="crivo-mobile-toolbar__glyph"
                  whileTap={reducedMotion ? undefined : { scale: .92 }}
                  transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE }}
                >
                  {isActive && !reducedMotion && <motion.i layoutId="crivo-mobile-active" transition={{ duration: MOTION_DURATION.component, ease: MOTION_EASE }} />}
                  <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
                  <span className="truncate">{item.name}</span>
                </motion.span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
