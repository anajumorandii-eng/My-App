# Recuperação da aba Visual após a PR #317

Base: `ed7d7ac1`, após a PR [#317](https://github.com/anajumorandii-eng/My-App/pull/317). Referência de organização: `f707a6fa`, PR #316. A recuperação atua nos componentes compartilhados dos 613 capítulos; preserva os textos, modelos e correções particulares acrescentados pela #317.

## Problema reproduzido

O palco de altura fixa dividia a tela em duas janelas com rolagem interna. Em Concordância, a cena tinha aproximadamente 2.012 px de conteúdo dentro de 274 px a 390 px de largura; a leitura tinha 1.895 px dentro de 299 px. A 834 px, eram 1.752/274 px para a cena e 1.551/299 px para o painel. A navegação escondia os títulos das etapas; a explicação recebia limite de altura e máscara. A troca de camada substituía a representação principal pelo suplemento espacial.

## Correção

- Cena e leitura voltam ao fluxo normal da página, sem os dois painéis de altura fixa.
- Explorar, Testar e Reconstruir voltam ao topo. Os títulos das etapas e o texto da explicação ficam visíveis integralmente.
- A representação do capítulo e o suplemento espacial ficam disponíveis juntos. Comparar painéis e Explorar em foco continuam disponíveis.
- A ponte entre cena, explicação e desafio recupera a ação Entender esta etapa. O desafio continua ligado à sua seção autoral; revisar a explicação preserva resposta e feedback.
- O contrato de etapa continua chegando às pranchas, instrumentos, experimentos e cenas da #317. Seus avanços por disciplina permanecem no código.
- Em telas pequenas, o cabeçalho da cena usa um ícone de 44 px e distribui as duas ações na mesma linha quando há espaço. Mantém as cores, fontes e componentes existentes do CRIVO.
- A CI passa a executar os testes de recuperação e os fluxos de comparação no Chromium.

## Evidências visuais

| Perfil | Antes | Depois |
| --- | --- | --- |
| Desktop 1440 × 900 | [Captura](antes-1440.png) | [Captura](depois-1440.png) |
| Tablet 834 × 900 | [Captura](antes-834.png) | [Captura](depois-834.png) |
| Celular 390 × 900 | [Captura](antes-390.png) | [Captura](depois-390.png) |

[Página completa após a recuperação em 390 px](depois-390-pagina-completa.png). As imagens de viewport mostram o início da página; o restante agora é alcançado pela rolagem da página. A inspeção visual dessas três larguras acompanhou os testes automatizados.

## Validação

TypeScript e build de produção concluídos sem erros. Os testes dirigidos de Visual, percurso, moldura e contrato de etapa passaram: 191 testes em nove arquivos.

A execução ampliada de pranchas, instrumentos e contrato de etapa teve 1.656 testes aprovados e um timeout no registro de instrumentos sob carga simultânea. O arquivo foi repetido isoladamente, sem alterar o teste ou seu limite de tempo: todos os seus 31 testes passaram. Assim, os 1.657 casos distintos foram exercitados com sucesso entre as execuções; a primeira execução ampliada não foi inteiramente verde.

Os sete perfis adicionais registrados em [Chromium](browser-results.json) e [WebKit](webkit-browser-results.json) passaram sem overflow horizontal ou erro de página. Incluem toque, comparação preservada, câmera sem alteração do conteúdo, foco na leitura e consulta removida do modo Testar, em temas claro e escuro, tablet em retrato e paisagem e celular de 360 px.

A auditoria axe em [seis recortes da ponte, leitura e recuperação](challenge-accessibility.json) registrou zero violações e três verificações inconclusivas de contraste em Explorar. Não equivale a uma certificação de acessibilidade da aplicação inteira. O iPad foi emulado no WebKit; não houve teste em um aparelho físico.

A [varredura completa do catálogo](catalog-browser-results.json) terminou com **613 capítulos e zero falhas**. Todos foram exercitados em 1440, 834, 390 e 360 px: quatro medidas por capítulo, 2.452 verificações de largura. A auditoria verifica comparação de condições quando há suplemento, câmera independente da leitura, transferência de foco à explicação, seção autoral do desafio e remoção da consulta no modo Testar. São verificações técnicas desses fluxos, não uma nova revisão integral do conteúdo de cada disciplina.

Os [14 testes finais de interação](e2e-results.txt) passaram, sete no Chromium e sete no WebKit com perfil de iPad. Cobrem três capítulos na recuperação de layout e quatro disciplinas nos fluxos de comparação, câmera, movimento reduzido, foco e preservação de resposta/feedback. A primeira execução, simultânea à auditoria pesada, teve 13 aprovações e uma falha na espera pela pausa de câmera de História no WebKit; uma repetição ainda sob essa carga também falhou. Após a auditoria terminar, a suíte inteira passou em 2,7 minutos, sem modificar os testes ou seus limites de espera. O iPad continua sendo uma emulação, não um aparelho físico.

Para repetir a suíte, servir a build de produção e executar `npx playwright test --config=playwright.visual-recovery.config.ts` com `PLAYWRIGHT_BASE_URL` apontando para o servidor. A CI executa o projeto `desktop`; a validação local desta rodada também executou `ipad-webkit`.

## Recursos efetivamente utilizados

- **Qualidade:** skill `systematic-debugging`, para reproduzir a regressão e comparar as PRs; `verification-before-completion`, para apoiar as conclusões em verificações executadas.
- **Design de Interfaces:** skill `accessibility`, para leitura integral, foco, nomes das etapas, toque e checagem axe.
- Git/GitHub CLI para comparar histórico, preservar alterações por disciplina e publicar a correção.
- TypeScript, Vite/esbuild, Vitest, Testing Library, Playwright com Chromium e WebKit e axe-core já presentes no projeto.
- Scripts existentes de auditoria do catálogo e perfis responsivos; novos testes de regressão e capturas reais do navegador.

Não foram adicionadas dependências à aplicação ou efeitos visuais. A seleção partiu da regressão observada no código. As bibliotecas de sistema necessárias ao WebKit foram preparadas somente no ambiente de teste.
