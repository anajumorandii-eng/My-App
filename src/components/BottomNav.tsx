import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Map, PlayCircle, TrendingUp, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

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
  return (
    <nav
      aria-label="Navegação principal"
      className="lg:hidden pointer-events-none fixed bottom-0 inset-x-0 z-30 px-3 [padding-bottom:calc(env(safe-area-inset-bottom)+0.5rem)]"
    >
      <div className="pointer-events-auto mx-auto flex w-full max-w-lg items-stretch rounded-[1.35rem] border border-border-subtle/90 bg-surface-elevated/95 p-1 shadow-[0_12px_34px_color-mix(in_oklab,var(--background-base)_58%,transparent)] backdrop-blur-xl">
        {ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              className={({ isActive }) =>
                cn(
                  'flex min-w-0 flex-1 flex-col items-center justify-center gap-1 rounded-xl px-1 py-2 text-[10px] font-semibold leading-none transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus-ring',
                  isActive
                    ? 'bg-action-primary text-text-inverse shadow-soft-sm'
                    : 'text-text-muted hover:bg-surface-secondary hover:text-text-primary'
                )
              }
            >
              <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              <span className="truncate">{item.name}</span>
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
}
