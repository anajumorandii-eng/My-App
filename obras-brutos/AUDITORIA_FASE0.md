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

## 5. Bloqueadores ainda abertos (não resolvidos nesta auditoria)

1. **Material-fonte ausente**: `Olhos d'Água` (Conceição Evaristo) e
   `Canções escolhidas — 14 letras` (Paulo César Pinheiro) — confirmados
   como parte da lista Unicamp 2027, mas sem PDF/fonte enviada. Registradas
   no catálogo (`SEED_EXAM_REQUIREMENTS`) com `requiredScope` sinalizando a
   pendência. **Preciso que a Ana Júlia envie a fonte autorizada de cada
   uma** (não faz sentido eu baixar uma cópia de procedência desconhecida da
   internet para um material que vai virar conteúdo de estudo citável).
2. **Proveniência do arquivo "Geografia e o Cristo Cigano"**: veio de um
   site de digitalização não-oficial ("eLivros"). A autorização de
   processamento já dada pela Ana Júlia cobre o uso deste arquivo dentro do
   próprio aplicativo de estudo, mas vale registrar que, se surgir uma cópia
   de fonte editorial oficial no futuro, é preferível substituir por ela.

## 6. Status geral

Dos 18 requisitos oficiais do ciclo 2027: 16 têm PDF-fonte auditado (todos
com `rightsStatus: authorized`, conforme autorização já confirmada pela Ana
Júlia); 2 seguem sem material. Nenhum PDF é servido publicamente — todos
seguem em `obras-brutos/`, fora de `public/` e do bundle do front-end, até a
Fase 1 mover cada um pro bucket privado via o painel de ingestão.
