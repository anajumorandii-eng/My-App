# Conteúdo e revisão de Ciências — 01/10/2026

Etapa local em `main`, após conferir novamente `origin/main` em `6cbc94cdb46048d00947db136ae529e1c6ef41af`. Prossegue a retomada com recuperação de conteúdo e revisão dos mecanismos existentes, preservando o histórico da estudante.

## Fuvest 2025

Os 90 enunciados de marcador da prova V1 foram substituídos pelo texto da prova. Recuperadas as alternativas textuais de 88 questões; as questões 60 e 69 têm alternativas gráficas, mantidas nas imagens originais e identificadas explicitamente como tal na tela. Não foram inventadas descrições dos gráficos.

O PDF foi obtido do objeto Git LFS do próprio repositório e conferido contra o SHA-256 `f512449b47ac31abe1ae00d5f88fb14478c7139fa1db137145b7e33cec1b97c8`, versão V1, 34 páginas. PDF, extração integral e arquivo intermediário de aplicação ficam fora do Git.

A recuperação conserva os textos-base compartilhados das questões 10/11, 27–29, 37/38, 41/42, 65/66 e 73/74. Notas “Note e adote” foram incorporadas ao enunciado, separadas da alternativa E. Índices e expoentes foram reconstruídos a partir das posições dos caracteres; frações e glifos matemáticos especiais foram conferidos contra as fórmulas originais. A verificação inclui o efeito Compton, progressões, volumes de cilindros e potências de dez.

Verificação independente do delta:

- 2.887 questões mantidas; apenas as 90 questões `fuvest_2025_q*` tiveram enunciado e texto das alternativas modificados. As outras 2.797 não mudaram.
- IDs, IDs de alternativas, classificação, imagens, comentários e gabaritos permanecem iguais.
- Os 90 gabaritos foram comparados novamente com a tabela V1 oficial: nenhuma divergência ou troca de chave.
- Consulta somente em leitura ao catálogo compartilhado não encontrou documentos para os 90 IDs na data da conferência. Não foi feita publicação ou gravação no Firestore.

Procedimento reproduzível, usando o PDF completo e conferido:

```bash
python3 scripts/recuperar-fuvest-2025.py /caminho/fora-do-git/prova-v1.pdf --output /tmp/recuperacao-fuvest.json
python3 scripts/recuperar-enunciado.py /tmp/recuperacao-fuvest.json
```

O importador antigo `import-fuvest-pages.py` ainda produz os marcadores iniciais; se for utilizado novamente, executar a recuperação em seguida. Os novos testes do banco impedem que esses marcadores voltem a passar pela suíte. Comentários que atualmente dizem apenas o gabarito continuam sendo uma pendência editorial; esta etapa não é uma rodada de resoluções comentadas.

## Osmose e estudo gráfico de lentes

A fila documental mais recente de Ciências pede completar a conferência dos mecanismos já implementados. Foram examinados `summary-biologia-membranas-celulares` e `summary-fisica-lentes-esfericas-estudo-grafico`, sem modificar as relações matemáticas, as evidências pedagógicas ou o progresso.

Na lente divergente, os rótulos “objeto” e “imagem” se sobrepunham para o objeto a 42 unidades. O problema foi reproduzido nas três larguras e nos dois temas. O rótulo do objeto foi deslocado para cima; a medição das caixas de texto no navegador passou depois da correção.

Conferência de 36 estados em Chromium: três estados por capítulo, 390/768/1440 px, claro/escuro e movimento reduzido. Osmose: meios hipo/iso/hipertônico, retração vegetal e continuidade das trocas em isotonia. Lentes: objeto no foco, imagem virtual de convergente e divergente. Nenhum overflow horizontal, erro de página, coordenada não finita ou colisão entre os dois rótulos após a correção.

Em desktop, teclado acionou os controles e a animação terminou no estado final. A navegação por teclado percorreu Explorar → Testar → Reconstruir → Explorar nos dois capítulos. Em telas menores, a osmose foi acessada pela aba Relações; o mecanismo principal de transporte fica em Essencial.

Capturas e medições: [pasta de evidências](visual-personalizado/screenshots/revisao-ciencias-2026-10-01/), incluindo `audit.json`, `movimento-teclado.json` e a captura anterior à correção. As capturas isolam o mecanismo; o cabeçalho móvel fixo foi ocultado somente na captura para não cobrir o desenho.

Os dois capítulos passaram a **em validação**, com aprovação editorial pendente. Inventário atualizado: 613 capítulos, 532 sem revisão, 81 em validação e zero aprovados. Essa revisão técnica de dois mecanismos não conclui as três matérias nem as 613 representações.

## Validação e limites

- Novas verificações do banco falharam nos marcadores anteriores e passaram após a recuperação; 11 testes de conteúdo/higiene aprovados.
- Suíte completa aprovada: 782 testes Node e 760 testes Vitest, 1.542 no total. Após o ajuste visual, os 12 testes específicos de lentes/mecanismos também passaram; o inventário foi regenerado e seus quatro testes passaram.
- Chromium: dez verificações de Questões em 390/1440 px, usando as questões 10, 19, 60, 69 e 70 recuperadas, com enunciado integral, seleção de resposta, imagens carregadas e ausência de overflow/exceções. O banco foi limitado a uma questão por vez somente na sessão de teste para atingir cada caso; nenhuma implementação de busca/filtro foi alterada.
- TypeScript e build de produção aprovados; continuam os avisos de tamanho dos chunks de Visual e dos resumos.

As mudanças permanecem locais, sem publicação. Nenhum registro pessoal foi limpo, recalculado ou alterado. A revisão visual segue por lotes com evidências e aprovação editorial separada; permanecem as resoluções comentadas da Fuvest e as demais pendências do conteúdo e das cenas.
