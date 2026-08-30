# Crivo — sistema autoral de interface e motion

**Status:** direção aprovada para planejamento e implementação

**Data:** 29 de agosto de 2026

**Base técnica:** `origin/main` em `190981c`

## 1. Fontes de verdade

Use esta ordem quando duas fontes divergirem:

1. decisões explícitas da usuária registradas neste documento;
2. referência aprovada em `.claude/design-reference/nucleo-instrumental/`;
3. comportamento e dados reais preservados na `main`;
4. planos anteriores, apenas como histórico.

Arquivos de referência obrigatórios para qualquer trabalho visual ou de motion:

- `.claude/design-reference/nucleo-instrumental/APPROVED.md`;
- `.claude/design-reference/nucleo-instrumental/nucleo-instrumental-demo-v6.webm`;
- `.claude/design-reference/nucleo-instrumental/index.html`;
- `.claude/design-reference/nucleo-instrumental/engine.js`.

Os protótipos antigos são pesquisa, não código de produção. A versão final deve reproduzir sua intenção, materialidade e comportamento usando dados reais, acessibilidade e os contratos atuais do aplicativo.

## 2. Tese do produto

O Crivo é um sistema adaptativo de decisão para aprendizagem. Sua gramática central é **convergência**: sinais dispersos ganham forma até produzir uma intervenção compreensível e executável.

A interface deve comunicar, em até cinco segundos:

1. o que fazer agora;
2. quanto tempo isso exige;
3. por que essa decisão foi tomada;
4. como a estudante pode discordar ou alterar o curso.

O produto deve ter personalidade reconhecível sem depender do logotipo. Movimento, geometria, luz, tipografia, composição e reação aos dados formam a identidade.

## 3. Decisões consolidadas da usuária

- Motion é estrutural e causal. A interface se transforma porque o estado ou a decisão mudou.
- A experiência mostra a inteligência organizando sinais, em vez de apenas exibir o resultado dentro de cards.
- Cada matéria possui geometria, atmosfera, ritmo e comportamento próprios. Trocar somente a cor não constitui uma identidade por matéria.
- O conteúdo de cada área deve admitir manipulação coerente com seu raciocínio quando a jornada exigir interação.
- “Por que isso?” desmonta visualmente a recomendação e revela os sinais que a produziram.
- “Discordo” registra a escolha, recalcula quando houver contrato real para isso e recompõe a interface. A animação nunca pode fingir uma recalibração inexistente.
- Web e celular compartilham dados e estado, mas possuem composições próprias. Mobile não é desktop comprimido.
- A identidade deve alcançar todas as telas, em fases verificáveis, preservando integralmente funcionalidades e dados reais.
- O resultado final deve ser autoral, acolhedor e preciso; uma grade de cards genéricos não pode ser a linguagem dominante.

## 4. Sistema visual por matéria

Uma matéria é um universo visual; um tópico é um artefato específico dentro dele; um estado determina como esse artefato se comporta.

O registro canônico de cada matéria deve definir:

- paleta de fundo, superfície, estrutura, acento e emissão;
- geometria do Núcleo;
- campo ambiental;
- ritmo, duração, easing e amortecimento;
- tipografia ou tratamento tipográfico;
- regra de metamorfose de entrada e saída;
- vocabulário de interação do conteúdo;
- fallback estático acessível.

Todas as matérias e áreas reais do produto precisam de perfil próprio antes de a migração ser considerada completa. Inglês, Filosofia e Sociologia não podem permanecer indefinidamente com perfil neutro. Atualidades, Redação e Obras Obrigatórias são experiências próprias, não simples aliases cromáticos.

Exemplos de vocabulário de interação:

