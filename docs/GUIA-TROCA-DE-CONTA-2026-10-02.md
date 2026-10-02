# CRIVO — guia para continuar em outra conta
Registro de 2 de outubro de 2026. Repositório: https://github.com/anajumorandii-eng/My-App

## 1. Como retomar
1. Conecte o GitHub à nova conta com acesso ao repositório e permissão para criar branches e PRs. Não copie tokens ou códigos de autorização da conversa antiga.
2. Abra o repositório My-App no Codex. Se existir um checkout, confira alterações locais antes de trocar de branch. Arquivos de /workspace e /tmp desta sessão podem não acompanhar a troca.
3. Cole o texto da seção 2 e forneça o link deste guia. As conversas privadas da conta antiga não ficam acessíveis automaticamente.
4. Leia este guia, CLAUDE.md, docs/CRIVO-CONTINUIDADE.md e docs/visual/PADRAO-VISUAL-OBRIGATORIO.md. Confira também as referências aprovadas em docs/visual-personalizado/referencias-aprovadas/.
5. Consulte o estado real da main, das PRs e dos checks no GitHub. Trabalhe somente no que mudou ou continua pendente; não refaça a auditoria inteira.
6. Comece pelo próximo lote de Biologia e Química da seção 6, após verificar as associações atuais dos capítulos.

Trocar a conta do ChatGPT/Codex não transfere nem apaga automaticamente o progresso do CRIVO. Para manter o mesmo histórico do aplicativo, use a mesma conta Google/Firebase do CRIVO e, para os dados locais, o mesmo navegador. A autorização antiga para consultar o histórico não fornece credenciais à nova sessão.

## 2. Texto para copiar na nova conta
> Continue o desenvolvimento do CRIVO no repositório anajumorandii-eng/My-App. Leia docs/GUIA-TROCA-DE-CONTA-2026-10-02.md, CLAUDE.md, docs/CRIVO-CONTINUIDADE.md e o padrão visual obrigatório. Confira o estado atual do GitHub antes de agir: as PRs #242, #243, #244 e #245 já foram incorporadas até o registro deste guia. Não repita essas correções.
>
> Quero lotes maiores e coerentes, com revisão científica, visual e funcional. Comece verificando os seis casos de Biologia/Química descritos no guia. Autorizo trabalhar em branches, publicar as alterações e abrir PR automaticamente. Não faça merge automaticamente. Não me peça novamente autorização para essas ações já autorizadas.
>
> Preserve meu histórico real, o isolamento por usuário e as chaves de persistência. Meu pouco progresso é normal porque estou começando; não zere nem recalcule meu histórico para “corrigir” isso. Autorizo a consulta do meu histórico do CRIVO quando houver acesso autenticado disponível; essa autorização não permite publicar dados privados nem fazer alterações destrutivas.
>
> Siga as referências visuais aprovadas, mantenha português brasileiro, acessibilidade, responsividade, temas claro/escuro e movimento reduzido. Cada desenho deve representar corretamente o mecanismo e concordar com seus números em todos os estados relevantes. Validação técnica não é aprovação editorial. Teste, registre evidências e limitações, confira os checks e entregue o link da PR. Não inclua credenciais, dados pessoais, PDFs licenciados ou identificadores de modelos nos artefatos públicos.

## 3. Estado confirmado na saída
- PR #245: https://github.com/anajumorandii-eng/My-App/pull/245 — incorporada em 02/10/2026 às 18:56:39 UTC, confirmado pela API do GitHub.
- Commit funcional dessa PR: 1ef353e2f88023d4c94457ae95dd074116f57043.
- Antes do merge, os checks de CI, verificação visual/build e Vercel passaram.
- O checkout desta sessão ainda estava na branch fix/matematica-probabilidades-sequencias. Não confundir esse checkout com o HEAD mais recente da main.
- docs/CONTINUIDADE-ESTADO.json é gerado por automação e pode apontar para um estado anterior. Use GitHub e os commits efetivos para resolver divergências.
- O acesso da CLI ao GitHub apresentou erro 401 no fim da sessão. A nova conta precisa de sua própria conexão; não reutilizar segredos antigos.

## 4. O que foi feito
Os documentos abaixo contêm detalhes, limites e evidências. Seus números descrevem a data da revisão, não necessariamente o estado futuro.

