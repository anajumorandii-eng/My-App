# Revisão tela a tela: junção das barras e Plano (28/09/2026)

Continua o doc 49. A Ana Júlia aprovou a identidade do Crivo e o Hoje e pediu
que a revisão seguisse na ordem proposta (Hoje → Plano → Estudar/Questões →
Resumos), corrigindo antes a junção da barra de cima com a lateral.

## Junção da barra de cima com a lateral

A captura dela no iPad mostrava três defeitos:

- **Fresta vinho.** A lateral tinha 68 px e a coluna da grade 72. Pela
  diferença aparecia a aurora, como uma faixa.
- **Duas peças.** Lateral e barra de cima tinham bordas que não se
  encontravam.
- **Ícone solto,** fora do alinhamento da barra.

Agora a lateral ocupa a coluna inteira. O ícone mora num bloco da altura da
barra de cima (65 px), com a mesma linha embaixo: as duas barras formam um L.

Na mesma captura, o Visual encostava na lateral e na borda direita. As telas
têm margem pelo `.ni-main`, e o Visual e a Agenda não usavam a classe. Agora
usam.

Capturas: `juncao-antes-escuro.png`, `juncao-depois-*.png`,
`visual-sem-margem-antes.png`.

## Plano: o que não fazia sentido

| Antes | Problema | Agora |
| --- | --- | --- |
| "Teoria • Física" saía "Theory", e a fila dizia "Física · theory", "review" | `action.type.replace('_', ' ')`: o valor interno, em inglês, direto na tela. A Sessão fazia o mesmo. | Rótulos em português num mapa só (`src/lib/studyActionLabels.ts`): Teoria, Prática, Revisão, Análise de erros. |
| "Fase Reta final · Crivo Scheduler" | Nome interno do alocador, em inglês, no selo. | "Fase Reta final · 225 min planejados hoje", a soma real do plano do dia. |
| Breadcrumb, "250 min" e ícones em azul | A tela fixava a paleta de Matemática no próprio contêiner, e a variável vencia a do ambiente. O plano não é de matéria nenhuma. | A cor vem do app. Cada ação continua com a cor da sua matéria. |
| Fila de espera com 100 itens abertos | Rolagem sem fim abaixo do plano do dia. | As 8 primeiras, o total ao lado do título e "Mostrar todas (100)". |
| "conecte sua conta Google em "Perfil"" | O login fica em Conexões (`/conexoes`). Cinco telas diziam "Perfil" e quatro, "Conexões Google", nome que não existe no menu. | As nove dizem "Conexões", o nome do menu. |
| Nome do tópico cortado no celular ("Óptica Instrumental e da ...") e horário partido em "14:40–" / "15:25" | `truncate` no nome e linha de metadados sem quebra controlada. | O nome quebra linha; cada metadado fica inteiro, com o separador junto do item seguinte. |
| "Google Calendar não está conectado." quase ilegível no claro | `text-amber-300`, escrito para fundo escuro, sobre o marfim. | No claro, o âmbar segue o token `--status-warning`, que já troca com o tema. |

**O âmbar valia para o app inteiro.** O mesmo `text-amber-300` aparece em 22
avisos (Agenda, Questões, Resumos, Tutor…). A correção foi feita uma vez, no
CSS do ambiente, em vez de tela por tela. Corrigir só o Plano deixaria a
próxima tela com o mesmo defeito.

## Conferência

- **Plano:** iPad (1194×834) e celular (390×844), claro e escuro, com as
  fontes reais. Nenhum erro de página.
- **Testes:** `DailyPlanConsistency.test.tsx` agora cobre:
  - os rótulos em português, e nenhum tipo em inglês na tela;
  - a fila limitada a 8, que abre as 12 com "Mostrar todas (12)".
- **Checagens:**
  - `npm run lint` limpo;
  - `npm test` verde (719 node:test e 751 vitest);
  - `npm run build` sem erro.

Capturas em `screenshots/revisao-telas-2026-09-28/`: `plano-antes-1194-escuro.png`
e `plano-depois-*`.

## Próximo

Estudar e Questões, com a mesma régua: nada de dado inventado, tudo em
português, cor vinda do ambiente e conferência em iPad e celular.