- Matemática: relações, funções, curvas, parâmetros e demonstrações;
- Física: vetores, forças, ondas, campos e trajetórias;
- Química: ligações, estruturas, energia, equilíbrio e transformação;
- Biologia: sistemas, ciclos, membranas, redes e fluxo;
- História: causalidade, temporalidade, permanência e ruptura;
- Geografia: território, escala, camadas, redes e fluxos;
- Português e Inglês: sintaxe, contexto, ênfase e construção de sentido;
- Filosofia e Sociologia: conceitos, tensões, argumentos, estruturas e relações sociais;
- Atualidades: fato, contexto, atores, impactos e desdobramentos;
- Redação: tese, evidência, análise, coerência e reescrita;
- Obras Obrigatórias: narrador, perspectiva, tempo, relações e evidências textuais.

## 5. Tela Hoje — composição de referência

### Desktop

A primeira dobra é uma composição integrada, não um card grande sobre um dashboard.

- O texto decisório ocupa o lado de leitura.
- O Núcleo ocupa aproximadamente 35–45% da largura útil do hero e funciona como protagonista visual.
- A atmosfera da matéria atravessa a primeira dobra e conecta texto, Núcleo e sequência calculada.
- Tópico, intervenção, duração, razão principal e CTA aparecem antes de informação secundária.
- Domínio, confiança e urgência são instrumentos compactos subordinados à decisão.
- A sequência seguinte aparece como continuidade calculada, não como coleção de cards equivalentes.

### Mobile

- O Núcleo permanece legível e relevante; nunca vira um selo decorativo.
- Tópico, intervenção, duração e CTA cabem na primeira dobra em uma hierarquia inequívoca.
- “Por que isso?” e “Discordo” permanecem imediatamente acessíveis.
- Ações seguintes usam progressão vertical própria e disclosure; não reproduzem a grade desktop.
- Navegação inferior não cobre conteúdo nem ações.

### Remoções obrigatórias da tela Hoje

- grade genérica de três métricas;
- banner promocional estático “Prioridade Fuvest”;
- chips ou badges que não alteram a decisão atual;
- Núcleo reduzido a ícone decorativo;
- listas visualmente uniformes de cards com a mesma importância.

Informações removidas podem reaparecer em uma tela ou disclosure em que alterem uma decisão real.

## 6. Coreografia funcional

Todo momento animado deve corresponder a um evento observável.

### Carregamento e recomendação

1. sinais disponíveis aparecem como matéria ainda não resolvida;
2. o Núcleo passa por `listening → analyzing → converging → ready` conforme estados reais permitirem;
3. texto e ação emergem da convergência;
4. a sequência calculada estabiliza depois da decisão principal.

Quando a aplicação já possui a recomendação no primeiro frame, a coreografia pode apresentar a decisão, mas não deve simular trabalho assíncrono inexistente.

### Mudança de matéria

A transição combina, na mesma janela temporal:

- metamorfose geométrica do Núcleo;
- tween da paleta;
- alteração do campo ambiental;
- troca de ritmo e lei de movimento;
- transição tipográfica do tópico;
- reordenação da sequência quando o ranking realmente mudar.

Uma troca de matéria deve continuar reconhecível em escala de cinza e sem depender apenas da cor.

### Explicação e discordância

- “Por que isso?” expande o espaço e separa os fatores que formaram a recomendação.
- Fatores apresentados correspondem ao snapshot usado no ranking.
- “Discordo” abre integrado à composição, preserva contexto e confirma a gravação.
- Uma nova prioridade só se recompõe visualmente depois de uma alteração real dos dados ou do ranking.

### Início da sessão

“Começar” transforma a decisão em ambiente de execução. A transição preserva tópico, matéria, objetivo e duração como continuidade perceptiva entre Hoje e Sessão.

### Movimento reduzido

Com `prefers-reduced-motion`, a informação chega ao estado final sem trajetórias, stagger, rotação ou loops. Mudanças de estado continuam perceptíveis por estrutura, texto e contraste.

## 7. Arquitetura de integração