| Etapa | Resultado e referência |
| --- | --- |
| Auditoria inicial | Inspeção do repositório, telas, contratos e decisões. [Análise geral](ANALISE-GERAL-2026-10-01.md). Não recuperamos as conversas privadas da antiga conta. |
| Progresso e carregamento | Conta nova inicia sem domínio fictício; isolamento por UID, proteção contra leitura falha e preservação de histórico existente. Busca global carrega o corpus sob demanda. Bundle principal caiu de cerca de 3.801 KB para 66 KB naquele build. [Relatório](RETOMADA-PROGRESSO-CARREGAMENTO-2026-10-01.md). |
| Histórico real | Consulta autorizada, sem publicar dados privados. A usuária confirmou que os poucos registros refletem o início dos estudos. Não há motivo para apagar ou reconstruir o histórico. |
| Dependências | Atualizações dentro das versões principais, ajustes específicos de dependências transitivas e verificação com emuladores. npm audit passou de 12 para zero vulnerabilidades conhecidas em 01/10; conferir novamente quando necessário. [Relatório](ATUALIZACAO-DEPENDENCIAS-2026-10-01.md). |
| Conteúdo FUVEST e ciências | Restaurados 90 enunciados FUVEST 2025 V1; 88 alternativas textuais e duas questões com alternativas gráficas preservadas na página original. Gabaritos mantidos, outras 2.797 questões preservadas. Osmose e lentes revisadas. [Relatório](REVISAO-CONTEUDO-CIENCIAS-2026-10-01.md). |
| Auditoria visual integral | 613 capítulos em 3.678 configurações e 28 telas em 224 configurações. Classificação original: 315 preservar, 170 ajustar, 128 redesenhar. Esses números não são a contagem atual de pendências. [Relatório](REVISAO-VISUAL-INTEGRAL-2026-10-02.md). |
| Primeiro lote | Reflexão plana, refração, Personalizar no celular e contenção/restauração de foco da busca. [Evidências](visual-integral-2026-10-02/primeiro-lote/README.md). |
| Falha da main | Corrigida a instalação limpa com npm 10 e o seletor do override de gaxios; versões do lockfile preservadas. Commit b3d70189, CI validada. |
| PR #242, incorporada | Espelho côncavo com relações de Gauss e raios coerentes; miopia/hipermetropia e lentes corretivas. [Evidências](visual-integral-2026-10-02/segundo-lote/README.md). |
| PR #243, incorporada | Interseção real dos sistemas e paralelogramo orientado dos determinantes, incluindo estado singular. [Evidências](visual-integral-2026-10-02/terceiro-lote/README.md). |
| PR #244, incorporada | Onze capítulos de geometria, áreas e física: transversal, triângulos, arcos, homotetia, relações métricas, polígonos regulares, círculos, razões de áreas, terreno composto, carga em campo magnético e trabalho de gases. [Evidências](visual-integral-2026-10-02/quarto-lote/README.md). |
| PR #245, incorporada | Treze capítulos de matemática e controles acessíveis de cinco telas. [Evidências](visual-integral-2026-10-02/quinto-lote/README.md). |

