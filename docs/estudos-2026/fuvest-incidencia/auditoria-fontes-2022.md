> Registro da primeira leitura editorial. As conciliações posteriores de assuntos, vínculos e habilidades estão nos arquivos de revisão desta pasta e no corpus final; os exemplos de classificação deste registro inicial podem ter sido alterados.

# FUVEST 2022 — audit of source reading

Reviewed 2026-10-18 by one editor. Coverage complete: 90 first-phase questions (version V), ten day-one language/literature questions plus one writing proposal, and all 36 questions in the second-day bank. Total 137 retained records, 136 included in primary incidence. The official corrected answer key dated 15/12/2021 marks **V54 annulled**; its classification is retained and excluded from counting.

## Sources and evidence

Official archive: https://www.fuvest.br/acervo-vestibular-2022/ . Canonical papers downloaded as real PDFs into `/workspace/work/fuvest-incidence/2022/`, rather than repository LFS pointers. Source manifest URL, SHA-256, byte count and physical page count are embedded in the owned JSON. First phase: 26 physical pages; day one: 14; day two: 38. The official day-two cover states that the full bank contains 36 questions and candidates taking four subjects receive the first three questions of each.

All paper texts were extracted with `pdftotext -layout`. Day-one fonts yielded corrupted extracted glyphs, so all six pages containing prompts (physical pages 2, 4, 6, 8, 10 and 12) were rendered and read directly, including the essay's five source texts and single dissertation proposal, “As diferentes faces do riso”. OCR was attempted but did not provide useful text; classification relied on actual page images. First-phase and day-two page contact sheets were inspected to resolve visual content (maps, graphs, diagrams, comic strips, chemical structures and art), with textual reading of every question. The answer-key PDF was read and its annulment explicitly checked. The archive lists the two second-phase question papers but no expected-answer PDF; therefore their answerKeyUrl fields remain null rather than inventing a source.

## Classification choices

One primary subject/topic per question. Twenty-two records have medium confidence, explicitly noted in JSON. F1 V80 is Arte (Portinari's *Os retirantes*) with null topicId because the existing taxonomy has no substantive Arte topic. V85 is História/Renascimento because its command asks for Renaissance proposals represented in Leonardo's drawing. V87 is Literatura/Modernismo because the decisive operation compares literary manifestos. V27 is Portuguese text comprehension of Bosi's critical essay; it requires no specific work identification. V89 uses contemporary political philosophy for agonism/antagonism; Sociology is a plausible alternate primary.

V05 quantitative graph reading is Mathematics; V40 unit-prefix ratio is Mathematics; V57 distance divided by constant velocity is Physics. Their scientific contexts do not create additional primary counts. V06 uses socio-spatial comparison of urban health and HDI. V62 integrates atmospheric circulation and tides, with hydrology related separately. V65's Ruanda conflict is contemporary regional geopolitics. V14 associates two chemistry achievements and the DNA discovery, recorded with required Biology as related. Literature remains separate from Portuguese.

Day-one P03 combines song interpretation and syntactic expansion of ambiguous gerund clauses; primary Syntax and related Literature. Day-two F02, Q03, Q04, Q06 and H03 combine multiple chapters; each has one declared primary and related concepts. G01's unlettered third command is recorded as subitem c, with explicit note.

## Verification

Validated 137 unique phase-local identifiers, complete expected numbering, source hashes and real page bounds. Subject totals across all retained items: Mathematics 19; Biology 17; Chemistry 17; Portuguese 15; Geography 15; Physics 15 (14 included after V54 exclusion); History 15; Literature 11; English 8; Philosophy 2; Sociology 1; Arte 1; Writing 1. Source file format and all existing topicId/subject pairs were checked against taxonomy. No question text or long quotations reproduced in corpus summaries.