- Dados e regras de domínio da `main` são preservados.
- `useDailyPlan` permanece a fronteira única da decisão diária.
- O snapshot visual deriva da mesma ação que produziu ranking, fatores e alocação.
- Componentes visuais recebem estados explícitos; não descobrem ou inventam estados de negócio internamente.
- O registro por matéria é compartilhado entre Hoje, Diagnóstico, Sessão e demais jornadas.
- Canvas cuida do Núcleo e dos campos que exigem desenho contínuo; Motion coordena layout, presença, texto e transições de componentes.
- Loops Canvas executam apenas com elemento visível, aba ativa, área renderizável e movimento permitido.
- Cada tela usa somente a intensidade visual adequada à tarefa. O Núcleo não precisa dominar todas as páginas.

## 8. Expansão para todas as telas

A expansão é parte do objetivo final, mas ocorre em fases com aprovação visual e QA ao fim de cada uma.

### Fase A — Hoje e shell

Restaurar fidelidade à referência, fechar o sistema de motion, corrigir navegação e validar a gramática principal.

### Fase B — Diagnóstico e Sessão

- Diagnóstico funciona como instrumento de medição: uma questão por vez, evidência visível, progresso preciso e conclusão clara.
- Sessão funciona como ambiente de intervenção: conteúdo central, execução inequívoca e feedback ligado à ação realizada.
- A jornada `Diagnóstico → Hoje → Sessão → nova evidência → Hoje` deve funcionar com dados reais.

### Fase C — Prática e conteúdo

Questões, Revisões, Flashcards, Resumos, Obras, Redação e Treino de 2ª Fase recebem componentes e interações específicas do conteúdo, preservando legibilidade e produtividade.

### Fase D — Planejamento e acompanhamento

Plano, Agenda, Evolução, Prioridades, Reta Final, Recuperação e Perfil adotam a gramática do Crivo sem transformar análise em decoração.

### Fase E — Aprofundamento e telas restantes

Tutor, Podcast, Laboratório, Estratégias, Conexões e áreas administrativas são migrados conforme sua função. Telas administrativas usam uma versão mais sóbria do sistema.

### Fase F — coerência total

Auditar rotas, estados, temas, responsividade, acessibilidade, desempenho e consistência entre as fases. Nenhuma rota fica visualmente esquecida ou funcionalmente regressiva.

## 9. Acessibilidade, desempenho e robustez

- WCAG AA para texto, controles e estados;
- foco visível, teclado, landmarks, labels e anúncios de estado;
- áreas de toque de pelo menos 44 × 44 px;
- conteúdo disponível mesmo quando Canvas falhar;
- nenhuma informação transmitida apenas por cor ou animação;
- animações interrompíveis e sem atraso artificial de navegação;
- Canvas limitado a DPR 2 e pausado fora da viewport;
- lazy loading ou divisão de código para motores visuais pesados;
- ausência de vazamentos de `requestAnimationFrame`, timers e observers;
- suporte a temas claro e escuro como traduções completas da mesma identidade, não simples inversão.

## 10. Critérios de aceite

A Fase A só termina quando:

- uma pessoa identifica o que fazer, por quê e por quanto tempo em até cinco segundos;
- o Núcleo é protagonista no desktop e legível no mobile;
- a mudança entre duas matérias altera geometria, campo, ritmo e tipografia, além da cor;
- o ciclo `analyzing → converging → ready` é visível quando sustentado pelo estado;
- “Por que isso?” desmonta a decisão usando os fatores reais;
- feedback salvo possui confirmação animada;
- ações secundárias entram e reordenam com stagger real;
- a grade genérica de métricas e o banner promocional foram removidos de Hoje;
- temas claro/escuro e reduced motion estão corretos;
- todas as rotas permanecem alcançáveis;
- lint, testes e build passam;
- QA em navegador real cobre desktop e mobile;
- uma gravação lado a lado comprova fidelidade à referência aprovada.

O projeto completo só termina quando cada matéria e área em escopo possui identidade própria e todas as fases passaram pelos mesmos portões de verificação.

## 11. Segurança de entrega

- Trabalhar sobre a `main` mais recente em worktree isolado.
- Preservar alterações existentes nos outros checkouts.
- Manter commits pequenos, temáticos e revisáveis.
- Não fazer push, merge ou deploy sem pedido explícito.
- Não alterar regras de negócio para facilitar uma animação.
