# Primeiro lote de correções — 02/10/2026

A revisão integral revelou desenhos que contradiziam as próprias leituras e dois problemas nos controles do aplicativo. Este lote corrige quatro achados, preservando a composição existente e os dados de progresso.

| Achado | Resultado |
|---|---|
| Reflexão plana atravessava o espelho e usava a superfície como referência angular | Os dois segmentos permanecem à esquerda do espelho vertical, com ângulos iguais em relação à normal horizontal. Legendas separadas do traçado. |
| Refração invertia a direção tangencial na interface | Incidente acima à esquerda e refratado abaixo à direita; direção tangencial contínua e geometria coerente com `n₁ sen i = n₂ sen r`. Legendas reposicionadas. |
| Personalizar começava em x = −27 px no celular | Até 560 px o painel se posiciona em relação à tela, com margens de 16 px e altura limitada à área disponível. Continua rolável. |
| Tab escapava da busca; Esc e retorno de foco falhavam | Tab/Shift+Tab ficam no diálogo, Esc funciona mesmo após perda de foco e o fechamento devolve o foco à origem. O botão anterior é preservado durante o carregamento tardio do catálogo. |

Além das quatro correções visuais, a publicação revelou incompatibilidade do seletor de override `gaxios@6` com o npm 10 usado no CI/Docker. A regra foi tornada compatível, mantendo as versões do lockfile. A ocorrência e sua reprodução estão registradas no [relatório de dependências](../../ATUALIZACAO-DEPENDENCIAS-2026-10-01.md).

## Verificações

- `npm test`: **782 testes Node + 769 Vitest = 1.551 aprovados**, sem falhas na execução final. Há nove regressões novas: seis combinações de geometria óptica e três verificações de foco.
- `npm run lint` e `npm run build`: aprovados. O build ainda registra avisos de tamanho de chunks; este lote não resolve essa dívida.
- Chromium, diagramas: **48 verificações** — dois capítulos × três valores (inicial/mínimo/máximo) × quatro larguras (360/390/768/1440) × dois temas. Coordenadas reais do SVG confrontadas com reflexão e Snell; zero exceções de página. Registro em [optica.json](optica.json).
- Chromium, build de produção: **nove testes de navegador aprovados**, incluindo personalização e busca nas oito combinações de largura/tema e uma abertura com carregamento do catálogo deliberadamente suspenso. Verificam limites do painel, troca de fundo, Tab/Shift+Tab, consulta, Esc, Ctrl+K e retorno de foco.
- Testes permanentes em `src/views/visual-instruments/OpticsInstrument.test.tsx`, `src/views/visual-boards/BuscaRapida.test.tsx` e `tests/e2e/crivo-visual-regressions.spec.ts`.
- Evidências obtidas sem login, com progresso demonstrativo e movimento reduzido nas capturas. Nenhum histórico pessoal ou credencial integra este lote.

A primeira execução geral apresentou uma falha intermitente do teste de conclusão do cronômetro em Sessao. O teste passou isoladamente, com os 17 testes da tela e na execução final completa. Não houve alteração no cronômetro; acompanhar esse teste no CI. A rodada de navegador no servidor de desenvolvimento apresentou duas esperas malsucedidas; a matriz completa passou na build de produção, incluindo tablet e transição de carregamento.

## Evidências e limites

- Antes: [reflexão plana](../screenshots/reflexao-plana.jpg), [refração](../screenshots/refracao.jpg) e [Personalizar](../screenshots/personalizar-celular.jpg).
- Depois: arquivos `plane-*`, `refraction-*`, `personalizar-*` e `busca-*` desta pasta, em claro/escuro. Os recortes de cena não certificam a página inteira.
- Para repetir os testes de navegador, usar Chromium já instalado e configurar a URL da build servida; o teste de carregamento intercepta tanto o módulo de desenvolvimento quanto seu chunk de produção.
- Ainda pendentes os outros diagramas, contrastes, nomes de controles, transbordamentos e representações genéricas registrados na [revisão integral](../../REVISAO-VISUAL-INTEGRAL-2026-10-02.md). Este lote não aprova editorialmente os 613 capítulos nem altera o inventário histórico da revisão.
