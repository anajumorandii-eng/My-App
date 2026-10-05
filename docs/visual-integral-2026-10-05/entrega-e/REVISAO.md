# Revisão e decisões — Gramática

Revisão independente do texto/código antes da validação: 26 capítulos, 130 seções, 26 recalls e 78 estados de instrumentos. Não houve achado crítico. A revisão de código não certificou dimensões, fontes ou comportamento do navegador; esses itens são registrados separadamente na evidência de produção.

## Correções

- Ambiguidade: a reformulação com gerúndio ainda admitia duas leituras. “Usei o telescópio para ver a aluna” identifica quem usa o instrumento. O exemplo de predicativo passou a usar “supervisora” e “técnica”, compatíveis com “preocupada”.
- Implícitos: verbo aspectual não é verbo factivo. A projeção da pressuposição sob negação foi qualificada, e a partícula “até” passou a declarar a escala contextual assumida.
- Língua/sistema e tipos de texto: aplicações próprias acrescentam língua/norma/adequação e percurso exemplo→conceito→tese, com limite da generalização.
- Cobertura dos recalls: 16 aplicações próprias completam os mecanismos centrais cobrados na recuperação, incluindo escopo/modalização, caso/próclise, predicativos, regência do relativo, se apassivador/indeterminador, consecutiva, explicativa/causal, formação lexical, relações semânticas, vocativo e cujo com preposição. A cena principal continua interativa; as aplicações permanecem legíveis sem reprodução.
- Duas recomendações foram tratadas como correções necessárias: declarar que os seis alunos são um cenário ilustrativo, e substituir a referência potencialmente reflexiva de Pronomes por “Nina disse a Clara que ela receberia o convite”.

Cada correção conceitual e de cobertura teve regressão observada falhar antes da implementação e passar depois. A rolagem por teclado também teve regressão: faltava conectar a referência React ao elemento de rolagem. A matriz de produção reproduziu o defeito antes da correção. A verificação em tablet com movimento normal também detectou sobreposição entre “núcleo expresso” e “alunos”; o espaçamento foi aumentado antes da rodada final.

## Decisões do lote

LG1/Gramática foi separado de LG3/Literatura para manter uma entrega de 26 capítulos revisável; Literatura continua pendente. A cobertura visual é aferida pelos mecanismos centrais e pelo recall, sem exigir que cada detalhe secundário do texto vire desenho. As resoluções dos exercícios podem aparecer no próprio desenvolvimento: não se exige a expressão literal “Solução:”. Os textos preservam cinco etapas, exemplos autorais, armadilhas corrigidas e dois problemas resolvidos por capítulo. Se a separação de lotes for inadequada, o custo é reorganizar a próxima PR. Se a cobertura por mecanismos centrais deixar um requisito essencial de fora, será necessário ampliar a cena correspondente. Se uma integração futura exigir a etiqueta literal de solução, os exercícios precisarão de padronização de formato; a resolução já está presente.

Permanece um refinamento menor: o wrapper de movimento dos 12 instrumentos morfológicos tem opacidade constante. Suas mudanças de estado são completas e imediatas, mas não constituem animação instrutiva. As configurações de movimento normal/reduzido verificam leitura e comportamento, sem apresentar esse wrapper como prova de animação. Não houve promoção de aprovação editorial formal.
