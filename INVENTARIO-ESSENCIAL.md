# Inventário essencial — My-App

Atualizado em 2 de setembro de 2026.

## Cópia principal

- **Pasta de trabalho:** `C:\Users\Maria Fernanda\My-App`
- **Repositório remoto:** `https://github.com/anajumorandii-eng/My-App.git`
- **Branch atual:** `fix/mobile-icon-and-rail`
- **Último commit local identificado:** `27f3efe` — 02/09/2026

Esta é a cópia a usar para desenvolver e preservar. As cópias em `Downloads`, `Documents`, `OneDrive`, `C:\wtmain` e em `.codex\worktrees` não são a fonte principal: são backups antigos, repositórios-base ou worktrees.

## Manter

| Local | Conteúdo |
| --- | --- |
| `src/` | Interface, regras e dados do app. |
| `server/`, `server.ts`, `serverCalendar.ts` | Backend local e integrações. |
| `public/` e `assets/` | Imagens, ícones e mídia distribuídos com o app. |
| `scripts/` e `tests/` | Automação, classificação e testes. |
| `docs/` | Especificações e decisões do projeto. |
| `package.json`, `package-lock.json`, `bun.lock` | Dependências reproduzíveis. |
| Configurações de projeto (`*.config.ts`, `tsconfig.json`, `vite.config.ts`, `firestore.rules`, `Dockerfile`) | Build, testes e publicação. |
| `materiais brutos/`, `Flashcards Brutos/`, `obras-brutos/` | Fontes de estudo; não são cache. |
| `.git/` | Histórico local e vínculo com o repositório remoto. |

## Pode ser recriado

| Local | Como recriar |
| --- | --- |
| `node_modules/` | `npm install` |
| `dist/` | `npm run build` |
| `playwright-report/` e `test-results/` | Ao executar os testes correspondentes. |

## Atenção antes de qualquer nova limpeza

O Git registra alterações locais, incluindo arquivos removidos em materiais de estudo e em `public/flashcard-media/`. Não use comandos de restauração ou limpeza do Git sem revisar essas alterações: elas podem representar trabalho local ainda não enviado ao remoto.

## Regra prática

Antes de apagar uma pasta, confirme se ela está em “Pode ser recriado”. Se não estiver, preserve-a ou faça uma cópia no OneDrive/Git primeiro.
