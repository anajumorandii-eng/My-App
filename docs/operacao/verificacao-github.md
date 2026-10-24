# Tempo de verificação no GitHub

## Referência medida

Na execução CI 40132809631, de 24/10/2026, o job único levou aproximadamente 15min30s. Os testes unitários consumiram 4min22s; o bloco de navegação/visual, 8min53s. O workflow Verificar pull request repetiu lint, interface, continuidade editorial e build, levando mais 6min42s em paralelo.

## Organização proposta

- `build`: lint, continuidade do registro, continuidade editorial e build. Publica somente index.html, assets compilados e servidor empacotado.
- `node-tests`: servidor e bibliotecas; garante `pdftotext` somente se ausente.
- `interface-tests`: mesma seleção de arquivos de `test:vitest`, distribuída em três shards pelo Vitest.
- `browser-tests`: navegação, recuperação e três shards de História/Geografia. Reaproveita o build e restaura os arquivos públicos do mesmo checkout; não recompila nem transfere as cópias de todos os PDFs e imagens públicos.
- `lint-and-test`: mantém o contexto já publicado e só passa quando todos os grupos passam. Falha, cancelamento ou grupo ignorado impedem o sucesso do gate.
- `Verificar pull request`: mantém o contexto publicado e a conferência da matriz visual; as checagens antes duplicadas ficam no CI.

Atualizar a mesma PR cancela a execução antiga do CI. Os shards não cancelam seus irmãos quando há falha: todos continuam fornecendo diagnóstico. A proteção de branch não foi alterada.

Os 12 cenários HG continuam cobrindo os mesmos 30 capítulos, tamanhos, temas e preferências de movimento. Cada shard executa quatro cenários com um worker. `--fully-parallel` permite distribuir testes dentro do arquivo; o worker único mantém a execução local de cada shard serial.

## Validação e limites

Validar os workflows com actionlint, comparar a lista dos cenários Playwright entre os shards e conferir que o build reconstruído a partir do artifact e de public equivale ao build original (exceto o source map do servidor, desnecessário à execução). A suíte completa e o lint continuam obrigatórios antes do push.

A duração real depende da fila e da disponibilidade de runners. A estimativa deve ser substituída pelo tempo observado na primeira execução desta proposta; não há garantia de prazo fixo. O paralelismo aumenta a quantidade de jobs simultâneos. Não foram removidos testes para obter a redução.
