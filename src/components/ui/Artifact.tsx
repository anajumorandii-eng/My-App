import React from "react";
import { motion } from "motion/react";

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

function getTopicArtifact(topic?: string, family?: string): string {
  if (topic && TOPIC_ARTIFACTS[topic]) return TOPIC_ARTIFACTS[topic];

  if (topic) {
    const lower = topic.toLowerCase();
    if (lower.includes("geometria") || lower.includes("funç") || lower.includes("cálculo") || lower.includes("matemát") || lower.includes("álgebra") || lower.includes("trigonometria") || lower.includes("probabil")) {
      return "coordinate-grid";
    }
    if (lower.includes("ecol") || lower.includes("bio") || lower.includes("celul") || lower.includes("genét") || lower.includes("fisiol") || lower.includes("vida") || lower.includes("evoluç") || lower.includes("planta")) {
      return "ecology-web";
    }
    if (lower.includes("ópt") || lower.includes("físic") || lower.includes("mecân") || lower.includes("eletric") || lower.includes("ond") || lower.includes("termodin") || lower.includes("força")) {
      return "refraction";
    }
    if (lower.includes("quím") || lower.includes("equilíb") || lower.includes("estequio") || lower.includes("átom") || lower.includes("reaç") || lower.includes("molécul")) {
      return "molecule-ratio";
    }
    if (lower.includes("histór") || lower.includes("guerra") || lower.includes("brasil") || lower.includes("repúbl") || lower.includes("filosof") || lower.includes("sociol") || lower.includes("idade")) {
      return "bipolar-field";
    }
    if (lower.includes("texto") || lower.includes("português") || lower.includes("literat") || lower.includes("gramát") || lower.includes("sintaxe") || lower.includes("redação") || lower.includes("inglês") || lower.includes("obra") || lower.includes("romant") || lower.includes("poes")) {
      return "text-layers";
    }
    if (lower.includes("geograf") || lower.includes("clima") || lower.includes("urban") || lower.includes("espaço") || lower.includes("populaç") || lower.includes("relevo")) {
      return "climate-front";
    }
    if (lower.includes("atual") || lower.includes("geopolít") || lower.includes("notícia") || lower.includes("mund") || lower.includes("conflito")) {
      return "network-pulse";
    }
  }

  if (family === "grid") return "coordinate-grid";
  if (family === "organic") return "ecology-web";
  if (family === "wave") return "refraction";
  if (family === "bond") return "molecule-ratio";
  if (family === "poles") return "bipolar-field";
  if (family === "type") return "text-layers";
  if (family === "topo") return "climate-front";
  if (family === "signal") return "network-pulse";
  return "coordinate-grid";
}

function Artifact({
  family,
  primary,
  secondary,
  topic,
}: {
  family: string;
  primary: string;
  secondary: string;
  topic?: string;
}) {
  const artifact = getTopicArtifact(topic, family);
  const style = { "--p": primary, "--s": secondary } as React.CSSProperties;
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
  if (
    artifact === "narrative-layers" ||
    artifact === "poetic-orbit" ||
    artifact === "text-layers" ||
    artifact === "syntax-align" ||
    artifact === "paragraph-bridge"
  )
    return (
      <div
        className={`ni-subject-scene ni-scene-language ${artifact}`}
        data-topic-artifact={artifact}
        style={style}
      >
        <i />
        <i />
        <i />
        <b />
        <em />
      </div>
    );
  if (artifact === "bipolar-field" || artifact === "timeline-strata")
    return (
      <HistoryCore
        primary={primary}
        secondary={secondary}
        artifact={artifact}
      />
    );
  if (
    artifact === "climate-front" ||
    artifact === "urban-grid" ||
    artifact === "network-pulse" ||
    artifact === "market-flow"
  )
    return (
      <div
        className={`ni-subject-scene ni-scene-humanities ${artifact}`}
        data-topic-artifact={artifact}
        style={style}
      >
        <i />
        <i />
        <i />
        <b />
        <em />
      </div>
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

export { Artifact };
