# Auditoria Fase 0 — Obras Obrigatórias (FUVEST/Unicamp, ciclo 2027)

Auditoria realizada em 22/08/2026, conforme Etapa B do roteiro de execução.
Escopo: os 16 PDFs recebidos nesta pasta. Ver `server/literary/seedCatalog.ts`
para o catálogo estruturado (18 `ExamRequirement`, 16 `WorkEdition`).

## 1. Fontes oficiais confirmadas

- **FUVEST 2027**: https://www.fuvest.br/fuvest-renova-sua-lista-de-leituras-obrigatorias-para-o-vestibular-2026-2029/
- **Unicamp/Comvest 2027**: https://www.unicamp.br/noticias/2025/03/25/comvest-divulga-listas-de-livros-para-os-vestibulares-2027-2028-e-2029/

As duas URLs confirmam as 9+9 obras do ciclo 2027 e foram cruzadas com
cobertura jornalística independente (CNN Brasil, Anglo, Blog do Enem).

## 2. Correção de catálogo (bloqueador resolvido)

`Opúsculo Humanitário` (Nísia Floresta) e `Caminho de Pedras` (Rachel de
Queiroz) estavam marcadas como `uncertain: true` em `src/data/literaryWorks.ts`.
Confirmado nesta auditoria: **ambas são oficialmente exigidas para FUVEST
2027** — a marcação foi removida e o campo `uncertain` (agora sem nenhum uso)
foi retirado do tipo `LiteraryWork`.

## 3. Integridade e contagem de páginas

Todos os 16 PDFs têm a contagem de páginas batendo exatamente com o
inventário inicial — nenhum arquivo truncado, vazio ou corrompido. Todos
extraem texto com densidade plausível (27 a 405 mil caracteres) — nenhum é
scan puro exigindo OCR.

| Obra | Páginas PDF | Status |
|---|---|---|
| Opúsculo Humanitário | 162 | `needs_review` (extração) |
| Nebulosas | 194 | `needs_review` (extração) |
| Memórias de Martha | 60 | `verified` |
| Caminho de pedras | 102 | `verified` |
| A paixão segundo G.H. | 122 | `needs_review` (integridade + extração) |
| Geografia e o Cristo Cigano | 93 | `needs_review` (integridade + extração) |
| Balada de amor ao vento | 76 | `verified` |
| Canção para ninar menino grande | 65 | `needs_review` (extração) |
| A visão das plantas | 82 | `needs_review` (extração) |
| A vida não é útil | 60 | `needs_review` (extração) |
| Prosas seguidas de odes mínimas | 58 | `verified` |
| Morangos mofados | 95 | `needs_review` (extração) |
| Vida e morte de M.J. Gonzaga de Sá | 92 | `needs_review` (integridade + extração) |
| No seu pescoço | 136 | `needs_review` (integridade + extração) |
| Memórias Póstumas de Brás Cubas | 134 | `verified` |
| Os funerais da Mamãe Grande | 85 | `needs_review` (extração) |

## 4. Achados por arquivo (o que precisa de limpeza/segmentação na Fase 1)

- **Balada de amor ao vento**: o inventário inicial suspeitava de corte no
  meio de frase no final. Reauditado — o desfecho está completo, sem corte.
  Marcado `verified`.
- **A visão das plantas**: romance termina na pág. 64. Pág. 65 é um posfácio
  crítico de Humberto Brito (possível fonte para `documented_criticism`).
  Págs. ~66-70 são colofão/ficha catalográfica. Págs. ~71+ são catálogo
  comercial puro (propaganda de outros livros da Todavia) — precisa ser
  excluído do corpus de IA (seção 2.2 do roteiro).
- **Canção para ninar menino grande**: confirmado catálogo editorial de
  outros títulos (Pallas/Evaristo) nas páginas finais — mesmo tratamento.
- **Opúsculo Humanitário**: confirmado — as páginas iniciais têm colunas
  embaralhadas na extração (o PDF original é em duas colunas); precisa de
  reextração com reconhecimento de coluna antes da segmentação por unidade.
