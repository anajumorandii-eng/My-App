/**
 * THROWAWAY UI PROTOTYPE — validates the approved Núcleo Instrumental
 * direction across every app route. Run `npm run dev`, then open
 * /prototype/nucleo-instrumental?screen=hoje. State is intentionally local.
 */
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Button } from "../components/ui/Button";
import { Panel } from "../components/ui/Panel";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  Aperture,
  Atom,
  BadgeCheck,
  BarChart3,
  BookText,
  BookOpen,
  Brain,
  ChartSpline,
  Calendar,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  Compass,
  Dna,
  FileText,
  FilePenLine,
  FlaskConical,
  Headphones,
  Layers3,
  Landmark,
  Library,
  ListChecks,
  Link2,
  ListTodo,
  Map,
  Menu,
  MessageCircleQuestion,
  NotebookPen,
  Newspaper,
  PenLine,
  Play,
  Repeat2,
  Settings2,
  Sparkles,
  Stethoscope,
  Target,
  TextQuote,
  TrendingUp,
  UserRound,
  type LucideIcon,
  Moon,
  Sun,
  ChartNoAxesCombined,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "../design-system/css/nucleo-instrumental-prototype.css";
import "../design-system/css/nucleo-instrumental-rail.css";
import "../design-system/css/nucleo-instrumental-cores.css";
import "../design-system/css/nucleo-instrumental-brand.css";

type Kind =
  "decision" | "practice" | "library" | "analysis" | "account" | "admin";
export type InstrumentalScreen = {
  key: string;
  label: string;
  title: string;
  summary: string;
  kind: Kind;
  icon: LucideIcon;
  subject: string;
  topic: string;
  action: string;
};
type FoundationVariant = "observatorio" | "trilho" | "foco";

// Three foundation directions for the Hoje route, switchable with ?variant=.
const FOUNDATION_VARIANTS: Record<FoundationVariant, string> = {
  observatorio: "A · Observatório",
  trilho: "B · Trilho",
  foco: "C · Foco",
};

export const SCREENS: InstrumentalScreen[] = [
  {
    key: "hoje",
    label: "Hoje",
    title: "Comece onde sua aprovação ganha mais força.",
    summary:
      "Uma recomendação explicável transforma sinais do seu histórico na próxima decisão.",
    kind: "decision",
    icon: Calendar,
    subject: "Matemática",
    topic: "Geometria analítica",
    action: "Iniciar bloco · 40 min",
  },
  {
    key: "diagnostico",
    label: "Diagnóstico",
    title: "Veja a estrutura antes de acelerar.",
    summary: "Uma leitura inicial revela os temas que sustentam mais evolução.",
    kind: "analysis",
    icon: Stethoscope,
    subject: "Física",
    topic: "Óptica geométrica",
    action: "Continuar diagnóstico",
  },
  {
    key: "plano",
    label: "Plano",
    title: "Sua trajetória, em decisões realizáveis.",
    summary: "O plano se reorganiza à medida que suas evidências mudam.",
    kind: "decision",
    icon: Map,
    subject: "Biologia",
    topic: "Ecologia",
    action: "Ver semana completa",
  },
  {
    key: "agenda",
    label: "Agenda",
    title: "Tempo protegido para estudar melhor.",
    summary: "Disponibilidade, blocos e compromissos no mesmo instrumento.",
    kind: "account",
    icon: Calendar,
    subject: "Geografia",
    topic: "Climatologia",
    action: "Ajustar disponibilidade",
  },
  {
    key: "reta-final",
    label: "Reta Final",
    title: "Concentre energia no que decide a prova.",
    summary: "Uma camada de priorização para as últimas semanas.",
    kind: "decision",
    icon: Target,
    subject: "História",
    topic: "Guerra Fria",
    action: "Abrir estratégia final",
  },
  {
    key: "recuperacao",
    label: "Recuperação",
    title: "Recupere o atraso sem perder o eixo.",
    summary: "O sistema preserva o que importa e reposiciona o restante.",
    kind: "decision",
    icon: ListTodo,
    subject: "Química",
    topic: "Equilíbrio químico",
    action: "Recalcular recuperação",
  },
  {
    key: "sessao",
    label: "Sessão de Estudo",
    title: "Praticar com precisão, não por inércia.",
    summary: "Questões graduadas, tempo visível e feedback no ponto certo.",
    kind: "practice",
    icon: Play,
    subject: "Matemática",
    topic: "Funções",
    action: "Começar sessão",
  },
  {
    key: "questoes",
    label: "Questões",
    title: "Transforme tentativa em evidência.",
    summary: "Cada resposta atualiza a leitura do tópico e da estratégia.",
    kind: "practice",
    icon: ClipboardCheck,
    subject: "Física",
    topic: "Mecânica",
    action: "Resolver próxima questão",
  },
  {
    key: "resumos",
    label: "Resumos",
    title: "Repertório que entra em ação.",
    summary: "Leitura, recuperação e transferência conectadas ao seu plano.",
    kind: "library",
    icon: Library,
    subject: "Português",
    topic: "Interpretação de texto",
    action: "Explorar resumos",
  },
  {
    key: "revisoes",
    label: "Revisões",
    title: "Volte antes que o conhecimento se afaste.",
    summary: "Janelas de revisão organizadas por urgência e confiança.",
    kind: "practice",
    icon: Repeat2,
    subject: "Biologia",
    topic: "Genética",
    action: "Iniciar revisão",
  },
  {
    key: "flashcards",
    label: "Flashcards",
    title: "Memória ativa, feedback imediato.",
    summary: "Cartões aparecem no intervalo em que mais ajudam.",
    kind: "practice",
    icon: Layers3,
    subject: "Química",
    topic: "Estequiometria",
    action: "Abrir cartões",
  },
  {
    key: "obras-obrigatorias",
    label: "Flashcards de Obras",
    title: "As obras ficam disponíveis na hora da prova.",
    summary: "Referências, personagens, forma e contexto em recuperação ativa.",
    kind: "practice",
    icon: BookOpen,
    subject: "Literatura",
    topic: "Romantismo brasileiro",
    action: "Revisar obra",
  },
  {
    key: "obras",
    label: "Dossiês de Obras",
    title: "Ler obra é enxergar suas camadas.",
    summary: "Dossiês conectam construção formal, contexto e repertório.",
    kind: "library",
    icon: BookOpen,
    subject: "Literatura",
    topic: "Memórias Póstumas",
    action: "Abrir dossiê",
  },
  {
    key: "obra-detalhe",
    label: "Detalhe da Obra",
    title: "A obra se abre em uma leitura guiada.",
    summary:
      "Personagens, tempo, forma e citações se organizam em uma camada aprofundada.",
    kind: "library",
    icon: BookOpen,
    subject: "Literatura",
    topic: "Análise de obra",
    action: "Continuar leitura",
  },
  {
    key: "erros",
    label: "Caderno de Erros",
    title: "Erros viram rotas de recuperação.",
    summary: "O primeiro elo ausente é mais útil que uma correção genérica.",
    kind: "analysis",
    icon: NotebookPen,
    subject: "Português",
    topic: "Sintaxe",
    action: "Retomar conexão",
  },
  {
    key: "podcast",
    label: "Podcast Crivo",
    title: "Repertório para ouvir com intenção.",
    summary: "Episódios conectados a temas que pedem contexto agora.",
    kind: "library",
    icon: Headphones,
    subject: "Atualidades",
    topic: "Geopolítica",
    action: "Ouvir episódio",
  },
  {
    key: "tutor",
    label: "Tutor Socrático",
    title: "Uma pergunta que destrava o raciocínio.",
    summary: "O tutor preserva seu caminho e pede o próximo passo possível.",
    kind: "library",
    icon: Brain,
    subject: "Filosofia",
    topic: "Ética",
    action: "Conversar com tutor",
  },
  {
    key: "laboratorio",
    label: "Laboratório",
    title: "Métodos que você consegue repetir.",
    summary: "Experimentos de estudo para descobrir o que funciona para você.",
    kind: "library",
    icon: FlaskConical,
    subject: "Biologia",
    topic: "Fisiologia",
    action: "Testar método",
  },
  {
    key: "treino-2a-fase",
    label: "Treino de 2ª Fase",
    title: "Construa resposta, não apenas resultado.",
    summary: "Treino discursivo com critérios e encadeamento explícitos.",
    kind: "practice",
    icon: FileText,
    subject: "História",
    topic: "Brasil República",
    action: "Iniciar treino",
  },
  {
    key: "redacao",
    label: "Redação",
    title: "Argumento tem arquitetura.",
    summary: "Tese, repertório e coesão se conectam em um texto defendível.",
    kind: "practice",
    icon: PenLine,
    subject: "Redação",
    topic: "Coesão argumentativa",
    action: "Escrever agora",
  },
  {
    key: "estrategias",
    label: "Estratégias",
    title: "Escolha a ferramenta certa para a questão.",
    summary: "Heurísticas visíveis para resolver sob pressão.",
    kind: "library",
    icon: Compass,
    subject: "Matemática",
    topic: "Probabilidade",
    action: "Ver estratégia",
  },
  {
    key: "evolucao",
    label: "Evolução",
    title: "Evolução é uma trajetória, não um número solto.",
    summary: "Domínio, consistência e confiança mostram o próximo ajuste.",
    kind: "analysis",
    icon: TrendingUp,
    subject: "Geografia",
    topic: "Urbanização",
    action: "Ver análise completa",
  },
  {
    key: "prioridades",
    label: "Prioridades",
    title: "Cada vestibular muda o peso da decisão.",
    summary: "Incidência e evidência pessoal se encontram na mesma vista.",
    kind: "analysis",
    icon: Sparkles,
    subject: "Atualidades",
    topic: "Economia",
    action: "Comparar provas",
  },
  {
    key: "conexoes",
    label: "Conexões",
    title: "Sua infraestrutura de estudo, sob controle.",
    summary: "Integrações claras, estados explicáveis e confirmação segura.",
    kind: "account",
    icon: Link2,
    subject: "Física",
    topic: "Eletricidade",
    action: "Gerenciar conexão",
  },
  {
    key: "perfil",
    label: "Perfil",
    title: "O plano começa com seus limites reais.",
    summary: "Meta, disponibilidade e preferências com leitura serena.",
    kind: "account",
    icon: UserRound,
    subject: "Literatura",
    topic: "Análise literária",
    action: "Editar perfil",
  },
  {
    key: "admin",
    label: "Administração",
    title: "Pulso da plataforma, com sinal e contexto.",
    summary: "Atividade, qualidade e filas operacionais em uma leitura única.",
    kind: "admin",
    icon: Settings2,
    subject: "Atualidades",
    topic: "Sinais de atividade",
    action: "Abrir operação",
  },
  {
    key: "admin-obras",
    label: "Admin Obras",
    title: "Catálogo literário com integridade editorial.",
    summary: "Obras, fontes e cobertura em um fluxo controlado.",
    kind: "admin",
    icon: BookOpen,
    subject: "Literatura",
    topic: "Catálogo de obras",
    action: "Gerenciar obras",
  },
  {
    key: "admin-conteudo",
    label: "Admin Conteúdo",
    title: "Conteúdo pronto para entrar em circulação.",
    summary: "Fila, qualidade e publicação no mesmo painel operacional.",
    kind: "admin",
    icon: Activity,
    subject: "Química",
    topic: "Pipeline de conteúdo",
    action: "Abrir fila",
  },
];

