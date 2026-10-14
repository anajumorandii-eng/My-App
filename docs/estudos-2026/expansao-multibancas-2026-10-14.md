# Expansão de questões reais — seis bancas

Entrega de 14/10/2026: **135 questões novas**, banco de **2.959 → 3.094**. IDs, gabaritos e comentários dos 2.959 registros anteriores foram preservados. Os 72 enunciados da Unicamp 2026 foram transcritos nesta PR, com correção da referência às alternativas gráficas da questão 13; a migração também acrescenta recortes e o sinalizador `statementComplete`. As chaves de progresso não mudam.

| Banca | Prova pareada | Novas | Cobertura desta entrega |
|---|---|---:|---|
| Unicamp | 2025, 1ª fase, Q/Z | 71 | Todas as válidas; Q53 anulada excluída |
| FUVEST | 2026, 1ª fase, V1 | 16 | Complemento das 40 existentes: 56 nesta edição; Q3 anulada excluída |
| Unesp | 2025, 1ª fase, V1 | 12 | Seleção das 90 objetivas |
| Famerp | 2025, dia 1, Conhecimentos Gerais, V1 | 12 | Seleção das 80 objetivas |
| Unifesp | 2025, dia 1, Português e Inglês, V1 | 12 | Seleção das 25 objetivas; nenhuma redação/discursiva convertida |
| Enem | 2022, dia 2, CD5 amarelo, aplicação regular | 12 | Seleção das 90 questões 91–180; Q175 anulada excluída |

As seleções não equivalem a provas completas. O Enem deste lote é de 2022, não de 2025/2026. O caderno 2025 foi localizado, mas seu gabarito primário não ficou acessível; não usamos respostas de outra edição. A Unicamp 2026 mantém suas 72 questões, IDs, classificação, respostas e comentários; seus enunciados passaram a ser texto.

## Como estudar

Em **Questões**, escolha a banca e o ano. Cada item identifica fase/dia, versão e número original. As 135 questões novas e as 72 da Unicamp 2026 têm enunciados transcritos. Figuras, gráficos, mapas, estruturas químicas e alternativas visuais aparecem como recortes, sem link na imagem. Tabelas e fórmulas foram preservadas no texto quando suficientes para responder. Textos e imagens compartilhados acompanham cada questão a que se aplicam. As 70 páginas físicas ficam preservadas como fontes. Por orientação da Ana Júlia, páginas inteiras não aparecem, inclusive nas questões antigas. Somente enunciado em texto e imagens do campo `figures` são exibidos, sem links nas figuras. A posição na fila de treino é distinta do número impresso da questão.

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

O padrão é conferência sem gravar; `--write` acrescenta apenas registros inéditos. O importador confere os bytes dos PDFs, texto e imagens antes de construir o lote; lê respostas pelo número explícito; rejeita versão trocada, faixa incompleta, anulada não registrada, currículo inválido, contexto sem mídia e conflito com ID existente. Repetir o mesmo lote é idempotente inclusive no banco publicado com `figures`: a comparação ignora o campo derivado quando a ficha não o fornece, preserva o registro existente e continua recusando alterações de gabarito, enunciado ou comentário. A ordem das propriedades JSON não cria um falso conflito. Nenhuma rotina sobrescreve gabaritos antigos ou renumera o Enem como 1–90.

O teste de preservação compara o hash do conteúdo dos primeiros 2.959 registros, após a migração dos enunciados da Unicamp 2026 e sem os campos aditivos `figures`/`statementComplete`. O teste de idempotência usa também o banco publicado completo, sem retirar os recortes. Os seis lotes são reconstruídos contra o banco publicado. Os testes também cobrem troca de cor/dia no Enem, separação V1–V4 da FUVEST, exclusões oficiais, alternativas e páginas incompletas. As 70 páginas passaram por `scripts/conferir-marca-dagua.py`: zero ocorrências.

## Continuidade da revisão — 14/10/2026

Concluídos os 36 enunciados pendentes: 12 Famerp, 12 Unifesp e 12 Enem. Conferência manual contra as páginas preservadas, incluindo poemas, textos-base completos, termos sublinhados, índices químicos e tabelas. Exemplos de dados que o OCR havia truncado: Famerp Q72 usa (4, −1, 3,5) e (10, 8, 8); Enem Q99 usa correntes 4, 4, 3; Enem Q130 preserva sete linhas e o isótopo ¹³¹I. Nenhuma alternativa ou resposta oficial desses 36 itens foi trocada.

