## Prompt de continuidade atualizado

```text
Retome as obras literárias no repositório My-App, branch claude/focused-volta-bnzw7d. Leia CLAUDE.md e docs/obras-2027/CONTINUIDADE.md, especialmente o último checkpoint, e confira git status e os commits antes de agir.

Funerais da Mamãe Grande, No seu pescoço e Gonzaga de Sá já foram escritos, integrados ao loader e conferidos, cada um em um commit. Não refaça esses dossiês. Tudo continua needs_review; a conferência literal não é aprovação editorial.

Comece por Memórias póstumas de Brás Cubas. A leitura integral das 134 páginas da edição Câmara 2018 já foi feita. Leia docs/obras-2027/leitura-bras-cubas.md e docs/obras-2027/rascunhos/bras-cubas-notas-1-160.txt: há mapa dos 160 capítulos, análises dos 160 capítulos, limites da extração e inspeção visual de passagens ausentes. Use as notas e escreva o JSON, sem inventar leitura ou crítica. Prepare os PDFs e textos paginados conforme CONTINUIDADE.md; não versione esses materiais nem faça merge de main.

Use a habilidade fornecida no ZIP: obras-obrigatorias-fuvest-unicamp-avancada (referida antes como analise-literaria-fuvest-unicamp). O caminho local e seus requisitos estão no documento de continuidade. Registre Brás Cubas em src/lib/workDossiers.ts depois da validação. Um commit por obra; antes dele execute python3 scripts/conferir-dossie.py conferir bras-cubas. Preserve IDs e progresso existentes.

Depois registre cobertura e limitações por obra, finalize pesquisa acadêmica rastreável necessária à revisão editorial sem atribuir fontes não lidas, e execute lint, npm test completo e npm run build. Confira as verificações já feitas no checkpoint; repita quando as mudanças novas justificarem. Faça push e abra PR com base fix/obras-obrigatorias, sem merge. As funcionalidades técnicas do antigo checkpoint não fazem parte desta retomada. Pode seguir automaticamente.
```
