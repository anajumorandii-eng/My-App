# Expansão de questões reais — seis bancas

Entrega de 14/10/2026: **135 questões novas**, banco de **2.959 → 3.094**. Os 2.959 registros anteriores permanecem iguais, inclusive IDs, gabaritos e comentários; as chaves de progresso não mudam.

| Banca | Prova pareada | Novas | Cobertura desta entrega |
|---|---|---:|---|
| Unicamp | 2025, 1ª fase, Q/Z | 71 | Todas as válidas; Q53 anulada excluída |
| FUVEST | 2026, 1ª fase, V1 | 16 | Complemento das 40 existentes: 56 nesta edição; Q3 anulada excluída |
| Unesp | 2025, 1ª fase, V1 | 12 | Seleção das 90 objetivas |
| Famerp | 2025, dia 1, Conhecimentos Gerais, V1 | 12 | Seleção das 80 objetivas |
| Unifesp | 2025, dia 1, Português e Inglês, V1 | 12 | Seleção das 25 objetivas; nenhuma redação/discursiva convertida |
| Enem | 2022, dia 2, CD5 amarelo, aplicação regular | 12 | Seleção das 90 questões 91–180; Q175 anulada excluída |

As seleções não equivalem a provas completas. O Enem deste lote é de 2022, não de 2025/2026. O caderno 2025 foi localizado, mas seu gabarito primário não ficou acessível; não usamos respostas de outra edição. A Unicamp 2026, já publicada com 72 questões, permanece intacta.

## Como estudar

Em **Questões**, escolha a banca e o ano. Cada item identifica fase/dia, versão e número original. As 70 páginas físicas preservadas contêm o enunciado, figuras, fórmulas, alternativas visuais e textos compartilhados; toque na página para ampliar. A posição na fila de treino é distinta do número impresso da questão.

Depois da tentativa, o comentário apresenta gabarito oficial, conceito, cinco etapas de resolução, pegadinha, duas perguntas de recuperação e exercício autoral de transferência com critérios de resposta. Há links separados para prova e gabarito. As quatro alternativas da Unicamp e as cinco das outras bancas foram mantidas.

O lote Enem distribui três questões por disciplina: Biologia, Química, Física e Matemática. A seleção Unifesp abrange somente Português/Literatura e Inglês, conforme a prova objetiva real, sem inventar alternativas para a prova de conhecimentos específicos.

## Fontes e revisão editorial

- [Unicamp 2025: par Comvest e anulação](fontes-unicamp-2025.md).
- [FUVEST 2026: V1 e gabarito retificado](fontes-fuvest-expansao-2026.md).
- [Vunesp e Inep/RIEP: identidade, URLs e hashes dos pares](fontes-demais-bancas-expansao.md).
- [Revisão independente das 71 fichas Unicamp](revisao-unicamp-2025.md).
- [Revisão independente das 64 fichas das demais bancas](revisao-expansao-demais-bancas.md).

Famerp exige cuidado especial: o PDF antigo do acervo LFS tem alternativas em outra ordem. Esta entrega usa exclusivamente o caderno público de imprensa V1 e seu gabarito pareado, obtidos da Vunesp. Uma tentativa com o PDF LFS divergente foi recusada antes de gravar qualquer registro.

A revisão corrigiu a transferência de PA da Unicamp Q56 para somas realizáveis (77, 112, 153) e explicitou a escassez de peixes na transferência Unesp Q61. Também precisou a explicação Unicamp Q7. Ressalvas permanecem quando os dados exigem cuidado: associações climáticas sem prova de causalidade, limitações de um gráfico, composição química dependente das alternativas e a situação hipotética da genética de Drosophila.

As páginas Unicamp foram revisadas integralmente; nas demais bancas, as imagens decisivas e os contextos compartilhados foram inspecionados, além da leitura das questões e recálculo das resoluções e transferências. Não se afirma releitura integral das obras literárias nem cobertura integral das cinco seleções. A deduplicação considerou identidade, alternativas e trechos distintivos; parte do acervo antigo em apostilas não informa ano/versão, limitando comparações por metadados.

## Reprodução da importação

Fichas e manifestos ficam em `scripts/data/`, por edição; extrações dos gabaritos oficiais em `gabaritos/<BANCA>/`. Cada manifesto registra URLs, SHA-256 dos dois PDFs, texto de gabarito, seleção, anuladas e SHA-256 das páginas WebP. Não é necessário baixar todo o Git LFS.

```bash
npx tsx scripts/importar-expansao-oficial.ts \
  scripts/data/enem-2022-d2-cd5-source.json \
  /caminho/prova-oficial.pdf /caminho/gabarito-oficial.pdf
```

O padrão é conferência sem gravar; `--write` acrescenta apenas registros inéditos. O importador confere os bytes dos PDFs, texto e imagens antes de construir o lote; lê respostas pelo número explícito; rejeita versão trocada, faixa incompleta, anulada não registrada, currículo inválido, contexto sem mídia e conflito com ID existente. Repetir o mesmo lote é idempotente. Nenhuma rotina sobrescreve gabaritos antigos ou renumera o Enem como 1–90.

O teste de preservação compara o hash dos primeiros 2.959 registros e reconstrói os seis lotes contra o banco publicado. Os testes também cobrem troca de cor/dia no Enem, separação V1–V4 da FUVEST, exclusões oficiais, alternativas e páginas incompletas. As 70 páginas passaram por `scripts/conferir-marca-dagua.py`: zero ocorrências.

## Validação final

- Lint TypeScript e build de produção: aprovados.
- Suíte completa: 1.095 testes de servidor/bibliotecas e 3.153 de interface aprovados.
- Continuidade de Geografia: 160 testes aprovados; matriz visual: 13 testes aprovados e arquivos gerados sem alterações.
- Navegador Chromium com build de produção, modo demonstração: 12 cenários, seis bancas em 390×844 e 834×1112. Conferidos filtros/contagens, números originais, quatro/cinco alternativas, carregamento das imagens, comentário após resposta errada e URLs de prova/gabarito. Zero erros de JavaScript e zero transbordamento horizontal.
- Inspeção das capturas de Enem no celular e Unicamp no iPad: página original, indicação da questão e feedback visíveis; ampliação disponível pelo link da imagem.
- `git diff --check`: limpo. Nenhuma dependência ou interface do aplicativo foi alterada nesta expansão.