export const PALETTES: Record<
  string,
  { primary: string; secondary: string; wash: string; family: string }
> = {
  Matemática: {
    primary: "#81a9ff",
    secondary: "#d9b583",
    wash: "rgba(57,105,211,.35)",
    family: "grid",
  },
  Física: {
    primary: "#75a2ff",
    secondary: "#e7c05f",
    wash: "rgba(39,92,200,.37)",
    family: "wave",
  },
  Química: {
    primary: "#efbf61",
    secondary: "#81b179",
    wash: "rgba(175,110,45,.34)",
    family: "bond",
  },
  Biologia: {
    primary: "#86dca5",
    secondary: "#e69172",
    wash: "rgba(38,130,78,.36)",
    family: "organic",
  },
  Português: {
    primary: "#e08391",
    secondary: "#d9b583",
    wash: "rgba(139,47,70,.36)",
    family: "type",
  },
  Literatura: {
    primary: "#d5b184",
    secondary: "#a779ca",
    wash: "rgba(110,55,96,.33)",
    family: "type",
  },
  História: {
    primary: "#df7783",
    secondary: "#9bbce2",
    wash: "rgba(136,55,52,.32)",
    family: "poles",
  },
  Geografia: {
    primary: "#aac86d",
    secondary: "#d89c58",
    wash: "rgba(74,105,57,.36)",
    family: "topo",
  },
  Redação: {
    primary: "#e69b64",
    secondary: "#d7665d",
    wash: "rgba(130,66,40,.34)",
    family: "type",
  },
  Atualidades: {
    primary: "#e3ad60",
    secondary: "#8abbdc",
    wash: "rgba(45,97,130,.35)",
    family: "signal",
  },
  Filosofia: {
    primary: "#b69bdd",
    secondary: "#d9b583",
    wash: "rgba(88,57,131,.32)",
    family: "poles",
  },
};

export const SUBJECT_ICONS: Record<string, React.ComponentType<{ className?: string; style?: React.CSSProperties }>> = {
  Matemática: ChartSpline,
  Física: Aperture,
  Química: FlaskConical,
  Biologia: Dna,
  Português: TextQuote,
  Literatura: BookText,
  História: Landmark,
  Geografia: Map,
  Redação: FilePenLine,
  Atualidades: Newspaper,
  Filosofia: Brain,
  Sociologia: UserRound,
  Inglês: Sparkles,
};

const SUBJECT_CONTEXT: Record<
  string,
  {
    rationale: string;
    metrics: [string, string, string, string];
    cards: [string, string, string];
  }
