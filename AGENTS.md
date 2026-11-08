# Crivo

App de estudo para vestibulares de Medicina. React 19 + TypeScript + Vite no
cliente, Express no servidor e Firestore para os dados da estudante.

**`CLAUDE.md` é a fonte completa das regras deste projeto.** Leia esse arquivo
antes de alterar qualquer coisa. Este `AGENTS.md` repete o que não pode ser
esquecido em nenhuma sessão; se os dois divergirem, vale o `CLAUDE.md`.

A fonte operacional do trabalho em andamento é
`docs/PLANO-GERAL-CRIVO-2026-10-03.md` + `docs/FILA-VISUAL-2026-10-03.json`.
Contagens e estados registrados têm data: confira o repositório antes de
repeti-los.

## Regras que não se negociam

**O repositório é público.** As apostilas em PDF trazem, no rodapé de cada
página, uma marca d'água com o nome, o e-mail e o CPF da licenciada. Nada disso
pode chegar a um commit, nem como texto nem como pixel.

- Não commite o texto extraído nem os PDFs das apostilas. `materiais-extraidos/`
  e `provas-extraidas/` estão no `.gitignore` por isso.
- Toda imagem de página que vai para `public/question-media/` passa por
  `scripts/conferir-marca-dagua.py`.
- As resoluções escritas das apostilas são conteúdo de terceiros. Comentários de
  questão são escritos do zero, nunca copiados.
- Nunca coloque segredos no repositório.

**Nunca inclua identificador de modelo** em mensagem de commit, título ou corpo
de PR, comentário de código ou qualquer outro artefato que vá para o repositório.

**Trabalhe em branches e abra PR.** Publicar em outra branch e abrir PR não exige
nova confirmação. Nunca faça merge automático. Antes de editar, atualize e audite
`origin/main` e confira PRs abertas para não repetir nem sobrescrever trabalho
recente. Preserve alterações locais.

**Antes de todo push:** `npm run lint` limpo e `npm test` verde. Se `node_modules`
estiver ausente, esses comandos falham de um jeito que parece sucesso: instale as
dependências antes e leia a saída até o fim.

**Checkpoints também devem chegar ao remoto.** Salvar só no workspace não conta
como salvar. Com a implementação incompleta, envie a branch e abra ou atualize um
PR em rascunho, registrando bloqueios e o ponto exato de retomada.

**Não invente conteúdo.** Quando a imagem não permite reconstruir um enunciado,
diga isso no enunciado. Os scripts que editam o banco recusam entrada inválida;
respeite isso, não contorne.

**O assistente de IA do app se chama CRIVO.** As chaves de `localStorage` com
prefixo `juju_` e `juju-` ficam como estão: renomeá-las apagaria progresso real
da estudante.

**Resumos profundos:** ao reescrever um capítulo, sempre suba o `rev`. É isso que
impede o progresso de leitura dos demais capítulos de zerar.

**Autorizações antigas** registradas em históricos não valem para novas
publicações ou ações externas.

## Comandos

| Comando | O que faz |
| --- | --- |
| `npm run dev` | Sobe o app em http://localhost:3000 (cliente e servidor juntos) |
| `npm run lint` | `tsc --noEmit`; é este o lint do projeto, não há ESLint |
| `npm test` | `test:node` (servidor e libs) e depois `test:vitest` (React) |
| `npm run build` | Build de produção do cliente e bundle do servidor |

Para conferir mudança visual, use Playwright com um Chromium já disponível e não
rode `playwright install`. O modal de onboarding bloqueia a tela; contorne com
`localStorage.setItem('juju_onboarding', 'true')` num `addInitScript`.

## Interface

Qualquer tela nova ou mudança visual segue `docs/visual/PADRAO-VISUAL-OBRIGATORIO.md`
e a seção Interface do `CLAUDE.md`. Preserve persistência, navegação, filtros e
progresso, e confira a experiência no celular.

Quando estas skills estiverem disponíveis, use-as sem precisar de pedido:

- `ui-consistency`: em telas novas ou ajustes, siga as fases `finding-patterns`,
  `planning`, `implementing` e `verifying`; em mudança pequena, `adjusting`,
  `implementing` e `verifying`.
- `ux-ui-audit`: para medir contraste, área de toque, foco e nomes acessíveis na
  página real.
- `usability-audit` e `audit-cuj`: para avaliar usabilidade e jornadas completas,
  como Resumos, Visual e Caderno de Erros.

Testes automatizados não equivalem a aprovação editorial ou visual. Não promova
aprovação por contagem ou por teste.

## Skills do projeto

As skills deste repositório estão em `.agents/skills/`, e `skills-lock.json` é a
fonte da verdade. Mantenha as cópias sincronizadas conforme o `README.md` das
skills.
