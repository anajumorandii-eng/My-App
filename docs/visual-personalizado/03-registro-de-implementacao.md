# 03 — Registro de implementação

## 2026-09-14 — prancha viva guiada pelas telas aprovadas

As cinco referências entregues pela usuária foram copiadas para
`referencias-aprovadas/`. Depois da atualização da base, o trabalho foi
reaplicado sobre a `main` para preservar as 26 pranchas autorais que já estavam
integradas e acrescentar a prancha radial das Leis de Newton.

## 2026-09-14 — correção de direção após revisão visual

A primeira integração ainda deixava um cabeçalho preto de dashboard ocupar o
primeiro enquadramento e empurrava a prancha para baixo. A revisão foi recusada
por parecer genérica. A tela passou a usar uma composição editorial contínua:

- identificação compacta de matéria e tópico, com anotação manuscrita;
- prancha como elemento dominante desde o primeiro enquadramento;
- modos em abas editoriais, sem botões genéricos preenchidos;
- diagnóstico vivo na lateral no desktop e como folha inferior no celular;
- textura de papel ou lousa, recortes irregulares e hierarquia tipográfica;
- transição de entrada com `motion/react` e respeito a movimento reduzido;
- cadeia mobile compacta, sem vazios artificiais entre os conceitos.

A validação também encontrou e corrigiu um controle de domínio sobreposto à
aba Reconstruir no celular.

## 2026-09-14 — redesenho das ilustrações e símbolos

Após a composição ser aprovada como direção, os desenhos ainda foram recusados
por parecerem ícones genéricos ampliados. A correção alterou os SVGs: o pistão
recebeu vidro, metal, reflexos, gás em profundidade e partículas; cloroplasto e
mitocôndria receberam volume, textura e anatomia reconhecível; Newton recebeu
traço de lousa e marcas de força. Explorar, Testar e Reconstruir agora têm
glifos próprios, desenhados para a função pedagógica de cada modo.

### Primeira etapa técnica

### Arquivos criados

- `src/views/visual-boards/NewtonBoard.tsx`
  - acrescenta uma prancha radial específica para as três leis de Newton;
  - liga a seleção e os estados aos nós reais do capítulo;
  - reúne inércia, segunda lei, ação e reação e o exemplo do elevador.
- `scripts/captureVisualPersonalized.ts`
  - abre exemplos de matérias diferentes em navegador real;
  - registra desktop e mobile;
  - executa arrastar e soltar antes da captura mobile.

### Arquivos alterados

- `src/views/Visual.tsx`
  - adiciona arrastar e soltar às lacunas;
  - preserva clique, teclado, correção, histórico e persistência.
- `src/views/Visual.css`
  - estiliza o mapa radial de Newton;
  - adiciona alvo explícito para soltar relações;
  - mantém a composição responsiva existente.
- `src/views/visual-boards/registry.ts`
  - registra Newton por matéria e palavras-chave sem alterar as demais pranchas.

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
