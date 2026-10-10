# Lote espacial de 20 capítulos — 10/10/2026

Base conferida em `origin/main`: `3ad19a37`, posterior às integrações das PRs #300 e #301, ambas com CI aprovado. Esta entrega adiciona **20 capítulos distintos**, somando **37 IDs atendidos** nestas três entregas. Modelos calculados em coordenadas tridimensionais e projetados em SVG, com rotação por mouse/toque, setas e Home; movimento responde a parâmetros e as demonstrações são finitas.

## Capítulos

| Matéria | Capítulo | ID |
| --- | --- | --- |
| Biologia | Composição Química Celular: Compostos Inorgânicos | `summary-biologia-composicao-quimica-celular-compostos-inorganicos` |
| Biologia | Núcleo Celular | `summary-biologia-nucleo-celular` |
| Física | Grandezas Físicas e Operações com Vetores | `summary-fisica-grandezas-fisicas-e-operacoes-com-vetores` |
| Física | Velocidade Vetorial | `summary-fisica-velocidade-vetorial` |
| Física | Composição de Movimentos | `summary-fisica-composicao-de-movimentos` |
| Física | Força Elétrica: Lei de Coulomb | `summary-fisica-forca-eletrica-lei-de-coulomb` |
| Física | Campo Elétrico | `summary-fisica-campo-eletrico` |
| Física | Energia Potencial e Potencial Elétrico | `summary-fisica-energia-potencial-e-potencial-eletrico` |
| Física | Campo Elétrico Uniforme: Abordagem Escalar e Abordagem Vetorial | `summary-fisica-campo-eletrico-uniforme-abordagem-escalar-e-abordagem-vetorial` |
| Física | Dinâmica das Cargas Elétricas | `summary-fisica-dinamica-das-cargas-eletricas` |
| Química | Interações Intermoleculares | `summary-quimica-interacoes-intermoleculares` |
| Química | Introdução à Química Orgânica | `summary-quimica-introducao-a-quimica-organica` |
| Química | Nomenclatura de Compostos Orgânicos | `summary-quimica-nomenclatura-de-compostos-organicos` |
| Química | Nomenclatura de Compostos Orgânicos Oxigenados e Nitrogenados | `summary-quimica-nomenclatura-de-compostos-organicos-oxigenados-e-nitrogenados` |
| Química | Reconhecimento de Funções Orgânicas e Algumas de suas Propriedades | `summary-quimica-reconhecimento-de-funcoes-organicas-e-algumas-de-suas-propriedades` |
| Química | Interpretando Reações Orgânicas | `summary-quimica-interpretando-reacoes-organicas` |
| Química | Reações de Substituição | `summary-quimica-reacoes-de-substituicao` |
| Química | Reações de Oxidação em Hidrocarbonetos | `summary-quimica-reacoes-de-oxidacao-em-hidrocarbonetos` |
| Química | Álcoois | `summary-quimica-alcoois` |
| Química | Polímeros | `summary-quimica-polimeros` |

## Como a interação acompanha o conteúdo

- Física: os cinco instrumentos eletrostáticos e três de vetores mantêm seus controles nativos. A nova câmera preserva o valor físico; mudar o parâmetro principal atualiza o modelo e reinicia o percurso quando há tempo. Campo radial, superfícies equipotenciais esféricas, placas/equipotenciais planas, força entre cargas e aceleração são representações distintas. Os exemplos vetoriais permanecem no plano físico z = 0; girar a vista não inventa uma componente.
- Química: moléculas com conectividade e ordens de ligação próprias. H ligados a C são implícitos; O−H e N−H são explícitos. Os exemplos de álcool primário/secundário/terciário permitem contar os vizinhos do carbono da hidroxila. Reações comparam dois estados estáveis, sem inventar um estado intermediário ou prometer simulação de cinética. O polietileno é um fragmento com continuação nas bordas.
- Biologia: água preserva a geometria angular e distingue ligação covalente da interação entre moléculas. O colar de nucleossomos mantém o número de histonas e os segmentos de DNA ao mudar a organização; não representa toda a arquitetura nuclear nem uma fibra universal de cromatina.

Os controles do laboratório molecular exploram exemplos próprios e independentes do diagrama anterior; não alteram respostas, diagnóstico ou evidências de estudo. Os 12 suplementos moleculares aparecem somente em Explorar. A integração usa IDs exatos e carregamento tardio; mantém a cena autoral original e seus conceitos.

## Design & Motion Kit e ferramentas

