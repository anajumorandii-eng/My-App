# Escopo, fontes e proveniência

## FATO DO PRODUTO — janela de provas

Segundo `provas brutas/README.md`:

- FUVEST, Unicamp, Unesp, Famerp e Unifesp: ciclos 2023–2026;
- ENEM: edições 2022–2025.

A edição 2026 do ENEM ainda não tinha ocorrido quando a janela foi definida.

## FATO DO PRODUTO — fonte primária

O diretório `provas brutas/` foi estruturado para guardar provas oficiais por banca/ano/fase. O manifesto `provas brutas/fontes-oficiais.json` registra páginas oficiais.

Critérios do repositório:
- incluir 1ª e 2ª fase quando existirem;
- manter os dois dias quando a prova tiver dois cadernos;
- manter ambos os dias do ENEM;
- excluir simulados;
- não confundir vestibular regular com residência, transferência ou processo de meio de ano;
- preferir fonte oficial;
- subir prova com gabarito/resposta esperada.

## FATO DO PRODUTO — incerteza

Questão não extraída de documento oficial pode receber `uncertain: true` e nota de reconstrução.

Para critérios de redação sensíveis ao ano, `src/data/essayModule.ts` também usa `uncertain` e notas de cautela.

## FATO DO PRODUTO — incidência de temas

`src/data/examPriorities.ts` declara como fonte o relatório “Anglo Analisa Região Sudeste”, com incidência de 2023–2025 e percentuais baseados no ano mais recente disponível.

Isso é **fonte secundária**, não equivalente a documento oficial da banca.

## Regra para o notebook

Toda afirmação sobre banca deve ter, quando aplicável:
- banca;
- ciclo/ano;
- fase;
- fonte;
- data de verificação;
- confiança;
- se é regra oficial, inferência por análise de provas ou estratégia pedagógica.

## Fontes no repositório

- `provas brutas/README.md`
- `provas brutas/fontes-oficiais.json`
- `src/data/examPriorities.ts`
- `src/data/examCalendar.ts`
- `src/data/essayModule.ts`
