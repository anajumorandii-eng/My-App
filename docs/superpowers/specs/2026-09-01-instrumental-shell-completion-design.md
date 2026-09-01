# Conclusão do shell instrumental — design

Data: 2026-09-01
Branch: `fix/approved-instrumental-composition`
Relacionado: `docs/FUNCTIONALITY_MAP.md`, commits `05e8d01` (migração de 28 telas), `3df479d` (protótipo promovido a shell)

## Contexto

A migração visual para o Núcleo Instrumental já cobriu 24 das 28 rotas de
produção. Duas frentes ficaram abertas:

- **A4 — Seam do layout.** A troca (não commitada) de `Layout` para
  `NucleoInstrumentalProductionLayout` em `src/App.tsx` adotou a composição
  aprovada (`artifacts/approved-shell-check.png`), mas o novo shell renderiza
  `<Outlet />` sem o wrapper `RouteVisualShell`. Isso remove, para as telas
  que dependiam dele, o campo ambiente por rota (`SubjectAtmosphere` via
  `routeVisualFor`) e os atributos `data-crivo-route-kind` que alimentam
  `--route-accent` em `src/index.css`.
- **B — Telas restantes.** `Sessao`, `Admin`, `AdminObras`, `AdminConteudo`
  seguem no visual antigo (Tailwind cru, zero classes `ni-`). `05e8d01` não
  as tocou.

As duas são acopladas: o novo shell deixou de dar padding/largura máxima às
views que não têm `.ni-main` próprio, e as 4 telas do item B são justamente
essas. Fazer A4 sem B deixa uma janela em que `/sessao` e `/admin*` renderizam
sem contorno. Portanto: **uma spec, um plano, ordem de implementação que nunca
deixa uma tela regredida entre commits.**

## Decisões já tomadas

1. **A4 = opção (a):** `NucleoInstrumentalProductionLayout` absorve as
   responsabilidades de `RouteVisualShell` e `routePresentation`; o
   `Layout.tsx` antigo vira código morto e é removido.
2. As 4 telas do item B migram para o sistema instrumental preservando toda
   a lógica.
3. Não reintroduzir `useSpotlight` nem `CrivoMark` no shell — o efeito de
   brilho no cursor era cosmético e opt-in; a marca já é o glifo `◉`.

## Não-objetivos

- Não mexer nas 24 telas já migradas (a não ser correção pontual se a
  mudança do shell as afetar — a verificar no plano).
- Não alterar lógica de negócio de nenhuma tela (cronômetro/SM-2 da Sessão,
  auth-gate e formulários do Admin permanecem idênticos).
- Não resolver a limitação pré-existente de `/obras` e `/obras/:slug` sem
  fallback local (fora de escopo; anotado em `FUNCTIONALITY_MAP`).
- Não tocar em `BottomNav` além do necessário para o shell montar.

## Invariantes (de `FUNCTIONALITY_MAP.md`, seção "Invariantes")

Toda tela migrada mantém: ações persistentes (nada de simulação visual),
estados de carregamento / sem dados / erro de sincronização / modo
demonstração, parâmetros de URL (`?topic=` da Sessão especialmente),
reúso de `Panel`/`Button`/`CrivoCore` e tokens por matéria. Cada rota
alterada atualiza `FUNCTIONALITY_MAP.md` e `routeVisuals.ts`.

---

## Parte A4 — Seam do layout no novo shell

### Arquitetura

`NucleoInstrumentalProductionLayout` passa a ser o único dono do campo
ambiente por rota. O `<Outlet />` é envolvido pela mesma lógica hoje em
`RouteVisualShell`:

```
<main className="ni-production-main">
  <AnimatePresence mode="wait">
    <motion.div key={pathname} className="ni-production-view" ...>
      <RouteVisualShell pathname={location.pathname}>
        <Outlet />
      </RouteVisualShell>
    </motion.div>
  </AnimatePresence>
</main>
```

`RouteVisualShell` **permanece** como componente (não é código morto) —
apenas passa a ser consumido pelo novo shell em vez do antigo. Ele já trata
o caso especial de `/` (Dashboard tem atmosfera própria data-driven, então
não recebe segundo wrapper).

### O que é porta e o que não é

| Responsabilidade do `Layout` antigo | Vai para o novo shell? |
| --- | --- |
| `RouteVisualShell` (campo ambiente + `data-crivo-route-kind`) | **Sim**, verbatim |
| `routePresentation.contentClassName` (`mx-auto max-w-6xl p-4 sm:p-8`) | **Não.** Estrangularia as telas `.ni-main` (que já têm `max-width:1460px; margin:auto; padding`). É exatamente a largura maior que o print aprovado mostra. |
| `routePresentation.mainClassName` / `immersive` | **Não** como classe Tailwind. O equivalente instrumental: `/` já é full-bleed porque `.ni-production-view` não tem padding e o Dashboard controla o próprio campo. |
| `useSpotlight`, `CrivoMark` | **Não** (decisão 3) |
| Chave `juju_onboarding` do `OnboardingModal` | Já idêntica no novo shell |
| Persistência do rail expandido (`RAIL_STORAGE_KEY`) | A verificar no plano — o novo shell tem `railExpanded` só em memória. Decisão: **restaurar** a persistência (paridade de comportamento). |

