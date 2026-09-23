# Revisão dos instrumentos de contexto geográfico

Data: 2026-09-23. `GeographyContextInstrument` atendia 21 capítulos com o mesmo desenho de três círculos em um terreno ondulado. A seleção e as conclusões textuais variavam, mas os objetos centrais de energia elétrica, migração, comércio exterior e combustíveis não apareciam na figura que o aluno vê. Esses quatro capítulos ganharam geometria própria, mantendo a leitura e as cautelas do catálogo original.

| Capítulo | Mecanismo representado | Limite do esquema |
| --- | --- | --- |
| Energia Elétrica no Brasil | usina → rede de transmissão → centro consumidor | Não mostra a matriz real ou uma usina identificada. |
| Estrutura Étnica e Fluxos Migratórios | origem → trajeto apoiado por redes → destino, com vínculo possível de retorno | Não representa rota nem causa migratória única. |
| Os Fluxos do Comércio Externo | produção → corredor portuário → mercado | Não identifica produto, porto ou parceiro real. |
| Combustíveis Fósseis e Biocombustíveis no Brasil | estoque fóssil, carbono vegetal recente e etapa de uso sob um balanço que inclui solo e transporte | Não quantifica emissões nem presume neutralidade. |

Em cada figura, o foco acompanha o recorte escolhido, e a leitura explicativa e as cautelas continuam vindo de `geographyContextLab.ts`. As quatro entradas de `27-qualidade-visual.json` ficam `em-validacao`: QA técnica não é aprovação editorial contra as cinco referências do produto.

`node scripts/auditGeographyContextVisual.mjs` passou em **40/40 casos**: quatro capítulos × cinco larguras × dois temas com movimento reduzido, seleção por teclado, sem overflow horizontal, erro de console, resposta local HTTP 4xx/5xx ou requisição local falha. As **8/8 varreduras axe-core** em 375 px não apontaram violações WCAG A/AA automáticas. Resultados e capturas ficam em `screenshots/geografia-contextos-2026-09-23/`. TypeScript, build, testes direcionados e o inventário de qualidade passaram. `npm test` local ainda falha no catálogo pelos 14 PDFs licenciados ausentes neste checkout; a CI remota precisa confirmar a suíte completa com os arquivos presentes.

Os 17 capítulos restantes que ainda usam os três círculos precisam de inspeção pelo mecanismo do tópico; não devem receber um desenho de outro assunto por correspondência superficial de palavras. História e as demais matérias continuam no mesmo inventário de 613 capítulos para a próxima passagem.
