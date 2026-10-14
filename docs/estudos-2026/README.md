# Estudos integrados: material e funcionamento

Entrega de 13/10/2026. Escopo aprovado em conversa, incluindo execução automática até finalizar. O objetivo é preparar para as provas conciliando cursinho, revisão, resolução de questões e tempo real.

## Material para usar

- [Expansão de questões reais — Unicamp 2026](expansao-questoes-reais.md): 72 questões oficiais com resolução por etapas, recuperação e transferência.
- [Caderno de questões reais — PDF, 99 páginas](../../public/real-exams/unicamp-2026.pdf): prova vetorial, gabarito e resoluções autorais com navegação por questão.
- [Guia em PDF — 24 páginas](../../public/study-guide.pdf).
- [Guia navegável e para impressão](../../public/study-guide.html), com [estilos compartilhados](../../public/study-guide.css).
- [Guia em Markdown](guia-de-estudo.md): métodos, rotina, fases, correção, redação, obras e 12 protocolos por área.
- [Fontes e evidências](fontes-e-evidencias.md): o que foi verificado, afirmações sustentadas e limites.
- [Missão de aprendizagem](MISSION.md) e [lição curta sobre transferência](lessons/0001-do-erro-a-transferencia.html).

Regenerar Markdown/HTML: `node --import tsx scripts/generateStudyGuide.ts`. O PDF foi exportado com Chromium instalado, respeitando os estilos de impressão. Os exercícios são autorais; não são questões oficiais ou levantamento de incidência.

## No aplicativo

- [Central de revisão](central-revisao.md): 21 recursos, roteiro nas janelas restantes e preservação das atividades ao alternar.

**Estratégias:** seletor de 12 áreas, 6 bancas, 105 tópicos e seus capítulos. Cada área tem sequência de resolução, conferência, exemplo, transferência, revisão e pegadinhas. Aprofundamento usa trechos dos resumos editoriais e, quando encontrados, exemplos textuais com origem no banco. A ausência de exemplo elegível não mede ausência na prova. Vunesp não agrupa instituições distintas numa mesma regra de formato.

**Revisões:** insight com evidência disponível, ação, duração e critério. A fila de erros cria revisitas D+1/D+3/D+7, consolida atrasos, identifica a questão/relato e abre o registro correspondente. Tentativa com ajuda ou malsucedida volta no dia seguinte; registrar tentativa não aumenta domínio automaticamente. Tentativas registradas no dia consomem o orçamento, sem repor 30 minutos depois de cada conclusão.

**Agenda:** modelo de rotina do cronograma carregado como rascunho, sem sobrescrever a agenda existente. Todas as atividades podem ser editadas. Revisão noturna 20h30–21h; prática complementar 19h30–20h15 e pausa 20h15–20h30. Na nova rotina, estudo usa blocos de 25–50 minutos e revisão 15–30; agendas anteriores continuam aceitas. Calendar pode interromper janelas preservando sua finalidade.

**Plano e Reta Final:** horários de ações cabem nas janelas compatíveis; revisões têm preferência por período reservado; ações curtas aproveitam sobras sem deslocar prioridades já colocadas. O roteiro usa a rotina salva, exclui dias fora do recorte e respeita bancas/fases ativas. Dias de prova confirmada bloqueiam estudo autônomo; véspera limita a 90 minutos de revisão leve. Capacidade futura não presume Calendar ou exceções ainda não consultadas. Segunda fase depende de convocação e ajuste do foco nos objetivos.

## Decisões e custos

1. Preservar o modelo semanal anterior e oferecer a nova rotina por carregamento/salvamento explícitos. Custo: a estudante precisa aplicar o modelo uma vez, em vez de receber uma substituição silenciosa.
2. Preencher sobras de horário e devolver ações em ordem cronológica, preservando os escores. Custo: uma ação menor pode aparecer antes no relógio, sem deslocar uma prioridade já alocada.
3. Seguir a autorização automática em lugar de novas pausas de aprovação. A entrega permanece em branch/PR, sem merge automático.
4. Tratar exibição de fuso e capacidade bruta como problemas importantes de planejamento, apesar da classificação inicial menor na revisão. Ambos foram corrigidos.
5. Reservar a pausa de 15 minutos antes da revisão fixa. Custo: prática noturna calculada passa de 50 a 45 minutos; revisão e sono ficam protegidos.
6. Conectar também o roteiro existente à agenda salva, em vez de deixar horas estáticas contradizendo a nova agenda. Calendário futuro permanece estimado, não disponibilidade já confirmada.

## Verificação

- `npm run test:node`: **1.059 testes passaram**, zero falhas.
- `npm run test:vitest -- --maxWorkers=8`: **216 arquivos, 3.101 testes passaram**, zero falhas. São os dois componentes da suíte completa do projeto.
- `npm run lint`: passou.
- `npm run build`: passou; permanecem avisos de tamanho de chunks e imports dinâmicos/estáticos do projeto.
- `git diff --check`: passou.
- Inspeção com Chromium: estratégias, agenda, revisões e guia em iPad; também versões estreitas, data histórica e registro específico do caderno. O PDF teve extração e primeira página renderizada para inspeção.
- Revisão independente: três achados importantes corrigidos com regressões que falharam antes da correção e passaram depois (data histórica, identificação dos erros e reposição indevida do orçamento). Fuso, rótulo da capacidade e link PDF também tratados. Não restaram achados conhecidos adiados.
- A execução completa anterior pegou a pausa noturna de 10 minutos; a rotina foi corrigida para 15 e a suíte completa foi repetida com resultado verde.

## Limites reais

Unesp segunda fase e Unifesp permanecem a confirmar por fonte oficial vigente; essas datas não bloqueiam automaticamente a agenda. Deslocamentos e compromissos não fornecidos são estimativas editáveis. Resumos existentes, progresso e chaves de armazenamento foram preservados; não se afirma revisão editorial nova de todos os 613 capítulos.

A geração de IA exige autenticação: a chamada local sem sessão retornou `401 AUTH_REQUIRED`, conforme esperado. Seleção, referências, streaming, falha e isolamento do recorte foram testados; respostas reais geradas não foram avaliadas nesta sessão sem conta autenticada. O guia autoral e os protocolos estão disponíveis sem geração.