### Código removido ao final de A4+B

- `src/components/Layout.tsx` — substituído integralmente.
- `src/components/layout/routePresentation.ts` + `routePresentation.test.ts` —
  a lógica `immersive`/`contentClassName` deixa de existir; a checagem "só
  Hoje é imersiva" migra para um teste de `routeVisuals`/shell se ainda fizer
  sentido.
- `src/components/layout/routePresentation` só sai **depois** que B terminar
  (enquanto Sessao/Admin não têm `.ni-main`, algo precisa dar a elas um
  container — ver ordem de implementação).

### Risco e mitigação

- **Dupla atmosfera nas 24 telas migradas.** Hoje elas já rodam sob
  `RouteVisualShell` (o `Layout` atual as envolve) e ficam corretas — então
  portar o wrapper é paridade, não novidade. Verificar 3–4 no navegador
  mesmo assim.
- **`data-family` / `--primary` no root.** O novo shell já seta as
  variáveis de paleta a partir de `screenForPath`. `RouteVisualShell` seta
  outra vez via `SubjectAtmosphere`. Conferir que não brigam (o
  `SubjectAtmosphere` escreve num escopo mais interno, deve prevalecer onde
  importa).

### Testes A4

- `NucleoInstrumentalProductionLayout` renderiza `RouteVisualShell` e
  propaga `pathname` (novo teste de componente, com `MemoryRouter` +
  `Outlet` fake).
- Rota `/` não recebe segundo `SubjectAtmosphere` (assert no DOM).
- Rail expandido persiste em `localStorage` entre montagens.
- Os testes de transição existentes (`LayoutRouteTransition.ui.test.tsx`,
  `LayoutReducedMotionTransition.ui.test.tsx`) passam a apontar para o novo
  shell ou ganham equivalentes.

---

## Parte B — Migração de Sessao, Admin, AdminObras, AdminConteudo

### Padrão-alvo (já estabelecido nas 24 telas)

```
<div className="ni-main" style={{ '--primary'/'--secondary'/'--wash' da paleta }}>
  <div className="ni-route"> BREADCRUMB · KIND </div>
  <div className="ni-title"><div><h1/><p/></div><div className="ni-state"/></div>
  {avisos: !isPersisted / syncError}
  {conteúdo em <section className="ni-grid ni-grid--{kind}"> com <Panel/>}
</div>
```

Referências vivas: `Questoes.tsx` e `Revisoes.tsx` para `kind='practice'`;
não há admin migrado ainda — usar o componente `Admin()` do protótipo
(`ni-grid--admin`, `ni-card-row`, `ni-admin-queue`) e o CSS `.ni-grid--admin`
já presente.

### B.1 — `Sessao` (`/sessao`, kind `practice`)

Mais complexa das quatro. Estado e lógica intocados:

