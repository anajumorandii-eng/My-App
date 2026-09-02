# Design QA — tela Hoje / dossiê instrumental

## Referência e implementação

- Referência aprovada: `C:\Users\Maria Fernanda\.codex\generated_images\01a05cbf-efd9-7cd0-86c2-118833a0ff48\exec-cb087e99-1ec8-41d7-b279-83d8a172bd1a.png`
- Prévia implementada: `C:\Users\Maria Fernanda\My-App\artifacts\hoje-dossie-preview.png`

## Critérios verificados

- A composição foi limitada à rota **Hoje**; Sessão e demais páginas não foram alteradas por este trabalho.
- O seletor de matérias deixou de usar chips e agora usa texto editorial com ícone semântico discreto.
- O painel de decisão substituiu a coluna abstrata por um artefato físico de dossiê.
- As 10 matérias possuem ativos de dossiê próprios em `src/assets/subject-dossiers`.
- A recomposição entre matéria/tópico usa `AnimatePresence` e `motion.figure`, com redução de movimento respeitada.
- Modo claro e layout responsivo mantêm o mesmo layout; no mobile o seletor rola horizontalmente e os alvos têm 44 px.
- A barra inferior mobile foi redesenhada como trilho instrumental e usa um indicador de destino compartilhado em Motion, com retorno estático para redução de movimento.
- `npx tsc --noEmit`, os testes de Dashboard/Sessão e `git diff --check` concluíram sem erro.

## Resultado

**Aprovado para revisão visual da usuária.**

Ainda não houve PR nem merge desta revisão.