> = {
  Matemática: {
    rationale:
      "A decisão prioriza a estrutura que sustenta o cálculo: relação, representação e validação do resultado.",
    metrics: ["modelagem", "precisão", "variação", "recorrência"],
    cards: ["Resolver por etapas", "Testar representação", "Validar resultado"],
  },
  Física: {
    rationale:
      "O bloco transforma o fenômeno em modelo: identificar grandezas, relações vetoriais e efeito observável.",
    metrics: ["modelo físico", "grandezas", "vetores", "incidência"],
    cards: ["Desenhar o fenômeno", "Fixar relações", "Aplicar sob tempo"],
  },
  Química: {
    rationale:
      "A prioridade está na transformação: espécies envolvidas, proporção e direção da reação.",
    metrics: ["espécies", "proporção", "equilíbrio", "incidência"],
    cards: ["Mapear reagentes", "Balancear relações", "Prever deslocamento"],
  },
  Biologia: {
    rationale:
      "O foco é a relação entre sistemas vivos: níveis, fluxos e consequências de uma alteração.",
    metrics: ["relações", "fluxos", "sistemas", "incidência"],
    cards: ["Ler a teia", "Seguir o fluxo", "Explicar impacto"],
  },
  Português: {
    rationale:
      "O tópico é tratado como estrutura de sentido: forma, função e efeito de leitura.",
    metrics: ["estrutura", "função", "sentido", "incidência"],
    cards: ["Localizar marca", "Relacionar função", "Justificar leitura"],
  },
  Literatura: {
    rationale:
      "A obra se abre por camadas: voz, forma, contexto e motivo recorrente.",
    metrics: ["voz", "forma", "contexto", "incidência"],
    cards: ["Reconhecer voz", "Ler camadas", "Conectar repertório"],
  },
  História: {
    rationale:
      "A leitura recupera forças em disputa, ruptura e permanência no tempo.",
    metrics: ["forças", "conflito", "tempo", "incidência"],
    cards: ["Localizar polos", "Sequenciar ruptura", "Explicar permanência"],
  },
  Geografia: {
    rationale:
      "A análise relaciona território, escala e fluxo para explicar uma configuração espacial.",
    metrics: ["território", "escala", "fluxos", "incidência"],
    cards: ["Mapear espaço", "Ler escala", "Explicar fluxo"],
  },
  Redação: {
    rationale:
      "A decisão fortalece o encadeamento: tese, repertório e ponte argumentativa.",
    metrics: ["tese", "repertório", "coesão", "incidência"],
    cards: ["Firmar tese", "Conectar repertório", "Revisar ponte"],
  },
  Atualidades: {
    rationale:
      "O sistema segue um evento pelos atores, interesses e ondas de impacto.",
    metrics: ["atores", "interesses", "impacto", "incidência"],
    cards: ["Localizar atores", "Ler interesses", "Projetar impacto"],
  },
  Filosofia: {
    rationale:
      "A prática torna explícita a tensão entre conceitos, posição e objeção.",
    metrics: ["conceitos", "tensão", "argumento", "incidência"],
    cards: ["Definir conceito", "Construir oposição", "Sustentar posição"],
  },
};

const PRACTICE_PROMPTS: Record<
  string,
  { question: string; options: [string, string, string] }
> = {
  Matemática: {
    question:
      "Qual representação preserva a relação entre as variáveis desta função?",
    options: ["y = ax + b", "x² + y² = r²", "f(x) = Δy / Δx"],
  },
  Física: {
    question: "Qual diagrama traduz corretamente as forças que atuam no corpo?",
    options: [
      "Peso e normal em sentidos opostos",
      "Velocidade como força",
      "Aceleração sem resultante",
    ],
  },
  Química: {
    question:
      "Ao aumentar a concentração de reagente, para que lado o equilíbrio se desloca?",
    options: [
      "Para consumir o reagente adicionado",
      "Sempre para os produtos",
      "Não há alteração no sistema",
    ],
  },
  Biologia: {
    question:
      "Em uma teia alimentar, qual consequência é esperada quando um predador de topo diminui?",
    options: [
      "A população de presas tende a crescer",
      "A energia deixa de circular",
      "Todos os níveis diminuem igualmente",
    ],
  },
  Português: {
    question: "Qual marca do texto sustenta a intenção do enunciador?",
    options: [
      "A escolha do conectivo",
      "A quantidade de parágrafos",
      "A ordem alfabética das palavras",
    ],
  },
  Literatura: {
    question:
      "Qual camada da obra explica melhor o efeito de ironia neste trecho?",
    options: [
      "A voz narrativa e seu distanciamento",
      "A biografia isolada do autor",
      "A métrica de uma frase solta",
    ],
  },
  História: {
    question: "Qual relação explica a permanência desse conflito no período?",
    options: [
      "Disputa entre projetos de poder",
      "Um fato sem antecedentes",
      "Uma única decisão individual",
    ],
  },
  Geografia: {
    question: "Qual escala revela melhor o fluxo descrito no mapa?",
    options: [
      "A relação entre redes urbanas",
      "Apenas o clima local",
      "A fronteira sem conexões",
    ],
  },
  Redação: {
    question:
      "Qual frase cria uma ponte argumentativa válida entre tese e repertório?",
    options: [
      "Logo, o caso evidencia o problema proposto",
      "Por isso, o tema já está resolvido",
      "Assim, não é preciso argumentar",
    ],
  },
  Atualidades: {
    question:
      "Qual ator tende a ser diretamente afetado por esta decisão econômica?",
    options: [
      "O grupo ligado à cadeia produtiva",
      "Nenhum agente social",
      "Somente eventos naturais",
    ],
  },
  Filosofia: {
    question:
      "Qual objeção torna esta posição filosoficamente mais consistente?",
    options: [
      "Delimitar o conceito e sua consequência",
      "Repetir a conclusão",
      "Trocar o tema da pergunta",
    ],
  },
};

const TOPIC_ARTIFACTS: Record<string, string> = {
  "Geometria analítica": "coordinate-grid",
  Funções: "function-curve",
  "Óptica geométrica": "refraction",
  Mecânica: "force-vectors",
  Eletricidade: "electric-field",
  Ecologia: "ecology-web",
  Genética: "gene-helix",
  Fisiologia: "pulse-system",
  "Equilíbrio químico": "equilibrium-scale",
  Estequiometria: "molecule-ratio",
  Sintaxe: "syntax-align",
  "Interpretação de texto": "text-layers",
  "Memórias Póstumas": "narrative-layers",
  "Romantismo brasileiro": "poetic-orbit",
  "Análise de obra": "narrative-layers",
  "Guerra Fria": "bipolar-field",
  "Brasil República": "timeline-strata",
  Climatologia: "climate-front",
  Urbanização: "urban-grid",
  Geopolítica: "network-pulse",
  Economia: "market-flow",
  "Coesão argumentativa": "paragraph-bridge",
  Probabilidade: "distribution",
  Ética: "dialectic",
  "Sinais de atividade": "signal-console",
  "Catálogo de obras": "library-stack",
  "Pipeline de conteúdo": "content-pipeline",
};

// Nem todo tópico real tem uma ilustração editorial própria. Nesses casos a
// identidade visual continua sendo da disciplina — nunca o mesmo globo
// genérico para todas as matérias.
const SUBJECT_ARTIFACTS: Record<string, string> = {
  Matemática: "coordinate-grid",
  Física: "refraction",
  Química: "equilibrium-scale",
  Biologia: "ecology-web",
  Português: "text-layers",
  Literatura: "narrative-layers",
  História: "bipolar-field",
  Geografia: "climate-front",
  Redação: "paragraph-bridge",
  Atualidades: "signal-console",
  Filosofia: "dialectic",
};

type CoreProps = { primary: string; secondary: string; artifact: string };

