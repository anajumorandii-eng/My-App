# Mapa de funcionalidades do Crivo

Este documento é o inventário de produto para mudanças de interface. A regra
de migração é simples: uma tela pode mudar de composição visual, mas suas
ações, estados de vazio/carregamento/erro, persistência e navegação abaixo não
podem desaparecer.

## Rotas de produção

| Rota | Funcionalidade preservada | Estado e módulos principais |
| --- | --- | --- |
| `/` | Prioridade do dia, justificativa da recomendação, sequência e fila de ações | `useDailyPlan`, `useUserMastery`, `useStudentGoals`, feedback do plano |
| `/diagnostico` | Diagnóstico adaptativo com questões objetivas e discursivas | `useQuestions`, `useUserMastery`, tentativas em `userData` |
| `/plano` | Plano semanal, alocação de blocos e itens não alocados | `useDailyPlan`, `studyRoadmap`, metas do estudante |
| `/agenda` | Disponibilidade semanal e exceções de agenda | `features/availability`, validação de segurança de horários |
| `/reta-final` | Marcos de prova e roteiro para a fase final | `studyRoadmap`, `examCalendar` |
| `/recuperacao` | Fila PONTE, evidências e encerramento de atrasos | `backlogEngine`, `recoveryEvidence`, `useUserBacklog` |
| `/sessao` | Cronômetro, prática do tópico, verificação e registro da sessão | `useDailyPlan`, `useQuestions`, SM-2 e `userData` |
| `/questoes` | Banco filtrável, resposta, diagnóstico de erro e atualização de revisão | `useQuestions`, `errorDiagnosis`, SM-2 |
| `/revisoes` | Fila de revisões, autoavaliação e repetição espaçada | `reviewUrgency`, `spacedRepetition`, domínio e resumos |
| `/flashcards` | Catálogo por matéria, sessão e prioridades de cartão | `flashcardContent`, `useFlashcardReviews`, `flashcardStudyView` |
| `/treino-2a-fase` | Questões discursivas, tempo, protocolos e autoavaliação | `discursiveQuestions`, `useDiscursiveAttempts`, SM-2 |
| `/redacao` | Escrita, reescrita, rubrica, bancas e checklist | `essayModule`, contratos de correção do tutor |
| `/erros` | Caderno de erros, intervenções e hipótese assistida por IA | `userData`, `errorLabels`, `aiClient` |
| `/resumos` | Catálogo, filtros, leitura, recuperação ativa e progresso | `interactiveSummaries`, `summaryEngine`, `useSummaryProgress` |
| `/podcast` | Episódios, preferência de duração e reprodução/síntese de áudio | `usePodcastEpisodes`, `podcastAudio` |
| `/tutor` | Tutoria socrática, explicação, correção, geração e revisão ativa | `tutorContracts`, `aiClient`, domínio do estudante |
| `/laboratorio` | Métodos de estudo, filtros, experimentos e exemplos por IA | `useStudyMethods`, `aiClient` |
| `/estrategias` | Método geral, estratégias por matéria/banca e protocolos discursivos | `resolutionStrategies` |
| `/evolucao` | Métricas de domínio, gráficos, progresso de resumos e leitura assistida | `useUserMastery`, `summaryProgressDashboard`, Recharts |
| `/prioridades` | Pesos por vestibular, incidência por matéria e obras prioritárias | `examPriorities`, `literaryWorks` |
| `/obras` | Catálogo literário, filtros e acesso aos dossiês | `literaryWorks` |
| `/obras/:workSlug` | Dossiê da obra em abas e vínculo com o catálogo | dados de obras e parâmetro de rota |
| `/obras-obrigatorias` | Revisão ativa do repertório literário obrigatório | conteúdo literário e flashcards |
| `/conexoes` | Login Google, agenda e arquivos do Drive | `lib/auth`, integrações Calendar/Drive |
| `/perfil` | Metas, bancas, disponibilidade e preferências de aprendizagem | perfil, metas e agenda do estudante |
| `/admin` | Métricas de uso, falhas, cache, tokens e custo de IA | `/api/admin/metrics` |
| `/admin/obras` | Upload, auditoria, segmentação e requisitos de obras | `/api/admin/literary` |
| `/admin/conteudo` | Gestão e semeadura de questões, métodos e episódios | `/api/admin/content` |

## Módulos transversais

| Módulo | Responsabilidade |
| --- | --- |
| `AuthProvider` e `lib/auth` | Sessão Firebase/Google e token para rotas protegidas. |
| `lib/userData` e hooks `useUser*` | Persistência de domínio, tentativas, sessões, erros, perfil e evidências. |
| `lib/spacedRepetition` | Atualização SM-2 a partir de respostas e autoavaliações. |
| `features/daily-plan` | Prioriza, explica e aloca ações de estudo no tempo disponível. |
| `lib/aiClient` e contratos do tutor | Chamadas de IA, mensagens de falha e estruturação de respostas. |
| `design-system` | Tema claro/escuro, paletas por matéria, movimento e componentes reutilizáveis. |
| `RouteVisualShell` e `routeVisuals` | Seam visual única para as 28 telas; define campo instrumental sem alterar a lógica de cada view. |

## Invariantes para futuras migrações

1. Não substituir ações persistentes por simulações visuais.
2. Manter os estados de carregamento, sem dados, erro de sincronização e modo demonstração.
3. Preservar parâmetros de URL, especialmente tópico de sessão, filtros de resumos e `workSlug`.
4. Reutilizar `Panel`, `Button`, `CrivoCore` e os tokens por matéria; não introduzir paletas locais sem registrá-las.
5. Mudanças em uma rota devem atualizar este mapa e o registro em `src/design-system/routeVisuals.ts`.
