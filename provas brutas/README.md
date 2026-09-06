# Provas brutas — vestibulares de Medicina

Acervo de provas anteriores para estudo, priorizando fontes oficiais. É a
partir daqui que o acervo de questões reais do app é preenchido **sem
reconstrução** — com enunciado, itens e gabarito conferidos contra o documento
original:

- `src/data/discursiveQuestions.ts` — questões discursivas de 2ª fase, usadas no
  Treino de 2ª Fase;
- `public/questions.json` — questões objetivas; as que vêm de prova real levam o
  campo `examSource` e alimentam o filtro "só provas reais".

Questões que não vieram de PDF oficial ficam marcadas com `uncertain: true` e
uma nota explicando o que foi reconstruído. Uma questão extraída daqui pode
perder essa marca.

## Janela adotada

- FUVEST, Unicamp, Unesp, Famerp e Unifesp: ciclos 2023, 2024, 2025 e 2026.
- ENEM: edições completas 2022, 2023, 2024 e 2025 (a edição 2026 ainda não
  ocorreu em 05/09/2026).

## Estrutura

```
provas brutas/
  FUVEST/{2023,2024,2025,2026}/
  UNICAMP/{2023,2024,2025,2026}/
  ENEM/{2022,2023,2024,2025}/
  UNIFESP/{2023,2024,2025,2026}/
  FAMERP/{2023,2024,2025,2026}/
  UNESP/{2023,2024,2025,2026}/
```

O nome do arquivo identifica banca, ano e fase — o extrator lê essa informação
do caminho e do nome. Exemplos que seguem o padrão em uso:

```
FUVEST/2026/FUVEST_2026_2a_fase_2o_dia.pdf
UNICAMP/2025/UNICAMP_2025_2a_fase_2o_dia_Biologicas_Saude.pdf
UNIFESP/2026/UNIFESP_2026_prova_discursiva.pdf
ENEM/2024/ENEM_2024_dia_2_caderno_azul.pdf
```

## Critério

- Incluir 1ª e 2ª fase quando o vestibular tiver duas fases.
- Quando a prova ocorrer em dois dias, manter os dois cadernos/dias.
- No ENEM, manter 1º e 2º dia.
- Não usar simulado como prova oficial.
- Não confundir processo seletivo de transferência, residência ou meio de ano
  com o vestibular regular.
- Preferir sempre a fonte oficial da banca/universidade.
- Para Vunesp (UNESP/FAMERP), a página pública identifica o vestibular, mas o
  item "Provas e Gabaritos" atualmente redireciona para login; por isso não deve
  ser substituído silenciosamente por cópia de terceiros.

Veja `fontes-oficiais.json` para o inventário das páginas oficiais.

**Suba o gabarito junto com a prova.** Sem o gabarito oficial (ou as "respostas
esperadas", no caso da FUVEST), a resposta-modelo continua sendo elaborada e a
questão entra com ressalva. Com ele, a correção passa a ser a da própria banca.

## Git LFS — obrigatório

Os `.pdf` desta pasta são versionados por **Git LFS**, configurado em
`.gitattributes` com o padrão `provas brutas/**/*.pdf` (o `**` é necessário
porque os arquivos ficam em subpastas por banca e ano).

Commitar PDF aqui **sem** LFS incha o histórico do git de forma permanente:
apagar o arquivo depois não recupera o espaço, porque o blob continua no
histórico. Antes de commitar, garanta que o git-lfs está instalado e ativo:

```bash
git lfs install
git lfs track "provas brutas/**/*.pdf"   # já está no .gitattributes
git lfs status
```

Os scripts de sincronização em `scripts/sync_*.py` e seus workflows fazem isso
automaticamente. Se você subir arquivos pela interface do GitHub, o LFS é
aplicado pelo `.gitattributes` do servidor.

## Como extrair o texto

```bash
npx tsx scripts/extract-provas.ts            # extrai o que ainda não foi extraído
npx tsx scripts/extract-provas.ts --force    # reextrai tudo
npx tsx scripts/extract-provas.ts FUVEST     # só arquivos com "FUVEST" no caminho
```

Isso gera `provas-extraidas/` (ignorada pelo git, como `materiais-extraidos/`)
com um `.txt` por PDF, separado por página — o insumo para transcrever as
questões com fidelidade.

O script avisa quando um PDF é escaneado (sem camada de texto) e quando encontra
um ponteiro LFS que não foi baixado (`git lfs pull`). Para os escaneados, use o
`scripts/ocr-apostila.sh`, que já existe no repo para as apostilas.

## Direitos autorais

Provas oficiais de vestibular são públicas e distribuídas pelas próprias bancas,
então ficam versionadas aqui. Isso é diferente das apostilas em
`materiais brutos/`, cujo texto extraído é mantido fora do git (ver
`.gitignore`). Material de cursinho que não seja de distribuição livre deve
receber o mesmo tratamento das apostilas.