function MathCore({ primary, secondary, artifact }: CoreProps) {
  return (
    <motion.svg
      className="ni-illustrated-core ni-core-math"
      data-topic-artifact={artifact}
      viewBox="0 0 240 180"
      initial={{ opacity: 0, scale: 0.86, rotate: -5 }}
      animate={{ opacity: 1, scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 16 }}
    >
      <defs>
        <linearGradient id="math-face" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#d8ebff" stopOpacity=".34" />
          <stop offset="1" stopColor={primary} stopOpacity=".05" />
        </linearGradient>
        <radialGradient id="math-orb">
          <stop stopColor="#fff4d3" />
          <stop offset=".28" stopColor={secondary} />
          <stop offset="1" stopColor={primary} stopOpacity=".12" />
        </radialGradient>
        <filter id="math-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <path className="ni-core-shadow" d="M38 143 126 163 207 129 116 111Z" />
      <path className="ni-core-side" d="M39 50 39 143 126 164 126 69Z" />
      <path className="ni-core-side" d="M126 69 207 37 207 129 126 164Z" />
      <path className="ni-core-face" d="M39 50 119 19 207 37 126 69Z" />
      {[0, 1, 2, 3, 4].map((i) => (
        <path
          key={i}
          className="ni-core-grid"
          d={`M${52 + i * 15} ${55 - i * 6}  ${132 + i * 15} ${73 - i * 6}M${57 + i * 15} ${137 - i * 5} ${137 + i * 15} ${105 - i * 5}`}
        />
      ))}
      <path
        className="ni-core-grid"
        d="M57 57 57 136M78 48 78 142M99 40 99 148M120 32 120 154M141 29 141 151M162 31 162 143M183 34 183 134"
      />
      <motion.path
        d="M57 122 C76 110 88 79 108 91 S142 124 185 52"
        fill="none"
        stroke={primary}
        strokeWidth="3"
        strokeLinecap="round"
        filter="url(#math-glow)"
        animate={{ pathLength: [0, 1], opacity: [0.25, 1] }}
        transition={{ duration: 1.3 }}
      />
      <motion.circle
        cx="185"
        cy="52"
        r="9"
        fill="url(#math-orb)"
        animate={{ cy: [52, 48, 52] }}
        transition={{ duration: 2.8, repeat: Infinity }}
      />
      <circle cx="185" cy="52" r="3" fill="#fff8e8" />
    </motion.svg>
  );
}

function ChemistryCore({ primary, secondary, artifact }: CoreProps) {
  return (
    <motion.svg
      className="ni-illustrated-core ni-core-chemistry"
      data-topic-artifact={artifact}
      viewBox="0 0 240 180"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 150, damping: 15 }}
    >
      <defs>
        <radialGradient id="chem-a" cx="32%" cy="25%">
          <stop stopColor="#fff7df" />
          <stop offset=".22" stopColor={secondary} />
          <stop offset="1" stopColor="#80471d" />
        </radialGradient>
        <radialGradient id="chem-b" cx="32%" cy="25%">
          <stop stopColor="#e8fff0" />
          <stop offset=".25" stopColor={primary} />
          <stop offset="1" stopColor="#1d6040" />
        </radialGradient>
        <linearGradient id="chem-bond" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff2c4" />
          <stop offset=".5" stopColor={secondary} />
          <stop offset="1" stopColor={primary} />
        </linearGradient>
        <filter id="chem-shadow">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse className="ni-core-shadow" cx="121" cy="145" rx="83" ry="13" />
      <g className="ni-chem-bonds">
        <path d="M74 64 125 92 174 55M125 92 150 137M125 92 72 127" />
        <path d="M77 70 125 99 171 62" />
      </g>
      <motion.g
        animate={{ rotate: [0, 3, 0, -2, 0] }}
        transition={{ duration: 5, repeat: Infinity }}
        style={{ transformOrigin: "125px 92px" }}
      >
        <circle cx="125" cy="92" r="31" fill="url(#chem-b)" />
        <circle className="ni-core-specular" cx="114" cy="80" r="9" />
        <circle cx="74" cy="64" r="22" fill="url(#chem-a)" />
        <circle cx="174" cy="55" r="23" fill="url(#chem-a)" />
        <circle cx="150" cy="137" r="20" fill="url(#chem-a)" />
        <circle cx="72" cy="127" r="18" fill="url(#chem-a)" />
      </motion.g>
      <path
        className="ni-chem-orbit"
        d="M44 100 C68 19 176 14 205 83 C220 120 171 162 93 153"
      />
      <motion.circle
        cx="202"
        cy="83"
        r="4"
        fill="#fff2c4"
        animate={{ offsetDistance: ["0%", "100%"] }}
        transition={{ duration: 3, repeat: Infinity }}
      />
    </motion.svg>
  );
}

function BiologyCore({ primary, secondary, artifact }: CoreProps) {
  return (
    <motion.svg
      className="ni-illustrated-core ni-core-biology"
      data-topic-artifact={artifact}
      viewBox="0 0 240 180"
      initial={{ opacity: 0, scale: 0.85, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 17 }}
    >
      <defs>
        <linearGradient id="bio-glass" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#dffff0" stopOpacity=".31" />
          <stop offset="1" stopColor={primary} stopOpacity=".06" />
        </linearGradient>
        <radialGradient id="bio-ground">
          <stop stopColor="#d8a26d" />
          <stop offset="1" stopColor="#57391e" />
        </radialGradient>
        <filter id="bio-glow">
          <feGaussianBlur stdDeviation="4" />
        </filter>
      </defs>
      <ellipse className="ni-core-shadow" cx="121" cy="150" rx="86" ry="13" />
      <path
        className="ni-bio-glass"
        d="M57 36 Q120 7 183 36 L197 123 Q121 160 43 123Z"
      />
      <path
        d="M47 118 Q120 142 193 118 L197 123 Q121 160 43 123Z"
        fill="url(#bio-ground)"
        opacity=".83"
      />
      <path
        className="ni-bio-stem"
        d="M119 125 C117 93 101 75 75 57 M118 109 C135 86 155 75 173 49 M118 98 C128 81 122 59 107 40"
      />
      <path
        className="ni-bio-leaf"
        d="M76 59 C51 48 50 31 82 37 C96 42 94 58 76 59Z"
      />
      <path
        className="ni-bio-leaf alt"
        d="M154 71 C171 47 191 54 184 81 C177 94 160 87 154 71Z"
      />
      <path
        className="ni-bio-leaf"
        d="M106 50 C92 31 104 20 124 34 C133 47 120 56 106 50Z"
      />
      <motion.circle
        className="ni-bio-life"
        cx="77"
        cy="59"
        r="7"
        animate={{ r: [6, 8, 6] }}
        transition={{ duration: 2.5, repeat: Infinity }}
      />
      <circle className="ni-bio-life second" cx="156" cy="72" r="7" />
      <circle className="ni-bio-life third" cx="120" cy="108" r="6" />
      <path className="ni-bio-web" d="M77 59 120 108 156 72M77 59 156 72" />
    </motion.svg>
  );
}

function EcologyCore({ primary, secondary, artifact }: CoreProps) {
  return (
    <motion.svg
      className="ni-illustrated-core ni-core-ecology"
      data-topic-artifact={artifact}
      viewBox="0 0 240 180"
      initial={{ opacity: 0, scale: 0.84, y: 9 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 155, damping: 17 }}
    >
      <defs>
        <radialGradient id="eco-world" cx="31%" cy="25%">
          <stop stopColor="#e8fff2" />
          <stop offset=".2" stopColor={primary} />
          <stop offset=".58" stopColor="#286849" />
          <stop offset="1" stopColor="#102f27" />
        </radialGradient>
        <linearGradient id="eco-leaf" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#efffd7" />
          <stop offset=".5" stopColor={primary} />
          <stop offset="1" stopColor="#4e9a5e" />
        </linearGradient>
        <filter id="eco-shadow">
          <feGaussianBlur stdDeviation="5" />
        </filter>
      </defs>
      <ellipse className="ni-core-shadow" cx="121" cy="151" rx="75" ry="11" />
      <circle className="ni-eco-halo" cx="121" cy="89" r="65" />
      <circle
        className="ni-eco-world"
        cx="121"
        cy="89"
        r="55"
        fill="url(#eco-world)"
      />
      <path
        className="ni-eco-contour"
        d="M71 87 C94 68 146 68 171 89 M78 111 C104 96 143 100 163 116 M121 34 C105 63 105 116 121 144 M142 39 C157 66 153 108 141 137"
      />
      <motion.path
        className="ni-eco-leaf"
        d="M117 116 C81 101 89 61 142 51 C151 89 139 111 117 116Z"
        fill="url(#eco-leaf)"
        animate={{ rotate: [0, -2, 1, 0] }}
        transition={{ duration: 4.2, repeat: Infinity }}
        style={{ transformOrigin: "118px 90px" }}
      />
      <path
        className="ni-eco-vein"
        d="M105 105 C118 89 127 76 140 58 M113 95 102 79 M121 84 139 86"
      />
      <circle className="ni-eco-species one" cx="69" cy="78" r="5" />
      <circle className="ni-eco-species two" cx="169" cy="64" r="5" />
      <circle className="ni-eco-species three" cx="156" cy="128" r="5" />
      <path
        className="ni-eco-link"
        d="M69 78 104 92 M143 77 169 64 M134 109 156 128"
      />
    </motion.svg>
  );
}

