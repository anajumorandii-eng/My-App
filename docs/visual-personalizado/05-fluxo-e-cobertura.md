# Fluxo de estudo e cobertura — 15/09/2026

Pedido: tornar os movimentos coerentes com o fluxo e estender o percurso a todas as matérias e tópicos.

## Decisões

- A ação da estudante inicia a mudança. Removidos os loops de elétron, fóton e pulsação, os vetores desalinhados sobre imagens e os deslocamentos do atlas inteiro na seleção.
- Explorar apresenta a prancha existente e o percurso do capítulo. Cada etapa conserva título, texto integral, observações e fontes do conteúdo editorial.
- O percurso avança por clique ou teclado e termina em Testar. Ao voltar, retoma a etapa anterior. O teste retira o material de consulta e o inspetor. Reconstruir mantém a avaliação existente e as alternativas a arrastar.
- O inspetor usa o conteúdo do capítulo, corrigindo a expectativa de termodinâmica que aparecia em todas as matérias.
- A biblioteca permite carregar todos os resultados, além dos primeiros 60.
- Skill aplicada: ECC motion-patterns; tokens de movimento do próprio projeto. Transições finitas e opção de movimento reduzido.

## Mecanismos

- Newton: força de 0–8 N e massa de 1–4 kg. Partida do repouso, um segundo de força horizontal constante, sem atrito. a=F/m e deslocamento=at²/2. Movimento com progresso quadrático, iniciado exclusivamente por botão. Alterar parâmetros limpa o resultado antigo.
- Bohr: diagrama esquemático do hidrogênio; E(n)=−13,6/n² eV. Escolher o nível move o elétron e informa absorção/emissão conforme o sinal de ΔE. Não extrapolar essa energia para átomos multieletrônicos.

## Cobertura e limites

`04-cobertura-percurso.json` inventaria 613 capítulos e 14 matérias. A afirmação anterior de personalização visual dos 613 capítulos era indevida: `topicVisual: true` era uma constante e os desenhos eram escolhidos por palavras amplas, sem validar correspondência conceitual.
Essa camada foi removida. Os 613 capítulos conservam o percurso e agora oferecem leitura em foco com comparação de trechos integrais. Isso é uma ferramenta de leitura, **não** uma prancha ilustrada personalizada.
As 61 associações de cenas/instrumentos anteriores permanecem. Onze novos capítulos têm laboratórios específicos registrados por ID exato. Esses números não se somam diretamente porque há interseção. O novo relatório separa `contentAtlas`, `interactiveExperiment` e `anchorScene`. A cobertura de ilustrações e animações autorais para todos os tópicos continua pendente; não chamar a implementação atual de cobertura visual completa.
O conteúdo vem do repositório e não foi revalidado cientificamente em sua totalidade nesta alteração.

## Verificação

- TypeScript: aprovado.
- Testes focados: continuidade do percurso, retorno à etapa anterior, ausência de consulta em Testar e cálculos dos dois mecanismos.
- Auditoria de dados: nenhum capítulo sem seções ou texto.
- `captureVisualJourney.ts`: uma amostra por matéria, alternando desktop/mobile, claro/escuro e movimento reduzido; verifica etapas, transição para Testar sem consulta, Reconstruir, console e overflow.
- Capturas em `screenshots/percurso/`, numeradas na ordem das matérias do relatório de cobertura. As capturas são amostras, não inspeção manual dos 613 capítulos.
- `captureMechanismFlow.ts`: confirma mudança entre quadros do carrinho, resultado de absorção/emissão e funcionamento com movimento reduzido.
- Build de produção aprovado; permanece o aviso de tamanho dos chunks já presentes no aplicativo.
