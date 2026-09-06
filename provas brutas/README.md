# Provas brutas

Suba aqui os PDFs das provas oficiais dos vestibulares. É a partir deles que o
acervo de questões reais do app (`src/data/discursiveQuestions.ts`, para a 2ª
fase, e `public/questions.json`, para as objetivas) é preenchido **sem
reconstrução** — com enunciado, itens e gabarito conferidos contra o documento
original.

Hoje as questões do acervo que não vieram de PDF estão marcadas com
`uncertain: true` e uma nota explicando o que foi reconstruído. Toda questão
extraída daqui pode perder essa marca.

## Como subir

Arraste os arquivos para esta pasta pelo GitHub (`Add file → Upload files`) ou
por `git add`. Os `.pdf` desta pasta já estão configurados para **Git LFS** no
`.gitattributes`, igual às apostilas — não precisa fazer nada além de subir.

Nada aqui é lido pelo app em tempo de execução: são material de origem, usados
só para gerar conteúdo.

## Como nomear os arquivos

O nome é o que identifica banca, ano e fase — o script de extração lê essa
informação do nome, então vale seguir o padrão:

```
<banca> <ano> - <fase> - <complemento>.pdf
```

Bancas reconhecidas: `Fuvest`, `Unicamp`, `Unesp`, `Famerp`, `Unifesp`, `ENEM`.

Exemplos:

```
provas brutas/
├─ Fuvest 2026 - 2a fase - dia 2 - prova.pdf
├─ Fuvest 2026 - 2a fase - dia 2 - respostas esperadas.pdf
├─ Fuvest 2026 - 1a fase - prova V1.pdf
├─ Fuvest 2026 - 1a fase - gabarito.pdf
├─ Unicamp 2026 - 2a fase - dia 2 - prova.pdf
├─ Unicamp 2026 - 2a fase - resolucao comentada.pdf
├─ Famerp 2025 - conhecimentos especificos - prova.pdf
├─ Unifesp 2025 - prova II - prova.pdf
├─ ENEM 2024 - dia 2 - caderno amarelo - prova.pdf
└─ ENEM 2024 - dia 2 - caderno amarelo - gabarito.pdf
```

Use `1a`/`2a` sem acento e sem `ª` para o nome do arquivo não quebrar em
sistemas diferentes. Acento no resto do nome é aceitável, mas evitar é melhor.

## O que vale a pena subir

Em ordem de utilidade para o acervo:

1. **Prova + gabarito/respostas esperadas do mesmo ano e fase.** Sem o gabarito
   oficial, a resposta-modelo continua sendo elaborada por mim, e a questão
   entra com ressalva. Com ele, a correção é a da própria banca.
2. **2ª fase (discursivas)** de Fuvest, Unicamp, Famerp e Unifesp — é o que
   alimenta o Treino de 2ª Fase, e é onde o acervo está mais curto.
3. **1ª fase e ENEM (objetivas)** — alimentam o banco de questões com o campo
   `examSource`, que hoje tem só 10 itens de 1.652. É o que faz o filtro "só
   provas reais" da tela de Questões deixar de ser quase vazio.
4. **Resoluções comentadas de cursinho**, se você já tiver. Não substituem o
   gabarito oficial, mas ajudam a redigir a explicação.

Provas de anos anteriores também são bem-vindas: repetição de tema entre anos é
justamente o que o app usa para calcular prioridade de estudo.

## Depois de subir

Me avise nesta conversa. O passo seguinte é:

```bash
npx tsx scripts/extract-provas.ts
```

Isso gera `provas-extraidas/` (ignorada pelo git, como
`materiais-extraidos/`) com um `.txt` por PDF, separado por página, que eu uso
para transcrever as questões com fidelidade.

Se algum PDF for escaneado (imagem, sem camada de texto), o script avisa — esse
caso precisa de OCR, e aí serve o `scripts/ocr-apostila.sh`, que já existe no
repo para as apostilas.

## Direitos autorais

Provas oficiais de vestibular são públicas e distribuídas pelas próprias
bancas, então ficam versionadas aqui. Isso é diferente das apostilas em
`materiais brutos/`, cujo texto extraído é mantido fora do git (ver
`.gitignore`). Se você subir aqui algum material de cursinho que não seja de
distribuição livre, me diga para eu tratá-lo com a mesma regra das apostilas.