function HistoryCore({ primary, secondary, artifact }: CoreProps) {
  return (
    <motion.svg
      className="ni-illustrated-core ni-core-history"
      data-topic-artifact={artifact}
      viewBox="0 0 240 180"
      initial={{ opacity: 0, rotateX: -14, y: 10 }}
      animate={{ opacity: 1, rotateX: 0, y: 0 }}
      transition={{ type: "spring", stiffness: 150, damping: 17 }}
    >
      <defs>
        <linearGradient id="hist-paper" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#f4dfb7" stopOpacity=".8" />
          <stop offset=".5" stopColor={primary} stopOpacity=".42" />
          <stop offset="1" stopColor="#582f37" stopOpacity=".55" />
        </linearGradient>
        <linearGradient id="hist-edge" x1="0" y1="0" x2="0" y2="1">
          <stop stopColor="#b26a71" />
          <stop offset="1" stopColor="#412326" />
        </linearGradient>
      </defs>
      <ellipse className="ni-core-shadow" cx="121" cy="151" rx="77" ry="11" />
      <g className="ni-history-pages">
        <path d="M55 63 167 48 185 68 73 84Z" />
        <path d="M55 63 55 119 73 140 73 84Z" />
        <path d="M73 84 185 68 185 124 73 140Z" fill="url(#hist-paper)" />
        <path d="M73 84 185 68 185 78 73 95Z" fill="url(#hist-edge)" />
      </g>
      <path
        className="ni-history-rule"
        d="M90 99 164 88 M90 110 157 100 M90 122 151 112"
      />
      <path
        className="ni-history-timeline"
        d="M94 116 117 100 140 106 164 86"
      />
      <circle className="ni-history-seal" cx="117" cy="100" r="8" />
      <path
        className="ni-history-flag"
        d="M145 61 145 89 M145 62 161 66 145 72"
      />
    </motion.svg>
  );
}

