import React, { Suspense, lazy, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Menu, Moon, Sun, X } from 'lucide-react';
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { BottomNav } from './BottomNav';
import { OnboardingModal } from './OnboardingModal';
import { IconButton } from './ui/IconButton';
import { useTheme } from '../hooks/useTheme';
import { MOTION_DURATION, MOTION_EASE } from '../design-system/motion/tokens';
import { cn } from '../lib/cn';
import { PALETTES, SCREENS } from '../prototypes/NucleoInstrumentalPrototype';
import { ErrorBoundary } from './ErrorBoundary';
import { Skeleton } from './ui/Skeleton';
import { AmbienteProvider, useAmbienteApp } from '../design-system/ambiente/AmbienteProvider';
import { BotaoBuscar } from './BotaoBuscar';

// A busca usa o texto completo dos 613 capítulos. Baixá-lo para um botão
// fechado atrasava toda abertura do app, mesmo sem consultar um resumo.
const BuscaRapida = lazy(() => import('../views/visual-boards/BuscaRapida'));
import { PainelPersonalizar } from '../views/visual-boards/PainelPersonalizar';
import { FundoCaderno } from './FundoCaderno';
import { CrivoAppMark } from './CrivoAppMark';

const PATH_BY_SCREEN: Record<string, string> = {
  hoje: '/', diagnostico: '/diagnostico', plano: '/plano', agenda: '/agenda', 'reta-final': '/reta-final', recuperacao: '/recuperacao',
  sessao: '/sessao', questoes: '/questoes', resumos: '/resumos', visual: '/visual', revisoes: '/revisoes', flashcards: '/flashcards',
  'obras-obrigatorias': '/obras-obrigatorias', obras: '/obras', 'obra-detalhe': '/obras', erros: '/erros', podcast: '/podcast',
  tutor: '/tutor', laboratorio: '/laboratorio', 'treino-2a-fase': '/treino-2a-fase', redacao: '/redacao', estrategias: '/estrategias',
  evolucao: '/evolucao', prioridades: '/prioridades', conexoes: '/conexoes', perfil: '/perfil', admin: '/admin',
  'admin-obras': '/admin/obras', 'admin-conteudo': '/admin/conteudo',
};

const NAVIGATION_GROUPS = [
  { kind: 'decision', label: 'Planejar' },
  { kind: 'practice', label: 'Praticar' },
  { kind: 'library', label: 'Explorar' },
  { kind: 'analysis', label: 'Acompanhar' },
  { kind: 'account', label: 'Minha conta' },
  { kind: 'admin', label: 'Administrar' },
] as const;

const TOP_LEVEL = [
  ['hoje', 'Hoje'], ['plano', 'Plano'], ['sessao', 'Estudar'], ['evolucao', 'Análises'], ['agenda', 'Agenda'],
] as const;

function screenForPath(pathname: string) {
  if (pathname.startsWith('/obras/')) return SCREENS.find((screen) => screen.key === 'obra-detalhe')!;
  return SCREENS.find((screen) => PATH_BY_SCREEN[screen.key] === pathname) ?? SCREENS[0];
}

/** The approved Núcleo composition, populated by the real route outlet. */
/**
 * O boundary fica aqui, em volta do Outlet, e não em volta do app inteiro:
 * assim uma tela que quebra (ou que ainda está carregando seu chunk) não
 * leva junto o menu, o cabeçalho e a navegação inferior.
 */
function RouteBoundary({ pathname, children }: { pathname: string; children: React.ReactNode }) {
  return (
    <ErrorBoundary resetKey={pathname}>
      <Suspense
        fallback={
          <div className="space-y-4" aria-busy="true">
            <Skeleton className="h-8 w-1/3" />
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
        }
      >
        {children}
      </Suspense>
    </ErrorBoundary>
  );
}

/**
 * O ambiente tecnológico (cor, vidro, efeitos) vale para o app inteiro, e o
 * provider fica acima do layout para que o topo — Buscar e Personalizar — e as
 * telas compartilhem as mesmas preferências.
 */
export default function NucleoInstrumentalProductionLayout() {
  return <AmbienteProvider><LayoutComAmbiente /></AmbienteProvider>;
}

/** Telas que a busca rápida encontra pelo nome. */
// Os nomes do menu de cima também valem: "Análises" é o nome visível da tela
// que em SCREENS se chama "Evolução", e a busca não a achava pelo nome que a
// estudante vê.
const TELAS_DA_BUSCA = [
  ...SCREENS.filter((item) => item.key !== 'obra-detalhe').map((item) => ({ rotulo: item.label, destino: PATH_BY_SCREEN[item.key] })),
  ...TOP_LEVEL.map(([key, label]) => ({ rotulo: label, destino: PATH_BY_SCREEN[key] })),
].filter((tela, indice, todas) => Boolean(tela.destino) && todas.findIndex((outra) => outra.rotulo === tela.rotulo) === indice);

