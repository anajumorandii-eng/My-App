# Referências visuais do CRIVO Visual

Este diretório guarda as referências de direção citadas em
[`../README.md`](../README.md). Elas são estudos de concepção, **não** fontes de
verdade para tokens — a implementação segue o design system real do CRIVO.

## O que está aqui

- `architecture-options.svg` — comparação das três arquiteturas possíveis para o
  mapa. É o formato vetorial, preferível ao raster equivalente.

## O que ficou fora

Os rasteres originais (`architecture-options.png` e os dois `exec-*.png`, juntos
cerca de 3,4 MB) permanecem na pasta do Drive
`CRIVO Visual — materiais completos`. Eles não foram versionados aqui: o
`architecture-options.png` é redundante em relação ao SVG acima, e os dois
`exec-*.png` são pesados demais para o benefício que trazem a um repositório
público.

Para que a intenção de design não se perca junto com as imagens, o conteúdo dos
dois estudos está transcrito abaixo.

## Comparação de arquiteturas (`architecture-options.svg`)

Pergunta que o estudo coloca: **onde o mapa deve viver no sistema?**

| Opção | Ideia | Risco / vantagem |
| --- | --- | --- |
| **A · Mapa como centro** | Exploração primeiro. A estudante entra pela matéria e navega pelo próprio mapa. | Risco: exige que ela decida demais justamente quando está perdida. |
| **B · Sessão como centro** | Decisão primeiro. O motor escolhe a próxima ação e mostra apenas o contexto necessário. | Risco: é eficiente, mas pode esconder a visão geral e reduzir autonomia. |
| **C · Sistema híbrido** ✅ | Visão + decisão. O mapa tem espaço próprio e também alimenta a tela Hoje e as intervenções. | Vantagem: une autonomia e orientação sem transformar o mapa em decoração. |

A opção **C** é a marcada como recomendada no estudo, e é a que a especificação
principal descreve.

No cartão da opção C aparece o elo que justifica a escolha: um bloco
"POR QUE ISSO?" com a frase *"O plano e o mapa usam as mesmas evidências"* —
isto é, a mesma base de diagnóstico alimenta tanto a recomendação da tela Hoje
quanto o estado dos nós do mapa.

## Estudo 1 — modo Explorar (`exec-04e0d741-…png`)

Layout amplo, com a navegação do CRIVO à esquerda
(`Hoje · Plano · Visual · Caderno · Perfil`) e inspetor contextual à direita.

- **Contexto:** Termodinâmica › Transformação adiabática › Gases ideais.
- **Abas de modo:** `Explorar · Testar · Reconstruir`.
- **Prancha ilustrada** com o conceito central ("quando não há troca de calor
  entre o sistema e o meio") e dois ramos simétricos:
  - *Expansão adiabática* — o gás realiza trabalho sobre o meio; a energia
    interna diminui; a temperatura diminui (`W > 0`, `ΔU < 0`, `ΔT < 0`).
  - *Compressão adiabática* — o meio realiza trabalho sobre o gás; a energia
    interna aumenta; a temperatura aumenta.
- **Elementos de apoio:** sistema gasoso com paredes adiabáticas (isolante
  térmico), setas de `W` e `Q = 0`, e a síntese "toda a variação de energia
  interna ocorre devido ao trabalho".
- **Relação fundamental** destacada: Primeira Lei com `Q = 0`, logo
  `ΔU = Q − W ⇒ ΔU = −W`.
- **Gráfico P × V** comparando isotérmica (T constante) e adiabática (mais
  íngreme), com a leitura "na expansão, a pressão cai mais rapidamente que na
  isotérmica".
- **Inspetor** do nó selecionado (*Compressão adiabática*): explicação em prosa,
  **Domínio atual: Baixo**, a orientação "foque neste conceito para evoluir" e as
  ações `Explicar ›`, `Comparar ›`, `Testar ›`, `Reconstruir ›`, além de
  `Adaptar ao meu diagnóstico ›`.
- Dois atalhos de intenção aparecem na prancha: **"Estudar melhor."** e
  **"Ir além."**

## Estudo 2 — modo Reconstruir (`exec-2cc4861f-…png`)

Layout vertical de celular, com barra inferior
(`Hoje · Plano · Visual · Caderno · Perfil`) e cabeçalho compacto
"‹ CRIVO Reconstrução Ativa".

- **Mesmo conteúdo** (transformação adiabática, `Q = 0`), agora com partes do
  grafo ocultas.
- **Mensagem do sistema:** *"O CRIVO ocultou primeiro as relações em que suas
  evidências são mais frágeis"*, acompanhada do link **"Por que estas? ›"** — a
  transparência exigida pela especificação.
- **Lacunas** marcadas com `???` nos nós e nas arestas que a estudante precisa
  recompor; as relações nomeadas visíveis são "leva a", "relaciona-se com",
  "altera" e "afeta".
- **Banco de peças arrastáveis**, com distratores plausíveis ao lado das
  respostas certas: `Temperatura`, `ΔU = nCvΔT`, `diminui`,
  `Trabalho sobre o gás`, `Temperatura não se altera`, `W = PΔV`.
- **Instrução:** "arraste os conceitos para completar as relações".
- **Feedback imediato e graduado**, não binário:
  - acerto — *"Correto! Em uma transformação adiabática, a variação da energia
    interna é igual ao oposto do trabalho."*
  - acerto parcial — *"Quase isso! Em uma compressão adiabática, a temperatura
    aumenta mesmo."*
- **Controles de recuperação:** `Desfazer` e `Reiniciar`.

## Leitura conjunta

Os dois estudos mostram o mesmo conteúdo em dois momentos do ciclo: o Explorar
entrega a estrutura inteira com o inspetor aberto, e o Reconstruir devolve a
mesma estrutura com buracos escolhidos pelo diagnóstico. Isso é a tradução
visual do princípio da especificação — mapa para compreender relações,
recuperação ativa para consolidar.