function PhysicsCore({ primary, secondary, artifact }: CoreProps) {
  return (
    <motion.svg
      className="ni-illustrated-core ni-core-physics"
      data-topic-artifact={artifact}
      viewBox="0 0 240 180"
      initial={{ opacity: 0, rotate: 8, scale: 0.82 }}
      animate={{ opacity: 1, rotate: 0, scale: 1 }}
      transition={{ type: "spring", stiffness: 165, damping: 16 }}
    >
      <defs>
        <linearGradient id="phys-lens" x1="0" y1="0" x2="1" y2="0">
          <stop stopColor="#effbff" stopOpacity=".12" />
          <stop offset=".5" stopColor={primary} stopOpacity=".66" />
          <stop offset="1" stopColor="#eef7ff" stopOpacity=".14" />
        </linearGradient>
        <linearGradient id="phys-prism" x1="0" y1="0" x2="1" y2="1">
          <stop stopColor="#fff5d3" stopOpacity=".7" />
          <stop offset="1" stopColor={secondary} stopOpacity=".16" />
        </linearGradient>
        <filter id="phys-glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      <ellipse className="ni-core-shadow" cx="121" cy="149" rx="88" ry="12" />
      <motion.g
        animate={{ x: [0, 5, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
      >
        <path className="ni-phys-ray red" d="M17 54 103 76 170 89 223 124" />
        <path className="ni-phys-ray gold" d="M17 69 103 82 170 91 223 102" />
        <path className="ni-phys-ray blue" d="M17 84 103 88 170 94 223 80" />
      </motion.g>
      <path
        className="ni-phys-prism"
        d="M104 45 164 93 101 132Z"
        fill="url(#phys-prism)"
      />
      <path
        className="ni-phys-lens"
        d="M101 37 C132 43 132 137 101 143 C78 123 78 57 101 37Z"
        fill="url(#phys-lens)"
      />
      <path className="ni-phys-lens-edge" d="M101 37 C132 43 132 137 101 143" />
      <motion.circle
        cx="222"
        cy="102"
        r="7"
        fill={secondary}
        filter="url(#phys-glow)"
        animate={{ opacity: [0.55, 1, 0.55] }}
        transition={{ duration: 1.8, repeat: Infinity }}
      />
      <circle cx="222" cy="102" r="2.5" fill="#fff7de" />
    </motion.svg>
  );
}

export function InstrumentalArtifact({
  family,
  primary,
  secondary,
  topic,
  subject,
}: {
  family: string;
  primary: string;
  secondary: string;
  topic?: string;
  subject?: string;
}) {
  // Os dados reais preservam a capitalização editorial do tópico (por
  // exemplo, "Óptica Geométrica"), enquanto o dicionário do protótipo usa
  // caixa de frase. A busca normalizada garante que a matéria nunca caia no
  // artefato genérico por uma diferença apenas tipográfica.
  const normalizedTopic = topic?.trim().toLocaleLowerCase("pt-BR");
  const artifact = (topic
    ? Object.entries(TOPIC_ARTIFACTS).find(([candidate]) => candidate.toLocaleLowerCase("pt-BR") === normalizedTopic)?.[1]
    : undefined) ?? SUBJECT_ARTIFACTS[subject ?? ""] ?? family;
  if (artifact === "ecology-web")
    return (
      <EcologyCore
        primary={primary}
        secondary={secondary}
        artifact={artifact}
      />
    );
  if (artifact === "gene-helix" || artifact === "pulse-system")
    return (
      <BiologyCore
        primary={primary}
        secondary={secondary}
        artifact={artifact}
      />
    );
  if (artifact === "gene-helix")
    return (
      <div
        className="ni-subject-scene ni-scene-genetics"
        data-topic-artifact={artifact}
        style={style}
      >
        <i />
        <i />
        <i />
        <i />
        <b />
        <b />
        <b />
        <b />
      </div>
    );
  if (artifact === "pulse-system")
    return (
      <div
        className="ni-subject-scene ni-scene-physiology"
        data-topic-artifact={artifact}
        style={style}
      >
        <i />
        <b />
        <em />
        <span />
      </div>
    );
  if (artifact === "equilibrium-scale" || artifact === "molecule-ratio")
    return (
      <ChemistryCore
        primary={primary}
        secondary={secondary}
        artifact={artifact}
      />
    );
  if (
    artifact === "refraction" ||
    artifact === "force-vectors" ||
    artifact === "electric-field"
  )
    return (
      <PhysicsCore
        primary={primary}
        secondary={secondary}
        artifact={artifact}
      />
    );
  if (
    artifact === "coordinate-grid" ||
    artifact === "function-curve" ||
    artifact === "distribution"
  )
    return (
      <MathCore primary={primary} secondary={secondary} artifact={artifact} />
    );
  if (artifact === "bipolar-field" || artifact === "timeline-strata")
    return (
      <HistoryCore
        primary={primary}
        secondary={secondary}
        artifact={artifact}
      />
    );
  return (
    <div
      className={`ni-artifact ni-artifact--${family} ni-artifact--${artifact}`}
      data-topic-artifact={artifact}
      style={{ "--p": primary, "--s": secondary } as React.CSSProperties}
    >
      <i />
      <b />
      <em />
      <span />
    </div>
  );
}

function PrototypeSwitcher({
  variant,
  onChange,
}: {
  variant: FoundationVariant;
  onChange: (variant: FoundationVariant) => void;
}) {
  const navigate = useNavigate();
  const variants = Object.keys(FOUNDATION_VARIANTS) as FoundationVariant[];
  const move = (delta: number) =>
    onChange(
      variants[
        (variants.indexOf(variant) + delta + variants.length) % variants.length
      ],
    );
  useEffect(() => {
    const handler = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement;
      if (target.matches("input,textarea,[contenteditable=true]")) return;
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === "ArrowRight") move(1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  });
  return (
    <div className="ni-switcher" aria-label="Variações visuais da fundação">
      <button onClick={() => move(-1)} aria-label="Variação anterior">
        <ChevronLeft />
      </button>
      <span>
        <b>{FOUNDATION_VARIANTS[variant]}</b>
      </span>
      <button onClick={() => move(1)} aria-label="Próxima variação">
        <ChevronRight />
      </button>
      <button
        className="ni-exit"
        onClick={() => navigate("/")}
        aria-label="Sair do protótipo"
      >
        ×
      </button>
    </div>
  );
}

export default function NucleoInstrumentalPrototype() {
  const [params, setParams] = useSearchParams();
  const initial = Math.max(
    0,
    SCREENS.findIndex((screen) => screen.key === params.get("screen")),
  );
  const [index, setIndex] = useState(initial);
  const [expanded, setExpanded] = useState(false);
  const [details, setDetails] = useState(false);
  const [lightMode, setLightMode] = useState(false);
  const initialVariant = params.get("variant");
  const [variant, setVariant] = useState<FoundationVariant>(
    initialVariant === "trilho" || initialVariant === "foco"
      ? initialVariant
      : "observatorio",
  );
  const reduceMotion = useReducedMotion();
  const screen = SCREENS[index];
  const palette = PALETTES[screen.subject] ?? PALETTES.Matemática;
  const setScreen = (next: number) => {
    setIndex(next);
    setParams({ screen: SCREENS[next].key, variant });
    setDetails(false);
  };
  const selectVariant = (next: FoundationVariant) => {
    setVariant(next);
    setParams({ screen: screen.key, variant: next });
  };
  const content = useMemo(
    () =>
      screen.key === "hoje" ? (
        <FoundationPreview
          screen={screen}
          variant={variant}
          details={details}
          setDetails={setDetails}
        />
      ) : screen.kind === "decision" ? (
        <Decision screen={screen} details={details} setDetails={setDetails} />
      ) : screen.kind === "practice" ? (
        <Practice screen={screen} />
      ) : screen.kind === "library" ? (
        <LibraryView screen={screen} />
      ) : screen.kind === "analysis" ? (
        <Analysis screen={screen} />
      ) : screen.kind === "admin" ? (
        <Admin screen={screen} />
      ) : (
        <Account screen={screen} />
      ),
    [screen, details, variant],
  );
  return (
    <div
      className={`ni-prototype ni-foundation--${variant} ${lightMode ? "is-light" : ""}`}
      style={
        {
          "--primary": palette.primary,
          "--secondary": palette.secondary,
          "--wash": palette.wash,
        } as React.CSSProperties
      }
      data-family={palette.family}
    >
      <aside className={`ni-rail ${expanded ? "is-expanded" : ""}`}>
        <button className="ni-mark" aria-label="Crivo">
          ◉
        </button>
        <div className="ni-rail-scroll">
          {SCREENS.map((item, itemIndex) => {
            const Icon = item.icon;
            return (
              <button
                key={item.key}
                onClick={() => setScreen(itemIndex)}
                className={item.key === screen.key ? "active" : ""}
                title={item.label}
              >
                <span className="ni-icon-depth">
                  <Icon />
                </span>
                {expanded && <b>{item.label}</b>}
              </button>
            );
          })}
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="ni-rail-toggle"
          aria-label={expanded ? "Recolher áreas" : "Expandir áreas"}
        >
          <Menu />
        </button>
      </aside>
      <div className="ni-page">
        <header className="ni-top">
          <div className="ni-mobile-mark">◉</div>
          <strong>Crivo</strong>
          <nav aria-label="Áreas principais">
            <span className={screen.kind === "decision" ? "active" : ""}>
              Hoje
            </span>
            <span>Plano</span>
            <span className={screen.kind === "practice" ? "active" : ""}>
              Estudar
            </span>
            <span className={screen.kind === "analysis" ? "active" : ""}>
              Análises
            </span>
          </nav>
          <span className="ni-prototype-badge">
            PROTÓTIPO · sem dados reais
          </span>
          <button
            className="ni-theme-toggle"
            onClick={() => setLightMode(!lightMode)}
            aria-label={lightMode ? "Ativar modo escuro" : "Ativar modo claro"}
          >
            {lightMode ? <Moon /> : <Sun />}
            <span>{lightMode ? "escuro" : "claro"}</span>
          </button>
          <div className="ni-avatar">AJ</div>
        </header>
        <main className="ni-main">
          <div className="ni-route">
            <span>{screen.kind.toUpperCase()}</span>
            <i /> <span>{screen.subject}</span>
            <i /> <b>{screen.topic}</b>
          </div>
          <div className="ni-title">
            <div>
              <h1>{screen.title}</h1>
              <p>{screen.summary}</p>
            </div>
            <div className="ni-state">
              <i /> perfil {palette.family} · motion ativo
            </div>
          </div>
          <div className="ni-subjects">
            {Object.keys(PALETTES)
              .slice(0, 10)
              .map((subject) => (
                <button
                  key={subject}
                  onClick={() => {
                    const next = SCREENS.findIndex(
                      (candidate) => candidate.subject === subject,
                    );
                    if (next >= 0) setScreen(next);
                  }}
                  className={subject === screen.subject ? "active" : ""}
                >
                  {subject}
                </button>
              ))}
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={screen.key}
              className="ni-view"
              initial={reduceMotion ? false : { opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              exit={reduceMotion ? undefined : { opacity: 0, y: -12 }}
              transition={{
                type: "spring",
                stiffness: palette.family === "grid" ? 260 : 140,
                damping: palette.family === "poles" ? 12 : 20,
              }}
            >
              {content}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
      <PrototypeSwitcher variant={variant} onChange={selectVariant} />
    </div>
  );
}

function FoundationPreview({
  screen,
  variant,
  details,
  setDetails,
}: {
  screen: InstrumentalScreen;
  variant: FoundationVariant;
  details: boolean;
  setDetails: (open: boolean) => void;
}) {
  const palette = PALETTES[screen.subject] ?? PALETTES.Matemática;
  const context = SUBJECT_CONTEXT[screen.subject] ?? SUBJECT_CONTEXT.Matemática;
  if (variant === "observatorio")
    return (
      <Decision screen={screen} details={details} setDetails={setDetails} />
    );
  if (variant === "trilho")
    return (
      <section className="ni-foundation ni-foundation--trilho">
        <Panel subject={screen.subject} interactive className="ni-panel ni-trilho-lead">
          <span className="ni-kicker">Próximo bloco · 40 min</span>
          <h2>{screen.topic} é a decisão que mais desloca sua semana.</h2>
          <p>{context.rationale}</p>
          <Button subject={screen.subject} className="ni-primary w-full">
            <Play />
            {screen.action}
          </Button>
          <InstrumentalArtifact
            family={palette.family}
            primary={palette.primary}
            secondary={palette.secondary}
            topic={screen.topic}
          />
          <div className="ni-trilho-signal">
            <span>agora</span>
            <i />
            <span>revisar</span>
            <i />
            <span>consolidar</span>
          </div>
        </Panel>
        <Panel subject={screen.subject} interactive className="ni-panel ni-trilho-evidence">
          <span className="ni-kicker">Evidências que pesaram</span>
          {context.metrics.map((metric, index) => (
            <div key={metric}>
              <span>0{index + 1}</span>
              <b>{metric}</b>
              <i
                style={
                  { "--size": `${82 - index * 13}%` } as React.CSSProperties
                }
              />
              <em>{["forte", "média", "alta", "8,7"][index]}</em>
            </div>
          ))}
        </Panel>
        <Panel subject={screen.subject} interactive className="ni-panel ni-trilho-trajectory">
          <span className="ni-kicker">Trajetória semanal</span>
          <h3>Ritmo que cabe na sua agenda.</h3>
          <div className="ni-track">
            <i />
            <i />
            <i />
            <b />
          </div>
          <p>
            <b>+12%</b> de consistência · próxima sessão às <b>14:00</b>
          </p>
        </Panel>
      </section>
    );
  return (
    <section className="ni-foundation ni-foundation--foco">
      <Panel subject={screen.subject} interactive className="ni-panel ni-foco-stage">
        <span className="ni-kicker">Uma decisão de cada vez</span>
        <h2>{screen.topic}</h2>
        <p>{context.rationale}</p>
        <InstrumentalArtifact
          family={palette.family}
          primary={palette.primary}
          secondary={palette.secondary}
          topic={screen.topic}
        />
        <Button subject={screen.subject} className="ni-primary w-full">
          <Play />
          {screen.action}
        </Button>
        <button className="ni-link" onClick={() => setDetails(!details)}>
          Abrir evidências {details ? "↑" : "↓"}
        </button>
      </Panel>
      <div className="ni-foco-support">
        <Panel subject={screen.subject} interactive className="ni-panel">
          <span className="ni-kicker">Estado da semana</span>
          <h3>Você está em ritmo.</h3>
          <div className="ni-foco-orbit">
            <i />
            <i />
            <b />
          </div>
          <p>3 revisões adaptativas · 8 erros para retomar</p>
        </Panel>
        <Panel subject={screen.subject} interactive className="ni-panel">
          <span className="ni-kicker">Após o bloco</span>
          {context.cards.map((card, index) => (
            <button key={card}>
              <b>0{index + 1}</b>
              {card}
              <ArrowRight />
            </button>
          ))}
        </Panel>
      </div>
      {details && (
        <motion.article
          className="ni-panel ni-foco-evidence"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <span className="ni-kicker">Baía de análise</span>
          {context.metrics.map((metric, index) => (
            <div key={metric}>
              <span>{metric}</span>
              <b>{["62%", "média", "alta", "8,7"][index]}</b>
            </div>
          ))}
        </motion.article>
      )}
    </section>
  );
}

export function ObservatoryTrajectoryChart() {
  return (
    <div className="ni-chart">
      <svg viewBox="0 0 320 108" role="img" aria-label="Consistência cresce de 42 para 74 pontos durante a semana">
        <defs>
          <linearGradient id="trajectory-fill" x1="0" y1="0" x2="0" y2="1">
            <stop stopColor="var(--primary)" stopOpacity=".28" />
            <stop offset="1" stopColor="var(--primary)" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d="M10 94 H310 M10 67 H310 M10 40 H310 M10 13 H310" stroke="rgba(224,237,228,.10)" strokeWidth="1" />
        <path d="M12 81 C48 73 65 58 94 51 S140 39 163 45 S202 66 224 55 S269 27 308 17 L308 94 L12 94Z" fill="url(#trajectory-fill)" />
        <motion.path d="M12 81 C48 73 65 58 94 51 S140 39 163 45 S202 66 224 55 S269 27 308 17" fill="none" stroke="var(--primary)" strokeWidth="2.4" strokeLinecap="round" initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.1, ease: "easeOut" }} />
        <circle cx="12" cy="81" r="3" fill="var(--primary)" />
        <circle cx="308" cy="17" r="4.5" fill="var(--secondary)" />
        <circle cx="308" cy="17" r="8" fill="var(--secondary)" opacity=".18" />
        <text x="12" y="105" fill="var(--faint)" fontSize="8">SEG</text>
        <text x="146" y="105" fill="var(--faint)" fontSize="8">QUI</text>
        <text x="287" y="105" fill="var(--faint)" fontSize="8">HOJE</text>
      </svg>
    </div>
  );
}

function Decision({
  screen,
  details,
  setDetails,
}: {
  screen: InstrumentalScreen;
  details: boolean;
  setDetails: (open: boolean) => void;
}) {
  const palette = PALETTES[screen.subject] ?? PALETTES.Matemática;
  const context = SUBJECT_CONTEXT[screen.subject] ?? SUBJECT_CONTEXT.Matemática;
  return (
    <>
      <section className="ni-grid ni-grid--hero">
        <Panel subject={screen.subject} interactive className="ni-panel ni-decision">
          <span className="ni-kicker">Decisão recomendada · 01</span>
          <h2>{screen.topic} antes da prova.</h2>
          <p>{context.rationale}</p>
          <Button subject={screen.subject} className="ni-primary w-full">
            <Play />
            {screen.action}
          </Button>
          <button className="ni-link" onClick={() => setDetails(!details)}>
            Por que esta decisão? {details ? "↑" : "↓"}
          </button>
          <InstrumentalArtifact
            family={palette.family}
            primary={palette.primary}
            secondary={palette.secondary}
            topic={screen.topic}
          />
          <div className="ni-metrics">
            <Metric label={context.metrics[0]} value="62%" bar />
            <Metric label={context.metrics[1]} value="média" />
            <Metric label={context.metrics[2]} value="alta" warn />
            <Metric label={context.metrics[3]} value="8,7" />
          </div>
        </Panel>
        <Panel subject={screen.subject} interactive className="ni-panel ni-trajectory">
          <span className="ni-kicker">Trajetória semanal</span>
          <h3>Você está em ritmo.</h3>
          <ObservatoryTrajectoryChart />
          <p>
            <span>+12%</span> de consistência na semana
          </p>
          <ul>
            <li>
              Revisões adaptativas <b>3</b>
            </li>
            <li>
              Erros para retomar <b>8</b>
            </li>
            <li>
              Próxima sessão <b>14:00</b>
            </li>
          </ul>
        </Panel>
      </section>
      {details && (
        <motion.section
          className="ni-panel ni-bay"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
        >
          <span className="ni-kicker">Baía de análise</span>
          <h3>Os sinais que formaram a recomendação.</h3>
          <div>
            {context.metrics.map((factor, i) => (
              <p key={factor}>
                <i />
                <span>{factor}</span>
                <b>0.{91 - i * 8}</b>
              </p>
            ))}
          </div>
        </motion.section>
      )}
      <section className="ni-card-row">
        <Mini
          title={context.cards[0]}
          text={`Prática aplicada a ${screen.topic}.`}
          icon={ListChecks}
        />
        <Mini
          title={context.cards[1]}
          text={`Instrumentos para ler ${screen.topic}.`}
          icon={ChartNoAxesCombined}
        />
        <Mini
          title={context.cards[2]}
          text="Proteja a próxima janela de estudo."
          icon={BadgeCheck}
        />
      </section>
    </>
  );
}
function Practice({ screen }: { screen: InstrumentalScreen }) {
  const prompt =
    PRACTICE_PROMPTS[screen.subject] ?? PRACTICE_PROMPTS.Matemática;
  const context = SUBJECT_CONTEXT[screen.subject] ?? SUBJECT_CONTEXT.Matemática;
  return (
    <section className="ni-grid ni-grid--practice">
      <Panel subject={screen.subject} interactive className="ni-panel ni-workspace">
        <span className="ni-kicker">{screen.topic} · sequência 02/05</span>
        <h2>Qual é o próximo passo do raciocínio?</h2>
        <p>O feedback só aparece depois da sua tentativa.</p>
        <div className="ni-question">{prompt.question}</div>
        <div className="ni-options">
          {prompt.options.map((option) => (
            <button key={option}>{option}</button>
          ))}
        </div>
        <Button subject={screen.subject} className="ni-primary w-full">
          <CheckCircle2 />
          {screen.action}
        </Button>
      </Panel>
      <Panel subject={screen.subject} interactive className="ni-panel ni-session-side">
        <span className="ni-kicker">Instrumentos de {screen.subject}</span>
        <div className="ni-timer">24:18</div>
        <Metric label={context.metrics[0]} value="4 / 5" bar />
        <Metric label={context.metrics[1]} value="estável" />
        <div className="ni-stack">
          <span />
          <span />
          <span />
        </div>
        <p>{context.rationale}</p>
      </Panel>
    </section>
  );
}
function LibraryView({ screen }: { screen: InstrumentalScreen }) {
  return (
    <section className="ni-grid ni-grid--library">
      <Panel subject={screen.subject} interactive className="ni-panel ni-library-lead">
        <span className="ni-kicker">Coleção conectada</span>
        <h2>{screen.topic} em camadas.</h2>
        <p>
          Comece por um objeto editorial e avance para recuperação e aplicação.
        </p>
        <div className="ni-book">
          <i />
          <b>{screen.subject}</b>
          <span />
        </div>
        <Button subject={screen.subject} className="ni-primary w-full">
          <BookOpen />
          {screen.action}
        </Button>
      </Panel>
      <div className="ni-library-list">
        {[
          "Visão geral essencial",
          "Recuperação ativa",
          "Aplicação em questão",
          "Conexões de repertório",
        ].map((item, i) => (
          <Panel subject={screen.subject} interactive className="ni-panel" key={item}>
            <span>0{i + 1}</span>
            <h3>{item}</h3>
            <p>Um passo curto, claro e ligado ao que você precisa agora.</p>
            <ArrowRight />
          </Panel>
        ))}
      </div>
    </section>
  );
}
function Analysis({ screen }: { screen: InstrumentalScreen }) {
  const palette = PALETTES[screen.subject] ?? PALETTES.Matemática;
  return (
    <>
      <section className="ni-card-row">
        <MetricCard title="Domínio consolidado" value="62%" />
        <MetricCard title="Confiança calibrada" value="média" />
        <MetricCard title="Prioridade na prova" value="alta" />
      </section>
      <section className="ni-grid ni-grid--analysis">
        <article
          className="ni-panel ni-analysis-map"
          style={{ position: "relative", overflow: "hidden" }}
        >
          <span className="ni-kicker">Mapa de evidências</span>
          <h2>{screen.topic} pede ajuste.</h2>
        <InstrumentalArtifact
            family={palette.family}
            primary={palette.primary}
            secondary={palette.secondary}
            topic={screen.topic}
          />
          <div className="ni-map">
            <i />
            <i />
            <i />
            <i />
            <b />
          </div>
          <p>O mapa combina recorrência, desempenho e intervalo de revisão.</p>
        </article>
        <Panel subject={screen.subject} interactive className="ni-panel ni-analysis-list">
          <span className="ni-kicker">Leituras acionáveis</span>
          {[
            "Consolidar base",
            "Retomar erro recorrente",
            "Simular sob tempo",
          ].map((item, i) => (
            <button key={item}>
              <span>0{i + 1}</span>
              {item}
              <ArrowRight />
            </button>
          ))}
          <Button subject={screen.subject} className="ni-primary w-full">
            <BarChart3 />
            {screen.action}
          </Button>
        </Panel>
      </section>
    </>
  );
}
function Account({ screen }: { screen: InstrumentalScreen }) {
  return (
    <section className="ni-grid ni-grid--account">
      <Panel subject={screen.subject} interactive className="ni-panel">
        <span className="ni-kicker">Preferências e infraestrutura</span>
        <h2>{screen.title}</h2>
        <p>{screen.summary}</p>
        <div className="ni-settings">
          {[
            "Disponibilidade semanal",
            "Meta de estudo",
            "Notificações úteis",
            "Preferência de movimento",
          ].map((item, i) => (
            <div key={item}>
              <span>{item}</span>
              <b>{i === 3 ? "reduzir quando preciso" : "configurado"}</b>
            </div>
          ))}
        </div>
        <Button subject={screen.subject} className="ni-primary w-full">
          <Settings2 />
          {screen.action}
        </Button>
      </Panel>
      <Panel subject={screen.subject} interactive className="ni-panel ni-account-art">
        <InstrumentalArtifact family="signal" primary="#81a9ff" secondary="#d9b583" />
        <p>
          Estados de conexão, edição e confirmação recebem movimento curto e
          explícito.
        </p>
      </Panel>
    </section>
  );
}
function Admin({ screen }: { screen: InstrumentalScreen }) {
  return (
    <>
      <section className="ni-card-row">
        <MetricCard title="Atividade em 24h" value="1.284" />
        <MetricCard title="Fila de revisão" value="18 itens" />
        <MetricCard title="Integridade" value="98,7%" />
      </section>
      <section className="ni-grid ni-grid--admin">
        <Panel subject={screen.subject} interactive className="ni-panel">
          <span className="ni-kicker">Sinal operacional</span>
          <h2>{screen.title}</h2>
          <div className="ni-admin-chart">
            <i />
            <i />
            <i />
            <i />
            <i />
          </div>
          <p>{screen.summary}</p>
        </Panel>
        <Panel subject={screen.subject} interactive className="ni-panel ni-admin-queue">
          <span className="ni-kicker">Fila priorizada</span>
          {[
            "Validar fonte",
            "Publicar material",
            "Revisar cobertura",
            "Resolver alerta",
          ].map((item, i) => (
            <button key={item}>
              <b>0{i + 1}</b>
              <span>{item}</span>
              <ArrowRight />
            </button>
          ))}
          <Button subject={screen.subject} className="ni-primary w-full">
            <Activity />
            {screen.action}
          </Button>
        </Panel>
      </section>
    </>
  );
}
function Metric({
  label,
  value,
  bar = false,
  warn = false,
}: {
  label: string;
  value: string;
  bar?: boolean;
  warn?: boolean;
}) {
  return (
    <div className="ni-metric">
      <small>{label}</small>
      <b className={warn ? "warn" : ""}>{value}</b>
      {bar && (
        <i>
          <span />
        </i>
      )}
    </div>
  );
}
function MetricCard({ title, value }: { title: string; value: string }) {
  return (
    <Panel interactive className="ni-panel ni-metric-card">
      <span className="ni-kicker">{title}</span>
      <b>{value}</b>
      <i />
    </Panel>
  );
}
function Mini({
  title,
  text,
  icon: Icon,
}: {
  title: string;
  text: string;
  icon: LucideIcon;
}) {
  return (
    <Panel interactive className="ni-panel ni-mini">
      <span className="ni-icon-depth">
        <Icon />
      </span>
      <h3>{title}</h3>
      <p>{text}</p>
    </Panel>
  );
}
