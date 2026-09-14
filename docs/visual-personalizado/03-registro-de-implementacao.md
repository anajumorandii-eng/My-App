# 03 — Registro de implementação

## 2026-09-14 — prancha viva guiada pelas telas aprovadas

As cinco referências entregues pela usuária foram copiadas para
`referencias-aprovadas/`. A corrente genérica de caixas foi substituída na rota
por uma prancha editorial: o artefato do tópico ocupa o centro e os conceitos
se distribuem ao redor dele. História recebe composição horizontal em estratos;
ciências recebem sistemas, redes, fórmulas ou construções coerentes com o tema.

O SVG semântico mantém o contrato acessível já coberto pelos testes, enquanto
os cartões continuam ligados às seções reais do resumo e ao diagnóstico.

### Primeira etapa técnica

### Arquivos criados

- `src/design-system/illustrations/VisualTopicArtifact.tsx`
  - resolve o artefato a partir de matéria, tópico e título;
  - contém desenhos SVG específicos;
  - aplica movimento com `motion/react`;
  - respeita `useReducedMotion`.
- `scripts/captureVisualPersonalized.ts`
  - abre exemplos de matérias diferentes em navegador real;
  - registra desktop e mobile;
  - executa arrastar e soltar antes da captura mobile.

### Arquivos alterados

- `src/views/Visual.tsx`
  - integra o artefato do tópico à prancha;
  - muda o foco visual quando um nó é selecionado;
  - adiciona arrastar e soltar às lacunas;
  - preserva clique, teclado, correção, histórico e persistência.
- `src/views/Visual.css`
  - adiciona o cenário editorial do artefato;
  - estiliza elementos científicos, fórmulas e texturas;
  - adiciona alvo explícito para soltar relações;
  - adapta a composição ao mobile.

### Contratos preservados

- `summaryId` e parâmetros de URL;
- `buildVisualMap` e tipos públicos;
- progresso local/Firestore via `useSummaryProgress`;
- `applySummaryAttempt` e Caderno de Erros;
- normalização e correção graduada;
- escolha de relações frágeis;
- explicação e discordância;
- carregamento, erro e capítulo removido.

### Decisão sobre biblioteca de grafos

React Flow continua como candidata para uma fase de mapas livres ou topologias
grandes. Não foi adicionada nesta etapa: os cinco nós atuais têm geometria
controlada, e o SVG autoral oferece maior fidelidade à referência com menor
custo. A decisão deve ser reavaliada quando houver edição livre de nós,
conexões criadas pela estudante ou mapas com muitas dezenas de conceitos.
