# Entrega N — Sociologia do H2

Empilhada sobre a Entrega L (PR #269), a partir de `4c6227f6998157275b7d7fd5db0b64a988e4dac5`.
Trata os 12 capítulos de Sociologia do H2, os últimos de Humanas na fila. Não
promove aprovação editorial.

## Texto

Os doze estavam em revisão 1, com ~300 caracteres por seção. Agora são 60
seções de 901 a 1.082 caracteres, em `rev: 2`, cada capítulo com casos
autorais declarados, seis armadilhas com correção e dois problemas resolvidos.
Datas e nomes conferidos: Weber 1904-1905, Beauvoir 1949, Crenshaw 1989, voto
feminino 1932, Lei Maria da Penha 2006, feminicídio 2015, reforma trabalhista
2017, Ley Rider e decisão da Suprema Corte britânica em 2021, MST 1984, greve
geral de 1917, orçamento participativo de Porto Alegre 1989, OMC 1995, Milton
Santos 2000, Brexit 2016, Acordo de Paris 2015, Levitsky e Ziblatt 2018.

## Representação

| Capítulo | Caso e operação |
| --- | --- |
| Educação em Durkheim | Criança que aprende a esperar a vez; casa e primeiro emprego; prova que premia o vocabulário de casa. |
| Modo de produção | Uma máquina, duas relações; a lei da cerca; a oficina que a corporação trava. |
| Ideologia e alienação | “Sempre foi assim”; quatro separações do operário; o tênis da marca. |
| Tipos de ação | Guarda-chuvas sem orientação mútua; **doar sangue**: o motivo escolhido muda o tipo; bolo de fubá como mistura. |
| Dominação | Assaltante × fiscal; **o fundamento escolhido** redesenha patriarca, pregador e cargo; laudo circular. |
| Ética protestante | Loja que reinveste; **retirar angústia, vocação ou ascese** desfaz a acumulação; o bisneto sem fé. |
| Gênero | Bisavó e bisneta; dupla jornada; reunião às 19h. |
| Uberização | Costureira por peça; **retirar preço, algoritmo ou bloqueio** enfraquece a subordinação; propostas por elo. |
| Movimentos sociais | **Identidade, organização e projeto ligáveis**; metalúrgicos × praça; protesto em rede. |
| Democracia | **Direta, representativa ou participativa** redesenham a praça; **urna sem informação plural** é só eleitoral; áudio falso. |
| Globalização | Celular em cinco países; **homogeneização, hibridismo ou identidade local**; soja passa, estudante espera. |
| Estado-nação | Escolhas estreitadas; empresa que pede socorro; fronteira e vacina. |

Tipologias ganharam a escolha `Pick`, que redesenha o mesmo caso; cadeias e
conjunções usam as condições ligáveis da Entrega K. As citações de nove cenas
antigas foram reancoradas no texto novo, mantendo as 248 entradas com lastro.
Matriz: 375 instrumentos, 187 cenas, zero lacunas.

## Defeito encontrado na própria entrega

A primeira rodada acusou duas colisões em 360 px — “sem orientação mútua” e
“insumos de três continentes” encostavam na frase final da cena. As duas
linhas subiram; as configurações desses capítulos foram refeitas.

## Conferência no navegador

Build de produção, 192 configurações (12 capítulos × 360/390/834/1366 ×
claro/escuro × movimento normal/reduzido): 192 aprovadas, sem violação axe,
texto cortado, colisão ou overflow, com as fontes reais carregadas.
Safari/iPad físico e estados autenticados não certificados.

Testes: lint limpo, 922 Node + 1.302 Vitest aprovados.
