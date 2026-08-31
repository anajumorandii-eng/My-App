import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  BarChart3,
  BookOpen,
  CalendarDays,
  ClipboardCheck,
  Compass,
  FileText,
  FlaskConical,
  Headphones,
  HelpCircle,
  Home,
  Layers3,
  Map,
  MessageCircleQuestion,
  NotebookPen,
  PenLine,
  Repeat2,
  Sparkles,
  Stethoscope,
  Flag,
  ListTodo,
  Link2,
  UserRound,
} from 'lucide-react';
import { AJMark } from '../brand/AJMark';

const primaryItems = [
  { name: 'Hoje', path: '/', icon: Home },
  { name: 'Plano', path: '/plano', icon: Map },
  { name: 'Estudar', path: '/sessao', icon: BookOpen },
  { name: 'Análises', path: '/evolucao', icon: BarChart3 },
  { name: 'Agenda', path: '/agenda', icon: CalendarDays },
];

const secondaryGroups = [
  {
    label: 'Aprender',
    items: [
      { name: 'Questões', path: '/questoes', icon: HelpCircle },
      { name: 'Resumos', path: '/resumos', icon: FileText },
      { name: 'Segunda fase', path: '/treino-2a-fase', icon: ClipboardCheck },
      { name: 'Redação', path: '/redacao', icon: PenLine },
      { name: 'Tutor', path: '/tutor', icon: MessageCircleQuestion },
      { name: 'Diagnóstico', path: '/diagnostico', icon: Stethoscope },
    ],
  },
  {
    label: 'Consolidar',
    items: [
      { name: 'Revisões', path: '/revisoes', icon: Repeat2 },
      { name: 'Caderno de Erros', path: '/erros', icon: NotebookPen },
      { name: 'Flashcards', path: '/flashcards', icon: Layers3 },
      { name: 'Recuperação', path: '/recuperacao', icon: ListTodo },
    ],
  },
  {
    label: 'Explorar',
    items: [
      { name: 'Obras', path: '/obras', icon: BookOpen },
      { name: 'Podcast', path: '/podcast', icon: Headphones },
      { name: 'Estratégias', path: '/estrategias', icon: Compass },
      { name: 'Laboratório', path: '/laboratorio', icon: FlaskConical },
      { name: 'Prioridades', path: '/prioridades', icon: Sparkles },
      { name: 'Reta final', path: '/reta-final', icon: Flag },
      { name: 'Flashcards de obras', path: '/obras-obrigatorias', icon: Layers3 },
      { name: 'Conexões', path: '/conexoes', icon: Link2 },
      { name: 'Perfil', path: '/perfil', icon: UserRound },
    ],
  },
];

function NavigationLink({ item, compact = false, mobile = false }: { item: typeof primaryItems[number]; compact?: boolean; mobile?: boolean }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      aria-label={mobile ? `${item.name}, navegação móvel` : undefined}
      className={({ isActive }) => `aj-nav-link${compact ? ' aj-nav-link--compact' : ''}${isActive ? ' is-active' : ''}`}
    >
      <Icon aria-hidden="true" size={compact ? 18 : 20} strokeWidth={1.7} />
      <span>{item.name}</span>
    </NavLink>
  );
}

export function AppNavigation() {
  return (
    <>
      <aside className="aj-sidebar">
        <div className="aj-brand-lockup">
          <AJMark className="aj-brand-lockup__mark" />
          <span>
            <strong>AJ Intelligence</strong>
            <small>Aprenda a aprender.</small>
          </span>
        </div>

        <nav aria-label="Navegação principal" className="aj-sidebar__primary">
          {primaryItems.map((item) => <NavigationLink key={item.path} item={item} />)}
        </nav>

        <div className="aj-sidebar__secondary">
          {secondaryGroups.map((group) => (
            <section key={group.label} aria-labelledby={`nav-${group.label.toLowerCase()}`}>
              <h2 id={`nav-${group.label.toLowerCase()}`}>{group.label}</h2>
              {group.items.map((item) => <NavigationLink key={item.path} item={item} compact />)}
            </section>
          ))}
        </div>
      </aside>

      <nav className="aj-bottom-navigation" aria-label="Navegação principal móvel">
        {primaryItems.map((item) => <NavigationLink key={item.path} item={item} compact mobile />)}
      </nav>
    </>
  );
}