Nesta etapa o plugin **Design & Motion Kit (`created-by-me-remote`, versão 1.0.0)** foi encontrado no cache local e usado por sua skill `awesome-design-md`. Foram consultados o catálogo, a referência editorial `claude/DESIGN.md` e o guia Fancy. A referência ajuda a avaliar papel quente, hierarquia serifada e superfícies legíveis; os tokens de cor, fontes e componentes existentes do CRIVO foram preservados. Não se incorporaram marcas, fontes proprietárias nem componentes ornamentais. O movimento funcional utiliza o controle finito existente com `motion/react`, acessível em movimento reduzido. Nenhuma biblioteca extra foi instalada e nenhum código upstream foi copiado.

GitHub conferiu as integrações e o CI. Playwright executa a matriz no Chrome real; Chrome DevTools/ECC inspecionou o modelo de Alcoois aberto no celular, em modo snapshot do Lighthouse. A avaliação visual usa o contrato de `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`.

## Validação

Resultados finais e capturas em `validacao.json`, `ui-batches-summary.json` e `captures/`; capturador em `capturar.cjs`. Executar contra o build em preview na porta 3008, com Chrome e dependências locais. A matriz deste lote compreende **240 casos**: 20 capítulos × 360/834/1440 px × claro/escuro × movimento reduzido/normal. Verifica teclado/restauração, arraste de mouse, toque, exemplos/controles, reprodução/pausa, tamanho dos controles, overflow, IDs de SVG e erros do navegador.

Os testes de lógica conferem fórmulas/valências, quantidade de C nas reações, graus dos álcoois, ângulos da água, segmentos de cromatina, leis de distância, aceleração e composição vetorial. Testes de interface confirmam que câmera e fenômeno são independentes, que casos mudam a leitura e que um campo novo reinicia o percurso. A suíte de interface é executada em lotes com um worker para a memória disponível.

## Continuidade integral

`continuidade-613.csv` lista todos os capítulos, matéria, status editorial e ação restante. Os 576 não atendidos por estas entregas estão como **a confrontar**, não como 576 lacunas confirmadas: alguns já têm outras operações próprias e precisam de avaliação por conteúdo. A prioridade seguinte deve combinar necessidade de desenho, geometria do fenômeno, mecanismo existente e fidelidade ao resumo. A triagem lexical anterior de 95 candidatos continua sendo preliminar.

Nenhum status editorial foi promovido. Primeira passagem pedagógica e revisão visual integral seguem sendo trabalhos separados da cobertura técnica. Esta entrega não afirma que todos os 613 capítulos foram convertidos em modelos 3D nem revisados manualmente. Nenhum PDF, extração ou novo conteúdo licenciado foi publicado.

## Resultado observado neste build

Lint e build aprovados; **973/973 testes de lógica** e **1553/1553 testes de interface**, em 189 arquivos e 24 lotes, sem falhas na validação final. Fila visual íntegra com 613 IDs. **240/240 verificações de navegador aprovadas**, sem erros de página, overflow, controles menores que 44 px, IDs SVG duplicados ou animações infinitas. Dez capturas representativas foram incluídas; os nomes de todas as capturas estão no resultado reproduzível.

O lote 24 inicialmente falhou por capturas históricas ausentes no checkout esparso. Os arquivos versionados foram restaurados dos blobs de HEAD, sem alterar testes, e o lote foi repetido. A tentativa original foi preservada localmente e a revalidação consta no resumo.

Lighthouse em snapshot do modelo de Álcoois aberto no celular: acessibilidade 100 e boas práticas 100; SEO 60 e Agent 50. Estes escores pertencem a essa página/configuração, não equivalem à auditoria Lighthouse de todos os capítulos.

A inspeção preliminar levou à ampliação do enquadramento molecular e à orientação das águas para evitar sobreposição. Os casos afetados foram repetidos no build final; as evidências anteriores permanecem no diretório local de auditoria.

## Continuidade verificada pelo CI

A primeira execução do CI da PR #302 aprovou lint, testes e build, mas o roteiro de História/Geografia encontrou o controle de latitude ainda em 20° depois de Home. A falha foi reproduzida localmente. O suplemento novo e o experimento existente reutilizavam a mesma chave React no fragmento: a reconciliação podia remontar o experimento e descartar seus parâmetros. A chave do suplemento passou a ter prefixo próprio. Um teste de integração verifica parâmetros e câmera depois de atualizar o artefato, além da ausência de erros React. A tentativa intermediária de tratar Home/End nos controles foi descartada; eles conservam sua semântica nativa. O roteiro confirma foco e envia as teclas pelo próprio controle, mantendo as asserções de mínimo/máximo. Esta correção não altera os 20 novos modelos nem promove revisão editorial.

Após a correção: lint e build aprovados; 39/39 testes nos quatro arquivos de integração afetados. Coordenadas Geográficas passou no roteiro real de História/Geografia em **12/12 perfis** (390, 834 e 1366 px; claro/escuro; movimento reduzido/normal). Evidência local: `C:/crivo-audit-evidence-20261010/coordenadas-reconciliation`. A execução integral dos demais capítulos pertence ao CI desta revisão.