Restaurados 15 recortes conferidos manualmente, com coordenadas e hashes de origem/saída em `scripts/data/recortes-oficiais-revisados.json`. Cinco questões também receberam o contexto visual compartilhado: Unicamp Q6/Q36/Q38 e Unifesp Q19/Q23. A Unicamp Q55 agora mostra os dois quadrados e os segmentos rotulados. As fórmulas estruturais da Famerp Q55, o robô da Unifesp Q16/Q19 e o infográfico da Q23/Q25 estão completos. Na questão Enem Q99, a continuação com alternativas deixou de ser tratada como figura; a tabela permanece.

A orientação posterior da Ana Júlia remove o apoio por página inteira, inclusive no acervo antigo. O componente mostra somente a transcrição e `figures`. Isso não significa que todo o acervo antigo recebeu transcrição ou recorte manual; as fontes `originalPages` são mantidas nos dados, sem exibição na tela.

No transcritor, a continuação de um texto-base compartilhado é acrescentada uma vez à lista comum, em vez de uma vez por referência. A palavra imediatamente anterior a `QUESTÃO` também é preservada; somente as chaves de numeração da Fuvest são excluídas. Falhas de `pdftotext`/Tesseract interrompem o comando. OCR continua sendo rascunho e requer conferência editorial.

```bash
python3 -m unittest discover -s scripts -p test_transcrever_enunciados.py
python3 scripts/conferir-recortes-oficiais.py
# Regenerar os mesmos pixels, conferindo todos os hashes antes de gravar:
python3 scripts/conferir-recortes-oficiais.py --write
```

## Apresentação sem páginas e sem fundo branco

A página inteira foi retirada sem exceções. As figuras não recebem âncora, link, fundo CSS branco nem moldura de página. `QuestionFigure` retira o papel branco no Canvas apenas na apresentação, sem alterar os arquivos oficiais, textos ou hashes de origem. Gráficos de traço usam transparência nas áreas de papel e tinta neutra do tema; cores das séries e legendas são preservadas. Em fotografias, mapas e tirinhas coloridas, o branco interno permanece quando pertence ao conteúdo — letras brancas e detalhes do objeto não são apagados. A troca do tema atualiza a apresentação.

A renderização é determinística e não usa redesenho generativo das provas. O cache de imagens derivadas é limitado. Fontes locais da entrega são conferidas no navegador; uma fonte externa que impeça leitura por CORS mantém sua imagem original legível.

## Validação final

- Lint TypeScript e build de produção: aprovados após as correções.
- `npm test`: 1.100 testes de servidor/bibliotecas e 3.158 de interface aprovados após a remoção das páginas e a integração das figuras.
- Transparência: dois testes verificam remoção do papel, preservação das cores, conservação de letras brancas internas e ausência de mutação dos pixels originais.
- Python: dois testes de regressão (continuação compartilhada e falha do OCR) aprovados.
- 15 fontes/recortes conferidos por SHA-256; regeneração dos mesmos pixels aprovada. OCR da faixa inferior dos 15 recortes novos: zero marcas d’água.
- Chromium com build de produção: 106 cenários, 53 questões em 390×844 e 834×1112. Inclui todos os 36 novos enunciados, os recortes restaurados, contextos compartilhados e três questões antigas verificadas sem exibição de páginas. Texto integral, número de alternativas, URLs/decodificação das imagens e feedback após resposta errada conferidos; zero erros de JavaScript e zero transbordamento horizontal.
- Temas: 12 cenários adicionais, três figuras em celular/iPad e claro/escuro. Alfa real positivo, ausência de fundo CSS/links e tinta neutra do tema conferidos. Capturas Famerp Q55 claro/escuro inspecionadas: fórmulas e rótulos legíveis sobre o fundo da tela. Reprodução: `node scripts/auditOfficialFigureThemes.mjs`; capturas em `crivo-pr328-themes`, no diretório temporário.
- Comparação com `a3f9149a`: 3.094 IDs, opções, respostas, comentários e classificações preservados; somente 36 campos `prompt` alterados. Zero instruções “Leia o enunciado original” restantes.
- `git diff --check`: limpo.

A auditoria do navegador seleciona uma questão real por cenário pela resposta de `/questions.json`; verifica a renderização e a tentativa, sem afirmar nova validação das contagens dos filtros ou persistência no Firestore. Reprodução: inicie `npm run preview -- --host 127.0.0.1 --port 4173` após o build e execute `node scripts/auditOfficialExpansion.mjs`. Relatório e capturas são gravados no diretório temporário `crivo-pr328-browser`.