Links: [PR242](https://github.com/anajumorandii-eng/My-App/pull/242), [PR243](https://github.com/anajumorandii-eng/My-App/pull/243), [PR244](https://github.com/anajumorandii-eng/My-App/pull/244), [PR245](https://github.com/anajumorandii-eng/My-App/pull/245).

### Detalhamento do último lote
- Grupo: números acompanham as pessoas.
- Probabilidades: dez resultados equiprováveis, contagens reais de conjuntos, união/interseção e contenção correta no extremo.
- Eventos disjuntos/independentes: ausência de interseção no estado disjunto e leitura qualitativa explícita para independência.
- Trigonometria em polígonos: vértices sobre a circunferência; outras razões: triângulo acompanha o ângulo.
- Universo tridimensional: paralelas, concorrentes e reversas com representações coerentes.
- Cônicas: cone duplo e cortes coerentes; representação é seção meridional/orientação, sem alegar uma interseção tridimensional completa.
- Bijeções: destinos reais das imagens.
- PA: extremos dentro da cena; PG: escala comum sem saturação, sinais alternados e razão zero válida.
- Circunferência analítica, distância ponto/reta e números complexos: notas e nomes sem conflitos. Cabeçalho mantém altura durante arraste e passagem por zero.
- Podcast, Treino de segunda fase, Tutor, Redação e Administração: nomes acessíveis dos controles; Administração sem estouro da coluna no celular.

Validação final do código: 1.652 testes passaram (787 Node + 865 Vitest), TypeScript e build de produção passaram. A matriz de navegador cobriu dez configurações de tamanho/tema/movimento, 440 visitas a estados matemáticos e 50 aberturas de telas, com verificações dirigidas adicionais de notas, margens, arrastes e teclado. Foram registrados 66 screenshots. Os 13 cenários de navegador passaram em grupos separados. As verificações de acessibilidade automatizadas focaram nomes de botões/seletores; não representam certificação WCAG completa. A revisão visual remota do preview protegido não foi comprovada; as verificações visuais foram feitas no build local.

## 5. Instruções e exigências duráveis
- O produto é CRIVO, voltado aos estudos de vestibulares de Medicina, incluindo FUVEST, Unicamp, Unesp, Famerp, Unifesp e ENEM. Linguagem em português brasileiro.
- A usuária pediu revisão integral e mais trabalho por passo. Organizar lotes maiores por mecanismo/área, com verificação suficiente, sem pedir confirmação repetidamente para o escopo autorizado.
- Branches e abertura automática de PR estão autorizadas. Não fazer merge automático. Essa orientação atual prevalece sobre instruções antigas de publicar somente na main.
- A cena precisa explicar o assunto do capítulo. Recolorir ou renomear um desenho genérico não resolve uma associação incorreta.
- Geometria, valores, fórmulas, unidades, sinais e controles devem concordar nos estados inicial, mínimo, máximo e degenerado.
- Seguir o contrato visual: papel editorial no claro, quadro no escuro, hierarquia legível e anotações úteis. SVG autoral para a cena; 3D quando tiver função explicativa.
- Movimento deve mostrar causalidade. Com movimento reduzido, o mecanismo precisa continuar completo e compreensível.
- Preservar Explorar/Testar/Reconstruir, diagnóstico e evidências no Caderno de Erros; permitir teclado e alternativa ao arraste.
- Conferir celular 360/390, tablet e desktop, claro/escuro, foco, nomes acessíveis e ausência de estouro horizontal.
- Não promover capítulos a “aprovados” apenas porque possuem cena ou testes. Inventário técnico e aprovação editorial são distintos.
- Preservar dados por UID e chaves locais, especialmente juju_summary_progress_v1, juju_summary_mode, juju_onboarding, juju-essay-theme, juju-essay-draft e juju-essay-rewrite.
- Não inventar enunciados, opções, gabaritos ou evidências para preencher lacunas. Não encurtar resumos fora das regras do repositório.
- Resumos profundos seguem cinco etapas: intuição, conceito, aplicação, estratégia e exercício; padrão de 900–1.100 caracteres por seção e validações existentes. Incrementar revisão somente dos capítulos alterados. Recontar o corpus atual antes de editar em massa.
- Repositório público: não publicar histórico privado, credenciais, dados pessoais, PDFs licenciados, textos extraídos ou resoluções copiadas. Novas explicações devem ser autorais.
- Novas imagens de questões exigem a conferência de marca-d’água prevista em scripts/conferir-marca-dagua.py, com prova real; não substituir por uma falsa aprovação de OCR.
- Não incluir identificadores de modelos em commits, PRs, código ou documentação.

## 6. Próximo lote recomendado: Biologia e Química
Fonte: [revisão da área](visual-integral-2026-10-02/bio-quimica.md). Estes são achados da auditoria; confirmar o código atual antes de implementar.

1. **Segunda Lei de Mendel e Interação Gênica:** representar a interação dos loci e a via de pigmentação que produz 9:7. O Punnett genérico 3:1/9:3:3:1 não explica esse capítulo.
2. **Sangue e Imunologia:** explicar imunidade, vacina e soro, distinguindo produção própria de anticorpos/memória e anticorpos prontos. ABO isolado é insuficiente.
3. **Termoquímica II:** conferir a associação; Hess pertence à primeira parte. Mostrar entropia, Gibbs, temperatura e espontaneidade com relações e sinais corretos.
4. **Carboidratos e Lipídios:** incluir uma representação fiel dos lipídios e sua função, ou explicitar honestamente o recorte da cena.
5. **Interpretando Reações Orgânicas:** corrigir o recorte do rótulo Br e conferir todos os limites/âncoras dos textos.
6. **Segunda Lei de Mendel:** estado inicial diíbrido com 9:3:3:1 e seleção coerente, preservando os outros mecanismos onde forem adequados.

Passos do lote:
- Mapear capítulo → instrumento/registro → mecanismo antes de editar. Inspecionar MendelBoard, BloodTypeBoard, ThermochemBoard, BiologiaFenomenos e QuimicaOrganica; os nomes podem mudar.
- Definir exemplos autorais, estados e critérios científicos. Não transplantar um diagrama sem verificar sua pertinência.
- Implementar o lote em branch a partir da main atual, preservando alterações locais.
- Testar lógica significativa, estados extremos, acessibilidade e aparência real; registrar screenshots e limites.
- Revisar associações, números e cenas; publicar e abrir PR automaticamente, verificar os checks, sem merge automático.

## 7. Fila seguinte
### Física
Rever Lenz na aproximação/afastamento, frentes de onda do Doppler e caminhos ópticos do telescópio de duas lentes. Conferir fabricante de lentes com movimento reduzido e vetores/sentidos de eletricidade e magnetismo. Fonte: visual-integral-2026-10-02/fisica.md. Não repetir os mecanismos já corrigidos nos cinco lotes.

### Telas
Conferir estouro de Independência do Brasil no celular e pequeno estouro de Competências da Redação. Rever contraste de textos/ações em Agenda, Hoje/Sessão, Recuperação e Erros; medir o estado atual antes de alterar tokens. Rever microtextos de Colonização/Mineração e rótulos de Literatura. Busca, Personalizar e controles do último lote já receberam correções.

### Adequação pedagógica das cenas
Conferir exemplos reais nos capítulos de Inglês; mecanismo e assunto divergiam em Hurricanes/Stem Cells, Global Warming/Probiotics, Digital Technology e Taxonomy. Filosofia requer diálogo/aporia, genealogia, transformação dialética e relações contextuais próprias dos assuntos. Redação/Literatura precisam de textos trabalhados, relações e exemplos concretos; COP30 precisa de atores, decisões e limites pertinentes.

### Conteúdo e integração
A auditoria de 01/10 identificou 177 resumos ainda em revisão editorial 1: Entendimento de Texto 12, Gramática 26, Literatura 37, Inglês 17, Redação 58 e Sociologia 27. Recontar antes de agir. Não repetir a recuperação das 90 questões FUVEST. Fluxos pedagógicos completos, persistência autenticada e desempenho real em iPad ainda precisam de verificações específicas.

## 8. Rotina de desenvolvimento e validação
1. Conferir status local, main, PRs e diferença desde o último commit conhecido.
2. Ler as instruções aplicáveis e definir critérios concretos do lote.
3. Usar instalação pelo lockfile, preferencialmente Node 22; não atualizar dependências sem uma necessidade identificada.
4. Executar npm run lint, npm test e build de produção conforme as regras e a mudança. Verificações antigas são evidência histórica, não garantia do novo código.
5. Na sessão anterior havia Chromium em /usr/bin/chromium. Detectar o navegador da nova máquina; não instalar um segundo navegador sem necessidade.
6. Não executar o compilador TypeScript simultaneamente à matriz de navegador nesta máquina limitada: houve falta de memória e encerramento de processo. Estabilizar o código antes de repetir a suíte completa.
7. Conferir erros de console, assets, limites SVG, estados reais, temas, movimento reduzido, teclado e arraste.
8. Executar a matriz visual exigida, git diff --check e revisão adequada. Relatar com precisão verificações dirigidas e limites.
9. Registrar evidências no Git, atualizar continuidade, publicar branch e PR, verificar os checks no commit efetivo.
10. Não declarar aprovação integral com base apenas em screenshots ou testes automáticos.

## 9. O que não foi comprovado
Não houve recuperação integral das conversas da conta antiga. A auditoria ampla não certifica todas as animações, interações pedagógicas, conteúdo autenticado nem aprovação editorial dos 613 capítulos. A galeria completa e logs em /tmp podem desaparecer; os relatórios e screenshots selecionados no Git são as evidências portáveis. Para uma nova sessão, use os documentos versionados e confira o produto atual.

Este guia registra fatos até a saída da sessão. Se o GitHub ou a usuária trouxer informações posteriores, elas prevalecem.
