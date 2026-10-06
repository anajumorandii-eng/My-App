# Obras 2027 — continuidade (06/10/2026)

Branch: `claude/focused-volta-bnzw7d`, criada a partir da PR #272
(`fix/obras-obrigatorias`, `1bd7d4a3`). **Não** fazer merge da main nesta
branch: traria os PDFs de `obras-brutos/` para o diff. A PR desta branch deve
ter como base `fix/obras-obrigatorias`. Ainda não há PR aberta (o conector do
GitHub falhou com 403 nesta sessão).

O checkpoint `feat/obras-estudo-e-treino` / `eb2836d9` e
`/workspace/artifacts/obras-checkpoint` nunca chegaram ao remoto; o trabalho
foi refeito aqui a partir da #272. As correções técnicas citadas naquele
checkpoint (autenticação, gabarito após tentativa, histórico, revisão ativa,
navegação, catálogo 2027) **não existem** neste repositório e não foram
reimplementadas.

## Como preparar o ambiente (texto extraído nunca vai para o git)

```bash
mkdir -p materiais-extraidos/obras-pdf
git ls-tree -r --name-only -z origin/main obras-brutos | while IFS= read -r -d '' f; do
  git show "origin/main:$f" > "materiais-extraidos/obras-pdf/$(basename "$f")"; done
# nomes em NFD: paginar com o slug certo, p.ex.
python3 scripts/conferir-dossie.py paginar <slug> "materiais-extraidos/obras-pdf/<arquivo>.pdf"
python3 scripts/conferir-dossie.py conferir          # cartões + aspas das análises
```

## Feito

- FUVEST (9 dossiês da #272): todas as citações e aberturas conferem com os
  PDFs que chegaram na main. Corrigido o Opúsculo (cap. LXI pertence à parte
  indígena, p. 146-159; conclusão = LXII, p. 159-162; IDs preservados). Teste
  novo recusa parte que termina depois do início da seguinte.
- `conferir-dossie.py` agora confere também as aspas das análises/guias.
- Unicamp, em `needs_review`, cada um com commit próprio:
  Canções escolhidas (007cea4b), Prosas seguidas de Odes mínimas (84b3cd88),
  A vida não é útil (eafb40d5), Olhos d'água (7e1bd121),
  Morangos mofados — 6 contos (7b478fba).
- Varredura de dados pessoais na camada de texto dos PDFs: só e-mails de
  editora. Marca d'água em imagem não foi verificada.

## Falta

1. **Os funerais da Mamãe Grande** (slug `funerais-da-mamae-grande`) — lido
   inteiro; falta escrever o JSON. Record, e-book 2019, trad. Édson Braga
   (p. 5-6). Contos e páginas do PDF (título em página própria):
   A sesta da terça-feira 8-12; Um dia desses 13-15; Nesta terra não há
   ladrões 16-32; A prodigiosa tarde de Baltazar 33-38; A viúva Montiel 39-43;
   Um dia depois do sábado 44-57; As rosas artificiais 58-62;
   Os funerais da Mamãe Grande 63-72. Usar `opening` = título do conto.
   Trechos já localizados (conferir com o script): "Era um homem muito bom."
   (p. 12); "O senhor vai nos pagar agora vinte mortos, tenente." (p. 15);
   "Nesta terra não há ladrões. Todo mundo conhece todo mundo." (p. 19);
   "porque você é ainda mais burro do que ladrão" (p. 32); "Afinal de contas,
   eu a fiz para isso." (p. 37); "O mundo está malfeito" (p. 41);
   "Quando seu braço ficar dormente." (p. 43); "A vida de um animal — disse o
   padre — é tão importante para o Senhor quanto a de um homem." (p. 49);
   "Hotel Macondo" (p. 51); "Se você quer ser feliz, não se confesse com
   estranhos." (p. 61); patrimônio invisível (p. 68); "lição e escarmento das
   gerações futuras" (p. 72). Ligações com Macondo/Aureliano Buendía nas
   p. 11, 48-49, 65-66, 71. PDF de site de download (p. 3).
2. **No seu pescoço** (12 contos; tradutor/edição não identificados — ver
   AUDITORIA_FASE0), **Vida e morte de M. J. Gonzaga de Sá** (Wikisource),
   **Memórias póstumas de Brás Cubas** — ler inteiros antes de escrever.
3. Registrar cada slug em `src/lib/workDossiers.ts`.
4. Registro de cobertura e limitações neste diretório (por obra: leitura
   integral feita, edição, procedência, pendências).
5. `npm run lint`, `npm test` completo, `npm run build`; push; abrir PR com
   base `fix/obras-obrigatorias`, sem merge.

## Regras que valem em todo dossiê

Tudo `needs_review`; `sourceRefs: []` (nenhuma crítica lida); citações ≤ 30
palavras, literais, com página; prefácios/introduções das edições não usados;
inferências e fatos externos marcados como tais em Fontes; não inventar
página, fonte ou leitura; não commitar PDF nem texto extraído.

## Prompt para retomar

> Retome as obras literárias no repositório My-App, branch
> `claude/focused-volta-bnzw7d`. Leia CLAUDE.md e
> `docs/obras-2027/CONTINUIDADE.md`, prepare o ambiente como descrito ali e
> continue pela seção "Falta", começando pelos Funerais da Mamãe Grande.
> Use a habilidade analise-literaria-fuvest-unicamp. Um commit por obra,
> conferência com `scripts/conferir-dossie.py conferir` antes de cada um.
> No fim: lint, npm test, build, push e PR com base `fix/obras-obrigatorias`,
> sem merge.