function LayoutComAmbiente() {
  const { isDark, toggleTheme } = useTheme();
  const ambienteApp = useAmbienteApp();
  const [buscaAberta, setBuscaAberta] = useState(false);
  const focoDeRetorno = useRef<HTMLElement | null>(null);
  const abrirBusca = useCallback(() => {
    if (buscaAberta) return;
    focoDeRetorno.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setBuscaAberta(true);
  }, [buscaAberta]);
  const fecharBusca = useCallback(() => {
    setBuscaAberta(false);
    focoDeRetorno.current?.focus();
  }, []);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const railRef = useRef<HTMLElement | null>(null);
  const [railExpanded, setRailExpanded] = useState(() =>
    typeof window !== 'undefined' && window.localStorage.getItem('crivo_rail_expanded') !== 'false',
  );
  const [isMobile, setIsMobile] = useState(() => typeof window !== 'undefined' && window.matchMedia('(max-width: 900px)').matches);
  const location = useLocation();
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  const screen = useMemo(() => screenForPath(location.pathname), [location.pathname]);
  const palette = PALETTES[screen.subject] ?? PALETTES.Matemática;

  useEffect(() => setMenuOpen(false), [location.pathname]);
  useEffect(() => { if (!localStorage.getItem('juju_onboarding')) setShowOnboarding(true); }, []);
  useEffect(() => { localStorage.setItem('crivo_rail_expanded', String(railExpanded)); }, [railExpanded]);
  useEffect(() => {
    const media = window.matchMedia('(max-width: 900px)');
    const sync = () => {
      setIsMobile(media.matches);
      if (!media.matches) setMenuOpen(false);
    };
    sync(); media.addEventListener('change', sync);
    return () => media.removeEventListener('change', sync);
  }, []);
  useEffect(() => {
    if (!menuOpen || !isMobile) return;
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => Array.from(railRef.current?.querySelectorAll<HTMLElement>('button, a[href]') ?? [])
      .filter(element => element.getClientRects().length > 0);
    focusable()[0]?.focus();
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMenuOpen(false);
      } else if (event.key === 'Tab') {
        const elements = focusable();
        const first = elements[0], last = elements[elements.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault(); last?.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault(); first?.focus();
        }
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKeyDown);
      if (previousFocus?.getClientRects().length) previousFocus.focus();
    };
  }, [menuOpen, isMobile]);
  const closeOnboarding = () => { setShowOnboarding(false); localStorage.setItem('juju_onboarding', 'true'); };
  // ⌘K / Ctrl+K abre a busca rápida em qualquer tela.
  useEffect(() => {
    const atalho = (evento: KeyboardEvent) => {
      if ((evento.metaKey || evento.ctrlKey) && evento.key.toLowerCase() === 'k') { evento.preventDefault(); abrirBusca(); }
    };
    window.addEventListener('keydown', atalho);
    return () => window.removeEventListener('keydown', atalho);
  }, [abrirBusca]);
  const acoesDoTopo = (compacto: boolean) => ambienteApp && (
    <div className="ni-acoes-topo">
      <BotaoBuscar onBuscar={abrirBusca} compacto={compacto} />
      <PainelPersonalizar preferencias={ambienteApp.preferencias} onMudar={ambienteApp.mudarPreferencias} ambienteAutomatico={ambienteApp.sobreposto} />
    </div>
  );

  return (
    <div className={cn('ni-prototype ni-production-app crivo-editorial', !isDark && 'is-light')} style={{ '--primary': palette.primary, '--primary-ink': palette.readable, '--secondary': palette.secondary, '--wash': palette.wash } as React.CSSProperties} data-family={palette.family}>
      <a className="crivo-skip-link" href="#crivo-conteudo">Pular para o conteúdo</a>
      {ambienteApp?.preferencias.fundo === 'caderno' && <FundoCaderno materia={ambienteApp.sobreposto?.materia} />}
      <header className="ni-production-mobile lg:hidden" inert={isMobile && menuOpen}>
        <IconButton aria-label="Abrir menu" onClick={() => setMenuOpen(true)}><Menu className="h-5 w-5" aria-hidden="true" /></IconButton>
        <strong>Crivo</strong>
        {acoesDoTopo(true)}
        <button type="button" onClick={toggleTheme} aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>{isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</button>
      </header>
      {menuOpen && <button className="ni-production-backdrop lg:hidden" aria-label="Fechar menu" tabIndex={-1} onClick={() => setMenuOpen(false)} />}

      <aside ref={railRef} role={isMobile && menuOpen ? 'dialog' : undefined} aria-modal={isMobile && menuOpen ? true : undefined} aria-label={isMobile && menuOpen ? 'Menu de navegação' : undefined} className={cn('ni-rail', railExpanded && 'is-expanded', menuOpen && 'is-open is-expanded')} aria-hidden={isMobile && !menuOpen ? true : undefined} inert={isMobile && !menuOpen}>
        <button className="ni-mark" aria-label="Crivo · Ir para Hoje" onClick={() => navigate('/')}><CrivoAppMark />{(railExpanded || menuOpen) && <span className="crivo-rail-wordmark">Crivo</span>}</button>
        {menuOpen && <button className="ni-production-close" aria-label="Fechar menu" onClick={() => setMenuOpen(false)}><X aria-hidden="true" /></button>}
        <nav className="ni-rail-scroll" aria-label="Todas as telas do app">
          {NAVIGATION_GROUPS.map((group) => (
            <div className="crivo-nav-group" role="group" aria-label={group.label} key={group.kind}>
              {(railExpanded || menuOpen) && <p className="crivo-nav-group-label">{group.label}</p>}
              {SCREENS.filter((item) => item.key !== 'obra-detalhe' && item.kind === group.kind).map((item) => {
                const Icon = item.icon;
                const target = PATH_BY_SCREEN[item.key];
                return <NavLink key={item.key} to={target} end={target === '/'} className={item.key === screen.key ? 'active' : undefined} title={item.label}><span className="ni-icon-depth"><Icon aria-hidden="true" /></span>{(railExpanded || menuOpen) && <b>{item.label}</b>}</NavLink>;
              })}
            </div>
          ))}
        </nav>
        <button
          className="ni-rail-toggle"
          type="button"
          onClick={() => setRailExpanded((expanded) => !expanded)}
          aria-label={railExpanded ? 'Recolher barra lateral' : 'Expandir barra lateral'}
          aria-pressed={railExpanded}
        >
          <Menu aria-hidden="true" />
        </button>
      </aside>

      <div className="ni-page" inert={isMobile && menuOpen}>
        <header className="ni-top">
          <div className="ni-mobile-mark"><CrivoAppMark /></div><strong>Crivo</strong>
          <nav aria-label="Áreas principais">
            {TOP_LEVEL.map(([key, label]) => {
              const target = PATH_BY_SCREEN[key];
              const active = target === '/' ? location.pathname === '/' : location.pathname.startsWith(target);
              return <NavLink key={key} to={target} className={active ? 'active' : undefined}>{label}</NavLink>;
            })}
          </nav>
          {acoesDoTopo(false)}
          <button className="ni-theme-toggle" onClick={toggleTheme} aria-label={isDark ? 'Mudar para modo claro' : 'Mudar para modo escuro'}>{isDark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}<span>{isDark ? 'claro' : 'escuro'}</span></button>
          <NavLink to="/perfil" className="ni-avatar" aria-label="AJ · Abrir perfil">AJ</NavLink>
        </header>
        <main id="crivo-conteudo" tabIndex={-1} className="ni-production-main">
          <AnimatePresence mode="wait" initial={false}>
            <motion.div key={location.pathname} className="ni-production-view" initial={reducedMotion ? false : { opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} exit={reducedMotion ? undefined : { opacity: 0, y: -8 }} transition={{ duration: MOTION_DURATION.micro, ease: MOTION_EASE }}>
              <RouteBoundary pathname={location.pathname}>
                <Outlet />
              </RouteBoundary>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <BottomNav />
      {buscaAberta && <Suspense fallback={
        <div className="vs-busca-fundo" role="dialog" aria-modal="true" aria-label="Busca rápida" onKeyDown={(event) => {
          if (event.key === 'Escape') { event.preventDefault(); fecharBusca(); }
          if (event.key === 'Tab') { event.preventDefault(); event.currentTarget.querySelector('button')?.focus(); }
        }}>
          <div className="vs-busca">
            <p role="status">Carregando busca…</p>
            <button type="button" autoFocus onClick={fecharBusca}>Fechar busca</button>
          </div>
        </div>
      }><BuscaRapida
        aberta={buscaAberta}
        onFechar={fecharBusca}
        focoDeRetorno={focoDeRetorno}
        onAbrir={(id) => navigate(`/visual?summary=${encodeURIComponent(id)}`)}
        telas={TELAS_DA_BUSCA}
        onIrParaTela={(destino) => navigate(destino)}
      /></Suspense>}
      <OnboardingModal open={showOnboarding} onClose={closeOnboarding} onStartDiagnostic={() => { closeOnboarding(); navigate('/diagnostico'); }} />
    </div>
  );
}
