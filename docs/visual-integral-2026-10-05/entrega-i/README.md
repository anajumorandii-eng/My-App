# Entrega I — autores de 45 e literatura de 1950-1980

Base: `0d9a97c030979b7bf17df492f397c24d7dbafd31`, depois da Entrega H (PR #264) e da
correção do teste instável do Plano diário (PR #265). Trata sete capítulos do
LG3; restam 6 (poesia e prosa contemporâneas, lusófonos, artes plásticas,
teatro e cancioneiro). Não promove aprovação editorial.

## Mudanças verificáveis

| Capítulo | Operação central (exemplos autorais) |
| --- | --- |
| Graciliano Ramos | Cortar adjetivos com controle manipulável; narrador que empresta a palavra; “comprei” repetido até o afeto. |
| João Cabral | Palavra assentada como pedra; contagem das sete sílabas; a pedra que ensina a frase sem sobra. |
| Clarice Lispector | Ovo rachado como epifania; narrador que hesita; escrever o que não tem nome. |
| Guimarães Rosa | “Saudadear” como invenção; pacto sem testemunha; travessia física e interior. |
| Poesia Concreta | Espaço em branco; mar/amar/amargo em coluna; placa e poema. |
| Poesia 1960-1980 | Jardim proibido de florir; poema marginal com quebra; fruta, quintal e corpo. |
| Prosa 1960-1980 | Mortos que falam; voz fria do agressor; testemunho como prova. |

São 35 seções com 918 a 1.081 caracteres, seis armadilhas com correção e dois
problemas resolvidos por capítulo; só esses sete registros recebem `rev: 2`.
Nenhum verso ou trecho dos autores é usado como exemplo, e cada âncora aparece
literalmente na seção citada. Os quatro autores trocam o cartão de autor pela
operação; a poesia de 1960-1980 sai da cena de tipologia, cujas citações
continuam no texto. Matriz: 337 instrumentos, 225 cenas, zero lacunas.

## Conferência no navegador

Build de produção, 112 configurações (7 capítulos × 360/390/834/1366 ×
claro/escuro × movimento normal/reduzido): 112 aprovadas na primeira rodada,
sem violação axe, texto cortado, colisão ou overflow horizontal, com as fontes
reais carregadas. Safari/iPad físico e estados autenticados não certificados.
Testes: lint limpo, 922 Node + 1.200 Vitest aprovados.