- `useSearchParams` → `?topic=` (**invariante #3**). O tópico da URL
  seleciona o bloco; fallback com `TOPIC_FALLBACK_WARNING` quando o tópico
  saiu do plano.
- `useDailyPlan` (blocos de hoje), `useQuestions` (mini-atividade de 3
  questões para `practice`/`error_analysis`/`review`), `useUserMastery`
  (SM-2 via `applyReviewOutcome` / `qualityFromStudyVerification`).
- Cronômetro (`formatTime`, `isRunning`, pausa/reset), `CrivoCore` reagindo
  ao estado da sessão, verificação pós-sessão (`StudyVerification`),
  `saveUserStudySession` + `addUserAttempt`.
- `SubjectAtmosphere` local com `focus` variável (`isRunning ? 1 : 0.45`) —
  **mantém-se**; é atmosfera data-driven como a do Dashboard, então a Sessão
  fica na lista de exceções do `RouteVisualShell` OU aceita o campo do shell
  e larga o próprio (decisão no plano; preferência: manter o local por causa
  do `focus` dinâmico, e adicionar `/sessao` à guarda do `RouteVisualShell`).

Composição nova: `ni-grid--practice` com dois `Panel` —
esquerda = lista "Blocos de hoje" + bloco em foco; direita =
`ni-session-side` com `ni-timer`, `Metric`s (tempo efetivo, questões da
mini-atividade), `CrivoCore`, e o fluxo de verificação. `Skeleton` de
carregamento e `EmptyState` ("Nenhum bloco planejado") reescritos com as
classes `ni-`. Avisos `!isPersisted` / `syncError` no lugar canônico
(após `.ni-title`).

### B.2 — `Admin` (`/admin`, kind `admin`)

`GET /api/admin/metrics` via `useAuth` token. Auth-gate: quando não-admin,
"Entre na conta administrativa." **permanece** (só reestilizado). Cards de
Requisições / Falhas / Tokens / Custo viram `ni-card-row` + `ni-metric-card`;
"Detalhamento diário" vira `ni-admin-chart`.

### B.3 — `AdminObras` (`/admin/obras`, kind `admin`)

`GET/POST /api/admin/literary`. Feature-flag `LITERARY_WORKS_ENABLED` —
o texto "Ativo só quando LITERARY_WORKS_ENABLED=true no servidor"
permanece. Botão "Semear as 18 obras do ciclo 2027", formulário de cadastro
(slug/título/autor/gênero), auditoria/segmentação — todos preservados,
reestilizados com `Panel` + `ni-admin-queue`.

### B.4 — `AdminConteudo` (`/admin/conteudo`, kind `admin`)

`GET/POST /api/admin/content`. "Migração inicial" (semear questões/métodos/
episódios idempotente), busca + filtros, formulário de questão (enunciado,
4 alternativas, gabarito, capítulo, explicação). Preservados, reestilizados.

### Testes B (TDD, por tela)

Cada tela ganha (ou estende) um `*.test.tsx` com mocks dos hooks/`fetch`
no padrão de `Diagnostico.test.tsx`:

- **Sessao** (`Sessao.test.tsx` já existe): estende — `?topic=` seleciona o
  bloco certo; `TOPIC_FALLBACK_WARNING` aparece quando o tópico saiu;
  cronômetro inicia/pausa; mini-atividade grava tentativa; verificação
  pós-sessão chama `saveUserStudySession`; aviso demo com `isPersisted:false`.
- **Admin / AdminObras / AdminConteudo** (novos): auth-gate renderiza
  "Entre na conta administrativa." sem token; com token admin, dispara o
  `fetch` correto; ações de semear/cadastrar chamam o endpoint certo;
  `LITERARY_WORKS_ENABLED` off mostra o aviso (AdminObras).

### Atualizações de registro

- `routeVisuals.ts`: já cobre as 4 rotas — conferir `subject`/`kind`
  (`/sessao` → practice/Matemática; `/admin*` → admin). Sem mudança
  esperada; `PRODUCTION_ROUTE_VISUAL_COUNT` continua 28.
- `FUNCTIONALITY_MAP.md`: marcar as 4 rotas como migradas; remover a linha
  do `RouteVisualShell`/`routePresentation` da tabela de módulos
  transversais se `routePresentation` for removido; ajustar a linha 51 para
  refletir que o shell é o dono do campo.

---

## Ordem de implementação (nunca deixa tela regredida)

1. **A4-shell:** novo shell envolve `<Outlet/>` em `RouteVisualShell`;
   restaura persistência do rail. `routePresentation` **continua existindo**
   e é aplicado como wrapper de conteúdo APENAS para rotas sem `.ni-main`
   (lista explícita: `/sessao`, `/admin`, `/admin/obras`, `/admin/conteudo`)
   — um `Set` transitório no shell. Verificar 24 telas + as 4 no navegador.
2. **B.2–B.4 (Admin×3):** migrar as três telas admin. Ao migrar cada uma,
   remover sua rota do `Set` transitório.
3. **B.1 (Sessao):** migrar; remover `/sessao` do `Set`; adicionar `/sessao`
   à guarda de atmosfera-própria do `RouteVisualShell`.
4. **Limpeza:** `Set` transitório agora vazio → remover; deletar
   `routePresentation.ts` + teste; deletar `Layout.tsx`; rodar
   `grep` por imports órfãos (`useSpotlight`, `CrivoMark`, `routePresentationFor`).
5. **Docs:** atualizar `FUNCTIONALITY_MAP.md` e conferir `routeVisuals.ts`.

Cada passo: `npm run lint` + `npm run test` verdes + verificação visual no
navegador contra o protótipo antes de seguir.

## Critérios de aceitação

- `src/App.tsx` importa só `NucleoInstrumentalProductionLayout`; `Layout.tsx`
  não existe mais.
- As 28 rotas renderizam com `.ni-route` + `.ni-title` + paleta por matéria
  e campo ambiente; nenhuma no visual Tailwind antigo.
- Zero perda funcional: todos os testes por tela cobrindo ações, estados
  vazio/carregando/erro/demo e parâmetros de URL passam.
- `npm run lint` e `npm run test` verdes; `grep -r ni-main src/views` cobre
  as 28; `grep -rE "useSpotlight|routePresentationFor|CrivoMark" src` vazio
  fora de arquivos deletados.
- `FUNCTIONALITY_MAP.md` atualizado.
