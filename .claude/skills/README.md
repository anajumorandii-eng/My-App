# Skills do projeto

As 36 skills daqui sao copia das de `.agents/skills/`, que e o formato lido pelo
Codex (cada uma com um `agents/openai.yaml` ao lado). O Claude Code nao le aquele
diretorio: ele procura `.claude/skills/<nome>/SKILL.md`. Enquanto existia so a
copia do Codex, nenhuma delas era carregavel aqui — inclusive a
`git-guardrails-claude-code`, que traz um hook escrito para o Claude Code.

O `agents/openai.yaml` de cada skill nao foi copiado: descreve a interface do
Codex e nao tem uso deste lado.

## Ao atualizar

`skills-lock.json` continua sendo a fonte da verdade — ele trava origem
(`mattpocock/skills`) e hash de cada SKILL.md. Uma atualizacao vinda de la cai
em `.agents/skills/`; depois disso as duas copias precisam voltar a bater:

```bash
for d in .agents/skills/*/; do n=$(basename "$d")
  rm -rf ".claude/skills/$n" && mkdir -p ".claude/skills/$n"
  (cd "$d" && find . -type f ! -path "./agents/*" -exec cp --parents {} "$PWD/../../../.claude/skills/$n/" \;)
done
```

Conferir que ficaram iguais:

```bash
for d in .agents/skills/*/; do n=$(basename "$d")
  diff -r --exclude=agents "$d" ".claude/skills/$n" >/dev/null || echo "DIVERGE: $n"
done
```

Copia em vez de link simbolico porque o repositorio tambem e usado no Windows,
onde link simbolico exige privilegio ou modo desenvolvedor.

## Nome repetido

`code-review` existe aqui e tambem como skill embutida do Claude Code. A do
projeto tem precedencia — e a desta pasta que roda.
