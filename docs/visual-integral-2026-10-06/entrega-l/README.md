# Entrega L — Filosofia do H2 e do H3

Base: `4c6227f6998157275b7d7fd5db0b64a988e4dac5`, depois da Entrega K (PR #268). Trata os
19 capítulos de Filosofia que restavam na fila: oito do H3 e onze do H2. Os
textos já estavam em revisão 2 e não mudam; a entrega é a representação.
Não promove aprovação editorial.

## Mudanças verificáveis

Cada capítulo ganha uma oficina de argumento (`PhilosophyOperations.tsx`).
Cada estado cita uma frase literal do resumo, e o desenho muda a cada estado;
os testes conferem as duas coisas.

| Lote | Capítulo | Estados da oficina |
| --- | --- | --- |
| H3 | Mito ao logos | Mito / Logos / Contestação / Condições |
| H3 | Método socrático | Ironia / Contradição / Aporia / Parto |
| H3 | Caverna | Sombras / Objetos e fogo / Sol / Retorno |
| H3 | Linha dividida | Eikasia / Pistis / Dianoia / Doxa × episteme |
| H3 | Meio-termo | Régua bilateral / Meio contextual / Hábito, com “Ver como pedestre” |
| H3 | Dúvida hiperbólica | Sentidos / Sonho / Gênio maligno / Cogito |
| H3 | Dialética de Hegel | Contradição interna / Aufhebung / Senhor e escravo / Inversão |
| H3 | Genealogia de Nietzsche | Genealogia / Inversão / Niilismo / Criação |
| H2 | Lógica de Aristóteles | Silogismo / Validade ≠ verdade / Matéria e forma / Quatro causas |
| H2 | Tomás de Aquino | O problema / Método / Duas verdades / Cinco vias |
| H2 | Hume | O que se vê / Hábito / Indução |
| H2 | Hobbes | Igualdade / Guerra / Pacto / Limite |
| H2 | Locke | Lei natural / Trabalho / Depositário / Resistência |
| H2 | Rousseau | Homem natural / A cerca / Vontade geral / Liberdade civil |
| H2 | Kant | Por dever? / Universalizar / Hipotético / Autonomia, com “Tornar o engano mais lucrativo” |
| H2 | Materialismo histórico | Inversão / Base e legitimação / Retorno / Transição |
| H2 | Luta de classes | Antagonismo / Em si → para si / Ideologia / Estado, com “Formar consciência de classe” |
| H2 | Sartre | Cortador × humano / Condenado / Má-fé |
| H2 | Frankfurt | Pergunta / Razão instrumental / Mesma fórmula / Ilusão de escolha |

O experimento Mito/Logos, que tem prioridade no resolvedor, passa a mostrar a
mesma oficina; o teste antigo, que esperava a tela anterior, foi atualizado.
Uma âncora de Sócrates foi corrigida para “arte da parteira”, porque o texto
traz “à arte”. Matriz: 363 instrumentos, 199 cenas, zero lacunas.

## Defeito encontrado na própria conferência

A primeira rodada do H2 não testou nada: a lista de capítulos do roteiro de
auditoria não tinha os onze IDs, e o servidor de produção ainda era um build
anterior a eles. A lista foi completada, o build refeito e a rodada repetida
do zero.

## Conferência no navegador

Build de produção, 304 configurações (19 capítulos × 360/390/834/1366 ×
claro/escuro × movimento normal/reduzido): 304 aprovadas, sem violação axe,
texto cortado, colisão ou overflow, com as fontes reais carregadas.
Safari/iPad físico e estados autenticados não certificados. Testes: lint
limpo, 922 Node + 1.274 Vitest aprovados.
