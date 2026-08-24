import React, { useState, useEffect } from 'react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
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
  GraduationCap,
  UserCircle,
  PenLine,
  ClipboardEdit,
  ListTodo,
  Stethoscope,
  Flag,
  X,
  ArrowRight,
  Menu,
  Layers,
  BookOpen,
  Library
} from 'lucide-react';

export default function Layout() {
  const [darkMode, setDarkMode] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    // Show onboarding only once
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

  const toggleTheme = () => {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    document.getElementById('theme-color-meta')?.setAttribute('content', next ? '#09090b' : '#fafafa');
  };

  const navItems = [
    { name: 'Hoje', path: '/', icon: Calendar },
    { name: 'Diagnóstico', path: '/diagnostico', icon: Stethoscope },
    { name: 'Plano', path: '/plano', icon: Map },
    { name: 'Agenda', path: '/agenda', icon: Calendar },
    { name: 'Reta Final', path: '/reta-final', icon: Flag },
    { name: 'Recuperação de Atrasos', path: '/recuperacao', icon: ListTodo },
    { name: 'Sessão de Estudo', path: '/sessao', icon: PlayCircle },
    { name: 'Questões & Tentativas', path: '/questoes', icon: HelpCircle },
    { name: 'Revisões Adaptativas', path: '/revisoes', icon: Repeat },
    { name: 'Flashcards', path: '/flashcards', icon: Layers },
    { name: 'Flashcards de Obras', path: '/obras-obrigatorias', icon: BookOpen },
    { name: 'Dossiês de Obras', path: '/obras', icon: Library },
    { name: 'Caderno de Erros', path: '/erros', icon: BookX },
    { name: 'Podcast JUJU', path: '/podcast', icon: Headphones },
    { name: 'Tutor Socrático', path: '/tutor', icon: Brain },
    { name: 'Laboratório & Métodos', path: '/laboratorio', icon: FlaskConical },
    { name: 'Evolução & Domínio', path: '/evolucao', icon: TrendingUp },
    { name: 'Prioridades por Vestibular', path: '/prioridades', icon: Target },
    { name: 'Estratégias de Resolução', path: '/estrategias', icon: Compass },
    { name: 'Treino de 2ª Fase', path: '/treino-2a-fase', icon: ClipboardEdit },
    { name: 'Módulo de Redação', path: '/redacao', icon: PenLine },
    { name: 'Conexões Google', path: '/conexoes', icon: LinkIcon },
    { name: 'Perfil', path: '/perfil', icon: UserCircle },
  ];

  return (
    <div className={`min-h-screen flex ${darkMode ? 'dark' : ''} bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 transition-colors duration-200`}>

      {/* Mobile top bar */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-30 h-14 flex items-center px-4 border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <button
          onClick={() => setMobileMenuOpen(true)}
          aria-label="Abrir menu"
          className="p-2 -ml-2 mr-2 rounded-lg text-zinc-600 dark:text-zinc-300 hover:bg-zinc-100 dark:hover:bg-zinc-800"
        >
          <Menu className="w-5 h-5" />
        </button>
        <GraduationCap className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />
        <h1 className="font-bold text-lg tracking-tight">JUJU</h1>
      </div>

      {/* Mobile backdrop */}
      {mobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`w-64 border-r border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 flex flex-col shrink-0 fixed inset-y-0 left-0 z-50 transform transition-transform duration-200 lg:static lg:translate-x-0 lg:z-auto ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-200 dark:border-zinc-800">
          <div className="flex items-center">
            <GraduationCap className="w-6 h-6 mr-2 text-indigo-600 dark:text-indigo-400" />
            <h1 className="font-bold text-xl tracking-tight">JUJU</h1>
          </div>
          <button
            onClick={() => setMobileMenuOpen(false)}
            aria-label="Fechar menu"
            className="lg:hidden p-1 rounded-lg text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === '/'}
                onClick={() => setMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300'
                      : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 hover:text-zinc-900 dark:hover:text-zinc-100'
                  }`
                }
              >
                <Icon className="w-4 h-4 mr-3 shrink-0" />
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200 dark:border-zinc-800 space-y-3">
          {/* Só existe alguma coisa pra ver aqui se a conta logada estiver em
              ADMIN_EMAILS no servidor — pra quem não é admin, essas rotas já
              mostram "Entre na conta administrativa" em vez de quebrar (ver
              Admin.tsx, AdminObras.tsx, AdminConteudo.tsx). Deixado discreto
              (texto pequeno, sem ícone grande) pra não competir com o menu
              de estudo, que é o que a maioria de quem usa o app vai usar. */}
          <div className="flex items-center justify-center gap-3 text-xs text-zinc-400 dark:text-zinc-500">
            <NavLink to="/admin" className="hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline">Admin</NavLink>
            <span aria-hidden="true">·</span>
            <NavLink to="/admin/obras" className="hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline">Obras</NavLink>
            <span aria-hidden="true">·</span>
            <NavLink to="/admin/conteudo" className="hover:text-zinc-600 dark:hover:text-zinc-300 hover:underline">Conteúdo</NavLink>
          </div>
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-full px-4 py-2 text-sm font-medium rounded-lg text-zinc-600 dark:text-zinc-400 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4 mr-2" /> : <Moon className="w-4 h-4 mr-2" />}
            Modo {darkMode ? 'Claro' : 'Escuro'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto pt-14 lg:pt-0">
        <div className="p-4 sm:p-8 max-w-6xl mx-auto">
          <Outlet />
        </div>
      </main>

      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-3xl shadow-xl max-w-xl w-full overflow-hidden animate-in zoom-in-95 duration-300">
            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <button onClick={closeOnboarding} className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <h2 className="text-2xl font-bold mb-3">Bem-vindo à JUJU</h2>
              <p className="text-zinc-600 dark:text-zinc-400 mb-8 leading-relaxed">
                Nós não somos um jogo. Não temos streaks ou pontos. Nosso único objetivo é construir a sua <strong>autonomia</strong> e o seu <strong>domínio real</strong> sobre o conteúdo até o dia da prova.
              </p>
              
              <div className="space-y-4 mb-8">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-4 shrink-0 font-semibold text-zinc-500">1</div>
                  <div>
                    <h4 className="font-semibold">Diagnóstico Inicial</h4>
                    <p className="text-sm text-zinc-500 mt-1">Precisamos saber de onde você está partindo para gerar o seu plano ideal.</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center mr-4 shrink-0 font-semibold text-zinc-500">2</div>
                  <div>
                    <h4 className="font-semibold">Conecte sua Agenda</h4>
                    <p className="text-sm text-zinc-500 mt-1">Otimizaremos sua carga horária dinamicamente com base nas suas obrigações diárias.</p>
                  </div>
                </div>
              </div>

              <button
                onClick={startOnboardingDiagnostic}
                className="w-full flex items-center justify-center py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-medium transition-colors"
              >
                Iniciar Diagnóstico Adaptativo
                <ArrowRight className="w-4 h-4 ml-2" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
