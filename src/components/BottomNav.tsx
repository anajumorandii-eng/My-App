import React from 'react';
import { NavLink } from 'react-router-dom';
import { Calendar, Map, PlayCircle, TrendingUp, Link as LinkIcon, type LucideIcon } from 'lucide-react';
import { cn } from '../lib/cn';

interface BottomNavItem {
  name: string;
  path: string;
  icon: LucideIcon;
}

// Five real destinations, mapped from the brief's ideal set (Hoje, Plano,
// Estudar, Análises, Agenda) onto the routes that actually exist in this
// app (see App.tsx) — there is no standalone "Agenda" route, so it points
// at Conexões Google, which is where the calendar integration that feeds
// the day's available time actually lives.
const ITEMS: BottomNavItem[] = [
  { name: 'Hoje', path: '/', icon: Calendar },
  { name: 'Plano', path: '/plano', icon: Map },
  { name: 'Estudar', path: '/sessao', icon: PlayCircle },
  { name: 'Análises', path: '/evolucao', icon: TrendingUp },
  { name: 'Agenda', path: '/conexoes', icon: LinkIcon },
];

export function BottomNav() {
  return (
    <nav
      aria-label="Navegação principal"
      className="lg:hidden fixed bottom-0 inset-x-0 z-30 flex items-stretch bg-surface-elevated border-t border-border-subtle pb-[env(safe-area-inset-bottom)]"
    >
      {ITEMS.map((item) => {
        const Icon = item.icon;
        return (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.path === '/'}
            className={({ isActive }) =>
              cn(
                'flex-1 flex flex-col items-center justify-center gap-1 min-h-11 py-2 text-[11px] font-medium',
                isActive ? 'text-action-primary' : 'text-text-muted'
              )
            }
          >
            <Icon className="w-5 h-5" aria-hidden="true" />
            {item.name}
          </NavLink>
        );
      })}
    </nav>
  );
}
