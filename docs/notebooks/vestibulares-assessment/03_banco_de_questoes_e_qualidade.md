# Banco de questões e qualidade de evidência

## FATO DO PRODUTO — banco atual

`CLAUDE.md` registra 2.887 questões em `public/questions.json`, mescladas por id com o Firestore.

Questões de apostila podem carregar `originalPages` apontando para recortes de página.

## FATO DO PRODUTO — higiene e fidelidade

O repositório adota regras explícitas:

- não inventar enunciado que ficou fora da imagem;
- recusar entrada inválida em vez de gravar parcialmente;
- verificar marcas d’água pessoais antes de versionar recortes;
- não copiar resoluções de terceiros;
- usar gabarito oficial quando disponível;
- registrar troca de gabarito apenas quando a resolução for inequívoca.

O precedente `ap_mat_fuvest_110` documenta a escolha de declarar a lacuna do enunciado em vez de inventar informação ausente.

## FATO DO PRODUTO — extração conservadora

Os scripts de extração descartam questões quando texto, figura, fórmula ou referência ficam ambíguos. O objetivo declarado é preferir ausência a uma questão aparentemente completa, mas incorreta.

## FATO DO PRODUTO — cobertura conhecida

`CLAUDE.md` registra uma lacuna conhecida: questões `fuvest_2025_q*` que ainda dependem da página original para enunciado/alternativas completas.

## Métricas de qualidade recomendadas para acompanhar

- % de questões com fonte oficial;
- % com gabarito oficial;
- % reconstruídas/incertas;
- % com enunciado completo;
- % com explicação própria revisada;
- distribuição por banca, fase, matéria, tópico e dificuldade;
- quantidade de itens suficientes por tópico para diagnóstico;
- itens potencialmente duplicados;
- taxa de falha de sincronização entre arquivo e Firestore.

## Regra para análise

Quantidade de questões não é, por si só, qualidade de assessment. O notebook deve priorizar validade, fidelidade ao exame e utilidade diagnóstica.