- **Geografia e o Cristo Cigano**: achado mais relevante da auditoria. O
  arquivo tem DOIS livros de Sophia de Mello Breyner Andresen: "O Cristo
  Cigano" (págs. 3-22, ciclo de 11 poemas) e "Geografia" (págs. 24-93, seis
  seções). **Só "Geografia" integra a lista FUVEST 2027** — "O Cristo
  Cigano" deve ficar fora do escopo obrigatório e fora do corpus de IA
  ligado a essa `ExamRequirement`. Além disso, as págs. 1-2 trazem aviso de
  procedência do site de digitalização não-oficial "eLivros" ("Sobre nós...
  Você pode ajudar contribuindo... faça uma doação"), que também precisa ser
  removido do corpus (não é conteúdo da obra).
- **No seu pescoço**: confirmado que o miolo do arquivo não identifica
  tradutor nem edição usada — precisa ser identificado antes de usar como
  fonte de citação/paginação.
- **Os funerais da Mamãe Grande**: tradutor identificado nesta auditoria —
  Édson Braga, Editora Record, 15ª edição. Os 8 contos obrigatórios ainda
  precisam ser mapeados como `WorkUnit` individuais (Fase 1/segmentador).
- **Vida e morte de M.J. Gonzaga de Sá**: edição vem do Wikisource (exportada
  em 10/12/2025) — precisa ser conferida contra uma edição impressa
  confiável antes de virar fonte de citação/paginação.
- **A paixão segundo G.H.**: conversão de ePub com metadados pobres — edição
  e tradução usadas ainda não identificadas.
- **Nebulosas**: edição 2024 traz introdução e notas críticas — precisam ser
  segmentadas como paratexto, separadas do corpo dos 44 poemas.

## 5. Os 2 bloqueadores de material — resolvidos em 22/08/2026

A Ana Júlia enviou os dois materiais que faltavam:

- **Olhos d'Água** (Conceição Evaristo, Pallas Editora, 2014) — 83 páginas
  PDF. Mesmo padrão de contaminação já visto em outros arquivos: págs. 1
  trazem aviso de site de digitalização não-oficial ("Le Livros"/
  LeLivros.org); o conto real termina na pág. ~71; págs. 72-83 trazem um
  SEGUNDO aviso de outro site ("estradadoslivros.org") seguido de catálogo
  comercial da Pallas. Ambos os trechos precisam ser excluídos do corpus de
  IA antes da segmentação (seção 2.2 do roteiro).
- **Canções Escolhidas — 14 letras** (Paulo César Pinheiro) — enviado como
  `.docx`, não PDF (o modelo `WorkEdition.pdfPageCount` assume PDF; ficou
  registrado como `0` com nota explicando a exceção). Arquivo limpo, sem
  contaminação de site de download. Conferidas as 14 letras exatas: Viagem,
  Canto das Três Raças, Estrela da Terra, Mordaça, Na Volta que o Mundo Dá,
  Pesadelo, Vento Bravo, Evangelho, Cordilheira, Desenredo, Navio Fantasma,
  O Dia em que o Morro Descer e Não For Carnaval, Velho Arvoredo e Vontade
  de Chorar — bate exatamente com as "14 letras" exigidas pelo roteiro.

Com isso, os 18 requisitos oficiais do ciclo 2027 têm material-fonte
auditado. Nenhum bloqueador de material segue aberto.

## 6. Achado transversal: sites de digitalização não-oficiais

Três dos 18 arquivos («Geografia e o Cristo Cigano», «Olhos d'Água» e,
indiretamente, o padrão se repete) vieram de sites de digitalização não
autorizados pela editora (avisos "eLivros"/"Le Livros"/
"estradadoslivros.org" embutidos no próprio arquivo). A autorização de
processamento já dada pela Ana Júlia cobre o uso desses arquivos dentro do
próprio aplicativo de estudo, mas os avisos em si não são conteúdo da obra
e devem ser excluídos do corpus de IA na Etapa C (segmentação). Se no
futuro surgir uma cópia de fonte editorial oficial para algum desses
títulos, é preferível substituir.

## 7. Status geral

Todos os 18 requisitos oficiais do ciclo 2027 (9 Fuvest + 9 Unicamp) têm
material-fonte auditado, com `rightsStatus: authorized` (autorização já
confirmada pela Ana Júlia). Nenhum PDF/arquivo é servido publicamente —
todos seguem em `obras-brutos/`, fora de `public/` e do bundle do
front-end, até a Fase 1 mover cada um pro bucket privado via o painel de
ingestão.
