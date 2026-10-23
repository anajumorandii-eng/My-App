# Revisões estratégicas do CRIVO

Entrega de 23/10/2026. Extensão do recurso existente de Revisões (`resumos-banca`), sem apagar os resumos anteriores nem misturá-los aos Aprofundamentos.

## Análise do fluxo anterior

`ReviewSummaries.tsx` selecionava matéria/tópico/capítulo e uma banca obrigatória. `loadStudyPacket` reunia resumos editoriais, questões textuais elegíveis e fichas analíticas de provas; o servidor podia acrescentar apostila AS1. O cliente enviava `review-tip`/`guideMode: review-summary` ao serviço existente de geração com streaming. O prompt impunha uma extensão única aproximada. O resultado usava `AiText` e `StudySourcesPanel`, com persistência local e na coleção privada `users/{uid}/strategyGuides`, via `useStrategyGuides`. As respostas de recuperação apareciam abertas e esta tela não oferecia exportação.

A exportação existente dos Aprofundamentos já usava `DeepeningPdf`, `createStrategyPrintRoot`, as fontes e capas CRIVO, sumário com destinos reais e `renderStudyPdf` com Chromium. Essa infraestrutura foi reaproveitada.

## Habilidades efetivamente acessadas

Os três ZIPs enviados pela usuária foram extraídos apenas na pasta privada ignorada `.scratch/review-skills`. Foram lidos os três `SKILL.md` e seus 35 arquivos Markdown de referência: nove da tutora, onze de Atualidades e quinze de obras. Os arquivos inicialmente indisponíveis no catálogo foram fornecidos nos ZIPs; não há falta de arquivos dessas três habilidades nesta entrega. Os originais não foram copiados para o repositório público.

A adaptação ao CRIVO aplica intuição/conceito/mecanismo/aplicação; tradução do comando em tarefas; condições e limites de fórmulas; leitura de fontes; correção do primeiro desvio; recuperação e transferência. Atualidades preserva acontecimento, tempo/território, atores/interesses, antecedentes e consequências. Literatura preserva indício textual, procedimento formal, efeito e relação parte–todo, distinguindo evidência, crítica documentada e síntese interpretativa.

As instruções da usuária prevalecem sobre os originais: não se herdaram prioridade Fuvest, cobertura obrigatória de seis bancas, estimativas de incidência sem levantamento, seções extensas de dossiê nem perguntas automáticas para professor. Perguntas de recuperação e exercícios permanecem. A geração se identifica como CRIVO. O PDF adota a coleção CADERNOS DE REVISÃO e o mesmo padrão visual dos documentos existentes.

## Configuração e persistência

- Origem: conteúdo do Crivo, texto/extração informada com título/data/link opcionais, ou obra da biblioteca existente.
- Zero, uma ou várias bancas. Metas da conta podem ampliar a lista, mas nunca pré-selecionam Fuvest. Seleção vazia produz revisão geral.
- Etapas independentes por instituição: fases para Fuvest, Unicamp e Unesp; objetivas/discursivas para Famerp; ENEM/provas complementares para Unifesp (Medicina, sistema misto); sem fases para ENEM.
- Rápida, estratégica (padrão) ou aprofundada, com diferentes reconstruções, números e variedades de aplicações e recuperação; sem teto arbitrário de palavras.
- Histórico opcional: somente erros reais do tópico, com relato, data, evidência, confiança e desfecho. Não há perfil de aprendizagem presumido. Texto informado não herda erros de um tópico oculto.
- Opções acompanham cada guia salvo, com chaves distintas por fonte/configuração e tamanho limitado para o Firestore. Guias antigos continuam legíveis e recuperáveis. A troca de conta descarta respostas pendentes da conta anterior.

`strategicReview.ts` centraliza tipos, normalização, rótulos, etapas, seleção de evidências e separação de respostas. O servidor valida as opções; `targetBoards`, inclusive vazio, tem precedência sobre `board` legado. `reviewSummaryPrompt` compõe a regra comum com os perfis didáticos selecionados de `reviewExamGuidance`. Não injeta o contexto genérico de outras bancas.

Questões e análises são filtradas por banca e fase antes da seleção equilibrada. Fase desconhecida não é presumida em recorte restrito. Provas objetivas históricas de segunda fase da Unesp não são usadas como exemplo discursivo do ciclo atual. No componente ENEM do sistema misto, provas ENEM são fontes pertinentes à modalidade. Falta de evidência exige limite explícito e aplicação autoral identificada.

## Documentação oficial consultada

Conferência de 23/10/2026; são registros de ciclo, não promessa de atualização automática:

