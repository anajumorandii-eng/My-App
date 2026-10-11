# Refinamento profissional da experiência Visual — CRIVO

Refinamento transversal da experiência dos 613 capítulos: a cena conduz à leitura e ao desafio real do capítulo, e a exploração espacial reúne manipulação, resultado e comparação no mesmo painel. A direção editorial existente — Newsreader, Inter, papel, vinho e cores por disciplina — continua sendo a base.

## Mudanças

- A cena oferece **Entender esta etapa** e **Responder ao desafio**. A leitura recebe foco; o desafio usa a pergunta de recuperação já cadastrada e oculta os materiais de consulta.
- Selecionar um conceito na cena ou no mapa atualiza a etapa da leitura e o título do painel de integração. A leitura também acompanha mudanças externas de etapa.
- Os laboratórios que usam `SpatialLabFrame` agrupam parâmetros e explicação em **Manipule e observe**. Câmera, inclinação e restauração ficam em **Ajustar ponto de vista**, aberto inicialmente e recolhível sem remontar o modelo.
- **Guardar para comparar** captura a figura, a câmera e a leitura daquele instante. Alterar parâmetros ou a câmera do modelo atual conserva a referência. Ela pode ser atualizada ou removida sem reiniciar o modelo. A referência é uma imagem estática, com leitura textual equivalente, e não cria controles duplicados no teclado.
- Limpar a comparação restaura o foco no botão disponível; uma mensagem discreta informa o estado da comparação aos leitores de tela.
- Colunas e títulos com largura intrínseca passam a caber em telas pequenas. A validação encontrou esse problema em capítulos de Biologia; a correção é estrutural, permitindo quebra de texto sem esconder conteúdo.

Os 588 capítulos com suplemento espacial recebem o painel compartilhado. Os 25 com representações próprias conservam seus modelos e controles específicos e recebem a integração comum entre cena, leitura e desafio. A mudança atua na experiência compartilhada e preserva os roteiros e modelos específicos existentes.

## Plugins e skills

Foram considerados os plugins solicitados de Design de Interfaces, Design & Motion Kit, Frontend, Qualidade, UI UX Pro Max e Criação Visual. A inspeção do React, SVG, Motion e do sistema visual existente orientou a seleção:

- **Design de Interfaces / accessibility**: semântica, foco, alternativas por teclado, alvos de toque e reflow.
- **Design & Motion Kit / awesome-design-md**: referência Notion para hierarquia, legibilidade, agrupamento de controles e superfícies editoriais. Adaptação às fontes, cores, dimensões e identidade do CRIVO; nenhuma biblioteca de efeitos foi adicionada.
- **Qualidade / verification-before-completion**: testes, compilação, navegador e registros de evidência.
- **Cloud environment / cloud-environment-runtime**: preparação e diagnóstico do ambiente de execução.

Movimento e perspectiva continuam vinculados à compreensão do modelo. A comparação guarda evidências da manipulação; os desafios vêm do conteúdo existente.

## Validação

- **640 testes Vitest**, em 14 arquivos: renderização dos lotes, navegação, integração, câmera, parâmetros, referência estática e matriz de cobertura.
- **60 testes Node**: relações matemáticas e científicas, conservação, geometria finita e limites das vistas.
- TypeScript e build de produção verificados. O build mantém avisos existentes sobre tamanho de bundles e mistura de imports estáticos/dinâmicos.
- **613/613 capítulos no Chromium**, sem falhas, com verificações em 1440, 834, 390 e 360 pixels: teclado, comparação quando disponível, foco na leitura e entrada no desafio.
- Chromium: desktop 1440 × 1000, iPad emulado 834 × 1112, móvel 390 × 844 e tela pequena 360 × 800; temas claro/escuro e movimento reduzido.
- WebKit com perfil iPad Pro 11: retrato 834 × 1112, paisagem 1194 × 834 e móvel 390 × 844. Comparação, teclado, foco na leitura e passagem ao desafio verificadas. Trata-se de emulação, sem teste em aparelho físico.
- axe: nenhuma violação automática nos painéis alterados em 1440, 834 e 390 pixels. Algumas verificações de contraste ficaram inconclusivas; os pares principais de tokens foram conferidos separadamente e têm razão entre **5,01:1 e 14,98:1**. Esses resultados são testes dos painéis alterados, sem declaração de conformidade completa do aplicativo.

Os arquivos JSON e as capturas desta pasta registram os resultados. `catalog-browser-results.json` registra a verificação individual por capítulo em 1440, 834, 390 e 360 pixels, incluindo comparação quando disponível, teclado, foco na leitura e ocultação da cena durante a recuperação.

## Repetir as verificações

Com a versão atual do app servida localmente:

```sh
CRIVO_URL=http://127.0.0.1:3001 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/auditProfessionalVisual.mjs
CRIVO_URL=http://127.0.0.1:3001 CRIVO_BROWSER_EXECUTABLE=/usr/bin/chromium node scripts/checkProfessionalVisualProfiles.mjs
CRIVO_URL=http://127.0.0.1:3001 CRIVO_BROWSER=webkit node scripts/checkProfessionalVisualProfiles.mjs
CRIVO_URL=http://127.0.0.1:3001 PLAYWRIGHT_CHROMIUM_EXECUTABLE_PATH=/usr/bin/chromium node scripts/auditProfessionalVisualAccessibility.mjs
```

Os executáveis podem ser omitidos quando os navegadores Playwright estiverem instalados. O WebKit precisa das bibliotecas de sistema correspondentes; nesta execução elas foram disponibilizadas em uma pasta temporária e usadas por um launcher local, sem alteração do sistema ou dependências do projeto.

## Capturas e resultados

- [Integração entre cena, leitura e desafio — móvel](mobile-light-integracao.png)
- [Comparação do modelo — desktop](desktop-light-comparacao.png)
- [Comparação do modelo — iPad / WebKit](webkit-ipad-dark-comparacao.png)
- [Resultados dos 613 capítulos](catalog-browser-results.json)
- [Resumo das verificações](verification-summary.json)
- [Acessibilidade](accessibility-results.json)
