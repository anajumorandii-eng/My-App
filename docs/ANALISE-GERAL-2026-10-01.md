# Crivo — análise geral de retomada, 01/10/2026

Auditoria solicitada por Ana Júlia após trocar de conta no ChatGPT/Codex. Estado auditado: `main`, SHA completo `6cbc94cdb46048d00947db136ae529e1c6ef41af`. Última alteração funcional: `f9f0883cc4bf6efe4b6dcdc28301f216534411a1` (#241, cache de shaders). A cópia local foi conferida com `origin/main` e estava atualizada. Nenhuma funcionalidade foi alterada nesta auditoria.

## Conclusão

O Crivo já tem um conjunto amplo de ferramentas de estudo, lógica pedagógica, persistência, testes e identidade visual própria. O trabalho restante mais importante é consolidar qualidade e confiabilidade: distinguir evidência real de demonstração, revisar representações genéricas, concluir o aprofundamento editorial e reduzir o custo de carregamento. Cobertura de conteúdo e presença de artefatos não equivalem a aprovação pedagógica ou estética.

## O que foi examinado e o que esta análise não certifica

Foram consultados o código, as rotas, `CLAUDE.md`, continuidade, mapa funcional, contratos de evidência e registros de decisões e auditorias em `docs/visual-personalizado/`. Foram abertas 28 telas em Chromium real a 1366×900 e seis telas a 390×844: Hoje, Questões, Resumos, Visual, Redação e Perfil. Nessas aberturas não houve exceção de página nem overflow horizontal. Foram inspecionados capítulos de calorimetria, ecologia, função quadrática e Nietzsche, além de uma amostra do tema escuro e do tablet. Isso é uma revisão geral com amostragem, não uma aprovação das 613 experiências ou de todas as interações.

As capturas atuais e resultados estão em `/workspace/crivo-audit/`. A rota de detalhe de obra `/obras/:workSlug` não foi validada com uma obra real; o catálogo sem autenticação estava vazio. Administração foi observada sem conta autenticada. Login, sincronização real, escrita no Firestore, IA, Calendar, Drive e narração externa não foram validados de ponta a ponta: este ambiente não tem as credenciais de serviço configuradas. A ausência de credenciais local não demonstra falha de produção.

As conversas da conta anterior não foram recuperadas. Exigências presentes somente naquele histórico continuam fora deste levantamento. O repositório permite reconstruir grande parte das decisões, mas não provar que contém todas as instruções já dadas.

## Intenção de produto e exigências recuperadas

- Estudo personalizado para vestibulares de Medicina, especialmente Fuvest, Unicamp, Unesp, Famerp, Unifesp e ENEM. Interface em português brasileiro; nome atual CRIVO.
- Ciclo de diagnóstico → plano realizável dentro da agenda → sessão/prática → evidência → erro/revisão → recuperação. Tempo de atividade e leitura não são automaticamente prova de domínio.
- Preservar histórico, IDs de evidência e progresso; não renomear as chaves legadas `juju_*` sem migração. Novas revisões editoriais devem versionar somente os capítulos alterados.
- Conteúdo fiel: não inventar enunciados, dados, cenas ou diagnóstico para cobrir lacunas. Hipóteses de IA não devem virar fatos sem validação da estudante.
- Representação própria do assunto; mudar apenas texto/cor de um diagrama genérico não atende à personalização exigida. Movimento deve explicar mecanismos e continuar compreensível com movimento reduzido.
- Explorar, Testar e Reconstruir compartilham a evidência com Resumos/Caderno de Erros. Manter teclado, zoom acessível, temas e responsividade.
- A direção evoluiu: atlas editorial → ambiente tecnológico aprovado → preservação das cores do ícone (cobre, vinho, floresta) → papel/caderno integrado → cenas 3D interativas. A aprovação do ambiente geral não implica aprovação de cada capítulo.
- Laboratórios do Hoje devem usar modelos verificáveis, acompanhar tema e funcionar com controles acessíveis. Travamentos são uma queixa real recorrente, registrada até #241.
- Preservar ações funcionais, estados de erro/vazio/carregamento, persistência e navegação; protótipos estáticos não substituem telas produtivas.
- Repositório público: não publicar apostilas licenciadas, resoluções copiadas ou dados pessoais das marcas d'água. Conferência OCR dos recortes é obrigatória.
- A regra registrada de desenvolvimento é `main`, com lint e testes antes de push. Esta rodada não fez commit nem push.

## Inventário confirmado

| Item | Estado verificado |
| --- | --- |
| Questões locais | 2.887 |
| Fuvest 2025 com enunciado de marcador | 90; exigem leitura da imagem original |
| Capítulos do catálogo interativo | 613 |
| Capítulos do corpus de resumos profundos | 612; todos com cinco seções nesta versão |
| Resumos com revisão editorial 2 | 435 |
| Resumos ainda na revisão 1 | 177 |
| Representações primárias | 10 experimentos, 43 pranchas, 329 instrumentos, 231 cenas |
| Lacunas de representação no resolvedor | 0 |
| Qualidade no inventário rastreado | 534 não revisados, 79 em validação, 0 aprovados |

Os 177 resumos restantes pertencem a Entendimento de Texto (12), Gramática (26), Literatura (37), Língua Inglesa (17), Redação (58) e Sociologia (27). Revisão 2 é o marcador editorial, não uma certificação independente de que cada seção satisfaz toda a régua.

O inventário de qualidade pode estar atrasado em relação a aprovações pontuais. Seus zeros significam ausência de registro formal de aprovação nesse inventário, não rejeição de todo o aplicativo pela responsável.

## Achados prioritários

### 1. Dados de demonstração podem ser persistidos como domínio de uma conta nova

`src/lib/userData.ts`, `getUserMastery`, grava `mockMastery` quando não encontra documento. `updateUserMastery` também parte dessa base quando o documento não existe. O conjunto contém níveis como 85%, datas relativas e sinais de erro predefinidos. Depois de uma leitura bem-sucedida, `useUserMastery` considera os dados persistidos, embora sua origem possa ter sido esse conjunto de demonstração.

Isso prejudica a interpretação de domínio, recomendações e evolução para um usuário novo. Recomenda-se uma base sem evidência, diagnóstico inicial e origem explícita para importações. Histórico existente deve ser preservado; não zerar uma conta real nem apagar registros automaticamente. Antes de corrigir, distinguir dados de exemplo de avaliações deliberadamente cadastradas.

### 2. Qualidade das cenas continua desigual

Amostras de calorimetria e função quadrática exibem fenômeno e controles específicos. Nietzsche ainda abre `MovimentoDialetico`, com dois círculos e um botão “Completar o movimento”; a auditoria de 26/09 já apontava que essa família pode impor uma lógica inadequada ao capítulo. A implementação atual confirma que esse problema não foi inteiramente resolvido. Prioridade: revisar Filosofia/Sociologia e capítulos classificados para redesenho, sem tratar a contagem de cobertura como aprovação.

O shell do app está mais consistente: papel quente, identidade própria, barra superior/lateral integrada, personalização e cenas 3D. Há diferença de densidade e acabamento entre experiências antigas e novas. A rota visual mantém seus três modos e diagnóstico; esta auditoria não certifica avaliação automática ou gravação real.

### 3. Custo de carregamento ainda alto

Build local: chunk inicial `index` de 3.801,04 kB (1.122,26 kB gzip); Visual de 2.320,14 kB (629,63 kB gzip); cena 3D de 583,48 kB (147,81 kB gzip). São medidas dos artefatos, não tempos medidos no iPad. As rotas já usam lazy loading, mas dados e dependências continuam pesados. Recomenda-se separar catálogos e cenas por necessidade, medir primeiro acesso e troca de telas no aparelho real e manter redução de efeitos.

#241 corrigiu recompilações de shaders e trabalho desnecessário no Hoje. Os números “antes/depois” do doc 59 são evidência histórica; não foram reproduzidos integralmente nesta auditoria. A correção não elimina, por si, custo de primeiro carregamento ou toda travada no aparelho.

### 4. Dependências precisam de triagem

`npm audit --omit=dev` retornou 12 ocorrências: 6 altas e 6 moderadas, sem críticas. Inclui `undici`, cadeia de Firebase/Firestore/gRPC e Firebase Admin/Storage/uuid. A contagem agrega pacotes e propagação de avisos; não significa 12 falhas independentes exploráveis. Algumas sugestões automáticas propõem regressão de versão principal do Firebase. Atualizar com revisão de compatibilidade e testes, sem aplicar `audit fix --force` indiscriminadamente. Não foi demonstrada exploração no aplicativo.

### 5. Conteúdo incompleto e contexto contraditório

Ainda faltam 177 aprofundamentos e 90 enunciados textuais de Fuvest 2025. As imagens originais mitigam o acesso às questões, mas não oferecem a mesma busca, leitura acessível e experiência textual.

`CLAUDE.md` conserva contagens antigas (27 pranchas/39 capítulos e escopo restrito às ciências) que não descrevem o resolvedor atual. `CRIVO-CONTINUIDADE.md` contém filas de retomada históricas já superadas. Registros mais recentes mostram expansão às demais matérias, mudança visual e laboratórios nas doze abas. As regras de preservação continuam úteis, mas o estado deve vir do código, matriz e data da decisão. Não retomar filas antigas mecanicamente.

## Troca de conta: três camadas diferentes

1. Conta ChatGPT/Codex: histórico e permissões das ferramentas; o histórico antigo não foi importado por esta análise.
2. Conta Firebase/Google do Crivo: dados em `users/{uid}/...`; mudar de conta no ChatGPT não migra nem apaga esses documentos. Entrar no aplicativo com outro Google pode mostrar outro histórico.
3. Navegador/aparelho: localStorage de preferências, onboarding, rascunhos e parte do progresso. Trocar aparelho ou limpar dados pode afetar essa camada independentemente da conta Google.

A conexão atual tem acesso ao repositório correto. Nenhum dado pessoal de estudo foi migrado, sobrescrito ou excluído nesta rodada.

## Validação técnica

- `npm run lint`: aprovado.
- `npm run build`: aprovado, com aviso de chunks grandes.
- Testes Node: 776 aprovados, zero falhas.
- Testes Vitest: 758 aprovados em 140 arquivos, zero falhas. `npm test` completo aprovado (1.534 testes). O jsdom emitiu dois avisos de `scrollTo` não implementado, sem falhar testes.
- GitHub: CI do último commit funcional aprovado; status Vercel desse commit `success`. Isso confirma o resultado da integração, não todas as funcionalidades autenticadas.

## Ordem recomendada

1. Verificar acesso ao progresso real com a mesma conta Google do Crivo e corrigir a origem dos dados de contas novas.
2. Tratar dependências com avisos altos e medir desempenho no iPad, preservando as correções de shaders.
3. Revisar qualidade visual por capítulo, começando pelos casos já comprovadamente genéricos/inadequados; registrar sua aprovação.
4. Completar aprofundamentos e enunciados textuais.
5. Consolidar contexto atual, distinguindo regras vigentes de decisões históricas e pendências concluídas.

Nenhuma nova interface, migração, atualização de dependência ou publicação foi realizada como parte desta análise.