| Processo | Documento consultado | Uso |
|---|---|---|
| Fuvest 2027 | [Guia de Provas](https://www.fuvest.br/arquivos/vestibular/fuvest2027-guia-provas.pdf), seção de funcionamento | Distinguir objetiva e discursivas; respeitar componentes por carreira |
| Unicamp 2027 | [Manual do Ingresso](https://www.comvest.unicamp.br/wp-content/uploads/2026/07/VU2027-Manual-do-Ingresso.pdf) e [página do processo](https://www.comvest.unicamp.br/vestibular-2027/) | Fases e área Biológicas/Saúde |
| Unesp 2027 | [Manual republicado em 24/09](https://documento.vunesp.com.br/documento/stream/Nzg4ODEzMw%3d%3d), seção de provas | Primeira objetiva; segunda discursiva e redação |
| Famerp 2027 | [Edital de abertura](https://documento.vunesp.com.br/documento/stream/Nzg2MzQ2NA%3d%3d), capítulo VIII | Gerais objetivas; específicas de Biologia/Química/Física e redação |
| Unifesp 2027 | [Edital 723/2026](https://documento.vunesp.com.br/documento/stream/NzkxNzM1OA%3d%3d), itens 1.2.1 e 5.1–5.3 | ENEM objetivo + complementares de Medicina; línguas objetivas e redação; específicas analítico-expositivas |
| ENEM | [Perguntas frequentes do Inep](https://www.gov.br/inep/pt-br/areas-de-atuacao/avaliacao-e-exames-educacionais/enem/perguntas-frequentes) | Dias de exame não são fases |

O servidor acrescenta apenas os documentos das instituições selecionadas como fontes R#, com URL, ciclo e data de consulta. Esses documentos fundamentam formato, não frequência ou padrão de cobrança de um tópico. Padrões temáticos precisam das provas identificadas no pacote. A página principal de ingresso da Unifesp respondeu 403, mas seu edital oficial foi acessado pelo portal da organizadora. A página inicial específica da Fuvest respondeu 503; o site principal e o Guia de Provas foram acessados.

## Leitura e documento

O gabarito final é separado por um contrato de título. A tela o apresenta fechado e não mostra as respostas junto das perguntas, inclusive durante streaming. Uma nova resposta sem recuperação/gabarito separado não é salva como revisão completa. Documentos antigos com “Critérios para conferir” também têm respostas recolhidas.

A exportação usa o conteúdo completo, metadados da seleção e fontes salvas. Na cópia de impressão, o gabarito vai ao final, depois das fontes, iniciando página própria; a tela não é modificada. Mantêm-se capa temática, sumário paginado, fontes CRIVO, matemática e tabelas, com as proteções de paginação existentes.

## Limites

- Não foi acrescentado mecanismo de pesquisa externa ao vivo. Atualidades usa fonte e data informadas; não apresenta dados antigos como atuais. Link informado é referência, não download/leitura automática da página.
- Literatura utiliza módulos/passagens publicados, edição e crítica documentada do catálogo. Não se afirma leitura integral dos PDFs nem nova leitura integral dos estudos críticos. Sem lista oficial específica da obra/ciclo efetivamente recebida, sua obrigatoriedade deve ser declarada não verificada; a revisão ainda pode estudar a obra para outra banca.
- Cobertura de questões varia por tópico e etapa; ausência é sinalizada, sem inventar provas, incidências ou rubricas. Os perfis de treino são orientações didáticas, não tendências estatisticamente certificadas.
- Validação automatizada de geração usa provedor controlado e verifica o fluxo HTTP/SSE, opções, evidências e prompts reais. Não certifica a qualidade de toda futura saída probabilística nem uma sessão autenticada de produção. Dados de histórico/biblioteca usados em testes são sintéticos.
- Geração, sincronização da conta e PDF dependem das integrações autenticadas já existentes; não houve alteração de credenciais ou gravação de dados de estudo em produção para contornar autenticação.

## Verificações executadas

- Testes de prompt/validação: mesma Geometria Plana com Fuvest e Unicamp; múltiplas ENEM/Unicamp; seleção vazia contra `board` legado; segunda fase; três profundidades; Atualidades datada; Literatura dirigida a Unesp; histórico real fornecido versus ausente; rejeição de etapas, datas, URLs e profundidade inválidas.
- Teste com corpus real local: fontes distintas por banca; diversidade ENEM/Unesp; ausência de Fuvest não selecionada; restrição de fase; dossiê de Brás Cubas com edição, crítica e DOI preservados. Não depende de geração externa.
- Integração HTTP/SSE com serviço controlado: o pedido real passa pela validação/composição/rota e devolve AS1/R#; extração informada não recebe apostila automática de outro recorte; fontes de formato somente das selecionadas.
- Componentes: salvar/retomar, recarregar biblioteca, manter aprofundamentos antigos, falha sem gravar parcial, troca de conta, origem datada, obra dirigida a outra banca, opções múltiplas/fase/profundidade/histórico, revisão geral e exportação.
- Navegador Chromium em 390 e 834 px: biblioteca sintética retomada, seleções preservadas ao trocar de recurso, matemática sem erro KaTeX, ausência de overflow, respostas fechadas. Evidências `evidencias/revisao-390.png` e `evidencias/revisao-834.png`. Para conferir o caminho de exportação sem conta real, identidade e resposta de PDF foram simuladas exclusivamente na sessão local de teste; não houve envio a uma conta externa.
- O HTML capturado do exportador real foi processado separadamente pelo renderizador Chromium real do servidor, sem simulação do arquivo. `evidencias/revisao-sintetica.pdf`: quatro páginas A4, todas renderizadas e inspecionadas; capa CRIVO, sumário com páginas, conteúdo/fontes na terceira página e gabarito na quarta. Extração de texto confirma perguntas na página 3 e respostas na 4, com acentos, tabela e unidade cm² preservados. Trata-se de material autoral sintético de validação, não de questão atribuída a banca nem de saída real de IA.

A troca entre origem informada e catálogo limpa metadados ocultos da outra origem; teste específico evita reaplicar data ou extração anterior ao material novo.

## Estado do envio imediato

A pedido explícito da usuária, a branch foi preparada para envio imediato após lint/build e testes focados passarem. Os 1.224 testes de servidor/bibliotecas passaram; a etapa completa de interface ainda estava executando no momento do envio. O CI remoto deverá confirmar a suíte completa. Não se afirma implantação em produção.
