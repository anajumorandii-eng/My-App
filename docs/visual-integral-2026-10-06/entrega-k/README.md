# Entrega K — Sociologia do H3

Base: `90d69ae6420af0efbd62ec863e2b7394209c6e7d`, depois da Entrega J (PR #267). Trata os
sete capítulos de Sociologia do lote H3; os 8 de Filosofia do H3 e os 23 do H2
continuam na fila. Não promove aprovação editorial.

## Mudanças verificáveis

| Capítulo | Caso autoral e operação |
| --- | --- |
| Fato social | Uniforme de Lia: ligar e desligar exterioridade, coerção e generalidade muda o desenho e o veredito. |
| Solidariedade | Aldeia semelhante; cadeia do pão; tabu expulsa, contrato repara (direito repressivo × restitutivo). |
| Anomia | Fábrica fechada; grade integração × regulação com os quatro tipos; associação de bairro que reintegra. |
| Identidade | Paulista em Recife; sotaque que vira recusa; reconhecimento × redistribuição ligáveis. |
| Mobilidade | Filha do porteiro (vertical intergeracional); vendedor que troca de produto (horizontal intra); um ponto entre cem. |
| Cidadania | Falar, votar, matricular; carteira assinada decide a aposentadoria; vaga a duas horas. |
| Sociedade da informação | Um celular para três irmãos: conexão, aparelho e uso crítico ligáveis; rede; feed por engajamento. |

São 35 seções com 952 a 1.098 caracteres, seis armadilhas com correção e dois
problemas resolvidos; só esses sete registros recebem `rev: 2`. Os casos são
autorais e declarados na interface; datas e obras citadas (Durkheim 1893, 1895,
1897; Marshall 1950; Castells 1996; LGPD 2018) foram conferidas.

A oficina da Literatura virou `OperationWorkshop`, com abertura e aviso por
matéria. Solidariedade continua no experimento prioritário, que agora mostra a
mesma oficina. Seis capítulos trocam a cena genérica por instrumento exato.
Três citações de cenas antigas foram ajustadas ao texto novo. Matriz: 345
instrumentos, 217 cenas, zero lacunas.

## Defeito encontrado na própria entrega

A primeira captura mostrou que desligar “Coerção” mudava só o texto do
veredito, e os cartões ficavam iguais — exatamente o achado da auditoria. As
condições agora passam o estado ao desenho (caixa tracejada e riscada, ligação
desfeita, legenda nova), e o teste exige que o SVG mude junto.

## Conferência no navegador

Build de produção, 112 configurações (7 capítulos × 360/390/834/1366 ×
claro/escuro × movimento normal/reduzido), refeita após a correção: 112
aprovadas, sem violação axe, texto cortado, colisão ou overflow, com as fontes
reais carregadas. Safari/iPad físico e estados autenticados não certificados.
Testes: lint limpo, 922 Node + 1.231 Vitest aprovados.
